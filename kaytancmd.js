Kaytan=require('.');

dd=new Kaytan("{{<tmp}} deneme {{/}}merhaba {{@dee}} {{$ggg}}{{#deneme}} {{>tmp}}ddd {{:}} {{aaa}}eee{{&bbb}} {{/}}");
console.log(dd);
//dd.execute({ deneme: 'fethi' });

console.log(dd.ast.toString());
console.log('end');