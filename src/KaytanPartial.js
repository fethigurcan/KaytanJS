const KaytanToken=require('./KaytanToken');
const partialsHolder=require('./Helper').partialsHolder;

class KaytanPartial extends KaytanToken{
    constructor(engine,name,partialIndexAddition){
        super(engine);
        Object.defineProperties(this,{
            name:{ value:name, writable:false },
            partialIndexAddition:{ value:partialIndexAddition, writable:false }
        });
    }

    toString(){
        let s=this.engine.defaultStartDelimiter;
        let e=this.engine.defaultEndDelimiter;
        return `${s}>${this.name}${e}`;
    }

    toJavascriptCode(){
        return `if ($global.${partialsHolder}.${this.name})
   $global.${partialsHolder}.${this.name}($scope,$o,$pia+${this.partialIndexAddition},$i,$l);`;
    }

    execute(global,objectArray,parentIndex,parentLength,parentKey,partialIndexAddition=0){
        let rootObject=global[partialsHolder];
        let partial=rootObject && rootObject[this.name];
        if (partial)
            return partial.execute(global,objectArray,parentIndex,parentLength,parentKey,objectArray.length-1);
        else
            return "";
    }

}

module.exports=KaytanPartial;