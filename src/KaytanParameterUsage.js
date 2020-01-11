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
        return "{{@"+this.name+"}}";
    }

    execute(global,objectArray){
        if (!global[parameterUsageHolder]) 
            global[parameterUsageHolder]=[];
        global[parameterUsageHolder].push(this.name);
        return '';
    }
}

module.exports=KaytanParameterUsage;
