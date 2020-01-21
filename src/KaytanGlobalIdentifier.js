const KaytanIdentifier=require('./KaytanIdentifier');

class KaytanGlobalIdentifier extends KaytanIdentifier{
    constructor(engine,name){
        super(engine,name,false);
    }

    execute(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition=0){
        return { value:global[this.name] };
    }

    toJavascriptDefinitionsCode(){
        return "";
    }

    toJavascriptAccessCode(){
        return `$global.${this.name}`;
    }
}

module.exports=KaytanGlobalIdentifier;
