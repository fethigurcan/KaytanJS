var Kaytan;
if (__ENTRYPOINT__) //otherwise it is web test
    Kaytan=require(__ENTRYPOINT__);
var fs = require("fs");
var path = require("path");
var testlist = require("../test-data")();

var options;
if (__OPTIMIZED__=="YES"){
    options={ optimized:true };
}

if (!Kaytan){ //web test
    beforeAll(async () => {
        await page.goto(PATH, { waitUntil: 'load' })
    });
}


for (let block in testlist){
    let blockItem=testlist[block];
    describe(block,()=>{
        for (let title in blockItem){
            let item=JSON.parse(fs.readFileSync(blockItem[title]));
            if (Kaytan){ //Node test
                test(title, () => {
                    expect((new Kaytan(item.template,options)).execute(item.data)).toBe(item.expected);
                });
            }else{ //web test
                test(title, async () => {
                    const result = await page.evaluate((template,data,options) => (new Kaytan(template,options)).execute(data) ,item.template,item.data,options);
                    expect(result).toEqual(item.expected);
                });    
            }
        }
    });
}