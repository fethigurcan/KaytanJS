const KaytanToken=require("./KaytanToken");

class KaytanLiteral extends KaytanToken{
    constructor(engine,value){
        if (this.constructor===KaytanToken)
            throw new TypeError('Abstract class "KaytanLiteral" cannot be instantiated directly.');

        super(engine);
        Object.defineProperties(this,{
            value:{ value:value, writable:false }
        });
    }
}

module.exports=KaytanLiteral;