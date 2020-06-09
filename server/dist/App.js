"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); //"esModuleInterop": true,   
const cors_1 = __importDefault(require("cors"));
const fileDealer_1 = require("./filemodule/fileDealer");
const compression_1 = __importDefault(require("compression"));
const port = 4000;
const file_port = 3500;
let app = express_1.default();
app.use(compression_1.default());
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", function (req, res) {
    res.send("HELLO");
});
app.get('/', function (req, res) {
    res.send('hello world');
});
app.post('/getFiles', function (req, res) {
    console.log('---[getFile]---');
    res.contentType("json");
    res.send(JSON.stringify(fileDealer_1.getFiles(req.body.path)));
});
app.post('/getSize', function (req, res) {
    //fix here dont calculate file that's ignored inside directory!
    let path = req.body.path;
    console.log('getSize:' + path);
    res.contentType("text");
    fileDealer_1.getSizeAsync(path).then((s) => {
        res.send(s);
    })
        .catch((reason) => {
        console.error(reason);
        res.send("failed");
    });
});
app.post('/compile', function (req, res) {
    res.setHeader('Content-Type', 'json/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    let reqBody = req.body;
    console.log(reqBody);
    fileDealer_1.generateBackup(reqBody.targList, reqBody.outPath, (err, cnt) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(`${cnt}%`);
            res.write("1");
            res.flush();
        }
        if (cnt === 100) {
            res.write("1");
            res.end();
        }
    });
});
app.listen(port, () => {
    console.log(`API server starts at ${port}`);
});
//File server (use another server make it easy for development) :
let file_server = express_1.default();
file_server.use(express_1.default.static('./build'));
file_server.listen(file_port, () => {
    console.log(`user interface server starts at ${file_port}`);
});
