/*
 * консоль для ввода команд
 */
Ext.define('Underground.CommandConsole', {
    extend: 'Ext.panel.Panel',
    xtype: 'view-command-console',
    bodyPadding: 5,

    defaultListenerScope: true,
    collapsible: true,
    closable: true,
    title: 'Командная строка',
    iconCls: 'x-fa fa-terminal',
    viewModel: {
        data: {
            command: ''
        }
    },

    controller: {},

    items: [
        {
            fieldLabel: '~ ',
            labelWidth: 20,
            labelSeparator: '',
            labelStyle: 'padding-top:10px',
            xtype: 'textfield',
            width: '100%',
            emptyText: 'ввести команду и нажать ENTER',
            margin: 0,
            enableKeyEvents: true,
            reference: 'commandfield',
            bind: {
                value: '{command}'
            },
            listeners: {
                keypress: 'onKeyPress'
            },
            allowBlank: false
        }
    ],

    dockedItems: [
        {
            dock: 'right',
            xtype: 'panel',
            layout: {
                type: 'hbox',
                pack: 'start'
            },
            items: [
                {
                    xtype: 'button',
                    iconCls: 'x-fa fa-play',
                    margin: 5,
                    tooltip: 'Выполнить введенную команду',
                    handler: 'onRun'
                }
            ]
        }
    ],

    /*
     * обработчик нажатия на ENTER в поле пользователи
     */
    onKeyPress: function (sender, e, eOpts) {
        if (e.getKey() == e.ENTER) {
            // выполняем команду
            this.onCommand(this.getViewModel().get('command'));
        }
    },

    /*
     * обработчик выполнения команды
     */
    onRun: function () {
        var cmd = this.lookup('commandfield');
        if (cmd.isValid() == true)
            this.onCommand(this.getViewModel().get('command'));
    },

    /*
     * обработчик выполнения команды
     * @param command {string} текст команды
     */
    onCommand: function (command) {
        this.getViewModel().set('command', '');
        ARM.app.getChiter().runCommand('~' + command);
    }
});