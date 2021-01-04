const pluginName = 'chunkChangeWebpackPlugin';
const timeState = 'ChunkChangeTime';

const COL_RED = '\x1b[31m';
const COL_YELLOW = '\x1b[33m';
const COL_GREEN = '\x1b[32m';
const COL_BLUE = '\x1b[34m';
const COL_MAGENTA = '\x1b[35m';
let logName = 'chunk-change-time-webpack-plugin';
let watchRunTime = 0;

class ChunkChangeTimeWebpackPlugin {
    constructor(options){
        if(typeof options !== 'object') {
            options = {}
        }
        logName = options.logName ||  options.name || logName;
    }

    apply(compiler) {
        compiler.hooks.watchRun.tap(pluginName, (watching) => {
            this.startRun();
            this.webpackEventLog('watch-run');
            watchRunTime = this.uiltGetTime()
            const MTimes = watching.watchFileSystem.watcher.mtimes;
            const changedFiles = Object.keys(MTimes)
                .map(file => `${file}`)
            let fileLen = changedFiles.length;
            for(let i=0;i<fileLen;i++) {
                let file = changedFiles[i];
                this.chunckChangeFile(file, i+1);
            }
        })

        compiler.hooks.compile.tap(pluginName, () => {
            this.webpackEventLog('compile')
        })

        compiler.hooks.compilation.tap(pluginName, (compilation) => {
            this.webpackEventLog('compilation')
            // compilation.hooks.buildModule.tap(pluginName, module => {
            //         module.useSourceMap = true;
            //     }
            // )
            // compilation.hooks.seal.tap(pluginName, module => {
           
            // })
        })

        compiler.hooks.shouldEmit.tap(pluginName, (comp)=> {

        })

        compiler.hooks.emit.tap(pluginName, (compilation) => {
            let changeTime = this.uiltGetChangeTime();
            this.webpackEventLog('event', changeTime);
            // compilation.chunks.forEach( chunk => {
            //     console.log("--------> \n", chunk)
            // })
        })
        compiler.hooks.afterCompile.tap(pluginName, ()=> {
            this.webpackEventLog('after-compile')
        })
        compiler.hooks.done.tap(pluginName, ()=> {
            console.info(COL_YELLOW)
            console.timeEnd(timeState)
        })

        // invalid
        compiler.hooks.invalid.tap(pluginName, ()=> {
            this.webpackEventLog('invalid', COL_RED)
        })

        // failed
        compiler.hooks.failed.tap(pluginName, (err)=> {
            this.webpackEventLog('failed', COL_RED)
            console.info(`\nerror: ${err}`)
        })
    }

    startRun() {
        if(logName !== null) {
            console.info(`----- ${logName} ------`)
        }
        console.time(timeState)
    }

    webpackEventLog(event, changeTime = null, FONT_COL = COL_MAGENTA) {
        let pre = `[chunk-change-event] `;
        let last = `...`;
        if(!changeTime) {
            let info = `${pre} ${event} ${last}`;
            console.info(FONT_COL, info);
        } else {
            let info = `${pre} ${event} ==>`;
            let timeVal = `${changeTime} ms`;
            console.info(FONT_COL, info, COL_BLUE, timeVal);
        }

    }

    chunckChangeFile(file, changeIndex = -1, FONT_COL = COL_GREEN) {
        let pre = `[change-file] ===> `;
        console.log(FONT_COL, `${pre} ${changeIndex > -1 ? changeIndex : ''} ${file}`)
    }

    uiltGetTime() {
        return Date.parse(new Date());
    }

    uiltGetChangeTime() {
        return this.uiltGetTime() - watchRunTime;
    }
}

module.exports = ChunkChangeTimeWebpackPlugin;