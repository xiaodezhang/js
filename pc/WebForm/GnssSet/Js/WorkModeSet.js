var webConfigXmlObj = parent.webConfigXmlObj;
$(document).ready(function () {
    initWifiModeCombobox(); //初始化工作模式下拉框
});

//var ops = $('#seBaseSiteMode').combobox('getText');
//初始化下拉框
function initWifiModeCombobox() {
    /*
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
    */
}

function btnSaveInfo(){


    alert("btnSaveInfo");
    if (window.location.protocol == "https:") {
        var  urlForGnssDataGet= "https://" + window.location.host + "/get_receiver_config.cmd";
    } else {
        var urlForGnssDataGet= "http://" + window.location.host + "/get_receiver_config.cmd";
    }

    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForGnssDataGet,
        data: {
            "urlStringId": getUrlIdString(),
            "config": "setrov"
        },
        sync:false,
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            alert("error");
            return;
        },
        success: function (data) {
            alert("success");
            alert(data.ok);
            return;
        }
    });
    
}
