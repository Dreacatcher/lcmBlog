var express =require("express");
var router =express.Router();
var conmon= require('../controller/conmon');
var Post= require('../controller/post');

/*get post page*/
/*router.get('/post',conmon.checkLogin);*/
router.get('/post',function(req,res){
	res.render('post',{
		title:'发表',
		user:req.session.user,
		success:req.flash('success').toString(),
		error:req.flash('error').toString()
	})
});
/*router.post('/post',conmon.checkLogin);*/
router.post('/post',function(req,res){
	var currentUser = req.session.user,
		post=new Post(currentUser.name,req.body.title,req.body.post);
		post.save(function(err){
			if(err){
				req.flash('error',err);
				return res.redirect("/");
			}
		});
		req.flash('success','发表成功');
		res.redirect('/');

});

module.exports = router;


