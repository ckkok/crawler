# Crawl

A no-dependency NodeJS command-line tool to recursively crawl through files in subdirectories and replace text in them.

## Installation

Clone this repository and run `npm install -g` in it.

## Usage

Run `crawl help` to view the syntax and rule file format.

Syntax: `crawl (name of the rule file, default = rules.json) (base directory, default = .)`

## Rule file format

The rule file is a `.json` file containing a single array of objects. Each object has 3 fields:
1. file - used as a regular expression to test if a file should be processed
2. phrase - used as a regular expression that will be replaced in the corresponding file
3. replacement - a string that replaces the above phrase

Example
```
[
    {
        "file"          : ".js$",
        "phrase"        : "console.log\\(that\\)",
        "replacement"   : "console.error(this)"
    },
    {
        "file"          : "stuff.txt",
        "phrase"        : "dog",
        "replacement"   : "cat"
    }
]
```