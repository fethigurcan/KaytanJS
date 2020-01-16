const KaytanProperty=require('./KaytanProperty');

class KaytanThisProperty extends KaytanProperty{
    constructor(engine,scopeInfo){
        super(engine,'.',scopeInfo);
        Object.defineProperties(this,{
            access:{ value:".", writable:false },
            exactLevel:{ value:true, writable:false },
            isCurrentScope:{ value:true, writable:false }
        });

    }

    execute(global,objectArray,parentIndex,parentLength,parentKey,partialIndexAddition=0){
        return objectArray[objectArray.length-1];
    }

    toJavascriptDefinitionsCode(){
        return "";
    }

    toJavascriptAccessCode(){
        return "$scope";
    }
}

module.exports=KaytanThisProperty;
