var parseTemplate=require('./KaytanParserFn');
var KaytanTokenList=require('./KaytanTokenList');

//for improve performance on execution (less conditions will be used in execute functions)
function prepareData(data){
    if (typeof(data)=="boolean")
        return data?true:null;
    else if (Array.isArray(data)){
        if (data.length){
            if (data.length==1)
                return prepareData(data[0]);
            else
                return data.map(i=>prepareData[i]);
        }else
            return null;
    }
    else if (typeof(data)=="object" && data){
        let keys=Object.keys(data);
        if (!keys)
            return null;
        else{
            let retVal={};
            for(let key of keys)
                retVal[key]=prepareData(data[key]);
            return retVal;
        }
    }
    else if (typeof(data)=="string")
        return data?data:null;
    else
        return data;
}

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
            return this.ast.execute([{},prepareData(values)||{}]); //empty object is the global variable holder for define command
        },
        writable:false
    }
});

module.exports=Kaytan; 