//errors
const KaytanSyntaxError=require('./KaytanSyntaxError');
const KaytanBugError=require('./KaytanBugError');

//properties
const KaytanIdentifier=require('./KaytanIdentifier');
const KaytanGlobalIdentifier=require('./KaytanGlobalIdentifier');
const KaytanSystemIdentifier=require('./KaytanSystemIdentifier');
const KaytanThisProperty=require('./KaytanThisProperty');

//basics
const KaytanStringToken=require('./KaytanStringToken');
const KaytanIdentifierValue=require('./KaytanIdentifierValue');
const KaytanTokenList=require('./KaytanTokenList');
const KaytanGlobalIdentifierDefiniton=require('./KaytanGlobalIdentifierDefiniton');
const KaytanParameterUsage=require('./KaytanParameterUsage');

//partials
const KaytanPartial=require('./KaytanPartial');
const KaytanPartialDefinition=require('./KaytanPartialDefinition');

//expressions
const KaytanLogicToken=require('./KaytanLogicToken');
const KaytanBinaryExpression=require('./KaytanBinaryExpression');
const KaytanCompareExpression=require('./KaytanCompareExpression');
const KaytanUnaryExpression=require('./KaytanUnaryExpression');
const KaytanAndExpression=require('./KaytanAndExpression');
const KaytanOrExpression=require('./KaytanOrExpression');
const KaytanNotExpression=require('./KaytanNotExpression');
const KaytanEqualityExpression=require('./KaytanEqualityExpression');

//literals
const KaytanLiteral=require('./KaytanLiteral');
const KaytanStringLiteral=require('./KaytanStringLiteral');
const KaytanNumberLiteral=require('./KaytanNumberLiteral');


//statements
const KaytanIfStatement=require('./KaytanIfStatement');
const KaytanNotIfStatement=require('./KaytanNotIfStatement');
const KaytanForStatement=require('./KaytanForStatement');
const KaytanForDictionaryStatement=require('./KaytanForDictionaryStatement');

const Helper=require('./Helper');

const delimiterChangeAllowedRegexBaseStr="((?![a-zA-Z0-9_ &|=()]).)+";
const delimiterChangeAllowedRegex=new RegExp(`=(${delimiterChangeAllowedRegexBaseStr} ${delimiterChangeAllowedRegexBaseStr})=`);


function getDelimiterRegexes(start,end){
    let s=Helper.escape(start,"\\");
    let e=Helper.escape(end,"\\");
    let r={
        token:new RegExp(`(${s}({(((?!}${e}).)+)})${e}|${s}(((?!${e}).)+)${e})( *(\\r\\n|\\r|\\n))?`,'g'),
        errorCheck:new RegExp(`${s}(((?!${e}).)*)$`),
    };
    return r;
}

const operatorToExpressionClass={
    "&":KaytanAndExpression,
    "|":KaytanOrExpression,
    "!":KaytanNotExpression,
    "=":KaytanEqualityExpression
}

