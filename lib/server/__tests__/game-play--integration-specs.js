import {startServer, cleanData} from './../server';
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
    driver.wait(until.elementLocated(By.css("input[name='email']")), 3000);
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

const getDriver = () => {
    return new webdriver.Builder()
        .forBrowser('chrome')
        .build();
};

const enterAttempt = async (driver, value) => {
    await driver.wait(until.elementIsVisible(driver.findElement(By.css(`[data-sid='add-attempt-btn']`))));
    driver.findElement(By.css(`[data-sid='add-attempt-btn']`)).click();

    const enterAttemptInput = `input[name=attempt-amount-input]`;
    const inputEl = await driver.findElement(By.css(enterAttemptInput));
    driver.wait(until.elementIsVisible(inputEl));
    inputEl.clear();
    inputEl.sendKeys(value);
    await driver.findElement(By.css(`[data-sid='confirm-attempt-btn']`)).click();
};

describe("Integration login actions", () => {
    let httpPort;
    let localServerUrl;
    let server;
    let driver = getDriver();
    let localServerSocketIOClientUrl;
    let localServerLoginUrl;
    let envUser;

    before(async () => {
        httpPort = baseHttpPort;
        localServerUrl = `http://localhost:${httpPort}`;
        localServerSocketIOClientUrl = `http://localhost:${httpPort}/socket.io/socket.io.js`;
        localServerLoginUrl = `http://localhost:${httpPort}/login`;
        server = startServer({httpPort});
        await server.cleanData();
        envUser = getUserFromEnvParams()
    });

    after(() => {
        server && server.shutdown(false);
        driver && driver.quit();
    });

    it("should login players over vk", async () => {
        //when
        await loginVkUser(driver, localServerUrl, envUser);
        //then
        const resultListEl = await driver.findElement(By.css(`[data-sid='game-result-list']`));
        await driver.wait(until.elementIsVisible(resultListEl));
    });

    it("should log attempt", async () => {
        //when
        await enterAttempt(driver, '12');
        //when
        const scoreElSelector = `[data-sid="game-result-list"] [data-sid="score-list-item"] [data-sid="score-value"]`;
        await driver.wait(until.elementLocated(By.css(scoreElSelector)), 1000);
        await driver.wait(until.elementTextIs(driver.findElement(By.css(scoreElSelector)), '12'), 1000);
    });

});


