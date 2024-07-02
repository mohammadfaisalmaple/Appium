const wd = require('wd');
const { exec } = require('child_process');
const path = require('path');

const driver = wd.promiseChainRemote({
    host: 'localhost',
    port: 4723
});

const desiredCaps = {
    platformName: 'Android',
    deviceName: 'emulator-5554',
    appPackage: 'com.whatsapp',
    appActivity: 'com.whatsapp.HomeActivity',
    automationName: 'UiAutomator2',
    noReset: true,
    fullReset: false
};

const apkPath = path.resolve(__dirname, 'apk/whatsapp.apk'); // Path to the APK file
const latitude = 37.0902;
const longitude = -95.7129;
const phoneNumber = '7204278336'; // Variable mobile number

async function installApp() {
    return new Promise((resolve, reject) => {
        exec(`adb install -r ${apkPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error installing APK: ${stderr}`);
                reject(error);
            } else {
                console.log(`APK installed successfully: ${stdout}`);
                resolve(stdout);
            }
        });
    });
}

async function setGeoLocation() {
    return new Promise((resolve, reject) => {
        exec(`adb -s emulator-5554 emu geo fix ${longitude} ${latitude}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error setting geo-location: ${stderr}`);
                reject(error);
            } else {
                console.log(`Geo-location set successfully: ${stdout}`);
                resolve(stdout);
            }
        });
    });
}

async function main() {
    try {
        // Install the app
        await installApp();
        
        // Set geo-location
        await setGeoLocation();
        
        // Initialize the driver
        await driver.init(desiredCaps);
        
        // Wait for the app to load
        await driver.sleep(10000);

        // Wait for and click the first element using XPath
        await driver.waitForElementByXPath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout/android.widget.ListView/android.widget.LinearLayout[1]', 10000);
        const el5 = await driver.elementByXPath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout/android.widget.ListView/android.widget.LinearLayout[1]');
        await el5.click();
        console.log('First element clicked successfully!');

        // Wait for and click the second element by ID
        await driver.waitForElementById('com.whatsapp:id/eula_accept', 10000);
        const el6 = await driver.elementById('com.whatsapp:id/eula_accept');
        await el6.click();
        console.log('Second element clicked successfully!');

        // Wait for and enter the phone number
        await driver.waitForElementById('com.whatsapp:id/registration_phone', 10000);
        const el7 = await driver.elementById('com.whatsapp:id/registration_phone');
        await el7.sendKeys(phoneNumber);
        console.log('Phone number entered successfully!');

        // Wait for and click the submit button
        await driver.waitForElementById('com.whatsapp:id/registration_submit', 10000);
        const el8 = await driver.elementById('com.whatsapp:id/registration_submit');
        await el8.click();
        console.log('Submit button clicked successfully!');

        // Wait for and click the OK button
        await driver.waitForElementById('android:id/button1', 10000);
        const el9 = await driver.elementById('android:id/button1');
        await el9.click();
        console.log('OK button clicked successfully!');
        
        // Keeping the app open by not quitting the driver
        // await driver.quit();
    } catch (err) {
        console.error(err);
        await driver.quit();
    }
}

main();
