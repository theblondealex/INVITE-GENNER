const fs = require("node:fs");
const path = require("node:path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");
require("dotenv").config();

module.exports = async function deploycommands() {
  const commands = [];
  const testcommands = [];
  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
  }

  // const testcommandsPath = path.join(__dirname, "commands/testcommands");
  // const testcommandFiles = fs
  //   .readdirSync(testcommandsPath)
  //   .filter((file) => file.endsWith(".js"));

  // for (const file of testcommandFiles) {
  //   const twitfilePath = path.join(testcommandsPath, file);
  //   const testcommand = require(twitfilePath);
  //   testcommands.push(testcommand.data.toJSON());
  // }

  const rest = new REST({ version: "10" }).setToken(process.env.BOTTOKEN);

  const guilds = [process.env.GUILDIDCONNES, process.env.GUILDTESTID];
  // guilds.forEach((guildID) => {
  //   rest
  //     .put(Routes.applicationGuildCommands(process.env.CLIENTID, guildID), {
  //       body: testcommands,
  //     })
  //     .then(() =>
  //       console.log(
  //         `Successfully registered application commands. for ${guildID}`
  //       )
  //     )
  //     .catch(console.error);
  // });
  rest
    .put(Routes.applicationCommands(process.env.CLIENTID), {
      body: commands,
    })
    .then(() => console.log(`Successfully registered Global commands.`));
};
