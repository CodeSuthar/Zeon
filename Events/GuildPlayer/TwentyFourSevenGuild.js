const { EmbedBuilder } = require("discord.js");
const db = require("../../Database/Music247.js");
const { useMainPlayer } = require("discord-player");

module.exports = {
    name: "ready",
    run: async (client) => {
        let Player = await useMainPlayer();

        console.log("[ Player ] Auto-Reconnect - Collecting 24/7 Data");
        const maindata = await db.find();
        console.log(`[ Player ] Auto-Reconnect - Found ${maindata.length ? `${maindata.length} queue${maindata.length > 1 ? 's' : ''}. Resuming all auto reconnect queue` : '0 queue'}`);
        for (let data of maindata) {
            const index = maindata.indexOf(data);
            setTimeout(async () => {
                let text = client.channels.cache.get(data.textChannel)
                let guild = client.guilds.cache.get(data._id);
                let voice = client.channels.cache.get(data.voiceChannel)
                if (voice) {
                    if (data.mode === true) {
                        let Queue = await Player.nodes.create(guild, {
                            leaveOnEnd: false,
                            leaveOnStop: false,
                            leaveOnEmpty: false,
                            volume: 80,
                            bufferingTimeout: 200,
                            selfDeaf: true,
                            metadata: {
                                guild: guild.id,
                                channel: text.id,
                            }
                        });

                        if (!Queue.connection) Queue.connect(voice);
                    }
                } else {
                    const embed12 = new EmbedBuilder()
                    .setColor("#ff0080")
                    .setDescription(`I cannot find the 24/7 voice channel <#${voice}> to join again.`)

                    if(text) return await text.send({ embeds: [embed12] });

                    console.log(`[ Player ] Auto-Reconnect - Cannot find the 24/7 voice channel ${voice} to join again.`);
                }
            }), index * 5000
        }
    }
};