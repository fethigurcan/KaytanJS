const KaytanProperty=require('./KaytanProperty');

class KaytanGlobalProperty extends KaytanProperty{
    constructor(engine,name){
        super(engine,name,false);
    }

    execute(global,objectArray,parentIndex,parentLength){
        return global[this.name];
    }

    toJavascriptDefinitionsCode(){
        return "";
    }

    toJavascriptCode(){
        return `$global.${this.name}`;
    }
}

module.exports=KaytanGlobalProperty;
