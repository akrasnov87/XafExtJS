/**
 * команда для отправки ошибок с локального сайта.
 * Работает только для следующей загрузки
 */
Ext.define('Underground.command.LocalhostSending', {
    extend: 'Underground.command.Base',

    config: {
        /**
         * команда
         */
        cmd: 'localhostsending',
        /**
         * описание команды
         */
        description: 'Разрешить отправку локальных сообщений с ошибками'
    },

    privates: {
        /**
         * обработчик команды. Переопределяется
         */
        handler: function (args, callback) {
            throw new Error('Тестовая ошибка приложения ' + Ext.manifest.name);
            if (typeof callback == 'function')
                callback();
        }
    }
});