!function(){var e=document.createElement("style");e.innerHTML=".code-demo>pre{margin-top:0}.list-table table,.list-table td,.list-table th{border:1px solid #ccc}.list-table table{border-collapse:collapse;width:100%}\n",document.head.appendChild(e),System.register(["./index-legacy.c16bba9f.js"],(function(e){"use strict";var t,n,l,i,o,r,a,s,d,u,c,p,m,f,v,b,h,x,y,g,I,w,F,z,C,S,T,D,L,H,k;return{setters:[function(e){t=e.e,n=e.p,l=e.q,i=e._,o=e.r,r=e.o,a=e.c,s=e.l,d=e.v,u=e.a,c=e.k,p=e.t,m=e.b,f=e.s,v=e.x,b=e.y,h=e.z,x=e.A,y=e.B,g=e.C,I=e.D,w=e.E,F=e.F,z=e.G,C=e.H,S=e.I,T=e.w,D=e.J,L=e.K,H=e.L,k=e.j}],execute:function(){const $=t({props:{code:String},data:()=>({tab:"demo",mdiCode:n,mdiPreview:l})}),E={class:"relative code-demo"},K={class:"language-vue"},R={class:"absolute right-2 -top-8"};var V=i($,[["render",function(e,t,n,l,i,v){const b=o("VIconMDI");return r(),a("div",E,[s(u("div",null,[c(e.$slots,"default")],512),[[d,"demo"===e.tab]]),s(u("pre",K,[u("code",null,p(e.code),1)],512),[[d,"code"===e.tab]]),u("div",R,[m(b,{icon:e.mdiPreview,size:22,class:f("demo"===e.tab?"text-primary-500":"cursor-pointer hover:text-primary-400"),title:"Demo",onClick:t[0]||(t[0]=t=>e.tab="demo")},null,8,["icon","class"]),m(b,{icon:e.mdiCode,size:22,class:f("code"===e.tab?"text-primary-500":"cursor-pointer hover:text-primary-400"),title:"Code",onClick:t[1]||(t[1]=t=>e.tab="code")},null,8,["icon","class"])])])}]]),_=(e,t)=>{const n=e.__vccOpts||e;for(const[l,i]of t)n[l]=i;return n};
/*!
       * @virtual-list/vue v1.1.1
       * Author: phphe <phphe@outlook.com> (https://github.com/phphe)
       * Homepage: https://virtual-list.phphe.com
       * Released under the MIT License.
       */const A=t({props:{table:Boolean}}),M={key:0},N={key:1};var B=_(t({components:{VirtualListTable:_(A,[["render",function(e,t,n,l,i,o){return e.table?(r(),a("table",M,[c(e.$slots,"prepend"),u("tbody",null,[c(e.$slots,"default")]),c(e.$slots,"append")])):(r(),a("div",N,[c(e.$slots,"prepend"),c(e.$slots,"default"),c(e.$slots,"append")]))}]])},props:{items:Array,disabled:Boolean,horizontal:Boolean,firstRender:{type:Number,default:10},buffer:{type:Number,default:100},itemKey:{type:[String,Function]},itemSize:{type:Function},table:Boolean},setup(e){const t=v(0),n=v(e.firstRender-1),l=b((()=>{var t;return F(n.value,((null==(t=e.items)?void 0:t.length)||1)-1)})),i=v(0),o=b((()=>A(t.value))),r=b((()=>f.value.length>0?A(f.value.length-1)+z(c.value).value:0)),a=b((()=>r.value-A(l.value)-c.value[l.value].value)),s=b((()=>e.disabled?{}:{overflow:"auto"})),d=b((()=>{const t={display:"flex"};return e.disabled||(e.horizontal?Object.assign(t,{"margin-left":o.value+"px","margin-right":a.value+"px",width:r.value-a.value-o.value+"px"}):Object.assign(t,{"margin-top":o.value+"px","margin-bottom":a.value+"px"})),t["flex-direction"]=e.horizontal?"row":"column",e.table&&(delete t.display,delete t["flex-direction"]),t})),u=b((()=>C((e.items||[]).map((()=>null))))),c=b((()=>(e.items||[]).map(((t,n)=>b((()=>{var l;if(null!=u[n])return u[n];let o=null==(l=e.itemSize)?void 0:l.call(e,t,n);return null==o&&(o=i.value),o})))))),p=v(),m=()=>{p.value=new S(c.value),p.value.getValue=e=>e.value};m();const f=b((()=>(e.items||[]).map(((e,t)=>b((()=>{let e;if(0===t)e=0;else{let n=f.value[t-1],l=c.value[t-1];e=n.value+l.value}return e}))))));h((()=>e.items),E),h((()=>f.value),m);const T=b((()=>{if(!e.items||e.disabled)return;const n=[];for(let i=t.value;i<=l.value;i++){const t=e.items[i];if(!t)break;n.push({item:t,index:i})}return n})),D=v(),L=v();let H;x((async()=>{E();try{!function(){const e=D.value;new ResizeObserver((e=>{for(let t of e)if(w(t.target,"vtlist")){E();break}})).observe(e)}()}catch(e){await y(),E()}}));let k=!1,$=!1;async function E(){var l;if(k)return void($=!0);if(!e.items||e.disabled)return;k=!0;const o=D.value,r=null==(l=L.value)?void 0:l.$el;if(!o||!r)return;let a;i.value||(i.value=function(){const t=10,n=[],l=e.table?r.querySelector("tbody").children:r.children;for(let e=0;e<l.length;e++){const i=l[e],o=getComputedStyle(i);if(["absolute","fixed"].includes(o.position))continue;const r=R(i);if(n.push(r),n.length>=t)break}if(0===n.length)return 0;return n.reduce(((e,t)=>e+t),0)/n.length}()),t.value=function(){const t=V(o)-_(o)-e.buffer;return I(f.value,(e=>e.value-t),{returnNearestIfNoHit:!0}).index}(),n.value=function(){const t=V(o)-_(o)+K(o)+e.buffer;return I(f.value,(e=>e.value-t),{returnNearestIfNoHit:!0}).index}(),await y();let s=0;const d={},c=e.table?r.querySelector("tbody").children:r.children;for(let e=0;e<c.length;e++){const n=c[e],l=g(n,"position");if(l&&["absolute","fixed"].includes(l))continue;const i="none"!==g(n,"display")?R(n):0,o=n.getAttribute("vt-index"),r=o?parseInt(o):t.value+s;d[r]=(d[r]||0)+i,s++}for(const e of Object.keys(d)){const t=parseInt(e);u.value[t]!==d[t]&&(u.value[t]=d[t],a=!0)}a&&await y(),k=!1,$&&($=!1,E())}function K(t){const n=getComputedStyle(t);let l=parseFloat(e.horizontal?n.width:n.height);return"border-box"===n.boxSizing&&(l=e.horizontal?l-parseFloat(n.borderLeftWidth)-parseFloat(n.borderRightWidth):l-parseFloat(n.borderTopWidth)-parseFloat(n.borderBottomWidth)),l}function R(t){let n=K(t);const l=getComputedStyle(t);return e.horizontal?n+=parseFloat(l.borderLeftWidth)+parseFloat(l.borderRightWidth)+parseFloat(l.marginLeft)+parseFloat(l.marginRight):n+=parseFloat(l.borderTopWidth)+parseFloat(l.borderBottomWidth)+parseFloat(l.marginTop)+parseFloat(l.marginBottom),n=Number.isNaN(n)?0:n,n}function V(t){return e.horizontal?t.scrollLeft:t.scrollTop}function _(t){const n=getComputedStyle(t);return e.horizontal?parseFloat(n.paddingLeft):parseFloat(n.paddingTop)}function A(e){return f.value[e].value}return{listElRef:D,listInnerRef:L,onscroll:function(){const t=D.value;if(!t)return;const n=V(t);null!=H&&e.buffer-Math.abs(n-H)>=10||(H=n,E())},listStyle:s,listInnerStyle:d,visibleItemsInfo:T,getItemKey:function(t,n){if(e.itemKey){if("string"==typeof e.itemKey&&"index"===e.itemKey)return n;if("function"==typeof e.itemKey)return e.itemKey(t,n)}}}}}),[["render",function(e,t,n,l,i,s){const d=o("VirtualListTable");return r(),a("div",{class:"vtlist",ref:"listElRef",style:H(e.listStyle),onScrollPassive:t[0]||(t[0]=(...t)=>e.onscroll&&e.onscroll(...t))},[m(d,{class:"vtlist-inner",ref:"listInnerRef",style:H(e.listInnerStyle),table:e.table},{prepend:T((()=>[c(e.$slots,"prepend")])),append:T((()=>[c(e.$slots,"append")])),default:T((()=>[e.disabled?(r(!0),a(D,{key:0},L(e.items,((t,n)=>c(e.$slots,"default",{key:e.getItemKey(t,n),item:t,index:n}))),128)):(r(!0),a(D,{key:1},L(e.visibleItemsInfo,(({item:t,index:n})=>c(e.$slots,"default",{key:e.getItemKey(t,n),item:t,index:n}))),128))])),_:3},8,["style","table"])],36)}]]);e("i",i({components:{CodeDemo:V,Demo:i({components:{"v-list":B},data:()=>({items:new Array(1e3).fill(1).map(((e,t)=>({text:"Item "+t,lineHeight:20+t%20+"px",width:100+t%30+"px"})))})},[["render",function(e,t,n,l,i,a){const s=o("v-list");return r(),k(s,{items:i.items,horizontal:""},{default:T((({item:e,index:t})=>[u("div",{style:H([{border:"1px solid #ccc"},{width:e.width}])}," ITEM: "+p(t)+" - "+p(e.text),5)])),_:1},8,["items"])}]])},data:()=>({code:"<template>\n  <v-list :items=\"items\" horizontal>\n    <template #default=\"{ item, index }\">\n      <div style=\"border: 1px solid #ccc\" :style=\"{ width: item.width }\">\n        ITEM: {{ index }} - {{ item['text'] }}\n      </div>\n    </template>\n  </v-list>\n</template>\n<script>\n  import VirtualList from '@virtual-list/vue'\n\n  export default {\n    components: { 'v-list': VirtualList },\n    data() {\n      return {\n        items: new Array(1000).fill(1).map((v, i) => ({\n          text: 'Item ' + i,\n          lineHeight: 20 + (i % 20) + 'px',\n          width: 100 + (i % 30) + 'px',\n        })),\n      }\n    },\n  }\n<\/script>"})},[["render",function(e,t,n,l,i,a){const s=o("Demo"),d=o("CodeDemo");return r(),k(d,{code:i.code},{default:T((()=>[m(s)])),_:1},8,["code"])}]]));e("a",i({components:{CodeDemo:V,Demo:i({components:{"v-list":B},data:()=>({items:new Array(1e3).fill(1).map(((e,t)=>({text:"Item "+t,lineHeight:20+t%20+"px",width:100+t%30+"px"})))})},[["render",function(e,t,n,l,i,a){const s=o("v-list");return r(),k(s,{items:i.items,style:{height:"600px"}},{default:T((({item:e,index:t})=>[u("div",{style:H([{border:"1px solid #ccc"},{lineHeight:e.lineHeight}])}," ITEM: "+p(t)+" - "+p(e.text),5)])),_:1},8,["items"])}]])},data:()=>({code:"<template>\n  <v-list :items=\"items\" style=\"height: 600px\">\n    <template #default=\"{ item, index }\">\n      <div\n        style=\"border: 1px solid #ccc\"\n        :style=\"{ lineHeight: item.lineHeight }\"\n      >\n        ITEM: {{ index }} - {{ item['text'] }}\n      </div>\n    </template>\n  </v-list>\n</template>\n<script>\n  import VirtualList from '@virtual-list/vue'\n\n  export default {\n    components: { 'v-list': VirtualList },\n    data() {\n      return {\n        items: new Array(1000).fill(1).map((v, i) => ({\n          text: 'Item ' + i,\n          lineHeight: 20 + (i % 20) + 'px',\n          width: 100 + (i % 30) + 'px',\n        })),\n      }\n    },\n  }\n<\/script>"})},[["render",function(e,t,n,l,i,a){const s=o("Demo"),d=o("CodeDemo");return r(),k(d,{code:i.code},{default:T((()=>[m(s)])),_:1},8,["code"])}]]));const W={components:{"v-list":B},data:()=>({items:new Array(1e3).fill(1).map(((e,t)=>({text:"Item "+t,lineHeight:20+t%20+"px",width:100+t%30+"px"})))})},j=u("thead",null,[u("tr",null,[u("th",null,"Text"),u("th",null,"Index")])],-1);e("b",i({components:{CodeDemo:V,Demo:i(W,[["render",function(e,t,n,l,i,a){const s=o("v-list");return r(),k(s,{items:i.items,table:"",class:"list-table",style:{height:"600px"}},{prepend:T((()=>[j])),default:T((({item:e,index:t})=>[u("tr",null,[u("td",null,p(t),1),u("td",null,"ITEM: "+p(t)+" - "+p(e.text),1)])])),_:1},8,["items"])}]])},data:()=>({code:"<template>\n  <v-list :items=\"items\" table class=\"list-table\" style=\"height: 600px\">\n    <template #prepend>\n      <thead>\n        <tr>\n          <th>Text</th>\n          <th>Index</th>\n        </tr>\n      </thead>\n    </template>\n    <template #default=\"{ item, index }\">\n      <tr>\n        <td>{{ index }}</td>\n        <td>ITEM: {{ index }} - {{ item['text'] }}</td>\n      </tr>\n    </template>\n  </v-list>\n</template>\n<script>\n  import VirtualList from '@virtual-list/vue'\n\n  export default {\n    components: { 'v-list': VirtualList },\n    data() {\n      return {\n        items: new Array(1000).fill(1).map((v, i) => ({\n          text: 'Item ' + i,\n          lineHeight: 20 + (i % 20) + 'px',\n          width: 100 + (i % 30) + 'px',\n        })),\n      }\n    },\n  }\n<\/script>\n<style>\n  .list-table table,\n  .list-table td,\n  .list-table th {\n    border: 1px solid #ccc;\n  }\n  .list-table table {\n    border-collapse: collapse;\n    width: 100%;\n  }\n</style>"})},[["render",function(e,t,n,l,i,a){const s=o("Demo"),d=o("CodeDemo");return r(),k(d,{code:i.code},{default:T((()=>[m(s)])),_:1},8,["code"])}]]))}}}))}();
