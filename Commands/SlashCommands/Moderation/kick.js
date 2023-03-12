const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from a guild")
    .addUserOption((option) => option
        .setName("user")
        .setDescription("The user you want to kick.")
        .setRequired(true)
    )
    .addStringOption((option) => option
        .setName("reason")
        .setDescription("The reason for kicking the user.")
    ),
    run: async (client, interaction, prefix) => {
        if (!interaction.replied) await interaction.deferReply();

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) return interaction.editReply(`Hey Buddy, I need \`KICK_MEMBERS Or ADMINISTRATOR\` permissions to execute this command!`);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return interaction.editReply(`Hey Buddy, You need \`KICK_MEMBERS Or ADMINISTRATOR\` permissions to execute this comand!`);

        let enemy = interaction.options.getUser("user");
    
        const allegation = interaction.options.getString("reason") || "No reason provided!";
    
        if (!enemy) {
            const errorembed = new EmbedBuilder()
            .setDescription("You Need To Mention A Member To Kick")
            .setColor("Random")
            return interaction.editReply({ embeds: [errorembed] })
        }
    
        if (enemy.id === interaction.guild.ownerId) {
            const errorembed = new EmbedBuilder()
            .setDescription("Dumb, You Can't Kick The Owner Of This Guild")
            .setColor("Random")
            return interaction.editReply({ embeds: [errorembed] })
        }
    
        if (enemy.id === interaction.user.id) {
            const errorembed = new EmbedBuilder()
            .setDescription("Dumb, You Can't kick Yourself")
            .setColor("Random")
            return interaction.editReply({ embeds: [errorembed] })
        }
    
        if (interaction.member.roles.highest.position < enemy.roles.highest.position) {
            if(interaction.member.id = interaction.guild.ownerId) {
                const errorembed = new EmbedBuilder()
                .setTitle(`Kicked An Member From The Server`)
                .setDescription(`${enemy} Has Been Kicked`)
                .addFields(
                  { name: `Reason:`, value: `\`\`\`${allegation}\`\`\`` },
                  { name: `Kicked By:`, value: `\`\`\`${interaction.user.tag}\`\`\`` }
                )
                .setColor("Random")
                
                return enemy.kick(allegation).then(() => {
                    interaction.editReply({ embeds: [errorembed] });
                });
            } else {
                const errorembed = new EmbedBuilder()
                .setDescription("Dumb, You Can't Kick A Person Higher Than Or Equal To Your Role")
                .setColor("Random")
                return interaction.editReply({ embeds: [errorembed] })
            }
        }
    
        if (interaction.member.roles.highest.position = enemy.roles.highest.position) {
            if(interaction.member.id = interaction.guild.ownerId) {
                const errorembed = new EmbedBuilder()
                .setTitle(`Kicked An Member From The Server`)
                .setDescription(`${enemy} Has Been Kicked`)
                .addFields(
                    { name: `Reason:`, value: `\`\`\`${allegation}\`\`\`` },
                    { name: `Kicked By:`, value: `\`\`\`${interaction.user.tag}\`\`\`` }
                )
                .setColor("Random")
                
                return enemy.kick(allegation).then(() => {
                    interaction.editReply({ embeds: [errorembed] });
                });
            } else {
                const errorembed = new EmbedBuilder()
                .setDescription("Dumb, You Can't Kick A Person Higher Than Or Equal To Your Role")
                .setColor("Random")
                return interaction.editReply({ embeds: [errorembed] })
            }
        }

        if (!enemy.kickable) {
            const errorembed = new EmbedBuilder()
            .setDescription("Dumb, I Can't Kick This Person Due To Missing Permission Or The User Has Higher Role Than Me")
            .setColor("Random")
            return interaction.editReply({ embeds: [errorembed] })
        }
    
        const errorembed = new EmbedBuilder()
        .setTitle(`Kicked An Member From The Server`)
        .setDescription(`${enemy} Has Been Kicked`)
        .addFields(
          { name: `Reason:`, value: `\`\`\`${allegation}\`\`\`` },
          { name: `Kicked By:`, value: `\`\`\`${interaction.user.tag}\`\`\`` }
        )
        .setColor("Random")
    
        return enemy.kick(allegation).then(() => {
            interaction.editReply({ embeds: [errorembed] });
        });
    }
}