//var webConfigXmlObj = parent.webConfigXmlObj;
$(document).ready(function () {

    var urlForSysConfigGet = "http://" + window.location.host + "/sys_config_get.cmd";
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForSysConfigGet,
        data: {},
        dataType: "json",
        async: false,
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            if (data.gsensor == "HUAXIN") {
                $("#value").html("华信");
                $("#value1").html("HUAXIN");
            } else if (data.gsensor == "HUAYING") {
                $("#value").html("华颖");
                $("#value1").html("HUAYING");
            } else if (data.gsensor == "HUACE") {
                $("#value").html("华测");
                $("#value1").html("HUACE");
            } else {
                $("#value").html("无");
                $("#value1").html("N/A");
            }

            if (data.GnssBoards.length == 1) {
                //单板卡

                if (data.GnssBoards[0] == "GNSS_BOARD_TYPE__UB370") {
                    $("#single").hide();
                    $("#main").show();
                    $("#fu").hide();
                } else {
                    $("#single").hide();
                    $("#main").hide();
                    $("#fu").show();
                }

            } else {
                //双板卡
                $("#main").show();
                $("#fu").show();
                $("#single").hide();
            }
            if (data.radio) {
                $("#radio").show();
                $("#radio_frq").show();
            } else {
                $("#radio").hide();
                $("#radio_frq").hide();
            }
        }
    });
})
