var express = require('express'),
    fs = require("fs"),
    https = require("https"),
    request = require('request'),
    bodyParser = require('body-parser'),
    app = express();


const options = {
  key: fs.readFileSync("/home/realnets/star.realnets.net_ssl/star.realnets.net.key"),
  cert : fs.readFileSync("/home/realnets/star.realnets.net_ssl/star.realnets.net.crt")
}

var myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
console.log('Using limit: ', myLimit);

app.use(bodyParser.json({limit: myLimit}));

app.all("/webhook",(req,res,next)=>{
  console.log(req.body.booking,req.body.booking["@attributes"],req.body.booking.customer);
  res.send(200);
})

app.all('*', function (req, res, next) {

    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
        var targetURL = req.header('Target-URL');
        if (!targetURL) {
            res.send(500, { error: 'There is no Target-Endpoint header in the request' });
            return;
        }
        if (req.header("Authorization")){
          request({ url: targetURL, method: req.method, json: req.body, headers: {'Authorization': req.header('Authorization')} },
              function (error, response, body) {
                  if (error) {
                      console.error('error: ' + response.statusCode)
                  }
              }).pipe(res);
        }else {
          request({ url: targetURL, method: req.method, json: req.body},
              function (error, response, body) {
                  if (error) {
                      console.error('error: ' + response.statusCode)
                  }
              }).pipe(res);
        }

    }
});

app.set('port', process.env.PORT || 80);

// app.listen(app.get('port'), function () {
//     console.log('Proxy server listening on port ' + app.get('port'));
// });

https.createServer(options,app).listen(443,()=>{
  console.log("listening on port 443");
})
