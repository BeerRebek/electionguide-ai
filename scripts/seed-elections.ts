/**
 * ElectionGuide AI — Election & EVM Seed Script
 * Seeds: elections, election_phases, evm_lifecycle_stages
 *
 * Usage: npx tsx scripts/seed-elections.ts
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

// ── Election Data ───────────────────────────────────────────
const ELECTIONS = [
  {
    title: "18th Lok Sabha General Election",
    type: "general",
    state: null,
    year: 2024,
    status: "completed",
    notification_date: "2024-03-16",
    polling_start: "2024-04-19",
    polling_end: "2024-06-01",
    result_date: "2024-06-04",
  },
  {
    title: "Delhi Assembly Election",
    type: "state",
    state: "Delhi",
    year: 2025,
    status: "completed",
    notification_date: "2025-01-07",
    polling_start: "2025-02-05",
    polling_end: "2025-02-05",
    result_date: "2025-02-08",
  },
  {
    title: "Bihar Assembly Election",
    type: "state",
    state: "Bihar",
    year: 2025,
    status: "upcoming",
    notification_date: null,
    polling_start: null,
    polling_end: null,
    result_date: null,
  },
];

// Phases for 18th Lok Sabha 2024
const LOK_SABHA_2024_PHASES = [
  { phase_number: 1, polling_date: "2024-04-19", states: ["Rajasthan", "Tamil Nadu", "Uttarakhand", "Arunachal Pradesh", "Meghalaya", "Manipur", "Mizoram", "Nagaland", "Sikkim", "Tripura", "Lakshadweep", "Puducherry"], constituencies: ["102 constituencies"] },
  { phase_number: 2, polling_date: "2024-04-26", states: ["Kerala", "Rajasthan", "Maharashtra", "UP", "Bihar", "Karnataka", "Madhya Pradesh", "Assam", "Chhattisgarh", "Manipur", "Tripura", "Jammu & Kashmir"], constituencies: ["89 constituencies"] },
  { phase_number: 3, polling_date: "2024-05-07", states: ["Gujarat", "Goa", "Karnataka", "Maharashtra", "UP", "Bihar", "Chhattisgarh", "Assam", "West Bengal", "Dadra & Nagar Haveli", "Daman & Diu"], constituencies: ["94 constituencies"] },
  { phase_number: 4, polling_date: "2024-05-13", states: ["Andhra Pradesh", "Telangana", "Maharashtra", "UP", "Bihar", "Madhya Pradesh", "Odisha", "West Bengal", "Jharkhand", "Jammu & Kashmir"], constituencies: ["96 constituencies"] },
  { phase_number: 5, polling_date: "2024-05-20", states: ["UP", "Bihar", "West Bengal", "Jharkhand", "Odisha", "Maharashtra", "Jammu & Kashmir", "Ladakh"], constituencies: ["49 constituencies"] },
  { phase_number: 6, polling_date: "2024-05-25", states: ["UP", "Bihar", "West Bengal", "Jharkhand", "Odisha", "Haryana", "Delhi"], constituencies: ["58 constituencies"] },
  { phase_number: 7, polling_date: "2024-06-01", states: ["UP", "Bihar", "West Bengal", "Jharkhand", "Odisha", "Punjab", "Chandigarh", "Himachal Pradesh"], constituencies: ["57 constituencies"] },
];

// ── EVM Lifecycle Stages ────────────────────────────────────
const EVM_STAGES = [
  {
    stage_order: 1,
    title: "Manufacturing & Quality Control",
    description: "EVMs manufactured exclusively by Bharat Electronics Ltd (BEL) and Electronics Corporation of India Ltd (ECIL) under strict security protocols.",
    icon: "precision_manufacturing",
    details: {
      bite: "EVMs are made only by BEL and ECIL — government PSUs with military-grade security clearance.",
      snack: "Manufacturing happens in secure, access-controlled facilities. Each machine receives a unique serial number. Components are sourced domestically. One-time programmable (OTP) chips are used, making software tampering impossible. Each batch undergoes 100% quality inspection.",
      legal_provisions: ["Section 61A, Representation of People Act 1951", "ECI Technical Expert Committee Guidelines"],
      authorities: ["BEL", "ECIL", "ECI Technical Expert Committee"],
      security_protocols: ["Secure facility access control", "100% quality inspection", "OTP chip programming", "Serial number registry"],
    },
  },
  {
    stage_order: 2,
    title: "First Level Checking (FLC)",
    description: "Comprehensive hardware and software verification by BEL/ECIL engineers in the presence of political party representatives.",
    icon: "fact_check",
    details: {
      bite: "Engineers from BEL/ECIL inspect every EVM in front of political party agents — full transparency.",
      snack: "FLC involves testing each component: battery check, display test, button functionality, VVPAT printer alignment, and mock voting simulation. Political party representatives can observe and raise objections. Defective units are segregated and repaired or scrapped.",
      legal_provisions: ["ECI Guidelines on FLC Procedure", "Supreme Court directives on EVM transparency"],
      authorities: ["BEL/ECIL Engineers", "District Election Officer", "Political Party Representatives"],
      security_protocols: ["Open inspection in presence of parties", "100% unit testing", "Defective unit segregation", "Detailed FLC register maintained"],
    },
  },
  {
    stage_order: 3,
    title: "Two-Stage Randomization",
    description: "Computer-generated random allocation of EVMs to constituencies and then to specific polling booths.",
    icon: "shuffle",
    details: {
      bite: "Nobody — not even ECI officials — can predict which EVM goes to which booth. It's pure randomization.",
      snack: "First randomization assigns EVMs from warehouse stock to constituencies. Second randomization (closer to poll day) assigns specific EVMs to specific booths within that constituency. Both stages use software-generated random numbers in the presence of political party representatives.",
      legal_provisions: ["ECI Instruction No. 464/INST/2014-EPS"],
      authorities: ["District Election Officer", "Political Party Representatives", "ECI Software"],
      security_protocols: ["Software-based random number generation", "Witnessed by political parties", "Audit trail maintained", "No manual override possible"],
    },
  },
  {
    stage_order: 4,
    title: "Candidate Setting & Symbol Loading",
    description: "Loading ballot data — candidate names, serial numbers, and party symbols onto the Ballot Unit and VVPAT.",
    icon: "tune",
    details: {
      bite: "Candidate names and symbols are loaded only after nominations are finalized — each unit is constituency-specific.",
      snack: "After the final list of contesting candidates is prepared, the Returning Officer supervises the setting of Ballot Units with candidate names and symbols in the prescribed order. VVPAT printers are also loaded with candidate data. This process happens in the presence of candidates or their agents.",
      legal_provisions: ["Rule 49A, Conduct of Elections Rules 1961"],
      authorities: ["Returning Officer", "Candidate Agents"],
      security_protocols: ["Candidate order verification", "VVPAT slip sample printing", "Supervised by candidates/agents"],
    },
  },
  {
    stage_order: 5,
    title: "Pre-Poll Mock Testing",
    description: "Mandatory mock poll on election morning — minimum 50 votes cast and tallied against VVPAT paper slips.",
    icon: "how_to_vote",
    details: {
      bite: "Every EVM must pass a 50-vote mock poll on election morning before real voting begins.",
      snack: "On poll day morning (before 7 AM), the Presiding Officer conducts a mock poll with a minimum of 50 votes in the presence of polling agents. Each vote is verified against the VVPAT slip. Results must match 100%. If any discrepancy is found, the EVM is replaced with a reserve unit and the mock poll is repeated.",
      legal_provisions: ["ECI Standing Instruction on Mock Poll Procedure"],
      authorities: ["Presiding Officer", "Polling Agents", "Sector Officer"],
      security_protocols: ["Minimum 50 votes mandatory", "100% VVPAT slip verification", "Replace on any discrepancy", "Mock poll certificate signed by all agents"],
    },
  },
  {
    stage_order: 6,
    title: "Voting Day Operations",
    description: "Active polling with sealed EVM setup, voter verification, and real-time monitoring through webcasting.",
    icon: "ballot",
    details: {
      bite: "Voters press the blue button, see the VVPAT slip, hear the confirmation beep — democracy in action.",
      snack: "During actual polling, the Control Unit is operated by the Presiding Officer who presses the 'Ballot' button for each verified voter. The voter enters the compartment and presses the blue button next to their chosen candidate. The VVPAT slip is visible for 7 seconds. A confirmation beep sounds. Webcasting from polling stations enables real-time central monitoring.",
      legal_provisions: ["Section 62, RP Act (Right to Vote)", "Rule 49MA (VVPAT Procedure)"],
      authorities: ["Presiding Officer", "Polling Officers 1-4", "Micro Observer", "Central Armed Police Forces"],
      security_protocols: ["Indelible ink application", "Voter identity verification", "VVPAT confirmation", "Webcasting", "Green paper seal on CU"],
    },
  },
  {
    stage_order: 7,
    title: "Sealing & Transportation",
    description: "Post-poll sealing of EVMs with unique serial numbered seals and secure transportation to strong rooms.",
    icon: "package_2",
    details: {
      bite: "After voting ends, EVMs are sealed with unique numbered seals — signed by candidates' agents.",
      snack: "After the poll closes, the Presiding Officer seals the EVM using serially numbered paper seals and address tags. The unique seal numbers are recorded and shared with candidates' agents, who also sign the sealing certificate. The sealed EVMs are transported under armed escort to the designated strong room.",
      legal_provisions: ["Rule 55C, Conduct of Elections Rules"],
      authorities: ["Presiding Officer", "Sector Magistrate", "Armed Police Escort"],
      security_protocols: ["Serial numbered seals", "Agent signatures on sealing certificate", "Armed escort", "GPS-tracked vehicles", "Videography of transport"],
    },
  },
  {
    stage_order: 8,
    title: "Strong Room Storage",
    description: "Secured storage facility with 3-tier armed security, CCTV surveillance, and 24/7 monitoring until counting day.",
    icon: "warehouse",
    details: {
      bite: "EVMs are stored under 3-tier armed security with 24/7 CCTV — no one enters without multi-party consent.",
      snack: "Strong rooms are secured with a 3-tier security cordon: outer (CAPF), middle (State Armed Police), inner (local police). Entry requires the presence of the Returning Officer, Observer, and candidate representatives together. 24/7 CCTV recording with live feed available. Armed sentries maintain round-the-clock vigil.",
      legal_provisions: ["ECI Compendium of Instructions on Strong Rooms"],
      authorities: ["Returning Officer", "Observer", "CAPF", "State Police"],
      security_protocols: ["3-tier armed security", "24/7 CCTV with live feed", "Multi-party access only", "Sealed entry log maintained", "Fire safety measures"],
    },
  },
  {
    stage_order: 9,
    title: "Counting & VVPAT Verification",
    description: "Round-wise electronic counting with mandatory VVPAT paper trail verification from 5 randomly selected booths per assembly segment.",
    icon: "analytics",
    details: {
      bite: "EVM results are verified against physical VVPAT slips from 5 random booths — the ultimate integrity check.",
      snack: "On counting day, EVMs are brought from strong rooms under escort. The Returning Officer conducts round-wise counting with candidates' counting agents present. Per the Supreme Court's 2019 order, VVPAT slips from 5 randomly selected booths per assembly segment are physically counted and matched against EVM totals. Results are declared on Form 21C/21E.",
      legal_provisions: ["Section 64, RP Act", "Supreme Court Order 2019 on VVPAT verification"],
      authorities: ["Returning Officer", "Observer", "Counting Supervisors", "Counting Agents"],
      security_protocols: ["3-tier counting hall security", "Videography throughout", "VVPAT random selection witnessed", "Form 17C Part II signed by agents", "Recount provision under Section 64A"],
    },
  },
];

// ── Seed Functions ──────────────────────────────────────────

async function seedElections() {
  console.log("🗳️  Seeding elections...");

  for (const election of ELECTIONS) {
    const { data: existing } = await supabase
      .from("elections")
      .select("id")
      .eq("title", election.title)
      .eq("year", election.year)
      .maybeSingle();

    if (existing) {
      console.log(`  ⏭️  Skipping "${election.title}" (already exists)`);
      continue;
    }

    const { data, error } = await supabase
      .from("elections")
      .insert(election)
      .select("id")
      .single();

    if (error) {
      console.error(`  ❌ Failed to insert "${election.title}":`, error.message);
      continue;
    }

    console.log(`  ✅ Inserted "${election.title}" (${data.id})`);

    // Seed phases for Lok Sabha 2024
    if (election.title.includes("Lok Sabha") && election.year === 2024) {
      const phases = LOK_SABHA_2024_PHASES.map((p) => ({
        ...p,
        election_id: data.id,
      }));

      const { error: phaseError } = await supabase
        .from("election_phases")
        .insert(phases);

      if (phaseError) {
        console.error("  ❌ Failed to insert phases:", phaseError.message);
      } else {
        console.log(`  ✅ Inserted ${phases.length} phases`);
      }
    }
  }
}

async function seedEVMStages() {
  console.log("\n🔧 Seeding EVM lifecycle stages...");

  for (const stage of EVM_STAGES) {
    const { data: existing } = await supabase
      .from("evm_lifecycle_stages")
      .select("id")
      .eq("stage_order", stage.stage_order)
      .maybeSingle();

    if (existing) {
      // Update existing stage with latest data
      const { error } = await supabase
        .from("evm_lifecycle_stages")
        .update({
          title: stage.title,
          description: stage.description,
          icon: stage.icon,
          details: stage.details,
        })
        .eq("id", existing.id);

      if (error) {
        console.error(`  ❌ Failed to update stage ${stage.stage_order}:`, error.message);
      } else {
        console.log(`  🔄 Updated stage ${stage.stage_order}: "${stage.title}"`);
      }
      continue;
    }

    const { error } = await supabase.from("evm_lifecycle_stages").insert(stage);

    if (error) {
      console.error(`  ❌ Failed to insert stage ${stage.stage_order}:`, error.message);
    } else {
      console.log(`  ✅ Inserted stage ${stage.stage_order}: "${stage.title}"`);
    }
  }
}

// ── Main ────────────────────────────────────────────────────

async function main() {
  console.log("═══════════════════════════════════════════════");
  console.log("  ElectionGuide AI — Election & EVM Seed Script");
  console.log("═══════════════════════════════════════════════\n");

  await seedElections();
  await seedEVMStages();

  console.log("\n═══════════════════════════════════════════════");
  console.log("  ✅ Seeding complete!");
  console.log("═══════════════════════════════════════════════");
}

main().catch(console.error);
