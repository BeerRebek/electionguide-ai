/**
 * ElectionGuide AI — EVM Lifecycle Data
 * 9-stage lifecycle with bite/snack/meal content, security info, and legal references.
 */

export interface EVMLifecycleStage {
  id: string;
  number: number;
  icon: string;
  title: string;
  subtitle: string;
  color: "primary" | "secondary" | "tertiary";
  bite: string;
  snack: string;
  meal: string;
  legalProvisions: string[];
  securityProtocols: string[];
  authorities: string[];
  technicalChecks: string[];
  partyInvolvement: string;
  documentation: string[];
}

export const EVM_LIFECYCLE_STAGES: EVMLifecycleStage[] = [
  {
    id: "concept-design",
    number: 1,
    icon: "lightbulb",
    title: "Concept, Design & Procurement",
    subtitle: "BEL & ECIL Manufacturing",
    color: "primary",
    bite: "EVMs designed and manufactured exclusively by two PSUs — BEL (Bangalore) and ECIL (Hyderabad) — with no foreign components in the M3 generation.",
    snack: "The ECI commissions EVM production only from Bharat Electronics Limited (BEL) and Electronics Corporation of India Limited (ECIL). The current M3 generation (post-2013) features a one-time programmable (OTP) chip that cannot be reprogrammed, re-read, or overwritten. The machines have no wireless or internet capability — they are standalone, battery-operated devices. Each EVM has three components: Control Unit (CU), Ballot Unit (BU), and VVPAT printer.",
    meal: "The M3 EVM represents the third major evolution since India first used EVMs in 1982 (Kerala by-election). Key design improvements include: tamper-detection that makes the EVM self-destruct if opened, dynamic coding between CU and BU (codes change with every vote), an EVM Tracking System (ETS) that logs every machine's movement nationwide, and a dedicated Display Unit with results memory. The firmware is burned into the chip at the manufacturing stage and cannot be altered post-production. The chip is designed, developed, and manufactured entirely in India — no foreign company has access to the source code.",
    legalProvisions: [
      "Section 61A, Representation of the People Act, 1951",
      "Rule 49A-49MA, Conduct of Elections Rules, 1961",
      "ECI Technical Expert Committee Reports (2006, 2009, 2017)",
    ],
    securityProtocols: [
      "One-Time Programmable (OTP) microchip — cannot be reprogrammed",
      "Dynamic coding between CU and BU changes with every button press",
      "Self-destruct mechanism if machine is tampered with",
      "No wireless, Bluetooth, Wi-Fi, or internet capability",
    ],
    authorities: ["Election Commission of India", "BEL (Bharat Electronics Limited)", "ECIL (Electronics Corporation of India Limited)", "ECI Technical Expert Committee"],
    technicalChecks: [
      "Factory acceptance testing (FAT)",
      "Environmental testing (temperature, humidity, vibration)",
      "Battery life testing (minimum 10 years standby)",
      "Firmware verification against ECI-approved build",
    ],
    partyInvolvement: "No direct party involvement at manufacturing stage. However, political parties can raise objections about EVM design through parliamentary committees and the Supreme Court.",
    documentation: ["EVM Technical Specification Document", "Manufacturing Quality Control Report", "Chip Design Verification Report"],
  },
  {
    id: "storage-non-election",
    number: 2,
    icon: "warehouse",
    title: "Storage (Non-Election Period)",
    subtitle: "District Warehouse Security",
    color: "secondary",
    bite: "EVMs stored in district warehouses under double-lock system with CCTV surveillance during non-election periods.",
    snack: "Between elections, EVMs are stored in designated district warehouses. Each warehouse has a double-lock system — one key with the District Election Officer (DEO) and one with the treasury officer. Regular physical audits ensure inventory accuracy. The EVM Tracking System (ETS) records the location and status of every machine.",
    meal: "The non-election storage protocol ensures that EVMs remain tamper-proof during the long gaps between elections. Warehouses must meet ECI specifications: reinforced walls, single controlled entry, 24/7 CCTV with recording, humidity control to preserve electronics, and fire suppression systems. Monthly physical verification is mandatory with reports submitted to the CEO. Any discrepancy triggers an immediate investigation. The M3 generation batteries have a standby life of approximately 10 years, so batteries are periodically tested. District authorities must maintain a serial-number-wise register matching the ETS database.",
    legalProvisions: [
      "ECI Guideline on Storage of EVMs (2018)",
      "Section 61A, RP Act provisions on custody",
      "State Election Department circulars on warehouse standards",
    ],
    securityProtocols: [
      "Double-lock system (DEO + Treasury Officer keys)",
      "24/7 CCTV with 90-day recording retention",
      "Monthly physical verification audit",
      "EVM Tracking System (ETS) barcode scanning",
    ],
    authorities: ["District Election Officer (DEO)", "Treasury Officer", "Warehouse In-charge", "Chief Electoral Officer (CEO)"],
    technicalChecks: [
      "Battery voltage check (quarterly)",
      "Humidity and temperature monitoring",
      "Seal integrity verification",
      "ETS database reconciliation",
    ],
    partyInvolvement: "Political parties do not have access to storage warehouses. However, warehouse location information is available publicly, and parties can raise concerns with the CEO.",
    documentation: ["Monthly Verification Report", "ETS Movement Log", "CCTV Recording Register", "Warehouse Inspection Report"],
  },
  {
    id: "distribution",
    number: 3,
    icon: "local_shipping",
    title: "Procurement & Distribution",
    subtitle: "Pre-Election Logistics",
    color: "tertiary",
    bite: "EVMs transported under armed escort from warehouses to constituencies for election deployment.",
    snack: "Before an election, the required number of EVMs are withdrawn from warehouses based on the number of constituencies and polling stations. Each machine is barcoded and logged in the ETS. Transportation happens under armed police escort with GPS tracking. Receiving officers verify serial numbers against dispatch manifests.",
    meal: "The distribution phase requires meticulous logistical planning. For a Lok Sabha election, approximately 5-6 million EVMs (CU + BU pairs) plus an equal number of VVPATs need to be distributed across the country. Replacement EVMs (typically 15-20% extra) are also dispatched. The ETS ensures real-time visibility of every machine. All vehicles used for transport are sealed and tracked. At the receiving end, the District Election Officer verifies each machine against the dispatch inventory before proceeding to First Level Checking.",
    legalProvisions: [
      "ECI Instruction No. 464/Inst/2007-EPS",
      "State transport guidelines for election material",
      "ETS Protocol for movement tracking",
    ],
    securityProtocols: [
      "Armed police escort for all EVM transports",
      "GPS tracking of transport vehicles",
      "Sealed transport containers",
      "Serial-number verification at dispatch and receipt",
    ],
    authorities: ["District Election Officer", "Superintendent of Police", "Transport Officer", "Receiving Officer"],
    technicalChecks: [
      "Pre-dispatch functional test",
      "Serial number barcode scanning",
      "Physical damage inspection",
      "Manifest cross-verification",
    ],
    partyInvolvement: "Political parties are informed about the number of EVMs being distributed but do not participate directly in the transport process.",
    documentation: ["Dispatch Manifest", "Receipt Verification Report", "ETS Movement Log", "Transport Vehicle Log"],
  },
  {
    id: "flc",
    number: 4,
    icon: "engineering",
    title: "First Level Checking (FLC)",
    subtitle: "Technical Inspection by BEL/ECIL",
    color: "primary",
    bite: "Every single EVM is individually tested by BEL/ECIL engineers in presence of political party representatives.",
    snack: "FLC is a comprehensive functional test conducted by engineers from BEL/ECIL. Every CU, BU, and VVPAT is individually checked. Political party representatives are invited to witness the process. Tests include: button functionality, display accuracy, battery voltage, VVPAT print quality, seal integrity, and mock voting with at least 1,000 test votes per machine. Defective units are rejected and sent back to the manufacturer.",
    meal: "First Level Checking is one of the most critical transparency measures in the Indian EVM system. It happens months before the election to allow time for repairs/replacements. The process typically runs for several weeks in each district. Party representatives can observe every test, note serial numbers, and raise objections. The FLC protocol includes: (1) Visual inspection of all external parts, seals, and connections; (2) Battery voltage measurement; (3) Button response testing for all candidate positions; (4) VVPAT print alignment and clarity check; (5) Display accuracy verification; (6) Mock voting with 1,000+ cycles; (7) End-to-end vote count verification between CU display and VVPAT slips; (8) Seal application and serial number recording.",
    legalProvisions: [
      "ECI Standard Operating Procedure for FLC (2017, updated 2023)",
      "Supreme Court directions on transparent EVM testing",
      "Section 61A read with Rule 49A-49MA",
    ],
    securityProtocols: [
      "BEL/ECIL engineers conduct all technical tests",
      "Political party representatives invited to observe",
      "1,000+ mock votes per machine",
      "Defective machines immediately rejected and logged",
    ],
    authorities: ["BEL/ECIL Engineers", "District Election Officer", "Party Representatives", "ECI Observer"],
    technicalChecks: [
      "Button functionality test (all candidate positions)",
      "Display accuracy verification",
      "Battery voltage measurement (>5.0V required)",
      "VVPAT print quality and alignment",
      "1,000+ cycle mock voting",
      "CU-VVPAT vote count cross-verification",
    ],
    partyInvolvement: "Full transparency — all recognized political parties are formally invited. Party representatives can observe every machine's test, note serial numbers, and raise objections. Their attendance is recorded.",
    documentation: ["FLC Certificate (per machine)", "Party Representative Attendance Register", "Defective Machine List", "Mock Voting Result Sheet"],
  },
  {
    id: "randomization",
    number: 5,
    icon: "shuffle",
    title: "Two-Stage Randomization",
    subtitle: "Anti-Tampering Allocation",
    color: "secondary",
    bite: "EVMs undergo two rounds of computer-generated random allocation — making it impossible to predict which machine goes where.",
    snack: "Randomization is a critical anti-tampering measure. In the first randomization, the DEO uses ECI's software to randomly assign EVMs from the FLC-cleared pool to constituencies. In the second randomization, EVMs are randomly assigned from constituencies to specific polling stations. This two-stage process is conducted in the presence of party representatives, who can note machine serial numbers at each stage.",
    meal: "The two-stage randomization is designed to defeat any theoretical attempt to pre-load or tamper with specific machines. Even if someone had access to a machine during manufacturing or storage, they cannot predict which constituency or booth it will be assigned to. The randomization software is provided by ECI and uses secure random number generation. Party representatives are encouraged to record serial numbers — this creates a paper trail. The gap between the two randomizations is typically several days to weeks, adding another layer of unpredictability. Some parties send teams to verify that the machines at booths match the serial numbers noted during the second randomization.",
    legalProvisions: [
      "ECI Guidelines on Randomization of EVMs (2006, updated 2019)",
      "Supreme Court direction on two-stage randomization",
      "Software protocol approved by ECI Technical Expert Committee",
    ],
    securityProtocols: [
      "ECI-approved randomization software",
      "Two separate randomization events",
      "Political party representatives witness both rounds",
      "Serial numbers disclosed to party agents",
    ],
    authorities: ["District Election Officer", "Returning Officer", "IT Nodal Officer", "Party Representatives"],
    technicalChecks: [
      "Software integrity verification before randomization",
      "Random seed generation transparency",
      "Serial number cross-check against FLC database",
      "Result printout shared with all party agents",
    ],
    partyInvolvement: "Essential — party representatives must be invited (and their attendance recorded) for both rounds. They can note serial numbers and verify the randomization software output.",
    documentation: ["Randomization Result Print (Round 1 & 2)", "Party Representative Attendance Sheet", "Serial Number Allocation Chart", "Software Audit Log"],
  },
  {
    id: "commissioning",
    number: 6,
    icon: "settings",
    title: "Commissioning (Candidate Setting)",
    subtitle: "Setting Up Candidate Lists",
    color: "tertiary",
    bite: "After nominations finalize, each EVM is programmed with the specific candidate list for that constituency.",
    snack: "Commissioning happens after the withdrawal deadline when the final candidate list is confirmed. The Returning Officer oversees the loading of candidate names, serial numbers, and party symbols onto each BU and VVPAT. This is done in the presence of candidates or their agents. A test vote for each candidate is cast to verify correct mapping. The BU candidate strip is prepared with names in the order prescribed by ECI rules.",
    meal: "Commissioning is a highly supervised process. The candidate setting involves: (1) Printing BU candidate strips with names, serial numbers, and party symbols in the prescribed order; (2) Setting the VVPAT to print corresponding slips; (3) Conducting a test vote for every single candidate position; (4) Verifying that each button on the BU correctly maps to the intended candidate; (5) Checking VVPAT output matches the BU selection; (6) Sealing the machines with tamper-evident seals; (7) Recording seal numbers and sharing with candidates. The entire process is videographed. Candidates/agents can verify every step and note seal numbers for later verification at the polling station.",
    legalProvisions: [
      "Rule 49E-49G, Conduct of Elections Rules, 1961",
      "ECI Instruction on Commissioning Protocol",
      "Supreme Court guidelines on transparency in EVM setting",
    ],
    securityProtocols: [
      "Conducted in presence of candidates/agents",
      "Test vote for every candidate position",
      "Tamper-evident seal application",
      "Complete videography of the process",
    ],
    authorities: ["Returning Officer", "BEL/ECIL Engineer", "Candidates / Authorized Agents", "ECI Observer"],
    technicalChecks: [
      "Candidate name-button mapping verification",
      "VVPAT print verification for all candidates",
      "Seal number recording",
      "Final functional test before sealing",
    ],
    partyInvolvement: "Candidates or their authorized agents are present. They verify candidate order, test every button position, note seal numbers, and can raise objections before the RO.",
    documentation: ["Commissioning Report", "Candidate Setting Verification Sheet", "Seal Number Register", "Videography Record"],
  },
  {
    id: "poll-day",
    number: 7,
    icon: "how_to_vote",
    title: "Poll Day Operations",
    subtitle: "Identity → Activation → Mock Poll → Voting",
    color: "primary",
    bite: "On polling day: mock poll at 5:30 AM, seal verification, booth activation, then actual voting from 7 AM to 6 PM.",
    snack: "Poll day begins early: the Presiding Officer conducts a mock poll (minimum 50 votes) at 5:30 AM in the presence of polling agents. Results are tallied against VVPAT slips. If they match, the EVM is cleared, reset, sealed, and actual voting begins at 7 AM. Each voter goes through: identity verification (Form 17A), indelible ink application, ballot activation by PO, vote casting on BU, VVPAT verification (7 seconds), and confirmation beep.",
    meal: "Poll day is the culmination of months of preparation. The sequence is: (1) Presiding Officer verifies seals match commissioning records — candidates' agents can cross-check; (2) Mock poll: minimum 50 votes cast with all candidate buttons tested, CU display and VVPAT slips counted and matched; (3) If mock poll passes, the EVM is 'clear all' reset, re-sealed, and ready; (4) Voting commences at 7 AM — the green light on CU indicates readiness; (5) Each voter's identity is verified against Form 17A; (6) Indelible ink is applied; (7) PO activates one ballot by pressing 'Ballot' button on CU; (8) Voter enters the secret compartment and presses the blue button next to their candidate; (9) Red light glows, VVPAT prints slip visible for 7 seconds, slip drops, beep sounds; (10) At close of poll (6 PM or after last voter in queue), the PO presses the 'Close' button, making the EVM reject any further votes; (11) Form 17C Part I is prepared with the total vote count.",
    legalProvisions: [
      "Section 56-59, RP Act (Polling Procedures)",
      "Rule 49A-49MA, Conduct of Elections Rules",
      "ECI Handbook for Presiding Officers",
      "Section 62, RP Act (Right to Vote)",
    ],
    securityProtocols: [
      "Pre-poll mock test: 50+ votes, all candidate buttons",
      "Seal verification by candidates' agents",
      "3-tier security around polling station",
      "Webcasting for real-time monitoring",
    ],
    authorities: ["Presiding Officer", "Polling Officers (1-4)", "Sector Magistrate", "Micro Observer", "CAPF Personnel"],
    technicalChecks: [
      "Seal integrity verification",
      "Mock poll: 50+ votes, CU-VVPAT match",
      "Clear-all reset after mock poll",
      "Voter count reconciliation at close of poll",
    ],
    partyInvolvement: "Each party appoints one polling agent per booth. Agents witness mock poll, verify seals, challenge suspected impersonators (Form 7), and maintain parallel voter count.",
    documentation: ["Form 17A (Voters Register)", "Form 17C Part I (Account of Votes)", "Mock Poll Certificate", "Presiding Officer's Diary", "Voter Slips"],
  },
  {
    id: "counting",
    number: 8,
    icon: "analytics",
    title: "Counting of Votes",
    subtitle: "Round-wise EVM + VVPAT Verification",
    color: "secondary",
    bite: "Round-wise counting with 3-tier security — VVPAT slips from 5 random booths per constituency are physically verified.",
    snack: "Counting happens in designated centres under 3-tier security. EVMs are brought from strong rooms under escort. Postal ballots are counted first. Then, EVM counting proceeds round by round — each round covers a set number of booths. The RO displays the CU totals for each round. After all rounds, VVPAT slips from 5 randomly selected booths per assembly segment are physically counted and matched against the CU total. If they match, results are declared on Form 21C/21E.",
    meal: "The counting process has evolved significantly. The current protocol: (1) Strong room opening at 8 AM under videography; (2) Postal ballots counted first — Returning Officer authenticates each postal ballot; (3) EVM counting begins — typically 14 rounds with 2 tables per round; (4) At each table, the RO or Assistant RO breaks CU seals, displays round-wise results; (5) Counting agents record numbers for parallel tallying; (6) After all EVM rounds, 5 randomly selected booths per assembly segment undergo VVPAT slip counting; (7) Random selection done by drawing lots in presence of candidates; (8) VVPAT sealed boxes opened, slips sorted candidate-wise and counted; (9) If CU total matches VVPAT slip count (within ±0), the result stands; (10) Any discrepancy triggers a detailed investigation; (11) Results declared on Form 21C (Assembly) or Form 21E (Parliamentary); (12) Return of Election (Form 20) filed with the ECI.",
    legalProvisions: [
      "Section 64-66A, RP Act (Counting Procedures)",
      "Rule 56C, Conduct of Elections Rules (VVPAT Verification)",
      "Supreme Court Order on 5-booth VVPAT verification (2019)",
      "Section 64A, RP Act (Recount provisions)",
    ],
    securityProtocols: [
      "3-tier security cordon (CAPF, SAP, DAP)",
      "Videography of entire counting process",
      "VVPAT verification of 5 random booths per assembly segment",
      "Strong room opening under official observation",
    ],
    authorities: ["Returning Officer", "General Observer", "Expenditure Observer", "Counting Supervisors", "Central Armed Police Forces"],
    technicalChecks: [
      "Seal integrity check before opening CU",
      "Round-wise CU display verification",
      "VVPAT slip count vs CU total reconciliation",
      "Form 17C Part II preparation",
    ],
    partyInvolvement: "Each candidate can appoint up to 14 counting agents plus one authorized representative. Agents verify every round's figures. Any candidate can request a recount if the margin is narrow (>50% of winning margin).",
    documentation: ["Form 17C Part II (Result of Counting)", "Form 20 (Return of Election)", "Form 21C/21E (Declaration of Result)", "VVPAT Verification Report", "Recount Application (if any)"],
  },
  {
    id: "post-poll-storage",
    number: 9,
    icon: "lock",
    title: "Post-Poll Storage & Disposal",
    subtitle: "Strong Room → Warehouse → Lifecycle End",
    color: "tertiary",
    bite: "After counting, EVMs return to strong rooms for 45 days (petition period), then back to warehouses for the next election.",
    snack: "Post-counting, EVMs are re-sealed and stored in strong rooms for a minimum of 45 days — the statutory period for filing election petitions. If petitions are filed, the EVMs are preserved until court resolution. After the preservation period, machines are returned to district warehouses, batteries are tested, and units are logged back into the ETS for the next election cycle. EVMs have a usable lifespan of approximately 15 years.",
    meal: "The post-poll lifecycle ensures that evidence is preserved for legal challenges. The 45-day preservation period corresponds to the limitation period under Section 81 of the RP Act for filing election petitions in the High Court. Key protocols: (1) EVMs remain sealed in strong rooms with CCTV; (2) If an election petition is filed, the court may order the EVMs to be produced and even re-counted; (3) The court can order VVPAT slips to be counted for any or all booths; (4) After all legal processes are complete, EVMs are returned to normal storage; (5) At end of life (approximately 15 years), EVMs are systematically destroyed under ECI supervision — chips are physically crushed to prevent any data recovery; (6) A Destruction Certificate is issued and logged in the ETS; (7) BEL/ECIL may recycle some electronic components under supervised conditions.",
    legalProvisions: [
      "Section 81, RP Act (Election Petitions — 45-day limit)",
      "Section 86-87, RP Act (Trial of Election Petitions)",
      "ECI Guidelines on Post-Poll EVM Preservation",
      "ECI Protocol on EVM Destruction at End of Life",
    ],
    securityProtocols: [
      "45-day mandatory preservation in strong rooms",
      "CCTV continues during preservation period",
      "Court-ordered preservation if election petition filed",
      "Supervised destruction with chip crushing at end of life",
    ],
    authorities: ["District Election Officer", "Returning Officer", "High Court (for election petitions)", "BEL/ECIL (for disposal)"],
    technicalChecks: [
      "Battery condition check before re-warehousing",
      "ETS status update to 'post-poll preserved'",
      "Physical verification against counting records",
      "Destruction certificate for end-of-life units",
    ],
    partyInvolvement: "Candidates who file election petitions can request the court to order EVM and VVPAT slip examination. During the preservation period, candidates can apply to the court for access.",
    documentation: ["Post-Poll Preservation Register", "ETS Return Entry", "Battery Condition Report", "Destruction Certificate (end of life)", "Court Order (if election petition)"],
  },
];

