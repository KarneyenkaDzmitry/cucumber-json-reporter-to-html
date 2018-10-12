'use strict';

const { getFeaturesLists, getResults, replacer } = require('./helper.js');
const blank = require('../data/blank.data.json');

function getHead(pathToCss, title) {
    return replacer(blank.head.join('\n'),{'#title': title, '#cssPath': pathToCss}, 'gi');
}

async function getBody(reportJson, title, description, reportPath) {
    return await getHeader(reportJson, title) + await getMain(reportJson, description, reportPath) + await getFooter();
}

async function getHeader(reportJson, title) {
    const statistics = await getResults(reportJson);
    return replacer(blank.body.header.join('\n'), {
        '#title': title,
        '#passedAmount': statistics['passed'],
        '#failedAmount': statistics['failed'],
        '#skippedAmount': statistics['skipped']
    }, 'gi');
}
async function getMain(reportJson, description, reportPath) {
    const lists = await getFeaturesLists(reportJson, reportPath);
    return replacer(blank.body.main.join('\n'), {
        '#description': description,
        '#allFeaturesList': lists['all'].join('\n'),
        '#passedFeaturesList': lists['passed'].join('\n'),
        '#failedFeaturesList': lists['failed'].join('\n')
    }, 'gi');
}
function getFooter() {
    return replacer(blank.body.footer.join('\n'),{'#date': new Date()}, 'gi');
}

async function getReport(reportJson, pathToCss, title, description, reportPath) {
    return replacer(blank.html,
        {'#head': await getHead(pathToCss, title), '#body': await getBody(reportJson, title, description, reportPath)}, 'gi');
}

module.exports = { getReport }