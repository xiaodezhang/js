var webConfigXmlObj = parent.parent.webConfigXmlObj;
var linkIdx;
var serverType;
//初始数据
var initDiffOut = "";
var initRaw = "";
var initEph = "";
var initGASe = "";
var initGVSe = "";
var hashMapNmea = new HashMap();
$(document).ready(function () {
    linkIdx = request.QueryString("linkIdx");
    initCombobox(); //初始化下拉框
    bindDiffOutputTypeSelect(); //绑定差分输出格式下拉框

    getRegisterExpired(); //获取是否过期
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
    //初始化数据转发类型和值  label: parent.parent.langXmlObj.find("DAT_FRQ_OFF").text(), value: "DAT_FRQ_OFF" 
    var dataArrayNmeaType111 = [];
    webConfigXmlObj.find("dataTransfer").children().each(function () {
        if ($(this).attr("id") == "DAT_ID_RADIO") {

        } else {
            var jsonItem = { label: parent.parent.langXmlObj.find($(this).text()).text(), value: $(this).attr("id") };
            dataArrayNmeaType111.push(jsonItem);
            bindHashMapValue(jsonItem.value);
        }
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
//绑定差分输出格式下拉框
function bindDiffOutputTypeSelect() {
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
            frqFlag = data.frq;
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
            frqFlag = data.frq;
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
            frqFlag = data.frq;
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
            frqFlag = data.frq;
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
            frqFlag = data.frq;
        }
    });
    if (frqFlag != "DAT_FRQ_OFF" && frqFlag != "") {
        $("#seDiffData").combobox("setValue", "DAT_ID_RTCMV3");
        $("#seDiffData").combobox("setText", webConfigXmlObj.find("diffOutputType2").find("DAT_ID_RTCMV3").text());
        $("#ipForDiffInitialText").val("RTCMV3");
        $("#ipForDiffInitialValue").val("DAT_ID_RTCMV3");
        return;
    }
    /////////////////
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
            frqFlag = data.frq;
        }
    });
    if (frqFlag != "DAT_FRQ_OFF" && frqFlag != "") {
        $("#seDiffData").combobox("setValue", "DAT_ID_RTD");
        $("#seDiffData").combobox("setText", webConfigXmlObj.find("diffOutputType2").find("DAT_ID_RTD").text());
        $("#ipForDiffInitialText").val("RTD");
        $("#ipForDiffInitialValue").val("DAT_ID_RTD");
        return;
    }
    /////////////////
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
            frqFlag = data.frq;
        }
    });
    if (frqFlag != "DAT_FRQ_OFF" && frqFlag != "") {
        $("#seDiffData").combobox("setValue", "DAT_ID_RTCMV32");
        $("#seDiffData").combobox("setText", webConfigXmlObj.find("diffOutputType2").find("DAT_ID_RTCMV32").text());
        $("#ipForDiffInitialText").val("RTCMV32");
        $("#ipForDiffInitialValue").val("DAT_ID_RTCMV32");
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
var excuteSucFlag1 = true;
var excuteSucFlag4 = true;
//保存
function btnSave() {
    //是否过期
    if (registerExpired) {
        parent.openInfoWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("tagReCodeExpired").text());
        return;
    }
    setDiffData(); //保存差分数据
    setNmeaData();
    if (excuteSucFlag1 && excuteSucFlag4) {
        parent.closeWindow(linkIdx); //linkIdx
    }
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
                    "io_id": linkIdx,
                    "dat_id": ipForDiffInitialValue,
                    "frq": "DAT_FRQ_OFF"
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
                        //parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("diffDataSetSucc").text());
                        $("#ipForDiffInitialText").val($("#seDiffData").combobox("getText"));
                        $("#ipForDiffInitialValue").val($("#seDiffData").combobox("getValue"));
                    } else {
                        excuteSucFlag1 = false;
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
                        excuteSucFlag1 = false;
                        parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("connectError").text());
                        return;
                    },
                    success: function (data) {
                        if (data.set_result == "HC_ANSWER_STATUS__OK") {
                            //parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("diffDataSetSucc").text());
                            $("#ipForDiffInitialText").val($("#seDiffData").combobox("getText"));
                            $("#ipForDiffInitialValue").val($("#seDiffData").combobox("getValue"));
                        } else {
                            excuteSucFlag1 = false;
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
                        excuteSucFlag1 = false;
                        parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("connectError").text());
                        return;
                    },
                    success: function (data) {
                        if (data.set_result != "HC_ANSWER_STATUS__OK") {
                            successFlag = false;
                            excuteSucFlag1 = false;
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
                        excuteSucFlag1 = false;
                        parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("connectError").text());
                        return;
                    },
                    success: function (data) {
                        if (data.set_result == "HC_ANSWER_STATUS__OK") {
                            //parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("diffDataSetSucc").text());
                            $("#ipForDiffInitialText").val($("#seDiffData").combobox("getText"));
                            $("#ipForDiffInitialValue").val($("#seDiffData").combobox("getValue"));
                        } else {
                            excuteSucFlag1 = false;
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
                excuteSucFlag4 = false;
                parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("connectError").text());
                return;
            },
            success: function (data) {
                if (data.set_result != "HC_ANSWER_STATUS__OK") {
                    excuteSucFlag4 = false;
                    if (data.set_result == "HC_ANSWER_STATUS__REG_EXPIRE") {
                        parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("tagReCodeExpired").text());
                    } else {
                        parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("tagNmeaSetFail").text());
                    }
                }
            }
        });
        if (!excuteSucFlag4) {
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