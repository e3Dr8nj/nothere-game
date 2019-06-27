//v1.1.1
exports.RH_IGNORE_TOTAL=true;
exports.name='s_bumpTopBD';
const fs = require('fs');
const sqlite = require('./aa-sqlite');
exports.system={
     DATA_BASE_NAME:'bump_points_bd.bd',
     TABLE_NAME:'table01'
};
exports.e={
   table_title:'======TOP===='
};
exports.quiz_types=['!bump','s.up'];

//________________________________INSERT INTO TABLE
exports.insert= async(client,p,u_id,s_id,q_t)=>{
//insert (client,points,user id,server id,quiz type) in bd
try{
    let t=new Date().getTime();
    
    const DATA_BASE_NAME=module.exports.system.DATA_BASE_NAME;
    const TABLE_NAME = module.exports.system.TABLE_NAME;
    await sqlite.open('./$DATA_BASE_NAME').catch(err=>console.log(err));
    console.log('open db');
   
  let resolve = await sqlite.run(`INSERT INTO ${TABLE_NAME} (p_,u_id_,s_id_,q_t_,t_) VALUES(${p},'${u_id}','${s_id}','${q_t}','${t}')`)
     .then(console.log('insert'))
     .catch(err=>console.log(err));
   if(!resolve){
     await sqlite.run(`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (p_ INEGER,u_id_ TEXT,s_id_ TEXT,q_t_ TEXT,t_ TEXT)`)
       .then(console.log('table created')).catch(err=>console.log(err));
     await sqlite.run(`INSERT INTO ${TABLE_NAME} (p_,u_id_,s_id_,q_t_,t_) VALUES(${p},'${u_id}','${s_id}','${q_t}','${t}')`)
       .then(console.log('insert'))
       .catch(err=>console.log(err));
   };//resolve end
 // let table = await sqlite.all(`SELECT * FROM ${TABLE_NAME}`).then(table=>{return table;}).catch(err=>{console.log(err);});
        return;
}catch(err){console.log(err)};
};//exports.insert end

//________________________________
exports.generateTopArr= async(client,s_id,q_t,tag)=>{
//system
try{
    let t_crnt=new Date().getTime();
    const DATA_BASE_NAME=module.exports.system.DATA_BASE_NAME;
    const TABLE_NAME = module.exports.system.TABLE_NAME;
    await sqlite.open('./$DATA_BASE_NAME').catch(err=>console.log(err));
    let table={};
    let n='*';
   // console.log(('t'+q_t));
    if(tag==n&&q_t==n){console.log('0');
       table = await sqlite.all(`SELECT * FROM ${TABLE_NAME} `)
        .then(table=>{return table;})
        .catch(err=>{console.log(err); return false;});
    }else if(tag==n&&q_t!=n){console.log('1');
       table = await sqlite.all(`SELECT * FROM ${TABLE_NAME} WHERE q_t_=='${q_t}' `)
        .then(table=>{return table;})
        .catch(err=>{console.log(err); return false;});
    }else if(tag!=n&&q_t==n){console.log('2');
       tag=1000*60*60*24*tag;
       let time = t_crnt-tag;
       table = await sqlite.all(`SELECT * FROM ${TABLE_NAME} WHERE t_>${time} `)
        .then(table=>{return table;})
        .catch(err=>{console.log(err); return false;});
    }else{console.log('3');
        tag=1000*60*60*24*tag;
      let time = t_crnt-tag;
      table = await sqlite.all(`SELECT * FROM ${TABLE_NAME} WHERE q_t_=='${q_t}' AND t_>${time} `)
        .then(table=>{return table;})
        .catch(err=>{console.log(err); return false;});
     };//
   
    //let table = await sqlite.all(`SELECT * FROM ${TABLE_NAME}`).then(table=>{return table;}).catch(err=>{console.log(err);});
    if(!table||table.length==0) return false;
    //console.log(table);

  let obj={};
  table.map(e=>{
    if(!obj[e.u_id_]){obj[e.u_id_]=0;};
     obj[e.u_id_]+=e.p_;
  });
  // console.log(obj);
   let arr=[];
   for(let key in obj){
       let m_obj={u_id:key,points:obj[key]};
       arr.push(m_obj);
   };//for end
    arr.sort(function(a,b){return b.points-a.points});
    arr=arr.slice(0,20);
    return arr;
}catch(err){console.log(err)};
};//exports.insert end

//________________________GET TOP_STR FROM TABLE
exports.getTopTableEmb=async(client,server_ID,quizType,tag)=>{
//structuring top table in embeds format ,tag==days period, * all time,* all quiz
try{
    //console.log(tag); console.log(quizType);
     let top_arr=await module.exports.generateTopArr(client,server_ID,quizType,tag);
     if(!top_arr) return false;
     tag=(tag=='*')?' за все время ':'за '+tag+' дней ';
     quizType=(quizType=='*')?'тип:все ':'тип:'+quizType;
     //console.log(top_arr);
     let name=module.exports.e.table_title+' '+quizType+' '+tag+' \n';
     let str='';
     let lst_pnts=top_arr[0].points;
     let max=top_arr[0].points; 
     let pos_smb=[0,'🏆','🥈','🥉'];
  
     let pos=1;
     top_arr.map(e=>{
           let mmb=client.guilds.get(server_ID).members.get(e.u_id);
           if(e.points!=lst_pnts){pos++};
           let smb = (!!pos_smb[pos])?pos_smb[pos]:'   ';
           str+='||'+pos+'||'+smb+' '+e.points+' '+mmb+'\n';
           lst_pnts=e.points;
         });
        
      return {fields:[{name:name,value:str}]};
}catch(err){console.log(err);};
};//getTopTableCode end