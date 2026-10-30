import { DEFAULT_UNIFIED_SETTINGS } from "@t3tools/contracts/settings";
import { describe, expect, it } from "vite-plus/test";

import { getModifiedSearchItemIds, isModifiedSearchItem } from "./modifiedSettings";

const THEME = { theme: "system", followSystem: true, hasThemeMix: false } as const;

describe("getModifiedSearchItemIds", () => {
  it("returns no ids for built-in defaults", () => {
    expect(getModifiedSearchItemIds(DEFAULT_UNIFIED_SETTINGS, THEME)).toEqual([]);
  });

  it("maps simple unified setting changes to their search ids", () => {
    expect(
      getModifiedSearchItemIds({ ...DEFAULT_UNIFIED_SETTINGS, chatWidth: "wide" }, THEME),
    ).toEqual(["chat-width"]);
    expect(
      getModifiedSearchItemIds(
        { ...DEFAULT_UNIFIED_SETTINGS, sidebarAutoSettleAfterDays: 7 },
        THEME,
      ),
    ).toEqual(["auto-settle-inactive-threads", "days-before-auto-settle"]);
  });

  it("maps typography and browser changes through the shared label helpers", () => {
    expect(
      getModifiedSearchItemIds(
        { ...DEFAULT_UNIFIED_SETTINGS, fontFamilySans: "Custom Sans" },
        THEME,
      ),
    ).toEqual(["interface-font"]);
    expect(
      getModifiedSearchItemIds(
        { ...DEFAULT_UNIFIED_SETTINGS, browserDefaultZoomFactor: 1.5 },
        THEME,
      ),
    ).toEqual(["browser-default-zoom"]);
  });

  it("maps theme changes to theme search ids", () => {
    expect(
      getModifiedSearchItemIds(DEFAULT_UNIFIED_SETTINGS, {
        ...THEME,
        theme: "dark",
        followSystem: false,
      }),
    ).toEqual(["theme", "color-scheme"]);
  });

  it("maps snapshot changes to their rows", () => {
    expect(
      getModifiedSearchItemIds({ ...DEFAULT_UNIFIED_SETTINGS, snapShotEnabled: true }, THEME),
    ).toEqual(["snap-shot-enabled"]);
  });
});

describe("isModifiedSearchItem", () => {
  it("matches by id or target id", () => {
    const modified = new Set(["auto-settle-inactive-threads"]);
    expect(isModifiedSearchItem({ id: "auto-settle-inactive-threads" }, modified)).toBe(true);
    expect(
      isModifiedSearchItem(
        { id: "days-before-auto-settle", targetId: "auto-settle-inactive-threads" },
        modified,
      ),
    ).toBe(true);
    expect(isModifiedSearchItem({ id: "chat-width" }, modified)).toBe(false);
  });
});
