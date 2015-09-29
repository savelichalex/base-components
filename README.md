# Base-frame-component [![npm version](https://badge.fury.io/js/base-components.svg)](http://badge.fury.io/js/base-components)

This is main part of base-frame library that help you to create loose-coupling component architecture

## Overview

Component is independent part of your application. Each component work in isolation on their tasks.
But components need to communicate with each other, for example to notify of a change of status or
requesting data from another component.

For this components implement idea of slots and signals ( like in Qt ). This technique help you create
readable interfaces between components. Just looking at component you see which entry and output point they
have.

Main idea of components is that they encapsulate what they do. No one part of application can not to communicate.
All communications must be only through components in which they are located.