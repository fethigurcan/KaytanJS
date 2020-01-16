//errors
var KaytanSyntaxError=require('./KaytanSyntaxError');
var KaytanBugError=require('./KaytanBugError');

//properties
var KaytanProperty=require('./KaytanProperty');
var KaytanGlobalProperty=require('./KaytanGlobalProperty');
var KaytanSystemProperty=require('./KaytanSystemProperty');
var KaytanThisProperty=require('./KaytanThisProperty');

//basics
var KaytanStringToken=require('./KaytanStringToken');
var KaytanPropertyValue=require('./KaytanPropertyValue');
var KaytanTokenList=require('./KaytanTokenList');
var KaytanGlobalPropertyDefiniton=require('./KaytanGlobalPropertyDefiniton');
var KaytanParameterUsage=require('./KaytanParameterUsage');

//partials
var KaytanPartial=require('./KaytanPartial');
var KaytanPartialDefinition=require('./KaytanPartialDefinition');

//expressions
var KaytanAndOperator=require('./KaytanAndOperator');
var KaytanOrOperator=require('./KaytanOrOperator');
var KaytanNotExpression=require('./KaytanNotExpression');

//statements
var KaytanIfStatement=require('./KaytanIfStatement');
var KaytanNotIfStatement=require('./KaytanNotIfStatement');
var KaytanForStatement=require('./KaytanForStatement');
var KaytanKeyForStatement=require('./KaytanKeyForStatement');

var Helpers=require('./Helper');

//treat as member function of Kaytan
function parseProperty(propertyName,errorIndex,scopeInfo){
    if (Helpers.commandNameRegex.test(propertyName)){
        if (propertyName[0]=='~')
            return new KaytanGlobalProperty(this,propertyName.substring(1));
        else if (propertyName[0]=='$')
            return new KaytanSystemProperty(this,propertyName.substring(1));
        else
            return new KaytanProperty(this,propertyName,scopeInfo);
    }else
        throw new KaytanSyntaxError('Invalid property:'+propertyName,errorIndex,this.template);
}

//treat as member function of Kaytan
function parseExpression(expression,templateIndex,scopeInfo,i,level,stopAtLevel){
    let retVal=[];
    let buffer='';
    level=level||0;
    for (i=i||0;i<expression.length;i++){
        if (expression[i]=='|' || expression[i]=='&'){
            if (level==stopAtLevel){
                i--;
                break;
            }else{
                let r=parseExpression.call(this,expression,templateIndex,scopeInfo,i+1,level,stopAtLevel);
                level=r.level;
                if (buffer){
                    if (Helpers.commandNameRegex.test(buffer)){
                        if (expression[i]=='&')
                            retVal.push(new KaytanAndOperator(this,parseProperty.call(this,buffer,templateIndex+i,scopeInfo),r.data));
                        else
                            retVal.push(new KaytanOrOperator(this,parseProperty.call(this,buffer,templateIndex+i,scopeInfo),r.data));
                    }else
                    throw new KaytanSyntaxError('Invalid expression:'+buffer,templateIndex+i,this.template);
                    buffer='';
                }else if(retVal.length==1){
                    if (expression[i]=='&')
                        retVal=[new KaytanAndOperator(this,retVal[0],r.data)];
                    else
                        retVal=[new KaytanOrOperator(this,retVal[0],r.data)];
                }else
                    throw new KaytanSyntaxError('Excepted lefthand operand',templateIndex+i,this.template);
                i=r.i;
            }
        }else if (expression[i]=='!'){
            if (buffer || retVal.length)
                throw new KaytanSyntaxError('Invalid lefthand operand',templateIndex+i,this.template);
            else{
                let r=parseExpression.call(this,expression,templateIndex,scopeInfo,i+1,level,level);
                retVal.push(new KaytanNotExpression(this,r.data));
                level=r.level;
                i=r.i;
            }
        }else if (expression[i]=='('){
            let r=parseExpression.call(this,expression,templateIndex,scopeInfo,i+1,level+1,stopAtLevel);
            if (r.level>level)
                throw new KaytanSyntaxError('Missing )',templateIndex+i,this.template);
            level=r.level;       
            retVal.push(r.data);
            i=r.i;
            if (level==stopAtLevel)
                break;
        }else if (expression[i]==')'){
            level--;
            break;
        }else if(expression[i]==' '){
            continue;
        }else
            buffer+=expression[i];
    }

    if (buffer){
        if (Helpers.commandNameRegex.test(buffer))
            retVal.push(parseProperty.call(this,buffer,templateIndex+i,scopeInfo));
        else
            throw new KaytanSyntaxError('Invalid expression:'+buffer,templateIndex+i,this.template);
    }
    if (level<0)
        throw new KaytanSyntaxError('Unexpected )',templateIndex+i,this.template);

    return { data:retVal.length>1?retVal:retVal[0], i:i,level:level };    
};

