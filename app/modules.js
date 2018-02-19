/**
 * Проверка на доступность модуля
 * @param name {string} имя модуля
 */
Ext.existModule = function (name) {
    return Ext.modules[name];
}