// ── Security Features Grid ────────────────────────────────────
export interface SecurityFeature {
  icon: string;
  title: string;
  description: string;
  category: "physical" | "digital" | "procedural";
}

export const SECURITY_FEATURES: SecurityFeature[] = [
  {
    icon: "lock",
    title: "3-Level Physical Access Control",
    description: "CAPF outer ring, State Armed Police middle ring, and District Armed Police inner ring protect every counting centre.",
    category: "physical",
  },
  {
    icon: "door_front",
    title: "DFMD Screening",
    description: "Door Frame Metal Detectors at all entry points prevent unauthorized electronic devices near EVMs.",
    category: "physical",
  },
  {
    icon: "videocam",
    title: "24/7 CCTV + Webcasting",
    description: "All strong rooms and many polling stations have CCTV with live webcasting to ECI headquarters.",
    category: "physical",
  },
  {
    icon: "receipt",
    title: "Pink Paper Seals",
    description: "Unique pink paper seals with serial numbers are applied at commissioning. Any tampering breaks the seal visibly.",
    category: "physical",
  },
  {
    icon: "qr_code",
    title: "Address Tags & Barcodes",
    description: "Each EVM carries address tags and barcodes linking it to the EVM Tracking System (ETS) for end-to-end traceability.",
    category: "digital",
  },
  {
    icon: "verified",
    title: "VVPAT Slip Verification",
    description: "Per Supreme Court order (2019), VVPAT slips from 5 randomly selected booths per constituency are physically counted.",
    category: "procedural",
  },
  {
    icon: "memory",
    title: "One-Time Programmable Chip",
    description: "M3 EVMs use OTP chips that are burned once at manufacturing. They cannot be reprogrammed, re-read, or overwritten.",
    category: "digital",
  },
  {
    icon: "shuffle",
    title: "Two-Stage Randomization",
    description: "Computer-generated random allocation — first to constituencies, then to specific booths — in presence of party agents.",
    category: "procedural",
  },
  {
    icon: "wifi_off",
    title: "Zero Connectivity",
    description: "EVMs have no wireless, Bluetooth, Wi-Fi, or internet capability. They are completely standalone devices.",
    category: "digital",
  },
];

