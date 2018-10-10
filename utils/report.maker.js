'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const reportGenerator = require('./generators/report.generator.js');

function createReport(pathToReport, reportStoreHtml, title, description) {
    const reportJson = JSON.parse(fs.readFileSync(pathToReport));
    const pathToCss = path.relative(path.dirname(reportStoreHtml), './css/custom.css');
    const html = reportGenerator.getReport(reportJson, pathToCss, title, description);
    //let finalHtml =  getReportHeader(reportJson, pathToCss, title, description) + generateHtmlForFeature(reportJson, reportStoreHtml) + reportEnd;
    fs.writeFileSync(reportStoreHtml, finalHtml.toString(), 'utf8');
}

module.exports = { createReport }