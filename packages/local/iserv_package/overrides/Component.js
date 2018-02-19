Ext.define('IServ.overrides.Component', {
    override: 'Ext.Component',

    config: {
        /**
         * список обязательных модулей которые должны быть подключены прежде чем компонент будет использоватся
         */
        requireModules: [],
        /**
         * регистрация компонента для дальнейшего массого обновления
         * 
         */
        refreshComponent: false
    },

    initialize: function () {
        // массовое обновление компонентов
        if (this.getRefreshComponent() == true) {
            RefreshComponentRegistry.registry(this);
        }
        /**
         * тут делаем проверку на доступность модулей, которые должны быть обязательными
         */
        var existsRequireModules = this.isExistsRequireModules();
        if (existsRequireModules == false) {
            this.setHidden(true);
        }
        this.callParent(arguments);
    },

    mask: function (msg, msgCls, elHeight) {
        arguments[0] = msg || 'Обработка...';
        this.callParent(arguments);
    },

    /**
     * переопределена
     */
    setHidden: function (value) {
        var existsRequireModules = this.isExistsRequireModules();
        if (existsRequireModules == false)
            value = true;
        this.callParent(arguments);
    },

    privates: {
        /**
         * доступны ли все обязательные модули
         */
        isExistsRequireModules: function () {
            var modules = this.getRequireModules();
            if (modules.length > 0) {
                for (var i = 0; i < modules.length; i++) {
                    if (Ext.existModule(modules[i]) != true) {
                        return false;
                    }
                }
            }

            return true;
        }
    }
});