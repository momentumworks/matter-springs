"use strict";

const Matter = require('matter-js');
const PluginExample = require('../index.js');
const expect = require('chai').expect;

Matter.use(PluginExample);

describe(PluginExample.name, function() {
  it('has been installed', function() {
    expect(Matter.used).to.include(PluginExample.name);
  });

  it('has been registered', function() {
    expect(PluginExample.name in Matter.Plugin._registry).to.be.true;
  });
});