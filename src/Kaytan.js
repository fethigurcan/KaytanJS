var parseTemplate=require('./KaytanParserFn');
var KaytanTokenList=require('./KaytanTokenList');

class Kaytan{
    constructor(template,options){
        Object.defineProperties(this,{
            template:{ value:template||'', writable:false, enumerable:true }
        });
        
        let ast=parseTemplate.call(this).data;

        Object.defineProperties(this,{
            ast:{ value:ast.length==1?ast[0]:new KaytanTokenList(this,ast), writable:false, enumerable:true }
        });
    }
}

//TODO:dışardan partial partial ekleyebilme

//private methods
Object.defineProperties(Kaytan.prototype,{
    execute:{
        value:function(values){
            return this.ast.execute([{},values]); //empty object is the global variable holder for define command
        },
        writable:false
    }
});

module.exports=Kaytan; 