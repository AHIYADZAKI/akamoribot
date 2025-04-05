const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ChannelType } = require('discord.js');
const config = require('../../config');
const Ticket = require('../../database/models/Ticket');

module.exports = {
    customId: 'create-ticket',
    async execute(interaction) {
        try {
            // Проверяем существующие тикеты
            const existingTicket = await Ticket.findOne({
                userId: interaction.user.id,
                guildId: interaction.guild.id,
                status: 'open'
            });

            if (existingTicket) {
                return interaction.reply({
                    content: `У вас уже есть открытый тикет: <#${existingTicket.channelId}>`,
                    ephemeral: true
                });
            }

            // Создаем канал для тикета
            const channel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: config.tickets.categoryId,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [ViewChannel]
                    },
                    {
                        id: interaction.user.id,
                        allow: [ViewChannel, SendMessages, ReadMessageHistory]
                    },
                    {
                        id: config.roles.staff,
                        allow: [ViewChannel, SendMessages, ReadMessageHistory]
                    }
                ]
            });

            // Сохраняем тикет в базу данных
            await Ticket.create({
                userId: interaction.user.id,
                guildId: interaction.guild.id,
                channelId: channel.id,
                status: 'open',
                createdAt: new Date()
            });

            // Отправляем приветственное сообщение
            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle('🎫 Поддержка')
                .setDescription(`Привет, ${interaction.user}! Персонал скоро поможет вам.\nОпишите ваш вопрос подробнее.`)
                .setFooter({ text: 'Тикет будет закрыт через 24 часа неактивности' });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('close-ticket')
                    .setLabel('Закрыть тикет')
                    .setStyle(ButtonStyle.Danger)
            );

            await channel.send({ 
                content: `${interaction.user} <@&${config.roles.staff}>`,
                embeds: [embed],
                components: [row]
            });

            await interaction.reply({
                content: `Тикет создан: ${channel}`,
                ephemeral: true
            });
        } catch (error) {
            console.error('Ошибка в ticket system:', error);
            await interaction.reply({
                content: 'Произошла ошибка при создании тикета',
                ephemeral: true
            });
        }
    }
};