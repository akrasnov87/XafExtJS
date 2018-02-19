Ext.define('ARM.direct.proxy.Direct', {
    extend: 'Ext.data.proxy.Direct',
    alias: 'proxy.itdirect',

    /*
     * Метод для проверки запроса на success:true
     */
    isSuccess: function (response) {
        if (response.meta && response.meta.success === false)
            return false;
        else
            return true;
    },

    processResponse: function (success, operation, request, response) {
        if (success == true) {
            if (this.isSuccess(response) == false) {
                throw new Error(response.meta.fullMsg);
            }
        } else {
            var xhr = response.xhr;
            if (xhr.status == 401) {
                // тут нужно открыть окно с авторизацией
                ARM.app.redirectTo("lockscreen");
            }
        }

        this.callParent(arguments);
    }
}); 