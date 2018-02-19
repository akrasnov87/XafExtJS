/**
 * базовый компонент для команд
 */
Ext.define('Underground.command.Base', {
    extend: 'Ext.Component',

    config: {
        /**
         * команда
         */
        cmd: '',
        /**
         * описание команды
         */
        description: ''
    },

    /**
     * регистрация команды
     */
    registry: function () {
        CommandManager.registry(this);
    },

    /**
     * выполнение комнады
     * @param args {any[]} аргументы для команды
     * @param callback {any[]} обработчик завершения выполнения команды
     */
    exec: function (args, callback) {
        if (this.getCmd()) {
            console.debug('Выполнение команды ' + (this.getDescription() || this.getCmd()));
            this.handler(args, callback);
        }
    },

    privates: {
        /**
         * обработчик команд.
         * Требуется переопределять
         * @param args {any[]} аргументы
         * @param callback {any[]} обработчик завершения выполнения команды
         */
        handler: function (args, callback) {

        }
    }
});