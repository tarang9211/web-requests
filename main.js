const http = require("http");
const port = 3000;
const host = "localhost";
var settings = require("./config.js");
console.log("Starting application...");
var OAuth = require('OAuth');
var oauth = new OAuth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  settings.twitter.apikey,
  settings.twitter.apisecret,
  '1.0A',
  null,
  'HMAC-SHA1'
);

oauth.get(
  'https://api.twitter.com/1.1/search/tweets.json?q=from%3APOTUS&result_type=recent&count=1',
//  'https://api.twitter.com/1.1/trends/place.json?id=23424977',
  settings.twitter.accesstoken,
  settings.twitter.accesssecret,
  function (error, data, response){
    if (error) console.error(error);
    data = JSON.parse(data);
    console.log(JSON.stringify(data["statuses"], 0, 2));
});


const server = http.createServer((response, request) => {

});

server.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
})
