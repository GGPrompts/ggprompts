import { describe, it, expect } from "vitest"
import { cn } from "./utils"

describe("cn utility", () => {
  it("should merge class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("should handle conditional classes", () => {
    expect(cn("base", false && "hidden", true && "visible")).toBe("base visible")
  })

  it("should merge tailwind classes correctly", () => {
    // tailwind-merge should dedupe conflicting utilities
    expect(cn("p-4", "p-2")).toBe("p-2")
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500")
  })

  it("should handle arrays", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar")
  })

  it("should handle undefined and null", () => {
    expect(cn("foo", undefined, null, "bar")).toBe("foo bar")
  })

  it("should handle empty inputs", () => {
    expect(cn()).toBe("")
  })
})
