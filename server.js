const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const PASSWORD = "7211.dx"; // ←改成你自己的访问密码
const DATA_FILE = "./note.txt";

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

//读取笔记
app.get('/api/note',(req,res)=>{
  const pwd = req.query.pwd;
  if(pwd!==PASSWORD) return res.status(403).json({ok:false,msg:"密码错误"});
  if(!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE,"","utf8");
  const content = fs.readFileSync(DATA_FILE,"utf8");
  res.json({ok:true,content});
})

//保存笔记
app.post('/api/note',(req,res)=>{
  const {pwd,text}=req.body;
  if(pwd!==PASSWORD) return res.status(403).json({ok:false,msg:"密码错误"});
  fs.writeFileSync(DATA_FILE,text,"utf8");
  res.json({ok:true});
})

app.listen(PORT,()=>console.log("run on "+PORT));
