var webConfigXmlObj = parent.webConfigXmlObj;
var value = "wlan0";
$(document).ready(function () {
    getWifiPowerStatus(); //获取Wifi电源状态
    getWifiMac(value); //获取wifi的MAC地址
    getWifiModel(); //获取Wifi模式
});
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
//获取wifi的MAC地址
function getWifiMac(value) {
    var urlForWifiPowerStatusGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("wifiMacGet").text());
    if (urlForWifiPowerStatusGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForWifiPowerStatusGet,
        data: {
            "urlStringId": getUrlIdString(),
            "mac": value
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            $("#spanWlanMac").html(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                $("#spanWlanMac").html(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                return;
            }
            if (data.awk == "rsps") {
                $("#spanWlanMac").html(data.mac_id);
            } else {
                $("#spanWlanMac").html(parent.langXmlObj.find("tipInfo").find("getInfoError").text());
            }
        }
    });
}
//获取Wifi模式
function getWifiModel() {
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
            $("#spanWifiModel").html(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                $("#spanWifiModel").html(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                return;
            }
            if (data.awk == "rsps") {
                if (data.mode == "WIFI_MODE__AP") {
                    $("#spanWifiModel").html(parent.langXmlObj.find("tagWifiModelAp").text());
                    $("#divWifiModelAp").css("visibility", "visible");
                    getWifiModelApInfo(); //获取接入点详细信息
                }
            } else {
                $("#spanWifiModel").html(parent.langXmlObj.find("tipInfo").find("getInfoError").text());
            }
        }
    });
}
//获取接入点详细信息
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
            $("#spanWifiModelApInfo").html(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            $("#spanEncryptType").html(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            $("#spanPwd").html(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                $("#spanSsid").html(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#spanEncryptType").html(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#spanPwd").html(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                return;
            }
            if (data.awk == "rsps") {
                $("#spanSsid").html(data.ssid);
                $("#spanEncryptType").html(parent.langXmlObj.find(data.passwd_type).text());
                $("#spanPwd").html(data.passwd);
            } else {
                $("#spanSsid").html(parent.langXmlObj.find("tipInfo").find("getInfoError").text());
                $("#spanEncryptType").html(parent.langXmlObj.find("tipInfo").find("getInfoError").text());
                $("#spanPwd").html(parent.langXmlObj.find("tipInfo").find("getInfoError").text());
            }
        }
    });
}