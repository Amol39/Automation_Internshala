const puppeteer = require('puppeteer');
const { id, pass } = require('./secret');
const dataFile = require('./data');

async function main() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });

    const tab = (await browser.pages())[0];
    await tab.goto('https://internshala.com/');

    // Wait for and click the login button
    try {
        console.log('Waiting for login button...');
        await tab.waitForSelector('#modal_login_submit', { visible: true, timeout: 60000 });
        console.log('Login button found.');
        await tab.click('#modal_login_submit');
    } catch (error) {
        console.error('Error finding or clicking the login button:', error);
        await browser.close();
        return;
    }

    // Log in to Internshala
    try {
        await tab.waitForSelector('#modal_email', { visible: true });
        await tab.type('#modal_email', id);
        await tab.type('#modal_password', pass);
        await tab.click('#modal_login_submit');
        await tab.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
    } catch (error) {
        console.error('Error during login process:', error);
        await browser.close();
        return;
    }

    // Navigate to the profile options and get application URLs
    try {
        await tab.click('.nav-link.dropdown-toggle.profile_container .is_icon_header.ic-24-filled-down-arrow');
        await tab.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
        
        let profileOptions = await tab.$$('.profile_options a');
        let appUrls = [];
        for (let i = 0; i < profileOptions.length; i++) {
            let url = await tab.evaluate(ele => ele.getAttribute('href'), profileOptions[i]);
            appUrls.push(url);
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
        await tab.goto('https://internshala.com' + appUrls[1], { waitUntil: 'networkidle2', timeout: 60000 });

        // Fill graduation details
        await tab.waitForSelector('#graduation-tab .ic-16-plus', { visible: true });
        await tab.click('#graduation-tab .ic-16-plus');
        await graduation(dataFile[0]);

        await new Promise(resolve => setTimeout(resolve, 1000));
        await tab.waitForSelector('.next-button', { visible: true });
        await tab.click('.next-button');

        // Fill training details
        await training(dataFile[0]);

        await new Promise(resolve => setTimeout(resolve, 1000));
        await tab.waitForSelector('.next-button', { visible: true });
        await tab.click('.next-button');

        // Skip additional details
        await tab.waitForSelector('.btn.btn-secondary.skip.skip-button', { visible: true });
        await tab.click('.btn.btn-secondary.skip.skip-button');

        // Add work sample link
        await workSample(dataFile[0]);

        await new Promise(resolve => setTimeout(resolve, 1000));
        await tab.waitForSelector('#save_work_samples', { visible: true });
        await tab.click('#save_work_samples');

        // Apply to internships
        await application(dataFile[0]);
    } catch (error) {
        console.error('Error during application process:', error);
    } finally {
        await browser.close();
    }
}

async function graduation(data) {
    await tab.waitForSelector('#degree_completion_status_pursuing', { visible: true });
    await tab.click('#degree_completion_status_pursuing');

    await tab.waitForSelector('#college', { visible: true });
    await tab.type('#college', data['College']);

    await tab.waitForSelector('#start_year_chosen', { visible: true });
    await tab.click('#start_year_chosen');
    await tab.waitForSelector(".active-result[data-option-array-index='5']", { visible: true });
    await tab.click(".active-result[data-option-array-index='5']");

    await tab.waitForSelector('#end_year_chosen', { visible: true });
    await tab.click('#end_year_chosen');
    await tab.waitForSelector("#end_year_chosen .active-result[data-option-array-index='6']", { visible: true });
    await tab.click("#end_year_chosen .active-result[data-option-array-index='6']");

    await tab.waitForSelector('#degree', { visible: true });
    await tab.type('#degree', data['Degree']);

    await tab.waitForSelector('#stream', { visible: true });
    await tab.type('#stream', data['Stream']);

    await tab.waitForSelector('#performance-college', { visible: true });
    await tab.type('#performance-college', data['Percentage']);

    await tab.click('#college-submit');
}

async function training(data) {
    await tab.waitForSelector('.experiences-tabs[data-target="#training-modal"] .ic-16-plus', { visible: true });
    await tab.click('.experiences-tabs[data-target="#training-modal"] .ic-16-plus');

    await tab.waitForSelector('#other_experiences_course', { visible: true });
    await tab.type('#other_experiences_course', data['Training']);

    await tab.waitForSelector('#other_experiences_organization', { visible: true });
    await tab.type('#other_experiences_organization', data['Organization']);

    await tab.click('#other_experiences_location_type_label');

    await tab.click('#other_experiences_start_date');
    await tab.waitForSelector('.ui-state-default[href="#"]', { visible: true });
    let date = await tab.$$('.ui-state-default[href="#"]');
    await date[0].click();
    await tab.click('#other_experiences_is_on_going');

    await tab.waitForSelector('#other_experiences_training_description', { visible: true });
    await tab.type('#other_experiences_training_description', data['description']);

    await tab.click('#training-submit');
}

async function workSample(data) {
    await tab.waitForSelector('#other_portfolio_link', { visible: true });
    await tab.type('#other_portfolio_link', data['link']);
}

async function application(data) {
    await tab.goto('https://internshala.com/the-grand-summer-internship-fair', { waitUntil: 'networkidle2', timeout: 60000 });

    await tab.waitForSelector('.btn.btn-primary.campaign-btn.view_internship', { visible: true });
    await tab.click('.btn.btn-primary.campaign-btn.view_internship');

    await new Promise(resolve => setTimeout(resolve, 2000));
    await tab.waitForSelector('.view_detail_button', { visible: true });
    let details = await tab.$$('.view_detail_button');
    let detailUrl = [];
    for (let i = 0; i < 3; i++) {
        let url = await tab.evaluate(ele => ele.getAttribute('href'), details[i]);
        detailUrl.push(url);
    }

    for (let i of detailUrl) {
        await apply(i, data);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

async function apply(url, data) {
    await tab.goto('https://internshala.com' + url, { waitUntil: 'networkidle2', timeout: 60000 });

    await tab.waitForSelector('.btn.btn-large', { visible: true });
    await tab.click('.btn.btn-large');

    await tab.waitForSelector('#application_button', { visible: true });
    await tab.click('#application_button');

    await tab.waitForSelector('.textarea.form-control', { visible: true });
    let ans = await tab.$$('.textarea.form-control');

    for (let i = 0; i < ans.length; i++) {
        if (i == 0) {
            await ans[i].type(data['hiringReason']);
        } else if (i == 1) {
            await ans[i].type(data['availability']);
        } else {
            await ans[i].type(data['rating']);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await tab.click('.submit_button_container');
}

main();
