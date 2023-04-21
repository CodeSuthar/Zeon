const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const afk = require("../../../Database/afk");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Set your status to AFK.")
    .addStringOption((option) => option
        .setName("reason")
        .setDescription("Give me a reason to set your mode to afk.")
    ),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();
        
        let reason = "No Reason Provided";
        
        if (interaction.options.getString("reason")) {
            reason = interaction.options.getString("reason");
        }
        const data = await afk.findOne({ Guild: interaction.guild.id, Member: interaction.user.id  });
        
        if (!data) {
            const oldnick = interaction.member.displayName;
            const newnick = `[AFK] ${oldnick}`;
            await interaction.member.setNickname(newnick).catch(e => {});
            const newafk = new afk({
                Guild: interaction.guild.id,
                Member: interaction.user.id,
                Reason: reason,
                Time: Date.now(),
                Nickname: oldnick
            });
            newafk.save();
            const embed = new EmbedBuilder()
            .setDescription(`**${interaction.user.username}#${interaction.user.discriminator}**, I Added You To My AFK List`)
            .addFields(
                { name: "Note:-", value: `Note: If You Wanna Be In AFK Mode And Type A Message Just Add \`[AFK]\` In The Starting Of Message, And If Want To Disable Afk Mode Type Anything Without AFK Tag` }
            )
                .setColor("Random");
            return interaction.editReply({ embeds: [embed] });
        } else {
            await interaction.member.setNickname(data.Nickname).catch(e => {});
            
            interaction.editReply(`Welcome Back! **${interaction.user.username}#${interaction.user.discriminator}**, I Removed You From My AFK List, You Were AFK For **${convertTime(Date.now() - data.Time)}**`)
            afk.deleteMany({ Guild: interaction.guild.id, Member: interaction.user.id }).then(() => {
                console.log(`AFK Ended`)
            });
        }
    }
};

function convertTime(duration) {

    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = parseInt((duration / 1000) % 60),
      minutes = parseInt((duration / (1000 * 60)) % 60),
      hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    

    if (duration < 3600000) {
        if (duration < 60000) {
            return seconds + " Seconds";
        } else {
            return minutes + " Minutes " + "And " + seconds + " Seconds";
        }
    } else {
        return hours + " Hour, " + minutes + " Minutes " + "And " + seconds + " Seconds";
    }
};