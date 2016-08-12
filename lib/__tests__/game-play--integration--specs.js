import {startServer} from './../server';
import Promise from 'bluebird';
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
var fs = require("fs");
var path = require('path');
let expect = require('chai').expect;

var baseHttpPort = 3000;
var indexHtmlFile = path.resolve(__dirname, '../../static/login.html');
var socketIOClientFile = path.resolve(__dirname, '../../node_modules/socket.io-client/socket.io.js');

const loginUser = async (driver, localServerUrl, username, password) => {
    driver.get(localServerUrl);
    var userNameInput = await driver.findElement(By.xpath(".//*[starts-with(@data-sid, 'username')]"));
    userNameInput.clear();
    userNameInput.sendKeys(username);

    var passwordInput = await driver.findElement(By.xpath(".//*[starts-with(@data-sid, 'password')]"));
    passwordInput.clear();
    passwordInput.sendKeys(password);


    var submit = await driver.findElement(By.xpath(".//*[starts-with(@data-sid, 'submit')]"));
    submit.click();

    await driver.wait(async () => {
        var title = await driver.getTitle();
        return 'Game' === title;
    }, 10000);

    var title = await driver.getTitle();
    title.should.eq('Game');
};

const loginVkUser = async (driver, localServerUrl, user_name, user_password) => {
    driver.get(localServerUrl);
    const navToVKAuth = await driver.findElement(By.xpath(".//*[starts-with(@data-sid, 'login-vk-submit')]"));
    navToVKAuth.click();

    await driver.wait(async () => {
        var url = await driver.getCurrentUrl();
        return url.includes('vk.com');
    }, 20000);



    var userNameInput = await driver.findElement(By.css("input.form_input:nth-child(7)"));
    userNameInput.clear();
    userNameInput.sendKeys(user_name);

    var passwordInput = await driver.findElement(By.css("input.form_input:nth-child(9)"));
    passwordInput.clear();
    passwordInput.sendKeys(user_password);

    var submit = await driver.findElement(By.css("#install_allow"));
    submit.click();

    await driver.wait(async () => {
        var title = await driver.getTitle();
        return 'Game' === title;
    }, 10000);

    var title = await driver.getTitle();
    title.should.eq('Game');
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

    it("should login players", async function () {
        this.timeout(25000);
        let driver1 = new webdriver.Builder()
            .forBrowser('firefox')
            .build();


        let driver2 = new webdriver.Builder()
            .forBrowser('firefox')
            .build();
        driver1.manage().deleteAllCookies();
        driver2.manage().deleteAllCookies();

        try {
            await Promise.all([
                loginUser(driver2, localServerUrl, 'jack', 'secret'),
                loginUser(driver1, localServerUrl, 'jill', 'birthday')]);
            const player2Email = await getPlayerEmail(driver2);
            player2Email.should.eq('jack@example.com');

            const player1Email = await getPlayerEmail(driver1);
            player1Email.should.eq('jill@example.com');
        } finally {
            driver1.quit();
            driver2.quit();
        }
    });

    it("should login players over vk", async function () {
        this.timeout(25000);
        let driver1 = new webdriver.Builder()
            .forBrowser('firefox')
            .build();

        driver1.manage().deleteAllCookies();

        const user_name = process.env.VK_AUTH_LOGIN;
        const user_password = process.env.VK_AUTH_PASSWORD;
        expect(user_name, 'process.env.VK_AUTH_LOGIN').be.ok;
        expect(user_password, 'process.env.VK_AUTH_PASSWORD').be.ok;

        try {
            await Promise.all([
                loginVkUser(driver1, localServerUrl, user_name, user_password)]);

            const player1Email = await getPlayerEmail(driver1);
            player1Email.should.eq('jill@example.com');
        } finally {
            driver1.quit();
        }
    })
});


