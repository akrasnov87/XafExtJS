/**
 * команда вывода справочной информации
 */
Ext.define('Underground.command.Help', {
    extend: 'Underground.command.Base',

    config: {
        /**
         * команда
         */
        cmd: 'help',
        /**
         * описание команды
         */
        description: 'Вывод справочной информации'
    },

    privates: {
        /**
         * обработчик команды. Переопределяется
         */
        handler: function (args, callback) {
            // нужно достать список команд
            var commands = CommandManager.commands;
            var items = [];

            for (var i in commands) {
                items.push({
                    name: commands[i].getCmd(),
                    description: commands[i].getDescription()
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
                title: 'Справка',
                iconCls: 'x-fa fa-question',
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
                        }, {
                            text: 'Описание',
                            flex: 1,
                            dataIndex: 'description'
                        }, {
                            xtype: 'actioncolumn',
                            width: 30,
                            menuDisabled: true,
                            sortable: false,

                            items: [{
                                iconCls: 'x-fa fa-terminal',
                                handler: function (grid, rowIndex, colIndex, btn, e, record) {
                                    CommandManager.run(record.get('name'), []);
                                }
                            }]
                        }]
                    }
                ]
            });

            if (typeof callback == 'function')
                callback();
        }
    }
});