# Base-components
[![Build Status](https://travis-ci.org/savelichalex/base-components.svg?branch=master)](https://travis-ci.org/savelichalex/base-components)
[![npm version](https://badge.fury.io/js/base-components.svg)](http://badge.fury.io/js/base-components)

This is main part of base-frame library that help you to create loose-coupling component architecture

## Overview

Component is independent part of your application. Each component work in isolation on their tasks.
But components need to communicate with each other, for example to notify of a change of status or
requesting data from another component.

For this components implement idea of slots and signals. This technique help you create
readable interfaces between components. Just looking at component you see which entry and output point they
have.

Main idea of components is that they encapsulate what they do. No one part of application can not to communicate without
events

## More comfortable work with signals and slots

After some time with library I saw that work with every descrete event is not a good idea. And I choose FRP technique to
work with them. Every slots and signals is streams under component, and this way what I was looking for a long time...