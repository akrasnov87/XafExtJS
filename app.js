/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'ARM.Application',

    name: 'ARM',

    requires: [
        'IServ.*',
        'ARM.*'
    ]
});

Ext.getCurrentApp = function () {
    if (ARM.app)
        return ARM.app;

    Ext.Error.raise('Приложение не найдено');
}

Ext.getGlobalParams = function (value) {
    return ARM.app.getGlobalParams().getData()[value];
}

/**
 * Вернуть дополнительную информацию припркпляемые к логам при отправке на сервер
 */
Ext.getConf = function (value, original) {
    return ARM.app.getConfiguration().get(value, original);
}

Ext.setConf = function (key, value) {
    return ARM.app.getConfiguration().set(key, value);
}
