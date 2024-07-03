const wd = require('wd');
const { exec } = require('child_process');
const path = require('path');
const logger = require('../logger');

const driver = wd.promiseChainRemote({
    host: 'localhost',
    port: 4723
});

const apkPath = path.resolve(__dirname, '../apk/whatsapp.apk'); // Path to the APK file
const latitude = 37.0902;
const longitude = -95.7129;
// this phone number WithOutCountryCode 
const phoneNumber = '97204278336'; // Variable mobile number with country code 
const network='Northstar';
const iso='us'; 
const mccmnc='310670'; //united states




async function setSimProperties(emulatorPort) {


    try {

        //root access
        await execCommand(`adb -s emulator-${emulatorPort} root`);

        // Set gsm.sim.operator.alpha
        await execCommand(`adb -s emulator-${emulatorPort} shell setprop gsm.sim.operator.alpha "${network}"`);

        // Set gsm.operator.alpha
        await execCommand(`adb -s emulator-${emulatorPort} shell setprop gsm.operator.alpha "${network}"`);

        // Set gsm.sim.operator.iso-country
        await execCommand(`adb -s emulator-${emulatorPort} shell setprop gsm.sim.operator.iso-country "${iso}"`);

        // Set gsm.operator.iso-country
        await execCommand(`adb -s emulator-${emulatorPort} shell setprop gsm.operator.iso-country "${iso}"`);

        // Set gsm.sim.operator.numeric
        await execCommand(`adb -s emulator-${emulatorPort} shell setprop gsm.sim.operator.numeric "${mccmnc}"`);

        // Set gsm.operator.numeric
        await execCommand(`adb -s emulator-${emulatorPort} shell setprop gsm.operator.numeric "${mccmnc}"`);

    } catch (error) {
        logger.error(`Error setting SIM properties: ${error.message}`);
        throw error;
    }
}

async function execCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                logger.error(`Error executing command ${command}: ${stderr}`);
                reject(error);
            } else {
                logger.info(`Command executed successfully: ${stdout}`);
                resolve(stdout);
            }
        });
    });
}

async function installAppAndSetSimProperties(emulatorPort) {
    try {

        // Set SIM properties based on parsed phone number and emulator port
        // await setSimProperties(emulatorPort);

        // Install the app
        await exec(`adb -s emulator-${emulatorPort} install -r ${apkPath}`);

        logger.info(`APK installed successfully`);
    } catch (error) {
        logger.error(`Error installing APK: ${error.message}`);
        throw error;
    }
}

async function setGeoLocation(emulatorPort) {
    return new Promise((resolve, reject) => {
        exec(`adb -s emulator-${emulatorPort} emu geo fix ${longitude} ${latitude}`, (error, stdout, stderr) => {
            if (error) {
                logger.error(`Error setting geo-location: ${stderr}`);
                reject(error);
            } else {
                logger.info(`Geo-location set successfully: ${stdout}`);
                resolve(stdout);
            }
        });
    });
}

async function initializeDriver(desiredCaps) {
    try {
        await driver.init(desiredCaps);
        await driver.sleep(10000);
    } catch (error) {
        logger.error(`Error initializing driver: ${error.message}`);
        throw error;
    }
}

async function clickElementByXPath(xpath) {
    try {
        await driver.waitForElementByXPath(xpath, 10000);
        const element = await driver.elementByXPath(xpath);
        await element.click();
    } catch (error) {
        logger.error(`Error clicking element: ${error.message}`);
        throw error;
    }
}

async function clickElementById(id) {
    try {
        await driver.waitForElementById(id, 10000);
        const element = await driver.elementById(id);
        await element.click();
    } catch (error) {
        logger.error(`Error clicking element: ${error.message}`);
        throw error;
    }
}

async function enterPhoneNumber(emulatorPort) {
    try {


        // Send only the national number without country code
        await driver.waitForElementById('com.whatsapp:id/registration_phone', 10000);
        const element = await driver.elementById('com.whatsapp:id/registration_phone');
        await element.sendKeys(phoneNumber);

        logger.info(`Phone number entered successfully: ${phoneNumber}`);
    } catch (error) {
        logger.error(`Error entering phone number: ${error.message}`);
        throw error;
    }
}

async function quitDriver() {
    try {
        await driver.quit();
    } catch (error) {
        logger.error(`Error quitting driver: ${error.message}`);
        throw error;
    }
}


async function checkElementById(elementId, timeout = 0) {
    const startTime = Date.now();
    while ((Date.now() - startTime) < timeout) {
        try {
            const element = await driver.findElement('id', elementId);
            if (element) {
                return true; // Return true if the element is found
            }
        } catch (error) {
            // Element not found, continue waiting
        }
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for 500ms before checking again
    }
    return false; // Return false if the element is not found within the timeout
}

module.exports = {
    installAppAndSetSimProperties,
    setGeoLocation,
    initializeDriver,
    clickElementByXPath,
    clickElementById,
    enterPhoneNumber,
    quitDriver,
    checkElementById
};
