var langType;
function getLangXmlUrl(langType) {
    var url = "Resource/Xml/Langs/" + langType + ".xml";
    if (product_model == "HC_PRODUCT_MODEL__N72") {
        url = "Resource/Xml/Langs_n72/" + langType + ".xml";
    }
    return url;
}
function getWebConfigXmlUrl(product_model) {
    var url = "";
    if (product_model == "HC_PRODUCT_MODEL__I80") {
        url = "Resource/Xml/WebConfigI80.xml";
    } else if (product_model == "HC_PRODUCT_MODEL__N72") {
        url = "Resource/Xml/WebConfigN72.xml";
    } else if (product_model == "HC_PRODUCT_MODEL__M6") {
        url = "Resource/Xml/WebConfigI80.xml";
    }
    return url;
}
//获取cookie;
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}
//获取年月日分秒
function getUrlIdString() {
    var myDate = new Date();
    var fullYear = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
    var month = myDate.getMonth();       //获取当前月份(0-11,0代表1月)
    var date = myDate.getDate();        //获取当前日(1-31)
    var hours = myDate.getTime();        //获取当前时间(从1970.1.1开始的毫秒数)
    var minutes = myDate.getMinutes();     //获取当前分钟数(0-59)
    var seconds = myDate.getSeconds();     //获取当前秒数(0-59)
    var millionSeconds = myDate.getMilliseconds();    //获取当前毫秒数(0-999)
    var urlIdString = "" + fullYear + month + date + hours + minutes + seconds + millionSeconds;
    return urlIdString;
}
//获取时间字符串
function getTimeString(h, m, s) {
    var hh = h;
    var mm = m;
    var ss = s;
    if (h < 10) {
        hh = "0" + hh;
    }
    if (m < 10) {
        mm = "0" + mm;
    }
    if (s < 10) {
        ss = "0" + ss;
    }

    return hh + ":" + mm + ":" + ss;
}

//获取时间字符串
function getTimeStringshabi(y, m, d) {
    var yy = y;
    var mm = m;
    var dd = d;
    if (y < 10) {
        yy = "0" + yy;
    }
    if (m < 10) {
        mm = "0" + mm;
    }
    if (d < 10) {
        dd = "0" + dd;
    }

    return yy + "-" + mm + "-" + dd;
}

//设置cookie
function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}
//获取页面传递的参数
var request = {
    QueryString: function (val) {
        var uri = window.location.search;
        var re = new RegExp("" + val + "=([^&?]*)", "ig");
        return ((uri.match(re)) ? (uri.match(re)[0].substr(val.length + 1)) : null);
    }
}
function loadJsFile(path) {
    langType = getLangType();
    var url = path + "easyui-" + langType + ".js";
    $('head').append("<script type='text/javascript' src='" + url + "'></script>");

//    $.extend($.messager.defaults, {
//        ok: "Ok",
//        cancel: "Cancel"
//    }); 
}
function getLangType() {

    langType = "lang-zh_CN";
    return langType;
}
function getLangType2() {
    return parent.getLangType();
}
//信息提示窗口
function openInfoWindow(langXmlObj,confirmInfo) {
    $.messager.alert(langXmlObj.find("tagInfoWindowName").text(), confirmInfo, "info");
}
function openErrorWindow(langXmlObj, confirmInfo) {
    $.messager.alert(langXmlObj.find("tagErrorWindowName").text(), confirmInfo, "error");
}
function openQuestionWindow(langXmlObj, confirmInfo) {
    $.messager.alert(langXmlObj.find("tagQuestionWindowName").text(), confirmInfo, "question");
}
function openWarningWindow(langXmlObj, confirmInfo) {
    $.messager.alert(langXmlObj.find("tagWarningWindowName").text(), confirmInfo, "warning");
}
function messageShow(langXmlObj, messageInfo) {
    $.messager.show({
        title: langXmlObj.find("tagMessageDialogName").text(),
        msg: messageInfo,
        showType: 'show'
    });
}
//自动关闭消息框
function messageShowAutoClose(langXmlObj, messageInfo) {
    $.messager.show({
        title: langXmlObj.find("tagMessageDialogName").text(),
        msg: messageInfo,
        showType: 'fade',
        timeout: 1000,
        style: {
            right:"",
            bottom:""
        }
    });
}
function openWindowInfo(langXmlObj, contentInfo) {
    $('#win').window({
        title:langXmlObj.find("tagInfoWindow").text(),
        width: 300,
        height: 200,
        minimizable: false,
        collapsible:false,
        modal: true,
        closable: true,
        resizable:false,
        content: contentInfo
    });
}
//打开进度对话框
function openProgressBar(langXmlObj, contentInfo) {
    var win = $.messager.progress({
        title: langXmlObj.find("tipInfo").find("pleaseWaiting").text(),
        text: "",
        msg: contentInfo
    });
}
function getServiceUrl(webConfigXmlObj, interfaceName) {
    if (window.location.protocol == "https:") {
        var urlForService = "https://" + window.location.host;
    } else { 
        var urlForService = "http://" + window.location.host;
    }
    
    if (urlForService == "") {
        openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find(key + "NoCon").text());
        return "";
    }
    return urlForService + "/" + interfaceName;
}
function getXmlUrlForConfig(pathPre) {
    var xmlUrlForConfig = pathPre + "Resource/Xml/WebConfig.xml";
    return xmlUrlForConfig;
}
//获取坐标的小数形式
function getFloatFromCoor(coordInt, coordMin, coordSec) {
    return coordInt + coordMin / 60 + coordSec / 60;
}
//小数形式获取坐标的度数
function getCoordinateInt(value) {
    return parseInt(value);
}
var PI = 3.1415926535897932;
var PI180=180;
//小数形式获取坐标的秒数
function getCoordinateSecPI(value) {
    var coordInt =Math.abs(value) * PI180 / PI;
    var coordMin = (coordInt - parseInt(coordInt)) * 60;
    var coordSec = (coordMin - parseInt(coordMin)) * 60.0;
    return coordSec.toFixed(8);
}
//小数形式获取坐标的分数
function getCoordinateMinPI(value) {
    var coordInt = Math.abs(value) * PI180 / PI;
    var coordMin = (coordInt - parseInt(coordInt)) * 60;
    return parseInt(coordMin);
}
//小数形式获取坐标的度数
function getCoordinateIntPI(value) {
    return parseInt(Math.abs(value) * PI180 / PI);
}
//获取高度值保留小数后3位
function getHeightValue(heightValue) {
    var heightValueFloat = parseFloat(heightValue);
    return heightValueFloat.toFixed(3);
}
//正则表达式验证邮件格式
function valdateEmailAddress(emailAddr) {
    var emailAddrReg = "^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$";
    var flag = true;
    if (!emailAddr.match(emailAddrReg)) {
        flag=false;
    }
    return flag;
}

