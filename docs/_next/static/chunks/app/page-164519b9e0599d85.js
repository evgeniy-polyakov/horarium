(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{9215:function(e,t,n){Promise.resolve().then(n.bind(n,6586))},6586:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return Y}});var s,l,i=n(7437),o=n(504);function c(e){let{icon:t,hint:n,onClick:s}=e;return(0,i.jsx)("button",{className:"icon",onClick:s,title:n,children:(0,i.jsx)(o.G,{icon:t})})}var r=n(2759);class a{async load(e){let t=await new Promise(t=>{let n=new FileReader;n.addEventListener("load",e=>{var n;t(null===(n=e.target)||void 0===n?void 0:n.result)}),n.readAsText(e)});if(!t)throw Error("Cannot read file ".concat(e.name));return t}async save(e,t){let n=document.createElement("a"),s=URL.createObjectURL(new Blob([e],{type:this.mimeType}));n.href=s,n.download=t,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(s)}constructor(e,t){this.extension=e,this.mimeType=t}}let h=[new a("csv","text/csv")];(s=l||(l={})).Text="text",s.Table="table";class d{contains(e,t){for(let n=0;n<this.excluded.length;n+=2)if(this.excluded[n]===e&&this.excluded[n+1]===t)return!1;return this.inRange(e,t)}exclude(e,t){if("number"==typeof e&&"number"==typeof t)this.contains(e,t)&&this.excluded.push(e,t);else if("object"==typeof e){let t=Math.min(e.startRow,e.endRow),n=Math.max(e.startRow,e.endRow),s=Math.min(e.startCell,e.endCell),l=Math.max(e.startCell,e.endCell);for(let e=t;e<=n;e++)for(let t=s;t<=l;t++)this.exclude(e,t)}}expand(e,t){this.endRow=e,this.endCell=t,this.excluded=[]}isEmpty(){return this.excluded.length>=(1+Math.abs(this.startRow-this.endRow))*(1+Math.abs(this.startCell-this.endCell))*2}isStart(e,t){return this.startRow===e&&this.startCell===t}shiftRow(e,t){e+=t,this.startRow=e,this.endRow=e;for(let t=0;t<this.excluded.length;t+=2)this.excluded[t]=e}shiftColumn(e,t){e+=t,this.startCell=e,this.endCell=e;for(let t=1;t<this.excluded.length;t+=2)this.excluded[t]=e}inRange(e,t){return(this.startRow<=this.endRow?e>=this.startRow&&e<=this.endRow:e<=this.startRow&&e>=this.endRow)&&(this.startCell<=this.endCell?t>=this.startCell&&t<=this.endCell:t<=this.startCell&&t>=this.endCell)}constructor(e,t,n,s){this.startRow=e,this.startCell=t,this.endRow=n,this.endCell=s,this.excluded=[]}}class u{contains(e,t){return this.ranges.some(n=>n.contains(e,t))}isFocused(e,t){return 0!==this.ranges.length&&this.ranges[this.ranges.length-1].isStart(e,t)}toggleSelection(e,t,n){if(64&n)this.ranges.forEach(t=>t.shiftRow(e,-1));else if(128&n)this.ranges.forEach(t=>t.shiftRow(e,1));else if(256&n)this.ranges.forEach(e=>e.shiftColumn(t,-1));else if(512&n)this.ranges.forEach(e=>e.shiftColumn(t,1));else if(16&n)this.ranges=[new d(0,0,e,t)];else if(1024&n)this.ranges=[];else if(8&n&&4&n){if(0===this.ranges.length)this.ranges.push(new d(e,t,e,t));else{let n=this.ranges[this.ranges.length-1];n.expand(e,t),this.swallowRanges(n)}}else if(8&n)0===this.ranges.length?this.ranges.push(new d(e,t,e,t)):(this.ranges[this.ranges.length-1].expand(e,t),this.ranges=this.ranges.slice(-1));else if(4&n){if(1&n){let n=new d(e,t,e,t);this.ranges.push(n),this.swallowRanges(n)}else this.ranges.forEach(n=>n.exclude(e,t)),this.clearRanges()}else this.ranges=[new d(e,t,e,t)]}swallowRanges(e){this.ranges.forEach(t=>{t!==e&&t.exclude(e)}),this.clearRanges()}clearRanges(){this.ranges=this.ranges.filter(e=>!e.isEmpty())}constructor(){this.ranges=[]}}function f(e,t){return"update"===t.mode?{...e,file:t.file}:(e.file.cellSelection.toggleSelection(t.rowIndex,t.cellIndex,t.mode),{...e})}let x=0;class m{async load(){this.file&&(this.textContent=await this.loader.load(this.file))}async save(){await this.loader.save(this.textContent,this.filename)}constructor(e){var t;if(this.file=e,this.id=++x,this.textContent="",this.selected=!1,this.editMode=l.Table,this.cellSelection=new u,this.filename=null!==(t=null==e?void 0:e.name)&&void 0!==t?t:"untitled.csv",this.extension=this.filename.replace(/^.*\.(\w+)$/,"$1").toLowerCase(),this.loader=h.filter(e=>e.extension===this.extension)[0],!this.loader)throw Error("Unknown file extension ".concat(this.filename))}}function w(e){let{onOpen:t}=e;return(0,i.jsx)(c,{icon:r.cC_,onClick:function(){let e=document.createElement("input");e.type="file",e.multiple=!0,e.accept=h.map(e=>".".concat(e.extension,",").concat(e.mimeType)).join(","),e.onchange=async()=>{if(e.files)for(let n=0;n<e.files.length;n++){let s=new m(e.files.item(n));await s.load(),null==t||t(s)}},e.click()},hint:"Open File"})}var v=n(7188);function g(e){var t;let{item:n,onSelect:s,onRemove:l}=e,a="tab ".concat(n.selected?"selected":""," ").concat(n.editable?"editable":"");return(0,i.jsxs)("li",{className:a,children:[(0,i.jsxs)("button",{className:"label",title:null!==(t=n.hint)&&void 0!==t?t:n.name,onClick:()=>{n.selected||null==s||s()},children:[n.icon&&(0,i.jsx)("span",{className:"icon",children:(0,i.jsx)(o.G,{icon:n.icon})}),n.name&&(0,i.jsx)("span",{className:"name",children:n.name})]}),n.removable&&(0,i.jsx)(c,{icon:r.g82,hint:"Close",onClick:l})]})}function p(e){let{items:t,onRename:n,onSelect:s,onRemove:l}=e;return(0,i.jsx)("ul",{className:"tabs",children:t.map(e=>(0,i.jsx)(g,{item:e,onSelect:()=>null==s?void 0:s(e),onRemove:()=>null==l?void 0:l(e)},e.key))})}class R{get key(){return"".concat(this.file.id)}get selected(){return this.file.selected}get link(){return"/".concat(this.name)}constructor(e){this.file=e,this.name=this.file.filename,this.removable=!0,this.editable=!0}}class y{get selected(){return this.file.editMode===this.editMode}constructor(e,t,n,s){this.file=e,this.editMode=t,this.icon=n,this.hint=s,this.key=this.editMode,this.editable=!1,this.removable=!1}}function C(e){let{file:t}=e;async function n(){await t.save()}return(0,i.jsx)(c,{icon:r.kwI,onClick:n,hint:"Save File"})}function I(e){let{onOpen:t}=e;async function n(){let e=new m;await e.load(),null==t||t(e)}return(0,i.jsx)(c,{icon:r.gMD,onClick:n,hint:"New File"})}function b(e){let{filesReducer:[t,n]}=e,s=t.files,o=t.selectedFile;function c(e){n({file:e,type:"add"})}return(0,i.jsxs)("nav",{children:[(0,i.jsx)(w,{onOpen:c}),(0,i.jsx)(I,{onOpen:c}),o&&(0,i.jsx)(C,{file:o}),(0,i.jsx)(p,{items:s.map(e=>new R(e)),onSelect:e=>n({file:e.file,type:"select"}),onRemove:e=>n({file:e.file,type:"remove"})}),o&&(0,i.jsx)(p,{items:[new y(o,l.Text,v.nfZ,"Text"),new y(o,l.Table,r.DaQ,"Table")],onSelect:e=>{o.editMode=e.editMode,n({file:t.selectedFile,type:"update"})}})]})}var j=n(2265);function S(e,t){let n=e.files;switch(t.type){case"add":n.forEach(e=>e.selected=!1);let s=n.filter(e=>e.id===t.file.id)[0];s?s.selected=!0:(t.file.selected=!0,n.push(t.file));break;case"select":n.forEach(e=>e.selected=!1),t.file.selected=!0;break;case"remove":let l=n.indexOf(t.file);l>=0&&(n.splice(l,1),t.file.selected&&(l<n.length?n[l].selected=!0:l-1>=0&&(n[l-1].selected=!0)))}return{files:n,selectedFile:n.filter(e=>e.selected)[0]}}function E(e){let{file:t}=e,[n,s]=(0,j.useState)(t.textContent);return n!==t.textContent&&s(t.textContent),(0,i.jsx)("textarea",{className:"text-editor",value:n,onChange:e=>{t.textContent=e.target.value,s(e.target.value)},onScroll:e=>{}})}function M(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return t.map(e=>"string"==typeof e?e:"object"==typeof e?Object.keys(e).filter(t=>e[t]).join(" "):"").join(" ")}function k(e){var t;let{csv:n,rowIndex:s,cellIndex:l,onEdit:o,onMenu:c,selectionReducer:[r,a],cellEditState:[h,d],mouseDownState:[u,f]}=e,[x,m]=(0,j.useState)(""),[w,v]=(0,j.useState)(!1),[g,p]=(0,j.useState)(!1),R=(0,j.useRef)(null),y=r.file.cellSelection,C=null===(t=n[s])||void 0===t?void 0:t[l];function I(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;e.preventDefault(),a({rowIndex:s,cellIndex:l,mode:(e.ctrlKey?4:0)|(e.shiftKey?8:0)|(y.contains(s,l)?2:1)|t})}function b(){return h[0]===s&&h[1]===l}function S(e){b()||!u||w||(v(!0),I(e,8))}return x!==C&&m(C),!u&&w&&v(!1),b()&&!g&&(p(!0),function(){var e,t;let n=document.createElement("textarea"),s=()=>n.scrollHeight+2;null===(e=R.current)||void 0===e||e.append(n),null===(t=R.current)||void 0===t||t.classList.add("editing"),n.value=x,n.style.height="".concat(s(),"px"),n.focus(),n.addEventListener("blur",()=>{var e;n.value!==x&&(m(n.value),null==o||o(n.value)),n.remove(),null===(e=R.current)||void 0===e||e.classList.remove("editing"),p(!1),d([-1,-1])}),n.addEventListener("input",()=>{let e=s();n.offsetHeight<e&&(n.style.height="".concat(s(),"px"))})}()),(0,i.jsx)("td",{ref:R,className:M({selected:y.contains(s,l),focused:y.isFocused(s,l)}),onDoubleClick:function(){b()||d([s,l])},onContextMenu:function(e){!b()&&c&&c(e)},onMouseDown:function(e){!b()&&(f(!0),v(!0),I(e),document.activeElement instanceof HTMLElement&&document.activeElement.blur())},onMouseUp:function(e){b()||(f(!1),S(e))},onMouseEnter:S,onMouseLeave:function(e){b()||v(!1)},children:(0,i.jsx)("span",{children:x})})}var N=n(7026),L=n(7982);async function T(e){return new Promise((t,n)=>(0,N.Qc)(e,{relaxColumnCount:!0,relaxQuotes:!0},(e,n)=>{if(e)console.error(e),t([[""]]);else{let e=n.reduce((e,t)=>Math.max(t.length,e),0);n.forEach(t=>{for(;t.length<e;)t.push("")}),0===n.length?n=[[""]]:0===n[0].length&&n[0].push(""),t(n)}}))}async function D(e,t){return new Promise((n,s)=>(0,L.Pz)(e,(e,s)=>{e?(console.error(e),n("")):(t.textContent=s,n(s))}))}function F(e){let{csv:t,cellIndex:n,selectionReducer:[,s],onMenu:l}=e;return(0,i.jsx)("th",{onMouseDown:function(e){s({rowIndex:0,cellIndex:n,mode:1|(e.shiftKey?8:0)|(e.ctrlKey?4:0)}),s({rowIndex:t.length,cellIndex:n,mode:9|(e.ctrlKey?4:0)})},onContextMenu:l,children:function(e){let t=String.fromCharCode(65+e%26);for(;e>=26;)t=String.fromCharCode(65+(e=Math.floor(e/26)-1)%26)+t;return t}(n)})}function O(e){let{csv:t,rowIndex:n,selectionReducer:[,s],onMenu:l}=e;return(0,i.jsx)("th",{onMouseDown:function(e){var l,i;s({rowIndex:n,cellIndex:0,mode:1|(e.shiftKey?8:0)|(e.ctrlKey?4:0)}),s({rowIndex:n,cellIndex:null!==(i=null===(l=t[0])||void 0===l?void 0:l.length)&&void 0!==i?i:0,mode:9|(e.ctrlKey?4:0)})},onContextMenu:l,children:n+1})}function H(e){let{csv:t,selectionReducer:[,n]}=e;return(0,i.jsx)("th",{onClick:function(e){var s,l;e.preventDefault(),n({rowIndex:t.length,cellIndex:null!==(l=null===(s=t[0])||void 0===s?void 0:s.length)&&void 0!==l?l:0,mode:16})}})}function K(e){let{items:t,x:n,y:s,remove:l,viewportWidth:c,viewportHeight:a}=e,h=(0,j.useRef)(null);function d(e){var t;(null===(t=h.current)||void 0===t?void 0:t.contains(e.target))||null==l||l()}return(0,j.useEffect)(()=>(window.addEventListener("mousedown",d,!1),()=>{window.removeEventListener("mousedown",d,!1)})),(0,j.useEffect)(()=>{let e=h.current;if(e){e.style.left="0",e.style.top="0",e.querySelectorAll("ul").forEach(e=>{e.style.display="block",e.style.left="100%",e.style.right="auto",e.style.top="0",e.style.bottom="auto"});let t=e.scrollWidth,l=e.scrollHeight,i=e.offsetWidth,o=e.offsetHeight;e.querySelectorAll("ul").forEach(e=>{e.style.display="",e.style.left="",e.style.right="",e.style.top="",e.style.bottom=""}),e.style.left="".concat(n>c-i?n-i:n,"px"),e.style.top="".concat(s>a-o?s-o:s,"px"),e.classList.toggle("menu-right",n>c-t),e.classList.toggle("menu-bottom",s>a-l)}}),(0,i.jsx)("nav",{className:"menu",ref:h,style:{display:t.length>0?"block":"none"},onContextMenu:e=>e.preventDefault(),children:function e(t){return(0,i.jsx)("ul",{children:t.map((t,n)=>t.separator?(0,i.jsx)("li",{className:"separator"},n):(0,i.jsxs)("li",{onClick:()=>{var e;null==l||l(),null===(e=t.select)||void 0===e||e.call(t)},className:M(t.className,{disabled:t.disabled}),children:[(0,i.jsx)("span",{className:"icon",children:t.icon&&(0,i.jsx)(o.G,{icon:t.icon})}),(0,i.jsx)("span",{className:"name",children:t.name}),t.items&&(0,i.jsx)("span",{className:"expand",children:(0,i.jsx)(o.G,{icon:r.I4f})}),t.items&&e(t.items)]},n))})}(t)})}class U{select(){this.cellEditState[1]([this.rowIndex,this.cellIndex])}constructor(e,t,n){this.cellEditState=e,this.rowIndex=t,this.cellIndex=n,this.name="Edit Cell",this.icon=r.TzT}}class W{select(){let[e,t]=this.csvState,n=this.rowIndex+(this.above?0:1),s=e[0].map(()=>"");e.splice(n,0,s),t([...e]),this.above&&this.selectionReducer[1]({mode:128,rowIndex:this.rowIndex,cellIndex:-1})}constructor(e,t,n,s){this.csvState=e,this.selectionReducer=t,this.rowIndex=n,this.above=s,this.name="Insert Row ".concat(this.above?"Above":"Below"),this.icon=r.ZhI,this.className="rotate".concat(this.above?"-90":"90")}}class _{select(){let[e,t]=this.csvState,n=this.columnIndex+(this.before?0:1);for(let t of e)t.splice(n,0,"");t([...e]),this.before&&this.selectionReducer[1]({mode:512,rowIndex:-1,cellIndex:this.columnIndex})}constructor(e,t,n,s){this.csvState=e,this.selectionReducer=t,this.columnIndex=n,this.before=s,this.name="Insert Column ".concat(this.before?"Before":"After"),this.icon=r.ZhI,this.className="rotate".concat(this.before?"180":"0")}}class A{select(){let[e,t]=this.csvState,n=this.rowIndex,s=e[n].slice();e.splice(n,0,s),t([...e])}constructor(e,t){this.csvState=e,this.rowIndex=t,this.name="Clone Row",this.icon=v.WM4}}class P{select(){let[e,t]=this.csvState,n=this.columnIndex;for(let t of e)t.splice(n,0,t[n]);t([...e])}constructor(e,t){this.csvState=e,this.columnIndex=t,this.name="Clone Column",this.icon=v.WM4}}class q{select(){let[e,t]=this.csvState,n=this.rowIndex+(this.up?-1:1),s=e[this.rowIndex];e[this.rowIndex]=e[n],e[n]=s,t([...e]),this.selectionReducer[1]({mode:this.up?64:128,rowIndex:this.rowIndex,cellIndex:-1})}get disabled(){let[e]=this.csvState;return this.up&&0===this.rowIndex||!this.up&&this.rowIndex>=e.length-1}constructor(e,t,n,s){this.csvState=e,this.selectionReducer=t,this.rowIndex=n,this.up=s,this.name="Move Row ".concat(this.up?"Up":"Down"),this.icon=this.up?r.FPD:r.r5q}}class B{select(){let[e,t]=this.csvState,n=this.columnIndex+(this.left?-1:1);for(let t of e){let e=t[this.columnIndex];t[this.columnIndex]=t[n],t[n]=e}t([...e]),this.selectionReducer[1]({mode:this.left?256:512,rowIndex:-1,cellIndex:this.columnIndex})}get disabled(){let[e]=this.csvState;return this.left&&0===this.columnIndex||!this.left&&this.columnIndex>=e[0].length-1}constructor(e,t,n,s){this.csvState=e,this.selectionReducer=t,this.columnIndex=n,this.left=s,this.name="Move Column ".concat(this.left?"Left":"Right"),this.icon=this.left?r.acZ:r.eFW}}class G{select(){let[e,t]=this.csvState;e.splice(this.rowIndex,1),t([...e]),this.selectionReducer[1]({mode:1024,rowIndex:-1,cellIndex:-1})}constructor(e,t,n){this.csvState=e,this.selectionReducer=t,this.rowIndex=n,this.name="Delete Row",this.icon=v.Vui}}class Z{select(){let[e,t]=this.csvState;for(let t of e)t.splice(this.columnIndex,1);t([...e]),this.selectionReducer[1]({mode:1024,rowIndex:-1,cellIndex:-1})}constructor(e,t,n){this.csvState=e,this.selectionReducer=t,this.columnIndex=n,this.name="Delete Column",this.icon=v.Vui}}class z{constructor(){this.separator=!0}}class Q{constructor(e){this.items=e,this.name="Row",this.icon=r.u7T}}class V{constructor(e){this.items=e,this.name="Column",this.icon=r.rWw}}function $(e){let{file:t}=e,[n,s]=(0,j.useState)(-1),l=(0,j.useState)([]),[o,c]=l,r=(0,j.useState)(!1),[a,h]=r,d=(0,j.useState)([-1,-1]),u=(0,j.useReducer)(f,{file:t}),[x,m]=(0,j.useState)(),w=(0,j.useRef)(null);function v(){h(!1)}function g(e,t,n){var s,i;if(e.preventDefault(),!w.current)return;function o(){return[new A(l,t),new W(l,u,t,!0),new W(l,u,t,!1),new z,new q(l,u,t,!0),new q(l,u,t,!1),new z,new G(l,u,t)]}function c(){return[new P(l,n),new _(l,u,n,!0),new _(l,u,n,!1),new z,new B(l,u,n,!0),new B(l,u,n,!1),new z,new Z(l,u,n)]}let r=t>=0&&n>=0?[new U(d,t,n),new z,new Q(o()),new V(c())]:t>=0?o():n>=0?c():[],a=w.current.querySelector("table.content").getBoundingClientRect(),h=w.current.querySelector("table.columns").offsetHeight,f=w.current.offsetHeight;m({items:r,x:e.clientX-(null!==(s=a.x)&&void 0!==s?s:0),y:e.clientY-(null!==(i=a.y)&&void 0!==i?i:0)+h,viewportWidth:a.width,viewportHeight:f,remove:()=>m(void 0)})}return(0,j.useEffect)(()=>(a&&window.addEventListener("mouseup",v,!1),()=>{window.removeEventListener("mouseup",v,!1)})),u[0].file!==t&&(h(!1),u[1]({file:t,mode:"update"})),n!==t.id&&(s(t.id),T(t.textContent).then(e=>c(e))),(0,i.jsxs)("div",{className:"table-editor",ref:w,children:[o.length>0&&(0,i.jsx)("table",{className:"columns",children:(0,i.jsx)("thead",{children:(0,i.jsxs)("tr",{children:[(0,i.jsx)(H,{csv:o,selectionReducer:u}),o[0].map((e,t)=>(0,i.jsx)(F,{cellIndex:t,csv:o,selectionReducer:u,onMenu:e=>g(e,-1,t)},t))]})})}),(0,i.jsx)("table",{className:"content",children:(0,i.jsx)("tbody",{children:o.map((e,n)=>(0,i.jsxs)("tr",{style:{zIndex:o.length-n},children:[(0,i.jsx)(O,{rowIndex:n,csv:o,selectionReducer:u,onMenu:e=>g(e,n,-1)}),e.map((e,s)=>(0,i.jsx)(k,{csv:o,rowIndex:n,cellIndex:s,selectionReducer:u,mouseDownState:r,cellEditState:d,onEdit:e=>{o[n][s]=e,D(o,t)},onMenu:e=>g(e,n,s)},s))]},n))})}),x&&(0,i.jsx)(K,{...x})]})}function X(e){let{file:t}=e;return(0,i.jsxs)("article",{children:[t.editMode===l.Text&&(0,i.jsx)(E,{file:t}),t.editMode===l.Table&&(0,i.jsx)($,{file:t})]})}function Y(){let e=(0,j.useReducer)(S,{files:[]}),[t,n]=e;return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("header",{children:(0,i.jsx)(b,{filesReducer:e})}),(0,i.jsx)("main",{children:t.selectedFile&&(0,i.jsx)(X,{file:t.selectedFile})})]})}}},function(e){e.O(0,[676,878,971,938,744],function(){return e(e.s=9215)}),_N_E=e.O()}]);