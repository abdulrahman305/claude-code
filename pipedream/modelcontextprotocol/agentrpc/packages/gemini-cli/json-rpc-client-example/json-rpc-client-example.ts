/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.n * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createClient } from '../sdk-node/src/create-client';
import { AgentRPC } from '../sdk-node/src/agentrpc';
import { Machine } from '../sdk-node/src/contract';
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

const client = createClient();

const machine: Machine = {
  name: 'json-rpc-client-example',
  description: 'A simple example of a JSON-RPC client',
  functions: [
    {
      name: 'add',
      description: 'Adds two numbers together',
      parameters: {
        type: 'object',
        properties: {
          a: { type: 'number' },
          b: { type: 'number' },
        },
        required: ['a', 'b'],
      },
      returns: { type: 'number' },
    },
    {
      name: 'subtract',
      description: 'Subtracts two numbers',
      parameters: {
        type: 'object',
        properties: {
          a: { type: 'number' },
          b: { type: 'number' },
        },
        required: ['a', 'b'],
      },
      returns: { type: 'number' },
    },
  ],
};

const agentrpc = new AgentRPC(client, machine);

agentrpc.on('add', async (a: number, b: number) => {
  return a + b;
});

agentrpc.on('subtract', async (a: number, b: number) => {
  return a - b;
});

agentrpc.on('__run', async (args: string[]) => {
  const child = spawn(process.execPath, [path.join(__dirname, '..', 'sdk-node', 'src', 'bin.ts'), ...args], {
    stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
  });

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  child.on('message', message => {
    if (message.type === 'ready') {
      agentrpc.send('__ready');
    }
  });

  child.on('exit', code => {
    if (code !== 0) {
      console.error(`Child process exited with code ${code}`);
    }
  });
});

agentrpc.start();
