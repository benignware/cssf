import { expect } from "chai";
import { number, unit, unwrap } from "./number.mjs";

describe("number", function () {
  it("should return a number if the input is a number", function () {
    expect(number(1)).to.equal(1);
  });

  it("should return a number if the input is a number string", function () {
    expect(number("1.234")).to.equal(1.234);
  });

  it("should return a number if the input is a number with unit", function () {
    expect(number("180deg")).to.equal(180);
  });

  it("should return a number if the input is a number string wrapped in calc", function () {
    expect(number("calc(180deg)")).to.equal(180);
  });

  it("should return NaN if the input is some expression", function () {
    expect(number("calc(180deg * 0.5)")).to.be.NaN;
  });

  it("should return NaN if the input is not a number", function () {
    expect(number("abc")).to.be.NaN;
  });
});

describe("unit", function () {
  it("should return an empty string if the input is a number", function () {
    expect(unit(1)).to.equal("");
  });

  it("should return an empty string if the input is a number string", function () {
    expect(unit("1.234")).to.equal("");
  });

  it("should return the unit if the input is a number with unit", function () {
    expect(unit("180deg")).to.equal("deg");
  });

  it("should return the unit if the input is a number string with unit", function () {
    expect(unit("180deg")).to.equal("deg");
  });

  it("should return the unit if the input is a number string wrapped in calc", function () {
    expect(unit("calc(180deg)")).to.equal("deg");
  });

  it("should return an empty string if the input is some expression", function () {
    expect(unit("calc(180deg * 0.5)")).to.equal("");
  });

  it("should return an empty string if the input is not a number", function () {
    expect(unit("abc")).to.equal("");
  });
});

describe("unwrap", function () {
  it("should return a number if the input is a number", function () {
    expect(calc(1)).to.equal(1);
  });

  it("should return a number if the input is a number string", function () {
    expect(calc("1.234")).to.equal(1.234);
  });

  it("should return a number with unit if the input is a number with unit", function () {
    expect(calc("180deg")).to.equal('180deg');
  });

  it("should unwrap a number with unit", function () {
    expect(calc("calc(180deg)")).to.equal('180deg');
  });

  it("should return calc expressionn as is", function () {
    expect(calc("calc(180deg * 0.5)")).to.equal("calc(180deg * 0.5)");
  });

  it("should wrap the expression in calc if it wasn't", function () {
    expect(calc("abc")).to.equal("calc(abc)");
  });
});