---
title: "EVM Balloting Unit — Technical Specifications"
category: "Technical"
authority: "Election Commission of India"
legal_reference: "Rule 49A, Conduct of Elections Rules 1961"
language: "en"
bite: "The Balloting Unit is the voter-facing component of the EVM with blue buttons for each candidate, placed inside the voting compartment for secret ballot."
snack: "Each balloting unit accommodates up to 16 candidates. For constituencies with more candidates, up to 4 balloting units can be linked to one control unit, supporting a maximum of 64 candidates per unit (384 total with expanded system). The voter presses the blue button next to their chosen candidate, producing a beep and a lit lamp confirming the vote."
source_url: "https://eci.gov.in/evm/"
publication_date: "2023-01-01"
---

# EVM Balloting Unit — Technical Specifications

## Overview
The Balloting Unit (BU) is the voter-facing component of the Electronic Voting Machine. It is placed inside the voting compartment to ensure ballot secrecy and is connected to the Control Unit via a 5-meter cable.

## Hardware Design

### Candidate Panel
- **Blue buttons**: One button per candidate, arranged vertically
- **Candidate display**: Next to each button, a ballot paper strip shows:
  - Serial number of the candidate
  - Name of the candidate (in Hindi, English, and regional language)
  - Symbol of the candidate (printed in color)
- **NOTA option**: The last button on the unit labeled "None of the Above" (NOTA) with the ballot symbol of a cross mark
- **Maximum candidates per unit**: 16 (plus NOTA)

### Multiple Unit Support
- Up to **4 balloting units** can be daisy-chained to a single control unit
- Supports a maximum of **64 candidates** (16 × 4) in the standard configuration
- In the extended M3 model, up to **24 balloting units** can be connected for up to **384 candidates**

### Cable Connection
- Connected to the control unit via a **5-meter shielded cable**
- The cable is tamper-evident and cannot be tapped or altered without detection

## Voting Process

### Step-by-Step
1. Presiding Officer presses **BALLOT** button on Control Unit (enables one vote)
2. A **green light** on the balloting unit indicates it is ready to accept a vote
3. Voter enters the voting compartment
4. Voter presses the **blue button** next to their preferred candidate
5. A **beep** sounds from the control unit
6. A **red lamp** next to the pressed button lights up briefly, confirming the vote
7. If VVPAT is attached, a paper slip is printed showing the candidate chosen
8. The balloting unit automatically **locks** — no second vote is possible until the Presiding Officer enables the next voter

### Safeguards
- **Single-vote enforcement**: After one button is pressed, all other buttons are disabled until the next BALLOT command
- **Physical seal**: The ballot paper strip with candidate names is sealed under a transparent cover to prevent tampering
- **Braille markings**: Since 2014, all balloting units include **Braille features** on the blue buttons to assist visually impaired voters
- **Arrow symbol**: A prominent arrow (➡) points from each candidate's display to the corresponding blue button

## Dimensions
- **Size**: Approximately 375mm × 175mm × 60mm
- **Weight**: Approximately 1.0 kg
