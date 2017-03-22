var express =require("express");
var router =express.Router();
var conmon= require('../controller/conmon');

/*get login page*/
/*router.get('/logout',conmon.checkLogin);*/
router.get('/logout',function(req,res){
	req.session.user=null;
	req.flash("success","登出成功");
	res.redirect("/");
});


module.exports = router;


