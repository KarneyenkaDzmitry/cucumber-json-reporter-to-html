'use strict';
const fs = require('fs');
const path = require('path');
var _ = require('lodash');
function getReportHeader(reportJson, pathToCss, title, description) {
    return `<!DOCTYPE html><html>
<head>
    <title>cucumber-json-reporter-to-html</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="${pathToCss}" type="text/css"/>
    <meta charset="UTF-8">
</head>
<body>
<div class="navbar navbar-default navbar-static-top" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <a class="navbar-brand">cucumber-json-reporter-to-html</a>
            <div class="project-name visible-md visible-lg">${title}</div>
            <div class="label-container">
                <span class="label label-success" title=scenarios>Passed: ${getResult(reportJson, 'passed')}</span>
                <span class="label label-danger" title=scenarios>Failed: ${getResult(reportJson, 'failed')}</span>
                <span class="label label-skipped" title=scenarios>Skipped: ${getResult(reportJson, 'skipped')}</span>
            </div>
        </div>
    </div>
</div>
<div class="container">${description === undefined ? '' : description}</div>`;
}

const reportEnd = `<div> &nbsp<br> &nbsp </div>
<div class="navbar-fixed-bottom row-fluid footer-div ">
<div class="navbar-inner">
    <div class="footer-container">
        <a target="_blank" href="https://www.npmjs.com/package/cucumber-json-reporter-to-html">
            <div class="text-muted footer-link">
                generated by @cucumber-json-reporter-to-html
            </div>
        </a>
    </div>
</div>
</div></body></html>`;

function getResult(reportJson, status) {
    let result = 0;
    reportJson.forEach((feature) => {
        feature.elements.forEach((scenario) => {
            scenario.steps.forEach((step) => {
                if (step.result.status === status) { result++; }
            });
        });
    });
    return result;
}

function getStepColor(step) {
    let cssClass;
    switch (step.result.status) {
        case 'passed':
            cssClass = 'label-success';
            break;
        case 'failed':
            cssClass = 'label-danger';
            break;
        case 'skipped':
            cssClass = 'label-skipped';
            break;
    }
    return cssClass;
}

function getScenarioTime(steps) {
    let result = 0;
    steps.forEach((step) => {
        if (step.result.status !== 'skipped' && step.keyword !== 'After') {
            result += step.result.duration;
        }
    });
    return result;
}

function generateScenarioHtml(scenarioArray, reportStoreHtml) {
    let scenarioHtml = '';
    scenarioArray.forEach((scenario) => {
        scenarioHtml = scenarioHtml + `
        <div class="scenario ${getScenarioStatus(scenario.steps)}">
        <div>
            <strong>${scenario.name}</strong>
            <div style="text-align:right;">${getScenarioTime(scenario.steps)} nanosec</div>
        ${generateStepsHtml(scenario.steps, scenario.name, reportStoreHtml)}</div></div>`;
    });
    return scenarioHtml;
}

function generateStepsHtml(stepsArray, scenarioName, reportStoreHtml) {
    let stepsHtml = '';
    stepsArray.forEach((step) => {
        if (step.keyword !== 'After') {
            stepsHtml = stepsHtml + `<div class="steps ${getStepColor(step)}">${step.name}<div style="text-align:right;">${step.result.duration!==undefined ? step.result.duration + ' nanosec': 'no time'} </div></div>`
        }
        else {
            if (step.embeddings !== undefined) {
                let image = new Buffer.from(step.embeddings[0].data, 'base64');
                fs.existsSync('screenshots') || fs.mkdirSync('screenshots');
                let screenshotPath = './screenshots/' + scenarioName.replace(/\s/g, '') + '.png';
                fs.writeFileSync(screenshotPath, image, 'base64');
                stepsHtml = stepsHtml + `<img src='${path.relative(path.dirname(reportStoreHtml), screenshotPath)}'>`;
            }
        }
    });
    return stepsHtml;
}

function generateHtmlForFeature(jsonData, reportStoreHtml) {
    let reportFillingHtml = '';
    let featureIndex = 0;
    jsonData.forEach((feature) => {
        reportFillingHtml = reportFillingHtml + `<div class="container">
        <h3 class="all-features ${getFeatureStatus(feature.elements)}">${feature.name}</h3>
        <button type="button" class="btn btn-info" data-toggle="collapse" data-target="#feature${featureIndex}">more details</button>
        <div id="feature${featureIndex}" class="collapse">${generateScenarioHtml(feature.elements, reportStoreHtml)}</div></div></div>`
        featureIndex++;
    });
    return reportFillingHtml;
}

function getFeatureStatus(elements) {
    elements = elements.filter((element) => {
        if (getScenarioStatus(element.steps) === 'label-failed') { return element; }
    });
    return elements.length > 0 ? 'label-failed' : 'label-passed';
}

function getScenarioStatus(steps) {
    steps = steps.filter((step) => {
        if (step.result.status === 'failed') return step;
    });
    return steps.length > 0 ? 'label-failed' : 'label-passed';
}

function createReport(pathToReport, reportStoreHtml, title, description) {
    const reportJson = JSON.parse(fs.readFileSync(pathToReport));
    const pathToCss = getPathToCss(reportStoreHtml);
    let finalHtml = getReportHeader(reportJson, pathToCss, title, description) + generateHtmlForFeature(reportJson, reportStoreHtml) + reportEnd;
    fs.writeFileSync(reportStoreHtml, finalHtml.toString(), 'utf8');
}

function getPathToCss(reportStoreHtml) {
    return path.relative(path.dirname(reportStoreHtml), './css/custom.css');
}

module.exports = { createReport }