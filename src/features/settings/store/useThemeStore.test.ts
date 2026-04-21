import { useThemeStore } from "./useThemeStore";

describe("useThemeStore", () => {
  beforeEach(() => {
    // Reset state before each test
    useThemeStore.setState({ theme: "system" });
  });

  it("should have system as the default theme", () => {
    const { theme } = useThemeStore.getState();
    expect(theme).toBe("system");
  });

  it("should be able to set theme to dark", () => {
    useThemeStore.getState().setTheme("dark");
    expect(useThemeStore.getState().theme).toBe("dark");
  });

  it("should be able to set theme to light", () => {
    useThemeStore.getState().setTheme("light");
    expect(useThemeStore.getState().theme).toBe("light");
  });
});
