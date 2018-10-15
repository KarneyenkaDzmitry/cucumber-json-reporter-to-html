'use strict';

const {createReport} = require('./utils/report.maker');
let titleOfReport, descriptionOfReport;

/** The function creates html - reporter that based on cucumber.json reporter
 * @param  {string} source A path to cucumber [reporter.json] file
 * @param  {string} dest A path to file.html where will be save the html - reporter
 * @param  {string} title A string as a title of the html - reporter
 * @param  {string} description Any descriptions if they are needed
 */
function create( source, dest, title, description ) {
    if (typeof (source) !== 'string') throw new Error('variable [source] have to be a string')
    if (typeof (dest) !== 'string') throw new Error('variable [dest] have to be a string')
    titleOfReport = typeof (title) === 'undefiened' ? 'There might be your ads' : title;
    descriptionOfReport = typeof (description) === 'undefiened' ? '' : description;
    if ((typeof (source) !== 'undefined') && (typeof (dest) !== 'undefined')) {
        createReport(source, dest, titleOfReport, descriptionOfReport);
    } else {
        throw new Error('The parameters [source] and [dest] are supposed to be sent');
    }
};

module.exports = { create }
