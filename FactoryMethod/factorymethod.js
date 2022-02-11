/**
 * FACTORY METHOD DESIGN PATTERN (aka Virtual Constructor)
 *  
 * Participants:
 * *Creator - the 'factory' object that:
 *  - creates new products
 *  - implements 'factoryMethod' which returns newly created products
 * 
 * *AbstractProduct
 *  - declares an interface for products
 * 
 * *ConcreteProduct
 *  - the specific product being created
 *  - all products support the same interface (properties and methods)
 *  
 * ? - Two major varieties:
 * ? - - 1)where the Creator class is an abstract class and does not provide an implemntation for the factory method it declares 
 * ? - - 2)where the Creator is a concrete class and provides a default implementation for the factory method
 * (it's also possible to have v1.5 where the Abstract class defines a default implementation but less common)
 * 
 * * Can be parameterized to create multiple kinds of products - all products still share the Product interface. 
 * */

class WidgetCreator {
  //'Creator class'
  constructor() {
    this.widgets = [];
  }
  createWidget(wType) { // the 'factory method'
    let newWidget;
    if (wType === 'bouncy') newWidget = new BouncyWidget();
    if (wType === 'rolypoly') newWidget = new RolyPolyWidget();
    if (wType === 'squishy') newWidget = new SquishyWidget();
    if (!newWidget.id) {
      throw new Error('Widget Subtype must specify unique id')
    }
    this.widgets.push(newWidget.id);
    return newWidget;
  }
}

class Widget {
  //abstract 'product' class
  constructor() {
    this.id = null
    this.wType = null
    this.name = null
    this.color = null
    this.length = null
    this.height = null
    this.width = null
    this.weight = null
    this.shapes = []
    this.currentShape = this.shapes[0];


    if (this.constructor === Widget) {
      throw new Error("Abstract classes can't be instantiated");
    }
  }

  move() {
    throw new Error("Method 'move()' must be implemented")
  }

  speak() {
    throw new Error("Method 'speak()' must be implemented")
  }

  shapeShift() {
    if (this.shapes.length > 0) {
      this.currentShape = this.shapes[Math.floor(Math.random() * this.shapes.length)]
    }
    else console.log("This widget doesn't yet have shapeShifting capabilities")
    return this.currentShape
  }

  toString() {
    return `${this.wType} type widget.`
  }
}

// CONCRETE PRODUCT SUBCLASSES
class BouncyWidget extends Widget {
  constructor() {
    super()
    this.id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    this.wType = 'bouncy'
    this.shapes = []
    console.log("Bouncy Widget Created")
  }
  move() {
    console.log("bounce, bounce, bounce")
  }

  speak() {
    console.log("Gummy Beeeeaaaaars, Bouncin' here and there and every where!!")
  }
}
class RolyPolyWidget extends Widget {
  constructor() {
    super()
    this.id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    this.wType = 'rolypoly'
    this.shapes = ['roly', 'poly']
    console.log("RolyPoly Widget Created")
  }
  move() {
    console.log("rollin' rollin' rollin'")
  }

  speak() {
    console.log("Life is but a series of endless circles")
  }

}

class SquishyWidget extends Widget {
  constructor() {
    super()
    this.id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    this.wType = 'squishy'
    console.log("Squishy Widget Created")
    this.shapes = ['flat', 'ball', 'teardrop']
  }
  move() {
    console.log("squish, splat, splop")
  }

  speak() {
    console.log("pssffffffftttssssssslllllluuuuuuuuppppppsssssqqqqqquuuuiiissshhhh")
  }

}

//add customized factory
class BouncyFactory extends WidgetCreator {
  constructor() {
    super()
    this.wType = 'bouncy'
    delete this.widgets
  }
  createWidget() {
    return new BouncyWidget()
  }
}
module.exports = { WidgetCreator, Widget, BouncyFactory }