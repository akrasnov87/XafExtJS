/*
 * позволяет закрывать ожидания при двойном нажатии на них
 */
Ext.define('ARM.DoubleClickByMask', {
    singleton: true,
    alternateClassName: ['DoubleClickByMask'],

    // период (в милисекундах) между которым считается двойное нажатие
    HACK_DOUBLE_CLICK_PERIOD: 500,

    // дата последнего нажатия
    LAST_CLICK_TIME: 0,

    /*
     * инициализация
     */
    init: function () {
        var me = this;
        Ext.getBody().on('click', function (e, target, eOpts) {
            if (me.LAST_CLICK_TIME != 0 && Date.now() - me.LAST_CLICK_TIME > me.HACK_DOUBLE_CLICK_PERIOD) {
                me.LAST_CLICK_TIME = 0;
            }

            if (me.LAST_CLICK_TIME == 0)
                me.LAST_CLICK_TIME = Date.now();
            else {
                if (Date.now() - me.LAST_CLICK_TIME <= me.HACK_DOUBLE_CLICK_PERIOD) {
                    me.LAST_CLICK_TIME = 0;
                    var box = Ext.get(target).parent();
                    if (box)
                        box.destroy();
                }
            }
        }, this, {
                delegate: '.x-mask-msg'
            });
    }
});