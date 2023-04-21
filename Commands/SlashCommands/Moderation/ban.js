const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban's a user from the guild.")
    .addUserOption((option) => option
        .setName("user")
        .setDescription("The user you want to ban.")
        .setRequired(true)
    )
    .addStringOption((option) => option
        .setName("reason")
        .setDescription("The reason for banning the user.")
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.editReply({ content: `${client.emoji.wrong} | I must have the Ban Members Or Administrator permission to use this command!` });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.editReply({ content: `${client.emoji.wrong} | You must have the Ban Members Or Administrator permission to use this command!` });

        let enemy = interaction.options.getUser("user");
    
        const allegation = interaction.options.getString("reason") || "No reason provided!";
    
        if (!enemy) {
            const errorembed = new EmbedBuilder()
            .setDescription("You Need To Mention A Member To Ban")
            .setColor("Random")
            return interaction.editReply({ embeds: [errorembed] })
        }
    
        if (enemy.id === interaction.guild.ownerId) {
          const errorembed = new EmbedBuilder()
          .setDescription("Dumb, You Can't Ban The Owner Of This Guild")
          .setColor("Random")
          return interaction.editReply({ embeds: [errorembed] })
        }
    
        if (enemy.id === interaction.user.id) {
          const errorembed = new EmbedBuilder()
          .setDescription("Dumb, You Can't Ban Yourself")
          .setColor("Random")
          return interaction.editReply({ embeds: [errorembed] })
        }
    
        if (interaction.member.roles.highest.position < enemy.roles.highest.position) {
            if (interaction.author.id = interaction.guild.ownerId) {
                const errorembed = new EmbedBuilder()
                .setTitle(`Banned An Member From The Server`)
                .setDescription(`${enemy} Has Been Banned`)
                .addFields(
                    { name: `Reason:`, value: `\`\`\`${allegation}\`\`\`` },
                    { name: `Banned By:`, value: `\`\`\`${interaction.user.tag}\`\`\`` }
                )
                .setColor("Random")
        
                return interaction.guild.bans.create(enemy, {
                    reason: allegation
                }).then(() => {
                    interaction.editReply({ embeds: [errorembed] });
                });
            } else {
                const errorembed = new EmbedBuilder()
                .setDescription("Dumb, You Can't Ban A Person Higher Than Or Equal Your Role")
                .setColor("Random")
                return interaction.editReply({ embeds: [errorembed] })
            }
        }
    
        if (interaction.member.roles.highest.position = enemy.roles.highest.position) {
            if(interaction.author.id = interaction.guild.ownerId) {
                const errorembed = new EmbedBuilder()
                .setTitle(`Banned An Member From The Server`)
                .setDescription(`${enemy} Has Been Banned`)
                .addFields(
                    { name: `Reason:`, value: `\`\`\`${allegation}\`\`\`` },
                    { name: `Banned By:`, value: `\`\`\`${interaction.user.tag}\`\`\`` }
                )
                .setColor("Random")
            
                return interaction.guild.bans.create(enemy, {
                    reason: allegation
                }).then(() => {
                    interaction.editReply({ embeds: [errorembed] });
                });
            } else {
                const errorembed = new EmbedBuilder()
                .setDescription("Dumb, You Can't Ban A Person Higher Than Or  Equal To Your Role")
                .setColor("Random")
                return interaction.editReply({ embeds: [errorembed] })
            }
        }

        if (!enemy.bannable) {
            const errorembed = new EmbedBuilder()
            .setDescription("Dumb, I Can't Ban This Person Due To Missing Permission Or The User Has Higher Role Than Me")
            .setColor("Random")
            return interaction.editReply({ embeds: [errorembed] })
        }
    
        const errorembed = new EmbedBuilder()
        .setTitle(`Banned An Member From The Server`)
        .setDescription(`${enemy} Has Been Banned`)
        .addFields(
            { name: `Reason:`, value: `\`\`\`${allegation}\`\`\`` },
            { name: `Banned By:`, value: `\`\`\`${interaction.user.tag}\`\`\`` }
        )
        .setColor("Random")
        
        return interaction.guild.bans.create(enemy, {
            reason: allegation
        }).then(() => {
            interaction.editReply({ embeds: [errorembed] });
        });
    }
}