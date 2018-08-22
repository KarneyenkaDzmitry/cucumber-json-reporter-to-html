'use strict';
const builder = require('./utils/builder');
let pathToJsonReport, pathTostoreHtmlReport, titleOfReport, descriptionOfReport;
function create( source, dest, title, description ) {
    if (typeof (source) !== 'string') return new Error('variable [source] have to be a string')
    if (typeof (dest) !== 'string') return new Error('variable [dest] have to be a string')
    titleOfReport = typeof (title) === 'undefiened' ? 'There might be your ads' : title;
    descriptionOfReport = typeof (description) === 'undefiened' ? '' : description;
    if ((typeof (source) !== 'undefined') && (typeof (dest) !== 'undefined')) {
        
        console.log(source, dest, titleOfReport, descriptionOfReport);
        builder.createReport(source, dest, titleOfReport, descriptionOfReport);
    } else {
        return new Error('The parameters [source] and [dest] are supposed to be sent');
    }
};

module.exports = { create }
