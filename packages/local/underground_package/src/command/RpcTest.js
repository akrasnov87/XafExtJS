/**
 * команда для тестирования rpc-методов
 */
Ext.define('Underground.command.RpcTest', {
    extend: 'Underground.command.Base',

    config: {
        /**
         * команда
         */
        cmd: 'rpctest',
        /**
         * описание команды
         */
        description: 'Тестирование запросов к серверу'
    },

    privates: {
        /**
         * обработчик команды. Переопределяется
         */
        handler: function (args, callback) {
            Ext.create('Ext.window.Window', {
                bodyPadding: 10,
                width: '100%',
                height: '100%',
                layout: 'fit',
                closable: true,
                autoShow: true,
                title: 'Тестирование RPC-запросов',
                items: [
                    {
                        xtype: 'requestquerytesting'
                    }
                ]
            });

            if (typeof callback == 'function')
                callback();
        }
    }
});