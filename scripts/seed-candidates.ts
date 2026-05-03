/**
 * ElectionGuide AI — Candidates Seed Script
 * Seeds: parties, constituencies, candidates tables
 *
 * Usage: npx tsx scripts/seed-candidates.ts
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

// ── Parties ───────────────────────────────────────────────────

const PARTIES = [
  { name: "Bharatiya Janata Party", abbreviation: "BJP", color: "#FF6B00", founded_year: 1980 },
  { name: "Indian National Congress", abbreviation: "INC", color: "#007BFF", founded_year: 1885 },
  { name: "Aam Aadmi Party", abbreviation: "AAP", color: "#0080FF", founded_year: 2012 },
  { name: "Nationalist Congress Party", abbreviation: "NCP", color: "#00B050", founded_year: 1999 },
  { name: "Shiv Sena (UBT)", abbreviation: "SS-UBT", color: "#FF6600", founded_year: 1966 },
  { name: "Independent", abbreviation: "IND", color: "#6B7280", founded_year: null },
];

// ── Constituencies ────────────────────────────────────────────

const CONSTITUENCIES = [
  { name: "Pune South", type: "assembly", state: "Maharashtra", district: "Pune", code: "MH-PA-123" },
  { name: "Pune North", type: "assembly", state: "Maharashtra", district: "Pune", code: "MH-PA-121" },
  { name: "Kasba Peth", type: "assembly", state: "Maharashtra", district: "Pune", code: "MH-PA-124" },
  { name: "Shivajinagar", type: "assembly", state: "Maharashtra", district: "Pune", code: "MH-PA-125" },
  { name: "Chandni Chowk", type: "parliamentary", state: "Delhi", district: "Central Delhi", code: "DL-PC-01" },
  { name: "New Delhi", type: "parliamentary", state: "Delhi", district: "New Delhi", code: "DL-PC-02" },
  { name: "East Delhi", type: "parliamentary", state: "Delhi", district: "East Delhi", code: "DL-PC-03" },
  { name: "Chennai North", type: "parliamentary", state: "Tamil Nadu", district: "Chennai", code: "TN-PC-01" },
  { name: "Kolkata Uttar", type: "parliamentary", state: "West Bengal", district: "Kolkata", code: "WB-PC-01" },
  { name: "Jaipur Rural", type: "parliamentary", state: "Rajasthan", district: "Jaipur", code: "RJ-PC-01" },
];

// ── Candidate Data (injected after party/constituency IDs are known) ──

interface CandidateInput {
  name: string;
  party_key: string;
  constituency_key: string;
  photo_url: string;
  age: number;
  education: string;
  criminal_cases: number;
  assets_declared: number;
  liabilities: number;
  manifesto_summary: string;
  social_links: Record<string, string>;
}

const CANDIDATES: CandidateInput[] = [
  // ── Pune South (MH-PA-123) ─────────────────────────────────
  {
    name: "Rajesh Patil",
    party_key: "NCP",
    constituency_key: "MH-PA-123",
    photo_url: "https://ui-avatars.com/api/?name=Rajesh+Patil&background=00B050&color=fff&size=200",
    age: 52,
    education: "MBA — Finance, Symbiosis Institute",
    criminal_cases: 4,
    assets_declared: 42000000,
    liabilities: 6800000,
    manifesto_summary: "Rajesh Patil's platform focuses on urban infrastructure, water supply, and women safety. He is an incumbent MLA with two terms of service and promises 24/7 electricity for Pune South.",
    social_links: { twitter: "https://twitter.com/rajeshpatil", website: "https://rajeshpatil.in" },
  },
  {
    name: "Priya Sharma",
    party_key: "BJP",
    constituency_key: "MH-PA-123",
    photo_url: "https://ui-avatars.com/api/?name=Priya+Sharma&background=FF6B00&color=fff&size=200",
    age: 44,
    education: "B.A. Political Science, Delhi University; LLB, Mumbai University",
    criminal_cases: 0,
    assets_declared: 28500000,
    liabilities: 3200000,
    manifesto_summary: "Priya Sharma is a first-time candidate and practicing advocate. Her manifesto focuses on women entrepreneurship, road infrastructure, and setting up a skill development center in Pune South.",
    social_links: { twitter: "https://twitter.com/priyasharmabjp", instagram: "https://instagram.com/priyasharmabjp" },
  },
  {
    name: "Arjun Mehta",
    party_key: "INC",
    constituency_key: "MH-PA-123",
    photo_url: "https://ui-avatars.com/api/?name=Arjun+Mehta&background=007BFF&color=fff&size=200",
    age: 38,
    education: "B.Tech, IIT Bombay; MBA, IIM Ahmedabad",
    criminal_cases: 1,
    assets_declared: 18200000,
    liabilities: 5000000,
    manifesto_summary: "Arjun Mehta is a tech entrepreneur turned politician. He focuses on digital governance, startup ecosystem building, and smart city initiatives for Pune South constituency.",
    social_links: { twitter: "https://twitter.com/arjunmehta_inc" },
  },
  // ── Kasba Peth (MH-PA-124) ─────────────────────────────────
  {
    name: "Sunita Desai",
    party_key: "AAP",
    constituency_key: "MH-PA-124",
    photo_url: "https://ui-avatars.com/api/?name=Sunita+Desai&background=0080FF&color=fff&size=200",
    age: 49,
    education: "M.Sc. Environmental Science, Pune University",
    criminal_cases: 0,
    assets_declared: 9800000,
    liabilities: 1500000,
    manifesto_summary: "Sunita Desai is an environmental activist and former school principal. Her key issues are clean air, Mula-Mutha river restoration, and free quality education in government schools.",
    social_links: { twitter: "https://twitter.com/sunitadesai_aap", facebook: "https://facebook.com/sunitadesai" },
  },
  {
    name: "Vikram Joshi",
    party_key: "IND",
    constituency_key: "MH-PA-124",
    photo_url: "https://ui-avatars.com/api/?name=Vikram+Joshi&background=6B7280&color=fff&size=200",
    age: 61,
    education: "B.Com, Fergusson College Pune; CA (Chartered Accountant)",
    criminal_cases: 2,
    assets_declared: 55000000,
    liabilities: 12000000,
    manifesto_summary: "Vikram Joshi is a veteran community leader and chartered accountant running as an independent. He focuses on financial accountability in local governance and fighting corruption.",
    social_links: { website: "https://vikramjoshi.org" },
  },
  {
    name: "Meena Kulkarni",
    party_key: "BJP",
    constituency_key: "MH-PA-124",
    photo_url: "https://ui-avatars.com/api/?name=Meena+Kulkarni&background=FF6B00&color=fff&size=200",
    age: 56,
    education: "M.A. Sociology, SNDT Women's University",
    criminal_cases: 0,
    assets_declared: 22000000,
    liabilities: 2800000,
    manifesto_summary: "Meena Kulkarni has served on the PMC for 12 years. Her priorities include heritage conservation, accessible public transport, and slum rehabilitation in Kasba Peth.",
    social_links: { twitter: "https://twitter.com/meenakulkarni_bjp" },
  },
  // ── Shivajinagar (MH-PA-125) ────────────────────────────────
  {
    name: "Suresh Godse",
    party_key: "BJP",
    constituency_key: "MH-PA-125",
    photo_url: "https://ui-avatars.com/api/?name=Suresh+Godse&background=FF6B00&color=fff&size=200",
    age: 63,
    education: "B.A. History, University of Pune",
    criminal_cases: 3,
    assets_declared: 78000000,
    liabilities: 14000000,
    manifesto_summary: "Suresh Godse is a three-term MLA known for local road development projects. His focus is on IT Park expansion, PMAY housing, and metro extension to Shivajinagar.",
    social_links: { twitter: "https://twitter.com/sureshgodse" },
  },
  {
    name: "Anjali Pawar",
    party_key: "NCP",
    constituency_key: "MH-PA-125",
    photo_url: "https://ui-avatars.com/api/?name=Anjali+Pawar&background=00B050&color=fff&size=200",
    age: 41,
    education: "LLB, ILS Law College Pune",
    criminal_cases: 0,
    assets_declared: 14500000,
    liabilities: 3100000,
    manifesto_summary: "Anjali Pawar is a human rights lawyer and first-time candidate. Her platform includes free legal aid centers, night shelter for homeless, and college scholarships for OBC students.",
    social_links: { instagram: "https://instagram.com/anjalipawar_ncp" },
  },
  // ── Pune North (MH-PA-121) ─────────────────────────────────
  {
    name: "Ramesh Deshpande",
    party_key: "INC",
    constituency_key: "MH-PA-121",
    photo_url: "https://ui-avatars.com/api/?name=Ramesh+Deshpande&background=007BFF&color=fff&size=200",
    age: 59,
    education: "MBBS, B.J. Medical College Pune",
    criminal_cases: 1,
    assets_declared: 31000000,
    liabilities: 7200000,
    manifesto_summary: "Dr. Ramesh Deshpande is a surgeon turned politician. He promises a 500-bed hospital for Pune North, mobile health clinics for slums, and free dialysis centers.",
    social_links: { twitter: "https://twitter.com/dr_deshpande_inc" },
  },
  {
    name: "Pallavi More",
    party_key: "AAP",
    constituency_key: "MH-PA-121",
    photo_url: "https://ui-avatars.com/api/?name=Pallavi+More&background=0080FF&color=fff&size=200",
    age: 35,
    education: "B.E. Civil Engineering, COEP; PGD Urban Planning",
    criminal_cases: 0,
    assets_declared: 8500000,
    liabilities: 1200000,
    manifesto_summary: "Pallavi More is a town planner and RTI activist. Her agenda covers stormwater drain fixes, illegal construction crackdown, and open-source budget tracking for PMC projects.",
    social_links: { twitter: "https://twitter.com/pallavi_more_aap", facebook: "https://facebook.com/pallavimore" },
  },
  // ── Chandni Chowk, Delhi (DL-PC-01) ────────────────────────
  {
    name: "Praveen Khandelwal",
    party_key: "BJP",
    constituency_key: "DL-PC-01",
    photo_url: "https://ui-avatars.com/api/?name=Praveen+Khandelwal&background=FF6B00&color=fff&size=200",
    age: 57,
    education: "B.Com, Delhi University",
    criminal_cases: 0,
    assets_declared: 63000000,
    liabilities: 9500000,
    manifesto_summary: "Praveen Khandelwal leads the Confederation of All India Traders. His focus is on trader welfare, GST simplification, and Yamuna flood plain restoration in Old Delhi.",
    social_links: { twitter: "https://twitter.com/pkhandelwalbjp" },
  },
  {
    name: "JP Agarwal",
    party_key: "INC",
    constituency_key: "DL-PC-01",
    photo_url: "https://ui-avatars.com/api/?name=JP+Agarwal&background=007BFF&color=fff&size=200",
    age: 71,
    education: "B.Com, Shri Ram College of Commerce",
    criminal_cases: 2,
    assets_declared: 89000000,
    liabilities: 18000000,
    manifesto_summary: "J.P. Agarwal is a veteran Congress MP with six terms. He champions affordable housing for Old Delhi residents, heritage street revival, and Yamuna cleanup.",
    social_links: { twitter: "https://twitter.com/jp_agarwal_inc" },
  },
  {
    name: "Parveen Imran",
    party_key: "AAP",
    constituency_key: "DL-PC-01",
    photo_url: "https://ui-avatars.com/api/?name=Parveen+Imran&background=0080FF&color=fff&size=200",
    age: 46,
    education: "M.A. Political Science, JNU",
    criminal_cases: 0,
    assets_declared: 7200000,
    liabilities: 800000,
    manifesto_summary: "Parveen Imran is a community organiser from Ballimaran. Her platform includes mohalla clinic expansion, waste management reform, and schooling for out-of-school children.",
    social_links: { instagram: "https://instagram.com/parveenimran_aap" },
  },
  // ── New Delhi (DL-PC-02) ────────────────────────────────────
  {
    name: "Bansuri Swaraj",
    party_key: "BJP",
    constituency_key: "DL-PC-02",
    photo_url: "https://ui-avatars.com/api/?name=Bansuri+Swaraj&background=FF6B00&color=fff&size=200",
    age: 43,
    education: "LLB, Oxford University",
    criminal_cases: 0,
    assets_declared: 45000000,
    liabilities: 5500000,
    manifesto_summary: "Bansuri Swaraj is an advocate at the Supreme Court. She focuses on women safety, urban renewal of Lutyens' Delhi, and boosting MSME sector in the constituency.",
    social_links: { twitter: "https://twitter.com/bansuri_swaraj" },
  },
  {
    name: "Somnath Bharti",
    party_key: "AAP",
    constituency_key: "DL-PC-02",
    photo_url: "https://ui-avatars.com/api/?name=Somnath+Bharti&background=0080FF&color=fff&size=200",
    age: 51,
    education: "B.Tech, IIT Delhi; LLB, Campus Law Centre DU",
    criminal_cases: 5,
    assets_declared: 19000000,
    liabilities: 6200000,
    manifesto_summary: "Somnath Bharti is a former Delhi Law Minister. His agenda includes free WiFi in parks, 24/7 mohalla clinics, and rooftop solar subsidy for Malviya Nagar residents.",
    social_links: { twitter: "https://twitter.com/sbharti_aap" },
  },
  // ── East Delhi (DL-PC-03) ────────────────────────────────────
  {
    name: "Harsh Malhotra",
    party_key: "BJP",
    constituency_key: "DL-PC-03",
    photo_url: "https://ui-avatars.com/api/?name=Harsh+Malhotra&background=FF6B00&color=fff&size=200",
    age: 48,
    education: "B.A. Economics, Kirori Mal College",
    criminal_cases: 1,
    assets_declared: 52000000,
    liabilities: 11000000,
    manifesto_summary: "Harsh Malhotra is a sitting MP focusing on Signature Bridge road connectivity, industrial estate modernization in Patparganj, and drinking water supply to resettlement colonies.",
    social_links: { twitter: "https://twitter.com/harshmalhotra_bjp" },
  },
  {
    name: "Kuldeep Kumar",
    party_key: "AAP",
    constituency_key: "DL-PC-03",
    photo_url: "https://ui-avatars.com/api/?name=Kuldeep+Kumar&background=0080FF&color=fff&size=200",
    age: 39,
    education: "B.A. Sociology, Delhi University",
    criminal_cases: 0,
    assets_declared: 5800000,
    liabilities: 900000,
    manifesto_summary: "Kuldeep Kumar is a grassroots worker and former Delhi MLA. He promises free bus passes for women, more CCTV in jhuggi areas, and employment exchange modernization.",
    social_links: { facebook: "https://facebook.com/kuldeepkumar_aap" },
  },
  // ── Chennai North (TN-PC-01) ─────────────────────────────────
  {
    name: "Kalanidhi Veeraswamy",
    party_key: "INC",
    constituency_key: "TN-PC-01",
    photo_url: "https://ui-avatars.com/api/?name=Kalanidhi+Veeraswamy&background=007BFF&color=fff&size=200",
    age: 66,
    education: "B.A. Tamil Literature, Madras University",
    criminal_cases: 3,
    assets_declared: 118000000,
    liabilities: 25000000,
    manifesto_summary: "Kalanidhi Veeraswamy is a seven-term MP. He focuses on expanding Chennai port employment, Ennore creek clean-up, and welfare pensions for fishermen communities.",
    social_links: { twitter: "https://twitter.com/kalanidhi_tnc" },
  },
  {
    name: "Shanthi Thiagarajan",
    party_key: "IND",
    constituency_key: "TN-PC-01",
    photo_url: "https://ui-avatars.com/api/?name=Shanthi+Thiagarajan&background=6B7280&color=fff&size=200",
    age: 54,
    education: "M.Sc. Marine Biology, Anna University",
    criminal_cases: 0,
    assets_declared: 6200000,
    liabilities: 1100000,
    manifesto_summary: "Shanthi Thiagarajan is a marine scientist turned activist. She campaigns for coastal erosion protection, ban on bottom trawling, and establishment of Tamil Nadu's first coastal research university.",
    social_links: { website: "https://shanthi4chennainorth.in" },
  },
  // ── Kolkata Uttar (WB-PC-01) ─────────────────────────────────
  {
    name: "Sudip Bandyopadhyay",
    party_key: "INC",
    constituency_key: "WB-PC-01",
    photo_url: "https://ui-avatars.com/api/?name=Sudip+Bandyopadhyay&background=007BFF&color=fff&size=200",
    age: 68,
    education: "B.A. Political Science, Presidency College Kolkata",
    criminal_cases: 8,
    assets_declared: 95000000,
    liabilities: 31000000,
    manifesto_summary: "Sudip Bandyopadhyay is a veteran AITC leader. His priorities include Kolkata port revival, jute industry modernization, and metro extension to Dum Dum.",
    social_links: { twitter: "https://twitter.com/sudipbandyo" },
  },
  {
    name: "Tapas Roy",
    party_key: "BJP",
    constituency_key: "WB-PC-01",
    photo_url: "https://ui-avatars.com/api/?name=Tapas+Roy&background=FF6B00&color=fff&size=200",
    age: 59,
    education: "B.Com, Calcutta University",
    criminal_cases: 2,
    assets_declared: 41000000,
    liabilities: 9800000,
    manifesto_summary: "Tapas Roy is a BJP national secretary. He campaigns on central government schemes delivery, illegal immigration control, and flood relief infrastructure for North Kolkata.",
    social_links: { twitter: "https://twitter.com/tapasroy_bjp" },
  },
  // ── Jaipur Rural (RJ-PC-01) ──────────────────────────────────
  {
    name: "Rajyavardhan Rathore",
    party_key: "BJP",
    constituency_key: "RJ-PC-01",
    photo_url: "https://ui-avatars.com/api/?name=Rajyavardhan+Rathore&background=FF6B00&color=fff&size=200",
    age: 54,
    education: "M.Sc. Defence Studies, Rajputana Rifles; B.Sc. RMA Dehradun",
    criminal_cases: 0,
    assets_declared: 38000000,
    liabilities: 4200000,
    manifesto_summary: "Col. Rajyavardhan Rathore is a Rajiv Gandhi Khel Ratna awardee and sitting MP. His priorities include sports academies for rural youth, farm-to-market roads, and solar irrigation for Jaipur Rural.",
    social_links: { twitter: "https://twitter.com/ra_rathore" },
  },
  {
    name: "Archana Sharma",
    party_key: "INC",
    constituency_key: "RJ-PC-01",
    photo_url: "https://ui-avatars.com/api/?name=Archana+Sharma&background=007BFF&color=fff&size=200",
    age: 47,
    education: "MBBS, SMS Medical College Jaipur",
    criminal_cases: 0,
    assets_declared: 26000000,
    liabilities: 3700000,
    manifesto_summary: "Dr. Archana Sharma is a gynecologist and Congress leader. She promises 500 new Rajiv Gandhi Health Centres for rural areas, free maternal care, and girl child scholarship program.",
    social_links: { twitter: "https://twitter.com/archanasharma_inc", website: "https://archanasharma4jaipur.in" },
  },
  {
    name: "Gopal Lal Jain",
    party_key: "IND",
    constituency_key: "RJ-PC-01",
    photo_url: "https://ui-avatars.com/api/?name=Gopal+Lal+Jain&background=6B7280&color=fff&size=200",
    age: 72,
    education: "B.A. Hindi Literature, Rajasthan University",
    criminal_cases: 1,
    assets_declared: 44000000,
    liabilities: 8500000,
    manifesto_summary: "Gopal Lal Jain is a four-term former MLA contesting as independent. His campaign focuses on Ghambhiri dam water supply, rural road repair, and cow shelter establishment.",
    social_links: { facebook: "https://facebook.com/gopallal_jain" },
  },
];

// ── Seed Functions ─────────────────────────────────────────────

async function seedParties(): Promise<Map<string, string>> {
  console.log("🏛️  Seeding parties...");
  const partyIdMap = new Map<string, string>();

  for (const party of PARTIES) {
    const { data: existing } = await supabase
      .from("parties")
      .select("id")
      .eq("abbreviation", party.abbreviation)
      .maybeSingle();

    if (existing) {
      console.log(`  ⏭️  Skipping "${party.abbreviation}" (exists)`);
      partyIdMap.set(party.abbreviation, existing.id);
      continue;
    }

    const { data, error } = await supabase
      .from("parties")
      .insert(party)
      .select("id")
      .single();

    if (error) {
      console.error(`  ❌ Failed to insert "${party.abbreviation}":`, error.message);
    } else {
      console.log(`  ✅ Inserted: ${party.name} (${party.abbreviation})`);
      partyIdMap.set(party.abbreviation, data.id);
    }
  }

  return partyIdMap;
}

async function seedConstituencies(): Promise<Map<string, string>> {
  console.log("\n📍 Seeding constituencies...");
  const constituencyIdMap = new Map<string, string>();

  for (const c of CONSTITUENCIES) {
    const { data: existing } = await supabase
      .from("constituencies")
      .select("id")
      .eq("code", c.code)
      .maybeSingle();

    if (existing) {
      console.log(`  ⏭️  Skipping "${c.name}" (exists)`);
      constituencyIdMap.set(c.code, existing.id);
      continue;
    }

    const { data, error } = await supabase
      .from("constituencies")
      .insert(c)
      .select("id")
      .single();

    if (error) {
      console.error(`  ❌ Failed to insert "${c.name}":`, error.message);
    } else {
      console.log(`  ✅ Inserted: ${c.name} (${c.state})`);
      constituencyIdMap.set(c.code, data.id);
    }
  }

  return constituencyIdMap;
}

async function seedCandidates(
  partyIdMap: Map<string, string>,
  constituencyIdMap: Map<string, string>
) {
  console.log("\n👤 Seeding candidates...");

  // Get or create the reference election (Lok Sabha 2024)
  const { data: election } = await supabase
    .from("elections")
    .select("id")
    .eq("year", 2024)
    .eq("type", "general")
    .maybeSingle();

  const electionId = election?.id ?? null;
  if (!electionId) {
    console.log(
      "  ⚠️  No Lok Sabha 2024 election found. Run seed-elections.ts first. Candidates will be seeded without election link."
    );
  }

  for (const candidate of CANDIDATES) {
    const partyId = partyIdMap.get(candidate.party_key);
    const constituencyId = constituencyIdMap.get(candidate.constituency_key);

    if (!partyId || !constituencyId) {
      console.error(
        `  ❌ Missing party or constituency ID for ${candidate.name}. Skipping.`
      );
      continue;
    }

    const { data: existing } = await supabase
      .from("candidates")
      .select("id")
      .eq("name", candidate.name)
      .eq("constituency_id", constituencyId)
      .maybeSingle();

    if (existing) {
      console.log(`  ⏭️  Skipping "${candidate.name}" (exists)`);
      continue;
    }

    const { error } = await supabase.from("candidates").insert({
      name: candidate.name,
      party_id: partyId,
      constituency_id: constituencyId,
      election_id: electionId,
      photo_url: candidate.photo_url,
      age: candidate.age,
      education: candidate.education,
      criminal_cases: candidate.criminal_cases,
      assets_declared: candidate.assets_declared,
      liabilities: candidate.liabilities,
      manifesto_summary: candidate.manifesto_summary,
      social_links: candidate.social_links,
    });

    if (error) {
      console.error(`  ❌ Failed to insert "${candidate.name}":`, error.message);
    } else {
      console.log(`  ✅ Inserted: ${candidate.name} (${candidate.party_key})`);
    }
  }
}

// ── Main ──────────────────────────────────────────────────────

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("  ElectionGuide AI — Candidates Seed Script");
  console.log("═══════════════════════════════════════════\n");

  const partyIdMap = await seedParties();
  const constituencyIdMap = await seedConstituencies();
  await seedCandidates(partyIdMap, constituencyIdMap);

  console.log("\n═══════════════════════════════════════════");
  console.log("  ✅ Seeding complete!");
  console.log(`     ${PARTIES.length} parties · ${CONSTITUENCIES.length} constituencies · ${CANDIDATES.length} candidates`);
  console.log("═══════════════════════════════════════════");
}

main().catch(console.error);
