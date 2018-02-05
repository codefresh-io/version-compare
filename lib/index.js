#!/usr/bin/env node

const debug = require('debug')('index')

const PATCH = 'PATCH';
const MINOR = 'MINOR';
const MAJOR = 'MAJOR';


const exitOnFailure = () => {
    debug('\nFailure');
    process.exit(1);
};

const exitOnSuccess = () => {
    debug('\nSuccess');
    process.exit(0);
};

const disallow = (newV, oldV, type) => {
    //debug(`comparing disallow ${newV}, ${oldV}`);
    if (newV > oldV) {
        debug(`New ${type} is higher than old ${type} ==> Failure`);
        exitOnFailure();
    } else if (newV < oldV) {
        debug(`New ${type} is less than old ${type} ===> Failure`);
        exitOnFailure();
    } else {
        debug(`${type} version are equal`);
    }
};

const allow = (newV, oldV, type, allowEqual) => {
    //debug(`comparing allow ${newV}, ${oldV}`);
    if (newV === oldV + 1) {
        debug(`New ${type} has been incremented by 1`);
        exitOnSuccess();
    } else {
        if (newV < oldV) {
            debug(`New ${type} is less than old ${type} ==> Failure`);
            exitOnFailure();
        } else if (newV > oldV) {
            debug(`New ${type} is higher than old ${type} ===> Failure`);
            exitOnFailure();
        }
        else {
            if (allowEqual) {
                debug(`${type} versions are equal`);
            } else {
                debug(`${type} versions has not changed ==> Failure`);
                exitOnFailure();
            }
        }
    }
};

require('yargs')
    .command('compare <old-version> <new-version>', 'welcome ter yargs!', (yargs) => {
        yargs
            .positional('old-version', {
                type: 'string',
                describe: 'Old version'
            })
            .positional('new-version', {
                type: 'string',
                describe: 'New Version'
            })
            .option('strategy', {
                type: 'string',
                alias: 's',
                describe: 'Compare allowance strategy',
                choices: [PATCH, MINOR, MAJOR],
                default: PATCH
            })
    }, function (argv) {
        const oldVersion = argv['old-version'].replace('v', '');
        const newVersion = argv['new-version'].replace('v', '');
        const strategy   = argv['strategy'];

        let [oldMajor, oldMinor, oldPatch] = oldVersion.split('.');
        let [newMajor, newMinor, newPatch] = newVersion.split('.');

        oldMajor = parseInt(oldMajor);
        oldMinor = parseInt(oldMinor);
        oldPatch = parseInt(oldPatch);
        newMajor = parseInt(newMajor);
        newMinor = parseInt(newMinor);
        newPatch = parseInt(newPatch);

        debug(`Old Version: ${oldMajor},${oldMinor},${oldPatch} (major: ${oldMajor}, minor: ${oldMinor}, patch: ${oldPatch})`);
        debug(`New Version: ${newMajor},${newMinor},${newPatch} (major: ${newMajor}, minor: ${newMinor}, patch: ${newPatch})`);
        debug('');

        if (strategy === MAJOR) {
            allow(newMajor, oldMajor, MAJOR, true);
        } else {
            disallow(newMajor, oldMajor, MAJOR);
        }

        if (strategy === MINOR) {
            allow(newMinor, oldMinor, MINOR, true);
        } else {
            disallow(newMinor, oldMinor, MINOR);
        }

        allow(newPatch, oldPatch, PATCH);

        debug('\nSuccess');
        process.exit(0);

    })
    .help()
    .argv;
