const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = async (interaction, pages, timeout = 60000) => {
    try {
        if (!interaction || !pages || pages.length === 0) return;

        let page = 0;
        const getPage = (p) => {
            const embed = new EmbedBuilder(pages[p].data)
                .setFooter({ text: `Страница ${p + 1}/${pages.length}` });
            
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel('Назад')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(p === 0),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Вперед')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(p === pages.length - 1)
            );

            return { embeds: [embed], components: [row] };
        };

        const msg = await interaction.reply(getPage(page));

        const collector = msg.createMessageComponentCollector({
            time: timeout
        });

        collector.on('collect', async (i) => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({
                    content: 'Вы не можете управлять этой пагинацией',
                    ephemeral: true
                });
            }

            await i.deferUpdate();

            if (i.customId === 'prev' && page > 0) {
                page--;
            } else if (i.customId === 'next' && page < pages.length - 1) {
                page++;
            }

            await msg.edit(getPage(page));
        });

        collector.on('end', () => {
            const disabledRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel('Назад')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Вперед')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true)
            );

            msg.edit({ components: [disabledRow] }).catch(() => {});
        });

        return msg;
    } catch (error) {
        console.error('Ошибка в pagination:', error);
    }