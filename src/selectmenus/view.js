module.exports = {
  name: "view",
  async execute(interaction, client) {
    interaction.message.components[0].components[0].options[0].default = false
    interaction.message.components[0].components[0].options[1].default = false
    interaction.message.embeds[0].data.description = ""
    if (interaction.values[0] === "new") {
      client.db.query("SELECT * FROM opgaver WHERE userid = ?", [interaction.user.id], (err, res, fields) => {
        res.sort((a, b) => b.date - a.date).forEach((opgave) => {
          interaction.message.embeds[0].data.description += `\n\n**Titel: **${opgave.titel}\n**Opgave id: **${opgave.opgaveid}\n**Tid oprettet: **<t:${Math.floor(opgave?.date?.getTime() / 1000)}:f>`
        })
        interaction.message.components[0].components[0].options[0].default = true
        interaction.update({
          embeds: interaction.message.embeds,
          components: interaction.message.components,
          ephemeral: true
        }).catch(console.error)
      })
    } else if (interaction.values[0] === "old") {
      client.db.query("SELECT * FROM opgaver WHERE userid = ?", [interaction.user.id], (err, res, fields) => {
        res.sort((a, b) => a.date - b.date).forEach((opgave) => {
          interaction.message.embeds[0].data.description += `\n\n**Titel: **${opgave.titel}\n**Opgave id: **${opgave.opgaveid}\n**Tid oprettet: **<t:${Math.floor(opgave?.date?.getTime() / 1000)}:f>`
        })
        interaction.message.components[0].components[0].options[1].default = true
        interaction.update({
          embeds: interaction.message.embeds,
          components: interaction.message.components,
          ephemeral: true
        }).catch(console.error)
      })
    }
  }
}