const KaytanToken=require("./KaytanToken");

class KaytanLiteral extends KaytanToken{
    constructor(engine,value){
        super(engine);
        if (this.constructor===KaytanToken)
            throw new TypeError('Abstract class "KaytanLiteral" cannot be instantiated directly.');

        Object.defineProperties(this,{
            value:{ value:value, writable:false }
        });
    }
}

module.exports=KaytanLiteral;