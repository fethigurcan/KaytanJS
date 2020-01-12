const KaytanToken=require('./KaytanToken');
const KaytanProperty=require('./KaytanProperty');
const Helper=require('./Helper');

class KaytanPropertyValue extends KaytanToken{
    constructor(engine,property,scopeInfo,escape){
        if (!(property instanceof KaytanProperty))
            throw new TypeError('property must be a KaytanProperty'); 

        let allreadyDefined=true;
        if (property.name!="."){
            let si=scopeInfo[property.index];
            if (si.defined.indexOf(property.name)<0){
                si.defined.push(property.name);
                allreadyDefined=false;
            }
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

    toJavascriptCode(){
        let retVal="";
        if (!this.allreadyDefined){
            retVal=`${this.property.toJavascriptDefinitionsCode()}
`;
        }
        let access=this.property.toJavascriptAccessCode();
        if (this.escape=="&")
            retVal+=`$r+=${access}!=null?${access}.toString():"";`;
        else
            retVal+=`$r+=${access}!=null?$escape[${this.escape?`"${Helper.escape["\\"](this.escape)}"`:undefined}](${access}.toString()):"";`;
        return retVal;
    }

    execute(global,objectArray,parentIndex,parentLength){
        let obj=this.property.execute(global,objectArray,parentIndex,parentLength);
        if (obj!=null)
            return Helper.escape[this.escape](obj.toString());
        else
            return '';
    }

}

module.exports=KaytanPropertyValue;
