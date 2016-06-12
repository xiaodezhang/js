var webConfigXmlObj = parent.parent.webConfigXmlObj;
var linkIdx;
var serverType;
var hashMapNmea = new HashMap();
//初始数据
var initRaud = "";
var initDiffOut = "";
var initRaw = "";
var initRaw1 = "";
var initRaw2 = "";
var initEph = "";
$(document).ready(function () {
    linkIdx = request.QueryString("linkIdx");
    initCombobox(); //初始化下拉框
    bindUartBaudSelect(linkIdx); //绑定波特率下拉框
    bindDiffOutputTypeSelect(linkIdx); //绑定差分输出格式下拉框
    //getWeather();//获取气象仪参数，根据参数判断显示的内容
    if (parent.parent.GnssBoards[0] == "GNSS_BOARD_TYPE__P307" || parent.parent.GnssBoards[0] == "GNSS_BOARD_TYPE__OEM628") {
        $("#tagSensorN721").hide();
        $("#tagSensorN72").hide(); //i70没有传感器
    } else { //i80才有
        if (parent.parent.PN[11] == "2") {
            $("#tagSensorN721").show();
            $("#tagSensorN72").show();
            bindSensorDataSe(linkIdx); //绑定传感器数据
        } else {
            $("#tagSensorN721").hide();
            $("#tagSensorN72").hide();
        }
    }   
    
    if (linkIdx == "IO_ID__COM_2") {
        getWeather(); //获取气象仪参数，根据参数判断显示的内容

        $("#NotWeather2").hide();
        $("#NotWeather6").hide();
        $("#Weather").hide();
        $("#Weather1").hide();

        ///
        $("#Weather1").hide();
        $("#Weather2").hide();
        $("#Weather3").hide();
        $("#Weather4").hide();
        $("#Weather5").hide();
        $("#Weather6").hide();
        $("#Weather7").hide();
        ////
    } else {
        $("#Weather").hide();
        $("#Weather1").hide();
        $("#Weather2").hide();
        $("#Weather3").hide();
        $("#Weather4").hide();
        $("#Weather5").hide();
        $("#Weather6").hide();
        $("#Weather7").hide();

        //$("#NotWeather2").hide();
        //$("#NotWeather6").hide();
        bindRawDataSe(linkIdx); //绑定原始数据
        bindEphemerisData(linkIdx); //绑定星历数据
    }
    bindHcpppDataSe(linkIdx); //绑定HCPPP数据

    getRegisterExpired(); //获取是否过期
});
//获取气象仪参数
function getWeather() {
    var urlForRegisterTimeGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("getAtmosPara").text());
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
            if (data.atmos_status) {//还要选择checkbox
                $("#ipStoreFormatRinex").attr("checked", true);
                $("#Weather2").show();
                $("#Weather3").show();
                $("#Weather4").show();
                $("#Weather5").show();
                $("#Weather6").show();
                $("#Weather7").show(); //显示气象仪，隐藏其他的
                $("#NotWeather").hide();
                $("#NotWeather1").hide();
                $("#NotWeather2").hide();
                $("#NotWeather3").hide();
                $("#NotWeather4").hide();
                $("#NotWeather5").hide();
                $("#NotWeather6").hide();
                $("#NotWeather7").hide();
                $("#NotWeather8").hide();

            } else {
                $("#ipStoreFormatRinex").attr("checked", false);
                $("#Weather2").hide();
                $("#Weather3").hide();
                $("#Weather4").hide();
                $("#Weather5").hide();
                $("#Weather6").hide();
                $("#Weather7").hide(); //相反
                $("#NotWeather").show();
                $("#NotWeather1").show();
                $("#NotWeather2").show();
                $("#NotWeather3").show();
                $("#NotWeather4").show();
                $("#NotWeather5").show();
                $("#NotWeather6").show();
                $("#NotWeather7").show();
                $("#NotWeather8").show();
            }

            $("#idAtomBaud").val(data.atmos_baudrate);
            $("#idAtmosIntv").val(data.atmos_intv);
            $("#idAtmosType").val(data.atmos_dect_type);

        }
    });
}
//复选框选中事件
function checkBoxClick() {
    if ($("#ipStoreFormatRinex").attr("checked") == "checked") {
        $("#Weather2").show();
        $("#Weather3").show();
        $("#Weather4").show();
        $("#Weather5").show();
        $("#Weather6").show();
        $("#Weather7").show();
        $("#NotWeather").hide();
        $("#NotWeather1").hide();
        $("#NotWeather2").hide();
        $("#NotWeather3").hide();
        $("#NotWeather4").hide();
        $("#NotWeather5").hide();
        $("#NotWeather6").hide();
        $("#NotWeather7").hide();
        $("#NotWeather8").hide();
    } else {
        $("#Weather2").hide();
        $("#Weather3").hide();
        $("#Weather4").hide();
        $("#Weather5").hide();
        $("#Weather6").hide();
        $("#Weather7").hide();
        $("#NotWeather").show();
        $("#NotWeather1").show();
        $("#NotWeather2").show();
        $("#NotWeather3").show();
        $("#NotWeather4").show();
        $("#NotWeather5").show();
        $("#NotWeather6").show();
        $("#NotWeather7").show();
        $("#NotWeather8").show();
    }
}


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
    //初始化波特率下拉框
    var dataArrayBaud = [];
    webConfigXmlObj.find("uartBauds").find("item").each(function () {
        var jsonItem = { label: $(this).text(), value: $(this).text() };
        dataArrayBaud.push(jsonItem);
    });
    $("#seUartBaud").combobox({
        valueField: 'value',
        textField: 'label',
        data: dataArrayBaud
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
    //初始化传感器数据
    var dataArrayRaw1 = [];
    webConfigXmlObj.find("datSensor").children().each(function () {
        var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).text() };
        dataArrayRaw1.push(jsonItem);
    });

    $("#seSensorData").combobox({
        valueField: 'value',
        textField: 'label',
        data: dataArrayRaw1
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
            "io_id": linkIdx,
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
//绑定波特率下拉框
function bindUartBaudSelect(linkIdx) {
    var urlForUartBaudGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("uartBaudGet").text());
    if (urlForUartBaudGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForUartBaudGet,
        data: {
            "urlStringId": getUrlIdString(),
            "uart_idx": linkIdx
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
                $("#seUartBaud").combobox("setValue", data.baud);
                $("#seUartBaud").combobox("setText", data.baud);
                initRaud = data.baud;
            }
        }
    });
}
//绑定差分输出格式下拉框
function bindDiffOutputTypeSelect(linkIdx) {
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
            "io_id": linkIdx,
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
            if (data.awk = "rsps") {
                frqFlag = data.frq;
            }
        }
    });
    if (frqFlag != "DAT_FRQ_OFF" && frqFlag != "") {
        $("#seDiffData").combobox("setValue", "DAT_ID_CMR");
        $("#seDiffData").combobox("setText", webConfigXmlObj.find("diffOutputType2").find("DAT_ID_CMR").text());
        $("#ipForDiffInitialText").val("CMR");
        $("#ipForDiffInitialValue").val("DAT_ID_CMR");
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataGet,
        async: false,
        data: {
            "urlStringId": getUrlIdString(),
            "io_id": linkIdx,
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
            if (data.awk = "rsps") {
                frqFlag = data.frq;
            }
        }
    });
    if (frqFlag != "DAT_FRQ_OFF" && frqFlag != "") {
        $("#seDiffData").combobox("setValue", "DAT_ID_CMR2");
        $("#seDiffData").combobox("setText", webConfigXmlObj.find("diffOutputType2").find("DAT_ID_CMR2").text());
        $("#ipForDiffInitialText").val("CMR2");
        $("#ipForDiffInitialValue").val("DAT_ID_CMR2");
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataGet,
        async: false,
        data: {
            "urlStringId": getUrlIdString(),
            "io_id": linkIdx,
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
            if (data.awk = "rsps") {
                frqFlag = data.frq;
            }
        }
    });
    if (frqFlag != "DAT_FRQ_OFF" && frqFlag != "") {
        $("#seDiffData").combobox("setValue", "DAT_ID_SCMR");
        $("#seDiffData").combobox("setText", webConfigXmlObj.find("diffOutputType2").find("DAT_ID_SCMR").text());
        $("#ipForDiffInitialText").val("SCMR");
        $("#ipForDiffInitialValue").val("DAT_ID_SCMR");
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataGet,
        async: false,
        data: {
            "urlStringId": getUrlIdString(),
            "io_id": linkIdx,
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
            if (data.awk = "rsps") {
                frqFlag = data.frq;
            }
        }
    });
    if (frqFlag != "DAT_FRQ_OFF" && frqFlag != "") {
        $("#seDiffData").combobox("setValue", "DAT_ID_RTCM");
        $("#seDiffData").combobox("setText", webConfigXmlObj.find("diffOutputType2").find("DAT_ID_RTCM").text());
        $("#ipForDiffInitialText").val("RTCM");
        $("#ipForDiffInitialValue").val("DAT_ID_RTCM");
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataGet,
        async: false,
        data: {
            "urlStringId": getUrlIdString(),
            "io_id": linkIdx,
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
            if (data.awk = "rsps") {
                frqFlag = data.frq;
            }
        }
    });
    if (frqFlag != "DAT_FRQ_OFF" && frqFlag != "") {
        $("#seDiffData").combobox("setValue", "DAT_ID_RTCMV3");
        $("#seDiffData").combobox("setText", webConfigXmlObj.find("diffOutputType2").find("DAT_ID_RTCMV3").text());
        $("#ipForDiffInitialText").val("RTCMV3");
        $("#ipForDiffInitialValue").val("DAT_ID_RTCMV3");
        return;
    }
    /////////////////////
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataGet,
        async: false,
        data: {
            "urlStringId": getUrlIdString(),
            "io_id": linkIdx,
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
            if (data.awk = "rsps") {
                frqFlag = data.frq;
            }
        }
    });
    if (frqFlag != "DAT_FRQ_OFF" && frqFlag != "") {
        $("#seDiffData").combobox("setValue", "DAT_ID_RTD");
        $("#seDiffData").combobox("setText", webConfigXmlObj.find("diffOutputType2").find("DAT_ID_RTD").text());
        $("#ipForDiffInitialText").val("RTD");
        $("#ipForDiffInitialValue").val("DAT_ID_RTD");
        return;
    }
    //////////////////////
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataGet,
        async: false,
        data: {
            "urlStringId": getUrlIdString(),
            "io_id": linkIdx,
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
            if (data.awk = "rsps") {
                frqFlag = data.frq;
            }
        }
    });
    if (frqFlag != "DAT_FRQ_OFF" && frqFlag != "") {
        $("#seDiffData").combobox("setValue", "DAT_ID_RTCMV32");
        $("#seDiffData").combobox("setText", webConfigXmlObj.find("diffOutputType2").find("DAT_ID_RTCMV32").text());
        $("#ipForDiffInitialText").val("RTCMV32");
        $("#ipForDiffInitialValue").val("DAT_ID_RTCMV32");
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataGet,
        async: false,
        data: {
            "urlStringId": getUrlIdString(),
            "io_id": linkIdx,
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
            if (data.awk = "rsps") {
                frqFlag = data.frq;
            }
        }
    });
    if (frqFlag != "DAT_FRQ_OFF" && frqFlag != "") {
        $("#seDiffData").combobox("setValue", "DAT_ID_RTD");
        $("#seDiffData").combobox("setText", webConfigXmlObj.find("diffOutputType2").find("DAT_ID_RTD").text());
        $("#ipForDiffInitialText").val("RTD");
        $("#ipForDiffInitialValue").val("DAT_ID_RTD");
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
                "io_id": linkIdx,
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
        $("#ipForDiffInitialText").val(parent.parent.langXmlObj.find("DAT_FRQ_OFF").text());
        $("#ipForDiffInitialValue").val("DAT_FRQ_OFF");
    }
}
//绑定原始数据
function bindRawDataSe(linkIdx) {
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
//绑定传感器数据
function bindSensorDataSe(linkIdx) {
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
            "dat_id": "DAT_ID_GSENSOR_ORG_NO_HCP"
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
                    $("#seSensorData").combobox("setValue", data.frq);
                    $("#seSensorData").combobox("setText", parent.parent.langXmlObj.find(data.frq).text());
                } else {
                    $("#seSensorData").combobox("setValue", parent.parent.langXmlObj.find(data.frq).text());
                }
                initRaw1 = data.frq;
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
                initRaw2 = data.frq;
            }
        }
    });
}
//绑定星历数据
function bindEphemerisData(linkIdx) {
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
var excuteSucFlag1 = true;
var excuteSucFlag2 = true;
var excuteSucFlag3 = true;
var excuteSucFlag4 = true;
var excuteSucFlag5 = true;
var excuteSucFlag6 = true;
var excuteSucFlag7 = true;
//保存
function btnSave() {
    //是否过期
    if (registerExpired) {
        parent.openInfoWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("tagReCodeExpired").text());
        return;
    }

    if ($("#ipStoreFormatRinex").attr("checked") == "checked") {
        //设置气象仪相关的参数
        var name = "lmy";
        setSendPtu();//保存气象仪参数
        //parent.closeWindow(linkIdx); //linkIdx  设置成功关闭
    } else {//设置COM相关的参数
        setUartBaud(); //保存波特率
        setDiffData(); //保存差分数据
        setRawData(); //保存原始数据
        if (parent.parent.product_model == "HC_PRODUCT_MODEL__N72") {
        //N72没有
        } else {
            if (parent.parent.GnssBoards[0] == "GNSS_BOARD_TYPE__P307" || parent.parent.GnssBoards[0] == "GNSS_BOARD_TYPE__OEM628") {
                    //i70也没有
            } else {//有倾斜模块的i80才有
                if(parent.parent.PN[11]=="2"){    
                setSensorData(); //保存传感器数据
                }
            }            
        }
        setHcpppData(); //保存HCPPP数据
        setEphemerisData(); //保存星历数据
        setNmeaData(); //设置nmea数据
        if (excuteSucFlag1 && excuteSucFlag2 && excuteSucFlag3 && excuteSucFlag4 && excuteSucFlag5 && excuteSucFlag6 && excuteSucFlag7) {
            parent.closeWindow(linkIdx); //linkIdx
        }
    }
}
//保存气象仪参数
function setSendPtu() {
    var urlForUartBaudSet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("setAtmosPara").text());
    if (urlForUartBaudSet == "") {
        return;
    }
    var atmos_status = "false";
    if ($("#ipStoreFormatRinex").attr("checked") == "checked") {
        atmos_status = "true";
    } else {
        atmos_status = "false";
    }

    var atmos_baudrate = $("#idAtomBaud").val();
    var atmos_intv = $("#idAtmosIntv").val();
    var atmos_dect_type = $("#idAtmosType").val();

    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForUartBaudSet,
        data: {
            "urlStringId": getUrlIdString(),
            "atmos_status": atmos_status,
            "atmos_baudrate": atmos_baudrate,
            "atmos_intv":atmos_intv,
            "atmos_dect_type": atmos_dect_type
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
            if (data.set_result == "HC_ANSWER_STATUS__OK") {
                parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("atmosSetSucess").text());
                parent.closeWindow(linkIdx); //linkIdx  设置成功关闭  
            } else {
                //excuteSucFlag1 = false;
                parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("atmosSetFail").text());
            }

        }
    });

}


