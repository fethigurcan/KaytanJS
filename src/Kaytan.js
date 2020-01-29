const parseTemplate=require('./KaytanParserFn2');
const KaytanTokenList=require('./KaytanTokenList');
const KaytanTextWriter=require('./KaytanTextWriter');
const KaytanDefaultTextWriter=require('./KaytanDefaultTextWriter');
const KaytanWritableStreamTextWriter=require('./KaytanWritableStreamTextWriter');
const KaytanNodeStreamTextWriter=require('./KaytanNodeStreamTextWriter');
const Helper=require('./Helper');

function _executeCompiledCode(values,writer){
    if (writer && !(writer instanceof KaytanTextWriter))
        throw new TypeError('writer must be a KaytanTextWriter');

    this.output=writer||new KaytanDefaultTextWriter();
    this.fn([values!=null?values:{}]);
    this.output.close();

    if (!writer)
        return this.output.toString();
}

function _executeClassic(values,writer){
    if (writer && !(writer instanceof KaytanTextWriter))
        throw new TypeError('writer must be a KaytanTextWriter');

    this.output=writer||new KaytanDefaultTextWriter();
    this.ast.execute({},[values!=null?values:{}]); //empty object is the global variable holder for define command
    this.output.close();

    if (!writer)
        return this.output.toString();
}

class Kaytan{
    constructor(template,options){
        Object.defineProperties(this,{
            template:{ value:template||'', writable:false, enumerable:true },
            defaultStartDelimiter:{ value:(options && options.defaultStartDelimiter)||"{{", writable:false, enumerable:true },
            defaultEndDelimiter:{ value:(options && options.defaultEndDelimiter)||"}}", writable:false, enumerable:true }
        });
        
        let parserResult=parseTemplate.call(this,this.defaultStartDelimiter,this.defaultEndDelimiter);
        let ast=parserResult.data;
        let tokenList=new KaytanTokenList(this,ast);
        ast=tokenList.length==1?tokenList[0]:tokenList;

        if (options && options.optimized){
            this.varcounter=0;
            let fn=`let $fn=function($oo){
   ${options.optimizeddebugger?"debugger;":""}
   let $output=this.output;
   let $global={ ${Helper.partialsHolderName}:{}, $parameterUsage:{} };
   let $o=$oo;
   let $scope=$o[$o.length-1];
   let $check=v=>v!=null && v!==false && v!=="" && (!Array.isArray(v) || v.length>0);
   let $pia=0,$i,$l,$k;
${Helper.formatJavascript(ast.toJavascriptCode([{ defined:{} }]),1)}
};$fn;`;
            //delete this.varcounter;
            let $findPropertyValue=Helper.findPropertyValue; //used inside fn, keep reference
            let $systemIdentifierFn=Helper.systemIdentifierFn; //used inside fn, keep reference
            let $escape=Helper.escape; //used inside fn, keep reference
            fn=eval(fn);            
            Object.defineProperties(this,{
                fn:{ value:fn, writable:false },
                execute:{ value: _executeCompiledCode, writable:false }
            });
        }else{
            Object.defineProperties(this,{
                execute:{ value: _executeClassic, writable:false }
            });
        }

        Object.defineProperties(this,{
            ast:{ value:ast, writable:false, enumerable:true },
            scopeInfo: { value:parserResult.scopeInfo,writable:false,enumerable:true }
        });
    }
}

Kaytan.KaytanTextWriter=KaytanTextWriter;
Kaytan.KaytanDefaultTextWriter=KaytanDefaultTextWriter;
Kaytan.KaytanWritableStreamTextWriter=KaytanWritableStreamTextWriter;
Kaytan.KaytanNodeStreamTextWriter=KaytanNodeStreamTextWriter;

module.exports=Kaytan; 