const KaytanProperty=require('./KaytanProperty');

class KaytanGlobalProperty extends KaytanProperty{
    constructor(engine,name){
        super(engine,name,false);
    }

    execute(objectArray,parentIndex,parentLength){
        let rootObject=objectArray[0];
        return rootObject[this.name];
    }

    toJavascriptGetValueCode(ind){
        return "";
    }

    toJavascriptCode(ind){
        return `$global$.${this.name}`;
    }
}

module.exports=KaytanGlobalProperty;
