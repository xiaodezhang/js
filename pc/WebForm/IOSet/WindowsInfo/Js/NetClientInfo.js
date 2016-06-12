var webConfigXmlObj = parent.parent.webConfigXmlObj;
var linkIdx;
var serverType;
$(document).ready(function () {
    linkIdx = request.QueryString("linkIdx");
    getSeServiceType(linkIdx); //获取连接协议
    getNetlinkIpAddr(linkIdx); //获取web ip地址
    getNetlinkNamePwd(linkIdx);
    getNetlinkDataSource(linkIdx);
    bindDiffOutputTypeSelect(linkIdx); //绑定差分输出格式下拉框
    bindRawDataSe(linkIdx); //绑定原始数据
    bindEphemerisData(linkIdx); //绑定星历数据
    bindHcpppData(linkIdx); //绑定HCPPP数据
    bindNmeaData(linkIdx); //绑定nmea数据
    bindDataTranefs(linkIdx);//绑定数据转发格式
    getAutoConnectData(linkIdx); //获取自动连接值
});

function getNetlinkDataSource(linkIdx) {
    var urlForRegisterTimeGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("netDataSourceGet").text());
    if (urlForRegisterTimeGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForRegisterTimeGet,
        data: {
            "urlStringId": getUrlIdString(),
            "link_idx": linkIdx
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            $("#valueSetupPoint").html(data.data_source);
        }
    });
}
function getNetlinkNamePwd(linkIdx) {
    var urlForRegisterTimeGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("netAccountGet").text());
    if (urlForRegisterTimeGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForRegisterTimeGet,
        data: {
            "urlStringId": getUrlIdString(),
            "link_idx": linkIdx
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            parent.messageShow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            $("#valueUserName").html(data.name);
            $("#valuePwd").html(data.pwd);
        }
    });
}
//获取连接协议
function getSeServiceType(linkIdx) {
    var urlForNetServerTypeGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("netServerTypeGet").text());
    if (urlForNetServerTypeGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForNetServerTypeGet,
        data: {
            "urlStringId": getUrlIdString(),
            "link_idx": linkIdx
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            $("#valueServiceType").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            $("#valueServiceType").html(webConfigXmlObj.find("serverType2").find(data.server_type).text());
            if (data.server_type == "NETLINK_SERVER_TYPE__NTRIP_SERVER") {
                $("#trUserName").hide();
                $("#trPwd").show();
                $("#trSetupPointColon").show();
                $("#trInitialData").hide();
                $("#trEphemerisData").hide();
                $("#trHCPPPData").hide();
                $("#AA1").hide();
            } else {
                $("#trUserName").hide();
                $("#trPwd").hide();
                $("#trSetupPointColon").hide();
                $("#trInitialData").show();
                $("#trEphemerisData").show();
                $("#trHCPPPData").show();
                $("#AA1").show();
            }
        }
    });
}

//获取web ip地址
function getNetlinkIpAddr(linkIdx) {
    var urlForNetIpAddrGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("netIpAddrGet").text());
    if (urlForNetIpAddrGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForNetIpAddrGet,
        data: {
            "urlStringId": getUrlIdString(),
            "link_idx": linkIdx
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            $("#valueRemteIp").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            $("#valueRemtePort").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                $("#valueRemteIp").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#valueRemtePort").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
            }
            if (data.awk == "rsps") {
                $("#valueRemteIp").html(data.ip);
                $("#valueRemtePort").html(data.port);
            } else {
                $("#valueRemteIp").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoError").text());
                $("#valueRemtePort").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoError").text());
            }
        }
    });
} 
//绑定差分输出格式下拉框
function bindDiffOutputTypeSelect(linkIdx) {
    var frqFlag="";
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
            $("#valueDiffData").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
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
            "io_id": linkIdx,
            "dat_id": "DAT_ID_CMR2"
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            $("#valueDiffData").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
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
            "io_id": linkIdx,
            "dat_id": "DAT_ID_SCMR"
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            $("#valueDiffData").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
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
            "io_id": linkIdx,
            "dat_id": "DAT_ID_RTCM"
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            $("#valueDiffData").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
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
            "io_id": linkIdx,
            "dat_id": "DAT_ID_RTCMV3"
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            $("#valueDiffData").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
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
    /////
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
            $("#valueDiffData").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
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
    /////
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
            $("#valueDiffData").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
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
            $("#valueDiffData").html(webConfigXmlObj.find("diffOutputType2").find("DAT_ID_NOVATELX").text());
            return;
        }
    }
    if (frqFlag == "DAT_FRQ_OFF") {
        $("#valueDiffData").html(parent.parent.langXmlObj.find("DAT_FRQ_OFF").text());
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
            $("#valueInitialData").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            if (data.awk == "rsps") {
                if (data.frq != "unknown") {
                    $("#valueInitialData").html(parent.parent.langXmlObj.find(data.frq).text());
                } else {
                    $("#valueInitialData").html(parent.parent.langXmlObj.find(data.frq).text());
                }
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
            $("#valueEphemerisData").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            if (data.awk == "rsps") {
                if (data.frq != "unknown") {
                    $("#valueEphemerisData").html(parent.parent.langXmlObj.find(data.frq).text());
                } else {
                    $("#valueEphemerisData").html(parent.parent.langXmlObj.find(data.frq).text());
                }
            }
        }
    });
}
//绑定HCPPP数据
function bindHcpppData(linkIdx) {
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
function getAutoConnectData(linkIdx) {
    var urlForSubGnssDataGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("netAutoOpenGet").text());
    if (urlForSubGnssDataGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSubGnssDataGet,
        data: {
            "urlStringId": getUrlIdString(),
            "link_idx": linkIdx,
           
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
function bindDataTranefs(linkIdx) {
    var urlForSubGnssDataGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("subGnssDataGet").text());
    if (urlForSubGnssDataGet == "") {
        return;
    }
    var nmeaString1 = "";
    webConfigXmlObj.find("dataTransfer").children().each(function () {
        var nmeaText = $(this).text();//tagRTK
        var nmeaType = $(this).attr("id");//DAT_ID_RTK
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
function bindNmeaData(linkIdx) {
    var urlForSubGnssDataGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("subGnssDataGet").text());
    if (urlForSubGnssDataGet == "") {
        return;
    }
    var nmeaString = "";
    var nmeaList="nmea0183";
    if (parent.parent.GnssBoards[0] == "GNSS_BOARD_TYPE__P307") {
        nmeaList="nmea0183_P307_I70";
    }else if(parent.parent.GnssBoards[0] == "GNSS_BOARD_TYPE__OEM628"){
        nmeaList="nmea0183_628E_I70";
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
    parent.closeWindowInfo(linkIdx); //linkIdx
}
