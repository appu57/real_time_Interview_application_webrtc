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
                compileCommand = `javac ${filename}`;
                runCommand = `java ${filename}`;
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
                    console.log(commands);
                    cleanup(uniqueDirectory);
                    res.status = 200;
                    res.json({ output: 'Execution Completed' });
                    return res;
                }
                const command = commands.shift();
                exec(command, { cwd: uniqueDirectory }, (err, stdout, stderr) => {
                    console.log('std', stdout)
                    if (err) {
                        console.log(err);
                        res.status = 501;
                        res.json({ error: stderr });
                        return res;
                    }
                    if (commands.length == 0) {
                        cleanup(uniqueDirectory);
                        console.log(stdout);
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
    console.log(directory);
    fs.rmdir(directory, { recursive: true }, (err) => {
        if (err) {
            console.error('Failed to remove directory');
        }
    })
}
module.exports = executeCode;


