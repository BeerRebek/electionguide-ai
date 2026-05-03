---
title: "First Level Checking (FLC) of EVMs"
category: "Procedural"
authority: "Election Commission of India"
legal_reference: "ECI Guidelines on FLC, 2019"
language: "en"
bite: "First Level Checking is a mandatory pre-election hardware and software verification of every EVM by BEL/ECIL engineers in the presence of political party representatives."
snack: "FLC is conducted 3-5 months before elections. Engineers from BEL/ECIL check each Control Unit, Balloting Unit, and VVPAT for hardware integrity, software authenticity, and functional accuracy. Political party representatives can observe the entire process and raise objections. Only machines passing FLC are cleared for election use."
source_url: "https://eci.gov.in/evm/"
publication_date: "2023-06-15"
---

# First Level Checking (FLC) of EVMs

## Purpose and Timing

FLC is the **most comprehensive pre-election verification** of EVMs. It ensures every machine meets ECI's operational standards before deployment.

- **When**: 3-5 months before scheduled election date
- **Where**: District-level FLC centers (usually government buildings)
- **Who conducts**: Engineers from BEL and ECIL (the manufacturers)
- **Duration**: Typically 10-15 minutes per machine set (CU + BU + VVPAT)

## FLC Checklist (42 Points)

### Hardware Checks
1. Physical inspection for damage, dents, cracks
2. Battery compartment integrity
3. Connector pins condition (CU-BU cable)
4. Display panel functionality
5. Keypad button responsiveness
6. Seal placement points verification
7. VVPAT thermal printer head condition
8. VVPAT paper roll mechanism
9. VVPAT viewing window clarity

### Software/Firmware Checks
10. **Firmware hash verification** against master hash from ECI
11. Date-time setting accuracy
12. Candidate button mapping reset
13. Vote count reset to zero
14. Self-diagnostic mode execution
15. Error detection system testing

### Functional Testing
16. Mock voting: Each candidate button pressed, verified on display and VVPAT slip
17. Ballot Unit daisy-chain test (up to 4 BUs)
18. Battery drain test under load
19. Close button functionality
20. Result display accuracy after mock votes
21. Total vote count verification

## Political Party Participation

- **All recognized parties** notified at least 7 days in advance
- Party representatives can:
  - Observe every step of FLC
  - Request specific machines be tested
  - Note serial numbers of machines they observe
  - Raise objections in writing
  - Request re-testing of specific machines
- **FLC certificate** signed by BEL/ECIL engineer, DEO representative, and party representatives

## Post-FLC Actions

### Machines Passing FLC
- Sealed with **pink paper seal** signed by party representatives
- Stored in FLC-cleared warehouse with enhanced security
- Serial numbers recorded as "FLC Cleared" in EVM Tracking Software

### Machines Failing FLC
- Tagged as "Defective" with specific fault code
- Sent back to BEL/ECIL for repair
- Must undergo fresh FLC after repair before being cleared
- If repair not feasible, machine is condemned
