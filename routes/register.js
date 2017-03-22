var express =require("express");
var router =express.Router();
var crypto = require("crypto");
var User= require('../controller/register');
var conmon= require('../controller/conmon');
var flash = require("connect-flash");


/*get login page*/
router.get('/register',conmon.checkNotLogin);
router.get('/register',function(req,res,next){
	res.render('register',{ 
		title: '欢迎注册',
		user:req.session.user,
  		success:req.flash('success').toString(),
  		error:req.flash('error').toString() 
	});
});
router.post('/register',conmon.checkNotLogin);
router.post('/register',function(req,res){
	var name=req.body.name,
	 	password=req.body.password,
	 	confirmPassword=req.body.confirmPassword,
	 	email=req.body.email;
	//检验两次密码输入是否一致
	if(password!=confirmPassword){
		req.flash("error","两次密码输入不一致！")
		return res.redirect("/register");
	}

	//生成MD5加密
	var md5=crypto.createHash('md5');
	var password=md5.update(req.body.password).digest('hex');
	//创建一个对象
	var newUser=new User({
		name:req.body.name,
		password:password,
		email:req.body.email
	});
	//检查用户是否存在
	User.get(newUser.name,function(err,user){
		//用户已存在
		if(err){
			req.flash("error",err);
			return res.redirect("/");
		}
		if(user){//用户存在
			req.flash("error",'用户已经存在');
			return res.redirect("/register");
		}
		//用户不存在
		newUser.save(function(err,user){
			req.session.user=user;
			req.flash('success',"注册成功");
			res.redirect("/");
			if(err){
				req.flash("error",err);
				return res.redirect("/");
			}
		});
	});
});

module.exports = router;