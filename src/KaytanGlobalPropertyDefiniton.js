const KaytanToken=require('./KaytanToken');

class KaytanGlobalPropertyDefinition extends KaytanToken{
    constructor(engine,name){
        super(engine);
        Object.defineProperties(this,{
            name:{ value:name, writable:false }
        });
    }

    toString(){
        return "{{$"+this.name+"}}";
    }

    execute(global,objectArray){
        global[this.name]=true;
        return '';
    }

    toJavascriptAccessCode(){
        return `$global.${this.name}=true;`;
    }
}

module.exports=KaytanGlobalPropertyDefinition;
