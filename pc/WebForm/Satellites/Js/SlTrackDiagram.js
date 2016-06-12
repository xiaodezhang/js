var width = 1200;
var height = 400;

var svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var padding = {left:30, right:30, top:20, bottom:20};

$(document).ready(function(){

  setTimeout("getd()",1600);
  setInterval("freshd()",5000);
});

function freshd(){
    getd();
}

function getd(){

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
            if (data == null) {
                return;
            }
            paint(data);

        }
    });

}

function paint(pdata){

    var gpsnum  = parseInt(pdata.gps_num);
    var sbasnum = parseInt(pdata.sbas_num);
    var glonum  = parseInt(pdata.glo_num);
    var bdsnum  = parseInt(pdata.bd_num);
    var galinum = parseInt(pdata.gali_num);
    var dataset = new Array();
    var i;
    if(gpsnum > 0)
        for(i = 0;i < gpsnum;i++){
            dataset.push(pdata.gps_sat[i].L1);
            dataset.push(pdata.gps_sat[i].L2);
            if(pdata.gps_sat[i].L5 > 0) dataset.push(pdata.gps_sat[i].L5);
        }

    if(sbasnum > 0)
        for(i = 0;i < sbasnum;i++){
            dataset.push(pdata.sbas_sat[i].L1);
            dataset.push(pdata.sbas_sat[i].L2);
            if(pdata.sbas_sat[i].L5 > 0) dataset.push(pdata.sbas_sat[i].L5);
        }
    if(glonum > 0)
        for(i = 0;i < glonum;i++){
            dataset.push(pdata.glo_sat[i].L1);
            dataset.push(pdata.glo_sat[i].L2);
            if(pdata.glo_sat[i].L5 > 0) dataset.push(pdata.glo_sat[i].L5);
        }
    if(bdsnum > 0)
        for(i = 0;i < bdsnum;i++){
            dataset.push(pdata.bd_sat[i].L1);
            dataset.push(pdata.bd_sat[i].L2);
            if(pdata.bd_sat[i].L5 > 0) dataset.push(pdata.bd_sat[i].L5);
        }
    if(galinum > 0)
        for(i = 0;i < galinum;i++){
            dataset.push(pdata.gali_sat[i].L1);
            dataset.push(pdata.gali_sat[i].L2);
            if(pdata.gali_sat[i].L5 > 0) dataset.push(pdata.gali_sat[i].L5);
        }


    d3.selectAll("svg > *").remove();
    var xScale = d3.scale.ordinal()
      .domain(d3.range(dataset.length))
      .rangeRoundBands([0, width - padding.left - padding.right]);

    var yScale = d3.scale.linear()
      .domain([0,d3.max(dataset)])
      .range([height - padding.top - padding.bottom, 0]);

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom");
      
    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left");

    var rectPadding = 4;
    var rects = svg.selectAll(".MyRect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class","MyRect")
      .attr("transform","translate(" + padding.left + "," + padding.top + ")")
      .attr("x", function(d,i){
            return xScale(i) + rectPadding/2;
      } )
      .attr("y",function(d){
            return yScale(d);
      })
      .attr("width", xScale.rangeBand() - rectPadding )
      .attr("height", function(d){
            return height - padding.top - padding.bottom - yScale(d);
      });

    var texts = svg.selectAll(".MyText")
      .data(dataset)
      .enter()
      .append("text")
      .attr("class","MyText")
      .attr("transform","translate(" + padding.left + "," + padding.top + ")")
      .attr("x", function(d,i){
            return xScale(i) + rectPadding/2;
      } )
      .attr("y",function(d){
            return yScale(d);
      })
      .attr("dx",function(){
            return (xScale.rangeBand() - rectPadding)/2;
      })
      .attr("dy",function(d){
            return 20;
      })
      .text(function(d){
            return d;
      });

    svg.append("g")
      .attr("class","axis")
      .attr("transform","translate(" + padding.left + "," + (height - padding.bottom) + ")")
      .call(xAxis); 
      
    svg.append("g")
      .attr("class","axis")
      .attr("transform","translate(" + padding.left + "," + padding.top + ")")
      .call(yAxis);


}


