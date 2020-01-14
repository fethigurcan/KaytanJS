const KaytanToken=require('./KaytanToken');
const KaytanProperty=require('./KaytanProperty');
const Helper=require('./Helper');

class KaytanPropertyValue extends KaytanToken{
    constructor(engine,property,scopeInfo,escape){
        if (!(property instanceof KaytanProperty))
            throw new TypeError('property must be a KaytanProperty'); 

        super(engine);

        Object.defineProperties(this,{
            property:{ value:property, writable:false },
            escape:{ value:escape, writable:false },
        });
    }

    toString(){
        let s=this.engine.defaultStartDelimiter;
        let e=this.engine.defaultEndDelimiter;
        return `${s}${this.escape?this.escape:""}${this.property.name}${e}`;
    }

    toJavascriptCode(){
        let retVal=`${this.property.toJavascriptDefinitionsCode()}`;
        let access=this.property.toJavascriptAccessCode();
        if (this.escape=="&")
            retVal+=`$r+=${access}!=null?${access}.toString():"";`;
        else
            retVal+=`$r+=${access}!=null?$escape[${this.escape?`"${Helper.escape["\\"](this.escape)}"`:undefined}](${access}.toString()):"";`;
        return retVal;
    }

    execute(global,objectArray,parentIndex,parentLength,partialIndexAddition=0){
        let obj=this.property.execute(global,objectArray,parentIndex,parentLength,partialIndexAddition);
        if (obj!=null)
            return Helper.escape[this.escape](obj.toString());
        else
            return '';
    }

}

module.exports=KaytanPropertyValue;
