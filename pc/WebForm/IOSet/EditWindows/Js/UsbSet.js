var webConfigXmlObj = parent.parent.webConfigXmlObj;
var serverIdx;
var hashMapNmea = new HashMap();
$(document).ready(function () {
    serverIdx = request.QueryString("serverIdx");
    initCombobox(); //初始化下拉框
    getNetServerStatus(serverIdx); //获取连接状态
    getNetServerPara(serverIdx); //获取服务器参数

    bindDiffOutputTypeSelect(serverIdx); //绑定差分输出格式下拉框
    bindRawDataSe(serverIdx); //绑定原始数据
    bindHcpppDataSe(serverIdx); //绑定HCPPP数据
    bindEphemerisData(serverIdx); //绑定星历数据
    getAutoConnectData(serverIdx); //获取自动连接值

    getRegisterExpired(); //获取是否过期
    $("#seAutoConnect").click(function(){
       if($("#seAutoConnect").attr("checked")=="checked"){
       setAutoCon(true);
       }
       else{
       setAutoCon(false);
       }
   });//点击自动连接，设置自动连接



});
var registerExpired = false;
//获取是否过期
function getRegisterExpired() {
    var urlForRegisterTimeGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("registerTimeGet").text());
    if (urlForRegisterTimeGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForRegisterTimeGet,
        data: {
            "urlStringId": getUrlIdString()
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            if (data.expire) {
                registerExpired = true;
            }
        }
    });
}
//初始化下拉框
function initCombobox() {
    //初始化连接协议
    var dataArray = [];
    webConfigXmlObj.find("serverType3").children().each(function () {
        var jsonItem = { label: $(this).text(), value: this.tagName };
        dataArray.push(jsonItem);
    });
    $("#seServiceType").combobox({
        valueField: 'value',
        textField: 'label',
        onSelect: function () {
            var linkType = $("#seServiceType").combobox("getValue");
            if (linkType == "NETSERVER_TYPE__TCP") {
                showControl(false);
            } else {
                showControl(true);
            }
        },
        data: dataArray
    });   
    //初始化差分输出格式下拉框
    if (parent.parent.GnssBoards[0] == "GNSS_BOARD_TYPE__P307") {
        var dataArray = [];
        var jsonItemClose = { label: parent.parent.langXmlObj.find("DAT_FRQ_OFF").text(), value: "DAT_FRQ_OFF" };
        dataArray.push(jsonItemClose);
        webConfigXmlObj.find("diffOutputTypeP307").find("item").each(function () {
            var jsonItem = { label: $(this).text(), value: $(this).attr("value") };
            dataArray.push(jsonItem);
        });
        $("#seDiffData").combobox({
            valueField: 'value',
            textField: 'label',
            data: dataArray
        });
    } else if (parent.parent.GnssBoards[0] == "GNSS_BOARD_TYPE__OEM628") {
        var dataArray = [];
        var jsonItemClose = { label: parent.parent.langXmlObj.find("DAT_FRQ_OFF").text(), value: "DAT_FRQ_OFF" };
        dataArray.push(jsonItemClose);
        webConfigXmlObj.find("diffOutputType628E").find("item").each(function () {
            var jsonItem = { label: $(this).text(), value: $(this).attr("value") };
            dataArray.push(jsonItem);
        });
        $("#seDiffData").combobox({
            valueField: 'value',
            textField: 'label',
            data: dataArray
        });
    } else {
        var dataArray = [];
        var jsonItemClose = { label: parent.parent.langXmlObj.find("DAT_FRQ_OFF").text(), value: "DAT_FRQ_OFF" };
        dataArray.push(jsonItemClose);
        webConfigXmlObj.find("diffOutputType").find("item").each(function () {
            var jsonItem = { label: $(this).text(), value: $(this).attr("value") };
            dataArray.push(jsonItem);
        });
        $("#seDiffData").combobox({
            valueField: 'value',
            textField: 'label',
            data: dataArray
        });
    }
    //初始化原始数据
    var dataArrayRaw = [];
    if (parent.parent.product_model == "HC_PRODUCT_MODEL__N72") {//N72
        if (parent.parent.GnssBoards.length == 2) {//双板卡
            webConfigXmlObj.find("datRawDouble").children().each(function () {
                var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).text() };
                dataArrayRaw.push(jsonItem);
            });
        } else {
            if (parent.parent.GnssBoards[0] == "GNSS_BOARD_TYPE__BD970") {
                webConfigXmlObj.find("datRawBD970").children().each(function () {
                    var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).text() };
                    dataArrayRaw.push(jsonItem);
                });
            } else if (parent.parent.GnssBoards[0] == "GNSS_BOARD_TYPE__UB370" || parent.parent.GnssBoards[0] == "GNSS_BOARD_TYPE__UB380") {
                webConfigXmlObj.find("datRaw").children().each(function () {
                    var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).text() };
                    dataArrayRaw.push(jsonItem);
                });
            }
        }
        //webConfigXmlObj.find("datRawDouble").children().each(function () {
        //    var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).text() };
        //    dataArrayRaw.push(jsonItem);
        //});
    } else { //I80
        if (parent.parent.GnssBoards[0] == "GNSS_BOARD_TYPE__P307") {
            webConfigXmlObj.find("datRawp307628").children().each(function () {
                var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).text() };
                dataArrayRaw.push(jsonItem);
            });
        } else if (parent.parent.GnssBoards[0] == "GNSS_BOARD_TYPE__OEM628") {//datRawp307628
            webConfigXmlObj.find("datRawp307628").children().each(function () {
                var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).text() };
                dataArrayRaw.push(jsonItem);
            });
        } else {
            webConfigXmlObj.find("datRaw").children().each(function () {
                var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).text() };
                dataArrayRaw.push(jsonItem);
            });
        }
    }

    $("#seInitialData").combobox({
        valueField: 'value',
        textField: 'label',
        data: dataArrayRaw
    });
    //初始化HCPPP数据
    var dataArrayRaw2 = [];
    if (parent.parent.GnssBoards[0] == "GNSS_BOARD_TYPE__P307") {
        webConfigXmlObj.find("datList3").children().each(function () {//频率和GA一样 最大5Hz
            var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).text() };
            dataArrayRaw2.push(jsonItem);
        });
    } else if (parent.parent.GnssBoards[0] == "GNSS_BOARD_TYPE__OEM628") {
        webConfigXmlObj.find("datList3").children().each(function () {//频率和GA一样
            var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).text() };
            dataArrayRaw2.push(jsonItem);
        });
    } else {

        webConfigXmlObj.find("datGPGA").children().each(function () {//频率和GA一样
            var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).text() };
            dataArrayRaw2.push(jsonItem);
        });
    }

    $("#seHCPPPData").combobox({
        valueField: 'value',
        textField: 'label',
        data: dataArrayRaw2
    });

    //初始化星历数据
    var dataArrayEp = [];
    var jsonItem1 = { label: parent.parent.langXmlObj.find("DAT_FRQ_OFF").text(), value: "DAT_FRQ_OFF" };
    dataArrayEp.push(jsonItem1);
    var jsonItem2 = { label: parent.parent.langXmlObj.find("DAT_FRQ_AUTO").text(), value: "DAT_FRQ_AUTO" };
    dataArrayEp.push(jsonItem2);

    $("#seEphemerisData").combobox({
        valueField: 'value',
        textField: 'label',
        data: dataArrayEp
    });
    //初始化Nmea数据类型和值
    var dataArrayNmeaType = [];
    if (parent.parent.product_model == "HC_PRODUCT_MODEL__N72") {//N72
        if (parent.parent.GnssBoards.length == 2) {//双板卡
            webConfigXmlObj.find("nmea0183").children().each(function () {
                var jsonItem = { label: $(this).text(), value: $(this).attr("id") };
                dataArrayNmeaType.push(jsonItem);
                bindHashMapValue(jsonItem.value);
            });

            $("#seNmeaType").combobox({
                valueField: 'value',
                textField: 'label',
                onSelect: function () {
                    var nmeaTypeValue = $("#seNmeaType").combobox("getValue");
                    var nmeaTypeText = $("#seNmeaType").combobox("getText");
                    $("#seNmeaType").combobox("setValue", nmeaTypeValue);
                    $("#seNmeaType").combobox("setText", nmeaTypeText);
                    initNmeaValueCombon72bd970(nmeaTypeValue);
                },
                data: dataArrayNmeaType
            });
            var data = $("#seNmeaType").combobox("getData");
            if (data.length > 0) {
                $("#seNmeaType").combobox("select", data[0].value);
            }
        } else {//单板卡 
            if (parent.parent.GnssBoards[0] == "GNSS_BOARD_TYPE__BD970") {
                webConfigXmlObj.find("nmea0183bd970bd930").children().each(function () {
                    var jsonItem = { label: $(this).text(), value: $(this).attr("id") };
                    dataArrayNmeaType.push(jsonItem);
                    bindHashMapValue(jsonItem.value);
                });

                $("#seNmeaType").combobox({
                    valueField: 'value',
                    textField: 'label',
                    onSelect: function () {
                        var nmeaTypeValue = $("#seNmeaType").combobox("getValue");
                        var nmeaTypeText = $("#seNmeaType").combobox("getText");
                        $("#seNmeaType").combobox("setValue", nmeaTypeValue);
                        $("#seNmeaType").combobox("setText", nmeaTypeText);
                        initNmeaValueCombon72bd970(nmeaTypeValue);
                    },
                    data: dataArrayNmeaType
                });
                var data = $("#seNmeaType").combobox("getData");
                if (data.length > 0) {
                    $("#seNmeaType").combobox("select", data[0].value);
                }
            } else if (parent.parent.GnssBoards[0] == "GNSS_BOARD_TYPE__UB370" || parent.parent.GnssBoards[0] == "GNSS_BOARD_TYPE__UB380") {
                webConfigXmlObj.find("nmea0183ub370").children().each(function () {
                    var jsonItem = { label: $(this).text(), value: $(this).attr("id") };
                    dataArrayNmeaType.push(jsonItem);
                    bindHashMapValue(jsonItem.value);
                });

                $("#seNmeaType").combobox({
                    valueField: 'value',
                    textField: 'label',
                    onSelect: function () {
                        var nmeaTypeValue = $("#seNmeaType").combobox("getValue");
                        var nmeaTypeText = $("#seNmeaType").combobox("getText");
                        $("#seNmeaType").combobox("setValue", nmeaTypeValue);
                        $("#seNmeaType").combobox("setText", nmeaTypeText);
                        initNmeaValueCombon72(nmeaTypeValue);
                    },
                    data: dataArrayNmeaType
                });
                var data = $("#seNmeaType").combobox("getData");
                if (data.length > 0) {
                    $("#seNmeaType").combobox("select", data[0].value);
                }
            }
        }
    } else {//I80 
        if (parent.parent.GnssBoards[0] == "GNSS_BOARD_TYPE__P307") {
            webConfigXmlObj.find("nmea0183_P307_I70").children().each(function () {
                var jsonItem = { label: $(this).text(), value: $(this).attr("id") };
                dataArrayNmeaType.push(jsonItem);
                bindHashMapValue(jsonItem.value);
            });

            $("#seNmeaType").combobox({
                valueField: 'value',
                textField: 'label',
                onSelect: function () {
                    var nmeaTypeValue = $("#seNmeaType").combobox("getValue");
                    var nmeaTypeText = $("#seNmeaType").combobox("getText");
                    $("#seNmeaType").combobox("setValue", nmeaTypeValue);
                    $("#seNmeaType").combobox("setText", nmeaTypeText);
                    initNmeaValueComboi70P307(nmeaTypeValue);
                },
                data: dataArrayNmeaType
            });
            var data = $("#seNmeaType").combobox("getData");
            if (data.length > 0) {
                $("#seNmeaType").combobox("select", data[0].value);
            }
        } else if (parent.parent.GnssBoards[0] == "GNSS_BOARD_TYPE__OEM628") {
            webConfigXmlObj.find("nmea0183_628E_I70").children().each(function () {
                var jsonItem = { label: $(this).text(), value: $(this).attr("id") };
                dataArrayNmeaType.push(jsonItem);
                bindHashMapValue(jsonItem.value);
            });

            $("#seNmeaType").combobox({
                valueField: 'value',
                textField: 'label',
                onSelect: function () {
                    var nmeaTypeValue = $("#seNmeaType").combobox("getValue");
                    var nmeaTypeText = $("#seNmeaType").combobox("getText");
                    $("#seNmeaType").combobox("setValue", nmeaTypeValue);
                    $("#seNmeaType").combobox("setText", nmeaTypeText);
                    initNmeaValueComboi70628E(nmeaTypeValue);
                },
                data: dataArrayNmeaType
            });
            var data = $("#seNmeaType").combobox("getData");
            if (data.length > 0) {
                $("#seNmeaType").combobox("select", data[0].value);
            }
        } else {
            webConfigXmlObj.find("nmea0183").children().each(function () {
                var jsonItem = { label: $(this).text(), value: $(this).attr("id") };
                dataArrayNmeaType.push(jsonItem);
                bindHashMapValue(jsonItem.value);
            });

            $("#seNmeaType").combobox({
                valueField: 'value',
                textField: 'label',
                onSelect: function () {
                    var nmeaTypeValue = $("#seNmeaType").combobox("getValue");
                    var nmeaTypeText = $("#seNmeaType").combobox("getText");
                    $("#seNmeaType").combobox("setValue", nmeaTypeValue);
                    $("#seNmeaType").combobox("setText", nmeaTypeText);
                    initNmeaValueComboi80(nmeaTypeValue);
                },
                data: dataArrayNmeaType
            });
            var data = $("#seNmeaType").combobox("getData");
            if (data.length > 0) {
                $("#seNmeaType").combobox("select", data[0].value);
            }
        }
    }
    //初始化数据转发类型和值  label: parent.parent.langXmlObj.find("DAT_FRQ_OFF").text(), value: "DAT_FRQ_OFF" 
    var dataArrayNmeaType111 = [];
    webConfigXmlObj.find("dataTransfer").children().each(function () {
        var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).attr("id") };
        dataArrayNmeaType111.push(jsonItem);
        bindHashMapValue(jsonItem.value);
    });

    $("#seDataType").combobox({
        valueField: 'value',
        textField: 'label',
        onSelect: function () {
            var nmeaTypeValue = $("#seDataType").combobox("getValue");
            var nmeaTypeText = $("#seDataType").combobox("getText");
            $("#seDataType").combobox("setValue", nmeaTypeValue);
            $("#seDataType").combobox("setText", nmeaTypeText);
            initDataValue(nmeaTypeValue);
        },
        data: dataArrayNmeaType111
    });
    var data = $("#seDataType").combobox("getData");
    if (data.length > 0) {
        $("#seDataType").combobox("select", data[0].value);
    }
}

