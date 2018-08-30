// -*- mode: js; js-indent-level:2;  -*-
// SPDX-License-Identifier: MPL-2.0

/**
 *
 * Copyright 2018-present Samsung Electronics France SAS, and other contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */
var webthing;

try {
  webthing = require('../webthing');
} catch (err) {
  webthing = require('webthing');
}

var Property = webthing.Property;
var SingleThing = webthing.server.SingleThing;
var Thing = webthing.Thing;
var Value = webthing.Value;
var WebThingServer = webthing.server.WebThingServer;

var fs = require('fs');

var Mastodon = require('mastodon-lite');

var conf = '.mastodon-lite.json';
var config = JSON.parse(fs.readFileSync(conf, 'utf8'));
var mastodon = Mastodon(config);
var lastHandle = 0;

function handleLevelUpdate(value) {
  var message = value;
  message = "https://s-opensource.org/tag/wot/# #MultiLevelSwitch is \"".concat(value, "\" (#MastodonLite #WebThing Actuator) ~ @TizenHelper");
  console.log(message);
  var now = new Date();

  if (now - lastHandle > 60 * 1000) {
    mastodon.post(message);
    lastHandle = now;
  }
}

function makeThing() {
  var thing = new Thing('MastodonMultiLevelSwitchExample', 'multiLevelSwitch', 'An actuator example that just blog');
  thing.addProperty(new Property(thing, 'level', new Value(0, handleLevelUpdate), {
    label: 'Level',
    type: 'number',
    description: 'Whether the output is changed'
  }));
  return thing;
}

function runServer() {
  var port = process.argv[2] ? Number(process.argv[2]) : 8888;
  var url = "http://localhost:".concat(port, "/properties/level");
  console.log("Usage:\n\n ".concat(process.argv[0], " ").concat(process.argv[1], " [port]\n\nTry:\n\ncurl -X PUT -H 'Content-Type: application/json' --data '{\"level\": 42}' \"").concat(url, "\"\n\n"));
  var thing = makeThing();
  var server = new WebThingServer(new SingleThing(thing), port);
  process.on('SIGINT', function () {
    server.stop();
    process.exit();
  });
  server.start();
}

runServer();