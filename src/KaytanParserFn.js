//errors
var KaytanSyntaxError=require('./KaytanSyntaxError');
var KaytanBugError=require('./KaytanBugError');

//basics
var KaytanStringToken=require('./KaytanStringToken');

//properties
var KaytanProperty=require('./KaytanProperty');
var KaytanGlobalProperty=require('./KaytanProperty');
var KaytanSystemProperty=require('./KaytanProperty');

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
function parseExpression(expression,templateIndex,i,level,stopAtLevel){
    let retVal=[];
    let buffer='';
    level=level||0;
    for (i=i||0;i<expression.length;i++){
    if (expression[i]=='|' || expression[i]=='&'){
        if (level==stopAtLevel){
        i--;
        break;
        }else{
        let r=parseExpression.call(this,expression,templateIndex,i+1,level,stopAtLevel);
        level=r.level;
        if (buffer){
            if (Helpers.commandNameRegex.test(buffer))
            retVal.push({ operator:expression[i],left:buffer,right:r.data });
            else
            throw new KaytanSyntaxError('Invalid expression:'+buffer,templateIndex+i,this.template);
            buffer='';
        }else if(retVal.length==1){
            retVal=[{ operator:expression[i],left:retVal[0],right:r.data }];
        }else
            throw new KaytanSyntaxError('Excepted lefthand operand',templateIndex+i,this.template);
        i=r.i;
        }
    }else if (expression[i]=='!'){
        if (buffer || retVal.length)
        throw new KaytanSyntaxError('Invalid lefthand operand',templateIndex+i,this.template);
        else{
        let r=parseExpression.call(this,expression,templateIndex,i+1,level,level);
        retVal.push({ operator:expression[i], expression:r.data });
        level=r.level;
        i=r.i;
        }
    }else if (expression[i]=='('){
        let r=parseExpression.call(this,expression,templateIndex,i+1,level+1,stopAtLevel);
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
        retVal.push(buffer);
    else
        throw new KaytanSyntaxError('Invalid expression:'+buffer,templateIndex+i,this.template);
    }
    if (level<0)
    throw new KaytanSyntaxError('Unexpected )',templateIndex+i,this.template);

    return { data:retVal.length>1?retVal:retVal[0], i:i,level:level };    
};

//treat as member function of Kaytan
function parseTemplate(i,isABlock){
    let retVal=[];
    let j=0;
    let buffer;
    let blockEnded=false;
    for (i=i||0;i<this.template.length;i++){
        if (!buffer){
            if (this.template[i] == '\\' || this.template[i] == '{'){
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
                if (command[0]=='/'){ //ignore end tag command but don't error beacuse of backward compatibility to mustache
                    if (isABlock){
                    blockEnded=true;
                    buffer=null;
                    break;
                    }
                    else
                    throw new KaytanSyntaxError('Unexpected /',i,this.template);
                }else if (Helpers.logicCommandPrefixToken.test(command[0])){
                    let a={};
                    let r=parseTemplate.call(this,i+1,true);
                    let command1=command.substring(1).trim();
                    if (command1){
                    let block={ };
                    block.if=command[0]=='^'?parseExpression.call(this,'!('+command1+')',i-command.length).data:parseExpression.call(this,command1,i-command.length).data;
                    block.then=r.data.length==1?r.data[0]:r.data;
                    if (r.data.else)
                        block.else=r.data.else;
                    retVal.push(block);
                    i=r.i;
                    }else
                    throw new KaytanSyntaxError('Empty expression',i,this.template);
                }else if (command[0]=='#'){
                    let a={};
                    let r=parseTemplate.call(this,i+1,true);
                    command=command.substring(1).trim();
                    if (command){
                    if (Helpers.commandNameRegex.test(command)){
                        let block={ for: command, loop:r.data.length==1?r.data[0]:r.data };
                        if (r.data.else)
                        block.else=r.data.else;
                        retVal.push(block);
                        i=r.i;
                    }else
                        throw new KaytanSyntaxError('Invalid variable:'+command,i,this.template);
                    }else
                    throw new KaytanSyntaxError('Empty variable',i,this.template);
                }else if (command[0]==':'){
                    if (command.length!=1)
                    throw new KaytanSyntaxError('Syntax error',i,this.template);
                    if (isABlock){
                    let a={};
                    let r=parseTemplate.call(this,i+1,true);
                    command=command.substring(1);
                    retVal.else=r.data.length==1?r.data[0]:r.data;
                    blockEnded=true;
                    buffer=null;
                    i=r.i;
                    break;
                    }else
                    throw new KaytanSyntaxError('Unexpected :',i,this.template);
                }else if (Helpers.commandPrefixToken.test(command[0])){
                    let command1=command.substring(1).trim();
                    if (Helpers.commandNameRegex.test(command1)){
                    retVal.push({ value: command1, escape:command[0] });
                    }else
                    throw new KaytanSyntaxError('Invalid variable name:'+command,i,this.template);
                }else if (command[0]=='$' || command[0]=='@'){
                    let command1=command.substring(1).trim();
                    if (Helpers.simplecommandNameRegex.test(command1)){
                    let c={};
                    c[command[0]]=command1;
                    retVal.push(c);
                    }else
                    throw new KaytanSyntaxError('Invalid global variable name:'+command,i,this.template);
                }else if (command=='.'){ //DİKKAT: ilk karakter değil tümü=.
                    retVal.push({ value: command });
                }else if (command[0]=='!'){ 
                    //ignore comments
                }else if (command[0]=='<'){
                    let a={};
                    let r=parseTemplate.call(this,i+1,true);
                    command=command.substring(1).trim();
                    if (command){
                    if (Helpers.simplecommandNameRegex.test(command)){
                        let block={ partialdefinition: command, data:r.data.length==1?r.data[0]:r.data };
                        if (r.data.else)
                        throw new KaytanSyntaxError('Invalid else statement in partial block',i,this.template);
                        retVal.push(block);
                        i=r.i;
                    }else
                        throw new KaytanSyntaxError('Invalid partial name:'+command,i,this.template);
                    }else
                    throw new KaytanSyntaxError('Empty variable',i,this.template);
                }else if (command[0]=='>'){
                    let command1=command.substring(1).trim();
                    if (Helpers.simplecommandNameRegex.test(command1)){
                    retVal.push({ partial: command1 });
                    }else
                    throw new KaytanSyntaxError('Invalid partial name:'+command,i,this.template);
                }else{
                    if (Helpers.commandNameRegex.test(command))
                    retVal.push({ value: command });
                    else
                    throw new KaytanSyntaxError('Invalid expression:'+command,i,this.template);
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
        throw new KaytanBugError('Buffer is not emptied!',i,this.template);
    if (isABlock && !blockEnded)
        throw new KaytanSyntaxError('Unclosed block',i,this.template);
    return { data:retVal, i:i };
};

module.exports=parseTemplate;
