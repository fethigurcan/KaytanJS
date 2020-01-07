var KaytanLogicToken=require('./KaytanLogicToken');

class KaytanProperty extends KaytanLogicToken{
    constructor(engine,name){
        super(engine);
        Object.defineProperties(this,{
            name:{ value:name, writable:false }
        });
    }

    toString(){
        return this.name;
    }
}

module.exports=KaytanProperty;
