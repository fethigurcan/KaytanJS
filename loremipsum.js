Kaytan=require('.');

dd=new Kaytan("{{[a}}true{{^$last}}, {{/}}{{/}}"
        ,{ optimized:true,defaultStartDelimiter:'{{',defaultEndDelimiter:'}}' });
console.log(dd);

console.log(dd.ast.toString());
console.log(dd.execute({ a:{ "TableName":"Empl\"oyees {aka} Friends",aaa:"ee",ebele:{} }}));
console.log('end');
