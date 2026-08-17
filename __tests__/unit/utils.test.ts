/**
 * Unit tests for pure utility functions used across the app.
 * These functions are inlined in their respective modules but tested here
 * in isolation to verify correctness independently of any framework code.
 */

// ---------- parseLines (CourseManager) ----------

function parseLines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

describe("parseLines", () => {
  it("splits multi-line text into an array", () => {
    expect(parseLines("CIA Triad\nNetwork Basics\nThreat Actors")).toEqual([
      "CIA Triad",
      "Network Basics",
      "Threat Actors",
    ]);
  });

  it("trims leading and trailing whitespace from each line", () => {
    expect(parseLines("  CIA Triad  \n  Network Basics  ")).toEqual([
      "CIA Triad",
      "Network Basics",
    ]);
  });

  it("filters out blank lines", () => {
    expect(parseLines("CIA Triad\n\nNetwork Basics\n")).toEqual([
      "CIA Triad",
      "Network Basics",
    ]);
  });

  it("returns an empty array for empty string", () => {
    expect(parseLines("")).toEqual([]);
  });

  it("returns a single-item array for one line", () => {
    expect(parseLines("SOC Analyst")).toEqual(["SOC Analyst"]);
  });

  it("handles whitespace-only input as empty", () => {
    expect(parseLines("   \n   \n   ")).toEqual([]);
  });
});

// ---------- slugify (courses API route) ----------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

describe("slugify", () => {
  it("lowercases and hyphenates a title", () => {
    expect(slugify("Cyber Security Fundamentals")).toBe("cyber-security-fundamentals");
  });

  it("removes special characters", () => {
    expect(slugify("CompTIA Security+")).toBe("comptia-security");
  });

  it("collapses multiple separators into a single hyphen", () => {
    expect(slugify("Penetration Testing & Ethical Hacking")).toBe(
      "penetration-testing-ethical-hacking"
    );
  });

  it("strips leading and trailing hyphens", () => {
    expect(slugify("-test-")).toBe("test");
  });

  it("handles already-lowercased single words", () => {
    expect(slugify("linux")).toBe("linux");
  });

  it("handles numbers in the title", () => {
    expect(slugify("CompTIA Security+ 701")).toBe("comptia-security-701");
  });
});

// ---------- courseToForm (CourseManager) ----------
// Verifies that array fields are joined with newlines for textarea display

type ArrayField = string[];

function joinLines(arr: ArrayField): string {
  return arr.join("\n");
}

describe("joinLines (courseToForm array → textarea)", () => {
  it("joins array items with newlines", () => {
    expect(joinLines(["CIA Triad", "Network Basics", "Threat Actors"])).toBe(
      "CIA Triad\nNetwork Basics\nThreat Actors"
    );
  });

  it("returns empty string for empty array", () => {
    expect(joinLines([])).toBe("");
  });

  it("round-trips through parseLines", () => {
    const original = ["CIA Triad", "Network Basics", "Threat Actors"];
    expect(parseLines(joinLines(original))).toEqual(original);
  });
});
