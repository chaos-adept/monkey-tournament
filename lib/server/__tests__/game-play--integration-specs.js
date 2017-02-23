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

const loginVkUser = async (driver, localServerUrl, user) => {
    driver.get(localServerUrl);
    driver.wait(until.titleContains('ВКонтакте'), 3000);
    let userNameInput = await driver.findElement(By.css("input[name='email']"));
    userNameInput.clear();
    userNameInput.sendKeys(user.name);
    const passwordInput = await driver.findElement(By.css("input[name='pass']"));
    passwordInput.clear();
    passwordInput.sendKeys(user.password);

    const submit = await driver.findElement(By.css("#install_allow"));
    submit.click();

    const title = await driver.getTitle();
    title.should.eq('Index');
};

const getUserFromEnvParams = () => {
    const name = process.env.VK_AUTH_LOGIN;
    const password = process.env.VK_AUTH_PASSWORD;
    expect(name, 'process.env.VK_AUTH_LOGIN').be.ok;
    expect(password, 'process.env.VK_AUTH_PASSWORD').be.ok;

    return {name, password}
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

            await loginVkUser(driver, localServerUrl, getUserFromEnvParams());
            driver.wait(until.elementIsVisible(driver.findElement(By.css(`[data-sid='game-result-list']`))));
        } finally {
            driver.quit();
        }
    })
});


