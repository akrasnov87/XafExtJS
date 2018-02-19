Ext.define('ARM.direct.DirectMeta', {
    singleton: true,
    alternateClassName: ['DirectMeta'],
    /*
     * Загрузка метаданных
     */
    load: function (callback) {
        var me = this;
        Ext.Loader.setPath(Ext.getConf('REMOTE_NAMESPACE'), Ext.String.format(Ext.getConf('REMOTE_DATA_URL'), Ext.getConf('REMOTING_ADDRESS')));
        this.setDirectProvider(function (response) {
            if (callback)
                callback(response.status);
        });
    },

    /*
    * требуется загружать мета-описание
    */
    isLoadMeta: function () {
        var ns = Ext.getConf('REMOTE_NAMESPACE');
        return AuthProvider.isAuthorize() == true && !window[ns];
    },

    privates: {
        /*
        * Установка параметров для Ext.Direct
        * @param callback { () => void } функция обратного вызова
        */
        setDirectProvider: function (callback) {
            var me = this;

            Ext.Ajax.request({
                url: Ext.String.format(Ext.getConf('RPC.REMOTING_API'), Ext.getConf('REMOTING_ADDRESS')),

                success: function (response, opts) {
                    var text = response.responseText;
                    var data = JSON.parse(text);

                    if (!data.meta || data.meta.success === true) {
                        data.url = Ext.String.format(Ext.getConf('RPC_URL'), Ext.getConf('REMOTING_ADDRESS'));
                        me.createDirect(data);
                    }

                    if (callback)
                        callback(response);
                },

                failure: function (response, opts) {
                    if (typeof callback == 'function')
                        callback(response);
                    if (response.status != 401)
                        throw new Error('Ошибка при чтение мета данных. ' + response.statusText);
                }
            });
        },

        /*
         * Создание Direct'а
         * @param data {any} данные считанные из настроек
         */
        createDirect: function (data) {
            Ext.ns(Ext.getConf('REMOTE_NAMESPACE'));
            Ext.Direct.addProvider(data);
        }
    }
});