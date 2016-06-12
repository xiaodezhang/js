var langXmlObj = parent.langXmlObj;
$(document).ready(function () {
    $("h3").html(langXmlObj.find("tag1ppsSet").text());
    $("#tagYes").html(langXmlObj.find("tagOn").text());
    $("#tagNo").html(langXmlObj.find("tagOff").text());
    $("#tag1ppsSet").html(langXmlObj.find("tag1ppsSet").text());
    $.extend($.messager.defaults, {
        ok: langXmlObj.find("tagConfirm1").text(),
        cancel: langXmlObj.find("tagCancel1").text()
    }); 
});