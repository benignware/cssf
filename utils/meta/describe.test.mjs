import { expect } from "chai";
import { describe as desrcibeFn } from "./describe.mjs";

describe('describe', function() {
  it('should return the name of the function', function() {
    function myTestFunction() {
      return;
    }

    const result = desrcibeFn(myTestFunction);

    expect(result.name).to.equal('myTestFunction');
  });

  xit('should return the parameters of the function', function() {
    function myTestFunction(a, b = 'hello') {
      return;
    }

    const result = desrcibeFn(myTestFunction);

    expect(result.params).to.deep.equal([
      { name: 'a', value: undefined },
      { name: 'b', value: 'hello' },
    ]);
  });

  it('should return the signature of the function', function() {
    function myTestFunction(a, b) {
      return;
    }

    const result = desrcibeFn(myTestFunction);

    expect(result.toString()).to.equal('myTestFunction(a, b)');
  });

  xit('should return the signature of the function, including default values', function() {
    function myTestFunction(a, b = 'hello') {
      return;
    }

    const result = desrcibeFn(myTestFunction);

    expect(result.toString()).to.equal('myTestFunction(a, b: hello)');
  });
});

