'use strict';

const {getFeaturesLists, getResults} = require('../helper.js');
const blank = require('./data/blank.data.json');

function getHead(pathToCss, title) {
    return (blank.head.join('\n').replace('#title', title)).replace('#cssPath', pathToCss);
}

async function getBody(reportJson, title, description) {
    return await getHeader(reportJson, title) + await getMain(reportJson, description) + await getFooter()
}

async function getHeader(reportJson, title) {
    let header = blank.body.header;
    const statistics =await  getResults(reportJson);
    header = header.replace(/#title/, title);
    header = header.replace(/#passedAmount/, statistics['passed']);
    header = header.replace(/#failedAmount/, statistics['failed']);
    return header.replace(/#skippedAmount/, statistics['skipped']);
}
async function getMain(reportJson, description) {
    let main = blank.body.main;
    const lists = await getFeaturesLists(reportJson);
    main = main.replace(/#description/, description);
    main = main.replace(/#allFeaturesList/, list['all']);
    main = main.replace(/#passedFeaturesList/, list['passed']);
    return main.replace(/#failedFeaturesList/, list['failed']);
}
function getFooter() {
    return blank.body.footer.replace(/#date/, new Date());
}

function getReport(reportJson, pathToCss, title, description) {
    return (blank.html.replace('#head', getHead(pathToCss, title))).replace('#body', getBody(reportJson, title, description));
}

module.exports = { getReport }