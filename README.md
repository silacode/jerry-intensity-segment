# Intensity Segments

A JavaScript class for managing intensity segments with add and set operations. This library allows you to track and modify intensity values across different ranges of points.

## Features

- Add intensity to a range of points
- Set intensity for a range of points
- Handle overlapping ranges
- Maintain correct intensity transitions
- Support for multiple operations

## Installation

```bash
npm install
```

## Usage

```javascript
import { IntensitySegments } from "./src/IntensitySegments.js";

// Create a new instance
const segments = new IntensitySegments();

// Add intensity to a range
segments.add(0, 10, 5); // Add 5 to range [0, 10)
console.log(segments.toString()); // [[0,5],[10,0]]

// Set intensity for a range
segments.set(5, 15, 3); // Set intensity to 3 in range [5, 15)
console.log(segments.toString()); // [[0,5],[5,3],[15,0]]

// Handle overlapping ranges
segments.add(10, 20, 2); // Add 2 to range [10, 20)
console.log(segments.toString()); // [[0,5],[5,3],[10,5],[15,2],[20,0]]
```

## API

### Constructor

```javascript
const segments = new IntensitySegments();
```

### Methods

#### add(from, to, amount)

Adds the specified amount to the intensity in the range [from, to).

- `from` (number): Start of the range (inclusive)
- `to` (number): End of the range (exclusive)
- `amount` (number): Amount to add

#### set(from, to, amount)

Sets the intensity to the specified amount in the range [from, to).

- `from` (number): Start of the range (inclusive)
- `to` (number): End of the range (exclusive)
- `amount` (number): Amount to set

#### toString()

Returns a string representation of segments where intensity changes.

Returns: JSON string of [point, value] pairs

## Validation Assumptions

The library makes the following assumptions about input validation:

1. **Type Requirements**

   - All parameters (`from`, `to`, `amount`) must be numbers
   - Non-numeric values (strings, null, undefined) will throw TypeError
   - NaN and Infinity values will throw RangeError

2. **Range Requirements**

   - `from` must be less than `to` (from < to)
   - Ranges can be of any size (no maximum limit)
   - Ranges can be negative (e.g., [-10, 0))
   - Ranges can span across zero (e.g., [-5, 5))

3. **Amount Requirements**

   - Amount must be a finite number
   - Zero amounts are allowed
   - Negative amounts are allowed

4. **Error Handling**
   - All validation errors include an error code for programmatic handling
   - Error messages are descriptive and include the specific validation failure

## Time and Space Complexity

### Time Complexity

- `add`: O(1) - constant time for map operations
- `set`: O(n log n) - sorting points + linear scan
- `toString`: O(n log n) - sorting points + linear scan

### Space Complexity

- `add`: O(1) - only adds at most 2 new points
- `set`: O(n) - creates a sorted array of all points
- `toString`: O(n) - stores sorted points and result array
- Overall: O(n) where n is the number of breakpoints

## Testing

Run the tests using:

```bash
npm test
```

## License

MIT
