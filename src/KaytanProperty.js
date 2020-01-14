const KaytanLogicToken=require('./KaytanLogicToken');
const KaytanRuntimeError=require('./KaytanRuntimeError');
const Helper=require('./Helper');

class KaytanProperty extends KaytanLogicToken{
    constructor(engine,name,scopeInfo){
        super(engine);
        if (scopeInfo!==false && name!="."){ //system and global constructors dont need

            let scopeResult=Helper.getScopeInfo(name,scopeInfo);

            let allreadyDefined=true;
            let si=scopeInfo[scopeResult.index];
            let definedBefore=si.defined[scopeResult.name];
            if (!definedBefore){
                si.defined[scopeResult.name]={ definedBy:this,_temporaryBlockFlag:engine._temporaryBlockFlag }; //TODO: more elegant solution
                allreadyDefined=false;
            }else{
                //debugger;
                if (engine._temporaryBlockFlag!=definedBefore._temporaryBlockFlag){
                    if (definedBefore._temporaryBlockFlag!=1&&definedBefore._temporaryBlockFlag){
                        if (engine._temporaryBlockFlag==1){
                            //debugger;
                            definedBefore.definedBy.allreadyDefined=true;
                        }else if (!engine._temporaryBlockFlag){
                            //debugger;
                            definedBefore.definedBy.allreadyDefined=true;
                        }
                        si.defined[scopeResult.name]={ definedBy:this,_temporaryBlockFlag:engine._temporaryBlockFlag }; //TODO: more elegant solution
                        allreadyDefined=false;
                    }
                }
            }

            Object.defineProperties(this,{
                name:{ value:scopeResult.name, writable:false },
                access:{ value:scopeResult.access, writable:false },
                exactLevel:{ value:scopeResult.exactLevel, writable:false },
                isCurrentScope:{ value:scopeResult.isCurrentScope, writable:false },
                index:{ value:scopeResult.index, writable:false },
                allreadyDefined:{ value:allreadyDefined, writable:true } //other property values can change this state during parse
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
        if (this.exactLevel || this.allreadyDefined)
            return '';
        else
            return `let _${this.name}=$findPropertyValue("${this.name}",$o,${this.index?`$pia+${this.index}`:'$pia'});
`;
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
            return "_"+this.access;
    }
}

module.exports=KaytanProperty;
