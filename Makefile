#!/bin/make -f
# -*- makefile -*-
# SPDX-License-Identifier: MPL-2.0
#{
# Copyright 2018-present Samsung Electronics France SAS, and other contributors
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.*
#}

srcs ?= $(wildcard lib/*.js | sort )
main ?= example/multiple-things.js
runtime ?= node

default: check

run/node: ${main}  package.json node_modules
	npm start

run: run/${runtime}

check: ${srcs}
	ls -l $^

eslint: .eslintrc.js
	eslint --no-color --fix .
	eslint --no-color .

.eslintrc.js:
	-which eslint || npm install
	-which eslint || echo "# TODO: npm install eslint-plugin-node eslint"
	eslint --init

test:
	npm test || echo "TODO:"

node_modules: package.json
	npm install
	mkdir -p $@

package.json:
	npm init

setup/node: package.json
	node --version
	npm --version
	npm install

setup: setup/${runtime}

