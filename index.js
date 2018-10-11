'use strict';

const {createReport} = require('./utils/report.maker');
let titleOfReport, descriptionOfReport;

function create( source, dest, title, description ) {
    if (typeof (source) !== 'string') throw new Error('variable [source] have to be a string')
    if (typeof (dest) !== 'string') throw new Error('variable [dest] have to be a string')
    titleOfReport = typeof (title) === 'undefiened' ? 'There might be your ads' : title;
    descriptionOfReport = typeof (description) === 'undefiened' ? '' : description;
    if ((typeof (source) !== 'undefined') && (typeof (dest) !== 'undefined')) {
        createReport(source, dest, titleOfReport, descriptionOfReport);
    } else {
        return new Error('The parameters [source] and [dest] are supposed to be sent');
    }
};

module.exports = { create }
