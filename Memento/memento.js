/**
 * MEMENTO
 * *Intent: Without violating encapsulation, capture and externalize an object's internal state so that the object can be restored to this state later. AKA Token
 * 
 * Commonly used for checkpoints and undo mechanisms for backing out or error recovery.
 * 
 * 
 * Objects normally encapsulate some or all of their state making it inaccessible to other objects. Exposing this would violate encapsulation which can compromise reliability and extensibility. 
 *
 * A *memento* is an object that stores a snapshot of the internal state of another object - the originator. 
 * 
 * The undo/checkpoint mechanism will request a memento from the originator when it needs to checkpoint the originator's state. 
 * 
 * The originator initializes the memento with information that characterizes its current state. Only the originator can store and retrieve info from teh memento - the memento is 'opaque' to other objects. 
 * 
 * ? Use the memento pattern when:
 *  - a snapshot of some portion of an object's state must be saved so that it can be restored to that state later, AND
 * -(and) a direct interface to obtaining the state would expose implementation details and break encapsulation
 * 
 * 
 * TODO: Participants:
 * --Memento: stores the internal state of originator (as little or as much as necessary), protects against access by objects other than originator. 
 * *Mementos have effectively two interfaces - Caretaker sees a narrow interface - it can only pass the memento to other objects. Originator in contrast sees a wide interface that lets it access all the data necessary to restore itself to its previous state. Ideally only the originator that created the memento would be permitted access.
 * 
 * --Originator: creates a memento, uses the memento to restore internal state
 * --Caretaker: responsible for memento safekeeping, never operates on or examines memento's contents
 * 
 * Consequences:
 * -Preserves encapsulation boundaries
 * -Simplifies the Originator by removing storage management burden
 * -Using mementos might be expensive!! If Originator must copy large amounts of information or if clients create and return mementos often enough, there may be significant overhead. Unless encapsulating and restoring Originator state is cheap, the pattern might not be appropriate. 
 * -Defining wide and narrow interfaces may be difficult depending on the language to ensure only originator can access memento state. 
 * Hidden costs in caring for mementos. Caretaker is responsible but has no idea how much state is stored in the memento. Storing incremental change rather than absolute states where possible can mitigate this. 
 * 
 * Related patterns: Command - commands can use mementos to maintain state for undo
 * Iterator: Mementos can be used for iteration (memento stores the state of the curerent iteration)
 */

var Person = function (name, street, city, state) {
    this.name = name;
    this.street = street;
    this.city = city;
    this.state = state;
}

Person.prototype = {

    hydrate: function () {
        var memento = JSON.stringify(this);
        return memento;
    },

    dehydrate: function (memento) {
        var m = JSON.parse(memento);
        this.name = m.name;
        this.street = m.street;
        this.city = m.city;
        this.state = m.state;
    }
}

var CareTaker = function () {
    this.mementos = {};

    this.add = function (key, memento) {
        this.mementos[key] = memento;
    },

        this.get = function (key) {
            return this.mementos[key];
        }
}

function run() {

    var mike = new Person("Mike Foley", "1112 Main", "Dallas", "TX");
    var john = new Person("John Wang", "48th Street", "San Jose", "CA");
    var caretaker = new CareTaker();

    // save state

    caretaker.add(1, mike.hydrate());
    caretaker.add(2, john.hydrate());

    // mess up their names

    mike.name = "King Kong";
    john.name = "Superman";

    // restore original state

    mike.dehydrate(caretaker.get(1));
    john.dehydrate(caretaker.get(2));

    console.log(mike.name);
    console.log(john.name);
}

module.exports = {Person, CareTaker, run}