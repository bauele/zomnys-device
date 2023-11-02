require('dotenv').config();
var fs = require('fs');
var fs_promises = require('fs/promises');

//  File names for required .env files
const ROOT_ENV = '.env';
const ROOT_ENV_EXAMPLE = 'example.env';
const CLIENT_ENV = 'client\\.env';
const CLIENT_ENV_EXAMPLE = 'client\\example.env';

//  Attempt to access the targetFile. If unsuccessful, file does
//  not exist and exampleFile will be copied into new targetFile
async function createEnvIfNotExists(
    targetFile,
    exampleFile,
    notExistsCallback = null,
) {
    if (!fs.existsSync(targetFile)) {
        console.log(`${targetFile} does not exist. Creating...`);

        try {
            await fs_promises.copyFile(exampleFile, targetFile);
            console.log(`${targetFile} created from ${exampleFile}`);

            //  If callback was specified, call it
            if (notExistsCallback) {
                notExistsCallback();
            }
        } catch (e) {
            console.error(`${exampleFile} could not be copied: ${e} \n`);
        }
    }
}

//  Create the required files if not already present
(async () => {
    await createEnvIfNotExists(ROOT_ENV, ROOT_ENV_EXAMPLE, () => {
        //  If the .env did not already exist, then create
        //  the default directory for the database files
        if (!fs.existsSync('./server/data')) {
            console.log(`./server/data does not exist. Creating...`);
            fs.mkdirSync('./server/data');
            console.log(`./server/data created`);
        }
    });
    await createEnvIfNotExists(CLIENT_ENV, CLIENT_ENV_EXAMPLE);
})();
