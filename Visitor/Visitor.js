/**
 * VISITOR PATTERN
 *
 * *Intent:
 * Represent an operation to be performed
 * on the elements of an object structure.
 * 
 * *Motivation:
 * Consider a compiler that represents
 * programs as abstract syntax trees. 
 * -ops for analyses like checking variables are defined
 * -ops for generating code like type-checking, 
 * optimizing, variable scope, etc.
 * -ops for pretty printing, metrics, etc.
 * -most of these ops will need to treat nodes with
 * statements differently from expressions or variables.
 * -hence classes for each of those types of nodes. 
 * (see hierarchy)
 * 
 * !The problem: 
 * distributing all these ops across the 
 * various node classes leads to a system
 * that's hard to understand, maintain, and change. 
 * ? It will be confusing to have type checking code
 * ? mixed with pretty-printing code or flow analysis
 * Adding a new operation can require recompiling all
 * the node classes. 
 * 
 * *Here's where visitor comes in:
 * - We can have the ops added separately and node
 * classes be independent of the operations that apply
 * to them. 
 * - Package related operations from each class in a 
 * separate object called a visitor and passing it to
 * elements of the AST as it's traversed.
 * 
 * *The basic exchange:
 * - element of tree 'accepts' visitor
 * - element sends request to visitor that encodes
 * the element class and also passes a reference to itself
 * - visitor then executes the operation 
 * 
 * *creates two class hiearchies - nodes and visitors
 * -creating new operation just requires new visitor 
 * subclass (as long as grammar doesn't change)
 * 
 * ? Use it when:
 * * - when an object structure contains many classes
 * of objects with differing interfaces and you want to 
 * perform ops on these that depend on their classes
 * 
 * * - many distinct and unrelated operations need to be
 * performed on objects in a structure and you want to avoid 
 * polluting their classes with the ops. When the object
 * structure is shared by many applications, use Visitor
 * to put operations in just those applications that need them.
 * 
 * * - the classes defining the object structure rarely change
 * but you often want to define new operations over the structure
 * Changing the structure classes requires redefining the interface
 * to all visitors which can be costly. If the object structure
 * classes change often, then its probably better to define
 * the ops in those classes. 
 * 
 * *PARTICIPANTS:
 * *Visitor - declares visit op for each conc. class of element
 * *ConcreteVisitor - implements each op declared (fragment)
 *    ConcreteVisitor provides the context for the algorithm and
 *    stores its local state. This state often accumulates
 *    during the traversal
 * 
 * *Element (Node) - defines an Accept operation that takes 
 * visitor as argument
 * 
 * *Concrete Element - implements Accept(visitor)
 * 
 * *ObjStructure(program) 
 * - can enumerate its elements
 * - may provide a high level interface for visitation
 * - may either be a composite or a collection(list, set, etc.)
 * 
 * !CONSEQUENCES
 * *Visitor makes adding new operations easy
 * *A visitor gathers related operations and separates unrelated ones
 * !Adding new ConcreteElement classes is hard
 * Each new ConcreteElement gives rise to a new abstract op
 * on Visitor and an implementation on every ConcreteVisitor
 * sometimes you can use a default implementation but that's the 
 * exception rather than the rule. 
 * 
 * *KEY CONSIDERATION : whether you are mostly likely to change:
 * * - the algorithm
 *  OR
 * * - the element classes
 * 
 **Visitor can traverse across class hierarchies (unlike Iterator)
 **Visitor can accumulate state
 *!Breaking encapsulation:
 * Visitor's approach assume ConcreteElement interface lets visitors do job
 * As a result the pattern can foce you to provide public access to internal 
 * state
 * 
 * 
 * !IMPLEMENTATION ISSUES:
 * *Double dispatch - the op that gets executed depends on both type of 
 * visitor AND type of element
 * 
 * ?Who is responsible for traversing the object structure?
 * The visitor has to visit everybody, how do they get there?
 * Traversal responsibility can go 1 of 3 places:
 * -Object Structure (often - iterate over own elements calling accept())
 * (A composite will commonly traverse itself by having each Accept op 
 * traverse the element's children and call Accept on them recursively)
 * 
 * -Visitor - this is complex and you duplicate the code in every ConcreteVisitor
 * ...and best used when the traversal is complex
 * -Separate Iterator object
 */


var Employee = function (name, salary, vacation) {
    var self = this;

    this.accept = function (visitor) {
        visitor.visit(self);
    };

    this.getName = function () {
        return name;
    };

    this.getSalary = function () {
        return salary;
    };

    this.setSalary = function (sal) {
        salary = sal;
    };

    this.getVacation = function () {
        return vacation;
    };

    this.setVacation = function (vac) {
        vacation = vac;
    };
};

var ExtraSalary = function () {
    this.visit = function (emp) {
        emp.setSalary(emp.getSalary() * 1.1);
    };
};

var ExtraVacation = function () {
    this.visit = function (emp) {
        emp.setVacation(emp.getVacation() + 2);
    };
};

function run() {

    var employees = [
        new Employee("John", 10000, 10),
        new Employee("Mary", 20000, 21),
        new Employee("Boss", 250000, 51)
    ];

    var visitorSalary = new ExtraSalary();
    var visitorVacation = new ExtraVacation();

    for (var i = 0, len = employees.length; i < len; i++) {
        var emp = employees[i];

        emp.accept(visitorSalary);
        emp.accept(visitorVacation);
        console.log(emp.getName() + ": $" + emp.getSalary() +
            " and " + emp.getVacation() + " vacation days");
    }
}
