const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const path = require('path');
const fs = require("fs")
const CmdName = path.parse(__filename).name;
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
module.exports = {
	name: `${CmdName}`,
	description: `Plays the ${CmdName} Soundboard Sound`,
	category: "Soundboard",
	cooldown: 5,
	usage: `${CmdName}`,
	run: async (message, args, client, prefix) => {
		const channel = message.member.voice.channel;
		const botchannel = message.guild.members.me.voice.channel;
		if (!channel) return message.reply(`${client.emoji.wrong} | You need to join a voice channel first!`);
		if (!channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.Connect)) return message.reply(`${client.emoji.wrong} | I'm missing the Permission to join your Voice Channel`);
		if (!channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.Speak)) return message.reply(`${client.emoji.wrong} | I'm missing the Permission to speak in your Voice Channel`)
		if (channel.userLimit != 0 && channel.full) return message.reply(`${client.emoji.wrong} | Your Voice Channel is full!`)
		if (botchannel.id === channel.id) return message.reply(`${client.emoji.wrong} | I am already connected in: \`${botchannel.name}\``)
		const e = await message.react('🎙️').catch(e => console.log(e))
		let VoiceConnection = joinVoiceChannel({ channelId: channel.id ,guildId: channel.guild.id,adapterCreator: channel.guild.voiceAdapterCreator });
		let file = path.join(__dirname + `/audio/${CmdName}.mp3`);
		if(!file || !fs.existsSync(file)) {
			file = path.join(__dirname + `/audio/${CmdName}.m4a`);
		}
		if(!file || !fs.existsSync(file)) {
			file = path.join(__dirname + `/audio/${CmdName}.mov`);
		}
		if(!file || !fs.existsSync(file)) return message.reply(`${client.emoji.wrong} Could not find the AUDIO`);
		const resource = createAudioResource(file, {inlineVolume: true});
		resource.volume.setVolume(0.2);
		const player = createAudioPlayer();
		VoiceConnection.subscribe(player);
		player.play(resource);
		player.on("idle", () => {
			try { player.stop(); } catch (e) {console.log(e)}
			try { VoiceConnection.destroy(); } catch (e) {console.log(e)}
			const EmbedB = new EmbedBuilder()
			.setDescription(`**Finished Playing** \`${CmdName}\``)
			.addFields(
				{ name: "Requested By", value: `${message.author.tag}`, inline: true },
				{ name: "Note", value: `Use Another Command, If You Like The System!`, inline: true  }
			)
			.setColor("Random")
			.setFooter({ text: "❤️ |  Thanks For Using Zeon", iconURL: client.user.displayAvatarURL() })
			message.reply({embeds: [EmbedB]});
			e.remove().catch(e => console.log(e))
		});
	}
}

