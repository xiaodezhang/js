var webConfigXmlObj = parent.webConfigXmlObj;
$(document).ready(function () {
    $('#progressbar1').hide(); //隐藏进度条
    $('#myname').hide(); //隐藏掉用户名和密码
    $('#mypwd').hide();
    getPowerInfo();
    getCloudPara(); //获取登陆参数
    createDatagrid(); //创建gridview
    //bindData("all"); //初始化绑定数据
    setInterval("getCloudParasize()", 1000); //1s刷新一次
});
var ListSzie;
//var ListSzie = new array();
/////////////////////////
var volt_bat = 0; //0：电池电量大于50%   1：小于50%
var power_mod = 0; //0：接入外接电源      1：未接外接电源
//获取电源信息
function getPowerInfo() {
    var urlForPowerStatusGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("powerStatusGet").text());
    if (urlForPowerStatusGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForPowerStatusGet,
        data: {
            "urlStringId": getUrlIdString()
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            $("#spanBattery").html(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            $("#spanBattery2").html(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            $("#spanOutterBattery").html(parent.langXmlObj.find("tipInfo").find("getInfoFail").text());
            return;
        },
        success: function (data) {
            if (data.power_mod == "inter") {//未接电源
                power_mod = 1;
                if (parent.product_model == "HC_PRODUCT_MODEL__I80") {//判断两块电池的
                    if (data.volt_bat1 < 50 && data.volt_bat2 < 50) {
                        volt_bat = 1;
                    } else {
                        volt_bat = 0;
                    }
                } else {//判断volt_bat1的电量
                    if (data.volt_bat1 < 50) {
                        volt_bat = 1;
                    } else {
                        volt_bat = 0;
                    }
                }
            } else if (data.power_mod == "exter") {//接入外接电源
                power_mod = 0;
            }

        }
    });
}

//////////////////////////
var getfileofsize = 0;//文件总大小
var a = 0;
//获取文件下载的大小
function getCloudParasize() {
    var urlForGnssDataGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("CloudParaGet").text());
    if (urlForGnssDataGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForGnssDataGet,
        data: {
            "urlStringId": getUrlIdString()
        },
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            return;
        },
        success: function (data) {
            if (data == null) {
                return;
            }
            if (data.awk == "rsps") {
                //getfileofsize = data.dubprogress;
                var percentValue = (data.dubprogress * 100 / getfileofsize).toFixed(1);
                $('#progressbar').progressbar('setValue', percentValue);
                if (getfileofsize == data.dubprogress) {
                    //下载完成
                    $('#progressbar1').hide(); //显示进度条
                    $('#dgrid1').show(); //隐藏进度条
                    if (getfileofsize != 0 && a == 0) {
                        a = 1;
                        messageShowAutoClose(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("downLoadSucc").text());
                        //提示下载成功
                        //重启GNSS
                        operateRestartGnss();
                     }
                    
                }
            }
        }
    });
}
//获取登陆参数
function getCloudPara() { 
 var urlForGnssDataGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("CloudParaGet").text());
    if (urlForGnssDataGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForGnssDataGet,
        data: {
            "urlStringId": getUrlIdString()
        },
        //async: false,
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            return;
        },
        success: function (data) {
            if (data == null) {
                $("#ipDoMain").val(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                //$("#ipPort").html(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#ipUserName").val(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                $("#ipPwd").val(parent.langXmlObj.find("tipInfo").find("getInfoNull").text());
                return;
            }
            if (data.awk == "rsps") {
               // var strs = new Array(); //定义一数组 
               // strs = data.domain.split(":"); //字符分割 
                $("#ipDoMain").val(data.domain);
               // $("#ipPort").html(strs[strs.length - 1]);
                $("#ipUserName").val(data.name);
                $("#ipPwd").val(data.passwod);
            } else {
                $("#ipDoMain").val(parent.langXmlObj.find("tipInfo").find("getInfoError").text());
               // $("#ipPort").html(parent.langXmlObj.find("tipInfo").find("getInfoError").text());
                $("#ipUserName").val(parent.langXmlObj.find("tipInfo").find("getInfoError").text());
                $("#ipPwd").val(parent.langXmlObj.find("tipInfo").find("getInfoError").text());
            }
        }
    });
}
//创建gridview
function createDatagrid() {//暂时不做，先做基站列表的
    var bodyWidth = document.body.clientWidth * 0.8;
    $('#dgrid').datagrid({
        title: parent.langXmlObj.find("tagGetFileList1").text(),
        iconCls: 'icon-save',
        width: bodyWidth,
        nowrap: true,
        autoRowHeight: false,
        singleSelect: true,
        striped: true,
        idField: 'tagSatelliteId',
        collapsible: true,
        sortOrder: 'desc',
        remoteSort: false,
        frozenColumns: [[
                        { field: 'tagFileName', title:parent.langXmlObj.find("tagFileNmae").text(), width: bodyWidth * 0.2, align: 'center' },
                        { field: 'tagVersion', title: parent.langXmlObj.find("tagVersionNum").text(), width: bodyWidth * 0.1, align: 'center' },
                        { field: 'tagDiscribe', title:parent.langXmlObj.find("tagFileInfo").text(), width: bodyWidth * 0.3, align: 'center' },
                        { field: 'tagSize', title: parent.langXmlObj.find("tagFileSize1").text(), width: bodyWidth * 0.15, align: 'center' },
                        { field: 'download', title: parent.langXmlObj.find("tagFileDownload").text(), width: bodyWidth * 0.1, align: 'center',
                            formatter: function (value, rec) {
                                var returnString = '<span style="color:red"> ';
                                returnString += '<a href="#" onclick="downLoad(\'' + rec.tagFileName + ',' + rec.tagSize + '\')">' + parent.langXmlObj.find("tagFileDownload").text() + '</a>';
                                //returnString += '|';
                                //returnString += '<a href="#" onclick="getDetail(\'' + "IO_ID__RECORD_" + rec.accountId + '\')">' + parent.langXmlObj.find("tagDetail").text() + '</a>';
                                returnString += '</span>';
                                return returnString;
                            }
                        }
				    ]],
        rownumbers: true,
        pagination: true,
        pageSize: 10,
        toolbar: "#tbar"
    });
    /*var dgRows = [];
    dgRows.push({
        tagFileName: "i80.bin",
        tagVersion: "1.1.0",
        tagDiscribe: "shabierdai",
        tagSize:"20M"
    });
    $('#dgrid').datagrid('loadData', dgRows);*/
}

