sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("launchpad.controller.Main", {
        onInit: function () {
            // 初始化应用数据
            this._initAppData();
        },

        _initAppData: function () {
            // 应用配置数据
            var oAppData = {
                groups: [
                    {
                        id: "finance",
                        title: "财务应用"
                    },
                    {
                        id: "business",
                        title: "业务应用"
                    }
                ],
                apps: [
                    {
                        id: "zfiori_fi01",
                        title: "财务分析",
                        description: "财务数据可视化分析",
                        icon: "sap-icon://chart",
                        url: "/zfiori_fi01",
                        group: "财务应用"
                    },
                    {
                        id: "other_app",
                        title: "其他应用",
                        description: "其他业务应用",
                        icon: "sap-icon://business-objects-experience",
                        url: "/other_app",
                        group: "业务应用"
                    }
                ]
            };

            // 设置模型
            var oModel = new JSONModel(oAppData);
            this.getView().setModel(oModel);
        },

        onTilePress: function (oEvent) {
            var oTile = oEvent.getSource();
            var sAppUrl = oTile.getCustomData()[0].getValue();
            var sAppTitle = oTile.getTitle();

            // 显示加载消息
            MessageToast.show("正在启动 " + sAppTitle + "...");

            // 在新窗口或iframe中打开应用
            setTimeout(function () {
                window.open(sAppUrl, "_blank");
            }, 500);
        },

        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            // 实现搜索功能
            this._filterApps(sQuery);
        },

        _filterApps: function (sQuery) {
            var oModel = this.getView().getModel();
            var aApps = oModel.getProperty("/apps");
            
            if (!sQuery) {
                // 显示所有应用
                oModel.setProperty("/filteredApps", aApps);
                return;
            }

            // 过滤应用
            var aFilteredApps = aApps.filter(function (app) {
                return app.title.toLowerCase().indexOf(sQuery.toLowerCase()) !== -1 ||
                       app.description.toLowerCase().indexOf(sQuery.toLowerCase()) !== -1;
            });

            oModel.setProperty("/filteredApps", aFilteredApps);
        }
    });
}); 