//___
let bd=require(`../usersPointsBD.js`);
bd.e.table_title='top';
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
module.exports.commands.quizHelp={aliase:'quizHelp', run:async(client,message,args)=>{try{
    let str="";
    str+="["+client.prefix+"quizStart <тип_викторины>] -начать викторину, автор команды устанавливается ведущим\n";
    str+="["+client.prefix+"quizShowTop <тип викторины> <период в днях>] -показать рейтинг викторины за указанный период \n";
    str+=" '*'- все типы викторины, '*'-все время \n";
    str+="доступные типы викторины: logic, films, games, free, education \n";
    str+="["+client.prefix+"+ @username] -дать балл упомянутому участнику \n";
    str+="["+client.prefix+"- @username] -снять балл с упомянутого участника \n";
    str+="если ведущий отмечает сообщение реакцией:'✔' автору сообщения начисляется балл в текущей викторине\n";
    str+="если ведущий отмечает сообщение с текущим рейтингом реакцией:'✖' сообщение с рейтингом удаляется\n";
    str+="["+client.prefix+"quizEnd] -закончить викторину(команда от ведущего или три реакций('✔') от участников под сообщением с командой)\n";
    
    message.channel.send(str,{code:'ini'});
    return;
}catch(err){console.log(err);};}};//
module.exports.commands.quizStart={aliase:'quizStart', run:async(client,message,args)=>{try{
   //code to execut then this command triggered
   //if(message.channel.name!=module.exports.e.channel_name){message.reply('only on quiz channel avilable');return;};
   if(client.quiz_leader_id) {message.reply('викторина уже в процессе'); return;};
   if(!args[1]) {
       message.reply('тип викторину устанавлен `free` по умолчанию ');
       client.quiz_type='free';
    };//
   if(args[1]&&bd.quiz_types.indexOf(args[1]!=-1)){
       message.reply('quiz type set to '+args[1]);
       client.quiz_type=args[1];
    };
    if(args[1]&&!bd.quiz_types.indexOf(args[1]==-1)){
       message.reply('error: не верно указан тип викторины'); return
    };
   client.quiz_score={};
   client.quiz_leader_id=message.author.id;
   client.quiz_channel_id=message.channel.id;
   message.channel.send('викторина началась');
}catch(err){console.log(err);};}};//
//c1
module.exports.commands.quizEnd={aliase:'quizEnd', run:async(client,message,args)=>{try{
   //code to execut then this command triggered

 //   if(message.channel.name!=module.exports.e.channel_name){message.reply('only on quiz channel avilable');return;};
      if(!client.quiz_leader_id){message.reply('quiz not started'); return;};
      if(client.quiz_leader_id&&client.quiz_leader_id!=message.author.id) {
        message.reply('чтобы активировать команду нужно три реакции ✔ от участником под сообщением с командой в течении 1 минуты');   
        let filter = (a,b)=>a.emoji.name==module.exports.e.valid_answer_emoji_name;
        let resolve = await message.awaitReactions(filter,{max:3,time:1000*60,errors:['time']})
              .then(r=>{console.log('get');return true;})
              .catch(err=>console.log(err));
        if(!resolve) return;
      };//
    

    let str= await bd.getTopTableEmb(client,message.guild.id,client.quiz_type,'*');
    message.channel.send({embed:str});
    client.quiz_type='';
    client.quiz_score={};
    client.quiz_leader_id=false;
    client.quiz_channel_id=false;
    message.channel.send('викторина окончена');
}catch(err){console.log(err);};}};//
//c2
module.exports.commands.quizShowTop={aliase:'quizShowTop', run:async(client,message,args)=>{try{
   //code to execut then this command triggered
   // if(message.channel.name!=module.exports.e.channel_name){return;};
    if(!args[1]) args[1]='*';
    if(!args[2]) args[2]='*';
    let emb = await bd.getTopTableEmb(client,message.guild.id,args[1],args[2]);
    if(!emb){message.channel.send('error'); return;};
    message.channel.send({embed:emb});
    return;
}catch(err){console.log(err);};}};//
//c3
module.exports.commands.quizPointAdd={aliase:'+', run:async(client,message,args)=>{try{
    // if(message.channel.name!=module.exports.e.channel_name){message.reply('only on quiz channel avilable');return;};
    if(!client.quiz_leader_id){ return;};
    if(client.quiz_leader_id&&client.quiz_leader_id!=message.author.id) return;
    if(!message.mentions.members.first()) return;
    return module.exports.score(client,message,message.mentions.members.first(),'add');
}catch(err){console.log(err);};}};//
//c4
module.exports.commands.quizPointRemove={aliase:'-', run:async(client,message,args)=>{try{
    // if(message.channel.name!=module.exports.e.channel_name){message.reply('only on quiz channel avilable');return;};
    if(!client.quiz_leader_id){ return;};
    if(client.quiz_leader_id&&client.quiz_leader_id!=message.author.id) return;
    if(!message.mentions.members.first()) return;
    return module.exports.score(client,message,message.mentions.members.first(),'remove');
}catch(err){console.log(err);};}};//



//_________________________________________EVENTS_PART_________________________________________________
module.exports.events={};
//____e0
module.exports.events.messageReactionAdd={ run:async(client,messageReaction,user)=>{try{
    //if(messageReaction.message.channel.name!=module.exports.e.channel_name) return console.log('wrong channel');
    if(user.id==client.user.id) return;
    if(!client.quiz_leader_id) return;
    if(client.quiz_leader_id&&client.quiz_leader_id!=user.id) return;
    //__se0
    if(messageReaction.emoji.name==module.exports.e.valid_answer_emoji_name) {
         return module.exports.score(client,messageReaction.message,messageReaction.message.member,'add');
     };
    //__se1
    if((messageReaction.emoji.name==module.exports.e.delete_emoji_name)&&(messageReaction.message.author.id==client.user.id)) {
          await messageReaction.message.delete();
    };
    //
    return;
}catch(err){console.log(err);};}};//
//____e1
module.exports.events.messageReactionRemove={ run:async(client,messageReaction,user)=>{try{
    // if(messageReaction.message.channel.name!=module.exports.e.channel_name) return;
     if(user.id==client.user.id) return;
     if(!client.quiz_leader_id){ return;};
     if(messageReaction.emoji.name!=module.exports.e.valid_answer_emoji_name) return;
     if(client.quiz_leader_id&&client.quiz_leader_id!=user.id) return ;
     module.exports.score(client,messageReaction.message,messageReaction.message.member,'remove');
}catch(err){console.log(err);};}};//

// ...

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
