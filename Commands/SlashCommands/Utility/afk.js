const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const afk = require("../../../Database/afk");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Set your status to AFK")
    .addStringOption((option) => option
        .setName("reason")
        .setDescription("Give me a reason to set your mode to afk")
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();
        
        let reason = "No Reason Provided";
        
        if (interaction.options.getString("reason")) {
            reason = interaction.options.getString("reason");
        }
        const data = await afk.findOne({ Guild: interaction.guild.id, Member: interaction.user.id  });
        
        if (!data) {
            const newafk = new afk({
                Guild: interaction.guild.id,
                Member: interaction.user.id,
                Reason: reason,
                Time: Date.now(),
            });
            newafk.save();
            const embed = new EmbedBuilder()
            .setDescription(`**${interaction.user.username}#${interaction.user.discriminator}**, I Added You To My AFK List`)
            .addFields(
                { name: "Note:-", value: `Note: If You Wanna Be In AFK Mode And Type A Message Just Add \`[AFK]\` In The Starting Of Message, And If Want To Disable Afk Mode Type Anything Without AFK Tag` }
            )
                .setColor("Random");
            return interaction.editReply({ embeds: [embed] });
        } else {
            return
        }
    }
};