function unDownload() {
    a = 0;
    var urlForFirmwareVersionGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("DownloadPackage").text());
    if (urlForFirmwareVersionGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForFirmwareVersionGet,
        data: {
            "urlStringId": getUrlIdString(),
            "file_name": "kill"
        },
        //async: false,
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            openErrorWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            if (data.set_result == "CLOUD_OK") {
                //取消下载成功（下面执行获取列表的操作）
                $('#progressbar1').hide(); //显示进度条
                $('#dgrid1').show(); //隐藏进度条
            } else {
                //取消下载失败
                return;
            }
        }
    });
}

function downLoad(value) {
    a = 0;
    //var i = $('#dgrid').datagrid('getRowIndex', $('#dgrid').datagrid('getSelected'));
    //getfileofsize = ListSzie[i].size;
    var i = $('#dgrid').datagrid('getRowIndex', $('#dgrid').datagrid('getSelected'));
    var ddgetfileofsize = ListSzie.list[i];
    getfileofsize = ddgetfileofsize.filesize; 
    //getfileofsize = (ListSzie[$('#dgrid').datagrid('getRowIndex', $('#dgrid').datagrid('getSelected'))]).filesize;
    $('#progressbar1').show(); //显示进度条
    $('#dgrid1').hide(); //隐藏进度条
     var strs = new Array(); //定义一数组 
     strs = value.split(","); //字符分割  strs[0]:表示文件名    
    //点击下载的时候要控制，如果正在下载，再点击下载提示不能再下载
     // getfileofsize = strs[1]; //文件大小 $('#dgrid').datagrid('getRowIndex', $('#dgrid').datagrid('getSelected'));
    
    var urlForFirmwareVersionGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("DownloadPackage").text());
    if (urlForFirmwareVersionGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForFirmwareVersionGet,
        data: {
            "urlStringId": getUrlIdString(),
            "file_name": strs[0]
        },
        //async: false,
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            openErrorWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            if (data.set_result == "CLOUD_OK") {
                //下载成功（下面执行获取列表的操作）是否升级
                //messageShowAutoClose(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("downLoadSucc").text());
                //提示下载成功
                $('#progressbar1').show(); //显示进度条
                $('#dgrid1').hide(); //显示文件列表
                
            } else {
                //下载失败
                openErrorWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("downLoadFail").text());
                //提示下载失败
                $('#progressbar1').hide(); //隐藏进度条
                return;
            }
        }
    });

    return;
}

