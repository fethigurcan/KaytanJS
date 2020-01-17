const KaytanToken=require('./KaytanToken');
const parameterUsageHolder="$parameterUsage"

class KaytanParameterUsage extends KaytanToken{
    constructor(engine,name){
        super(engine);
        Object.defineProperties(this,{
            name:{ value:name, writable:false }
        });
    }

    toString(){
        let s=this.engine.defaultStartDelimiter;
        let e=this.engine.defaultEndDelimiter;
        return `${s}@${this.name}${e}`;
    }

    execute(global,scopes){
        if (!global[parameterUsageHolder]) 
            global[parameterUsageHolder]=[];
        global[parameterUsageHolder].push(this.name);
        return '';
    }

    toJavascriptCode(){
        return `$global.${parameterUsageHolder}.push("${this.name}");`;
    }
}

module.exports=KaytanParameterUsage;
