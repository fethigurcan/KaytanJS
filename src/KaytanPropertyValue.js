const KaytanToken=require('./KaytanToken');
const KaytanProperty=require('./KaytanProperty');
const _escape=require('./Helper').escape;

class KaytanPropertyValue extends KaytanToken{
    constructor(engine,property,escape){
        if (!(property instanceof KaytanProperty))
            throw new TypeError('property must be a KaytanProperty'); 
        super(engine);
        Object.defineProperties(this,{
            property:{ value:property, writable:false },
            escape:{ value:escape, writable:false }
        });
    }

    toString(){
        return "{{"+(this.escape?this.escape:"")+this.property.name+"}}";
    }

    toJavascriptCode(indentation){
        let ind=indentation?"   ".repeat(indentation):"";
        let prop=this.property.toJavascriptCode();
        let retVal=`${ind}${this.property.toJavascriptGetValueCode()}
${ind}if (${prop}!=null){
${ind}   retVal+=_escape[${this.escape?`"${_escape["\\"](this.escape)}"`:undefined}](${prop}.toString());
${ind}}
`;
        return retVal;
    }

    execute(objectArray,parentIndex,parentLength){
        let obj=this.property.execute(objectArray,parentIndex,parentLength);
        if (obj!=null)
            return _escape[this.escape](obj.toString());
        else
            return '';
    }

}

module.exports=KaytanPropertyValue;
