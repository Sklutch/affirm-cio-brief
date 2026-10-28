(function(){
  "use strict";
  // ---- Charts ----
  if (typeof Chart === "undefined") {
    document.querySelectorAll(".chart-box").forEach(function(b){b.innerHTML='<p class="note">Chart unavailable (charting library did not load). Figures are in the tables and text.</p>';});
    return;
  }
  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
  Chart.defaults.color = "#5b616e";
  Chart.defaults.maintainAspectRatio = false;
  var BLUE="#3b5bdb", TEAL="#12b886", ORANGE="#f08c00", RED="#e03131", GRID="#eceef1";

  var refLine = {id:"refLine",afterDatasetsDraw:function(chart){
    var y = chart.scales.y.getPixelForValue(64), a = chart.chartArea, ctx = chart.ctx;
    ctx.save(); ctx.strokeStyle=RED; ctx.setLineDash([6,4]); ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(a.left,y); ctx.lineTo(a.right,y); ctx.stroke();
    ctx.setLineDash([]); ctx.fillStyle=RED; ctx.font="600 11px "+Chart.defaults.font.family; ctx.textAlign="left";
    ctx.fillText("FY27 GMV guide >$64B", a.left+6, y-6); ctx.restore();
  }};
  new Chart(document.getElementById("gmvChart"), {
    type:"bar",
    data:{labels:["FY20","FY21","FY22","FY23","FY24","FY25","FY26"],
      datasets:[{label:"GMV ($B)",data:[4.6,8.3,15.5,20.2,26.6,36.7,50.2],backgroundColor:BLUE,borderRadius:3},
                {label:"Revenue ($B)",data:[0.51,0.87,1.35,1.59,2.32,3.22,4.26],backgroundColor:TEAL,borderRadius:3}]},
    options:{scales:{y:{beginAtZero:true,suggestedMax:70,grid:{color:GRID},ticks:{callback:function(v){return "$"+v+"B";}}},x:{grid:{display:false}}},
      plugins:{legend:{position:"bottom",labels:{boxWidth:12}},tooltip:{callbacks:{label:function(c){return c.dataset.label.replace(" ($B)","")+": $"+c.raw+"B";}}}}},
    plugins:[refLine]
  });

  var LEV=[["Beta 2.7 → 2.2",29.8],["Funding cost +1 point",-19.6],["Credit losses +10%",-9.2],["GMV growth +1 point a year",6.5],["Take rate +0.1 cent per $",5.8]];
  new Chart(document.getElementById("leverChart"), {
    type:"bar",
    data:{labels:LEV.map(function(r){return r[0];}),
      datasets:[{label:"% of price",data:LEV.map(function(r){return r[1];}),backgroundColor:LEV.map(function(r){return r[1]>0?TEAL:RED;}),borderRadius:3}]},
    options:{indexAxis:"y",scales:{x:{grid:{color:GRID},ticks:{callback:function(v){return (v>0?"+":"")+v+"%";}}},y:{grid:{display:false}}},
      plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return (c.raw>0?"+":"")+c.raw+"% of price";}}}}}
  });
})();
