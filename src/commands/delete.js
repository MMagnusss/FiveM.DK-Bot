const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
  .setName("delete")
  .setDescription("Slet en opgave")
  .addStringOption((opt) => opt.setName("id").setDescription("Opgave id").setRequired(true)),
  async execute(interaction, client) {
    if (!client.db) return (
      interaction.reply({ content: "Botten var ikke forbundet til databasen...\nPrøv igen", ephemeral: true }),
      client.connectDB()
    )
    await interaction.deferReply({ ephemeral: true }).catch(console.error)
    const opgaveid = interaction.options.getString("id")
    client.db.query("DELETE FROM opgaver WHERE userid = ? AND opgaveid = ?", [interaction.user.id, opgaveid], (_, res, __) => {
      if (!res.affectedRows) return interaction.editReply({ content: `Du har ikke nogle opgaver med id'et: ${opgaveid}`}).catch(console.error);
      const embed = new EmbedBuilder()
        .setTitle("Slettede opgave")
        .setDescription(`Slettede opgaven med id'et: ${opgaveid}`)
        .setColor("#226b2a")
      interaction.editReply({ embeds: [embed], ephemeral: true }).catch(console.error)
    })
  }
}