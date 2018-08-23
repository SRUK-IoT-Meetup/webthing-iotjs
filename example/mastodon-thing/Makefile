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

main ?= mastodon-thing.js
runtime ?= iotjs
topreldir ?= ../..
topdir ?= ${CURDIR}/${topreldir}
default: check

run: run/${runtime}

run/iotjs: ${main} node_modules .mastodon-lite.json
	ls $<
	IOTJS_EXTRA_MODULE_PATH=${topdir}:node_modules iotjs $<

check:
	ls ${main}

run/node:
	npm run start

node_modules: package.json
	npm install
	mkdir -p $@

.mastodon-lite.json: ${HOME}/.mastodon-lite.json
	cp -av $< $@

${HOME}/.mastodon-lite.json:
	@echo "TODO: create $@"
