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

const delimiterRegexes={
    "{{ }}":{
        token:/{{({(((?!}}}).)+)})}}|{{(((?!}}).)+)}}/g,
        errorCheck:/{{(((?!}}).)*)$/,
        delimiterChange:/{{=(.+ .+)=}}/
    }
}

function getDelimiterRegexes(start,end){
    let r=delimiterRegexes[start+' '+end];
    if (r){
        r.token.lastIndex=0;
        r.errorCheck.lastIndex=0;
        r.delimiterChange.lastIndex=0;
        return r;
    }

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

//treat as member function
function createProperty(propertyName,errorIndex){
    let _=this._parserRuntime;
    if (propertyName==".")
        return new KaytanThisIdentifier(this,propertyName,_.scopeInfo);

    if (Helper.identifierRegex.test(propertyName)){
        if (propertyName[0]=='~')
            return new KaytanGlobalIdentifier(this,propertyName.substring(1));
        else if (propertyName[0]=='$')
            return new KaytanSystemIdentifier(this,propertyName.substring(1));
        else
            return new KaytanIdentifier(this,propertyName,_.scopeInfo);
    }else
        throw new KaytanSyntaxError('Invalid property:'+propertyName,errorIndex,this.template);
}

//treat as member function
function openBlock(){

}

//treat as member function
function closeBlock(){

}

//treat as member functions
tokenFactory={
    //Simple Tokens
    "!":()=>null, //ignore comments {{! no comment }}
    undefined:function(command,index){ //write value with default escape {{...}}
        let _=this._parserRuntime;
        let property=createProperty.call(this,command,index);
        _.block.ast.push(new KaytanIdentifierValue(this,property,_.scopeInfo));
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

        let property=createProperty.call(this,identifierName,index);
        _.block.ast.push(new KaytanIdentifierValue(this,property,_.scopeInfo,escapeFnName));
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
            _.block.ast.push(new KaytanPartial(this,partialName,_.scopeInfo.length-1));
        }else
            throw new KaytanSyntaxError('Invalid partial name:'+partialName,index,this.template);        
    },

    //Block Tokens
    "#":"",
    "[":"",
    "?":"",
    "^":"",
    "<":"",
    ":":"",
    "/":"",

    //Delimiter Change
    "=":function(command,index){ //{{=... ...=}}
        let _=this._parserRuntime;
        if (!delimiterChangeAllowedRegex.test(command))
            throw new KaytanSyntaxError("Delimiter change format wrong",index+command.length,this.template);

        let newDelimiters=command.substring(1,command.length-1).split(" ");

        _.startDelimiter=newDelimiters[0];
        _.endDelimiter=newDelimiters[1];
    
        _.delimiterRegex=getDelimiterRegexes(_.startDelimiter,_.endDelimiter);
    }    
}


//treat as member function of Kaytan
function parseTemplate(scopeInfo,defaultStartDelimiter="{{",defaultEndDelimiter="}}"){

    this._parserRuntime={
        delimiterRegex:getDelimiterRegexes(defaultStartDelimiter,defaultEndDelimiter),
        startDelimiter:defaultStartDelimiter,
        endDelimiter:defaultEndDelimiter,
        block:{ ast:[],blockTokenFn:null },
        scopeInfo:[{ defined:{} }]
    }
    this._parserRuntime.blockArr=[this._parserRuntime.block]; //it is the root block
    let _=this._parserRuntime;

    debugger;
    if (this.template){

        let lastIndex=0;
        let token;
        while((token=_.delimiterRegex.token.exec(this.template))){
            if (token.index>lastIndex)
                _.block.ast.push(new KaytanStringToken(this,this.template.substring(lastIndex,token.index)));

            let tokenCommand=token[4]; //see regex for why 4
            
            if(tokenCommand[0]=="{" && tokenCommand[tokenCommand.length-1]=="}") //rewrite {{{...}}} case as {{&...}}
                tokenCommand="&"+token[2];  //see regex for why 2

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
