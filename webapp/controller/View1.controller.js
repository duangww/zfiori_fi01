/* global html2canvas */
/** @type {function(HTMLElement, any): Promise<HTMLCanvasElement>} */
var html2canvas;

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

    function (Controller, JSONModel, DateFormat, MessageToast,
        integrationLibrary, UI5Date, ChartFormatter, Format) {
        "use strict";
        return Controller.extend("zfiorifi01.controller.View1", {
            /**
             * 控制器初始化
             * @function onInit
             * @memberof zfiorifi01.controller.View1
             */
            onInit: function () {
                // 显示加载指示器
                this._showLoadingIndicator();
                
                Format.numericFormatter(ChartFormatter.getInstance());
                var formatPattern = ChartFormatter.DefaultPattern;
                var oVizFrame = this.byId("idVizFrame");
                var oVizFrame2 = this.byId("idVizFrame2");
                var oVizFrame3 = this.byId("idVizFrame3");
                var oVizFrame4 = this.byId("idVizFrame4");
                var oVizFrame5 = this.byId("idVizFrame5");
                var oVizFrame6 = this.byId("idVizFrame6");
                var oVizFrame7 = this.byId("idVizFrame7");
                
                // 先设置图表属性
                this._setVizFrameProperties(oVizFrame, formatPattern);
                this._setVizFrameProperties(oVizFrame2, formatPattern);
                this._setVizFrameProperties(oVizFrame3, formatPattern);
                this._setVizFrameProperties(oVizFrame4, formatPattern);
                this._setVizFrameProperties(oVizFrame5, formatPattern);
                this._setVizFrameProperties(oVizFrame6, formatPattern);
                this._setVizFrameProperties(oVizFrame7, formatPattern);
                
                var oPayload = {
                    "it_bukrs": [{
                        "sign": "I",
                        "option": "EQ",
                        "low": "1300",
                        "high": ""
                    }]
                };
                var oView = this.getView();
                var oPopOver = this.getView().byId("idPopOver");
                var oPopOver2 = this.getView().byId("idPopOver2");
                var oPopOver3 = this.getView().byId("idPopOver3");
                var oPopOver4 = this.getView().byId("idPopOver4");
                var oPopOver5 = this.getView().byId("idPopOver5");
                var oPopOver6 = this.getView().byId("idPopOver6");
                var oPopOver7 = this.getView().byId("idPopOver7");
                
                // 等待所有数据加载完成后再初始化控件
                Promise.all([
                    this._getMonthDataAsync(oView, oPayload),
                    this._getWeekDataAsync(oView, oPayload),
                    this._getDayDataAsync(oView)
                ]).then(() => {
                    // 所有数据加载完成，初始化 PopOver
                    this._setoPopOver(oPopOver, oVizFrame, formatPattern);
                    this._setoPopOver(oPopOver2, oVizFrame2, formatPattern);
                    this._setoPopOver(oPopOver3, oVizFrame3, formatPattern);
                    this._setoPopOver(oPopOver4, oVizFrame4, formatPattern);
                    this._setoPopOver(oPopOver5, oVizFrame5, formatPattern);
                    this._setoPopOver(oPopOver6, oVizFrame6, formatPattern);
                    this._setoPopOver(oPopOver7, oVizFrame7, formatPattern);
                    
                    // 隐藏加载指示器
                    this._hideLoadingIndicator();
                    
                    MessageToast.show("数据加载完成！");
                }).catch((error) => {
                    this._hideLoadingIndicator();
                    MessageToast.show("数据加载失败：" + error.message);
                });
            },
            _setVizFrameProperties: function (oVizFrame, formatPattern) {
                // 隐藏标题
                if (oVizFrame) {
                    window.addEventListener("resize", function () {
                        oVizFrame.rerender();
                    });
                    // 使用 setVizProperties 设置标题可见性为 false
                    oVizFrame.setVizProperties({
                        title: {
                            visible: false
                        },
                        plotArea: {
                            dataLabel: {
                                formatString: formatPattern.SHORTFLOAT_MFD2,
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
                        },
                        categoryAxis: {
                            label: {
                                rotation: "45",
                                angle: 45
                            }
                        }
                    });
                }
            },
            onScreenshotAndUpload: function () {
                var oView = this.getView();
                var oIconTabBar = this.byId("idIconTabBar"); // SAPUI5 控件对象
                var domNode = oIconTabBar.getDomRef(); // 这是原生 DOM 节点
                html2canvas(domNode).then(function (canvas) {
                    canvas.toBlob(function (blob) {
                        // 构造FormData
                        var formData = new FormData();
                        formData.append("file", blob, "screenshot.png");

                        // 发送到后端接口
                        //     fetch("https://your-api-endpoint/upload", {
                        //       method: "POST",
                        //       body: formData
                        //     })
                        //     .then(response => response.json())
                        //     .then(data => {
                        //       MessageToast.show("上传成功！");
                        //     })
                        //     .catch(error => {
                        //       MessageToast.show("上传失败！");
                        //     });
                        //   }, "image/png");

                        // 创建一个临时的a标签用于下载
                        var url = URL.createObjectURL(blob);
                        var a = document.createElement("a");
                        a.href = url;
                        a.download = "screenshot.png";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        MessageToast.show("截图已保存到本地！");
                    }, "image/png");
                });
            },
            /**
             * 根据屏幕尺寸设置图表数据
             * @function _setChartDataByScreen
             * @memberof zfiorifi01.controller.View1
             * @param {Array} aData - 原始数据数组
             * @private
             */
            _setChartDataByScreen: function (aData, ModelName) {
                var oModel = this.getView().getModel(ModelName);
                var width = window.innerWidth;
                var aShowData;

                if (width < 900) {
                    // 小屏幕只显示最近4个月
                    aShowData = aData.slice(-4);
                } else {
                    // 大屏幕显示最近8个月
                    aShowData = aData.slice(-7);
                }
                // 设置到新路径，供图表绑定
                switch (ModelName) {
                    case "FiData": oModel.setProperty("/0/chartData", aShowData);
                        break;
                    case "WeekData": oModel.setProperty("/0/chartWeekData", aShowData);
                        break;
                    case "DayData": oModel.setProperty("/0/chartDayData", aShowData);
                        break
                }
            },
            _setoPopOver: function (oPopOver, oVizFrame, formatPattern) {
                oPopOver.connect(oVizFrame.getVizUid());
                oPopOver.setFormatString(formatPattern.STANDARDFLOAT);
            },
            _getMonthData: function (oView, oPayload) {
                $.ajax({
                    url: "/zbak_inf?ACTION=GET_MONTH",
                    method: "POST",
                    contentType: "application/json",
                    // headers: {
                    //     "Authorization": "Basic " + sAuth
                    // },
                    data: JSON.stringify(oPayload),
                    success: (oData) => {
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
                        const oFiData = new JSONModel();
                        oData1[0].data = oData2;
                        oFiData.setData(oData1);
                        oView.setModel(oFiData, "FiData");

                        var oModel = this.getView().getModel("FiData");
                        var aData = oModel.getProperty("/0/data");

                        // 初始渲染时判断屏幕宽度
                        this._setChartDataByScreen(aData, "FiData");
                        // 监听窗口大小变化
                        window.addEventListener("resize", () => {
                            var oModel = this.getView().getModel("FiData");
                            var aData = oModel.getProperty("/0/data");
                            this._setChartDataByScreen(aData, "FiData");
                        });

                    },
                    error: function (jqXHR, sTextStatus, sError) {
                        console.error("错误详情:", jqXHR.responseText);
                    }
                });
            },
            _getWeekData: function (oView, oPayload) {
                $.ajax({
                    url: "/zbak_inf?ACTION=GET_WEEK",
                    method: "POST",
                    contentType: "application/json",
                    // headers: {
                    //     "Authorization": "Basic " + sAuth
                    // },
                    data: JSON.stringify(oPayload),
                    success: (oData) => {
                        //    MessageToast.show("API调用成功");
                        const oWeekData = new JSONModel();
                        const oData1 = JSON.parse(oData);
                        const oData2 = oData1[0].data.map(item => {
                            const weekStr = String(item.week);
                            const year = weekStr.substring(0, 4);
                            const week = weekStr.substring(4, 6);
                            return {
                                ...item,
                                yearWeek: `${year}/${week}`
                            };
                        });
                        oData1[0].data = oData2;
                        oWeekData.setData(oData1);
                        oView.setModel(oWeekData, "WeekData");

                        var oModel = oView.getModel("WeekData");
                        var aData = oModel.getProperty("/0/data");

                        // 初始渲染时判断屏幕宽度
                        this._setChartDataByScreen(aData, "WeekData");
                        // 监听窗口大小变化
                        window.addEventListener("resize", () => {
                            const oModel = this.getView().getModel("WeekData");
                            const aData = oModel.getProperty("/0/data");
                            this._setChartDataByScreen(aData, "WeeData");
                        });

                    },
                    error: function (jqXHR, sTextStatus, sError) {
                        console.error("错误详情:", jqXHR.responseText);
                    }
                });

            },
            _getDayData: function (oView) {
                const yesterday = this._getCurrentDateYYYYMMDD();
                const oPayload1 = {
                    "it_bukrs": [{
                        "sign": "I",
                        "option": "EQ",
                        "low": "1300",
                        "high": ""
                    }],
                    "iv_keydat": yesterday
                };

                $.ajax({
                    url: "/zbak_inf?ACTION=GET_DAY",
                    method: "POST",
                    contentType: "application/json",
                    // headers: {
                    //     "Authorization": "Basic " + sAuth
                    // },
                    data: JSON.stringify(oPayload1),
                    success: (oData) => {
                        //    MessageToast.show("API调用成功");
                        const oDayData = new JSONModel();
                        const oData1 = JSON.parse(oData);
                        oDayData.setData(oData1);
                        oView.setModel(oDayData, "DayData");
                        var oModel = oView.getModel("DayData");
                        var aData = oModel.getProperty("/0/data");

                        // 初始渲染时判断屏幕宽度
                        this._setChartDataByScreen(aData, "DayData");
                        // 监听窗口大小变化
                        window.addEventListener("resize", () => {
                            const oModel = this.getView().getModel("DayData");
                            const aData = oModel.getProperty("/0/data");
                            this._setChartDataByScreen(aData, "DayData");
                        });

                    },
                    error: function (jqXHR, sTextStatus, sError) {
                        console.error("错误详情:", jqXHR.responseText);
                    }
                });

            },
            // 获取当天日期，格式化为yyyymmdd
            _getCurrentDateYYYYMMDD: function () {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1); // 减去1天
                const year = yesterday.getFullYear();
                const month = (yesterday.getMonth() + 1 < 10 ? '0' : '') + (yesterday.getMonth() + 1);
                const day = (yesterday.getDate() < 10 ? '0' : '') + yesterday.getDate();
                return year + month + day;
            },
            _showLoadingIndicator: function () {
                // 显示加载指示器
                var oView = this.getView();
                var oBusyIndicator = this.byId("idBusyIndicator");
                if (oBusyIndicator) {
                    oBusyIndicator.setBusy(true);
                }
                // 或者显示一个简单的加载消息
                MessageToast.show("正在加载数据...");
            },
            _hideLoadingIndicator: function () {
                // 隐藏加载指示器
                var oView = this.getView();
                var oBusyIndicator = this.byId("idBusyIndicator");
                if (oBusyIndicator) {
                    oBusyIndicator.setBusy(false);
                }
            },
            _getMonthDataAsync: function (oView, oPayload) {
                return new Promise((resolve, reject) => {
                    $.ajax({
                        url: "/zbak_inf?ACTION=GET_MONTH",
                        method: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(oPayload),
                        success: (oData) => {
                            try {
                                const oData1 = JSON.parse(oData);
                                const oData2 = oData1[0].data.map(item => {
                                    const month = item.month;
                                    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
                                    return {
                                        ...item,
                                        month: formattedMonth,
                                        yearMonth: item.year + "/" + formattedMonth
                                    };
                                });
                                const oFiData = new JSONModel();
                                oData1[0].data = oData2;
                                oFiData.setData(oData1);
                                oView.setModel(oFiData, "FiData");

                                var oModel = this.getView().getModel("FiData");
                                var aData = oModel.getProperty("/0/data");
                                this._setChartDataByScreen(aData, "FiData");
                                
                                // 监听窗口大小变化
                                window.addEventListener("resize", () => {
                                    var oModel = this.getView().getModel("FiData");
                                    var aData = oModel.getProperty("/0/data");
                                    this._setChartDataByScreen(aData, "FiData");
                                });
                                
                                resolve();
                            } catch (error) {
                                reject(error);
                            }
                        },
                        error: function (jqXHR, sTextStatus, sError) {
                            reject(new Error("月度数据加载失败: " + sError));
                        }
                    });
                });
            },
            _getWeekDataAsync: function (oView, oPayload) {
                return new Promise((resolve, reject) => {
                    $.ajax({
                        url: "/zbak_inf?ACTION=GET_WEEK",
                        method: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(oPayload),
                        success: (oData) => {
                            try {
                                const oWeekData = new JSONModel();
                                const oData1 = JSON.parse(oData);
                                const oData2 = oData1[0].data.map(item => {
                                    const weekStr = String(item.week);
                                    const year = weekStr.substring(0, 4);
                                    const week = weekStr.substring(4, 6);
                                    return {
                                        ...item,
                                        yearWeek: `${year}/${week}`
                                    };
                                });
                                oData1[0].data = oData2;
                                oWeekData.setData(oData1);
                                oView.setModel(oWeekData, "WeekData");

                                var oModel = oView.getModel("WeekData");
                                var aData = oModel.getProperty("/0/data");
                                this._setChartDataByScreen(aData, "WeekData");
                                
                                // 监听窗口大小变化
                                window.addEventListener("resize", () => {
                                    const oModel = this.getView().getModel("WeekData");
                                    const aData = oModel.getProperty("/0/data");
                                    this._setChartDataByScreen(aData, "WeekData");
                                });
                                
                                resolve();
                            } catch (error) {
                                reject(error);
                            }
                        },
                        error: function (jqXHR, sTextStatus, sError) {
                            reject(new Error("周度数据加载失败: " + sError));
                        }
                    });
                });
            },
            _getDayDataAsync: function (oView) {
                return new Promise((resolve, reject) => {
                    const yesterday = this._getCurrentDateYYYYMMDD();
                    const oPayload1 = {
                        "it_bukrs": [{
                            "sign": "I",
                            "option": "EQ",
                            "low": "1300",
                            "high": ""
                        }],
                        "iv_keydat": yesterday
                    };

                    $.ajax({
                        url: "/zbak_inf?ACTION=GET_DAY",
                        method: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(oPayload1),
                        success: (oData) => {
                            try {
                                const oDayData = new JSONModel();
                                const oData1 = JSON.parse(oData);
                                oDayData.setData(oData1);
                                oView.setModel(oDayData, "DayData");
                                var oModel = oView.getModel("DayData");
                                var aData = oModel.getProperty("/0/data");
                                this._setChartDataByScreen(aData, "DayData");
                                
                                // 监听窗口大小变化
                                window.addEventListener("resize", () => {
                                    const oModel = this.getView().getModel("DayData");
                                    const aData = oModel.getProperty("/0/data");
                                    this._setChartDataByScreen(aData, "DayData");
                                });
                                
                                resolve();
                            } catch (error) {
                                reject(error);
                            }
                        },
                        error: function (jqXHR, sTextStatus, sError) {
                            reject(new Error("日度数据加载失败: " + sError));
                        }
                    });
                });
            }
        });
    });