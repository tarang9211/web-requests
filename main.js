const http = require("http");
var _ = require("underscore");
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

// function to make request to twitter api using oauth
let tweetData = "";
if (settings.twitter.testData) {
  tweetData = settings.twitter.testData;
}

function makeRequest(cb) {
  oauth.get(
    'https://api.twitter.com/1.1/search/tweets.json?q=from%3APOTUS%20OR%20from%3ArealDonaldTrump&result_type=recent&count=10',
    settings.twitter.accesstoken,
    settings.twitter.accesssecret,
    function (error, data, response){
      if (error) {
        // reset tweetData
        tweetData = "";
      }
      else
      {
        var rawData = JSON.parse(data);
        if (rawData["statuses"])
        {
          tweetData = _.map(rawData["statuses"],function(tweet) {
            return { text: tweet.text,created_at: tweet.created_at };
          });
        }
      }
      if (cb) cb(error);        
  });
}

// request new tweet results every 15 minutes
setInterval(makeRequest,settings.twitter.requestInterval);


const server = http.createServer((request, response) => {
  if (tweetData == "") {
    makeRequest(function(error) {
      if (error) {
        // error occurred
        response.writeHead(404, {"Content-Type": "application/json"});
        response.write(JSON.stringify(settings.twitter.errorMsg));
      }
      response.writeHead(200, {"Content-Type": "application/json"});
      response.write(JSON.stringify(tweetData));
      response.end();      
    });
  } else {
      response.writeHead(200, {"Content-Type": "application/json"});
      response.write(JSON.stringify(tweetData));
      response.end();      
  }
});

server.listen(settings.http.port, settings.http.host, () => {
  console.log("Server running on http://" + settings.http.host + ":" + settings.http.port);
})

