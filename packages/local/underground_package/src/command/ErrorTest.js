/**
 * команда для тестирования обработки ошибок
 */
Ext.define('Underground.command.ErrorTest', {
    extend: 'Underground.command.Base',

    config: {
        /**
         * команда
         */
        cmd: 'testerror',
        /**
         * описание команды
         */
        description: 'Тестирование оповещения об ошибке'
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