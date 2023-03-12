const { EmbedBuilder } = require('discord.js');
const { post } = require('node-superfetch');

module.exports = {
    name: 'eval',
    category: 'Developer',
    description: 'Eval Code',
    developer: true,
    run: async (message, args, client, prefix) => {
      let embed;
        if (args.join(" ").length > 1024) {
          embed = new EmbedBuilder().addFields({ name: 'Input', value: '```js\n' + "LOL" + '```' })
        } else {
          embed = new EmbedBuilder().addFields({ name: 'Input', value: '```js\n' + args.join(' ') + '```' })
        };
        try {
            const code = args.join(' ');
            if (!code) return message.channel.send('Please include the code.');
            let evaled;

            if (code.includes(`SECRET`) || code.includes(`TOKEN`) || code.includes('process.env') || code === "client.token" || code === "${client.token}" || code.includes("token") || code.includes("secret")) {
                evaled = 'No, shut up, what will you do it with the token?';
            } else {
                evaled = await eval(code);
            }

            if (typeof evaled !== 'string') evaled = await require('util').inspect(evaled, { depth: 0 });

            let output = clean(evaled);
            if (output.length > 1024) {
                const { body } = await post('https://hastebin.com/documents').send(output);
                embed.addFields({ name: 'Output', value: `https://hastebin.com/${body.key}.js` }).setColor("Random");
            } else {
                embed.addFields({ name: 'Output', value: '```js\n' + output + '```' }).setColor("Random");
            }

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            let err = clean(error);
            if (err.length > 1024) {
                const { body } = await post('https://hastebin.com/documents').send(err);
                embed.addFields({ name: 'Output', value: `https://hastebin.com/${body.key}.js` }).setColor('Random');
            } else {
                embed.addFields({ name: 'Output', value: '```js\n' + err + '```' }).setColor('Random');
            }
            message.channel.send({ embeds: [embed] });
        }
    },
};

function clean(string) {
  if (typeof text === 'string') {
    return string
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203));
  } else {
    return string;
  }
}