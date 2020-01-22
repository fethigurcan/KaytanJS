const KaytanLiteral=require("./KaytanLiteral");

class KaytanStringLiteral extends KaytanLiteral{
    constructor(engine,value){
        value=value?value.toString():'';
        super(engine,value);
    }
}

module.exports=KaytanStringLiteral;