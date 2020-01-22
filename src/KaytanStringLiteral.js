const KaytanLiteral=require("./KaytanLiteral");
const Helper=require("./Helper");

class KaytanStringLiteral extends KaytanLiteral{
    constructor(engine,value){
        value=value?value.toString():'';
        super(engine,value);
    }

    toJavascriptCode(){
        return `"${Helper.escape(this.value,"\\")}"`;
    }

}

module.exports=KaytanStringLiteral;