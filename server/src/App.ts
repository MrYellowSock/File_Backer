import express from "express"; //"esModuleInterop": true,   
import cors from "cors"
import {getFiles,getSizeAsync, generateBackup} from "./filemodule/fileDealer";
import compression from 'compression';

const port = 4000;
const file_port = 3500;

let app:express.Application = express();

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.get("/",function(req:express.Request,res:express.Response){
    res.send("HELLO");
})
app.get('/', function (req, res) {
  res.send('hello world');
});

app.post('/getFiles',function(req,res){
  console.log('---[getFile]---');
  res.contentType("json");
  res.send(JSON.stringify(getFiles(req.body.path)))
})
app.post('/getSize',function(req,res){
  //fix here dont calculate file that's ignored inside directory!
  let path:string = req.body.path;
  console.log('getSize:'+path);
  
  res.contentType("text");
  getSizeAsync(path).then((s)=>{
    res.send(s);
  })
  .catch((reason)=>{
    console.error(reason);
    res.send("failed");
  })
})

interface reqTemplate{
  targList:string[];
  outPath:string;
}
app.post('/compile',function(req,res){
  res.setHeader('Content-Type', 'json/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  
  let reqBody:reqTemplate = req.body as reqTemplate;
  console.log(reqBody);
  generateBackup(reqBody.targList,reqBody.outPath,(err,cnt)=>{
    if(err){
      console.log(err);
    }
    else{
      console.log(`${cnt}%`);
      res.write("1");
      res.flush();
    }
    if(cnt === 100){
      res.write("1");
      res.end();
    }
  });

})  

app.listen(port,()=>{
    console.log(`API server starts at ${port}`)
})


//File server (use another server make it easy for development) :
let file_server:express.Application = express();
file_server.use(express.static('./build'));
file_server.listen(file_port,()=>{
    console.log(`user interface server starts at ${file_port}`)
})