var fs = require('fs');
var globalConfig = {};

var conf = fs.readFileSync(__dirname + '/server.conf');
var confs = conf.toString().split('\r\n');
for(var i = 0; i < confs.length; i++){
    var tempConf = confs[i].split('=');
    globalConfig[tempConf[0]] = tempConf[1];
}

globalConfig.basePath = __dirname + globalConfig.page_path;
globalConfig.web_path = __dirname + globalConfig.web_path;
globalConfig.log_path = __dirname + globalConfig.log_path;
globalConfig.filter_path = __dirname + globalConfig.filter_path;

if(globalConfig.static_file_type){
    globalConfig.static_file_type = globalConfig.static_file_type.split('|');
}else{
    throw new Error('配置文件出错: 缺少static_file_type');
}
module.exports = globalConfig;