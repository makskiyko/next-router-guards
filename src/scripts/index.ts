#!/usr/bin/env node
import 'reflect-metadata';
import {container} from 'tsyringe';

import {App} from './app.class';

const app = container.resolve(App);
app.start();
