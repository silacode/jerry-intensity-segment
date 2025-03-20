import {
  validateIntensityParams,
  ValidationErrorCodes,
} from "../../src/helpers/validate.js";

describe("validateIntensityParams", () => {
  test("should accept valid parameters", () => {
    expect(() =>
      validateIntensityParams({ from: 0, to: 10, amount: 5 })
    ).not.toThrow();
  });

  test("should throw error when from >= to", () => {
    const testCases = [
      { from: 10, to: 5, amount: 5 },
      { from: 5, to: 5, amount: 5 },
    ];

    testCases.forEach(({ from, to, amount }) => {
      try {
        validateIntensityParams({ from, to, amount });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(RangeError);
        expect(error.message).toBe("from must be less than to");
        expect(error.code).toBe(ValidationErrorCodes.INVALID_RANGE);
      }
    });
  });

  test("should throw error when from is not a number", () => {
    const testCases = [
      { from: "0", to: 10, amount: 5 },
      { from: null, to: 10, amount: 5 },
      { from: undefined, to: 10, amount: 5 },
    ];

    testCases.forEach(({ from, to, amount }) => {
      try {
        validateIntensityParams({ from, to, amount });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error.message).toBe("from must be a number, got " + typeof from);
        expect(error.code).toBe(ValidationErrorCodes.INVALID_TYPE);
      }
    });
  });

  test("should throw error when to is not a number", () => {
    const testCases = [
      { from: 0, to: "10", amount: 5 },
      { from: 0, to: null, amount: 5 },
      { from: 0, to: undefined, amount: 5 },
    ];

    testCases.forEach(({ from, to, amount }) => {
      try {
        validateIntensityParams({ from, to, amount });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error.message).toBe("to must be a number, got " + typeof to);
        expect(error.code).toBe(ValidationErrorCodes.INVALID_TYPE);
      }
    });
  });

  test("should throw error when amount is not a number", () => {
    const testCases = [
      { from: 0, to: 10, amount: "5" },
      { from: 0, to: 10, amount: null },
      { from: 0, to: 10, amount: undefined },
    ];

    testCases.forEach(({ from, to, amount }) => {
      try {
        validateIntensityParams({ from, to, amount });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error.message).toBe(
          "amount must be a number, got " + typeof amount
        );
        expect(error.code).toBe(ValidationErrorCodes.INVALID_TYPE);
      }
    });
  });

  test("should throw error when values are not finite", () => {
    const testCases = [
      { from: Infinity, to: 10, amount: 5, param: "from" },
      { from: 0, to: Infinity, amount: 5, param: "to" },
      { from: 0, to: 10, amount: Infinity, param: "amount" },
      { from: NaN, to: 10, amount: 5, param: "from" },
      { from: 0, to: NaN, amount: 5, param: "to" },
      { from: 0, to: 10, amount: NaN, param: "amount" },
    ];

    testCases.forEach(({ from, to, amount, param }) => {
      try {
        validateIntensityParams({ from, to, amount });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(RangeError);
        expect(error.message).toBe(
          `${param} must be a finite number, got ${
            from === Infinity || to === Infinity || amount === Infinity
              ? "Infinity"
              : "NaN"
          }`
        );
        expect(error.code).toBe(ValidationErrorCodes.NOT_FINITE);
      }
    });
  });
});
