/**
 * команда вывода конфигурации
 */
Ext.define('Underground.command.Configuration', {
    extend: 'Underground.command.Base',

    config: {
        /**
         * команда
         */
        cmd: 'config',
        /**
         * описание команды
         */
        description: 'Вывод конфигурации системы'
    },

    privates: {
        /**
         * обработчик команды. Переопределяется
         */
        handler: function (args, callback) {

            var items = [];

            var config = ARM.app.getConfiguration();
            var data = config.getData();
            var comments = config.getComments();

            for (var i in data) {
                items.push({
                    name: i,
                    description: comments[i] || 'комментарий не указан',
                    value: data[i]
                });
            }

            Ext.create('Ext.window.Window', {
                layout: 'fit',
                width: '50%',
                height: '50%',
                modal: true,
                closable: true,
                autoShow: true,
                maximizable: true,
                title: 'Настройки системы',
                iconCls: 'x-fa fa-cog',
                items: [
                    {
                        xtype: 'grid',
                        disableSelection: true,
                        store: Ext.create('Ext.data.Store', {
                            data: items,
                            autoLoad: true
                        }),
                        columns: [{
                            text: 'Наименование',
                            dataIndex: 'name',
                            width: 200
                        },
                        {
                            text: 'Описание',
                            dataIndex: 'description',
                            flex: 1
                        }, {
                            text: 'Значение',
                            width: 300,
                            dataIndex: 'value'
                        }]
                    }
                ]
            });

            if (typeof callback == 'function')
                callback();
        }
    }
});