var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var request = require("request");
var config = require("./config");

app.use(bodyParser.json());

const discordPost = (message) => {
  let newMessage = {
    username: config.username,
    avatar_url: config.avatar,
    embeds: [
      {
        author: {
          name: message.display_name,
          icon_url: message.avatar,
        },
        title: message.action_name,
        url: message.link,
        description: message.description,
        color: 15258703,
        fields: [
          {
            name: "Status",
            value: message.state,
          },
          {
            name: "Environment",
            value: message.environment,
          },
          {
            name: "Repository",
            value: message.repository,
          },
        ],
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
    
    }
  );
};

app.post("/", function (req, res) {
  res.json({ message: "Thank you!" });
  const body = req.body;
  let message = {
    avatar: body.commit_status.commit.author.user.links.avatar.href,
    display_name: body.commit_status.commit.author.user.display_name,
    repository: body.repository.name,
    link: body.commit_status.url,
    action_name: body.commit_status.name,
    state: body.commit_status.state,
    description: body.commit_status.commit.message,
    environment: body.commit_status.refname,
  };
  discordPost(message);
});

app.listen(config.port, function () {
  console.log(config.name + " running on port " + config.port + ".");
});
