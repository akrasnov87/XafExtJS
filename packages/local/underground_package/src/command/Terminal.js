/**
 * команда для вывода панели для ввода команд
 */
Ext.define('Underground.command.Terminal', {
    extend: 'Underground.command.Base',

    config: {
        /**
         * команда
         */
        cmd: 'terminal',
        /**
         * описание команды
         */
        description: 'Вывод панели для ввода команд. Параметры:<ul>' +
            '<li>start - вывод панели при загрузки приложения</li>' +
            '<li>stop - отменить вывод панели при загрузке</li></ul>'
    },

    privates: {
        /**
         * обработчик команды. Переопределяется
         */
        handler: function (args, callback) {
            ARM.app.getMainView().showConsole();
            if (args && args[0]) {
                switch (args[0]) {
                    case 'start':
                        localStorage.setItem('terminal', true);
                        break;
                    case 'stop':
                        localStorage.removeItem('terminal');
                        break;
                }
            }

            if (typeof callback == 'function')
                callback();
        }
    }
});