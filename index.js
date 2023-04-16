var http = require('http');
var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({});

var server = http.createServer(function (req, res) {
    var url = req.headers['proxy-target-url'];
    var auth = req.headers['proxy-target-auth'];

    if (auth !== process.env.PROXY_AUTH) {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.end('Unauthorized');
        return;
    }

    delete req.headers['proxy-url'];
    delete req.headers['proxy-auth'];

    console.log("Proxying request URL: " + url);
    proxy.web(req, res, { 
        target: url, 
        prependPath: true, 
        ignorePath: true, 
        xfwd: false, 
        secure: false, 
        changeOrigin: true, 
        autoRewrite: true, 
        hostRewrite: true, 
        protocolRewrite: true, 
        followRedirects: true 
    });
});

var port = process.env.PORT || 5050;
console.log("Starting listening on port " + port)
server.listen(port);
