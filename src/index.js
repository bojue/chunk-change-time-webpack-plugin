const pluginName = 'chunkChangeWebpackPlugin';
const timeState = 'ChunkChangeTime';

class ChunkChangeTimeWebpackPlugin {
    constructor(options){

    }

    apply(compiler) {
        compiler.hooks.emit.tap(pluginName, () => {
            console.log('\n');
            console.time(timeState)
        })
        compiler.hooks.done.tap(pluginName, ()=> {
            console.timeEnd(timeState)
        })
    }
}

module.exports = ChunkChangeTimeWebpackPlugin;