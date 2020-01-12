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

var Helpers=require('./Helper');

//treat as member function of Kaytan
function parseProperty(propertyName,errorIndex,scopeInfo){
    if (Helpers.commandNameRegex.test(propertyName)){
        if (propertyName[0]=='$')
            return new KaytanGlobalProperty(this,propertyName.substring(1));
        else if (propertyName[0]=='#')
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
function parseTemplate(scopeInfo,i,blockName){
    let retVal=[];
    let j=0;
    let buffer;
    let blockEnded=false;
    for (i=i||0;i<this.template.length;i++){
        if (!buffer){
            if (this.template[i] == '\\' || this.template[i] == '{'){
                if (j<retVal.length)
                    retVal[j]=new KaytanStringToken(this,retVal[j]);
                buffer=this.template[i];
            }else {
                if (!retVal[j]) retVal.push('');
                    retVal[j]+=this.template[i];
            }
        }else{
            if (buffer=='\\'){
                retVal[j]+=this.template[i];
                buffer=null;        
            }else if (this.template[i]!='{' && buffer=='{'){
                throw new KaytanSyntaxError('Expected {',i,this.template);
            }else if (this.template[i]=='}' && buffer.startsWith('{{') && buffer[buffer.length-1]=='}'){
                buffer+=this.template[i];
                if (buffer.length>4){
                    let command=buffer.substring(2,buffer.length-2);
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
                    }else if (Helpers.logicCommandPrefixToken.test(command[0])){
                        let command1=command.substring(1).trim();
                        let r=parseTemplate.call(this,scopeInfo,i+1,command1);
                        if (command1){
                            let block={ 
                                if:parseExpression.call(this,command1,i-command.length,scopeInfo).data,
                                then:r.data.length==1?r.data[0]:new KaytanTokenList(this,r.data),
                                else:r.data.else
                            };
                            if (command[0]=='?')
                                retVal.push(new KaytanIfStatement(this,block.if,block.then,block.else));
                            else 
                                retVal.push(new KaytanNotIfStatement(this,block.if,block.then,block.else));
                            i=r.i;
                        }else
                            throw new KaytanSyntaxError('Empty expression',i,this.template);
                    }else if (command[0]=='#'){
                        command=command.substring(1).trim();
                        if (command){
                            let r=parseTemplate.call(this,[...scopeInfo,{ defined:[] }],i+1,command);
                            let block={ 
                                for:parseProperty.call(this,command,i,scopeInfo,null),
                                loop:r.data.length==1?r.data[0]:new KaytanTokenList(this,r.data),
                                else:r.data.else
                            };
                            retVal.push(new KaytanForStatement(this,block.for,block.loop,block.else));
                            i=r.i;
                        }else
                            throw new KaytanSyntaxError('Empty variable',i,this.template);
                    }else if (command[0]==':'){
                        if (blockName){
                            command=command.substring(1).trim();
                            if (command && blockName!=command) //end tags supported but optional. But if used it must be matched.
                                throw new KaytanSyntaxError(`Expected {{:${blockName}}}} or {{:}}`,i,this.template);

                            let r=parseTemplate.call(this,scopeInfo,i+1,blockName);
                            retVal.else=r.data.length==1?r.data[0]:new KaytanTokenList(this,r.data);
                            blockEnded=true;
                            buffer=null;
                            i=r.i;
                            break;
                        }else
                            throw new KaytanSyntaxError('Unexpected :',i,this.template);
                    }else if (Helpers.commandPrefixToken.test(command[0])){
                        let command1=command.substring(1).trim();
                        retVal.push(new KaytanPropertyValue(this,parseProperty.call(this,command1,i,scopeInfo),scopeInfo,command[0]));
                    }else if (command[0]=='$' || command[0]=='@'){
                        let command1=command.substring(1).trim();
                        if (Helpers.simpleCommandNameRegex.test(command1)){
                            if (command[0]=='$')
                                retVal.push(new KaytanGlobalPropertyDefiniton(this,command1));
                            else   
                                retVal.push(new KaytanParameterUsage(this,command1));
                        }else
                            throw new KaytanSyntaxError('Invalid global variable name:'+command,i,this.template);
                    }else if (command=='.'){ //DİKKAT: ilk karakter değil tümü=.
                        retVal.push(new KaytanPropertyValue(this,new KaytanThisProperty(this,scopeInfo),scopeInfo));
                    }else if (command[0]=='!'){ 
                        //ignore comments
                    }else if (command[0]=='<'){
                        let a={};
                        command=command.substring(1).trim();
                        let r=parseTemplate.call(this,scopeInfo,i+1,command);
                        if (command){
                            if (Helpers.simpleCommandNameRegex.test(command)){
                                if (r.data.else)
                                    throw new KaytanSyntaxError('Invalid else statement in partial block',i,this.template);
                                retVal.push(new KaytanPartialDefinition(this,command,r.data.length==1?r.data[0]:new KaytanTokenList(this,r.data)));
                                i=r.i;
                            }else
                                throw new KaytanSyntaxError('Invalid partial name:'+command,i,this.template);
                        }else
                        throw new KaytanSyntaxError('Empty variable',i,this.template);
                    }else if (command[0]=='>'){
                        let command1=command.substring(1).trim();
                        if (Helpers.simpleCommandNameRegex.test(command1)){
                            retVal.push(new KaytanPartial(this,command1));
                        }else
                            throw new KaytanSyntaxError('Invalid partial name:'+command,i,this.template);
                    }else{
                        retVal.push(new KaytanPropertyValue(this,parseProperty.call(this,command,i,scopeInfo),scopeInfo));
                    }
                    j=retVal.length;
                    buffer=null;
                }else
                    throw new KaytanSyntaxError('Empty directive',i,this.template);
            }else
                buffer+=this.template[i];
        }
    }
    if (retVal.length>0 && typeof(retVal[retVal.length-1])=="string")
        retVal[retVal.length-1]=new KaytanStringToken(this,retVal[retVal.length-1]);
    if (buffer)
        throw new KaytanBugError('Buffer is not emptied!',i,this.template);
    if (blockName && !blockEnded)
        throw new KaytanSyntaxError('Unclosed block',i,this.template);
    return { data:retVal, i:i };
};

module.exports=parseTemplate;
