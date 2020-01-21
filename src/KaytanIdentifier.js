const KaytanLogicToken=require('./KaytanLogicToken');
const Helper=require('./Helper');
const indexWithPia=v=> v?'$pia+'+v:'$pia';

class KaytanIdentifier extends KaytanLogicToken{
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
                accessIndex:{ value:scopeResult.accessIndex, writable:false },
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

    execute(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition=0){
        return Helper.getPropertyValue(this.access,scopes,this.index+partialIndexAddition,this.exactLevel); 
    }

    toJavascriptDefinitionsCode(){
        if (this.exactLevel || this.allreadyDefined)
            return '';
        else{
            return `let __${this.name}=$findPropertyValue("${this.name}",$o,${indexWithPia(this.index)});
let _${this.name}=__${this.name}.value;
`;
        }
    }

    toJavascriptScopesCode(){
        if (this.exactLevel){
            return `[...$o,${this.toJavascriptAccessCode()}]`;
        }else{
            return `[...__${this.name}.scopes,_${Helper.arrayAccessReplace(Helper.accessToScopeArray(this.access).join(',_'))}]`;
        }
    }

    toJavascriptCheckCode()
    {
        let access=this.toJavascriptAccessCode();
        return `$check(${access})`;
    }

    toJavascriptAccessCode(){
        let retVal;

        if (this.isCurrentScope)
            retVal=`$scope.${this.access}`;
        else if (this.exactLevel)
            retVal=`$o[${indexWithPia(this.index)}].${this.access}`;
        else
            retVal=`_${this.access}`;

        return Helper.arrayAccessReplace(retVal);
    }
}

module.exports=KaytanIdentifier;
