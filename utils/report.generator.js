'use strict';

const { getFeaturesLists, getResults, replacer } = require('./helper.js');
const blank = require('../data/blank.data.json');

/**
 * Forms and returns a snippet of the head html as a string
 * @param  {string} title A string as a title of the html - reporter
 * @returns {string} a snippet of the head html as a string
 */
function getHead(title) {
    return replacer(blank.head.join('\n'),{'#title': title, '#styles': blank.styles.join('\n')}, 'gi');
}

/**
 * Forms and returns a snippet of the body html as a string
 * @param  {string} data A path to cucumber [reporter.json] file
 * @param  {string} dest A path to file.html where will be save the html - reporter
 * @param  {string} title A string as a title of the html - reporter
 * @param  {string} description Any descriptions if they are needed
 * @returns {string} a snippet of the body html as a string
 */
async function getBody(data, title, description, dest) {
    return await getHeader(data, title) + await getMain(data, description, dest) + await getFooter();
}

/**
 * Forms and returns a snippet of the header of a body html as a string
 * @param  {string} data A path to cucumber [reporter.json] file
 * @param  {string} title A string as a title of the html - reporter
 * @returns {string} a snippet of the header html as a string
 */
async function getHeader(data, title) {
    const statistics = await getResults(data);
    return replacer(blank.body.header.join('\n'), {
        '#title': title,
        '#passedAmount': statistics['passed'],
        '#failedAmount': statistics['failed'],
        '#skippedAmount': statistics['skipped']
    }, 'gi');
}

/**
 * Forms and returns a snippet of the main of a body html as a string
 * @param  {string} data A path to cucumber [reporter.json] file
 * @param  {string} dest A path to file.html where will be save the html - reporter
 * @param  {string} description Any descriptions if they are needed
 * @returns {string} a snippet of the main of a body html as a string
 */
async function getMain(data, description, dest) {
    const lists = await getFeaturesLists(data, dest);
    return replacer(blank.body.main.join('\n'), {
        '#description': description,
        '#allFeaturesList': lists['all'].join('\n'),
        '#passedFeaturesList': lists['passed'].join('\n'),
        '#failedFeaturesList': lists['failed'].join('\n')
    }, 'gi');
}

/**
 * Forms and returns a snippet of the footer as a string
 * @returns {string} returns footer as a string
 */
function getFooter() {
    return replacer(blank.body.footer.join('\n'),{'#date': new Date()}, 'gi');
}

/** 
 * Forms and returns an html page as a string
 * @param  {string} data A path to cucumber [reporter.json] file
 * @param  {string} dest A path to file.html where will be save the html - reporter
 * @param  {string} title A string as a title of the html - reporter
 * @param  {string} description Any descriptions if they are needed
 * @returns {string} html report as a string
 */
async function getReport(data, title, description, dest) {
    return replacer(blank.html,
        {'#head': await getHead(title), '#body': await getBody(data, title, description, dest)}, 'gi');
}

module.exports = { getReport }