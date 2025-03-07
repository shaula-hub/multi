const MULTI_SHAPES = {
  F1: [[1, 1, 1, 1, 1, 1]],
  F2: [
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  F3: [
    [0, 0, 0, 1, 0],
    [1, 1, 1, 1, 1],
  ],
  F4: [
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  F5: [
    [0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  F6: [
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  F7: [
    [0, 0, 1, 1],
    [1, 1, 1, 1],
  ],
  F10: [
    [0, 1, 1, 0],
    [1, 1, 1, 1],
  ],
  F12: [
    [1, 1, 0, 0],
    [1, 1, 1, 1],
  ],
  F13: [
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  F14: [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [1, 1, 1, 1],
  ],
  F15: [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [1, 1, 1, 1],
  ],
  F16: [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  F17: [
    [0, 0, 1],
    [0, 1, 1],
    [1, 1, 1],
  ],
  F18: [
    [0, 1, 0],
    [1, 1, 0],
    [1, 1, 1],
  ],
  F19: [
    [1, 0, 0],
    [1, 1, 0],
    [1, 1, 1],
  ],
  F20: [
    [1, 1, 1],
    [1, 1, 1],
  ],
  F24: [
    [0, 1, 0],
    [0, 1, 1],
    [1, 1, 1],
  ],
  F32: [[1, 1, 1, 1, 1, 1]],
  F40: [
    [1, 1, 1],
    [1, 1, 1],
  ],
  F42: [
    [1, 1, 1],
    [1, 1, 1],
  ],
  F110: [[1, 1, 1, 1, 1]],
  F111: [[1, 1, 1, 1, 1]],
  F112: [
    [0, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  F113: [
    [0, 0, 1, 0],
    [1, 1, 1, 1],
  ],
  F114: [
    [0, 1, 0, 0],
    [1, 1, 1, 1],
  ],
  F115: [
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  F116: [
    [0, 1, 1],
    [1, 1, 1],
  ],
  F120: [
    [0, 1, 1],
    [1, 1, 1],
  ],
  F121: [
    [1, 1, 0],
    [1, 1, 1],
  ],
  F123: [
    [0, 1, 1],
    [1, 1, 1],
  ],
  F124: [
    [1, 1, 0],
    [1, 1, 1],
  ],
  F125: [[1, 1, 1, 1, 1]],
  F126: [
    [0, 1, 1],
    [1, 1, 1],
  ],
  F127: [
    [1, 1, 0],
    [1, 1, 1],
  ],
  F131: [[1, 1, 1, 1, 1]],
  F132: [
    [0, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  F133: [
    [0, 0, 1, 0],
    [1, 1, 1, 1],
  ],
  F134: [
    [0, 1, 0, 0],
    [1, 1, 1, 1],
  ],
  F135: [
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  F136: [
    [0, 1, 1],
    [1, 1, 1],
  ],
  F137: [
    [1, 1, 0],
    [1, 1, 1],
  ],
  F139: [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  F140: [
    [0, 1, 1],
    [1, 1, 1],
  ],
  F141: [
    [1, 1, 0],
    [1, 1, 1],
  ],
  F142: [[1, 1, 1, 1, 1]],
  F143: [
    [0, 1, 1],
    [1, 1, 1],
  ],
  F144: [
    [1, 1, 0],
    [1, 1, 1],
  ],
  F146: [
    [0, 1, 1],
    [1, 1, 1],
  ],
  F147: [
    [1, 1, 0],
    [1, 1, 1],
  ],
  F148: [[1, 1, 1, 1, 1]],
  I: [[1, 1, 1, 1]],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  I2: [[1, 1, 1, 1]],
  J2: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L2: [
    [0, 0, 1],
    [1, 1, 1],
  ],
  O2: [
    [1, 1],
    [1, 1],
  ],
  S2: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  T2: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  Z2: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  I3: [[1, 1, 1, 1]],
  J3: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L3: [
    [0, 0, 1],
    [1, 1, 1],
  ],
  O3: [
    [1, 1],
    [1, 1],
  ],
  S3: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  T3: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  Z3: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  I4: [[1, 1, 1, 1]],
  J4: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L4: [
    [0, 0, 1],
    [1, 1, 1],
  ],
  O4: [
    [1, 1],
    [1, 1],
  ],
  S4: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  T4: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  Z4: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  I5: [[1, 1, 1, 1]],
  J5: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L5: [
    [0, 0, 1],
    [1, 1, 1],
  ],
  O5: [
    [1, 1],
    [1, 1],
  ],
  I6: [[1, 1, 1, 1]],
  J6: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L6: [
    [0, 0, 1],
    [1, 1, 1],
  ],
  O6: [
    [1, 1],
    [1, 1],
  ],
  T6: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  Z6: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  I7: [[1, 1, 1, 1]],
  I72: [[1, 1, 1, 1]],
  I73: [[1, 1, 1, 1]],
  J7: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L7: [
    [0, 0, 1],
    [1, 1, 1],
  ],
  O7: [
    [1, 1],
    [1, 1],
  ],
  S7: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  T7: [
    [0, 1, 0],
    [1, 1, 1],
  ],
};

export default MULTI_SHAPES;