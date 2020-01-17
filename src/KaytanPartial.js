const KaytanToken=require('./KaytanToken');
const partialsHolderName=require('./Helper').partialsHolderName;

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
        return `if ($global.${partialsHolderName}.${this.name})
   $global.${partialsHolderName}.${this.name}($scope,$o,$pia+${this.partialIndexAddition},$i,$l);`;
    }

    execute(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition=0){
        let rootObject=global[partialsHolderName];
        let partial=rootObject && rootObject[this.name];
        if (partial)
            return partial.execute(global,scopes,parentIndex,parentLength,parentKey,scopes.length-1);
        else
            return "";
    }

}

module.exports=KaytanPartial;