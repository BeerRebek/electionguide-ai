---
title: "VVPAT Printer and VSDU — Technical Specifications"
category: "Technical"
authority: "Election Commission of India"
legal_reference: "Rule 56D, Conduct of Elections Rules 1961"
language: "en"
bite: "The Voter Verifiable Paper Audit Trail (VVPAT) system consists of a thermal printer attached to the EVM that prints a paper slip for each vote, displayed for 7 seconds through a transparent window before being sealed in a drop box."
snack: "The VVPAT system provides an independent paper record of every electronic vote cast. It includes a thermal printer, a transparent VSDU (Voter Slip Display Unit) window, and a sealed drop box. The paper rolls can record approximately 2,000 votes. Mandatory VVPAT verification in 5 randomly selected polling stations per constituency was ordered by the Supreme Court."
source_url: "https://eci.gov.in/evm/"
publication_date: "2023-01-01"
---

# VVPAT Printer and VSDU

## Overview
The Voter Verifiable Paper Audit Trail (VVPAT) system was introduced to provide a physical paper record that voters can verify, and which serves as an independent audit trail for electronic votes recorded on EVMs.

## Components

### 1. Printer Module
- **Type**: Thermal printer (no ink required)
- **Paper**: Thermal paper roll
- **Capacity**: Approximately 2,000 slips per roll
- **Print content**: Serial number, name, and symbol of the candidate voted for
- **Slip size**: Approximately 75mm × 105mm

### 2. VSDU (Voter Slip Display Unit)
- **Material**: Transparent acrylic window
- **Display duration**: **7 seconds** — the printed slip is visible through the window for 7 seconds
- **After display**: An automatic cutting mechanism separates the slip and it drops into the sealed drop box
- **Positioning**: The VSDU window is placed adjacent to the balloting unit inside the voting compartment

### 3. Drop Box
- **Material**: Sealed compartment with paper seals
- **Security**: Once sealed, can only be opened at the counting center under authorized supervision
- **Capacity**: Stores all paper slips for the entire polling duration

## Operational Protocol

### During Polling
1. Voter presses blue button on balloting unit
2. EVM records the vote electronically
3. Simultaneously, VVPAT printer generates a paper slip
4. Slip is displayed through VSDU window for 7 seconds
5. Voter verifies the slip shows correct candidate name and symbol
6. Slip drops automatically into the sealed drop box
7. If the voter feels the slip shows an incorrect candidate, they can file a challenge with the Presiding Officer

### Malfunction Handling
- If VVPAT malfunctions, the Presiding Officer replaces it with a spare unit
- **Maximum 5 replacements** allowed per polling station
- If all spare units are exhausted, polling may continue with EVM only (rare)
- All malfunctions are logged and reported to the Returning Officer

## VVPAT Verification at Counting

### 5-Station Random Verification
1. After all EVMs reach the counting center
2. Before electronic counting begins
3. **5 polling stations** are randomly selected per Assembly constituency by drawing lots
4. For Lok Sabha constituencies, 5 stations per Assembly segment (usually 35 stations total)
5. VVPAT slips from selected stations are **physically counted** by counting staff
6. The VVPAT count is compared with the EVM electronic count

### In Case of Discrepancy
- If VVPAT count does not match EVM count, the **VVPAT count prevails** for that polling station
- The affected EVM is quarantined for forensic examination
- The Returning Officer reports the discrepancy to ECI
- This has never occurred in a general election to date

## Manufacturing
- Manufactured by BEL (Bharat Electronics Limited) and ECIL (Electronics Corporation of India Limited)
- Dimensions: Approximately 260mm × 100mm × 100mm
- Weight: Approximately 2.5 kg with drop box
