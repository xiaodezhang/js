var webConfigXmlObj = parent.webConfigXmlObj;

var gpsStatus = 0xFFFFFFFF;
var sbasStatus = 0xFFFFFFFF;
var glonStatus = 0xFFFFFFFF;
var bdsStatus = 0xFFFFFFFF;
var galileoStatus = 0xFFFFFFFF;
var statusUnableFlag = 0x00000000; //禁用状态
var statusEnableFlag = 0xFFFFFFFF; //启用状态
$(document).ready(function () {
    init();
    if (parent.GnssBoards[0] == "GNSS_BOARD_TYPE__P307") {
        $("#gpsl2c").hide();
        $("#sb").hide();
    }
    $("input:checkbox[name='SBAS']").attr("disabled", true);
});
//设置页面的按钮状态
function bindBtnStatus(data) {
    //gps
    gpsStatus = data.gps;
    /////////////////////////////////
    if (gpsStatus > 0x7FFFFFFF) { 
        gpsStatus = gpsStatus - 0x80000000;
    }  
    for (var i = 0; i < 32; i++) {
        if (gpsStatus % 2 == 1) {
            $($("input:checkbox[name='GPS']").get(i)).attr('checked', true);
        } else {
            $($("input:checkbox[name='GPS']").get(i)).attr('checked', false);
        }
        gpsStatus = gpsStatus >> 1;
    }
    if (data.gps > 0x7FFFFFFF) {
        $($("input:checkbox[name='GPS']").get(31)).attr('checked', true); 
    } else {
        $($("input:checkbox[name='GPS']").get(31)).attr('checked', false);
    }
    gpsStatus = data.gps;
    /////////////////////////////////
    //Sbas
    sbasStatus = data.sbas;
    if (sbasStatus > 0x7FFFFFFF) { 
        sbasStatus = sbasStatus - 0x80000000;
    } 
    for (var i = 0; i < 32; i++) {
        if (sbasStatus % 2 == 1) {
            $($("input:checkbox[name='SBAS']").get(i)).attr('checked', true);
        } else {
            $($("input:checkbox[name='SBAS']").get(i)).attr('checked', false);
        }
        sbasStatus = sbasStatus >> 1;
    }
    if (data.sbas > 0x7FFFFFFF) {
        $($("input:checkbox[name='SBAS']").get(31)).attr('checked', true); 
    } else {
        $($("input:checkbox[name='SBAS']").get(31)).attr('checked', false);
    }
    sbasStatus = data.sbas;
    //Glon
    glonStatus = data.glonass;
    if (glonStatus > 0x7FFFFFFF) { 
        glonStatus = glonStatus - 0x80000000;
    } 
    for (var i = 0; i < 32; i++) {
        if (glonStatus % 2 == 1) {
            $($("input:checkbox[name='GLON']").get(i)).attr('checked', true);
        } else {
            $($("input:checkbox[name='GLON']").get(i)).attr('checked', false);
        }
        glonStatus = glonStatus >> 1;
    }
    if (data.glonass > 0x7FFFFFFF) {
        $($("input:checkbox[name='GLON']").get(31)).attr('checked', true); 
    } else {
        $($("input:checkbox[name='GLON']").get(31)).attr('checked', false);
    }
    glonStatus = data.glonass;
    //bds
    bdsStatus = data.bd;
    if (bdsStatus > 0x7FFFFFFF) { 
        bdsStatus = bdsStatus - 0x80000000;
    } 
    for (var i = 0; i < 32; i++) {
        if (bdsStatus % 2 == 1) {
            $($("input:checkbox[name='BDS']").get(i)).attr('checked', true);
        } else {
            $($("input:checkbox[name='BDS']").get(i)).attr('checked', false);
        }
        bdsStatus = bdsStatus >> 1;
    }
    if (data.bd > 0x7FFFFFFF) {
        $($("input:checkbox[name='BDS']").get(31)).attr('checked', true); 
    } else {
        $($("input:checkbox[name='BDS']").get(31)).attr('checked', false);
    }
    bdsStatus = data.bd;
    //Galileo
    galileoStatus = data.galileo;
    if (galileoStatus > 0x7FFFFFFF) { 
        galileoStatus = galileoStatus - 0x80000000;
    } 
    for (var i = 0; i < 32; i++) {
        if (galileoStatus % 2 == 1) {
            $($("input:checkbox[name='GALILEO']").get(i)).attr('checked', true);
        } else {
            $($("input:checkbox[name='GALILEO']").get(i)).attr('checked', false);
        }
        galileoStatus = galileoStatus >> 1;
    }
    if (data.galileo > 0x7FFFFFFF) {
        $($("input:checkbox[name='GALILEO']").get(31)).attr('checked', true); 
    } else {
        $($("input:checkbox[name='GALILEO']").get(31)).attr('checked', false);
    }
    galileoStatus = data.galileo;
}
//全选功能
function selectall(value) {
    if (value == "GPS") {
        $("input:checkbox[name='GPS']").each(function () {
            $(this).attr('checked', true);
        });
    } else if (value == "BDS") {
        $("input:checkbox[name='BDS']").each(function () {
            $(this).attr('checked', true);
        });
    } else if (value == "SBAS") {
        $("input:checkbox[name='SBAS']").each(function () {
            $(this).attr('checked', true);
        });
    } else if (value == "GLON") {
        $("input:checkbox[name='GLON']").each(function () {
            $(this).attr('checked', true);
        });
    } else if (value == "GALILEO") {
        $("input:checkbox[name='GALILEO']").each(function () {
            $(this).attr('checked', true);
        });
    }
}
//全选取消
function selectnone(value) {
    if (value == "GPS") {
        $("input:checkbox[name='GPS']").each(function () {
            $(this).attr('checked', false);
        });
    } else if (value == "BDS") {
        $("input:checkbox[name='BDS']").each(function () {
            $(this).attr('checked', false);
        });
    } else if (value == "SBAS") {
        $("input:checkbox[name='SBAS']").each(function () {
            $(this).attr('checked', false);
        });
    } else if (value == "GLON") {
        $("input:checkbox[name='GLON']").each(function () {
            $(this).attr('checked', false);
        });
    } else if (value == "GALILEO") {
        $("input:checkbox[name='GALILEO']").each(function () {
            $(this).attr('checked', false);
        });
    }
}
function savebtn(value) {
    if (value == "GPS") {
        var gpsStatus1 = 0;
        $("input:checkbox[name='GPS']").each(function () {
            if ($(this).attr('checked') == "checked") {
                if ($(this).val() == 31) {
                    gpsStatus1 = gpsStatus1 + 0x80000000;
                } else {
                    gpsStatus1 = gpsStatus1 + (1 << $(this).val());
                }
            }
        });
        gpsStatus = gpsStatus1;
    } else if (value == "BDS") {
        var bdsStatus1 = 0;
        $("input:checkbox[name='BDS']").each(function () {
            if ($(this).attr('checked') == "checked") {
                bdsStatus1 = bdsStatus1 + (1 << $(this).val());
            }
        });
        bdsStatus = bdsStatus1;
    } else if (value == "SBAS") {
        var sbasStatus1 = 0;
        $("input:checkbox[name='SBAS']").each(function () {
            if ($(this).attr('checked') == "checked") {
                sbasStatus1 = sbasStatus1 + (1 << $(this).val());
            }
        });
        sbasStatus = sbasStatus1;
    } else if (value == "GLON") {
        var glonStatus1 = 0;
        $("input:checkbox[name='GLON']").each(function () {
            if ($(this).attr('checked') == "checked") {
                glonStatus1 = glonStatus1 + (1 << $(this).val());
            }
        });
        glonStatus = glonStatus1;
    } else if (value == "GALILEO") {
        var galileoStatus1 = 0;
        $("input:checkbox[name='GALILEO']").each(function () {
            if ($(this).attr('checked') == "checked") {
                galileoStatus1 = galileoStatus1 + (1 << $(this).val());
            }
        });
        galileoStatus = galileoStatus1;
    }

    setSatAbleStatus();//设置禁用状态
}

