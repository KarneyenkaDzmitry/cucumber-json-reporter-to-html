# cucumber-json-reporter-to-html (Javascript ( Node.js))

### Description 
The application helps to convert cucumber.json reporter into pretty html view.<br>
A html reporter will have anougth information for analize tests<br>

#### Keywords: protractor, cucumber, html, reporter, convertor, from json, to html, cucumber-reporter, html-reporter.
 
### The application needs to have the following dependencies:

    npm --version 6.4.1
    node --version 8.11.4

## Deploy
$ npm install

Before start the program is supposed to set up module into your project by using the command [npm install cucumber-json-reporter-to-html].<br>
Npm downloads the module and prepars the programm for start.<br>

There application has only one dependency: "lodash": "^4.17.10"

## Usage:

 ### const reporter = require('cucumber-json-reporter-to-html');
 ### reporter.create(Path-to-cucumber-report.json, path-to-store-report.html, title-of-report(default: 'There might be your ads'), description(default: no description));
 
 #### Example:
 `const reporter = require('cucumber-json-reporter-to-html');
 reporter.create('./test/report.json', './test/report.html', 'The Best title of the world', 'DESCRIPTION');`

## Structure 
### Folders:

- [css] - there are all styles that needed for making html report prettier;
- [node_modules] - will be created after [npm install] command. There will be stored all additional modules;
- [data] - containes data for creating html page;
- [utils] - contains main files with methods that create a report.

### Files in root:

- [index.js]() - main file in which you can find our Calculator class;
- [.eslintrc.js]() - all rulles for [eslint] are placed there;
- [.gitignore]() -  all folders and files that should not be indexed by [git] are listed here;
- [package.json]() - includes all data for [npm]
- [README.md]() - readme file with special information about the application and git-syntacs. 

### Author
#### Dzmitry_Karneyenka, Republic of Belarus, Minsk

## N.B.
### chai method throw
How to make checks for Errors?<br>
1. Create new function that will include tested method that have to throw an Error with data.<br>
`e.g. const actualResult = () => calculator.add(data);`<br><br>
2. Send it into check's method. further steps it does itself.It makes listener, runs method and catches an Error.<br>
`e.g. chai.expect(actualResult).to.throw(TypeError);`<br>
[see documentation](https://www.chaijs.com/api/bdd/#method_throw)<br>
