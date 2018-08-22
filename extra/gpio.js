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

function Gpio() {
  this.DIRECTION = {
    "IN": "in",
    "OUT": "out"
  };
  
  this.open  = (config, callback) => {
    console.log(`log: GPIO.open:`);
    callback(null);
    return this;
  };

  this.readSync = (err) => {
    console.log(`log: GPIO.readSync: ${err}`);
    return true;
  }
  this.closeSync = () => {
     console.log(`log: GPIO.closeSync:`);
  }
  this.write = (value) => {
    console.log(`log: GPIO: write: ${value}`);
  }
}

module.exports = new Gpio();
