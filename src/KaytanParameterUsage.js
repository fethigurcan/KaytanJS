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

    execute(objectArray){
        let rootObject=objectArray[0];
        if (!rootObject[parameterUsageHolder]) 
            rootObject[parameterUsageHolder]=[];
        rootObject[parameterUsageHolder].push(this.name);
        return '';
    }
}

module.exports=KaytanParameterUsage;
