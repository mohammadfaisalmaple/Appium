const { desiredCaps } = require('../config/config');
const appModel = require('../models/appModel');
const logger = require('../logger');

async function runApp() {
    try {
        const emulatorPort = desiredCaps.deviceName.split('-')[1];

        // Install the app and set SIM properties
        await appModel.installAppAndSetSimProperties(emulatorPort);

        // Set geo-location
        await appModel.setGeoLocation(emulatorPort);

        // Initialize the driver
        await appModel.initializeDriver(desiredCaps);

        // Click elements and perform actions
        await appModel.clickElementByXPath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout/android.widget.ListView/android.widget.LinearLayout[1]');
        logger.info('First element clicked successfully!');

        await appModel.clickElementById('com.whatsapp:id/eula_accept');
        logger.info('Second element clicked successfully!');

        await appModel.enterPhoneNumber(emulatorPort); // Pass emulatorPort to enterPhoneNumber
        logger.info('Phone number entered successfully!');

        await appModel.clickElementById('com.whatsapp:id/registration_submit');
        logger.info('Submit button clicked successfully!');

        // Check if the specified element exists within 5 seconds
        const elementExists = await appModel.checkElementById('f8a1eeb4-cae2-4667-a01e-5184eacf3684', 5000);
        if (elementExists) {
            logger.error('Failed activation: phone activation not correct');
            await appModel.quitDriver();
            return;
        }

        await appModel.clickElementById('android:id/button1');
        logger.info('OK button clicked successfully!');
        
    } catch (error) {
        logger.error(error.message);
        await appModel.quitDriver();
    }
}

module.exports = {
    runApp
};
