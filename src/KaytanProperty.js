const KaytanLogicToken=require('./KaytanLogicToken');
const KaytanRuntimeError=require('./KaytanRuntimeError');
const Helper=require('./Helper');

class KaytanProperty extends KaytanLogicToken{
    constructor(engine,name,scopeInfo){
        super(engine);
        if (scopeInfo!==false && name!="."){ //system and global constructors dont need
            let scopeResult=Helper.getScopeInfo(name,scopeInfo);
            Object.defineProperties(this,{
                name:{ value:scopeResult.name, writable:false },
                access:{ value:scopeResult.access, writable:false },
                exactLevel:{ value:scopeResult.exactLevel, writable:false },
                isCurrentScope:{ value:scopeResult.isCurrentScope, writable:false },
                index:{ value:scopeResult.index, writable:false }
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

    execute(global,objectArray,parentIndex,parentLength){
        return Helper.getItem(this.access,objectArray,this.index,this.exactLevel); 
    }

    toJavascriptDefinitionsCode(){
        if (this.exactLevel)
            return '';
        else
            return `let ${this.name}=$getItemSimple("${this.name}",$o,${this.index},${this.exactLevel});`;
    }

    toJavascriptCheckCode()
    {
        let access=this.toJavascriptAccessCode();
        return `$check(${access})`;
    }

    toJavascriptAccessCode(){
        if (this.isCurrentScope)
            return '$scope'+(this.name=='.'?'':'.'+this.access);
        else if (this.exactLevel)
            return `$o[${this.index}]`+(this.name=='.'?'':'.'+this.access);
        else
            return this.access;
    }
}

module.exports=KaytanProperty;
