/**
 * команда для диагностики системы
 */
Ext.define('Underground.command.Diagnostic', {
    extend: 'Underground.command.Base',

    config: {
        /**
         * команда
         */
        cmd: 'diagnostic',
        /**
         * описание команды
         */
        description: 'Запуск диагности приложения. Позволяет выявить ошибки в настройке'
    },

    privates: {
        /**
         * обработчик команды. Переопределяется
         */
        handler: function (args, callback) {
            Diagnostic.start();
            if (typeof callback == 'function')
                callback();
        }
    }
});