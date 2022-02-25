/**
 * FACADE Pattern:
 * Provides a higher level consistent interface to clients for a complex subsystem
 * 
 * ? APPLICABILITY(Use when...):
 * ?    You want to provide a simple interface to a complex system. Especially one that is likely to get more complex over time (which is most subsystems)
 * ?    There are many dependencies between clients and implementation classes of an abstraction. The Facade can be used to decouple the subsystem from clients and other subsystems
 * ?    You want to layer your subystems - use a facade to define an entry point to each subsystem level. If the subsystems are dependent you can simplify the  dependencies by making them communicate with each other solely through their facades
 * 
 * PARTICIPANTS:
 *  -Facade - knows which subsystem classes are responsible for a request and delegates client requests appropriately
 * - Subsystem classes - implement functionality, handle work assigned by the facade, **Have no knowledge of the facade - that is they keep no references to it**
 * 
 * MAJOR BENEFITS:
 *  - Makes subsystem easier to use 
 *  - Promotes weak coupling which can reduce compilation dependences, complex dependencies, and circular dependencies\
 *  - Doesn't prevent applications from directly accessing subsystem classes if they need to so you can choose between ease of use and generality
 * 
 * IMPLEMENTATION CONSIDERATIONS:
 *  - Reducing client-subsystem coupling - Coupling can be reduced even further by making Facade an abstract class with concrete subclasses for different implementations of a subsystem. This keeps clients from knowing which implementation of a subsystem is being used by having them interact with the interface of the abstract Facade class. 
 * 
 *  - Consider which subsystem classes are 'public' vs 'private' in the same way you would consider it for a class. Namespaces can be useful for this in languages which support it. 
 * 
 * ? RELATED PATTERNS:
 *  - Abstract Factory can be used with Facade to provide an interface for creating subsystem objects in a subsystem independent way. Abstract Factory can also be used as an alternative to Facade to hide platform-specific classes
 * -Mediator is similar in that it abstracts functionality of existing classes. Mediator's purpose however is to abstract arbitrary communication between colleague objects. A mediator's colleagues are aware of and communicate with the mediator instead of communicating with each other directly. In contrast , a facade merely abstracts the interface to subsystem objects. it doesn't define new functionality and the subsystem doesn't know about it. 
 * - Singleton - usually only one Facade object is required so they are often Singletons. 
 */

//-------------------IMPLEMENTATION EXAMPLE-------------------->
class Mortgage {
  constructor(name) {
    this.name = name;
  }


  applyFor(amount) {
    // access multiple subsystems...
    let result = "approved";
    if (!new Bank().verify(this.name, amount)) {
      result = "denied";
    } else if (!new Credit().get(this.name)) {
      result = "denied";
    } else if (!new Background().check(this.name)) {
      result = "denied";
    }
    return this.name + " has been " + result +
      " for a " + amount + " mortgage";
  }

}

class Bank {
  verify(name, amount) {
    // complex logic ...
    return true;
  }
}

class Credit {
  get(name) {
    // complex logic ...
    return true;
  }
}

class Background {
  check(name) {
    // complex logic ...
    if (name.search('h') !== -1) {
      return false
    } else {
      return true;
    }
  }
}

function run(name, amount) {
  var mortgage = new Mortgage(name);
  var result = mortgage.applyFor(amount);

  console.log(result);
}

module.exports = { Mortgage, Bank, Credit, Background, run }