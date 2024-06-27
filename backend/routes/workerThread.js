const { parentPort, workerData } = require('worker_threads');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { code, language, directory, uniqueId } = workerData;
function executeCode(code, language, directory) {
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

        fs.mkdir(directory, { recursive: true }, (err) => {
            if (err) {
                res.status = 500;
                res.json({ error: 'Failed to create Directory' });
                return res;
            }
            fs.writeFile(path.join(directory, filename), code, (err) => {
                if (err) {
                    return rejects('Failed to write file');

                }

                const commands = compileCommand ? [compileCommand, runCommand] : [runCommand];
                const executeCommands = (commands) => {
                    if (commands.length == 0) {
                        cleanup(directory);
                        return resolve('Execution Completed');
                    }
                    const command = commands.shift();
                    exec(command, { cwd: directory }, (err, stdout, stderr) => {
                        if (err) {
                            return rejects(stderr);
                        }
                        if (commands.length == 0) {
                            cleanup(directory);
                            resolve(stdout);
                        }
                        else {
                            executeCommands(commands);
                        }
                    })
                }
                executeCommands(commands);
            });
        })
    }

function cleanup(directory) {
            fs.rmdir(directory, { recursive: true }, (err) => {
                if (err) {
                    console.error('Failed to remove directory');
                }
            })
        }

executeCode(code, language, directory)
            .then(output => {
                parentPort.postMessage({ output })
            })
            .catch(err => parentPort.postMessage({ err }))