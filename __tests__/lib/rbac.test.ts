import {
  isAdminRole,
  hasContentAccess,
  getAdminNavItems,
  ROLE_HIERARCHY,
  ROLE_LABELS,
  ROLE_COLORS,
  type UserRole,
} from "@/lib/admin/rbac";

describe("RBAC — role constants", () => {
  it("ROLE_HIERARCHY has increasing values for each level", () => {
    expect(ROLE_HIERARCHY.user).toBeLessThan(ROLE_HIERARCHY.moderator);
    expect(ROLE_HIERARCHY.moderator).toBeLessThan(ROLE_HIERARCHY.content_manager);
    expect(ROLE_HIERARCHY.content_manager).toBeLessThan(ROLE_HIERARCHY.admin);
    expect(ROLE_HIERARCHY.admin).toBeLessThan(ROLE_HIERARCHY.super_admin);
  });

  it("ROLE_LABELS provides a display label for every role", () => {
    const roles: UserRole[] = ["user", "moderator", "content_manager", "admin", "super_admin"];
    roles.forEach((role) => {
      expect(ROLE_LABELS[role]).toBeTruthy();
    });
  });

  it("ROLE_COLORS provides bg and text keys for every role", () => {
    const roles: UserRole[] = ["user", "moderator", "content_manager", "admin", "super_admin"];
    roles.forEach((role) => {
      expect(ROLE_COLORS[role]).toHaveProperty("bg");
      expect(ROLE_COLORS[role]).toHaveProperty("text");
    });
  });
});

describe("isAdminRole()", () => {
  it("returns false for user", () => expect(isAdminRole("user")).toBe(false));
  it("returns false for moderator", () => expect(isAdminRole("moderator")).toBe(false));
  it("returns false for content_manager", () => expect(isAdminRole("content_manager")).toBe(false));
  it("returns true for admin", () => expect(isAdminRole("admin")).toBe(true));
  it("returns true for super_admin", () => expect(isAdminRole("super_admin")).toBe(true));
});

describe("hasContentAccess()", () => {
  it("returns false for user", () => expect(hasContentAccess("user")).toBe(false));
  it("returns false for moderator", () => expect(hasContentAccess("moderator")).toBe(false));
  it("returns true for content_manager", () => expect(hasContentAccess("content_manager")).toBe(true));
  it("returns true for admin", () => expect(hasContentAccess("admin")).toBe(true));
  it("returns true for super_admin", () => expect(hasContentAccess("super_admin")).toBe(true));
});

describe("getAdminNavItems()", () => {
  it("returns no items for user role", () => {
    expect(getAdminNavItems("user")).toHaveLength(0);
  });

  it("returns content-level items for content_manager", () => {
    const items = getAdminNavItems("content_manager");
    const hrefs = items.map((i) => i.href);
    expect(hrefs).toContain("/admin/documents");
    expect(hrefs).toContain("/admin/elections");
    // Should NOT include admin-only items
    expect(hrefs).not.toContain("/admin/users");
    expect(hrefs).not.toContain("/admin/audit");
  });

  it("returns admin-level items for admin role", () => {
    const items = getAdminNavItems("admin");
    const hrefs = items.map((i) => i.href);
    expect(hrefs).toContain("/admin/dashboard");
    expect(hrefs).toContain("/admin/users");
    expect(hrefs).toContain("/admin/analytics");
    // super_admin only items excluded
    expect(hrefs).not.toContain("/admin/audit");
  });

  it("returns all items for super_admin", () => {
    const items = getAdminNavItems("super_admin");
    const hrefs = items.map((i) => i.href);
    expect(hrefs).toContain("/admin/audit");
    expect(hrefs).toContain("/admin/settings");
  });

  it("every item has icon, label and href", () => {
    getAdminNavItems("super_admin").forEach((item) => {
      expect(item).toHaveProperty("icon");
      expect(item).toHaveProperty("label");
      expect(item).toHaveProperty("href");
    });
  });

  it("item count increases with higher roles", () => {
    const contentCount = getAdminNavItems("content_manager").length;
    const adminCount = getAdminNavItems("admin").length;
    const superCount = getAdminNavItems("super_admin").length;
    expect(adminCount).toBeGreaterThanOrEqual(contentCount);
    expect(superCount).toBeGreaterThanOrEqual(adminCount);
  });
});
