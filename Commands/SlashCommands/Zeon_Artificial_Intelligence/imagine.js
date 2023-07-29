const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require('canvas');
const { request } = require('undici');
const fs = require('fs');
const superagent = require("superagent");
const { ImageGenerationGetChoices } = require("../../../Handler/Bot-Function-Extended/Utils.js");

module.exports = {
  SlashData: {
    name: 'imagine',
    description: `Turn Your Imagination Into Visuals With AI (Artificial Intelligence)!`,
    options: [
      {
        name: 'prompt',
        description: 'Turn your imagination into visuals with AI (Artificial Intelligence)!',
        type: 3,
        required: true
      },
      {
        name: 'image-generation-model',
        description: 'The image model',
        type: 3,
        choices: ImageGenerationGetChoices(),
        required: false
      }
    ],
  },
  run: async (client, interaction) => {
    if (!interaction.replied) await interaction.deferReply();

    const prompt = interaction.options.getString("prompt")
    const model = interaction.options.getString("image-generation-model") ? interaction.options.getString("image-generation-model") : "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5"

    await interaction.editReply({ content: `${client.emoji.loading} | **${prompt}** - ${interaction.user.toString()} - This Can Take From 30 Second To 5 Minutes, As It is Free` });

    try {
      const promptt = { "inputs": prompt };
      const imageArray = [];

      for (let i = 0; i < 4; i++) {
        const response = await query(model, promptt);
        imageArray.push(response);
      }

      const imageLinks = [];
      for (let i = 0; i < imageArray.length; i++) {
        const attachment = new AttachmentBuilder(imageArray[i], `image_${i + 1}.png`);

        const ch = await client.channels.cache.get("1134193131827515612");

        const uploadedImage = await ch.send({ content: `Image ${i + 1}:`, files: [attachment] });
        const imageLink = uploadedImage.attachments.first().url;
        imageLinks.push(imageLink);
      }

      const mergedImage = await mergeImages(1000, 1000, imageLinks);

      const attachment = new AttachmentBuilder(mergedImage).setName('imagine.png');

      await interaction.editReply({ content: `${client.emoji.tick} | **${prompt}** - ${interaction.user.toString()}`, files: [attachment] })
    } catch (e) {
      console.error(e)
    }
  }
};

async function query(model, data) {
  const response = await fetch(model, {
    headers: { Authorization: "Bearer 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" },
    method: "POST",
    body: JSON.stringify(data),
  });

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
}

async function mergeImages(width, height, images) {
  const options = {
    width: width,
    height: height,
    images: images
  };

  // count the number of images
  const imageCount = options.images.length;
  // calculate the number of rows and columns
  const rows = Math.ceil(Math.sqrt(imageCount));
  const cols = Math.ceil(imageCount / rows);
  // calculate the width and height of each small image
  const chunkWidth = Math.floor(options.width / cols);
  const chunkHeight = Math.floor(options.height / rows);
  // create a canvas object
  const canvas = createCanvas(options.width, options.height);
  const ctx = canvas.getContext('2d');
  // load all images, draw them to canvas
  const promises = [];

  for (let i = 0; i < imageCount; i++) {
    const imageBuffer = await fetchImageAsBuffer(options.images[i]);
    const image = await loadImage(imageBuffer);
    const x = (i % cols) * chunkWidth;
    const y = Math.floor(i / cols) * chunkHeight;
    promises.push(ctx.drawImage(image, x, y, chunkWidth, chunkHeight));
  }

  await Promise.all(promises);
  // return the canvas
  return canvas.toBuffer();
}

async function fetchImageAsBuffer(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from ${url}, status: ${response.status}`);
  }
  return response.arrayBuffer();
}