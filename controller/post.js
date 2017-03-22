var mongodb = require("../database/db");
var markdown=require('markdown').markdown;
function Post(name,title,post) {
	this.name=name;
	this.title=title;
	this.post=post;
}
module.exports=Post;

//存储文章及相关信息
Post.prototype.save = function(callback) {
	var d=new Date();
	var time={
		dates:d,
		year:d.getFullYear(),
		month:d.getFullYear()+"-"+(d.getMonth()+1),
		day:d.getFullYear()+"-"+(d.getMonth()+1)+"-"+(d.getDate()),
		minute:d.getFullYear()+"-"+(d.getMonth()+1)+"-"+(d.getDate())+'-'+d.getHours()+":"+(d.getMinutes()<10?'0'+d.getMinutes():d.getMinutes())
	}


	//要存入数据库的文档
	var post={
		name:this.name,
		time:time,
		title:this.title,
		post:this.post
	};

	//打开数据库
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}

		//读取post集合
		db.collection('posts',function(req,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			//将文档插入posts集合
			collection.insert(post,{
				safe:true
			},function(err){
				mongodb.close();
				if(err){
					return callback(err);//失败！返回err
				}
				callback(null);//返回err为null
			});
		});
	});
};



//读取文章
Post.get=function(name,callback){
	//打开数据库
	mongodb.open(function(err,db){
		if(err){
			return callback(err);//
		}
		//读取posts集合
		db.collection('posts',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query={};
			if(name){
				query.name=name;
			}

			//根据query查询文章
			collection.find(query).sort({
				time:-1
			}).toArray(function(err,docs) {
				mongodb.close();
				if(err){
					return callback(err);//查询失败，返回错误
				}
				docs.forEach(function(doc){
					doc.post=markdown.toHTML(doc.post);
				});
				callback(null,docs);//成功返回查询的文章
			});

		});
	});
}