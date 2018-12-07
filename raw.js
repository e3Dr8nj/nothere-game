
exports.delay=(duration)=>{ return new Promise((resolve)=>{return setTimeout(resolve,duration)}); };
exports.commands={};

exports.run =async(client,event)=>{
try{
 // console.log('\x1b[36mHELLO\x1b[0m');
 //  if(event.t){client.console([[event.t,'blue']]);};
   
  if(event.t=='READY'){ await module.exports.delay(1000);await module.exports.onGuildCreate(client);return;};
//----
  if(event.t =='MESSAGE_CREATE'){
           console.log('message_create'); 
           console.log(event.d.content);
           return module.exports.onMessage(client,event.d);
   };
//----

  return;
}catch(err){console.log(err);};
};//exports.run end
//____________________________________ON_GUILD_CREATE__________EVENT
 module.exports.onGuildCreate=async(client)=>{try{
    await exports.delay(1000);
    console.log('onGuildCreate');
    module.exports.setBoot(client,'command');
    module.exports.setBoot(client,'module');
    module.exports.setBoot(client,'event');
    module.exports.setBoot(client,'boot');
    module.exports.setBootByFolder(client);
    await exports.delay(1000);
    module.exports.setCommand(client,'command');
    module.exports.setCommand(client,'module');
    module.exports.setCommand(client,'event');
    module.exports.setCommand(client,'boot');
    module.exports.setEvent(client,'command');
    module.exports.setEvent(client,'module');
    module.exports.setEvent(client,'event');
    module.exports.setEvent(client,'boot');
    module.exports.setEventByFolder(client);
    module.exports.setCommandByFolder(client);
    
}catch(err){console.log(err)};};//
//____________________________________________________________

//______________________________________________ON_MESSAGE___EVENT

exports.onMessage=async(client,event_d)=>{try{

   if(event_d.author.id==client.user.id){return;};
   let message = await client.channels.get(event_d.channel_id).fetchMessage(event_d.id).then(collected=>{return collected;});
     //  message.channel.send(message.content);//-----
    
      let args = message.content.slice(client.prefix.length).trim().split(/ +/g);
      let cmd_name = args[0];

  if(module.exports.commands[cmd_name]){
      console.log(cmd_name+" command triggered ");
      if(message.author==client.user) return;
      module.exports.commands[cmd_name].exe(client,message,args);
     // client.console([['COMMAND EXE','red'],[cmd_name]]);
      return;
  };

//-----------------
}catch(err){console.log(err);};};//onMessage end
//_________________________________________________________________________


