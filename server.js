var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());

var request = require("request");

var config = require("./config");

const discordPost = (message) => {
  let newMessage = {
    username: config.username,
    content: "New push to " + message.repo + " by " + message.username + ".",
    embeds: [
      {
        title: "Hello!",
        description: "Hi! :grinning:",
        url: "https://google.com",
      },
    ],
  };

  request(
    {
      url: config.discordEndpoint,
      method: "POST",
      json: true,
      body: newMessage,
    },
    function (error, response, body) {
      console.log(body);
    }
  );
};

const post = (message) => {
  console.log("Posting message...");
  if (config.discordEndpoint) {
    discordPost(message);
  }
};

app.post("/", function (req, res) {
  console.log("Bitbucket webhook recieved!");
  res.json({ message: "Message recieved by Bitbot." });
  let message = {
    username: req.body.actor.username,
    display_name: req.body.actor.display_name,
    repo: req.body.repository.name,
    hash: req.body.push.changes[0].commits[0].hash,
    commit: req.body.push.changes[0].commits[0].message,
    link: req.body.push.changes[0].links.html.href,
  };
  console.log(message);
  post(message);
});

app.get("/", function(req, resp)  {
  resp.json({message: config})
});

app.listen(config.port, function () {
  console.log(config.name + " running on port " + config.port + ".");
  if (config.discordEndpoint) {
    console.log("Running in Discord mode.");
  } else {
    console.log("Endpoints not configured.");
  }
});
