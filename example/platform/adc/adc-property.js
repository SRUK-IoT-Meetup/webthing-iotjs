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

const console = require('console');

// Disable logs here by editing to '!console.log'
const log = console.log || function() {};

let webthing;
try {
  webthing = require('../../../webthing');
} catch (err) {
  webthing = require('webthing');
}
const Property = webthing.Property;
const Value = webthing.Value;

const adc = require('adc');


function AdcInProperty(thing, name, value, metadata, config) {
  const _this = this;
  _this.value = new Value(value, function(value) {
    _this.handleValueChanged && _this.handleValueChanged(value);
  });
  Property.call(this, thing, name, _this.value,{
    '@type': 'LevelProperty',
    label: ( metadata && metadata.label) || `Level: ${name}`,
    type: 'number',
    description: (metadata && metadata.description) ||
              `ADC Sensor on pin=${config.pin}`,
  });
  {
    if (!adc || !config.adc) {
      throw "error: ADC: Invalid config: " + adc;
    }
    config.adc.range = config.adc.range || 4096;
    config.frequency = config.frequency  || 1;
    _this.period = 1000.0 / config.frequency;
    _this.config = config;
    _this.port = adc.open(config.adc, function(err) {
      log(`log: ADC: ${_this.getName()}: open: ${err} (null expected)`);
      if (err) {
        console.error(`errror: ADC: ${_this.getName()}: Fail to open:\
 ${config.adc.pin}`);
        return null;
      }
      _this.inverval = setInterval(() => {
        let value = _this.port.readSync();
        log("log: ADC: " + _this.getName() + ": update: 0x"  + Number(value).toString(16));
        value = Number(Math.floor(100.0 * value / _this.config.adc.range));
        if ( value !== _this.lastValue ) {
           log(`log: ADC: ${_this.getName()}: change: ${value}`);
          _this.value.notifyOfExternalUpdate(value);
          _this.lastValue = value;
        }
      }, _this.period);
    });
  }
  
  _this.close = () => {
    try {
      _this.inverval && clearInterval(_this.inverval);
      _this.port && _this.port.closeSync();
    } catch (err) {
      console.error(`error: ADC: ${_this.getName()}: Fail to close`);
      return err;
    }
    log(`log: ADC: ${_this.getName()}: close:`);
  };
  return this;
}

function AdcProperty(thing, name, value, metadata, config) {
  return new AdcInProperty(thing, name, value, metadata, config);
}

module.exports = AdcProperty;
