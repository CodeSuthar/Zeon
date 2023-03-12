const fetch = require('node-fetch-commonjs');
const db = require("../../Database/aichat.js");

module.exports = {
  name: "messageCreate",
  run: async (client, message) => {
    const data = await db.findOne({ Guild: message.guildId })
    if (!data) return;
    const cbchannel = data.Channel
    if(!cbchannel) return;
    const sChannel = message.guild.channels.cache.get(cbchannel) || message.guild.channels.fetch(cbchannel);
    if (!sChannel) return;
    if (message.author.bot || sChannel.id !== message.channel.id) return;
    sChannel.sendTyping();
    if (!message.content) return sChannel.send("Please say something.")
    const ranges = [
		  '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
		  '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
		  '\ud83d[\ude80-\udeff]' // U+1F680 to U+1F6FF
	  ]
    let input = message.cleanContent.replace(
		  new RegExp(ranges.join('|'), 'g'),
		  '.'
	  )
    let regg = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g
    input = input.replace(/<a?:.+:\d+>/gm, '')
	  input = input.replace(regg, '')
    
    const url = new URL(`
http://api.brainshop.ai/get?bid=169968&key=8PfRYqWvexSaKirG&uid=${message.author.id}&msg=${encodeURIComponent(message)}`)
    const jsonRes = await fetch(url).then((res) => res.json())
  
    const chatbotReply = jsonRes.cnt
  
    if (chatbotReply === '') {
		  return message.reply({
			   content: 'Uh What ?',
			   allowedMentions: { repliedUser: false }
		  })
	  }
  
    await message.reply({
		  content: chatbotReply,
		  allowedMentions: { repliedUser: false }
	  })
  }
};