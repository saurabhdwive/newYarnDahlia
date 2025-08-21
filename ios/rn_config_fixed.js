#!/usr/bin/env node
const { execFileSync } = require('child_process');
const path = require('path');

function getCliConfig() {
    const out = execFileSync('node', ['-e', "process.argv=['','','config'];require('@react-native-community/cli').run()"], { encoding: 'utf8' });
    return JSON.parse(out);
}

function normalizePodspecPaths(config) {
    const iosSourceDir = config?.project?.ios?.sourceDir || process.cwd();
    const deps = config?.dependencies || {};
    for (const pkgName of Object.keys(deps)) {
        const pkg = deps[pkgName];
        const ios = pkg?.platforms?.ios;
        if (!ios) continue;
        const podspecPath = ios.podspecPath;
        if (typeof podspecPath === 'string' && !path.isAbsolute(podspecPath)) {
            ios.podspecPath = path.resolve(iosSourceDir, podspecPath);
        }
    }
    return config;
}

try {
    const cfg = getCliConfig();
    const fixed = normalizePodspecPaths(cfg);
    process.stdout.write(JSON.stringify(fixed));
} catch (e) {
    console.error(e.stack || String(e));
    process.exit(1);
}


