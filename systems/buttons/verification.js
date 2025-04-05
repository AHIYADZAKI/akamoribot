const { EmbedBuilder } = require('discord.js');
const config = require('../../config');
const Verification = require('../../database/models/Verification');

module.exports = {
    customId: 'verify-user',
    async execute(interaction) {
        try {
            // Проверяем, проходил ли пользователь верификацию
            const isVerified = await Verification.findOne({
                userId: interaction.user.id,
                guildId: interaction.guild.id
            });

            if (isVerified) {
                return interaction.reply({
                    content: 'Вы уже прошли верификацию!',
                    ephemeral: true
                });
            }

            // Выдаем верифицированную роль
            const role = interaction.guild.roles.cache.get(config.roles.verified);
            if (!role) {
                return interaction.reply({
                    content: 'Роль верификации не найдена!',
                    ephemeral: true
                });
            }

            await interaction.member.roles.add(role);

            // Сохраняем в базу данных
            await Verification.create({
                userId: interaction.user.id,
                guildId: interaction.guild.id,
                verifiedAt: new Date()
            });

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('✅ Верификация пройдена')
                .setDescription(`Добро пожаловать на сервер, ${interaction.user.username}!`)
                .setThumbnail(interaction.user.displayAvatarURL())
                .setFooter({ text: `ID: ${interaction.user.id}` });

            await interaction.reply({ embeds: [embed], ephemeral: true });

            // Логируем верификацию
            const logChannel = interaction.guild.channels.cache.get(config.channels.memberLog);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setColor(config.colors.success)
                    .setTitle('Пользователь верифицирован')
                    .set