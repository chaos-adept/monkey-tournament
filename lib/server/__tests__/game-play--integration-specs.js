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
    await driver.wait(until.titleContains('ВКонтакте'), 3000);
    let userNameInput = await driver.findElement(By.css("input[name='email']"));
    userNameInput.clear();
    userNameInput.sendKeys(user_name);
    const passwordInput = await driver.findElement(By.css("input[name='pass']"));
    passwordInput.clear();
    passwordInput.sendKeys(user_password);

    const submit = await driver.findElement(By.css("#install_allow"));
    submit.click();

    const title = await driver.getTitle();
    title.should.eq('Index');
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
        server.shutdown(false);
    });

    it("should login players over vk", async () => {
        const driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();
        try {
            driver.manage().deleteAllCookies();

            const user_name = process.env.VK_AUTH_LOGIN;
            const user_password = process.env.VK_AUTH_PASSWORD;
            expect(user_name, 'process.env.VK_AUTH_LOGIN').be.ok;
            expect(user_password, 'process.env.VK_AUTH_PASSWORD').be.ok;

            await loginVkUser(driver, localServerUrl, user_name, user_password);
            driver.wait(until.elementIsVisible(driver.findElement(By.css(`[data-sid='game-result-list']`))));
        } finally {
            driver.quit();
        }
    })
});


