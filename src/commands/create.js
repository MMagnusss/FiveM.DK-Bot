const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
  .setName("create")
  .setDescription("Opret en ny opgave")
  .addStringOption((opt) => opt.setName("titel").setDescription("Opgave titel").setRequired(true))
  .addStringOption((opt) => opt.setName("beskrivelse").setDescription("Opgave beskrivelse").setRequired(true))
  .addStringOption((opt) => opt.setName("forfaldsdato").setDescription("Opgave forfaldsdato (ÅÅÅÅ-MM-DD)").setRequired(true)),
  async execute(interaction, client) {
    if (!client.db) return (
      interaction.reply({ content: "Botten var ikke forbundet til databasen...\nPrøv igen", ephemeral: true }),
      client.connectDB()
    )
    await interaction.deferReply({ ephemeral: true }).catch(console.err)
    const titel = interaction.options.getString("titel")
    const beskrivelse = interaction.options.getString("beskrivelse")
    const forfaldsdato = interaction.options.getString("forfaldsdato")
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(forfaldsdato)) return interaction.editReply({ content: "Ugyldig dato format. (ÅÅÅÅ-MM-DD)", ephemeral: true }).catch(console.error);
    let opgaveid = 0
    client.db.query("INSERT INTO opgaver SET userid = ?, titel = ?, beskrivelse = ?, forfaldsdato = ?", [
      interaction.user.id,
      titel,
      beskrivelse,
      forfaldsdato,
    ], (err, res, fields) => {
      opgaveid = res.insertId
      const embed = new EmbedBuilder()
        .setTitle("Oprettede en ny opgave!")
        .setFields([
          { name: "Titel", value: titel.toString() },
          { name: "Beskrivelse", value: beskrivelse.toString() },
          { name: "Forfaldsdato", value: forfaldsdato.toString() },
          { name: "Opgave id", value: opgaveid.toString() },
          { name: "Tid oprettet", value: `<t:${Math.floor(new Date().getTime() / 1000)}:f>` }
        ])
        .setColor("#226b2a")
      interaction.editReply({
        embeds: [embed],
        ephemeral: true
      }).catch(console.error)
    })
  }
}