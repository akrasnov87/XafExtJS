/**
 * Регистрация компонентов для последуюющего из обновления при online/offline режиме
 */
Ext.define('IServ.RefreshComponentRegistry', {
    singleton: true,
    alternateClassName: ['RefreshComponentRegistry'],
    components: [],

    /**
    Регистрация компонента
    @param component {any} компонент
    */
    registry: function (component) {
        if (this.components.filter(function (i) {
            return i.el && i.getId() == component.getId()
        }).length == 0)
            this.components.push(component);
    },

    /**
     * Обновление зарегистрированных представлений
     */
    refreshComponents: function () {
        var me = this;
        var tmp = [];
        Ext.each(this.components, function (cmp) {
            if (cmp.refreshContentView && cmp.el && cmp.el.dom)
                cmp.refreshContentView();
            else {
                tmp.push(cmp);
            }
        });

        // чтобы очистить
        Ext.each(tmp, function (item) {
            me.unRegistry(item);
        });
    },

    /**
     * убрать с регистрации 
     */
    unRegistry: function (component) {
        var tmp = [];
        Ext.each(this.components, function (cmp) {
            if (component.id != cmp.id)
                tmp.push(cmp);
        });

        this.components = tmp;
    }
});