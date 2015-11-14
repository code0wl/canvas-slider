/* global it */
/* global describe */
var assert = require('assert'),
    expect = require('chai').expect,
    inHerito = require('./src');

describe('inHerito', function() {  
  it('should be an object', function() {
    expect(inHerito).to.be.a('object');
  });
});

describe('create', function() {
  it('can set property on new object', function() {
    var Driver = inHerito.create({
      title: 'Tesla'
    });
    expect(Driver.title).to.equal('Tesla');
  }); 
});

describe('inheritance', function() {
  it('should inherit from parent', function() {
    var Driver = inHerito.create({
      title: 'Tesla'
    });
    expect(Driver).to.have.property('create');
  });
  
  it('should be able to overwrite it\'s inherited object', function() {
    var Driver = inHerito.create({
      age: 15,
      title: 'Tesla',
      gender: 'Male'    
    });
    
    var Lucy = Driver.create({
      gender: 'Female'
    });
    
    expect(Lucy.gender).to.equal('Female');
  });
   
  it('should just take mixins from parent', function() {
    var Driver = inHerito.create({
      age: 15,
      title: 'Tesla',
      gender: 'Male'
    });
    
    var Lucy = Driver.create({
      gender: 'Female',
      inherit: ['title']
    });
    
    expect(Lucy.title).to.equal('Tesla');
  });     
});
