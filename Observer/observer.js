/**
 * OBSERVER PATTERN:
 * aka Dependents, aka Publish-Subscribe
 * 
 * Motivation: coordinating consistency between related objects in partioned systems without tight coupling. 
 * 
 * Key objects in this pattern are SUBJECT and OBSERVER where a SUBJECT may have any number of dependent OBSERVERS. 
 * All observers are notified whenever the subject undergoes a change in state and in response each observer queries the subject to synchronize its state with subject state. 
 * 
 * Also known as publish-subscribe, the SUBJECT is the publisher of notifications. It doesn't need to know who its observers are. 
 * 
 * 
 * APPLICABILITY:
 *  -When an abstraction has two aspects, one dependent on the other - encapsulating these lets you separate them and reuse them independently. 
 *  - When a change to one object requires changing others, and you don't know how many objects need to be changed. 
 *  - When an object should be able to notify other objects without making assumptions about who these objects are (no tight coupling)
 * 
 * PARTICIPANTS: 
 * Subject(interface), 
 * Observer(Interface), 
 * ConcreteSubject - stores state of interest and sends notifications, 
 * Concrete Observer - maintains reference to ConcreteSubject, stores state that should stay consistent with subject, and implements the Observer update() interface. 
 * 
 * COLLABORATIONS - look at diagram
 * 
 * CONSEQUENCES:
 * The Observer pattern l ets you vary subjects and observers independently. You can reuse subjects without reusing their observers, and vice versa. It lets you add observers without modifying the subject or other observers. 
 * 
 * Further benefits/liabilities:
 *  - Abstract coupling between Subject and Observer
 *  - Support for broadcast communication - provides freedom to add/remove Observers at any time. It's up to the observer to handle or ignore a notification. 
 *  - Unexpected updates - Because observers have no knowledge of each other, they can be blind to ultimate costs of changing the subject. This is aggravated by the fact that the simple update protocol provids no details on WHAT changed. 
 * 
 * IMPLEMENTATION ISSUES:
 *  - **Mapping subjects to their observers.** The simplest way is for the subject to explicitly store refereneces to observers. However this storage may be too expensive when there are many subjects and few observers. One solution is to trade space for time by using an associative lookup(e.g. hash table) to maintain subject->observer mapping. This removes the storage overhead, but increases cost of acessing the observers. 
 * 
 * - **Observing more than one subject** - It might make sense in some situations for an observer to depened on more than one subject. It's necessary to extend the Update() interface in such cases to let the observer know *which* subject is sending the notification. The subject can simply pass itself as a parameter.  
 * 
 * **Who triggers the update?** - The subject and its observers rely on the notifcation mechanism, but what object actually calls Notify() ? 2 major options:
 * 1) Have state-setting operations on Subject call Notify() after they change subject state. Advantage here is clients don't have to remember to call Notfiy. The disadvantage is that several consecutive operations will cause several consecutive updates which may be inefficient. 
 * 
 * 2) Make clients responsible for calling Notify() at the right time. The advantage is that clients can wait to trigger the update until after a series of state changes has been made, increasing efficiency. The disadvantage is that clients have an added responsibility than increases probability of errors. 
 * 
 * **Dangling references to deleted subjects** - Deleting a subject should not produce dangling references in its observers. One way to avoid this is make the subject notify observers as it is deleted so they can reset their reference to it. 
 * 
 * **Making sure Subject state is self-consistent before notification**. Remember that observers query the subject for its current state in the course of updating their own state. This is easy to violate unintentionally when Subject sublcass operations call inherited operations. You can avoid this pitfall by sending notifications from template methods in abstract Subject classes. Define a primitive operation for subclasses to override, and make Notify the last operation in the template method which will ensure the object is self-consistent when subclasses override Subject operations. 
 * 
 * **Avoiding observer-specific update protocols: the push and pull models**
 *  one extreme - the Push model - subject sends detailed information about changes whether observers want it or not. The other extreme is the Pull model - subject sends most minimal notification and observers query for what they need.
* Pull model emphasizes subject's ignorance, push model assumes subjects know something about observer needs. Push might make observers less reusable on the other hand pull may be inefficient. 
*
* **Specifying modifications of interest explicitly** You can improve update efficiency by extending subject's registration interface to allow registering observers only for specific events of interest. One way to handle this is using aspects on the Subject and having observers specify the aspect(s) they should be notified about.
*
* **Encapsulating complex update semantics** when the dependency relationship between subjects and observers is particularly complex, an object that maintains these relationships might be required. a Change-Manager's purpose is to minimize the work required to make observers reflect a change in their subject. ChangeManager has 3 responsibilities:
  1) it maps a subject to its observers and provides an interface to maintain this mapping (this eliminates the need for observers/subjects to maintain references to each other)
  2) it defines a particular update strategy
  3) it updates all dependent observers at the request of a subject
  (see changeManager diagram) - **ChangeManager is an instancee of the Mediator Pattern, and in general there is only one and it's known globally so the Singleton pattern is useful here. 

*  ** Combining Subject and Observer Classes ** Class libraries written in languages that lack multiple inheritence generally don't separate Subject and Observer classes but combine their interfaces in one class. That lest you define an object that acts as both a subject and an observer without multiple inheritance. 
*
 */
function Click() {
    this.handlers = [];  // observers
}

Click.prototype = {

    subscribe: function (fn) {
        this.handlers.push(fn);
    },

    unsubscribe: function (fn) {
        this.handlers = this.handlers.filter(
            function (item) {
                if (item !== fn) {
                    return item;
                }
            }
        );
    },

    fire: function (o, thisObj) {
        var scope = thisObj || global || window;
        this.handlers.forEach(function (item) {
            item.call(scope, o);
        });
    }
}

function run() {

    var clickHandler = function (item) {
        console.log("fired: " + item);
    };

    var click = new Click();

    click.subscribe(clickHandler);
    // console.log("handlers:", click.handlers)
    click.fire('event #1');
    click.unsubscribe(clickHandler);
    // console.log("handlers:", click.handlers)
    click.fire('event #2');
    click.subscribe(clickHandler);
    // console.log("handlers:", click.handlers)
    click.fire('event #3');
}

module.exports = {Click, run}