---
title: "EVM Lifecycle — FLC, Randomization, Commissioning"
category: "Procedural"
authority: "Election Commission of India"
legal_reference: "ECI EVM Manual"
language: "en"
bite: "EVMs go through a strict lifecycle: storage, First Level Checking, dual randomization, commissioning with candidate names, mock poll verification, polling day use, counting, and post-election storage."
snack: "Before each election, all EVMs undergo First Level Checking (FLC) by BEL/ECIL engineers in the presence of political party representatives to verify hardware integrity. They are then randomly assigned to constituencies (first randomization) and polling stations (second randomization) by software. Commissioning loads candidate details onto the balloting unit."
source_url: "https://eci.gov.in/evm/"
publication_date: "2023-01-01"
---

# EVM Lifecycle

## Storage (Non-Election Period)
- Stored in district/state warehouses under ECI custody
- Temperature and humidity controlled
- Periodic battery checks
- Inventory maintained with unique EVM serial numbers

## First Level Checking (FLC)
- Conducted 2-3 weeks before election
- BEL/ECIL engineers check each EVM
- Tests: button functionality, display, battery, control unit-balloting unit connectivity
- Candidate/party representatives invited to observe
- Defective units rejected and returned for repair
- FLC certificate issued for cleared units

## First Randomization
- EVMs assigned to Assembly constituencies from district pool
- Done by computer software (EVM Tracking Software - ETS)
- Observed by political party representatives
- Ensures no one knows which EVM goes where until this point

## Second Randomization
- Within each constituency, EVMs assigned to specific polling stations
- Done close to polling day (typically 2-3 days before)
- Again observed by party representatives

## Commissioning
- Ballot paper strips prepared with candidate names, symbols
- Strips loaded into balloting units
- VVPAT configured for the specific candidates
- Test vote by each candidate's representative to verify accuracy
- Candidate representatives sign commissioning certificate

## Mock Poll
- On polling day, before 7 AM
- At least 50 test votes cast per EVM
- EVM result verified against manually tracked test votes
- VVPAT slips counted and verified
- EVM cleared and all test votes erased only after 100% match

## Poll Day Use
- Actual voting 7 AM to 6 PM
- Presiding Officer controls BALLOT button
- Maximum 5 votes per minute (built-in rate limit)

## Counting
- EVMs transported from strong room to counting center
- Seals verified, RESULT button pressed
- Results recorded round by round

## Post-Election Storage
- After counting, EVMs returned to district warehouse
- Stored for use in next election
- Lifecycle typically 15 years per EVM unit
