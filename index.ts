function loggerMethod(headMessage = "LOG:") {
  return function actualDecorator(
    originalMethod: any,
    context: ClassMethodDecoratorContext
  ) {
    const methodName = String(context.name);

    function replacementMethod(this: any, ...args: any[]) {
      console.log(`${headMessage} Entering method '${methodName}'.`);
      const result = originalMethod.call(this, ...args);
      console.log(`${headMessage} Exiting method '${methodName}'.`);
      return result;
    }

    return replacementMethod;
  };
}

function bound(originalMethod: any, context: ClassMethodDecoratorContext) {
  const methodName = context.name;
  if (context.private) {
    throw new Error(
      `'bound' cannot decorate private properties like ${methodName as string}.`
    );
  }
  context.addInitializer(function () {
    this[methodName] = this[methodName].bind(this);
  });
}

class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
    this.greet = this.greet.bind(this);
  }

  @bound
  @loggerMethod
  greet() {
    console.log(`Hello, I am ${this.name}`);
  }
}

const p = new Person("Ron");
const greet = p.greet;
