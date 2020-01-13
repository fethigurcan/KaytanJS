Kaytan=require('.');

dd=new Kaytan("{{< deneme }}den{{aaa}}eme{{/}}{{#ebele}}{{> deneme}}{{/}}"
        ,{ optimized:true,defaultStartDelimiter:'{{',defaultEndDelimiter:'}}' });
console.log(dd);

console.log(dd.ast.toString());
console.log(dd.execute({ "TableName":"Empl\"oyees {aka} Friends",ebele:{} }));
console.log('end');
