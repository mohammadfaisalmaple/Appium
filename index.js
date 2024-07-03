const { runApp } = require('./controllers/appController');

async function startApp() {
    try {
        await runApp();
        console.log('Application run completed successfully.');
    } catch (error) {
        console.error('Error running application:', error);
    }
}

startApp();