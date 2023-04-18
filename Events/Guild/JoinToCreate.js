const { EmbedBuilder } = require("discord.js");
const joinschema = require('../../Database/jointocreate');
const joinchannelschema = require('../../Database/jointocreatechannels');

module.exports = {
    name: "VoiceStateUpdate",
    run: async (oldState, newState) => {
        try {
            if (newState.member.guild === null) return;
        } catch (err) {
            return;
        }
     
        if (newState.member.id === '1076798263098880116') return;
     
        const joindata = await joinschema.findOne({ Guild: newState.member.guild.id });
        const joinchanneldata1 = await joinchannelschema.findOne({ Guild: newState.member.guild.id, User: newState.member.id });
     
        const voicechannel = newState.channel;
     
        if (!joindata) return;
     
        if (!voicechannel) return;
        else {
     
            if (voicechannel.id === joindata.Channel) {
     
                if (joinchanneldata1) {
     
                    try {
     
                        const joinfail = new EmbedBuilder()
                        .setColor('DarkRed')
                        .setThumbnail('https://cdn.discordapp.com/icons/1078641070180675665/c3ee76cdd52c2bba8492027dfaafa15d.webp?size=1024')
                        .setTimestamp()
                        .setAuthor({ name: `🔊 Join to Create System`})
                        .setFooter({ text: `🔊 Issue Faced`})
                        .setTitle('> You tried creating a \n> voice channel but..')
                        .addFields({ name: `• Error Occured`, value: `> You already have a voice channel \n> open at the moment.`})
     
                        return await newState.member.send({ embeds: [joinfail] });
     
                    } catch (err) {
                        return;
                    }
     
                } else {
     
                    try {
     
                        const channel = await newState.member.guild.channels.create({
                            type: ChannelType.GuildVoice,
                            name: `${newState.member.user.username}-room`,
                            userLimit: joindata.VoiceLimit,
                            parent: joindata.Category
                        })
     
                        try {
                            await newState.member.voice.setChannel(channel.id);
                        } catch (err) {
                            console.log('Error moving member to the new channel!')
                        }   
     
                        setTimeout(() => {
     
                            joinchannelschema.create({
                                Guild: newState.member.guild.id,
                                Channel: channel.id,
                                User: newState.member.id
                            })
     
                        }, 500)
     
                    } catch (err) {
     
                        console.log(err)
     
                        try {
     
                            const joinfail = new EmbedBuilder()
                            .setColor('DarkRed')
                            .setThumbnail('https://cdn.discordapp.com/icons/1078641070180675665/c3ee76cdd52c2bba8492027dfaafa15d.webp?size=1024')
                            .setTimestamp()
                            .setAuthor({ name: `🔊 Join to Create System`})
                            .setFooter({ text: `🔊 Issue Faced`})
                            .setTitle('> You tried creating a \n> voice channel but..')
                            .addFields({ name: `• Error Occured`, value: `> I could not create your channel, \n> perhaps I am missing some permissions.`})
     
                            await newState.member.send({ embeds: [joinfail] });
     
                        } catch (err) {
                            return;
                        }
     
                        return;
     
                    }
     
                    try {
     
                        const joinsuccess = new EmbedBuilder()
                        .setColor('DarkRed')
                        .setThumbnail('https://cdn.discordapp.com/icons/1078641070180675665/c3ee76cdd52c2bba8492027dfaafa15d.webp?size=1024')
                        .setTimestamp()
                        .setAuthor({ name: `🔊 Join to Create System`})
                        .setFooter({ text: `🔊 Channel Created`})
                        .setTitle('> Channel Created')
                        .addFields({ name: `• Channel Created`, value: `> Your voice channel has been \n> created in **${newState.member.guild.name}**!`})
     
                        await newState.member.send({ embeds: [joinsuccess] });
     
                    } catch (err) {
                        return;
                    }
                }
            }
        }
    }
};