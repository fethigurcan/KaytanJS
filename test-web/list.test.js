var fs = require("fs");
var path = require("path");
var testlist = require("../test-data")();

var options;
if (__OPTIMIZED__=="YES"){
    options={ optimized:true };
}

beforeAll(async () => {
    await page.goto(PATH, { waitUntil: 'load' })
});

for (let block in testlist){
    let blockItem=testlist[block];
    describe(block,()=>{
        for (let title in blockItem){
            let item=JSON.parse(fs.readFileSync(blockItem[title]));

            test(title, async () => {
                const result = await page.evaluate((template,data,options) => (new Kaytan(template,options)).execute(data) ,item.template,item.data,options);
                expect(result).toEqual(item.expected);
            });

            /*test(title, () => {
                expect((new Kaytan(template)).execute(obj)).toBe(expectedResult);
            });*/
        }
    });
}