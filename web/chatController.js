var req = require('request');
var url = require('url');

var path = new Map();

function chat (request, response) {
    // 接收到前端页面发给后端的请求
    var params = url.parse(request.url, true).query;
    // 将这个请求内容转发给图灵机器人
    var data = {
        "reqType": 0,
        "perception": {
            "inputText": {
                "text": params.text
            }
        },
        "userInfo": {
            "apiKey": "c1b95bab41ce40e1820c70af2c270de3",
            "userId": "123456"
        }
    };
    // 发送请求
    req({
        url: "http://openapi.tuling123.com/openapi/api/v2",
        method: 'POST',
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data)
    }, function (error, resp, body) {
        if(!error){
            var obj = JSON.parse(body);
            if(obj && obj.results && obj.results.length > 0 && obj.results[0].values){
                var head = {
                    // 下面三个跨域设置
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Method": "GET",
                    "Access-Control-Allow-Headers": "x-requested-with, content-type",
                    
                    // 相应数据类型, 不设置浏览器接收到的是一串乱码, 但页面还是可以识别出汉字(因为js会默认使用utf-8解析内容)
                    "Content-type": "text/plain; charset=UTF-8"
                };
                response.writeHead(200, head);
                response.end(JSON.stringify(obj.results[0].values));
            }
        }
    });

}
path.set('/chat', chat);

module.exports.path = path;