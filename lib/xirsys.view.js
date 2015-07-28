/*****
 * Includes code from the Simple JavaScript Templating library
 * John Resig - http://ejohn.org/ - MIT Licensed
 *****/

'use strict';

(function () {

  $xirsys.class.create({
    namespace : 'view',
    constructor : function ($opts, $url) {
      this.cache = {};
    },
    methods : {
      render : function(str, data) {
        var fn = !/\W/.test(str) ?
        this.cache[str] = this.cache[str]
          || this.render(document.getElementById(str).innerHTML) :
        new Function("obj", 
          "var p=[],print=function(){p.push.apply(p,arguments);};" +
          "with(obj){p.push('" +
          str
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'")
          + "');}return p.join('');");
        return data ? fn( data ) : fn;
      }
    }    
  });
})();