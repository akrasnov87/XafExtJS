/*
 * модуль дианостики приложения
 */
Ext.define('Underground.Diagnostic', {
    singleton: true,
    alternateClassName: ['Diagnostic'],

    /**
     * хранение количество выполненых тестов
     */
    successCount: 0,
    /**
     * задания
     */
    tasks: [],
    /**
     * массив сообщений
     */
    messages: [],

    /*
     * начала процесса
     */
    start: function () {
        var me = this;

        this.tasks = [
            this.test
        ];

        function next() {
            if (me.tasks.length == 0) {
                // нужно проверить сообщения об ошибках
                if (me.messages.length > 0) {

                    var list = [];
                    Ext.each(me.messages, function (i) {
                        list.push('<li>' + i + '</li>');
                    });

                    Ext.Msg.show({
                        title: 'Автоматическая диагностика',
                        message: 'При диагностики приложения выявлены следующие проблемы:<ul>' + list + '</li>',
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.WARNING
                    });
                }
                console.log('Диагностика пройдена');
                me.reset();
            } else {
                var task = me.tasks[0];
                me.tasks.shift();
                task(next);
            }
        }

        next();
    },

    /**
     * сбрасываем данные
     */
    reset: function () {
        this.successCount = 0;
        this.tasks = [];
        this.messages = [];
    },

    privates: {

        /*
         * тестовый метод
         * @param callback {()=>void} функция обратного адреса
         */
        test: function (callback) {

            /**
             * если есть ошибка, то заполнить this.messages 
             */

            if (typeof callback == 'function')
                callback();
        }
    }
});