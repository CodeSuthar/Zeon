const {SlashCommandBuilder, EmbedBuilder, Embed} = require("discord.js");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("random")
    .setDescription("Gives you a random answer from the given options.")
    .addSubcommand(subcommand => subcommand
        .setName("answer")
        .setDescription("Gives you a random answer from the given options.")
        .addStringOption(option => option
            .setName("option-1")
            .setDescription("the first option.")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("option-2")
            .setDescription("The second option.")
            .setRequired(true)
        )
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case "answer":
                const op1 = interaction.options.getString("option-1");
                const op2 = interaction.options.getString("option-2");
                const choices = [`${op1}`, `${op2}`];
        
                const answer = Math.floor(Math.random() * choices.length);
        
                const embed = new EmbedBuilder()
                .setTitle("Here is the answer!")
                .addFields(
                    { name: `User: `, value: `<@${interaction.user.id}>`, inline: true},
                    { name: `Answer: `, value: `${choices[answer]}`, inline: true},
                    { name: "Option 1: ", value: `${op1}`, inline: false},
                    { name: "Option 2: ", value: `${op2}`}
                )
                .setColor("Random")
                .setTimestamp()
        
                return interaction.editReply({ embeds: [embed] });
        }
    }
}