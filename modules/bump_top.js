//module.active=false;
//___
let bd=require(`../s_bumpTopBd.js`);
bd.e.table_title='Топ бамперов';
//__
//________________________________________TOOLS__________________________________________
let delay=async(duration)=>{await new Promise(resolve=>setTimeout(resolve,duration))}; //* for delay inside async function, use it instead setTimeout
let random =(max)=>{ return Math.floor(Math.random()*max);};

//_________________________ENVORIMENTAL
module.exports.e={
     channel_name:'quiz'
     ,valid_answer_emoji_name:'✔'
     ,delete_emoji_name:'✖'
     ,local_top_name:'текущий рейтинг'
};

//_________________________________________COMMANDS_PART_________________________________________________
module.exports.commands = {};
module.exports.commands.bumpTopHelp={aliase:'бампхелп', run:async(client,message,args)=>{try{
    let str="";
  
    str+="["+client.prefix+"бамптоп <тип бампа> <период в днях>] -показать рейтинг бампа за указанный период \n";
    str+=" '*'- все типы бампа, '*'-все время \n";
    str+="типы бампа: !bump,s.up \n";
    message.channel.send(str,{code:'ini'});
    return;
}catch(err){console.log(err);};}};//


module.exports.commands.bumpShowTop={aliase:'бамптоп', run:async(client,message,args)=>{try{
   //code to execut then this command triggered
   // if(message.channel.name!=module.exports.e.channel_name){return;};
    if(!args[1]) args[1]='*';
    if(!args[2]) args[2]='*';
    console.log(args);
    let emb = await bd.getTopTableEmb(client,message.guild.id,args[1],args[2]);
    if(!emb){message.channel.send('error'); return;};
    message.channel.send({embed:emb});
    return;
}catch(err){console.log(err);};}};//


//c
module.exports.commands.bumpEmit={ on:true, aliase:'bumped', run:async(client,message,args)=>{try{
//if on this function triggers on deffined command
             //let emb={description:':white_check_mark: Server bumped!'};
             // message.channel.send({embed:emb});

}catch(err){console.log(err);};}};//
//c
module.exports.commands.supEmit={ on:true, aliase:'suped', run:async(client,message,args)=>{try{
//if on this function triggers on deffined command
             let emb={author:{name:'Сервер Up'} };
              message.channel.send({embed:emb});

}catch(err){console.log(err);};}};//
//
module.exports.commands.bumpPoints={aliase:'bumpPoints', run:async(client,message,args)=>{try{
     if(!message.mentions.members.first()) return;
     if(!args[1]||!args[2]||!args[3]) return;
     let action=args[1];
     let mmb= message.mentions.members.first();
     
     await bd.insert(client,Number(action),mmb.user.id,message.guild.id,args[2]).then(message.channel.send('ok')).catch(err=>console.log(err));
     return;
}catch(err){console.log(err);};}};//

//_________________________________________EVENTS_PART_________________________________________________
module.exports.events={};
//____e0
module.exports.events.message={ run:async(client,message)=>{try{
                if (message.type=='dm') return;
               // if(message.author.bot&&message.indexOf('го бампить!')!=-1){};
                if(message.content=='!bump'){
                      console.log('await bump resolve');
                      let filter =(m)=>(m.author.bot&&m.embeds[0]&&m.embeds[0].description.startsWith('[Top Discord Servers]') );
                      let resolve = await message.channel.awaitMessages(filter,{max:1,time:20*1000,errors:['time']}).then(collected=>{return collected.first();}).catch(err=>{return false;});
                      if(resolve) await bd.insert(client,1,message.member.user.id,message.guild.id,'!bump');//--
                      if(!resolve) message.channel.send('err:01');
                      if(resolve){message.channel.send('point add');};
                 };
                 if(message.content.toLowerCase()=='s.up'){
                      console.log('await s.up resolve');
                      let filter =(m)=>(m.author.bot&& m.embeds[0]&&m.embeds[0].author&&m.embeds[0].author.name&&( m.embeds[0].author.name.startsWith('Сервер Up'))  );
                      let resolve = await message.channel.awaitMessages(filter,{max:1,time:20*1000,errors:['time']}).then(collected=>{return collected.first();}).catch(err=>{return false;});
                      if(resolve)  await bd.insert(client,1,message.member.user.id,message.guild.id,'s.up');//--
                      if(!resolve) message.channel.send('err:02');
                      if(resolve){message.channel.send('point add');};
                 };


}catch(err){console.log(err);};}};//


//_____________________________________SUB_COMMANDS

//c1
module.exports.getTable=async(client,message,mmb,light)=>{try{
     let str=''; 
     let arr=[];
      for(let key in client.quiz_score){arr.push(key);};
     arr.sort(function(a,b){return client.quiz_score[b]-client.quiz_score[a];});
       for(let i=0;i<arr.length;i++){
            let un=message.guild.members.get(arr[i]);
            un=(un)?un:arr[i],
            str+=(light&&arr[i]==mmb.user.id)?'':client.quiz_score[arr[i]]+'    '+un+'\n';
       };//for i
       if(str=='') str='_';
       str=(str.length<1900)?str:str.slice(0,1900);
       let embed={fields:[{name:module.exports.e.local_top_name+" "+client.quiz_type,value:str}]};//
        console.log(embed);
       return embed;
}catch(err){console.log(err);};};//
//c2
module.exports.score=async(client,message,mmb,action)=>{try{
      
       if(!client.quiz_score) client.quiz_score={};
       let lastTable=await module.exports.getTable(client,message);
       let msg_table=await  message.channel.send({embed:lastTable});
       await  delay(1000);
       let lastTable_light=await module.exports.getTable(client,message,mmb,true);
       await msg_table.edit({embed:lastTable_light});
       await delay(1000);
       let sighn=(action=='remove')?-1:1;
       message.channel.send(mmb.user.username+' + '+sighn);
       client.quiz_score[mmb.user.id]=(client.quiz_score[mmb.user.id])?client.quiz_score[mmb.user.id]+=sighn:sighn;
       console.log(client.quiz_score);
       
       let newTable=await module.exports.getTable(client,message,mmb);
       await msg_table.edit({embed:newTable});
       await msg_table.react(module.exports.e.delete_emoji_name);
//___
     await bd.insert(client,sighn,mmb.user.id,message.guild.id,client.quiz_type);
//___

}catch(err){console.log(err);};};//
