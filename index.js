var http = require('http');
var url = require('url');
var globalConfig = require('./conf');
var fs = require('fs');
var loader = require('./loader');

http.createServer(function (request, response) {
    var pathName = url.parse(request.url).pathname;
    var params = url.parse(request.url, true).query;

    var isStatic = isStaticsRequest(pathName);
    if(isStatic){ // 请求的静态数据
        try{
            var data = fs.readFileSync(globalConfig.basePath + pathName);
            response.writeHead(200);
            response.write(data);
            response.end();
        }catch(e){
            response.writeHead(404);
            response.write('<html><body><h1>404 NotFound</h1></body></html>');
            response.end();
        }
    }else{ // 请求的动态数据
        console.log('动态数据');
        if(loader.get(pathName) != null){
            try{
                loader.get(pathName)(request, response);
            }catch{
                response.writeHead(500);
                response.write('<html><body><h1>500 BadServer</h1></body></html>');
                response.end();
            }
        }else{
            response.writeHead(404);
            response.write('<html><body><h1>404 NotFound</h1></body></html>');
            response.end();
        }
    }
}).listen(globalConfig.port);

function isStaticsRequest (pathname) {
    var len = globalConfig.static_file_type.length;
    for(var i = 0; i < len; i++){
        var temp = globalConfig.static_file_type[i];
        if(pathname.indexOf(temp) == pathname.length - temp.length){
            return true;
        }
    }
    return false;
}