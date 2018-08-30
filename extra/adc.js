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
function Adc() {
  var _this = this;

  this.DIRECTION = {
    "IN": "in",
    "OUT": "out"
  };

  this.open = function (config, callback) {
    console.log("log: ADC: open:");
    callback(null);
    return _this;
  };

  this.readSync = function (err) {
    console.log("log: ADC: readSync: ".concat(err));
    return true;
  };

  this.closeSync = function () {
    console.log("log: ADC: closeSync:");
  };

  this.write = function (value) {
    console.log("log: ADC: write: ".concat(value));
  };
}

module.exports = new Adc();