const { SlashCommandBuilder, EmbedBuilder, ActionRow, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
  .setName("view")
  .setDescription("Viser en liste med alle opgaver")
  .addStringOption((opt) => opt.setName("opgaveid").setDescription("Se detaljer om en opgave")),
  async execute(interaction, client) {
    if (!client.db) return (
      interaction.reply({ content: "Botten var ikke forbundet til databasen...\nPrøv igen", ephemeral: true }),
      client.connectDB()
    )
    await interaction.deferReply({ ephemeral: true }).catch(console.error);
    const opgaveid = interaction.options.getString("opgaveid")
    if (opgaveid) {
      client.db.query("SELECT * FROM opgaver WHERE userid = ? AND opgaveid = ?", [interaction.user.id, opgaveid], (err, res, fields) => {
        if (!res[0]) return interaction.editReply({ content: `Du har ikke nogen opgave med id'et: ${opgaveid}`, ephemeral: true }).catch(console.error);
        const embed = new EmbedBuilder()
          .setTitle(`Opgave ${opgaveid}`)
          .setColor("#226b2a")
          .addFields([
            { name: "Titel", value: res[0].titel.toString() },
            { name: "Beskrivelse", value: res[0].beskrivelse.toString() },
            { name: "Forfaldsdato", value: res[0].forfaldsdato.toString() },
            { name: "Opgave id", value: res[0].opgaveid.toString() },
            { name: "Fuldført", value: res[0].fuldført ? res[0].fuldført : "Nej" },
            { name: "Tid oprettet", value: `<t:${Math.floor(res[0].date.getTime() / 1000)}:f>` }
          ])
        interaction.editReply({ embeds: [embed], ephemeral: true }).catch(console.error);
      })
    } else {
      const embed = new EmbedBuilder()
        .setTitle("Dine opgaver")
        .setDescription("Her er en liste over dine opgaver\nSe flere detaljer om en opgave med **/view [id]**\n")
        .setColor("#226b2a")
      client.db.query("SELECT * FROM opgaver WHERE userid = ?", [interaction.user.id], (err, res, fields) => {
        res.forEach((opgave) => {
          embed.data.description += `\n\n**Titel: **${opgave.titel}\n**Opgave id: **${opgave.opgaveid}\n**Tid oprettet: **<t:${Math.floor(opgave?.date?.getTime() / 1000)}:f>`
        })
        interaction.editReply({ embeds: [embed], components: [CreateSelectMenu()], ephemeral: true }).catch(console.error);
      })
    } 
  }
}

const CreateSelectMenu = () => {
  const ActionRow = new ActionRowBuilder()
  const SelectMenu = new StringSelectMenuBuilder()
  .setCustomId("view")
  .setPlaceholder("Klik her for at sortere")
  .setMaxValues(1)
  .setMinValues(1)
  .setOptions([
    {
      label: "Sortér efter nyeste",
      emoji: "⬆️",
      value: "new",
    },
    {
      label: "Sortér efter ældste",
      emoji: "⬇️",
      value: "old",
    },
  ])
  ActionRow.addComponents(SelectMenu)
  return ActionRow
}