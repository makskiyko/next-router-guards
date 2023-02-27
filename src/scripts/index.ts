#!/usr/bin/env node
import 'reflect-metadata';
import {container, Lifecycle} from 'tsyringe';

import {App} from './data';
import {Inquirer} from './shared';

container.register(Inquirer, {useClass: Inquirer}, {lifecycle: Lifecycle.Singleton});
const app = container.resolve(App);
app.start();
