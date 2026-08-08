import { describe, it, expect } from "vitest";
import { deepClone } from "./index";

describe("deepClone", () => {
  describe("primitives", () => {
    it("returns primitives as-is", () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone("hello")).toBe("hello");
      expect(deepClone(true)).toBe(true);
      expect(deepClone(null)).toBe(null);
      expect(deepClone(undefined)).toBe(undefined);
      expect(deepClone(BigInt(9007199254740991))).toBe(BigInt(9007199254740991));
    });

    it("returns symbols as-is", () => {
      const sym = Symbol("test");
      expect(deepClone(sym)).toBe(sym);
    });

    it("returns functions as-is", () => {
      const fn = () => 42;
      expect(deepClone(fn)).toBe(fn);
    });
  });

  describe("plain objects", () => {
    it("clones a flat object with no shared references", () => {
      const src = { a: 1, b: "two", c: true };
      const out = deepClone(src);
      expect(out).toEqual(src);
      expect(out).not.toBe(src);
    });

    it("clones nested objects deeply", () => {
      const src = { x: { y: { z: 1 } } };
      const out = deepClone(src);
      expect(out).toEqual(src);
      expect(out.x).not.toBe(src.x);
      expect(out.x.y).not.toBe(src.x.y);
    });

    it("preserves prototype chain", () => {
      class Foo {
        value = 1;
      }
      const src = new Foo();
      const out = deepClone(src);
      expect(out).toEqual(src);
      expect(out).not.toBe(src);
      expect(out).toBeInstanceOf(Foo);
    });
  });

  describe("arrays", () => {
    it("clones arrays with no shared references", () => {
      const src = [1, [2, [3]]];
      const out = deepClone(src);
      expect(out).toEqual(src);
      expect(out).not.toBe(src);
      expect(out[1]).not.toBe(src[1]);
      expect((out[1] as number[])[1]).not.toBe((src[1] as number[])[1]);
    });

    it("clones arrays of objects", () => {
      const obj = { id: 1 };
      const src = [obj, obj];
      const out = deepClone(src);
      expect(out[0]).toEqual(obj);
      expect(out[0]).not.toBe(obj);
      // same source ref should clone to same target ref
      expect(out[0]).toBe(out[1]);
    });
  });

  describe("Date", () => {
    it("clones Date with no shared reference", () => {
      const src = new Date("2025-01-01T00:00:00Z");
      const out = deepClone(src);
      expect(out.getTime()).toBe(src.getTime());
      expect(out).not.toBe(src);
    });

    it("clones Date nested in object", () => {
      const src = { created: new Date() };
      const out = deepClone(src);
      expect(out.created.getTime()).toBe(src.created.getTime());
      expect(out.created).not.toBe(src.created);
    });
  });

  describe("RegExp", () => {
    it("clones RegExp with flags and lastIndex", () => {
      const src = /foo/gi;
      src.lastIndex = 3;
      const out = deepClone(src);
      expect(out.source).toBe("foo");
      expect(out.flags).toBe("gi");
      expect(out.lastIndex).toBe(3);
      expect(out).not.toBe(src);
    });
  });

  describe("Map", () => {
    it("clones Map with deep values", () => {
      const inner = { v: 1 };
      const src = new Map<string, any>([
        ["a", inner],
        ["b", 2],
      ]);
      const out = deepClone(src);
      expect(out.size).toBe(2);
      expect(out.get("a")).toEqual(inner);
      expect(out.get("a")).not.toBe(inner);
      expect(out.get("b")).toBe(2);
      expect(out).not.toBe(src);
    });

    it("clones Map keys deeply", () => {
      const key = { id: 1 };
      const src = new Map([[key, "val"]]);
      const out = deepClone(src);
      const outKey = [...out.keys()][0];
      expect(outKey).toEqual(key);
      expect(outKey).not.toBe(key);
    });
  });

  describe("Set", () => {
    it("clones Set with deep values", () => {
      const obj = { x: 1 };
      const src = new Set([obj, 2, "three"]);
      const out = deepClone(src);
      expect(out.size).toBe(3);
      expect(out).not.toBe(src);
      const outObj = [...out][0];
      expect(outObj).toEqual(obj);
      expect(outObj).not.toBe(obj);
    });
  });

  describe("TypedArrays and ArrayBuffer", () => {
    it("clones ArrayBuffer", () => {
      const src = new ArrayBuffer(8);
      new Uint8Array(src).set([1, 2, 3, 4, 5, 6, 7, 8]);
      const out = deepClone(src);
      expect(new Uint8Array(out)).toEqual(new Uint8Array(src));
      expect(out).not.toBe(src);
    });

    it("clones Uint8Array", () => {
      const src = new Uint8Array([10, 20, 30]);
      const out = deepClone(src);
      expect(out).toEqual(src);
      expect(out).not.toBe(src);
      expect(out.buffer).not.toBe(src.buffer);
    });

    it("clones Float64Array", () => {
      const src = new Float64Array([1.1, 2.2, 3.3]);
      const out = deepClone(src);
      expect(out).toEqual(src);
      expect(out).not.toBe(src);
      expect(out.buffer).not.toBe(src.buffer);
    });

    it("clones DataView", () => {
      const buf = new ArrayBuffer(16);
      const src = new DataView(buf, 4, 8);
      src.setInt32(0, 42);
      const out = deepClone(src);
      expect(out.getInt32(0)).toBe(42);
      expect(out.byteOffset).toBe(4);
      expect(out.byteLength).toBe(8);
      expect(out).not.toBe(src);
      expect(out.buffer).not.toBe(src.buffer);
    });
  });

  describe("Error", () => {
    it("clones Error", () => {
      const src = new TypeError("bad");
      const out = deepClone(src);
      expect(out.message).toBe("bad");
      expect(out).toBeInstanceOf(TypeError);
      expect(out).not.toBe(src);
    });
  });

  describe("circular references", () => {
    it("handles self-referencing objects", () => {
      const src: any = { a: 1 };
      src.self = src;
      const out = deepClone(src);
      expect(out.a).toBe(1);
      expect(out.self).toBe(out);
      expect(out).not.toBe(src);
    });

    it("handles mutual references", () => {
      const a: any = { name: "a" };
      const b: any = { name: "b" };
      a.ref = b;
      b.ref = a;
      const outA = deepClone(a);
      expect(outA.name).toBe("a");
      expect(outA.ref.name).toBe("b");
      expect(outA.ref.ref).toBe(outA);
      expect(outA).not.toBe(a);
      expect(outA.ref).not.toBe(b);
    });

    it("handles circular arrays", () => {
      const src: any[] = [1, 2];
      src.push(src);
      const out = deepClone(src);
      expect(out[0]).toBe(1);
      expect(out[1]).toBe(2);
      expect(out[2]).toBe(out);
      expect(out).not.toBe(src);
    });

    it("handles circular Map", () => {
      const src = new Map<string, any>();
      src.set("self", src);
      const out = deepClone(src);
      expect(out.get("self")).toBe(out);
      expect(out).not.toBe(src);
    });
  });

  describe("SSR store simulation", () => {
    it("clones a valtio-style store with complete isolation", () => {
      const store = {
        indexState: {
          data: {},
          indexData: {
            data: [
              {
                components: [
                  { title: "video1", img: "//cdn/1.jpg", mark: { text: "VIP" } },
                  { title: "video2", img: "//cdn/2.jpg", mark: { text: "" } },
                ],
              },
            ],
          },
        },
        detailState: { data: {} },
        searchState: { searchText: "" },
      };

      const clone1 = deepClone(store);
      const clone2 = deepClone(store);

      // mutations to clone1 must not affect clone2 or the original
      clone1.indexState.indexData.data[0].components[0].title = "modified";
      clone1.searchState.searchText = "query";

      expect(store.indexState.indexData.data[0].components[0].title).toBe("video1");
      expect(store.searchState.searchText).toBe("");
      expect(clone2.indexState.indexData.data[0].components[0].title).toBe("video1");
      expect(clone2.searchState.searchText).toBe("");
    });

    it("no object at any depth shares a reference with the source", () => {
      const shared = { nested: { deep: [1, 2, { v: 3 }] } };
      const store = { a: shared, b: { ref: shared } };
      const out = deepClone(store);

      // a and b.ref pointed to the same object in the source,
      // so they should also point to the same (new) object in the clone
      expect(out.a).toBe(out.b.ref);
      // but they must not be the original
      expect(out.a).not.toBe(shared);
      expect(out.a.nested).not.toBe(shared.nested);
      expect(out.a.nested.deep).not.toBe(shared.nested.deep);
      expect(out.a.nested.deep[2]).not.toBe(shared.nested.deep[2]);
    });
  });
});
