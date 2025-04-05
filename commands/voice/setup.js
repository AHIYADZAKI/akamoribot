const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../../config');
const Voice = require('../../systems/database/models/Voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice-setup')
        .setDescription('Настроить систему приватных голосовых каналов')
        .addChannelOption(option =>
            option.setName('category')
                .setDescription('Категория для приватных каналов')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Канал для создания приватных каналов')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const category = interaction.options.getChannel('category');
        const channel = interaction.options.getChannel('channel');

        if (category.type !== 'GUILD_CATEGORY') {
            return interaction.reply({ 
                content: '❌ Указанный канал не является категорией!', 
                ephemeral: true 
            });
        }

        if (channel.type !== 'GUILD_VOICE') {
            return interaction.reply({ 
                content: '❌ Указанный канал не является голосовым!', 
                ephemeral: true 
            });
        }

        try {
            await Voice.findOneAndUpdate(
                { guildId: interaction.guild.id },
                { 
                    guildId: interaction.guild.id,
                    categoryId: category.id,
                    createChannelId: channel.id 
                },
                { upsert: true }
            );

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('🔊 Настройка голосовых каналов')
                .setDescription(`Приватные каналы будут создаваться в категории ${category.name}`)
                .addFields(
                    { name: 'Категория', value: category.name, inline: true },
                    { name: 'Канал создания', value: channel.name, inline: true }
                )
                .setFooter({ text: `Настроил ${interaction.user.tag}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при настройке системы', 
                ephemeral: true 
            });
        }
    },
};