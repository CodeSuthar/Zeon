const figlet = require("figlet");

module.exports = {
    name: "ascii",
    aliases: ["textart"],
    description: "Make your tetx look very cool.",
    category: "Fun",
    usage: "!ascii hello",
    run: async (message, args, client, prefix) => {
        if (!args.join("")) {
          return message.reply({ content: `You Need To Give a Text To Make It Ascii` })
        }
      
        figlet.text(args.join(' '), {
            font : "",
        }, async (err ,data) => {
          message.reply(`\`\`\`${data}\`\`\``)
        })
    },
};