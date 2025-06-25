sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/ui/integration/library",
    "sap/ui/core/date/UI5Date",
    "sap/viz/ui5/format/ChartFormatter",
    'sap/viz/ui5/api/env/Format'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, DateFormat, MessageToast, 
              integrationLibrary, UI5Date,ChartFormatter,Format) {
        "use strict";
        return Controller.extend("zfiorifi01.controller.View1", {
            onInit: function () {
            Format.numericFormatter(ChartFormatter.getInstance());
            var formatPattern = ChartFormatter.DefaultPattern;
                var oVizFrame = this.byId("idVizFrame");
                // 隐藏标题
                if (oVizFrame) {
                    window.addEventListener("resize", function() {
                    oVizFrame.rerender();
                    });
                    // 使用 setVizProperties 设置标题可见性为 false
                    oVizFrame.setVizProperties({
                        title: {
                            visible: false
                        },
                        plotArea: {
                            dataLabel: {
                                formatString:formatPattern.SHORTFLOAT_MFD2,
                                visible: false
                            }
                        },
                        valueAxis: {
                            label: {
                                formatString: formatPattern.SHORTFLOAT,
                                visible: true
                            },
                            title: {
                                visible: false
                            }
                        }
                    });
                }
                var cardManifests = new JSONModel(),
                    homeIconUrl = sap.ui.require.toUrl("zfiorifi01/images/CompanyLogo.png"),
                    date = DateFormat.getDateInstance({ style: "long" }).format(UI5Date.getInstance());

                cardManifests.loadData(sap.ui.require.toUrl("zfiorifi01/model/cardManifests.json"));

                this.getView().setModel(cardManifests, "manifests");
                this.getView().setModel(new JSONModel({
                    homeIconUrl: homeIconUrl,
                    date: date
                }));
                var oFiData = new JSONModel();
                 // 设置 Basic Auth 用户名和密码
                // var sUser = "";
                // var sPassword = "";
                 // 构建 Authorization header 值
                // var sAuth = btoa(sUser + ":" + sPassword);;
                var oPayload = {
                    "it_bukrs": [{
                        "sign": "I",
                        "option": "EQ",
                        "low": "1300",
                        "high": ""
                    }]
                };
                var oView = this.getView();
                $.ajax({
                    url: "/zbak_inf?ACTION=GET_MONTH",
                    method: "POST",
                    contentType: "application/json",
                    // headers: {
                    //     "Authorization": "Basic " + sAuth
                    // },
                    data: JSON.stringify(oPayload),
                    success: (oData)=> {
                        //    MessageToast.show("API调用成功");
                        const oData1 = JSON.parse(oData);
                        const oData2 = oData1[0].data.map(item => {
                            const month = item.month;
                            const formattedMonth = month < 10 ? `0${month}` : `${month}`;
                            return {
                                ...item,
                                month: formattedMonth,  // 将 month 改为字符串格式
                                yearMonth: item.year + "/" + formattedMonth
                            };
                        })
                        oData1[0].data = oData2;
                        oFiData.setData(oData1);
                        oView.setModel(oFiData, "FiData");
                        console.log(oFiData.getData());
                       
                        var oModel = this.getView().getModel("FiData");
                        var aData = oModel.getProperty("/0/data");
                    
                        // 初始渲染时判断屏幕宽度
                        this._setChartDataByScreen(aData);
                    
                        // 监听窗口大小变化
                        window.addEventListener("resize", () => {
                            var oModel = this.getView().getModel("FiData");
                            var aData = oModel.getProperty("/0/data");
                            this._setChartDataByScreen(aData);
                        });
                    },
                    error: function (jqXHR, sTextStatus, sError) {
                        console.error("错误详情:", jqXHR.responseText);
                    }
                });

            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(formatPattern.STANDARDFLOAT);
            },
            _setChartDataByScreen: function(aData) {
                var oModel = this.getView().getModel("FiData");
                var width = window.innerWidth;
                var aShowData;
            
                if (width < 900) {
                    // 小屏幕只显示最近4个月
                    aShowData = aData.slice(-4);
                } else {
                    // 大屏幕显示最近10个月
                    aShowData = aData.slice(-10);
                }
                // 设置到新路径，供图表绑定
                oModel.setProperty("/0/chartData", aShowData);
            }
        });
    });