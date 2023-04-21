const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("Gives You Random Number From 1 to 6."),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();
        
        const Nums = [ "1", "2", "3", "4", "5", "6"];
        const ball = Math.floor(Math.random() * Nums.length);

        const embed = new EmbedBuilder()
        .setTitle("Rolled Dice")
        .addFields(
            {name: "Number:", value: `${ball}`, inline: true},
            {name: "Requested by:", value: `<@${interaction.user.id}>`}
        )
        .setColor("Green")

        return interaction.editReply({
            embeds: [embed]
        })
    }
}