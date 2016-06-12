var langXmlObj = parent.langXmlObj;
$(document).ready(function () {
    $("h3").html(langXmlObj.find("tagSatelliteTrackTable").text());

    $("#tagAll").html(langXmlObj.find("tagAll").text());
    $("#tagGps").html(langXmlObj.find("tagGps").text());
    $("#tagSbas").html(langXmlObj.find("tagSbas").text());
    $("#tagGlon").html(langXmlObj.find("tagGlon").text());
    $("#tagBds").html(langXmlObj.find("tagBds").text());
    $("#tagGalileo").html(langXmlObj.find("tagGalileo").text());

    $.extend($.messager.defaults, {
        ok: langXmlObj.find("tagConfirm1").text(),
        cancel: langXmlObj.find("tagCancel1").text()
    }); 
});