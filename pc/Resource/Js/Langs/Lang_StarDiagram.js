var langXmlObj = parent.langXmlObj;
$(document).ready(function () {
    $("h3").html(langXmlObj.find("tagStarDiagram").text());

    $.extend($.messager.defaults, {
        ok: langXmlObj.find("tagConfirm1").text(),
        cancel: langXmlObj.find("tagCancel1").text()
    }); 
});