//_____________________________BOOT___
//_________________SET_BOOT
module.exports.setBoot=async(client,path)=>{try{
   await exports.delay(1000);
   
   let fs = require('fs');
//----------------------
  fs.readdir("./"+path+"s/", (err, files) => {try{
  //    if (err) return console.error(err);
    files.forEach(file => {
            let target_module = require(`./${path}s/${file}`);
            let moduleName = file.split(".")[0];
            
             
//------------------------------
        if(!!target_module.active){ 
         // if(target_module.boots&&target_module.settings.module.on&&target_module.settings.boot.on){console.log('booting______');
             if(!!target_module.boots){
                for(let key in target_module.boots){ 
                    if(target_module.boots[key].on){
                       //  console.log(key+" boot from "+moduleName+" "+path+" folder");
                        client.console([['BOOT EXE','red'],[' .../'+path+'s/'+moduleName+'/'+key]]);
                         target_module.boots[key].run(client);
                     };//if boot is on end
                };//for end
            };//if boots is active
           };//if target_module is active
//---------------------------------

/*
        if(target_module.boot&&target_module.settings.module.on&&target_module.settings.boot.on){
                //if(!!target_module.settings.command.aliase){moduleName=target_module.settings.command.aliase.slice();};
                    target_module.boot(client);
                 };
*/
  });//for end 
    
}catch(err){  console.log(err);};
});//boot end
//--------------------
  return;
}catch(err){console.log(err)};};//setModuleBoot end
//________________________________________________
//________________________________COMMAND_________
//_________________SET_COMMANDS
module.exports.setCommand=async(client,path)=>{try{
   await exports.delay(1000);
   //console.log('setCommand');
   let fs = require('fs');
//----------------------
  fs.readdir("./"+path+"s/", (err, files) => {try{
   //if (err) return console.error(err);
    files.forEach(file => {
            let target_module = require(`./${path}s/${file}`);
            let moduleName = file.split(".")[0];
        if(!!target_module.active){    
            //if(target_module.commands&&target_module.settings.module.on&&target_module.settings.command.on){
                if(!!target_module.commands){
                for(let key in target_module.commands){
                    let commandName = key; 

                    if(!!target_module.commands[key].aliase){commandName=target_module.commands[key].aliase.slice();};
                    module.exports.commands[commandName]={};
                     module.exports.commands[commandName].exe=target_module.commands[key].run ;   
                    // console.log(commandName+' command set from '+moduleName+" "+path+" folder");
                       client.console([['COMMAND SET','green'],[' .../'+path+'s/'+moduleName+'/'+commandName]]);
               };//for end

             };//if end
          };//module is active

       });//forEach end

}catch(err){console.log(err);};
});//event trigger
//--------------------
}catch(err){console.log(err)};};//setCommand end
//_____________________________________EVENT
//_____________________SET_EVENTS
module.exports.setEvent=async(client,path)=>{try{
   await exports.delay(1000);
  // console.log('setEvent');
   let fs = require('fs');
//----------------------
   fs.readdir("./"+path+"s/", (err, files) => {
try{

 if (err) return console.error(err);
  files.forEach(file => {try{
            let target_module = require(`./${path}s/${file}`);
            let moduleName = file.split(".")[0];
          if(!!target_module.active){ 
            //if(target_module.events&&target_module.settings.module.on&&target_module.settings.event.on){
              if(!!target_module.events){
                  for(let key in target_module.events){  
                      if(target_module.events[key].on){
                            client.on(key, (...args) => target_module.events[key].run(client, ...args));
                           // console.log(key+' event set from '+moduleName+" "+path+" folder");
                             client.console([['EVENT SET','green'],[' .../'+path+'s/'+moduleName+'/'+key]]);
                           };//if on end
                  };//for key
            };//if events is active
          };//if module is active
     }catch(err){console.log(err);};
    });//if end

}catch(err){console.log(err);};
});//event trigger
//--------------------
}catch(err){console.log(err)};};//setModuleEvents end
//_______________________ALL_BY_MAIN_PROFILE
//__________________EVENT_FILE
module.exports.setEventByFolder=async(client)=>{try{
      let fs = require('fs');
      fs.readdir('./events', (err,files) =>{
          files.forEach(file=>{try{
              let target_module=require(`./events/${file}`);
              let moduleName=file.split(".")[0];
              if(target_module.run&&target_module.on&&!!target_module.active){
                    client.on(moduleName, (...args) => target_module.run(client, ...args));
                   // console.log(moduleName+' event set from '+moduleName+" event folder");
                    client.console([['EVENT SET ','green'],[' .../events/'+moduleName+'/run']]);
               };//if target_module end
           }catch(err){console.log(err);}});//forEach end
       });//fs readdir
}catch(err){console.log(err);};};//module.exports.setEventByFolder end
//__________________COMMAND_FILE
module.exports.setCommandByFolder=async(client)=>{try{
      let fs = require('fs');
      fs.readdir('./commands', (err,files) =>{
          files.forEach(file=>{try{
              let target_module=require(`./commands/${file}`);
              let moduleName=file.split(".")[0];
              let commandName = moduleName.slice();
              if(target_module.run&&target_module.on&&!!target_module.active){ 
                   //let condition=!!target_module.settings&&!!target_module.settings.run&&!!target_module.settings.run.aliase;
                  if(!!target_module.aliase){commandName=target_module.aliase.slice();};
                     module.exports.commands[commandName]={};
                     module.exports.commands[commandName].exe=target_module.run ;   
                    //console.log(commandName+' command set from '+moduleName+" command folder");
                    client.console([['COMMAND SET ','green'],[' .../commands/'+moduleName+'/run']]);
               };//if target_module end
           }catch(err){console.log(err);}});//forEach end
       });//fs readdir
}catch(err){console.log(err);};};//module.exports.setEventByFolder end
//__________________BOOT_FILE

module.exports.setBootByFolder=async(client)=>{try{
      let fs = require('fs');
      fs.readdir('./boots', (err,files) =>{
           files.forEach(file=>{try{
              let target_module=require(`./boots/${file}`);
              let moduleName=file.split(".")[0];
              if(target_module.run&&target_module.on&&!!target_module.active){
                    target_module.run(client);
                    //console.log(moduleName+' boot set from '+moduleName+" boots folder");
                    client.console([['BOOT EXE ','red'],[' .../boots/'+moduleName+'/run']]);
               };//if target_module end
           }catch(err){console.log(err);}});//forEach end
       });//fs readdir
}catch(err){console.log(err);};};//module.exports.setBootByFolder end
