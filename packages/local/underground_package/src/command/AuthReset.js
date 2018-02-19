/**
 * команда для сброса авторизации
 */
Ext.define('Underground.command.AuthReset', {
    extend: 'Underground.command.Base',

    config: {
        /**
         * команда
         */
        cmd: 'authreset',
        /**
         * описание команды
         */
        description: 'Сбросить авторизацию'
    },

    privates: {
        /**
         * обработчик команды. Переопределяется
         */
        handler: function (args, callback) {
            localStorage.setItem('token', '1122');
            AuthProvider.setAuthrizeHeader('tfdsjand');
            if (typeof callback == 'function')
                callback();
        }
    }
});