/**
 * ElectionGuide AI — Guides Seed Script
 * Seeds: guides table with voter education content
 *
 * Usage: npx tsx scripts/seed-guides.ts
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const GUIDES = [
  {
    slug: "voter-registration",
    title: "How to Register as a Voter",
    category: "registration",
    icon: "how_to_reg",
    order_index: 1,
    language: "en",
    bite_summary: "Register online via NVSP or visit your BLO with Form 6.",
    snack_summary:
      "Any Indian citizen aged 18+ can register to vote. You need proof of age, address, and a passport-size photo. Apply online at voters.eci.gov.in using Form 6, or submit offline at your local Electoral Registration Officer. The qualifying date is January 1st of the election year.",
    meal_content: `## Voter Registration Guide

### Who Can Register?
Any Indian citizen who:
- Is 18 years or older on the qualifying date (January 1st)
- Is ordinarily resident in the constituency
- Is not disqualified under any law

### Step-by-Step Process

**Online Registration (Recommended)**
1. Visit [voters.eci.gov.in](https://voters.eci.gov.in)
2. Click "New Registration" → Fill Form 6
3. Upload: DOB proof, address proof, passport photo
4. Submit and note your reference number
5. BLO will verify within 30 days
6. Check status using your reference number

**Offline Registration**
1. Download Form 6 from ECI website
2. Fill it manually with blue/black ink
3. Submit at: ERO office, BLO, or designated camps
4. Collect acknowledgment receipt

### Documents Required
- **Age Proof**: Birth certificate, Class 10 marksheet, passport
- **Address Proof**: Aadhaar, utility bill, bank passbook
- **Photo**: Recent passport-size color photograph

### Qualifying Dates
- **January 1** — Main qualifying date
- **April 1, July 1, October 1** — Additional qualifying dates (introduced 2023)

### After Registration
- You'll receive an Epic (Voter ID) card within 30 days
- Download digital voter ID from DigiLocker
- Check your name at electoralsearch.in`,
  },
  {
    slug: "voting-day",
    title: "What to Do on Voting Day",
    category: "voting",
    icon: "ballot",
    order_index: 2,
    language: "en",
    bite_summary: "Carry your Voter ID to your designated booth before 6 PM.",
    snack_summary:
      "On voting day, carry your EPIC card or any of the 12 approved photo IDs. Find your booth at electoralsearch.in. The mock poll at 7 AM ensures the EVM works. After voting, you'll receive an indelible ink mark and VVPAT confirmation. Polls close at 6 PM.",
    meal_content: `## Voting Day Complete Guide

### Before You Go
- Find your polling booth at [electoralsearch.in](https://electoralsearch.in)
- Note your serial number on the electoral roll
- Carry an approved photo ID

### Accepted Identity Documents (Any One)
1. EPIC (Voter ID Card) — primary
2. Aadhaar Card
3. Passport
4. Driving License
5. PAN Card
6. MGNREGA Job Card
7. Bank/Post Office Passbook with photo
8. Smart Card issued by RGI
9. Pension document with photo
10. Service identity cards issued by Central/State Govt
11. MPs/MLAs/MLCs official identity card
12. Health Insurance Smart Card (RSBY)

### At the Polling Station
1. Join the queue — separate queues for men, women, and PwD
2. Show your ID to Polling Officer 1 (verification)
3. Your name is found in the electoral roll
4. Polling Officer 2 applies **indelible ink** on your left index finger
5. Polling Officer 3 issues a ballot slip
6. The Presiding Officer presses the "Ballot" button on the Control Unit
7. You enter the voting compartment and press the blue button next to your candidate
8. The **VVPAT slip** appears for 7 seconds — verify your vote
9. A **confirmation beep** sounds — your vote is recorded

### Your Rights
- Right to vote secretly — no one can compel you to reveal your choice
- If your name is missing, you can file a complaint at the Sector Officer
- You can challenge a voter's identity — requires a deposit of ₹2

### Timing
- Polls open: **7:00 AM**
- Mock poll: **6:30–7:00 AM** (you can observe)
- Polls close: **6:00 PM** (those in queue at 6 PM can still vote)`,
  },
  {
    slug: "evm-vvpat",
    title: "Understanding EVM & VVPAT",
    category: "evm",
    icon: "how_to_vote",
    order_index: 3,
    language: "en",
    bite_summary: "EVMs are tamper-proof; VVPAT gives you a paper receipt of your vote.",
    snack_summary:
      "Electronic Voting Machines (EVMs) consist of a Control Unit (with the officer) and a Ballot Unit (with you). After pressing your choice, a Voter Verifiable Paper Audit Trail (VVPAT) slip is printed and visible for 7 seconds. 5 random VVPATs per segment are physically counted to verify results.",
    meal_content: `## EVM & VVPAT Explained

### What is an EVM?
An Electronic Voting Machine replaces paper ballots. It has two units:
- **Control Unit (CU)**: Operated by the Presiding Officer
- **Ballot Unit (BU)**: Used by the voter in the voting compartment

### How It Works
1. Presiding Officer presses "Ballot" on CU
2. Voter presses the blue button next to their candidate on BU
3. A beep confirms the vote is recorded
4. VVPAT prints a slip visible for 7 seconds

### Why EVMs Are Secure
- **One-Time Programmable chips** — software cannot be changed after manufacturing
- **No network/internet connectivity** — fully standalone
- **Manufactured by BEL and ECIL** — government PSUs with military clearance
- **Two-stage randomization** — no one can predict which EVM goes where
- **Mock poll before every election** — minimum 50 votes tested
- **Sealed with numbered seals** — agents sign the sealing certificate

### VVPAT — Your Paper Trail
- Stands for Voter Verifiable Paper Audit Trail
- Prints a slip showing candidate name, number, and party symbol
- Visible through a glass window for **7 seconds**
- Slip falls into a sealed box — not accessible to voter
- **5 random VVPATs per assembly segment** are physically counted on results day

### Challenging EVM Results
- Any candidate can request recount under Section 64A, RP Act
- Supreme Court 2019 order mandates VVPAT verification as final check`,
  },
  {
    slug: "become-candidate",
    title: "How to Contest an Election",
    category: "candidacy",
    icon: "record_voice_over",
    order_index: 4,
    language: "en",
    bite_summary: "File Form 2B nomination with ₹25,000 deposit (₹12,500 for SC/ST) at the RO office.",
    snack_summary:
      "To contest a Lok Sabha election, you must be an Indian citizen aged 25+, a registered voter, and not disqualified. File Form 2B nomination with your Returning Officer, pay the security deposit (₹25,000 for general, ₹12,500 for SC/ST), submit Form 26 affidavit disclosing criminal, financial, and educational background.",
    meal_content: `## How to Contest an Election

### Basic Eligibility
- Indian citizen aged **25+** (Lok Sabha/State Assembly)
- Aged **30+** for Rajya Sabha/Legislative Council
- Registered voter in India
- Not disqualified under any law

### Disqualifications
- Convicted of certain offences with 2+ years imprisonment
- Found guilty of corrupt practices
- Dismissed from government service for corruption
- Undischarged insolvent
- Not a citizen of India

### Nomination Process
1. **Obtain Form 2B** from Returning Officer (RO)
2. **Fill the nomination** — proposer must be a registered voter in the constituency
3. **File Form 26 Affidavit** — mandatory disclosure of criminal cases, assets/liabilities, education
4. **Pay security deposit**:
   - Lok Sabha: ₹25,000 (₹12,500 for SC/ST candidates)
   - State Assembly: ₹10,000 (₹5,000 for SC/ST)
5. **Submit to RO** between 11 AM – 3 PM on nomination days
6. Nomination is **scrutinized** by RO — objections can be filed
7. **Withdrawal period** — candidate can withdraw within 2 days of scrutiny

### After Filing
- Candidate list is published
- Draw of lots for ballot order (if same names)
- Campaign period begins
- **Election expenditure limit**: ₹95 lakh (Lok Sabha), ₹40 lakh (State Assembly)
- Maintain detailed account of all expenses

### Party vs Independent
- Party candidates get official party symbol
- Independent candidates choose from a list of free symbols
- Registered parties must give Form A (party authorisation)`,
  },
  {
    slug: "file-complaint",
    title: "How to File an Election Complaint",
    category: "grievance",
    icon: "report",
    order_index: 5,
    language: "en",
    bite_summary: "Report violations via cVIGIL app, 1950 helpline, or directly to ECI.",
    snack_summary:
      "Election violations can be reported through multiple channels: the cVIGIL app (geotagged photo/video evidence, 100-minute response SLA), the National Voter Helpline 1950, or by writing directly to the Election Commission. Flying Squad Teams (FST) are deployed to respond to complaints during election periods.",
    meal_content: `## Filing Election Complaints

### Types of Violations You Can Report
- **Model Code of Conduct (MCC) violations** — unauthorized rallies, provocative speeches
- **Money/liquor distribution** — cash, gifts, or alcohol to influence voters
- **Voter intimidation** — threats, booth capturing attempts
- **Hate speech** — content targeting religion, caste, or community
- **Unauthorized advertisements** — posters/banners without permission
- **Bribery** — any inducement to vote for/against a candidate

### Channel 1: cVIGIL App (Fastest)
1. Download **cVIGIL** from Play Store / App Store
2. Click and upload photo/video evidence (auto-geotagged)
3. Submit — your identity is kept confidential
4. Flying Squad dispatched within **100 minutes** (SLA)
5. Track status in real-time in the app

### Channel 2: National Voter Helpline 1950
- Dial **1950** (toll-free)
- Available in multiple languages
- Complaints are logged and forwarded to district authorities
- Get a reference number for tracking

### Channel 3: Written Complaint to ECI
- Write to: **Election Commission of India, Nirvachan Sadan, New Delhi**
- Email: **complaints@eci.gov.in**
- Include: your name, contact, description, evidence
- Reference: relevant Model Code provision

### After Filing
- Complaint assigned to Returning Officer / District Election Officer
- Action taken within the election schedule timeline
- Anonymous complaints accepted via cVIGIL
- Frivolous complaints may attract action under Section 177 IPC`,
  },
  {
    slug: "nri-voting",
    title: "NRI Voting Guide",
    category: "special",
    icon: "flight",
    order_index: 6,
    language: "en",
    bite_summary: "NRIs can register via Form 6A and must vote in person at their home constituency.",
    snack_summary:
      "Non-Resident Indians (NRIs) with a valid Indian passport can register as overseas voters using Form 6A on the NVSP portal. They must vote in person at their registered constituency — postal ballot or proxy voting is not yet available. The overseas voter registration requires a valid Indian passport and Indian address.",
    meal_content: `## NRI Voting Guide

### Who is Eligible?
- Indian citizen residing outside India
- Valid Indian passport holder
- Not acquired citizenship of another country
- Age 18+ as of January 1 of the registration year

### How to Register: Form 6A
1. Visit [voters.eci.gov.in](https://voters.eci.gov.in) → Overseas Voters
2. Fill **Form 6A** with:
   - Indian address (home constituency)
   - Passport details
   - Current country of residence
3. Upload: Passport copy (relevant pages)
4. Submit — BLO verifies the Indian address
5. Your name is added to the electoral roll of your home constituency

### How to Vote
- **Must vote in person** at your designated polling booth in India
- Travel to India during the election period
- Carry original Indian passport as identity proof
- No postal ballot currently available for overseas voters (legislation pending)

### Current Limitations
- **No proxy voting** — a bill is pending in Parliament but not yet passed
- **No postal ballot** — unlike armed forces voters
- Must physically be present in India on polling day

### Checking Your Registration
- Visit [electoralsearch.in](https://electoralsearch.in)
- Search by name + state + district
- Or use your passport number

### Important Notes
- Registration is valid as long as you hold an Indian passport
- Inform ERO if you acquire foreign citizenship — you must be removed from the roll
- Your name appears in the electoral roll with "Overseas" designation`,
  },
  {
    slug: "pwd-voting",
    title: "Voting Rights for Persons with Disabilities",
    category: "accessibility",
    icon: "accessible",
    order_index: 7,
    language: "en",
    bite_summary: "PwD voters get priority access, home voting (85+), and postal ballot options.",
    snack_summary:
      "Persons with disabilities have special protections under ECI's SAKSHAM initiative. All polling booths must have ramps, wheelchairs, and braille ballot guides. Voters aged 85+ and persons with 40%+ disability can request postal ballot. A companion can assist inside the voting compartment under Form 14A.",
    meal_content: `## Voting for Persons with Disabilities

### Your Rights at the Polling Booth
- **Dedicated queue** — PwD voters do not wait in the general line
- **Ramp access** — all polling stations must have ramps
- **Wheelchair** — available at the booth free of charge
- **Volunteer assistance** — trained volunteers to guide you
- **Braille ballot guide** — available on request
- **Ground floor booth** — PwD voters cannot be sent upstairs

### Companion Assistance (Form 14A)
- You may bring a companion of your choice to assist inside the voting compartment
- The companion must:
  - Be a registered voter
  - Sign **Form 14A** (declaration that they will not influence your vote)
  - Not have assisted more than one other voter in the same election

### Postal Ballot Option
Available for:
- Voters aged **85 years and above**
- Persons with **40% or more disability** (as certified)

**How to Apply:**
1. Inform your ERO/BLO at least 5 days before the last date of nomination
2. Fill **Form 12D** (application for postal ballot)
3. A polling team visits your home
4. Vote in the presence of the team and a witness

### Home Voting Scheme
- For 85+ and PwD voters (40%+ disability)
- Poll team comes to your residence
- Same secrecy and process as the polling booth
- Available for both Lok Sabha and State Assembly elections (since 2019)

### SAKSHAM App
- ECI's accessibility initiative
- Map accessible polling booths near you
- Download from Play Store / App Store
- Request special assistance in advance

### Grievance Redressal
- Contact: District Election Officer
- Helpline: **1950**
- cVIGIL app for real-time complaints`,
  },
];

// ── Seed Function ─────────────────────────────────────────────

async function seedGuides() {
  console.log("📚 Seeding guides...\n");

  for (const guide of GUIDES) {
    const { data: existing } = await supabase
      .from("guides")
      .select("id")
      .eq("slug", guide.slug)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("guides")
        .update({
          title: guide.title,
          category: guide.category,
          icon: guide.icon,
          order_index: guide.order_index,
          bite_summary: guide.bite_summary,
          snack_summary: guide.snack_summary,
          meal_content: guide.meal_content,
        })
        .eq("id", existing.id);

      if (error) {
        console.error(`  ❌ Failed to update "${guide.slug}":`, error.message);
      } else {
        console.log(`  🔄 Updated: "${guide.title}"`);
      }
      continue;
    }

    const { error } = await supabase.from("guides").insert(guide);

    if (error) {
      console.error(`  ❌ Failed to insert "${guide.slug}":`, error.message);
    } else {
      console.log(`  ✅ Inserted: "${guide.title}"`);
    }
  }
}

// ── Main ──────────────────────────────────────────────────────

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("  ElectionGuide AI — Guides Seed Script");
  console.log("═══════════════════════════════════════\n");

  await seedGuides();

  console.log("\n═══════════════════════════════════════");
  console.log(`  ✅ Done! Seeded ${GUIDES.length} guides.`);
  console.log("═══════════════════════════════════════");
}

main().catch(console.error);
