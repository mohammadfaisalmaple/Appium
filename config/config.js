// config/config.js
module.exports = {
    desiredCaps: {
        platformName: 'Android',
        deviceName: 'emulator-5554',
        appPackage: 'com.whatsapp',
        appActivity: 'com.whatsapp.HomeActivity',
        automationName: 'UiAutomator2',
        noReset: true,
        fullReset: false
    }
};