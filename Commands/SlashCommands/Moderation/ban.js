const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans A Member From The Server!')
    .addUserOption(option => option
        .setName('member')
        .setDescription('The Member You Want To Ban')
        .setRequired(true)
    )
    .addStringOption((option) => option
        .setName("reason")
        .setDescription("The reason for banning the user.")
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        const { options, guild } = interaction;
        let banInvoker = interaction.member;

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.editReply({ content: `${client.emoji.wrong} | I must have the Ban Members Or Administrator permission to use this command!` });

        if (!banInvoker.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Ban Members Or Administrator permission to use this command!` });

        const banMember = options.getMember("member");

        if (!banMember) return interaction.editReply({ content: `${client.emoji.wrong} | Please provide a valid member to ban!` });

        if (banMember.id === banInvoker.id) return interaction.editReply({ content: `${client.emoji.wrong} | You cannot ban yourself!` });

        if (banMember.id === client.user.id) return interaction.editReply({ content: `${client.emoji.wrong} | You cannot ban me!` });

        if (banMember.id === interaction.guild.ownerId) return interaction.editReply({ content: `${client.emoji.wrong} | You cannot ban the server owner!` });

        let decisiontoban = false;

        if (banMember.roles.highest.comparePositionTo(banInvoker.roles.highest) >= 0) {
            if (interaction.member.id === guild.ownerId) decisiontoban = true;
            else decisiontoban = false;
        } else decisiontoban = true;

        try {
            if (decisiontoban) {
                if (!banMember.bannable) {
                    return interaction.editReply({ content: `${client.emoji.wrong} | I cannot ban this member as, I am not high enough in the role hierarchy to do that.` })
                } else {
                    let reason;

                    if (options.getString("reason") === null) reason = `No Reason Provided, Action Taken By:- ${interaction.member.displayName} (${interaction.member.id})`
                    else reason = `${options.getString("reason")}, Action Taken By:- ${interaction.member.displayName} (${interaction.member.id})`
                    
                    const emb = new EmbedBuilder()
                    .setTitle(`Banned An Member From The Server`)
                    .setDescription(`${banMember.user.username} Has Been Banned`)
                    .addFields(
                        { name: `Reason:`, value: `\`\`\`${reason}\`\`\`` },
                        { name: `Banned By:`, value: `\`\`\`${banInvoker.user.username}\`\`\`` }
                    )
                    .setColor("Random")
                    .setFooter({ text: `Banned At` })
                    .setTimestamp()

                    const dm = new EmbedBuilder()
                    .setTitle(`You have been banned`)
                    .setDescription(`You have been banned from ${guild.name}`)
                    .addFields(
                        { name: `Reason:`, value: `\`\`\`${reason}\`\`\`` },
                        { name: `Banned By:`, value: `\`\`\`${banInvoker.user.username}\`\`\`` }
                    )
                    .setColor("Random")
                    .setFooter({ text: `Banned At` })
                    .setTimestamp()

                    await banMember.send({ embeds: [dm] }).catch(() => {});

                    return banMember.ban({ reason: reason }).then(() => {
                        client._bans.set(`${banMember.id}_${interaction.guild.id}`, banInvoker.id)
                        interaction.editReply({ embeds: [emb] });
                    })
                }
            } else {
                return interaction.editReply({ content: `${client.emoji.wrong} | You cannot ban this member as, you are not high enough in the role hierarchy to do that` })
            }
        } catch (e) {
            return interaction.editReply({ content: `${client.emoji.wrong} | An error occured: ${e},\nContact Support Server To Register This Bug And Get Free 3 Month Zeon's Premiun` });
        }
    }
};