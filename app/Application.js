/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('ARM.Application', {
    extend: 'Ext.app.Application',

    name: 'ARM',

    stores: [
        'NavigationTree'
    ],

    config: {
        globalParams: null,
        chiter: null
    },

    mainView: 'ARM.view.main.Main',

    defaultToken: 'dashboard',

    constructor: function () {
        this.registryGetter('Configuration', { url: 'resources' });

        ErrorHandler.init();
        var startExtJSMessage = Ext.get('start-extjs');
        if (startExtJSMessage)
            startExtJSMessage.hide();

        this.callParent(arguments);
    },

    listeners: {
        authorized: 'onAuthorized'
    },

    /**
    * метод принудительно переопределен
    */
    onProfilesReady: function () {
        var me = this,
            profiles = me.getProfiles(),
            length = profiles.length,
            current, i, instance;

        for (i = 0; i < length; i++) {
            instance = Ext.create(profiles[i], {
                application: me
            });

            if (instance.isActive() && !current) {
                current = instance;
                me.setCurrentProfile(current);
            }
        }

        if (current) {
            current.init();
        }

        me.preLaunch(function () {
            me.closeSplashScreen();

            me.initControllers();
            me.onBeforeLaunch();
            me.finishInitControllers();
        });
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Обновление приложения', 'Доступна новая версия, перезагрузить страницу?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    },

    launch: function () {
        // двойное нажатие на маске
        DoubleClickByMask.init();

        if (AuthProvider.isAuthorize() == true) {
            AuthProvider.setAuthrizeHeader(AuthProvider.getToken());
            var me = this;
            //DirectMeta.load(function (status) {
            //if (status == 401) {
            //me.redirectTo("lockscreen");
            // } else {
            ARM.app.fireEvent('authorized');
            //}
            //});
        } else {
            // тут нужно вывести форму авторизации
            this.redirectTo("login");
        }
    },

    privates: {
        /**
         * выполняется перед launch
         */
        preLaunch: function (callback) {
            this.loadConfig(callback);
        },

        /**
         * скрывается заставка
         */
        closeSplashScreen: function () {
            var bootloader = Ext.getElementById('bootloader');
            if (bootloader) {
                Ext.get(bootloader).destroy();

                var body = Ext.getBody();
                body.setStyle({
                    'background-color': 'white',
                    'color': 'black'
                });
            }
        },

        /**
        * загрузка настроек
        * @param callback {()=>void} функция обраного вызова
        */
        loadConfig: function (callback) {
            if (this.getConfiguration().isLoaded == true) { // данные уже были загружены
                if (callback)
                    callback();

            } else {
                this.getConfiguration().read(callback);
            }
        },

        /**
         * после авторизации
         */
        onAuthorized: function () {
            this.setChiter(Ext.create('Underground.Chiter'));
            // запускаем диагностику
            Diagnostic.start();
        }
    }
});
