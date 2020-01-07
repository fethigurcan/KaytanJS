var KaytanToken=require('./KaytanToken');
var KaytanProperty=require('./KaytanProperty');

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
}

module.exports=KaytanPropertyValue;
