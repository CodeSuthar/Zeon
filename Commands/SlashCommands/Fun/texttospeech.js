const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
 
module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('texttospeech')
    .setDescription('Sends a specified message as a TTS (text to speech) message.')
    .addStringOption(option => option
        .setName('message')
        .setDescription('Specified message that will be sent as a TTS message.')
        .setRequired(true)
        .setMaxLength(2000)
    ),
    run: async(client, interaction, args) => {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.SendTTSMessages)) return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});
 
        const message = interaction.options.getString('message');
 
        const embed = new EmbedBuilder()
        .setColor("DarkBlue")
        .setDescription(`> ${message}`)
        .setTitle(`${interaction.user.username} says..`)
        .setAuthor({ name: `🔊 TTS Tool`})
        .setFooter({ text: `🔊 TTS Message sent`})
 
        await interaction.reply({ content: `${message}`, embeds: [embed], tts: true });
        await interaction.editReply({ embeds: [embed], content: ``})
    }
}