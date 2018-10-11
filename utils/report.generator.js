'use strict';

const { getFeaturesLists, getResults } = require('./helper.js');
const blank = require('../data/blank.data.json');

function getHead(pathToCss, title) {
    return (blank.head.join('\n').replace('#title', title)).replace('#cssPath', pathToCss);
}

async function getBody(reportJson, title, description) {
    return await getHeader(reportJson, title) + await getMain(reportJson, description) + await getFooter()
}

async function getHeader(reportJson, title) {
    let header = blank.body.header.join('\n');
    const statistics = await getResults(reportJson);
    header = header.replace(/#title/, title);
    header = header.replace(/#passedAmount/, statistics['passed']);
    header = header.replace(/#failedAmount/, statistics['failed']);
    return header.replace(/#skippedAmount/, statistics['skipped']);
}
async function getMain(reportJson, description) {
    let main = blank.body.main.join('\n');
    const lists = await getFeaturesLists(reportJson);
    main = main.replace(/#description/, description);
    main = main.replace(/#allFeaturesList/, lists['all'].join('\n'));
    main = main.replace(/#passedFeaturesList/, lists['passed'].join('\n'));
    main = main.replace(/#failedFeaturesList/, lists['failed'].join('\n'));
    return main;
}
function getFooter() {
    return blank.body.footer.join('\n').replace(/#date/, new Date());
}

async function getReport(reportJson, pathToCss, title, description) {
    return (blank.html.replace('#head', await getHead(pathToCss, title))).replace('#body', await getBody(reportJson, title, description));
}

module.exports = { getReport }