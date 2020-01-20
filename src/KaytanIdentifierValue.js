const KaytanToken=require('./KaytanToken');
const KaytanIdentifier=require('./KaytanIdentifier');
const Helper=require('./Helper');
const _escapeJavascriptParameter=e=>e?`"${Helper.escape(e,"\\")}"`:"undefined";

class KaytanIdentifierValue extends KaytanToken{
    constructor(engine,property,scopeInfo,escape){
        if (!(property instanceof KaytanIdentifier))
            throw new TypeError('property must be a KaytanIdentifier'); 

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

    execute(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition=0){
        let r=this.property.execute(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition);
        let obj=r.data;
        return Helper.escape(obj,this.escape);
    }

}

module.exports=KaytanIdentifierValue;
