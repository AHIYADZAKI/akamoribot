const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice-create')
        .setDescription('Создать приватный голосовой канал')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Название канала')
                .setRequired(false)),
    async execute(interaction) {
        const name = interaction.options.getString('name') || `Канал ${interaction.user.username}`;
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ 
                content: '❌ Вы должны быть в голосовом канале!', 
                ephemeral: true 
            });
        }

        try {
            const newChannel = await interaction.guild.channels.create({
                name: name,
                type: 'GUILD_VOICE',
                parent: voiceChannel.parent,
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: ['MANAGE_CHANNELS', 'MOVE_MEMBERS']
                    },
                    {
                        id: interaction.guild.id,
                        deny: ['CONNECT']
                    }
                ]
            });

            await interaction.member.voice.setChannel(newChannel);

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('🔊 Приватный канал создан')
                .setDescription(`Канал ${newChannel.name} успешно создан`)
                .addFields(
                    { name: 'Владелец', value: interaction.user.username, inline: true },
                    { name: 'Категория', value: voiceChannel.parent?.name || 'Без категории', inline: true }
                )
                .setFooter({ text: `Используйте /voice-limit для установки лимита` });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при создании канала', 
                ephemeral: true 
            });
        }
    },
};