function initDataValue(nmeaType) {
    var dataArrayNmeaValue = [];
    webConfigXmlObj.find("datListData").children().each(function () {
        var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).text() };
        dataArrayNmeaValue.push(jsonItem);
    });
    $("#seDataValue").combobox({
        valueField: 'value',
        textField: 'label',
        onSelect: function () {
            var nmeaType = $("#seDataType").combobox("getValue");
            var nmeaValue = $("#seDataValue").combobox("getValue");
            hashMapNmea.put(nmeaType, nmeaValue);
        },
        data: dataArrayNmeaValue
    });
    $("#seDataValue").combobox("select", hashMapNmea.get(nmeaType));
}
function initNmeaValueCombon72bd970(nmeaType) {
    var dataArrayNmeaValue = [];
    if (nmeaType == "DAT_ID_GSV") {
        webConfigXmlObj.find("datList1").children().each(function () {
            var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).text() };
            dataArrayNmeaValue.push(jsonItem);
        });
    } else {
        webConfigXmlObj.find("datList1").children().each(function () {
            var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).text() };
            dataArrayNmeaValue.push(jsonItem);
        });
    }
    $("#seNmeaValue").combobox({
        valueField: 'value',
        textField: 'label',
        onSelect: function () {
            var nmeaType = $("#seNmeaType").combobox("getValue");
            var nmeaValue = $("#seNmeaValue").combobox("getValue");
            hashMapNmea.put(nmeaType, nmeaValue);
        },
        data: dataArrayNmeaValue
    });
    $("#seNmeaValue").combobox("select", hashMapNmea.get(nmeaType));
}
function initNmeaValueComboi70P307(nmeaType) {
    var dataArrayNmeaValue = [];
    if (nmeaType == "DAT_ID_GSV" || nmeaType == "DAT_ID_GSA" || nmeaType == "DAT_ID_GST") {
        webConfigXmlObj.find("datList2").children().each(function () {
            var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).text() };
            dataArrayNmeaValue.push(jsonItem);
        });
    } else {
        webConfigXmlObj.find("datList3").children().each(function () {
            var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).text() };
            dataArrayNmeaValue.push(jsonItem);
        });
    }
    $("#seNmeaValue").combobox({
        valueField: 'value',
        textField: 'label',
        onSelect: function () {
            var nmeaType = $("#seNmeaType").combobox("getValue");
            var nmeaValue = $("#seNmeaValue").combobox("getValue");
            hashMapNmea.put(nmeaType, nmeaValue);
        },
        data: dataArrayNmeaValue
    });
    $("#seNmeaValue").combobox("select", hashMapNmea.get(nmeaType));

}

