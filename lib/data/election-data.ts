/**
 * ElectionGuide AI — Election Data Constants
 * All timeline phases and election metadata for the Timeline page.
 */

// ── Election Phase Data ──────────────────────────────────────

export interface TimelinePhase {
  id: string;
  icon: string;
  number: number;
  title: string;
  dateRange: string;
  startDate: string; // ISO for calendar export
  endDate: string;
  status: "completed" | "active" | "upcoming";
  bite: string;  // One-liner
  snack: string; // Paragraph
  meal: {
    overview: string;
    keyDates: Array<{ date: string; event: string }>;
    legalRefs: string[];
    authorities: string[];
    documentation: string[];
    partyRole: string;
  };
  tags: string[];
  statLabel?: string;
  statValue?: string;
  statPercent?: number;
}

export const LOK_SABHA_2024_PHASES: TimelinePhase[] = [
  {
    id: "roll-prep",
    icon: "group_add",
    number: 1,
    title: "Roll Preparation",
    dateRange: "Jan – Mar 2024",
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    status: "completed",
    bite: "Electoral rolls are updated — 97 crore voters verified, new registrations processed.",
    snack: "The Election Commission undertakes a comprehensive revision of electoral rolls. Draft rolls are published, claims and objections are invited (Forms 6, 7, 8, 8A), special drives for first-time voters (18-19 age group) are conducted, and the final rolls are published with photographs. EPIC (Voter ID) cards are distributed to new registrants.",
    meal: {
      overview: "Roll preparation is the foundation of fair elections. The ECI conducts a Summary Revision every year and an Intensive Revision before general elections. Booth Level Officers (BLOs) verify each entry door-to-door. The qualifying date for age eligibility (18 years) is January 1st of the revision year. Special camps are held at accessible locations for persons with disabilities, transgender voters, and elderly citizens.",
      keyDates: [
        { date: "Jan 15, 2024", event: "Draft roll publication" },
        { date: "Jan 15 – Feb 8", event: "Claims & objections period" },
        { date: "Feb 20, 2024", event: "Special summary revision deadline" },
        { date: "Mar 15, 2024", event: "Final roll publication" },
      ],
      legalRefs: [
        "Registration of Electors Rules, 1960",
        "Section 21-25, Representation of the People Act, 1950",
        "ECI Guidelines on Summary Revision of Photo Electoral Rolls",
      ],
      authorities: ["Chief Electoral Officer (CEO)", "District Electoral Officer (DEO)", "Electoral Registration Officer (ERO)", "Booth Level Officer (BLO)"],
      documentation: ["Form 6 (New Registration)", "Form 7 (Objection)", "Form 8 (Correction)", "Form 8A (Transposition)"],
      partyRole: "Political parties can appoint Booth Level Agents (BLAs) to monitor the revision process and file claims/objections on behalf of citizens.",
    },
    tags: ["97Cr Voters", "EPIC Cards", "BLO Verification"],
    statLabel: "Voters Registered",
    statValue: "97 Crore",
    statPercent: 100,
  },
  {
    id: "announcement",
    icon: "campaign",
    number: 2,
    title: "Announcement & MCC",
    dateRange: "Mar 16, 2024",
    startDate: "2024-03-16",
    endDate: "2024-03-16",
    status: "completed",
    bite: "ECI announces the 7-phase schedule — Model Code of Conduct kicks in immediately.",
    snack: "The Chief Election Commissioner holds a press conference to declare the election schedule. From the moment of announcement, the Model Code of Conduct (MCC) comes into force. The government cannot announce new schemes, make transfers of key officials, or use state machinery for campaigning. All ministers become 'caretaker' ministers.",
    meal: {
      overview: "The MCC is a set of guidelines voluntarily agreed upon by political parties. While not statutory law, violation of the MCC can lead to FIRs under IPC/BNS, EC censure, and even cancellation of candidature. The EC activates cVIGIL — a mobile app where citizens can report MCC violations with geo-tagged photos/videos. Flying squads and video surveillance teams are deployed across all constituencies.",
      keyDates: [
        { date: "Mar 16, 2024", event: "Schedule announcement — MCC begins" },
        { date: "Mar 16 onwards", event: "cVIGIL app activated" },
        { date: "Mar 16 onwards", event: "Flying squads deployed" },
      ],
      legalRefs: [
        "Model Code of Conduct (ECI Guideline)",
        "Section 123, Representation of the People Act, 1951",
        "Section 126, RP Act — 48-hour silence period",
      ],
      authorities: ["Election Commission of India (ECI)", "Chief Electoral Officer", "District Magistrate/DC", "Flying Squads"],
      documentation: ["Press Note (Schedule)", "MCC Guidelines Document", "cVIGIL Complaint Reports"],
      partyRole: "Parties must immediately stop all government advertisements, inaugurations of new projects, and fund announcements. Leaders must seek police permission for rallies.",
    },
    tags: ["MCC Active", "7 Phases", "cVIGIL"],
  },
  {
    id: "nominations",
    icon: "history_edu",
    number: 3,
    title: "Nominations & Scrutiny",
    dateRange: "Mar 20 – Apr 4, 2024",
    startDate: "2024-03-20",
    endDate: "2024-04-04",
    status: "completed",
    bite: "Candidates file nomination papers (Form 2B) with affidavits on criminal cases, assets, and education.",
    snack: "Each candidate must file Form 2B (nomination) along with Form 26 (sworn affidavit disclosing criminal cases, assets, liabilities, and educational qualifications). A security deposit of ₹25,000 (₹12,500 for SC/ST candidates) is required. The Returning Officer scrutinizes nominations for validity. Candidates can withdraw within the allowed window.",
    meal: {
      overview: "The nomination process ensures transparency through mandatory disclosure. The Supreme Court in Union of India v. ADR (2002) mandated that candidates disclose criminal antecedents, assets, and education. Section 33A of the RP Act requires disclosure of pending criminal cases. After scrutiny, the RO prepares the final list of contesting candidates and allots symbols per the Election Symbols (Reservation and Allotment) Order, 1968.",
      keyDates: [
        { date: "Phase-wise", event: "Last date for nomination filing" },
        { date: "Phase-wise", event: "Scrutiny of nominations" },
        { date: "Phase-wise", event: "Last date for withdrawal" },
      ],
      legalRefs: [
        "Section 33, Representation of the People Act, 1951",
        "Section 33A, RP Act (Criminal disclosure)",
        "Rule 4A, Conduct of Elections Rules (Form 26 Affidavit)",
        "Election Symbols (Reservation and Allotment) Order, 1968",
      ],
      authorities: ["Returning Officer (RO)", "District Election Officer", "State Election Commission"],
      documentation: ["Form 2B (Nomination)", "Form 26 (Affidavit)", "Security Deposit Receipt", "Withdrawal Form (Form 3)"],
      partyRole: "Parties nominate candidates, provide party tickets, and file Form B (authorization from party president). Independent candidates can also file nominations.",
    },
    tags: ["Form 26", "₹25K Deposit", "Affidavit"],
  },
  {
    id: "campaigning",
    icon: "groups",
    number: 4,
    title: "Campaigning",
    dateRange: "Apr 5 – May 30, 2024",
    startDate: "2024-04-05",
    endDate: "2024-05-30",
    status: "completed",
    bite: "Political parties campaign across 543 constituencies — spending limits of ₹95 lakh per candidate enforced.",
    snack: "Candidates and parties conduct rallies, roadshows, door-to-door canvassing, and media campaigns. ECI enforces spending limits (₹95 lakh for Lok Sabha). Social media advertising requires pre-certification. Campaigning must stop 48 hours before polling in that phase (silence period). Paid news is monitored by the MCMC (Media Certification and Monitoring Committee).",
    meal: {
      overview: "The campaigning phase is the most visible part of elections. ECI has established strict rules: no appeal to religion, caste, or communalism (Section 123 RP Act); no use of government resources; no distribution of liquor, cash, or freebies. Expenditure observers track candidate spending via shadow registers. The 48-hour silence period (Section 126) prohibits public meetings, processions, and exit polls.",
      keyDates: [
        { date: "Phase-wise", event: "Campaigning begins after withdrawal deadline" },
        { date: "48 hrs before poll", event: "Silence period begins (Section 126)" },
        { date: "Throughout", event: "Expenditure monitoring active" },
      ],
      legalRefs: [
        "Section 77, RP Act (Election Expenses)",
        "Section 123, RP Act (Corrupt Practices)",
        "Section 126, RP Act (Silence Period)",
        "Rule 90, Conduct of Elections Rules (Expenditure Limits)",
      ],
      authorities: ["Expenditure Observer", "MCMC", "Flying Squads", "Static Surveillance Teams"],
      documentation: ["Daily Expenditure Register", "Media Certification Forms", "cVIGIL Reports", "Shadow Expenditure Register"],
      partyRole: "Parties submit manifesto commitments, participate in media debates, organize rallies (with police permission), and manage candidate spending.",
    },
    tags: ["₹95L Limit", "Silence Period", "Media Monitoring"],
  },
  {
    id: "polling",
    icon: "how_to_vote",
    number: 5,
    title: "7-Phase Polling",
    dateRange: "Apr 19 – Jun 1, 2024",
    startDate: "2024-04-19",
    endDate: "2024-06-01",
    status: "completed",
    bite: "642 million voters cast their ballots across 7 phases using EVMs with VVPAT verification.",
    snack: "Polling is conducted in 7 phases to allow redeployment of central security forces. Each voter's identity is verified (EPIC or approved ID), indelible ink is applied, and they vote on EVMs with VVPAT. Mock polls are conducted every morning before actual voting begins. Webcasting from polling stations ensures real-time monitoring.",
    meal: {
      overview: "India's general election is the largest democratic exercise in the world. The 2024 Lok Sabha election was conducted in 7 phases across 543 constituencies, 10.5 lakh polling stations, with 1.5 crore polling personnel. EVMs (M3 generation) with VVPAT were used universally. Special facilities include ramps for wheelchair access, Braille ballot sheets, and postal ballots for service voters. Vulnerability Mapping identifies sensitive areas for enhanced security deployment.",
      keyDates: [
        { date: "Apr 19, 2024", event: "Phase 1 — 102 constituencies" },
        { date: "Apr 26, 2024", event: "Phase 2 — 89 constituencies" },
        { date: "May 7, 2024", event: "Phase 3 — 94 constituencies" },
        { date: "May 13, 2024", event: "Phase 4 — 96 constituencies" },
        { date: "May 20, 2024", event: "Phase 5 — 49 constituencies" },
        { date: "May 25, 2024", event: "Phase 6 — 58 constituencies" },
        { date: "Jun 1, 2024", event: "Phase 7 — 57 constituencies" },
      ],
      legalRefs: [
        "Section 49A-49MA, RP Act (Voting Machines)",
        "Rule 49MA, Conduct of Elections Rules (VVPAT)",
        "Section 62, RP Act (Right to Vote)",
        "Section 171F, IPC/BNS (Undue Influence)",
      ],
      authorities: ["Presiding Officer", "Polling Officers (1-4)", "Micro Observer", "Central Armed Police Forces (CAPF)", "Sector Magistrate"],
      documentation: ["Form 17A (Register of Voters)", "Form 17C Part I (Account of Votes)", "Voter Slips", "Presiding Officer's Diary"],
      partyRole: "Each party can appoint one polling agent per booth to observe the process, challenge impersonators, and maintain a parallel count of voters.",
    },
    tags: ["7 Phases", "EVM+VVPAT", "642M Turnout"],
    statLabel: "Voter Turnout",
    statValue: "66.4%",
    statPercent: 66.4,
  },
  {
    id: "counting",
    icon: "analytics",
    number: 6,
    title: "Counting & Results",
    dateRange: "Jun 4, 2024",
    startDate: "2024-06-04",
    endDate: "2024-06-04",
    status: "completed",
    bite: "EVM votes counted at 1,100+ centres — VVPAT slips from 5 booths per constituency verified.",
    snack: "On counting day, EVMs are brought from strong rooms under security escort. Round-wise counting proceeds with candidates' counting agents present. Per Supreme Court order (2019), VVPAT slips from 5 randomly selected booths per assembly segment are physically counted and matched against EVM totals. Results are declared on Form 21C (Assembly) / 21E (Parliamentary).",
    meal: {
      overview: "Counting is conducted in a 3-tier security cordon: outer (CAPF), middle (State Armed Police), inner (District Armed Police). The Returning Officer supervises. Postal ballots are counted first, then EVM rounds. Each round covers a fixed number of EVMs. The counting process is videographed end-to-end. Form 17C Part II (Result of Counting) is prepared, signed by the RO, and shared with all candidates' agents. Any candidate can apply for a recount under Section 64A of the RP Act.",
      keyDates: [
        { date: "Jun 4, 2024", event: "Counting Day" },
        { date: "Jun 4, 2024", event: "Postal ballots counted first" },
        { date: "Jun 4, 2024", event: "VVPAT verification (5 booths)" },
        { date: "Jun 4, 2024", event: "Results declared" },
      ],
      legalRefs: [
        "Section 64, RP Act (Counting of Votes)",
        "Section 64A, RP Act (Recount)",
        "Rule 56C, Conduct of Elections Rules (VVPAT)",
        "Supreme Court Order on VVPAT (2019)",
      ],
      authorities: ["Returning Officer", "Observer (General/Expenditure)", "Counting Supervisors", "Central Armed Police Forces"],
      documentation: ["Form 17C Part II (Result)", "Form 20 (Return of Election)", "Form 21C/21E (Result Declaration)", "VVPAT Verification Report"],
      partyRole: "Each candidate can appoint 14 counting agents plus one authorized representative. Any candidate with >50% of winning margin can request recount.",
    },
    tags: ["VVPAT Audit", "Form 17C", "3-Tier Security"],
    statLabel: "Results Declared",
    statValue: "543/543",
    statPercent: 100,
  },
];

