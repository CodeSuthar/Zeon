const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useMainPlayer, useQueue } = require("discord-player");
const { updateQueue } = require("../../../Utils/Utils.js")

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("autoplay")
    .setDescription("Toggles AutoPlay"),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        let Player = await useMainPlayer();

        let Queue = await useQueue(interaction.guildId);

        if (!interaction.member.voice.channel) {
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.wrong} | You Need To Be Connected To A Voice Channel To Use This Command!`)
            .setColor("Random")

            return interaction.editReply({ embeds: [embed] })
        }

        if (Queue && Queue.channel.id !== interaction.member.voice.channelId) {
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.wrong} | I'm Connected To <#${Queue.channel.id}> Voice Channel, You Need To Be In The Same Channel As Me To Control Me!`)
            .setColor("Random")

            return interaction.editReply({ embeds: [embed] })
        }

        if (!Queue) {
            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.wrong} | There's No Player To Toggle AutoPlay In This Server!`)
            .setColor("Random")
            return interaction.editReply({ embeds: [embed] })  
        }

        try {
            let repmode;

            if (Queue.repeatMode === 3) {
                repmode = 0;
            } else {
                repmode = 3;
            }

            const embed = new EmbedBuilder()
            .setDescription(`${client.emoji.tick} | AutoPlay Has Been Toggled To \`${repmode === 0 ? "Off" : "On"}\`!`)
            .setColor("Random")
            
            await Queue.setRepeatMode(repmode);

            await interaction.editReply({ embeds: [embed] });

            return updateQueue(client, Queue, interaction.guild)
        } catch (e) {
            console.log(e);
            return interaction.editReply({ content: `${client.emoji.wrong} | Due To Loadage On The System, Can't Toggle AutoPlay, Anytime Now! Try Again Later.` });
        }
    }
}