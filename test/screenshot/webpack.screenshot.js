/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const CssBundleFactory = require('../../scripts/build/css-bundle-factory');
const EnvConfig = require('../../scripts/build/env-config');
const JsBundleFactory = require('../../scripts/build/js-bundle-factory');
const PathResolver = require('../../scripts/build/path-resolver');
const StaticServer = require('../../scripts/build/static-server');

const MAIN_OUTPUT_DIR_ABS = PathResolver.getAbsolutePath('/test/screenshot/out/main');
const MAIN_HTTP_DIR_ABS = '/out/main';

const TEST_OUTPUT_DIR_ABS = PathResolver.getAbsolutePath('/test/screenshot/out/test');
const TEST_HTTP_DIR_ABS = '/out/test';

const RUN_SERVER = /^dev(:|$)/.test(EnvConfig.getNpmLifecycleEvent());

EnvConfig.setBabelEnv();

module.exports = [
  createMainCssBundle(),
  createMainJsBundle(),
  createTestCssBundle(),
  createTestJsBundle(),
];

if (RUN_SERVER) {
  StaticServer.runLocalDevServer({
    relativeDirectoryPaths: ['/demos', '/test'],
  });
}

function createMainCssBundle() {
  return CssBundleFactory.createMainCssBundle({
    output: {
      fsDirAbsolutePath: MAIN_OUTPUT_DIR_ABS,
      httpDirAbsolutePath: MAIN_HTTP_DIR_ABS,
    },
  });
}

function createMainJsBundle() {
  return JsBundleFactory.createMainJsBundle({
    output: {
      fsDirAbsolutePath: MAIN_OUTPUT_DIR_ABS,
      httpDirAbsolutePath: MAIN_HTTP_DIR_ABS,
    },
  });
}

function createTestCssBundle() {
  return CssBundleFactory.createCustomCssBundle({
    bundleName: 'test-css',
    chunkGlobConfig: {
      inputDirectory: '/test/screenshot',
      filePathPattern: '**/*.test.scss',
    },
    output: {
      fsDirAbsolutePath: TEST_OUTPUT_DIR_ABS,
      httpDirAbsolutePath: TEST_HTTP_DIR_ABS,
    },
  });
}

function createTestJsBundle() {
  return JsBundleFactory.createCustomJsBundle({
    bundleName: 'test-js',
    chunkGlobConfig: {
      inputDirectory: '/test/screenshot',
      filePathPattern: '**/*.test.js',
    },
    output: {
      fsDirAbsolutePath: TEST_OUTPUT_DIR_ABS,
      httpDirAbsolutePath: TEST_HTTP_DIR_ABS,
      library: ['test', '[name]'],
    },
  });
}