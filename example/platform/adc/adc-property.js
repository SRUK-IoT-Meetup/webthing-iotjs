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
var console = require('console'); // Disable logs here by editing to '!console.log'


var log = console.log || function () {};

var webthing;

try {
  webthing = require('../../../webthing');
} catch (err) {
  webthing = require('webthing');
}

var Property = webthing.Property;
var Value = webthing.Value;

var adc = require('adc');

function AdcInProperty(thing, name, value, metadata, config) {
  var _this = this;

  _this.value = new Value(value, function (value) {
    _this.handleValueChanged && _this.handleValueChanged(value);
  });
  Property.call(this, thing, name, _this.value, {
    '@type': 'LevelProperty',
    label: metadata && metadata.label || "Level: ".concat(name),
    type: 'number',
    description: metadata && metadata.description || "ADC Sensor on pin=".concat(config.pin)
  });
  {
    if (!adc || !config.adc) {
      throw "error: ADC: Invalid config: " + adc;
    }

    config.adc.range = config.adc.range || 4096;
    config.frequency = config.frequency || 1;
    _this.period = 1000.0 / config.frequency;
    _this.config = config;
    _this.port = adc.open(config.adc, function (err) {
      log("log: ADC: ".concat(_this.getName(), ": open: ").concat(err, " (null expected)"));

      if (err) {
        console.error("errror: ADC: ".concat(_this.getName(), ": Fail to open: ").concat(config.adc.pin));
        return null;
      }

      _this.inverval = setInterval(function () {
        var value = _this.port.readSync();

        log("log: ADC: " + _this.getName() + ": update: 0x" + Number(value).toString(16));
        value = Number(Math.floor(100.0 * value / _this.config.adc.range));

        if (value !== _this.lastValue) {
          log("log: ADC: ".concat(_this.getName(), ": change: ").concat(value));

          _this.value.notifyOfExternalUpdate(value);

          _this.lastValue = value;
        }
      }, _this.period);
    });
  }

  _this.close = function () {
    try {
      _this.inverval && clearInterval(_this.inverval);
      _this.port && _this.port.closeSync();
    } catch (err) {
      console.error("error: ADC: ".concat(_this.getName(), ": Fail to close"));
      return err;
    }

    log("log: ADC: ".concat(_this.getName(), ": close:"));
  };

  return this;
}

function AdcProperty(thing, name, value, metadata, config) {
  return new AdcInProperty(thing, name, value, metadata, config);
}

module.exports = AdcProperty;