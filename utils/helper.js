'use strict';

const _ = require('lodash');
const content = require('../data/content.data.json');

let calculateDuration = function (duration) {
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
    let instance = content[marker].join('\n');
    instance = instance.replace(`#${marker}Status`, status);
    instance = instance.replace(`#${marker}Name`, name);
    instance = instance.replace(`#${marker}Time`, time);
    instance = instance.replace(`#${marker}Status`, status);
    instance = instance.replace(/#scenariosList/, scenarios);
    instance = instance.replace(/#allSteps/, scenarios);
    switch (marker) {
        case 'feature': case 'scenario': instance = (instance.replace(`#${marker}ID`, Id)).replace(`#${marker}ID`, Id); break;
        case 'step': instance = instance.replace(`#${marker}Key`, Id); break;
    }
    return instance;
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

function getStepsList(data) {
    let steps = [];
    data.forEach(step => {
        const stepStatus = getStepStatus(step);
        const stepKeyword = step.keyword;
        const stepName = step.name;
        const stepTime = step.result.duration === undefined ? '0s' : calculateDuration(step.result.duration);
        if (stepKeyword !== 'After') {
            steps.push(fillTemplate('step', stepStatus, stepName, stepTime, stepKeyword));
        } else {
            if (step.embeddings !== undefined) {
                let image = new Buffer.from(step.embeddings[0].data, 'base64');
                fs.existsSync('screenshots') || fs.mkdirSync('screenshots');
                let screenshotPath = './screenshots/' + scenarioName.replace(/\s/g, '') + '.png';
                fs.writeFileSync(screenshotPath, image, 'base64');
                stepsHtml = stepsHtml + `<img src='${path.relative(path.dirname(reportStoreHtml), screenshotPath)}'>`;
            }
        }
    });
    return steps.join('\n');
}

function getScenariosList(data, listName) {
    let scenarios = [];
    data.forEach((scenario, index) => {
        const stepsList = getStepsList(scenario.steps);
        const scenarioStatus = getScenarioStatus(scenario.steps);
        const scenarioName = scenario.name;
        const scenarioTime = calculateDuration(getScenarioTime(scenario.steps));
        const scenarioID = `scenario${listName}${index}`
        scenarios.push(fillTemplate('scenario', scenarioStatus, scenarioName, scenarioTime, scenarioID, stepsList));
    });
    return scenarios.join('\n');
}

function getFeaturesLists(jsonData) {
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
            'feature', featureStatus, featureName, featureTime, featureID.all, getScenariosList(feature.elements, `All${featureID.all}`)));
        if (featureStatus === 'label-danger') {
            features.failed.push(
                fillTemplate('feature', featureStatus, featureName, featureTime, featureID.failed, getScenariosList(feature.elements, `Failed${featureID.all}`)));
        }
        if (featureStatus === 'label-success') {
            features.passed.push(
                fillTemplate('feature', featureStatus, featureName, featureTime, featureID.passed, getScenariosList(feature.elements, `Passed${featureID.all}`)));
        }
    });
    return features;
}

module.exports = { getResults, getFeaturesLists }
