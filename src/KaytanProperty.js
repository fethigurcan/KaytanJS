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

    execute(global,objectArray,parentIndex,parentLength,partialIndexAddition=0){
        return Helper.getPropertyValue(this.access,objectArray,this.index+partialIndexAddition,this.exactLevel); 
    }

    toJavascriptDefinitionsCode(){
        if (this.exactLevel)
            return '';
        else
            return `let ${this.name}=$findPropertyValue("${this.name}",$o,${this.index?`$pia+${this.index}`:'$pia'});`;
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
            return `$o[${this.index?`$pia+${this.index}`:'$pia'}]`+(this.name=='.'?'':'.'+this.access);
        else
            return this.access;
    }
}

module.exports=KaytanProperty;
