# cucumber-json-reporter-to-html ([AT Lab#19])
 
## Usage:

 ### const index = require('./index');
 ### index.create(Path-to-cucumber-report.json, path-to-store-report.html, title-of-report(default: 'There might be your ads'), description(default: no description));
 
 ## Example:
 ` 
 const index = require('./index');
 index.create('./test/report.json', './test/report.html', 'The Best title of the world', 'DESCRIPTION');`
