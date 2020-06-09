"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ignore_1 = __importDefault(require("ignore")); //allowJs flag is used for this.
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ignoreFileName = '.sonignore';
class Engine {
    constructor() {
        this.list = [];
    }
    watch(igPath, basePath) {
        fs_1.default.watchFile(igPath, { persistent: true, interval: 500 }, (cur, prev) => {
            if (cur.isFile()) {
                let content = fs_1.default.readFileSync(igPath, { encoding: 'utf-8' });
                this.list[basePath] = ignore_1.default().add(content);
                console.log(`${basePath} updated:\n${content}`);
            }
            else {
                delete (this.list[basePath]);
                console.log(`${basePath} ignore file deleted.`);
            }
        });
    }
    add(basePath) {
        basePath = path_1.default.normalize(basePath);
        if (typeof this.list[basePath] === 'undefined') { //making sure filewatch is called once per file.
            let igPath = path_1.default.join(basePath, ignoreFileName);
            //find ignore file
            if (fs_1.default.existsSync(igPath)) {
                let content = fs_1.default.readFileSync(igPath, { encoding: 'utf-8' });
                this.watch(igPath, basePath);
                this.list[basePath] = ignore_1.default().add(content);
                console.log(content);
            }
        }
    }
    isIgnored(Path) {
        let last = false;
        if (Path !== "") {
            Path = path_1.default.normalize(Path);
            let matches = Object.keys(this.list).filter((p) => Path.includes(p));
            matches = matches.sort((a, b) => a.length - b.length);
            for (let p of matches) {
                let localPath = path_1.default.relative(p, Path);
                if (localPath == "")
                    continue;
                //console.log(`check ${p} ${localPath}`);
                let testRes = this.list[p].test(localPath);
                last = testRes.ignored;
                if (testRes.unignored)
                    last = false;
                //console.log(`${last}->${testRes.ignored}+${testRes.unignored}`);
                if (last)
                    return true;
            }
        }
        return last;
    }
}
exports.default = (new Engine());
