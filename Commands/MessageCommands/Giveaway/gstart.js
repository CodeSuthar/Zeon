const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField } = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "gstart",
    category: "Giveaway",   
    description: "To Start A Giveaway",
    usage: "gstart <time> <winners> <prize>",
    run: async (message, args, client, prefix) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply(`Hey Buddy, You need \`Manage Server Or Administrator\` permissions to execute this comand!`);
        
        const time = args[0];
        const winner = args[1];
        const prize = args.slice(2).join(" ");

        if (!time) return message.reply("Please specify a time");
        if (!winner) return message.reply("Please specify a winner");
        if (!prize) return message.reply("Please specify a prize");

        let options = {
            time: ms(time),
            duration: ms(time),
            prize: `${client.emoji.gift}  ${prize} ${client.emoji.gift}`,
            winnerCount: parseInt(winner),
            hostedBy: message.author,
            thumbnail: client.user.displayAvatarURL(),
            botsCanWin: false,
            embedColor: "Random",
            embedColorEnd: "Random",
            reaction: '🎉',
            lastChance: {
                enabled: true,
                content: '⚠️ **LAST CHANCE TO ENTER!** ⚠️',
                threshold: 60000,
                embedColor: '#FEE75C'
            },
            pauseOptions: {
                isPaused: false,
                content: '⏸️ **THIS GIVEAWAY IS PAUSED!** ⏸️',
                unPauseAfter: null,
                embedColor: '#582812'
            },
            bonusEntries: [],
            messages: {
                inviteToParticipate: "***React with 🎉 to participate!***\n",
                drawing: "> Ends: {timestamp}\n",
                hostedBy: "**Hosted by:** {this.hostedBy}",
                dropMessage: "Be the first to react with 🎉",
                noWinner: "\n**Giveaway cancelled!**\n> No valid participations. :cry:",
                endedAt: "Ends at", 
                giveaway: '🎉 **GIVEAWAY STARTED** 🎉',
                giveawayEnded: '🎉 **GIVEAWAY ENDED** 🎉',
                winMessage: '**Congrats** {winners}!\n> You won **{this.prize}**!\n> **Jump:** {this.messageURL}\nHosted by: {this.hostedBy}',
                embedFooter: '{this.winnerCount} Winner{this.winnerCount > 1 ? "s" : ""}'
            },
        }

        const embed = new EmbedBuilder()
        .setTitle("Giveaway Should Be Which Type?")
        .setDescription("Select Any One Button To Proceed!")
        .setColor("Random")

        const b1 = new ButtonBuilder()
        .setStyle("Secondary")
        .setLabel("Normal Giveaway!")
        .setCustomId("normal")

        const b2 = new ButtonBuilder()
        .setStyle("Secondary")
        .setLabel("Role Required Giveaway!")
        .setCustomId("role")

        const row = new ActionRowBuilder()
        .addComponents(b1, b2)

        message.reply({ embeds: [embed], components: [row] }).then(async (msg) => {
            const filter = (interaction) => {
                if (interaction.user.id === message.author.id) return true;
                return interaction.reply({
                    content: `:x: **Only ${message.author.tag} can use this interaction!**`,
                    ephemeral: true,
                });
            };
        
            const collector = message.channel.createMessageComponentCollector({
                filter,
                time: 60000,
                idle: 60000 / 2,
            });

            collector.on("end", async (collected) => {
                message.delete();
                msg.delete();
            });
    
            collector.on("collect", async (interaction) => {
                if (!interaction.deferred) interaction.deferUpdate();;
                const button = interaction.customId;
                if (button === "normal") {
                    await client.GiveawayManager.start(
                        message.channel,
                        options
                    )
                    collector.stop();
                } else if (button === "role") {
                    let requiredroles;
                    await msg.edit({
                        embeds: [new EmbedBuilder().setColor("Random").setTitle(`Do you want a Required Role?`).setDescription(`To Cancel Type \'0\' Or \`Cancel\` To add Required Roles, **Ping all Roles** which should be **required (the Users just need at least one of them)**\n\n**Example:**\n> \`@ROLE1 @Role2\` (1 Role is also enough)\n\n**NOTE:**\n> *Users without the Role, can react, but __won't be drawn__!*`)
                        ],
                        components: []
                    })
                    var collected = await message.channel.awaitMessages({filter: m => m.author.id == interaction.user.id,  max: 1, time: 60e3, errors: ['time'] })
                    requiredroles = collected.first();
                    if (requiredroles.mentions.roles.size >= 1) {
                        let theRoles = [...requiredroles.mentions.roles.values()];
                        options.messages.giveaway += `\n\n**REQUIRED ROLES:**\n${[...theRoles].map(r=>`> <@&${r.id}>`).join("\n")}`;
                        options.messages.giveawayEnded += `\n\n**REQUIRED ROLES:**\n${[...theRoles].map(r=>`> <@&${r.id}>`).join("\n")}`;
                        theRoles = theRoles.map(r => r.id);
                        options.exemptMembers = new Function('member', `return !member || !member.roles ||!member.roles.cache.some((r) => \'${theRoles}\'.includes(r.id))`)


                        options.messages.giveaway = options.messages.giveaway.substring(0, 2000)
                        options.messages.giveawayEnded = options.messages.giveawayEnded.substring(0, 2000)

                        await client.GiveawayManager.start(
                            message.channel,
                            options
                        )
                        collector.stop();
                    } else {
                        message.channel.send("No Roles Pinged, So I am not adding any Required Roles!")
                        collector.stop();
                        await client.GiveawayManager.start(
                            message.channel,
                            options
                        )
                    }
                }
            })
        })
    }
}