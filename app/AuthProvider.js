/*
 * провайдер для работы с авторизацией
 */
Ext.define('ARM.AuthProvider', {
    alternateClassName: ['AuthProvider'],

    singleton: true,

    /*
     * имя пользователя
     */
    getUserName: function () {
        return localStorage.getItem('login');
    },

    //проверка находится ли в системе пользователь
    isAuthorize: function () {
        if (localStorage.getItem('isAuthorize') === 'true')
            return true;

        return false;
    },

    /* аутентификация (добавление данных о пользователе в хранилище)
    *  @param token - токен
    *  @param login - логин пользователя
    *  @param rememberMe - значение поля "запомнить меня"
    *  @param link {string} идентификатор пользователя
    *  @param roles {string} список ролей
    */
    setAuthorize: function (token, login, rememberMe, link, roles) {
        if (token) {
            localStorage.setItem('isAuthorize', true);
            localStorage.setItem('token', token);
            localStorage.setItem('token-date', new Date());
            if (rememberMe != undefined)
                localStorage.setItem('rememberMe', rememberMe == 'on' ? true : rememberMe);
            else
                localStorage.setItem('rememberMe', false);
            localStorage.setItem('login', login);
            if (link)
                localStorage.setItem('user_id', link);

            if (roles)
                localStorage.setItem('roles', roles);
        } else {
            localStorage.setItem('isAuthorize', false);
            localStorage.setItem('token', '');
            localStorage.setItem('token-date', '');
            localStorage.setItem('rememberMe', false);
            localStorage.setItem('login', '');
            localStorage.setItem('user_id', '');
            localStorage.setItem('roles', '');
        }
    },

    /*
    * возвращается токен авторизации
    */
    getToken: function () {
        return localStorage.getItem('token');
    },

    /**
     * возвращается информация о пользователе
     */
    getUserInfo: function () {
        return {
            user_id: localStorage.getItem('user_id'),
            roles: localStorage.getItem('roles')
        }
    },

    /* при ajax-запросе добавляет в header данные об авторизации
    *  @param value - значения
    */
    setAuthrizeHeader: function (value) {
        Ext.Ajax.setDefaultHeaders({
            "Authorization": "Token " + value
        });
    },

    /* вход в систему
    *  @param login - логин
    *  @param password - пароль
    *  @param rememberMe - значение поля "запомнить меня"
    *  @param callback - функция обратного вызова
    */
    singIn: function (login, password, rememberMe, callback) {
        if (Ext.getConf("auth")) {
            this.sendPassToServer(login, password, rememberMe, login, callback);;
        }
        else {
            Ext.Error.raise('В конфигурации не указан "auth"');
        }
    },

    /*
    * выход из системы
    */
    singOut: function () {
        this.setAuthorize();
        this.setAuthrizeHeader('');
    },

    privates: {
        /**
        *   авторизация защищенными ключами
        */
        sendPassToServer: function (_login, _password, rememberMe, login, callback) {
            /**
             * в production нужно поменять
             */

            this.setAuthorize('token', 'test', true, 'user_id', 'admin');
            this.setAuthrizeHeader('token');
            callback({ success: true, token: 'token' });
        },
        /* 
        * получить URL для авторизации
        */
        getAuthUrl: function () {
            return Ext.String.format(Ext.getConf('RPC_URL').replace('/rpc', '/auth'), Ext.getConf('REMOTING_ADDRESS'));
        }
    }
});