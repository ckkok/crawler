#!/bin/sh
":" //# comment; exec /usr/bin/env node --experimental-modules "$0" "$@";
import { readdirSync, readFileSync, statSync, readFile as rf, writeFile as wf } from 'fs';
import { promisify } from 'util';

const args = process.argv.slice(2);
if (args.includes('help') === true) {
    console.log('HALP!');
    console.log('=====');
    console.log('Syntax: crawl (rule file in json format, default = rules.json) (base directory, default = .)');
    console.log('Rule file format: Array of {file (regex), phrase (regex), replacement (string)}');
    console.log('Example: [{"file": ".js$", "phrase": "\\\\(this\\\\)", "replacement": "(that)}]');
    process.exit(0);
}

const readFile = promisify(rf);
const writeFile = promisify(wf);

const rules = JSON.parse(readFileSync((args[0] || 'rules.json'), 'utf-8'));
const fileList = getFilesInDirectory((args[1] || '.'));

function getFilesInDirectory(baseDir) {
    const arr = readdirSync(baseDir);
    const result = [];
    const dirSize = arr.length;
    for (let i = 0; i < dirSize; i++) {
        const fullEntry = `${baseDir}/${arr[i]}`;
        if (statSync(fullEntry).isDirectory()) {
            result.push(...getFilesInDirectory(fullEntry));
        } else {
            result.push(fullEntry);
        };
    }
    return result;
}

// Async I/O operations are used here as the sizes of the files are indeterminate
function replacer(file) {
    const actualFileName = file.substring(file.lastIndexOf('/') + 1);
    rules.forEach((rule) => {
        const fileNameTest = RegExp(rule["file"]);
        if (fileNameTest.test(actualFileName) === true) {
            console.log(`Processing ${file}`);
            readFile(file, 'utf-8')
                .then(contents => {
                    const regexp = new RegExp(rule["phrase"], 'g');    
                    const newContent = contents.replace(regexp, rule["replacement"]);
                    writeFile(file, newContent);
                })
                .catch(err => {
                    throw new ReferenceError(err.message);
                })
        };
    });
};

fileList.forEach(replacer);
