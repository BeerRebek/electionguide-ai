/**
 * Component tests for <LanguageSwitcher />
 * Mocks Next.js navigation and server actions.
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LanguageSwitcher } from "@/components/accessibility/LanguageSwitcher";

// ── Mocks ─────────────────────────────────────────────────────────────────────
jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn() }),
}));

jest.mock("@/lib/supabase/actions", () => ({
  setLocaleCookie: jest.fn().mockResolvedValue(undefined),
}));

// ── Tests ─────────────────────────────────────────────────────────────────────
describe("<LanguageSwitcher />", () => {
  it("renders the trigger button", () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole("button", { name: /language/i });
    expect(button).toBeInTheDocument();
  });

  it("shows 'en' as default locale label", () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText("en")).toBeInTheDocument();
  });

  it("dropdown is not visible initially", () => {
    render(<LanguageSwitcher />);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("opens the language dropdown on button click", () => {
    render(<LanguageSwitcher />);
    const trigger = screen.getByRole("button", { name: /language/i });
    fireEvent.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("lists all 15 supported languages", () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: /language/i }));
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(15);
  });

  it("shows Hindi (हिंदी) as an option", () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: /language/i }));
    expect(screen.getByText("हिंदी")).toBeInTheDocument();
  });

  it("shows Tamil (தமிழ்) as an option", () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: /language/i }));
    expect(screen.getByText("தமிழ்")).toBeInTheDocument();
  });

  it("trigger button has aria-expanded=false initially", () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole("button", { name: /language/i });
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("trigger button has aria-expanded=true when open", () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole("button", { name: /language/i });
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("closes dropdown when same button clicked again (toggle)", () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole("button", { name: /language/i });
    fireEvent.click(button); // open
    fireEvent.click(button); // close
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("selecting a language closes the dropdown", async () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: /language/i }));
    const hindiOption = screen.getByRole("option", { name: /हिंदी/i });
    fireEvent.click(hindiOption);
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  it("English option is marked aria-selected=true by default", () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: /language/i }));
    const options = screen.getAllByRole("option");
    const englishOption = options[0]; // English is first in the list
    expect(englishOption).toHaveAttribute("aria-selected", "true");
  });

  it("trigger has aria-haspopup=listbox for a11y", () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole("button", { name: /language/i });
    expect(button).toHaveAttribute("aria-haspopup", "listbox");
  });
});
