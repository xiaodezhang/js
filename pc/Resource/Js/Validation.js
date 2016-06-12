//////较复杂的数据验证///////////////
//电台保存设置验证
function validateRadioSet(webConfigXmlObj) {
    var radioPower = $("#seRadioPower").combobox("getValue");
    if (radioPower == "") {
        openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("radioPowerNotNull").text());
        return false;
    }
    var radioFrequency = $("#ipRadioFrequency").val();
    if (radioFrequency == "") {
        openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("radioFrequencyNotNull").text());
        return false;
    }
    var radioFrequencyInt = parseInt(radioFrequency);
    var radioStepper = $("#seRadioStepper").combobox("getValue");
    if (isNaN(radioFrequencyInt)) {
        openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("radioFreMustBeNum").text());
        return false;
    }
    if (radioFrequencyInt * 1000 % parseInt(webConfigXmlObj.find("radioStepper").find(radioStepper).text()) != 0) {
        openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("radioFreMustBeBei").text());
        return false;
    }
    if (!(radioFrequencyInt >= frq_start && radioFrequencyInt <= frq_end)) {
        var tipInfo = parent.langXmlObj.find("tipInfo").find("radioFreBetween1").text() + frq_start + parent.langXmlObj.find("tipInfo").find("radioFreBetween2").text() + frq_end + parent.langXmlObj.find("tipInfo").find("radioFreBetween3").text();
        openWarningWindow(parent.langXmlObj, tipInfo);
        return false;
    }
    return true;
}
//记录信息设置校验
function validateAccountSet() {
    var accountName = $("#ipAccountName").val();
    if (accountName == "") {
        parent.openWarningWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("accountNameNotNull").text());
        return false;
    }
    var frq = $("#seGetFrequency").combobox("getValue");
    if (frq == "") {
        parent.openWarningWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("frequencyNotNull").text());
        return false;
    }
    var storagePosition = $("#seStorePosition").combobox("getValue");
    if (storagePosition == "") {
        parent.openWarningWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("storagePositionNotNull").text());
        return false;
    }
    var conTime = $("#ipConTime").val();
    if (conTime == "") {
        parent.openWarningWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("conTimeNotNull").text());
        return false;
    }
    if (isNaN(parseInt(conTime))) {
        parent.openWarningWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("conTimeBeNum").text());
        return false;
    }
    var storageSize = $("#ipStorage").val();
    if (storageSize == "") {
        parent.openWarningWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("storageSizeNotNull").text());
        return false;
    }
    if (isNaN(parseInt(storageSize))) {
        parent.openWarningWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("storageSizeBeNum").text());
        return false;
    }
    var cbStoreFormat = $('input[name="cbStoreFormat"]:checked').val();
    if (cbStoreFormat == undefined) {
        parent.openWarningWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("storeFormatNotBull").text());
        return false;
    }
    var ftpSend = $('input[name="ipFTPSend"]:checked').val();
    if (ftpSend == undefined) {
        parent.openWarningWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("ftpSendNotBull").text());
        return false;
    }
    return true;
}

