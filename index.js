const fs = require("fs");
const path = require("path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const rest = new REST({ version: "10" }).setToken(process.env.BOTTOKEN);

// Define the commands collection
const commands = new Collection();

async function deploycommands() {
  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const { default: command } = await import(`file://${filePath}`);
    commands.set(command.data.name, command); // Set the command in the collection
  }

  rest
    .put(Routes.applicationCommands(process.env.CLIENTID), {
      body: commands.map((command) => command.data.toJSON()),
    })
    .then(() => console.log(`Successfully registered Global commands.`));
}

deploycommands();

// Assign the commands collection to the client
client.commands = commands;

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
