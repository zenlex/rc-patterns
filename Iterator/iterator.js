/**
 * ITERATOR
 * Intent: Provide a way to access the elements of an aggregeate object sequentially without exposing its underlying representation. AKA Cursor
 * 
 * Motivation: traversing in different ways, specialized traversals, or multiple traversals on the same list. 
 * You generally don't want to bloat the List interface with all the traversal operations, if you can even anticipate what they'll be 
 *
 * Key idea is to take responsibility for access and traversal out of the list object and put it into the iterator object. The Iterator class defines the interface for accessing the list's elements. An iterator object si responsible for keeping track of the current element, e.g. it knows which elements have been traveresed already. 
 * 
 * Common methods to the interface(ex1):
 * ? First() - initializes the current element to the first element
 * ? Next() - advances the current element to the next element
 * ? IsDone() - tests whether we've advanced beyond the last element (finished the traversal)
 * ? CurrentItem() - returns current items in list
 * 
 * Seperating the traversal mechanism lets us define iterators for different policies, e.g. a FilteringListIterator might provide access only to those elements that satisfy provided constraints
 * 
 * 
 * In the simple example, the list and the iterator are coupled and the client must know that it is a list that's being traversed. This forces the client to commit to a particular aggregate structure. We can generalize this with polymorphic iteration.
 * To do this (ex2) we define an AbstractList class that provides a common interface for manipulating lists and an abstract Iterator class that defines the common iterator interface. Then we can define concrete iterator subclasses for the different list implementations. Client knows what interface a list or iterator will provide but doesn't know anythiong else about their implementation. 
 * 
 * The remaining problem here is how to create the iterator. To keep the code independent of the concrete List subclasses we cannot just instantiate a specific class. Instead we make the list objects responsible for creating their corresponding iterator with a factory method approach e.g. CreateIterator() (ex3)
 * 
 * CONSEQUENCES:
 * -Supports variations in the traversal of an aggregate
 * -Simplifies the Aggregate interface
 * -More than one traversal can be pending on an aggregate since the iterator keeps track of its own traversal state
 * 
 * IMPLEMENTATION CONCERNS:
 * ? Who controls the iteration? (client - 'external' or iterator 'internal') External is more flexible, internal is simpler as you don't have to explicitly advance the iteration logic from the client
 * ? Who defines the traversal algorithm? The iterator is not the only place the algorithm can be defined. The aggregate can define the traversal and just use the iterator for state (this is the 'cursor' version) If the iterator defines the algorithm it's easier to use different algorithms on the same aggregate, but you can't access private variables of the aggregate without violating encapsulation
 *
 * ? How robust is the iterator? A robust iterator insures that insertions and removals wont interfere with traversal and it does it without copying the aggregate which is generally too expensive. Many ways to build robust iterators but most of them rely on registering the iterator with the aggregate so that on insertion or removal the aggregate either adjusts the iterator state or maintains internal state to ensure proper traversal. 
 * ?Other potentially useful iterator operations - Previous() - useful for ordered aggregates, SkipTo() useful for indexed aggregates
 * ?Polymorphic iterators have a cost - they require the iterator to be allocated dynamically by a factory method, so they should only be used when there's a need for polymorphism. Otherwise use concrete iterators which can be allocated on the stack. They also require the client to delete them which is error-prone because it's easy to forget to free a heap allocated iterator when you're finished with it, especially when there are multiple exit points. The Proxy pattern is useful in dealing with this issue - we can use a stack-allocated proxy as a stand-in for the real iterator. The proxy deletes the iterator in its destructor, so when the proxy goes out of scope the real iterator will get deallocated along with it. This can also help with keeping references tidy for GC. 
 * ? itertaors may have privileged access and are tightly coupled. We can avoid some of these problems with the Iterator class including protected operations for accessing important but publicly unavalable aggregate members. only Iterator subclasses should use these protected operations.  
 * ? Iterators for composites - external iterators can be difficult to implement on recursive structures like the Composite pattern because they have to store a path through the composite to keep track. It can sometimes be easier to just use an internal iterator that can record the current position by calling itself recursively, thereby storing the path implicitly in the call stack. Composites often need multiple traversal approaches (preorder, postorder, in order, bfs, etc.) and each can be supported with a different class of iterator. 
 * ? Null iterators - a degenerate iterator that's helpful for handling boundary conditions. By definition it is always done with traversal - it's IsDone() always evaluates to true. Useful with trees - aggregate elements return concrete iterators. Leaf elements return Null iterators. This lets traversal be uniform. 
 *   */

var Iterator = function (items) {
  this.index = 0;
  this.items = items;
}

Iterator.prototype = {
  first: function () {
    this.reset();
    return this.next();
  },
  next: function () {
    return this.items[this.index++];
  },
  hasNext: function () {
    return this.index <= this.items.length;
  },
  reset: function () {
    this.index = 0;
  },
  each: function (callback) {
    for (var item = this.first(); this.hasNext(); item = this.next()) {
      callback(item);
    }
  }
}

function run() {

  var items = ["one", 2, "circle", true, "Applepie"];
  var iter = new Iterator(items);

  // using for loop

  for (var item = iter.first(); iter.hasNext(); item = iter.next()) {
    console.log(item);
  }
  console.log("");

  // using Iterator's each method

  iter.each(function (item) {
    console.log(item);
  });
}

/* [Symbol.iterator] in JS: */
var myIterable = {}
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};
[...myIterable] // [1, 2, 3]


// or as computed property inside a class:

class Foo {
  *[Symbol.iterator]() {
    yield 1;
    yield 2;
    yield 3;
  }
}

const someObj = {
  *[Symbol.iterator]() {
    yield 'a';
    yield 'b';
  }
}

console.log(...new Foo); // 1, 2, 3
console.log(...someObj); // 'a', 'b'
