(this.webpackJsonpfile_backer=this.webpackJsonpfile_backer||[]).push([[0],{11:function(e,t,n){e.exports=n(16)},16:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(7),o=n.n(c),u=n(3),i=n(1),l=(n(5),n(8)),s=n(9),f="http://localhost:".concat(4e3,"/");function h(e,t){return e.endsWith("/")?e+t:e+"/"+t}var d=["B","KB","MB","GB"];function b(e){if("number"!==typeof e)return e;for(var t=0;e>=1024;)e/=1024,t+=1;return"".concat(Math.round(100*e)/100," ").concat(d[t])}var m=new(function(){function e(){var t=this;Object(l.a)(this,e),this.reqQueue=[],this.xhr=new XMLHttpRequest,this.working=!1,setInterval((function(){t.working||t.work()}),150)}return Object(s.a)(e,[{key:"work",value:function(){var e=this,t=this.reqQueue.shift();if("undefined"!==typeof t){this.working=!0;var n=t.reqPath,a=t.data,r=t.callback;this.xhr.open("POST",n),this.xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),this.xhr.send(a),this.xhr.onload=function(){r(e.xhr.responseText),e.work()}}else this.working=!1}},{key:"addReq",value:function(e,t,n){this.reqQueue.push({reqPath:f+e,data:"path="+encodeURIComponent(t),callback:n})}},{key:"getFiles",value:function(e){var t=this;return new Promise((function(n,a){t.addReq("getFiles",e,(function(e){return n(e)}))}))}},{key:"getSize",value:function(e){var t=this;return new Promise((function(n,a){t.addReq("getSize",e,(function(e){return n(e)}))}))}},{key:"streamCompileStatus",value:function(e,t){var n=new XMLHttpRequest;return n.open("POST",f+"compile"),n.setRequestHeader("Content-Type","application/json"),n.send(JSON.stringify({targList:e,outPath:t})),n}},{key:"stop",value:function(){this.reqQueue.splice(0,this.reqQueue.length),this.xhr.abort(),this.working=!1}}]),e}());function g(e){var t=e.goBack,n=e.refresh;return r.a.createElement("div",{style:{float:"right"}},r.a.createElement("button",{onClick:t},"\u2b9d"),r.a.createElement("button",{onClick:n},"\ud83d\uddd8"))}var p=n(10);function v(e){var t=e.item,n=e.validBasePath,a=e.useCheckBox,c=e.useSize,o=e.setPath,u=null;return u=t.isDir?r.a.createElement("p",{className:"dir",onClick:function(e){return o(h(n,e.target.innerText))}},a?r.a.createElement("input",{type:"checkbox",checked:!t.isIgnored}):null,t.name):r.a.createElement("p",{className:"file"},a?r.a.createElement("input",{type:"checkbox",checked:!t.isIgnored}):null,t.name),c?r.a.createElement("tr",null,r.a.createElement("td",{style:{width:"100%"}},u),r.a.createElement("td",{style:{textAlign:"right"}},r.a.createElement("p",null,b(t.byte)))):u}function E(e,t,n,a){m.getSize(h(a,e.name)).then((function(a){Number.isNaN(+a)||-1===(a=+a)&&(e.isIgnored=!0,a=0),e.byte=a,t=t.sort((function(e,t){return"number"===typeof e.byte&&"number"===typeof e.byte?t.byte-e.byte:0})),n(Object(u.a)(t))}))}function y(e){var t=e.dirList,n=e.validBasePath,c=e.useCheckBox,o=e.useSize,l=e.setPath,s=Object(a.useState)(t),f=Object(i.a)(s,2),h=f[0],d=f[1];return Object(a.useEffect)((function(){if(o){var e,t=Object(p.a)(h);try{for(t.s();!(e=t.n()).done;){var a=e.value;"undefined"===typeof a.byte&&E(a,h,d,n)}}catch(r){t.e(r)}finally{t.f()}}}),[n,o]),Object(a.useEffect)((function(){d(Object(u.a)(t))}),[t]),r.a.createElement(r.a.Fragment,null,r.a.createElement("label",{style:{float:"right"}},function(e,t){return t?b(e.reduce((function(e,t){return"number"!=typeof t.byte||t.isIgnored?e:e+t.byte}),0)):""}(h,o)),r.a.createElement("div",{className:"dirdialog"},h.map((function(e,t){return r.a.createElement(v,{key:t,item:e,validBasePath:n,useCheckBox:c,useSize:o,setPath:l})}))))}function O(e){var t=e.useStorage,n=e.desc,c=e.onUpdate,o=e.showFile,u=e.useCheckBox,l=e.browsePanel,s=e.targPath;if(t){var f=localStorage.getItem(n);s=null!==f?f:s}var h=[Object(a.useRef)(),Object(a.useRef)()][0],d=Object(a.useState)(s),b=Object(i.a)(d,2),p=b[0],v=b[1],E=Object(a.useState)(""),O=Object(i.a)(E,2),k=O[0],j=O[1],S=Object(a.useState)(!l),w=Object(i.a)(S,2),x=w[0],C=w[1],P=Object(a.useState)(!1),B=Object(i.a)(P,2),I=B[0],q=B[1],F=Object(a.useState)([]),N=Object(i.a)(F,2),L=N[0],R=N[1];function T(){if(!o||""!==p)return console.log("".concat(n," : ").concat(p," , ").concat(s)),h.current.value=p,m.getFiles(p).then((function(e){try{var a=JSON.parse(e),r=a.base,u=a.exists,i=a.files;u?(h.current.style.borderColor="greenyellow",j(r),"function"==typeof c&&c(r),R(i.filter((function(e){return e.isDir||o}))),t&&localStorage.setItem(n,p)):h.current.style.borderColor="red"}catch(l){console.log(e)}q(!1)})),function(){return m.stop()}}return Object(a.useEffect)((function(){v(s)}),[s]),Object(a.useEffect)(T,[p]),r.a.createElement("div",null,r.a.createElement("p",{hidden:!l},n,":",r.a.createElement("input",{style:{width:"75%"},type:"text",ref:h,onChange:function(e){return v(e.target.value)}}),r.a.createElement("button",{onClick:function(){return C(!0)}},"browse")),r.a.createElement("fieldset",{hidden:!x},r.a.createElement(g,{goBack:function(){var e=p;e.endsWith("/")&&e.length>1&&(e=e.substr(0,e.length-1)),((e=e.substr(0,e.lastIndexOf("/")+1)).includes(s)||t)&&v(e)},refresh:T}),r.a.createElement("button",{hidden:!u,onClick:function(){return q(!0)}},"sort by size"),r.a.createElement(y,{dirList:L,validBasePath:k,useCheckBox:u,useSize:I,setPath:v}),r.a.createElement("div",{style:{float:"right"},hidden:!l},r.a.createElement("button",{onClick:function(){return C(!1)}},"select"))))}function k(e){var t=e.targList,n=e.outPath,c=Object(a.useState)(!1),o=Object(i.a)(c,2),u=o[0],l=o[1],s=Object(a.useState)(""),f=Object(i.a)(s,2),h=f[0],d=f[1],b=Object(a.useState)(!1),g=Object(i.a)(b,2),p=g[0],v=g[1],E=Object(a.useState)(0),y=Object(i.a)(E,2),O=y[0],k=y[1];return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{style:{textAlign:"center"}},r.a.createElement("progress",{value:O,max:"100"}),r.a.createElement("button",{style:{float:"right"},disabled:p,onClick:function(){if(p)l(!0),d("dont press me!");else{if(t.filter((function(e){return 0==e.length})).length>0)return l(!0),void d("Bad Path!");v(!0),l(!1),d("compile target:".concat(t,"  ,  output:").concat(n)),console.log(t);var e=m.streamCompileStatus(t,n);e.onprogress=function(){k(e.responseText.length)},e.onloadend=function(){v(!1)}}}},p?"COMPILING":"COMPILE")),r.a.createElement("div",{className:"log",style:{color:u?"red":"white"}},h))}var j=function(e){var t=e.index,n=e.targChanged,c=Object(a.useState)(""),o=Object(i.a)(c,2),u=o[0],l=o[1];return r.a.createElement("fieldset",null,r.a.createElement(O,{useStorage:!0,showFile:!1,useCheckBox:!1,browsePanel:!0,desc:"Target Folder"+t,targPath:"",onUpdate:function(e){l(e),n(e)}}),r.a.createElement("p",{style:{color:"gold",marginBottom:"0"}},"Target Folder explorer"),r.a.createElement(O,{showFile:!0,useCheckBox:!0,browsePanel:!1,desc:"You shouldnt see this"+t,targPath:u}))};var S=function(){var e=Object(a.useState)(function(){var e=localStorage.getItem("listLen");e=null===e||Number.isNaN(+e)?1:+e;for(var t=[],n=0;n<e;n++)t.push("");return t}()),t=Object(i.a)(e,2),n=t[0],c=t[1],o=Object(a.useState)(""),l=Object(i.a)(o,2),s=l[0],f=l[1];function h(){localStorage.setItem("listLen",n.length.toString()),c(Object(u.a)(n))}return r.a.createElement(r.a.Fragment,null,r.a.createElement("button",{onClick:function(){n.push(""),h()}},"+"),r.a.createElement("button",{onClick:function(){n.pop(),h()}},"-"),n.map((function(e,t){return r.a.createElement(j,{index:t,targChanged:function(e){n[t]=e,c(Object(u.a)(n))}})})),r.a.createElement(O,{useStorage:!0,showFile:!1,useCheckBox:!1,browsePanel:!0,desc:"Output Folder",targPath:"",onUpdate:f}),r.a.createElement(k,{targList:n,outPath:s}))};o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(S,null)),document.getElementById("root"))},5:function(e,t,n){}},[[11,1,2]]]);
//# sourceMappingURL=main.41bd50b0.chunk.js.map