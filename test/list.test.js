var Kaytan=require(__ENTRYPOINT__);
var fs = require("fs");
var path = require("path");
var testlist = JSON.parse(fs.readFileSync(path.resolve("test/testlist.json")));

var options;
if (__OPTIMIZED__=="YES"){
    options={ optimized:true };
}


for (let block in testlist){
    let blockItem=testlist[block];
    let lasttemplate,lastobj,lastexpectedResult;
    describe(block,()=>{
        for (let title in blockItem){
            let template,obj,expectedResult;
            let item=blockItem[title];
            
            template=item[0]===-1?lasttemplate:item[0];
            obj=item[1]===-1?lastobj:item[1];
            expectedResult=item[2]===-1?lastexpectedResult:item[2];
            
            //this approach prevents value changes in parallel processing
            lasttemplate=template;
            lastobj=obj;
            lastexpectedResult=expectedResult;

            test(title, () => {
                expect((new Kaytan(template,options)).execute(obj)).toBe(expectedResult);
            });
        }
    });
}