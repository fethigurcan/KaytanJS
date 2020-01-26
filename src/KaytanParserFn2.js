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
const KaytanAndExpression=require('./KaytanAndExpression');
const KaytanOrExpression=require('./KaytanOrExpression');
const KaytanNotExpression=require('./KaytanNotExpression');
const KaytanEqualityExpression=require('./KaytanEqualityExpression');

//literals
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
        token:new RegExp(`${s}({(((?!}${e}).)+)})${e}|${s}(((?!${e}).)+)${e}`,'g'),
        errorCheck:new RegExp(`${s}(((?!${e}).)*)$`),
    };
    return r;
}

//treat as member function
function parseExpression(expression,errorIndex){
    return parseIdentifier.call(this,expression,errorIndex); //TODO: implement the parser
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
        let _=this._parserRuntime;
        let conditionName=command.substring(1).trim();
        if (_.block.alternateAllowed){
            if (conditionName && conditionName!=_.block.name)
                throw new KaytanSyntaxError("else statement's name must be matched with the block or keep it empty",index,this.template);    
            _.block.alternate=[];
            _.block.ast=_.block.alternate;
        }else
            throw new KaytanSyntaxError("else statement is not allowed",index,this.template);
    },
    "/":function(command,index){
        let _=this._parserRuntime;
        let conditionName=command.substring(1).trim();
        
        if (conditionName && conditionName!=_.block.name)
            throw new KaytanSyntaxError("end statement's name must be matched with the block or keep it empty",index,this.template);

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

        let lastIndex=index+command.length+_.startDelimiter.length+_.endDelimiter.length;

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
            if (token.index>lastIndex)
                _.block.ast.push(new KaytanStringToken(this,this.template.substring(lastIndex,token.index)));

            let tokenCommand;
            if(token[1] && token[1][0]=="{" && token[1][token[1].length-1]=="}") //rewrite {{{...}}} case as {{&...}}
                tokenCommand="&"+token[2];  //see regex for why 2
            else
                tokenCommand=token[4]; //see regex for why 4

            let tokenFn=tokenFactory[tokenCommand[0]]||tokenFactory[undefined];
            tokenFn.call(this,tokenCommand,token.index);                    

            lastIndex=_.delimiterRegex.token.lastIndex;
        }

        if (lastIndex<this.template.length){            
            let endOfTemplate=this.template.substring(lastIndex,this.template.length);

            if (_.delimiterRegex.errorCheck.test(endOfTemplate))
                throw new KaytanSyntaxError("missing delimiter close at the end of the template",this.template.length,this.template);

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
