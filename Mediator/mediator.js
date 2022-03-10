/**
 * MEDIATOR PATTERN:
 * Intent: promote loose coupling by encapsulating object interactions 
 *  and keeping objects from referring to each other explicitly
 * 
 * Dialog Box example - aggregate(composite) object of window full of widgets. Widgets have dependencies on each other (validation, visibility, etc)
 * 
 * "<paraphrase> Different dialog boxes will have different dependencies between widgets. 
 *  So even though dialogs isplay the same kinds of widgets, they can't simply reuse stock widget classes, they have to be customized to reflect dialog-specific dependencies. 
 * Doing this via subclassing will be tedious"
 * 
 * Here's where the mediator comes in - for example 'aFontDialogDirector'
 * 
 * ?Applicability: Use Mediator when:
 *  ? - a set of objects communicate in well-defined but complex ways. The resulting interdependencies are unstructured and difficult to understand
 * ? - reusing an object is difficult because it refers to and communicates with many other objects
 * ? - a behavior that's distributed between several classes should be customizable without a lot of subclassing
 * 
 * ?Benefits and Drawbacks:
 * ? It limits subclassing - mediator localized behavior that would be otherwise distributed.
 * ? It decouples colleagues
 * ? It simplifies object protocols - subbing many->many relationships for one->many which are easier to understand, maintain, and extend
 * ? it abstracts how objects cooperate - this can clarify interactions by separating interaction from individual behaviors
 * ? it centralizes control - you trade complexity of interaction for complexity within the mediator. This can make the mediator itself a monolith that's hard to maintain. 
 * 
 * TODO: implementation issues:
 * 1) Omitting the abstract Mediator Class - there's no need for this when colleagues only work with one mediator
 * 2) Colleague-Mediator communication. One approach is to implement the Mediator as an Observer pattern. Colleague classes act as subjects, sending notifications to the mediator whenever they change state. The mediator than responds by propagating the effects of the change to other colleagues. 
 * - 2b - another approach defines a sepcialized notification interface in Mediator that lets colleagues be more direct in their communication. When communicating with the mediator, a colleague passes itself as an argument, allowing the mediator to identify the sender. 
 * 
 * *other applications:
 *  -coordinating complex updates (e.g. the ChangeManager class mentioned in Observer(293))
 *  - maintaining connectivity constraints (e.g graphical editors with snapping/constraint features)
 * 
 * ? Related Patterns:
 * Facade - differs from mediator in that Facade is one directional - it forwards client requests to subsystem. Mediator in contrast enables cooperative behavior that colleague objects don't or can't provide and is multidirectional. 
 * Observer (colleagues can use this pattern for communication with Mediator)
 * 
 * dofactory examples - form control/validation, air traffic control
 * 
 * 
 */

//Simple chatroom example - could be extended with filters, etc.

var Participant = function (name) {
    this.name = name;
    this.chatroom = null;
};

Participant.prototype = {
    send: function (message, to) {
        this.chatroom.send(message, this, to);
    },
    receive: function (message, from) {
        console.log(from.name + " to " + this.name + ": " + message);
    }
};

var Chatroom = function () {
    var participants = {};

    return {

        register: function (participant) {
            participants[participant.name] = participant;
            participant.chatroom = this;
        },

        send: function (message, from, to) {
            if (to) {                      // single message
                to.receive(message, from);
            } else {                       // broadcast message
                for (key in participants) {
                    if (participants[key] !== from) {
                        participants[key].receive(message, from);
                    }
                }
            }
        }
    };
};

function run() {

    var yoko = new Participant("Yoko");
    var john = new Participant("John");
    var paul = new Participant("Paul");
    var ringo = new Participant("Ringo");

    var chatroom = new Chatroom();
    chatroom.register(yoko);
    chatroom.register(john);
    chatroom.register(paul);
    chatroom.register(ringo);

    yoko.send("All you need is love.");
    yoko.send("I love you John.");
    john.send("Hey, no need to broadcast", yoko);
    paul.send("Ha, I heard that!");
    ringo.send("Paul, what do you think?", paul);
}

module.exports = {Chatroom, Participant, run}