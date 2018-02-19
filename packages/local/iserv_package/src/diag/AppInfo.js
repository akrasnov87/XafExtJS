Ext.define('IServ.diag.AppInfo', {
    singleton: true,

    alternateClassName: ['IServ.AppInfo'],

    // информация об устройстве
    // (Android или iOS)
    getDeviceName: function () {
        return Ext.os.name;
    },
    // версия OS
    getDeviceVersion: function () {
        return Ext.os.version.version;
    },
    // наименование браузера, его версия
    getBrowserName: function () {
        if (Ext.isChromeMobile)
            return 'Chrome';
        return Ext.browser.name;
    },
    // версия браузера
    getBrowserVersion: function () {
        if (Ext.isChromeMobile) {
            var chrome = navigator.userAgent.match(/Chrome[/]\d[\d.]+/);
            if (chrome && chrome[0]) {
                return chrome[0].split('/')[1];
            }
        }
        return Ext.browser.version.version;
    },
    // регион (ru, en) 
    getLanguage: function () {
        return navigator.language;
    },
    // платформа (x86 или armv7)
    getPlatform: function () {
        return navigator.platform;
    }
});