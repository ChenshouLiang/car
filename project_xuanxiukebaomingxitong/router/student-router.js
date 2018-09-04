var Student = require("../models/Student.js");
var Course = require("../models/Course.js");
var tool = require("../models/tool.js");
var url = require("url");

exports.getstudentcourses = function(req,res){
    //学号
    var xuehao = req.params.xuehao;

    //命令模块给我结果
    Student.getcoursesbysid(xuehao,function(arr){
        res.json({"result" : arr});
    });
}


//报名
exports.baoming = function(req,res){
    var querystringobj = url.parse(req.url,true).query;
    var cid = querystringobj.cid;
    var sid = querystringobj.sid;


    tool.baoming(sid,cid,function(resultnumber){
        res.send(resultnumber);
    });
}

exports.changepw = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        Student.changepw(parseInt(fields.sid), fields.pw,function(info){
            //将回调函数显示的信息，原封不动呈递给Ajax接口，会被jQuery alert出来。
            res.end(info);
        });
    });
}


//退报
exports.tuiding = function(req,res){
    var querystringobj = url.parse(req.url,true).query;
    var cid = querystringobj.cid;
    var sid = querystringobj.sid;

    tool.tuiding(sid,cid,function(){
        res.send("ok");
    });
}


//显示某一个课程
exports.showcourse = function(req,res){
    //拿到参数
    var cid = req.params.cid;
    Course.find({"cid":cid},function(err,results){
        if(results.length == 0){
            res.send("没有这个课程");
            return;
        }
        //课程
        var thecourse = results[0];

        //如果这个课程没有人报名：
        if(thecourse.students.length == 0){
            res.render("course",{
                "coursename" : results[0].name,
                "xingming" : req.session.xingming,
                "xuehao" : req.session.xuehao,
                "xuesheng" : []
            });

            return;
        }

        //遍历这个课程的报名学员students数组，再次寻找数据库得到他们的名字
        var students = [];

        for(var i = 0 ; i < thecourse.students.length ; i++){
            Student.find({"sid" : thecourse.students[i]},function(err,results2){
                students.push(results2[0]);
                if(students.length == thecourse.students.length){
                    console.log(students.length)
                    //都寻找完毕了
                    res.render("course",{
                        "coursename" : results[0].name,
                        "xingming" : req.session.xingming,
                        "xuehao" : req.session.xuehao,
                        "xuesheng" : students
                    });
                }
            });
        };
    })
}

exports.showXuanke=function(req,res){
    //学号
    var xuehao = req.params.sid;
    //命令模块给我结果
    var ke=[]
    Student.getcoursesbysid(xuehao,function(arr){
        for(var i = 0 ; i < arr.length ; i++){
            Course.find({"cid":arr[i]},function (err,data) {
                ke.push(data[0].name)
                if(ke.length==arr.length){
                    res.render("yibao",{
                        "ke":ke,
                        "xingming" : req.session.xingming,
                        "xuehao" : req.session.xuehao
                    });
                }
            })
        }
    });
};