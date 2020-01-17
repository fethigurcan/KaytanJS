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
        else
            return `let _${this.name}=$findPropertyValue("${this.name}",$o,${indexWithPia(this.index)});
`;
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

        /*if (this.isCurrentScope)
            //return `$getValue($scope${Helper.arrayAccessReplace("."+this.name)})`;
            return `($isObjectOrArray($scope${Helper.arrayAccessReplace("."+this.name)})?${'$scope'+(Helper.arrayAccessReplace('.'+this.access))}:${'$scope'+(this.name=='.'?'':Helper.arrayAccessReplace('.'+this.name))}=="${this.access.substring(this.name.length+1)}")`;
        else if (this.exactLevel){
            let parentAccess=`$o[${this.index?`$pia+${this.index}`:'$pia'}]`;
            return `($isObjectOrArray(${parentAccess})?${parentAccess+(this.name=='.'?'':Helper.arrayAccessReplace('.'+this.access))}:${parentAccess}=="${this.access.substring(this.name.length+1)}")`;
        }else if (this.name==this.access)
            return Helper.arrayIndexRegex.test(this.access)?`$scope[${this.access}]`:"_"+this.access; //array access only in the scope
        else if (Helper.arrayIndexRegex.test(this.name))
            return `($isObjectOrArray($scope[${this.name}])?$scope[${this.name}]${Helper.arrayAccessReplace(this.access.substring(this.name.length))}:$scope[${this.name}]=="${this.access.substring(this.name.length+1)}")`;
        else
            return `($isObjectOrArray(_${this.name})?_${Helper.arrayAccessReplace(this.access)}:_${this.name}=="${this.access.substring(this.name.length+1)}")`;
            */
    }
}

module.exports=KaytanIdentifier;
