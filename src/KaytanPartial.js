var KaytanToken=require('./KaytanToken');

class KaytanPartial extends KaytanToken{
    constructor(engine,name){
        super(engine);
        Object.defineProperties(this,{
            name:{ value:name, writable:false }
        });
    }

    toString(){
        return "{{>"+this.name.toString()+"}}";
    }
}

module.exports=KaytanPartial;