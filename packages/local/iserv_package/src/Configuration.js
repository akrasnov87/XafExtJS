/**
 * компонент для чтения настроек приложения
*/
Ext.define('IServ.Configuration', {
    alternateClassName: ['Configuration'],

    CONFIG_NAME: 'config',

    url: null,
    data: {},
    isLoaded: false,

    getUserName: function () {
        return localStorage.getItem('login') || 'default';
    },

    /*
     * добавляем настройки
     * @param value {any} данные
     */
    setData: function (value) {
        Ext.apply(this.data, value);
    },

    /*
     * возвращаются данные
     */
    getData: function () {
        return this.data;
    },

    comments: {},

    /**
     * возвращаются комментарии
     */
    getComments: function () {
        return this.comments;
    },

    /**
     * Конструктор
     * параметр url является обязательным
     */
    constructor: function (cfg) {
        Ext.apply(this, cfg);
        if (!cfg.url) {
            throw new Error('Адрес чтения настроек не указан.');
        }
        this.createLocalStorage(this.getConfigName());
        this.callParent(arguments);
    },

    getConfigName: function () {
        return this.CONFIG_NAME + '_' + this.getUserName();
    },

    createLocalStorage: function (name) {
        if (!localStorage.getItem(name))
            localStorage.setItem(name, '{}');
    },

    /**
    * чтение настроек
    * @param callback {()=>void} функция обратного вызова
    */
    read: function (callback) {
        var me = this;
        this.readReferenceConfig(this.url + '/config.json', function () {
            me.isLoaded = true;
            if (typeof callback == 'function')
                callback();
        });
    },

    /**
     * возвращается настройка
     * @param key {string} ключ настройки
     * @param original {boolean} достать оригинальный параметр 
     */
    get: function (key, original) {
        // дополнительная настройка для чтения параметра из localstorage
        if (localStorage.getItem(this.getConfigName()) && !original) {
            var data = JSON.parse(localStorage.getItem(this.getConfigName()));
            if (data[key] != undefined)
                return data[key];
        }

        if (this.getData()) {
            return this.getData()[key];
        } else {
            return null;
        }
    },

    /*
     * установить настройки (локально)
     * @param key {string} ключ настройки
     * @param value {any} значение настройки
     */
    set: function (key, value) {
        if (!localStorage.getItem(this.getConfigName())) {
            this.createLocalStorage(this.getConfigName());
        }
        if (localStorage.getItem(this.getConfigName())) {
            var data = JSON.parse(localStorage.getItem(this.getConfigName()));
            data[key] = value;
            localStorage.setItem(this.getConfigName(), JSON.stringify(data));
        }
    },

    privates: {
        /**
         * чтение связанной конфигурации
         * @param url {string} адрес для чтения настроек
         * @param callback {()=>void} функция обратного вызова
         */
        readReferenceConfig: function (url, callback) {
            var me = this;

            var xhr = new XMLHttpRequest();

            xhr.open('GET', url, true);

            xhr.send();

            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4) return;

                if (xhr.status == 200) {
                    var text = xhr.responseText;
                    var values = null;
                    do {
                        values = /\/\/\/\s*\w+:\s*.+;/gi.exec(text);
                        Ext.each(values, function (item) {
                            var data = item.replace(';', '').replace('///', '').split(':');
                            me.comments[data[0].trim()] = data[1].trim();
                            text = text.replace(item, '');
                        });
                    } while (values);
                    delete me.comments.readme;
                    var tmp = JSON.parse(text);
                    me.setData(tmp);
                    var reference = tmp.theme;
                    if (reference) { // нужно произвести чтение связанной конфигурации
                        me.readReferenceConfig(me.url + '/usersetting/' + reference + '/config.json', function () {
                            if (typeof callback == 'function')
                                callback();
                        });
                    } else {
                        if (typeof callback == 'function')
                            callback();
                    }
                } else {
                    throw new Error('Ошибка чтения файла настроек. ' + xhr.statusText);
                    if (typeof callback == 'function')
                        callback();
                }
            }
        }
    }
});