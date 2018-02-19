Ext.Base.prototype.registryGetter = function (name, config) {
    var me = this;
    (function (name) {
        me['_' + name] = null;
        me['get' + name] = function () {
            if (!me['_' + name]) {
                me['_' + name] = Ext.create(name, config || {});
            }
            return me['_' + name];
        }
    })(name);
}