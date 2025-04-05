const { PermissionsBitField } = require('discord.js');

module.exports = {
    // Проверка прав пользователя
    checkPermissions: (member, permissions) => {
        const missing = [];
        for (const permission of permissions) {
            if (!member.permissions.has(permission)) {
                missing.push(permission);
            }
        }
        return missing;
    },

    // Форматирование прав в читаемый вид
    formatPermissions: (permissions) => {
        const formatted = [];
        for (const permission of permissions) {
            formatted.push(
                permission
                    .split('_')
                    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
                    .join(' ')
            );
        }
        return formatted.join(', ');
    },

    // Основные права модератора
    modPermissions: [
        PermissionsBitField.Flags.KickMembers,
        PermissionsBitField.Flags.BanMembers,
        PermissionsBitField.Flags.ManageMessages
    ],

    // Права администратора
    adminPermissions: [
        PermissionsBitField.Flags.Administrator,
        PermissionsBitField.Flags.ManageGuild
    ]
};