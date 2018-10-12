'use strict';
const index = require('./index');

 index.create('./test/report.json', './test/report.html', 'The Best title of the world', 'DESCRIPTION');

// const line = [
//     "<div class=\"panel-body scenario #scenarioStatus\">",
//     "<div class=\"panel-group\">",
//     "<div class=\"panel panel-default\">",
//     "<div class=\"panel-heading\">",
//     "<h4 class=\"panel-title scenario #scenarioStatus\">",
//     "<a data-toggle=\"collapse\" href=\"##scenarioID\">",
//     "<div class=\"row\">",
//     "<div class=\"col-sm-10\"><strong>Scenario: </strong>#scenarioName</div>",
//     "<div class=\"col-sm-2 duration\">#scenarioTime</div>",
//     "</div></a></h4></div><div id=\"#scenarioID\" class=\"panel-collapse collapse\">",
//     "<ul class=\"list-group\">#allSteps",
//     "</ul></div></div></div><!-- <div class=\"panel-footer\">Panel Footer</div> --></div>"
// ].join('\n');

// function replacer(string, object, flags) {
//     Object.keys(object).forEach(key => {
//         const regex = new RegExp(key, flags)
//         string = string.replace(regex, object[key]);
//     });
//     return string;
// }
// const regex = new RegExp('#scenarioStatus', 'g');
// console.log(replacer(line, { '#ScenarioStatus': "NNNNNNNNNN", '#SCENARIONAME': "XXXXXXXXXXXXXXXXX" }, 'gi'));