exports.active=true;
//________________________________________TOOLS__________________________________________
let delay=async(duration)=>{await new Promise(resolve=>setTimeout(resolve,duration))}; 
     //* for delay inside async function, use it instead setTimeout
let random =(max)=>{ return Math.floor(Math.random()*max);};


//_________________PART MANAGER (OPCIONAL)
//exports.RH_IGNORE_TOTAL=true;//add this line to ignore this module 
//exports.RH_IGNORE_COMMANDS=true;//add this line to ignore all commands from this module
//module.exports.RH_BOOTS=true;//add this line to ignore all boots from this module
//module.exports.RH_IGNORE_EVENTS=true;//add this line to ignore all events from this module
//module.exports.RH_IGNORE_EVENTS_PRIMITIVE=true;//add this line to ignore all events_primitive from this module


//___________________________ETERNAL_VARIABLE_PART
module.exports.phrases={
  ban_invite:" забанен за инвайт"
};
module.exports.e={

 link: "https://discord.gg/"
 ,channels_exceptions:['487632718025326602','653004216926994452']
}

//_________________________________________BOOTS_PART___________________________________________________
module.exports.boots = {}; 

module.exports.boots.someBoot={run:async(client)=>{try{
    //code to execut bot on loading
}catch(err){console.log(err);};}};//
//module.exports.boots.someBoot.RH_IGNORE=true;//add this line to ignore this command
//...
//_________________________________________COMMANDS_PART_________________________________________________
module.exports.commands = {};

module.exports.commands.someCommand={aliase:'aliase_for_command', run:async(client,message,args)=>{try{
   //code to execut then this command triggered
}catch(err){console.log(err);};}};//
//module.exports.commands.someCommand.RH_IGNORE=true;//add this line to ignore this command
// ...


//_________________________________________EVENTS_PART_________________________________________________
module.exports.events={};

module.exports.events.message={ on:true,run:async(client,message)=>{try{
      if (message.author.bot) return;
      let channel_true=module.exports.e.channels_exceptions.includes(message.channel.id);
              if(channel_true) return;
   if(!message.member.bannable) return;
  
     if( (message.content.indexOf(module.exports.e.link)!=-1) ){
       let str = message.member+`${message.member.displayName}`+"#"+message.member.user.discriminator+" "+module.exports.phrases.ban_invite+" "+message.channel;
      str+="\n текст сообщения: "+message.content;
              
          try{
       

           await message.member.ban(1).then(() =>{
             // message.channel.send(str);
              //module.exports.log(client,message,{name:"Бан ",color:"red",description:str});
           }).catch(err=>console.error(err));
          await message.delete();
          }catch(err){console.log(err);};
     
       
     };
    //code to execut then event occurs
}catch(err){console.log(err);};}};//
//module.exports.events.someEvent.RH_IGNORE=true;//add this line to ignore this event trigger
// ...
//_________________________________________EVENTS_PART_END__________________________________________

//______________________________EVENTS PRIMITIVE
module.exports.events_primitive={};

module.exports.events_primitive.SOME_EVENT_NAME={run:async(client,event)=>{try{
      //some code here
}catch(err){console.log(err);};}};//
//module.exports.events_primitive.SOME_EVENT_NAME.RH_IGNORE = true;//add this line to ignore this primitive event trigger

//_____________SUB FUNCTION
//______________sf01
exports.sf01=async(client)=>{
try{ 
   
}catch(err){console.log(err);};
};//createRole end

exports.log=async(client,message,action)=>{
try{ 
   let colors={blue:0x3366ff,gray:0x668099,red:0xff0000,red2:0xcc0066,green:0x339980,violet:0x6600cc,dark_blue:0x000066};
   action.color=(action.color&&colors[action.color])?action.color:'gray';
   action.name=(action.name)?action.name:'Удаление сообщения';
   client.channel_log_name=(client.channel_log_name)?client.channel_log_name:'лог-мод';
   let log_mod=await message.guild.channels.find(r=>r.name==client.channel_log_name);
   if(!log_mod){console.log('log channel not found'); return;};
  // log_mod.send(message.member+action+"`"+role_name+"`  "+mmb);
  //let str = (all)?message.member+'\n':message.member;
  
action.description=(action.description.length<=950)?action.description:action.description.slice(0,950);
   let emb={fields:[{name:action.name,value:action.description}],timestamp: new Date(),color:colors[action.color]};
   log_mod.send({embed:emb});
}catch(err){console.log(err);};
};//log