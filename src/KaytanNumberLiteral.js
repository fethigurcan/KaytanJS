const KaytanLiteral=require("./KaytanLiteral");

class KaytanNumberLiteral extends KaytanLiteral{
    constructor(engine,value){
        if (!value)
            value=0
        else if (typeof(value)!="number"){
            value=value.toString();
            if (value.indexOf(".")<0)
                value=Number.parseInt(value);
            else
                value=Number.parseFloat(value);
        }
        if (Number.isNaN(value))
            throw new TypeError("value must be a number");

        super(engine,value);
    }
}

module.exports=KaytanNumberLiteral;