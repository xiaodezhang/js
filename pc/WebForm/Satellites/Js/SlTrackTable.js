var webConfigXmlObj = parent.webConfigXmlObj;
var sattypewhole = "all";
$(document).ready(function () {
    createDatagrid(); //创建gridview
    bindData(); //初始化绑定数据
    setInterval("bindData()", 5000);
});

//创建gridview
function createDatagrid() {
    var bodyWidth = document.body.clientWidth * 0.95;
    $('#dgrid').datagrid({
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
                        { field: 'tagSatelliteId', title: 'prn', width: bodyWidth * 0.12, align: 'center' },
                        { field: 'tagsys',         title: 'sys', width: bodyWidth * 0.12, align: 'center' },
                        { field: 'tagAltitudeAngle', title: 'elevation', width: bodyWidth * 0.12, align: 'center' },
                        { field: 'tagAzimuthalAngle', title: 'azimuth', width: bodyWidth * 0.12, align: 'center' },
                        { field: 'tagL1NoiseSignalRatio', title: 'L1', width: bodyWidth * 0.12, align: 'center' },
                        { field: 'tagL2NoiseSignalRatio', title: 'L2', width: bodyWidth * 0.12, align: 'center' },
                        { field: 'tagL5NoiseSignalRatio', title: 'L5', width: bodyWidth * 0.12, align: 'center' }
				    ]],
        rownumbers: false
    });
}
//为表格绑定数据
function bindData() {
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
        //绑定GPS卫星信息
        var rowsgps = getDgData(data.gps_sat, "GPS");
        //绑定GLONASS卫星信息
        var rowsglon = getDgData(data.glo_sat, "GLONASS");
        //绑定BDS卫星信息
        var rowsbds = getDgData(data.bd_sat, "BDS");


        var rowGalileo = getDgData(data.gali_sat, "GALILEO");

        //绑定SBAS卫星信息
        var rowssbas = getDgData(data.sbas_sat, "SBAS");

        if (sattypewhole== "all") {
            var dgRows = $.merge($.merge($.merge($.merge(rowsgps, rowssbas), rowsglon), rowsbds), rowGalileo);
            $('#dgrid').datagrid('loadData', dgRows);
        } else if (sattypewhole == "gps") {
            $('#dgrid').datagrid('loadData', rowsgps);
        }else if (sattypewhole == "glonass") {
            $('#dgrid').datagrid('loadData', rowsglon);
        } else if (sattypewhole == "bds") {
            $('#dgrid').datagrid('loadData', rowsbds);
        } else if (sattypewhole == "galileo") {
            $('#dgrid').datagrid('loadData', rowGalileo);
        } else if (sattypewhole == "sbas") {
            $('#dgrid').datagrid('loadData', rowssbas);
        } 
        }
    });
}
function getDgData(starInfoArray, starType) {
    var rows = [];
    for (var k = 0; k < starInfoArray.length; k++) {
        rows.push({
            tagSatelliteId:        starInfoArray[k].prn,
            tagsys:                starType,
            tagAltitudeAngle:      starInfoArray[k].elevation,
            tagAzimuthalAngle:     starInfoArray[k].azimuth,
            tagL1NoiseSignalRatio: starInfoArray[k].L1,
            tagL2NoiseSignalRatio: starInfoArray[k].L2,
            tagL5NoiseSignalRatio: starInfoArray[k].L5,
        });
    }
    return rows;
}

function searchInfo(sattype) {
    sattypewhole = sattype;
    bindData();
}
