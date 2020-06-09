"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBackup = exports.getSizeAsync = exports.getFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Ignorer_1 = __importDefault(require("./Ignorer"));
const async_1 = __importDefault(require("async"));
const events_1 = require("events");
//independent funcs
function isDir(value) {
    if (fs_1.default.existsSync(value)) {
        return fs_1.default.lstatSync(value).isDirectory();
    }
    return false;
}
function createName() {
    let d = new Date();
    let gen = `${d.getDay()}-${d.getMonth()}-${d.getFullYear()}|${d.getHours()}:${d.getMinutes()}`;
    return gen;
}
function createCpPath(target, item, output) {
    return path_1.default.join(output, item.replace(path_1.default.normalize(target), ""));
}
function readSizeRecursive(item, cb, pList) {
    if (Ignorer_1.default.isIgnored(item)) {
        cb(null, -1);
    }
    else {
        fs_1.default.lstat(item, function (err, stats) {
            if (!err) {
                if (stats.isDirectory()) {
                    if (pList) {
                        pList.dirList.push(item);
                    }
                    let total = stats.size; //directory entry size
                    Ignorer_1.default.add(item);
                    fs_1.default.readdir(item, function (err, list) {
                        if (err)
                            return cb(err, 0);
                        async_1.default.forEach(list, function (diritem, callback) {
                            readSizeRecursive(path_1.default.join(item, diritem), function (err, size) {
                                total += size;
                                callback(err);
                            }, pList);
                        }, function (err) {
                            cb(err, total);
                        });
                    });
                }
                else if (stats.isFile()) {
                    fs_1.default.stat(item, (err, stats) => {
                        if (pList) {
                            pList.fileList.push(item);
                        }
                        cb(err, stats.size);
                    });
                }
                else {
                    cb(err, 0);
                }
            }
            else {
                cb(err, 0);
            }
        });
    }
}
function getSizeAsync(Path, pList) {
    return __awaiter(this, void 0, void 0, function* () {
        var prom = new Promise((resolve, reject) => {
            readSizeRecursive(Path, (err, total) => {
                if (err) {
                    return reject(err);
                }
                return resolve(total.toString());
            }, pList);
        });
        return prom;
    });
}
exports.getSizeAsync = getSizeAsync;
function getFiles(base) {
    var result = { base: base, exists: isDir(base), files: [] };
    if (result.exists) {
        try {
            let fileList = fs_1.default.readdirSync(base, { withFileTypes: false });
            Ignorer_1.default.add(base);
            result.files = fileList.map((value) => {
                let fullPath = path_1.default.join(base, value);
                let x = { isDir: fs_1.default.lstatSync(path_1.default.join(fullPath)).isDirectory(), name: value, isIgnored: false };
                x.isIgnored = Ignorer_1.default.isIgnored(fullPath);
                return x;
            });
        }
        catch (e) {
            if (e.code === 'EACCES')
                result.exists = false; //permission denied!
            else
                throw e;
        }
    }
    return result;
}
exports.getFiles = getFiles;
class Progress extends events_1.EventEmitter {
    constructor(fullValue) {
        super();
        this.fullVal = fullValue;
        this.curVal = 0;
        this.thereshold = Math.floor(fullValue / 100);
        this.counter = 0;
        this.trigger = -1;
    }
    add() {
        this.counter += 1;
        this.curVal += 1;
        if (this.curVal > this.fullVal)
            throw new Error("fullValue overflowed!");
        if (this.counter >= this.thereshold || this.curVal == this.fullVal) {
            this.counter = 0;
            this.emit('progress');
        }
        if (this.curVal == this.trigger)
            this.emit("trigger");
    }
    setTrigger(value) {
        this.trigger = value;
    }
    get value() {
        return Math.floor((this.curVal / this.fullVal) * 100);
    }
}
function copyAsync(pList, output, cb) {
    let prog = new Progress(pList.fileList.length + pList.dirList.length);
    prog.setTrigger(pList.dirList.length);
    prog.once('trigger', () => {
        for (var p of pList.fileList) {
            fs_1.default.copyFile(p, path_1.default.join(output, p), (err) => {
                if (err)
                    cb(err, prog.value);
                prog.add();
            });
        }
    });
    prog.on('progress', () => {
        cb(null, prog.value);
    });
    for (var p of pList.dirList) {
        fs_1.default.mkdir(path_1.default.join(output, p), { recursive: true }, (err) => {
            if (err)
                cb(err, prog.value);
            prog.add();
        });
    }
}
function generateBackup(targList, output, cb) {
    if (!fs_1.default.existsSync(output)) {
        cb(Error("provided output not exists"), 100);
        return;
    }
    for (var target of targList) {
        if (!(fs_1.default.existsSync(target))) {
            cb(Error("provided paths not exists"), 100);
            return;
        }
    }
    output = path_1.default.join(output, createName());
    let result = output;
    let dupl = 0;
    while (fs_1.default.existsSync(result)) {
        dupl += 1;
        result = `${output}(${dupl})`;
    }
    let res = { fileList: [], dirList: [] };
    let done = 0;
    let len = targList.length;
    for (var target of targList) {
        console.log("getting size infomation for " + target);
        getSizeAsync(target, res).then((byte) => {
            console.log(`${res.dirList.length} dirs , ${res.fileList.length} files , total:${byte}bytes`);
            done += 1;
            if (done == len) {
                console.log(res);
                copyAsync(res, output, cb);
            }
        });
    }
}
exports.generateBackup = generateBackup;
