const KaytanIdentifier=require('./KaytanIdentifier');

class KaytanThisProperty extends KaytanIdentifier{
    constructor(engine,scopeInfo){
        super(engine,'.',scopeInfo);
        Object.defineProperties(this,{
            access:{ value:".", writable:false },
            exactLevel:{ value:true, writable:false },
            isCurrentScope:{ value:true, writable:false }
        });

    }

    execute(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition=0){
        return { value:scopes[scopes.length-1] };
    }

    toJavascriptDefinitionsCode(){
        return "";
    }

    toJavascriptAccessCode(){
        return "$scope";
    }
}

module.exports=KaytanThisProperty;
