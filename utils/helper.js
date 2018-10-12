'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const content = require('../data/content.data.json');

function replacer(string, object, flags) {
    Object.keys(object).forEach(key => {
        const regex = new RegExp(key, flags)
        string = string.replace(regex, object[key]);
    });
    return string;
}

const calculateDuration = function (duration) {
    var oneNanoSecond = 1000000000;
    var oneMinute = 60 * oneNanoSecond;
    duration = parseInt(duration);
    function format(min, sec) {
        sec = sec + ' s';
        return min > 0 ? min + ' m ' + sec : sec;
    }
    if (!isNaN(duration)) {
        var min = _.floor(duration / oneMinute);
        var sec = _.round((duration % oneMinute) / oneNanoSecond);
        return format(min, sec);
    }
};

function getStepStatus(step) {
    let cssClass;
    switch (step.result.status) {
        case 'passed':
            cssClass = 'label-success';
            break;
        case 'failed':
            cssClass = 'label-danger';
            break;
        case 'skipped':
            cssClass = 'label-warning';
            break;
        default: cssClass = 'label-warning';
            break;
    }
    return cssClass;
}

function getFeatureTime(scenarios) {
    let result = 0;
    scenarios.forEach(scenario => {
        result += getScenarioTime(scenario.steps);
    });
    return result;
}

function getScenarioTime(steps) {
    let result = 0;
    steps.forEach((step) => {
        if (step.result.status !== 'skipped' && step.result.status !== 'undefined' && (step.keyword !== 'After')) {
            result += step.result.duration;
        }
    });
    return result;
}

function getFeatureStatus(elements) {
    elements = elements.filter((element) => {
        if (getScenarioStatus(element.steps) === 'label-danger') { return element; }
    });
    return elements.length > 0 ? 'label-danger' : 'label-success';
}

function getScenarioStatus(steps) {
    steps = steps.filter((step) => {
        if (step.result.status === 'failed') return step;
    });
    return steps.length > 0 ? 'label-danger' : 'label-success';
}

function fillTemplate(marker, status, name, time, Id, scenarios) {
    const marks = {};
    marks[`#${marker}Status`] = status;
    marks[`#${marker}Name`] = name; 
    marks[`#${marker}Time`] = time;
    marks[`#${marker}ID`] = Id;
    marks[`#${marker}Key`] =  Id;
    marks['#scenariosList'] = scenarios;
    marks['#allSteps'] = scenarios;
    return replacer(content[marker].join('\n'), marks, 'gi');
}

function getResults(reportJson) {
    const statistics = {};
    const statuses = ['passed', 'failed', 'skipped'];
    statuses.forEach(status => {
        let result = 0;
        reportJson.forEach((feature) => {
            feature.elements.forEach((scenario) => {
                scenario.steps.forEach((step) => {
                    if (step.result.status === status) { result++; }
                });
            });
        });
        statistics[status] = result;
    });
    return statistics;
}

function getStepsList(data, reportPath) {
    let failedStep = {};
    let steps = [];
    data.forEach(step => {
        const stepStatus = getStepStatus(step);
        const stepName = step.name;
        if (stepStatus === 'label-danger') {
            failedStep.name = stepName;
            failedStep.index = steps.length;
        }
        const stepKeyword = step.keyword;
        const stepTime = step.result.duration === undefined ? '0 s' : calculateDuration(step.result.duration);
        if (stepKeyword !== 'After') {
            steps.push(fillTemplate('step', stepStatus, stepName, stepTime, stepKeyword));
        } else {
            if (step.embeddings !== undefined) {
                let image = new Buffer.from(step.embeddings[0].data, 'base64');
                fs.existsSync(path.resolve(path.dirname(reportPath))+'/screenshots') || fs.mkdirSync(path.resolve(path.dirname(reportPath))+'/screenshots');
                let screenshotPath = path.resolve(path.dirname(reportPath)) + '/screenshots/' + failedStep.name.replace(/\s/g, '') + '.png';
                fs.writeFileSync(screenshotPath, image, 'base64');
                steps[failedStep.index]=steps[failedStep.index].replace('<!---->', `<a href=\"${screenshotPath}\" alt=\"${failedStep.name}\" title=\"${failedStep.name}\" target=\"_blank\">screen</a>`);
            }
        }

    });
    return steps.join('\n');
}

function getScenariosList(data, listName, reportPath) {
    let scenarios = [];
    data.forEach((scenario, index) => {
        const stepsList = getStepsList(scenario.steps, reportPath);
        const scenarioStatus = getScenarioStatus(scenario.steps);
        const scenarioName = scenario.name;
        const scenarioTime = calculateDuration(getScenarioTime(scenario.steps));
        const scenarioID = `scenario${listName}${index}`
        scenarios.push(fillTemplate('scenario', scenarioStatus, scenarioName, scenarioTime, scenarioID, stepsList));
    });
    return scenarios.join('\n');
}

function getFeaturesLists(jsonData, reportPath) {
    const features = { all: [], passed: [], failed: [] };
    jsonData.forEach((feature) => {
        const featureStatus = getFeatureStatus(feature.elements);
        const featureName = feature.name;
        const featureTime = calculateDuration(getFeatureTime(feature.elements));
        const featureID = {
            all: `featureAll${features.all.length}`,
            passed: `featurePassed${features.passed.length}`,
            failed: `featureFailed${features.failed.length}`
        };
        features.all.push(fillTemplate(
            'feature', featureStatus, featureName, featureTime, featureID.all, getScenariosList(feature.elements, `All${featureID.all}`, reportPath)));
        if (featureStatus === 'label-danger') {
            features.failed.push(
                fillTemplate('feature', featureStatus, featureName, featureTime, featureID.failed, getScenariosList(feature.elements, `Failed${featureID.all}`, reportPath)));
        }
        if (featureStatus === 'label-success') {
            features.passed.push(
                fillTemplate('feature', featureStatus, featureName, featureTime, featureID.passed, getScenariosList(feature.elements, `Passed${featureID.all}`, reportPath)));
        }
    });
    return features;
}

module.exports = { getResults, getFeaturesLists, replacer }
