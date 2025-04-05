const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const config = require('../../config');
const Application = require('../../database/models/Application');

module.exports = {
    customId: 'staff-apply',
    async execute(interaction) {
        try {
            // Проверяем, подавал ли пользователь заявку ранее
            const existingApp = await Application.findOne({ 
                userId: interaction.user.id,
                status: { $ne: 'rejected' }
            });

            if (existingApp) {
                return interaction.reply({
                    content: 'У вас уже есть активная заявка!',
                    ephemeral: true
                });
            }

            // Создаем форму заявки
            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle('📝 Заявка в персонал')
                .setDescription('Пожалуйста, ответьте на следующие вопросы:')
                .addFields(
                    { name: '1. Ваш возраст', value: 'Укажите сколько вам лет' },
                    { name: '2. Опыт работы', value: 'Был ли у вас опыт модерации?' },
                    { name: '3. Почему вы хотите в персонал?', value: 'Опишите ваши мотивы' }
                );

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('cancel-application')
                    .setLabel('Отмена')
                    .setStyle(ButtonStyle.Danger)
            );

            await interaction.showModal({
                customId: 'staff-application-modal',
                title: 'Заявка в персонал',
                components: [
                    {
                        type: 1,
                        components: [{
                            type: 4,
                            customId: 'age',
                            label: 'Ваш возраст',
                            style: 1,
                            minLength: 1,
                            maxLength: 2,
                            required: true
                        }]
                    },
                    {
                        type: 1,
                        components: [{
                            type: 4,
                            customId: 'experience',
                            label: 'Опыт работы',
                            style: 2,
                            minLength: 10,
                            maxLength: 500,
                            required: true
                        }]
                    },
                    {
                        type: 1,
                        components: [{
                            type: 4,
                            customId: 'motivation',
                            label: 'Почему вы хотите в персонал?',
                            style: 2,
                            minLength: 20,
                            maxLength: 1000,
                            required: true
                        }]
                    }
                ]
            });
        } catch (error) {
            console.error('Ошибка в staffApplication:', error);
            await interaction.reply({
                content: 'Произошла ошибка при создании заявки',
                ephemeral: true
            });
        }
    }
};