function initNmeaValueComboi70628E(nmeaType) {
    var dataArrayNmeaValue = [];
    if (nmeaType == "DAT_ID_GSV") {
        webConfigXmlObj.find("datList3").children().each(function () {
            var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).text() };
            dataArrayNmeaValue.push(jsonItem);
        });
    } else {
        webConfigXmlObj.find("datList3").children().each(function () {
            var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).text() };
            dataArrayNmeaValue.push(jsonItem);
        });
    }
    $("#seNmeaValue").combobox({
        valueField: 'value',
        textField: 'label',
        onSelect: function () {
            var nmeaType = $("#seNmeaType").combobox("getValue");
            var nmeaValue = $("#seNmeaValue").combobox("getValue");
            hashMapNmea.put(nmeaType, nmeaValue);
        },
        data: dataArrayNmeaValue
    });
    $("#seNmeaValue").combobox("select", hashMapNmea.get(nmeaType));

}
function initNmeaValueCombon72(nmeaType) {
    var dataArrayNmeaValue = [];
    if (nmeaType == "DAT_ID_GSV") {
        webConfigXmlObj.find("datList2").children().each(function () {
            var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).text() };
            dataArrayNmeaValue.push(jsonItem);
        });
    } else {
        webConfigXmlObj.find("datList2").children().each(function () {
            var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).text() };
            dataArrayNmeaValue.push(jsonItem);
        });
    }
    $("#seNmeaValue").combobox({
        valueField: 'value',
        textField: 'label',
        onSelect: function () {
            var nmeaType = $("#seNmeaType").combobox("getValue");
            var nmeaValue = $("#seNmeaValue").combobox("getValue");
            hashMapNmea.put(nmeaType, nmeaValue);
        },
        data: dataArrayNmeaValue
    });
    $("#seNmeaValue").combobox("select", hashMapNmea.get(nmeaType));
}
function initNmeaValueComboi80(nmeaType) {
    var dataArrayNmeaValue = [];
    if (nmeaType == "DAT_ID_GSV") {
        webConfigXmlObj.find("datList1").children().each(function () {
            var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).text() };
            dataArrayNmeaValue.push(jsonItem);
        });
    } else {
        webConfigXmlObj.find("datList1").children().each(function () {
            var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).text() };
            dataArrayNmeaValue.push(jsonItem);
        });
    }
    $("#seNmeaValue").combobox({
        valueField: 'value',
        textField: 'label',
        onSelect: function () {
            var nmeaType = $("#seNmeaType").combobox("getValue");
            var nmeaValue = $("#seNmeaValue").combobox("getValue");
            hashMapNmea.put(nmeaType, nmeaValue);
        },
        data: dataArrayNmeaValue
    });
    $("#seNmeaValue").combobox("select", hashMapNmea.get(nmeaType));

}
function bindHashMapValue(nmeaType) {
    var urlForSubGnssDataGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("subGnssDataGet").text());
    if (urlForSubGnssDataGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataGet,
        data: {
            "urlStringId": getUrlIdString(),
            "io_id": serverIdx,
            "dat_id": nmeaType
        },
        async: false,
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            if (data.awk == "rsps") {
                if (data.frq != "unknown") {
                    //console.log(nmeaType + "--" + data.frq);
                    hashMapNmea.put(nmeaType, data.frq);
                }
            }
        }
    });
}
var windowType = "serverset";
function showControl(showFlag) {
    if (showFlag) {
        $("#trUserName").show();
        $("#trPwd").show();
        $("#trSetupPointColon").show();
        parent.updateWindow(windowType,550);
    } else {
        $("#trUserName").hide();
        $("#trPwd").hide();
        $("#trSetupPointColon").hide();
        parent.updateWindow(windowType, 450);
    }
}
var currentServerStatus = "";
//获取连接状态
function getNetServerStatus(serverIdx) {
    var urlForNetServerStatusGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("netServerStatusGet").text());
    if (urlForNetServerStatusGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForNetServerStatusGet,
        data: {
            "urlStringId": getUrlIdString(),
            "server_idx": serverIdx
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            return;
        },
        success: function (data) {

            if (null != data && data.awk == "rsps") {
                currentServerStatus = data.status;
                if (currentServerStatus != "NETLINK_STATUS__LINK_UNCONNECTED" && currentServerStatus != "NETSERVER_STATUS__CLOSED") {
                    unableEditController(); //在非断开状态下不允许编辑
                }
            }
        }
    });
}
//在非断开状态下不允许编辑
function unableEditController() {
    $("#seServiceType").combobox("disable");

    $('#ipUserName').attr("readonly", "readonly");
    $('#ipPwd').attr("readonly", "readonly");
    $('#ipPort').attr("readonly", "readonly");
    $('#ipSetupPoint').attr("readonly", "readonly");

    $("#seDiffData").combobox("disable");
    $("#seInitialData").combobox("disable");
    $("#seEphemerisData").combobox("disable");
    $("#seGPGGA").combobox("disable");
    $("#seGPGSV").combobox("disable");
}
//获取自动连接值
function getAutoConnectData(serverIdx) {
    var urlForSubGnssDataGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("netServerAutoOpenGet").text());
    if (urlForSubGnssDataGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataGet,
        data: {
            "urlStringId": getUrlIdString(),
            "server_idx": serverIdx
           
       },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            if (data.awk == "rsps") {
                if (data.auto_open == true) {
                    $("#seAutoConnect").attr("checked", true);
                } else {
                    $("#seAutoConnect").attr("checked", false);
                }
            }
        }
    });
}
//设置是否自连接
function setAutoCon(value) {
    var urlForNetServerAutoConSet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("netServerAutoOpenSet").text());
    if (urlForNetServerAutoConSet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForNetServerAutoConSet,
        data: {
            "urlStringId": getUrlIdString(),
            "auto_open": value,
            "server_idx": serverIdx
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            openErrorWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            if (data.set_result != "HC_ANSWER_STATUS__OK") {
                if (data.set_result == "HC_ANSWER_STATUS__REG_EXPIRE") {
                    parent.openInfoWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("tagReCodeExpired").text());
                } else {
                    parent.openInfoWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("netAutoConSetFail").text());
                }
                
            }
        }
    });
}
//获取服务器参数
function getNetServerPara(serverIdx) {
    var urlForNetServerParaGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("netServerParaGet").text());
    if (urlForNetServerParaGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForNetServerParaGet,
        data: {
            "urlStringId": getUrlIdString(),
            "server_idx": serverIdx
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            $("#ipUserName").val(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            $("#ipPwd").val(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            $("#ipPort").val(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            $("#ipSetupPoint").val(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                $("#ipUserName").val(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#ipPwd").val(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#ipPort").val(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#ipSetupPoint").val(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                return;
            }
            if (data.awk == "rsps") {
                $("#seServiceType").combobox("setText", webConfigXmlObj.find("serverType3").find(data.server_type).text());
                $("#seServiceType").combobox("setValue", data.server_type);
                if (data.server_type == "NETSERVER_TYPE__TCP") {
                    showControl(false);
                } else {
                    showControl(true);
                    $("#ipUserName").val(data.account_name);
                    $("#ipPwd").val(data.account_passwd);
                    $("#ipSetupPoint").val(data.data_source_name);
                }
                $("#ipPort").val(data.port);
            } else {
                $("#ipUserName").val(parent.langXmlObj.find("tipInfo").find("getInfoError").text());
                $("#ipPwd").val(parent.langXmlObj.find("tipInfo").find("getInfoError").text());
                $("#ipPort").val(parent.langXmlObj.find("tipInfo").find("getInfoError").text());
                $("#ipSetupPoint").val(parent.langXmlObj.find("tipInfo").find("getInfoError").text());            
            }
        }
    });
}
//绑定差分输出格式下拉框
function bindDiffOutputTypeSelect(serverIdx) {
    var frqFlag = "";
    var urlForSubGnssDataGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("subGnssDataGet").text());
    if (urlForSubGnssDataGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataGet,
        async: false,
        data: {
            "urlStringId": getUrlIdString(),
            "io_id": serverIdx,
            "dat_id": "DAT_ID_CMR"
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            if (data.awk == "rsps") {
                frqFlag = data.frq;
            }
        }
    });
    if (frqFlag != "DAT_FRQ_OFF" && frqFlag != "") {
        $("#seDiffData").combobox("setValue", "DAT_ID_CMR");
        $("#seDiffData").combobox("setText", webConfigXmlObj.find("diffOutputType2").find("DAT_ID_CMR").text());
        $("#ipForDiffInitialValue").val("DAT_ID_CMR");
        $("#ipForDiffInitialText").val("CMR");
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataGet,
        async: false,
        data: {
            "urlStringId": getUrlIdString(),
            "io_id": serverIdx,
            "dat_id": "DAT_ID_CMR2"
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            if (data.awk == "rsps") {
                frqFlag = data.frq;
            }
        }
    });
    if (frqFlag != "DAT_FRQ_OFF" && frqFlag != "") {
        $("#seDiffData").combobox("setValue", "DAT_ID_CMR2");
        $("#seDiffData").combobox("setText", webConfigXmlObj.find("diffOutputType2").find("DAT_ID_CMR2").text());
        $("#ipForDiffInitialValue").val("DAT_ID_CMR2");
        $("#ipForDiffInitialText").val("CMR2");
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataGet,
        async: false,
        data: {
            "urlStringId": getUrlIdString(),
            "io_id": serverIdx,
            "dat_id": "DAT_ID_SCMR"
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            if (data.awk == "rsps") {
                frqFlag = data.frq;
            }
        }
    });
    if (frqFlag != "DAT_FRQ_OFF" && frqFlag != "") {
        $("#seDiffData").combobox("setValue", "DAT_ID_SCMR");
        $("#seDiffData").combobox("setText", webConfigXmlObj.find("diffOutputType2").find("DAT_ID_SCMR").text());
        $("#ipForDiffInitialValue").val("DAT_ID_SCMR");
        $("#ipForDiffInitialText").val("SCMR");
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataGet,
        async: false,
        data: {
            "urlStringId": getUrlIdString(),
            "io_id": serverIdx,
            "dat_id": "DAT_ID_RTCM"
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            if (data.awk == "rsps") {
                frqFlag = data.frq;
            }
        }
    });
    if (frqFlag != "DAT_FRQ_OFF" && frqFlag != "") {
        $("#seDiffData").combobox("setValue", "DAT_ID_RTCM");
        $("#seDiffData").combobox("setText", webConfigXmlObj.find("diffOutputType2").find("DAT_ID_RTCM").text());
        $("#ipForDiffInitialValue").val("DAT_ID_RTCM");
        $("#ipForDiffInitialText").val("RTCM");
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataGet,
        async: false,
        data: {
            "urlStringId": getUrlIdString(),
            "io_id": serverIdx,
            "dat_id": "DAT_ID_RTCMV3"
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            if (data.awk == "rsps") {
                frqFlag = data.frq;
            }
        }
    });
    if (frqFlag != "DAT_FRQ_OFF" && frqFlag != "") {
        $("#seDiffData").combobox("setValue", "DAT_ID_RTCMV3");
        $("#seDiffData").combobox("setText", webConfigXmlObj.find("diffOutputType2").find("DAT_ID_RTCMV3").text());
        $("#ipForDiffInitialValue").val("DAT_ID_RTCMV3");
        $("#ipForDiffInitialText").val("RTCMV3");
        return;
    }
    ////////////
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataGet,
        async: false,
        data: {
            "urlStringId": getUrlIdString(),
            "io_id": serverIdx,
            "dat_id": "DAT_ID_RTD"
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            if (data.awk == "rsps") {
                frqFlag = data.frq;
            }
        }
    });
    if (frqFlag != "DAT_FRQ_OFF" && frqFlag != "") {
        $("#seDiffData").combobox("setValue", "DAT_ID_RTD");
        $("#seDiffData").combobox("setText", webConfigXmlObj.find("diffOutputType2").find("DAT_ID_RTD").text());
        $("#ipForDiffInitialValue").val("DAT_ID_RTD");
        $("#ipForDiffInitialText").val("RTD");
        return;
    }
    ///////////////
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataGet,
        async: false,
        data: {
            "urlStringId": getUrlIdString(),
            "io_id": serverIdx,
            "dat_id": "DAT_ID_RTCMV32"
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            if (data.awk == "rsps") {
                frqFlag = data.frq;
            }
        }
    });
    if (frqFlag != "DAT_FRQ_OFF" && frqFlag != "") {
        $("#seDiffData").combobox("setValue", "DAT_ID_RTCMV32");
        $("#seDiffData").combobox("setText", webConfigXmlObj.find("diffOutputType2").find("DAT_ID_RTCMV32").text());
        $("#ipForDiffInitialValue").val("DAT_ID_RTCMV32");
        $("#ipForDiffInitialText").val("RTCMV32");
        return;
    }
    ///////////////////628E板卡差分数据才有NOVATElX
    if (parent.parent.GnssBoards[0] == "GNSS_BOARD_TYPE__OEM628") {
        $.ajax({
            type: "GET",
            contentType: "application/json;charset=utf-8",
            url: urlForSubGnssDataGet,
            async: false,
            data: {
                "urlStringId": getUrlIdString(),
                "io_id": serverIdx,
                "dat_id": "DAT_ID_NOVATELX"
            },
            dataType: "json",
            beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
            error: function (result, status) {
                return;
            },
            success: function (data) {
                //获取失败
                if (data == null) {
                    return;
                }
                frqFlag = data.frq;
            }
        });
        if (frqFlag != "DAT_FRQ_OFF" && frqFlag != "") {
            $("#seDiffData").combobox("setValue", "DAT_ID_NOVATELX");
            $("#seDiffData").combobox("setText", webConfigXmlObj.find("diffOutputType2").find("DAT_ID_NOVATELX").text());
            $("#ipForDiffInitialText").val("NOVATELX");
            $("#ipForDiffInitialValue").val("DAT_ID_NOVATELX");
            return;
        }
    }
    if (frqFlag == "DAT_FRQ_OFF") {
        $("#seDiffData").combobox("setValue", "DAT_FRQ_OFF");
        $("#seDiffData").combobox("setText", parent.parent.langXmlObj.find("DAT_FRQ_OFF").text());
        $("#ipForDiffInitialValue").val("DAT_FRQ_OFF");
        $("#ipForDiffInitialText").val(parent.parent.langXmlObj.find("DAT_FRQ_OFF").text());
    }
}
var initRaw = "";
varinitHCPPP = "";
var initEph = "";
var initGASe = "";
var initGVSe = "";
//绑定原始数据
function bindRawDataSe(serverIdx) {
    var urlForSubGnssDataGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("subGnssDataGet").text());
    if (urlForSubGnssDataGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataGet,
        data: {
            "urlStringId": getUrlIdString(),
            "io_id": serverIdx,
            "dat_id": "DAT_ID_RAW"
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            if (data.awk == "rsps") {
                if (data.frq != "unknown") {
                    $("#seInitialData").combobox("setValue", data.frq);
                    $("#seInitialData").combobox("setText", parent.parent.langXmlObj.find(data.frq).text());
                } else {
                    $("#seInitialData").combobox("setValue", parent.parent.langXmlObj.find(data.frq).text());
                }
                initRaw = data.frq;
            }
        }
    });
}
//绑定HCPPP数据
function bindHcpppDataSe(linkIdx) {
    var urlForSubGnssDataGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("subGnssDataGet").text());
    if (urlForSubGnssDataGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataGet,
        data: {
            "urlStringId": getUrlIdString(),
            "io_id": linkIdx,
            "dat_id": "DAT_ID_HCPPP"
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            if (data.awk == "rsps") {
                if (data.frq != "unknown") {
                    $("#seHCPPPData").combobox("setValue", data.frq);
                    $("#seHCPPPData").combobox("setText", parent.parent.langXmlObj.find(data.frq).text());
                } else {
                    $("#seHCPPPData").combobox("setValue", parent.parent.langXmlObj.find(data.frq).text());
                }
                initHCPPP = data.frq;
            }
        }
    });
}
//绑定星历数据
function bindEphemerisData(serverIdx) {
    var urlForSubGnssDataGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("subGnssDataGet").text());
    if (urlForSubGnssDataGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataGet,
        data: {
            "urlStringId": getUrlIdString(),
            "io_id": serverIdx,
            "dat_id": "DAT_ID_EPH"
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            if (data.awk == "rsps") {
                if (data.frq != "unknown") {
                    $("#seEphemerisData").combobox("setValue", data.frq);
                    $("#seEphemerisData").combobox("setText", parent.parent.langXmlObj.find(data.frq).text());
                } else {
                    $("#seEphemerisData").combobox("setValue", parent.parent.langXmlObj.find(data.frq).text());
                }
                initEph = data.frq;
            }
        }
    });
}

