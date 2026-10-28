(function(){
  "use strict";
  // ---- Beta toggle ----
  var CASES = {
    raw: { items: [
      ["Beta and cost of equity","β 2.7 (3Y daily 2.55, 3Y weekly 2.83) → 16.3%"],
      ["Growth the price needs (FY28–36)","24.5% a year, then fade to 3% by FY41"],
      ["FY41 revenue / GMV needed","$67.1B / $838B (12.3× FY27 revenue)"],
      ["FY41 GMV vs today's US e-commerce","62% (7.3% of 2024 US card payments)"],
      ["Probability-weighted value","$50.5 (−30.5% vs $72.68)"]],
      rows: [["Bull (25%)","$72.6"],["Base (50%)","$51.9"],["Bear (25%)","$25.8"],["Stress, 2022-style (not weighted)","$13.7"]] },
    blume: { items: [
      ["Beta and cost of equity","Blume-adjusted β 2.04 → 13.6%"],
      ["Growth the price needs (FY28–36)","19.2% a year, then fade to 3% by FY41"],
      ["FY41 revenue / GMV needed","$41.4B / $517B"],
      ["FY41 GMV vs today's US e-commerce","38% (4.5% of 2024 US card payments)"],
      ["Probability-weighted value","$68.5 (−5.8% vs $72.68)"]],
      rows: [["Bull (25%)","$100.9"],["Base (50%)","$70.1"],["Bear (25%)","$32.9"],["Stress, 2022-style (not weighted)","$17.2"]] },
    fade: { items: [
      ["Beta and cost of equity","β fades 2.7 → 1.5 over FY27–36: 16.3% → 11.3%"],
      ["Growth the price needs (FY28–36)","17.2% a year, then fade to 3% by FY41"],
      ["FY41 revenue / GMV needed","$34.2B / $427B"],
      ["FY41 GMV vs today's US e-commerce","31% (3.7% of 2024 US card payments)"],
      ["Probability-weighted value","$77.8 (+7.0% vs $72.68)"]],
      rows: [["Bull (25%)","$116.1"],["Base (50%)","$79.5"],["Bear (25%)","$36.2"],["Stress, 2022-style (not weighted)","$18.8"]] }
  };
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
  function renderCase(k){
    var c = CASES[k];
    document.getElementById("caseProps").innerHTML = c.items.map(function(i){return "<div><dt>"+esc(i[0])+"</dt><dd>"+esc(i[1])+"</dd></div>";}).join("");
    document.getElementById("caseRows").innerHTML = c.rows.map(function(r){return "<tr><td>"+esc(r[0])+"</td><td>"+esc(r[1])+"</td></tr>";}).join("");
    document.querySelectorAll(".segmented button").forEach(function(b){b.setAttribute("aria-selected", b.dataset.case===k ? "true":"false");});
  }
  document.querySelectorAll(".segmented button").forEach(function(b){b.addEventListener("click",function(){renderCase(b.dataset.case);});});
  renderCase("raw");

  // ---- Calendar (Nov 2026) ----
  var EVENTS = {3:["UPST, Block Q3"],4:["Sezzle Q3"],5:["AFRM FQ1'27 (after close)"],10:["October CPI"],13:["Convert buyback window ends"],15:["$221.3M converts mature"],17:["Klarna Q3"],19:["Census Q3 e-commerce"],27:["Black Friday"],30:["Cyber Monday"]};
  var cal = document.getElementById("calendar"), html = "";
  ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(function(d){html += '<div class="dow">'+d+'</div>';});
  var first = new Date(2026,10,1).getDay(); // Nov 1, 2026
  for (var i=0;i<first;i++) html += '<div class="day empty"></div>';
  for (var d=1; d<=30; d++){
    var ev = EVENTS[d]||[];
    html += '<div class="day'+(d===5?' key':'')+'"><span class="num">'+d+'</span>'+ev.map(function(e){return '<span class="ev">'+esc(e)+'</span>';}).join("")+'</div>';
  }
  cal.innerHTML = html;

  // ---- Sources ----
  var SOURCES = [
    ["S1 Form 10-K FY2026","SEC EDGAR","2026-08-27","https://www.sec.gov/Archives/edgar/data/1820953/000162828026059279/afrm-20260630.htm"],
    ["S2 FQ4'26 Shareholder Letter","SEC EDGAR","2026-08-27","https://www.sec.gov/Archives/edgar/data/1820953/000162828026059271/affirmfq426shareholderle.htm"],
    ["S4 FQ2'26 Shareholder Letter","SEC EDGAR","2026-02-05","https://www.sec.gov/Archives/edgar/data/1820953/000162828026005772/affirmfq226shareholderle.htm"],
    ["S5 FQ1'26 Shareholder Letter","SEC EDGAR","2025-11-06","https://www.sec.gov/Archives/edgar/data/1820953/000162828025050159/affirmfq126designedshare.htm"],
    ["S6 FQ4'25 Shareholder Letter","SEC EDGAR","2025-08-28","https://www.sec.gov/Archives/edgar/data/1820953/000182095325000078/affirmfq425designedshare.htm"],
    ["S14 FQ4'23 Shareholder Letter","SEC EDGAR","2023-08-24","https://www.sec.gov/Archives/edgar/data/1820953/000182095323000015/afrm-fq423shareholderlet.htm"],
    ["S16 FQ2'23 Shareholder Letter","SEC EDGAR","2023-02-08","https://www.sec.gov/Archives/edgar/data/1820953/000182095323000001/shareholderletterdatedfe.htm"],
    ["S31 XBRL Company Facts, Affirm","SEC EDGAR","","https://data.sec.gov/api/xbrl/companyfacts/CIK0001820953.json"],
    ["S33 Form 8-K (Walmart/OnePay)","SEC EDGAR","2025-03-17","https://www.sec.gov/Archives/edgar/data/1820953/000182095325000036/afrm-20250317.htm"],
    ["S34 Affirm submits ILC applications","Affirm IR","2026-01-23","https://investors.affirm.com/news-releases/news-release-details/affirm-submits-applications-establish-industrial-loan-company"],
    ["S35 Yahoo Finance daily prices","Yahoo Finance","","https://query1.finance.yahoo.com/v8/finance/chart/AFRM"],
    ["S36 FOMC calendar","Federal Reserve","","https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm"],
    ["S37 CPI release schedule","BLS","","https://www.bls.gov/schedule/news_release/cpi.htm"],
    ["S38 FQ1'27 results date (Nov 5, 2026)","Affirm IR","2026-10-05","https://investors.affirm.com/news-releases/news-release-details/affirm-announce-first-quarter-fiscal-year-2027-results-november"],
    ["S39 Sam's Club exclusive","Affirm IR","2026-10-22","https://investors.affirm.com/news-releases/news-release-details/affirm-launches-exclusive-pay-over-time-provider-sams-club"],
    ["S40 Ant International / Antom","Affirm IR","2026-10-06","https://investors.affirm.com/news-releases/news-release-details/affirm-partners-ant-internationals-antom-bring-pay-over-time-us"],
    ["S41 Live in Apple Pay","Affirm IR","2024-09-16","https://investors.affirm.com/news-releases/news-release-details/affirm-live-when-checking-out-online-or-app-apple-pay"],
    ["S42 Fiserv and Affirm (debit)","Affirm IR","2026-01-26","https://investors.affirm.com/news-releases/news-release-details/fiserv-and-affirm-join-forces-bring-flexible-payments-debit"],
    ["S43 Affirm falls 10% on inflation print","24/7 Wall St.","2026-10-14","https://247wallst.com/investing/2026/10/14/affirm-falls-10-as-inflation-print-lifts-yields-klarna-drops-3-paypal-barely-budges/"],
    ["S52 Peer XBRL Company Facts (example: PYPL)","SEC EDGAR","","https://data.sec.gov/api/xbrl/companyfacts/CIK0001633917.json"],
    ["S53 AFRM forecast and price targets","stockanalysis.com","","https://stockanalysis.com/stocks/afrm/forecast/"],
    ["S57 NY DFS proposed Part 423 (BNPL)","NY DFS","2026-07-13","https://www.dfs.ny.gov/system/files/documents/2026/07/rp-bank-3nycrr-423-text.pdf"],
    ["S59 Form 8-K (Amazon partnership)","SEC EDGAR","2021-08-30","https://www.sec.gov/Archives/edgar/data/1820953/000110465921110697/tm2126423d1_8k.htm"],
    ["S63 Affirm to cut about 19% of workforce","Reuters","2023-02-08","https://www.reuters.com/business/bnpl-lender-affirm-cut-about-19-its-workforce-2023-02-08/"],
    ["S87 Affirm announces pricing of IPO","Affirm IR","2021-01-12","https://investors.affirm.com/news-releases/news-release-details/affirm-announces-pricing-of-ipo"],
    ["S88 Affirm shares soar in Nasdaq debut","CNBC","2021-01-13","https://www.cnbc.com/2021/01/13/affirm-ipo-afrm-starts-trading-on-nasdaq.html"],
    ["S91 Affirm to power Shop Pay Installments","Affirm IR","2020-07-22","https://investors.affirm.com/news-releases/news-release-details/affirm-to-power-shopify-shop-pay-installments"],
    ["S92 Klarna, OnePay tie-up for Walmart","Reuters","2025-03-17","https://www.reuters.com/technology/klarna-onepay-unveil-installment-loans-tie-up-walmart-shoppers-us-2025-03-17/"],
    ["S103 FIS partners with Affirm","FIS","2025-02-11","https://www.fisglobal.com/about-us/media-room/press-release/2025/fis-partners-with-affirm-to-bring-integrated-pay-over-time-capabilities"],
    ["S104 Apple to discontinue Apple Pay Later","Reuters","2024-06-17","https://www.reuters.com/technology/apple-discontinue-buy-now-pay-later-service-us-it-plans-new-loan-program-2024-06-17/"],
    ["S105 Form 8-K: revolver amendment ($675M)","SEC EDGAR","2026-06-25","https://www.sec.gov/Archives/edgar/data/1820953/000162828026045491/afrm-20260618.htm"],
    ["S108 Costco.com partnership","Affirm IR","2025-05-14","https://investors.affirm.com/news-releases/news-release-details/costco-and-affirm-partner-bring-new-flexible-payment-option"],
    ["S109 Investor Forum 2026","Affirm IR","2026-05-12","https://investors.affirm.com/events/event-details/affirm-investor-forum-2026"],
    ["S110 Damodaran implied ERP (Oct 1, 2026)","NYU Stern","","https://pages.stern.nyu.edu/~adamodar/New_Home_Page/home.htm"],
    ["S112 FactSet consensus via cnyes (unverified)","cnyes","2026-10-08","https://news.cnyes.com/news/id/6625949",1],
    ["S115 Citizens reiterates Affirm rating (unverified)","Investing.com","2026-09-16","https://www.investing.com/news/analyst-ratings/citizens-reiterates-affirm-stock-rating-on-strong-fiscal-outlook-93CH-4903297",1],
    ["S117 BPI and ICBA comment on Affirm Bank","BPI","2026-02-25","https://bpi.com/bpi-and-icba-comment-on-affirm-banks-application-for-deposit-insurance/"],
    ["S118 NCRC comment opposing Affirm Bank","NCRC","2026-02-25","https://www.ncrc.org/ncrc-comment-in-opposition-to-affirm-holdings-inc-application-for-federal-deposit-insurance/"],
    ["S119 Quarterly retail e-commerce, Q2 2026","US Census","2026-08-18","https://www.census.gov/retail/mrts/www/data/pdf/ec_current.pdf"],
    ["S120 Federal Reserve Payments Study 2015–2024","Federal Reserve","","https://www.federalreserve.gov/paymentsystems/frps_cy2015_24_topline_accessible_version.htm"],
    ["S121 Klarna Q2 2026 earnings release","SEC EDGAR","","https://www.sec.gov/Archives/edgar/data/2003292/000162828026057573/q22026earningsrelease.htm"],
    ["S123 Block Q2 2026 shareholder letter","SEC EDGAR","","https://www.sec.gov/Archives/edgar/data/1512673/0001193125-26-335117.txt"],
    ["S125 PayPal Q4 2025 call transcript (secondary, unverified)","The Motley Fool","2026-02-03","https://www.fool.com/earnings/call-transcripts/2026/02/03/paypal-pypl-q4-2025-earnings-call-transcript/",1],
    ["S126 Affirm 2026 proxy (DEF 14A)","SEC EDGAR","2026-10-23","https://www.sec.gov/Archives/edgar/data/1820953/000162828026067042/afrm-20261021.htm"],
    ["S130 PayPal 3Q'26 earnings presentation","PayPal IR","2026-10-27","https://s205.q4cdn.com/875401827/files/content_files/PYPL-3Q-26-Earnings-Presentation.pdf"]
  ];
  document.getElementById("sourceList").innerHTML = SOURCES.map(function(s){
    return '<li'+(s[4]?' class="unv"':'')+'><a href="'+esc(s[3])+'" target="_blank" rel="noopener noreferrer">'+esc(s[0])+'</a><span class="meta">'+esc(s[1])+(s[2]?' · '+esc(s[2]):'')+'</span></li>';
  }).join("");

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
