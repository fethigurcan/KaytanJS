const KaytanToken=require('./KaytanToken');
const KaytanProperty=require('./KaytanProperty');
const Helper=require('./Helper');

class KaytanPropertyValue extends KaytanToken{
    constructor(engine,property,scopeInfo,escape){
        if (!(property instanceof KaytanProperty))
            throw new TypeError('property must be a KaytanProperty'); 

        let si=scopeInfo[property.index-1];
        let allreadyDefined=true;
        if (si.defined.indexOf(property.name)<0){
            si.defined.push(property.name);
            allreadyDefined=false;
        }

        super(engine);
        Object.defineProperties(this,{
            property:{ value:property, writable:false },
            escape:{ value:escape, writable:false },
            allreadyDefined:{ value:allreadyDefined, writable:false }
        });
    }

    toString(){
        return "{{"+(this.escape?this.escape:"")+this.property.name+"}}";
    }

    toJavascriptCode(ind){
        let prop=this.property.toJavascriptCode(null);
        let retVal="";
        if (!this.allreadyDefined){
            let retVal=`${this.property.toJavascriptGetValueCode(ind)}
`;
        }
        retVal+=`${ind}if (${this.property.access}!=null){
${ind}   $retVal$+=_escape[${this.escape?`"${Helper.escape["\\"](this.escape)}"`:undefined}](${this.property.access}.toString());
${ind}}
`;
        return retVal;
    }

    execute(objectArray,parentIndex,parentLength){
        let obj=this.property.execute(objectArray,parentIndex,parentLength);
        if (obj!=null)
            return Helper.escape[this.escape](obj.toString());
        else
            return '';
    }

}

module.exports=KaytanPropertyValue;
