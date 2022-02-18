/**
 * Adapter pattern notes:
 * 
 * Comes in class flavor which inherits from target adaptee class privately and then expresses its client interface in terms of the adaptee's
 * 
 * Also comes in object flavor...where the adaptee is instantiated within an application specific object that is then implemented in terms of the adaptee's interface. 
 * 
 * Also known as Wrapper pattern
 * 
 * ? USE CASES: 
 * ? - you want to use an existing class and its interface doesn't match the one you need
 * ? - you want to create a reusable class that cooperates with unrelated or unforseen classes that don't necessarily have compatible interfaces.
 *  ? - (object version only) you need to use several existing subclasses, but it's impractical to adapt their interface by subclassing every one. An object adapter can adapt the interface of its parent class. 
 *  */
// * Related Patterns:
// * Bridge - similar structure but different intent
// * Decorator - more transparent (doesn't change interface and support recursive composition which pure adapters can't)
// * Proxy - surrogates/represents but does not change interface

// IMPLEMENTATION EXAMPLE

// Example


// The example code below shows an online shopping cart in which a shipping object is used to compute shipping costs.The old Shipping object is replaced by a new and improved Shipping object that is more secure and offers better prices.

// The new object is named AdvancedShipping and has a very different interface which the client program does not expect.ShippingAdapter allows the client program to continue functioning without any API changes by mapping(adapting) the old Shipping interface to the new AdvancedShipping interface.class

// ? old interface

function Shipping() {
  this.request = function (zipStart, zipEnd, weight) {
    //...
    return "$49.75"
  }
}

// ? new interface

function AdvancedShipping() {
  this.login = function (credentials) { /*...*/ }
  this.setStart = function (start) { /*...*/ }
  this.setDestination = function (destination) { /*...*/ }
  this.calculate = function (weight) { return "39.50"; }
}

//TODO: adapter interface
function ShippingAdapter(credentials) {
  var shippping = new AdvancedShipping();

  shippping.login(credentials);

  return {
    request: function (zipStart, zipEnd, weight) {
      shippping.setStart(zipStart);
      shippping.setDestination(zipEnd);
      return shippping.calculate(weight);
    }
  }
}

function run() {
  var shipping = new Shipping();
  var credentials = { token: "30a8-6ee1" };
  var adapter = new ShippingAdapter(credentials);

  //original shipping object and interface 

  var cost = shipping.request("78701", "10010", "2lbs");
  console.log("Old cost: " + cost);

  //new shipping object with adapted interface

  cost = adapter.request("78701", "10010", "2lbs");

  console.log("New cost: " + cost);
}

module.exports = run;