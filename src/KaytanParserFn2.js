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

const delimiterChangeAllowedRegex=/((?![a-zA-Z0-9_ &|=()]).)+/;

const delimiterRegexes={
    "{{ }}":{
        token:/{{({(((?!}}}).)+)})}}|{{(((?!}}).)+)}}/g,
        errorCheck:/{{(((?!}}).)*)$/,
        delimiterChange:/{{=(.+ .+)=}}/
    }
}

function getDelimiterRegexes(start,end){
    let r=delimiterRegexes[start+' '+end];
    if (r)
        return r;

    let s=Helper.escape(start,"\\");
    let e=Helper.escape(end,"\\");
    r={
        token:new RegExp(`${s}{(((?!}${e}).)+)}${e}|${s}(((?!${e}).)+)${s}`,'g'),
        errorCheck:new RegExp(`${s}(((?!${e}).)*)$`),
        delimiterChange:new RegExp(`${s}=(.+ .+)=${s}`)
    };
    delimiterRegexes[start+' '+end]=r;
    return r;
}

blockToken={
    "#":"",
    "^":"",
    "[":"",
    "?":"",
    "<":"",
    ":":"",
    "/":""
}

simpleToken={
    "!":()=>null, //ignore comments {{! no comment }}
    undefined:function(command,index,block){ //write value with default escape {{...}}
        let property=parseProperty.call(this,command,index,block.scopeInfo);
        block.ast.push(new KaytanIdentifierValue(this,property,block.scopeInfo));
    },
    "&":function(command,index,block){ //write value with no escape or selected escape {{&...}} or {{&["'[(\ etc.]...}} or {{{...}}}=={{&...}} (see parseTemplate for last case)
        let escapeFnName=command[0];
        let identifierName;

        if (Helper.escapePrefixRegex.test(escapeFnName))
            identifierName=command.substring(2).trim();
        else{
            identifierName=command.substring(1).trim();
            escapeFnName="&";
        }

        let property=parseProperty.call(this,identifierName,index,block.scopeInfo);
        block.ast.push(new KaytanIdentifierValue(this,property,block.scopeInfo,escapeFnName));
    },
    "@":function(command,index,block){ //report a parameter usage {{@...}}
        let identifierName=command.substring(1).trim();
        if (Helper.simpleIdentifierRegex.test(identifierName)){
            block.ast.push(new KaytanParameterUsage(this,identifierName));
        }else
            throw new KaytanSyntaxError('Invalid parameter usage identifier name:'+identifierName,index,this.template);        
    },
    "~":function(command,index,block){ //define a global flag to true {{~...}} (TODO: add {{~!...}}) to set flag false again
        let identifierName=command.substring(1).trim();
        if (Helper.simpleIdentifierRegex.test(identifierName)){
            block.ast.push(new KaytanGlobalIdentifierDefiniton(this,identifierName));
        }else
            throw new KaytanSyntaxError('Invalid global identifier name:'+identifierName,index,this.template);        
    },
    ">":function(command,index,block){ //partial call {{>...}} (partial must be defined with {{<...}}...{{/}} block token)
        let partialName=command.substring(1).trim();
        if (Helper.simpleIdentifierRegex.test(partialName)){
            block.ast.push(new KaytanPartial(this,partialName,block.scopeInfo.length-1));
        }else
            throw new KaytanSyntaxError('Invalid partial name:'+partialName,index,this.template);        
    }
}

//treat as member function of Kaytan
function parseTemplate(scopeInfo,defaultStartDelimiter="{{",defaultEndDelimiter="}}"){
    let delimiterRegex=getDelimiterRegexes(defaultStartDelimiter,defaultEndDelimiter);
    let startDelimiter=defaultStartDelimiter;
    let endDelimiter=defaultEndDelimiter;
    let delimiterStartLength=defaultStartDelimiter.length;
    let delimiterEndLength=defaultEndDelimiter.length;
    let ast=[];
    let blockArr=[{ ast:ast,blockTokenFn:null }]; //it is the root block

    function changeDelimiter(delimiter,index){
        startIndex+=delimiter.length;
        let newDelimiters=delimiter.substring(startDelimiter.length+1,delimiter.length-endDelimiter.length-1).split(" ");
        startDelimiter=newDelimiters[0];
        endDelimiter=newDelimiters[1];
        if (!delimiterChangeAllowedRegex.test(startDelimiter))
            throw new KaytanSyntaxError("Disallowed characters in delimiter change:"+startDelimiter,index,this.template);
        
        if (!delimiterChangeAllowedRegex.test(endDelimiter))
            throw new KaytanSyntaxError("Disallowed characters in delimiter change:"+endDelimiter,index,this.template);

        delimiterRegex=getDelimiterRegexes(startDelimiter,endDelimiter);
    }

    debugger;
    if (this.template){

        //find is there any delimiter changes for splitting template in two parts (and recursively offcourse)
        let startIndex=0;
        let endIndex=0;
        let block=blockArr[blockArr.length-1];

        while(endIndex!=this.template.length){

            let delimiterChange=this.template.substring(startIndex).match(delimiterRegex.delimiterChange);
            if (delimiterChange){ //there is at least one delimiter change in the template after startIndex
                if (delimiterChange.index>0) //keep delimiterChange to change after parse
                    endIndex=delimiterChange.index;
                else{ //change delimiter now and null to prevent change after parse
                    changeDelimiter(delimiterChange[0],delimiterChange.index);
                    delimiterChange=null;
                }
            }else //there is no more delimiter changes
                endIndex=this.template.length;
    
            let tokens=this.template.substring(startIndex,endIndex).matchAll(delimiterRegex.token);
            let lastIndex=0;
            let token;
            while((token=tokens.next())){
                let valueIndex=startIndex+token.value.index;
                if (valueIndex>lastIndex)
                    block.ast.push(new KaytanStringToken(this,this.template.substring(lastIndex,valueIndex)));

                let tokenCommand=token.value[1];
                
                if(tokenCommand[0]=="{" && tokenCommand[tokenCommand.length-1]=="}") //rewrite {{{...}}} case as {{&...}}
                    tokenCommand="&"+token.value[2]; 

                let blockTokenFn=blockToken[tokenCommand[0]];
                if (blockTokenFn){
                    //start a block with the returning info

                    //if (block else or end token) then close the block
                    //else
                    //  throw new KaytanSyntaxError("Unrecognized token:"+tokenRaw,token.value.index,this.template);
                }else{
                    let simpleTokenFn=simpleToken[tokenCommand[0]]||simpleToken[undefined];
                    simpleTokenFn.call(this,tokenCommand,scopeInfo,valueIndex,block,blockArr);                    
                }
                //TODO: if it is not a block parse directly and if it is a block use last block token;
                //TODO: parse token data

                lastIndex=valueIndex+token.value[0].length;
            }

            if (lastIndex<endIndex){
                let tmp=template.substring(lastIndex,endIndex);

                if (endIndex==this.template.length && delimiterRegex.errorCheck.test(tmp))
                    throw new KaytanSyntaxError("missing delimiter close at the end of the template",endIndex,this.template);

                block.ast.push(new KaytanStringToken(this,tmp));
            }

            if (delimiterChange) //change the delimiter after parse until endindex
                changeDelimiter(delimiterChange[0],delimiterChange.index);
        }

        if (blockArr.length!=1)
            throw new KaytanBugError("blockArr not emptied",endIndex,this.template);
    }


    return ast;
};

module.exports=parseTemplate;
