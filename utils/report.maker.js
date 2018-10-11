'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const {getReport} = require('./report.generator.js');

async function createReport(pathToReport, reportStoreHtml, title, description) {
    const reportJson = JSON.parse(fs.readFileSync(pathToReport));
    const pathToCss = path.resolve(path.resolve(path.dirname(reportStoreHtml)), path.resolve('./css/custom.css'));
    console.log(pathToCss);
    console.log(path.resolve('./css/custom.css'));
    const html =await getReport(reportJson, pathToCss, title, description, reportStoreHtml);
    fs.writeFileSync(reportStoreHtml, html.toString(), 'utf8');
}

module.exports = { createReport }