//保存波特率
function setUartBaud() {
    var urlForUartBaudSet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("uartBaudSet").text());
    if (urlForUartBaudSet == "") {
        return;
    }
    var seUartBaud = $("#seUartBaud").combobox("getValue");
    if (seUartBaud == initRaud) {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForUartBaudSet,
        data: {
            "urlStringId": getUrlIdString(),
            "uart_idx": linkIdx,
            "baud": seUartBaud
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
            if (data.set_result == "HC_ANSWER_STATUS__OK") {
                initRaud = seUartBaud;
                //parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("uartBaudSetSucc").text());
            } else {
                excuteSucFlag1 = false;
                parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("uartBaudSetFail").text());
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
    if (seDiffDataTextCurrent == ipForDiffInitialText) {//和上次一样
        return;
    } else {
        if (seDiffDataTextCurrent == parent.parent.langXmlObj.find("tagOff").text()) {
            $.ajax({
                type: "GET",
                contentType: "application/json;charset=utf-8",
                url: urlForSubGnssDataSet,
                data: {
                    "urlStringId": getUrlIdString(),
                    "io_id": linkIdx,
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
                        "io_id": linkIdx,
                        "dat_id": seDiffData,
                        "frq": "DAT_FRQ_1HZ"
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
                $.ajax({
                    type: "GET",
                    contentType: "application/json;charset=utf-8",
                    async: false,
                    url: urlForSubGnssDataSet,
                    data: {
                        "urlStringId": getUrlIdString(),
                        "io_id": linkIdx,
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
                        "io_id": linkIdx,
                        "dat_id": seDiffData,
                        "frq": "DAT_FRQ_1HZ"
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
            "io_id": linkIdx,
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
//保存传感器数据
function setSensorData() {
    var urlForSubGnssDataSet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("subGnssDataSet").text());
    if (urlForSubGnssDataSet == "") {
        return;
    }
    var seSensorData = $("#seSensorData").combobox("getValue");
    if (seSensorData == initRaw1) {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataSet,
        data: {
            "urlStringId": getUrlIdString(),
            "io_id": linkIdx,
            "dat_id": "DAT_ID_GSENSOR_ORG_NO_HCP",
            "frq": seSensorData
        },
        dataType: "json",
        async: false,
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            excuteSucFlag6 = false;
            parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            if (data.set_result == "HC_ANSWER_STATUS__OK") {
                initRaw1 = seSensorData;
                //parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("rawDataSetSucc").text());
            } else {
                excuteSucFlag6 = false;
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
    if (seHCPPPData == initRaw2) {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataSet,
        data: {
            "urlStringId": getUrlIdString(),
            "io_id": linkIdx,
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
                initRaw2 = seHCPPPData;
                //parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("rawDataSetSucc").text());
            } else {
                excuteSucFlag7 = false;
                if (data.set_result == "HC_ANSWER_STATUS__REG_EXPIRE") {
                    parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("tagReCodeExpired").text());
                } else {
                    parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("rawHCPPPDataSetFail").text());
                }
                //parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("rawDataSetFail").text());
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
            "io_id": linkIdx,
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
                "io_id": linkIdx,
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
    parent.closeWindow(linkIdx); //linkIdx
}