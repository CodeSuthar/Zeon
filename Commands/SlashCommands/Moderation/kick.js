const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks A Member From The Server!')
    .addUserOption(option => option
        .setName('member')
        .setDescription('The Member You Want To Kick')
        .setRequired(true)
    )
    .addStringOption((option) => option
        .setName("reason")
        .setDescription("The reason for kicking the user.")
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const { options, guild } = interaction;
        let kickInvoker = interaction.member;

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) return interaction.editReply({ content: `${client.emoji.wrong} | I must have the Kick Members Or Administrator permission to use this command!` });

        if (!kickInvoker.permissions.has(PermissionsBitField.Flags.KickMembers)) return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Kick Members Or Administrator permission to use this command!` });

        const kickMember = options.getMember("member");

        if (!kickMember) return interaction.editReply({ content: `${client.emoji.wrong} | Please provide a valid member to kick!` });

        if (kickMember.id === kickInvoker.id) return interaction.editReply({ content: `${client.emoji.wrong} | You cannot kick yourself!` });

        if (kickMember.id === client.user.id) return interaction.editReply({ content: `${client.emoji.wrong} | You cannot kick me!` });

        if (kickMember.id === interaction.guild.ownerId) return interaction.editReply({ content: `${client.emoji.wrong} | You cannot kick the server owner!` });

        let decisiontokick = false;

        if (kickMember.roles.highest.comparePositionTo(kickInvoker.roles.highest) >= 0) {
            if (kickInvoker.id === guild.ownerId) decisiontokick = true;
            else decisiontokick = false;
        } else decisiontokick = true;

        try {
            if (decisiontokick) {
                if (!kickMember.kickable) {
                    return interaction.editReply({ content: `${client.emoji.wrong} | I cannot kick this member as, I am not high enough in the role hierarchy to do that.` })
                } else {
                    let reason;

                    if (options.getString("reason") === null) reason = `No Reason Provided, Action Taken By:- ${interaction.member.displayName} (${interaction.member.id})`
                    else reason = `${options.getString("reason")}, Action Taken By:- ${interaction.member.displayName} (${interaction.member.id})`

                    const emb = new EmbedBuilder()
                    .setTitle(`Kicked An Member From The Server`)
                    .setDescription(`${kickMember.user.username} Has Been Kicked`)
                    .addFields(
                        { name: `Reason:`, value: `\`\`\`${reason}\`\`\`` },
                        { name: `Kicked By:`, value: `\`\`\`${kickInvoker.user.username}\`\`\`` }
                    )
                    .setColor("Random")
                    .setFooter({ text: `Kicked At` })
                    .setTimestamp()

                    const dm = new EmbedBuilder()
                    .setTitle(`You have been kicked`)
                    .setDescription(`You have been kicked from ${guild.name}`)
                    .addFields(
                        { name: `Reason:`, value: `\`\`\`${reason}\`\`\`` },
                        { name: `Kicked By:`, value: `\`\`\`${kickInvoker.user.username}\`\`\`` }
                    )
                    .setColor("Random")
                    .setFooter({ text: `Kicked At` })
                    .setTimestamp()

                    await kickMember.send({ embeds: [dm] }).catch(() => {});
                
                    return kickMember.kick(reason).then(() => {
                        client._kicks.set(`${kickMember.id}_${interaction.guild.id}`, kickInvoker.id);
                        interaction.editReply({ embeds: [emb] });
                    });
                }
            } else {
                return interaction.editReply({ content: `${client.emoji.wrong} | You cannot kick this member as, you are not high enough in the role hierarchy to do that.` });
            }
        } catch (e) {
            return interaction.editReply({ content: `${client.emoji.wrong} | An error occured: ${e},\nContact Support Server To Register This Bug And Get Free 3 Month Zeon's Premiun` });
        }
    }
};