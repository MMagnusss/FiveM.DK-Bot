const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
  .setName("update")
  .setDescription("Opdater en opgave")
  .addStringOption((opt) => opt.setName("id").setDescription("Opgave id").setRequired(true))
  .addStringOption((opt) => opt.setName("egenskab").setDescription("(titel, beskrivelse, forfaldsdato, fuldført)").setRequired(true))
  .addStringOption((opt) => opt.setName("ny_værdi").setDescription("Nye værdi").setRequired(true)),
  async execute(interaction, client) {
    if (!client.db) return (
      interaction.reply({ content: "Botten var ikke forbundet til databasen...\nPrøv igen", ephemeral: true }),
      client.connectDB()
    )
    await interaction.deferReply({ ephemeral: true}).catch(console.error)
    const id = interaction.options.getString("id")
    const egenskab = interaction.options.getString("egenskab")
    const ny_værdi = interaction.options.getString("ny_værdi")
    if(!["titel", "beskrivelse", "forfaldsdato", "fuldført"].includes(egenskab.toLowerCase())) return interaction.editReply({ content: `${egenskab} er ikke et gyldigt egenskab!`, ephemeral: true }).catch(console.error);
    client.db.query(`UPDATE opgaver SET ${egenskab} = ? WHERE opgaveid = ? AND userid = ?`, [ny_værdi, id, interaction.user.id], (_, res, __) => {
      if (!res.affectedRows) return interaction.editReply({ content: `Du har ikke nogle opgaver med id'et: ${id}`, ephemeral: true }).catch(console.error);
      const embed = new EmbedBuilder()
        .setTitle("Opdateret opgave")
        .setDescription(`Ændrede ${egenskab} til ${ny_værdi}`)
        .setColor("#226b2a")
      interaction.editReply({
        embeds: [embed],
        ephemeral: true
      }).catch(console.error)
    })
  }
}