require("dotenv").config();

module.exports = {
    'username' : 'G&TController - BitBucket',
    'port' : process.env.PORT,
    'discordEndpoint' : process.env.DISCORD_WEBHOOK,
    'avatar': process.env.IMAGE
};
