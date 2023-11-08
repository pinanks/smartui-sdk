#!/usr/bin/env node

import commander from './commander/commander.js'
import getEnv from './lib/env.js'

let env = getEnv();
commander.parse();
// console.log('here', commander.opts().config);