---
title: "EVM Control Unit — Technical Specifications"
category: "Technical"
authority: "Election Commission of India"
legal_reference: "Rule 49A, Conduct of Elections Rules 1961"
language: "en"
bite: "The Control Unit is the brain of the EVM, operated by the Presiding Officer, recording votes and storing results securely in a one-time programmable microcontroller chip."
snack: "The M3 Control Unit manufactured by BEL and ECIL contains a one-time programmable (OTP) microcontroller that cannot be reprogrammed, has no wireless connectivity, and stores votes in non-volatile memory. It can record up to 2,000 votes and supports up to 384 candidates (with 4 balloting units). The result is displayed after pressing the RESULT button, which can only be activated after the CLOSE button is pressed."
source_url: "https://eci.gov.in/evm/"
publication_date: "2023-01-01"
---

# EVM Control Unit — Technical Specifications

## Overview
The Control Unit (CU) is one of the two main components of the Indian Electronic Voting Machine. It is operated by the Presiding Officer at the polling station and serves as the vote recording and storage device.

## Hardware Specifications (M3 Model)

### Microcontroller
- **Type**: One-Time Programmable (OTP) microcontroller
- **Key feature**: The program is burned into the chip at the manufacturing stage and **cannot be altered, modified, or reprogrammed** after manufacture
- **No operating system**: The chip runs firmware directly (no OS that can be hacked)
- **No network interface**: No Wi-Fi, Bluetooth, USB port, or any form of external connectivity

### Memory
- **Non-volatile memory**: Votes stored in battery-backed memory
- **Capacity**: Can store up to **2,000 votes**
- **Tampering protection**: Memory is sealed within the unit and any physical tampering is detectable

### Power
- **Battery**: Operates on a single 7.5V alkaline battery (6 AA cells)
- **Battery life**: Can operate for approximately 5 years in standby or through multiple elections
- **No external power required**: Completely independent of electricity grid

## Functional Features

### Buttons and Controls
1. **BALLOT button**: Pressed by the Presiding Officer to enable the balloting unit for one voter at a time
2. **CLOSE button**: Pressed after polling ends to lock the machine permanently — no more votes can be recorded
3. **RESULT button**: Displays cumulative votes polled for each candidate — can only be activated after CLOSE
4. **TOTAL button**: Shows total number of votes polled

### Security Features
- **Sequential vote recording**: Only one vote can be recorded at a time
- **Ballot-button interlock**: The balloting unit is activated only when the Presiding Officer presses BALLOT
- **Maximum 5 votes per minute**: Built-in rate limiting prevents any attempt at rapid button pressing
- **Close-Result sequence**: RESULT cannot be accessed without first pressing CLOSE
- **Date-time stamping**: Each vote is timestamped internally

## Manufacturing
- **Manufacturers**: Only two authorized PSU manufacturers:
  - Bharat Electronics Limited (BEL), Bangalore
  - Electronics Corporation of India Limited (ECIL), Hyderabad
- **No private sector involvement**: EVMs are manufactured exclusively by government-owned entities
- **Quality testing**: Every unit undergoes rigorous factory testing before delivery to ECI

## Dimensions and Weight
- **Size**: Approximately 275mm × 210mm × 85mm
- **Weight**: Approximately 1.5 kg (without battery)
- **Construction**: Rugged plastic housing designed for Indian conditions (heat, humidity, dust)
