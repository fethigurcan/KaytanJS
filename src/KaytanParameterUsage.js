var KaytanToken=require('./KaytanToken');

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
}

module.exports=KaytanParameterUsage;
