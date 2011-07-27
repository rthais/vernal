/*
* jQuery expanding textarea
*
* https://github.com/ferama/jquery-expanding-textarea
*
* Adapted for jQuery from dojo TextArea widget
*
* @author Marco Ferragina
* @version 1.00
*/
(function(f){f.fn.expandingTextArea=function(){return this.filter("textarea").each(function(){function l(){var a=c.scrollHeight,b;if(f.browser.msie)b=c.offsetHeight-c.clientHeight;else if(f.browser.webkit)b=m(c).h;else if(f.browser.mozilla)b=c.offsetHeight-c.clientHeight;else{var d=c,n=k(d);b=o(d,n);d=m(d,n);b=b.h+d.h}return a+b}function o(a,b){var d=b||k(a),c=h(a,d.paddingLeft),e=h(a,d.paddingTop);return{l:c,t:e,w:c+h(a,d.paddingRight),h:e+h(a,d.paddingBottom)}}function m(a,b){var d=b||k(a),c=d.borderLeftStyle!=
"none"?h(a,d.borderLeftWidth):0,e=d.borderTopStyle!="none"?h(a,d.borderTopWidth):0;return{l:c,t:e,w:c+(d.borderRightStyle!="none"?h(a,d.borderRightWidth):0),h:e+(d.borderBottomStyle!="none"?h(a,d.borderBottomWidth):0)}}function r(){j=null;if(p&&!i){i=!0;var a=!1;if(c.value=="")c.value=" ",a=!0;var b=c.scrollHeight;if(b){var d=e.css("padding-bottom"),f=o(c),f=f.h-f.t;e.css("padding-bottom",f+1+"px");var g=l()-1+"px";if(e.css("max-height")!=g)e.css("padding-bottom",f+b+"px"),c.scrollTop=0,e.css("max-height",
l()-b+"px");e.css("padding-bottom",d)}else q();if(a)c.value="";i=!1}}function q(){e.css({"max-height":"",height:"auto"});c.rows=(c.value.match(/\n/g)||[]).length+1}function g(){if(!i){i=!0;if(c.scrollHeight&&c.offsetHeight&&c.clientHeight){var a=l()+"px";e.css("height")!=a&&(e.css("height",a),e.css("maxHeight",a));p&&(j&&clearTimeout(j),j=setTimeout(r,0))}else q();i=!1}}var c=this,e=f(this);e.css({"overflow-x":"auto","overflow-y":"hidden","box-sizing":"border-box","-moz-box-sizing":"border-box","-webkit-box-sizing":"border-box",
resize:"none"});var i=!1,p=f.browser.mozilla||f.browser.webkit,j,k;k=f.browser.webkit?function(a){var b;if(a.nodeType==1){var d=a.ownerDocument.defaultView;b=d.getComputedStyle(a,null);if(!b&&a.style)a.style.display="",b=d.getComputedStyle(a,null)}return b||{}}:f.browser.msie?function(a){return a.nodeType==1?a.currentStyle:{}}:function(a){return a.nodeType==1?a.ownerDocument.defaultView.getComputedStyle(a,null):{}};var h;h=f.browser.msie?function(a,b){if(!b)return 0;if(b=="medium")return 4;if(b.slice&&
b.slice(-2)=="px")return parseFloat(b);with(a){var d=style.left,c=runtimeStyle.left;runtimeStyle.left=currentStyle.left;try{style.left=b,b=style.pixelLeft}catch(e){b=0}style.left=d;runtimeStyle.left=c}return b}:function(a,b){return parseFloat(b)||0};j=setTimeout(g,0);e.unbind(".expandingTextarea").bind("keyup.expandingTextarea",g).bind("keydown.expandingTextarea",g).bind("change.expandingTextarea",g).bind("scroll.expandingTextarea",g).bind("resize.expandingTextarea",g).bind("focus.expandingTextarea",
g).bind("blur.expandingTextarea",g).bind("cut.expandingTextarea",g).bind("paste.expandingTextarea",g)})}})(jQuery);