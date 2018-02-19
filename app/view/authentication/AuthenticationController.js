Ext.define('ARM.view.authentication.AuthenticationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authentication',

    /**
     * форма блокировки экрана
     */
    onLockScreenRender: function (sender) {
        sender.getViewModel().set('userid', AuthProvider.getUserName());
    },

    /**
     * авторизация
     */
    onLoginButton: function () {
        var formData = this.getViewModel().getData();
        var me = this;
        var view = this.getView();
        view.mask('');
        AuthProvider.singIn(formData.userid, formData.password, formData.persist, function (result) {
            view.unmask();
            if (result.success == false) {
                Ext.Msg.alert('Ошибка авторизации', result.msg);
            } else {
                DirectMeta.load(function (status) {
                    // теперь нужно запросить информацию о пользователе
                    me.redirectTo('dashboard', true);
                    ARM.app.fireEvent('authorized');
                });
            }
        });
    }
});