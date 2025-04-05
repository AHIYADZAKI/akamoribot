const { EmbedBuilder } = require('discord.js');
const config = require('../../config');
const Ticket = require('../../database/models/Ticket');

module.exports = {
    customId: 'close-ticket',
    async execute(interaction) {
        try {
            // Проверяем права пользователя
            const isStaff = interaction.member.roles.cache.has(config.roles.staff);
            const isTicketOwner = await Ticket.exists({
                channelId: interaction.channel.id,
                userId: interaction.user.id
            });

            if (!isStaff && !isTicketOwner) {
                return interaction.reply({
                    content: 'Только автор тикета или персонал может его закрыть!',
                    ephemeral: true
                });
            }

            // Обновляем статус тикета
            await Ticket.findOneAndUpdate(
                { channelId: interaction.channel.id },
                { status: 'closed', closedAt: new Date(), closedBy: interaction.user.id }
            );

            // Удаляем канал или архивируем
            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('Тикет закрыт')
                .setDescription(`Тикет был закрыт ${interaction.user}`)
                .setFooter({ text: 'Канал будет удален через 10 минут' });

            await interaction.reply({ embeds: [embed] });

            // Удаляем канал через 10 минут
            setTimeout(async () => {
                try {
                    await interaction.channel.delete();
                } catch (error) {
                    console.error('Ошибка при удалении канала тикета:', error);
                }
            }, 600000);
        } catch (error) {
            console.error('Ошибка при закрытии тикета:', error);
            await interaction.reply({
                content: 'Произошла ошибка при закрытии тикета',
                ephemeral: true
            });
        }
    }
};