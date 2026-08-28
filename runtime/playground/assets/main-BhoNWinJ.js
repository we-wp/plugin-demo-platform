import{ac as Tn,ad as $n,ap as Rn,aq as Fn,ar as In,_ as We,as as st,at as pt,au as Ge,av as On,aw as Nn,ax as Ln,ay as An,az as Dn,$ as Mn,a4 as Un,a2 as Bn,a3 as Wn,a1 as Vn,a0 as zn,G as Hn,H as Gn,aA as Jn,X as Kn,J as qn,aB as Yn,K as Zn,x as St,U as Xn,Q as mn,aa as Qn,V as er,W as tr,Z as nr,M as rr,O as ir,I as sr,Y as ar,u as or,k as Vt,aC as lr,t as H,a5 as cr,aD as ur,r as q,aE as dr,j as v,ae as fr,aF as hr,aG as mr,aH as dt,a6 as pr,a8 as Ht,l as gr,a9 as yr,al as br,a7 as wr,ao as At}from"./index-D-wLA71A.js";import"./preload-helper-CS1eXPs2.js";function vr(n,e){if(n==null)return{};var a={};for(var i in n)if({}.hasOwnProperty.call(n,i)){if(e.indexOf(i)!==-1)continue;a[i]=n[i]}return a}function xr(n){if(!(typeof document>"u")){if(document.readyState==="complete"||document.readyState==="interactive")return void n();document.addEventListener("DOMContentLoaded",n)}}function Gt(n="polite"){const e=document.createElement("div");e.id=`a11y-speak-${n}`,e.className="a11y-speak-region",e.setAttribute("style","position:absolute;margin:-1px;padding:0;height:1px;width:1px;overflow:hidden;clip-path:inset(50%);border:0;word-wrap:normal !important;word-break:normal !important;"),e.setAttribute("aria-live",n),e.setAttribute("aria-relevant","additions text"),e.setAttribute("aria-atomic","true");const{body:a}=document;return a&&a.appendChild(e),e}var Jt={"":{plural_forms(n){return n===1?0:1}}},kr=/^i18n\.(n?gettext|has_translation)(_|$)/,_r=(n,e,a)=>{const i=new Tn({}),f=new Set,g=()=>{f.forEach(E=>E())},L=E=>(f.add(E),()=>f.delete(E)),R=(E="default")=>i.data[E],N=(E,F="default")=>{i.data[F]={...i.data[F],...E},i.data[F][""]={...Jt[""],...i.data[F]?.[""]},delete i.pluralForms[F]},W=(E,F)=>{N(E,F),g()},Z=(E,F="default")=>{i.data[F]={...i.data[F],...E,"":{...Jt[""],...i.data[F]?.[""],...E?.[""]}},delete i.pluralForms[F],g()},ue=(E,F)=>{i.data={},i.pluralForms={},W(E,F)},ae=(E="default",F,ne,de,V)=>(i.data[E]||N(void 0,E),i.dcnpgettext(E,F,ne,de,V)),ie=E=>E||"default",T=(E,F)=>{let ne=ae(F,void 0,E);return a?(ne=a.applyFilters("i18n.gettext",ne,E,F),a.applyFilters("i18n.gettext_"+ie(F),ne,E,F)):ne},M=(E,F,ne)=>{let de=ae(ne,F,E);return a?(de=a.applyFilters("i18n.gettext_with_context",de,E,F,ne),a.applyFilters("i18n.gettext_with_context_"+ie(ne),de,E,F,ne)):de},X=(E,F,ne,de)=>{let V=ae(de,void 0,E,F,ne);return a?(V=a.applyFilters("i18n.ngettext",V,E,F,ne,de),a.applyFilters("i18n.ngettext_"+ie(de),V,E,F,ne,de)):V},ye=(E,F,ne,de,V)=>{let y=ae(V,de,E,F,ne);return a?(y=a.applyFilters("i18n.ngettext_with_context",y,E,F,ne,de,V),a.applyFilters("i18n.ngettext_with_context_"+ie(V),y,E,F,ne,de,V)):y},_e=()=>M("ltr","text direction")==="rtl",A=(E,F,ne)=>{const de=F?F+""+E:E;let V=!!i.data?.[ne??"default"]?.[de];return a&&(V=a.applyFilters("i18n.has_translation",V,E,F,ne),V=a.applyFilters("i18n.has_translation_"+ie(ne),V,E,F,ne)),V};if(a){const E=F=>{kr.test(F)&&g()};a.addAction("hookAdded","core/i18n",E),a.addAction("hookRemoved","core/i18n",E)}return{getLocaleData:R,setLocaleData:W,addLocaleData:Z,resetLocaleData:ue,subscribe:L,__:T,_x:M,_n:X,_nx:ye,isRTL:_e,hasTranslation:A}},ke=_r(void 0,void 0,$n);ke.getLocaleData.bind(ke);ke.setLocaleData.bind(ke);ke.resetLocaleData.bind(ke);ke.subscribe.bind(ke);var Er=ke.__.bind(ke);ke._x.bind(ke);ke._n.bind(ke);ke._nx.bind(ke);ke.isRTL.bind(ke);ke.hasTranslation.bind(ke);function Sr(){const n=document.createElement("p");n.id="a11y-speak-intro-text",n.className="a11y-speak-intro-text",n.textContent=Er("Notifications"),n.setAttribute("style","position:absolute;margin:-1px;padding:0;height:1px;width:1px;overflow:hidden;clip-path:inset(50%);border:0;word-wrap:normal !important;word-break:normal !important;"),n.setAttribute("hidden","");const{body:e}=document;return e&&e.appendChild(n),n}function jr(){const n=document.getElementsByClassName("a11y-speak-region"),e=document.getElementById("a11y-speak-intro-text");for(let a=0;a<n.length;a++)n[a].textContent="";e&&e.setAttribute("hidden","hidden")}var Kt="";function Pr(n){return n=n.replace(/<[^<>]+>/g," "),Kt===n&&(n+=" "),Kt=n,n}function qt(n,e){jr(),n=Pr(n);const a=document.getElementById("a11y-speak-intro-text");document.getElementById("a11y-speak-assertive");const i=document.getElementById("a11y-speak-polite");i&&(i.textContent=n),a&&a.removeAttribute("hidden")}function Cr(){const n=document.getElementById("a11y-speak-intro-text"),e=document.getElementById("a11y-speak-assertive"),a=document.getElementById("a11y-speak-polite");n===null&&Sr(),e===null&&Gt("assertive"),a===null&&Gt("polite")}xr(Cr);class Yt{constructor(e,a,i){this.from=e,this.to=a,this.diagnostic=i}}class et{constructor(e,a,i){this.diagnostics=e,this.panel=a,this.selected=i}static init(e,a,i){let f=i.facet(ht).markerFilter;f&&(e=f(e,i));let g=e.slice().sort((ie,T)=>ie.from-T.from||ie.to-T.to),L=new Ln,R=[],N=0,W=i.doc.iter(),Z=0,ue=i.doc.length;for(let ie=0;;){let T=ie==g.length?null:g[ie];if(!T&&!R.length)break;let M,X;if(R.length)M=N,X=R.reduce((A,E)=>Math.min(A,E.to),T&&T.from>M?T.from:1e8);else{if(M=T.from,M>ue)break;X=T.to,R.push(T),ie++}for(;ie<g.length;){let A=g[ie];if(A.from==M&&(A.to>A.from||A.to==M))R.push(A),ie++,X=Math.min(A.to,X);else{X=Math.min(A.from,X);break}}X=Math.min(X,ue);let ye=!1;if(R.some(A=>A.from==M&&(A.to==X||X==ue))&&(ye=M==X,!ye&&X-M<10)){let A=M-(Z+W.value.length);A>0&&(W.next(A),Z=M);for(let E=M;;){if(E>=X){ye=!0;break}if(!W.lineBreak&&Z+W.value.length>E)break;E=Z+W.value.length,Z+=W.value.length,W.next()}}let _e=Br(R);if(ye)L.add(M,M,st.widget({widget:new Ar(_e),diagnostics:R.slice()}));else{let A=R.reduce((E,F)=>F.markClass?E+" "+F.markClass:E,"");L.add(M,X,st.mark({class:"cm-lintRange cm-lintRange-"+_e+A,diagnostics:R.slice(),inclusiveEnd:R.some(E=>E.to>X)}))}if(N=X,N==ue)break;for(let A=0;A<R.length;A++)R[A].to<=N&&R.splice(A--,1)}let ae=L.finish();return new et(ae,a,Xe(ae))}}function Xe(n,e=null,a=0){let i=null;return n.between(a,1e9,(f,g,{spec:L})=>{if(!(e&&L.diagnostics.indexOf(e)<0))if(!i)i=new Yt(f,g,e||L.diagnostics[0]);else{if(L.diagnostics.indexOf(i.diagnostic)<0)return!1;i=new Yt(i.from,g,i.diagnostic)}}),i}function Tr(n,e){let a=e.pos,i=e.end||a,f=n.state.facet(ht).hideOn(n,a,i);if(f!=null)return f;let g=n.startState.doc.lineAt(e.pos);return!!(n.effects.some(L=>L.is(pn))||n.changes.touchesRange(g.from,Math.max(g.to,i)))}function $r(n,e){return n.field($e,!1)?e:e.concat(pt.appendConfig.of(Wr))}const pn=pt.define(),zt=pt.define(),gn=pt.define(),$e=Fn.define({create(){return new et(st.none,null,null)},update(n,e){if(e.docChanged&&n.diagnostics.size){let a=n.diagnostics.map(e.changes),i=null,f=n.panel;if(n.selected){let g=e.changes.mapPos(n.selected.from,1);i=Xe(a,n.selected.diagnostic,g)||Xe(a,null,g)}!a.size&&f&&e.state.facet(ht).autoPanel&&(f=null),n=new et(a,f,i)}for(let a of e.effects)if(a.is(pn)){let i=e.state.facet(ht).autoPanel?a.value.length?mt.open:null:n.panel;n=et.init(a.value,i,e.state)}else a.is(zt)?n=new et(n.diagnostics,a.value?mt.open:null,n.selected):a.is(gn)&&(n=new et(n.diagnostics,n.panel,a.value));return n},provide:n=>[In.from(n,e=>e.panel),We.decorations.from(n,e=>e.diagnostics)]}),Rr=st.mark({class:"cm-lintRange cm-lintRange-active"});function Fr(n,e,a){let{diagnostics:i}=n.state.field($e),f,g=-1,L=-1;i.between(e-(a<0?1:0),e+(a>0?1:0),(N,W,{spec:Z})=>{if(e>=N&&e<=W&&(N==W||(e>N||a>0)&&(e<W||a<0)))return f=Z.diagnostics,g=N,L=W,!1});let R=n.state.facet(ht).tooltipFilter;return f&&R&&(f=R(f,n.state)),f?{pos:g,end:L,above:n.state.doc.lineAt(g).to<L,create(){return{dom:Ir(n,f)}}}:null}function Ir(n,e){return Ge("ul",{class:"cm-tooltip-lint"},e.map(a=>bn(n,a,!1)))}const Or=n=>{let e=n.state.field($e,!1);(!e||!e.panel)&&n.dispatch({effects:$r(n.state,[zt.of(!0)])});let a=Rn(n,mt.open);return a&&a.dom.querySelector(".cm-panel-lint ul").focus(),!0},Zt=n=>{let e=n.state.field($e,!1);return!e||!e.panel?!1:(n.dispatch({effects:zt.of(!1)}),!0)},Nr=n=>{let e=n.state.field($e,!1);if(!e)return!1;let a=n.state.selection.main,i=Xe(e.diagnostics,null,a.to+1);return!i&&(i=Xe(e.diagnostics,null,0),!i||i.from==a.from&&i.to==a.to)?!1:(n.dispatch({selection:{anchor:i.from,head:i.to},scrollIntoView:!0}),!0)},Lr=[{key:"Mod-Shift-m",run:Or,preventDefault:!0},{key:"F8",run:Nr}],ht=On.define({combine(n){return{sources:n.map(e=>e.source).filter(e=>e!=null),...Nn(n.map(e=>e.config),{delay:750,markerFilter:null,tooltipFilter:null,needsRefresh:null,hideOn:()=>null},{delay:Math.max,markerFilter:Xt,tooltipFilter:Xt,needsRefresh:(e,a)=>e?a?i=>e(i)||a(i):e:a,hideOn:(e,a)=>e?a?(i,f,g)=>e(i,f,g)||a(i,f,g):e:a,autoPanel:(e,a)=>e||a})}}});function Xt(n,e){return n?e?(a,i)=>e(n(a,i),i):n:e}function yn(n){let e=[];if(n)e:for(let{name:a}of n){for(let i=0;i<a.length;i++){let f=a[i];if(/[a-zA-Z]/.test(f)&&!e.some(g=>g.toLowerCase()==f.toLowerCase())){e.push(f);continue e}}e.push("")}return e}function bn(n,e,a){var i;let f=a?yn(e.actions):[];return Ge("li",{class:"cm-diagnostic cm-diagnostic-"+e.severity},Ge("span",{class:"cm-diagnosticText"},e.renderMessage?e.renderMessage(n):e.message),(i=e.actions)===null||i===void 0?void 0:i.map((g,L)=>{let R=!1,N=ie=>{if(ie.preventDefault(),R)return;R=!0;let T=Xe(n.state.field($e).diagnostics,e);T&&g.apply(n,T.from,T.to)},{name:W}=g,Z=f[L]?W.indexOf(f[L]):-1,ue=Z<0?W:[W.slice(0,Z),Ge("u",W.slice(Z,Z+1)),W.slice(Z+1)],ae=g.markClass?" "+g.markClass:"";return Ge("button",{type:"button",class:"cm-diagnosticAction"+ae,onclick:N,onmousedown:N,"aria-label":` Action: ${W}${Z<0?"":` (access key "${f[L]})"`}.`},ue)}),e.source&&Ge("div",{class:"cm-diagnosticSource"},e.source))}class Ar extends Dn{constructor(e){super(),this.sev=e}eq(e){return e.sev==this.sev}toDOM(){return Ge("span",{class:"cm-lintPoint cm-lintPoint-"+this.sev})}}class Qt{constructor(e,a){this.diagnostic=a,this.id="item_"+Math.floor(Math.random()*4294967295).toString(16),this.dom=bn(e,a,!0),this.dom.id=this.id,this.dom.setAttribute("role","option")}}class mt{constructor(e){this.view=e,this.items=[];let a=f=>{if(!(f.ctrlKey||f.altKey||f.metaKey)){if(f.keyCode==27)Zt(this.view),this.view.focus();else if(f.keyCode==38||f.keyCode==33)this.moveSelection((this.selectedIndex-1+this.items.length)%this.items.length);else if(f.keyCode==40||f.keyCode==34)this.moveSelection((this.selectedIndex+1)%this.items.length);else if(f.keyCode==36)this.moveSelection(0);else if(f.keyCode==35)this.moveSelection(this.items.length-1);else if(f.keyCode==13)this.view.focus();else if(f.keyCode>=65&&f.keyCode<=90&&this.selectedIndex>=0){let{diagnostic:g}=this.items[this.selectedIndex],L=yn(g.actions);for(let R=0;R<L.length;R++)if(L[R].toUpperCase().charCodeAt(0)==f.keyCode){let N=Xe(this.view.state.field($e).diagnostics,g);N&&g.actions[R].apply(e,N.from,N.to)}}else return;f.preventDefault()}},i=f=>{for(let g=0;g<this.items.length;g++)this.items[g].dom.contains(f.target)&&this.moveSelection(g)};this.list=Ge("ul",{tabIndex:0,role:"listbox","aria-label":this.view.state.phrase("Diagnostics"),onkeydown:a,onclick:i}),this.dom=Ge("div",{class:"cm-panel-lint"},this.list,Ge("button",{type:"button",name:"close","aria-label":this.view.state.phrase("close"),onclick:()=>Zt(this.view)},"×")),this.update()}get selectedIndex(){let e=this.view.state.field($e).selected;if(!e)return-1;for(let a=0;a<this.items.length;a++)if(this.items[a].diagnostic==e.diagnostic)return a;return-1}update(){let{diagnostics:e,selected:a}=this.view.state.field($e),i=0,f=!1,g=null,L=new Set;for(e.between(0,this.view.state.doc.length,(R,N,{spec:W})=>{for(let Z of W.diagnostics){if(L.has(Z))continue;L.add(Z);let ue=-1,ae;for(let ie=i;ie<this.items.length;ie++)if(this.items[ie].diagnostic==Z){ue=ie;break}ue<0?(ae=new Qt(this.view,Z),this.items.splice(i,0,ae),f=!0):(ae=this.items[ue],ue>i&&(this.items.splice(i,ue-i),f=!0)),a&&ae.diagnostic==a.diagnostic?ae.dom.hasAttribute("aria-selected")||(ae.dom.setAttribute("aria-selected","true"),g=ae):ae.dom.hasAttribute("aria-selected")&&ae.dom.removeAttribute("aria-selected"),i++}});i<this.items.length&&!(this.items.length==1&&this.items[0].diagnostic.from<0);)f=!0,this.items.pop();this.items.length==0&&(this.items.push(new Qt(this.view,{from:-1,to:-1,severity:"info",message:this.view.state.phrase("No diagnostics")})),f=!0),g?(this.list.setAttribute("aria-activedescendant",g.id),this.view.requestMeasure({key:this,read:()=>({sel:g.dom.getBoundingClientRect(),panel:this.list.getBoundingClientRect()}),write:({sel:R,panel:N})=>{let W=N.height/this.list.offsetHeight;R.top<N.top?this.list.scrollTop-=(N.top-R.top)/W:R.bottom>N.bottom&&(this.list.scrollTop+=(R.bottom-N.bottom)/W)}})):this.selectedIndex<0&&this.list.removeAttribute("aria-activedescendant"),f&&this.sync()}sync(){let e=this.list.firstChild;function a(){let i=e;e=i.nextSibling,i.remove()}for(let i of this.items)if(i.dom.parentNode==this.list){for(;e!=i.dom;)a();e=i.dom.nextSibling}else this.list.insertBefore(i.dom,e);for(;e;)a()}moveSelection(e){if(this.selectedIndex<0)return;let a=this.view.state.field($e),i=Xe(a.diagnostics,this.items[e].diagnostic);i&&this.view.dispatch({selection:{anchor:i.from,head:i.to},scrollIntoView:!0,effects:gn.of(i)})}static open(e){return new mt(e)}}function Dr(n,e='viewBox="0 0 40 40"'){return`url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${e}>${encodeURIComponent(n)}</svg>')`}function kt(n){return Dr(`<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${n}" fill="none" stroke-width=".7"/>`,'width="6" height="3"')}const Mr=We.baseTheme({".cm-diagnostic":{padding:"3px 6px 3px 8px",marginLeft:"-1px",display:"block",whiteSpace:"pre-wrap"},".cm-diagnostic-error":{borderLeft:"5px solid #d11"},".cm-diagnostic-warning":{borderLeft:"5px solid orange"},".cm-diagnostic-info":{borderLeft:"5px solid #999"},".cm-diagnostic-hint":{borderLeft:"5px solid #66d"},".cm-diagnosticAction":{font:"inherit",border:"none",padding:"2px 4px",backgroundColor:"#444",color:"white",borderRadius:"3px",marginLeft:"8px",cursor:"pointer"},".cm-diagnosticSource":{fontSize:"70%",opacity:.7},".cm-lintRange":{backgroundPosition:"left bottom",backgroundRepeat:"repeat-x",paddingBottom:"0.7px"},".cm-lintRange-error":{backgroundImage:kt("#d11")},".cm-lintRange-warning":{backgroundImage:kt("orange")},".cm-lintRange-info":{backgroundImage:kt("#999")},".cm-lintRange-hint":{backgroundImage:kt("#66d")},".cm-lintRange-active":{backgroundColor:"#ffdd9980"},".cm-tooltip-lint":{padding:0,margin:0},".cm-lintPoint":{position:"relative","&:after":{content:'""',position:"absolute",bottom:0,left:"-2px",borderLeft:"3px solid transparent",borderRight:"3px solid transparent",borderBottom:"4px solid #d11"}},".cm-lintPoint-warning":{"&:after":{borderBottomColor:"orange"}},".cm-lintPoint-info":{"&:after":{borderBottomColor:"#999"}},".cm-lintPoint-hint":{"&:after":{borderBottomColor:"#66d"}},".cm-panel.cm-panel-lint":{position:"relative","& ul":{maxHeight:"100px",overflowY:"auto","& [aria-selected]":{backgroundColor:"#ddd","& u":{textDecoration:"underline"}},"&:focus [aria-selected]":{background_fallback:"#bdf",backgroundColor:"Highlight",color_fallback:"white",color:"HighlightText"},"& u":{textDecoration:"none"},padding:0,margin:0},"& [name=close]":{position:"absolute",top:"0",right:"2px",background:"inherit",border:"none",font:"inherit",padding:0,margin:0}},"&dark .cm-lintRange-active":{backgroundColor:"#86714a80"},"&dark .cm-panel.cm-panel-lint ul":{"& [aria-selected]":{backgroundColor:"#2e343e"}}});function Ur(n){return n=="error"?4:n=="warning"?3:n=="info"?2:1}function Br(n){let e="hint",a=1;for(let i of n){let f=Ur(i.severity);f>a&&(a=f,e=i.severity)}return e}const Wr=[$e,We.decorations.compute([$e],n=>{let{selected:e,panel:a}=n.field($e);return!e||!a||e.from==e.to?st.none:st.set([Rr.range(e.from,e.to)])}),An(Fr,{hideOn:Tr}),Mr];var en=function(e){e===void 0&&(e={});var{crosshairCursor:a=!1}=e,i=[];e.closeBracketsKeymap!==!1&&(i=i.concat(Mn)),e.defaultKeymap!==!1&&(i=i.concat(Un)),e.searchKeymap!==!1&&(i=i.concat(Bn)),e.historyKeymap!==!1&&(i=i.concat(Wn)),e.foldKeymap!==!1&&(i=i.concat(Vn)),e.completionKeymap!==!1&&(i=i.concat(zn)),e.lintKeymap!==!1&&(i=i.concat(Lr));var f=[];return e.lineNumbers!==!1&&f.push(Hn()),e.highlightActiveLineGutter!==!1&&f.push(Gn()),e.highlightSpecialChars!==!1&&f.push(Jn()),e.history!==!1&&f.push(Kn()),e.foldGutter!==!1&&f.push(qn()),e.drawSelection!==!1&&f.push(Yn()),e.dropCursor!==!1&&f.push(Zn()),e.allowMultipleSelections!==!1&&f.push(St.allowMultipleSelections.of(!0)),e.indentOnInput!==!1&&f.push(Xn()),e.syntaxHighlighting!==!1&&f.push(mn(Qn,{fallback:!0})),e.bracketMatching!==!1&&f.push(er()),e.closeBrackets!==!1&&f.push(tr()),e.autocompletion!==!1&&f.push(nr()),e.rectangularSelection!==!1&&f.push(rr()),a!==!1&&f.push(ir()),e.highlightActiveLine!==!1&&f.push(sr()),e.highlightSelectionMatches!==!1&&f.push(ar()),e.tabSize&&typeof e.tabSize=="number"&&f.push(or.of(" ".repeat(e.tabSize))),f.concat([Vt.of(i.flat())]).filter(Boolean)};const Vr="#e5c07b",tn="#e06c75",zr="#56b6c2",Hr="#ffffff",_t="#abb2bf",Bt="#7d8799",Gr="#61afef",Jr="#98c379",nn="#d19a66",Kr="#c678dd",qr="#21252b",rn="#2c313a",sn="#282c34",Dt="#353a42",Yr="#3E4451",an="#528bff",Zr=We.theme({"&":{color:_t,backgroundColor:sn},".cm-content":{caretColor:an},".cm-cursor, .cm-dropCursor":{borderLeftColor:an},"&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":{backgroundColor:Yr},".cm-panels":{backgroundColor:qr,color:_t},".cm-panels.cm-panels-top":{borderBottom:"2px solid black"},".cm-panels.cm-panels-bottom":{borderTop:"2px solid black"},".cm-searchMatch":{backgroundColor:"#72a1ff59",outline:"1px solid #457dff"},".cm-searchMatch.cm-searchMatch-selected":{backgroundColor:"#6199ff2f"},".cm-activeLine":{backgroundColor:"#6699ff0b"},".cm-selectionMatch":{backgroundColor:"#aafe661a"},"&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket":{backgroundColor:"#bad0f847"},".cm-gutters":{backgroundColor:sn,color:Bt,border:"none"},".cm-activeLineGutter":{backgroundColor:rn},".cm-foldPlaceholder":{backgroundColor:"transparent",border:"none",color:"#ddd"},".cm-tooltip":{border:"none",backgroundColor:Dt},".cm-tooltip .cm-tooltip-arrow:before":{borderTopColor:"transparent",borderBottomColor:"transparent"},".cm-tooltip .cm-tooltip-arrow:after":{borderTopColor:Dt,borderBottomColor:Dt},".cm-tooltip-autocomplete":{"& > ul > li[aria-selected]":{backgroundColor:rn,color:_t}}},{dark:!0}),Xr=lr.define([{tag:H.keyword,color:Kr},{tag:[H.name,H.deleted,H.character,H.propertyName,H.macroName],color:tn},{tag:[H.function(H.variableName),H.labelName],color:Gr},{tag:[H.color,H.constant(H.name),H.standard(H.name)],color:nn},{tag:[H.definition(H.name),H.separator],color:_t},{tag:[H.typeName,H.className,H.number,H.changed,H.annotation,H.modifier,H.self,H.namespace],color:Vr},{tag:[H.operator,H.operatorKeyword,H.url,H.escape,H.regexp,H.link,H.special(H.string)],color:zr},{tag:[H.meta,H.comment],color:Bt},{tag:H.strong,fontWeight:"bold"},{tag:H.emphasis,fontStyle:"italic"},{tag:H.strikethrough,textDecoration:"line-through"},{tag:H.link,color:Bt,textDecoration:"underline"},{tag:H.heading,fontWeight:"bold",color:tn},{tag:[H.atom,H.bool,H.special(H.variableName)],color:nn},{tag:[H.processingInstruction,H.string,H.inserted],color:Jr},{tag:H.invalid,color:Hr}]),Qr=[Zr,mn(Xr)];var ei=We.theme({"&":{backgroundColor:"#fff"}},{dark:!1}),ti=function(e){e===void 0&&(e={});var{indentWithTab:a=!0,editable:i=!0,readOnly:f=!1,theme:g="light",placeholder:L="",basicSetup:R=!0}=e,N=[];switch(a&&N.unshift(Vt.of([cr])),R&&(typeof R=="boolean"?N.unshift(en()):N.unshift(en(R))),L&&N.unshift(ur(L)),g){case"light":N.push(ei);break;case"dark":N.push(Qr);break;case"none":break;default:N.push(g);break}return i===!1&&N.push(We.editable.of(!1)),f&&N.push(St.readOnly.of(!0)),[...N]},ni=n=>({line:n.state.doc.lineAt(n.state.selection.main.from),lineCount:n.state.doc.lines,lineBreak:n.state.lineBreak,length:n.state.doc.length,readOnly:n.state.readOnly,tabSize:n.state.tabSize,selection:n.state.selection,selectionAsSingle:n.state.selection.asSingle().main,ranges:n.state.selection.ranges,selectionCode:n.state.sliceDoc(n.state.selection.main.from,n.state.selection.main.to),selections:n.state.selection.ranges.map(e=>n.state.sliceDoc(e.from,e.to)),selectedText:n.state.selection.ranges.some(e=>!e.empty)}),on=dr.define(),ri=[];function ii(n){var{value:e,selection:a,onChange:i,onStatistics:f,onCreateEditor:g,onUpdate:L,extensions:R=ri,autoFocus:N,theme:W="light",height:Z=null,minHeight:ue=null,maxHeight:ae=null,width:ie=null,minWidth:T=null,maxWidth:M=null,placeholder:X="",editable:ye=!0,readOnly:_e=!1,indentWithTab:A=!0,basicSetup:E=!0,root:F,initialState:ne}=n,[de,V]=q.useState(),[y,Pe]=q.useState(),[Ce,Re]=q.useState(),pe=We.theme({"&":{height:Z,minHeight:ue,maxHeight:ae,width:ie,minWidth:T,maxWidth:M},"& .cm-scroller":{height:"100% !important"}}),xe=We.updateListener.of(je=>{if(je.docChanged&&typeof i=="function"&&!je.transactions.some(tt=>tt.annotation(on))){var Me=je.state.doc,Ve=Me.toString();i(Ve,je)}f&&f(ni(je))}),Je=ti({theme:W,editable:ye,readOnly:_e,placeholder:X,indentWithTab:A,basicSetup:E}),De=[xe,pe,...Je];return L&&typeof L=="function"&&De.push(We.updateListener.of(L)),De=De.concat(R),q.useEffect(()=>{if(de&&!Ce){var je={doc:e,selection:a,extensions:De},Me=ne?St.fromJSON(ne.json,je,ne.fields):St.create(je);if(Re(Me),!y){var Ve=new We({state:Me,parent:de,root:F});Pe(Ve),g&&g(Ve,Me)}}return()=>{y&&(Re(void 0),Pe(void 0))}},[de,Ce]),q.useEffect(()=>V(n.container),[n.container]),q.useEffect(()=>()=>{y&&(y.destroy(),Pe(void 0))},[y]),q.useEffect(()=>{N&&y&&y.focus()},[N,y]),q.useEffect(()=>{y&&y.dispatch({effects:pt.reconfigure.of(De)})},[W,R,Z,ue,ae,ie,T,M,X,ye,_e,A,E,i,L]),q.useEffect(()=>{if(e!==void 0){var je=y?y.state.doc.toString():"";y&&e!==je&&y.dispatch({changes:{from:0,to:je.length,insert:e||""},annotations:[on.of(!0)]})}},[e,y]),{state:Ce,setState:Re,view:y,setView:Pe,container:de,setContainer:V}}var si=["className","value","selection","extensions","onChange","onStatistics","onCreateEditor","onUpdate","autoFocus","theme","height","minHeight","maxHeight","width","minWidth","maxWidth","basicSetup","placeholder","indentWithTab","editable","readOnly","root","initialState"],wn=q.forwardRef((n,e)=>{var{className:a,value:i="",selection:f,extensions:g=[],onChange:L,onStatistics:R,onCreateEditor:N,onUpdate:W,autoFocus:Z,theme:ue="light",height:ae,minHeight:ie,maxHeight:T,width:M,minWidth:X,maxWidth:ye,basicSetup:_e,placeholder:A,indentWithTab:E,editable:F,readOnly:ne,root:de,initialState:V}=n,y=vr(n,si),Pe=q.useRef(null),{state:Ce,view:Re,container:pe}=ii({container:Pe.current,root:de,value:i,autoFocus:Z,theme:ue,height:ae,minHeight:ie,maxHeight:T,width:M,minWidth:X,maxWidth:ye,basicSetup:_e,placeholder:A,indentWithTab:E,editable:F,readOnly:ne,selection:f,onChange:L,onStatistics:R,onCreateEditor:N,onUpdate:W,extensions:g,initialState:V});if(q.useImperativeHandle(e,()=>({editor:Pe.current,state:Ce,view:Re}),[Pe,pe,Ce,Re]),typeof i!="string")throw new Error("value must be typeof string but got "+typeof i);var xe=typeof ue=="string"?"cm-theme-"+ue:"cm-theme";return v.jsx("div",fr({ref:Pe,className:""+xe+(a?" "+a:"")},y))});wn.displayName="CodeMirror";function ai(n,e){return n}function ft(n,...e){let a=0;return n.replace(/%[sd]/g,()=>String(e[a++]??""))}const vn="PHP error_log";function Ze(n){return n.name===vn}function oi(n,{withErrorLog:e=!1,getErrors:a}){const[i,f]=q.useState(n||[]),[g,L]=q.useState(0),R=i[g],N=q.useCallback((T,M=g)=>{f(i.map((X,ye)=>ye===M?T(X):X))},[g,i,f]),W=q.useCallback((T=g)=>{f(i.filter((M,X)=>X!==T))},[g,i]),Z=q.useCallback((T,M=i.length)=>{f([...i.slice(0,M),T,...i.slice(M)])},[i,f]);async function ue(T){try{const X=await(await fetch(T.remoteUrl)).text();N(ye=>({...ye,contents:X}),i.indexOf(T))}catch{N(M=>({...M,contents:ft("Failed to fetch the remote file from %s",T.remoteUrl),name:ft("%s (Failed to fetch)",M.name)}),i.indexOf(T))}}const[ae,ie]=q.useState(i.filter(T=>T.remoteUrl).length>0);return q.useEffect(()=>{async function T(){try{await Promise.all(i.filter(M=>M.remoteUrl).map(ue))}finally{ie(!1)}}T()},[]),q.useEffect(()=>{async function T(){const M=i.findIndex(Ze);e?M===-1&&Z({name:vn,contents:await a?.()||""},1):M!==-1&&W(M)}T()},[e]),q.useEffect(()=>{if(!e)return;const T=setInterval(async function(){const M=i.findIndex(Ze);if(M===-1)return;const X=await a?.()||"";X!==i[M].contents&&N(ye=>({...ye,contents:X}),M)},1e3);return()=>clearInterval(T)},[e,i,a,N]),{files:i,addFile:Z,isLoading:ae,updateFile:N,removeFile:W,activeFile:R,activeFileIndex:g,setActiveFileIndex:L}}async function li(n,e){const i=`${await n.documentRoot}/wp-content/plugins/demo-plugin`;await n.fileExists(i)&&await n.rmdir(i,{recursive:!0}),await n.mkdir(i);for(const g of e){const L=`${i}/${g.name}`,R=L.substring(0,L.lastIndexOf("/"));R!==i&&await n.mkdir(R),await n.writeFile(L,g.contents)}try{await hr(n,{pluginPath:i})}catch(g){console.error("Failed to activate plugin:",g)}}async function ci(n,e){const a=await n.documentRoot,i="demo-theme",f=a+"/wp-content/themes/"+i;await n.fileExists(f)&&await n.rmdir(f,{recursive:!0}),await n.mkdir(f);for(const L of e){const R=`${f}/${L.name}`,N=R.substring(0,R.lastIndexOf("/"));N!==f&&await n.mkdir(N),await n.writeFile(R,L.contents)}try{await mr(n,{themeFolderName:i})}catch(L){console.error("Failed to activate theme:",L)}}async function ui(n,e){const a=await n.documentRoot,i=e==="theme",f=i?`${a}/wp-content/themes/demo-theme`:`${a}/wp-content/plugins/demo-plugin`,g=i?"demo-theme.zip":"demo-plugin.zip",L=await di(n,f),R=new Blob([L],{type:"application/zip"});fi(R,g)}async function di(n,e){const a="/tmp/package.zip";try{await n.unlink(a)}catch{}return await n.run({code:`<?php
			$zip = new ZipArchive();
			$zip->open('${a}', ZipArchive::CREATE | ZipArchive::OVERWRITE);

			$path = '${e}';
			$iterator = new RecursiveIteratorIterator(
				new RecursiveDirectoryIterator($path, RecursiveDirectoryIterator::SKIP_DOTS),
				RecursiveIteratorIterator::SELF_FIRST
			);

			foreach ($iterator as $file) {
				$filePath = $file->getRealPath();
				$relativePath = substr($filePath, strlen($path) + 1);

				if ($file->isDir()) {
					$zip->addEmptyDir($relativePath);
				} else {
					$zip->addFile($filePath, $relativePath);
				}
			}

			$zip->close();
		`}),await n.readFileAsBuffer(a)}function fi(n,e){const a=URL.createObjectURL(n),i=document.createElement("a");i.href=a,i.download=e,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(a)}function ln({isOpen:n,onClose:e,onSubmit:a,initialName:i="",initialRemoteUrl:f="",title:g,submitLabel:L,isLoading:R=!1,error:N=null}){const[W,Z]=q.useState(i),[ue,ae]=q.useState(f);if(!n)return null;const ie=T=>{T.preventDefault(),a(W,ue||void 0)};return v.jsx("div",{className:"playground-modal-overlay",onClick:e,children:v.jsxs("div",{className:"playground-modal",onClick:T=>T.stopPropagation(),role:"dialog","aria-modal":"true","aria-labelledby":"modal-title",children:[v.jsx("h2",{id:"modal-title",children:g}),v.jsxs("form",{onSubmit:ie,children:[v.jsxs("div",{className:"playground-modal-field",children:[v.jsx("label",{htmlFor:"file-name",children:"File name"}),v.jsx("input",{id:"file-name",type:"text",value:W,onChange:T=>Z(T.target.value),placeholder:"example.php",autoFocus:!0,disabled:R})]}),v.jsxs("div",{className:"playground-modal-field",children:[v.jsx("label",{htmlFor:"remote-url",children:"Remote URL (optional)"}),v.jsx("input",{id:"remote-url",type:"url",value:ue,onChange:T=>ae(T.target.value),placeholder:"https://example.com/file.php",disabled:R}),v.jsx("p",{className:"playground-modal-help",children:"If provided, the file contents will be fetched from this URL."})]}),N&&v.jsx("p",{className:"playground-modal-error",children:N}),v.jsxs("div",{className:"playground-modal-actions",children:[v.jsx("button",{type:"button",onClick:e,disabled:R,className:"playground-button playground-button-secondary",children:"Cancel"}),v.jsx("button",{type:"submit",disabled:!W||R,className:"playground-button playground-button-primary",children:R?"Loading...":L})]})]})]})})}const hi=q.forwardRef(function({updateFile:e,addFile:a,setActiveFileIndex:i,files:f,activeFileIndex:g},L){const[R,N]=q.useState(!1),[W,Z]=q.useState(!1),[ue,ae]=q.useState(!1),[ie,T]=q.useState(null);q.useImperativeHandle(L,()=>({setEditFileNameModalOpen:A=>{T(null),N(A)},setNewFileModalOpen:A=>{T(null),Z(A)}}));async function M(A){if(!A)return"";const E=await fetch(A,{credentials:"omit"});if(!E.ok)throw new Error(`Failed to fetch: ${E.statusText}`);return await E.text()}async function X(A,E){ae(!0),T(null);try{const F=await M(E);e(ne=>({...ne,name:A,remoteUrl:E,contents:E?F:ne.contents})),N(!1)}catch(F){T(F instanceof Error?F.message:"Failed to fetch file")}finally{ae(!1)}}async function ye(A,E){ae(!0),T(null);try{const F=await M(E);a({name:A,contents:F,remoteUrl:E}),i(f.length),Z(!1)}catch(F){T(F instanceof Error?F.message:"Failed to fetch file")}finally{ae(!1)}}const _e=f[g];return v.jsxs(v.Fragment,{children:[v.jsx(ln,{isOpen:R,onClose:()=>N(!1),onSubmit:X,initialName:_e?.name||"",initialRemoteUrl:_e?.remoteUrl||"",title:"Edit File Name",submitLabel:"Save",isLoading:ue,error:ie}),v.jsx(ln,{isOpen:W,onClose:()=>Z(!1),onSubmit:ye,title:"New File",submitLabel:"Create",isLoading:ue,error:ie})]})});var xn={exports:{}};(function(n){(e=>{var a=Object.defineProperty,i=Object.getOwnPropertyDescriptor,f=Object.getOwnPropertyNames,g=Object.prototype.hasOwnProperty,L=(r,s)=>{for(var o in s)a(r,o,{get:s[o],enumerable:!0})},R=(r,s,o,p)=>{if(s&&typeof s=="object"||typeof s=="function")for(let x of f(s))!g.call(r,x)&&x!==o&&a(r,x,{get:()=>s[x],enumerable:!(p=i(s,x))||p.enumerable});return r},N=r=>R(a({},"__esModule",{value:!0}),r),W=(r,s,o)=>new Promise((p,x)=>{var P=m=>{try{I(o.next(m))}catch(D){x(D)}},b=m=>{try{I(o.throw(m))}catch(D){x(D)}},I=m=>m.done?p(m.value):Promise.resolve(m.value).then(P,b);I((o=o.apply(r,s)).next())}),Z={};L(Z,{analyzeMetafile:()=>he,analyzeMetafileSync:()=>Nt,build:()=>Ft,buildSync:()=>Oe,context:()=>It,default:()=>Sn,formatMessages:()=>oe,formatMessagesSync:()=>Be,initialize:()=>_n,stop:()=>Lt,transform:()=>Ot,transformSync:()=>Ne,version:()=>Rt}),e.exports=N(Z);function ue(r){let s=p=>{if(p===null)o.write8(0);else if(typeof p=="boolean")o.write8(1),o.write8(+p);else if(typeof p=="number")o.write8(2),o.write32(p|0);else if(typeof p=="string")o.write8(3),o.write(T(p));else if(p instanceof Uint8Array)o.write8(4),o.write(p);else if(p instanceof Array){o.write8(5),o.write32(p.length);for(let x of p)s(x)}else{let x=Object.keys(p);o.write8(6),o.write32(x.length);for(let P of x)o.write(T(P)),s(p[P])}},o=new ie;return o.write32(0),o.write32(r.id<<1|+!r.isRequest),s(r.value),_e(o.buf,o.len-4,0),o.buf.subarray(0,o.len)}function ae(r){let s=()=>{switch(o.read8()){case 0:return null;case 1:return!!o.read8();case 2:return o.read32();case 3:return M(o.read());case 4:return o.read();case 5:{let b=o.read32(),I=[];for(let m=0;m<b;m++)I.push(s());return I}case 6:{let b=o.read32(),I={};for(let m=0;m<b;m++)I[M(o.read())]=s();return I}default:throw new Error("Invalid packet")}},o=new ie(r),p=o.read32(),x=(p&1)===0;p>>>=1;let P=s();if(o.ptr!==r.length)throw new Error("Invalid packet");return{id:p,isRequest:x,value:P}}var ie=class{constructor(r=new Uint8Array(1024)){this.buf=r,this.len=0,this.ptr=0}_write(r){if(this.len+r>this.buf.length){let s=new Uint8Array((this.len+r)*2);s.set(this.buf),this.buf=s}return this.len+=r,this.len-r}write8(r){let s=this._write(1);this.buf[s]=r}write32(r){let s=this._write(4);_e(this.buf,r,s)}write(r){let s=this._write(4+r.length);_e(this.buf,r.length,s),this.buf.set(r,s+4)}_read(r){if(this.ptr+r>this.buf.length)throw new Error("Invalid packet");return this.ptr+=r,this.ptr-r}read8(){return this.buf[this._read(1)]}read32(){return ye(this.buf,this._read(4))}read(){let r=this.read32(),s=new Uint8Array(r),o=this._read(s.length);return s.set(this.buf.subarray(o,o+r)),s}},T,M,X;if(typeof TextEncoder<"u"&&typeof TextDecoder<"u"){let r=new TextEncoder,s=new TextDecoder;T=o=>r.encode(o),M=o=>s.decode(o),X='new TextEncoder().encode("")'}else if(typeof Buffer<"u")T=r=>Buffer.from(r),M=r=>{let{buffer:s,byteOffset:o,byteLength:p}=r;return Buffer.from(s,o,p).toString()},X='Buffer.from("")';else throw new Error("No UTF-8 codec found");if(!(T("")instanceof Uint8Array))throw new Error(`Invariant violation: "${X} instanceof Uint8Array" is incorrectly false

This indicates that your JavaScript environment is broken. You cannot use
esbuild in this environment because esbuild relies on this invariant. This
is not a problem with esbuild. You need to fix your environment instead.
`);function ye(r,s){return r[s++]|r[s++]<<8|r[s++]<<16|r[s++]<<24}function _e(r,s,o){r[o++]=s,r[o++]=s>>8,r[o++]=s>>16,r[o++]=s>>24}var A=JSON.stringify,E="warning",F="silent";function ne(r){if(ve(r,"target"),r.indexOf(",")>=0)throw new Error(`Invalid target: ${r}`);return r}var de=()=>null,V=r=>typeof r=="boolean"?null:"a boolean",y=r=>typeof r=="string"?null:"a string",Pe=r=>r instanceof RegExp?null:"a RegExp object",Ce=r=>typeof r=="number"&&r===(r|0)?null:"an integer",Re=r=>typeof r=="function"?null:"a function",pe=r=>Array.isArray(r)?null:"an array",xe=r=>typeof r=="object"&&r!==null&&!Array.isArray(r)?null:"an object",Je=r=>typeof r=="object"&&r!==null?null:"an array or an object",De=r=>r instanceof WebAssembly.Module?null:"a WebAssembly.Module",je=r=>typeof r=="object"&&!Array.isArray(r)?null:"an object or null",Me=r=>typeof r=="string"||typeof r=="boolean"?null:"a string or a boolean",Ve=r=>typeof r=="string"||typeof r=="object"&&r!==null&&!Array.isArray(r)?null:"a string or an object",tt=r=>typeof r=="string"||Array.isArray(r)?null:"a string or an array",at=r=>typeof r=="string"||r instanceof Uint8Array?null:"a string or a Uint8Array",Fe=r=>typeof r=="string"||r instanceof URL?null:"a string or a URL";function c(r,s,o,p){let x=r[o];if(s[o+""]=!0,x===void 0)return;let P=p(x);if(P!==null)throw new Error(`${A(o)} must be ${P}`);return x}function be(r,s,o){for(let p in r)if(!(p in s))throw new Error(`Invalid option ${o}: ${A(p)}`)}function ot(r){let s=Object.create(null),o=c(r,s,"wasmURL",Fe),p=c(r,s,"wasmModule",De),x=c(r,s,"worker",V);return be(r,s,"in initialize() call"),{wasmURL:o,wasmModule:p,worker:x}}function Ue(r){let s;if(r!==void 0){s=Object.create(null);for(let o in r){let p=r[o];if(typeof p=="string"||p===!1)s[o]=p;else throw new Error(`Expected ${A(o)} in mangle cache to map to either a string or false`)}}return s}function Qe(r,s,o,p,x){let P=c(s,o,"color",V),b=c(s,o,"logLevel",y),I=c(s,o,"logLimit",Ce);P!==void 0?r.push(`--color=${P}`):p&&r.push("--color=true"),r.push(`--log-level=${b||x}`),r.push(`--log-limit=${I||0}`)}function ve(r,s,o){if(typeof r!="string")throw new Error(`Expected value for ${s}${o!==void 0?" "+A(o):""} to be a string, got ${typeof r} instead`);return r}function gt(r,s,o){let p=c(s,o,"legalComments",y),x=c(s,o,"sourceRoot",y),P=c(s,o,"sourcesContent",V),b=c(s,o,"target",tt),I=c(s,o,"format",y),m=c(s,o,"globalName",y),D=c(s,o,"mangleProps",Pe),z=c(s,o,"reserveProps",Pe),G=c(s,o,"mangleQuoted",V),me=c(s,o,"minify",V),se=c(s,o,"minifySyntax",V),Q=c(s,o,"minifyWhitespace",V),Ee=c(s,o,"minifyIdentifiers",V),S=c(s,o,"lineLimit",Ce),le=c(s,o,"drop",pe),ce=c(s,o,"dropLabels",pe),_=c(s,o,"charset",y),h=c(s,o,"treeShaking",V),u=c(s,o,"ignoreAnnotations",V),d=c(s,o,"jsx",y),k=c(s,o,"jsxFactory",y),j=c(s,o,"jsxFragment",y),O=c(s,o,"jsxImportSource",y),B=c(s,o,"jsxDev",V),t=c(s,o,"jsxSideEffects",V),l=c(s,o,"define",xe),w=c(s,o,"logOverride",xe),C=c(s,o,"supported",xe),U=c(s,o,"pure",pe),ee=c(s,o,"keepNames",V),Y=c(s,o,"platform",y),re=c(s,o,"tsconfigRaw",Ve);if(p&&r.push(`--legal-comments=${p}`),x!==void 0&&r.push(`--source-root=${x}`),P!==void 0&&r.push(`--sources-content=${P}`),b&&(Array.isArray(b)?r.push(`--target=${Array.from(b).map(ne).join(",")}`):r.push(`--target=${ne(b)}`)),I&&r.push(`--format=${I}`),m&&r.push(`--global-name=${m}`),Y&&r.push(`--platform=${Y}`),re&&r.push(`--tsconfig-raw=${typeof re=="string"?re:JSON.stringify(re)}`),me&&r.push("--minify"),se&&r.push("--minify-syntax"),Q&&r.push("--minify-whitespace"),Ee&&r.push("--minify-identifiers"),S&&r.push(`--line-limit=${S}`),_&&r.push(`--charset=${_}`),h!==void 0&&r.push(`--tree-shaking=${h}`),u&&r.push("--ignore-annotations"),le)for(let K of le)r.push(`--drop:${ve(K,"drop")}`);if(ce&&r.push(`--drop-labels=${Array.from(ce).map(K=>ve(K,"dropLabels")).join(",")}`),D&&r.push(`--mangle-props=${D.source}`),z&&r.push(`--reserve-props=${z.source}`),G!==void 0&&r.push(`--mangle-quoted=${G}`),d&&r.push(`--jsx=${d}`),k&&r.push(`--jsx-factory=${k}`),j&&r.push(`--jsx-fragment=${j}`),O&&r.push(`--jsx-import-source=${O}`),B&&r.push("--jsx-dev"),t&&r.push("--jsx-side-effects"),l)for(let K in l){if(K.indexOf("=")>=0)throw new Error(`Invalid define: ${K}`);r.push(`--define:${K}=${ve(l[K],"define",K)}`)}if(w)for(let K in w){if(K.indexOf("=")>=0)throw new Error(`Invalid log override: ${K}`);r.push(`--log-override:${K}=${ve(w[K],"log override",K)}`)}if(C)for(let K in C){if(K.indexOf("=")>=0)throw new Error(`Invalid supported: ${K}`);const J=C[K];if(typeof J!="boolean")throw new Error(`Expected value for supported ${A(K)} to be a boolean, got ${typeof J} instead`);r.push(`--supported:${K}=${J}`)}if(U)for(let K of U)r.push(`--pure:${ve(K,"pure")}`);ee&&r.push("--keep-names")}function jt(r,s,o,p,x){var P;let b=[],I=[],m=Object.create(null),D=null,z=null;Qe(b,s,m,o,p),gt(b,s,m);let G=c(s,m,"sourcemap",Me),me=c(s,m,"bundle",V),se=c(s,m,"splitting",V),Q=c(s,m,"preserveSymlinks",V),Ee=c(s,m,"metafile",V),S=c(s,m,"outfile",y),le=c(s,m,"outdir",y),ce=c(s,m,"outbase",y),_=c(s,m,"tsconfig",y),h=c(s,m,"resolveExtensions",pe),u=c(s,m,"nodePaths",pe),d=c(s,m,"mainFields",pe),k=c(s,m,"conditions",pe),j=c(s,m,"external",pe),O=c(s,m,"packages",y),B=c(s,m,"alias",xe),t=c(s,m,"loader",xe),l=c(s,m,"outExtension",xe),w=c(s,m,"publicPath",y),C=c(s,m,"entryNames",y),U=c(s,m,"chunkNames",y),ee=c(s,m,"assetNames",y),Y=c(s,m,"inject",pe),re=c(s,m,"banner",xe),K=c(s,m,"footer",xe),J=c(s,m,"entryPoints",Je),fe=c(s,m,"absWorkingDir",y),te=c(s,m,"stdin",xe),ge=(P=c(s,m,"write",V))!=null?P:x,Se=c(s,m,"allowOverwrite",V),Le=c(s,m,"mangleCache",xe);if(m.plugins=!0,be(s,m,`in ${r}() call`),G&&b.push(`--sourcemap${G===!0?"":`=${G}`}`),me&&b.push("--bundle"),Se&&b.push("--allow-overwrite"),se&&b.push("--splitting"),Q&&b.push("--preserve-symlinks"),Ee&&b.push("--metafile"),S&&b.push(`--outfile=${S}`),le&&b.push(`--outdir=${le}`),ce&&b.push(`--outbase=${ce}`),_&&b.push(`--tsconfig=${_}`),O&&b.push(`--packages=${O}`),h){let $=[];for(let we of h){if(ve(we,"resolve extension"),we.indexOf(",")>=0)throw new Error(`Invalid resolve extension: ${we}`);$.push(we)}b.push(`--resolve-extensions=${$.join(",")}`)}if(w&&b.push(`--public-path=${w}`),C&&b.push(`--entry-names=${C}`),U&&b.push(`--chunk-names=${U}`),ee&&b.push(`--asset-names=${ee}`),d){let $=[];for(let we of d){if(ve(we,"main field"),we.indexOf(",")>=0)throw new Error(`Invalid main field: ${we}`);$.push(we)}b.push(`--main-fields=${$.join(",")}`)}if(k){let $=[];for(let we of k){if(ve(we,"condition"),we.indexOf(",")>=0)throw new Error(`Invalid condition: ${we}`);$.push(we)}b.push(`--conditions=${$.join(",")}`)}if(j)for(let $ of j)b.push(`--external:${ve($,"external")}`);if(B)for(let $ in B){if($.indexOf("=")>=0)throw new Error(`Invalid package name in alias: ${$}`);b.push(`--alias:${$}=${ve(B[$],"alias",$)}`)}if(re)for(let $ in re){if($.indexOf("=")>=0)throw new Error(`Invalid banner file type: ${$}`);b.push(`--banner:${$}=${ve(re[$],"banner",$)}`)}if(K)for(let $ in K){if($.indexOf("=")>=0)throw new Error(`Invalid footer file type: ${$}`);b.push(`--footer:${$}=${ve(K[$],"footer",$)}`)}if(Y)for(let $ of Y)b.push(`--inject:${ve($,"inject")}`);if(t)for(let $ in t){if($.indexOf("=")>=0)throw new Error(`Invalid loader extension: ${$}`);b.push(`--loader:${$}=${ve(t[$],"loader",$)}`)}if(l)for(let $ in l){if($.indexOf("=")>=0)throw new Error(`Invalid out extension: ${$}`);b.push(`--out-extension:${$}=${ve(l[$],"out extension",$)}`)}if(J)if(Array.isArray(J))for(let $=0,we=J.length;$<we;$++){let Ae=J[$];if(typeof Ae=="object"&&Ae!==null){let He=Object.create(null),Te=c(Ae,He,"in",y),ut=c(Ae,He,"out",y);if(be(Ae,He,"in entry point at index "+$),Te===void 0)throw new Error('Missing property "in" for entry point at index '+$);if(ut===void 0)throw new Error('Missing property "out" for entry point at index '+$);I.push([ut,Te])}else I.push(["",ve(Ae,"entry point at index "+$)])}else for(let $ in J)I.push([$,ve(J[$],"entry point",$)]);if(te){let $=Object.create(null),we=c(te,$,"contents",at),Ae=c(te,$,"resolveDir",y),He=c(te,$,"sourcefile",y),Te=c(te,$,"loader",y);be(te,$,'in "stdin" object'),He&&b.push(`--sourcefile=${He}`),Te&&b.push(`--loader=${Te}`),Ae&&(z=Ae),typeof we=="string"?D=T(we):we instanceof Uint8Array&&(D=we)}let it=[];if(u)for(let $ of u)$+="",it.push($);return{entries:I,flags:b,write:ge,stdinContents:D,stdinResolveDir:z,absWorkingDir:fe,nodePaths:it,mangleCache:Ue(Le)}}function Pt(r,s,o,p){let x=[],P=Object.create(null);Qe(x,s,P,o,p),gt(x,s,P);let b=c(s,P,"sourcemap",Me),I=c(s,P,"sourcefile",y),m=c(s,P,"loader",y),D=c(s,P,"banner",y),z=c(s,P,"footer",y),G=c(s,P,"mangleCache",xe);return be(s,P,`in ${r}() call`),b&&x.push(`--sourcemap=${b===!0?"external":b}`),I&&x.push(`--sourcefile=${I}`),m&&x.push(`--loader=${m}`),D&&x.push(`--banner=${D}`),z&&x.push(`--footer=${z}`),{flags:x,mangleCache:Ue(G)}}function yt(r){const s={},o={didClose:!1,reason:""};let p={},x=0,P=0,b=new Uint8Array(16*1024),I=0,m=_=>{let h=I+_.length;if(h>b.length){let d=new Uint8Array(h*2);d.set(b),b=d}b.set(_,I),I+=_.length;let u=0;for(;u+4<=I;){let d=ye(b,u);if(u+4+d>I)break;u+=4,Q(b.subarray(u,u+d)),u+=d}u>0&&(b.copyWithin(0,u,I),I-=u)},D=_=>{o.didClose=!0,_&&(o.reason=": "+(_.message||_));const h="The service was stopped"+o.reason;for(let u in p)p[u](h,null);p={}},z=(_,h,u)=>{if(o.didClose)return u("The service is no longer running"+o.reason,null);let d=x++;p[d]=(k,j)=>{try{u(k,j)}finally{_&&_.unref()}},_&&_.ref(),r.writeToStdin(ue({id:d,isRequest:!0,value:h}))},G=(_,h)=>{if(o.didClose)throw new Error("The service is no longer running"+o.reason);r.writeToStdin(ue({id:_,isRequest:!1,value:h}))},me=(_,h)=>W(this,null,function*(){try{if(h.command==="ping"){G(_,{});return}if(typeof h.key=="number"){const u=s[h.key];if(!u)return;const d=u[h.command];if(d){yield d(_,h);return}}throw new Error("Invalid command: "+h.command)}catch(u){const d=[Ke(u,r,null,void 0,"")];try{G(_,{errors:d})}catch{}}}),se=!0,Q=_=>{if(se){se=!1;let u=String.fromCharCode(..._);if(u!=="0.20.1")throw new Error(`Cannot start service: Host version "0.20.1" does not match binary version ${A(u)}`);return}let h=ae(_);if(h.isRequest)me(h.id,h.value);else{let u=p[h.id];delete p[h.id],h.value.error?u(h.value.error,{}):u(null,h.value)}};return{readFromStdout:m,afterClose:D,service:{buildOrContext:({callName:_,refs:h,options:u,isTTY:d,defaultWD:k,callback:j})=>{let O=0;const B=P++,t={},l={ref(){++O===1&&h&&h.ref()},unref(){--O===0&&(delete s[B],h&&h.unref())}};s[B]=t,l.ref(),Ct(_,B,z,G,l,r,t,u,d,k,(w,C)=>{try{j(w,C)}finally{l.unref()}})},transform:({callName:_,refs:h,input:u,options:d,isTTY:k,fs:j,callback:O})=>{const B=bt();let t=l=>{try{if(typeof u!="string"&&!(u instanceof Uint8Array))throw new Error('The input to "transform" must be a string or a Uint8Array');let{flags:w,mangleCache:C}=Pt(_,d,k,F),U={command:"transform",flags:w,inputFS:l!==null,input:l!==null?T(l):typeof u=="string"?T(u):u};C&&(U.mangleCache=C),z(h,U,(ee,Y)=>{if(ee)return O(new Error(ee),null);let re=qe(Y.errors,B),K=qe(Y.warnings,B),J=1,fe=()=>{if(--J===0){let te={warnings:K,code:Y.code,map:Y.map,mangleCache:void 0,legalComments:void 0};"legalComments"in Y&&(te.legalComments=Y?.legalComments),Y.mangleCache&&(te.mangleCache=Y?.mangleCache),O(null,te)}};if(re.length>0)return O(Ye("Transform failed",re,K),null);Y.codeFS&&(J++,j.readFile(Y.code,(te,ge)=>{te!==null?O(te,null):(Y.code=ge,fe())})),Y.mapFS&&(J++,j.readFile(Y.map,(te,ge)=>{te!==null?O(te,null):(Y.map=ge,fe())})),fe()})}catch(w){let C=[];try{Qe(C,d,{},k,F)}catch{}const U=Ke(w,r,B,void 0,"");z(h,{command:"error",flags:C,error:U},()=>{U.detail=B.load(U.detail),O(Ye("Transform failed",[U],[]),null)})}};if((typeof u=="string"||u instanceof Uint8Array)&&u.length>1024*1024){let l=t;t=()=>j.writeFile(u,l)}t(null)},formatMessages:({callName:_,refs:h,messages:u,options:d,callback:k})=>{if(!d)throw new Error(`Missing second argument in ${_}() call`);let j={},O=c(d,j,"kind",y),B=c(d,j,"color",V),t=c(d,j,"terminalWidth",Ce);if(be(d,j,`in ${_}() call`),O===void 0)throw new Error(`Missing "kind" in ${_}() call`);if(O!=="error"&&O!=="warning")throw new Error(`Expected "kind" to be "error" or "warning" in ${_}() call`);let l={command:"format-msgs",messages:Ie(u,"messages",null,"",t),isWarning:O==="warning"};B!==void 0&&(l.color=B),t!==void 0&&(l.terminalWidth=t),z(h,l,(w,C)=>{if(w)return k(new Error(w),null);k(null,C.messages)})},analyzeMetafile:({callName:_,refs:h,metafile:u,options:d,callback:k})=>{d===void 0&&(d={});let j={},O=c(d,j,"color",V),B=c(d,j,"verbose",V);be(d,j,`in ${_}() call`);let t={command:"analyze-metafile",metafile:u};O!==void 0&&(t.color=O),B!==void 0&&(t.verbose=B),z(h,t,(l,w)=>{if(l)return k(new Error(l),null);k(null,w.result)})}}}}function Ct(r,s,o,p,x,P,b,I,m,D,z){const G=bt(),me=r==="context",se=(S,le)=>{const ce=[];try{Qe(ce,I,{},m,E)}catch{}const _=Ke(S,P,G,void 0,le);o(x,{command:"error",flags:ce,error:_},()=>{_.detail=G.load(_.detail),z(Ye(me?"Context failed":"Build failed",[_],[]),null)})};let Q;if(typeof I=="object"){const S=I.plugins;if(S!==void 0){if(!Array.isArray(S))return se(new Error('"plugins" must be an array'),"");Q=S}}if(Q&&Q.length>0){if(P.isSync)return se(new Error("Cannot use plugins in synchronous API calls"),"");Tt(s,o,p,x,P,b,I,Q,G).then(S=>{if(!S.ok)return se(S.error,S.pluginName);try{Ee(S.requestPlugins,S.runOnEndCallbacks,S.scheduleOnDisposeCallbacks)}catch(le){se(le,"")}},S=>se(S,""));return}try{Ee(null,(S,le)=>le([],[]),()=>{})}catch(S){se(S,"")}function Ee(S,le,ce){const _=P.hasFS,{entries:h,flags:u,write:d,stdinContents:k,stdinResolveDir:j,absWorkingDir:O,nodePaths:B,mangleCache:t}=jt(r,I,m,E,_);if(d&&!P.hasFS)throw new Error('The "write" option is unavailable in this environment');const l={command:"build",key:s,entries:h,flags:u,write:d,stdinContents:k,stdinResolveDir:j,absWorkingDir:O||D,nodePaths:B,context:me};S&&(l.plugins=S),t&&(l.mangleCache=t);const w=(ee,Y)=>{const re={errors:qe(ee.errors,G),warnings:qe(ee.warnings,G),outputFiles:void 0,metafile:void 0,mangleCache:void 0},K=re.errors.slice(),J=re.warnings.slice();ee.outputFiles&&(re.outputFiles=ee.outputFiles.map($t)),ee.metafile&&(re.metafile=JSON.parse(ee.metafile)),ee.mangleCache&&(re.mangleCache=ee.mangleCache),ee.writeToStdout!==void 0&&console.log(M(ee.writeToStdout).replace(/\n$/,"")),le(re,(fe,te)=>{if(K.length>0||fe.length>0){const ge=Ye("Build failed",K.concat(fe),J.concat(te));return Y(ge,null,fe,te)}Y(null,re,fe,te)})};let C,U;me&&(b["on-end"]=(ee,Y)=>new Promise(re=>{w(Y,(K,J,fe,te)=>{const ge={errors:fe,warnings:te};U&&U(K,J),C=void 0,U=void 0,p(ee,ge),re()})})),o(x,l,(ee,Y)=>{if(ee)return z(new Error(ee),null);if(!me)return w(Y,(J,fe)=>(ce(),z(J,fe)));if(Y.errors.length>0)return z(Ye("Context failed",Y.errors,Y.warnings),null);let re=!1;const K={rebuild:()=>(C||(C=new Promise((J,fe)=>{let te;U=(Se,Le)=>{te||(te=()=>Se?fe(Se):J(Le))};const ge=()=>{o(x,{command:"rebuild",key:s},(Le,it)=>{Le?fe(new Error(Le)):te?te():ge()})};ge()})),C),watch:(J={})=>new Promise((fe,te)=>{if(!P.hasFS)throw new Error('Cannot use the "watch" API in this environment');be(J,{},"in watch() call"),o(x,{command:"watch",key:s},Le=>{Le?te(new Error(Le)):fe(void 0)})}),serve:(J={})=>new Promise((fe,te)=>{if(!P.hasFS)throw new Error('Cannot use the "serve" API in this environment');const ge={},Se=c(J,ge,"port",Ce),Le=c(J,ge,"host",y),it=c(J,ge,"servedir",y),$=c(J,ge,"keyfile",y),we=c(J,ge,"certfile",y),Ae=c(J,ge,"fallback",y),He=c(J,ge,"onRequest",Re);be(J,ge,"in serve() call");const Te={command:"serve",key:s,onRequest:!!He};Se!==void 0&&(Te.port=Se),Le!==void 0&&(Te.host=Le),it!==void 0&&(Te.servedir=it),$!==void 0&&(Te.keyfile=$),we!==void 0&&(Te.certfile=we),Ae!==void 0&&(Te.fallback=Ae),o(x,Te,(ut,jn)=>{if(ut)return te(new Error(ut));He&&(b["serve-request"]=(Pn,Cn)=>{He(Cn.args),p(Pn,{})}),fe(jn)})}),cancel:()=>new Promise(J=>{if(re)return J();o(x,{command:"cancel",key:s},()=>{J()})}),dispose:()=>new Promise(J=>{if(re)return J();re=!0,o(x,{command:"dispose",key:s},()=>{J(),ce(),x.unref()})})};x.ref(),z(null,K)})}}var Tt=(r,s,o,p,x,P,b,I,m)=>W(void 0,null,function*(){let D=[],z=[],G={},me={},se=[],Q=0,Ee=0,S=[],le=!1;I=[...I];for(let h of I){let u={};if(typeof h!="object")throw new Error(`Plugin at index ${Ee} must be an object`);const d=c(h,u,"name",y);if(typeof d!="string"||d==="")throw new Error(`Plugin at index ${Ee} is missing a name`);try{let k=c(h,u,"setup",Re);if(typeof k!="function")throw new Error("Plugin is missing a setup function");be(h,u,`on plugin ${A(d)}`);let j={name:d,onStart:!1,onEnd:!1,onResolve:[],onLoad:[]};Ee++;let B=k({initialOptions:b,resolve:(t,l={})=>{if(!le)throw new Error('Cannot call "resolve" before plugin setup has completed');if(typeof t!="string")throw new Error("The path to resolve must be a string");let w=Object.create(null),C=c(l,w,"pluginName",y),U=c(l,w,"importer",y),ee=c(l,w,"namespace",y),Y=c(l,w,"resolveDir",y),re=c(l,w,"kind",y),K=c(l,w,"pluginData",de);return be(l,w,"in resolve() call"),new Promise((J,fe)=>{const te={command:"resolve",path:t,key:r,pluginName:d};if(C!=null&&(te.pluginName=C),U!=null&&(te.importer=U),ee!=null&&(te.namespace=ee),Y!=null&&(te.resolveDir=Y),re!=null)te.kind=re;else throw new Error('Must specify "kind" when calling "resolve"');K!=null&&(te.pluginData=m.store(K)),s(p,te,(ge,Se)=>{ge!==null?fe(new Error(ge)):J({errors:qe(Se.errors,m),warnings:qe(Se.warnings,m),path:Se.path,external:Se.external,sideEffects:Se.sideEffects,namespace:Se.namespace,suffix:Se.suffix,pluginData:m.load(Se.pluginData)})})})},onStart(t){let l='This error came from the "onStart" callback registered here:',w=nt(new Error(l),x,"onStart");D.push({name:d,callback:t,note:w}),j.onStart=!0},onEnd(t){let l='This error came from the "onEnd" callback registered here:',w=nt(new Error(l),x,"onEnd");z.push({name:d,callback:t,note:w}),j.onEnd=!0},onResolve(t,l){let w='This error came from the "onResolve" callback registered here:',C=nt(new Error(w),x,"onResolve"),U={},ee=c(t,U,"filter",Pe),Y=c(t,U,"namespace",y);if(be(t,U,`in onResolve() call for plugin ${A(d)}`),ee==null)throw new Error("onResolve() call is missing a filter");let re=Q++;G[re]={name:d,callback:l,note:C},j.onResolve.push({id:re,filter:ee.source,namespace:Y||""})},onLoad(t,l){let w='This error came from the "onLoad" callback registered here:',C=nt(new Error(w),x,"onLoad"),U={},ee=c(t,U,"filter",Pe),Y=c(t,U,"namespace",y);if(be(t,U,`in onLoad() call for plugin ${A(d)}`),ee==null)throw new Error("onLoad() call is missing a filter");let re=Q++;me[re]={name:d,callback:l,note:C},j.onLoad.push({id:re,filter:ee.source,namespace:Y||""})},onDispose(t){se.push(t)},esbuild:x.esbuild});B&&(yield B),S.push(j)}catch(k){return{ok:!1,error:k,pluginName:d}}}P["on-start"]=(h,u)=>W(void 0,null,function*(){let d={errors:[],warnings:[]};yield Promise.all(D.map(k=>W(void 0,[k],function*({name:j,callback:O,note:B}){try{let t=yield O();if(t!=null){if(typeof t!="object")throw new Error(`Expected onStart() callback in plugin ${A(j)} to return an object`);let l={},w=c(t,l,"errors",pe),C=c(t,l,"warnings",pe);be(t,l,`from onStart() callback in plugin ${A(j)}`),w!=null&&d.errors.push(...Ie(w,"errors",m,j,void 0)),C!=null&&d.warnings.push(...Ie(C,"warnings",m,j,void 0))}}catch(t){d.errors.push(Ke(t,x,m,B&&B(),j))}}))),o(h,d)}),P["on-resolve"]=(h,u)=>W(void 0,null,function*(){let d={},k="",j,O;for(let B of u.ids)try{({name:k,callback:j,note:O}=G[B]);let t=yield j({path:u.path,importer:u.importer,namespace:u.namespace,resolveDir:u.resolveDir,kind:u.kind,pluginData:m.load(u.pluginData)});if(t!=null){if(typeof t!="object")throw new Error(`Expected onResolve() callback in plugin ${A(k)} to return an object`);let l={},w=c(t,l,"pluginName",y),C=c(t,l,"path",y),U=c(t,l,"namespace",y),ee=c(t,l,"suffix",y),Y=c(t,l,"external",V),re=c(t,l,"sideEffects",V),K=c(t,l,"pluginData",de),J=c(t,l,"errors",pe),fe=c(t,l,"warnings",pe),te=c(t,l,"watchFiles",pe),ge=c(t,l,"watchDirs",pe);be(t,l,`from onResolve() callback in plugin ${A(k)}`),d.id=B,w!=null&&(d.pluginName=w),C!=null&&(d.path=C),U!=null&&(d.namespace=U),ee!=null&&(d.suffix=ee),Y!=null&&(d.external=Y),re!=null&&(d.sideEffects=re),K!=null&&(d.pluginData=m.store(K)),J!=null&&(d.errors=Ie(J,"errors",m,k,void 0)),fe!=null&&(d.warnings=Ie(fe,"warnings",m,k,void 0)),te!=null&&(d.watchFiles=rt(te,"watchFiles")),ge!=null&&(d.watchDirs=rt(ge,"watchDirs"));break}}catch(t){d={id:B,errors:[Ke(t,x,m,O&&O(),k)]};break}o(h,d)}),P["on-load"]=(h,u)=>W(void 0,null,function*(){let d={},k="",j,O;for(let B of u.ids)try{({name:k,callback:j,note:O}=me[B]);let t=yield j({path:u.path,namespace:u.namespace,suffix:u.suffix,pluginData:m.load(u.pluginData),with:u.with});if(t!=null){if(typeof t!="object")throw new Error(`Expected onLoad() callback in plugin ${A(k)} to return an object`);let l={},w=c(t,l,"pluginName",y),C=c(t,l,"contents",at),U=c(t,l,"resolveDir",y),ee=c(t,l,"pluginData",de),Y=c(t,l,"loader",y),re=c(t,l,"errors",pe),K=c(t,l,"warnings",pe),J=c(t,l,"watchFiles",pe),fe=c(t,l,"watchDirs",pe);be(t,l,`from onLoad() callback in plugin ${A(k)}`),d.id=B,w!=null&&(d.pluginName=w),C instanceof Uint8Array?d.contents=C:C!=null&&(d.contents=T(C)),U!=null&&(d.resolveDir=U),ee!=null&&(d.pluginData=m.store(ee)),Y!=null&&(d.loader=Y),re!=null&&(d.errors=Ie(re,"errors",m,k,void 0)),K!=null&&(d.warnings=Ie(K,"warnings",m,k,void 0)),J!=null&&(d.watchFiles=rt(J,"watchFiles")),fe!=null&&(d.watchDirs=rt(fe,"watchDirs"));break}}catch(t){d={id:B,errors:[Ke(t,x,m,O&&O(),k)]};break}o(h,d)});let ce=(h,u)=>u([],[]);z.length>0&&(ce=(h,u)=>{W(void 0,null,function*(){const d=[],k=[];for(const{name:j,callback:O,note:B}of z){let t,l;try{const w=yield O(h);if(w!=null){if(typeof w!="object")throw new Error(`Expected onEnd() callback in plugin ${A(j)} to return an object`);let C={},U=c(w,C,"errors",pe),ee=c(w,C,"warnings",pe);be(w,C,`from onEnd() callback in plugin ${A(j)}`),U!=null&&(t=Ie(U,"errors",m,j,void 0)),ee!=null&&(l=Ie(ee,"warnings",m,j,void 0))}}catch(w){t=[Ke(w,x,m,B&&B(),j)]}if(t){d.push(...t);try{h.errors.push(...t)}catch{}}if(l){k.push(...l);try{h.warnings.push(...l)}catch{}}}u(d,k)})});let _=()=>{for(const h of se)setTimeout(()=>h(),0)};return le=!0,{ok:!0,requestPlugins:S,runOnEndCallbacks:ce,scheduleOnDisposeCallbacks:_}});function bt(){const r=new Map;let s=0;return{load(o){return r.get(o)},store(o){if(o===void 0)return-1;const p=s++;return r.set(p,o),p}}}function nt(r,s,o){let p,x=!1;return()=>{if(x)return p;x=!0;try{let P=(r.stack+"").split(`
`);P.splice(1,1);let b=wt(s,P,o);if(b)return p={text:r.message,location:b},p}catch{}}}function Ke(r,s,o,p,x){let P="Internal error",b=null;try{P=(r&&r.message||r)+""}catch{}try{b=wt(s,(r.stack+"").split(`
`),"")}catch{}return{id:"",pluginName:x,text:P,location:b,notes:p?[p]:[],detail:o?o.store(r):-1}}function wt(r,s,o){let p="    at ";if(r.readFileSync&&!s[0].startsWith(p)&&s[1].startsWith(p))for(let x=1;x<s.length;x++){let P=s[x];if(P.startsWith(p))for(P=P.slice(p.length);;){let b=/^(?:new |async )?\S+ \((.*)\)$/.exec(P);if(b){P=b[1];continue}if(b=/^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(P),b){P=b[1];continue}if(b=/^(\S+):(\d+):(\d+)$/.exec(P),b){let I;try{I=r.readFileSync(b[1],"utf8")}catch{break}let m=I.split(/\r\n|\r|\n|\u2028|\u2029/)[+b[2]-1]||"",D=+b[3]-1,z=m.slice(D,D+o.length)===o?o.length:0;return{file:b[1],namespace:"file",line:+b[2],column:T(m.slice(0,D)).length,length:T(m.slice(D,D+z)).length,lineText:m+`
`+s.slice(1).join(`
`),suggestion:""}}break}}return null}function Ye(r,s,o){let p=5;r+=s.length<1?"":` with ${s.length} error${s.length<2?"":"s"}:`+s.slice(0,p+1).map((P,b)=>{if(b===p)return`
...`;if(!P.location)return`
error: ${P.text}`;let{file:I,line:m,column:D}=P.location,z=P.pluginName?`[plugin: ${P.pluginName}] `:"";return`
${I}:${m}:${D}: ERROR: ${z}${P.text}`}).join("");let x=new Error(r);for(const[P,b]of[["errors",s],["warnings",o]])Object.defineProperty(x,P,{configurable:!0,enumerable:!0,get:()=>b,set:I=>Object.defineProperty(x,P,{configurable:!0,enumerable:!0,value:I})});return x}function qe(r,s){for(const o of r)o.detail=s.load(o.detail);return r}function lt(r,s,o){if(r==null)return null;let p={},x=c(r,p,"file",y),P=c(r,p,"namespace",y),b=c(r,p,"line",Ce),I=c(r,p,"column",Ce),m=c(r,p,"length",Ce),D=c(r,p,"lineText",y),z=c(r,p,"suggestion",y);if(be(r,p,s),D){const G=D.slice(0,(I&&I>0?I:0)+(m&&m>0?m:0)+(o&&o>0?o:80));!/[\x7F-\uFFFF]/.test(G)&&!/\n/.test(D)&&(D=G)}return{file:x||"",namespace:P||"",line:b||0,column:I||0,length:m||0,lineText:D||"",suggestion:z||""}}function Ie(r,s,o,p,x){let P=[],b=0;for(const I of r){let m={},D=c(I,m,"id",y),z=c(I,m,"pluginName",y),G=c(I,m,"text",y),me=c(I,m,"location",je),se=c(I,m,"notes",pe),Q=c(I,m,"detail",de),Ee=`in element ${b} of "${s}"`;be(I,m,Ee);let S=[];if(se)for(const le of se){let ce={},_=c(le,ce,"text",y),h=c(le,ce,"location",je);be(le,ce,Ee),S.push({text:_||"",location:lt(h,Ee,x)})}P.push({id:D||"",pluginName:z||p,text:G||"",location:lt(me,Ee,x),notes:S,detail:o?o.store(Q):-1}),b++}return P}function rt(r,s){const o=[];for(const p of r){if(typeof p!="string")throw new Error(`${A(s)} must be an array of strings`);o.push(p)}return o}function $t({path:r,contents:s,hash:o}){let p=null;return{path:r,contents:s,hash:o,get text(){const x=this.contents;return(p===null||x!==s)&&(s=x,p=M(x)),p}}}var Rt="0.20.1",Ft=r=>ct().build(r),It=r=>ct().context(r),Ot=(r,s)=>ct().transform(r,s),oe=(r,s)=>ct().formatMessages(r,s),he=(r,s)=>ct().analyzeMetafile(r,s),Oe=()=>{throw new Error('The "buildSync" API only works in node')},Ne=()=>{throw new Error('The "transformSync" API only works in node')},Be=()=>{throw new Error('The "formatMessagesSync" API only works in node')},Nt=()=>{throw new Error('The "analyzeMetafileSync" API only works in node')},Lt=()=>(vt&&vt(),Promise.resolve()),ze,vt,xt,ct=()=>{if(xt)return xt;throw ze?new Error('You need to wait for the promise returned from "initialize" to be resolved before calling this'):new Error('You need to call "initialize" before calling this')},_n=r=>{r=ot(r||{});let s=r.wasmURL,o=r.wasmModule,p=r.worker!==!1;if(!s&&!o)throw new Error('Must provide either the "wasmURL" option or the "wasmModule" option');if(ze)throw new Error('Cannot call "initialize" more than once');return ze=En(s||"",o,p),ze.catch(()=>{ze=void 0}),ze},En=(r,s,o)=>W(void 0,null,function*(){let p;if(o){let D=new Blob([`onmessage=((postMessage) => {
      // Copyright 2018 The Go Authors. All rights reserved.
      // Use of this source code is governed by a BSD-style
      // license that can be found in the LICENSE file.
      var __async = (__this, __arguments, generator) => {
        return new Promise((resolve, reject) => {
          var fulfilled = (value) => {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          };
          var rejected = (value) => {
            try {
              step(generator.throw(value));
            } catch (e) {
              reject(e);
            }
          };
          var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
          step((generator = generator.apply(__this, __arguments)).next());
        });
      };
      let onmessage;
      let globalThis = {};
      for (let o = self; o; o = Object.getPrototypeOf(o))
        for (let k of Object.getOwnPropertyNames(o))
          if (!(k in globalThis))
            Object.defineProperty(globalThis, k, { get: () => self[k] });
      "use strict";
      (() => {
        const enosys = () => {
          const err = new Error("not implemented");
          err.code = "ENOSYS";
          return err;
        };
        if (!globalThis.fs) {
          let outputBuf = "";
          globalThis.fs = {
            constants: { O_WRONLY: -1, O_RDWR: -1, O_CREAT: -1, O_TRUNC: -1, O_APPEND: -1, O_EXCL: -1 },
            // unused
            writeSync(fd, buf) {
              outputBuf += decoder.decode(buf);
              const nl = outputBuf.lastIndexOf("\\n");
              if (nl != -1) {
                console.log(outputBuf.substring(0, nl));
                outputBuf = outputBuf.substring(nl + 1);
              }
              return buf.length;
            },
            write(fd, buf, offset, length, position, callback) {
              if (offset !== 0 || length !== buf.length || position !== null) {
                callback(enosys());
                return;
              }
              const n = this.writeSync(fd, buf);
              callback(null, n);
            },
            chmod(path, mode, callback) {
              callback(enosys());
            },
            chown(path, uid, gid, callback) {
              callback(enosys());
            },
            close(fd, callback) {
              callback(enosys());
            },
            fchmod(fd, mode, callback) {
              callback(enosys());
            },
            fchown(fd, uid, gid, callback) {
              callback(enosys());
            },
            fstat(fd, callback) {
              callback(enosys());
            },
            fsync(fd, callback) {
              callback(null);
            },
            ftruncate(fd, length, callback) {
              callback(enosys());
            },
            lchown(path, uid, gid, callback) {
              callback(enosys());
            },
            link(path, link, callback) {
              callback(enosys());
            },
            lstat(path, callback) {
              callback(enosys());
            },
            mkdir(path, perm, callback) {
              callback(enosys());
            },
            open(path, flags, mode, callback) {
              callback(enosys());
            },
            read(fd, buffer, offset, length, position, callback) {
              callback(enosys());
            },
            readdir(path, callback) {
              callback(enosys());
            },
            readlink(path, callback) {
              callback(enosys());
            },
            rename(from, to, callback) {
              callback(enosys());
            },
            rmdir(path, callback) {
              callback(enosys());
            },
            stat(path, callback) {
              callback(enosys());
            },
            symlink(path, link, callback) {
              callback(enosys());
            },
            truncate(path, length, callback) {
              callback(enosys());
            },
            unlink(path, callback) {
              callback(enosys());
            },
            utimes(path, atime, mtime, callback) {
              callback(enosys());
            }
          };
        }
        if (!globalThis.process) {
          globalThis.process = {
            getuid() {
              return -1;
            },
            getgid() {
              return -1;
            },
            geteuid() {
              return -1;
            },
            getegid() {
              return -1;
            },
            getgroups() {
              throw enosys();
            },
            pid: -1,
            ppid: -1,
            umask() {
              throw enosys();
            },
            cwd() {
              throw enosys();
            },
            chdir() {
              throw enosys();
            }
          };
        }
        if (!globalThis.crypto) {
          throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");
        }
        if (!globalThis.performance) {
          throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");
        }
        if (!globalThis.TextEncoder) {
          throw new Error("globalThis.TextEncoder is not available, polyfill required");
        }
        if (!globalThis.TextDecoder) {
          throw new Error("globalThis.TextDecoder is not available, polyfill required");
        }
        const encoder = new TextEncoder("utf-8");
        const decoder = new TextDecoder("utf-8");
        globalThis.Go = class {
          constructor() {
            this.argv = ["js"];
            this.env = {};
            this.exit = (code) => {
              if (code !== 0) {
                console.warn("exit code:", code);
              }
            };
            this._exitPromise = new Promise((resolve) => {
              this._resolveExitPromise = resolve;
            });
            this._pendingEvent = null;
            this._scheduledTimeouts = /* @__PURE__ */ new Map();
            this._nextCallbackTimeoutID = 1;
            const setInt64 = (addr, v) => {
              this.mem.setUint32(addr + 0, v, true);
              this.mem.setUint32(addr + 4, Math.floor(v / 4294967296), true);
            };
            const getInt64 = (addr) => {
              const low = this.mem.getUint32(addr + 0, true);
              const high = this.mem.getInt32(addr + 4, true);
              return low + high * 4294967296;
            };
            const loadValue = (addr) => {
              const f = this.mem.getFloat64(addr, true);
              if (f === 0) {
                return void 0;
              }
              if (!isNaN(f)) {
                return f;
              }
              const id = this.mem.getUint32(addr, true);
              return this._values[id];
            };
            const storeValue = (addr, v) => {
              const nanHead = 2146959360;
              if (typeof v === "number" && v !== 0) {
                if (isNaN(v)) {
                  this.mem.setUint32(addr + 4, nanHead, true);
                  this.mem.setUint32(addr, 0, true);
                  return;
                }
                this.mem.setFloat64(addr, v, true);
                return;
              }
              if (v === void 0) {
                this.mem.setFloat64(addr, 0, true);
                return;
              }
              let id = this._ids.get(v);
              if (id === void 0) {
                id = this._idPool.pop();
                if (id === void 0) {
                  id = this._values.length;
                }
                this._values[id] = v;
                this._goRefCounts[id] = 0;
                this._ids.set(v, id);
              }
              this._goRefCounts[id]++;
              let typeFlag = 0;
              switch (typeof v) {
                case "object":
                  if (v !== null) {
                    typeFlag = 1;
                  }
                  break;
                case "string":
                  typeFlag = 2;
                  break;
                case "symbol":
                  typeFlag = 3;
                  break;
                case "function":
                  typeFlag = 4;
                  break;
              }
              this.mem.setUint32(addr + 4, nanHead | typeFlag, true);
              this.mem.setUint32(addr, id, true);
            };
            const loadSlice = (addr) => {
              const array = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              return new Uint8Array(this._inst.exports.mem.buffer, array, len);
            };
            const loadSliceOfValues = (addr) => {
              const array = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              const a = new Array(len);
              for (let i = 0; i < len; i++) {
                a[i] = loadValue(array + i * 8);
              }
              return a;
            };
            const loadString = (addr) => {
              const saddr = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              return decoder.decode(new DataView(this._inst.exports.mem.buffer, saddr, len));
            };
            const timeOrigin = Date.now() - performance.now();
            this.importObject = {
              go: {
                // Go's SP does not change as long as no Go code is running. Some operations (e.g. calls, getters and setters)
                // may synchronously trigger a Go event handler. This makes Go code get executed in the middle of the imported
                // function. A goroutine can switch to a new stack if the current stack is too small (see morestack function).
                // This changes the SP, thus we have to update the SP used by the imported function.
                // func wasmExit(code int32)
                "runtime.wasmExit": (sp) => {
                  sp >>>= 0;
                  const code = this.mem.getInt32(sp + 8, true);
                  this.exited = true;
                  delete this._inst;
                  delete this._values;
                  delete this._goRefCounts;
                  delete this._ids;
                  delete this._idPool;
                  this.exit(code);
                },
                // func wasmWrite(fd uintptr, p unsafe.Pointer, n int32)
                "runtime.wasmWrite": (sp) => {
                  sp >>>= 0;
                  const fd = getInt64(sp + 8);
                  const p = getInt64(sp + 16);
                  const n = this.mem.getInt32(sp + 24, true);
                  globalThis.fs.writeSync(fd, new Uint8Array(this._inst.exports.mem.buffer, p, n));
                },
                // func resetMemoryDataView()
                "runtime.resetMemoryDataView": (sp) => {
                  sp >>>= 0;
                  this.mem = new DataView(this._inst.exports.mem.buffer);
                },
                // func nanotime1() int64
                "runtime.nanotime1": (sp) => {
                  sp >>>= 0;
                  setInt64(sp + 8, (timeOrigin + performance.now()) * 1e6);
                },
                // func walltime() (sec int64, nsec int32)
                "runtime.walltime": (sp) => {
                  sp >>>= 0;
                  const msec = (/* @__PURE__ */ new Date()).getTime();
                  setInt64(sp + 8, msec / 1e3);
                  this.mem.setInt32(sp + 16, msec % 1e3 * 1e6, true);
                },
                // func scheduleTimeoutEvent(delay int64) int32
                "runtime.scheduleTimeoutEvent": (sp) => {
                  sp >>>= 0;
                  const id = this._nextCallbackTimeoutID;
                  this._nextCallbackTimeoutID++;
                  this._scheduledTimeouts.set(id, setTimeout(
                    () => {
                      this._resume();
                      while (this._scheduledTimeouts.has(id)) {
                        console.warn("scheduleTimeoutEvent: missed timeout event");
                        this._resume();
                      }
                    },
                    getInt64(sp + 8) + 1
                    // setTimeout has been seen to fire up to 1 millisecond early
                  ));
                  this.mem.setInt32(sp + 16, id, true);
                },
                // func clearTimeoutEvent(id int32)
                "runtime.clearTimeoutEvent": (sp) => {
                  sp >>>= 0;
                  const id = this.mem.getInt32(sp + 8, true);
                  clearTimeout(this._scheduledTimeouts.get(id));
                  this._scheduledTimeouts.delete(id);
                },
                // func getRandomData(r []byte)
                "runtime.getRandomData": (sp) => {
                  sp >>>= 0;
                  crypto.getRandomValues(loadSlice(sp + 8));
                },
                // func finalizeRef(v ref)
                "syscall/js.finalizeRef": (sp) => {
                  sp >>>= 0;
                  const id = this.mem.getUint32(sp + 8, true);
                  this._goRefCounts[id]--;
                  if (this._goRefCounts[id] === 0) {
                    const v = this._values[id];
                    this._values[id] = null;
                    this._ids.delete(v);
                    this._idPool.push(id);
                  }
                },
                // func stringVal(value string) ref
                "syscall/js.stringVal": (sp) => {
                  sp >>>= 0;
                  storeValue(sp + 24, loadString(sp + 8));
                },
                // func valueGet(v ref, p string) ref
                "syscall/js.valueGet": (sp) => {
                  sp >>>= 0;
                  const result = Reflect.get(loadValue(sp + 8), loadString(sp + 16));
                  sp = this._inst.exports.getsp() >>> 0;
                  storeValue(sp + 32, result);
                },
                // func valueSet(v ref, p string, x ref)
                "syscall/js.valueSet": (sp) => {
                  sp >>>= 0;
                  Reflect.set(loadValue(sp + 8), loadString(sp + 16), loadValue(sp + 32));
                },
                // func valueDelete(v ref, p string)
                "syscall/js.valueDelete": (sp) => {
                  sp >>>= 0;
                  Reflect.deleteProperty(loadValue(sp + 8), loadString(sp + 16));
                },
                // func valueIndex(v ref, i int) ref
                "syscall/js.valueIndex": (sp) => {
                  sp >>>= 0;
                  storeValue(sp + 24, Reflect.get(loadValue(sp + 8), getInt64(sp + 16)));
                },
                // valueSetIndex(v ref, i int, x ref)
                "syscall/js.valueSetIndex": (sp) => {
                  sp >>>= 0;
                  Reflect.set(loadValue(sp + 8), getInt64(sp + 16), loadValue(sp + 24));
                },
                // func valueCall(v ref, m string, args []ref) (ref, bool)
                "syscall/js.valueCall": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const m = Reflect.get(v, loadString(sp + 16));
                    const args = loadSliceOfValues(sp + 32);
                    const result = Reflect.apply(m, v, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 56, result);
                    this.mem.setUint8(sp + 64, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 56, err);
                    this.mem.setUint8(sp + 64, 0);
                  }
                },
                // func valueInvoke(v ref, args []ref) (ref, bool)
                "syscall/js.valueInvoke": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const args = loadSliceOfValues(sp + 16);
                    const result = Reflect.apply(v, void 0, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, result);
                    this.mem.setUint8(sp + 48, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, err);
                    this.mem.setUint8(sp + 48, 0);
                  }
                },
                // func valueNew(v ref, args []ref) (ref, bool)
                "syscall/js.valueNew": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const args = loadSliceOfValues(sp + 16);
                    const result = Reflect.construct(v, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, result);
                    this.mem.setUint8(sp + 48, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, err);
                    this.mem.setUint8(sp + 48, 0);
                  }
                },
                // func valueLength(v ref) int
                "syscall/js.valueLength": (sp) => {
                  sp >>>= 0;
                  setInt64(sp + 16, parseInt(loadValue(sp + 8).length));
                },
                // valuePrepareString(v ref) (ref, int)
                "syscall/js.valuePrepareString": (sp) => {
                  sp >>>= 0;
                  const str = encoder.encode(String(loadValue(sp + 8)));
                  storeValue(sp + 16, str);
                  setInt64(sp + 24, str.length);
                },
                // valueLoadString(v ref, b []byte)
                "syscall/js.valueLoadString": (sp) => {
                  sp >>>= 0;
                  const str = loadValue(sp + 8);
                  loadSlice(sp + 16).set(str);
                },
                // func valueInstanceOf(v ref, t ref) bool
                "syscall/js.valueInstanceOf": (sp) => {
                  sp >>>= 0;
                  this.mem.setUint8(sp + 24, loadValue(sp + 8) instanceof loadValue(sp + 16) ? 1 : 0);
                },
                // func copyBytesToGo(dst []byte, src ref) (int, bool)
                "syscall/js.copyBytesToGo": (sp) => {
                  sp >>>= 0;
                  const dst = loadSlice(sp + 8);
                  const src = loadValue(sp + 32);
                  if (!(src instanceof Uint8Array || src instanceof Uint8ClampedArray)) {
                    this.mem.setUint8(sp + 48, 0);
                    return;
                  }
                  const toCopy = src.subarray(0, dst.length);
                  dst.set(toCopy);
                  setInt64(sp + 40, toCopy.length);
                  this.mem.setUint8(sp + 48, 1);
                },
                // func copyBytesToJS(dst ref, src []byte) (int, bool)
                "syscall/js.copyBytesToJS": (sp) => {
                  sp >>>= 0;
                  const dst = loadValue(sp + 8);
                  const src = loadSlice(sp + 16);
                  if (!(dst instanceof Uint8Array || dst instanceof Uint8ClampedArray)) {
                    this.mem.setUint8(sp + 48, 0);
                    return;
                  }
                  const toCopy = src.subarray(0, dst.length);
                  dst.set(toCopy);
                  setInt64(sp + 40, toCopy.length);
                  this.mem.setUint8(sp + 48, 1);
                },
                "debug": (value) => {
                  console.log(value);
                }
              }
            };
          }
          run(instance) {
            return __async(this, null, function* () {
              if (!(instance instanceof WebAssembly.Instance)) {
                throw new Error("Go.run: WebAssembly.Instance expected");
              }
              this._inst = instance;
              this.mem = new DataView(this._inst.exports.mem.buffer);
              this._values = [
                // JS values that Go currently has references to, indexed by reference id
                NaN,
                0,
                null,
                true,
                false,
                globalThis,
                this
              ];
              this._goRefCounts = new Array(this._values.length).fill(Infinity);
              this._ids = /* @__PURE__ */ new Map([
                // mapping from JS values to reference ids
                [0, 1],
                [null, 2],
                [true, 3],
                [false, 4],
                [globalThis, 5],
                [this, 6]
              ]);
              this._idPool = [];
              this.exited = false;
              let offset = 4096;
              const strPtr = (str) => {
                const ptr = offset;
                const bytes = encoder.encode(str + "\\0");
                new Uint8Array(this.mem.buffer, offset, bytes.length).set(bytes);
                offset += bytes.length;
                if (offset % 8 !== 0) {
                  offset += 8 - offset % 8;
                }
                return ptr;
              };
              const argc = this.argv.length;
              const argvPtrs = [];
              this.argv.forEach((arg) => {
                argvPtrs.push(strPtr(arg));
              });
              argvPtrs.push(0);
              const keys = Object.keys(this.env).sort();
              keys.forEach((key) => {
                argvPtrs.push(strPtr(\`\${key}=\${this.env[key]}\`));
              });
              argvPtrs.push(0);
              const argv = offset;
              argvPtrs.forEach((ptr) => {
                this.mem.setUint32(offset, ptr, true);
                this.mem.setUint32(offset + 4, 0, true);
                offset += 8;
              });
              const wasmMinDataAddr = 4096 + 8192;
              if (offset >= wasmMinDataAddr) {
                throw new Error("total length of command line and environment variables exceeds limit");
              }
              this._inst.exports.run(argc, argv);
              if (this.exited) {
                this._resolveExitPromise();
              }
              yield this._exitPromise;
            });
          }
          _resume() {
            if (this.exited) {
              throw new Error("Go program has already exited");
            }
            this._inst.exports.resume();
            if (this.exited) {
              this._resolveExitPromise();
            }
          }
          _makeFuncWrapper(id) {
            const go = this;
            return function() {
              const event = { id, this: this, args: arguments };
              go._pendingEvent = event;
              go._resume();
              return event.result;
            };
          }
        };
      })();
      onmessage = ({ data: wasm }) => {
        let decoder = new TextDecoder();
        let fs = globalThis.fs;
        let stderr = "";
        fs.writeSync = (fd, buffer) => {
          if (fd === 1) {
            postMessage(buffer);
          } else if (fd === 2) {
            stderr += decoder.decode(buffer);
            let parts = stderr.split("\\n");
            if (parts.length > 1)
              console.log(parts.slice(0, -1).join("\\n"));
            stderr = parts[parts.length - 1];
          } else {
            throw new Error("Bad write");
          }
          return buffer.length;
        };
        let stdin = [];
        let resumeStdin;
        let stdinPos = 0;
        onmessage = ({ data }) => {
          if (data.length > 0) {
            stdin.push(data);
            if (resumeStdin)
              resumeStdin();
          }
          return go;
        };
        fs.read = (fd, buffer, offset, length, position, callback) => {
          if (fd !== 0 || offset !== 0 || length !== buffer.length || position !== null) {
            throw new Error("Bad read");
          }
          if (stdin.length === 0) {
            resumeStdin = () => fs.read(fd, buffer, offset, length, position, callback);
            return;
          }
          let first = stdin[0];
          let count = Math.max(0, Math.min(length, first.length - stdinPos));
          buffer.set(first.subarray(stdinPos, stdinPos + count), offset);
          stdinPos += count;
          if (stdinPos === first.length) {
            stdin.shift();
            stdinPos = 0;
          }
          callback(null, count);
        };
        let go = new globalThis.Go();
        go.argv = ["", \`--service=\${"0.20.1"}\`];
        tryToInstantiateModule(wasm, go).then(
          (instance) => {
            postMessage(null);
            go.run(instance);
          },
          (error) => {
            postMessage(error);
          }
        );
        return go;
      };
      function tryToInstantiateModule(wasm, go) {
        return __async(this, null, function* () {
          if (wasm instanceof WebAssembly.Module) {
            return WebAssembly.instantiate(wasm, go.importObject);
          }
          const res = yield fetch(wasm);
          if (!res.ok)
            throw new Error(\`Failed to download \${JSON.stringify(wasm)}\`);
          if ("instantiateStreaming" in WebAssembly && /^application\\/wasm($|;)/i.test(res.headers.get("Content-Type") || "")) {
            const result2 = yield WebAssembly.instantiateStreaming(res, go.importObject);
            return result2.instance;
          }
          const bytes = yield res.arrayBuffer();
          const result = yield WebAssembly.instantiate(bytes, go.importObject);
          return result.instance;
        });
      }
      return (m) => onmessage(m);
    })(postMessage)`],{type:"text/javascript"});p=new Worker(URL.createObjectURL(D))}else{let D=(G=>{var me=(S,le,ce)=>new Promise((_,h)=>{var u=j=>{try{k(ce.next(j))}catch(O){h(O)}},d=j=>{try{k(ce.throw(j))}catch(O){h(O)}},k=j=>j.done?_(j.value):Promise.resolve(j.value).then(u,d);k((ce=ce.apply(S,le)).next())});let se,Q={};for(let S=self;S;S=Object.getPrototypeOf(S))for(let le of Object.getOwnPropertyNames(S))le in Q||Object.defineProperty(Q,le,{get:()=>self[le]});(()=>{const S=()=>{const _=new Error("not implemented");return _.code="ENOSYS",_};if(!Q.fs){let _="";Q.fs={constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1},writeSync(h,u){_+=ce.decode(u);const d=_.lastIndexOf(`
`);return d!=-1&&(console.log(_.substring(0,d)),_=_.substring(d+1)),u.length},write(h,u,d,k,j,O){if(d!==0||k!==u.length||j!==null){O(S());return}const B=this.writeSync(h,u);O(null,B)},chmod(h,u,d){d(S())},chown(h,u,d,k){k(S())},close(h,u){u(S())},fchmod(h,u,d){d(S())},fchown(h,u,d,k){k(S())},fstat(h,u){u(S())},fsync(h,u){u(null)},ftruncate(h,u,d){d(S())},lchown(h,u,d,k){k(S())},link(h,u,d){d(S())},lstat(h,u){u(S())},mkdir(h,u,d){d(S())},open(h,u,d,k){k(S())},read(h,u,d,k,j,O){O(S())},readdir(h,u){u(S())},readlink(h,u){u(S())},rename(h,u,d){d(S())},rmdir(h,u){u(S())},stat(h,u){u(S())},symlink(h,u,d){d(S())},truncate(h,u,d){d(S())},unlink(h,u){u(S())},utimes(h,u,d,k){k(S())}}}if(Q.process||(Q.process={getuid(){return-1},getgid(){return-1},geteuid(){return-1},getegid(){return-1},getgroups(){throw S()},pid:-1,ppid:-1,umask(){throw S()},cwd(){throw S()},chdir(){throw S()}}),!Q.crypto)throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");if(!Q.performance)throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");if(!Q.TextEncoder)throw new Error("globalThis.TextEncoder is not available, polyfill required");if(!Q.TextDecoder)throw new Error("globalThis.TextDecoder is not available, polyfill required");const le=new TextEncoder("utf-8"),ce=new TextDecoder("utf-8");Q.Go=class{constructor(){this.argv=["js"],this.env={},this.exit=t=>{t!==0&&console.warn("exit code:",t)},this._exitPromise=new Promise(t=>{this._resolveExitPromise=t}),this._pendingEvent=null,this._scheduledTimeouts=new Map,this._nextCallbackTimeoutID=1;const _=(t,l)=>{this.mem.setUint32(t+0,l,!0),this.mem.setUint32(t+4,Math.floor(l/4294967296),!0)},h=t=>{const l=this.mem.getUint32(t+0,!0),w=this.mem.getInt32(t+4,!0);return l+w*4294967296},u=t=>{const l=this.mem.getFloat64(t,!0);if(l===0)return;if(!isNaN(l))return l;const w=this.mem.getUint32(t,!0);return this._values[w]},d=(t,l)=>{if(typeof l=="number"&&l!==0){if(isNaN(l)){this.mem.setUint32(t+4,2146959360,!0),this.mem.setUint32(t,0,!0);return}this.mem.setFloat64(t,l,!0);return}if(l===void 0){this.mem.setFloat64(t,0,!0);return}let C=this._ids.get(l);C===void 0&&(C=this._idPool.pop(),C===void 0&&(C=this._values.length),this._values[C]=l,this._goRefCounts[C]=0,this._ids.set(l,C)),this._goRefCounts[C]++;let U=0;switch(typeof l){case"object":l!==null&&(U=1);break;case"string":U=2;break;case"symbol":U=3;break;case"function":U=4;break}this.mem.setUint32(t+4,2146959360|U,!0),this.mem.setUint32(t,C,!0)},k=t=>{const l=h(t+0),w=h(t+8);return new Uint8Array(this._inst.exports.mem.buffer,l,w)},j=t=>{const l=h(t+0),w=h(t+8),C=new Array(w);for(let U=0;U<w;U++)C[U]=u(l+U*8);return C},O=t=>{const l=h(t+0),w=h(t+8);return ce.decode(new DataView(this._inst.exports.mem.buffer,l,w))},B=Date.now()-performance.now();this.importObject={go:{"runtime.wasmExit":t=>{t>>>=0;const l=this.mem.getInt32(t+8,!0);this.exited=!0,delete this._inst,delete this._values,delete this._goRefCounts,delete this._ids,delete this._idPool,this.exit(l)},"runtime.wasmWrite":t=>{t>>>=0;const l=h(t+8),w=h(t+16),C=this.mem.getInt32(t+24,!0);Q.fs.writeSync(l,new Uint8Array(this._inst.exports.mem.buffer,w,C))},"runtime.resetMemoryDataView":t=>{this.mem=new DataView(this._inst.exports.mem.buffer)},"runtime.nanotime1":t=>{t>>>=0,_(t+8,(B+performance.now())*1e6)},"runtime.walltime":t=>{t>>>=0;const l=new Date().getTime();_(t+8,l/1e3),this.mem.setInt32(t+16,l%1e3*1e6,!0)},"runtime.scheduleTimeoutEvent":t=>{t>>>=0;const l=this._nextCallbackTimeoutID;this._nextCallbackTimeoutID++,this._scheduledTimeouts.set(l,setTimeout(()=>{for(this._resume();this._scheduledTimeouts.has(l);)console.warn("scheduleTimeoutEvent: missed timeout event"),this._resume()},h(t+8)+1)),this.mem.setInt32(t+16,l,!0)},"runtime.clearTimeoutEvent":t=>{t>>>=0;const l=this.mem.getInt32(t+8,!0);clearTimeout(this._scheduledTimeouts.get(l)),this._scheduledTimeouts.delete(l)},"runtime.getRandomData":t=>{t>>>=0,crypto.getRandomValues(k(t+8))},"syscall/js.finalizeRef":t=>{t>>>=0;const l=this.mem.getUint32(t+8,!0);if(this._goRefCounts[l]--,this._goRefCounts[l]===0){const w=this._values[l];this._values[l]=null,this._ids.delete(w),this._idPool.push(l)}},"syscall/js.stringVal":t=>{t>>>=0,d(t+24,O(t+8))},"syscall/js.valueGet":t=>{t>>>=0;const l=Reflect.get(u(t+8),O(t+16));t=this._inst.exports.getsp()>>>0,d(t+32,l)},"syscall/js.valueSet":t=>{t>>>=0,Reflect.set(u(t+8),O(t+16),u(t+32))},"syscall/js.valueDelete":t=>{t>>>=0,Reflect.deleteProperty(u(t+8),O(t+16))},"syscall/js.valueIndex":t=>{t>>>=0,d(t+24,Reflect.get(u(t+8),h(t+16)))},"syscall/js.valueSetIndex":t=>{t>>>=0,Reflect.set(u(t+8),h(t+16),u(t+24))},"syscall/js.valueCall":t=>{t>>>=0;try{const l=u(t+8),w=Reflect.get(l,O(t+16)),C=j(t+32),U=Reflect.apply(w,l,C);t=this._inst.exports.getsp()>>>0,d(t+56,U),this.mem.setUint8(t+64,1)}catch(l){t=this._inst.exports.getsp()>>>0,d(t+56,l),this.mem.setUint8(t+64,0)}},"syscall/js.valueInvoke":t=>{t>>>=0;try{const l=u(t+8),w=j(t+16),C=Reflect.apply(l,void 0,w);t=this._inst.exports.getsp()>>>0,d(t+40,C),this.mem.setUint8(t+48,1)}catch(l){t=this._inst.exports.getsp()>>>0,d(t+40,l),this.mem.setUint8(t+48,0)}},"syscall/js.valueNew":t=>{t>>>=0;try{const l=u(t+8),w=j(t+16),C=Reflect.construct(l,w);t=this._inst.exports.getsp()>>>0,d(t+40,C),this.mem.setUint8(t+48,1)}catch(l){t=this._inst.exports.getsp()>>>0,d(t+40,l),this.mem.setUint8(t+48,0)}},"syscall/js.valueLength":t=>{t>>>=0,_(t+16,parseInt(u(t+8).length))},"syscall/js.valuePrepareString":t=>{t>>>=0;const l=le.encode(String(u(t+8)));d(t+16,l),_(t+24,l.length)},"syscall/js.valueLoadString":t=>{t>>>=0;const l=u(t+8);k(t+16).set(l)},"syscall/js.valueInstanceOf":t=>{t>>>=0,this.mem.setUint8(t+24,u(t+8)instanceof u(t+16)?1:0)},"syscall/js.copyBytesToGo":t=>{t>>>=0;const l=k(t+8),w=u(t+32);if(!(w instanceof Uint8Array||w instanceof Uint8ClampedArray)){this.mem.setUint8(t+48,0);return}const C=w.subarray(0,l.length);l.set(C),_(t+40,C.length),this.mem.setUint8(t+48,1)},"syscall/js.copyBytesToJS":t=>{t>>>=0;const l=u(t+8),w=k(t+16);if(!(l instanceof Uint8Array||l instanceof Uint8ClampedArray)){this.mem.setUint8(t+48,0);return}const C=w.subarray(0,l.length);l.set(C),_(t+40,C.length),this.mem.setUint8(t+48,1)},debug:t=>{console.log(t)}}}}run(_){return me(this,null,function*(){if(!(_ instanceof WebAssembly.Instance))throw new Error("Go.run: WebAssembly.Instance expected");this._inst=_,this.mem=new DataView(this._inst.exports.mem.buffer),this._values=[NaN,0,null,!0,!1,Q,this],this._goRefCounts=new Array(this._values.length).fill(1/0),this._ids=new Map([[0,1],[null,2],[!0,3],[!1,4],[Q,5],[this,6]]),this._idPool=[],this.exited=!1;let h=4096;const u=t=>{const l=h,w=le.encode(t+"\0");return new Uint8Array(this.mem.buffer,h,w.length).set(w),h+=w.length,h%8!==0&&(h+=8-h%8),l},d=this.argv.length,k=[];this.argv.forEach(t=>{k.push(u(t))}),k.push(0),Object.keys(this.env).sort().forEach(t=>{k.push(u(`${t}=${this.env[t]}`))}),k.push(0);const O=h;if(k.forEach(t=>{this.mem.setUint32(h,t,!0),this.mem.setUint32(h+4,0,!0),h+=8}),h>=12288)throw new Error("total length of command line and environment variables exceeds limit");this._inst.exports.run(d,O),this.exited&&this._resolveExitPromise(),yield this._exitPromise})}_resume(){if(this.exited)throw new Error("Go program has already exited");this._inst.exports.resume(),this.exited&&this._resolveExitPromise()}_makeFuncWrapper(_){const h=this;return function(){const u={id:_,this:this,args:arguments};return h._pendingEvent=u,h._resume(),u.result}}}})(),se=({data:S})=>{let le=new TextDecoder,ce=Q.fs,_="";ce.writeSync=(j,O)=>{if(j===1)G(O);else if(j===2){_+=le.decode(O);let B=_.split(`
`);B.length>1&&console.log(B.slice(0,-1).join(`
`)),_=B[B.length-1]}else throw new Error("Bad write");return O.length};let h=[],u,d=0;se=({data:j})=>(j.length>0&&(h.push(j),u&&u()),k),ce.read=(j,O,B,t,l,w)=>{if(j!==0||B!==0||t!==O.length||l!==null)throw new Error("Bad read");if(h.length===0){u=()=>ce.read(j,O,B,t,l,w);return}let C=h[0],U=Math.max(0,Math.min(t,C.length-d));O.set(C.subarray(d,d+U),B),d+=U,d===C.length&&(h.shift(),d=0),w(null,U)};let k=new Q.Go;return k.argv=["","--service=0.20.1"],Ee(S,k).then(j=>{G(null),k.run(j)},j=>{G(j)}),k};function Ee(S,le){return me(this,null,function*(){if(S instanceof WebAssembly.Module)return WebAssembly.instantiate(S,le.importObject);const ce=yield fetch(S);if(!ce.ok)throw new Error(`Failed to download ${JSON.stringify(S)}`);if("instantiateStreaming"in WebAssembly&&/^application\/wasm($|;)/i.test(ce.headers.get("Content-Type")||""))return(yield WebAssembly.instantiateStreaming(ce,le.importObject)).instance;const _=yield ce.arrayBuffer();return(yield WebAssembly.instantiate(_,le.importObject)).instance})}return S=>se(S)})(G=>p.onmessage({data:G})),z;p={onmessage:null,postMessage:G=>setTimeout(()=>z=D({data:G})),terminate(){if(z)for(let G of z._scheduledTimeouts.values())clearTimeout(G)}}}let x,P;const b=new Promise((D,z)=>{x=D,P=z});p.onmessage=({data:D})=>{p.onmessage=({data:z})=>I(z),D?P(D):x()},p.postMessage(s||new URL(r,location.href).toString());let{readFromStdout:I,service:m}=yt({writeToStdin(D){p.postMessage(D)},isSync:!1,hasFS:!1,esbuild:Z});yield b,vt=()=>{p.terminate(),ze=void 0,vt=void 0,xt=void 0},xt={build:D=>new Promise((z,G)=>m.buildOrContext({callName:"build",refs:null,options:D,isTTY:!1,defaultWD:"/",callback:(me,se)=>me?G(me):z(se)})),context:D=>new Promise((z,G)=>m.buildOrContext({callName:"context",refs:null,options:D,isTTY:!1,defaultWD:"/",callback:(me,se)=>me?G(me):z(se)})),transform:(D,z)=>new Promise((G,me)=>m.transform({callName:"transform",refs:null,input:D,options:z||{},isTTY:!1,fs:{readFile(se,Q){Q(new Error("Internal error"),null)},writeFile(se,Q){Q(null)}},callback:(se,Q)=>se?me(se):G(Q)})),formatMessages:(D,z)=>new Promise((G,me)=>m.formatMessages({callName:"formatMessages",refs:null,messages:D,options:z,callback:(se,Q)=>se?me(se):G(Q)})),analyzeMetafile:(D,z)=>new Promise((G,me)=>m.analyzeMetafile({callName:"analyzeMetafile",refs:null,metafile:typeof D=="string"?D:JSON.stringify(D),options:z,callback:(se,Q)=>se?me(se):G(Q)}))}}),Sn=Z})(n)})(xn);var cn=xn.exports;const mi="/assets/esbuild-DPD0d1iy.wasm";let Mt;const pi=/^(?:[ \t]*<\?php)?[ \t/*#@]*Plugin Name:(.*)$/im,gi=async n=>{Mt===void 0&&(Mt=cn.initialize({worker:!0,wasmURL:mi}));const e=n.map(async g=>{if(g.name.match(/(\/|^)block.json$/))return[g,{name:g.name+".esmodule.js",contents:`export default ${g.contents}`}];if(g.name.endsWith(".php")&&pi.test(g.contents.substring(0,4096)))return[{...g,contents:yi(g.contents,n)}];if(g.name.endsWith(".js")){await Mt;try{const L=await cn.transform(g.contents,{loader:"jsx",target:"esnext",jsxFactory:"wp.element.createElement",format:"esm"});return[{name:g.name+".src",contents:g.contents},{name:g.name,contents:L.code}]}catch(L){return[{file:g,error:L}]}}return[g]}),a=(await Promise.all(e)).flatMap(g=>g),i=a.filter(g=>"name"in g),f=a.filter(g=>g.error!==void 0);return{transpiledFiles:i,failures:f}};function yi(n,e){const a=e.map(f=>f.name).filter(f=>f.endsWith(".json")),i=e.map(f=>f.name).filter(f=>f.endsWith(".js")).concat(a.map(f=>f+".esmodule.js"));return n=n.trim(),n.endsWith("?>")||(n+="?>"),`${n}<?php
	// Preload ES Modules using <link rel="modulepreload" href="" /> to prevent a
	// "block isn't registered" warning in the editor. This ensures the registerBlockType()
	// call is done before the block is rendered.
	function playground_block_add_modulepreload_in_admin() {
		$js_relative_paths = ${dt(i)};
		foreach($js_relative_paths as $relative_path) {
			$file = basename($relative_path);
			$url = json_encode(plugins_url($relative_path, __FILE__));
			$script = <<<SCRIPT
			(function() {
			  const link = document.createElement("link");
			  link.rel = "modulepreload";
			  link.href = $url;
			  document.head.append(link);
			})();
SCRIPT;
			wp_add_inline_script('wp-blocks', $script);
		}
	}
	add_action('enqueue_block_editor_assets', 'playground_block_add_modulepreload_in_admin');
	
	// Remap ESM imports from block.json, that aren't widely supported,
	// to imports from a JavaScript file, that are widely supported.
	function playground_wp_esm_import_map($import_map) {
		$json_paths = ${dt(a)};
		$json_mapping = array();
		foreach($json_paths as $json_path) {
			$json_path = plugins_url($json_path, __FILE__);
			$js_path = plugins_url($json_path . '.esmodule.js', __FILE__);
			$json_mapping[$json_path] = $js_path;
		}
		return array_merge($import_map, $json_mapping);
	}
	add_filter('wp_esm_import_map', 'playground_wp_esm_import_map');
	`}const kn=["blueprint","blueprintUrl","codeEditorErrorLog","constants","files"];function bi(n){return new TextEncoder().encode(n)}function wi(n){return new TextDecoder().decode(n)}function vi(n){let e="";for(let a=0;a<n.byteLength;a++)e+=String.fromCharCode(n[a]);return window.btoa(e)}function xi(n){const e=window.atob(n),a=new Uint8Array(e.length);for(let i=0;i<e.length;i++)a[i]=e.charCodeAt(i);return a}function Et(n){return vi(bi(n))}function Wt(n){return wi(xi(n))}function ki(n){const e={};for(const[a,i]of Object.entries(n))kn.includes(a)?a==="files"&&Array.isArray(i)?e[a]=[Et(JSON.stringify(i))]:typeof i=="string"?e[a]=Et(i):typeof i=="object"&&i!==null?e[a]=Et(JSON.stringify(i)):e[a]=i:e[a]=i;return e}function un(n){const e={};for(const a in n){let i=n[a];if(a==="files"&&(i=i[0]),!kn.includes(a)||typeof i!="string"){e[a]=n[a];continue}if(a in n)try{e[a]=JSON.parse(Wt(i))}catch{e[a]=n[a]}}return e}function _i({className:n,size:e=24}){return v.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",width:e,height:e,className:n,"aria-hidden":"true",focusable:"false",children:v.jsx("path",{d:"M11 12.5V17.5H12.5V12.5H17.5V11H12.5V6H11V11H6V12.5H11Z"})})}function Ei({className:n,size:e=24}){return v.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",width:e,height:e,className:n,"aria-hidden":"true",focusable:"false",children:v.jsx("path",{d:"M18 11.3l-1-1.1-4.5 4.55V4h-1.5v10.75L6.5 10.2l-1 1.1 6.5 6.45 6-6.45zM17.5 18.5v-1.5h-11v1.5h11z"})})}function Si({className:n,size:e=24}){return v.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",width:e,height:e,className:n,"aria-hidden":"true",focusable:"false",children:v.jsx("path",{d:"M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM15.5303 8.46967L12 12L8.46967 8.46967L7.46967 9.46967L11 13L7.46967 16.5303L8.46967 17.5303L12 14L15.5303 17.5303L16.5303 16.5303L13 13L16.5303 9.46967L15.5303 8.46967Z"})})}function ji({className:n,size:e=24}){return v.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"-2 -2 24 24",width:e,height:e,className:n,"aria-hidden":"true",focusable:"false",children:v.jsx("path",{d:"M20 10c0-5.51-4.49-10-10-10C4.48 0 0 4.49 0 10c0 5.52 4.48 10 10 10 5.51 0 10-4.48 10-10zM7.78 15.37L4.37 6.22c.55-.02 1.17-.08 1.17-.08.5-.06.44-1.13-.06-1.11 0 0-1.45.11-2.37.11-.18 0-.37 0-.58-.01C4.12 2.69 6.87 1.11 10 1.11c2.33 0 4.45.87 6.05 2.34-.68-.11-1.65.39-1.65 1.58 0 .74.45 1.36.9 2.1.35.61.55 1.36.55 2.46 0 1.49-1.4 5-1.4 5l-3.03-8.37c.54-.02.82-.17.82-.17.5-.05.44-1.25-.06-1.22 0 0-1.44.12-2.38.12-.87 0-2.33-.12-2.33-.12-.5-.03-.56 1.2-.06 1.22l.92.08 1.26 3.41zM17.41 10c.24-.64.74-1.87.43-4.25.7 1.29 1.05 2.71 1.05 4.25 0 3.29-1.73 6.24-4.4 7.78.97-2.59 1.94-5.2 2.92-7.78zM6.1 18.09C3.12 16.65 1.11 13.53 1.11 10c0-1.3.23-2.48.72-3.59C3.25 10.3 4.67 14.2 6.1 18.09zm4.03-6.63l2.58 6.98c-.86.29-1.76.45-2.71.45-.79 0-1.57-.11-2.29-.33.81-2.38 1.62-4.74 2.42-7.1z"})})}function Pi({className:n,size:e=24}){return v.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",width:e,height:e,className:n,"aria-hidden":"true",focusable:"false",children:v.jsx("path",{d:"M20.1 5.1L16.9 2 6.2 12.7l-1.3 4.4 4.5-1.3L20.1 5.1zM4 20.8h16v-1.5H4v1.5z"})})}function Ci({className:n,size:e=24}){return v.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",width:e,height:e,className:n,"aria-hidden":"true",focusable:"false",children:v.jsx("path",{d:"M15.6 7.2H14v1.5h1.6c2 0 3.7 1.7 3.7 3.7s-1.7 3.7-3.7 3.7H14v1.5h1.6c2.8 0 5.2-2.3 5.2-5.2 0-2.9-2.3-5.2-5.2-5.2zM4.7 12.4c0-2 1.7-3.7 3.7-3.7H10V7.2H8.4c-2.9 0-5.2 2.3-5.2 5.2 0 2.9 2.3 5.2 5.2 5.2H10v-1.5H8.4c-2 0-3.7-1.7-3.7-3.7zm4.6.9h5.3v-1.5H9.3v1.5z"})})}function Ti({className:n,size:e=24}){return v.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",width:e,height:e,className:n,"aria-hidden":"true",focusable:"false",children:v.jsx("path",{d:"M6 4l14 8-14 8V4z"})})}const dn={css:yr(),html:gr(),js:Ht(),jsx:Ht({jsx:!0}),json:wr(),php:pr()};function $i(n){return n in dn?[dn[n]]:[]}function Ri(n){const e=new URL(n,"https://playground.wordpress.net");return e.searchParams.has("__playground_refresh")?e.searchParams.delete("__playground_refresh"):e.searchParams.set("__playground_refresh","1"),e.pathname+e.search}function fn(...n){const e=[];for(const a of n)if(typeof a=="string")e.push(a);else if(typeof a=="object"&&a!==null)for(const[i,f]of Object.entries(a))f&&e.push(i);return e.join(" ")}function Ut({blueprint:n="",blueprintUrl:e="",configurationSource:a="block-attributes",codeEditor:i=!0,codeEditorMode:f="plugin",codeEditorSideBySide:g=!0,codeEditorReadOnly:L=!1,codeEditorTranspileJsx:R=!1,codeEditorErrorLog:N=!1,constants:W={},logInUser:Z=!0,createNewPost:ue=!1,createNewPostType:ae="post",createNewPostTitle:ie=ai("New post"),createNewPostContent:T="",redirectToPost:M=!1,redirectToPostType:X="front",landingPageUrl:ye="/",files:_e=[],showAddNewFile:A=!1,showFileControls:E=!1,requireLivePreviewActivation:F=!0,inFullPageView:ne=!1,baseAttributesForFullPageView:de={},onStateChange:V}){const{files:y,addFile:Pe,isLoading:Ce,updateFile:Re,removeFile:pe,activeFile:xe,activeFileIndex:Je,setActiveFileIndex:De}=oi(_e||[],{withErrorLog:N,getErrors:async()=>await Fe.current?.readFileAsText("/internal/stderr")||""}),je=q.useId(),Me=q.useId(),Ve=q.useRef(null),tt=q.useRef(null),at=q.useRef(null),Fe=q.useRef(null),c=q.useRef(null),be=q.useRef(null),ot=q.useRef(null);q.useEffect(()=>{if(!ot.current?.view)return;const oe=ot.current.view;function he(Oe){Oe.stopPropagation()}return oe.dom.addEventListener("keydown",he),oe.dom.addEventListener("keypress",he),oe.dom.addEventListener("keyup",he),()=>{oe.dom.removeEventListener("keydown",he),oe.dom.removeEventListener("keyup",he),oe.dom.removeEventListener("keypress",he)}},[]);const[Ue,Qe]=q.useState(!F),[ve,gt]=q.useState(0),[jt,Pt]=q.useState(!1),yt="playground-block-dismiss-exit-editor-tip",[Ct,Tt]=q.useState(typeof localStorage<"u"&&localStorage[yt]==="true");function bt(){be?.current&&be.current.focus(),typeof localStorage<"u"&&(localStorage[yt]="true"),Tt(!0),qt("Notice dismissed.")}q.useEffect(()=>{V?.({client:Fe.current,postId:ve,files:y})},[Fe.current,ve,y,V]);const nt=xe?.name.split(".").pop()||"";q.useEffect(()=>{async function oe(){if(!Ue||!Ve.current)return;let he;try{a==="blueprint-json"?n&&(he=JSON.parse(n)):a==="blueprint-url"?e&&(he=await fetch(e).then(Be=>Be.json())):he={preferredVersions:{wp:"latest",php:"7.4"},steps:[{step:"defineWpConfigConsts",consts:W},Z&&{step:"login",username:"admin",password:"password"}].filter(Boolean)}}catch(Be){console.error("Failed to parse blueprint:",Be)}const Oe={iframe:Ve.current,remoteUrl:"https://playground.wordpress.net/remote.html"};he&&(Oe.blueprint=he),console.log("Initializing Playground");const Ne=await br(Oe);if(await Ne.isReady(),Fe.current=Ne,Pt(!0),setTimeout(()=>qt("WordPress Playground loaded."),500),await lt(),a==="block-attributes"){let Be=0;if(ue){const Lt=await Ne.documentRoot,{text:ze}=await Ne.run({code:`<?php
						require("${Lt}/wp-load.php");

						$post_id = wp_insert_post([
							'post_title' => ${dt(ie)},
							'post_content' => ${dt(T)},
							'post_status' => 'publish',
							'post_type' => ${dt(ae)},
						]);

						echo $post_id;
					`});gt(parseInt(ze)),Be=parseInt(ze)}const Nt=wt(Be);await Ne.goTo(Nt)}else he||await Ne.goTo("/")}oe()},[Ue]);function Ke(){const oe=new URL(window.location.href);oe.search="?playground-full-page";const he={...de,requireLivePreviewActivation:!1,files:y.filter(Ne=>!Ze(Ne))},Oe=Et(JSON.stringify(ki(he)));return oe.searchParams.append("playground-attributes",Oe),oe.toString()}function wt(oe=ve){if(ue&&M){if(X==="front")return`/?p=${oe}`;if(X==="admin")return`/wp-admin/post.php?post=${oe}&action=edit`}return ye}const[Ye,qe]=q.useState([]);async function lt(){if(!Fe.current||!i)return;qe([]);const oe=Fe.current;let he=y;if(R){const{failures:Oe,transpiledFiles:Ne}=await gi(he);if(Oe.length){for(const Be of Oe)console.error(`Failed to transpile ${Be.file.name}:`,Be.error);qe(Oe);return}he=Ne}f==="theme"?await ci(oe,he):await li(oe,he)}async function Ie(){if(!Ue)Qe(!0);else{await lt();const oe=await Fe.current.getCurrentURL();await Fe.current.goTo(Ri(oe))}}const rt=Vt.of([{key:"Mod-s",run(){return Ie(),!0}}]),$t=fn("wordpress-playground-main-container",{"is-full-page-view":ne}),Rt=fn("wordpress-playground-content-container",{"is-one-under-another":!g,"is-side-by-side":g}),Ft=jt?"Loaded":"Loading",It="Not Activated",Ot=ft("Beginning of Playground Preview - %s",Ue?Ft:It);return v.jsxs("section",{"aria-label":"WordPress Playground",className:`wp-block-wordpress-playground-playground ${$t}`,children:[v.jsxs("div",{className:Rt,children:[i&&v.jsxs("div",{className:"code-container",children:[v.jsx(hi,{ref:c,updateFile:Re,addFile:Pe,setActiveFileIndex:De,files:y,activeFileIndex:Je}),v.jsxs("div",{className:"file-tabs",children:[Ce?v.jsxs("div",{className:"file-tab file-tab-loading",children:[v.jsx("span",{className:"spinner"})," ","Loading files..."]}):y.map((oe,he)=>v.jsxs("button",{type:"button",className:`file-tab ${he===Je?"file-tab-active":""}`,"aria-label":L||Ze(oe)?ft("Read-only file: %s",oe.name):ft("File: %s",oe.name),"aria-current":he===Je?"true":"false",onClick:()=>De(he),onDoubleClick:()=>c.current?.setEditFileNameModalOpen(!0),children:[oe.remoteUrl&&v.jsx(Ci,{}),oe.name]},oe.name)),A&&v.jsx("button",{type:"button","aria-label":"Add File",className:"file-tab file-tab-extra",onClick:()=>c.current?.setNewFileModalOpen(!0),children:v.jsx(_i,{})}),v.jsx("button",{ref:be,type:"button","aria-label":"Download Code as a Zip file",className:"file-tab file-tab-extra",onClick:()=>{Fe.current&&ui(Fe.current,f)},children:v.jsx(Ei,{})})]}),!Ct&&v.jsxs("button",{type:"button",className:"playground-block-exit-editor-tip",onClick:bt,children:["Press ",v.jsx("code",{children:"Esc"}),", ",v.jsx("code",{children:"Tab"})," to exit the editor. ",v.jsx("span",{className:"playground-block-exit-editor-tip-dismiss-notice",children:"(Click to dismiss this notice.)"})]}),v.jsx("div",{className:"code-editor-wrapper",children:v.jsx(wn,{ref:ot,value:xe?.contents||"",extensions:[rt,We.lineWrapping,...$i(nt)],readOnly:L||Ze(y[Je]),onChange:oe=>Re(he=>({...he,contents:oe}))})}),v.jsxs("div",{className:"actions-bar",children:[E?v.jsxs("div",{className:"file-actions",children:[xe&&!Ze(xe)&&v.jsxs("button",{type:"button",onClick:()=>c.current?.setEditFileNameModalOpen(!0),className:"wordpress-playground-block-button button-non-destructive",children:[v.jsx(Pi,{})," ","Edit file name"]}),!Ze(xe)&&y.filter(oe=>!Ze(oe)).length>1&&v.jsxs("button",{type:"button",className:"wordpress-playground-block-button button-destructive",onClick:()=>{De(0),pe(Je)},children:[v.jsx(Si,{})," ","Remove file"]})]}):v.jsx("div",{className:"file-actions"}),v.jsxs("button",{type:"button",onClick:Ie,className:"wordpress-playground-run-button playground-button playground-button-primary","aria-describedby":F&&!Ue?je:void 0,children:["Run"," ",v.jsx(Ti,{})]}),F&&!Ue&&v.jsx("span",{id:je,className:"screen-reader-text",children:"This button runs the code in the Preview iframe. If the Preview iframe has not yet been activated, this button creates the Preview iframe which contains a full WordPress website and may be a challenge for screen readers."})]})]}),v.jsxs("div",{className:"playground-container",children:[!ne&&v.jsxs(v.Fragment,{children:[v.jsx("span",{className:"screen-reader-text wordpress-playground-before-preview",tabIndex:-1,ref:tt,children:Ot}),v.jsx("button",{type:"button",className:"screen-reader-text",onClick:()=>{at.current?.focus()},children:"Skip Playground Preview"})]}),!Ue&&v.jsxs("div",{className:"playground-activation-placeholder",children:[v.jsx("button",{type:"button",className:"wordpress-playground-activate-button playground-button playground-button-primary",onClick:()=>{Qe(!0),tt.current?.focus()},"aria-describedby":Me,children:"Activate Live Preview"}),v.jsx("span",{id:Me,className:"screen-reader-text",children:"This button creates the Preview iframe containing a full WordPress website which may be a challenge for screen readers."})]}),Ye.length>0&&v.jsxs("div",{className:"playground-transpilation-failures",children:[v.jsx("h3",{children:"Transpilation Error"}),v.jsx("p",{children:"There were errors while transpiling the code. Please fix the errors and try again."}),v.jsx("ul",{children:Ye.map(({file:oe,error:he})=>v.jsxs("li",{children:[v.jsx("b",{children:oe.name}),v.jsx("p",{children:he.message})]},oe.name))})]}),Ue&&v.jsx("iframe",{title:"Live Preview in WordPress Playground",ref:Ve,className:"playground-iframe"},"playground-iframe"),!ne&&v.jsx("span",{className:"screen-reader-text wordpress-playground-end-of-preview",tabIndex:-1,ref:at,children:"End of Playground Preview"})]})]}),v.jsxs("footer",{className:"wordpress-playground-footer",children:[v.jsxs("a",{href:"https://w.org/playground",className:"wordpress-playground-footer__powered_by_link",target:"_blank",rel:"noopener noreferrer","aria-label":"Powered by WordPress Playground",children:[v.jsx("span",{className:"wordpress-playground-footer__powered_text",children:"Powered by"}),v.jsx("span",{className:"wordpress-playground-footer__spacing",children:" "}),v.jsx(ji,{className:"wordpress-playground-footer__icon"}),v.jsx("span",{className:"wordpress-playground-footer__powered_by_link-text",children:"WordPress Playground"})]}),!ne&&v.jsx("button",{type:"button",className:"wordpress-playground-footer__full-page-link",onClick:()=>window.open(Ke(),"_blank"),"aria-label":"Open in New Tab",children:"Open in New Tab"})]})]})}function hn(){const n=document.getElementById("root");if(!n){console.error("Root element not found");return}const e=new URLSearchParams(window.location.search);if(e.has("playground-full-page")&&e.has("playground-attributes")){const a=e.get("playground-attributes");try{const i=Wt(a),f=un(JSON.parse(i));At(n).render(v.jsx(Ut,{...f,inFullPageView:!0}))}catch(i){console.error("Failed to parse playground attributes:",i),n.innerHTML=`
				<div style="padding: 20px; font-family: sans-serif;">
					<h1>Error Loading Playground</h1>
					<p>Failed to parse the playground configuration from the URL.</p>
					<p>Error: ${i instanceof Error?i.message:"Unknown error"}</p>
				</div>
			`}}else if(e.has("playground-attributes")){const a=e.get("playground-attributes");try{const i=Wt(a),f=un(JSON.parse(i));At(n).render(v.jsx(Ut,{...f,baseAttributesForFullPageView:f}))}catch(i){console.error("Failed to parse playground attributes:",i),n.innerHTML=`
				<div style="padding: 20px; font-family: sans-serif;">
					<h1>Error Loading Playground</h1>
					<p>Failed to parse the playground configuration from the URL.</p>
				</div>
			`}}else At(n).render(v.jsx(Ut,{codeEditor:!0,codeEditorReadOnly:!1,codeEditorSideBySide:!0,codeEditorTranspileJsx:!1,codeEditorMultipleFiles:!0,codeEditorMode:"plugin",logInUser:!0,landingPageUrl:"/",createNewPost:!1,createNewPostType:"post",createNewPostTitle:"New post",createNewPostContent:"",redirectToPost:!1,redirectToPostType:"front",blueprint:"",blueprintUrl:"",configurationSource:"block-attributes",requireLivePreviewActivation:!0,codeEditorErrorLog:!1,constants:{},files:[{name:"plugin.php",contents:`<?php
/**
 * Plugin Name: My first plugin
 */

add_filter('the_content', function($content) {
    return '<h1>Hello from my plugin!</h1>' . $content;
});
`}],inFullPageView:!1,baseAttributesForFullPageView:{}}))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",hn):hn();
//# sourceMappingURL=main-BhoNWinJ.js.map
