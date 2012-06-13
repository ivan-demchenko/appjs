// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function f(){ log.history = log.history || []; log.history.push(arguments); if(this.console) { var args = arguments, newarr; try { args.callee = f.caller } catch(e) {}; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);}};

// make it safe to use console.log always
(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());


/*
 *
 * Copyright (c) 2010 C. F., Wong (<a href="http://cloudgen.w0ng.hk">Cloudgen Examplet Store</a>)
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
// version 1.05 
var email={tldn:new RegExp("^[^\@]+\@[^\@]+\.(A[C-GL-OQ-UWXZ]|B[ABD-JM-OR-TVWYZ]|C[ACDF-IK-ORUVX-Z]|D[EJKMOZ]|E[CEGR-U]|F[I-KMOR]|G[ABD-IL-NP-UWY]|H[KMNRTU]|I[DEL-OQ-T]|J[EMOP]|K[EG-IMNPRWYZ]|L[A-CIKR-VY]|M[AC-EGHK-Z]|N[ACE-GILOPRUZ]|OM|P[AE-HKL-NR-TWY]|QA|R[EOSUW]|S[A-EG-ORT-VYZ]|T[CDF-HJ-PRTVWZ]|U[AGKMSYZ]|V[ACEGINU]|W[FS]|XN|Y[ETU]|Z[AMW]|AERO|ARPA|ASIA|BIZ|CAT|COM|COOP|EDU|GOV|INFO|INT|JOBS|MIL|MOBI|MUSEUM|NAME|NET|ORG|PRO|TEL|TRAVEL)$","i")};
(function($){
  $.extend($.expr[":"],{
    regex:function(d,a,c){
      var e=new RegExp(c[3],"g");
      var b=("text"===d.type)?d.value:d.innerHTML;
      return(b=="")?true:(e.exec(b))
    }
  });
  $.fn.output=function(d){
    if(typeof d=="undefined")
      return (this.is(":text"))?this.val():this.html();
    else
      return (this.is(":text"))?this.val(d):this.html(d);
  };
  formatter={
    getRegex:function(settings){
      var settings=$.extend({type:"decimal",precision:5,decimal:'.',allow_negative:true},settings);
      var result="";
      if(settings.type=="decimal"){
        var e=(settings.allow_negative)?"-?":"";
        if(settings.precision>0)
          result="^"+e+"\\d+$|^"+e+"\\d*"+settings.decimal+"\\d{1,"+settings.precision+"}$";
        else result="^"+e+"\\d+$"
      }else if(settings.type=="phone-number"){
        result="^\\d[\\d\\-]*\\d$"
      }else if(settings.type=="alphabet"){
        result="^[A-Za-z]+$"
      }
      return result
    },
    isEmail:function(d){
      var a=$(d).output();
      var c=false;
      var e=true;
      var e=new RegExp("[\s\~\!\#\$\%\^\&\*\+\=\(\)\[\]\{\}\<\>\\\/\;\:\,\?\|]+");
      if(a.match(e)!=null){
        return c
      }
      if(a.match(/((\.\.)|(\.\-)|(\.\@)|(\-\.)|(\-\-)|(\-\@)|(\@\.)|(\@\-)|(\@\@))+/)!=null){
        return c
      }
      if(a.indexOf("\'")!=-1){
        return c
      }
      if(a.indexOf("\"")!=-1){
        return c
      }
      if(email.tldn&&a.match(email.tldn)==null){
        return c
      }
      return e
    },
    formatString:function(target,settings){
      var settings=$.extend({type:"decimal",precision:5,decimal:'.',allow_negative:true},settings);
      var oldText=$(target).output();
      var newText=oldText;
      if(settings.type=="decimal"){
        if(newText!=""){
          var g;
          var h=(settings.allow_negative)?"\\-":"";
          var i="\\"+settings.decimal;
          g=new RegExp("[^\\d"+h+i+"]+","g");
          newText=newText.replace(g,"");
          var h=(settings.allow_negative)?"\\-?":"";
          if(settings.precision>0)
            g=new RegExp("^("+h+"\\d*"+i+"\\d{1,"+settings.precision+"}).*");
          else g=new RegExp("^("+h+"\\d+).*");
          newText=newText.replace(g,"$1")
        }
      }else if(settings.type=="phone-number"){
        newText=newText.replace(/[^\-\d]+/g,"").replace(/^\-+/,"").replace(/\-+/,"-")
      }else if(settings.type=="alphabet"){
        newText=newText.replace(/[^A-Za-z]+/g,"")
      }
      if(newText!=oldText)
        $(target).output(newText)
    }
  };
  $.fn.format=function(settings,wrongFormatHandler){
    var settings=$.extend({type:"decimal",precision:5,decimal:".",allow_negative:true,autofix:false},settings);
    var decimal=settings.decimal;
    wrongFormatHandler=typeof wrongFormatHandler=="function"?wrongFormatHandler:function(){};
    this.keypress(function(d){
      $(this).data("old-value",$(this).val());
      var a=d.charCode?d.charCode:d.keyCode?d.keyCode:0;
      if(a==13&&this.nodeName.toLowerCase()!="input"){return false}
      if((d.ctrlKey&&(a==97||a==65||a==120||a==88||a==99||a==67||a==122||a==90||a==118||a==86||a==45))||(a==46&&d.which!=null&&d.which==0))
        return true;
      if(a<48||a>57){
        if(settings.type=="decimal"){
          if(settings.allow_negative&&a==45&&this.value.length==0)return true;
          if(a==decimal.charCodeAt(0)){
            if(settings.precision>0&&this.value.indexOf(decimal)==-1)return true;
            else return false
          }
          if(a!=8&&a!=9&&a!=13&&a!=35&&a!=36&&a!=37&&a!=39){return false}
          return true
        }else if(settings.type=="email"){
          if(a==8||a==9||a==13||(a>34&&a<38)||a==39||a==45||a==46||(a>64&&a<91)||(a>96&&a<123)||a==95){return true}
          if(a==64&&this.value.indexOf("@")==-1)return true;
          return false
        }else if(settings.type=="phone-number"){
          if(a==45&&this.value.length==0)return false;
          if(a==8||a==9||a==13||(a>34&&a<38)||a==39||a==45){return true}
          return false
        }else if(settings.type=="alphabet"){
          if(a==8||a==9||a==13||(a>34&&a<38)||a==39||(a>64&&a<91)||(a>96&&a<123))
          return true
        }else return false
      }else{
        if(settings.type=="alphabet"){
          return false
        }else return true
      }
    })
    .blur(function(){
      if(settings.type=="email"){
        if(!formatter.isEmail(this)){
          wrongFormatHandler.apply(this)
        }
      }else{
        if(!$(this).is(":regex("+formatter.getRegex(settings)+")")){
          wrongFormatHandler.apply(this)
        }
      }
    })
    .focus(function(){
      $(this).select()
    });
    if(settings.autofix){
      this.keyup(function(d){
        if($(this).data("old-value")!=$(this).val())
          formatter.formatString(this,settings)
        }
      )
    }
    return this
  }
})(jQuery);


/*
    Masked Input plugin for jQuery
    Copyright (c) 2007-2011 Josh Bush (digitalbush.com)
    Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license) 
    Version: 1.3
*/
(function(a){var b=(a.browser.msie?"paste":"input")+".mask",c=window.orientation!=undefined;a.mask={definitions:{9:"[0-9]",a:"[A-Za-z]","*":"[A-Za-z0-9]"},dataName:"rawMaskFn"},a.fn.extend({caret:function(a,b){if(this.length!=0){if(typeof a=="number"){b=typeof b=="number"?b:a;return this.each(function(){if(this.setSelectionRange)this.setSelectionRange(a,b);else if(this.createTextRange){var c=this.createTextRange();c.collapse(!0),c.moveEnd("character",b),c.moveStart("character",a),c.select()}})}if(this[0].setSelectionRange)a=this[0].selectionStart,b=this[0].selectionEnd;else if(document.selection&&document.selection.createRange){var c=document.selection.createRange();a=0-c.duplicate().moveStart("character",-1e5),b=a+c.text.length}return{begin:a,end:b}}},unmask:function(){return this.trigger("unmask")},mask:function(d,e){if(!d&&this.length>0){var f=a(this[0]);return f.data(a.mask.dataName)()}e=a.extend({placeholder:"_",completed:null},e);var g=a.mask.definitions,h=[],i=d.length,j=null,k=d.length;a.each(d.split(""),function(a,b){b=="?"?(k--,i=a):g[b]?(h.push(new RegExp(g[b])),j==null&&(j=h.length-1)):h.push(null)});return this.trigger("unmask").each(function(){function v(a){var b=f.val(),c=-1;for(var d=0,g=0;d<k;d++)if(h[d]){l[d]=e.placeholder;while(g++<b.length){var m=b.charAt(g-1);if(h[d].test(m)){l[d]=m,c=d;break}}if(g>b.length)break}else l[d]==b.charAt(g)&&d!=i&&(g++,c=d);if(!a&&c+1<i)f.val(""),t(0,k);else if(a||c+1>=i)u(),a||f.val(f.val().substring(0,c+1));return i?d:j}function u(){return f.val(l.join("")).val()}function t(a,b){for(var c=a;c<b&&c<k;c++)h[c]&&(l[c]=e.placeholder)}function s(a){var b=a.which,c=f.caret();if(a.ctrlKey||a.altKey||a.metaKey||b<32)return!0;if(b){c.end-c.begin!=0&&(t(c.begin,c.end),p(c.begin,c.end-1));var d=n(c.begin-1);if(d<k){var g=String.fromCharCode(b);if(h[d].test(g)){q(d),l[d]=g,u();var i=n(d);f.caret(i),e.completed&&i>=k&&e.completed.call(f)}}return!1}}function r(a){var b=a.which;if(b==8||b==46||c&&b==127){var d=f.caret(),e=d.begin,g=d.end;g-e==0&&(e=b!=46?o(e):g=n(e-1),g=b==46?n(g):g),t(e,g),p(e,g-1);return!1}if(b==27){f.val(m),f.caret(0,v());return!1}}function q(a){for(var b=a,c=e.placeholder;b<k;b++)if(h[b]){var d=n(b),f=l[b];l[b]=c;if(d<k&&h[d].test(f))c=f;else break}}function p(a,b){if(!(a<0)){for(var c=a,d=n(b);c<k;c++)if(h[c]){if(d<k&&h[c].test(l[d]))l[c]=l[d],l[d]=e.placeholder;else break;d=n(d)}u(),f.caret(Math.max(j,a))}}function o(a){while(--a>=0&&!h[a]);return a}function n(a){while(++a<=k&&!h[a]);return a}var f=a(this),l=a.map(d.split(""),function(a,b){if(a!="?")return g[a]?e.placeholder:a}),m=f.val();f.data(a.mask.dataName,function(){return a.map(l,function(a,b){return h[b]&&a!=e.placeholder?a:null}).join("")}),f.attr("readonly")||f.one("unmask",function(){f.unbind(".mask").removeData(a.mask.dataName)}).bind("focus.mask",function(){m=f.val();var b=v();u();var c=function(){b==d.length?f.caret(0,b):f.caret(b)};(a.browser.msie?c:function(){setTimeout(c,0)})()}).bind("blur.mask",function(){v(),f.val()!=m&&f.change()}).bind("keydown.mask",r).bind("keypress.mask",s).bind(b,function(){setTimeout(function(){f.caret(v(!0))},0)}),v()})}})})(jQuery)