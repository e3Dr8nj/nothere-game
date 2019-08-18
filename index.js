const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);


/*
const process={
  env:{
   TOKEN_BOT:'***'//TOKEN BOT HERE
  }
};
*/

const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

//___________
client.lang=1;
client.commands={};
client.events_primitive={};
client.test_mode=false;
//______________
client.prefix='!';
client.SERVER_ID='301063859702071316';
//client.SERVER_ID='';//SERVER ID HERE

client.on('ready',() => {try{
        console.log('Ready');
        return;
}catch(err){console.log(err);}; });

/*
client.on("raw", (...args) => {try{
   console.log('raw');
   let raw = require(`./raw.js`);
   raw.run(client,...args);
}catch(err){console.log(err);}; });
*/
//___________
let RH=require(`./raw.js`);

RH.folder_name='./modules';
RH.fetch_messages=false;
RH.server_id=client.SERVER_ID;
/*
//_________

let some_module = require(`./eval.js`);
//some_module.marge(); --finde RH file and integrate with him
//client.RH_module_to_marge='';
RH.external_module.push(some_module);
let em=require(`./bad_words_delete.js`);
RH.external_module.push(em);
let fetch_messages=require(`./boot_fetchMessages.js`);
RH.external_module.push(fetch_messages);
let role_voice_text=require(`./roleVoiceText.js`);
RH.external_module.push(role_voice_text);
*/
//let RH_build=require(`./rh_builder.js`);
//RH_build.run(client);
//_________
 
client.on("raw", (...args) => {try{
     RH.run(client,...args);
}catch(err){console.log(err);}; });
//__________


client.login(process.env.TOKEN).catch(console.error);

/*
RH.include(require("some_module"));

*/