//串口设置验证
function validateSerialPortSet() {
    var seUartBaud = $("#seUartBaud").combobox("getValue");
    if (seUartBaud == "") {
        parent.openErrorWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("uartBaudNotNull").text());
        return false;
    }
    var seDiffData = $("#seDiffData").combobox("getValue");
    if (seDiffData == "") {
        parent.openWarningWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("diffDataNotNull").text());
        return false;
    }
    var seInitialData = $("#seInitialData").combobox("getValue");
    if (seInitialData == "") {
        parent.openWarningWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("initialDataNotNull").text());
        return false;
    }
    var seEphemerisData = $("#seEphemerisData").combobox("getValue");
    if (seEphemerisData == "") {
        parent.openWarningWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("ephemerisDataNotNull").text());
        return false;
    }
    var seGPGGA = $("#seGPGGA").combobox("getValue");
    if (seGPGGA == "") {
        parent.openWarningWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("GPGGADataNotNull").text());
        return false;
    }
    var seGPGSV = $("#seGPGSV").combobox("getValue");
    if (seGPGSV == "") {
        parent.openWarningWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("GPGSVDataNotNull").text());
        return false;
    }
    return true;
}
//蓝牙设置验证
function validateBluetoothSet() {
    var seDiffData = $("#seDiffData").combobox("getValue");
    if (seDiffData == "") {
        parent.openWarningWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("diffDataNotNull").text());
        return false;
    }
    var seInitialData = $("#seInitialData").combobox("getValue");
    if (seInitialData == "") {
        parent.openWarningWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("initialDataNotNull").text());
        return false;
    }
    var seEphemerisData = $("#seEphemerisData").combobox("getValue");
    if (seEphemerisData == "") {
        parent.openWarningWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("ephemerisDataNotNull").text());
        return false;
    }
    var seGPGGA = $("#seGPGGA").combobox("getValue");
    if (seGPGGA == "") {
        parent.openWarningWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("GPGGADataNotNull").text());
        return false;
    }
    var seGPGSV = $("#seGPGSV").combobox("getValue");
    if (seGPGSV == "") {
        parent.openWarningWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("GPGSVDataNotNull").text());
        return false;
    }
    return true;
}
//IP格式校验
function validateIpAddress(ipValue) {
    if (ipValue == "") {
        openWarningWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("ipValueNotBeNull").text());
        return;
    }
    //必须是数字
    if (isNaN(parseInt(ipValue)) || (!(parseInt(ipValue) > 0 && parseInt(ipValue) < 255))) {
        openWarningWindow(parent.parent.langXmlObj, parent.parent.langXmlObj.find("tipInfo").find("ipValueBe0And255").text());
        return;
    }
}
//验证邮件地址
function validateIpEmailAddress(emailAddress) {
    if (emailAddress == "") {
        openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("emailAddressNotNull").text());
        return false;
    }
    if (!valdateEmailAddress(emailAddress)) {
        openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("emailAddressNotCorrect").text());
        return false;
    }
    return true;
}
//验证邮件地址
function validateIpEmailAddress1111(emailAddress) {
    if (emailAddress == "") {
        openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("emailAddressNotNull").text());
        return false;
    }
    if (!valdateEmailAddress(emailAddress)) {
        openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("emailAddressNotCorrect1111").text());
        return false;
    }
    return true;
}
//验证端口设置
function validatePort(portValue) {
    if (portValue == "") {
        openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("portNotNull").text());
        return false;
    }
    //必须是数字
    if (isNaN(parseInt(portValue))) {
        openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("portBeNum").text());
        return false;
    }
    //在0和65535之间
    var portInt = parseInt(portValue);
    if (!(portInt > 0 && portInt < 65535)) {
        openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("port0and65535").text());
        return false;
    }
    return true;
}
//验证IP地址
function validateIp(ipValue) {
    if (ipValue == "") {
        openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("ipNetNotNull").text());
        return false;
    }
    //是xxx.xxx.xxx.xxx的格式
    if (!ipValue.match(regIpNet)) {
        openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("ipNetNotCorrect").text());
        return false;
    }
    return true;
}
function validateStaticIp(ipValue) {
    if (ipValue == "") {
        openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("ipNetNotNull").text());
        return false;
    }
    //是xxx.xxx.xxx.xxx的格式
    if (!ipValue.match(regStaticIpNet)) {
        openWarningWindow(parent.langXmlObj, parent.langXmlObj.find("tipInfo").find("ipNetNotCorrect").text());
        return false;
    }
    return true;
}
function validateStaticIp02(ipValue) {
    //是xxx.xxx.xxx.xxx的格式
    if (!ipValue.match(regStaticIpNet)) {
        return false;
    }
    return true;
}
//验证IP地址
function validateIp02(ipValue) {
    if (ipValue == "") {
        return false;
    }
    //是xxx.xxx.xxx.xxx的格式
    if (!ipValue.match(regIpNet)) {
        return false;
    }
    return true;
}
//验证是否含有汉字
function validateChinese(valueString) {
    if (valueString != "") {
        for (var i = 0; i < valueString.length; i++) {
            //是否是汉字
            if (valueString[i].match(regChinese)) {
                return true;
            }
        }
    }
    return false;
}
//验证接收机注册码格式,3组5位的数字
function validateFirmRegisterCode(valueString) {
    if (!valueString.match(firmRegisterCode)) {
        return false;
    }
    return true;
}
//正则表达式常量
var regPortValue1024 = "^([1-9][0-9][2-9][5-9]|[1-6][0-5][0-5][0-3][0-5])$"; //端口在1024和65535之间
var regIpNet = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.([0-9]{1}|\d{2}|1\d\d|2[0-4]\d|25[0-5])$/;
var regStaticIpNet = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.([1-9]{1}|\d{2}|1\d\d|2[0-4]\d|25[0-4])$/;
var regChinese = "^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$"; //是否有汉字
var firmRegisterCode = /^(\d{5}-\d{5}-\d{5})$/;    //3组5位的数字