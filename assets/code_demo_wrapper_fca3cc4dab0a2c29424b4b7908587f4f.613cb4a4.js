import{e as j,p as ye,q as ge,_ as I,r as b,o as v,c as F,l as te,v as ie,a as m,k as _,t as x,b as T,s as ne,x as D,y as f,z as le,A as $e,B as W,C as oe,D as ae,E as xe,F as Se,G as we,H as ze,I as Ie,w as g,J as se,K as re,L as N,j as k}from"./index.6769160b.js";const Ce=j({props:{code:String},data(){return{tab:"demo",mdiCode:ye,mdiPreview:ge}}}),De={class:"relative code-demo"},Fe={class:"language-vue"},Te={class:"absolute right-2 -top-8"};function ke(e,n,c,d,a,p){const s=b("VIconMDI");return v(),F("div",De,[te(m("div",null,[_(e.$slots,"default")],512),[[ie,e.tab==="demo"]]),te(m("pre",Fe,[m("code",null,x(e.code),1)],512),[[ie,e.tab==="code"]]),m("div",Te,[T(s,{icon:e.mdiPreview,size:22,class:ne(e.tab==="demo"?"text-primary-500":"cursor-pointer hover:text-primary-400"),title:"Demo",onClick:n[0]||(n[0]=o=>e.tab="demo")},null,8,["icon","class"]),T(s,{icon:e.mdiCode,size:22,class:ne(e.tab==="code"?"text-primary-500":"cursor-pointer hover:text-primary-400"),title:"Code",onClick:n[1]||(n[1]=o=>e.tab="code")},null,8,["icon","class"])])])}var q=I(Ce,[["render",ke]]);/*!
 * @virtual-list/vue v1.1.1
 * Author: phphe <phphe@outlook.com> (https://github.com/phphe)
 * Homepage: https://virtual-list.phphe.com
 * Released under the MIT License.
 */var ce=(e,n)=>{const c=e.__vccOpts||e;for(const[d,a]of n)c[d]=a;return c};const Le=j({props:{table:Boolean}}),Ve={key:0},Ae={key:1};function Ee(e,n,c,d,a,p){return e.table?(v(),F("table",Ve,[_(e.$slots,"prepend"),m("tbody",null,[_(e.$slots,"default")]),_(e.$slots,"append")])):(v(),F("div",Ae,[_(e.$slots,"prepend"),_(e.$slots,"default"),_(e.$slots,"append")]))}var He=ce(Le,[["render",Ee]]);const Be=j({components:{VirtualListTable:He},props:{items:Array,disabled:Boolean,horizontal:Boolean,firstRender:{type:Number,default:10},buffer:{type:Number,default:100},itemKey:{type:[String,Function]},itemSize:{type:Function},table:Boolean},setup(e){const n=D(0),c=D(e.firstRender-1),d=f(()=>{var i;return Se(c.value,(((i=e.items)==null?void 0:i.length)||1)-1)}),a=D(0),p=f(()=>O(n.value)),s=f(()=>S.value.length>0?O(S.value.length-1)+we(A.value).value:0),o=f(()=>s.value-O(d.value)-A.value[d.value].value),u=f(()=>e.disabled?{}:{overflow:"auto"}),de=f(()=>{const i={display:"flex"};return e.disabled||(e.horizontal?Object.assign(i,{"margin-left":p.value+"px","margin-right":o.value+"px",width:s.value-o.value-p.value+"px"}):Object.assign(i,{"margin-top":p.value+"px","margin-bottom":o.value+"px"})),i["flex-direction"]=e.horizontal?"row":"column",e.table&&(delete i.display,delete i["flex-direction"]),i}),V=f(()=>ze((e.items||[]).map(()=>null))),A=f(()=>(e.items||[]).map((i,t)=>f(()=>{var l;if(V[t]!=null)return V[t];let h=(l=e.itemSize)==null?void 0:l.call(e,i,t);return h==null&&(h=a.value),h}))),J=D(),Q=()=>{J.value=new Ie(A.value),J.value.getValue=i=>i.value};Q();const S=f(()=>(e.items||[]).map((i,t)=>f(()=>{let l;if(t===0)l=0;else{let h=S.value[t-1],H=A.value[t-1];l=h.value+H.value}return l})));le(()=>e.items,C),le(()=>S.value,Q);const ue=f(()=>{if(!e.items||e.disabled)return;const i=[];for(let t=n.value;t<=d.value;t++){const l=e.items[t];if(!l)break;i.push({item:l,index:t})}return i}),E=D(),U=D();$e(async()=>{C();try{pe()}catch{await W(),C()}});let R;function me(){const i=E.value;if(!i)return;const t=P(i);R!=null&&e.buffer-Math.abs(t-R)>=10||(R=t,C())}let K=!1,M=!1;async function C(){var i;if(K){M=!0;return}if(!e.items||e.disabled)return;K=!0;const t=E.value,l=(i=U.value)==null?void 0:i.$el;if(!t||!l)return;a.value||(a.value=be()),n.value=ve(),c.value=_e(),await W();let h,H=0;const L={},ee=e.table?l.querySelector("tbody").children:l.children;for(let y=0;y<ee.length;y++){const r=ee[y],$=oe(r,"position");if($&&["absolute","fixed"].includes($))continue;const w=oe(r,"display")!=="none"?Y(r):0,z=r.getAttribute("vt-index"),B=z?parseInt(z):n.value+H;L[B]=(L[B]||0)+w,H++}for(const y of Object.keys(L)){const r=parseInt(y);V.value[r]!==L[r]&&(V.value[r]=L[r],h=!0)}h&&await W(),K=!1,M&&(M=!1,C());function ve(){const y=P(t)-Z(t)-e.buffer;return ae(S.value,$=>$.value-y,{returnNearestIfNoHit:!0}).index}function _e(){const y=P(t)-Z(t)+X(t)+e.buffer;return ae(S.value,$=>$.value-y,{returnNearestIfNoHit:!0}).index}function be(){const r=[],$=e.table?l.querySelector("tbody").children:l.children;for(let w=0;w<$.length;w++){const z=$[w],B=getComputedStyle(z);if(["absolute","fixed"].includes(B.position))continue;const he=Y(z);if(r.push(he),r.length>=10)break}return r.length===0?0:r.reduce((w,z)=>w+z,0)/r.length}}function X(i){const t=getComputedStyle(i);let l=parseFloat(e.horizontal?t.width:t.height);return t.boxSizing==="border-box"&&(e.horizontal?l=l-parseFloat(t.borderLeftWidth)-parseFloat(t.borderRightWidth):l=l-parseFloat(t.borderTopWidth)-parseFloat(t.borderBottomWidth)),l}function Y(i){let t=X(i);const l=getComputedStyle(i);return e.horizontal?t+=parseFloat(l.borderLeftWidth)+parseFloat(l.borderRightWidth)+parseFloat(l.marginLeft)+parseFloat(l.marginRight):t+=parseFloat(l.borderTopWidth)+parseFloat(l.borderBottomWidth)+parseFloat(l.marginTop)+parseFloat(l.marginBottom),t=Number.isNaN(t)?0:t,t}function P(i){return e.horizontal?i.scrollLeft:i.scrollTop}function Z(i){const t=getComputedStyle(i);return e.horizontal?parseFloat(t.paddingLeft):parseFloat(t.paddingTop)}function O(i){return S.value[i].value}function pe(){const i=E.value;new ResizeObserver(l=>{for(let h of l)if(xe(h.target,"vtlist")){C();break}}).observe(i)}function fe(i,t){if(e.itemKey){if(typeof e.itemKey=="string"&&e.itemKey==="index")return t;if(typeof e.itemKey=="function")return e.itemKey(i,t)}}return{listElRef:E,listInnerRef:U,onscroll:me,listStyle:u,listInnerStyle:de,visibleItemsInfo:ue,getItemKey:fe}}}),Ne=Be;function Re(e,n,c,d,a,p){const s=b("VirtualListTable");return v(),F("div",{class:"vtlist",ref:"listElRef",style:N(e.listStyle),onScrollPassive:n[0]||(n[0]=(...o)=>e.onscroll&&e.onscroll(...o))},[T(s,{class:"vtlist-inner",ref:"listInnerRef",style:N(e.listInnerStyle),table:e.table},{prepend:g(()=>[_(e.$slots,"prepend")]),append:g(()=>[_(e.$slots,"append")]),default:g(()=>[e.disabled?(v(!0),F(se,{key:0},re(e.items,(o,u)=>_(e.$slots,"default",{key:e.getItemKey(o,u),item:o,index:u})),128)):(v(!0),F(se,{key:1},re(e.visibleItemsInfo,({item:o,index:u})=>_(e.$slots,"default",{key:e.getItemKey(o,u),item:o,index:u})),128))]),_:3},8,["style","table"])],36)}var G=ce(Ne,[["render",Re]]);const Ke={components:{"v-list":G},data(){return{items:new Array(1e3).fill(1).map((e,n)=>({text:"Item "+n,lineHeight:20+n%20+"px",width:100+n%30+"px"}))}}};function Me(e,n,c,d,a,p){const s=b("v-list");return v(),k(s,{items:a.items,horizontal:""},{default:g(({item:o,index:u})=>[m("div",{style:N([{border:"1px solid #ccc"},{width:o.width}])}," ITEM: "+x(u)+" - "+x(o.text),5)]),_:1},8,["items"])}var Pe=I(Ke,[["render",Me]]),Oe=`<template>
  <v-list :items="items" horizontal>
    <template #default="{ item, index }">
      <div style="border: 1px solid #ccc" :style="{ width: item.width }">
        ITEM: {{ index }} - {{ item['text'] }}
      </div>
    </template>
  </v-list>
</template>
<script>
  import VirtualList from '@virtual-list/vue'

  export default {
    components: { 'v-list': VirtualList },
    data() {
      return {
        items: new Array(1000).fill(1).map((v, i) => ({
          text: 'Item ' + i,
          lineHeight: 20 + (i % 20) + 'px',
          width: 100 + (i % 30) + 'px',
        })),
      }
    },
  }
<\/script>`;const We={components:{CodeDemo:q,Demo:Pe},data(){return{code:Oe}}};function je(e,n,c,d,a,p){const s=b("Demo"),o=b("CodeDemo");return v(),k(o,{code:a.code},{default:g(()=>[T(s)]),_:1},8,["code"])}var at=I(We,[["render",je]]);const qe={components:{"v-list":G},data(){return{items:new Array(1e3).fill(1).map((e,n)=>({text:"Item "+n,lineHeight:20+n%20+"px",width:100+n%30+"px"}))}}};function Ge(e,n,c,d,a,p){const s=b("v-list");return v(),k(s,{items:a.items,style:{height:"600px"}},{default:g(({item:o,index:u})=>[m("div",{style:N([{border:"1px solid #ccc"},{lineHeight:o.lineHeight}])}," ITEM: "+x(u)+" - "+x(o.text),5)]),_:1},8,["items"])}var Je=I(qe,[["render",Ge]]),Qe=`<template>
  <v-list :items="items" style="height: 600px">
    <template #default="{ item, index }">
      <div
        style="border: 1px solid #ccc"
        :style="{ lineHeight: item.lineHeight }"
      >
        ITEM: {{ index }} - {{ item['text'] }}
      </div>
    </template>
  </v-list>
</template>
<script>
  import VirtualList from '@virtual-list/vue'

  export default {
    components: { 'v-list': VirtualList },
    data() {
      return {
        items: new Array(1000).fill(1).map((v, i) => ({
          text: 'Item ' + i,
          lineHeight: 20 + (i % 20) + 'px',
          width: 100 + (i % 30) + 'px',
        })),
      }
    },
  }
<\/script>`;const Ue={components:{CodeDemo:q,Demo:Je},data(){return{code:Qe}}};function Xe(e,n,c,d,a,p){const s=b("Demo"),o=b("CodeDemo");return v(),k(o,{code:a.code},{default:g(()=>[T(s)]),_:1},8,["code"])}var st=I(Ue,[["render",Xe]]);const Ye={components:{"v-list":G},data(){return{items:new Array(1e3).fill(1).map((e,n)=>({text:"Item "+n,lineHeight:20+n%20+"px",width:100+n%30+"px"}))}}},Ze=m("thead",null,[m("tr",null,[m("th",null,"Text"),m("th",null,"Index")])],-1);function et(e,n,c,d,a,p){const s=b("v-list");return v(),k(s,{items:a.items,table:"",class:"list-table",style:{height:"600px"}},{prepend:g(()=>[Ze]),default:g(({item:o,index:u})=>[m("tr",null,[m("td",null,x(u),1),m("td",null,"ITEM: "+x(u)+" - "+x(o.text),1)])]),_:1},8,["items"])}var tt=I(Ye,[["render",et]]),it=`<template>
  <v-list :items="items" table class="list-table" style="height: 600px">
    <template #prepend>
      <thead>
        <tr>
          <th>Text</th>
          <th>Index</th>
        </tr>
      </thead>
    </template>
    <template #default="{ item, index }">
      <tr>
        <td>{{ index }}</td>
        <td>ITEM: {{ index }} - {{ item['text'] }}</td>
      </tr>
    </template>
  </v-list>
</template>
<script>
  import VirtualList from '@virtual-list/vue'

  export default {
    components: { 'v-list': VirtualList },
    data() {
      return {
        items: new Array(1000).fill(1).map((v, i) => ({
          text: 'Item ' + i,
          lineHeight: 20 + (i % 20) + 'px',
          width: 100 + (i % 30) + 'px',
        })),
      }
    },
  }
<\/script>
<style>
  .list-table table,
  .list-table td,
  .list-table th {
    border: 1px solid #ccc;
  }
  .list-table table {
    border-collapse: collapse;
    width: 100%;
  }
</style>`;const nt={components:{CodeDemo:q,Demo:tt},data(){return{code:it}}};function lt(e,n,c,d,a,p){const s=b("Demo"),o=b("CodeDemo");return v(),k(o,{code:a.code},{default:g(()=>[T(s)]),_:1},8,["code"])}var rt=I(nt,[["render",lt]]);export{st as a,rt as b,at as i};
