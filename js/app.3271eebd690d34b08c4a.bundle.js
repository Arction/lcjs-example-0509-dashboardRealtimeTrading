(self.webpackChunk=self.webpackChunk||[]).push([[143],{138:(e,t,s)=>{const n=s(475),o=s(27),{lightningChart:a,emptyLine:i,UIElementBuilders:r,UIBackgrounds:l,emptyFill:c,SolidFill:d,SolidLine:u,ColorRGBA:m,AxisTickStrategies:g,AxisScrollStrategies:h,UILayoutBuilders:x,UIOrigins:S,TimeFormattingFunctions:T,UIDraggingModes:f,MouseStyles:p,Themes:y}=n,{createProgressiveTraceGenerator:b}=o,w=window.location.search,E="true"===new URLSearchParams(w).get("full"),I=E?10:3,P=E?10:3,M=6e4,k=a().Dashboard({numberOfColumns:I,numberOfRows:P+1}).setSplitterStyle(new u({thickness:0})),v=k.createUIPanel({columnIndex:0,rowIndex:0,columnSpan:I}),C=E?24:64,A=k.engine.container.getBoundingClientRect().height;k.setRowHeight(0,P*C/(A-C));const D=[];for(let e=0;e<I;e+=1)for(let t=0;t<P;t+=1){const s=k.createChartXY({columnIndex:e,rowIndex:t+1}).setTitleFillStyle(c).setTitleMargin({top:0,bottom:0}).setPadding(0).setMouseInteractions(!1).setAutoCursor((e=>e.setTickMarkerXVisible(!1).setTickMarkerYVisible(!1).setAutoFitStrategy(void 0)));s.getDefaultAxisX().setTickStrategy(g.Empty).setMouseInteractions(!1).setScrollStrategy(h.progressive).setInterval({start:-6e4,end:0,stopAxisAfter:!1}).setStrokeStyle(i).setAnimationScroll(!1),s.getDefaultAxisY().setTickStrategy(g.Empty).setMouseInteractions(!1).setStrokeStyle(i).setAnimationScroll(!1),D.push(s)}v.addUIElement(r.TextBox.setBackground(l.None)).setText(I*P+" live trading channels (1 ms resolution) 1 minute history").setMouseInteractions(!1).setPosition({x:50,y:100}).setOrigin(S.CenterTop),E||v.addUIElement(r.TextBox).setText("Click here to show full 10x10 dashboard").setPosition({x:50,y:100}).setOrigin(S.CenterTop).setMargin(30).setDraggingMode(f.notDraggable).setMouseStyle(p.Point).onMouseClick((()=>{let e=window.location.href;e+=(e.split("?")[1]?"&":"?")+"full=true",window.location.href=e}));const F=D.map((e=>{const t=e.addUIElement(x.Column,{x:e.uiScale,y:e.getDefaultAxisY()}).setOrigin(S.LeftTop).setPosition({x:0,y:e.getDefaultAxisY().getInterval().end}).setMouseInteractions(!1);e.getDefaultAxisY().onIntervalChange(((e,s,n)=>t.setPosition({x:0,y:n}))),t.addElement(r.TextBox).setText("< Stock name >").setTextFont((e=>e.setSize(8))).setMargin({bottom:-6});const s=t.addElement(x.Row).setMargin({bottom:-6}),n=t.addElement(x.Row);s.addElement(r.TextBox).setText("Last value:").setTextFont((e=>e.setSize(8)));const o=s.addElement(r.TextBox).setText("").setTextFont((e=>e.setSize(8)));return n.addElement(r.TextBox).setText("Change:").setTextFont((e=>e.setSize(8))),{labelLastValue:o,labelChange:n.addElement(r.TextBox).setText("").setTextFont((e=>e.setSize(8)))}})),L=D.map(((e,t)=>{const s=e.addLineSeries({dataPattern:{pattern:"ProgressiveX",regularProgressiveStep:!0},automaticColorIndex:t}).setName("< Stock name >").setStrokeStyle((e=>e.setThickness(1))).setDataCleaning({minDataPointCount:1e3}).setCursorResultTableFormatter(((e,t,n,o,a)=>e.addRow(s.getName()).addRow(T.hhmmssmmm(a.x-window.performance.now())).addRow("Value: ",s.axisY.formatValue(a.y))));return s}));Promise.all(new Array(10).fill(0).map((e=>b().setNumberOfPoints(M).generate().toPromise().then((e=>{const t=10+2e3*Math.random(),s=.03*t,n=e.reduce(((e,t)=>Math.min(e,t.y)),Number.MAX_SAFE_INTEGER),o=(e.reduce(((e,t)=>Math.max(e,t.y)),-Number.MAX_SAFE_INTEGER)-n)/2,a=n+o;return e.map((e=>t+(e.y-a)/o*s))})).then((e=>(e.push(...e.slice().reverse()),e)))))).then((e=>{const t=e[0].length,s=L.map((t=>({series:t,dataSet:e[Math.round(Math.random()*(e.length-1))]}))),n=[];s.forEach((e=>{const t=n.find((t=>t.dataSet===e.dataSet));t?t.seriesList.push(e.series):n.push({dataSet:e.dataSet,seriesList:[e.series],visibleDataPoints:[]})}));const o=n.length;let a=-3e4;const i=()=>{const e=window.performance.now(),s=n.map((e=>[]));for(let i=a+1;i<e;i+=1){let e=i%t;for(;e<0;)e+=t;for(let t=0;t<o;t+=1){const o=n[t].dataSet[e];s[t].push({x:i,y:o})}a=i}n.forEach(((e,t)=>{const n=s[t];e.seriesList.forEach((e=>{e.add(n)}));const o=e.seriesList[0].axisY.formatValue(n[n.length-1].y);n.length<1e5&&e.visibleDataPoints.push(...n),e.seriesList.forEach((e=>{F[D.indexOf(e.chart)].labelLastValue.setText(o)}))})),requestAnimationFrame(i)};i();const r=new d({color:m(0,255,0)}),l=new d({color:m(255,0,0)});setInterval((()=>{n.forEach(((e,t)=>{e.visibleDataPoints.length>M&&(e.visibleDataPoints=e.visibleDataPoints.slice(e.visibleDataPoints.length-M));const s=e.visibleDataPoints[0].y,n=e.visibleDataPoints[e.visibleDataPoints.length-1].y,o=n>s?`${(100*(n/s-1)).toFixed(1)}%`:`-${(100*(1-n/s)).toFixed(1)}%`;e.seriesList.forEach((e=>{F[D.indexOf(e.chart)].labelChange.setText(o).setTextFillStyle(n>s?r:l)}))}))}),2e3)}))}},e=>{e.O(0,[736],(()=>(138,e(e.s=138)))),e.O()}]);