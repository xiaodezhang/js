Cufon.replace('h3',{ textShadow: '1px 1px #000'});
Cufon.replace('.back');

var GnssBoards;
var bluetoothShow = true;
var wifiShow = true;
var ethernetShow = true;
var g3Show = true;
var radioShow = true;
var mailShow = true;
var product_model = "";
var gprs_type = "";
var usernameandpwd = "";
var lengthuser = 0;
//var nameTrueOr
var webConfigXmlObj;
var langXmlObj;
$(function () {
    //初始化界面
    initView();
    if (window.location.protocol == "https:") {
        var urlForSysConfigGet = "https://" + window.location.host + "/sys_config_get.cmd";
    } else {
        var urlForSysConfigGet = "http://" + window.location.host + "/sys_config_get.cmd";
    }
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
            bluetoothShow = data.bluetooth;
            wifiShow = data.wifi;
            ethernetShow = data.ethernet;
            g3Show = data.g3;
            if (g3Show) {
                gprs_type = data.gprs_type;
            }
            radioShow = data.radio;
            mailShow = data.mail;
            product_model = data.product_model;
            GnssBoards = data.GnssBoards;

            var xmlUrl = getWebConfigXmlUrl(product_model);
            $.get(xmlUrl, function (xml) {
                webConfigXmlObj = $(xml);
                //获取不同版本配置信息
                //getVersionConfig();

                getLangSet(webConfigXmlObj);
                getUserAndPwd();
            });

        }
    });

});


//获取用户名和密码
function getUserAndPwd() {
    var urlUserAndPwdGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("sysUserNmaeGet").text());
    if (urlUserAndPwdGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlUserAndPwdGet,
        data: {
            //"urlStringId": getUrlIdString(),
            "flages": "0", //0;代表查询
            "user_name": "root",
            "password": "1234",
            "permission": "1"
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
            usernameandpwd = data;
            lengthuser = usernameandpwd.length;
        }
    });

}
//获取语言设置
function getLangSet(webConfigXmlObj) {
    var urlForLanguageGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("languageGet").text());
    if (urlForLanguageGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForLanguageGet,
        data: {
            "urlStringId": getUrlIdString()
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            loadLangFile("lang-zh_CN");
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                loadLangFile("lang-zh_CN");
                return;
            }
            if (data.awk == "rsps") {
                langValue = webConfigXmlObj.find("countries").find(data.language).attr("preFile");
                loadLangFile(langValue);
                if (langValue == "lang-en") {
                    $("#submit").attr("src", "Resource/Images/login_btn_en_001.png");
                }
            } else {
                loadLangFile("lang-zh_CN");
            }
        }
    });
}
//加载语言文件
function loadLangFile(prefileName) {
	var xmlLangUrl = getLangXmlUrl(prefileName);
	$.get(xmlLangUrl, function (xml) {
		langXmlObj = $(xml);
		$("#tagSystemName").html(langXmlObj.find("tagSystemName").text());
		$("#tagLoginAccount").html(langXmlObj.find("tagLoginAccount").text());
		$("#tagPwd").html(langXmlObj.find("tagPwd").text());
		$("#btnLogin").attr("value", langXmlObj.find("tagLogin").text());
		$("#tagRememberMe").html(langXmlObj.find("tagRememberMe").text());
		$("#tagNonePasswd").html(langXmlObj.find("tagNonePasswd").text());//忘记密码
		$("#tagExploreTip").html(langXmlObj.find("tipInfo").find("tagExploreTip").text());
		$.extend($.messager.defaults, {
			ok: langXmlObj.find("tagConfirm").text(),
			cancel: langXmlObj.find("tagCancel").text()
		}); 
	});
}

