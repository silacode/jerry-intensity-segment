import { IntensitySegments } from "../src/IntensitySegments.js";

describe("IntensitySegments", () => {
  let segments;

  beforeEach(() => {
    segments = new IntensitySegments();
  });

  describe("constructor", () => {
    test("should initialize with empty points map", () => {
      expect(segments.points.size).toBe(0);
      expect(segments.toString()).toBe("[]");
    });
  });

  describe("add", () => {
    test("should add intensity to a range", () => {
      segments.add(0, 10, 5);
      expect(segments.toString()).toBe("[[0,5],[10,0]]");
    });

    test("should handle multiple overlapping ranges", () => {
      segments.add(0, 10, 5);
      segments.add(5, 15, 3);
      expect(segments.toString()).toBe("[[0,5],[5,8],[10,3],[15,0]]");
    });

    test("should handle negative amounts", () => {
      segments.add(0, 10, 5);
      segments.add(5, 15, -2);
      expect(segments.toString()).toBe("[[0,5],[5,3],[10,-2],[15,0]]");
    });

    test("should handle zero values", () => {
      segments.add(0, 10, 0);
      expect(segments.toString()).toBe("[]");
    });

    // Invalid range tests
    test("should throw error when from >= to", () => {
      expect(() => segments.add(10, 5, 5)).toThrow("from must be less than to");
      expect(() => segments.add(5, 5, 5)).toThrow("from must be less than to");
    });

    test("should throw error when from is not a number", () => {
      expect(() => segments.add("0", 10, 5)).toThrow("from must be a number");
      expect(() => segments.add(null, 10, 5)).toThrow("from must be a number");
      expect(() => segments.add(undefined, 10, 5)).toThrow(
        "from must be a number"
      );
    });

    test("should throw error when to is not a number", () => {
      expect(() => segments.add(0, "10", 5)).toThrow("to must be a number");
      expect(() => segments.add(0, null, 5)).toThrow("to must be a number");
      expect(() => segments.add(0, undefined, 5)).toThrow(
        "to must be a number"
      );
    });

    test("should throw error when amount is not a number", () => {
      expect(() => segments.add(0, 10, "5")).toThrow("amount must be a number");
      expect(() => segments.add(0, 10, null)).toThrow(
        "amount must be a number"
      );
      expect(() => segments.add(0, 10, undefined)).toThrow(
        "amount must be a number"
      );
    });

    test("should throw error when values are not finite", () => {
      expect(() => segments.add(Infinity, 10, 5)).toThrow(
        "from must be a finite number"
      );
      expect(() => segments.add(0, Infinity, 5)).toThrow(
        "to must be a finite number"
      );
      expect(() => segments.add(0, 10, Infinity)).toThrow(
        "amount must be a finite number"
      );
      expect(() => segments.add(NaN, 10, 5)).toThrow(
        "from must be a finite number"
      );
      expect(() => segments.add(0, NaN, 5)).toThrow(
        "to must be a finite number"
      );
      expect(() => segments.add(0, 10, NaN)).toThrow(
        "amount must be a finite number"
      );
    });
  });

  describe("set", () => {
    test("should set intensity for a range", () => {
      segments.set(0, 10, 5);
      expect(segments.toString()).toBe("[[0,5],[10,0]]");
    });

    test("should override existing intensities in range", () => {
      segments.add(0, 20, 5);
      segments.set(5, 15, 3);
      expect(segments.toString()).toBe("[[0,5],[5,3],[15,5],[20,0]]");
    });

    test("should handle multiple set operations", () => {
      segments.set(0, 10, 5);
      segments.set(5, 15, 3);
      segments.set(10, 25, 2);
      expect(segments.toString()).toBe("[[0,5],[5,3],[10,2],[25,0]]");
    });

    test("should handle negative values", () => {
      segments.set(0, 10, -5);
      expect(segments.toString()).toBe("[[0,-5],[10,0]]");
    });

    test("should handle zero values", () => {
      segments.set(0, 10, 0);
      expect(segments.toString()).toBe("[[0,0],[10,0]]");
    });
  });

  describe("toString", () => {
    test("should return empty array string for no points", () => {
      expect(segments.toString()).toBe("[]");
    });

    test("should return sorted points with cumulative intensities", () => {
      segments.add(10, 20, 5);
      segments.add(0, 15, 3);
      expect(segments.toString()).toBe("[[0,3],[10,8],[15,5],[20,0]]");
    });
  });

  describe("complex scenarios", () => {
    test("should handle multiple add and set operations", () => {
      segments.add(0, 10, 5);
      segments.set(5, 15, 3);
      segments.add(10, 20, 2);
      expect(segments.toString()).toBe("[[0,5],[5,3],[10,5],[15,2],[20,0]]");
    });

    test("should handle overlapping ranges with different operations", () => {
      segments.add(0, 20, 5);
      segments.set(5, 15, 3);
      segments.add(10, 25, 2);
      expect(segments.toString()).toBe(
        "[[0,5],[5,3],[10,5],[15,7],[20,2],[25,0]]"
      );
    });
  });
});