// ── Stats ─────────────────────────────────────────────────────
export const ELECTION_STATS = [
  { icon: "badge", value: "1.5 Cr", label: "Election Officials" },
  { icon: "groups", value: "97 Crore", label: "Eligible Voters" },
  { icon: "location_city", value: "543", label: "Constituencies" },
  { icon: "apartment", value: "10.5 Lakh", label: "Polling Stations" },
];

// ── Upcoming Elections ────────────────────────────────────────
export const UPCOMING_ELECTIONS = [
  { name: "Delhi Assembly", date: "2025-02-05", type: "assembly" as const, state: "Delhi", seats: 70 },
  { name: "Bihar Assembly", date: "2025-10-01", type: "assembly" as const, state: "Bihar", seats: 243 },
  { name: "Maharashtra Assembly", date: "2024-11-20", type: "assembly" as const, state: "Maharashtra", seats: 288 },
  { name: "Jharkhand Assembly", date: "2024-11-20", type: "assembly" as const, state: "Jharkhand", seats: 81 },
];

// ── Voter Journey Steps ───────────────────────────────────────
export interface VoterJourneyStep {
  number: number;
  icon: string;
  title: string;
  description: string;
  detail: string;
  duration: string;
}

export const VOTER_JOURNEY_STEPS: VoterJourneyStep[] = [
  {
    number: 1,
    icon: "badge",
    title: "Identity Verification",
    description: "Show EPIC or approved ID to Polling Officer",
    detail: "The presiding officer verifies your identity against the marked copy of the electoral roll (Form 17A). Your voter slip number and EPIC number are matched. If challenged, you may be required to sign a declaration.",
    duration: "1-2 min",
  },
  {
    number: 2,
    icon: "water_drop",
    title: "Indelible Ink Application",
    description: "Ink applied to left index finger nail",
    detail: "Indelible ink (silver nitrate based) is applied to the left index finger nail to prevent double voting. The ink mark lasts 4-6 weeks. If you don't have a left index finger, ink is applied to the next available finger.",
    duration: "10 sec",
  },
  {
    number: 3,
    icon: "receipt_long",
    title: "Voter Slip Issued",
    description: "Receive slip with serial number",
    detail: "The second polling officer issues a voter slip with your serial number. Your signature or thumb impression is taken on Form 17A. The serial number matches your ballot unit entry.",
    duration: "30 sec",
  },
  {
    number: 4,
    icon: "power_settings_new",
    title: "Booth Activation",
    description: "Presiding Officer activates your ballot",
    detail: "The Presiding Officer presses the 'Ballot' button on the Control Unit (CU) to activate one vote for you. A green 'Ready' light glows on the Ballot Unit. Only one vote can be cast per activation — the CU prevents multiple votes.",
    duration: "5 sec",
  },
  {
    number: 5,
    icon: "touch_app",
    title: "Press Blue Button",
    description: "Press the blue button next to your candidate",
    detail: "Inside the voting compartment, press the blue button on the Ballot Unit (BU) next to your chosen candidate's name and symbol. Each candidate has a unique button. The button is tactile with Braille markings for visually impaired voters.",
    duration: "5-15 sec",
  },
  {
    number: 6,
    icon: "light_mode",
    title: "Red Light Glows",
    description: "Red light confirms vote registered",
    detail: "A red light glows next to the candidate's name on the BU, confirming your vote was registered electronically. Simultaneously, the CU records the vote in its internal memory.",
    duration: "Instant",
  },
  {
    number: 7,
    icon: "print",
    title: "VVPAT Slip Printed",
    description: "Paper slip shows candidate name for 7 seconds",
    detail: "The VVPAT printer generates a paper slip showing: candidate's name, serial number, and party symbol. The slip is visible through a transparent window for exactly 7 seconds, allowing you to verify your vote was correctly recorded.",
    duration: "7 sec",
  },
  {
    number: 8,
    icon: "inventory_2",
    title: "Slip Drops in Sealed Box",
    description: "VVPAT slip falls into sealed container",
    detail: "After 7 seconds, the VVPAT slip automatically drops into a sealed, tamper-evident container below the printer. These slips serve as the paper audit trail for verification during counting.",
    duration: "Instant",
  },
  {
    number: 9,
    icon: "volume_up",
    title: "Confirmation Beep",
    description: "Audible beep confirms successful vote",
    detail: "A long beep from the CU confirms your vote has been successfully cast and recorded. You can now exit the voting compartment. The entire voting process takes approximately 30 seconds.",
    duration: "1 sec",
  },
];
