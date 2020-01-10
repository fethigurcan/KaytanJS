var fs = require("fs");
var path = require("path");
var testlist = JSON.parse(fs.readFileSync(path.resolve("test/testlist.json")));

beforeEach(async () => {
    await page.goto(PATH, { waitUntil: 'load' })
});

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

            test(title, async () => {
                const result = await page.evaluate((template,obj) => (new Kaytan(template)).execute(obj) ,template,obj);
                expect(result).toEqual(expectedResult);
            });

            /*test(title, () => {
                expect((new Kaytan(template)).execute(obj)).toBe(expectedResult);
            });*/
        }
    });
}