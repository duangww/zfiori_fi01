sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "launchpad/model/models"
], function (UIComponent, Device, models) {
    "use strict";

    return UIComponent.extend("launchpad.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            // 调用父类的init方法
            UIComponent.prototype.init.apply(this, arguments);

            // 启用路由
            this.getRouter().initialize();

            // 设置设备模型
            this.setModel(models.createDeviceModel(), "device");
        }
    });
}); 