//打开连接
function connect() {
    var urlForNetServerOpenSet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("netServerOpenSet").text());
    if (urlForNetServerOpenSet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForNetServerOpenSet,
        data: {
            "urlStringId": getUrlIdString(),
            "server_idx": serverIdx
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            parent.openErrorWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            if (data.set_result == "HC_ANSWER_STATUS__OK") {
                parent.closeWindow(serverIdx); //serverIdx
            } else {
                if (data.set_result == "HC_ANSWER_STATUS__REG_EXPIRE") {
                    parent.openInfoWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("tagReCodeExpired").text());
                } else {
                    parent.openInfoWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("netServerConnSetFail").text());
                }
                
            }
        }
    });
}
var excuteSucFlag1 = true;
var excuteSucFlag2 = true;
var excuteSucFlag3 = true;
var excuteSucFlag4 = true;
var excuteSucFlag5 = true;
var excuteSucFlag7 = true;
//保存
//var reg_ipPort = /^([2-9]\d{3}|1\d[3-9]\d|1\d2[4-9]|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;      //端口号1024-65535
function btnSave() {
    //是否过期
    if (registerExpired) {
        parent.openInfoWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("tagReCodeExpired").text());
        return;
    }
    var connProcotol = $("#seServiceType").combobox("getValue"); //获取连接协议
    if (connProcotol == "") {
        parent.openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("conProtocolNotNull").text());
        return;
    }
    var accountName = "";
    var accountPassword = "";
    var setupPoint = "";
    //如果是NETSERVER_TYPE__NTRIP协议
    if (connProcotol == "NETSERVER_TYPE__NTRIP") {
        accountName = $("#ipUserName").val(); //用户名称
        if (accountName == "") {
            parent.openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("userNameNotNull").text());
            return;
        }
        if (accountName.length > 18) {
            parent.openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("serverUserNameLength18").text());
            return;
        }
        accountPassword = $("#ipPwd").val(); //用户密码
        if (accountPassword == "") {
            parent.openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("pwdNotNull").text());
            return;
        }
        if (accountPassword.length > 18) {
            parent.openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("serverPwdLength18").text());
            return;
        }
        setupPoint = $("#ipSetupPoint").val(); //安装点
        if (setupPoint == "") {
            parent.openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("netSetupPointNotNull").text());
            return;
        }
    }
    var port = $("#ipPort").val(); //端口号
    if (!judgePort(port)) {
        parent.openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("netNCasterPortBe1024and65535").text());
        return;
    }
    var portInt = parseInt(port);

    var seDiffData = $("#seDiffData").combobox("getValue");
    if (seDiffData == "") {
        parent.openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("diffDataNotNull").text());
        return false;
    }
    var seInitialData = $("#seInitialData").combobox("getValue");
    if (seInitialData == "") {
        parent.openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("initialDataNotNull").text());
        return false;
    }
    var seEphemerisData = $("#seEphemerisData").combobox("getValue");
    if (seEphemerisData == "") {
        parent.openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("ephemerisDataNotNull").text());
        return false;
    }
    //保存服务器参数
    setNetserverPara(connProcotol, accountName, accountPassword, portInt, setupPoint);
    //保存差分数据
    setDiffData();
    //保存原始数据
    setRawData();
    setHcpppData(); //保存HCPPP数据
    //保存星历数据
    setEphemerisData();
    setNmeaData(); //设置nmea数据
    //连接
    if (excuteSucFlag1 && excuteSucFlag2 && excuteSucFlag3 && excuteSucFlag4 && excuteSucFlag5 && excuteSucFlag7) {
        connect(); //连接
        if($("#seAutoConnect").attr("checked")=="checked") {
        setAutoCon(true);
       }else {
        setAutoCon(false);
       }
    }
}
//保存服务器参数
function setNetserverPara(connProcotol,accountName,accountPassword,portInt,setupPoint) {
    var urlForNetServerParaSet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("netServerParaSet").text());
    if (urlForNetServerParaSet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForNetServerParaSet,
        data: {
            "urlStringId": getUrlIdString(),
            "server_idx": serverIdx,
            "server_type": connProcotol,
            "account_name": accountName,
            "account_passwd": accountPassword,
            "port": portInt,
            "data_source_name": setupPoint
        },
        dataType: "json", 
        async: false,
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            excuteSucFlag1 = false;
            parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            if (data.set_result != "HC_ANSWER_STATUS__OK") {
                excuteSucFlag1 = false;
                parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("netServerParaSetFail").text());
            } 
        }
    });
}
//保存差分数据
function setDiffData() {
    var urlForSubGnssDataSet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("subGnssDataSet").text());
    if (urlForSubGnssDataSet == "") {
        return;
    }
    var seDiffDataTextCurrent = $("#seDiffData").combobox("getText");
    var ipForDiffInitialText = $("#ipForDiffInitialText").val();
    var ipForDiffInitialValue = $("#ipForDiffInitialValue").val();
    var seDiffData = $("#seDiffData").combobox("getValue");
    var successFlag = true;
    if (seDiffDataTextCurrent == ipForDiffInitialText) {
        return;
    } else {
        if (seDiffDataTextCurrent == parent.parent.langXmlObj.find("tagOff").text()) {
            $.ajax({
                type: "GET",
                contentType: "application/json;charset=utf-8",
                url: urlForSubGnssDataSet,
                data: {
                    "urlStringId": getUrlIdString(),
                    "io_id": serverIdx,
                    "dat_id": ipForDiffInitialValue,
                    "frq": "DAT_FRQ_OFF"
                },
                dataType: "json",
                async: false,
                beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
                error: function (result, status) {
                    excuteSucFlag2 = false;
                    parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("connectError").text());
                    return;
                },
                success: function (data) {
                    if (data.set_result == "HC_ANSWER_STATUS__OK") {
                        //parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("diffDataSetSucc").text());
                        $("#ipForDiffInitialText").val($("#seDiffData").combobox("getText"));
                        $("#ipForDiffInitialValue").val($("#seDiffData").combobox("getValue"));
                    } else {
                        excuteSucFlag2 = false;
                        if (data.set_result == "HC_ANSWER_STATUS__REG_EXPIRE") {
                            parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("tagReCodeExpired").text());
                        } else {
                            parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("diffDataSetFail").text());
                        }
                        //parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("diffDataSetFail").text());
                    }

                }
            });
        } else {
            if (ipForDiffInitialText == parent.parent.langXmlObj.find("tagOff").text()) {
                $.ajax({
                    type: "GET",
                    contentType: "application/json;charset=utf-8",
                    url: urlForSubGnssDataSet,
                    data: {
                        "urlStringId": getUrlIdString(),
                        "io_id": serverIdx,
                        "dat_id": seDiffData,
                        "frq": "DAT_FRQ_1HZ"
                    },
                    dataType: "json",
                    async:false,
                    beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
                    error: function (result, status) {
                        excuteSucFlag2 = false;
                        parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("connectError").text());
                        return;
                    },
                    success: function (data) {
                        if (data.set_result == "HC_ANSWER_STATUS__OK") {
                            //parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("diffDataSetSucc").text());
                            $("#ipForDiffInitialText").val($("#seDiffData").combobox("getText"));
                            $("#ipForDiffInitialValue").val($("#seDiffData").combobox("getValue"));
                        } else {
                            excuteSucFlag2 = false;
                            if (data.set_result == "HC_ANSWER_STATUS__REG_EXPIRE") {
                                parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("tagReCodeExpired").text());
                            } else {
                                parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("diffDataSetFail").text());
                            }
                            //parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("diffDataSetFail").text());
                        }
                    }
                });
            } else {
                $.ajax({
                    type: "GET",
                    contentType: "application/json;charset=utf-8",
                    async: false,
                    url: urlForSubGnssDataSet,
                    data: {
                        "urlStringId": getUrlIdString(),
                        "io_id": serverIdx,
                        "dat_id": ipForDiffInitialValue,
                        "frq": "DAT_FRQ_OFF"
                    },
                    dataType: "json",
                    async:false,
                    beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
                    error: function (result, status) {
                        excuteSucFlag2 = false;
                        parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("connectError").text());
                        return;
                    },
                    success: function (data) {
                        if (data.set_result != "HC_ANSWER_STATUS__OK") {
                            successFlag = false;
                            excuteSucFlag2 = false;
                        }
                    }
                });
                if (!successFlag) {
                    return;
                }
                $.ajax({
                    type: "GET",
                    contentType: "application/json;charset=utf-8",
                    async: false,
                    url: urlForSubGnssDataSet,
                    data: {
                        "urlStringId": getUrlIdString(),
                        "io_id": serverIdx,
                        "dat_id": seDiffData,
                        "frq": "DAT_FRQ_1HZ"
                    },
                    dataType: "json",
                    async:false,
                    beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
                    error: function (result, status) {
                        excuteSucFlag2 = false;
                        parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("connectError").text());
                        return;
                    },
                    success: function (data) {
                        if (data.set_result == "HC_ANSWER_STATUS__OK") {
                            //parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("diffDataSetSucc").text());
                            $("#ipForDiffInitialText").val($("#seDiffData").combobox("getText"));
                            $("#ipForDiffInitialValue").val($("#seDiffData").combobox("getValue"));
                        } else {
                            excuteSucFlag2 = false;
                            if (data.set_result == "HC_ANSWER_STATUS__REG_EXPIRE") {
                                parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("tagReCodeExpired").text());
                            } else {
                                parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("diffDataSetFail").text());
                            }
                            //parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("diffDataSetFail").text());
                        }
                    }
                });
            }
        }
    }
}
//保存原始数据
function setRawData() {
    var urlForSubGnssDataSet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("subGnssDataSet").text());
    if (urlForSubGnssDataSet == "") {
        return;
    }
    var seRawData = $("#seInitialData").combobox("getValue");
    if (seRawData == initRaw) {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataSet,
        data: {
            "urlStringId": getUrlIdString(),
            "io_id": serverIdx,
            "dat_id": "DAT_ID_RAW",
            "frq": seRawData
        },
        dataType: "json",
        async: false,
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            excuteSucFlag3 = false;
            parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            if (data.set_result == "HC_ANSWER_STATUS__OK") {
                initRaw = seRawData;
                //parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("rawDataSetSucc").text());
            } else {
                excuteSucFlag3 = false;
                if (data.set_result == "HC_ANSWER_STATUS__REG_EXPIRE") {
                    parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("tagReCodeExpired").text());
                } else {
                    parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("rawDataSetFail").text());
                }
                //parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("rawDataSetFail").text());
            }
        }
    });
}
//保存HCPPP数据
function setHcpppData() {
    var urlForSubGnssDataSet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("subGnssDataSet").text());
    if (urlForSubGnssDataSet == "") {
        return;
    }
    var seHCPPPData = $("#seHCPPPData").combobox("getValue");
    if (seHCPPPData == initHCPPP) {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataSet,
        data: {
            "urlStringId": getUrlIdString(),
            "io_id": serverIdx,
            "dat_id": "DAT_ID_HCPPP",
            "frq": seHCPPPData
        },
        dataType: "json",
        async: false,
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            excuteSucFlag7 = false;
            parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            if (data.set_result == "HC_ANSWER_STATUS__OK") {
                initHCPPP = seHCPPPData;
                //parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("rawDataSetSucc").text());
            } else {
                excuteSucFlag7 = false;
                if (data.set_result == "HC_ANSWER_STATUS__REG_EXPIRE") {
                    parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("tagReCodeExpired").text());
                } else {
                    parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("rawHCPPPDataSetFail").text());
                }
            }
        }
    });
}
//保存星历数据
function setEphemerisData() {
    var urlForSubGnssDataSet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("subGnssDataSet").text());
    if (urlForSubGnssDataSet == "") {
        return;
    }
    var seEphemerisData = $("#seEphemerisData").combobox("getValue");
    if (seEphemerisData == initEph) {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataSet,
        data: {
            "urlStringId": getUrlIdString(),
            "io_id": serverIdx,
            "dat_id": "DAT_ID_EPH",
            "frq": seEphemerisData
        },
        dataType: "json",
        async: false,
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            excuteSucFlag4 = false;
            parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            if (data.set_result == "HC_ANSWER_STATUS__OK") {
                initEph = seEphemerisData;
                //parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("ephemerisDataSetSucc").text());
            } else {
                excuteSucFlag4 = false;
                if (data.set_result == "HC_ANSWER_STATUS__REG_EXPIRE") {
                    parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("tagReCodeExpired").text());
                } else {
                    parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("ephemerisDataSetFail").text());
                }
                //parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("ephemerisDataSetFail").text());
            }

        }
    });
}
//设置nmea数据
function setNmeaData() {
    var urlForSubGnssDataSet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("subGnssDataSet").text());
    if (urlForSubGnssDataSet == "") {
        return;
    }
    var keySetArray = hashMapNmea.keySet();
    for (var i = 0; i < keySetArray.length; i++) {
        var nmeaType = keySetArray[i];
        var nmeaValue = hashMapNmea.get(keySetArray[i]);
        /*if ("DAT_ID_GGA" == nmeaType) {
            if ($("#seHCPPPData").combobox("getValue") != "DAT_FRQ_OFF") {
                nmeaValue = "DAT_FRQ_OFF";
            }
        }*/
        $.ajax({
            type: "GET",
            contentType: "application/json;charset=utf-8",
            url: urlForSubGnssDataSet,
            data: {
                "urlStringId": getUrlIdString(),
                "io_id": serverIdx,
                "dat_id": nmeaType,
                "frq": nmeaValue
            },
            dataType: "json",
            async: false,
            beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
            error: function (result, status) {
                excuteSucFlag5 = false;
                parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("connectError").text());
                return;
            },
            success: function (data) {
                if (data.set_result != "HC_ANSWER_STATUS__OK") {
                    excuteSucFlag5 = false;
                    if (data.set_result == "HC_ANSWER_STATUS__REG_EXPIRE") {
                        parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("tagReCodeExpired").text());
                    } else {
                        parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("tagNmeaSetFail").text());
                    }
                }
            }
        });
        if (!excuteSucFlag5) {
            break;
        }
    }
}

function getDiffData() {
    var urlForRegisterTimeGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("getGnssVersion").text());
    if (urlForRegisterTimeGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForRegisterTimeGet,
        data: {
            "urlStringId": getUrlIdString()
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            if (data.awk == "rsps") {
                $("#seDiffData").combobox("setValue", data.diff_type);
                $("#seDiffData").combobox("setText", webConfigXmlObj.find("diffOutputType2").find(data.diff_type).text());
            } else {

            }
        }
    });
}
//返回主窗口
function btnBack() {
    parent.closeWindow(serverIdx); //serverIdx
}