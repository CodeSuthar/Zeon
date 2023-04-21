const { SlashCommandBuilder } = require("discord.js");
 
module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("impersonate")
    .setDescription("Impersonates a user with a message.")
    .addUserOption(option => option
        .setName("user")
        .setDescription("The user you want to impersonate.")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("message")
        .setDescription("the message")
        .setRequired(true)
    ),
    run: async(client, interaction, args) => {
        if (!interaction.replied) await interaction.deferReply({ ephemeral: true });

        //define member and message
        const member = interaction.options.getUser("user");
        const message = interaction.options.getString("message");
 
        //if includes everone or here
        if (message.includes('@everyone') || message.includes('@here')) return await interaction.reply({ 
            content: `You cannot mention everyone/here with this command`, 
            ephemeral: true
        });
 
        //create the webhook and message, and then delete webhook
        await interaction.channel.createWebhook({
            name: member.username,
            avatar: member.displayAvatarURL({ dynamic: true })
        }).then((webhook) => {
            webhook.send({content: message});
            setTimeout(() => {
                webhook.delete();
            }, 3000)
        });
 
        //send an ephemeral message to verify that the webhook send this message
        await interaction.editReply({
            content: `<@${member.id}> has been impersonated below!`,
            ephemeral: true
        });
    }
}