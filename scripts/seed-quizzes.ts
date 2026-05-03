/**
 * ElectionGuide AI — Quizzes Seed Script
 * Usage: npx tsx scripts/seed-quizzes.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const QUIZZES = [
  {
    title: "EVM & VVPAT",
    description: "Test your knowledge of Electronic Voting Machines and paper audit trails.",
    category: "evm",
    difficulty: "medium",
    time_limit_seconds: 600,
    passing_score: 70,
    language: "en",
    questions: [
      { id:"q1", question:"EVM stands for?", options:["Electronic Voting Machine","Electoral Verification Method","Electronic Voter Module","Electro Vote Meter"], correct:0, explanation:"EVM = Electronic Voting Machine, replacing paper ballots in India." },
      { id:"q2", question:"Which two PSUs manufacture EVMs?", options:["TATA & Infosys","BEL & ECIL","ISRO & DRDO","HAL & BHEL"], correct:1, explanation:"BEL (Bharat Electronics Ltd) and ECIL (Electronics Corporation of India Ltd) are the sole manufacturers." },
      { id:"q3", question:"VVPAT stands for?", options:["Voter Verified Paper Audit Trail","Verified Vote Print Acknowledgement Trail","Voter Verifiable Paper Audit Trail","Vote Verification and Print Audit Tool"], correct:2, explanation:"VVPAT = Voter Verifiable Paper Audit Trail — gives a printed slip confirmation of your vote." },
      { id:"q4", question:"How long is the VVPAT slip visible?", options:["3 seconds","5 seconds","7 seconds","10 seconds"], correct:2, explanation:"The slip is displayed for exactly 7 seconds through a glass window before falling into a sealed box." },
      { id:"q5", question:"How many VVPAT slips are counted per assembly segment per SC 2019 order?", options:["1","3","5","10"], correct:2, explanation:"Supreme Court mandated physical counting of VVPAT slips from 5 randomly selected booths per assembly segment." },
      { id:"q6", question:"What is First Level Checking (FLC)?", options:["Election-morning EVM test","Hardware & software check before elections with party reps present","Post-election audit","Factory quality control"], correct:1, explanation:"FLC is a comprehensive pre-election check by BEL/ECIL engineers in the presence of political party representatives." },
      { id:"q7", question:"Minimum votes in pre-poll mock test on election morning?", options:["10","25","50","100"], correct:2, explanation:"A minimum of 50 mock votes must be cast and verified against VVPAT before real voting begins." },
      { id:"q8", question:"Which chip type makes EVMs tamper-proof?", options:["Reprogrammable EEPROM","One-Time Programmable (OTP)","Flash memory","RAM chip"], correct:1, explanation:"OTP chips are programmed once at manufacture — the software cannot be changed afterwards." },
      { id:"q9", question:"EVM randomization happens how many times?", options:["Once","Twice","Three times","Four times"], correct:1, explanation:"Two-stage randomization: first assigns EVMs to constituencies, second assigns to specific booths." },
      { id:"q10", question:"Who operates the Control Unit at the polling station?", options:["The voter","Candidate agent","Presiding Officer","Returning Officer"], correct:2, explanation:"The Presiding Officer operates the Control Unit and presses 'Ballot' for each verified voter." },
      { id:"q11", question:"What connects the Ballot Unit and Control Unit?", options:["WiFi","Bluetooth","A 5-metre cable","They are wireless"], correct:2, explanation:"BU and CU are connected by a 5-metre cable — no wireless connectivity exists in the EVM system." },
      { id:"q12", question:"Where are sealed EVMs stored after polling?", options:["Police station","Strong room","District court","Collector's office"], correct:1, explanation:"Sealed EVMs are stored in strong rooms under 3-tier armed security until counting day." },
      { id:"q13", question:"What happens if mock poll results don't match VVPAT slips?", options:["Polling continues anyway","EVM is repaired on-site","EVM is replaced with a reserve unit","Returning Officer is notified only"], correct:2, explanation:"Any discrepancy means the EVM is immediately replaced and the mock poll is repeated with a reserve unit." },
      { id:"q14", question:"Can an EVM be connected to the internet during polling?", options:["Yes, for real-time reporting","No, it has no network connectivity","Only via 4G modem","Only after polls close"], correct:1, explanation:"EVMs are fully standalone with no network, internet, Bluetooth, or WiFi connectivity at any point." },
      { id:"q15", question:"Which law governs EVM usage in Indian elections?", options:["Section 61A, RP Act 1951","Article 324, Constitution","IT Act 2000","EVM Act 1989"], correct:0, explanation:"Section 61A of the Representation of the People Act 1951 authorises the use of voting machines in elections." },
    ],
  },
  {
    title: "Constitutional Rights",
    description: "Master India's constitutional provisions related to elections and voting rights.",
    category: "law",
    difficulty: "hard",
    time_limit_seconds: 900,
    passing_score: 60,
    language: "en",
    questions: [
      { id:"q1", question:"Which article establishes universal adult franchise?", options:["Article 324","Article 325","Article 326","Article 327"], correct:2, explanation:"Article 326 grants the right to vote to every citizen 18+ not otherwise disqualified." },
      { id:"q2", question:"Which article establishes the Election Commission of India?", options:["Article 280","Article 315","Article 324","Article 339"], correct:2, explanation:"Article 324 establishes the ECI and vests in it superintendence, direction and control of elections." },
      { id:"q3", question:"Article 325 states that no person shall be excluded from electoral rolls on grounds of?", options:["Age","Religion, race, caste or sex","Criminal conviction","Non-payment of taxes"], correct:1, explanation:"Article 325 prohibits exclusion from electoral rolls on grounds of religion, race, caste, or sex." },
      { id:"q4", question:"Which article empowers Parliament to make laws on elections?", options:["Article 326","Article 327","Article 328","Article 329"], correct:1, explanation:"Article 327 empowers Parliament to make provisions for all matters relating to elections to Parliament and State Legislatures." },
      { id:"q5", question:"Article 329 bars courts from interfering in elections except by?", options:["Writ petition","Election petition after results","PIL","High Court suo motu"], correct:1, explanation:"Article 329 bars court interference during elections; disputes can only be raised through an election petition after results." },
      { id:"q6", question:"Minimum age for Lok Sabha candidacy?", options:["18","21","25","30"], correct:2, explanation:"Article 84 requires a person to be at least 25 years old to be eligible for Lok Sabha membership." },
      { id:"q7", question:"Minimum age for Rajya Sabha candidacy?", options:["25","28","30","35"], correct:2, explanation:"Article 84(b) requires a person to be at least 30 years old to contest for Rajya Sabha." },
      { id:"q8", question:"The Model Code of Conduct derives its authority from?", options:["Constitution of India","Representation of the People Act","ECI's plenary powers under Article 324","Prevention of Corruption Act"], correct:2, explanation:"The MCC is not a statutory document — it draws authority from ECI's plenary powers under Article 324." },
      { id:"q9", question:"Election Commission is a body of how many members?", options:["1","2","3","5"], correct:2, explanation:"The ECI consists of the Chief Election Commissioner and two Election Commissioners (since 1989)." },
      { id:"q10", question:"Who can remove the Chief Election Commissioner?", options:["President on PM's advice","Parliament by impeachment like a Supreme Court judge","Cabinet decision","Supreme Court order"], correct:1, explanation:"The CEC can only be removed through impeachment by Parliament — same process as a Supreme Court judge." },
      { id:"q11", question:"The voting age was reduced from 21 to 18 by which amendment?", options:["42nd Amendment","52nd Amendment","61st Amendment","73rd Amendment"], correct:2, explanation:"The 61st Constitutional Amendment (1988) reduced the voting age from 21 to 18 years." },
      { id:"q12", question:"Which Fundamental Right is violated if a voter is impersonated?", options:["Article 14","Article 19","Article 21","Article 25"], correct:0, explanation:"Voter impersonation violates Article 14 (Right to Equality) — each vote must count equally." },
      { id:"q13", question:"Under which schedule do Panchayat elections fall?", options:["9th Schedule","10th Schedule","11th Schedule","12th Schedule"], correct:2, explanation:"The 11th Schedule (added by 73rd Amendment) lists subjects for Panchayati Raj, with elections governed by Article 243K." },
      { id:"q14", question:"Election petitions are filed in?", options:["Supreme Court","High Court","District Court","Election Tribunal"], correct:1, explanation:"Under Section 80 of RP Act 1951, election petitions for Lok Sabha and State Assembly are filed in the High Court." },
      { id:"q15", question:"Which section of RP Act disqualifies a person convicted with 2+ years jail?", options:["Section 8","Section 9","Section 10","Section 11"], correct:0, explanation:"Section 8 of RP Act 1951 disqualifies persons convicted of certain offences and sentenced to 2 or more years of imprisonment." },
      { id:"q16", question:"NOTA option was introduced by the Supreme Court in?", options:["2009","2011","2013","2015"], correct:2, explanation:"The Supreme Court directed ECI to introduce the NOTA (None Of The Above) option in its September 2013 judgment." },
      { id:"q17", question:"What is the term of the Election Commission members?", options:["5 years or 65 years of age, whichever earlier","6 years or 65 years, whichever earlier","5 years fixed","Till pleasure of President"], correct:1, explanation:"Election Commissioners serve for 6 years or until age 65, whichever comes earlier." },
      { id:"q18", question:"Which article empowers states to legislate on state legislature elections?", options:["Article 327","Article 328","Article 329","Article 330"], correct:1, explanation:"Article 328 empowers each State Legislature to make laws on elections to that State Legislature, subject to parliamentary laws." },
      { id:"q19", question:"Anti-defection law is in which schedule?", options:["8th Schedule","9th Schedule","10th Schedule","11th Schedule"], correct:2, explanation:"The 10th Schedule (added by 52nd Amendment 1985) contains the anti-defection law for disqualifying legislators." },
      { id:"q20", question:"Right to vote is a?", options:["Fundamental Right","Constitutional Right","Statutory Right","Natural Right"], correct:2, explanation:"The right to vote is a statutory right under Section 62 of RP Act 1951 — not a fundamental right under Part III of the Constitution." },
    ],
  },
  {
    title: "Election Process",
    description: "Understand the step-by-step process of how Indian elections are conducted.",
    category: "voting",
    difficulty: "easy",
    time_limit_seconds: 480,
    passing_score: 70,
    language: "en",
    questions: [
      { id:"q1", question:"Who announces election dates in India?", options:["President","Prime Minister","Election Commission of India","Cabinet"], correct:2, explanation:"The Election Commission of India announces the election schedule, triggering the Model Code of Conduct." },
      { id:"q2", question:"What is indelible ink made from?", options:["Normal ink","Silver nitrate solution","Carbon compound","Iron oxide"], correct:1, explanation:"Indelible ink contains silver nitrate which reacts with skin proteins to create a long-lasting mark." },
      { id:"q3", question:"On which finger is ink applied?", options:["Right thumb","Left index finger","Right index finger","Left thumb"], correct:1, explanation:"Indelible ink is applied on the left index finger (or next available finger) to prevent double voting." },
      { id:"q4", question:"What time do polls officially open?", options:["6 AM","7 AM","8 AM","9 AM"], correct:1, explanation:"Polling stations open at 7:00 AM. The mock poll is conducted between 6:30-7:00 AM." },
      { id:"q5", question:"What time do polls officially close?", options:["4 PM","5 PM","6 PM","7 PM"], correct:2, explanation:"Polls close at 6:00 PM. Those already in queue can still vote after closing time." },
      { id:"q6", question:"The Model Code of Conduct begins from?", options:["Date of polling","Date of schedule announcement","Filing of nominations","15 days before polling"], correct:1, explanation:"The MCC comes into force immediately on the date the ECI announces the election schedule." },
      { id:"q7", question:"Which document is the primary voter ID?", options:["Aadhaar card","PAN card","EPIC (Voter ID card)","Driving license"], correct:2, explanation:"EPIC (Electoral Photo Identity Card) is the primary voter ID, though 11 other documents are also accepted." },
      { id:"q8", question:"How many photo IDs are accepted for voting?", options:["6","9","12","15"], correct:2, explanation:"ECI accepts 12 approved photo identity documents including EPIC, Aadhaar, Passport, and Driving License." },
      { id:"q9", question:"What is a Booth Level Officer (BLO)?", options:["Police officer at booth","Government official responsible for a group of booths' electoral rolls","Officer who counts votes","Election Commission representative"], correct:1, explanation:"BLO is a government official responsible for maintaining the accuracy of electoral rolls for a group of polling stations." },
      { id:"q10", question:"Constituency-wise candidate list is published in?", options:["Form 7A","Form 17","Form 7B","Form 20"], correct:3, explanation:"Form 20 is the final list of contesting candidates published by the Returning Officer after withdrawal of nominations." },
      { id:"q11", question:"What is a Sector Officer's role on polling day?", options:["Count votes","Supervise 5-10 polling stations and respond to complaints","Verify EVM seals","Assist disabled voters"], correct:1, explanation:"Sector Officers supervise a cluster of polling stations, coordinate with Presiding Officers, and respond to field issues." },
      { id:"q12", question:"Result declaration form for Lok Sabha is?", options:["Form 20","Form 21C","Form 21E","Form 17C"], correct:2, explanation:"Form 21E is used to declare results for parliamentary (Lok Sabha) constituencies." },
    ],
  },
  {
    title: "Candidate Rules",
    description: "Know the rules, eligibility, and obligations for election candidates.",
    category: "candidacy",
    difficulty: "medium",
    time_limit_seconds: 450,
    passing_score: 70,
    language: "en",
    questions: [
      { id:"q1", question:"Minimum age to contest Lok Sabha?", options:["18","21","25","30"], correct:2, explanation:"A candidate must be at least 25 years old to contest a Lok Sabha election under Article 84 of the Constitution." },
      { id:"q2", question:"Which form is the mandatory affidavit for candidates?", options:["Form 2B","Form 6","Form 26","Form 12"], correct:2, explanation:"Form 26 is the affidavit declaring criminal cases, assets, liabilities, and education — mandatory for all candidates." },
      { id:"q3", question:"Security deposit for a Lok Sabha candidate (general)?", options:["₹10,000","₹15,000","₹25,000","₹50,000"], correct:2, explanation:"The security deposit for a Lok Sabha candidate is ₹25,000 (₹12,500 for SC/ST candidates)." },
      { id:"q4", question:"When is the security deposit forfeited?", options:["Always","If candidate gets less than 1/6 of valid votes","If candidate withdraws","If candidate loses"], correct:1, explanation:"Security deposit is forfeited if a candidate fails to secure more than 1/6th of total valid votes in the constituency." },
      { id:"q5", question:"Lok Sabha election expense limit (large states)?", options:["₹50 lakh","₹70 lakh","₹95 lakh","₹1.5 crore"], correct:2, explanation:"As per the January 2022 revision, the election expenditure limit for Lok Sabha is ₹95 lakh in larger states." },
      { id:"q6", question:"A person convicted with 2+ years imprisonment is disqualified for?", options:["1 year","2 years","6 years after release","Lifetime"], correct:2, explanation:"Under Section 8(3) of RP Act, such a person is disqualified for the period of imprisonment + 6 years after release." },
      { id:"q7", question:"Independent candidates choose symbols from?", options:["Any symbol they like","A prescribed list of free symbols","Party-approved symbols","ECI-assigned symbols only"], correct:1, explanation:"Independent candidates must choose from the list of free symbols notified by the ECI — they cannot use any arbitrary symbol." },
      { id:"q8", question:"A candidate must submit election expense account within?", options:["7 days","15 days","30 days","45 days"], correct:2, explanation:"Candidates must lodge their account of election expenses with the District Election Officer within 30 days of result declaration." },
      { id:"q9", question:"Nomination is filed with?", options:["Chief Election Commissioner","District Collector","Returning Officer","Electoral Registration Officer"], correct:2, explanation:"Nominations are filed with the Returning Officer (RO) of the respective constituency during the specified nomination period." },
      { id:"q10", question:"A party candidate needs which form from their party?", options:["Form A","Form B","Form 2B","Form 6A"], correct:0, explanation:"Recognised political parties issue Form A (party authorisation) to their official candidates for nomination filing." },
    ],
  },
  {
    title: "Election History",
    description: "Test your knowledge of landmark moments in Indian electoral history.",
    category: "history",
    difficulty: "hard",
    time_limit_seconds: 720,
    passing_score: 60,
    language: "en",
    questions: [
      { id:"q1", question:"India's first general election was held in?", options:["1947","1950","1951-52","1954"], correct:2, explanation:"India's first general election was held in 1951-52 (polling concluded in February 1952). Jawaharlal Nehru led INC to victory." },
      { id:"q2", question:"Who was India's first Chief Election Commissioner?", options:["T.N. Seshan","K.V.K. Sundaram","Sukumar Sen","S.P. Sen Verma"], correct:2, explanation:"Sukumar Sen was India's first Chief Election Commissioner (1950-1958), who conducted the first two general elections." },
      { id:"q3", question:"The famous 'Midnight's Election' — Emergency was imposed by?", options:["Rajiv Gandhi","V.P. Singh","Indira Gandhi","Morarji Desai"], correct:2, explanation:"Indira Gandhi imposed the Emergency (1975-77) after the Allahabad HC set aside her election for corrupt practices." },
      { id:"q4", question:"Electronic voting was first used on a pilot basis in?", options:["1982","1989","1995","1999"], correct:0, explanation:"EVMs were used for the first time on a pilot basis in the 1982 Kerala State Assembly election (North Paravur constituency)." },
      { id:"q5", question:"First state assembly to use EVMs across all constituencies?", options:["Delhi","Goa","Kerala","Tamil Nadu"], correct:1, explanation:"Goa was the first state to use EVMs in all constituencies in its 1999 assembly elections." },
      { id:"q6", question:"EVMs were used nationwide in Lok Sabha elections from?", options:["1999","2004","2009","2014"], correct:1, explanation:"The 2004 Lok Sabha elections were the first in which EVMs were used across all constituencies in India." },
      { id:"q7", question:"The T.N. Seshan era (1990-96) is associated with?", options:["Introduction of EVMs","Strict enforcement of Model Code of Conduct","Introduction of NOTA","Online voter registration"], correct:1, explanation:"CEC T.N. Seshan transformed the ECI by rigorously enforcing the MCC and cleaning up elections significantly." },
      { id:"q8", question:"NOTA was first used in state elections in?", options:["November 2013","March 2014","May 2014","October 2015"], correct:0, explanation:"NOTA was first used in November 2013 state assembly elections in 5 states (MP, Rajasthan, Chhattisgarh, Mizoram, Delhi)." },
      { id:"q9", question:"Voter-Verifiable Paper Audit Trail (VVPAT) was introduced nationwide in?", options:["2014","2017","2019","2022"], correct:2, explanation:"VVPATs were used in all Lok Sabha constituencies for the first time in the 2019 general elections." },
      { id:"q10", question:"The 'Right to Reject' concept in NOTA was settled by?", options:["Parliament Act","Election Commission circular","Supreme Court 2013 judgment","High Court 2014 ruling"], correct:2, explanation:"The Supreme Court's September 27, 2013 judgment in PUCL v. Union of India directed introduction of NOTA." },
      { id:"q11", question:"India's highest voter turnout in a Lok Sabha election was in?", options:["1984","2014","2019","2024"], correct:2, explanation:"The 2019 Lok Sabha election recorded approximately 67.4% turnout — the highest ever in Indian general elections at that time." },
      { id:"q12", question:"The delimitation of constituencies is done by?", options:["Election Commission","State Governments","Delimitation Commission","Parliament"], correct:2, explanation:"The Delimitation Commission (formed under Delimitation Act) redraws constituency boundaries based on census data." },
      { id:"q13", question:"Which election led to the first non-Congress government at the Centre?", options:["1971 elections","1977 elections","1980 elections","1984 elections"], correct:1, explanation:"The 1977 elections, held after the Emergency, brought Janata Party to power — India's first non-Congress central government." },
      { id:"q14", question:"Systematic Voters' Education and Electoral Participation (SVEEP) was launched in?", options:["2005","2009","2010","2014"], correct:1, explanation:"SVEEP was launched by ECI in 2009 to promote voter awareness and increase electoral participation across India." },
      { id:"q15", question:"The first woman Chief Election Commissioner of India was?", options:["There has been none yet","V.S. Ramadevi (briefly in 1990)","Meira Kumar","Sushma Swaraj"], correct:1, explanation:"V.S. Ramadevi served as CEC for a brief period in 1990, becoming the first and so far only woman to hold the post." },
      { id:"q16", question:"Postal ballot facility for armed forces was introduced under?", options:["RP Act Section 60","RP Act Section 62","Army Act","Constitution Article 326"], correct:0, explanation:"Section 60 of the Representation of the People Act 1951 enables postal ballot for service voters including armed forces." },
      { id:"q17", question:"The Anti-Defection Law was added by which amendment?", options:["42nd Amendment","52nd Amendment","61st Amendment","73rd Amendment"], correct:1, explanation:"The 52nd Constitutional Amendment (1985) added the 10th Schedule — the Anti-Defection Law." },
      { id:"q18", question:"Simultaneous elections ('One Nation One Election') concept was last significantly debated in?", options:["2014","2018","2023-24","2020"], correct:2, explanation:"The High Level Committee on One Nation One Election, chaired by former President Kovind, submitted its report in 2024." },
    ],
  },
  {
    title: "Civic Duties",
    description: "Understand your responsibilities as a citizen and voter in India's democracy.",
    category: "civic",
    difficulty: "easy",
    time_limit_seconds: 300,
    passing_score: 70,
    language: "en",
    questions: [
      { id:"q1", question:"Voting in India is?", options:["Compulsory","A fundamental right","A statutory right and civic duty","Optional with no significance"], correct:2, explanation:"Voting is a statutory right (Section 62, RP Act) and a fundamental civic duty — though not legally compulsory in most states." },
      { id:"q2", question:"Which app can you use to report election violations?", options:["SAKSHAM","cVIGIL","DigiLocker","Voter Helpline"], correct:1, explanation:"cVIGIL lets citizens upload geotagged photo/video evidence of violations. Flying Squads respond within 100 minutes." },
      { id:"q3", question:"National Voter Helpline number is?", options:["100","1800","1950","112"], correct:2, explanation:"1950 is the toll-free National Voter Helpline for registration queries, complaints, and voter information." },
      { id:"q4", question:"Voter ID can be downloaded digitally from?", options:["UIDAI portal","electoralsearch.in / DigiLocker","Income Tax portal","MCA portal"], correct:1, explanation:"You can download your e-EPIC (digital voter ID) from voters.eci.gov.in or through DigiLocker." },
      { id:"q5", question:"What should you do if your name is missing from electoral roll on voting day?", options:["Go home","Vote with just Aadhaar","File complaint with Sector Officer / BLO immediately","Wait for next election"], correct:2, explanation:"Report to the Sector Officer or BLO at the booth. You can file a complaint and they will attempt to resolve it." },
      { id:"q6", question:"Spreading false information about candidates during elections is?", options:["Allowed as free speech","Punishable under Section 171G, IPC","Only a civil matter","Allowed if anonymous"], correct:1, explanation:"Section 171G IPC makes it an offence to publish false statements about candidates to affect election results." },
      { id:"q7", question:"Accepting money or gifts to vote is?", options:["A personal choice","Legal if undeclared","A bribery offence under Section 171B IPC","Only illegal if above ₹1000"], correct:2, explanation:"Section 171B IPC makes accepting bribery at elections (cash, gifts, liquor) a criminal offence for both giver and receiver." },
      { id:"q8", question:"Voter registration can be done by?", options:["Only offline at ERO office","Only online","Both online (voters.eci.gov.in) and offline","Only through BLO"], correct:2, explanation:"Registration can be done both online at voters.eci.gov.in using Form 6, or offline at the ERO/BLO office." },
    ],
  },
  {
    title: "NRI & Overseas Voting",
    description: "Know your rights as a Non-Resident Indian voter — Form 6A, overseas registration, and postal ballot.",
    category: "nri",
    difficulty: "medium",
    time_limit_seconds: 480,
    passing_score: 70,
    language: "en",
    questions: [
      { id:"q1", question:"Which form must NRI voters fill for registration?", options:["Form 6","Form 6A","Form 7","Form 8"], correct:1, explanation:"NRIs must register using Form 6A on the NVSP portal. Form 6 is for domestic residents only." },
      { id:"q2", question:"What is the primary mode of voting available to NRI voters currently?", options:["Online voting","Postal ballot","In-person at Indian embassy","Proxy voting"], correct:3, explanation:"The Representation of the People (Amendment) Act 2010 introduced proxy voting for NRIs as the primary mechanism." },
      { id:"q3", question:"NRI is defined under which act for voting purposes?", options:["Foreign Exchange Management Act","Representation of the People Act, Section 20A","Citizenship Act","Passport Entry into India Act"], correct:1, explanation:"Section 20A of the RP Act 1951 (added in 2010) defines an NRI voter and their eligibility criteria." },
      { id:"q4", question:"An NRI voter must be ordinarily resident in India for?", options:["No requirement","At least 6 months","At least 1 year","At birth only"], correct:0, explanation:"There is no minimum residency requirement in India for NRI voters. They only need to be listed in the Indian passport as a citizen." },
      { id:"q5", question:"Postal ballot for NRIs was introduced under which amendment?", options:["2010 Amendment","2013 Amendment","2017 Amendment","2019 Amendment"], correct:0, explanation:"The Representation of the People (Amendment) Act 2010 enabled NRI voting rights in Indian elections." },
      { id:"q6", question:"NRI voters must vote in which constituency?", options:["Any constituency in their home state","The constituency where their passport address is registered","Any metropolitan constituency","New Delhi constituency"], correct:1, explanation:"NRI voters can only vote in the constituency where their address (as on the Indian passport) is located." },
      { id:"q7", question:"What is the Electronically Transmitted Postal Ballot System (ETPBS)?", options:["Online voting for NRIs","System for sending ballot papers electronically to service voters","EVM system for NRIs","Embassy-based voting terminal"], correct:1, explanation:"ETPBS is for service voters (armed forces, police), not NRIs currently. It electronically transmits ballot papers for physical return." },
      { id:"q8", question:"Can NRI voters cast proxy votes if registered?", options:["Yes, through Form 13F","No, this facility does not exist","Yes, through any family member","Yes, only at Indian consulates"], correct:0, explanation:"NRI voters can appoint a proxy using Form 13F to cast their vote on their behalf in the constituency." },
    ],
  },
  {
    title: "Women & Elections",
    description: "Explore the role of women in Indian democracy — reservations, landmark elections, and ECI initiatives.",
    category: "civic",
    difficulty: "medium",
    time_limit_seconds: 480,
    passing_score: 70,
    language: "en",
    questions: [
      { id:"q1", question:"What percentage of seats are reserved for women in Panchayati Raj institutions?", options:["25%","33%","40%","50%"], correct:1, explanation:"The 73rd and 74th Constitutional Amendments (1992) mandate at least 33% reservation for women in Panchayati Raj bodies; many states have raised this to 50%." },
      { id:"q2", question:"India's first woman President was?", options:["Indira Gandhi","Pratibha Patil","Sushma Swaraj","Sarojini Naidu"], correct:1, explanation:"Pratibha Patil became India's first woman President in 2007, serving until 2012." },
      { id:"q3", question:"The Women's Reservation Bill (Nari Shakti Vandan Adhiniyam) was passed in?", options:["2019","2021","2023","2024"], correct:2, explanation:"The Constitution (106th Amendment) Act, 2023 reserved 33% of Lok Sabha and State Assembly seats for women, to take effect after delimitation." },
      { id:"q4", question:"India's first woman Chief Minister was?", options:["Indira Gandhi","Sucheta Kriplani","Nandini Satpathy","Sheila Dikshit"], correct:1, explanation:"Sucheta Kriplani became the first woman Chief Minister in India, heading the Uttar Pradesh government from 1963–1967." },
      { id:"q5", question:"SAKSHAM initiative by ECI is related to?", options:["Senior citizen voters","PwD voters","NRI voters","Women voters"], correct:1, explanation:"SAKSHAM is ECI's initiative to make polling stations accessible and friendly for Persons with Disabilities (PwD)." },
      { id:"q6", question:"Under what initiative does ECI set up Pink Polling Booths?", options:["She Votes India","SVEEP","Mission Shakti","Voters' Awareness Campaign"], correct:1, explanation:"Pink Polling Booths (managed entirely by women staff) are set up under ECI's SVEEP (Systematic Voters' Education and Electoral Participation) programme." },
      { id:"q7", question:"What is the percentage of women voter turnout in 2019 Lok Sabha elections approximately?", options:["58%","63%","67%","72%"], correct:2, explanation:"Women voter turnout in the 2019 Lok Sabha elections was approximately 67.2%, almost equal to men's turnout for the first time." },
      { id:"q8", question:"India's first woman Speaker of Lok Sabha was?", options:["Meira Kumar","Sumitra Mahajan","Shivraj Patil","None yet"], correct:0, explanation:"Meira Kumar was India's first woman Speaker of the Lok Sabha, serving from 2009 to 2014 during the 15th Lok Sabha." },
    ],
  },
  {
    title: "Model Code of Conduct",
    description: "Master the rules of the Model Code of Conduct — what's allowed, what's prohibited, and how it's enforced.",
    category: "voting",
    difficulty: "hard",
    time_limit_seconds: 540,
    passing_score: 60,
    language: "en",
    questions: [
      { id:"q1", question:"The Model Code of Conduct derives its authority from?", options:["Constitution of India","RP Act 1951","ECI's plenary powers under Article 324","Prevention of Corruption Act"], correct:2, explanation:"The MCC is not a statutory document — it draws authority from ECI's plenary powers under Article 324 of the Constitution." },
      { id:"q2", question:"MCC comes into force from?", options:["Date of polling","Date of announcement of election schedule","Date of result declaration","Filing of nominations"], correct:1, explanation:"The MCC comes into force immediately on the date the ECI announces the election schedule, triggering restrictions." },
      { id:"q3", question:"Which of these is NOT prohibited under MCC for the party in power?", options:["Using government vehicles for campaigning","Making new policy announcements","Inaugurating new projects","Attending official state functions"], correct:3, explanation:"Attending official state functions is permitted. The MCC prohibits using government machinery/funds for partisan campaigning." },
      { id:"q4", question:"What is the cVIGIL app used for?", options:["Voter registration","Reporting MCC violations with geotagged evidence","Checking your polling booth","Finding candidates' assets"], correct:1, explanation:"cVIGIL lets citizens report MCC violations by uploading geotagged photos/videos. Flying Squads must respond within 100 minutes." },
      { id:"q5", question:"Paid news during elections is?", options:["Legal if disclosed","Prohibited — a form of corrupt electoral practice","Allowed under press freedom","Monitored but not banned"], correct:1, explanation:"Paid news — publishing political content as editorial without disclosing it as advertisement — is a corrupt practice under election law." },
      { id:"q6", question:"Exit polls can be published from?", options:["The moment voting closes in last phase","30 minutes after last phase closes","After all phases close and until result day","Never during election period"], correct:0, explanation:"Exit polls can be published only after the conclusion of polling in all phases — immediately when the last vote is cast." },
      { id:"q7", question:"Distributing cash or gifts to voters is an offence under?", options:["IPC Section 171B","IPC Section 188","RP Act Section 8","RP Act Section 60"], correct:0, explanation:"Section 171B IPC makes it an offence to give or accept bribes (cash, gifts, liquor) to influence voters." },
      { id:"q8", question:"The 'Star Campaigners' limit for a national party is?", options:["20 per constituency","40 per state","40 for the entire election","No limit"], correct:1, explanation:"A national recognised party can designate up to 40 star campaigners per state; state parties are limited to 20." },
      { id:"q9", question:"Which agency monitors electoral expenditure compliance?", options:["CBI","Income Tax Department with ECI's Expenditure Monitoring Teams","ED","State Police"], correct:1, explanation:"ECI deploys Expenditure Monitoring Teams (including IT officials) to track candidate expenditure and ensure limits are not exceeded." },
      { id:"q10", question:"The Flying Squad responding to cVIGIL complaints must arrive within?", options:["30 minutes","60 minutes","100 minutes","24 hours"], correct:2, explanation:"ECI's standard for cVIGIL-triggered Flying Squad response is 100 minutes from the time of complaint." },
    ],
  },
  {
    title: "RTI & Transparency in Elections",
    description: "Know how the Right to Information Act intersects with elections and electoral accountability.",
    category: "law",
    difficulty: "hard",
    time_limit_seconds: 540,
    passing_score: 60,
    language: "en",
    questions: [
      { id:"q1", question:"The RTI Act was passed in?", options:["2003","2005","2007","2009"], correct:1, explanation:"The Right to Information Act was enacted in 2005, giving citizens the right to request information from public authorities within 30 days." },
      { id:"q2", question:"Political parties are NOT covered under RTI because?", options:["They are exempt by statute","CIC's ruling was overturned by Delhi HC","Supreme Court has explicitly excluded them","RTI Act Section 8 exempts them"], correct:1, explanation:"The CIC in 2013 held political parties to be public authorities, but the Delhi HC stayed this, effectively keeping parties outside mandatory RTI." },
      { id:"q3", question:"Candidates must file their criminal records and assets under?", options:["Form 6","Form 17C","Form 26 (affidavit with nomination)","RTI directly"], correct:2, explanation:"Mandatory affidavits (Form 26) filed with nominations are publicly accessible and contain criminal, financial, and education declarations." },
      { id:"q4", question:"Which Supreme Court case mandated disclosure of candidate criminal records?", options:["Lily Thomas v. Union of India","Union of India v. Association for Democratic Reforms","PUCL v. Union of India","S.N. Balakrishna v. ECI"], correct:1, explanation:"The 2002 SC judgment in Union of India v. Association for Democratic Reforms mandated disclosure of criminal antecedents, assets, and liabilities by candidates." },
      { id:"q5", question:"Electoral Bonds scheme was struck down by SC in which year?", options:["2022","2023","2024","2025"], correct:2, explanation:"The Supreme Court in February 2024 unanimously struck down the Electoral Bonds scheme as unconstitutional, ordering disclosure of all bond data." },
      { id:"q6", question:"Political parties must file income-tax returns under?", options:["Section 13A of Income Tax Act","Section 80GGC of Income Tax Act","Section 139 of Income Tax Act","They are exempt"], correct:0, explanation:"Section 13A of the Income Tax Act 1961 provides conditional tax exemption to political parties who file returns and maintain proper accounts." },
      { id:"q7", question:"NOTA was introduced in India through which SC case?", options:["Indira Gandhi v. Raj Narain","PUCL v. Union of India 2013","ADR v. Union of India 2002","Manohar Lal Sharma v. ECI"], correct:1, explanation:"In PUCL v. Union of India (September 2013), the SC directed ECI to provide a NOTA (None Of The Above) option on EVMs." },
      { id:"q8", question:"ECI maintains candidate affidavits on which portal?", options:["electoralsearch.in","affidavit.eci.gov.in / myneta.info","voters.eci.gov.in","nationalvoterservice.in"], correct:1, explanation:"Candidate affidavits are published on affidavit.eci.gov.in and aggregated by the ADR-linked portal myneta.info for citizen access." },
    ],
  },
];

async function seedQuizzes() {
  console.log("🎯 Seeding quizzes...\n");
  for (const quiz of QUIZZES) {
    const { data: existing } = await supabase
      .from("quizzes")
      .select("id")
      .eq("title", quiz.title)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase.from("quizzes").update(quiz).eq("id", existing.id);
      console.log(error ? `  ❌ Update failed: ${quiz.title}` : `  🔄 Updated: ${quiz.title} (${quiz.questions.length}q)`);
    } else {
      const { error } = await supabase.from("quizzes").insert(quiz);
      console.log(error ? `  ❌ Insert failed: ${quiz.title} — ${error.message}` : `  ✅ Inserted: ${quiz.title} (${quiz.questions.length}q)`);
    }
  }
}

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("  ElectionGuide AI — Quizzes Seed");
  console.log("═══════════════════════════════════════\n");
  await seedQuizzes();
  const total = QUIZZES.reduce((s, q) => s + q.questions.length, 0);
  console.log(`\n✅ Done! ${QUIZZES.length} quizzes · ${total} questions total`);
}

main().catch(console.error);
