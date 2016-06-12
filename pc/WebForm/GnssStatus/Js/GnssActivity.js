var webConfigXmlObj = parent.webConfigXmlObj;
$(document).ready(function () {
   
    setTimeout("getGnssTrackInfo()", 1600); //初始化绑定数据卫星数据

    //3秒定时刷新卫星跟踪信息
    setInterval("intervalFreshInfo()", 5000);

});
//3秒定时刷新卫星跟踪信息
function intervalFreshInfo() {
    getGnssTrackInfo();
}
//获取卫星跟踪信息
function getGnssTrackInfo() {

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
            "guide": "action"
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
            /*
            if (data.dat_status == "HC_ANSWER_STATUS__OK") {
                bindOkInfo(data);
            } else if (data.dat_status == "HC_ANSWER_STATUS__OUTTIME") {
                bindTimeoutInfo();
            } else {
                bindErrorInfo(parent.langXmlObj.find("tipInfo").find("getInfoError").text());
            }
            */

            bindOkInfo(data);
        }
    });
}
function bindErrorInfo(info) {
    $("#spanTrackedSatellites").html(info);
    $("#spanGpsString").html(info);
    $("#spanSbasString").html(info);
    $("#spanGlonString").html(info);
    $("#spanBdsString").html(info);
    $("#spanGaliString").html(info);
}
function bindTimeoutInfo() {
    $("#spanTrackedSatellites").html(0);
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
function bindOkInfo(data) {

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
}



