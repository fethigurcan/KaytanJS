const KaytanLogicToken=require('./KaytanLogicToken');
const KaytanRuntimeError=require('./KaytanRuntimeError');
const Helper=require('./Helper');

class KaytanProperty extends KaytanLogicToken{
    constructor(engine,name,scopeInfo){
        super(engine);
        if (scopeInfo!==false){ //system and global constructors dont need
            let scopeResult=Helper.getScopeInfo(name,scopeInfo);
            Object.defineProperties(this,{
                name:{ value:scopeResult.name, writable:false },
                access:{ value:scopeResult.access, writable:false },
                exactLevel:{ value:scopeResult.exactLevel, writable:false },
                index:{ value:scopeResult.index+1, writable:false }
            });
        }else{
            Object.defineProperties(this,{
                name:{ value:name, writable:false }
            });
        }
    }

    toString(){
        return this.name;
    }

    execute(objectArray,parentIndex,parentLength){
        return Helper.getItem(this.access,objectArray,this.index,this.exactLevel); 
    }

    toJavascriptGetValueCode(ind){
        return `${ind}let ${this.name}=getItemSimple("${this.name}",$o$,${this.index},${this.exactLevel});`;
    }

    toJavascriptCode(ind){
        return this.access;
    }
}

module.exports=KaytanProperty;
