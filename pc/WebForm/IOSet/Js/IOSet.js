var webConfigXmlObj = parent.webConfigXmlObj;
$(document).ready(function () {
   
    createDatagrid(); //创建gridview
    bindData(); //初始化绑定数据
});


//创建gridview
function createDatagrid() {
    var bodyWidth = document.body.clientWidth * 0.95;
    $('#dgrid').datagrid({
        iconCls: 'icon-save',
        width: bodyWidth,
        nowrap: true,
        autoRowHeight: true,
        singleSelect: true,
        striped: true,
        idField: 'tagId',
        collapsible: true,
        sortOrder: 'desc',
        remoteSort: false,
        frozenColumns: [[
                        { field: 'tagId', title: "Id", width: bodyWidth * 0.1, align: 'center', hidden: true },
                        { field: 'tagType2', title:"类型", width: bodyWidth * 0.14, align: 'center' },
                        { field: 'tagNetIpAddr', title: "摘要", width: bodyWidth * 0.15, align: 'center' },
                        { field: 'tagOutput', title: "输出", width: bodyWidth * 0.43, align: 'center' },
                        { field: 'tagStatus', title: "输入", width: bodyWidth * 0.1, align: 'center' },
                        { field: 'edit', title: "修改", width: bodyWidth * 0.15, align: 'center',
                            formatter: function (value, rec) {
                                var formateString;
                                formateString = '<span style="color:red">';
                                    formateString = '<span style="color:red"> <a href="#" onclick="openSet(\'' + rec.tagId + '\')">' + '设置' + '</a>';
                                    formateString += '|';
                                    formateString += '<a href="#" onclick="showDetail(\'' + rec.tagId + '\')">' + '详情' + '</a>';
                               
                                formateString += '</span>';
                                return formateString;
                            }
                        }
				    ]],
        rownumbers: true
    });
}

function openSet(tagId) {
    if (tagId == "IO_ID__TCPIP") {

            $('#windowForTcpIp').window({
                title: "TCP/IP设置"
            });
            $('#windowForTcpIp').empty();
            $('#windowForTcpIp').append("<iframe src='EditWindows/TcpIpSet.html?linkIdx=" + tagId + "' width='100%' height='100%' style='padding:0px;' frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='no'  allowtransparency='yes'></iframe>");
            $('#windowForTcpIp').window('open');
            return;
       
    }  else if (tagId == "IO_ID__COM1") {
            $('#windowForSerialPort1').window({
            title: "串口/COM1"
        });
        $('#windowForSerialPort1').empty();
        $('#windowForSerialPort1').append("<iframe src='EditWindows/SerialPortSetCOM1.html?linkIdx=" + tagId + "' width='100%' height='100%' style='padding:0px;' frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='no'  allowtransparency='yes'></iframe>");
        $('#windowForSerialPort1').window('open');
        return;
    } else if (tagId == "IO_ID__COM2") {
        $('#windowForSerialPort2').window({
            title: "串口/COM2"
        });
        $('#windowForSerialPort2').empty();
        $('#windowForSerialPort2').append("<iframe src='EditWindows/SerialPortSetCOM2.html?linkIdx=" + tagId + "' width='100%' height='100%' style='padding:0px;' frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='no'  allowtransparency='yes'></iframe>");
        $('#windowForSerialPort2').window('open');
        return;
    } else if (tagId == "IO_ID__COM3") {
        $('#windowForSerialPort3').window({
            title: "串口/COM3"
        });
        $('#windowForSerialPort3').empty();
        $('#windowForSerialPort3').append("<iframe src='EditWindows/SerialPortSetCOM3.html?linkIdx=" + tagId + "' width='100%' height='100%' style='padding:0px;' frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='no'  allowtransparency='yes'></iframe>");
        $('#windowForSerialPort3').window('open');
        return;
    } else if (tagId == "IO_ID__USB") {
            $('#windowForUsb').window({
                title: "USB"
            });
            $('#windowForUsb').empty();
            $('#windowForUsb').append("<iframe src='EditWindows/UsbSet.html?linkIdx=" + tagId + "' width='100%' height='100%' style='padding:0px;' frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='no'  allowtransparency='yes'></iframe>");
            $('#windowForUsb').window('open');
            return;
       
    }
    
}



//查看详细信息
function showDetail(tagId) {
    if (tagId == "IO_ID__NETLINK_ROVER") {
        $('#windowForRoverInfo').window({
            title: parent.langXmlObj.find("tagRTKClient").text()
        });
        $('#windowForRoverInfo').empty();
        $('#windowForRoverInfo').append("<iframe src='WindowsInfo/CorsSetInfo.html?linkIdx=" + tagId + "' width='100%' height='100%' style='padding:0px;' frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='no'  allowtransparency='yes'></iframe>");
        $('#windowForRoverInfo').window('open');
    } else if (tagId == "IO_ID__NETLINK_1" || tagId == "IO_ID__NETLINK_2" || tagId == "IO_ID__NETLINK_3" || tagId == "IO_ID__NETLINK_4" || tagId == "IO_ID__NETLINK_5" || tagId == "IO_ID__NETLINK_6") {
        $('#windowForClientInfo').window({
            title: parent.langXmlObj.find("tagtcpClient").text()
        });
        $('#windowForClientInfo').empty();
        $('#windowForClientInfo').append("<iframe src='WindowsInfo/NetClientInfo.html?linkIdx=" + tagId + "' width='100%' height='100%' style='padding:0px;' frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='no'  allowtransparency='yes'></iframe>");
        $('#windowForClientInfo').window('open');
    } else if (tagId == "IO_ID__NETSERVER_1" || tagId == "IO_ID__NETSERVER_2" || tagId == "IO_ID__NETSERVER_3" || tagId == "IO_ID__NETSERVER_4") {
        $('#windowForServerInfo').window({
            title: parent.langXmlObj.find("tagtcpCaster").text()
        });
        $('#windowForServerInfo').empty();
        $('#windowForServerInfo').append("<iframe src='WindowsInfo/NetServerInfo.html?serverIdx=" + tagId + "' width='100%' height='100%' style='padding:0px;' frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='no'  allowtransparency='yes'></iframe>");
        $('#windowForServerInfo').window('open');
    }

}

//初始化绑定数据
function bindData() {
    var dgRows = [];
    var dgRowsUpdate = [];

    webConfigXmlObj.find("netLinkSets").find("item").each(function (rowIndex, item) {
    
            dgRows.push({
                tagId: webConfigXmlObj.find("netLinkSets").find($(this).attr("value")).text(),
                tagType2: $(this).text(),
                tagNetIpAddr: "",
                tagOutput: "",
                tagStatus: ""
            });
            dgRowsUpdate.push({
                index: rowIndex,
                linkIdx: webConfigXmlObj.find("netLinkSets").find($(this).attr("value")).text()
            });
      
    });

    $('#dgrid').datagrid('loadData', dgRows);   
}