// ── EVM Component Data ────────────────────────────────────────
export interface EVMComponent {
  id: string;
  name: string;
  fullName: string;
  description: string;
  features: string[];
  color: string;
}

export const EVM_COMPONENTS: EVMComponent[] = [
  {
    id: "cu",
    name: "CU",
    fullName: "Control Unit",
    description: "The brain of the EVM. Operated by the Presiding Officer. Records and stores all votes. Displays results on counting day.",
    features: [
      "Ballot button to activate one vote at a time",
      "Close button to stop accepting votes at end of poll",
      "Result button (sealed until counting day)",
      "Total votes counter display",
      "Green 'Ready' indicator light",
      "Battery compartment (runs without electricity)",
    ],
    color: "primary",
  },
  {
    id: "bu",
    name: "BU",
    fullName: "Ballot Unit",
    description: "Placed in the secret voting compartment. The voter presses the blue button next to their preferred candidate.",
    features: [
      "Blue buttons for each candidate",
      "Candidate name, serial number, and party symbol strip",
      "Red light glows after vote is cast",
      "Braille markings for visually impaired voters",
      "Connected to CU by a 5-meter cable",
      "Maximum 16 candidates per BU (expandable with linking)",
    ],
    color: "secondary",
  },
  {
    id: "vvpat",
    name: "VVPAT",
    fullName: "Voter Verifiable Paper Audit Trail",
    description: "An independent printer attached to the BU. Prints a slip showing the voted candidate — visible for 7 seconds through a transparent window.",
    features: [
      "Thermal printer generates paper slip",
      "Transparent viewing window (VSDU)",
      "Slip visible for exactly 7 seconds",
      "Slip drops into sealed, tamper-evident box",
      "Independent power supply",
      "Mandated nationwide since Lok Sabha 2019",
    ],
    color: "tertiary",
  },
];
