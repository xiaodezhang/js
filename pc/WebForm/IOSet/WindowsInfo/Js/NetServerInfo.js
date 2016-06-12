var webConfigXmlObj = parent.parent.webConfigXmlObj;
var serverIdx;
var hashMapNmea = new HashMap();
$(document).ready(function () {
    serverIdx = request.QueryString("serverIdx");
    getNetServerPara(serverIdx); //获取服务器参数
    bindDiffOutputTypeSelect(serverIdx); //绑定差分输出格式下拉框
    bindRawDataSe(serverIdx); //绑定原始数据
    bindEphemerisData(serverIdx); //绑定星历数据
    bindHcpppData(serverIdx); //绑定HCPPP数据
    bindNmeaData(serverIdx); //绑定nmea数据
    bindDataTranefs(serverIdx); //绑定数据转发格式
    getAutoConnectData(serverIdx); //获取自动连接值

});
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
            $("#valueUserName").html(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            $("#valuePwd").html(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            $("#valuePort").html(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            $("#valueSetupPoint").html(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            $("#valueServiceType").html(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                $("#valueUserName").html(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#valuePwd").html(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#valuePort").html(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#valueSetupPoint").html(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#valueServiceType").html(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                return;
            }
            if (data.awk == "rsps") {
                $("#valueServiceType").html(webConfigXmlObj.find("serverType3").find(data.server_type).text());
                if (data.server_type == "NETSERVER_TYPE__TCP") {
                    showControl(false);
                } else {
                    showControl(true);
                    $("#valueUserName").html(data.account_name);
                    $("#valuePwd").html(data.account_passwd);
                    $("#valueSetupPoint").html(data.data_source_name);
                }
                $("#valuePort").html(data.port);
            } else {
                $("#valueUserName").html(parent.langXmlObj.find("tipInfo").find("getInfoError").text());
                $("#valuePwd").html(parent.langXmlObj.find("tipInfo").find("getInfoError").text());
                $("#valuePort").html(parent.langXmlObj.find("tipInfo").find("getInfoError").text());
                $("#valueSetupPoint").html(parent.langXmlObj.find("tipInfo").find("getInfoError").text());            
            }
        }
    });
}
var windowType = "serverinfo";
function showControl(showFlag) {
    if (showFlag) {
        $("#trUserName").show();
        $("#trPwd").show();
        $("#trSetupPointColon").show();
        parent.updateWindow(windowType, 570);
    } else {
        $("#trUserName").hide();
        $("#trPwd").hide();
        $("#trSetupPointColon").hide();
        parent.updateWindow(windowType, 500);
    }
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
        $("#valueDiffData").html(webConfigXmlObj.find("diffOutputType2").find("DAT_ID_CMR").text());
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
        $("#valueDiffData").html(webConfigXmlObj.find("diffOutputType2").find("DAT_ID_CMR2").text());
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
        $("#valueDiffData").html(webConfigXmlObj.find("diffOutputType2").find("DAT_ID_SCMR").text());
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
        $("#valueDiffData").html(webConfigXmlObj.find("diffOutputType2").find("DAT_ID_RTCM").text());
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
        $("#valueDiffData").html(webConfigXmlObj.find("diffOutputType2").find("DAT_ID_RTCMV3").text());
        return;
    }
    //////////////
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
        $("#valueDiffData").html(webConfigXmlObj.find("diffOutputType2").find("DAT_ID_RTD").text());
        return;
    }
    //////////////
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
        $("#valueDiffData").html(webConfigXmlObj.find("diffOutputType2").find("DAT_ID_RTCMV32").text());
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
            $("#valueDiffData").html(webConfigXmlObj.find("diffOutputType2").find("DAT_ID_NOVATELX").text());
            return;
        }
    }
    if (frqFlag == "DAT_FRQ_OFF") {
        $("#valueDiffData").html(parent.parent.langXmlObj.find("DAT_FRQ_OFF").text());
    }
}
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
            $("#valueInitialData").html(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            if (data.awk == "rsps") {
                $("#valueInitialData").html(parent.parent.langXmlObj.find(data.frq).text());
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
            $("#valueEphemerisData").html(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            if (data.awk == "rsps") {
                $("#valueEphemerisData").html(parent.parent.langXmlObj.find(data.frq).text());
            }
        }
    });
}
//绑定HCPPP数据
function bindHcpppData(serverIdx) {
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
            "dat_id": "DAT_ID_HCPPP"
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            $("#valueHCPPPData").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            if (data.awk == "rsps") {
                if (data.frq != "unknown") {
                    $("#valueHCPPPData").html(parent.parent.langXmlObj.find(data.frq).text());
                } else {
                    $("#valueHCPPPData").html(parent.parent.langXmlObj.find(data.frq).text());
                }
            }
        }
    });
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
                    $("#valueAutoConnectData").html(parent.parent.langXmlObj.find("true").text());
                } else {
                    $("#valueAutoConnectData").html(parent.parent.langXmlObj.find("false").text());
                }
            }
        }
    });
}
//绑定数据转发格式
function bindDataTranefs(serverIdx) {
    var urlForSubGnssDataGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("subGnssDataGet").text());
    if (urlForSubGnssDataGet == "") {
        return;
    }
    var nmeaString1 = "";
    webConfigXmlObj.find("dataTransfer").children().each(function () {
        var nmeaText = $(this).text(); //tagRTK
        var nmeaType = $(this).attr("id"); //DAT_ID_RTK
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
                    if (data.frq != "unknown" && data.frq != "DAT_FRQ_OFF") {
                        nmeaString1 += parent.parent.langXmlObj.find(nmeaText).text() + ":" + parent.parent.langXmlObj.find(data.frq).text() + ";_";
                    }
                }
            }
        });
    });
    if (nmeaString1 != "") {
        var nmeaStringArray = nmeaString1.split("_");
        var nmeaStringDes = "";
        for (var i = 0; i < nmeaStringArray.length; i++) {
            if ((i + 1) % 3 == 0) {
                nmeaStringDes += nmeaStringArray[i] + "<br />&nbsp;&nbsp;";
            } else {
                nmeaStringDes += nmeaStringArray[i];
            }
        }
        $("#valueData").html(nmeaStringDes);
    } else {
        $("#valueData").html(parent.parent.langXmlObj.find("tagOff").text());
    }
}
//绑定nmea数据
function bindNmeaData(serverIdx) {

    var urlForSubGnssDataGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("subGnssDataGet").text());
    if (urlForSubGnssDataGet == "") {
        return;
    }
    var nmeaString = "";
    var nmeaList = "nmea0183";
    if (parent.parent.GnssBoards[0] == "GNSS_BOARD_TYPE__P307") {
        nmeaList = "nmea0183_P307_I70";
    } else if (parent.parent.GnssBoards[0] == "GNSS_BOARD_TYPE__OEM628") {
        nmeaList = "nmea0183_628E_I70";
    }
    webConfigXmlObj.find(nmeaList).children().each(function () {
        var nmeaText = $(this).attr("intro");
        var nmeaType = $(this).attr("id");
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
                    if (data.frq != "unknown" && data.frq != "DAT_FRQ_OFF") {
                        nmeaString += nmeaText + ":" + parent.parent.langXmlObj.find(data.frq).text() + ";_";
                    }
                }
            }
        });
    });
    if (nmeaString != "") {
        var nmeaStringArray = nmeaString.split("_");
        var nmeaStringDes = "";
        for (var i = 0; i < nmeaStringArray.length; i++) {
            if ((i + 1) % 3 == 0) {
                nmeaStringDes += nmeaStringArray[i] + "<br />&nbsp;&nbsp;";
            } else {
                nmeaStringDes += nmeaStringArray[i];
            }
        }
        $("#valueNmea").html(nmeaStringDes);
    } else {
        $("#valueNmea").html(parent.parent.langXmlObj.find("tagOff").text());
    }
    
    
}

//返回主窗口
function btnBack() {
    parent.closeWindowInfo(serverIdx); //serverIdx
}