//坐标圆周率形式转为小数点形式
function piConvertToFloat(value) {
    return value * PI180 / PI;
}
//坐标圆周率形式转为度分秒的形式
function piConvertToDuMinSec(value) {
    var piDu = getCoordinateIntPI(value);
    var piMin = getCoordinateMinPI(value);
    var piSec = getCoordinateSecPI(value);
    var piStringValue = piDu + "°" + piMin + "′" + piSec + "″";
    return piStringValue;
}


function toLoginPage() {
    if (window.location.protocol == "https:") {
        window.location.href = "https://" + window.location.host + "/login.html";
    } else { 
        window.location.href = "http://" + window.location.host + "/login.html";
    }

}
function toLoginPage6() {
        window.location.href = "http://" + window.location.host + "/login.html";
}
function toLoginPage2(portValue) {
    var hostName = window.location.hostname;
    if (window.location.protocol == "https:") {
        window.location.href = "https://" + hostName + ":" + portValue + "/login.html";
    } else { 
        window.location.href = "http://" + hostName + ":" + portValue + "/login.html";
    }

}

function toLoginPage4(portValue) {
    var hostName = window.location.hostname;
    window.location.href = "https://" + hostName + ":" + portValue + "/login.html";
}

function toLoginPage5(portValue) {
    var hostName = window.location.hostname;
    window.location.href = "http//" + hostName + ":" + portValue + "/login.html";
}

function toLoginPage3(httpValue) {
    var hosPort = window.location.port;
    if (window.location.protocol == "https:") {
        window.location.href = "https://" + httpValue + ":" + hosPort + "/login.html";
    } else { 
        window.location.href = "http://" + httpValue + ":" + hosPort + "/login.html";
    }
    
}
//浮点数保留小数点后面3位
changeDecimal_f = function (floatvar) {
    var f_x = parseFloat(floatvar);
    if (isNaN(f_x)) {
        return;
    }
    f_x = Math.round(f_x * 1000) / 1000;
    var s_x = f_x.toString();
    var pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
    }
    while (s_x.length <= pos_decimal + 3) {
        s_x += '0';
    }
    return s_x;
}
//刷新(当前)页面
function freshPage() {
    location.reload();
}
var reg_ipPort = /^(\d{4,5})$/; //端口号1024-65535
//验证端口号是否在1024和65535之间
function judgePort(ipPort) {
    if (ipPort.match(reg_ipPort)) {
        var ipPortInt = parseInt(ipPort);
        if (ipPortInt > 1024 && ipPortInt <= 65535) {
            return true;
        }
    }
    return false;
}
//HashMap类
function HashMap() {
    //定义长度   
    var length = 0;
    //创建一个对象   
    var obj = new Object();
    /** 
    * 判断Map是否为空 
    */
    this.isEmpty = function () {
        return length == 0;
    };
    /** 
    * 判断对象中是否包含给定Key 
    */
    this.containsKey = function (key) {
        return (key in obj);
    };
    /** 
    * 判断对象中是否包含给定的Value 
    */
    this.containsValue = function (value) {
        for (var key in obj) {
            if (obj[key] == value) {
                return true;
            }
        }
        return false;
    };
    /** 
    *向map中添加数据 
    */
    this.put = function (key, value) {
        if (!this.containsKey(key)) {
            length++;
        }
        obj[key] = value;
    };
    /** 
    * 根据给定的Key获得Value 
    */
    this.get = function (key) {
        return this.containsKey(key) ? obj[key] : null;
    };
    /** 
    * 根据给定的Key删除一个值 
    */
    this.remove = function (key) {
        if (this.containsKey(key) && (delete obj[key])) {
            length--;
        }
    };
    /** 
    * 获得Map中的所有Value 
    */
    this.values = function () {
        var _values = new Array();
        for (var key in obj) {
            _values.push(obj[key]);
        }
        return _values;
    };
    /** 
    * 获得Map中的所有Key 
    */
    this.keySet = function () {
        var _keys = new Array();
        for (var key in obj) {
            _keys.push(key);
        }
        return _keys;
    };
    /** 
    * 获得Map的长度 
    */
    this.size = function () {
        return length;
    };
    /** 
    * 清空Map 
    */
    this.clear = function () {
        length = 0;
        obj = new Object();
    };
}
