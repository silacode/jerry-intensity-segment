/**
 * Class to manage intensity segments with add and set operations
 *
 * Time Complexity:
 * - add: O(1) - constant time for map operations
 * - set: O(n log n) - sorting points + linear scan
 * - toString: O(n log n) - sorting points + linear scan
 *
 * Space Complexity:
 * - add: O(1) - only adds at most 2 new points
 * - set:  O(n) - creates a sorted array of all points
 * - toString: O(n) for storing sorted points and result array
 *
 * @example
 * const segments = new IntensitySegments();
 * segments.add(0, 10, 5);  // Add 5 to range [0, 10)
 * segments.set(5, 15, 3); // Set intensity to 3 in range [5, 15)
 * console.log(segments.toString()); // [[0,5],[5,3],[15,0]]
 *
 * @throws {TypeError} When inputs are not numbers
 * @throws {RangeError} When inputs are invalid or out of range
 */
import { validateIntensityParams } from "./helpers/validate.js";

export class IntensitySegments {
  constructor() {
    this.baseIntensity = 0;
    this.points = new Map();
  }

  /**
   * Adds amount to the intensity in the range [from, to)
   * @param {number} from - Start of the range (inclusive)
   * @param {number} to - End of the range (exclusive)
   * @param {number} amount - Amount to add
   * @throws {TypeError} When inputs are not numbers
   * @throws {RangeError} When range is invalid or amount is not finite
   * @example
   * segments.add(0, 10, 5);  // Add 5 to range [0, 10)
   * segments.add(5, 15, 3); // Add 3 to range [5, 15)
   *
   */
  add(from, to, amount) {
    try {
      validateIntensityParams({ from, to, amount });
      if (amount === this.baseIntensity) return;
      this.points.set(from, (this.points.get(from) || 0) + amount);
      this.points.set(to, (this.points.get(to) || 0) - amount);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sets the intensity to amount in the range [from, to)
   * @param {number} from - Start of the range (inclusive)
   * @param {number} to - End of the range (exclusive)
   * @param {number} amount - Amount to set
   * @throws {TypeError} When inputs are not numbers
   * @throws {RangeError} When range is invalid or amount is not finite
   * @example
   * segments.add(0, 20, 5);  // First add 5 to range [0, 20)
   * segments.set(5, 15, 3); // Then set intensity to 3 in range [5, 15)
   *
   */
  set(from, to, amount) {
    try {
      validateIntensityParams({ from, to, amount });
      const sortedPoints = [...this.points.entries()].sort(
        (a, b) => a[0] - b[0]
      );
      let currentIntensity = 0;
      let baselineBefore = 0; // Intensity just before 'from'
      let baselineAfter = 0; // Intensity just after 'to'
      let afterTo = false;

      for (const [point, change] of sortedPoints) {
        if (point < from) baselineBefore += change;
        else if (point >= from && point <= to) this.points.delete(point);
        else if (point > to) {
          if (!afterTo) {
            baselineAfter = currentIntensity;
            afterTo = true;
          }
        }
        currentIntensity += change;
      }
      if (!afterTo) {
        baselineAfter = currentIntensity;
      }

      this.points.set(from, amount - baselineBefore);
      this.points.set(to, baselineAfter - amount);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Returns a string representation of segments where intensity changes
   * @returns {string} JSON string of [point, value] pairs
   * @throws {Error} When serialization fails
   * @example
   * segments.add(0, 10, 5);
   * segments.toString(); // "[[0,5],[10,0]]"
   */
  toString() {
    if (this.points.size === 0) return "[]";

    try {
      const sortedPoints = [...this.points.entries()].sort(
        (a, b) => a[0] - b[0]
      );
      const result = [];
      let currentIntensity = 0;

      for (const [point, change] of sortedPoints) {
        currentIntensity += change;
        result.push([point, currentIntensity]);
      }

      return JSON.stringify(result);
    } catch (error) {
      const newError = new Error(
        `Failed to convert to string: ${error.message}`
      );
      newError.code = "SERIALIZATION_ERROR";
      throw newError;
    }
  }
}
