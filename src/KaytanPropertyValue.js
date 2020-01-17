const KaytanToken=require('./KaytanToken');
const KaytanProperty=require('./KaytanProperty');
const Helper=require('./Helper');
const _escapeJavascriptParameter=e=>e?`"${Helper.escape(e,"\\")}"`:"undefined";

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
        retVal+=`$r+=$escape(${access},${_escapeJavascriptParameter(this.escape)})`;
        return retVal;
    }

    execute(global,objectArray,parentIndex,parentLength,parentKey,partialIndexAddition=0){
        let obj=this.property.execute(global,objectArray,parentIndex,parentLength,parentKey,partialIndexAddition);
        return Helper.escape(obj,this.escape);
    }

}

module.exports=KaytanPropertyValue;
