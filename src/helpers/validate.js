/**
 * Error codes for validation failures
 * @enum {string}
 */
export const ValidationErrorCodes = {
  INVALID_TYPE: "INVALID_TYPE",
  NOT_FINITE: "NOT_FINITE",
  INVALID_RANGE: "INVALID_RANGE",
};

/**
 * Validates numeric input parameters for intensity operations
 * @param {Object} params - Object containing parameters to validate
 * @param {number} params.from - Start of the range (inclusive)
 * @param {number} params.to - End of the range (exclusive)
 * @param {number} params.amount - Amount to add/set
 * @throws {TypeError} When any value is not a number
 * @throws {RangeError} When any value is not finite or range is invalid
 */
export function validateIntensityParams({ from, to, amount }) {
  const params = { from, to, amount };

  // Type validation
  for (const [key, value] of Object.entries(params)) {
    if (typeof value !== "number") {
      const error = new TypeError(
        `${key} must be a number, got ${typeof value}`
      );
      error.code = ValidationErrorCodes.INVALID_TYPE;
      throw error;
    }
    if (!Number.isFinite(value)) {
      const error = new RangeError(
        `${key} must be a finite number, got ${value}`
      );
      error.code = ValidationErrorCodes.NOT_FINITE;
      throw error;
    }
  }

  // Range validation
  if (from >= to) {
    const error = new RangeError("from must be less than to");
    error.code = ValidationErrorCodes.INVALID_RANGE;
    throw error;
  }
}
