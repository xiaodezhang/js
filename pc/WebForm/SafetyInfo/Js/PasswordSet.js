var webConfigXmlObj = parent.webConfigXmlObj;
$(document).ready(function () {
    getPwd(); //获取密码
});
//获取密码
function getPwd() {
    var urlForWifiAutoPowerOnSet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("getPwd").text());
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
                $("#spanName").val(data.user);
                $("#spanPwd").val(data.password);
               
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

