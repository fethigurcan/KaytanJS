var KaytanToken=require('./KaytanToken');

class KaytanStringToken extends KaytanToken{
    constructor(engine,value){
        if (!(typeof(value)=="string"))
            throw new TypeError('Value must be a String');
        super(engine);
        Object.defineProperties(this,{
            value:{ value:value, writable:false }
        });
    }

    getOutput(){
        return this.value; 
    }

    toString(){
        return this.value;
    }
}

module.exports=KaytanStringToken;