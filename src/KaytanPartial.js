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

    execute(global,objectArray,parentIndex,parentLength){
        let rootObject=global[partialsHolder];
        let partial=rootObject && rootObject[this.name];
        if (partial)
            return partial.execute(global,objectArray,parentIndex,parentLength);
    }

}

module.exports=KaytanPartial;