function _parseExpressionRecursive(expression,errorIndex,curIndex){
    let _=this._parserRuntime;
    let lastIndex=curIndex;
    let token;
    let r=[];

    while((token=_.expressionRegex.exec(expression))){ 
        
        if (lastIndex!=token.index) //all characters must be recognized by the expressionRegex including spaces
            new KaytanSyntaxError('Invalid expression',errorIndex+token.index,this.template);        

        if (token[1]) //open paranthesis
            r.push(_parseExpressionRecursive.call(this,expression,errorIndex+lastIndex,lastIndex));
        else if (token[2]) //close paranthesis
            break;
        else if (token[3]){ //operator
            if (r.length){
                let left=r.pop();
                let right=_parseExpressionRecursive.call(this,expression,errorIndex+lastIndex,lastIndex);
                let expressionClass=operatorToExpressionClass[token[3]];
                if (expressionClass.__proto__==KaytanBinaryExpression){
                    if (left && left instanceof KaytanLogicToken){
                        if (right && right instanceof KaytanLogicToken){
                            r.push(new expressionClass(this,left,right));
                        }else
                            throw new KaytanSyntaxError("Expected righthand operand",errorIndex+token.index,this.template);
                    }else
                        throw new KaytanSyntaxError("Expected lefthand operand",errorIndex+token.index,this.template);
                }else if (expressionClass.__proto__==KaytanCompareExpression){
                    if (left && left instanceof KaytanIdentifier){
                        if (right && right instanceof KaytanLiteral){
                            r.push(new expressionClass(this,left,right));
                        }else if (right && right instanceof KaytanIdentifier &&  Helper.numberLiteralRegex(right.access)){
                            right=new KaytanNumberLiteral(this,right.access);
                            r.push(new expressionClass(this,left,right));
                        }else
                            throw new KaytanSyntaxError("Expected righthand literal",errorIndex+token.index,this.template);
                    }else
                        throw new KaytanSyntaxError("Expected lefthand identifier",errorIndex+token.index,this.template);
                }else
                    throw new KaytanBugError("Unknown expression class type",errorIndex+token.index,this.template);
            }else
                throw new KaytanSyntaxError("Expected lefthand operand",errorIndex+token.index,this.template);
        }else if (token[4]){ //unary operator
            let operand=_parseExpressionRecursive.call(this,expression,errorIndex+lastIndex,lastIndex);
            let expressionClass=operatorToExpressionClass[token[4]];
            if (expressionClass.__proto__==KaytanUnaryExpression){
                if (operand && operand instanceof KaytanLogicToken){
                    r.push(new expressionClass(this,operand));
                }else
                    throw new KaytanSyntaxError("Expected righthand operand",errorIndex+token.index,this.template);
            }else
                throw new KaytanBugError("Unknown expression class type",errorIndex+token.index,this.template);
        }else if (token[5]){ //identifier
            let identifier=parseIdentifier.call(this,token[5],errorIndex+token.index);
            r.push(identifier);
        }else if (token[12]){ //string literal
            let stringLiteral=new KaytanStringLiteral(this,token[12].substring(1,token[12].length-1).replace(/\\./g,v=>v.substring(1)));
            r.push(stringLiteral);
        }

        lastIndex=_.expressionRegex.lastIndex;

        if (lastIndex==expression.length)
            break;
    }

    if (!r.length)
        throw new KaytanSyntaxError("Empty expression block",errorIndex+lastIndex,this.template);

    if (r.length!=1)
        throw new KaytanBugError("Expression array must be ended with just 1 item",errorIndex+lastIndex,this.template);

    return r[0];
}

//treat as member function
function parseExpression(expression,errorIndex){
    if (expression){
        let _=this._parserRuntime;
    
        if (!_.expressionRegex)
            _.expressionRegex=new RegExp(Helper.expressionRegexStr,'g'); //use it under _parserRuntime, because it is resuable
        _.expressionRegex.lastIndex=0; //we use it stateful, so thats why it is recreated in each parser instance (consider parallel usages)
    
        return _parseExpressionRecursive.call(this,expression,errorIndex,0);

    }else
        new KaytanSyntaxError('Empty expression',errorIndex,this.template);
}

function checkSimpleIdentifierName(identifierName,errorIndex){
    if (!Helper.simpleIdentifierRegex.test(identifierName))
        throw new KaytanSyntaxError('Invalid identifier name:'+identifierName,errorIndex,this.template);
}
//treat as member function
function parseIdentifier(propertyName,errorIndex){
    let _=this._parserRuntime;
    if (propertyName==".")
        return new KaytanThisProperty(this,propertyName,_.block.scopeInfo);

    if (Helper.identifierRegex.test(propertyName)){
        if (propertyName[0]=='~')
            return new KaytanGlobalIdentifier(this,propertyName.substring(1));
        else if (propertyName[0]=='$')
            return new KaytanSystemIdentifier(this,propertyName.substring(1));
        else
            return new KaytanIdentifier(this,propertyName,_.block.scopeInfo);
    }else
        throw new KaytanSyntaxError('Invalid identifier:'+propertyName,errorIndex,this.template);
}


//treat as member function
function openBlock(conditionParserFn,tokenType,command,index,alternateAllowed=true,scopeType=0){ //0=current scope, 1=calculate scope from condition, 2=independent root scope
    let _=this._parserRuntime;
    let conditionName=command.substring(1).trim();
    this._temporaryBlockFlag=1; //TODO: do a elegant solution (it helps optimized code to calculate definition of variables. non-optimized engine not affected)
    let condition=conditionParserFn.call(this,conditionName,index);
    let block={ tokenType:tokenType, name:conditionName,condition:condition,alternateAllowed:alternateAllowed,default:[] };
    block.ast=block.default;
    if (scopeType==1){ //1=create a scope from the condition (condition must be a KaytanIdentifier)
        if (!condition instanceof KaytanIdentifier)
            throw new KaytanBugError("scopeType 1 is only used in a identifier condition type statements",index,this.template);
        
        let newScopeInfos=(new Array(condition.accessIndex+1)).fill(function(){ return { defined:{}}; }());
        block.scopeInfo=[..._.block.scopeInfo,...newScopeInfos];
    }else if (scopeType==2){ //2=use independent scope
        block.scopeInfo=[{ defined:{} }];
    }else //0=do not change the cope
        block.scopeInfo=_.block.scopeInfo;
    _.blockArr.push(block);
    _.block=block;
    this._temporaryBlockFlag=2; //TODO: do a elegant solution (it helps optimized code to calculate definition of variables. non-optimized engine not affected)
}

