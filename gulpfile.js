/*
 * @Description: 文件上传脚本
 * @Autor: chenming.feng
 * @Date: 2019-01-21 09:56:24
 * @LastEditors  : chenming.feng
 * @LastEditTime : 2020-01-13 14:26:50
 */

/* eslint-disable */
var gulp = require("gulp");
var sftp = require("gulp-sftp");

var remoteProdInfo = {
  host: "192.168.1.47",
  user: "ubuntu",
  pass: "123",
  port: 22,
  remotePath: "/home/ubuntu/backup/tdservice" // 业务系统测试环境
};

gulp
  .task("uploadDevDist", function() {
    return gulp.src("dist/**").pipe(
      sftp({
        timeout: 30000,
        host: remoteProdInfo.host,
        port: remoteProdInfo.port,
        user: remoteProdInfo.user,
        pass: remoteProdInfo.pass,
        remotePath: remoteProdInfo.remotePath
      })
    );
  })
  .on("task_stop", function(e) {
    if (e.task === "uploadDev") {
      const http = require("http");
      let options = {
        hostname: "111.231.109.124",
        port: 7001,
        path: "/eGR2bTc4SyVXQ3N2ME1NUkJDWSY=",
        method: "GET"
      };
      let req = http.request(options, function(res) {
        res.setEncoding("utf8");
      });
      req.on("error", function(err) {
        console.error("error", err);
      });
      req.end();
    }
  });

gulp.task("default", function() {
  console.log("部署到测试环境 - run 'gulp uploadDev'");
});

gulp.task("uploadDev", ["uploadDevDist"]);
