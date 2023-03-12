const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
  .setName("help")
  .setDescription("Viser alle kommandoer"),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle("Kommandoer")
      .addFields(client.commands.map(command => ({ name: "/"+command.data.name, value: command.data.description })))
      .setColor("#226b2a")
    interaction.reply({ embeds: [embed], ephemeral: true }).catch(console.error);
  }
}