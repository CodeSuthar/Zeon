const { EmbedBuilder } = require("discord.js");
const translate = require('@iamtraction/google-translate');

module.exports = {
    name: "translate",
    category: "Utility",
    description: "Translates A Text",
    usage: "!translate [ISO CODE] [TEXT]",
    owner: false,
    run: async (message, args, client, prefix) => {
        const query = args.slice(1).join(" ")
        if (!query) return message.reply("Hey User, Please specify a text to translate");
        if (!args[0]) return message.reply("Hey User, Provide me a language of the text to translate");

        const msg = await message.reply({ content: `${client.emoji.loading} | Translating...` });

        client.timertowait(2000);

        let translated;

        try {
            translated = await translate(query, { to: args[0] });
        } catch (e) {
            var langs = [
                'af: Afrikaans',
                'sq: Albanian',
                'am: Amharic',
                'ar: Arabic',
                'hy: Armenian',
                'az: Azerbaijani',
                'eu: Basque',
                'be: Belarusian',
                'bn: Bengali',
                'bs: Bosnian',
                'bg: Bulgarian',
                'ca: Catalan',
                'ceb: Cebuano',
                'ny: Chichewa',
                'zh-cn: Chinese Simplified',
                'zh-tw: Chinese Traditional',
                'co: Corsican',
                'hr: Croatian',
                'cs: Czech',
                'da: Danish',
                'nl: Dutch',
                'en: English',
                'eo: Esperanto',
                'et: Estonian',
                'tl: Filipino',
                'fi: Finnish',
                'fr: French',
                'fy: Frisian',
                'gl: Galician',
                'ka: Georgian',
                'de: German',
                'el: Greek',
                'gu: Gujarati',
                'ht: Haitian Creole',
                'ha: Hausa',
                'haw: Hawaiian',
                'iw: Hebrew',
                'hi: Hindi',
                'hmn: Hmong',
                'hu: Hungarian',
                'is: Icelandic',
                'ig: Igbo',
                'id: Indonesian',
                'ga: Irish',
                'it: Italian',
                'ja: Japanese',
                'jw: Javanese',
                'kn: Kannada',
                'kk: Kazakh',
                'km: Khmer',
                'ko: Korean',
                'ku: Kurdish (Kurmanji)',
                'ky: Kyrgyz',
                'lo: Lao',
                'la: Latin',
                'lv: Latvian',
                'lt: Lithuanian',
                'lb: Luxembourgish',
                'mk: Macedonian',
                'mg: Malagasy',
                'ms: Malay',
                'ml: Malayalam',
                'mt: Maltese',
                'mi: Maori',
                'mr: Marathi',
                'mn: Mongolian',
                'my: Myanmar (Burmese)',
                'ne: Nepali',
                'no: Norwegian',
                'ps: Pashto',
                'fa: Persian',
                'pl: Polish',
                'pt: Portuguese',
                'ma: Punjabi',
                'ro: Romanian',
                'ru: Russian',
                'sm: Samoan',
                'gd: Scots Gaelic',
                'sr: Serbian',
                'st: Sesotho',
                'sn: Shona',
                'sd: Sindhi',
                'si: Sinhala',
                'sk: Slovak',
                'sl: Slovenian',
                'so: Somali',
                'es: Spanish',
                'su: Sundanese',
                'sw: Swahili',
                'sv: Swedish',
                'tg: Tajik',
                'ta: Tamil',
                'te: Telugu',
                'th: Thai',
                'tr: Turkish',
                'uk: Ukrainian',
                'ur: Urdu',
                'uz: Uzbek',
                'vi: Vietnamese',
                'cy: Welsh',
                'xh: Xhosa',
                'yi: Yiddish',
                'yo: Yoruba',
                'zu: Zulu'
            ];
            return msg.edit({ content: `${client.emoji.wrong} | Hey User, Please Provide A Valid ISO Code\n\nNeed Some Help In Getting A Valid ISO Code, The List For ISO Code Is Given Below \`\`\`js\n${langs.join(",\n")}\`\`\`` });
        }
        const e = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({ name: `${message.author.username}#${message.author.discriminator}`, iconURL: message.author.displayAvatarURL({ dynamic: false }) })
        .addFields(
            { name: "Original Text", value: `\`\`\`${query}\`\`\``, inline: true },
            { name: "Translated Text", value: `\`\`\`${translated.text}\`\`\``, inline: true },
        )
        .setTimestamp()
        msg.edit({ embeds: [e], content: "" });
    }
}