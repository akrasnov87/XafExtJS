/**
 * класс для работы с командами
 */
Ext.define('Underground.CommandManager', {
    singleton: true,
    alternateClassName: ['CommandManager'],

    commands: {},

    /**
     * регистрация команд
     * @param command {any} комада
     */
    registry: function (command) {
        this.commands[command.getCmd()] = command;
    },

    /**
     * выполнение команды
     * @param cmd {string} команда
     * @param args {any[]} аргументы
     * @param callback {()=>void} функция обратного вызова
     */
    run: function (cmd, args, callback) {
        if (this.commands[cmd]) {
            this.commands[cmd].exec(args, callback);
        }
    },

    /**
     * доступна ли команда для выполнения
     * @param cmd {string} команда
     */
    isCommandExists: function (cmd) {
        if (this.commands[cmd])
            return true;

        return false;
    }
});