Kaytan=require('.');

dd=new Kaytan("{{<tmp}} deneme {{.}} {{/}}merhaba {{?!a|b|c}}logic var{{:}}logic var ama değişken yok{{/}} {{@dee}} {{$ggg}}{{?$ggg}}global ggg{{/}}{{^$ooo}}global ooo{{/}}{{#deneme}} {{^#first}} AND {{/}}{{>tmp}}ddd {{:}} {{aaa}}eee{{&bbb}} {{/}}");
console.log(dd);
//dd.execute({ deneme: 'fethi' });

console.log(dd.ast.toString());
console.log(dd.execute({ deneme:[1,2,3] }));
console.log('end');