//重启GNSS
function restartGnss() {
    var confirmTitle = parent.langXmlObj.find("tagWindowConfirmName").text();
    var confirmInfo = parent.langXmlObj.find("tipInfo").find("restartGnssConInfo").text();
    $.messager.confirm(confirmTitle, confirmInfo, function (r) {
        if (r) {
            operateRestartGnss();
        }
    });
}
function operateRestartGnss() {
    var urlForRebootSystemSet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("rebootSystemSet").text());
    if (urlForRebootSystemSet == "") {
        return;
    }
    var win = $.messager.progress({
        title: parent.langXmlObj.find("tipInfo").find("pleaseWaiting").text(),
        text: "",
        msg: parent.langXmlObj.find("tipInfo").find("resuming").text()
    });
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForRebootSystemSet,
        data: {
            "urlStringId": getUrlIdString()
        },
        timeout: 5000,
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            setTimeout(function () {
                $.messager.progress('close');
                parent.toLoginPage();
            }, 40000);
        },
        success: function (data) {
            setTimeout(function () {
                $.messager.progress('close');
                parent.toLoginPage();
            }, 40000);
        }
    });
}

function saveBtn() {
    var ipDialString = $("#ipDoMain").val();
    if (ipDialString == "") {
        openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("doMainNotNull").text());
        return;
    }
    var ipUserName = $("#ipUserName").val();
    if (ipUserName == "") {
        openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("UserNameNotNull").text());
        return;
    }
    var ipPwd = $("#ipPwd").val();
    if (ipPwd.length > 18) {
        openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("corsPwdLength18").text());
        return;
    }

    var urlForDialStringSet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("CloudParaSet").text());
    if (urlForDialStringSet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForDialStringSet,
        data: {
            "urlStringId": getUrlIdString(),
            "domain": ipDialString,
            "name": ipUserName,
            "passwd": ipPwd
        },
        async: false,
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            openErrorWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {

            if (data.set_result == "HC_ANSWER_STATUS__OK") {
                messageShowAutoClose(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("OnlineParaSetSucc").text());
            } else {
                openInfoWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("OnlineParaSetFail").text());
            }
        }
    });

}
var cur_ver = ""; //当前版本号
var machine_type = "";//机型i80或N72
//登陆并获取列表
function loginAndGetList() {

    //判断是否允许上传文件根据电量的判断
    if (power_mod == 1) {
        if (volt_bat == 1) {
            //请接入电源或充电
            openInfoWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("placeCheckbat").text());
            return false;
        }
    } 

    //var idindexll = $("#idindexll").combobox("getValue");
    var idindexll = 0;//这个值暂时设为0，
    //1.先登陆，2.登陆成功后在获取列表
    //登陆前要获取当前的版本号（1.0.0）和机型（I80：1；N72：2）
    getFirmwareInfo();
    if (cur_ver == "") {
        openInfoWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("GetNowCurverFail").text()); //获取当前版本号失败
        return;
    }
    if (parent.product_model == "HC_PRODUCT_MODEL__I80") {
        machine_type = "1";
    } else if (parent.product_model == "HC_PRODUCT_MODEL__N72") {
        machine_type = "2";
    } else {//M6
        machine_type = "1";
    }

    var ipDialString = $("#ipDoMain").val();
    if (ipDialString == "") {
        openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("doMainNotNull").text());
        return;
    }
    var ipUserName = $("#ipUserName").val();
    if (ipUserName == "") {
        openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("UserNameNotNull").text());
        return;
    }
    var ipPwd = $("#ipPwd").val();
    if (ipPwd.length > 18) {
        openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("corsPwdLength18").text());
        return;
    }

    ///////////////////////登陆的接口
    var urlForFirmwareVersionGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("LoginToCloude").text());
    if (urlForFirmwareVersionGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForFirmwareVersionGet,
        data: {
            "urlStringId": getUrlIdString(),
            "ipport": ipDialString,
            "username": ipUserName,
            "password": ipPwd,
            "cur_ver": cur_ver,
            "machine_type": machine_type
        },
        async: false,
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            openErrorWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            if (data.set_result == "CLOUD_OK") {
                //登陆成功（下面执行获取列表的操作）
                getPackageList(idindexll);
            } else if (data.set_result == "CLOUD_PARA_ERR") {
                //登陆失败（返回，并隐藏列表）
                openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("cloudParaErr").text());
                //提示登陆参数登陆失败，请重试
                return;
            } else if (data.set_result == "CLOUD_SERVER_PARA_ERR") {
                //登陆失败（返回，并隐藏列表）
                openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("cloudServerParaErr").text());
                //提示服务器登错误，请重试
                return;
            } else if (data.set_result == "CLOUD_CONNECT_REFUSE_OUTTIME") {
                //登陆失败（返回，并隐藏列表）
                openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("cloudConnectOutTime").text());
                //提示登陆超时或失败，请重试
                return;
            } else if (data.set_result == "CLOUD_UNLOG") {
                //登陆失败（返回，并隐藏列表）
                openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("cloudConnectOutTime").text());
                //提示未登陆，请重新登陆
                return;
            } else {
                return;
            }
        }
    });
    ///////////////////////
}

