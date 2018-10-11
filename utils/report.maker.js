'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const {getReport} = require('./report.generator.js');

async function createReport(pathToReport, reportStoreHtml, title, description) {
    const reportJson = JSON.parse(fs.readFileSync(pathToReport));
    const pathToCss = path.relative(path.dirname(reportStoreHtml), './css/custom.css');
    const html =await getReport(reportJson, pathToCss, title, description);
    fs.writeFileSync(reportStoreHtml, html.toString(), 'utf8');
}

module.exports = { createReport }