const { EmbedBuilder } = require("discord.js");
const db = require("../../../Database/premium-code")

module.exports = {
    name: "generate",
    category: 'Developer',
    description: 'Generate A Redeem Code',
    developer: true,
    run: async (message, args, client, prefix) => {
        let codes = args[0];
        const plan = args[1];
        let use = args[2];
        const plans = ['monthly', 'quarterly', 'yearly', 'lifetime'];

        if (!codes) {
            const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`${client.emoji.wrong} | Please provide a code to make it valid`)

            return message.reply({ embeds: [embed] })
        }

        if (!plan) {
            const embed = new EmbedBuilder()
            .setColor(`Random`)
            .setDescription(`${client.emoji.wrong} | Please provide a premium plan \navailable plans: ${plans.join(', ')}`)

            return message.reply({ embeds: [embed]})
        };

        if (!use) {
            use = 1;
        }

        if (!plans.includes(plan)) {
            const embed = new EmbedBuilder()
            .setColor(`Random`)
            .setDescription(`${client.emoji.wrong} | Invalid plan \navailable plans: ${plans.join(', ')}`)

            return message.reply({ embeds: [embed]})
        };

        let time
        if (plan === 'monthly') time = 1 * 2678400000;
        if (plan === 'quarterly') time = 3 * 2678400000;
        if (plan === 'yearly') time = 12 * 2678400000;
        if (plan === 'lifetime') time = 13 * 2678400000;

        let ftime;

        if (plan === "lifetime") {
            ftime = 12965209135 
        } else {
            ftime = Date.now()+time;
        }

        const alreadysaved = await db.findOne({ code: codes })        

        if (!alreadysaved) {
            const newdb = new db({
                code: codes,
                expireAt: ftime,
                plan: plan,
                expireTime : ftime,
                times: time,
                uses: use
            });

            await newdb.save();
        } else {
            const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`${client.emoji.wrong} | The code which you gave to me, is already registered as valid code!`)

            return message.reply({ embeds: [embed] })
        }

        return message.reply({ embeds: [new EmbedBuilder()
            .setColor("Random")
            .setDescription(`${client.emoji.tick} | Successfully generated
            \`\`\`${codes}\`\`\`\nType Of Plan - ${planDecide(plan)}\nCan Be Used ${use} Times For Redeem`)]
        })
    }
}

function planDecide(planop) {
    let answer;
    if (planop === "monthly") {
        answer = "Monthly"
    }

    if (planop === "quarterly") {
        answer = "Quarterly"
    }

    if (planop === "yearly") {
        answer = "Yearly"
    }

    if (planop === "lifetime") {
        answer = "Lifetime"
    }

    return answer;
}