function getPackageList(idindexll) {
    var urlForFirmwareVersionGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("GetPackageList").text());
    if (urlForFirmwareVersionGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForFirmwareVersionGet,
        data: {
            "urlStringId": getUrlIdString(),
            "index": idindexll
        },
        async: false,
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            openErrorWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            if (data.set_result == "CLOUD_OK") {
                //获取成功   将获取的文件信息列表添加到列表中
                ListSzie = data;
                messageShowAutoClose(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("getListSucess").text());
                var dgRows = [];
                for (var i = 0; i < data.list.length; i++) {
                    dgRows.push({
                        tagFileName: data.list[i].name,
                        tagVersion: data.list[i].version,
                        tagDiscribe: data.list[i].discribe,
                        tagSize: (data.list[i].filesize/1024/1024).toFixed(2) + "MB"
                    });
                }
                $('#dgrid').datagrid('loadData', dgRows);
            } /*else if (data.set_result == "CLOUD_PARA_ERR") {
                //登陆失败（返回，并隐藏列表）
                openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("cloudParaErr").text());
                //提示登陆参数登陆失败，请重试
                return;
            } else if (data.set_result == "CLOUD_SERVER_PARA_ERR") {
                //登陆失败（返回，并隐藏列表）
                openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("cloudServerParaErr").text());
                //提示服务器登错误，请重试
                return;
            } else if (data.set_result == "CLOUD_PARA_ERR") {
                //登陆失败（返回，并隐藏列表）
                openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("cloudParaErr").text());
                //提示登陆参数登陆失败，请重试
                return;
            } else if (data.set_result == "CLOUD_CONNECT_REFUSE_OUTTIME") {
                //登陆失败（返回，并隐藏列表）
                openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("cloudConnectOutTime").text());
                //提示登陆超时或失败，请重试
                return;
            }*/
            else if (data.set_result == "CLOUD_UNLOG") {
                //登陆失败（返回，并隐藏列表）
                openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("cloudUnLog").text());
                //提示未登陆，请重新登陆
                return;
            }
            else {
                openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("cloudConnectOutTime").text());
                //获取列表失败
                return;
            }
        }
    });

}

//获取固件信息
function getFirmwareInfo() {
    var urlForFirmwareVersionGet = getServiceUrl(webConfigXmlObj, webConfigXmlObj.find("interfaceNames").find("firmwareVersionGet").text());
    if (urlForFirmwareVersionGet == "") {
        return;
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        url: urlForFirmwareVersionGet,
        data: {
            "urlStringId": getUrlIdString()
        },
        async: false,
        dataType: "json",
        beforeSend: function (x) { x.setRequestHeader("Content-Type", "application/json; charset=utf-8"); },
        error: function (result, status) {
            openErrorWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("connectError").text());
            return;
        },
        success: function (data) {
            //获取失败
            if (data == null) {
                return;
            }
            if (data.awk == "rsps") {
                cur_ver = data.num;
                //messageShowAutoClose(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("GetNowCurverSucc").text()); //获取当前版本号成功
            } else {
                openInfoWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("GetNowCurverFail").text()); //获取当前版本号失败
            }
        }
    });
}

