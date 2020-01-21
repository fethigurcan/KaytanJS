const KaytanToken=require('./KaytanToken');
const Helper=require('./Helper');
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

    toJavascriptCode(){
        let retVal=`$output.write("${Helper.escape(this.value,"\\")}");`;
        return retVal;
    }    

    execute(global,scopes){
        this.engine.output.write(this.value);
    }

}

module.exports=KaytanStringToken;