const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// 解析json
app.use(express.json());
// 托管前端静态页面
app.use(express.static(path.join(__dirname, 'public')));

// 连接MongoDB
const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri)
.then(()=>{
  console.log("✅ MongoDB数据库连接成功");
})
.catch(err=>{
  console.error("❌ MongoDB连接失败",err);
})

// 笔记模型
const noteSchema = new mongoose.Schema({
  title:String,
  content:String,
  createTime:{type:Date,default:Date.now},
  updateTime:{type:Date,default:Date.now}
})
const Note = mongoose.model('Note',noteSchema);

// -------- 后端接口 全部走云数据库 --------
// 获取全部笔记
app.get("/api/notes",async (req,res)=>{
  try{
    const list = await Note.find().sort({updateTime:-1});
    res.json(list);
  }catch(e){
    res.status(500).json({error:e.message})
  }
})

// 新建笔记
app.post("/api/notes",async (req,res)=>{
  try{
    const {title,content}=req.body;
    const doc = new Note({title,content});
    await doc.save();
    res.json(doc);
  }catch(e){
    res.status(500).json({error:e.message})
  }
})

// 编辑保存笔记
app.put("/api/notes/:id",async (req,res)=>{
  try{
    const {title,content}=req.body;
    const doc = await Note.findByIdAndUpdate(req.params.id,{
      title,content,updateTime:Date.now()
    },{new:true})
    res.json(doc);
  }catch(e){
    res.status(500).json({error:e.message})
  }
})

// 删除笔记
app.delete("/api/notes/:id",async (req,res)=>{
  try{
    await Note.findByIdAndDelete(req.params.id);
    res.json({ok:true})
  }catch(e){
    res.status(500).json({error:e.message})
  }
})

// 所有路由返回index.html，支持前端路由
app.get("*",(req,res)=>{
  res.sendFile(path.join(__dirname,"public/index.html"))
})

app.listen(PORT,()=>{
  console.log(`服务启动，端口:${PORT}`)
})
