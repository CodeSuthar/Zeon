const {SlashCommandBuilder, EmbedBuilder, Embed} = require("discord.js");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription("Help's you to play a game of coinflip?.")
    .addStringOption(option => option
        .setName("answer")
        .setDescription("Head or Tail?.")
        .setRequired(true)
        .addChoices(
            { name: "Head", value: "Head" },
            { name: "Tail", value: "Tail" }
        )
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const { options } = interaction;

        const answer = options.getString("answer")
        const choice = ["Head", "Tail"]
        const text = Math.floor(Math.random() * choice.length);

        const embed1 = new EmbedBuilder()
        .setColor("Red")
        .setTitle("YOU LOST!")
        .addFields({name: "Your answer:", value:`🪙 ${answer}`, inline: true})
        .addFields({name: "My answer:", value:`🪙 ${choice[text]}`, inline: true})

        const embed2 = new EmbedBuilder()
        .setColor("Green")
        .setTitle("YOU WON!")
        .addFields({name: "Your answer:", value:`🪙 ${answer}`, inline: true})
        .addFields({name: "My answer:", value:`🪙 ${choice[text]}`, inline: true})

        if (answer == choice[text]) {
            await interaction.editReply({embeds: [embed2]})
        }

        if (answer !== choice[text]) {
            await interaction.editReply({embeds: [embed1]})
        }    
    }
}