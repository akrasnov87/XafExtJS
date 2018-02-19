/**
 * объект для перехвата команд и их выполнения
 */
Ext.define('Underground.Chiter', {
    extend: 'Ext.Component',

    // команда
    command: null,

    constructor: function () {
        this.callParent(arguments);
        var body = Ext.getBody();
        if (body) {
            body.on('keydown', this.onKeyDown, this);
        }
        console.debug('Механизм перехвата кодов включен');

        /**
         * здесь нужно регистрировать команды
         */
        Ext.create('Underground.command.RpcTest').registry();
        Ext.create('Underground.command.ErrorTest').registry();
        Ext.create('Underground.command.LocalhostSending').registry();
        Ext.create('Underground.command.Terminal').registry();
        Ext.create('Underground.command.Diagnostic').registry();
        Ext.create('Underground.command.AuthReset').registry();
        Ext.create('Underground.command.Help').registry();
        Ext.create('Underground.command.Configuration').registry();
    },

    /*
     * выполнения команды
     */
    runCommand: function (command) {
        console.debug(command);
        var cmd = command.replace('~', '');
        var args = cmd.split(' ');
        cmd = args[0];
        if (args.length > 1) {
            args = args.slice(1);
        }
        var me = this;
        if (CommandManager.isCommandExists(cmd) == true) {
            CommandManager.run(cmd, args, function () {
                me.onRunnedCommand();
            });
        }
    },

    destroy: function () {
        Ext.getBody().un('keydown', this.onKeyDown, this);
        this.callParent(arguments);
    },

    privates: {
        /*
         * обработчик выполнения команды
         */
        onRunnedCommand: function () {
            this.command = null;
        },
        /*
         * обработчик нажатия клавиши
         */
        onKeyDown: function (e, t, eOpts) {
            var key = e.getKeyName();
            if (e.keyCode == 192) { // это символ ~
                this.command = '';
            }
            else {
                try {
                    if (key.length == 1 && this.command != null)
                        this.command += key.toLowerCase();
                } catch (ex) {

                }
            }
            if (this.command) {
                this.runCommand(this.command);
            }
        }
    }
});