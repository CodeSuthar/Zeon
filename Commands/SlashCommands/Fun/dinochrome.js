const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    SlashData: new SlashCommandBuilder()
    .setName('dinochrome')
    .setDescription('Returns A Dinochrome Image!'),
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply();
        
        await interaction.editReply({ content: `---------------🦖`, fetchReply: true });
        let time = 1 * 1000;
        setTimeout(function () {
            interaction.editReply(`-----------🦖----`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`----------🦖------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`--------🦖--------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`------🦖-----------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`-------🦖-----------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`---🌵-----🦖---------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`---🌵-🦖-------------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`🦖\n ---🌵--------------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`------🦖---🌵--------------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`----🦖-----🌵----------------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`-🌵🌵-----🦖-------🌵--------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`----🌵🌵-🦖----------🌵------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`🦖\n ---🌵🌵-------------🌵---`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`-----🦖---🌵🌵-------------🌵--`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`-------🦖-----🌵🌵-------------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`🎂----🦖--------🌵🌵-----------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`---🎂--🦖----------🌵🌵---------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`**Ⓜⓘⓢⓢⓘⓞⓝ Ⓒⓞⓜⓟⓛⓔⓣⓔⓓ !**\n ---🎂🦖----------🌵🌵-------------`);
        }, time);
    }
};