var webConfigXmlObj = parent.webConfigXmlObj;
$(document).ready(function () {
    createDiagram(); //创建星空图
    getGnssTrackInfo(); //获取卫星跟踪信息
    setInterval("getGnssTrackInfo()", 5000); //获取卫星跟踪信息
});
var starDiagram_x = 350;
var starDiagram_y = 300;
var starDiagram_radius = 270;
var starDiagram_pi = 3.1415926535;
var starDiagram_pa =180;
var starDiagram_circle_strokeStyle = '#000';
//创建星空图
function createDiagram() {
    //画圆
    drawCircle(starDiagram_radius*2/3);
    drawCircle(starDiagram_radius * 2 / 3*2);
    drawCircle(starDiagram_radius * 2 / 3 * 3); 
    //画线和文字
    drawLinesAndText(0);
    drawLinesAndText(30);
    drawLinesAndText(60);
    drawLinesAndText(90);
    drawLinesAndText(120);
    drawLinesAndText(150);
    //画矩形和文字
    addRectanglesText();
}

//画圆
function drawCircle(radius) {
    $('canvas').drawEllipse({
        strokeWidth: starDiagram_circle_strokeWidth,
        strokeStyle: starDiagram_circle_strokeStyle,
        x: starDiagram_x, y: starDiagram_y,
        width: radius, height: radius
    });
}
var starDiagram_line_strokeStyle = '#000';
var starDiagram_line_strokeWidth =2;
var starDiagram_text_fontSize = 15;
var starDiagram_text_fillStyle = '#000';
var starDiagram_text_fontFamily = 'Verdana, sans-serif';
//画线
function drawLinesAndText(angel) {
    ///////////////////////0//////////////////////////////////
    var angelPi1 = angel / 180 * starDiagram_pi;
    var line_x1 = starDiagram_x + starDiagram_radius * Math.sin(angelPi1);
    var line_y1 = starDiagram_y - starDiagram_radius * Math.cos(angelPi1);
    var angelPi2 = (angel+180)/ 180 * starDiagram_pi;
    var line_x2 = starDiagram_x + starDiagram_radius * Math.sin(angelPi2);
    var line_y2 = starDiagram_y - starDiagram_radius * Math.cos(angelPi2);
    $('canvas').drawLine({
        strokeStyle: starDiagram_line_strokeStyle,
        strokeWidth: starDiagram_line_strokeWidth,
        x1: line_x1, y1: line_y1,
        x2: line_x2, y2: line_y2
    });
    var text_x1 = starDiagram_x + (starDiagram_radius+20) * Math.sin(angelPi1);
    var text_y1 = starDiagram_y - (starDiagram_radius+20) * Math.cos(angelPi1);
    $('canvas').drawText({
        x: text_x1, y: text_y1,
        fillStyle: starDiagram_text_fillStyle,
        fontSize: starDiagram_text_fontSize,
        fontFamily: starDiagram_text_fontFamily,
        text: angel
    });
    var text_x2 = starDiagram_x + (starDiagram_radius + 20) * Math.sin(angelPi2);
    var text_y2 = starDiagram_y - (starDiagram_radius + 20) * Math.cos(angelPi2);
    $('canvas').drawText({
        x: text_x2, y: text_y2,
        fillStyle: starDiagram_text_fillStyle,
        fontSize: starDiagram_text_fontSize,
        fontFamily: starDiagram_text_fontFamily,
        text: angel + 180
    });
}
//画矩形和文字
var rectangles_x = 700;
var rectangles_width = 98;
var rectangles_height = 40;
function addRectanglesText() {
    var rectangles_y = 120;
    drawRectanglesText(rectangles_y, "GPS", "rgb(0, 132, 255)");
    rectangles_y = rectangles_y + rectangles_height + 30;
    drawRectanglesText(rectangles_y, "GLONASS", "rgb(255, 255, 132)");
    rectangles_y = rectangles_y + rectangles_height + 30;
    drawRectanglesText(rectangles_y, "BDS", "rgb(255, 132, 66)");
    rectangles_y = rectangles_y + rectangles_height + 30;
    drawRectanglesText(rectangles_y, "GALILEO", "rgb(226, 24, 30)");
    rectangles_y = rectangles_y + rectangles_height + 30;
    drawRectanglesText(rectangles_y, "SBAS", "rgb(0, 255, 132)");
    
}
var rectangles_text_fillStyle = "rgb(0, 0, 0)";
var rectangles_text_size = 20;
var rectangles_text_fontFamily = 'Verdana, sans-serif';
function drawRectanglesText(rectangles_y, rectangles_text, rectangles_color) {
    $('canvas').drawRect({
        fillStyle: rectangles_color,
        x: rectangles_x, y: rectangles_y,
        width: rectangles_width,
        height: rectangles_height
    });
    var text_x = rectangles_x;
    var text_y = rectangles_y;
    $('canvas').drawText({
        x: text_x, y: text_y,
        fillStyle: rectangles_text_fillStyle,
        fontSize: rectangles_text_size,
        fontFamily: rectangles_text_fontFamily,
        text: rectangles_text
    });
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
            "guide": "tracetable"
        },
        sync:false,
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
            //先重绘星空图
            $('canvas').clearCanvas();
            //创建星空图
            createDiagram(); 
            //画gps卫星的位置
            var gpsnum = parseInt(data.gps_num);
            if (gpsnum > 0) {
                drawStarsPosition(data.gps_sat, starDiagram_gps_strokeStyle);
            }
            //画sbas卫星的位置
            var sbasnum = parseInt(data.sbas_num);
            if (sbasnum > 0) {
                drawStarsPosition(data.sbas_sat, starDiagram_sbas_strokeStyle);
            }
            //画glo卫星的位置
            var glonum = parseInt(data.glo_num);
            if (glonum > 0) {
                drawStarsPosition(data.glo_sat, starDiagram_glon_strokeStyle);
            }
            //画bds卫星的位置
            var bdsnum = parseInt(data.bd_num);
            if (bdsnum > 0) {
                drawStarsPosition(data.bd_sat, starDiagram_bds_strokeStyle);
            }
            //画galileo卫星的位置
            var galileonum = parseInt(data.gali_num);
            if (galileonum > 0) {
                drawStarsPosition(data.gali_sat, starDiagram_galileo_strokeStyle);
            }
        }
    });
}
var star_radius = 16;
var starDiagram_gps_strokeStyle = 'rgb(0, 132, 255)';
var starDiagram_sbas_strokeStyle = 'rgb(0, 255, 132)';
var starDiagram_glon_strokeStyle = 'rgb(255, 255, 132)';
var starDiagram_bds_strokeStyle = 'rgb(255, 132, 66)';
var starDiagram_galileo_strokeStyle = 'rgb(226, 24, 30)';
var starDiagram_circle_strokeWidth = 2;
//画卫星的位置
function drawStarsPosition(dataStar, star_strokeStyle) {
    for (var k = 0; k < dataStar.length; k++) {
        var elevation = dataStar[k].elevation;
        var azimuth = dataStar[k].azimuth;
        var tempRadiusLength = starDiagram_radius * (1 - elevation * 2 / starDiagram_pa);
        var star_x =parseInt(starDiagram_x + Math.sin(azimuth * starDiagram_pi / starDiagram_pa) * tempRadiusLength);
        var star_y = parseInt(starDiagram_y - Math.cos(azimuth * starDiagram_pi / starDiagram_pa) * tempRadiusLength);
        //var star_radius = star_radius;
        var star_strokeStyle_temp= star_strokeStyle;
        var star_strokeWidth = starDiagram_circle_strokeWidth;
        drawPoint(star_x, star_y, star_radius, star_strokeStyle_temp, star_strokeWidth);
        var text_x = star_x;
        var text_y = star_y;
        var text_fillStyle = "#000";
        var text_size = 10;
        var text_fontFamily = "Verdana, sans-serif";
        var textString = dataStar[k].prn;
        drawText(text_x, text_y, text_fillStyle, text_size, text_fontFamily, textString);
    }
}
//画圆
function drawPoint(star_x, star_y, star_radius, star_strokeStyle, star_strokeWidth) {
    $('canvas').drawEllipse({
        fillStyle:star_strokeStyle,
        strokeWidth: star_strokeWidth,
        strokeStyle: star_strokeStyle,
        x: star_x, y: star_y,
        width: star_radius, height: star_radius
    });
}
//画文字
function drawText(text_x, text_y, text_fillStyle, text_size, text_fontFamily, textString) {
    $('canvas').drawText({
        x: text_x, y: text_y,
        fillStyle: text_fillStyle,
        fontSize: text_size,
        fontFamily: text_fontFamily,
        text: textString
    });
}

