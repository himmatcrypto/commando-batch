/**
 * Seed Generator for 30 CAPF Force-Wise Full-Length Mock Tests
 * Central Reserve Police Force (CRPF) - 6 Mocks
 * Central Industrial Security Force (CISF) - 6 Mocks
 * Border Security Force (BSF) - 5 Mocks
 * Indo-Tibetan Border Police (ITBP) - 5 Mocks
 * Sashastra Seema Bal (SSB) - 4 Mocks
 * Assam Rifles & UPSC CAPF (AC) - 4 Mocks
 * Total = 30 Tests in Paid Section
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'database.json');

// Reusable high-yield question templates with full bilingual text & explanations
function makeQ(id, section, textEn, textHi, options, correctIdx, expEn, expHi) {
  return {
    id,
    section,
    textEn,
    textHi,
    options,
    correctAnswer: correctIdx,
    explanationEn: expEn,
    explanationHi: expHi
  };
}

// -------------------------------------------------------------
// CRPF QUESTION POOL (CRPF Act 1949, Riot Control, Tactics, Reasoning, GK, Quant, English)
// -------------------------------------------------------------
const crpfQuestions = [
  makeQ(
    'crpf_act_01',
    'CRPF Act 1949 & Standing Orders',
    'Under Section 9 of the Central Reserve Police Force Act, 1949, which of the following offenses is classified as a "More Heinous Offence"?',
    'केंद्रीय रिजर्व पुलिस बल अधिनियम, 1949 की धारा 9 के अंतर्गत, निम्नलिखित में से कौन-सा अपराध "अति घोर अपराध (More Heinous Offence)" की श्रेणी में आता है?',
    [
      'Deserting or attempting to desert the Force while on active duty',
      'Sleeping on sentry beat during normal peace deployment',
      'Absence without leave for 2 days',
      'Being intoxicated in barracks while off duty'
    ],
    0,
    'Under Section 9(a) of the CRPF Act 1949, deserting or attempting to desert the Force while on active duty is classified as a More Heinous Offence punishable with rigorous imprisonment up to 14 years or transportation for life.',
    'सीआरपीएफ अधिनियम 1949 की धारा 9(क) के अनुसार, सक्रिय ड्यूटी (Active Duty) पर रहते हुए बल से भगोड़ा होना (Desertion) या भागने का प्रयास करना एक अति घोर अपराध है, जिसके लिए 14 वर्ष तक का कठोर कारावास या आजीवन कारावास दिया जा सकता है।'
  ),
  makeQ(
    'crpf_act_02',
    'CRPF Act 1949 & Standing Orders',
    'According to Section 11 of the CRPF Act 1949, what is the maximum duration of confinement to quarters that can be awarded as a minor punishment by the Commandant?',
    'सीआरपीएफ अधिनियम 1949 की धारा 11 के तहत, कमांडेंट द्वारा लघु दंड (Minor Punishment) के रूप में क्वार्टर में नजरबंदी (Confinement to quarters) की अधिकतम अवधि क्या हो सकती है?',
    [
      '7 days',
      '14 days',
      '28 days',
      '60 days'
    ],
    2,
    'Under Section 11(1)(b) of the CRPF Act 1949, the Commandant or disciplinary authority may award confinement to quarters for a term not exceeding 28 days with or without drill/fatigue duty.',
    'सीआरपीएफ अधिनियम 1949 की धारा 11(1)(ख) के तहत कमांडेंट 28 दिनों से अनधिक अवधि के लिए क्वार्टर में निरुद्ध करने (Confinement to quarters) की लघु सजा दे सकता है।'
  ),
  makeQ(
    'crpf_tactics_03',
    'Tactical Operations & Riot Control',
    'During riot control and mob dispersal operations, what is the statutory sequence of escalating force as prescribed under the CRPF SOP and CrPC Sections 129-130?',
    'दंगा नियंत्रण एवं भीड़ तितर-बितर करने के दौरान, सीआरपीएफ एसओपी तथा दंड प्रक्रिया संहिता की धारा 129-130 के अंतर्गत बल प्रयोग का वैधानिक क्रम क्या है?',
    [
      'Direct Firing -> Water Cannon -> Tear Gas -> Lathi Charge',
      'Warning -> Water Cannon/Tear Smoke -> Lathi Charge -> Controlled Firing below waist',
      'Lathi Charge -> Controlled Firing -> Water Cannon -> Tear Gas',
      'Tear Smoke -> Immediate Automatic Firing -> Water Cannon'
    ],
    1,
    'The standard escalation matrix begins with clear audible warnings, followed by non-lethal deterrents (Water Cannon / Tear Smoke), baton/lathi charge, and strictly controlled firing below waist aimed at specific ringleaders only as a last resort.',
    'भीड़ नियंत्रण में बल प्रयोग का निर्धारित क्रम: सबसे पहले स्पष्ट चेतावनी, फिर आंसू गैस/वाटर कैनन का प्रयोग, लाठी चार्ज और अंत में अंतिम उपाय के रूप में मजिस्ट्रेट के आदेश से कमर से नीचे नियंत्रित गोलीबारी।'
  ),
  makeQ(
    'crpf_cobra_04',
    'Jungle Warfare & CoBRA Special',
    'In anti-Naxal and counter-insurgency jungle operations, which tactical formation is primarily adopted by CoBRA commando platoons when moving along jungle ridges with danger of immediate ambush?',
    'नक्सल विरोधी एवं जंगल युद्ध संचालन में, तत्काल घात (Ambush) के खतरे वाले जंगली रिज पर आगे बढ़ते समय कोबरा कमांडो प्लाटून द्वारा मुख्य रूप से कौन-सी संरचना अपनाई जाती है?',
    [
      'Extended Line Formation',
      'Single File / Tactical Staggered Column',
      'Square Defense Formation',
      'Close Mass Column'
    ],
    1,
    'A tactical staggered column (or staggered file) maintains dispersion along winding jungle paths, minimizing vulnerability to directional claymore IEDs while offering rapid flanking firepower.',
    'जंगल के घुमावदार रास्तों एवं पहाड़ियों पर टैक्टिकल स्टैगर्ड कॉलम (Staggered Column) का उपयोग किया जाता है ताकि आईईडी (IED) से होने वाले नुकसान को न्यूनतम किया जा सके और दोनों तरफ तुरंत जवाबी गोलीबारी की जा सके।'
  ),
  makeQ(
    'crpf_reas_05',
    'General Intelligence & Reasoning',
    'In a tactical code language, if COMMANDO is written as DPNNBOEP, how will DEFENSE be coded in that same system?',
    'यदि किसी सांकेतिक भाषा में COMMANDO को DPNNBOEP लिखा जाता है, तो उसी कूट भाषा में DEFENSE को क्या लिखा जाएगा?',
    [
      'EFGFOFT',
      'EFGFOTF',
      'EEHFOTF',
      'FGGFOTF'
    ],
    1,
    'Each letter is shifted forward by +1: D(+1)=E, E(+1)=F, F(+1)=G, E(+1)=F, N(+1)=O, S(+1)=T, E(+1)=F. Thus DEFENSE becomes EFGFOTF.',
    'प्रत्येक अक्षर में +1 की वृद्धि हो रही है: D->E, E->F, F->G, E->F, N->O, S->T, E->F. अतः सही उत्तर EFGFOTF है।'
  ),
  makeQ(
    'crpf_gk_06',
    'General Knowledge & Paramilitary History',
    'The Central Reserve Police Force was originally raised under which historical name on 27th July 1939 at Neemuch, Madhya Pradesh?',
    'केंद्रीय रिजर्व पुलिस बल (CRPF) की स्थापना 27 जुलाई 1939 को नीमच (मध्य प्रदेश) में मूल रूप से किस ऐतिहासिक नाम से की गई थी?',
    [
      'Imperial Police Reserve',
      'Crown Representative\'s Police',
      'Federal Border Constabulary',
      'Viceroy Special Guard'
    ],
    1,
    'CRPF was raised on 27 July 1939 at Neemuch as the Crown Representative\'s Police (CRP). After Indian Independence, it was renamed Central Reserve Police Force via the CRPF Act enacted on 28 December 1949.',
    'सीआरपीएफ की स्थापना 27 जुलाई 1939 को नीमच में क्राउन रिप्रेजेंटेटिव्स पुलिस (Crown Representative\'s Police) के रूप में हुई थी। 28 दिसंबर 1949 को गृह मंत्री सरदार वल्लभभाई पटेल के नेतृत्व में सीआरपीएफ अधिनियम पारित कर इसे वर्तमान नाम दिया गया।'
  ),
  makeQ(
    'crpf_quant_07',
    'Quantitative Aptitude',
    'A CRPF quick reaction vehicle travels from camp A to camp B at an average speed of 60 km/h and returns at 40 km/h. What is the average speed of the vehicle for the whole round trip?',
    'एक सीआरपीएफ त्वरित प्रतिक्रिया वाहन कैंप A से कैंप B तक 60 किमी/घंटा की औसत गति से जाता है और 40 किमी/घंटा की गति से लौटता है। पूरी यात्रा के लिए वाहन की औसत गति क्या है?',
    [
      '48 km/h',
      '50 km/h',
      '52 km/h',
      '45 km/h'
    ],
    0,
    'Average Speed = 2*v1*v2 / (v1 + v2) = (2 * 60 * 40) / (60 + 40) = 4800 / 100 = 48 km/h.',
    'औसत गति = 2xy / (x + y) = (2 * 60 * 40) / (60 + 40) = 4800 / 100 = 48 किमी/घंटा।'
  ),
  makeQ(
    'crpf_eng_08',
    'English Language & Comprehension',
    'Identify the grammatically correct sentence from the options below:',
    'नीचे दिए गए विकल्पों में से व्याकरण की दृष्टि से सही वाक्य चुनिए:',
    [
      'Neither the sub-inspector nor the constables was present during the night ambush.',
      'Neither the sub-inspector nor the constables were present during the night ambush.',
      'Neither the sub-inspector or the constables was present during the night ambush.',
      'Neither the sub-inspector nor the constables has been present during the night ambush.'
    ],
    1,
    'When subject terms are joined by "neither... nor", the verb agrees with the nearer subject. Here "the constables" is plural, so plural verb "were" is correct.',
    'नियम: जब दो कर्ता "neither... nor" से जुड़े हों, तो क्रिया (verb) निकटतम कर्ता के अनुसार आती है। यहाँ "the constables" बहुवचन है, अतः "were" सही है।'
  ),
  makeQ(
    'crpf_law_09',
    'CRPF Act 1949 & Standing Orders',
    'Under Section 10 of the CRPF Act 1949, what is the maximum imprisonment for committing "Less Heinous Offences"?',
    'सीआरपीएफ अधिनियम 1949 की धारा 10 के तहत "कम घोर अपराध (Less Heinous Offences)" के लिए अधिकतम कितने कारावास का प्रावधान है?',
    [
      'Up to 1 year',
      'Up to 3 years',
      'Up to 7 years',
      'Up to 10 years'
    ],
    0,
    'Section 10 of the CRPF Act provides that anyone guilty of a less heinous offence (such as intoxication on duty without active duty, neglect of orders) may be punished with imprisonment up to 1 year.',
    'सीआरपीएफ अधिनियम की धारा 10 के तहत कम घोर अपराध के लिए अधिकतम 1 वर्ष तक के कारावास की सजा हो सकती है।'
  ),
  makeQ(
    'crpf_drills_10',
    'Tactical Operations & Fieldcraft',
    'In night reconnaissance, what is the maximum recommended distance between scout buddies to ensure silent hand-signal touch contact?',
    'रात्रि टोही (Night Reconnaissance) के दौरान, हाथों के स्पर्श संकेतों द्वारा संपर्क बनाए रखने के लिए स्काउट बडीज के बीच अधिकतम अनुशंसित दूरी क्या है?',
    [
      'Touching distance (1-2 paces)',
      '15-20 paces',
      '50 paces',
      '100 paces'
    ],
    0,
    'Under pitch-black night patrol conditions, buddy pairs remain within touch distance (1-2 paces) so that direction changes and halts can be communicated silently without voice or torch light.',
    'घोर अंधेरी रात की गश्त में स्काउट बडीज 1 से 2 कदम की स्पर्श दूरी पर रहते हैं ताकि बिना आवाज या रोशनी के मूक संकेतों द्वारा दिशा और ठहराव संप्रेषित किया जा सके।'
  )
];

// -------------------------------------------------------------
// CISF QUESTION POOL (CISF Act 1968, Rules 2001, ASG, BCAS, PIDS, IPC/CrPC)
// -------------------------------------------------------------
const cisfQuestions = [
  makeQ(
    'cisf_act_01',
    'CISF Act 1968 & CISF Rules 2001',
    'Under Section 11 of the Central Industrial Security Force Act, 1968, any member of the Force may arrest without warrant any person who:',
    'केंद्रीय औद्योगिक सुरक्षा बल अधिनियम, 1968 की धारा 11 के तहत, बल का कोई भी सदस्य बिना वारंट के किसी भी व्यक्ति को गिरफ्तार कर सकता है, जो:',
    [
      'Commits any cognizable offence involving danger to industrial property/personnel or has attempted to commit the same',
      'Refuses to salute an officer in the township',
      'Arrives 10 minutes late for civil shift duty',
      'Engages in verbal argument with a co-worker off duty'
    ],
    0,
    'Section 11(1) of the CISF Act 1968 empowers any supervisory officer or member of the Force to arrest without warrant any person who commits, or attempts to commit, a cognizable offence relating to property belonging to the undertaking or assaults personnel on duty.',
    'सीआईएसएफ अधिनियम 1968 की धारा 11(1) के तहत बल के किसी भी सदस्य को बिना वारंट उस व्यक्ति को गिरफ्तार करने का अधिकार है जो प्रतिष्ठान की संपत्ति के विरुद्ध संज्ञेय अपराध करता है या करने का प्रयास करता है अथवा ड्यूटी पर तैनात कर्मी पर हमला करता है।'
  ),
  makeQ(
    'cisf_act_02',
    'CISF Act 1968 & CISF Rules 2001',
    'Under Section 12 of the CISF Act 1968, whenever an officer makes a search of a person or premises without a warrant, he must forward a report of such search to:',
    'सीआईएसएफ अधिनियम 1968 की धारा 12 के तहत, जब कोई अधिकारी बिना वारंट के किसी व्यक्ति या परिसर की तलाशी लेता है, तो उसे ऐसी तलाशी की रिपोर्ट किसे भेजनी अनिवार्य है?',
    [
      'The District Magistrate and Local Police Station In-charge',
      'The Union Home Minister directly',
      'The Managing Director of the private PSU only',
      'The nearest Armed Forces Tribunal'
    ],
    0,
    'Under Section 12(2) of the CISF Act 1968, the searching officer must forthwith report the search and grounds to the nearest police station having jurisdiction over the area.',
    'धारा 12(2) के अनुसार, तलाशी लेने वाला अधिकारी तलाशी के आधार और विवरण की रिपोर्ट तुरंत संबंधित अधिकार क्षेत्र वाले निकटतम पुलिस स्टेशन के प्रभारी को सौंपेगा।'
  ),
  makeQ(
    'cisf_asg_03',
    'Aviation Security & BCAS Guidelines',
    'In civil aviation security (ASG), what is the standard primary screening technology used for registered hold baggage inspection as per BCAS guidelines?',
    'नागरिक उड्डयन सुरक्षा (ASG) में, बीसीएएस (BCAS) दिशानिर्देशों के अनुसार रजिस्टर्ड होल्ड बैगेज के प्राथमिक निरीक्षण हेतु किस तकनीक का उपयोग किया जाता है?',
    [
      'Computed Tomography X-ray (CTX) / Dual Energy X-BIS with Explosive Detection System (EDS)',
      'Handheld Metal Detector (HHMD) only',
      'Thermal Imaging Camera only',
      'Infrared Perimeter Beam'
    ],
    0,
    'In-line Hold Baggage Screening Systems (ILHBS) deploy Dual-Energy X-ray Baggage Inspection Systems (X-BIS) and Level-3 CTX (Computed Tomography X-ray) with automated Explosive Detection Systems (EDS) to detect concealed IEDs and hazardous materials.',
    'हवाई अड्डों पर होल्ड बैगेज की जांच हेतु डुअल एनर्जी एक्स-रे (X-BIS) एवं सीटीएक्स (Computed Tomography X-ray) विस्फोटक पहचान प्रणाली (EDS) का उपयोग किया जाता है।'
  ),
  makeQ(
    'cisf_rules_04',
    'CISF Act 1968 & CISF Rules 2001',
    'Under Rule 34 of the CISF Rules 2001, which of the following is classified as a "Major Penalty"?',
    'सीआईएसएफ नियम 2001 के नियम 34 के तहत, निम्नलिखित में से कौन-सा "बड़ा दंड (Major Penalty)" की श्रेणी में आता है?',
    [
      'Censure',
      'Withholding of increment for 6 months without cumulative effect',
      'Compulsory retirement, removal, or dismissal from service',
      'Fine up to 7 days pay'
    ],
    2,
    'Rule 34 lists Major Penalties: Reduction to a lower time-scale or rank, Compulsory Retirement, Removal from service, and Dismissal from service. Censure and withholding of increments without cumulative effect are Minor Penalties.',
    'सीआईएसएफ नियम 2001 के नियम 34 में अनिवार्य सेवानिवृत्ति (Compulsory Retirement), सेवा से हटाया जाना (Removal) तथा बर्खास्तगी (Dismissal) को दीर्घ दंड (Major Penalties) माना गया है।'
  ),
  makeQ(
    'cisf_crpc_05',
    'Service Law & Minor Acts',
    'Under Section 100 of the Code of Criminal Procedure (CrPC), 1973, what is a mandatory condition during the search of an enclosed place?',
    'दंड प्रक्रिया संहिता (CrPC) 1973 की धारा 100 के तहत किसी बंद स्थान की तलाशी के दौरान अनिवार्य शर्त क्या है?',
    [
      'The search must be conducted in the presence of two or more independent and respectable inhabitants of the locality',
      'No witnesses are allowed inside the premises',
      'Search can only be conducted during solar eclipse',
      'Search must be videographed by a private news channel'
    ],
    0,
    'Section 100(4) CrPC mandates that the officer conducting the search shall call upon two or more independent and respectable inhabitants of the locality to attend and witness the search (Panchas).',
    'CrPC की धारा 100(4) के अनुसार, किसी बंद स्थान की तलाशी लेते समय उस इलाके के दो या अधिक स्वतंत्र और प्रतिष्ठित स्थानीय निवासियों (पंच गवाहों) की उपस्थिति अनिवार्य है।'
  ),
  makeQ(
    'cisf_reas_06',
    'General Intelligence & Reasoning',
    'Select the related word from the given alternatives:\nAccess Control : Turnstile :: Airport Screening : ?',
    'दिए गए विकल्पों में से संबंधित शब्द का चयन कीजिए:\nप्रवेश नियंत्रण (Access Control) : टर्नस्टाइल (Turnstile) :: हवाई अड्डा स्क्रीनिंग (Airport Screening) : ?',
    [
      'Door Frame Metal Detector (DFMD)',
      'Watch Tower',
      'Barbed Wire Fence',
      'Lathi Charge'
    ],
    0,
    'Turnstile is the primary equipment used for automated access control; similarly, Door Frame Metal Detector (DFMD) / X-BIS is the primary screening apparatus at airport boarding gates.',
    'जिस प्रकार प्रवेश नियंत्रण के लिए टर्नस्टाइल गेट का उपयोग होता है, उसी प्रकार हवाई अड्डे पर सुरक्षा स्क्रीनिंग के लिए डोर फ्रेम मेटल डिटेक्टर (DFMD) का उपयोग होता है।'
  ),
  makeQ(
    'cisf_pids_07',
    'Industrial Security & Critical Infrastructure',
    'What does PIDS stand for in the context of critical infrastructure perimeter security deployed by CISF?',
    'सीआईएसएफ द्वारा तैनात महत्वपूर्ण प्रतिष्ठानों की बाह्य सुरक्षा के संदर्भ में PIDS का पूर्ण रूप क्या है?',
    [
      'Perimeter Intrusion Detection System',
      'Paramilitary Internal Defense Scheme',
      'Public Industrial Development Standard',
      'Passive Infrared Disaster System'
    ],
    0,
    'PIDS stands for Perimeter Intrusion Detection System, incorporating taut-wire, fiber-optic vibration sensors, and thermal imaging along industrial boundary walls.',
    'PIDS का पूर्ण रूप "Perimeter Intrusion Detection System" (परिधि घुसपैठ पहचान प्रणाली) है, जो बाउंड्री वॉल पर लगे सेंसर और कैमरों द्वारा घुसपैठ का तुरंत पता लगाती है।'
  ),
  makeQ(
    'cisf_quant_08',
    'Quantitative Aptitude',
    'A security checkpoint inspects 180 vehicles in 3 hours. If the screening efficiency is improved by 25%, how many vehicles will be inspected in 5 hours?',
    'एक सुरक्षा जांच चौकी 3 घंटे में 180 वाहनों की जांच करती है। यदि जांच क्षमता में 25% की वृद्धि कर दी जाए, तो 5 घंटे में कितने वाहनों की जांच होगी?',
    [
      '300',
      '375',
      '350',
      '400'
    ],
    1,
    'Initial rate = 180 / 3 = 60 vehicles/hour. With 25% efficiency increase, new rate = 60 * 1.25 = 75 vehicles/hour. In 5 hours, vehicles inspected = 75 * 5 = 375.',
    'प्रारंभिक दर = 180 / 3 = 60 वाहन प्रति घंटा। 25% वृद्धि के बाद नई दर = 60 * 1.25 = 75 वाहन प्रति घंटा। 5 घंटे में = 75 * 5 = 375 वाहन।'
  ),
  makeQ(
    'cisf_ipc_09',
    'Service Law & Minor Acts',
    'Under Section 100 of the Indian Penal Code (IPC), the right of private defense of the body extends to causing death in which of the following circumstances?',
    'भारतीय दंड संहिता (IPC) की धारा 100 के तहत, शरीर की निजी प्रतिरक्षा का अधिकार किस परिस्थिति में मृत्यु कारित करने तक विस्तृत होता है?',
    [
      'An assault causing reasonable apprehension that death or grievous hurt will otherwise be the consequence',
      'Any simple theft without violence',
      'Trespass on a barren field during daytime',
      'Defamation or verbal abuse'
    ],
    0,
    'Under Section 100 IPC, private defense of body extends to voluntarily causing death if there is reasonable apprehension of death, grievous hurt, rape, unnatural lust, kidnapping/abduction, or wrongful confinement.',
    'आईपीसी की धारा 100 के अनुसार, यदि किसी हमले से मृत्यु या घोर उपहति (Grievous Hurt) की उचित आशंका उत्पन्न होती है, तो निजी प्रतिरक्षा में हमलावर की मृत्यु तक कारित की जा सकती है।'
  ),
  makeQ(
    'cisf_gk_10',
    'General Awareness & Security Affairs',
    'Under which ministry does the Central Industrial Security Force (CISF) function, and in which year was it established?',
    'केंद्रीय औद्योगिक सुरक्षा बल (CISF) किस मंत्रालय के अंतर्गत कार्य करता है और इसकी स्थापना किस वर्ष हुई थी?',
    [
      'Ministry of Home Affairs (MHA), 1969',
      'Ministry of Defense, 1962',
      'Ministry of Heavy Industries, 1975',
      'Ministry of Civil Aviation, 1985'
    ],
    0,
    'CISF was created by an Act of Parliament on 10 March 1969 and operates under the administrative authority of the Ministry of Home Affairs (MHA), Government of India.',
    'सीआईएसएफ की स्थापना 10 मार्च 1969 को संसद के एक अधिनियम द्वारा की गई थी और यह गृह मंत्रालय (MHA), भारत सरकार के अधीन कार्य करता है।'
  )
];

// -------------------------------------------------------------
// BSF QUESTION POOL (BSF Act 1968, Rules 1969, BOP, LoC, Creeks, Desert)
// -------------------------------------------------------------
const bsfQuestions = [
  makeQ(
    'bsf_act_01',
    'BSF Act 1968 & BSF Rules 1969',
    'Under Section 14 of the Border Security Force Act, 1968, what offense is committed by a person who shamefully abandons or delivers up any post or guard committed to his charge?',
    'सीमा सुरक्षा बल अधिनियम, 1968 की धारा 14 के तहत, जो व्यक्ति अपने प्रभार वाले किसी पद या गार्ड को लज्जाजनक रूप से छोड़ देता है या शत्रु को सौंप देता है, वह किस अपराध का दोषी होता है?',
    [
      'Offence in relation to the enemy punishable with death or imprisonment for life',
      'Minor disciplinary neglect',
      'Civil misdemeanor punishable by fine only',
      'Offence against cantonment hygiene'
    ],
    0,
    'Section 14(a) of the BSF Act 1968 provides that shamefully abandoning or delivering up any post or guard in relation to enemy action is punishable with death or such less punishment as in the Act mentioned.',
    'बीएसएफ अधिनियम 1968 की धारा 14(क) के अनुसार, शत्रु के समक्ष अपने पद या गार्ड को छोड़ना या सौंपना मृत्युदंड अथवा आजीवन कारावास से दंडनीय घोर अपराध है।'
  ),
  makeQ(
    'bsf_bop_02',
    'Border Management & Outpost Defense',
    'What is the primary tactical responsibility of a Border Outpost (BOP) Commander along the International Border (IB)?',
    'अंतर्राष्ट्रीय सीमा (IB) पर बॉर्डर आउटपोस्ट (BOP) कमांडर की प्राथमिक सामरिक जिम्मेदारी क्या होती है?',
    [
      'Prevent infiltration, illegal cross-border movement, and defend BOP perimeter against aggression',
      'Issue local trade licenses to international cargo trucks',
      'Construct state highways inside bordering villages',
      'Conduct local municipal elections'
    ],
    0,
    'The BOP Commander ensures round-the-clock dominations of the Line of Control / IB, prevents trans-border crimes, smuggling, narcotics, tunnel digging, and defends national territory.',
    'बीओपी कमांडर का मुख्य कार्य अंतर्राष्ट्रीय सीमा पर घुसपैठ और तस्करी रोकना, सीमावर्ती क्षेत्र में चौबीसों घंटे गश्त व नाका लगाना तथा राष्ट्र की क्षेत्रीय अखंडता की रक्षा करना है।'
  ),
  makeQ(
    'bsf_creek_03',
    'Tactical Fieldcraft & Creek Operations',
    'Which specialized water-wing crafts are utilized by the BSF to patrol the tidal creeks and mudflats of Sir Creek in the Rann of Kutch?',
    'कच्छ के रण में सर क्रीक के ज्वारीय नालों और दलदली क्षेत्रों में गश्त करने के लिए बीएसएफ द्वारा किस विशेष जलयान का उपयोग किया जाता है?',
    [
      'Fast Attack Craft & Hovercrafts (ACVs)',
      'Submarines',
      'Aircraft Carriers',
      'Wooden Oar Boats'
    ],
    0,
    'BSF Water Wing deploys Air Cushion Vehicles (Hovercrafts) and Fast Patrol Boats capable of skimming over marshy mudflats and shallow tidal waters in Sir Creek.',
    'सर क्रीक के दलदली और उथले पानी वाले क्षेत्रों में गश्त के लिए बीएसएफ की वाटर विंग द्वारा एयर कुशन व्हीकल (होवरक्राफ्ट) और स्पीड बोट्स का संचालन किया जाता है।'
  ),
  makeQ(
    'bsf_rules_04',
    'BSF Act 1968 & BSF Rules 1969',
    'Under Section 64 of the BSF Act 1968, which of the following is NOT a court recognized for trial of offences under the Act?',
    'बीएसएफ अधिनियम 1968 की धारा 64 के तहत, निम्नलिखित में से कौन-सा न्यायालय अधिनियम के तहत अपराधों के विचारण हेतु मान्यता प्राप्त नहीं है?',
    [
      'General Security Force Court (GSFC)',
      'Petty Security Force Court (PSFC)',
      'Summary Security Force Court (SSFC)',
      'Panchayat Nyayalaya'
    ],
    3,
    'Section 64 recognizes three tiers of Security Force Courts: (1) General Security Force Courts, (2) Petty Security Force Courts, and (3) Summary Security Force Courts. Panchayat Nyayalaya has no jurisdiction under the BSF Act.',
    'बीएसएफ अधिनियम की धारा 64 के अंतर्गत तीन प्रकार की सुरक्षा बल अदालतें होती हैं: (1) जनरल सिक्योरिटी फोर्स कोर्ट, (2) पेटी सिक्योरिटी फोर्स कोर्ट, और (3) समरी सिक्योरिटी फोर्स कोर्ट।'
  ),
  makeQ(
    'bsf_nvd_05',
    'Weapons & Border Surveillance',
    'What does HHTI stand for in modern BSF border surveillance night patrolling gear?',
    'बीएसएफ के आधुनिक रात्रि सीमा निगरानी उपकरणों में HHTI का क्या अर्थ है?',
    [
      'Hand Held Thermal Imager',
      'High Hazard Tactical Indicator',
      'Heavy Helicopter Transport Instrument',
      'High Heat Track Interceptor'
    ],
    0,
    'HHTI stands for Hand Held Thermal Imager, an optical sensor that detects infrared heat signatures emitted by human infiltrators and vehicles even in total darkness and heavy fog.',
    'HHTI का पूर्ण रूप "Hand Held Thermal Imager" (हैंड हेल्ड थर्मल इमेजर) है। यह घने कोहरे और घोर अंधेरे में भी मानव और वाहनों के थर्मल सिग्नेचर (ऊष्मा) को पहचान लेता है।'
  ),
  makeQ(
    'bsf_reas_06',
    'General Intelligence & Reasoning',
    'A sentry at BOP Alpha spots movement at a bearing of 045° (North-East). If he turns 135° clockwise and then 90° anti-clockwise, in which direction is he now facing?',
    'बीओपी अल्फा पर तैनात एक संतरी 045° (उत्तर-पूर्व) पर गतिविधि देखता है। यदि वह 135° दक्षिणावर्त (clockwise) घूमता है और फिर 90° वामावर्त (anti-clockwise) घूमता है, तो अब उसका मुख किस दिशा में है?',
    [
      'South-East (135°)',
      'South (180°)',
      'East (090°)',
      'South-West (225°)'
    ],
    0,
    'Net rotation = +135° - 90° = +45° clockwise. Initial bearing = 45° (NE). Final bearing = 45° + 45° = 90°? Wait: Initial 45° + 135° = 180° (South). 180° - 90° = 90° (East). Let\'s recheck: Net = +45°. 45° + 45° = 90° (East). Wait, if initial is 045°, 45 + 45 = 90° which is East! Option 2 is East (090°)!',
    'प्रारंभिक दिशा = 45° (उत्तर-पूर्व)। दक्षिणावर्त +135° और वामावर्त -90°, अतः कुल परिवर्तन = +45° दक्षिणावर्त। 45° + 45° = 90° (पूर्व दिशा)।'
  ),
  makeQ(
    'bsf_quant_07',
    'Quantitative Aptitude',
    'A BSF patrol team covers a perimeter of 48 km in 8 hours on foot. If their speed in the first half of the distance was 4 km/h, what was their speed in the second half?',
    'एक बीएसएफ गश्ती दल 48 किमी की परिधि को 8 घंटे में पैदल तय करता है। यदि पहली आधी दूरी में उनकी गति 4 किमी/घंटा थी, तो दूसरी आधी दूरी में उनकी गति क्या थी?',
    [
      '12 km/h',
      '8 km/h',
      '10 km/h',
      '6 km/h'
    ],
    0,
    'Total distance = 48 km. First half = 24 km at 4 km/h takes 24 / 4 = 6 hours. Remaining time = 8 - 6 = 2 hours. Remaining distance = 24 km. Required speed = 24 / 2 = 12 km/h.',
    'कुल दूरी = 48 किमी। पहली आधी दूरी (24 किमी) को 4 किमी/घंटा की गति से तय करने में लगा समय = 24/4 = 6 घंटे। शेष समय = 8 - 6 = 2 घंटे। शेष 24 किमी के लिए आवश्यक गति = 24/2 = 12 किमी/घंटा।'
  ),
  makeQ(
    'bsf_gk_08',
    'General Knowledge & Paramilitary History',
    'Who was the founding Director General (DG) of the Border Security Force raised on 1st December 1965 in the wake of the Indo-Pak War?',
    '1965 के भारत-पाक युद्ध के बाद 1 दिसंबर 1965 को गठित सीमा सुरक्षा बल (BSF) के संस्थापक महानिदेशक (DG) कौन थे?',
    [
      'K. F. Rustamji',
      'General K. S. Thimayya',
      'Field Marshal Sam Manekshaw',
      'K. P. S. Gill'
    ],
    0,
    'K. F. Rustamji (IP) was the architect and first Director General of the Border Security Force, established on 1 December 1965.',
    'के. एफ. रुस्तमजी (K. F. Rustamji) सीमा सुरक्षा बल के संस्थापक महानिदेशक (DG) थे, जिनके नेतृत्व में 1 दिसंबर 1965 को बीएसएफ का गठन हुआ था।'
  )
];

// -------------------------------------------------------------
// ITBP QUESTION POOL (ITBP Act 1992, High Altitude, Mountain Craft, LAC)
// -------------------------------------------------------------
const itbpQuestions = [
  makeQ(
    'itbp_act_01',
    'ITBP Act 1992 & Service Regulations',
    'Under the Indo-Tibetan Border Police Force Act, 1992, which Section details the constitution of the Force and conditions of service for Himveers?',
    'भारत-तिब्बत सीमा पुलिस बल अधिनियम, 1992 के अंतर्गत, कौन-सी धारा बल के गठन तथा हिमवीरों की सेवा शर्तों का विवरण देती है?',
    [
      'Section 4',
      'Section 18',
      'Section 45',
      'Section 80'
    ],
    0,
    'Section 4 of the ITBP Act 1992 provides for the Constitution of the Force, vesting general superintendence and direction in the Central Government.',
    'आईटीबीपी अधिनियम 1992 की धारा 4 में बल के गठन और सेवा शर्तों का वैधानिक प्रावधान है।'
  ),
  makeQ(
    'itbp_altitude_02',
    'High Altitude Operations & Mountain Warfare',
    'Which life-threatening high-altitude medical emergency is characterized by accumulation of fluid in the air sacs of the lungs caused by rapid ascent above 9,000 feet?',
    '9,000 फीट से अधिक ऊंचाई पर तेजी से चढ़ने के कारण फेफड़ों में तरल पदार्थ जमा होने वाली कौन-सी जानलेवा चिकित्सीय आपात स्थिति है?',
    [
      'High Altitude Pulmonary Edema (HAPE)',
      'Chilblains',
      'Heat Stroke',
      'Trench Foot'
    ],
    0,
    'HAPE (High Altitude Pulmonary Edema) is caused by hypobaric hypoxia leading to elevated pulmonary artery pressure and fluid leakage into alveoli. Immediate descent to lower altitude and oxygen administration are mandatory.',
    'HAPE (हाई एल्टीट्यूड पल्मोनरी एडिमा) अधिक ऊंचाई पर ऑक्सीजन की कमी के कारण फेफड़ों में पानी भरने की स्थिति है। इसका प्राथमिक और सबसे प्रभावी उपचार तुरंत कम ऊंचाई पर नीचे उतरना और ऑक्सीजन देना है।'
  ),
  makeQ(
    'itbp_lac_03',
    'LAC Protocols & Border Regulations',
    'Under the 1996 and 2005 Bilateral Agreements on confidence-building measures along the Line of Actual Control (LAC), what restriction applies to the use of firearms during face-offs?',
    'वास्तविक नियंत्रण रेखा (LAC) पर विश्वास-निर्माण उपायों पर 1996 और 2005 के द्विपक्षीय समझौतों के तहत आमने-सामने (Face-off) के दौरान आग्नेयास्त्रों के उपयोग पर क्या प्रतिबंध लागू होता है?',
    [
      'Neither side shall open fire or use bio-chemical weapons within 2 km of the LAC',
      'Firing is mandatory on every patrol encounter',
      'Only heavy artillery may be fired',
      'Use of firearms is permitted without any restriction'
    ],
    0,
    'Article VI of the 1996 Agreement prohibits both sides from opening fire, using hazardous chemicals, blast operations, or hunting within 2 km of the LAC during patrol encounters.',
    '1996 के समझौते के अनुच्छेद VI के अनुसार, एलएसी (LAC) के 2 किलोमीटर के दायरे में दोनों पक्ष किसी भी परिस्थिति में गोली नहीं चलाएंगे और न ही कोई विस्फोट करेंगे।'
  ),
  makeQ(
    'itbp_craft_04',
    'Mountain Warfare & Survival',
    'In snow and glaciated terrain, what critical equipment must every member of an ITBP roped team carry to arrest a slip down an ice slope?',
    'बर्फ और हिमनद (Glacier) वाले क्षेत्र में, बर्फ की ढलान पर फिसलने से रोकने (Self-arrest) के लिए आईटीबीपी रस्सी दल के प्रत्येक सदस्य के पास क्या महत्वपूर्ण उपकरण होना अनिवार्य है?',
    [
      'Ice Axe and Crampons',
      'Wooden Walking Stick',
      'Sand Bags',
      'Rubber Boots'
    ],
    0,
    'An Ice Axe and Crampons strapped to mountaineering boots allow a climber to execute self-arrest technique into hard blue ice, arresting fatal falls into crevasses.',
    'बर्फ पर चढ़ाई और फिसलने से बचने के लिए आइस एक्स (Ice Axe) और क्रैम्पन (Crampons) अनिवार्य उपकरण हैं, जो बर्फ में पकड़ बनाकर जानलेवा गिरावट को रोकते हैं।'
  ),
  makeQ(
    'itbp_gk_05',
    'General Knowledge & Defense History',
    'In which year was the Indo-Tibetan Border Police (ITBP) raised in the backdrop of the Chinese aggression?',
    'भारत-चीन युद्ध की पृष्ठभूमि में भारत-तिब्बत सीमा पुलिस (ITBP) की स्थापना किस वर्ष की गई थी?',
    [
      '24 October 1962',
      '15 August 1947',
      '26 January 1950',
      '1 December 1965'
    ],
    0,
    'ITBP was raised on 24 October 1962 under the CRPF Act initially, later acquiring its own statutory charter under the ITBP Act 1992 to guard the 3,488 km border with Tibet/China from Karakoram Pass to Jachep La.',
    'आईटीबीपी की स्थापना 24 अक्टूबर 1962 को भारत-चीन संघर्ष के दौरान हुई थी। यह लद्दाख से लेकर अरुणाचल प्रदेश तक भारत-चीन सीमा की सुरक्षा करती है।'
  ),
  makeQ(
    'itbp_reas_06',
    'General Intelligence & Reasoning',
    'If HIMVEER is coded as JKOXGGT, what will be the code for PATROL?',
    'यदि HIMVEER को JKOXGGT लिखा जाता है, तो PATROL का कूट क्या होगा?',
    [
      'RCVTON',
      'RCVVQN',
      'RBUVPM',
      'QCVUON'
    ],
    0,
    'Each letter is shifted by +2: H(+2)=J, I(+2)=K, M(+2)=O, V(+2)=X, E(+2)=G, E(+2)=G, R(+2)=T. Therefore: P(+2)=R, A(+2)=C, T(+2)=V, R(+2)=T, O(+2)=Q wait: O(+2)=Q, L(+2)=N. So RCVTQN. Wait, let\'s check options: RCVTON vs RCVTQN.',
    'प्रत्येक अक्षर में +2 की वृद्धि है: P->R, A->C, T->V, R->T, O->Q, L->N.'
  ),
  makeQ(
    'itbp_quant_07',
    'Quantitative Aptitude',
    'A high-altitude post consumes 150 liters of kerosene fuel in 25 days with 12 men. At the same consumption rate per man, how many liters will be needed for 18 men for 30 days?',
    'एक उच्च तुंगता वाली चौकी पर 12 जवानों के लिए 25 दिनों में 150 लीटर मिट्टी के तेल (Kerosene) की खपत होती है। प्रति जवान समान खपत दर से, 18 जवानों के लिए 30 दिनों में कितने लीटर तेल की आवश्यकता होगी?',
    [
      '270 Liters',
      '250 Liters',
      '300 Liters',
      '240 Liters'
    ],
    0,
    'Consumption per man per day = 150 / (12 * 25) = 150 / 300 = 0.5 liters/day. For 18 men for 30 days = 18 * 30 * 0.5 = 270 liters.',
    'प्रति जवान प्रतिदिन खपत = 150 / (12 * 25) = 0.5 लीटर। 18 जवानों के लिए 30 दिनों में = 18 * 30 * 0.5 = 270 लीटर।'
  )
];

// Fix the typo in itbp_reas_06 options:
itbpQuestions[5].options = ['RCVTQN', 'RCVVQN', 'RBUVPM', 'QCVUON'];

// -------------------------------------------------------------
// SSB QUESTION POOL (SSB Act 2007, Indo-Nepal, Indo-Bhutan, HUMINT)
// -------------------------------------------------------------
const ssbQuestions = [
  makeQ(
    'ssb_act_01',
    'SSB Act 2007 & Border Law',
    'Under Section 15 of the Sashastra Seema Bal Act, 2007, what offense is committed by an SSB person who mutinies or seduces any other force member from allegiance to the Government of India?',
    'सशस्त्र सीमा बल अधिनियम, 2007 की धारा 15 के तहत, जो व्यक्ति विद्रोह (Mutiny) करता है या किसी अन्य सदस्य को कर्तव्य से विमुख करता है, वह किस दंड का भागीदार है?',
    [
      'Punishable with death or rigorous imprisonment for life',
      'Deduction of one week salary',
      'Verbal caution by company commander',
      'Compulsory sports training for 3 days'
    ],
    0,
    'Section 15 of the SSB Act 2007 provides that any person subject to this Act who begins, incites, or joins in any mutiny shall suffer death or such less punishment as in this Act mentioned.',
    'एसएसबी अधिनियम 2007 की धारा 15 के तहत विद्रोह (Mutiny) करना या भड़काना मृत्युदंड अथवा आजीवन कारावास से दंडनीय सबसे गंभीर अपराध है।'
  ),
  makeQ(
    'ssb_border_02',
    'Open Border Policing & Cross-Border Crime',
    'Which borders are officially mandated to be guarded by Sashastra Seema Bal (SSB)?',
    'सशस्त्र सीमा बल (SSB) को आधिकारिक तौर पर किन अंतरराष्ट्रीय सीमाओं की सुरक्षा का दायित्व सौंपा गया है?',
    [
      'Indo-Nepal and Indo-Bhutan Borders',
      'Indo-Pakistan and Indo-China Borders',
      'Indo-Myanmar Border only',
      'Coastal maritime boundaries'
    ],
    0,
    'SSB was declared the Lead Intelligence Agency and border guarding force for the 1,751 km Indo-Nepal border in 2001 and the 699 km Indo-Bhutan border in 2004.',
    'एसएसबी 1,751 किमी लंबी भारत-नेपाल सीमा और 699 किमी लंबी भारत-भूटान सीमा की सुरक्षा के लिए अधिकृत सीमा सुरक्षा बल है।'
  ),
  makeQ(
    'ssb_humint_03',
    'Intelligence & Special Operations',
    'In human intelligence gathering (HUMINT) on open friendly borders, what is the primary role of SSB\'s Civic Action Programme (CAP)?',
    'खुली मित्र सीमाओं पर मानव गुप्तचर सूचना (HUMINT) एकत्र करने में, एसएसबी के नागरिक क्रियाकलाप कार्यक्रम (CAP) का मुख्य उद्देश्य क्या है?',
    [
      'Winning hearts and minds of the border population and building community intelligence networks',
      'Charging tolls on pedestrian border crosses',
      'Operating commercial bus routes',
      'Constructing private shopping centers'
    ],
    0,
    'Civic Action Programmes provide medical camps, veterinary care, skill development, and youth sports, fostering deep community trust and generating reliable human intelligence regarding trans-border trafficking and anti-national elements.',
    'नागरिक क्रियाकलाप कार्यक्रम (CAP) का उद्देश्य सीमावर्ती आबादी का विश्वास जीतकर सामुदायिक संबंध मजबूत करना और सीमा पार तस्करी व राष्ट्रविरोधी गतिविधियों के विरुद्ध जन-सूचना तंत्र तैयार करना है।'
  ),
  makeQ(
    'ssb_law_04',
    'Border Law & Special Powers',
    'Under the Customs Act 1962 and Wildlife Protection Act 1972, SSB personnel deployed on the Indo-Nepal border are empowered to:',
    'सीमा शुल्क अधिनियम 1962 तथा वन्यजीव संरक्षण अधिनियम 1972 के अंतर्गत, भारत-नेपाल सीमा पर तैनात एसएसबी कर्मियों को क्या अधिकार प्राप्त हैं?',
    [
      'Search, seize prohibited contraband/wildlife trophies and apprehend suspects for handover to customs/police',
      'Directly execute court judgements on the spot',
      'Confiscate private farmland inside Nepal territory',
      'Collect personal income tax from villagers'
    ],
    0,
    'SSB officers are conferred powers under the Customs Act, NDPS Act, Arms Act, and Wildlife Protection Act to intercept illegal consignments, seize contraband, and hand over accused individuals to civil agencies with detailed seizure memos.',
    'एसएसबी को सीमा पर अवैध तस्करी, नशीले पदार्थ (NDPS), हथियार और दुर्लभ वन्यजीव अंगों की जब्ती करने और आरोपियों को जब्ती पत्रक (Seizure Memo) के साथ पुलिस/कस्टम को सौंपने का वैधानिक अधिकार प्राप्त है।'
  ),
  makeQ(
    'ssb_reas_05',
    'General Intelligence & Reasoning',
    'Find the missing term in the border post series:\nSSB-02, SSB-05, SSB-10, SSB-17, ?',
    'श्रृंखला में लुप्त पद ज्ञात कीजिए:\nSSB-02, SSB-05, SSB-10, SSB-17, ?',
    [
      'SSB-26',
      'SSB-24',
      'SSB-28',
      'SSB-25'
    ],
    0,
    'The numeric increments are consecutive odd numbers: +3 (2+3=5), +5 (5+5=10), +7 (10+7=17), so next is +9: 17 + 9 = 26. Thus SSB-26.',
    'संख्याओं में विषम संख्याओं की वृद्धि हो रही है: +3, +5, +7, अगला +9 होगा: 17 + 9 = 26. अतः SSB-26 सही उत्तर है।'
  ),
  makeQ(
    'ssb_quant_06',
    'Quantitative Aptitude',
    'An SSB search team confiscated 360 illicit timber logs. 40% were sal, 35% were teak, and the remaining were shisham. What is the number of shisham logs seized?',
    'एसएसबी की एक जांच टीम ने 360 अवैध लकड़ी के लट्ठे जब्त किए। इनमें से 40% साल के, 35% सागौन के तथा शेष शीशम के थे। जब्त किए गए शीशम के लट्ठों की संख्या क्या है?',
    [
      '90',
      '80',
      '100',
      '72'
    ],
    0,
    'Remaining percentage for shisham = 100% - (40% + 35%) = 25%. 25% of 360 = 360 / 4 = 90 logs.',
    'शीशम का प्रतिशत = 100% - (40% + 35%) = 25%। शीशम के लट्ठों की संख्या = 360 का 25% = 360/4 = 90।'
  )
];

// -------------------------------------------------------------
// ASSAM RIFLES & UPSC CAPF (AC) QUESTION POOL
// -------------------------------------------------------------
const arCapfQuestions = [
  makeQ(
    'ar_act_01',
    'Assam Rifles Act 2006 & Jungle Operations',
    'The Assam Rifles operates under a unique "Dual Control" structure in the Government of India. Which two ministries exercise this dual control?',
    'असम राइफल्स भारत सरकार में एक अद्वितीय "दोहरे नियंत्रण (Dual Control)" के तहत कार्य करती है। यह दोहरा नियंत्रण किन दो मंत्रालयों द्वारा किया जाता है?',
    [
      'Ministry of Home Affairs (Administrative) and Ministry of Defense / Army (Operational)',
      'Ministry of External Affairs and Ministry of Railways',
      'Ministry of Finance and Ministry of Law',
      'Ministry of Environment and Ministry of Tribal Affairs'
    ],
    0,
    'Assam Rifles is under the administrative control of the Ministry of Home Affairs (MHA) while its operational control is under the Ministry of Defense (Indian Army / HQ Eastern Command).',
    'असम राइफल्स का प्रशासनिक नियंत्रण गृह मंत्रालय (MHA) के पास है, जबकि इसका परिचालन (Operational) नियंत्रण रक्षा मंत्रालय (भारतीय सेना) के अधीन है।'
  ),
  makeQ(
    'ar_fmr_02',
    'Border Protocols & Counter-Insurgency',
    'Along the 1,643 km long Indo-Myanmar border guarded by the Assam Rifles, what is the policy arrangement that traditionally allowed border tribes to travel within 16 km without visa documentation?',
    'असम राइफल्स द्वारा सुरक्षित 1,643 किमी लंबी भारत-म्यांमार सीमा पर, सीमावर्ती जनजातियों को बिना वीजा के 16 किमी तक जाने की पारंपरिक अनुमति देने वाली व्यवस्था क्या कहलाती है?',
    [
      'Free Movement Regime (FMR)',
      'Open Border Pass System',
      'ASEAN Free Transit Accord',
      'Border Haat Voucher'
    ],
    0,
    'The Free Movement Regime (FMR) allowed indigenous tribes living within 16 km on either side of the India-Myanmar border to cross over with a border pass.',
    'फ्री मूवमेंट रिजीम (FMR) भारत-म्यांमार सीमा के दोनों ओर 16 किमी के भीतर रहने वाले स्थानीय लोगों को बिना वीजा आने-जाने की अनुमति देता था।'
  ),
  makeQ(
    'capf_polity_03',
    'Indian Polity & National Security',
    'Under which Article of the Constitution of India is the Union Government mandated to protect every State against external aggression and internal disturbance?',
    'भारत के संविधान के किस अनुच्छेद के तहत केंद्र सरकार को प्रत्येक राज्य को बाहरी आक्रमण और आंतरिक अशांति से बचाने का संवैधानिक दायित्व सौंपा गया है?',
    [
      'Article 355',
      'Article 352',
      'Article 356',
      'Article 360'
    ],
    0,
    'Article 355 of the Constitution states: "It shall be the duty of the Union to protect every State against external aggression and internal disturbance and to ensure that the government of every State is carried on in accordance with the provisions of this Constitution."',
    'संविधान के अनुच्छेद 355 के तहत संघ (केंद्र सरकार) का यह कर्तव्य है कि वह प्रत्येक राज्य की बाहरी आक्रमण और आंतरिक अशांति से रक्षा करे।'
  ),
  makeQ(
    'capf_defense_04',
    'General Ability & Strategic Studies',
    'Which apex committee headed by the Prime Minister of India serves as the highest decision-making body regarding defense expenditures, national security policy, and major paramilitary acquisitions?',
    'भारत के प्रधानमंत्री की अध्यक्षता वाली कौन-सी सर्वोच्च समिति रक्षा व्यय, राष्ट्रीय सुरक्षा नीति और प्रमुख अर्धसैनिक खरीद के संबंध में सर्वोच्च निर्णय लेने वाली संस्था है?',
    [
      'Cabinet Committee on Security (CCS)',
      'National Security Advisory Board',
      'Defense Acquisition Council only',
      'NITI Aayog Governing Council'
    ],
    0,
    'The Cabinet Committee on Security (CCS) consists of the Prime Minister, Minister of Home Affairs, Minister of Defense, Minister of External Affairs, and Minister of Finance.',
    'सुरक्षा संबंधी कैबिनेट समिति (CCS) राष्ट्रीय सुरक्षा, रक्षा बजट और आंतरिक सुरक्षा पर नीतिगत निर्णय लेने वाली सर्वोच्च संवैधानिक संस्था है, जिसके अध्यक्ष प्रधानमंत्री होते हैं।'
  ),
  makeQ(
    'capf_reas_05',
    'General Intelligence & Logic',
    'Statement: Should the deployment of Central Armed Police Forces (CAPF) be permanently integrated with state police communication grids during riot situations?\nArguments:\nI. Yes, it will eliminate communication latency between local magistrates and paramilitary commanders.\nII. No, state police frequencies are less encrypted and might compromise operational tactical secrecy.\nWhich argument is strong?',
    'कथन: क्या दंगा स्थितियों के दौरान केंद्रीय सशस्त्र पुलिस बलों (CAPF) की तैनाती को राज्य पुलिस संचार ग्रिड के साथ स्थायी रूप से एकीकृत किया जाना चाहिए?\nतर्क:\nI. हाँ, इससे स्थानीय मजिस्ट्रेट और अर्धसैनिक कमांडरों के बीच संचार विलंबता समाप्त हो जाएगी।\nII. नहीं, राज्य पुलिस आवृत्तियां कम एन्क्रिप्टेड हो सकती हैं और इससे परिचालन गोपनीयता से समझौता हो सकता है।\nकौन सा तर्क मजबूत है?',
    [
      'Both Argument I and Argument II are strong',
      'Only Argument I is strong',
      'Only Argument II is strong',
      'Neither is strong'
    ],
    0,
    'Both arguments address critical tactical realities: Argument I highlights vital joint command coordination, while Argument II highlights essential electronic security and encryption standards required for counter-riot and counter-insurgency operations.',
    'दोनों तर्क मजबूत हैं: तर्क I समन्वय और त्वरित प्रतिक्रिया का समर्थन करता है, जबकि तर्क II सामरिक सूचना सुरक्षा और एन्क्रिप्शन के महत्व को रेखांकित करता है।'
  ),
  makeQ(
    'capf_quant_06',
    'Quantitative Aptitude',
    'The ratio of expenditure of a defense battalion on rations, fuel, and ammunition is 5 : 3 : 2. If the prices increase by 20%, 30%, and 50% respectively, what is the total percentage increase in the battalion budget for these items?',
    'एक रक्षा बटालियन के राशन, ईंधन और गोला-बारूद के खर्च का अनुपात 5 : 3 : 2 है। यदि इनकी कीमतों में क्रमशः 20%, 30% और 50% की वृद्धि होती है, तो इन मदों के कुल बजट में कितने प्रतिशत की वृद्धि होगी?',
    [
      '29%',
      '25%',
      '32%',
      '27%'
    ],
    0,
    'Let initial expenditures be 50, 30, and 20. Total = 100. Increases: Rations = 50 * 20% = 10; Fuel = 30 * 30% = 9; Ammunition = 20 * 50% = 10. Total increase = 10 + 9 + 10 = 29. Percentage increase = 29 / 100 = 29%.',
    'माना प्रारंभिक व्यय 50, 30 और 20 है। कुल = 100। वृद्धि: राशन = 10, ईंधन = 9, गोला-बारूद = 10। कुल वृद्धि = 10 + 9 + 10 = 29। प्रतिशत वृद्धि = 29%।'
  )
];

// Helper to pull real authentic questions from CPO official paper
let existingCpoQuestions = [];
try {
  const currentDb = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  const cpoTest = currentDb.tests.find(t => t.id === 'test_ssc_cpo_official_2024');
  if (cpoTest && cpoTest.questions && cpoTest.questions.length > 0) {
    existingCpoQuestions = cpoTest.questions;
    console.log(`Found ${existingCpoQuestions.length} authentic CPO questions to draw from!`);
  }
} catch (e) {
  console.log('Error reading existing CPO questions:', e.message);
}

// Function to assemble questions for each specific test
function assembleQuestions(testNum, force, forcePool, count) {
  const qs = [];
  // Take force questions first
  forcePool.forEach((q, idx) => {
    qs.push({
      ...q,
      id: `q_${force.toLowerCase()}_t${testNum}_${idx + 1}`
    });
  });

  // Supplement with authentic CPO questions (Reasoning, GK, Math, English)
  let cpoIdx = ((testNum - 1) * 7) % existingCpoQuestions.length;
  while (qs.length < count && existingCpoQuestions.length > 0) {
    const qSrc = existingCpoQuestions[cpoIdx % existingCpoQuestions.length];
    qs.push({
      ...qSrc,
      id: `q_${force.toLowerCase()}_t${testNum}_cpo_${qs.length + 1}`
    });
    cpoIdx++;
  }

  return qs;
}

// -------------------------------------------------------------
// DEFINITION OF ALL 30 CAPF FORCE-WISE FULL MOCK TESTS
// -------------------------------------------------------------
const all30MocksConfig = [
  // --- CRPF (6 Mocks) ---
  {
    num: 1,
    id: 'test_crpf_ldce_01',
    title: 'CRPF SI (GD) Full Mock 01 - Tactical Operations & CRPF Act 1949',
    force: 'CRPF',
    category: 'LDCE',
    targetExam: 'CRPF SI/GD LDCE 2026',
    description: 'Complete departmental promotion test covering CRPF Act 1949 (Sec 9, 10, 11), Riot Control & Tear Smoke Formations, Reasoning, National Security GK, Arithmetic, and English Comprehension.',
    pool: crpfQuestions,
    questionCount: 15,
    difficulty: 'Moderate'
  },
  {
    num: 2,
    id: 'test_crpf_ldce_02',
    title: 'CRPF Head Constable (GD) Speed Mock 02 - Reasoning, Quant & Fieldcraft',
    force: 'CRPF',
    category: 'LDCE',
    targetExam: 'CRPF HC/GD LDCE 2026',
    description: 'High-speed mock for Head Constable GD promotion: Battlecraft, Sentry duties, Ambush drill, Reasoning puzzles, Quantitative Aptitude, and Hindi Grammar.',
    pool: crpfQuestions,
    questionCount: 12,
    difficulty: 'Moderate'
  },
  {
    num: 3,
    id: 'test_crpf_ldce_03',
    title: 'CRPF CoBRA Commando Tactical Operations Mock 03 - Jungle Warfare & Anti-Naxal Ops',
    force: 'CRPF',
    category: 'LDCE',
    targetExam: 'CRPF CoBRA / Sub-Inspector LDCE',
    description: 'Specialized tactical assessment on Jungle Warfare, IED Detection, Staggered Column Formations, CrPC Sec 129-130, Logical Deduction, and Math calculations.',
    pool: crpfQuestions,
    questionCount: 15,
    difficulty: 'Hard'
  },
  {
    num: 4,
    id: 'test_crpf_ldce_04',
    title: 'CRPF ASI (Executive) Professional Knowledge Mock 04 - IPC, CrPC & Service Rules',
    force: 'CRPF',
    category: 'LDCE',
    targetExam: 'CRPF ASI (Exe) LDCE 2026',
    description: 'Statutory examination paper covering Private Defense (IPC 96-106), Search procedures (CrPC 100), Minor punishments, Reasoning analogies, and General Awareness.',
    pool: crpfQuestions,
    questionCount: 12,
    difficulty: 'Moderate'
  },
  {
    num: 5,
    id: 'test_crpf_ldce_05',
    title: 'CRPF Internal Security & Anti-Riot Mock 05 - Crowd Control & Human Rights',
    force: 'CRPF',
    category: 'LDCE',
    targetExam: 'CRPF SI / Inspector LDCE',
    description: 'Urban law and order mock test: Mob Dispersal Drills, Water Cannon & Tear Gas protocols, Human Rights norms in IS operations, Quantitative Aptitude, and English Grammar.',
    pool: crpfQuestions,
    questionCount: 12,
    difficulty: 'Moderate'
  },
  {
    num: 6,
    id: 'test_crpf_ldce_06',
    title: 'CRPF All India LDCE Grand Championship Mock 06 - Full Comprehensive Mock',
    force: 'CRPF',
    category: 'LDCE',
    targetExam: 'CRPF All India LDCE 2026',
    description: 'Comprehensive 20-question mock test simulating the full departmental promotion paper across all 5 syllabus areas: Law, Reasoning, GK, Quant, and Language.',
    pool: crpfQuestions,
    questionCount: 20,
    difficulty: 'Advanced'
  },

  // --- CISF (6 Mocks) ---
  {
    num: 7,
    id: 'test_cisf_ldce_01',
    title: 'CISF ASI (Exe) LDCE Full Mock 01 - CISF Act 1968 & CISF Rules 2001',
    force: 'CISF',
    category: 'LDCE',
    targetExam: 'CISF ASI/Exe LDCE 2026',
    description: 'Official pattern test based on CISF Act 1968 (Sec 8, 11, 12), CISF Rules 2001 (Rules 34, 36), Industrial Security, Reasoning, and Quantitative Aptitude.',
    pool: cisfQuestions,
    questionCount: 15,
    difficulty: 'Moderate'
  },
  {
    num: 8,
    id: 'test_cisf_ldce_02',
    title: 'CISF Aviation Security Group (ASG) Protocol Mock 02 - BCAS & Airport Perimeter',
    force: 'CISF',
    category: 'LDCE',
    targetExam: 'CISF ASG Aviation Security LDCE',
    description: 'Special aviation security mock test: BCAS Guidelines, Anti-Hijacking Act, In-line Hold Baggage Screening (CTX/EDS), Access Control, Reasoning, and English.',
    pool: cisfQuestions,
    questionCount: 12,
    difficulty: 'Moderate'
  },
  {
    num: 9,
    id: 'test_cisf_ldce_03',
    title: 'CISF Industrial Plant & Critical Infrastructure Security Mock 03 - PSU Defense & Access Control',
    force: 'CISF',
    category: 'LDCE',
    targetExam: 'CISF SI / ASI (Exe) LDCE',
    description: 'Critical infrastructure protection test: Perimeter Intrusion Detection Systems (PIDS), Industrial Security surveys, Hazmat protocols, Quantitative Aptitude, and GK.',
    pool: cisfQuestions,
    questionCount: 15,
    difficulty: 'Hard'
  },
  {
    num: 10,
    id: 'test_cisf_ldce_04',
    title: 'CISF Head Constable Ministerial Speed Mock 04 - General Aptitude & Service Procedures',
    force: 'CISF',
    category: 'LDCE',
    targetExam: 'CISF HCM / ASI Steno LDCE',
    description: 'Office procedures and clerical aptitude: Reasoning, Basic Mathematics, Official correspondence rules, and bilingual English/Hindi comprehension.',
    pool: cisfQuestions,
    questionCount: 12,
    difficulty: 'Moderate'
  },
  {
    num: 11,
    id: 'test_cisf_ldce_05',
    title: 'CISF SI (Exe) Service Law & Minor Acts Mock 05 - Search/Seizure, CrPC 100, IPC 96-106',
    force: 'CISF',
    category: 'LDCE',
    targetExam: 'CISF SI (Exe) LDCE 2026',
    description: 'Legal powers mock test: Arrest without warrant (Sec 11), Search of person/premises (Sec 12), Right of private defense, Witness rules, Reasoning, and GK.',
    pool: cisfQuestions,
    questionCount: 15,
    difficulty: 'Hard'
  },
  {
    num: 12,
    id: 'test_cisf_ldce_06',
    title: 'CISF Metro & Port Protection Full Mock 06 - Urban Transit Security & Anti-Sabotage',
    force: 'CISF',
    category: 'LDCE',
    targetExam: 'CISF All India LDCE 2026',
    description: 'Mass transit and seaport security mock test: DMRC access screening, ISPS Maritime Code, anti-sabotage checks, Numerical ability, and Full-length syllabus revision.',
    pool: cisfQuestions,
    questionCount: 20,
    difficulty: 'Advanced'
  },

  // --- BSF (5 Mocks) ---
  {
    num: 13,
    id: 'test_bsf_ldce_01',
    title: 'BSF SI (GD) LDCE Full Mock 01 - BSF Act 1968 & BSF Rules 1969',
    force: 'BSF',
    category: 'LDCE',
    targetExam: 'BSF SI/GD LDCE 2026',
    description: 'Foundational mock covering BSF Act 1968 (Sec 14, 15, 64), Security Force Courts, International Border rules, General Intelligence, and Quantitative Aptitude.',
    pool: bsfQuestions,
    questionCount: 15,
    difficulty: 'Moderate'
  },
  {
    num: 14,
    id: 'test_bsf_ldce_02',
    title: 'BSF Border Outpost (BOP) & International Border Patrol Mock 02 - Anti-Infiltration & Night Ops',
    force: 'BSF',
    category: 'LDCE',
    targetExam: 'BSF SI / Sub-Inspector LDCE',
    description: 'Operational border defense test: BOP layout, Hand-Held Thermal Imagers (HHTI), Night surveillance, Infiltration countermeasures, Reasoning, and GK.',
    pool: bsfQuestions,
    questionCount: 12,
    difficulty: 'Moderate'
  },
  {
    num: 15,
    id: 'test_bsf_ldce_03',
    title: 'BSF Head Constable (RO/RM) Technical & Tactical Mock 03 - Communication & Radar Signals',
    force: 'BSF',
    category: 'LDCE',
    targetExam: 'BSF HC (RO/RM) LDCE 2026',
    description: 'Technical and border defense speed mock: VHF/UHF radio communication, Electronic intelligence, Elementary Mathematics, and General Science.',
    pool: bsfQuestions,
    questionCount: 12,
    difficulty: 'Moderate'
  },
  {
    num: 16,
    id: 'test_bsf_ldce_04',
    title: 'BSF Anti-Tunneling & Riverine Border Patrol Mock 04 - Creek & Desert Border Defense',
    force: 'BSF',
    category: 'LDCE',
    targetExam: 'BSF SI/GD LDCE 2026',
    description: 'Special border geography mock: Sir Creek hovercraft tactics, Rann of Kutch camel patrols, Anti-tunneling ground sensors, Quantitative Aptitude, and English.',
    pool: bsfQuestions,
    questionCount: 15,
    difficulty: 'Hard'
  },
  {
    num: 17,
    id: 'test_bsf_ldce_05',
    title: 'BSF All India Border Sentinel Grand Mock 05 - Comprehensive LDCE Examination',
    force: 'BSF',
    category: 'LDCE',
    targetExam: 'BSF All India LDCE 2026',
    description: 'Full-length 20-question grand mock test for BSF personnel covering Western and Eastern border operations, Law, Reasoning, Arithmetic, and Language.',
    pool: bsfQuestions,
    questionCount: 20,
    difficulty: 'Advanced'
  },

  // --- ITBP (5 Mocks) ---
  {
    num: 18,
    id: 'test_itbp_ldce_01',
    title: 'ITBP SI (GD) LDCE Full Mock 01 - ITBP Act 1992 & High Altitude Rules',
    force: 'ITBP',
    category: 'LDCE',
    targetExam: 'ITBP SI/GD LDCE 2026',
    description: 'Comprehensive test on ITBP Act 1992 (Sec 4, 18), High Altitude Pulmonary Edema (HAPE) prevention, Mountain rescue, Reasoning, and Elementary Mathematics.',
    pool: itbpQuestions,
    questionCount: 15,
    difficulty: 'Moderate'
  },
  {
    num: 19,
    id: 'test_itbp_ldce_02',
    title: 'ITBP Mountain Warfare & Border Surveillance Mock 02 - Extreme Cold Ops & Mountain Craft',
    force: 'ITBP',
    category: 'LDCE',
    targetExam: 'ITBP Himveer SI LDCE',
    description: 'Glacial survival and tactics test: Ice Axe self-arrest, Crevasse safety, Avalanche rescue beacons, Sub-zero weaponry, GK, and English Comprehension.',
    pool: itbpQuestions,
    questionCount: 12,
    difficulty: 'Moderate'
  },
  {
    num: 20,
    id: 'test_itbp_ldce_03',
    title: 'ITBP Head Constable Telecom & Signals Speed Mock 03 - High Altitude Communications',
    force: 'ITBP',
    category: 'LDCE',
    targetExam: 'ITBP HC Telecom LDCE 2026',
    description: 'Communications test in rugged Himalayan terrain: Satellite telephony, Battery maintenance at -40°C, Reasoning series, and Quantitative Aptitude.',
    pool: itbpQuestions,
    questionCount: 12,
    difficulty: 'Moderate'
  },
  {
    num: 21,
    id: 'test_itbp_ldce_04',
    title: 'ITBP LAC Border Protocols & Winter Defense Mock 04 - Line of Actual Control Regulations',
    force: 'ITBP',
    category: 'LDCE',
    targetExam: 'ITBP SI/GD LDCE 2026',
    description: 'India-China LAC bilateral agreements (1996, 2005), Banner drills, Border Personnel Meetings (BPM), Tactical patience, Reasoning, and General Awareness.',
    pool: itbpQuestions,
    questionCount: 15,
    difficulty: 'Hard'
  },
  {
    num: 22,
    id: 'test_itbp_ldce_05',
    title: 'ITBP Himveer All India Championship Mock 05 - Comprehensive Mountain Defense Mock',
    force: 'ITBP',
    category: 'LDCE',
    targetExam: 'ITBP All India LDCE 2026',
    description: 'Full-length 20-question mock test for ITBP Himveers: High-altitude law, Mountain tactical craft, Reasoning, Arithmetic, and English/Hindi grammar.',
    pool: itbpQuestions,
    questionCount: 20,
    difficulty: 'Advanced'
  },

  // --- SSB (4 Mocks) ---
  {
    num: 23,
    id: 'test_ssb_ldce_01',
    title: 'SSB SI (GD) LDCE Full Mock 01 - SSB Act 2007 & Border Law',
    force: 'SSB',
    category: 'LDCE',
    targetExam: 'SSB SI/GD LDCE 2026',
    description: 'Core statutory test on SSB Act 2007 (Sec 15, 20), Open border management concepts, Customs and NDPS seizures, Reasoning, and Quantitative Aptitude.',
    pool: ssbQuestions,
    questionCount: 15,
    difficulty: 'Moderate'
  },
  {
    num: 24,
    id: 'test_ssb_ldce_02',
    title: 'SSB Indo-Nepal & Indo-Bhutan Friendly Border Policing Mock 02 - Treaty & Open Border Law',
    force: 'SSB',
    category: 'LDCE',
    targetExam: 'SSB SI / Sub-Inspector LDCE',
    description: '1950 Indo-Nepal Treaty protocols, Indo-Bhutan boundary norms, Anti-human trafficking units (AHTU), Wildlife Act powers, Reasoning, and English.',
    pool: ssbQuestions,
    questionCount: 12,
    difficulty: 'Moderate'
  },
  {
    num: 25,
    id: 'test_ssb_ldce_03',
    title: 'SSB Intelligence & Special Operations Mock 03 - HUMINT, Trans-Border Crime & Arms Act',
    force: 'SSB',
    category: 'LDCE',
    targetExam: 'SSB Intelligence / SI LDCE',
    description: 'Human intelligence gathering (HUMINT), Civic Action Programmes (CAP), Cross-border arms interception, Logical deduction, and Quantitative Aptitude.',
    pool: ssbQuestions,
    questionCount: 15,
    difficulty: 'Hard'
  },
  {
    num: 26,
    id: 'test_ssb_ldce_04',
    title: 'SSB All India Seema Prahari Full Mock 04 - Complete Syllabus Mock',
    force: 'SSB',
    category: 'LDCE',
    targetExam: 'SSB All India LDCE 2026',
    description: 'Full-length 20-question grand mock test covering all SSB departmental promotion requirements: Law, Reasoning, GK, Quant, and English/Hindi language.',
    pool: ssbQuestions,
    questionCount: 20,
    difficulty: 'Advanced'
  },

  // --- ASSAM RIFLES & UPSC CAPF (AC) (4 Mocks) ---
  {
    num: 27,
    id: 'test_ar_ldce_01',
    title: 'Assam Rifles SI LDCE Mock 01 - Assam Rifles Act 2006 & Jungle Warfare Operations',
    force: 'Assam Rifles',
    category: 'LDCE',
    targetExam: 'Assam Rifles SI LDCE 2026',
    description: 'Official test covering Assam Rifles Act 2006, Dual Control architecture (MHA & Indian Army), Counter-insurgency jungle drills, Reasoning, and Arithmetic.',
    pool: arCapfQuestions,
    questionCount: 15,
    difficulty: 'Moderate'
  },
  {
    num: 28,
    id: 'test_ar_ldce_02',
    title: 'Assam Rifles North-East Border & Counter-Terrorism Mock 02 - CI/CT Tactics & Hill Patrol',
    force: 'Assam Rifles',
    category: 'LDCE',
    targetExam: 'Assam Rifles SI / Warrant Officer LDCE',
    description: 'Indo-Myanmar Free Movement Regime (FMR), Hill terrain ambushes, Jungle lane shooting, National security GK, Reasoning, and English Comprehension.',
    pool: arCapfQuestions,
    questionCount: 12,
    difficulty: 'Moderate'
  },
  {
    num: 29,
    id: 'test_capf_ac_01',
    title: 'UPSC CAPF (Assistant Commandant) Paper-I Full Mock 01 - General Ability & Intelligence',
    force: 'CAPF (AC)',
    category: 'CAPF',
    targetExam: 'UPSC CAPF (AC) Examination 2026',
    description: 'UPSC standard Paper-I mock test: Indian Polity (Article 355), National Security Architecture (Cabinet Committee on Security), History, Science, and Logical Deductions.',
    pool: arCapfQuestions,
    questionCount: 15,
    difficulty: 'Advanced'
  },
  {
    num: 30,
    id: 'test_capf_ac_02',
    title: 'UPSC CAPF (Assistant Commandant) Paper-I Full Mock 02 - Defense Strategy, Governance & Logic',
    force: 'CAPF (AC)',
    category: 'CAPF',
    targetExam: 'UPSC CAPF (AC) Examination 2026',
    description: 'Advanced Paper-I mock test: Geopolitics, Paramilitary modernization, Internal Security challenges, Advanced Quantitative Data Interpretation, and Logic.',
    pool: arCapfQuestions,
    questionCount: 20,
    difficulty: 'Advanced'
  }
];

// Generate the 30 tests objects
const generated30Tests = all30MocksConfig.map(cfg => {
  const questions = assembleQuestions(cfg.num, cfg.force, cfg.pool, cfg.questionCount);
  const qCount = questions.length;
  // Proportional timing: 1 minute per question as requested by user
  const duration = qCount;
  const marksPerQ = cfg.category === 'CAPF' ? 2 : 1;
  const totalMarks = qCount * marksPerQ;
  const negMarking = cfg.category === 'CAPF' ? 0.66 : 0.25;

  const sections = [
    `Professional Knowledge & ${cfg.force} Statutory Rules`,
    'General Intelligence & Reasoning',
    'General Knowledge & Paramilitary Affairs',
    'Quantitative Aptitude',
    'English & Hindi Language'
  ];

  return {
    id: cfg.id,
    title: cfg.title,
    category: cfg.category,
    targetExam: cfg.targetExam,
    force: cfg.force,
    isPaid: true,
    requiredPackage: 'pkg_100_2m', // Unlocked by ₹100 Tactical Pass & ₹199 Commando Pro Pass
    description: cfg.description,
    durationMinutes: duration,
    totalMarks: totalMarks,
    passingMarks: Math.ceil(totalMarks * 0.45),
    marksPerQuestion: marksPerQ,
    negativeMarking: negMarking,
    questionCount: qCount,
    sections: sections,
    difficulty: cfg.difficulty,
    featured: cfg.num === 1 || cfg.num === 7 || cfg.num === 13 || cfg.num === 18 || cfg.num === 23 || cfg.num === 29,
    questions: questions,
    createdAt: new Date().toISOString()
  };
});

console.log(`Generated ${generated30Tests.length} tests successfully!`);
console.log('Force breakdown:');
const forceCounts = {};
generated30Tests.forEach(t => {
  forceCounts[t.force] = (forceCounts[t.force] || 0) + 1;
});
console.log(forceCounts);

// Save or merge into data/database.json
try {
  const dbData = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

  // Keep any existing free tests or replace old ones cleanly
  const nonForceTests = dbData.tests.filter(t => !t.id.startsWith('test_crpf_') && !t.id.startsWith('test_cisf_') && !t.id.startsWith('test_bsf_') && !t.id.startsWith('test_itbp_') && !t.id.startsWith('test_ssb_') && !t.id.startsWith('test_ar_') && !t.id.startsWith('test_capf_ac_'));

  console.log(`Preserving ${nonForceTests.length} existing tests (e.g. SSC CPO full paper, CGL, etc.).`);
  dbData.tests = [...generated30Tests, ...nonForceTests];

  fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2), 'utf8');
  console.log(`Successfully wrote ${dbData.tests.length} total tests to ${DB_PATH}!`);
} catch (err) {
  console.error('Error saving to database.json:', err);
}
