/**
 * Класс для отправки сообщений об ошибках на сервер
 */
Ext.define('IServ.diag.SendMessage', {
    singleton: true,
    alternateClassName: ['IServ.SendMessage'],

    /**
     * отправка сообщений на сервер
     * @param url {string} адрес отправки на сервер
     * @param items {any[]} список ошибок
     * @param callback {()=>void} функция обратного вызова
     */
    send: function (url, items, callback) {
        var obj = {
            cordova: IServ.AppInfo.getBrowserName() + ' ver.' + IServ.AppInfo.getBrowserVersion() + ' lang.' + IServ.AppInfo.getLanguage(),
            model: navigator.userAgent,
            platform: IServ.AppInfo.getPlatform(),
            uuid: AuthProvider.isAuthorize() ? AuthProvider.getUserInfo().user_id : 'неизвестно',
            version: IServ.AppInfo.getDeviceVersion(),
            manufacturer: IServ.AppInfo.getDeviceName(),
            isVirtual: false,
            serial: "",
            androidAppVersion: Ext.manifest.version,
            appLocalDebug: Ext.getConf('debug'),
            appLocalTheme: Ext.getConf('theme')
        };

        if (navigator.onLine == true && url &&
            (location.origin.indexOf('http://localhost') < 0 || window['localhostsending'] == true)) {
            if (Array.isArray(items) == true) {
                for (var i = 0; i < items.length; i++) {
                    var error = items[i];
                    for (var j in obj)
                        error[j] = obj[j];
                }
            }

            if (typeof items == 'string')
                obj.text = items;
            var xhr = new XMLHttpRequest();

            xhr.open("POST", url, true)
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            xhr.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status != 200) {
                        console.log('Ошибка отправки отчета. ' + JSON.stringify(error));
                    }

                    if (typeof callback == 'function')
                        callback();
                }
            };

            xhr.send(typeof items == 'string' ? obj : JSON.stringify(items));
        }
    }
});