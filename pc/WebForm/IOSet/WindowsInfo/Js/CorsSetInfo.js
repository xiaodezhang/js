var webConfigXmlObj = parent.parent.webConfigXmlObj;
var linkIdx;
$(document).ready(function () {
    linkIdx = request.QueryString("linkIdx");
    getSeServiceType(linkIdx); //获取连接协议
});
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
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            $("#valueServiceType").html(webConfigXmlObj.find("serverType1").find(data.server_type).text());
            operateControllerByLinkType(data.server_type);
        }
    });
}
var windowType = "rtkinfo";
//根据连接协议显示部分控件
function operateControllerByLinkType(linkType) {
    if (linkType == "NETLINK_SERVER_TYPE__CORS_CASTER") {
        //隐藏差分数据
        $("#trDiffData").hide();
        //显示安装点，用户名，密码
        $("#trSetupPoint").show();
        $("#tagSetupPointColon").html(langXmlObj.find("tagSetupPointColon").text());
        $('#btnGetDataSourceList').linkbutton('enable'); //启用获取安装点按钮
        $("#trUserName").show();
        $("#trPwd").show();
        //调整主窗口的高度
        parent.updateWindow(windowType, 310);
        //获取数据
        getInitDataForCorsCaster();

    } else if (linkType == "NETLINK_SERVER_TYPE__APIS_ROVER") {
        //隐藏用户名，密码,差分数据
        $("#trUserName").hide();
        $("#trPwd").hide();
        $("#trDiffData").hide();
        //显示安装点
        $("#trSetupPoint").show();
        $("#tagSetupPointColon").html(langXmlObj.find("tagSiteId").text());
        //禁用获取安装点按钮
        $('#btnGetDataSourceList').linkbutton('disable');
        //调整主窗口的高度
        parent.updateWindow(windowType, 240);
        //获取数据
        //getNetDataSource(linkIdx); //获取安装点  
        getInitDataFoApisRover();
    } else if (linkType == "NETLINK_SERVER_TYPE__APIS_BASE") {
        //隐藏安装点,用户名，密码
        $("#trSetupPoint").hide();
        $("#trUserName").hide();
        $("#trPwd").hide();
        //显示差分数据
        $("#trDiffData").show();
        bindDiffOutputTypeSelect(); //绑定差分输出格式下拉框
        //调整主窗口的高度
        parent.updateWindow(windowType, 240);
        //获取数据
        getInitDataFoApisBase();
    } else if (linkType == "NETLINK_SERVER_TYPE__TCP") {
        //隐藏安装点,用户名，密码
        $("#trSetupPoint").hide();
        $("#trUserName").hide();
        $("#trPwd").hide();
        //显示差分数据
        $("#trDiffData").hide();
        //bindDiffOutputTypeSelect(); //绑定差分输出格式下拉框
        //调整主窗口的高度
        parent.updateWindow(windowType, 240);
        //获取数据
        getInitDataFoTcp();
    }
}
//初始化数据cors_caster
function getInitDataForCorsCaster() {
    var urlForNetrtkParaGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("netrtkParaGet").text());
    if (urlForNetrtkParaGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForNetrtkParaGet,
        data: {},
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            $("#valueNtripCasterHttp").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            $("#valueNtripCasterPort").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            $("#valueUserName").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            $("#valuePwd").html("");
            $("#valueSetupPoint").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                $("#valueNtripCasterHttp").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#valueNtripCasterPort").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#valueUserName").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#valuePwd").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#valueSetupPoint").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
            }
            if (data.awk == "rsps") {
                $("#valueNtripCasterHttp").html(data.cors_caster__ip);
                $("#valueNtripCasterPort").html(data.cors_caster__port);
                $("#valueUserName").html(data.cors_caster__account_name);
                $("#valuePwd").html(data.cors_caster__account_passwd);
                $("#valueSetupPoint").html(data.cors_caster__data_source);
            } else {
                $("#valueNtripCasterHttp").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoError").text());
                $("#valueNtripCasterPort").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoError").text());
                $("#valueUserName").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoError").text());
                $("#valuePwd").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoError").text());
                $("#valueSetupPoint").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoError").text());
            }
        }
    });
}
//初始化数据apis_rover
function getInitDataFoApisRover() {
    var urlForNetrtkParaGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("netrtkParaGet").text());
    if (urlForNetrtkParaGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForNetrtkParaGet,
        data: {},
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            $("#valueNtripCasterHttp").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            $("#valueNtripCasterPort").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            $("#valueSetupPoint").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                $("#valueNtripCasterHttp").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#valueNtripCasterPort").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#valueSetupPoint").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
            }
            if (data.awk == "rsps") {
                $("#valueNtripCasterHttp").html(data.apis_rover__ip);
                $("#valueNtripCasterPort").html(data.apis_rover__port);
                $("#valueSetupPoint").html(data.apis_rover__data_source);
            } else {
                $("#valueNtripCasterHttp").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoError").text());
                $("#valueNtripCasterPort").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoError").text());
                $("#valueSetupPoint").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoError").text());
            }
        }
    });
}
//初始化数据apis_base
function getInitDataFoApisBase() {
    var urlForNetrtkParaGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("netrtkParaGet").text());
    if (urlForNetrtkParaGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForNetrtkParaGet,
        data: {},
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            $("#valueNtripCasterHttp").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            $("#valueNtripCasterPort").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                $("#valueNtripCasterHttp").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#valueNtripCasterPort").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
            }
            if (data.awk == "rsps") {
                $("#valueNtripCasterHttp").html(data.apis_base__ip);
                $("#valueNtripCasterPort").html(data.apis_base__port);
            } else {
                $("#valueNtripCasterHttp").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoError").text());
                $("#valueNtripCasterPort").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoError").text());
            }
        }
    });
}
//初始化数据tcp
function getInitDataFoTcp() {
    var urlForNetrtkParaGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("netrtkParaGet").text());
    if (urlForNetrtkParaGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForNetrtkParaGet,
        data: {},
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            $("#valueNtripCasterHttp").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            $("#valueNtripCasterPort").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                $("#valueNtripCasterHttp").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#valueNtripCasterPort").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
            }
            if (data.awk == "rsps") {
                $("#valueNtripCasterHttp").html(data.tcp__ip);
                $("#valueNtripCasterPort").html(data.tcp__port);
            } else {
                $("#valueNtripCasterHttp").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoError").text());
                $("#valueNtripCasterPort").html(parent.parent.langXmlObj.find("tipInfo").find("getInfoError").text());
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
        $("#valueDiffData").html(webConfigXmlObj.find("diffOutputType2").find("DAT_ID_RTCM").text());
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
        $("#valueDiffData").html(webConfigXmlObj.find("diffOutputType2").find("DAT_ID_RTD").text());
        return;
    }
    ///////////
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
        $("#valueDiffData").html(webConfigXmlObj.find("diffOutputType2").find("DAT_ID_RTCMV3").text());
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

//返回主窗口
function btnBackInfo() {
    parent.closeWindowInfo(linkIdx); //linkIdx
}