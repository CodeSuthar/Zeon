const { EmbedBuilder } = require("discord.js");
const joinschema = require('../../Database/jointocreate');
const joinchannelschema = require('../../Database/jointocreatechannels');

module.exports = {
    name: "voiceStateUpdate",
    run: async (oldState, newState) => {
        try {
            if (oldState.member.guild === null) return;
        } catch (err) {
            return;
        }
     
        if (oldState.member.id === '1076798263098880116') return;
     
        const leavechanneldata = await joinchannelschema.findOne({ Guild: oldState.member.guild.id, User: oldState.member.id });
     
        if (!leavechanneldata) return;
        else {
     
            const voicechannel = await oldState.member.guild.channels.cache.get(leavechanneldata.Channel);
     
            try {
                await voicechannel.delete()
            } catch (err) {
                return;
            }
     
            await joinchannelschema.deleteMany({ Guild: oldState.guild.id, User: oldState.member.id })
            try {
     
                const deletechannel = new EmbedBuilder()
                .setColor('DarkRed')
                .setThumbnail('https://cdn.discordapp.com/icons/1078641070180675665/c3ee76cdd52c2bba8492027dfaafa15d.webp?size=1024')
                .setTimestamp()
                .setAuthor({ name: `🔊 Join to Create System`})
                .setFooter({ text: `🔊 Channel Deleted`})
                .setTitle('> Channel Deleted')
                .addFields({ name: `• Channel Deleted`, value: `> Your voice channel has been \n> deleted in **${newState.member.guild.name}**!`})
     
                await newState.member.send({ embeds: [deletechannel] });
     
            } catch (err) {
                return;
            } 
        }
    }
};