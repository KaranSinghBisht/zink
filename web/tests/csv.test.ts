import { describe, expect, it } from "vitest";
import { csvField } from "../lib/csv";

describe("csvField", () => {
  it("passes plain values through", () => {
    expect(csvField("Design work")).toBe("Design work");
  });

  it("quotes values containing commas, quotes, or newlines", () => {
    expect(csvField("a,b")).toBe('"a,b"');
    expect(csvField('say "hi"')).toBe('"say ""hi"""');
    expect(csvField("line1\nline2")).toBe('"line1\nline2"');
  });

  it("neutralizes spreadsheet formula prefixes", () => {
    expect(csvField("=1+2")).toBe("'=1+2");
    expect(csvField("+SUM(A1)")).toBe("'+SUM(A1)");
    expect(csvField("-2+3")).toBe("'-2+3");
    expect(csvField("@cmd")).toBe("'@cmd");
    expect(csvField("\tx")).toBe("'\tx");
  });

  it("quotes a neutralized field that also contains a comma", () => {
    expect(csvField('=HYPERLINK("http://evil","a")')).toBe(
      '"\'=HYPERLINK(""http://evil"",""a"")"',
    );
  });
});
