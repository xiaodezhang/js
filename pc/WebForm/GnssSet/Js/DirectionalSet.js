var webConfigXmlObj = parent.webConfigXmlObj;
$(document).ready(function () {
    if (parent.g3Show == "true") {
        $("#internetexit").show();
    } else {
        $("#internetexit").hide();
    }
    getWifiPowerStatus(); //获取Wifi电源状态
    getWifiAutoPowerInfo(); //获取Wifi开机自启动信息
    initWifiModeCombobox(); //初始化工作模式下拉框
    getWifiMode(); //获取Wifi模式
    getInternet(); //获取是否上网标志
});
//获取是否上网标志位
function getInternet() {
    var urlForWifiAutoPowerOnSet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("wifiInternetGet").text());
    if (urlForWifiAutoPowerOnSet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForWifiAutoPowerOnSet,
        data: {
            "urlStringId": getUrlIdString()
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            openErrorWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            if (data == null) {
                return;
            }
            if (data.awk == "rsps") {
                if (data.internet) {
                    $("#wifiInternetYes").attr("checked", true);
                    $("#wifiInternetNo").attr("checked", false);
                    setInternet111("true");
                }
                else {
                    $("#wifiInternetYes").attr("checked", false);
                    $("#wifiInternetNo").attr("checked", true);
                }
            }
        }
    });
}