var langValue = "lang-zh_CN";
//////////////////////////////////////////////////////////////////////
function initView() {
    var account = $.cookie("account");
    if (null != account) {
        $("#ipAccount").val(account);
    }
    var password = $.cookie("password");
    if (null != password) {
        $("#ipPassword").val(password);
    }
    var rememberMeFlag = $.cookie("rememberMe");
    if (null == rememberMeFlag || rememberMeFlag == false) {
        $("#cbRemember").attr("checked", false);
    } else {
        $("#cbRemember").attr("checked", true);
    }
}
function changeValue(obj) {
    if (obj.checked == true) {
        var account = $("#ipAccount").val();
        var password = $("#ipPassword").val();
        $.cookie("rememberMe", true);
        $.cookie("account", account);
        $.cookie("password", password);
    } else {
        $.cookie("rememberMe", null);
        $.cookie("account", null);
        $.cookie("password", null);
    }
}
//登陆
function login() {
    var account = $("#ipAccount").val();
    var password = $("#ipPassword").val();
    if (account == "") {
        messageShowAutoClose(langXmlObj, langXmlObj.find("tipInfo").find("userNameNotNull").text());
        return;
    }
    if (password == "") {
        messageShowAutoClose(langXmlObj, langXmlObj.find("tipInfo").find("pwdNotNull").text());
        return;
    }
    if ($("#cbRemember").attr("checked")) {
        $.cookie("rememberMe", true);
        $.cookie("account", account);
        $.cookie("password", password);
    }
    var nopasswd = 0;
    if ($("#noRemember").attr("checked")) {
        nopasswd = 0;
    }

    if (lengthuser == 0 ) {
        if (account != "admin") {
            messageShowAutoClose(langXmlObj, langXmlObj.find("tipInfo").find("acountOrpwdError").text());
            return;
        }
        if (password != "password") {
            messageShowAutoClose(langXmlObj, langXmlObj.find("tipInfo").find("acountOrpwdError").text());
            return;
        }
    } else {
        var nameexit;
        var pwdexit 
        for (var i = 0; i < usernameandpwd.length; i++) {
            if (account == usernameandpwd[i].name) {
                nameexit = 1; //用户名存在
            } else {
                nameexit = 0; //用户名不存在
            }
            if (nameexit == 1) {
                if (password == usernameandpwd[i].password) {
                    pwdexit = 1; //密码正确
                    break;
                } else {
                    pwdexit = 0; //密码不正确
                    break;
                }
            }
        }

        if (nameexit == 1 && pwdexit == 1) { //登陆成功

        } else {
            if (nameexit == 0) {
                messageShowAutoClose(langXmlObj, langXmlObj.find("tipInfo").find("noneUserName").text());
                return;
            } else if (pwdexit == 0) {
                messageShowAutoClose(langXmlObj,langXmlObj.find("tipInfo").find("errorUserpaswod").text());
                return;
            }
            return;
        }

    }
    /////////////////////*
    //$.getJSON("user.json", function (data) {
    //    usernameandpwd = data.NameAndPasswd;
    //}); 
    /////////////////////////
    var url = "index.html?";
    url += "param1=" + product_model + "&";
    url += "param2=" + bluetoothShow + "&";
    url += "param3=" + wifiShow + "&";
    url += "param4=" + ethernetShow + "&";
    url += "param5=" + g3Show + "&";
    url += "param6=" + radioShow + "&";
    url += "param7=" + mailShow + "&";
    url += "param8=" + gprs_type; 
    window.location.href = url;
}
//获取不同版本配置信息
function getVersionConfig() {
    var urlForSysConfigGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("sysConfigGet").text());
    if (urlForSysConfigGet == "") {
        return;
    }
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
            bluetoothShow = data.bluetooth;
            wifiShow = data.wifi;
            ethernetShow = data.ethernet;
            g3Show = data.g3;
            radioShow = data.radio;
            mailShow = data.mail;
            product_model = data.product_model;

            getLangSet(webConfigXmlObj); ;
        }
    });
}
function onKeyDown() {
    if (event.keyCode == 13) {
        login();
    }
}
