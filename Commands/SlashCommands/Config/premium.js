const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const GuildDB = require("../../../Database/premium");
const Code = require("../../../Database/premium-code")
const moment = require("moment");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName("premium")
    .setDescription("Redeem your premium package")
    .addSubcommand((subcommand) => subcommand
        .setName("redeem")
        .setDescription("Redeem your premium package")
        .addStringOption(option => option
            .setName("code")
            .setDescription("The code you want to redeem")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) => subcommand
        .setName("status")
        .setDescription("Check's Guilds Premium Status")
        .addStringOption(option => option
            .setName("guild_id")
            .setDescription("The guild id of guild you want to check")
            .setRequired(false)
        )
    ),
    run: async (client, interaction, args) => {
        if (!interaction.replied) await interaction.deferReply();

        const SubCommand = interaction.options.getSubcommand();

        if (SubCommand === "redeem") {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.editReply(`Hey Buddy, You need \`MANAGE_GUILD Or ADMINISTRATOR\` permissions to execute this command!`);

            const code = interaction.options.getString("code");
        
            let Guild = await GuildDB.findOne({ _id: interaction.guildId });
        
            let Pcode = await Code.findOne({
                code: code
            });
        
            if(!Pcode) {
                const embed = new EmbedBuilder()
                .setColor("Random")
                .setDescription(`${client.emoji.wrong} | The code you provided is invalid!`);
                return await interaction.editReply({ embeds: [embed] });
            }
        
            if (Pcode && Guild) {
                Guild.expireTime = Guild.expireTime + Pcode.times;
                let time = Guild.expireTime.toString().split("");
                time.pop();
                time.pop();
                time.pop();
                time = time.join("");
    
                Guild.isPremium = true;
                Guild.redeemedBy = interaction.user.id;
                Guild.redeemedAt = Date.now();
                Guild.plan = Pcode.plan;
                Guild.expireAt = Guild.expireTime;
                Guild.expireTime = Guild.expireTime;
    
                Guild = await Guild.save({ new: true });
    
                const usetime = Pcode.uses - 1;
    
                const plan = Pcode.plan;
    
                if (usetime === 0 || !usetime) {
                    await Pcode.deleteOne();
                } else {
                    Pcode.uses = Pcode.uses - 1;
                    await Pcode.save();
                }
    
                if (Pcode.plan === "lifetime") {
                    let userembed = new EmbedBuilder()
                    .setDescription(`${client.emoji.tick} | You have successfully redeemed premium for this guild\nRedeemed by - <@${interaction.user.id}>\nPlan - ${plan}`)
                    .setColor(`Random`)
    
                    return interaction.editReply({ embeds: [userembed] });
                }
        
                let userembed = new EmbedBuilder()
                .setDescription(`${client.emoji.tick} | You have successfully redeemed premium for this guild\nRedeemed by - <@${interaction.user.id}>Plan - ${plan}\nExpires at: <t:${time}>(<t:${time}:R>)`)
                .setColor(`Random`)
    
                return interaction.editReply({ embeds: [userembed] })
            } else {
                let time = Pcode.expireTime.toString().split("");
                time.pop();
                time.pop();
                time.pop();
                time = time.join("");
    
                await GuildDB.create({
                    _id: interaction.guildId,
                    isPremium: true,
                    redeemedBy: interaction.user.id,
                    redeemedAt: Date.now(),
                    plan: Pcode.plan,
                    expireAt: Pcode.expireTime,
                    expireTime: Pcode.expireTime
                });
        
                const usetime = Pcode.uses - 1;
    
                const plan = Pcode.plan;
    
                if (usetime === 0 || !usetime) {
                    await Pcode.deleteOne();
                } else {
                    Pcode.uses = Pcode.uses - 1;
                    
                    const Pcode = await Pcode.save({ new: true });
                }
                
                if (Pcode.plan === "lifetime") {
                    let userembed = new EmbedBuilder()
                    .setDescription(`${client.emoji.tick} | You have successfully redeemed premium for this guild\nRedeemed by - <@${interaction.user.id}>\nPlan - ${plan}`)
    
                    return interaction.editReply({ embeds: [userembed] });
                }
    
                let userembed = new EmbedBuilder()
                .setDescription(`${client.emoji.tick} | You have successfully redeemed premium for this guild\nRedeemed by - <@${interaction.user.id}>\nPlan - ${plan}\nExpires at: <t:${time}>(<t:${time}:R>)`)
                .setColor(`Random`)
    
                return interaction.editReply({ embeds: [userembed] });
            }
        }

        if (SubCommand === "status") {
            let GuildId = interaction.options.getString("guild_id");
            let Guild;

            if (GuildId) {
                Guild = client.guilds.cache.get(GuildId) || await client.guilds.fetch(GuildId);
            } else {
                Guild = interaction.guild;
            }

            if (!Guild) {
                return interaction.editReply(`${client.emoji.wrong} | The guild, You are talking about, I'm not connected to it in anyway.`)
            }

            let Guild2 = await GuildDB.findOne({ _id: Guild.id });

            const embed = new EmbedBuilder()
            .setAuthor({
                name: `${Guild.name} Guild Premium Information`,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setDescription(`Here are the details about your premium status of the server ${Guild.name}.`)
            .setThumbnail(interaction.user.displayAvatarURL())
            .setColor("Random")

            if (!Guild2) {
                embed.addFields([
                    { name: `Plan:`, value: `\`\`\`${toOppositeCase("Free")}\`\`\``, inline: true },
                    { name: `Expires at:`, value: `\`\`\`Never\`\`\``, inline: true },
                    { name: `Features:`, value: `\`\`\`Locked\`\`\``, inline: true },
                ])
            } else {
                if  (Guild2.isPremium) {
                    if (Guild2.plan === "lifetime") {
                        embed.addFields([
                            { name: `Plan:`, value: `\`\`\`${toOppositeCase("Premium")}\`\`\``, inline: true },
                            { name: `Expires at:`, value: `\`\`\`Never\`\`\``, inline: true },
                            { name: `Features:`, value: `\`\`\`Unlocked\`\`\``, inline: true },
                        ]);
                    } else {
                        const timeLeft = moment(Guild2.expireAt).format("dddd, MMMM Do YYYY HH:mm:ss");
                        embed.addFields([
                            { name: `Plan:`, value: `\`\`\`${toOppositeCase("Premium")}\`\`\``, inline: true },
                            { name: `Expires at:`, value: `\`\`\`${timeLeft}\`\`\``, inline: true },
                            { name: `Features:`, value: `\`\`\`Unlocked\`\`\``, inline: true },
                        ]);
                    }
                }
            }

            return interaction.editReply({ embeds: [embed] });
        }
    }
};

function toOppositeCase(char) {
    return char.charAt(0).toUpperCase() + char.slice(1);
};