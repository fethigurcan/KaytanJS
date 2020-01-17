const KaytanToken=require('./KaytanToken');

class KaytanGlobalPropertyDefinition extends KaytanToken{
    constructor(engine,name){
        super(engine);
        Object.defineProperties(this,{
            name:{ value:name, writable:false }
        });
    }

    toString(){
        let s=this.engine.defaultStartDelimiter;
        let e=this.engine.defaultEndDelimiter;
        return `${s}$${this.name}${e}`;
    }

    execute(global,scopes){
        global[this.name]=true;
        return '';
    }

    toJavascriptCode(){
        return `$global.${this.name}=true;`;
    }
}

module.exports=KaytanGlobalPropertyDefinition;
