/**
 * обработчик ошибок
 */
Ext.define('IServ.ErrorHandler', {
    alternateClassName: ['ErrorHandler'],
    singleton: true,

    errorSendInterval: null,
    errorSendIntervalTime: 1000,
    errorStack: [],

    /*
     * инициализация
     */
    init: function () {
        var me = this;

        // чтобы перехватить ошибки
        window.onerror = function (errorMsg, url, lineNumber, point, typeError) {
            me.writeErrorItem('Msg:' + errorMsg + ' Url:' + url + ' lineNumber:' + lineNumber + ' point:' + point + ' typeError:' + (typeError && typeError.stack) ? typeError.stack : '');
            me.showMessage(errorMsg);
            // Просто запустить обработчик события по умолчанию.
            return false;
        }
        // перехват ошибок в консоли
        console.error = function (msg) {
            try {
                throw new Error(msg);
            }
            catch (error) {
                stack = error.stack || '';
                me.writeErrorItem('Msg:' + error.message + ' typeError:' + error ? error.stack : '');
            }
        }
    },

    /*
    * запись ошибки в хранилище
    * @param text {string}
    * @param type {string} тип выводимых данных
    */
    writeErrorItem: function (text, type) {
        var item = { msg: text, date: new Date(), type: type };

        if (type == undefined)
            this.sendErrorWithCollect(item);
        this.writeErrorToStorage(item, 'errorreports');
    },

    privates: {
        /**
         * передача сообщения на сервер
         * @param errors {any[]} 
         */
        sendErrorCollection: function (errors) {
            IServ.SendMessage.send(window['errorUrl'], errors);
        },

        getMessageFromError: function (error) {
            if (error.type && error.type.toLowerCase() == 'error' && error.message)
                return error.message || error.message.message;
            return (error && error.message) ? error.message : error;
        },

        /*
         * Вывод сообщения
         * @param error {Error} ошибка
         */
        showMessage: function (error) {
            Ext.Msg.alert('Ошибка', this.getMessageFromError(error));
        },

        /**
         * Записать ошибку в хранилище
         * @param error {any} Ошибка
         */
        writeErrorToStorage: function (item) {
            try {
                var items = this.getReportErrors('errorreports');
                items.push(item);
                localStorage.setItem('errorreports', JSON.stringify(items));
            }
            catch (e) {
                this.clearErrorReportStorate('errorreports');
            }
        },

        /**
         * обработка и отправка ошибок с группировкой
         */
        sendErrorWithCollect: function (error) {
            this.errorStack.push(error);

            if (this.errorSendInterval == null) {
                var me = this;
                this.errorSendInterval = setInterval(function () {
                    clearInterval(me.errorSendInterval);
                    me.errorSendInterval = null;

                    if (me.errorStack.length > 0) {
                        me.sendErrorCollection(me.errorStack);
                        me.errorStack = [];
                    }
                }, this.errorSendIntervalTime);
            }
        },

        /**
         * возвращается список ошибок
         */
        getReportErrors: function () {
            var items = localStorage.getItem('errorreports');
            if (!items) {
                try {
                    localStorage.setItem('errorreports', JSON.stringify([]));
                } catch (e) {
                    this.clearErrorReportStorate();
                }
                items = [];
            } else {
                items = JSON.parse(items);

                if (items.length > 50) {
                    items = items.slice(0, 49);
                    var deleteData = items.slice(49, items.length).filter(function (i) { return i.type == undefined; });

                    for (var i = 0; i < deleteData.length; i++) {
                        this.sendErrorWithCollect(deleteData[i]);
                    }
                }
            }
            return items;
        },

        /*
        * очистка хранилища ошибок
        */
        clearErrorReportStorate: function () {
            localStorage.removeItem('errorreports');
        }
    }
});