const express = require('express');
const executeCode = express();
const bodyParser = require('body-parser');

const path = require('path');
const fs = require('fs');
executeCode.use(bodyParser.json());
const { exec } = require('child_process');

executeCode.post('/', (req, res) => {
    const { code, language, id } = req.body;
    const uniqueDirectory = path.join(__dirname,'..', 'public', id);
    fs.mkdir(uniqueDirectory, { recursive: true }, (err) => {
        if (err) {
            res.status = 500;
            res.json({ error: 'Failed to create Directory' });
            return res;
        }
        let filename;
        let compileCommand;
        let runCommand;
        switch (language) {
            case 'java':
                filename = 'JavaProgram.java';
                compileCommand = `javac -O ${filename}`;
                runCommand = `java ${filename}`;
                break;
            case 'javascript':
                filename='script.js';
                runCommand=`node ${filename}`;
                break;
            case 'cpp':
                filename='program.cpp';
                compileCommand=`g++ -o program ${filename}`;
                runCommand=`./program`;
                break;
            default:
                return rejects('Unsupported Language');
        }
        // console.log(path.join(__dirname, 'workerThread.js'));
        fs.writeFile(path.join(uniqueDirectory, filename), code, (err) => {
            if (err) {
                return rejects('Failed to write file');

            }

            const commands = compileCommand ? [compileCommand, runCommand] : [runCommand];
            console.log('command', commands);
            const executeCommands = (commands) => {
                if (commands.length == 0) {
                    cleanup(uniqueDirectory);
                    res.status = 200;
                    res.json({ output: 'Execution Completed' });
                    return res;
                }
                const command = commands.shift();
                exec(command, { cwd: uniqueDirectory }, (err, stdout, stderr) => {
                    console.log('std', stdout)
                    if (err) {
                        console.log(stderr);
                        const lines = stderr.trim().split('\n');
                        let errorlines= lines.length>0 ? lines[4]:'Unknown error';
                        res.status = 501;
                        res.json({ error: errorlines });
                        return res;
                    }
                    if (commands.length == 0) {
                        cleanup(uniqueDirectory);
                        res.status = 200;
                        res.json({ output: stdout });
                    }
                    else {
                        executeCommands(commands);
                    }
                })
            }
            executeCommands(commands);
        });

    })
})

function cleanup(directory) {
    fs.rmdir(directory, { recursive: true }, (err) => {
        if (err) {
            console.error('Failed to remove directory');
        }
    })
}
module.exports = executeCode;


