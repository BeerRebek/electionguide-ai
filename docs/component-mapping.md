# Component Mapping — Stitch Designs → React Components

## Landing Page
| Stitch File | React Component | Path |
|-------------|----------------|------|
| `electionguide_ai_landing_page/code.html` (header) | `<Navbar />` | `/components/shared/Navbar.tsx` |
| `electionguide_ai_landing_page/code.html` (hero) | `<Hero />` | `/components/features/landing/Hero.tsx` |
| `electionguide_ai_landing_page/code.html` (trust badges) | `<TrustBadges />` | `/components/features/landing/TrustBadges.tsx` |
| `electionguide_ai_landing_page/code.html` (feature grid) | `<FeatureGrid />` | `/components/features/landing/FeatureGrid.tsx` |
| `electionguide_ai_landing_page/code.html` (stats bar) | `<StatsBar />` | `/components/features/landing/StatsBar.tsx` |
| `electionguide_ai_landing_page/code.html` (footer) | `<Footer />` | `/components/shared/Footer.tsx` |

## Onboarding Flow
| Stitch File | React Component | Path |
|-------------|----------------|------|
| `language_selection/code.html` | `<LanguageSelection />` | `/components/features/onboarding/LanguageSelection.tsx` |
| `location_setup/code.html` | `<LocationSetup />` | `/components/features/onboarding/LocationSetup.tsx` |
| `notification_preferences/code.html` | `<NotificationPrefs />` | `/components/features/onboarding/NotificationPrefs.tsx` |
| `voter_profile/code.html` | `<VoterProfile />` | `/components/features/onboarding/VoterProfile.tsx` |

## Dashboard
| Stitch File | React Component | Path |
|-------------|----------------|------|
| `user_dashboard/code.html` (sidebar) | `<DashboardSidebar />` | `/components/features/dashboard/Sidebar.tsx` |
| `user_dashboard/code.html` (hero card) | `<DashboardHero />` | `/components/features/dashboard/HeroCard.tsx` |
| `user_dashboard/code.html` (quick actions) | `<QuickActions />` | `/components/features/dashboard/QuickActions.tsx` |
| `user_dashboard/code.html` (journey) | `<ElectionJourney />` | `/components/features/dashboard/ElectionJourney.tsx` |
| `user_dashboard/code.html` (notifications) | `<NotificationsPanel />` | `/components/features/dashboard/NotificationsPanel.tsx` |

## AI Chat
| Stitch File | React Component | Path |
|-------------|----------------|------|
| `ai_assistant_chat/code.html` (sidebar) | `<ChatSidebar />` | `/components/features/chat/ChatSidebar.tsx` |
| `ai_assistant_chat/code.html` (messages) | `<ChatMessages />` | `/components/features/chat/ChatMessages.tsx` |
| `ai_assistant_chat/code.html` (input) | `<ChatInput />` | `/components/features/chat/ChatInput.tsx` |
| `ai_assistant_chat/code.html` (sources) | `<SourcesPanel />` | `/components/features/chat/SourcesPanel.tsx` |

## Election Timeline
| Stitch File | React Component | Path |
|-------------|----------------|------|
| `election_lifecycle_timeline/code.html` | `<TimelinePage />` | `/components/features/timeline/TimelinePage.tsx` |

## EVM/VVPAT Explainer
| Stitch File | React Component | Path |
|-------------|----------------|------|
| `evm_vvpat_deep_dive_guide/code.html` | `<EvmExplainer />` | `/components/features/guides/EvmExplainer.tsx` |

## Voter Registration Wizard
| Stitch File | React Component | Path |
|-------------|----------------|------|
| `registration_wizard_eligibility_check/code.html` | `<EligibilityCheck />` | `/components/features/registration/EligibilityCheck.tsx` |
| `registration_wizard_form_selection/code.html` | `<FormSelection />` | `/components/features/registration/FormSelection.tsx` |
| `registration_wizard_document_checklist/code.html` | `<DocumentChecklist />` | `/components/features/registration/DocumentChecklist.tsx` |
| `registration_wizard_application_mode/code.html` | `<ApplicationMode />` | `/components/features/registration/ApplicationMode.tsx` |

## Quiz Module
| Stitch File | React Component | Path |
|-------------|----------------|------|
| `quiz_lobby_test_your_knowledge/code.html` | `<QuizLobby />` | `/components/features/quiz/QuizLobby.tsx` |
| `quiz_active_question_feedback/code.html` | `<QuizActive />` | `/components/features/quiz/QuizActive.tsx` |
| `quiz_results_certificate/code.html` | `<QuizResults />` | `/components/features/quiz/QuizResults.tsx` |

## Candidate KYC
| Stitch File | React Component | Path |
|-------------|----------------|------|
| `know_your_candidates_overview/code.html` | `<CandidateOverview />` | `/components/features/candidates/CandidateOverview.tsx` |
| `candidate_deep_dive_profile/code.html` | `<CandidateProfile />` | `/components/features/candidates/CandidateProfile.tsx` |

## Accessibility (GIGW 3.0 additions — not in Stitch)
| Component | Path |
|-----------|------|
| `<SkipToContent />` | `/components/accessibility/SkipToContent.tsx` |
| `<FontSizeControls />` | `/components/accessibility/FontSizeControls.tsx` |
| `<ContrastToggle />` | `/components/accessibility/ContrastToggle.tsx` |
| `<LanguageSwitcher />` | `/components/accessibility/LanguageSwitcher.tsx` |
| `<ScreenReaderOnly />` | `/components/accessibility/ScreenReaderOnly.tsx` |
| `<FocusTrap />` | `/components/accessibility/FocusTrap.tsx` |
