const toString = Object.prototype.toString;

function tag(value: unknown): string {
  return toString.call(value);
}

function cloneRegExp(re: RegExp): RegExp {
  const cloned = new RegExp(re.source, re.flags);
  cloned.lastIndex = re.lastIndex;
  return cloned;
}

function cloneArrayBuffer(buf: ArrayBuffer): ArrayBuffer {
  const cloned = new ArrayBuffer(buf.byteLength);
  new Uint8Array(cloned).set(new Uint8Array(buf));
  return cloned;
}

function baseClone(value: any, seen: WeakMap<object, any>): any {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (seen.has(value)) {
    return seen.get(value);
  }

  const t = tag(value);

  if (t === "[object Date]") {
    return new Date(+value);
  }

  if (t === "[object RegExp]") {
    return cloneRegExp(value);
  }

  if (t === "[object ArrayBuffer]") {
    return cloneArrayBuffer(value);
  }

  if (t === "[object DataView]") {
    const buf = cloneArrayBuffer(value.buffer);
    return new DataView(buf, value.byteOffset, value.byteLength);
  }

  if (ArrayBuffer.isView(value)) {
    const Ctor = value.constructor as new (
      buffer: ArrayBuffer,
      byteOffset: number,
      length: number,
    ) => typeof value;
    const buf = cloneArrayBuffer(value.buffer as ArrayBuffer);
    return new Ctor(buf, value.byteOffset, (value as any).length);
  }

  if (value instanceof Map) {
    const result = new Map();
    seen.set(value, result);
    value.forEach((v, k) => {
      result.set(baseClone(k, seen), baseClone(v, seen));
    });
    return result;
  }

  if (value instanceof Set) {
    const result = new Set();
    seen.set(value, result);
    value.forEach((v) => {
      result.add(baseClone(v, seen));
    });
    return result;
  }

  if (value instanceof Error) {
    const result = new (value.constructor as ErrorConstructor)(value.message);
    seen.set(value, result);
    if (value.stack) result.stack = value.stack;
    return result;
  }

  if (Array.isArray(value)) {
    const result: any[] = new Array(value.length);
    seen.set(value, result);
    for (let i = 0; i < value.length; i++) {
      result[i] = baseClone(value[i], seen);
    }
    return result;
  }

  const result = Object.create(Object.getPrototypeOf(value));
  seen.set(value, result);
  const keys = Object.keys(value);
  for (let i = 0; i < keys.length; i++) {
    result[keys[i]] = baseClone(value[keys[i]], seen);
  }
  return result;
}

export function deepClone<T>(value: T): T {
  return baseClone(value, new WeakMap());
}
