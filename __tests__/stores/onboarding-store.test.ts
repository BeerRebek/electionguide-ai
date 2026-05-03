import { act } from "@testing-library/react";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";

// Reset store between each test
beforeEach(() => {
  useOnboardingStore.getState().reset();
});

describe("OnboardingStore — step navigation", () => {
  it("starts at step 1", () => {
    expect(useOnboardingStore.getState().currentStep).toBe(1);
  });

  it("nextStep increments step", () => {
    act(() => useOnboardingStore.getState().nextStep());
    expect(useOnboardingStore.getState().currentStep).toBe(2);
  });

  it("nextStep does not exceed max step (5)", () => {
    useOnboardingStore.setState({ currentStep: 5 });
    act(() => useOnboardingStore.getState().nextStep());
    expect(useOnboardingStore.getState().currentStep).toBe(5);
  });

  it("prevStep decrements step", () => {
    useOnboardingStore.setState({ currentStep: 3 });
    act(() => useOnboardingStore.getState().prevStep());
    expect(useOnboardingStore.getState().currentStep).toBe(2);
  });

  it("prevStep does not go below 1", () => {
    useOnboardingStore.setState({ currentStep: 1 });
    act(() => useOnboardingStore.getState().prevStep());
    expect(useOnboardingStore.getState().currentStep).toBe(1);
  });

  it("goToStep sets a specific step", () => {
    act(() => useOnboardingStore.getState().goToStep(4));
    expect(useOnboardingStore.getState().currentStep).toBe(4);
  });

  it("skipStep increments like nextStep", () => {
    useOnboardingStore.setState({ currentStep: 2 });
    act(() => useOnboardingStore.getState().skipStep());
    expect(useOnboardingStore.getState().currentStep).toBe(3);
  });

  it("complete sets step to 6 (completion marker)", () => {
    act(() => useOnboardingStore.getState().complete());
    expect(useOnboardingStore.getState().currentStep).toBe(6);
  });
});

describe("OnboardingStore — language", () => {
  it("starts with English", () => {
    expect(useOnboardingStore.getState().language).toBe("en");
  });

  it("setLanguage updates language", () => {
    act(() => useOnboardingStore.getState().setLanguage("hi"));
    expect(useOnboardingStore.getState().language).toBe("hi");
  });

  it("supports all Indian languages", () => {
    const languages = ["hi", "ta", "te", "kn", "mr", "bn", "gu", "pa", "ml"];
    languages.forEach((lang) => {
      act(() => useOnboardingStore.getState().setLanguage(lang));
      expect(useOnboardingStore.getState().language).toBe(lang);
    });
  });
});

describe("OnboardingStore — location", () => {
  it("starts with empty location fields", () => {
    const { location } = useOnboardingStore.getState();
    expect(location.state).toBe("");
    expect(location.district).toBe("");
    expect(location.constituency).toBe("");
  });

  it("setLocation partially updates location", () => {
    act(() =>
      useOnboardingStore.getState().setLocation({
        state: "Maharashtra",
        district: "Mumbai",
      })
    );
    const { location } = useOnboardingStore.getState();
    expect(location.state).toBe("Maharashtra");
    expect(location.district).toBe("Mumbai");
    expect(location.constituency).toBe(""); // unchanged
  });

  it("setLocation merges with existing values", () => {
    useOnboardingStore.setState({
      location: {
        state: "Tamil Nadu",
        district: "Chennai",
        constituency: "",
        pinCode: "",
      },
    });
    act(() => useOnboardingStore.getState().setLocation({ constituency: "Mylapore" }));
    const { location } = useOnboardingStore.getState();
    expect(location.state).toBe("Tamil Nadu");
    expect(location.constituency).toBe("Mylapore");
  });
});

describe("OnboardingStore — profile", () => {
  it("starts with empty profile", () => {
    const { profile } = useOnboardingStore.getState();
    expect(profile.ageRange).toBe("");
    expect(profile.voterStatus).toBe("");
    expect(profile.interests).toHaveLength(0);
  });

  it("setProfile updates profile fields", () => {
    act(() =>
      useOnboardingStore.getState().setProfile({
        ageRange: "18-25",
        voterStatus: "registered",
        interests: ["elections", "candidates"],
      })
    );
    const { profile } = useOnboardingStore.getState();
    expect(profile.ageRange).toBe("18-25");
    expect(profile.interests).toContain("elections");
  });
});

describe("OnboardingStore — notifications", () => {
  it("election reminders are on by default", () => {
    expect(useOnboardingStore.getState().notifications.electionReminders).toBe(
      true
    );
  });

  it("setNotifications toggles individual fields", () => {
    act(() =>
      useOnboardingStore.getState().setNotifications({ dailyQuiz: true })
    );
    expect(useOnboardingStore.getState().notifications.dailyQuiz).toBe(true);
    expect(
      useOnboardingStore.getState().notifications.electionReminders
    ).toBe(true); // unchanged
  });
});

describe("OnboardingStore — reset", () => {
  it("reset restores all initial state", () => {
    act(() => {
      useOnboardingStore.getState().setLanguage("hi");
      useOnboardingStore.getState().setLocation({ state: "Kerala" });
      useOnboardingStore.getState().nextStep();
      useOnboardingStore.getState().reset();
    });
    const state = useOnboardingStore.getState();
    expect(state.language).toBe("en");
    expect(state.currentStep).toBe(1);
    expect(state.location.state).toBe("");
  });
});
