const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { use } = require("passport");
const { useMainPlayer } = require("discord-player");

module.exports = {
    name: "playerFinish",
    run: async (client, queue, track) => {
        let Player = await useMainPlayer();

        const queuedata = queue.metadata;
        const Guild = client.guilds.cache.get(queuedata.guild)
        if (!Guild) return;
        const Channel = Guild.channels.cache.get(queuedata.channel)
        if (!Channel) return;

        const Information = await Player.getNowPlayingMessage(Guild.id);
    
        if (Information) {
            const embed = new EmbedBuilder()
            .setTitle("Seems... Like Track Has Been Ended")
            .setDescription(`*[${track.title}](${track.url})* - Track Has Been **Ended**`)
            .setFooter({ text: `Track Was Requested By ${track.requestedBy.tag}`, iconURL: track.requestedBy.displayAvatarURL() })
            .setColor("Random")

            const But1 = new ButtonBuilder()
            .setCustomId("volumedown")
            .setEmoji("🔉")
            .setStyle("Primary")
            .setDisabled(true)

            const But2 = new ButtonBuilder()
            .setCustomId("stop")
            .setEmoji("⏹️")
            .setStyle("Secondary")
            .setDisabled(true)

            const But3 = new ButtonBuilder()
            .setCustomId("pause")
            .setEmoji("⏸️")
            .setStyle("Primary")
            .setDisabled(true)

            const But4 = new ButtonBuilder()
            .setCustomId("skip")
            .setEmoji("⏭️")
            .setStyle("Secondary")
            .setDisabled(true)

            const But5 = new ButtonBuilder()
            .setCustomId("volumeup")
            .setEmoji("🔊")
            .setStyle("Primary")
            .setDisabled(true)

            const row = new ActionRowBuilder().addComponents(But1, But2, But3, But4, But5);
      
            await Channel.messages.edit(Information, {
              embeds: [embed],
              components: [row]
            })
        } else {
            return
        }
    }
}