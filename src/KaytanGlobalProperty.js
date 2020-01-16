const KaytanProperty=require('./KaytanProperty');

class KaytanGlobalProperty extends KaytanProperty{
    constructor(engine,name){
        super(engine,name,false);
    }

    execute(global,objectArray,parentIndex,parentLength,parentKey,partialIndexAddition=0){
        return global[this.name];
    }

    toJavascriptDefinitionsCode(){
        return "";
    }

    toJavascriptAccessCode(){
        return `$global.${this.name}`;
    }
}

module.exports=KaytanGlobalProperty;