//treat as member functions
const tokenFactory={
    //Simple Tokens
    "!":()=>null, //ignore comments {{! no comment }}
    undefined:function(command,index){ //write value with default escape {{...}}
        let _=this._parserRuntime;
        let property=parseIdentifier.call(this,command.trim(),index);
        _.block.ast.push(new KaytanIdentifierValue(this,property,_.block.scopeInfo));
    },
    "&":function(command,index){ //write value with no escape or selected escape {{&...}} or {{&["'[(\ etc.]...}} or {{{...}}}=={{&...}} (see parseTemplate for last case)
        let _=this._parserRuntime;
        let escapeFnName=command[1];
        let identifierName;

        if (Helper.escapePrefixRegex.test(escapeFnName))
            identifierName=command.substring(2).trim();
        else{
            identifierName=command.substring(1).trim();
            escapeFnName="&";
        }

        let property=parseIdentifier.call(this,identifierName,index);
        _.block.ast.push(new KaytanIdentifierValue(this,property,_.block.scopeInfo,escapeFnName));
    },
    "@":function(command,index){ //report a parameter usage {{@...}}
        let _=this._parserRuntime;
        let identifierName=command.substring(1).trim();
        if (Helper.simpleIdentifierRegex.test(identifierName)){
            _.block.ast.push(new KaytanParameterUsage(this,identifierName));
        }else
            throw new KaytanSyntaxError('Invalid parameter usage identifier name:'+identifierName,index,this.template);        
    },
    "~":function(command,index){ //define a global flag to true {{~...}} (TODO: add {{~!...}}) to set flag false again
        let _=this._parserRuntime;
        let identifierName=command.substring(1).trim();
        if (Helper.simpleIdentifierRegex.test(identifierName)){
            _.block.ast.push(new KaytanGlobalIdentifierDefiniton(this,identifierName));
        }else
            throw new KaytanSyntaxError('Invalid global identifier name:'+identifierName,index,this.template);        
    },
    ">":function(command,index){ //partial call {{>...}} (partial must be defined with {{<...}}...{{/}} block token)
        let _=this._parserRuntime;
        let partialName=command.substring(1).trim();
        if (Helper.simpleIdentifierRegex.test(partialName)){
            _.block.ast.push(new KaytanPartial(this,partialName,_.block.scopeInfo.length-1));
        }else
            throw new KaytanSyntaxError('Invalid partial name:'+partialName,index,this.template);        
    },

    //Block Tokens
    "#":function (command,index){ openBlock.call(this,parseIdentifier,KaytanForStatement,command,index,true,1) },
    "[":function (command,index){ openBlock.call(this,parseIdentifier,KaytanForDictionaryStatement,command,index,true,1) },
    "?":function (command,index){ openBlock.call(this,parseExpression,KaytanIfStatement,command,index,true,0) },
    "^":function (command,index){ openBlock.call(this,parseExpression,KaytanNotIfStatement,command,index,true,0) },
    "<":function (command,index){ openBlock.call(this,checkSimpleIdentifierName,KaytanPartialDefinition,command,index,false,2) },
    ":":function(command,index){
        this._temporaryBlockFlag=3; //TODO: do a elegant solution (it helps optimized code to calculate definition of variables. non-optimized engine not affected)
        let _=this._parserRuntime;
        let conditionName=command.substring(1).trim();
        if (_.block.alternateAllowed){
            if (conditionName && conditionName!=_.block.name)
                throw new KaytanSyntaxError("Expected {{:${blockName}}}} or {{:}}",index,this.template);    
            _.block.alternate=[];
            _.block.ast=_.block.alternate;
        }else
            throw new KaytanSyntaxError("Unexpected {{:}}",index,this.template);
    },
    "/":function(command,index){
        delete this._temporaryBlockFlag; //TODO: do a elegant solution (it helps optimized code to calculate definition of variables. non-optimized engine not affected)
        let _=this._parserRuntime;
        let conditionName=command.substring(1).trim();
        
        if (conditionName && conditionName!=_.block.name)
            throw new KaytanSyntaxError("Expected {{/${blockName}}}} or {{/}}",index,this.template);

        delete _.block.ast;
        
        _.blockArr.pop();
        let block=_.block;
        let _default=new KaytanTokenList(this,block.default);
        let _alternate;
        if (block.alternate)
            _alternate=new KaytanTokenList(this,block.alternate);
        
        let token=new block.tokenType(this,block.condition || block.name,_default,_alternate);
        _.block=_.blockArr[_.blockArr.length-1];
        _.block.ast.push(token);
    },

    //Delimiter Change
    "=":function(command,index){ //{{=... ...=}}
        let _=this._parserRuntime;
        if (!delimiterChangeAllowedRegex.test(command))
            throw new KaytanSyntaxError("Delimiter change format wrong",index+command.length,this.template);

        let lastIndex=_.delimiterRegex.token.lastIndex; //index+command.length+_.startDelimiter.length+_.endDelimiter.length;

        let newDelimiters=command.substring(1,command.length-1).split(" ");

        _.startDelimiter=newDelimiters[0];
        _.endDelimiter=newDelimiters[1];
        _.delimiterRegex=getDelimiterRegexes(_.startDelimiter,_.endDelimiter);
        _.delimiterRegex.token.lastIndex=lastIndex; //continue from the latest position
    }    
}


