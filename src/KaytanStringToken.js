const KaytanToken=require('./KaytanToken');

class KaytanStringToken extends KaytanToken{
    constructor(engine,value){
        if (!(typeof(value)=="string"))
            throw new TypeError('Value must be a String');
        super(engine);
        Object.defineProperties(this,{
            value:{ value:value, writable:false }
        });
    }

    toString(){
        return this.value;
    }

    execute(objectArray){
        return this.value;
    }

}

module.exports=KaytanStringToken;