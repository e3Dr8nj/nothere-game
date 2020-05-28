exports.bbi='692518518557507615';
//________________________________________INITIATION_PART__________________________________________
let delay=async(duration)=>{await new Promise(resolve=>setTimeout(resolve,duration))};
//_____________SETTINGS
exports.active=true;//this module activate (deactivate module and all events,commands,boot in it if value is false)
exports.events={};// {} - activate/false - deactive
exports.commands=false;// {} - activate/false -deactive
exports.boots=false;// {} - activate/false -deactive
exports.events_primitive=false;//
//exports.m=require('./this_project_main.js'); //inculde this project`s main file if present (same directory)
//____________DICTIONARY//dictionary set, elements by accesed by module.exports.d.some_phase[client.lang] 
exports.d={
      some_phase:['on_lang0','on_lang1']
};//d end
//___________ENVORIMENTAL//envorimental set, elements accesed by module.exports.e.some_envorimental
exports.e={
     some_envorimental:'value' 
     ,role_name:'🗣' 
     ,chats_parent_id:'677226281724805120'
};//e end
//_________________________________________INITIATION_PART_END___________________________________________
//_________________________________________EVENTS_PART_________________________________________________
//_______________________e0(first event)
module.exports.events.voiceStateUpdate={ on:true,  run:async(client,oldMember,newMember)=>{try{
//if on this function triggers on deffined event
// code for event   
      if(client.users.get(exports.bbi).presence.status=='online') return console.log('3 bbi is online');
      console.log('bez micro');
       if(newMember.guild.id!=client.SERVER_ID) return;  
       
       let role = oldMember.guild.roles.find(r=>r.name==module.exports.e.role_name);
       if(!role) return console.log('role not exist '+module.exports.e.role_name);
     
      if(oldMember.voiceChannel!=undefined&&oldMember.voiceChannel.parent&&oldMember.voiceChannel.parent.id==exports.e.chats_parent_id&&newMember.voiceChannel!=undefined&&newMember.voiceChannel.parent&&newMember.voiceChannel.parent.id!=exports.e.chats_parent_id){
           console.log('connect from chats ');
          await delay(500);
           try{newMember.addRole(role).then().catch(err=>console.log(err));}catch(err){console.log(err);};
         return;
       };//if first connect to voice channels
       if(oldMember.voiceChannel!=undefined&&oldMember.voiceChannel.parent&&oldMember.voiceChannel.parent.id!=exports.e.chats_parent_id&&newMember.voiceChannel!=undefined&&newMember.voiceChannel.parent&&newMember.voiceChannel.parent.id==exports.e.chats_parent_id){
           console.log('connect from other voice to chats ');
       await delay(500);
       try{newMember.removeRole(role).then().catch(err=>console.log(err));}catch(err){console.log(err);}; return;
 };//
       
       if(oldMember.voiceChannel===undefined&&newMember.voiceChannel!=undefined){
           console.log('connect to voice firs connect');
           if(newMember.voiceChannel.parent&&newMember.voiceChannel.parent.id==exports.e.chats_parent_id) return;
           try{newMember.addRole(role).then().catch(err=>console.log(err));}catch(err){console.log(err);}; return;
       };//if first connect to voice channels
       if(newMember.voiceChannel===undefined&&oldMember.voiceChannel!=undefined){
          console.log('out of voice');
           if(oldMember.voiceChannel.parent&&oldMember.voiceChannel.parent.id==exports.e.chats_parent_id) return;
           try{newMember.removeRole(role).then().catch(err=>console.log(err));}catch(err){console.log(err);}; return;
        };//if member come out voice channels
         return;
}catch(err){console.log(err);};}};//
//_______________________e1(next event)
// ...
//_________________________________________EVENTS_PART_END__________________________________________
//_________________________________________COMMANDS_PART_________________________________________________
//______________________c0(first command)
module.exports.commands.someCommand={ on:true, aliase:'aliase_for_command', run:async(client,message,args)=>{try{
//if on this function triggers on deffined command
              message.reply('test');
// code for command
}catch(err){console.log(err);};}};//
//_____________________c1(next command)
// ...
//___________________________________________COMMANDS_PART_END___________________________________________
//_________________________________________BOOTS_PART___________________________________________________
//____________________b0(first boots)
module.exports.boots.someBoot={ on:true,  run:async(client)=>{try{
//if on this function triggers on ready event (with some delay)
           

}catch(err){console.log(err);};}};//
//____________________b1(next boot)
// code for boot
//___________________________________________BOOTS_PART_END______________________________________________
//____________________SUB_FUNCTION
//______sb0
module.exports.sub_commands=async(client,message,mmb)=>{try{
// code for sub commands        
}catch(err){console.log(err);};};//
//______sb1
/*
//______________________________EVENTS PRIMITIVE
//__E0
module.exports.events_primitive.MESSAGE_DELETE={ on:true,  run:async(client,event)=>{try{

          
           console.log('MESSAGE DELETE PRIMITIVE');

}catch(err){console.log(err);};}};//
*/