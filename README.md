# cucumber-json-reporter-to-html (Javascript ( Node.js))

### Description 
The application helps to convert cucumber.json reporter into pretty html view.<br>
A html reporter will have anougth information for analize tests<br>
<img weight = "700" src="https://github.com/KarneyenkaDzmitry/cucumber-json-reporter-to-html/blob/master/Screenshot-description.png">

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

 ### const reporter = require('cucumber-json-reporter-to-html');<br>
 ### reporter.create(Path-to-cucumber-report.json, path-to-store-report.html, title-of-report(default: 'There might be your ads'), description(default: no description));
 
 #### Example:
 `const reporter = require('cucumber-json-reporter-to-html');`
 `reporter.create('./test/report.json', './test/report.html', 'The Best title of the world', 'DESCRIPTION');`

## Structure 
### Folders:

- [css](https://github.com/KarneyenkaDzmitry/cucumber-json-reporter-to-html/tree/master/css) - there are all styles that needed for making html report prettier;
- [data](https://github.com/KarneyenkaDzmitry/cucumber-json-reporter-to-html/tree/master/data) - containes data for creating html page;
- [utils](https://github.com/KarneyenkaDzmitry/cucumber-json-reporter-to-html/tree/master/utils) - contains main files with methods that create a report.

### Files in root:

- [index.js](https://github.com/KarneyenkaDzmitry/cucumber-json-reporter-to-html/blob/master/index.js) - main file in which you can find our Calculator class;
- [.eslintrc.js](https://github.com/KarneyenkaDzmitry/cucumber-json-reporter-to-html/blob/master/.eslintrc.js) - all rulles for [eslint] are placed there;
- [.gitignore](https://github.com/KarneyenkaDzmitry/cucumber-json-reporter-to-html/blob/master/.gitignore) -  all folders and files that should not be indexed by [git] are listed here;
- [package.json](https://github.com/KarneyenkaDzmitry/cucumber-json-reporter-to-html/blob/master/package.json) - includes all data for [npm];
- [Screenshot-description.png](https://github.com/KarneyenkaDzmitry/cucumber-json-reporter-to-html/blob/master/Screenshot-description.png) - png file with descriptions of the options a reporter;
- [LICENSE](https://github.com/KarneyenkaDzmitry/cucumber-json-reporter-to-html/blob/master/LICENSE) - license MIT;
- [README.md](https://github.com/KarneyenkaDzmitry/cucumber-json-reporter-to-html/blob/master/README.md) - readme file with special information about the application and git-syntacs. 

### Author
#### Dzmitry_Karneyenka, Republic of Belarus, Minsk

## N.B.
### How store and use too long string in json file 
The easiest way is to store the long string as an array:<br>
`{"long string" : [`<br>
            `"<body><header>",`<br>
            `"<nav class=\"navbar navbar-default navbar-static-top\" role=\"navigation\">",`<br>
            `"<div class=\"container\">",`<br>
            `"<div class=\"navbar-brand\">title</div>",`<br>
            `"<div class=\"navbar-header label-container\"><p>"`<br>
`]`<br>
And then use the method join() in js-code:<br>
`json["long string].join('');`<br>
Don't forget that the method takes delemiter as an input value, so you can send different delemiters.<br>
E.g.:<br>
`json["long string].join('\n');`<br>
`json["long string].join(',');`<br>
and so on.<br>
[see documentation](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/join)<br>

### How replace substring into your string 
Use for this reason method String.prototype.replace(regex or string, your string)<br>
Don't forget:
1. The method takes string or Regex.prototype as the first parameter<br>
and your string as the second parameter.<br>
2. You can use flags for regex (g-global, i-ignore case):
E.g. via regex:<br>
`const  p = 'The quick brown fox jumped over the lazy dog. If the dog reacted, was it really lazy?';`<br>
`console.log(p.replace(/dog/gi, 'ferret'));`<br>
`//expected output: "The quick brown fox jumped over the lazy ferret. If the ferret reacted, was it really lazy?"`<br>
E.g. via variable and create new RegEx object:<br> 
`const  p = 'The quick brown fox jumped over the lazy dog. If the dog reacted, was it really lazy?';`<br>
`const variable = 'dog'`<br>
`const regex = new RegEx(variable, 'gi')`<br>
`console.log(p.replace(regex, 'ferret'));`<br>
`//expected output: "The quick brown fox jumped over the lazy ferret. If the ferret reacted, was it really lazy?"`<br>
and so on.<br>
[see documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)<br>
[see documentation(RegEx)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)<br>