var langXmlObj;
var webConfigXmlObj;
$(function () {
    var xmlUrl = "Resource/Xml/WebConfigI80.xml";
    $.get(xmlUrl, function (xml) {
        webConfigXmlObj = $(xml);
        setInterval("getStateInfo()", 5000); //获取下方状态栏信息
        loadLeftMenu(); //加载左侧的菜单
        displayFirstPage(); //显示每一类的第一个页面
    });
   
});

//加载左侧的菜单
function loadLeftMenu() {
    $(".easyui-accordion").empty();
    var menulist = "";
    menulist += '<div class="easyui-accordion" id="accordionLeftMenu" fit="true" border="false">';
    webConfigXmlObj.find("leftMenu").find("functiontype").each(function () {
        var titleAttr = $(this).attr("title");
            var titleType = $(this).attr("title");
            menulist += '<div title="' + titleType + '" style="overflow:auto;">';
            menulist += '<ul>';
            $(this).find("function").each(function () {
                var text = $(this).text();
                var menuName = $(this).text();
                menulist += '<li><div><a ref="' + $(this).attr("id") + '" href="#" rel="' + $(this).attr("url") + '" ><span class="icon ' + $(this).attr("icon") + '" >&nbsp;</span><span class="nav">' + menuName + '</span></a></div></li> ';
            });
            menulist += '</ul></div>';
       
    });
    menulist += '</div>';
    $("#west").append(menulist);
    $('.easyui-accordion li a').click(function () {
        var url = $(this).attr("rel");
        $('#mainPanle').empty();
        $('#mainPanle').append("<iframe src='" + url + "' width='100%' height='100%' style='padding:0px;overflow-x:hidden;' frameborder='no' border='0' marginwidth='0' marginheight='0' allowtransparency='yes'></iframe>");
    }).hover(function () {
        $(this).parent().addClass("hover");
    }, function () {
        $(this).parent().removeClass("hover");
    });

    //导航菜单绑定初始化
    $(".easyui-accordion").accordion();
    //默认首页设置
    $('#mainPanle').append("<iframe src='WebForm/GnssStatus/GnssPosition.html' width='100%' height='100%' style='padding:0px;overflow-x:hidden;' frameborder='no' border='0' marginwidth='0' marginheight='0' allowtransparency='yes'></iframe>");
}


//显示每一类的第一个页面
function displayFirstPage() {
    $("#accordionLeftMenu").accordion({
        onSelect: function () {
            var p = $('#accordionLeftMenu').accordion('getSelected');
            var p2 = p.children().first();
            var p3 = p2.children().first();
            var p4 = p3.children().first();
            var p5 = p4.children().first();

            var url = p5.attr("rel");
            if (url != "") {
                updateMainPanel(url);
            }
        }
    });
}
function updateMainPanel(url) {
    $('#mainPanle').empty();
    $('#mainPanle').append("<iframe src='" + url + "' width='100%' height='100%' style='padding:0px;overflow-x:hidden;' frameborder='no' border='0' marginwidth='0' marginheight='0' allowtransparency='yes'></iframe>");
}

//获取下方状态栏信息
function getStateInfo() {
    if (window.location.protocol == "https:") {
        var urlForReceiverGuildGet = "https://" + window.location.host + "/get_receiver_guide.cmd";
    } else {
        var urlForReceiverGuildGet = "http://" + window.location.host + "/get_receiver_guide.cmd";
    }
    
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForReceiverGuildGet,
        data: {
            "urlStringId": getUrlIdString(),
            "guide":"state"
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
                $("#spanUTC").html(data.utc);

                $("#spanMainTianxian").html(data.mainantnworksta == "NORMAL"?"正常":"不正常");
                $("#spanMainChannel").html(data.mainantnrfsta == "NORMAL" ? "正常" : "不正常");
                $("#spanSubTianxian").html(data.aantnworksta == "NORMAL" ? "正常" : "不正常");
                $("#spanSubChannel").html(data.aantnrfstan == "NORMAL" ? "正常" : "不正常");
                $("#spanDSP").html(data.dstatus == "NORMAL" ? "正常" : "不正常");
                $("#spanARM").html(data.astatus == "NORMAL" ? "正常" : "不正常");
                $("#spanFPGA").html("正常");
                $("#spanARM1").progressbar('setValue', data.acpuload);
                $("#spanDSP1").progressbar('setValue', data.dcpuload);

           
        }
    });


}