//treat as member function of Kaytan
function parseTemplate(scopeInfo,defaultStartDelimiter="{{",defaultEndDelimiter="}}",i,blockName){
    let retVal=[];
    let j=0;
    let buffer;
    let blockEnded=false;
    let delimiterStart=defaultStartDelimiter;
    let delimiterEnd=defaultEndDelimiter;
    for (i=i||0;i<this.template.length;i++){
        if (!buffer){
            if (this.template[i] == delimiterStart[0]){
                buffer=this.template[i];
            }else {
                if (!retVal[j])
                    retVal.push('');
                retVal[j]+=this.template[i];
            }
        }else{
            if (buffer.length==delimiterStart.length){
                buffer+=this.template[i];
                if (!buffer.startsWith(delimiterStart)){
                    if (!retVal[j])
                        retVal.push('');
                    retVal[j]+=buffer[0];
                    buffer=buffer.substring(1);
                }
            }else if (buffer.length>=delimiterStart.length+delimiterEnd.length && buffer.substring(buffer.length-(delimiterEnd.length-1))+this.template[i]==delimiterEnd){
                buffer+=this.template[i];
                
                /*do not use start and end newlines around template tags. user double enter if you really want */
                if (retVal[j] && typeof(retVal[j])=="string"){
                    if (retVal[j][retVal[j].length-1]=="\n"){
                        let oldi=i;
                        if (this.template[i+1]=="\r" || this.template[i+1]=="\n")
                            i++;
                        if (this.template[i]=="\r" && this.template[i+1]=="\n")
                            i++;
                        if (i!=oldi)
                            retVal[j]=retVal[j].replace(/(\r)?\n$/,"");
                    }
                }
                /*END OF: do not use start and end newlines around template tags. user double enter if you really want */

                if (buffer.length>delimiterStart.length+delimiterEnd.length){
                    let command=buffer.substring(delimiterStart.length,buffer.length-delimiterEnd.length);
                    if (command[0]=='/'){
                        if (blockName){
                            command=command.substring(1).trim();
                            if (command && blockName!=command) //end tags supported but optional. But if used it must be matched.
                                throw new KaytanSyntaxError(`Expected {{/${blockName}}}} or {{/}}`,i,this.template);
                            blockEnded=true;
                            buffer=null;
                            break;
                        }
                        else
                            throw new KaytanSyntaxError('Unexpected /',i,this.template);
                    }else if (command[0]=="?" || command[0]=="^"){
                        this._temporaryBlockFlag=2;
                        let command1=command.substring(1).trim();
                        let r=parseTemplate.call(this,scopeInfo,delimiterStart,delimiterEnd,i+1,command1);
                        if (command1){
                            this._temporaryBlockFlag=1;
                            let block={ 
                                if:parseExpression.call(this,command1,i-command.length,scopeInfo).data,
                                then:r.data.length==1?r.data[0]:new KaytanTokenList(this,r.data),
                                else:r.data.else
                            };
                            if (typeof(block.then)=="string")
                                block.then=new KaytanStringToken(this,block.then);
                            if (typeof(block.else)=="string")
                                block.else=new KaytanStringToken(this,block.else);
            
                            if (command[0]=='?')
                                retVal.push(new KaytanIfStatement(this,block.if,block.then,block.else));
                            else 
                                retVal.push(new KaytanNotIfStatement(this,block.if,block.then,block.else));
                            i=r.i;
                        }else
                            throw new KaytanSyntaxError('Empty expression',i,this.template);
                        
                        delete this._temporaryBlockFlag;
                    }else if (command[0]=='#' || command[0]=="["){
                        this._temporaryBlockFlag=2;
                        let command1=command.substring(1).trim();
                        if (command1){
                            this._temporaryBlockFlag=1;
                            let r=parseTemplate.call(this,[...scopeInfo,{ defined:{} }],delimiterStart,delimiterEnd,i+1,command1);
                            let block={ 
                                for:parseProperty.call(this,command1,i,scopeInfo,null),
                                loop:r.data.length==1?r.data[0]:new KaytanTokenList(this,r.data),
                                else:r.data.else
                            };

                            if (typeof(block.loop)=="string")
                                block.loop=new KaytanStringToken(this,block.loop);
                            if (typeof(block.else)=="string")
                                block.else=new KaytanStringToken(this,block.else);

                            if (command[0]=='#')
                                retVal.push(new KaytanForStatement(this,block.for,block.loop,block.else));
                            else 
                                retVal.push(new KaytanKeyForStatement(this,block.for,block.loop,block.else));
                            i=r.i;
                        }else
                            throw new KaytanSyntaxError('Empty variable',i,this.template);

                        delete this._temporaryBlockFlag;
                    }else if (command[0]==':'){
                        this._temporaryBlockFlag=3;
                        if (blockName){
                            command=command.substring(1).trim();
                            if (command && blockName!=command) //end tags supported but optional. But if used it must be matched.
                                throw new KaytanSyntaxError(`Expected {{:${blockName}}}} or {{:}}`,i,this.template);

                            let r=parseTemplate.call(this,scopeInfo,delimiterStart,delimiterEnd,i+1,blockName);
                            retVal.else=r.data.length==1?r.data[0]:new KaytanTokenList(this,r.data);
                            blockEnded=true;
                            buffer=null;
                            i=r.i;
                            break;
                        }else
                            throw new KaytanSyntaxError('Unexpected :',i,this.template);
                    }else if (command[0]=="&"){
                        let command1=command.substring(1).trim();
                        let command2,escapeFnName;
                        if (Helpers.commandPrefixToken.test(command1[0])){
                            command2=command1.substring(1);
                            escapeFnName=command1[0];
                        }else{
                            command2=command1;
                            escapeFnName="&";
                        }
                        retVal.push(new KaytanPropertyValue(this,parseProperty.call(this,command2,i,scopeInfo),scopeInfo,escapeFnName));
                    }else if (command[0]=='~' || command[0]=='@'){
                        let command1=command.substring(1).trim();
                        if (Helpers.simpleCommandNameRegex.test(command1)){
                            if (command[0]=='~')
                                retVal.push(new KaytanGlobalPropertyDefiniton(this,command1));
                            else   
                                retVal.push(new KaytanParameterUsage(this,command1));
                        }else
                            throw new KaytanSyntaxError('Invalid global variable name:'+command,i,this.template);
                    }else if (command[0]=='{' && (command[command.length-1]=='}' || this.template[i+1]==delimiterEnd[delimiterEnd.length-1])){ //{{{ }}} support just for compatibility
                        if (command[command.length-1]!='}') //this happens when with default delimiter and/or any delimiter that ends with }
                            i++;
                        let command1=command.substring(1).trim().replace(/}$/,'').trim();
                        retVal.push(new KaytanPropertyValue(this,parseProperty.call(this,command1,i,scopeInfo),scopeInfo,"&"));
                    }else if (command.trim()=='.'){ //DİKKAT: ilk karakter değil tümü=.
                        retVal.push(new KaytanPropertyValue(this,new KaytanThisProperty(this,scopeInfo),scopeInfo));
                    }else if (command[0]=='!'){ 
                        //ignore comments
                    }else if (command[0]=='='){
                        if (command[command.length-1]=="="){
                            command=command.replace(/^=|=$/g,"");
                            let newDelimiters=command.split(' ');
                            if (newDelimiters.length==2){
                                let delimiterIllegalRegex=/[a-zA-Z0-9_=&|!]/g;
                                if (delimiterIllegalRegex.test(newDelimiters[0])||delimiterIllegalRegex.test(newDelimiters[1]))
                                    throw new KaytanSyntaxError('Delimiters can\'t contain [a-zA-Z0-9_=]',i,this.template);
                                delimiterStart=newDelimiters[0];
                                delimiterEnd=newDelimiters[1];
                            }else
                                throw new KaytanSyntaxError('Delimiter directive needs start and end delimiters that separated by a space',i,this.template);
                        }else
                            throw new KaytanSyntaxError('Delimiter directive must be end with = ',i,this.template);
                    }else if (command[0]=='<'){
                        let a={};
                        command=command.substring(1).trim();
                        let r=parseTemplate.call(this,[{ defined:{} }],delimiterStart,delimiterEnd,i+1,command); //[{ defined:{} }] means independent scopeInfo for every partial definition
                        if (command){
                            if (Helpers.simpleCommandNameRegex.test(command)){
                                if (r.data.else)
                                    throw new KaytanSyntaxError('Invalid else statement in partial block',i,this.template);
                                let tokenList=new KaytanTokenList(this,r.data);
                                retVal.push(new KaytanPartialDefinition(this,command,tokenList.length==1?tokenList[0]:tokenList));
                                i=r.i;
                            }else
                                throw new KaytanSyntaxError('Invalid partial name:'+command,i,this.template);
                        }else
                        throw new KaytanSyntaxError('Empty variable',i,this.template);
                    }else if (command[0]=='>'){
                        let command1=command.substring(1).trim();
                        if (Helpers.simpleCommandNameRegex.test(command1)){
                            retVal.push(new KaytanPartial(this,command1,scopeInfo.length-1));
                        }else
                            throw new KaytanSyntaxError('Invalid partial name:'+command,i,this.template);
                    }else{
                        retVal.push(new KaytanPropertyValue(this,parseProperty.call(this,command.trim(),i,scopeInfo),scopeInfo));
                    }
                    j=retVal.length;
                    buffer=null;
                }else
                    throw new KaytanSyntaxError('Empty directive',i,this.template);
            }else
                buffer+=this.template[i];
        }
    }

    if (buffer)
        if (typeof(retVal[retVal.length-1])=="string")
            retVal[retVal.length-1]+=buffer;
        else
            retVal.push(new KaytanStringToken(this,buffer));

    if (blockName && !blockEnded)
        throw new KaytanSyntaxError('Unclosed block',i,this.template);
        
    return { data:retVal, i:i };
};

module.exports=parseTemplate;
