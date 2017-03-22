var express =require("express");
var router =express.Router();
var User= require('../controller/register');
var conmon= require('../controller/conmon');
var crypto = require("crypto");
/*get login page*/
router.get('/login',conmon.checkNotLogin);
router.get('/login',function(req,res,next){
	res.render('login',{ title: 'login' });
});
router.post('/login',conmon.checkNotLogin);
router.post('/login', function(req, res) {
		//创建一个对象
	var newUser=new User({
		name:req.body.name
	});
	//生成MD5加密
	var md5=crypto.createHash('md5');
	var password=md5.update(req.body.password).digest('hex');

   
    User.get(newUser.name,function(err,user){
	  	if(!user){
	  		req.flash('error','!用户不存在');
	  		return res.redirect('/login');
	  	}
	  	if(user.password!=password){
	  		req.flash('error','密码错误');
	  		return res.redirect('/login');
	  	}
	  	req.session.user=user;
	  	req.flash('success','登录成功');
	  	return res.redirect('/');
  	});
});
module.exports = router;


