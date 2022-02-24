/**
 * Adapter pattern notes:
 * 
 * Comes in class flavor which inherits from target adaptee class privately and then expresses its client interface in terms of the adaptee's (Uses multiple inheritance)
 * 
 * Also comes in object flavor...where the adaptee is instantiated within an application specific object (stored as pointer typically) that is then implemented in terms of the adaptee's interface. (Uses object composition)
 * 
 * Also known as Wrapper pattern
 * 
 * ? USE CASES: 
 * ? - you want to use an existing class and its interface doesn't match the one you need
 * ? - you want to create a reusable class that cooperates with unrelated or unforseen classes that don't necessarily have compatible interfaces.
 *  ? - (object version only) you need to use several existing subclasses, but it's impractical to adapt their interface by subclassing every one. An object adapter can adapt the interface of its parent class. 
 
 Participants:
 - Target - defines the domain specific interface that Client uses
 - Client - collaborates with objects conforming to the Target interface
 - Adaptee - defines a specific interface that needs adapting
 - Adapter - adapts the interface of Adaptee to the target interface. 

 Collaborations:
 Clients call operations on an Adapter instance which in turn calls the necessary Adaptee operations to fulfill the request. 

 Tradeoffs between object and class versions:
  - Class Adapters commit to a concrete Adaptee class. This won't work when we want to adapt a class AND all its subclasses
  -Class Adapters can override Adaptee behavior since they're subclasses
  -Class Adapters introduce only one object and no additional pointer indirection is needed to get to the adaptee
 
  -Object Adapters let a single Adapter work with many Adaptees. Can also add functionality to all Adaptees at once. 
  -Object Adapters make it harder to override Adaptee behavior. Would require subclassing and having Adapter refer to subclass...

  ! two way adapters may be created for transparency when you need two different clients to view an object differently. 
 *  */

// ! depending on language...: class adapters will typically inherit publicly from Target and privately from Adaptee making them subtypes of Target but not of Adaptee. Either way you generally would try to inherit the interface from the target in one branch and the implementation from the adaptee in another inheritance branch. 

// * Related Patterns:
// * Bridge - similar structure but different intent
// * Decorator - more transparent (doesn't change interface and support recursive composition which pure adapters can't)
// * Proxy - surrogates/represents but does not change interface

/**
 * IMPLEMENTATION
 *  - First step is to find the 'narrow' interface for Adaptee - the smallest subset of operations that lets us do the adaptation. 
 * 
 * The narrow interface leads to 3 implementation approaches:
 * (a) - Abstract Opertations - (Client/Target define the operations needed and the Adapter subclass must implement them) 
 * (b) - Delegate Objects - client forwards requests to a delegate object. Adapter targets the delegate. Client can then use a different adaptation strategy by simply substituting a different delegate. 
 * (c) - Parameterized Adapters - passed parameters determine the implementation of adaptation. Convenient alternative to subclassing if you're building interface adaptation into a class. 
 * */


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