var wifiPowerStatus = "";
//获取Wifi电源状态
function getWifiPowerStatus() {
    var urlForWifiPowerStatusGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("wifiPowerStatusGet").text());
    if (urlForWifiPowerStatusGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForWifiPowerStatusGet,
        data: {
            "urlStringId": getUrlIdString()
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            $("#spanWifiPowerStatus").html(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                $("#spanWifiPowerStatus").html(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                return;
            }
            if (data.awk == "rsps") {
                wifiPowerStatus = data.status;
                if (data.status == "WIFI_POWER_STATUS__POWER_ON") {
                    $("#spanWifiPowerStatus").html(parent.langXmlObj.find("tagOn").text());
                } else if (data.status == "WIFI_POWER_STATUS__POWER_OFF") {
                    $("#spanWifiPowerStatus").html(parent.langXmlObj.find("tagOff").text());
                } else if (data.status == "WIFI_POWER_STATUS__POWER_ING") {
                    $("#spanWifiPowerStatus").html(parent.langXmlObj.find("tagIng").text());
                }
            } else {
                $("#spanWifiPowerStatus").html(parent.langXmlObj.find("tipInfo").find("getInfoError").text());
            }
        }
    });
}
//关闭wifi模块
function closeWifiPower() {
    var confirmTitle = parent.langXmlObj.find("tagWindowConfirmName").text();
    var confirmInfo = parent.langXmlObj.find("tipInfo").find("conToCloseWifiModule").text();
    $.messager.confirm(confirmTitle, confirmInfo, function (r) {
        if (r) {
            closingWifiModule();
        }
    });
}
function closingWifiModule() {
    if (wifiPowerStatus == "") {
        return;
    }
    if (wifiPowerStatus == "WIFI_POWER_STATUS__POWER_OFF") {
        openInfoWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("wifiModuleBeenClosed").text());
        return;
    } else if (wifiPowerStatus == "WIFI_POWER_STATUS__POWER_ING") {
        openInfoWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("wifiModuleBeenOpening").text());
        return;
    }
    var win = $.messager.progress({
        title: parent.langXmlObj.find("tipInfo").find("pleaseWaiting").text(),
        text: "",
        msg: parent.langXmlObj.find("tipInfo").find("closingModule").text()
    });
    var urlForWifiPowerOffSet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("wifiPowerOffSet").text());
    if (urlForWifiPowerOffSet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForWifiPowerOffSet,
        data: {
            "urlStringId": getUrlIdString()
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            $.messager.progress('close');
            openErrorWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            $.messager.progress('close');
            if (data.set_result == "HC_ANSWER_STATUS__OK") {
                wifiPowerStatus = "WIFI_POWER_STATUS__POWER_OFF";
                $("#spanWifiPowerStatus").html(parent.langXmlObj.find("tagOff").text());
                //messageShowAutoClose(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("wifiModuleCloseSucc").text());
            } else {
                openInfoWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("wifiModuleCloseFail").text());
            }
        }
    });
}
//获取Wifi开机自启动信息
function getWifiAutoPowerInfo() {
    var urlForWifiAutoPowerOnGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("wifiAutoPowerOnGet").text());
    if (urlForWifiAutoPowerOnGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForWifiAutoPowerOnGet,
        data: {
            "urlStringId": getUrlIdString()
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
                if (data.auto_on) {
                    $("#wifiAutoStartSetYes").attr("checked", true);
                    $("#wifiAutoStartSetNo").attr("checked", false);
                }
                else {
                    $("#wifiAutoStartSetYes").attr("checked", false);
                    $("#wifiAutoStartSetNo").attr("checked", true);
                }
            }
        }
    });
}
//Wifi开机自启动
function setWifiAutoPowerOn(value) {
    var urlForWifiAutoPowerOnSet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("wifiAutoPowerOnSet").text());
    if (urlForWifiAutoPowerOnSet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForWifiAutoPowerOnSet,
        data: {
            "urlStringId": getUrlIdString(),
            "auto_on": value
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            openErrorWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            if (data.set_result == "HC_ANSWER_STATUS__OK") {
                messageShowAutoClose(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("wifiModuleAutoStartSetSucc").text());
            } else {
                openInfoWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("wifiModuleAutoStartSetFail").text());
            }
        }
    });
}
//获取拨号状态
function getDialStatusInfo(value) {
    var urlForDialStatusGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("G3DialStatusGet").text());
    if (urlForDialStatusGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForDialStatusGet,
        data: {
            "urlStringId": getUrlIdString()
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            $("#spanDialStatus").html(parent.langXmlObj.find("getInfoFail").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                $("#spanDialStatus").html(parent.langXmlObj.find("getInfoNull").text());
                return;
            }
            if (data.awk == "rsps") {
                G3DialStatus = data.dialStatus;
                if (G3DialStatus == "G3_DIAL_STATUS__DAIL_ON") {
                    setInternet(value);//3G已链接
                } else {
                    openInfoWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("netModeSetFail1").text());
                    $("#wifiInternetNo").attr("checked", true);
                    $("#wifiInternetYes").attr("checked", false);
                } 
            }
        }
    });
}
function setInternet111(value) {
    var urlForWifiAutoPowerOnSet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("wifiInternetSet").text());
    if (urlForWifiAutoPowerOnSet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForWifiAutoPowerOnSet,
        data: {
            "urlStringId": getUrlIdString(),
            "internet": value
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            openErrorWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            if (data.set_result == "HC_ANSWER_STATUS__OK") {
                //messageShowAutoClose(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("wifiInternetSetSucc").text());
            } else {
                //openInfoWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("wifiInternetSetFail").text());
            }
        }
    });
}
function setInternet(value) {
    var urlForWifiAutoPowerOnSet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("wifiInternetSet").text());
    if (urlForWifiAutoPowerOnSet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForWifiAutoPowerOnSet,
        data: {
            "urlStringId": getUrlIdString(),
            "internet": value
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            openErrorWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            if (data.set_result == "HC_ANSWER_STATUS__OK") {
                messageShowAutoClose(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("wifiInternetSetSucc").text());
            } else {
                openInfoWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("wifiInternetSetFail").text());
            }
        }
    });
}
//初始化下拉框
function initWifiModeCombobox() {
    //初始化工作模式下拉框
    var dataArray = [];
    webConfigXmlObj.find("wifiModes").children().each(function () {
        var jsonItem = { label: parent.langXmlObj.find($(this).attr("tagName")).text(), value: this.tagName };
        dataArray.push(jsonItem);
    });
    $("#comWifiModelApInfo").combobox({
        valueField: 'value',
        textField: 'label',
        data: dataArray,
        onSelect: function () {
            var wifiModeValue = $("#comWifiModelApInfo").combobox("getValue");
            if (wifiModeValue == "WIFI_MODE__AP") {
                if ($("#divWifiModeAp").css("display") == "none") {
                    $("#divWifiModeAp").css("display", "inherit");
                }
                getWifiModelApInfo(); //获取接入点详细信息
            } else {
                if ($("#divWifiModeAp").css("display") == "block") {
                    $("#divWifiModeAp").css("display", "none");
                }
            }
        }
    });
    //初始化加密类型下拉框
    dataArray = [];
    webConfigXmlObj.find("wifiEncryptTypes").children().each(function () {
        var jsonItem = { label: parent.langXmlObj.find($(this).attr("tagName")).text(), value: this.tagName };
        dataArray.push(jsonItem);
    });
    $("#comEncryptType").combobox({
        valueField: 'value',
        textField: 'label',
        data: dataArray
    });
}
//获取Wifi模式
function getWifiMode() {
    var urlForWifiModelGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("wifiModelGet").text());
    if (urlForWifiModelGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForWifiModelGet,
        data: {
            "urlStringId": getUrlIdString()
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
                if (data.mode == "WIFI_MODE__AP") {
                    $("#divWifiModeAp").css("display", "inherit");
                    $("#comWifiModelApInfo").combobox("setValue", data.mode);
                    $("#comWifiModelApInfo").combobox("setText", parent.langXmlObj.find(webConfigXmlObj.find("wifiModes").find(data.mode).attr("tagName")).text());
                    getWifiModelApInfo(); //获取接入点详细信息
                }
            }
        }
    });
}
//获取接入点详细信息
var wifipasswd = "";
function getWifiModelApInfo() {
    var urlForWifiApParaGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("wifiApParaGet").text());
    if (urlForWifiApParaGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForWifiApParaGet,
        data: {
            "urlStringId": getUrlIdString()
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            $("#ipSsid").val(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            $("#comEncryptType").combobox("setText", parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            $("#ipPwd").val(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                $("#ipSsid").val(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#comEncryptType").combobox("setText", parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#ipPwd").val(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                return;
            }
            if (data.awk == "rsps") {
                $("#ipSsid").val(data.ssid);
                $("#comEncryptType").combobox("setValue", data.passwd_type);
                $("#comEncryptType").combobox("setText", parent.langXmlObj.find(data.passwd_type).text());
                $("#ipPwd").val(data.passwd);
                wifipasswd = data.passwd;
            } else {
                $("#ipSsid").val(parent.langXmlObj.find("tipInfo").find("getInfoError").text());
                $("#comEncryptType").combobox("setText", parent.langXmlObj.find("tipInfo").find("getInfoError").text());
                $("#ipPwd").val(parent.langXmlObj.find("tipInfo").find("getInfoError").text());
            }
        }
    });
}
//保存设置
function btnSave() {
    var modeValue = $("#comWifiModelApInfo").combobox("getValue");
    if (modeValue == "WIFI_MODE__AP") {
        var apSsid = $("#ipSsid").val();
        if (apSsid == "") {
            openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("ssidNotNull").text());
            return;
        }
        var apEncryptType = $("#comEncryptType").combobox("getValue");
        var apPassword = $("#ipPwd").val();
        if (!(apPassword.length >= 8 && apPassword.length <= 18)) {
            openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("pwdWifiError").text());
            return;
        }
        if (wifipasswd != apPassword) {
            //wifi密码发生改变
            var confirmTitle = parent.langXmlObj.find("tagWindowConfirmName").text();
            var confirmInfo = parent.langXmlObj.find("tipInfo").find("wifiPwdChange").text();
            $.messager.confirm(confirmTitle, confirmInfo, function (r) {
                if (r) {
                    //var value = $("input[name='Internet'][type='radio']:checked").val(); //获取单选按钮的值
                    setWifiModeAp(apSsid, apEncryptType, apPassword); //设置AP模式参数
                    setWifiMode(modeValue); //设置Wifi模式
                } else {
                    return;
                }
            });

        } else {
            setWifiModeAp(apSsid, apEncryptType, apPassword); //设置AP模式参数
            setWifiMode(modeValue); //设置Wifi模式
        }

    }
}
//设置AP模式参数
function setWifiModeAp(apSsid, apEncryptType, apPassword) {
    var urlForWifiApParaSet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("wifiApParaSet").text());
    if (urlForWifiApParaSet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        async: false,
        contentType: "application/json;charset=utf-8",
        url: urlForWifiApParaSet,
        data: {
            "urlStringId": getUrlIdString(),
            "ssid": apSsid,
            "passwd": apPassword,
            "passwd_type": apEncryptType
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            //parent.messageShow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            if (data.set_result == "HC_ANSWER_STATUS__OK") {
                //$("#spanWifiPowerStatus").html(parent.langXmlObj.find("tagOn").text());
                //parent.messageShow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("wifiApParaSetSucc").text());
            } else {
                //parent.messageShow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("wifiApParaSetFail").text());
            }
        }
    });
}
//设置Wifi模式
function setWifiMode(modeValue) {
    var urlForWifiModelSet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("wifiModelSet").text());
    if (urlForWifiModelSet == "") {
        return;
    }
    var win = $.messager.progress({
        title: parent.langXmlObj.find("tipInfo").find("pleaseWaiting").text(),
        text: "",
        msg: parent.langXmlObj.find("tipInfo").find("saving").text()
    });
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForWifiModelSet,
        data: {
            "urlStringId": getUrlIdString(),
            "mode": modeValue
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            $.messager.progress('close');
            parent.messageShow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            $.messager.progress('close');
            if (data.set_result == "HC_ANSWER_STATUS__OK") {
                $("#spanWifiPowerStatus").html(parent.langXmlObj.find("tagOn").text());
                parent.messageShow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("wifiModeSetSucc").text());
            } else {
                parent.messageShow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("wifiModeSetFail").text());
            }
        }
    });
}

