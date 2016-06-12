var webConfigXmlObj = parent.parent.webConfigXmlObj;
var linkIdx;
var serverType;
var hashMapNmea = new HashMap();
//初始数据
var initRaud = "";
var initDiffOut = "";
var initRaw = "";
var initRaw1 = "";
var initRaw2 = "";
var initEph = "";
$(document).ready(function () {
    linkIdx = request.QueryString("linkIdx");
    initCombobox(); //初始化下拉框
   
});

//初始化下拉框
function initCombobox() {
    //初始化原始数据类型和频率  
    var dataArrayRawType = [];
    webConfigXmlObj.find("dataRawType").children().each(function () {
        var jsonItem = { label:$(this).text(), value: $(this).attr("id") };
        dataArrayRawType.push(jsonItem);
        //bindHashMapValue(jsonItem.value);//因为没有接口所以先不写
    });
    $("#seRawType").combobox({
        valueField: 'value',
        textField: 'label',
        onSelect: function () {
            var rawTypeValue = $("#seRawType").combobox("getValue");
            var rawTypeText = $("#seRawType").combobox("getText");
            $("#seRawType").combobox("setValue", rawTypeValue);
            $("#seRawType").combobox("setText", rawTypeText);
            initRawFrq(rawTypeValue);
        },
        data: dataArrayRawType
    });
    var data = $("#seRawType").combobox("getData");
    if (data.length > 0) {
        $("#seRawType").combobox("select", data[0].value);
    }

    //初始化NMEA类型和频率  
    var dataArrayNmeaType = [];
    webConfigXmlObj.find("dataNmeaType").children().each(function () {
        var jsonItem = { label: $(this).text(), value: $(this).attr("id") };
        dataArrayNmeaType.push(jsonItem);
        //bindHashMapValue(jsonItem.value);//因为没有接口所以先不写
    });
    $("#seNmeaType").combobox({
        valueField: 'value',
        textField: 'label',
        onSelect: function () {
            var nmeaTypeValue = $("#seNmeaType").combobox("getValue");
            var nmeaTypeText = $("#seNmeaType").combobox("getText");
            $("#seNmeaType").combobox("setValue", nmeaTypeValue);
            $("#seNmeaType").combobox("setText", nmeaTypeText);
            initNmeaFrq(nmeaTypeValue);
        },
        data: dataArrayNmeaType
    });
    var data = $("#seNmeaType").combobox("getData");
    if (data.length > 0) {
        $("#seNmeaType").combobox("select", data[0].value);
    }

    //初始化RTCM3.0类型和频率  
    var dataArrayRtcmv30Type = [];
    webConfigXmlObj.find("dataRtcmv30Type").children().each(function () {
        var jsonItem = { label: $(this).text(), value: $(this).attr("id") };
        dataArrayRTCMV30Type.push(jsonItem);
        //bindHashMapValue(jsonItem.value);//因为没有接口所以先不写
    });
    $("#seRtcmv30Type").combobox({
        valueField: 'value',
        textField: 'label',
        onSelect: function () {
            var rtcmv30TypeValue = $("#seRtcmv30Type").combobox("getValue");
            var rtcmv30TypeText = $("#seRtcmv30Type").combobox("getText");
            $("#seRtcmv30Type").combobox("setValue", rtcmv30TypeValue);
            $("#seRtcmv30Type").combobox("setText", rtcmv30TypeText);
            initRtcmv30Frq(rtcmv30TypeValue);
        },
        data: dataArrayRtcmv30Type
    });
    var data = $("#seRtcmv30Type").combobox("getData");
    if (data.length > 0) {
        $("#seRtcmv30Type").combobox("select", data[0].value);
    }


    //初始化RTCM3.2类型和频率  
    var dataArrayRtcmv32Type = [];
    webConfigXmlObj.find("dataRtcmv32Type").children().each(function () {
        var jsonItem = { label: $(this).text(), value: $(this).attr("id") };
        dataArrayRtcmv32Type.push(jsonItem);
        //bindHashMapValue(jsonItem.value);//因为没有接口所以先不写
    });
    $("#seRtcmv32Type").combobox({
        valueField: 'value',
        textField: 'label',
        onSelect: function () {
            var rtcmv32TypeValue = $("#seRtcmv32Type").combobox("getValue");
            var rtcmv32TypeText = $("#seRtcmv32Type").combobox("getText");
            $("#seRtcmv32Type").combobox("setValue", rtcmv32TypeValue);
            $("#seRtcmv32Type").combobox("setText", rtcmv32TypeText);
            initRtcmv32Frq(rtcmv32TypeValue);
        },
        data: dataArrayRtcmv32Type
    });
    var data = $("#seRtcmv32Type").combobox("getData");
    if (data.length > 0) {
        $("#seRtcmv32Type").combobox("select", data[0].value);
    }

    //初始化RTCM2.4类型和频率  
    var dataArrayRtcmv24Type = [];
    webConfigXmlObj.find("dataRtcmv24Type").children().each(function () {
        var jsonItem = { label: $(this).text(), value: $(this).attr("id") };
        dataArrayRtcmv32Type.push(jsonItem);
        //bindHashMapValue(jsonItem.value);//因为没有接口所以先不写
    });
    $("#seRtcmv24Type").combobox({
        valueField: 'value',
        textField: 'label',
        onSelect: function () {
            var rtcmv24TypeValue = $("#seRtcmv24Type").combobox("getValue");
            var rtcmv24TypeText = $("#seRtcmv24Type").combobox("getText");
            $("#seRtcmv24Type").combobox("setValue", rtcmv24TypeValue);
            $("#seRtcmv24Type").combobox("setText", rtcmv24TypeText);
            initRtcmv24Frq(rtcmv24TypeValue);
        },
        data: dataArrayRawType
    });
    var data = $("#seRtcmv24Type").combobox("getData");
    if (data.length > 0) {
        $("#seRtcmv24Type").combobox("select", data[0].value);
    }

}
//初始化原始数据频率
function initRawFrq(rawTypeValue) {
    var dataArrayRawFrq = [];
    webConfigXmlObj.find("dataRawFrq").children().each(function () {
        var jsonItem = { label: $(this).text(), value: $(this).attr("id") };
        dataArrayRawFrq.push(jsonItem);
    });
    $("#seRawFrq").combobox({
        valueField: 'value',
        textField: 'label',
        onSelect: function () {
            var RawType = $("#seRawType").combobox("getValue");
            var RawValue = $("#seRawFrq").combobox("getValue");
            //hashMapNmea.put(RawType, RawValue);
        },
        data: dataArrayRawFrq
    });
    //$("#seRawFrq").combobox("select", hashMapNmea.get(RawType));
}

