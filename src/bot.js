const { Client, GatewayIntentBits, Collection } = require("discord.js")
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]})
const mysql = require("mysql2");
const fs = require("fs");
const config = require("../config.json");
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9");
const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  database: config.database
})

client.db = connection

client.connectDB = () => {
  client.db = mysql.createConnection({
    host: config.host,
    user: config.user,
    database: config.database
  })
}

client.on("ready", () => {
  loadCommands();
  loadSelectmenus();
  console.log("Botten er klar!")
})

client.on("interactionCreate", (interaction) => {
  if (interaction.isCommand()) {
    client.commands.get(interaction.commandName).execute(interaction, client).catch(console.error)
  } else if (interaction.isStringSelectMenu()) {
    client.selectmenus.get(interaction.customId).execute(interaction, client).catch(console.error)
  }
})

client.login(config.token)

client.commands = new Collection();
client.selectmenus = new Collection();
client.commandArray = [];


const loadCommands = async () => {
  const commandFiles = fs.readdirSync(`./src/commands`);
  
  commandFiles.forEach((file) => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    client.commandArray.push(command.data.toJSON());
    console.log(`${command.data.name} blev indlæst`);
  })
  
  const clientId = config.clientId;
  const guildId = config.guildId;
  const rest = new REST({ version: "10" }).setToken(config.token);
  console.log(`Opdaterer kommandoer...`);
  await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
    body: client.commandArray,
  }).catch(console.error);
  console.log(`Genindlæste kommandoer!`);
}

const loadSelectmenus = async () => {
  const selectmenuFiles = fs.readdirSync(`./src/selectmenus`);
  
  selectmenuFiles.forEach((file) => {
    const selectmenu = require(`./selectmenus/${file}`);
    client.selectmenus.set(selectmenu.name, selectmenu);
  })
}