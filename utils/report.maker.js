'use strict';

const fs = require('fs');
const { getReport } = require('./report.generator.js');

/** Creates report and saves it
 * @param  {string} pathToReport A path to cucumber [reporter.json] file
 * @param  {string} dest A path to file.html where will be save the html - reporter
 * @param  {string} title A string as a title of the html - reporter
 * @param  {string} description Any descriptions if they are needed
 */
async function createReport(pathToReport, dest, title, description) {
    const data = JSON.parse(fs.readFileSync(pathToReport));
    const html = await getReport(data, title, description, dest);
    fs.writeFileSync(dest, html.toString(), 'utf8');
}

module.exports = { createReport }