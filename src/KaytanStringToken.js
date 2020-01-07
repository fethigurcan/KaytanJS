var KaytanToken=require('./KaytanToken');

class KaytanStringToken extends KaytanToken{
    constructor(value){
        if (!(value instanceof String))
            throw new TypeError('Value must be a String'); 
        this.value=value;
    }

    getOutput(){
        return this.value; 
    }

    toString(){
        return this.value;
    }
}

module.exports=KaytanStringToken;