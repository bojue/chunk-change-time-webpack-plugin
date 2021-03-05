const pluginName = 'chunkChangeWebpackPlugin';
const timeState = 'ChunkChangeTime';

const COL_RED = '\x1b[31m';
const COL_YELLOW = '\x1b[33m';
const COL_GREEN = '\x1b[32m';
const COL_BLUE = '\x1b[34m';
const COL_MAGENTA = '\x1b[35m';
const COL_WHITE = '\x1b[37m';
let logName = 'chunk-change-time-webpack-plugin';
let ignoreSorceMapInfoBool = true;
let watchRunTime = 0;
let chunkVersions = {}
let chunkIndex = 0;

class ChunkChangeTimeWebpackPlugin {
    constructor(options){
        if(typeof options !== 'object') {
            options = {}
        }
        logName = options.logName ||  options.name || logName;
        ignoreSorceMapInfoBool = options.ignoreSorceMapInfoBool === false ? false : ignoreSorceMapInfoBool;
        watchRunTime = 0;
        chunkVersions = {};
    }

    apply(compiler) {
        compiler.hooks.watchRun.tap(pluginName, (watching) => {
            this.startRun();
            chunkIndex = 0;
            this.webpackEventLog('watch-run');
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
            this.webpackEventLog('compile', this.uiltGetChangeTime());
        })

        compiler.hooks.compilation.tap(pluginName, (compilation) => {
            this.webpackEventLog('compilation', this.uiltGetChangeTime());
        })

        compiler.hooks.emit.tap(pluginName, (compilation) => {
            this.webpackEventLog('emit', this.uiltGetChangeTime());
            let changeChunks = compilation.chunks.filter(chunk => {
                var _oldVers = chunkVersions[chunk.name];
                chunkVersions[chunk.name] = chunk.hash;
                return chunk.hash !== _oldVers;
            });
            changeChunks.forEach(chunk => {
                let _index = 0;
                chunk.files.forEach((filename, index) => {
                    if(ignoreSorceMapInfoBool && filename.indexOf('.js.map') === -1) {
                        _index ++;
                        this.chunckChangeFile(filename, 'chunk', _index)
                    }else if(!ignoreSorceMapInfoBool){
                        this.chunckChangeFile(filename, 'chunk', index)
                    }
                
                });
            })
        })
        compiler.hooks.afterCompile.tap(pluginName, ()=> {
            this.webpackEventLog('after-compile', this.uiltGetChangeTime());
        })
        compiler.hooks.done.tap(pluginName, ()=> {
            this.webpackEventLog('done', this.uiltGetChangeTime());
            console.info(`${COL_MAGENTA} [Build at] ===> ${COL_BLUE}${new Date()}`)
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
            console.info(`\n----- ${logName} ------`)
        }
        console.time(timeState)
    }

    webpackEventLog(event, changeTime = null, FONT_COL = COL_MAGENTA) {
        if(event === 'watch-run') {
            watchRunTime = this.uiltGetTime();
        }
        let pre = `[chunk-change-event] `;
        let last = `...`;
        if(!changeTime) {
            let info = `${pre} ${event} ${last}`;
            console.info(FONT_COL, info);
        } else {
            let info = `${pre} ${event} ==>`;
            let timeVal = `${changeTime}${COL_MAGENTA} ms from watch-run`;
            console.info(FONT_COL, info, COL_BLUE, timeVal);
        }
    }

    chunckChangeFile(file, state = 'file', changeIndex = -1, FONT_COL = COL_GREEN) {
        let pre = state === 'file' ? `[file-change] ===> ` : `[webpack-chunk-change] ===> `;
        console.log(FONT_COL, `${pre} ${changeIndex > -1 ? ++chunkIndex : ''} ${file}`)
    }

    uiltGetChangeTime() {
        return this.uiltGetTime() - watchRunTime;
    }

    uiltGetTime() {
        return new Date().getTime()
    }
}

module.exports = ChunkChangeTimeWebpackPlugin;