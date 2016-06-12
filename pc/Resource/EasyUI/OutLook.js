//初始化左侧
function InitLeftMenu() {
    $('.easyui-accordion li a').click(function () {
        var tabTitle = $(this).children('.nav').text();
        var url = $(this).attr("rel");
        var menuid = $(this).attr("ref");
        $('#mainPanle').empty();
        $('#mainPanle').append("<iframe src='WebForm/Module/Test.html' width='100%' height='100%' style='padding:0px;' frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='no' allowtransparency='yes'></iframe>");
    }).hover(function () {
        $(this).parent().addClass("hover");
    }, function () {
        $(this).parent().removeClass("hover");
    });

    //导航菜单绑定初始化
    $(".easyui-accordion").accordion();
}

//本地时钟
function clockon() {
    var now = new Date();
    var year = now.getFullYear(); //getFullYear getYear
    var month = now.getMonth();
    var date = now.getDate();
    var day = now.getDay();
    var hour = now.getHours();
    var minu = now.getMinutes();
    var sec = now.getSeconds();
    var week;
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minu < 10) minu = "0" + minu;
    if (sec < 10) sec = "0" + sec;
    var arr_week = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    week = arr_week[day];
    var time = "";
    time = year + "年" + month + "月" + date + "日" + " " + hour + ":" + minu + ":" + sec + " " + week;

    $("#bgclock").html(time);

    var timer = setTimeout("clockon()", 200);
}
