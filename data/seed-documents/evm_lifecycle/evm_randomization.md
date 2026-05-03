---
title: "EVM Randomization Process"
category: "Procedural"
authority: "Election Commission of India"
legal_reference: "Section 61A, RP Act 1951; ECI Randomization Guidelines"
language: "en"
bite: "EVMs undergo two rounds of computerized randomization — first for constituency allocation and then for polling station assignment — making it impossible to predict which machine goes where."
snack: "The ECI mandates a two-stage randomization process for EVM allocation. The first randomization assigns machines to Assembly Constituencies within a district, and the second randomization assigns specific machines to individual polling stations. Both rounds use ECI's proprietary software, are conducted in the presence of General Observers and political party representatives, and produce signed certificates."
source_url: "https://eci.gov.in/evm/"
publication_date: "2023-06-15"
---

# EVM Randomization Process

## First Randomization

### Timing and Authority
- Conducted **after First Level Checking** and before commissioning
- Supervised by **District Election Officer (DEO)**
- ECI **General Observer** must be present
- Minimum 7 days notice to all political parties

### Process
1. All FLC-cleared EVM serial numbers loaded into randomization software
2. Number of EVMs required per Assembly Constituency calculated (polling stations + 20% reserve)
3. Software runs randomization algorithm
4. Output: Assignment list showing which serial numbers go to which constituency
5. Results displayed on screen, verified by all present
6. **Randomization certificate** printed and signed by DEO, Observer, and party representatives

## Second Randomization

### Timing
- Conducted **after candidate list is finalized** (after withdrawal of nominations)
- Typically 5-7 days before poll day
- Supervised by **Returning Officer** of the constituency

### Process
1. Constituency-specific EVM pool loaded into software
2. Polling station list with voter counts loaded
3. Software assigns specific CU+BU+VVPAT sets to each polling station
4. Reserve machines identified for each zone/sector
5. Results displayed and printed
6. All candidates/agents can note the serial numbers assigned to their polling stations

## Security Features of Randomization

### Software Integrity
- Randomization software developed by **NIC (National Informatics Centre)**
- Software hash verified before each use
- Cannot be run without valid ECI Observer credentials
- Generates tamper-proof audit logs

### Unpredictability Guarantees
- No human can influence the randomization output
- Serial numbers are non-sequential within batches
- Machine age, manufacturer (BEL/ECIL) are randomly mixed
- Even party representatives cannot predict outcomes
- Multiple randomization runs produce different results each time
