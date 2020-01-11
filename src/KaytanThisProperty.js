const KaytanProperty=require('./KaytanProperty');

class KaytanThisProperty extends KaytanProperty{
    constructor(engine,scopeInfo){
        super(engine,'.',scopeInfo);
        Object.defineProperties(this,{
            access:{ value:"$o$[$o$.length-1]", writable:false }
        });

    }

    execute(global,objectArray,parentIndex,parentLength){
        return objectArray[objectArray.length-1];
    }

    toJavascriptGetValueCode(ind){
        return "";
    }

    toJavascriptCode(ind){
        return "$o$[$o$.length-1]";
    }
}

module.exports=KaytanThisProperty;
