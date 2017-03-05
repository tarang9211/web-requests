const http = require("http");
const port = 3000;
const host = "localhost";
const settings = require("./config.js");
const OAuth = require('OAuth');
const oauth = new OAuth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  settings.twitter.apikey,
  settings.twitter.apisecret,
  '1.0A',
  null,
  'HMAC-SHA1'
);

let tweetData = '';
oauth.get(
  'https://api.twitter.com/1.1/search/tweets.json?q=from%3APOTUS&result_type=recent&count=1',
//  'https://api.twitter.com/1.1/trends/place.json?id=23424977',
  settings.twitter.accesstoken,
  settings.twitter.accesssecret,
  function (error, data, response){
    if (error) console.error(error);
    tweetData = JSON.parse(data);
});


const server = http.createServer((request, response) => {
  response.writeHead(200, {"Content-Type": "application/json"});
  response.write(JSON.stringify(tweetData["statuses"]));
  response.end();
});

server.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
})
