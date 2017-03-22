var express = require('express');
var router = express.Router();
var multer  = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../public/images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
var upload = multer({ dest: './public/images/' })

/*router.get('/upload',conmon.checkLogin);*/
router.get('/upload',function(req,res){
	res.render('upload',{
		title:'文件上传',
		user:req.session.user,
		success:req.flash('success').toString(),
		error:req.flash('error').toString()
	})
});
/*router.post('/post',conmon.checkLogin);*/

router.post('/upload',upload.array(),function(req,res){
		
		req.flash('success','长传成功');
		res.redirect('/upload');
});
module.exports = router;