//取消
function unsavebtn(value) {
    if (value == "GPS") {
        $("input:checkbox[name='GPS']").each(function () {
            $(this).attr('checked', false);
        });
    } else if (value == "BDS") {
        $("input:checkbox[name='BDS']").each(function () {
            $(this).attr('checked', false);
        });
    } else if (value == "SBAS") {
        $("input:checkbox[name='SBAS']").each(function () {
            $(this).attr('checked', false);
        });
    } else if (value == "GLON") {
        $("input:checkbox[name='GLON']").each(function () {
            $(this).attr('checked', false);
        });
    } else if (value == "GALILEO") {
        $("input:checkbox[name='GALILEO']").each(function () {
            $(this).attr('checked', false);
        });
    }
}
//设置卫星禁用状态
function setSatAbleStatus() {
    var urlForSetSatelliteAble = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("setSatelliteAble").text());
    if (urlForSetSatelliteAble == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSetSatelliteAble,
        data: {
            "urlStringId": getUrlIdString(),
            "gps": gpsStatus,
            "glonass": glonStatus,
            "bd": bdsStatus,
            "galileo": galileoStatus,
            "sbas": sbasStatus,
            "gpsl2c": GPSL2C
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            openErrorWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            if (data.set_result == "HC_ANSWER_STATUS__OK") {
                messageShowAutoClose(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("setSucc").text());
                init();
            } else {
                openInfoWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("setFail").text());
            }
        }
    });
}
//全部启用
function btnClickSet1(value) {
    if (value == "GPS") {
        gpsStatus = statusEnableFlag;
    } else if (value == "SBAS") {
        sbasStatus = statusEnableFlag;
    } else if (value == "GLON") {
        glonStatus = statusEnableFlag;
    } else if (value == "BDS") {
        bdsStatus = statusEnableFlag;
    } else if (value == "GALILEO") {
        galileoStatus = statusEnableFlag;
    }

    var urlForSetSatelliteAble = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("setSatelliteAble").text());
    if (urlForSetSatelliteAble == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSetSatelliteAble,
        data: {
            "urlStringId": getUrlIdString(),
            "gps": gpsStatus,
            "glonass": glonStatus,
            "bd": bdsStatus,
            "galileo": galileoStatus,
            "sbas": sbasStatus,
            "gpsl2c":GPSL2C
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            openErrorWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            if (data.set_result == "HC_ANSWER_STATUS__OK") {
                messageShowAutoClose(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("setSucc").text());
                init();
            } else {
                openInfoWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("setFail").text());
            }
        }
    });
}
//全部禁用
function btnClickSet2(value) {
    if (value == "GPS") {
        gpsStatus = statusUnableFlag;
    } else if (value == "SBAS") {
        sbasStatus = statusUnableFlag;
    } else if (value == "GLON") {
        glonStatus = statusUnableFlag;
    } else if (value == "BDS") {
        bdsStatus = statusUnableFlag;
    } else if (value == "GALILEO") {
        galileoStatus = statusUnableFlag;
    }

    var urlForSetSatelliteAble = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("setSatelliteAble").text());
    if (urlForSetSatelliteAble == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSetSatelliteAble,
        data: {
            "urlStringId": getUrlIdString(),
            "gps": gpsStatus,
            "glonass": glonStatus,
            "bd": bdsStatus,
            "galileo": galileoStatus,
            "sbas": sbasStatus,
            "gpsl2c":GPSL2C
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            openErrorWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            if (data.set_result == "HC_ANSWER_STATUS__OK") {
                messageShowAutoClose(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("setSucc").text());
                init();
            } else {
                openInfoWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("setFail").text());
            }
        }
    });
}
var GPSL2C = 0;
//初始化获取各卫星的状态
function init() {
    var urlForGetSatelliteAble = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("getSatelliteAble").text());
    if (urlForGetSatelliteAble == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForGetSatelliteAble,
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
                //设置页面的按钮状态
                bindBtnStatus(data);
                GPSL2C = data.gpsl2c;
                if (data.gpsl2c == 1) {
                    $("#gpsl2c").attr('checked', true);
                } else {
                    $("#gpsl2c").attr('checked', false);
                }
            }
        }
    });
}
function setGpsl2c() { 
    if ($("#gpsl2c").is(':checked')) {//选中
        GPSL2C = 1;
    }else{
        GPSL2C = 0;
    }
    setSatAbleStatus();
}