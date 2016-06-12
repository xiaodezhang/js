var langXmlObj = parent.langXmlObj;
$(document).ready(function () {
    $("h3").html(langXmlObj.find("tagSatelliteTrackDiagram").text());

     $("#tagSatelliteGps").html(langXmlObj.find("tagSatelliteGps").text());
     $("#tagSatelliteSbas").html(langXmlObj.find("tagSatelliteSbas").text());
     $("#tagSatelliteGln").html(langXmlObj.find("tagSatelliteGln").text());
     $("#tagSatelliteBds").html(langXmlObj.find("tagSatelliteBds").text());
     $("#tagSatelliteGalieo").html(langXmlObj.find("tagSatelliteGalieo").text());
     $("#tagTypeL1").html(langXmlObj.find("tagTypeL1").text());
     $("#tagTypeL2").html(langXmlObj.find("tagTypeL2").text());
     $("#tagTypeL5").html(langXmlObj.find("tagTypeL5").text());

     $("#tagStarType").html(langXmlObj.find("tagStarType").text());
     $("#tagNoiseSignal").html(langXmlObj.find("tagNoiseSignal").text());

     $.extend($.messager.defaults, {
         ok: langXmlObj.find("tagConfirm1").text(),
         cancel: langXmlObj.find("tagCancel1").text()
     }); 
});