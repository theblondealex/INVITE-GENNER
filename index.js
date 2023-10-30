const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
client.commands.set("invite-generator", require("./invite-generator.js"));

const rest = new REST({ version: "10" }).setToken(process.env.BOTTOKEN);

const commands = [];
const command = require("./invite-generator.js");
commands.push(command.data.toJSON());

const deploycommands = async () => {
  try {
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENTID),
      {
        body: commands,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

deploycommands();

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = interaction.client.commands.get(interaction.commandName);
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.BOTTOKEN);
client.once("ready", () => {
  console.log("Ready!");
});
