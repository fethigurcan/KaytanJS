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

    execute(objectArray,parentIndex,parentLength){
        let obj=this.property.execute(objectArray,parentIndex,parentLength);
        if (obj!=null)
            return _escape[this.escape](obj.toString());
        else
            return '';
    }

}

module.exports=KaytanPropertyValue;