//初始化NMEA频率
function initNmeaFrq(nmeaTypeValue) {
    var dataArrayNmeaFrq = [];
    webConfigXmlObj.find("dataNmeaFrq").children().each(function () {
        var jsonItem = { label: $(this).text(), value: $(this).attr("id") };
        dataArrayNmeaFrq.push(jsonItem);
    });
    $("#seNmeaFrq").combobox({
        valueField: 'value',
        textField: 'label',
        onSelect: function () {
            var NmeaType = $("#seNmeaType").combobox("getValue");
            var NmeaValue = $("#seNmeaFrq").combobox("getValue");
            //hashMapNmea.put(RawType, RawValue);
        },
        data: dataArrayNmeaFrq
    });
    //$("#seRawFrq").combobox("select", hashMapNmea.get(RawType));
}

//初始化RTCM3.0频率
function initRtcmv30Frq(rtcmv30TypeValue) {
    var dataArrayRtcmv30Frq = [];
    webConfigXmlObj.find("dataRtcmv30Frq").children().each(function () {
        var jsonItem = { label: $(this).text(), value: $(this).attr("id") };
        dataArrayRtcmv30Frq.push(jsonItem);
    });
    $("#seRtcmv30Frq").combobox({
        valueField: 'value',
        textField: 'label',
        onSelect: function () {
            var RawType = $("#seRtcmv30Type").combobox("getValue");
            var RawValue = $("#seRtcmv30Frq").combobox("getValue");
            //hashMapNmea.put(RawType, RawValue);
        },
        data: dataArrayRtcmv30Frq
    });
    //$("#seRawFrq").combobox("select", hashMapNmea.get(RawType));
}

//初始化RTCM3.2频率
function initRtcmv32Frq(rtcmv32TypeValue) {
    var dataArrayRtcmv32Rrq = [];
    webConfigXmlObj.find("dataRtcmv32Frq").children().each(function () {
        var jsonItem = { label: $(this).text(), value: $(this).attr("id") };
        dataArrayRawRrq.push(jsonItem);
    });
    $("#seRtcmv32Frq").combobox({
        valueField: 'value',
        textField: 'label',
        onSelect: function () {
            var RawType = $("#seRtcmv32Type").combobox("getValue");
            var RawValue = $("#seRtcmv32Frq").combobox("getValue");
            //hashMapNmea.put(RawType, RawValue);
        },
        data: dataArrayRtcmv32Rrq
    });
    //$("#seRawFrq").combobox("select", hashMapNmea.get(RawType));
}

//初始化RTCM2.4频率
function initRtcmv24Frq(rtcmv24TypeValue) {
    var dataArrayRtcmv24Frq = [];
    webConfigXmlObj.find("dataRtcmv24Frq").children().each(function () {
        var jsonItem = { label: $(this).text(), value: $(this).attr("id") };
        dataArrayRtcmv24Frq.push(jsonItem);
    });
    $("#seRtcmb24Frq").combobox({
        valueField: 'value',
        textField: 'label',
        onSelect: function () {
            var RawType = $("#seRtcmv24Type").combobox("getValue");
            var RawValue = $("#seRtcmv24Frq").combobox("getValue");
            //hashMapNmea.put(RawType, RawValue);
        },
        data: dataArrayRtcmv24Frq
    });
    //$("#seRawFrq").combobox("select", hashMapNmea.get(RawType));
}







//返回主窗口
function btnBack() {
    parent.closeWindow(linkIdx); //linkIdx
}
//返回主窗口
function btnBack1() {
    parent.closeWindow(-1); //linkIdx
}