# INVITE GENERATOR

# Discord Invite Code Generator Bot

This is a simple Discord bot that generates invite codes for your server. This bot is built using Node.js and the Discord.js library. Ensure you have Nodejs installed on your machine, this repo is free to use and clone however advised against implmenting as part of your bot as it will not get verification.

## Installations

1. Clone this repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install all the required dependencies.

## Configuration

1. Create a new Discord bot application and invite it to your server. You can follow the instructions [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot).
2. Rename the `.env.example` file to `.env`.
3. Open the `.env` file and replace the `DISCORD_BOT_TOKEN` value with your bot's token. You can find your bot's token on the Discord developer portal.
4. Save the `.env` file.

## Usage

1. Run the bot using the command `npm run dev`. This will start the bot using nodemon, which will automatically restart the bot whenever you make changes to the code.
2. In your Discord server, type `/invite` and fill out the fields to generate new invite codes. The bot will respond with a list of invite codes that you can use to invite people to your server.
