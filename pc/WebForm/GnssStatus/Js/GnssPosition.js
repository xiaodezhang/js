var webConfigXmlObj = parent.webConfigXmlObj;
$(document).ready(function () {
//    getGnssTrackInfo(); //获取卫星跟踪信息
    setTimeout("getCurrentPosition()", 100); //获取当前位置
 //   setTimeout("getGnssClock()", 300); //获取接收机时钟
//    setTimeout("getDop()", 500); //获取DOP数据

   initInterval(); //定时刷新页面
});
//定时刷新页面
function initInterval() {
//    setInterval("getGnssTrackInfo()", 10000); //获取卫星跟踪信息
   setInterval("getCurrentPosition()", 10200); //获取当前位置
//    setInterval("getGnssClock()", 10400); //获取接收机时钟
//    setInterval("getDop()", 10600); //获取DOP数据
}
//获取卫星跟踪信息
function getGnssTrackInfo() {
    var urlForGnssDataGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("gnssDataGet").text());
    if (urlForGnssDataGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForGnssDataGet,
        data: {
            "urlStringId": getUrlIdString(),
            "dat_id": "DAT_ID_SV_TRACK"
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            bindErrorInfo(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                bindErrorInfo(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                return;
            }
            if (data.dat_status == "HC_ANSWER_STATUS__OK") {
                bindTrackedInfo(data);
            } else {
                bindTimeoutInfo();
            }
        }
    });
}
function bindErrorInfo(info) {
    $("#spanUsedNum").html(info);
    $("#spanUsedGpsString").html(info);
    $("#spanUsedSbasString").html(info);
    $("#spanUsedGlonString").html(info);
    $("#spanUsedBdsString").html(info);
    $("#spanUsedGalileoString").html(info);

    $("#spanTrackedNum").html(info);
    $("#spanGpsString").html(info);
    $("#spanSbasString").html(info);
    $("#spanGlonString").html(info);
    $("#spanBdsString").html(info);
    $("#spanGalileoString").html(info);
}
function bindTimeoutInfo() {
    $("#spanUsedNum").html(0);
    $("#spanUsedGpsNum").html(0);
    $("#spanUsedGpsString").html("");
    $("#spanUsedSbasNum").html(0);
    $("#spanUsedSbasString").html("");
    $("#spanUsedGlonNum").html(0);
    $("#spanUsedGlonString").html("");
    $("#spanUsedBdsNum").html(0);
    $("#spanUsedBdsString").html("");
    $("#spanUsedGalileoNum").html(0);
    $("#spanUsedGalileoString").html("");

    $("#spanTrackedNum").html(0);
    $("#spanGpsNum").html(0);
    $("#spanGpsString").html("");
    $("#spanSbasNum").html(0);
    $("#spanSbasString").html("");
    $("#spanGlonNum").html(0);
    $("#spanGlonString").html("");
    $("#spanBdsNum").html(0);
    $("#spanBdsString").html("");
    $("#spanGalileoNum").html(0);
    $("#spanGalileoString").html("");
}
function bindTrackedInfo(data) {
    //使用中的卫星
    var spanString = "";
    var gpsUsedNum = 0;
    for (var kgps = 0; kgps < data.GPS.length; kgps++) {
        if (data.GPS[kgps].use) {
            gpsUsedNum++;
            spanString += data.GPS[kgps].prn + ",";
        }
    }
    if (spanString.length > 2) {
        spanString = spanString.substring(0, spanString.length - 1);
    }
    $("#spanUsedGpsNum").html(gpsUsedNum);
    $("#spanUsedGpsString").html(spanString);
    spanString = "";
    var sbasUsedNum = 0;
    for (var ksbas = 0; ksbas < data.SBAS.length; ksbas++) {
        if (data.SBAS[ksbas].use) {
            sbasUsedNum++;
            spanString += data.SBAS[ksbas].prn + ",";
        }
    }
    if (spanString.length > 2) {
        spanString = spanString.substring(0, spanString.length - 1);
    }
    $("#spanUsedSbasNum").html(sbasUsedNum);
    $("#spanUsedSbasString").html(spanString);
    spanString = "";
    var gloUsedNum = 0;
    for (var kglo = 0; kglo < data.GLONASS.length; kglo++) {
        if (data.GLONASS[kglo].use) {
            gloUsedNum++;
            spanString += data.GLONASS[kglo].prn + ",";
        }
    }
    if (spanString.length > 2) {
        spanString = spanString.substring(0, spanString.length - 1);
    }
    $("#spanUsedGlonNum").html(gloUsedNum);
    $("#spanUsedGlonString").html(spanString);
    spanString = "";
    var bdsUsedNum = 0;
    for (var kbds = 0; kbds < data.BDS.length; kbds++) {
        if (data.BDS[kbds].use) {
            bdsUsedNum++;
            spanString += data.BDS[kbds].prn + ",";
        }
    }
    if (spanString.length > 2) {
        spanString = spanString.substring(0, spanString.length - 1);
    }
    $("#spanUsedBdsNum").html(bdsUsedNum);
    $("#spanUsedBdsString").html(spanString);
    spanString = "";
    var galileoUsedNum = 0;
    for (var kgalileo = 0; kgalileo < data.GALILEO.length; kgalileo++) {
        if (data.GALILEO[kgalileo].use) {
            galileoUsedNum++;
            spanString += data.GALILEO[kgalileo].prn + ",";
        }
    }
    if (spanString.length > 2) {
        spanString = spanString.substring(0, spanString.length - 1);
    }
    $("#spanUsedGalileoNum").html(galileoUsedNum);
    $("#spanUsedGalileoString").html(spanString);


    var usedSum = gpsUsedNum + sbasUsedNum + gloUsedNum + bdsUsedNum + galileoUsedNum;
    $("#spanUsedNum").html(usedSum + parent.langXmlObj.find("tagKe").text());
    //跟踪到得卫星
    var totalNum = parseInt(data.gps_num) + parseInt(data.sbas_num) + parseInt(data.glo_num) + parseInt(data.bds_num) + parseInt(data.gali_num);
    $("#spanTrackedNum").html(totalNum + parent.langXmlObj.find("tagKe").text());
    var spanString = "";
    $("#spanGpsNum").html(data.gps_num);
    for (var kgps = 0; kgps < data.GPS.length; kgps++) {
        if (kgps == data.GPS.length - 1) {
            spanString += data.GPS[kgps].prn;
        } else {
            spanString += data.GPS[kgps].prn + ",";
        }
    }
    $("#spanGpsString").html(spanString);
    spanString = "";
    $("#spanSbasNum").html(data.sbas_num);
    for (var ksbas = 0; ksbas < data.SBAS.length; ksbas++) {
        if (ksbas == data.SBAS.length - 1) {
            spanString += data.SBAS[ksbas].prn;
        } else {
            spanString += data.SBAS[ksbas].prn + ",";
        }
    }
    $("#spanSbasString").html(spanString);
    spanString = "";
    $("#spanGlonNum").html(data.glo_num);
    for (var kglo = 0; kglo < data.GLONASS.length; kglo++) {
        if (kglo == data.GLONASS.length - 1) {
            spanString += data.GLONASS[kglo].prn;
        } else {
            spanString += data.GLONASS[kglo].prn + ",";
        }
    }
    $("#spanGlonString").html(spanString);
    spanString = "";
    $("#spanBdsNum").html(data.bds_num);
    for (var kbds = 0; kbds < data.BDS.length; kbds++) {
        if (kbds == data.BDS.length - 1) {
            spanString += data.BDS[kbds].prn;
        } else {
            spanString += data.BDS[kbds].prn + ",";
        }
    }
    $("#spanBdsString").html(spanString);

    spanString = "";
    $("#spanGalileoNum").html(data.gali_num);
    for (var kgalileo = 0; kgalileo < data.GALILEO.length; kgalileo++) {
        if (kgalileo == data.GALILEO.length - 1) {
            spanString += data.GALILEO[kgalileo].prn;
        } else {
            spanString += data.GALILEO[kgalileo].prn + ",";
        }
    }
    $("#spanGalileoString").html(spanString);
}
//获取DOP数据
function getDop() {
    if (window.location.protocol == "https:") {
        var  urlForGnssDataGet= "https://" + window.location.host + "/get_receiver_guide.cmd";
    } else {
        var urlForGnssDataGet= "http://" + window.location.host + "/get_receiver_guide.cmd";
    }

    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForGnssDataGet,
        data: {
            "urlStringId": getUrlIdString(),
            "guide": "position"
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {

            $("#spanLongitude").html("error");
        },
        success: function (data) {
            $("#spanLongitude").html("success");
            //获取失败
            if (data == null) {
                $("#spanPdop").html(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#spanHdop").html(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#spanVdop").html(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#spanTdop").html(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                return;
            }


        }
    });
}
//获取当前位置
function getCurrentPosition() {


            $("#spanHeight").html("success");
    if (window.location.protocol == "https:") {
        var  urlForGnssDataGet= "https://" + window.location.host + "/get_receiver_guide.cmd";
    } else {
        var urlForGnssDataGet= "http://" + window.location.host + "/get_receiver_guide.cmd";
    }

    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForGnssDataGet,
        data: {
            "urlStringId": getUrlIdString(),
            "guide": "position"
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {

            $("#spanHeight").html("error");
            return;
        },
        success: function (data) {
            $("#spanHeight").html("success");
            //获取失败
            if (data == null) {
                $("#spanLongitude").html(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#spanLatitude").html(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#spanHeight").html(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#spanClass").html(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
            }


            $("#spanLongitude").html(data.lat);
            $("#spanLatitude").html(data.lon); 
            $("#spanHeight").html(data.high);
            $("#spanClass").html(data.postype);

            $("#spanGpsNum").html(data.gps_num);
            $("#spanGlonNum").html(data.glo_num);
            $("#spanGaliNum").html(data.gali_num);
            $("#spanBdsNum").html(data.bd_num);
            $("#spanSbasNum").html(data.sbas_num);

            var gpsnum = parseInt(data.gps_num);
            var sbasnum = parseInt(data.sbas_num);
            var glonum = parseInt(data.glo_num);
            var bdsnum = parseInt(data.bd_num);
            var galinum = parseInt(data.gali_num);
            var totalNum = gpsnum + sbasnum + glonum + bdsnum + galinum;
        //    $("#spanTrackedSatellites").html(totalNum + parent.langXmlObj.find("tagKe").text());
            var spanString = "";
            if(gpsnum > 0)
                for (var kgps = 0; kgps < gpsnum; kgps++) {
                    if (kgps == gpsnum - 1) {
                        spanString += data.gps_prn[kgps];
                    } else {
                        spanString += data.gps_prn[kgps]+",";
                    }
                }
            $("#spanGpsString").html(spanString);

            spanString = "";
            if(sbasnum > 0)
                for (var ksbas = 0; ksbas < sbasnum; ksbas++) {
                    if (ksbas ==  sbasnum - 1) {
                        spanString += data.sbas_prn[ksbas];
                    } else {
                        spanString += data.sbas_prn[ksbas] +",";
                    }
                }
            $("#spanSbasString").html(spanString);

            spanString = "";
            if(glonum > 0)
                for (var kglo = 0; kglo < glonum; kglo++) {
                    if (kglo == glonum - 1) {
                        spanString += data.glo_prn[kglo];
                    } else {
                        spanString += data.glo_prn[kglo]+ ",";
                    }
                }
            $("#spanGlonString").html(spanString);

            spanString = "";
            if(bdsnum > 0)
                for (var kbds = 0; kbds < bdsnum; kbds++) {
                    if (kbds ==  bdsnum - 1) {
                        spanString += data.bd_prn[kbds];
                    } else {
                        spanString += data.bd_prn[kbds] + ",";
                    }
                }
            $("#spanBdsString").html(spanString);

            spanString = "";
            if(galinum > 0)
                for (var kgalileo = 0; kgalileo < galinum; kgalileo++) {
                    if (kgalileo ==  galinum - 1) {
                        spanString += data.gali_prn[kgalileo];
                    } else {
                        spanString += data.gali_prn[kgalileo] + ",";
                    }
                }

            $("#spanGaliString").html(spanString);

            $("#spanPdop").html(data.fdskfpdop);
            $("#spanHdop").html(data.hdop);
            $("#spanVdop").html(data.vdop);

            $("#spanGpsWeek").html(data.gpsweek);
            $("#spanGpsSecond").html(data.gpssec);

        }
    });
}
//获取接收机时钟
function getGnssClock() {
    var urlForGnssClockGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("gnssDataGet").text());
    if (urlForGnssClockGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForGnssClockGet,
        data: {
            "urlStringId": getUrlIdString(),
            "dat_id": "DAT_ID_TIME"
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            $("#spanGpsWeek").html(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            $("#spanGpsSecond").html(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                $("#spanGpsWeek").html(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#spanGpsSecond").html(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
            }
            if (data.awk == "rsps" && data.dat_status == "HC_ANSWER_STATUS__OK") {
                $("#spanGpsWeek").html(data.week);
                $("#spanGpsSecond").html(data.sec);
            }
        }
    });
}