//treat as member function of Kaytan
function parseTemplate(scopeInfo,defaultStartDelimiter="{{",defaultEndDelimiter="}}"){

    this._parserRuntime={
        delimiterRegex:getDelimiterRegexes(defaultStartDelimiter,defaultEndDelimiter),
        startDelimiter:defaultStartDelimiter,
        endDelimiter:defaultEndDelimiter,
        block:{ ast:[],scopeInfo:[{ defined:{} }] }
    }
    this._parserRuntime.blockArr=[this._parserRuntime.block]; //it is the root block
    let _=this._parserRuntime;

    if (this.template){

        let lastIndex=0;
        let token;
        while((token=_.delimiterRegex.token.exec(this.template))){
            let curIndex=token.index;
            if (curIndex>lastIndex){
                let strTokenData=this.template.substring(lastIndex,curIndex);
                _.block.ast.push(new KaytanStringToken(this,strTokenData));
            }

            let tokenCommand;
            if(token[2] && token[2][0]=="{" && token[2][token[2].length-1]=="}") //rewrite {{{...}}} case as {{&...}}
                tokenCommand="&"+token[3];  //see regex for why 3=inside triple tag 
            else
                tokenCommand=token[5]; //see regex for why 5=inside stadard tag

            let tokenFn=tokenFactory[tokenCommand[0]]||tokenFactory[undefined];
            tokenFn.call(this,tokenCommand,token.index);                    
            lastIndex=_.delimiterRegex.token.lastIndex;

            if (token[7]){ //see regex for why 7=white space and end line at the end of the tag 
                let b=_.block;
                for (let i=b.ast.length-1;i>-1;i--){
                    let t=b.ast[i];
                    if (t instanceof KaytanStringToken){
                        let lastStr=t.value.replace(/^ +/,"");
                        if (lastStr!="\r\n" && lastStr!='\r' && lastStr!='\n'){
                            b.ast.push(new KaytanStringToken(this,token[7]));
                        }
                        break;
                    }else if (t instanceof KaytanIdentifierValue){
                        b.ast.push(new KaytanStringToken(this,token[7]));
                        break;
                    }    
                }
            }
        }

        if (lastIndex<this.template.length){            
            let endOfTemplate=this.template.substring(lastIndex,this.template.length);

            if (_.delimiterRegex.errorCheck.test(endOfTemplate))
                throw new KaytanSyntaxError("Missing delimiter close at the end of the template",this.template.length,this.template);

            _.block.ast.push(new KaytanStringToken(this,endOfTemplate));
        }

        if (_.blockArr.length!=1)
            throw new KaytanSyntaxError("block end expected",endIndex,this.template);
    }

    let ast=_.block.ast;
    
    delete this._parserRuntime;

    //return new KaytanTokenList(this,ast);
    return { data:ast };
};

module.exports=parseTemplate;
