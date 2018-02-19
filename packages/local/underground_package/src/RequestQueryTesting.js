Ext.define('Underground.RequestQueryTesting', {
    extend: 'Ext.FormPanel',
    alternateClassName: ['RequestQueryTesting'],
    xtype: 'requestquerytesting',
    config: {
        layout: 'fit',
        lastError: null,
        /*
        * дополнительные компоненты используемые в системе
        */
        customItems: [],
        /*
        * поля для определения метода
        */
        directMethodProperty: ['action', 'data', 'method', 'tid', 'type']
    },

    initComponent: function () {
        var me = this;
        me.bodyStyle = {
            'border': 'none'
        };
        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                items: [
                    {
                        xtype: 'button',
                        iconCls: 'x-fa fa-play',
                        formBind: true, //only enabled once the form is valid
                        disabled: true,
                        text: 'Выполнить',
                        handler: function (btn) {
                            var request = me.getForm().getValues().request;
                            if (me.isValid(request)) {
                                me.mask('Подождите...');
                                me.run(request, function (result) {
                                    if (result)
                                        me.down('#response').setValue(JSON.stringify(result));
                                    else {
                                        var lastError = me.getLastError();
                                        Ext.Msg.alert('Ошибка', lastError ? lastError : 'Неверный набор данных');
                                        me.setLastError(null);
                                    }
                                    me.unmask();
                                });
                            }
                        }
                    },
                    '->',
                    {
                        text: 'Очистить',
                        iconCls: 'x-fa fa-remove',
                        handler: function () {
                            this.up('form').getForm().reset();
                        }
                    }
                ]
            }
        ];
        me.items = [
            {
                xtype: 'panel',
                width: '50%',
                height: '100%',
                layout: 'hbox',
                border: false,
                defaults: {
                    border: false,
                    height: '100%'
                },

                items: [
                    {
                        xtype: 'panel',
                        width: '50%',
                        items: [
                            {
                                xtype: 'textareafield',
                                name: 'request',
                                scrollable: true,
                                height: '100%',
                                width: '100%',
                                allowBlank: false,
                                validator: function (val) {
                                    return me.isValid(val);
                                },
                                listeners: {
                                    render: function (sender, eOpts) {
                                        me.getCustomItems().push(Ext.create('Ext.tip.ToolTip', {
                                            target: sender.id,
                                            html: 'Данные для запроса'
                                        }));
                                    }
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'panel',
                        width: '50%',
                        items: [
                            {
                                xtype: 'textareafield',
                                name: 'response',
                                scrollable: true,
                                height: '100%',
                                width: '100%',
                                itemId: 'response',
                                readOnly: true,
                                listeners: {
                                    render: function (sender, eOpts) {
                                        me.customItems.push(Ext.create('Ext.tip.ToolTip', {
                                            target: sender.id,
                                            html: 'Результат запроса'
                                        }));
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ];
        this.callParent(arguments);
    },

    /*
     * Валидация введенных данных
     * @param str входная строка
     */
    isValid: function (str) {
        if (!str)
            return false;
        var data;
        try {
            data = JSON.parse(str);
        } catch (exc) {
            return false;
        }
        if (Array.isArray(data)) {
            for (var i = 0; i < data.length; i++) {
                if (!this.isValid(JSON.stringify(data[i]))) {
                    return false;
                }
            }
        } else {
            var compare = 0;
            for (var property in data) {
                if (this.getDirectMethodProperty().filter(function (field) {
                    return field == property;
                }).length != 1) {
                    return false;
                } else {
                    compare++;
                    switch (property) {
                        case 'action':
                            if (typeof data[property] != 'string')
                                return false;
                            break;

                        case 'method':
                            if (typeof data[property] != 'string')
                                return false;
                            break;

                        case 'tid':
                            if (typeof data[property] != 'number')
                                return false;
                            break;

                        case 'type':
                            if (typeof data[property] != 'string')
                                return false;
                            break;
                    }
                }
            }

            if (compare < 5)
                return false;
        }

        return true;
    },

    getProvider: function () {
        return Ext.direct.Manager.providers.items[0];
    },

    /*
     * Преобразование входной строки в требуемый объект
     * @param str входная строка
     * @callback
     */
    argsParser: function (str, callback) {
        var data = JSON.parse(str);
        if (Array.isArray(data))
            return null;
        var provider = this.getProvider();
        var methods = provider.actions[data.action];
        if (methods == null) {
            this.setLastError('В наборе actions не найден ' + data.action);
            return null;
        }
        var method = null;
        for (var i = 0; i < methods.length; i++) {
            if (methods[i].name == data.method) {
                var obj = methods[i];
                Ext.apply(obj, { ordered: true });
                method = new Ext.direct.RemotingMethod(obj);
                break;
            }
        }
        if (method == null) {
            this.setLastError('Не найдено метода ' + data.method + ' в ' + data.action);
            return null;
        }
        var args;
        if (data.data) {
            args = [];
            Ext.each(data.data, function (i) {
                args.push(i);
            });

            args.push(callback);
        } else {
            args = [callback];
        }

        return {
            action: data.action,
            method: method,
            data: args
        }
    },

    /*
     * вызов rpc method'a
     * @param query - результат argsParser 
     * @param fail - функция обратного вызова, для ошибки
     */
    remoteCall: function (query, fail) {
        if (query) {
            var provider = this.getProvider();
            provider.invokeFunction(query.action, query.method, query.data);
        } else {
            if (fail)
                fail();
        }
    },

    /*
     * Выполнение запроса
     * @param str входная строка
     * @param callback
     */
    run: function (str, callback) {
        var data = JSON.parse(str);
        var me = this;
        var result;
        if (Array.isArray(data)) {
            result = [];
            var j = 0;
            Ext.each(data, function (item) {
                me.remoteCall(me.argsParser(JSON.stringify(item), function (r) {
                    j++;
                    result.push(r);
                    if (j == data.length)
                        if (callback)
                            callback(result);
                }), function () {
                    if (callback)
                        callback(null);
                });
            });
        } else {
            me.remoteCall(me.argsParser(str, function (r) {
                if (callback)
                    callback(r);
            }), function () {
                if (callback)
                    callback(null);
            });
        }
    },

    destroy: function () {
        var me = this;
        Ext.each(me.getCustomItems(), function (item) {
            item.destroy();
        });
        this.callParent(arguments);
    }
}); 