'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const content = require('../data/content.data.json');

/**
 * Replace substrings from object in origin string
 * @param  {string} origin A string where need to replace substrings
 * @param  {Object} object An object with values key - value (value-string is a string for putting instead of key-string)
 * @param  {string} flags A string with flags.(E.g. g - global, i - ignore case etc.)
 * @return {string} Returns modifined string
 */
function replacer(origin, object, flags) {
    Object.keys(object).forEach(key => {
        const regex = new RegExp(key, flags)
        origin = origin.replace(regex, object[key]);
    });
    return origin;
}


const calculateDuration = function (duration) {
    const oneNanoSecond = 1000000000;
    const oneMinute = 60 * oneNanoSecond;
    duration = parseInt(duration);
    function format(min, sec) {
        sec = sec + ' s';
        return min > 0 ? min + ' m ' + sec : sec;
    }
    if (!isNaN(duration)) {
        let min = _.floor(duration / oneMinute);
        let sec = _.round((duration % oneMinute) / oneNanoSecond);
        return format(min, sec);
    }
};

/** Getter for [steps] css-styles that returns name of class for css styles as a string
 * @param  {Object} step An object with properties
 * @returns {string} string as a name of class for scc styles
 */
function getStepStatus(step) {
    switch (step.result.status) {
        case 'passed': return 'label-success';
        case 'failed': return 'label-danger';
        case 'skipped': return 'label-warning';
        default: return 'label-warning';
    }
}

/** Getter for [features] css-styles that returns name of class for css styles as a string
 * @param  {Array} elements An array with objects
 * @returns {string} string as a name of class for scc styles
 */
function getFeatureStatus(elements) {
    elements = elements.filter((element) => {
        if (getScenarioStatus(element.steps) === 'label-danger') { return element; }
    });
    return elements.length > 0 ? 'label-danger' : 'label-success';
}

/** Getter for [scenarios] css-styles that returns name of class for css styles as a string
 * @param  {Array} steps An array of objects with steps
 * @returns {string} string as a name of class for scc styles
 */
function getScenarioStatus(steps) {
    steps = steps.filter((step) => {
        if (step.result.status === 'failed') return step;
    });
    return steps.length > 0 ? 'label-danger' : 'label-success';
}

/** Getter for [Features] - time
 * @param  {Array} scenarios An array of scenarios 
 * @returns {Number} An amount of time
 */
function getFeatureTime(scenarios) {
    let result = 0;
    scenarios.forEach(scenario => {
        result += getScenarioTime(scenario.steps);
    });
    return result;
}

/** Getter for [Scenarios] - time
 * @param  {Array} steps An array of steps 
 * @returns {Number} An amount of time
 */
function getScenarioTime(steps) {
    let result = 0;
    steps.forEach((step) => {
        if (step.result.status !== 'skipped' && step.result.status !== 'undefined' && (step.keyword !== 'After')) {
            result += step.result.duration;
        }
    });
    return result;
}


/** The method fills the template according to the [marker] value
 * @param  {string} marker - A string. Allowed values: [step], [scenario], [feature];
 * @param  {string} status - A string with css-class for css styles;0
 * @param  {string} name - A string with name of step, scenario, feature;
 * @param  {number or string} time - A duration of current step, scenario, feature;
 * @param  {string} Id - A string with ID for making dropdawns;
 * @param  {string} scenarios - A String with list of scenarios or steps;
 * @returns {string} A string as an needed snippet of html;
 */
function fillTemplate(marker, status, name, time, Id, scenarios) {
    const marks = {};
    marks[`#${marker}Status`] = status;
    marks[`#${marker}Name`] = name;
    marks[`#${marker}Time`] = time;
    marks[`#${marker}ID`] = Id;
    marks[`#${marker}Key`] = Id;
    marks['#scenariosList'] = scenarios;
    marks['#allSteps'] = scenarios;
    return replacer(content[marker].join('\n'), marks, 'gi');
}

/** Getter thar returns statistics of steps
 * @param  {Object} reportJson An Object with data from cucumber report json file
 * @returns {object} with statistic results of steps;
 */
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

/**
 * Getter for [Steps]. Returns a string as a snippet of html with results for reporter
 * @param  {Array} data An array of steps data from cucumber.json data
 * @param  {String} reportPath A string with path to place where will be stores the future generated html report
 * @returns {String} a string as a snippet of html with results for reporter
 */
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
                fs.existsSync(path.resolve(path.dirname(reportPath)) + '/screenshots') || fs.mkdirSync(path.resolve(path.dirname(reportPath)) + '/screenshots');
                let screenshotPath = path.resolve(path.dirname(reportPath)) + '/screenshots/' + failedStep.name.replace(/\s/g, '') + '.png';
                fs.writeFileSync(screenshotPath, image, 'base64');
                steps[failedStep.index] = steps[failedStep.index].replace('<!---->', `<a href=\"${screenshotPath}\" alt=\"${failedStep.name}\" title=\"${failedStep.name}\" target=\"_blank\">screen</a>`);
            }
        }
    });
    return steps.join('\n');
}

/** Getter for [Scenarios]. Returns a string as a snippet of html with results for reporter
 * @param  {Array} data An array of scenarios data from cucumber.json data
 * @param  {String} reportPath A string with path to place where will be stores the future generated html report
 * @returns {String} a string as a snippet of html with results for reporter
 */
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

/** Getter for [Features]. Returns a string as a snippet of html with results for reporter
 * @param  {Array} data An array of features data from cucumber.json data
 * @param  {String} reportPath A string with path to place where will be stores the future generated html report
 * @returns {String} a string as a snippet of html with results for reporter
 */
function getFeaturesLists(data, reportPath) {
    const features = { all: [], passed: [], failed: [] };
    data.forEach((feature) => {
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
