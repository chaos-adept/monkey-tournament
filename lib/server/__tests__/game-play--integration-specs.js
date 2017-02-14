import {startServer} from './../server';
import Promise from 'bluebird';
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
var fs = require("fs");
var path = require('path');
let expect = require('chai').expect;
let should = require('chai').should();
var baseHttpPort = 3000;

const loginVkUser = async (driver, localServerUrl, user_name, user_password) => {
    driver.get(localServerUrl);

    await driver.wait(async _ => (await driver.getCurrentUrl()).includes('vk.com'), 20000);

    let userNameInput = await driver.findElement(By.css("[name='email']"));
    userNameInput.clear();
    userNameInput.sendKeys(user_name);

    const passwordInput = await driver.findElement(By.css("[name='pass']"));
    passwordInput.clear();
    passwordInput.sendKeys(user_password);

    const submit = await driver.findElement(By.css("#install_allow"));
    submit.click();

    console.log('start');
    await driver.wait(async _ => (await driver.getTitle()).includes('Index'), 20000);
    console.log('complited');
    const appName = await driver.findElement(By.css('h1'));
    throw {};
    console.log(appName);
    appName.should.eq('Monkey');
};

const getPlayerEmail = async (driver) => {
    return driver.findElement(By.xpath(".//*[starts-with(@data-sid, 'player-name')]")).getText();
};

describe("Integration login actions", () => {
    let httpPort;
    let localServerUrl;
    let server;
    let localServerSocketIOClientUrl;
    let localServerLoginUrl;
    beforeEach(() => {
        httpPort = baseHttpPort;
        localServerUrl = `http://localhost:${httpPort}`;
        localServerSocketIOClientUrl = `http://localhost:${httpPort}/socket.io/socket.io.js`;
        localServerLoginUrl = `http://localhost:${httpPort}/login`;
        server = startServer({httpPort});
    });

    afterEach(() => {
        server.shutdown();
    });

    it.skip("should login players over vk", async function () {
        this.timeout(25000);
        let driver1 = new webdriver.Builder()
            .forBrowser('chrome')
            .build();

        driver1.manage().deleteAllCookies();

        const user_name = process.env.VK_AUTH_LOGIN;
        const user_password = process.env.VK_AUTH_PASSWORD;
        const user_displayName = process.env.VK_DISPLAY_NAME;
        expect(user_name, 'process.env.VK_AUTH_LOGIN').be.ok;
        expect(user_password, 'process.env.VK_AUTH_PASSWORD').be.ok;
        expect(user_displayName, 'process.env.VK_DISPLAY_NAME').be.ok;

        try {
            await loginVkUser(driver1, localServerUrl, user_name, user_password);

            const player1Email = await getPlayerEmail(driver1);
            player1Email.should.eq(user_displayName);
        } finally {
            driver1.quit();
        }
    })
});


