(function(){
  "use strict";
  // ---- Beta toggle: all three panels are static HTML; this only switches which one is visible ----
  function showCase(k){
    document.querySelectorAll(".case-panel").forEach(function(p){ p.hidden = p.dataset.panel !== k; });
    document.querySelectorAll(".segmented button").forEach(function(b){b.setAttribute("aria-selected", b.dataset.case===k ? "true":"false");});
  }
  document.querySelectorAll(".segmented button").forEach(function(b){b.addEventListener("click",function(){showCase(b.dataset.case);});});
  showCase("raw");

  // ---- Charts ----
  if (typeof Chart === "undefined") {
    document.querySelectorAll(".chart-box").forEach(function(b){b.innerHTML='<p class="note">Chart unavailable (charting library did not load). Figures are in the tables and text.</p>';});
    return;
  }
  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
  Chart.defaults.color = "#5b616e";
  Chart.defaults.maintainAspectRatio = false;
  var BLUE="#3b5bdb", TEAL="#12b886", ORANGE="#f08c00", PURPLE="#7950f2", RED="#e03131", GRID="#eceef1";

  new Chart(document.getElementById("pieChart"), {
    type:"doughnut",
    data:{labels:["Interest income","Merchant fees","Gain on loan sales","Card + servicing"],
      datasets:[{data:[2047.5,1149.9,596.6,467.1],backgroundColor:[BLUE,TEAL,ORANGE,PURPLE],borderWidth:2,borderColor:"#fff"}]},
    options:{cutout:"55%",plugins:{legend:{position:"bottom",labels:{boxWidth:12,font:{size:11}}},
      tooltip:{callbacks:{label:function(c){return c.label+": $"+c.raw.toLocaleString("en-US",{minimumFractionDigits:1})+"M";}}}}}
  });

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

  new Chart(document.getElementById("marginChart"), {
    type:"line",
    data:{labels:["FY20","FY21","FY22","FY23","FY24","FY25","FY26"],
      datasets:[{label:"Adj. operating margin",data:[-13.4,1.6,-5.8,-4.6,16.4,24.1,29.0],borderColor:BLUE,backgroundColor:BLUE,tension:.25,pointRadius:3}]},
    options:{scales:{y:{min:-20,max:35,grid:{color:function(c){return c.tick.value===0?"#aab0bb":GRID;}},ticks:{callback:function(v){return v+"%";}}},x:{grid:{display:false}}},
      plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return c.raw+"%";}}}}}
  });

  var dqLabels=["FQ1'23","FQ2'23","FQ3'23","FQ4'23","FQ1'24","FQ2'24","FQ3'24","FQ4'24","FQ1'25","FQ2'25","FQ3'25","FQ4'25","FQ1'26","FQ2'26","FQ3'26","FQ4'26"];
  new Chart(document.getElementById("dqChart"), {
    type:"line",
    data:{labels:dqLabels,
      datasets:[{label:"30+ day delinquency",data:[3.83,2.68,2.29,1.97,2.47,2.47,2.25,2.52,2.72,2.72,2.65,2.46,2.88,2.63,2.79,2.51],borderColor:ORANGE,backgroundColor:ORANGE,tension:.25,pointRadius:3}]},
    options:{scales:{y:{min:1.5,max:4,grid:{color:GRID},ticks:{callback:function(v){return v.toFixed(1)+"%";}}},
      x:{grid:{display:false},ticks:{autoSkip:false,maxRotation:0,callback:function(v,i){return i%4===3||i===0?dqLabels[i]:"";}}}},
      plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return c.raw.toFixed(2)+"%";}}}}}
  });

  var R=[["FQ2'21",-10.1],["FQ3'21",-2.7],["FQ4'21",34.4],["FQ1'22",13.7],["FQ2'22",-20.7],["FQ3'22",31.4],["FQ4'22",-21.3],["FQ1'23",-22.6],["FQ2'23",-17.0],["FQ3'23",-0.4],["FQ4'23",28.8],["FQ1'24",14.2],["FQ2'24",-10.9],["FQ3'24",10.2],["FQ4'24",31.9],["FQ1'25",-4.7],["FQ2'25",21.8],["FQ3'25",-14.5],["FQ4'25",10.6],["FQ1'26",11.6],["FQ2'26",-4.0],["FQ3'26",-5.0],["FQ4'26",0.4]];
  new Chart(document.getElementById("earnChart"), {
    type:"bar",
    data:{labels:R.map(function(r){return r[0];}),
      datasets:[{label:"Next-day move",data:R.map(function(r){return r[1];}),backgroundColor:R.map(function(r){return r[1]>=0?BLUE:RED;}),borderRadius:2}]},
    options:{scales:{y:{min:-30,max:40,grid:{color:function(c){return c.tick.value===0?"#aab0bb":GRID;}},ticks:{stepSize:10,callback:function(v){return (v>0?"+":"")+v+"%";}}},
      x:{grid:{display:false},ticks:{autoSkip:true,maxRotation:0,autoSkipPadding:10}}},
      plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return (c.raw>0?"+":"")+c.raw.toFixed(1)+"%";}}}}}
  });
})();
