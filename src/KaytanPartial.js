const KaytanToken=require('./KaytanToken');
const partialsHolder=require('./Helper').partialsHolder;

class KaytanPartial extends KaytanToken{
    constructor(engine,name){
        super(engine);
        Object.defineProperties(this,{
            name:{ value:name, writable:false }
        });
    }

    toString(){
        let s=this.engine.defaultStartDelimiter;
        let e=this.engine.defaultEndDelimiter;
        return `${s}>${this.name}${e}`;
    }

    toJavascriptCode(){
        return `if ($global.${partialsHolder}.${this.name})
   $global.${partialsHolder}.${this.name}($scope,$o);`;
    }

    execute(global,objectArray,parentIndex,parentLength,partialIndexAddition=0){
        let rootObject=global[partialsHolder];
        let partial=rootObject && rootObject[this.name];
        if (partial)
            return partial.execute(global,objectArray,parentIndex,parentLength,objectArray.length-1);
        else
            return "";
    }

}

module.exports=KaytanPartial;