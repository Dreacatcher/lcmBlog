var mongodb = require("../database/db");
function User(user){
	this.name =user.name;
	this.password =user.password;
	this.email =user.email;
}

module.exports =User;
User.prototype.save=function(callback){
	//存储用户信息
	var user={
		name:this.name,
		password:this.password,
		email:this.email
	}
	//打开数据库
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		//读取registeruser集合
		db.collection('registeruser',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			
			//用户信息插入registeruser集合
			collection.insert(user,{safe:true},function(err,user){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,user[0]);
			});
		});
	});
}
//读取用户信息
User.get=function(name,callback){
	//打开数据库
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('registeruser',function(err,collection){
			if(err){
				callback(err);
			}
			//查找用户名
			collection.findOne({
				name:name
			},function(err,user){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,user);
			});
		});
	});
};

