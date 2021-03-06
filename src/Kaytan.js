const KaytanParser=require('./KaytanParser');
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
        
        let parser=new KaytanParser(this);
        let ast=parser.parseTemplate(this.defaultStartDelimiter,this.defaultEndDelimiter);

        if (options && options.optimized){
            this.varcounter=0;
            let fn=`let $fn=function($oo){
   ${options.optimizeddebugger?"debugger;":""}
   let $output=this.output;
   let $global={ ${Helper.partialsHolderName}:{}, $parameterUsage:{} };
   let $o=$oo;
   let $scope=$o[$o.length-1];
   let $pia=0,$i,$l,$k;
${Helper.formatJavascript(ast.toJavascriptCode(),1)}
};$fn;`;
            delete this.varcounter;
            let $findPropertyValue=Helper.findPropertyValue; //used inside fn, keep reference
            let $systemIdentifierFn=Helper.systemIdentifierFn; //used inside fn, keep reference
            let $escape=Helper.escape; //used inside fn, keep reference
            let $check=Helper.checkValue; //used inside fn, keep reference
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
            scopeInfo: { value:parser.scopeInfo,writable:false,enumerable:true }
        });
    }
}

Kaytan.KaytanTextWriter=KaytanTextWriter;
Kaytan.KaytanDefaultTextWriter=KaytanDefaultTextWriter;
Kaytan.KaytanWritableStreamTextWriter=KaytanWritableStreamTextWriter;
Kaytan.KaytanNodeStreamTextWriter=KaytanNodeStreamTextWriter;

module.exports=Kaytan; 