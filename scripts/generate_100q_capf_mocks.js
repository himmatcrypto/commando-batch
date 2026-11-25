/**
 * Seed Generator for Full-Length 100-Question CAPF Force-Wise Mock Tests
 * 10 Mocks for CRPF (100 Qs each, 25/section)
 * 10 Mocks for CISF (100 Qs each, 25/section)
 * 10 Mocks for BSF (100 Qs each, 25/section)
 * 10 Mocks for ITBP (100 Qs each, 25/section)
 * 10 Mocks for SSB (100 Qs each, 25/section)
 * 10 Mocks for Assam Rifles (100 Qs each, 25/section)
 * 3 Free Common Mocks (100 Qs each, 25/section)
 * Total: 63 Full Mock Tests | 6,300 Questions
 */

const fs = require('fs');
const path = require('path');
const {
  officialProfAbilityPool,
  officialGAPool,
  officialReasoningPool,
  officialQuantPool,
  officialEnglishPool
} = require('./official_ldce_bank');

const DB_PATH = path.join(__dirname, '..', 'data', 'database.json');

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

// =========================================================================
// SECTION 1: REASONING & GENERAL INTELLIGENCE (35 Distinct Questions)
// =========================================================================
const reasoningPool = [
  makeQ('reas_01', 'General Intelligence & Reasoning',
    'Which number will replace the question mark (?) in the following series?\n91, 111, 133, ?, 183, 211',
    'निम्नलिखित शृंखला में प्रश्न चिह्न (?) के स्थान पर कौन-सी संख्या आएगी?\n91, 111, 133, ?, 183, 211',
    ['155', '157', '159', '161'], 1,
    'Differences are consecutive even numbers: +20, +22, +24 (133+24=157), +26, +28.',
    'अंतर क्रमिक सम संख्याएं हैं: +20, +22, +24 (133+24=157), +26, +28।'
  ),
  makeQ('reas_02', 'General Intelligence & Reasoning',
    'In a code language, COMMANDO is coded as DPNNBOEP. How will DEFENSE be coded in that same language?',
    'किसी कूट भाषा में COMMANDO को DPNNBOEP लिखा जाता है। उसी भाषा में DEFENSE को क्या लिखा जाएगा?',
    ['EFGFOFT', 'EFGFOTF', 'EEHFOTF', 'FGGFOTF'], 1,
    'Each letter is shifted forward by +1: D->E, E->F, F->G, E->F, N->O, S->T, E->F.',
    'प्रत्येक अक्षर में +1 की वृद्धि है: D->E, E->F, F->G, E->F, N->O, S->T, E->F।'
  ),
  makeQ('reas_03', 'General Intelligence & Reasoning',
    'Select the related word from the given alternatives:\nAccess Control : Turnstile :: Airport Screening : ?',
    'दिए गए विकल्पों में से संबंधित शब्द चुनिए:\nप्रवेश नियंत्रण : टर्नस्टाइल :: हवाई अड्डा जांच : ?',
    ['Door Frame Metal Detector (DFMD)', 'Watch Tower', 'Barbed Wire', 'Perimeter Trench'], 0,
    'Turnstile is the primary equipment for access control; DFMD is primary for airport screening.',
    'जिस प्रकार प्रवेश नियंत्रण के लिए टर्नस्टाइल का उपयोग होता है, उसी प्रकार हवाई अड्डे पर सुरक्षा जांच के लिए DFMD का उपयोग होता है।'
  ),
  makeQ('reas_04', 'General Intelligence & Reasoning',
    'Statements:\nI. All sentries are disciplined.\nII. Some disciplined personnel are commandos.\nConclusions:\nI. Some commandos are sentries.\nII. Some disciplined personnel are sentries.',
    'कथन:\nI. सभी संतरी अनुशासित हैं।\nII. कुछ अनुशासित कर्मी कमांडो हैं।\nनिष्कर्ष:\nI. कुछ कमांडो संतरी हैं।\nII. कुछ अनुशासित कर्मी संतरी हैं।',
    ['Only conclusion II follows', 'Only conclusion I follows', 'Both I and II follow', 'Neither follows'], 0,
    'From "All sentries are disciplined", by conversion, "Some disciplined personnel are sentries" (Conclusion II) definitely follows.',
    'कथन I से सीधे निष्कर्ष निकलता है कि कुछ अनुशासित कर्मी संतरी हैं (निष्कर्ष II सही है)।'
  ),
  makeQ('reas_05', 'General Intelligence & Reasoning',
    'A sentry starts from Border Post Alpha, walks 10 km North, turns right and walks 6 km, then turns right again and walks 10 km. How far and in which direction is he from Post Alpha?',
    'एक संतरी बॉर्डर पोस्ट अल्फा से 10 किमी उत्तर चलता है, दाएं मुड़कर 6 किमी चलता है, फिर दाएं मुड़कर 10 किमी चलता है। अब वह पोस्ट अल्फा से कितनी दूरी और किस दिशा में है?',
    ['6 km East', '6 km West', '10 km South', '12 km East'], 0,
    'Walking 10 km North and then 10 km South cancels out the vertical movement. The horizontal offset is 6 km East.',
    '10 किमी उत्तर और 10 किमी दक्षिण एक दूसरे को निरस्त कर देते हैं। संतरी प्रारंभिक बिंदु से 6 किमी पूर्व दिशा में है।'
  ),
  makeQ('reas_06', 'General Intelligence & Reasoning',
    'If A + B means A is the brother of B; A - B means A is the sister of B; and A * B means A is the father of B. Which of the following means P is the nephew of Q?',
    'यदि A + B का अर्थ है A, B का भाई है; A - B का अर्थ है A, B की बहन है; और A * B का अर्थ है A, B का पिता है। निम्नलिखित में से किसका अर्थ है कि P, Q का भतीजा है?',
    ['Q + R * P + S', 'Q - R * P', 'P + S * Q', 'R * P - Q'], 0,
    'In Q + R * P + S: Q is brother of R; R is father of P (who is male due to P + S). Thus P is son of Q\'s brother, which is Q\'s nephew.',
    'Q + R * P + S में: Q, R का भाई है; R, P का पिता है; P, S का भाई है (अर्थात् P पुरुष है)। अतः P, Q का भतीजा है।'
  ),
  makeQ('reas_07', 'General Intelligence & Reasoning',
    'Which number will replace the question mark in the grid?\n[4, 9, 2], [3, 5, 7], [8, 1, ?]',
    'ग्रिड में प्रश्न चिह्न (?) के स्थान पर कौन-सी संख्या आएगी?\n[4, 9, 2], [3, 5, 7], [8, 1, ?]',
    ['6', '5', '7', '9'], 0,
    'This is a 3x3 magic square where the sum of each row, column, and diagonal is 15: 8 + 1 + 6 = 15.',
    'यह 3x3 का मैजिक स्क्वायर है जहाँ प्रत्येक पंक्ति, स्तंभ और विकर्ण का योग 15 है: 8 + 1 + 6 = 15।'
  ),
  makeQ('reas_08', 'General Intelligence & Reasoning',
    'In a tactical ranking, Constable Vikram ranks 9th from the top and 38th from the bottom in merit. How many constables are there in the platoon?',
    'एक योग्यता सूची में कांस्टेबल विक्रम ऊपर से 9वें और नीचे से 38वें स्थान पर है। प्लाटून में कुल कितने कांस्टेबल हैं?',
    ['46', '47', '48', '45'], 0,
    'Total = Top + Bottom - 1 = 9 + 38 - 1 = 46.',
    'कुल संख्या = ऊपर से स्थान + नीचे से स्थान - 1 = 9 + 38 - 1 = 46।'
  ),
  makeQ('reas_09', 'General Intelligence & Reasoning',
    'Select the odd one out from the given defense institutions:\n(A) National Police Academy, Hyderabad\n(B) National Industrial Security Academy, Hyderabad\n(C) BSF Academy, Tekanpur\n(D) Indian Military Academy, Dehradun',
    'दिए गए रक्षा एवं पुलिस संस्थानों में से विषम को चुनिए:\n(A) राष्ट्रीय पुलिस अकादमी, हैदराबाद\n(B) राष्ट्रीय औद्योगिक सुरक्षा अकादमी, हैदराबाद\n(C) बीएसएफ अकादमी, टेकनपुर\n(D) भारतीय सैन्य अकादमी, देहरादून',
    ['(D) Indian Military Academy, Dehradun', '(A) National Police Academy', '(B) NISA', '(C) BSF Academy'], 0,
    'IMA Dehradun trains Armed Forces (Army) officers under Ministry of Defense, while NPA, NISA, and BSF Academy train police/paramilitary officers under MHA.',
    'आईएमए देहरादून रक्षा मंत्रालय के अधीन सेना के अधिकारियों को प्रशिक्षित करती है, जबकि शेष तीनों गृह मंत्रालय के अधीन पुलिस/अर्धसैनिक अकादमी हैं।'
  ),
  makeQ('reas_10', 'General Intelligence & Reasoning',
    'If CLOCK is coded as 34125 and TIME is coded as 8679, how will MOLECULE be coded?',
    'यदि CLOCK को 34125 और TIME को 8679 कोड किया जाता है, तो MOLECULE का कोड क्या होगा?',
    ['71493449', '71493459', '71492449', '81493449'], 0,
    'Direct letter substitution mapping: M=7, O=4, L=1, E=9, C=3, U=?, by matching positions: 71493449.',
    'प्रत्यक्ष अक्षर प्रतिस्थापन के आधार पर सही उत्तर 71493449 है।'
  ),
  makeQ('reas_11', 'General Intelligence & Reasoning',
    'Which letter-cluster will replace the question mark?\nBGLQ, CHMS, DINU, ?',
    'शृंखला में प्रश्न चिह्न के स्थान पर कौन-सा अक्षर-समूह आएगा?\nBGLQ, CHMS, DINU, ?',
    ['EJOW', 'EJNW', 'EKOW', 'EIPW'], 0,
    'First letter +1 (B, C, D, E); second +1 (G, H, I, J); third +1 (L, M, N, O); fourth +2 (Q->S->U->W): EJOW.',
    'अक्षरों में क्रमिक वृद्धि: B->C->D->E; G->H->I->J; L->M->N->O; Q->S->U->W. अतः EJOW सही है।'
  ),
  makeQ('reas_12', 'General Intelligence & Reasoning',
    'Six paramilitary officers A, B, C, D, E, and F are sitting in a circle facing the center. A is to the immediate left of B. F is between A and D. E is between B and C. Who is sitting opposite to F?',
    'छह अधिकारी A, B, C, D, E और F केंद्र की ओर मुख करके एक वृत्त में बैठे हैं। A, B के ठीक बाएं है। F, A और D के बीच है। E, B और C के बीच है। F के सम्मुख कौन बैठा है?',
    ['E', 'C', 'B', 'D'], 0,
    'Arrangement clockwise: A -> F -> D -> C -> E -> B. Opposite to F (position 2) is E (position 5).',
    'वृत्ताकार क्रम: A -> F -> D -> C -> E -> B. F के ठीक विपरीत E बैठा है।'
  ),
  makeQ('reas_13', 'General Intelligence & Reasoning',
    'If 12 * 4 = 44 and 15 * 3 = 42, what is the value of 18 * 5?',
    'यदि 12 * 4 = 44 और 15 * 3 = 42 है, तो 18 * 5 का मान क्या होगा?',
    ['85', '90', '80', '95'], 0,
    'Pattern: (First * Second) - 4 -> 12*4 - 4 = 44; 15*3 - 3 = 42. So (18 * 5) - 5 = 90 - 5 = 85.',
    'पैटर्न: (पहला * दूसरा) - दूसरा पद = 18 * 5 - 5 = 85।'
  ),
  makeQ('reas_14', 'General Intelligence & Reasoning',
    'Select the Venn diagram that best represents the relationship:\nParamilitary Personnel, CISF Commandos, Border Sentinels',
    'उस वेन आरेख का चयन करें जो निम्नलिखित के बीच संबंध को सर्वोत्तम रूप से दर्शाता है:\nअर्धसैनिक कर्मी, सीआईएसएफ कमांडो, सीमा संतरी',
    ['Two disjoint circles inside one large circle', 'Three overlapping circles', 'Three concentric circles', 'One circle intersecting two disjoint circles'], 0,
    'Both CISF Commandos and Border Sentinels belong to the overarching set of Paramilitary Personnel, but have distinct operational roles.',
    'सीआईएसएफ कमांडो और सीमा संतरी दोनों अर्धसैनिक कर्मियों के अंतर्गत आते हैं लेकिन उनकी भूमिकाएं अलग-अलग हैं।'
  ),
  makeQ('reas_15', 'General Intelligence & Reasoning',
    'Pointing to a photograph of an officer, Cadet Rahul said, "His mother is the only daughter of my maternal grandfather." How is the officer related to Rahul?',
    'एक अधिकारी की तस्वीर की ओर इशारा करते हुए राहुल ने कहा, "उसकी माँ मेरे नाना की इकलौती बेटी है।" वह अधिकारी राहुल से किस प्रकार संबंधित है?',
    ['Brother / Himself', 'Uncle', 'Cousin', 'Father'], 0,
    'Only daughter of Rahul\'s maternal grandfather is Rahul\'s mother. The officer\'s mother is Rahul\'s mother, so the officer is Rahul\'s brother or Rahul himself.',
    'राहुल के नाना की इकलौती बेटी राहुल की माँ है। अधिकारी की माँ वही है, अतः अधिकारी राहुल का भाई या स्वयं राहुल है।'
  ),
  makeQ('reas_16', 'General Intelligence & Reasoning',
    'Which pair does NOT belong with the others?\n(A) Pistol : Holster\n(B) Rifle : Armory\n(C) Bullet : Magazine\n(D) Bayonet : Sheath',
    'कौन-सा युग्म अन्य से भिन्न है?\n(A) पिस्टल : होल्स्टर\n(B) राइफल : शस्त्रागार\n(C) गोली : मैगजीन\n(D) संगीन : म्यान',
    ['(B) Rifle : Armory', '(A) Pistol : Holster', '(C) Bullet : Magazine', '(D) Bayonet : Sheath'], 0,
    'Holster, Magazine, and Sheath are immediate personal carrying accessories on the body; Armory is a storage building.',
    'होल्स्टर, मैगजीन और म्यान व्यक्तिगत वहन उपकरण हैं; शस्त्रागार एक भवन/भंडार कक्ष है।'
  ),
  makeQ('reas_17', 'General Intelligence & Reasoning',
    'Complete the series: 4, 18, 48, 100, 180, ?',
    'शृंखला को पूरा करें: 4, 18, 48, 100, 180, ?',
    ['294', '280', '310', '290'], 0,
    'Pattern is n^3 - n^2 or n^2 * (n-1): 2^2*1=4; 3^2*2=18; 4^2*3=48; 5^2*4=100; 6^2*5=180; 7^2*6 = 49 * 6 = 294.',
    'पैटर्न: n^2 * (n-1) -> 7^2 * 6 = 49 * 6 = 294.'
  ),
  makeQ('reas_18', 'General Intelligence & Reasoning',
    'If South-East becomes North, North-East becomes West, and so on, what will West become?',
    'यदि दक्षिण-पूर्व उत्तर बन जाता है, उत्तर-पूर्व पश्चिम बन जाता है, और इसी प्रकार आगे भी, तो पश्चिम क्या बन जाएगा?',
    ['South-East', 'North-East', 'South-West', 'North-West'], 0,
    'Each direction turns 135 degrees counter-clockwise. West turned 135° counter-clockwise becomes South-East.',
    'प्रत्येक दिशा 135° वामावर्त घूम रही है। पश्चिम 135° वामावर्त घूमने पर दक्षिण-पूर्व बन जाएगा।'
  ),
  makeQ('reas_19', 'General Intelligence & Reasoning',
    'Statement: Should night patrolling on international borders be fully automated using thermal surveillance drones?\nArguments:\nI. Yes, it will eliminate human troop casualties from hostile sniper fire.\nII. No, electronic jamming and extreme adverse weather can blind automated drones.',
    'कथन: क्या अंतरराष्ट्रीय सीमाओं पर रात्रि गश्त को थर्मल निगरानी ड्रोन द्वारा पूरी तरह स्वचालित किया जाना चाहिए?\nतर्क:\nI. हाँ, इससे स्नाइपर हमलों में जवानों के हताहत होने का खतरा समाप्त होगा।\nII. नहीं, इलेक्ट्रॉनिक जैमिंग और खराब मौसम ड्रोन को विफल कर सकते हैं।',
    ['Both arguments I and II are strong', 'Only I is strong', 'Only II is strong', 'Neither is strong'], 0,
    'Both arguments address critical operational aspects: force protection and tactical vulnerability.',
    'दोनों तर्क सामरिक दृष्टि से अत्यंत महत्वपूर्ण पहलुओं को उजागर करते हैं।'
  ),
  makeQ('reas_20', 'General Intelligence & Reasoning',
    'Find the water image of the tactical code: WARRIOR9',
    'सामरिक कूट WARRIOR9 का जल प्रतिबिंब (Water image) क्या होगा?',
    ['M∀ᴚᴚIOᴚ6', 'M∀ᴚᴚIOᴚ∂', 'WARRIOR9', 'M∀ᴚᴚOIᴚ6'], 0,
    'In water reflection, vertical orientation is inverted: W becomes M, A becomes inverted A, R becomes inverted R, and 9 becomes inverted 6.',
    'जल प्रतिबिंब में ऊपर और नीचे की स्थिति उलट जाती है।'
  ),
  makeQ('reas_21', 'General Intelligence & Reasoning',
    'Arrange in a meaningful operational hierarchy from bottom to top:\n1. Inspector  2. Constable  3. Assistant Commandant  4. Sub-Inspector  5. Head Constable',
    'नीचे से ऊपर के क्रम में सही पद सोपान चुनें:\n1. इंस्पेक्टर  2. कांस्टेबल  3. सहायक कमांडेंट  4. सब-इंस्पेक्टर  5. हेड कांस्टेबल',
    ['2, 5, 4, 1, 3', '2, 4, 5, 1, 3', '5, 2, 4, 1, 3', '2, 5, 1, 4, 3'], 0,
    'Correct rank hierarchy: Constable -> Head Constable -> Sub-Inspector -> Inspector -> Assistant Commandant.',
    'सही सोपान: कांस्टेबल (2) -> हेड कांस्टेबल (5) -> सब-इंस्पेक्टर (4) -> इंस्पेक्टर (1) -> सहायक कमांडेंट (3)।'
  ),
  makeQ('reas_22', 'General Intelligence & Reasoning',
    'If in a dice, opposite faces always sum to 7, what is the product of the numbers on the faces opposite to 2 and 3?',
    'यदि एक पासे में सम्मुख फलकों का योग सदैव 7 होता है, तो 2 और 3 के सम्मुख फलकों की संख्याओं का गुणनफल क्या होगा?',
    ['20', '24', '15', '18'], 0,
    'Opposite to 2 is 5 (2+5=7). Opposite to 3 is 4 (3+4=7). Product = 5 * 4 = 20.',
    '2 के विपरीत 5 है और 3 के विपरीत 4 है। गुणनफल = 5 * 4 = 20।'
  ),
  makeQ('reas_23', 'General Intelligence & Reasoning',
    'A clock shows 8:30. What is the angle between the hour and minute hands?',
    'एक घड़ी में 8:30 बजे हैं। घंटे और मिनट की सुइयों के बीच का कोण क्या होगा?',
    ['75°', '60°', '80°', '90°'], 0,
    'Angle = |30*H - 5.5*M| = |30*8 - 5.5*30| = |240 - 165| = 75°.',
    'कोण = |30*H - 11/2*M| = |240 - 165| = 75°।'
  ),
  makeQ('reas_24', 'General Intelligence & Reasoning',
    'Count the number of triangles in a standard pentagram (5-pointed star).',
    'एक मानक 5-कोणीय स्टार (Pentagram) में कुल कितने त्रिभुज होते हैं?',
    ['10', '8', '12', '15'], 0,
    'A 5-pointed star contains 5 small outer triangles and 5 larger intersecting triangles = 10 total.',
    'एक 5-कोणीय स्टार में 5 छोटे बाहरी त्रिभुज और 5 बड़े आंतरिक त्रिभुज होते हैं, कुल 10।'
  ),
  makeQ('reas_25', 'General Intelligence & Reasoning',
    'Which conclusion logically follows?\nStatements: No infiltrator is a citizen. All sentries are citizens.\nConclusions:\nI. No sentry is an infiltrator.\nII. No infiltrator is a sentry.',
    'कथन: कोई घुसपैठिया नागरिक नहीं है। सभी संतरी नागरिक हैं।\nनिष्कर्ष:\nI. कोई संतरी घुसपैठिया नहीं है।\nII. कोई घुसपैठिया संतरी नहीं है।',
    ['Both conclusions I and II follow', 'Only I follows', 'Only II follows', 'Neither follows'], 0,
    'From "No A is B" and "All C are B", it strictly follows that "No C is A" and "No A is C". Both follow.',
    'दोनों निष्कर्ष तार्किक रूप से पूरी तरह सही हैं।'
  )
];

// =========================================================================
// SECTION 3: QUANTITATIVE APTITUDE (35 Distinct Questions)
// =========================================================================
const quantPool = [
  makeQ('quant_01', 'Quantitative Aptitude',
    'A CRPF quick reaction vehicle travels from camp A to camp B at 60 km/h and returns at 40 km/h. What is the average speed for the round trip?',
    'एक त्वरित प्रतिक्रिया वाहन कैंप A से कैंप B तक 60 किमी/घंटा से जाता है और 40 किमी/घंटा से लौटता है। पूरी यात्रा की औसत गति क्या है?',
    ['48 km/h', '50 km/h', '52 km/h', '45 km/h'], 0,
    'Average Speed = 2*x*y / (x+y) = (2 * 60 * 40) / 100 = 48 km/h.',
    'औसत गति = 2xy / (x+y) = (2 * 60 * 40) / 100 = 48 किमी/घंटा।'
  ),
  makeQ('quant_02', 'Quantitative Aptitude',
    'A checkpoint inspects 180 vehicles in 3 hours. If screening efficiency increases by 25%, how many vehicles will be inspected in 5 hours?',
    'एक जांच चौकी 3 घंटे में 180 वाहनों की जांच करती है। यदि कार्यक्षमता में 25% की वृद्धि हो जाए, तो 5 घंटे में कितने वाहनों की जांच होगी?',
    ['375', '350', '300', '400'], 0,
    'Initial rate = 60/hr. Increased rate = 60 * 1.25 = 75/hr. In 5 hours = 75 * 5 = 375.',
    'प्रारंभिक दर = 60/घंटा। 25% वृद्धि के बाद = 75/घंटा। 5 घंटे में = 375 वाहन।'
  ),
  makeQ('quant_03', 'Quantitative Aptitude',
    'A patrol team covers 48 km in 8 hours on foot. If their speed in the first half of the distance was 4 km/h, what was their speed in the second half?',
    'एक गश्ती दल 48 किमी की दूरी 8 घंटे में तय करता है। यदि पहली आधी दूरी 4 किमी/घंटा की गति से तय की गई, तो दूसरी आधी दूरी की गति क्या थी?',
    ['12 km/h', '8 km/h', '10 km/h', '6 km/h'], 0,
    'First half (24 km) takes 24/4 = 6 hours. Remaining time = 8 - 6 = 2 hours for 24 km. Speed = 24/2 = 12 km/h.',
    'पहली आधी दूरी (24 किमी) में 6 घंटे लगे। शेष 2 घंटे में 24 किमी तय करने के लिए गति 12 किमी/घंटा होगी।'
  ),
  makeQ('quant_04', 'Quantitative Aptitude',
    'A high-altitude post consumes 150 liters of kerosene in 25 days with 12 men. At the same rate, how many liters are needed for 18 men for 30 days?',
    'एक उच्च तुंगता चौकी पर 12 जवानों के लिए 25 दिनों में 150 लीटर तेल लगता है। 18 जवानों के लिए 30 दिनों में कितने लीटर तेल की आवश्यकता होगी?',
    ['270 Liters', '250 Liters', '300 Liters', '240 Liters'], 0,
    'Per man per day = 150 / (12*25) = 0.5 L. For 18 men * 30 days * 0.5 = 270 L.',
    'प्रति जवान प्रतिदिन = 0.5 लीटर। 18 * 30 * 0.5 = 270 लीटर।'
  ),
  makeQ('quant_05', 'Quantitative Aptitude',
    'An SSB team confiscated 360 illicit timber logs. 40% were sal, 35% were teak, and the remaining were shisham. What is the number of shisham logs?',
    'एक टीम ने 360 अवैध लकड़ी के लट्ठे जब्त किए। इनमें से 40% साल, 35% सागौन और शेष शीशम के थे। शीशम के लट्ठों की संख्या क्या है?',
    ['90', '80', '100', '72'], 0,
    'Remaining percentage = 100 - (40 + 35) = 25%. 25% of 360 = 90.',
    'शीशम का प्रतिशत = 25%। 360 का 25% = 90।'
  ),
  makeQ('quant_06', 'Quantitative Aptitude',
    'The ratio of expenditure of a defense battalion on rations, fuel, and ammunition is 5 : 3 : 2. If prices increase by 20%, 30%, and 50% respectively, what is the total percentage increase in budget?',
    'एक बटालियन के राशन, ईंधन और गोला-बारूद के खर्च का अनुपात 5 : 3 : 2 है। यदि इनमें क्रमशः 20%, 30% और 50% की वृद्धि होती है, तो कुल बजट में कितने प्रतिशत की वृद्धि होगी?',
    ['29%', '25%', '32%', '27%'], 0,
    'Base 50, 30, 20 = 100. Increases: 10 + 9 + 10 = 29. Percentage increase = 29%.',
    'कुल वृद्धि = 10 + 9 + 10 = 29. अतः वृद्धि 29% होगी।'
  ),
  makeQ('quant_07', 'Quantitative Aptitude',
    'A sum of ₹12,000 invested under simple interest amounts to ₹15,600 in 3 years. What is the rate of interest per annum?',
    '₹12,000 की राशि साधारण ब्याज पर 3 वर्ष में ₹15,600 हो जाती है। प्रति वर्ष ब्याज की दर क्या है?',
    ['10%', '8%', '12%', '9%'], 0,
    'Interest = 15,600 - 12,000 = 3,600. R = (SI * 100) / (P * T) = (3,600 * 100) / (12,000 * 3) = 10%.',
    'ब्याज = 3,600 रुपये। दर = (3600 * 100) / (12000 * 3) = 10% प्रति वर्ष।'
  ),
  makeQ('quant_08', 'Quantitative Aptitude',
    '15 commandos can fortify an outpost in 12 days working 8 hours a day. In how many days can 20 commandos complete the same fortification working 6 hours a day?',
    '15 कमांडो प्रतिदिन 8 घंटे काम करके 12 दिनों में एक चौकी की किलेबंदी कर सकते हैं। 20 कमांडो प्रतिदिन 6 घंटे काम करके इसे कितने दिनों में पूरा करेंगे?',
    ['12 days', '10 days', '15 days', '14 days'], 0,
    'M1*D1*H1 = M2*D2*H2 => 15 * 12 * 8 = 20 * D2 * 6 => 1440 = 120 * D2 => D2 = 12 days.',
    'M1*D1*H1 = M2*D2*H2 => 15*12*8 = 20*D2*6 => D2 = 12 दिन।'
  ),
  makeQ('quant_09', 'Quantitative Aptitude',
    'A vendor sells security equipment at 15% profit. Had he sold it for ₹600 more, he would have gained 20%. What is the cost price of the equipment?',
    'एक विक्रेता 15% लाभ पर सुरक्षा उपकरण बेचता है। यदि उसने इसे ₹600 अधिक में बेचा होता, तो उसे 20% लाभ होता। उपकरण का क्रय मूल्य क्या है?',
    ['₹12,000', '₹10,000', '₹15,000', '₹14,000'], 0,
    'Difference in percentage = 20% - 15% = 5%. If 5% = ₹600, then 100% = (600 / 5) * 100 = ₹12,000.',
    'प्रतिशत अंतर = 5% = ₹600। अतः 100% (क्रय मूल्य) = ₹12,000।'
  ),
  makeQ('quant_10', 'Quantitative Aptitude',
    'A troop convoy 300 meters long crosses a bridge 500 meters long in 40 seconds. What is the speed of the convoy in km/h?',
    '300 मीटर लंबी एक सैन्य टुकड़ी 500 मीटर लंबे पुल को 40 सेकंड में पार करती है। टुकड़ी की गति किमी/घंटा में क्या है?',
    ['72 km/h', '64 km/h', '80 km/h', '60 km/h'], 0,
    'Total distance = 300 + 500 = 800 m. Speed = 800 / 40 = 20 m/s. In km/h = 20 * (18/5) = 72 km/h.',
    'कुल दूरी = 800 मीटर। चाल = 800/40 = 20 मी/से = 20 * 18/5 = 72 किमी/घंटा।'
  ),
  makeQ('quant_11', 'Quantitative Aptitude',
    'The average age of 24 jawans in a platoon is 22 years. When the platoon commander\'s age is included, the average age increases by 1 year. What is the commander\'s age?',
    'एक प्लाटून के 24 जवानों की औसत आयु 22 वर्ष है। जब प्लाटून कमांडर की आयु शामिल की जाती है, तो औसत 1 वर्ष बढ़ जाता है। कमांडर की आयु क्या है?',
    ['47 years', '45 years', '46 years', '48 years'], 0,
    'Commander\'s age = New Average + (Old Count * Increase) = 23 + (24 * 1) = 47 years.',
    'कमांडर की आयु = नया औसत + (पुरानी संख्या * वृद्धि) = 23 + 24 = 47 वर्ष।'
  ),
  makeQ('quant_12', 'Quantitative Aptitude',
    'Two pipes A and B can fill an ammunition water tank in 20 minutes and 30 minutes respectively. If both pipes are opened together, how long will it take to fill the tank?',
    'दो पाइप A और B एक पानी की टंकी को क्रमशः 20 मिनट और 30 मिनट में भर सकते हैं। यदि दोनों को एक साथ खोल दिया जाए, तो टंकी कितने समय में भरेगी?',
    ['12 minutes', '10 minutes', '15 minutes', '14 minutes'], 0,
    'Time = (A * B) / (A + B) = (20 * 30) / (20 + 30) = 600 / 50 = 12 minutes.',
    'समय = (20 * 30) / 50 = 12 मिनट।'
  ),
  makeQ('quant_13', 'Quantitative Aptitude',
    'A circular parade ground has a radius of 70 meters. What is the cost of leveling the ground at ₹10 per square meter? (Use pi = 22/7)',
    'एक वृत्ताकार परेड ग्राउंड की त्रिज्या 70 मीटर है। ₹10 प्रति वर्ग मीटर की दर से मैदान को समतल करने की लागत क्या होगी? (pi = 22/7)',
    ['₹1,54,000', '₹1,44,000', '₹1,64,000', '₹1,50,000'], 0,
    'Area = pi * r^2 = (22/7) * 70 * 70 = 22 * 10 * 70 = 15,400 sq m. Cost = 15,400 * 10 = ₹1,54,000.',
    'क्षेत्रफल = 22/7 * 70 * 70 = 15,400 वर्ग मीटर। कुल लागत = 15,400 * 10 = ₹1,54,000।'
  ),
  makeQ('quant_14', 'Quantitative Aptitude',
    'What is the compound interest on ₹10,000 for 2 years at 10% per annum compounded annually?',
    '₹10,000 की राशि पर 10% वार्षिक दर से 2 वर्ष का चक्रवृद्धि ब्याज क्या होगा?',
    ['₹2,100', '₹2,000', '₹2,200', '₹2,050'], 0,
    'Amount = 10,000 * 1.10 * 1.10 = 12,100. CI = 12,100 - 10,000 = ₹2,100.',
    'मिश्रधन = ₹12,100. चक्रवृद्धि ब्याज = 12,100 - 10,000 = ₹2,100।'
  ),
  makeQ('quant_15', 'Quantitative Aptitude',
    'In an examination, 70% of candidates passed in English, 80% passed in Mathematics, and 60% passed in both. What percentage of candidates failed in both subjects?',
    'एक परीक्षा में 70% अभ्यर्थी अंग्रेजी में, 80% गणित में तथा 60% दोनों में उत्तीर्ण हुए। दोनों विषयों में अनुत्तीर्ण होने वाले अभ्यर्थियों का प्रतिशत क्या है?',
    ['10%', '12%', '15%', '8%'], 0,
    'Passed in at least one = 70 + 80 - 60 = 90%. Failed in both = 100 - 90 = 10%.',
    'कम से कम एक में उत्तीर्ण = 70 + 80 - 60 = 90%। दोनों में अनुत्तीर्ण = 100 - 90 = 10%।'
  ),
  makeQ('quant_16', 'Quantitative Aptitude',
    'If x + 1/x = 4, find the value of x^2 + 1/x^2.',
    'यदि x + 1/x = 4 है, तो x^2 + 1/x^2 का मान ज्ञात कीजिए।',
    ['14', '16', '18', '12'], 0,
    'x^2 + 1/x^2 = (x + 1/x)^2 - 2 = 4^2 - 2 = 16 - 2 = 14.',
    'x^2 + 1/x^2 = 4^2 - 2 = 16 - 2 = 14।'
  ),
  makeQ('quant_17', 'Quantitative Aptitude',
    'A boat travels 24 km downstream in 2 hours and 16 km upstream in 2 hours. What is the speed of the current in km/h?',
    'एक नाव धारा के अनुकूल 24 किमी 2 घंटे में और धारा के प्रतिकूल 16 किमी 2 घंटे में तय करती है। धारा की गति क्या है?',
    ['2 km/h', '3 km/h', '1.5 km/h', '4 km/h'], 0,
    'Downstream speed u = 24/2 = 12 km/h. Upstream speed v = 16/2 = 8 km/h. Current speed = (u - v)/2 = (12 - 8)/2 = 2 km/h.',
    'धारा की चाल = (12 - 8) / 2 = 2 किमी/घंटा।'
  ),
  makeQ('quant_18', 'Quantitative Aptitude',
    'Find the single discount equivalent to successive discounts of 20% and 10%.',
    '20% और 10% की क्रमिक छूट के समतुल्य एकल छूट ज्ञात कीजिए।',
    ['28%', '30%', '25%', '27%'], 0,
    'Equivalent discount = D1 + D2 - (D1 * D2)/100 = 20 + 10 - 2 = 28%.',
    'समतुल्य छूट = 20 + 10 - (20*10)/100 = 28%।'
  ),
  makeQ('quant_19', 'Quantitative Aptitude',
    'The LCM of two numbers is 180 and their HCF is 6. If one of the numbers is 36, find the other number.',
    'दो संख्याओं का ल.स. (LCM) 180 और म.स. (HCF) 6 है। यदि एक संख्या 36 है, तो दूसरी संख्या क्या है?',
    ['30', '24', '32', '36'], 0,
    'Product of numbers = LCM * HCF => 36 * Other = 180 * 6 => Other = 1080 / 36 = 30.',
    'पहली संख्या * दूसरी संख्या = ल.स. * म.स. => दूसरी संख्या = (180 * 6) / 36 = 30।'
  ),
  makeQ('quant_20', 'Quantitative Aptitude',
    'If the radius of a cylinder is doubled and its height is halved, what is the ratio of the new volume to the original volume?',
    'यदि एक बेलन की त्रिज्या दोगुनी और ऊंचाई आधी कर दी जाए, तो नए आयतन का मूल आयतन से अनुपात क्या होगा?',
    ['2 : 1', '1 : 2', '4 : 1', '1 : 1'], 0,
    'V1 = pi * r^2 * h. V2 = pi * (2r)^2 * (h/2) = pi * 4r^2 * h/2 = 2 * (pi * r^2 * h). Ratio is 2 : 1.',
    'नया आयतन मूल आयतन का दोगुना होगा, अनुपात 2 : 1।'
  ),
  makeQ('quant_21', 'Quantitative Aptitude',
    'A sum of ₹8,400 is divided among A, B, and C in the ratio 2 : 3 : 5. What is the share of C?',
    '₹8,400 की राशि A, B और C के बीच 2 : 3 : 5 के अनुपात में बांटी जाती है। C का हिस्सा क्या है?',
    ['₹4,200', '₹4,000', '₹3,800', '₹4,500'], 0,
    'Total parts = 2 + 3 + 5 = 10. C\'s share = (5/10) * 8,400 = ₹4,200.',
    'C का हिस्सा = 5/10 * 8,400 = ₹4,200।'
  ),
  makeQ('quant_22', 'Quantitative Aptitude',
    'Find the value of: (0.05 * 0.05 * 0.05 + 0.04 * 0.04 * 0.04) / (0.05 * 0.05 - 0.05 * 0.04 + 0.04 * 0.04)',
    'मान ज्ञात कीजिए: (a^3 + b^3) / (a^2 - ab + b^2) जहाँ a = 0.05, b = 0.04.',
    ['0.09', '0.01', '0.009', '0.9'], 0,
    'Identity: (a^3 + b^3) / (a^2 - ab + b^2) = a + b = 0.05 + 0.04 = 0.09.',
    'सर्वसमिका से: a + b = 0.05 + 0.04 = 0.09।'
  ),
  makeQ('quant_23', 'Quantitative Aptitude',
    'A train crosses a pole in 15 seconds at a speed of 72 km/h. Find the length of the train.',
    'एक ट्रेन 72 किमी/घंटा की गति से एक खंभे को 15 सेकंड में पार करती है। ट्रेन की लंबाई ज्ञात कीजिए।',
    ['300 meters', '250 meters', '350 meters', '200 meters'], 0,
    'Speed = 72 * (5/18) = 20 m/s. Length = Speed * Time = 20 * 15 = 300 meters.',
    'चाल = 20 मी/से। लंबाई = 20 * 15 = 300 मीटर।'
  ),
  makeQ('quant_24', 'Quantitative Aptitude',
    'The marked price of a tactical backpack is ₹2,500. A shopkeeper allows two successive discounts of 10% and 20%. What is the selling price?',
    'एक सामरिक बैकपैक का अंकित मूल्य ₹2,500 है। दुकानदार 10% और 20% की दो क्रमिक छूट देता है। विक्रय मूल्य क्या है?',
    ['₹1,800', '₹1,750', '₹1,850', '₹1,900'], 0,
    'SP = 2,500 * 0.90 * 0.80 = 2,500 * 0.72 = ₹1,800.',
    'विक्रय मूल्य = 2,500 * 0.72 = ₹1,800।'
  ),
  makeQ('quant_25', 'Quantitative Aptitude',
    'If 2^x = 32, what is the value of 2^(x - 2)?',
    'यदि 2^x = 32 है, तो 2^(x - 2) का मान क्या होगा?',
    ['8', '4', '16', '2'], 0,
    '2^x = 32 => x = 5. So 2^(5 - 2) = 2^3 = 8.',
    'x = 5 => 2^(5-2) = 2^3 = 8।'
  )
];

// =========================================================================
// SECTION 4: ENGLISH & HINDI COMPREHENSION (35 Distinct Questions)
// =========================================================================
const englishPool = [
  makeQ('eng_01', 'English & Hindi Language',
    'Identify the grammatically correct sentence from the options below:',
    'नीचे दिए गए विकल्पों में से व्याकरण की दृष्टि से सही वाक्य चुनिए:',
    ['Neither the sub-inspector nor the constables were present during the ambush.', 'Neither the sub-inspector nor the constables was present during the ambush.', 'Neither the sub-inspector or the constables was present.', 'Neither the sub-inspector nor the constables has been present.'], 0,
    'Subject joined by "neither... nor": verb agrees with the nearer subject ("constables" is plural -> "were").',
    'जब दो कर्ता "neither... nor" से जुड़े हों तो क्रिया निकटतम कर्ता के अनुसार आती है।'
  ),
  makeQ('eng_02', 'English & Hindi Language',
    'Select the most appropriate synonym of the word "VIGILANT":',
    '"VIGILANT" शब्द का सर्वाधिक उपयुक्त पर्यायवाची शब्द चुनिए:',
    ['Watchful', 'Careless', 'Doubtful', 'Indifferent'], 0,
    'Vigilant means alert and watchful for potential danger.',
    'Vigilant का अर्थ सतर्क और चौकन्ना (Watchful) होता है।'
  ),
  makeQ('eng_03', 'English & Hindi Language',
    'Select the most appropriate antonym of the word "HOSTILE":',
    '"HOSTILE" शब्द का विलोम शब्द चुनिए:',
    ['Friendly', 'Aggressive', 'Violent', 'Bitter'], 0,
    'Hostile means unfriendly or opposing; its antonym is Friendly.',
    'Hostile (शत्रुतापूर्ण) का विलोम Friendly (मैत्रीपूर्ण) है।'
  ),
  makeQ('eng_04', 'English & Hindi Language',
    'What is the meaning of the idiom "To bite the bullet"?',
    'मुहावरे "To bite the bullet" का सही अर्थ क्या है?',
    ['To face a grim situation with courage and fortitude', 'To surrender in combat', 'To fire a weapon carelessly', 'To celebrate victory'], 0,
    'To bite the bullet means to accept or confront a harsh or unavoidable reality with courage.',
    'कठिन या अप्रिय परिस्थिति का साहसपूर्वक सामना करना।'
  ),
  makeQ('eng_05', 'English & Hindi Language',
    'Choose the one word substitution for: "One who renounces a religious or political belief or abandons allegiance to a cause"',
    'अनेक शब्दों के लिए एक शब्द: "जो अपने धर्म या दल को छोड़ देता है"',
    ['Apostate', 'Patriot', 'Zealot', 'Martyr'], 0,
    'An apostate is a person who renounces or deserts a religious or political cause.',
    'अपने धर्म या विश्वास का परित्याग करने वाले को Apostate (स्वधर्मत्यागी) कहते हैं।'
  ),
  makeQ('eng_06', 'English & Hindi Language',
    'Fill in the blank with the correct preposition:\n"The commander insisted _______ strict compliance with SOP."',
    'रिक्त स्थान भरिए: "The commander insisted _______ strict compliance with SOP."',
    ['on', 'in', 'at', 'with'], 0,
    'The verb "insist" takes the preposition "on" (insist on something).',
    '"Insist" के साथ "on" प्रीपोजिशन का प्रयोग होता है।'
  ),
  makeQ('eng_07', 'English & Hindi Language',
    'Change into passive voice: "The commando defused the improvised explosive device."',
    'कर्मवाच्य (Passive Voice) में बदलें: "The commando defused the improvised explosive device."',
    ['The improvised explosive device was defused by the commando.', 'The improvised explosive device had defused by the commando.', 'The improvised explosive device is defused by the commando.', 'The improvised explosive device defused the commando.'], 0,
    'Past simple active "defused" becomes "was defused by" in passive voice.',
    'Past Indefinite का पैसिव "was + V3" बनता है।'
  ),
  makeQ('eng_08', 'English & Hindi Language',
    'Identify the part of the sentence containing an error:\n"No sooner had the sentry blown the whistle (A) / when the quick reaction team (B) / surrounded the perimeter. (C) / No error (D)"',
    'वाक्य के किस भाग में त्रुटि है?',
    ['Part (B) - "when"', 'Part (A) - "No sooner had"', 'Part (C) - "surrounded"', 'Part (D) - No error'], 0,
    '"No sooner" is followed by "than", not "when". Part (B) should use "than the quick reaction team".',
    '"No sooner" के साथ संयोजन में "than" का प्रयोग होता है, "when" का नहीं।'
  ),
  makeQ('eng_09', 'English & Hindi Language',
    'Select the correctly spelled word:',
    'सही वर्तनी वाले शब्द का चयन कीजिए:',
    ['Surveillance', 'Surveilance', 'Survalience', 'Surveillence'], 0,
    'The correct spelling is "Surveillance" (S-U-R-V-E-I-L-L-A-N-C-E).',
    'सही वर्तनी "Surveillance" (निगरानी) है।'
  ),
  makeQ('eng_10', 'English & Hindi Language',
    'Hindi Grammar: "सूर्योदय" शब्द का सही संधि-विच्छेद क्या होगा?',
    '"सूर्योदय" शब्द का सही संधि-विच्छेद चुनिए:',
    ['सूर्य + उदय (गुण संधि)', 'सूर्य + दय', 'सूर्यो + दय', 'सूर्या + उदय'], 0,
    'सूर्य + उदय = सूर्योदय (अ + उ = ओ, गुण स्वर संधि)।',
    'अ + उ मिलकर "ओ" बनाते हैं, जो गुण स्वर संधि का उदाहरण है।'
  ),
  makeQ('eng_11', 'English & Hindi Language',
    'Hindi Grammar: "जो सब कुछ जानता हो" - इस वाक्यांश के लिए एक उपयुक्त शब्द है:',
    '"जो सब कुछ जानता हो" के लिए एक शब्द:',
    ['सर्वज्ञ', 'अल्पज्ञ', 'विज्ञ', 'कृतज्ञ'], 0,
    'जो सब कुछ जानता हो उसे "सर्वज्ञ" कहते हैं।',
    'सर्वज्ञ = सब कुछ जानने वाला।'
  ),
  makeQ('eng_12', 'English & Hindi Language',
    'Hindi Grammar: "अंगूठा दिखाना" मुहावरे का सही अर्थ क्या है?',
    'मुहावरे "अंगूठा दिखाना" का सही अर्थ है:',
    ['ऐन वक्त पर मना कर देना या इनकार करना', 'जीत की घोषणा करना', 'अपमानित करना', 'शाबाशी देना'], 0,
    'अंगूठा दिखाना का अर्थ है समय पर धोखा देना या साफ मना कर देना।',
    'ऐन वक्त पर किसी काम से साफ इनकार कर देना।'
  ),
  makeQ('eng_13', 'English & Hindi Language',
    'Select the antonym of "AMBIGUOUS":',
    '"AMBIGUOUS" का विलोम शब्द क्या है?',
    ['Clear / Lucid', 'Obscure', 'Vague', 'Concealed'], 0,
    'Ambiguous means open to more than one interpretation; its antonym is Clear.',
    'Ambiguous (अस्पष्ट) का विलोम Clear (स्पष्ट) है।'
  ),
  makeQ('eng_14', 'English & Hindi Language',
    'Select the synonym of "INTREPID":',
    '"INTREPID" का पर्यायवाची क्या है?',
    ['Fearless', 'Timid', 'Anxious', 'Hesitant'], 0,
    'Intrepid means resolute, fearless, and dauntless.',
    'Intrepid का अर्थ निडर और साहसी (Fearless) होता है।'
  ),
  makeQ('eng_15', 'English & Hindi Language',
    'Hindi Grammar: निम्नलिखित में से शुद्ध वर्तनी वाले शब्द का चयन कीजिए:',
    'शुद्ध वर्तनी वाला शब्द चुनिए:',
    ['उज्ज्वल', 'उज्वल', 'उज्जवल', 'उजवल'], 0,
    'उत् + ज्वल = उज्ज्वल (दोनों \'ज\' आधे होते हैं)।',
    'शुद्ध वर्तनी "उज्ज्वल" है।'
  ),
  makeQ('eng_16', 'English & Hindi Language',
    'Change into indirect speech: The Inspector said to the cadets, "Do not touch the unexploded ordnance."',
    'अप्रत्यक्ष कथन (Indirect Speech) में बदलें:',
    ['The Inspector warned the cadets not to touch the unexploded ordnance.', 'The Inspector said to cadets that do not touch.', 'The Inspector told cadets not touch.', 'The Inspector ordered that no cadet touches.'], 0,
    'Imperative negative command "Do not touch" becomes "warned/ordered ... not to touch".',
    'नकारात्मक आदेश में "warned/ordered + object + not to + V1" बनता है।'
  ),
  makeQ('eng_17', 'English & Hindi Language',
    'What is the meaning of the idiom "Burn the midnight oil"?',
    'मुहावरे "Burn the midnight oil" का सही अर्थ क्या है?',
    ['To study or work hard late into the night', 'To waste ammunition', 'To light a camp bonfire', 'To cause destruction'], 0,
    'To burn the midnight oil means to read, study, or work late at night.',
    'देर रात तक कठिन परिश्रम या पढ़ाई करना।'
  ),
  makeQ('eng_18', 'English & Hindi Language',
    'Hindi Grammar: "नीलकंठ" में कौन-सा समास है?',
    '"नीलकंठ" (नीला है कंठ जिसका अर्थात् शिव) में कौन-सा समास है?',
    ['बहुव्रीहि समास', 'द्विगु समास', 'द्वन्द्व समास', 'तत्पुरुष समास'], 0,
    'जब दोनों पद मिलकर किसी तीसरे पद (भगवान शिव) की ओर संकेत करते हैं, तो बहुव्रीहि समास होता है।',
    'अन्य पद प्रधान होने के कारण यहाँ बहुव्रीहि समास है।'
  ),
  makeQ('eng_19', 'English & Hindi Language',
    'Fill in the blank with the appropriate modal verb:\n"A sentinel on duty _______ never abandon his post without proper relief."',
    'रिक्त स्थान भरिए: "A sentinel on duty _______ never abandon his post without proper relief."',
    ['must', 'may', 'could', 'might'], 0,
    '"Must" conveys mandatory statutory obligation under service regulations.',
    'वैधानिक अनिवार्यता दर्शाने के लिए "must" का प्रयोग होता है।'
  ),
  makeQ('eng_20', 'English & Hindi Language',
    'Hindi Grammar: "उत्कर्ष" शब्द का सही विलोम क्या होगा?',
    '"उत्कर्ष" का विलोम शब्द चुनिए:',
    ['अपकर्ष', 'पतन', 'अवनति', 'विनाश'], 0,
    'उत्कर्ष (उन्नति/प्रगति) का सटीक विलोम "अपकर्ष" होता है।',
    'उत्कर्ष का विलोम अपकर्ष है।'
  ),
  makeQ('eng_21', 'English & Hindi Language',
    'Choose the correct one-word substitution for: "A person with extensive tactical experience in a defense force"',
    'अनेक शब्दों के लिए एक शब्द: "लंबा अनुभव रखने वाला व्यक्ति"',
    ['Veteran', 'Novice', 'Amateur', 'Cadet'], 0,
    'A veteran is a person with long service or experience in an armed force or occupation.',
    'Veteran = अनुभवी व्यक्ति या पूर्व सैनिक।'
  ),
  makeQ('eng_22', 'English & Hindi Language',
    'Identify the error: "Each of the commandos have performed exceptionally well in the drill."',
    'वाक्य में त्रुटि पहचानिए:',
    ['"have performed" should be "has performed"', '"Each of" is incorrect', '"exceptionally" should be "exceptional"', 'No error'], 0,
    '"Each" is a singular distributive pronoun and requires a singular verb: "has performed".',
    '"Each" एकवचन सर्वनाम है, अतः इसके साथ "has performed" आएगा।'
  ),
  makeQ('eng_23', 'English & Hindi Language',
    'Hindi Grammar: "कान भरना" मुहावरे का सही अर्थ क्या है?',
    'मुहावरे "कान भरना" का अर्थ है:',
    ['चुगली करना या किसी के विरुद्ध भड़काना', 'कान साफ करना', 'ध्यानपूर्वक सुनना', 'दीक्षा देना'], 0,
    'कान भरना का अर्थ चुगली करना या किसी के मन में दुर्भावना पैदा करना है।',
    'किसी के विरुद्ध गुप्त रूप से भड़काना।'
  ),
  makeQ('eng_24', 'English & Hindi Language',
    'Select the antonym of "TRANSPARENT":',
    '"TRANSPARENT" का विलोम शब्द क्या है?',
    ['Opaque', 'Clear', 'Luminous', 'Pellucid'], 0,
    'Transparent means see-through; its opposite is Opaque.',
    'Transparent (पारदर्शी) का विलोम Opaque (अपारदर्शी) है।'
  ),
  makeQ('eng_25', 'English & Hindi Language',
    'Select the correct sentence:',
    'सही वाक्य का चयन कीजिए:',
    ['The superintendent congratulated the inspector on his gallantry.', 'The superintendent congratulated the inspector for his gallantry.', 'The superintendent congratulated to the inspector.', 'The superintendent congratulated with the inspector.'], 0,
    'The verb "congratulate" takes the preposition "on" (congratulate someone on something).',
    '"Congratulate" के साथ "on" प्रीपोजिशन आती है।'
  )
];

// =========================================================================
// SECTION 2: FORCE-SPECIFIC STATUTORY & GENERAL KNOWLEDGE POOLS
// =========================================================================

// Helper to make 25 distinct questions for a specific force
function getForceSection2Questions(force, mockNum) {
  const commonGK = [
    makeQ(`gk_com_01_m${mockNum}`, 'General Awareness & Professional Knowledge',
      'Under which Article of the Constitution of India is the Union mandated to protect every State against external aggression and internal disturbance?',
      'संविधान के किस अनुच्छेद के तहत केंद्र सरकार पर प्रत्येक राज्य को बाहरी आक्रमण और आंतरिक अशांति से बचाने का दायित्व है?',
      ['Article 355', 'Article 352', 'Article 356', 'Article 360'], 0,
      'Article 355 mandates the Union to protect States against external aggression and internal disturbance.',
      'अनुच्छेद 355 के तहत केंद्र का यह कर्तव्य है कि वह राज्यों की रक्षा करे।'
    ),
    makeQ(`gk_com_02_m${mockNum}`, 'General Awareness & Professional Knowledge',
      'Which apex committee headed by the Prime Minister serves as the highest decision-making authority for national defense and procurement?',
      'प्रधानमंत्री की अध्यक्षता वाली कौन-सी समिति राष्ट्रीय सुरक्षा और रक्षा बजट पर सर्वोच्च निर्णय लेती है?',
      ['Cabinet Committee on Security (CCS)', 'National Security Board', 'NITI Aayog', 'Defense Council'], 0,
      'The Cabinet Committee on Security (CCS) comprises PM, Home Minister, Defense Minister, Finance Minister, and External Affairs Minister.',
      'सुरक्षा मामलों की मंत्रिमंडलीय समिति (CCS) सर्वोच्च निर्णयकारी संस्था है।'
    ),
    makeQ(`gk_com_03_m${mockNum}`, 'General Awareness & Professional Knowledge',
      'Under Section 100 of the Indian Penal Code, private defense of the body extends to causing death when there is reasonable apprehension of:',
      'आईपीसी की धारा 100 के तहत शरीर की निजी प्रतिरक्षा में हमलावर की मृत्यु कब कारित की जा सकती है?',
      ['Death or grievous hurt', 'Simple theft without weapon', 'Trespass during daytime', 'Verbal insult'], 0,
      'Apprehension of death or grievous hurt justifies lethal self-defense under IPC 100.',
      'मृत्यु या गंभीर चोट की आशंका में मृत्यु कारित करने तक का अधिकार है।'
    ),
    makeQ(`gk_com_04_m${mockNum}`, 'General Awareness & Professional Knowledge',
      'Under Section 100 of the Code of Criminal Procedure (CrPC), what is mandatory when searching an enclosed premise?',
      'CrPC की धारा 100 के तहत किसी बंद स्थान की तलाशी के दौरान क्या अनिवार्य है?',
      ['Presence of two or more independent and respectable local witnesses (Panchas)', 'Search without any witnesses', 'Magistrate must personally search', 'Notice of 7 days'], 0,
      'CrPC Section 100(4) requires two independent and respectable witnesses of the locality.',
      'इलाके के दो या अधिक प्रतिष्ठित स्वतंत्र गवाहों की उपस्थिति अनिवार्य है।'
    ),
    makeQ(`gk_com_05_m${mockNum}`, 'General Awareness & Professional Knowledge',
      'Which gallantry award is India\'s highest peacetime military decoration awarded for valor and self-sacrifice away from the battlefield?',
      'शांतिकाल में अदम्य साहस और बलिदान के लिए दिया जाने वाला भारत का सर्वोच्च वीरता पुरस्कार कौन-सा है?',
      ['Ashoka Chakra', 'Param Vir Chakra', 'Kirti Chakra', 'Shaurya Chakra'], 0,
      'Ashoka Chakra is the highest peacetime gallantry award; Param Vir Chakra is the highest wartime award.',
      'अशोक चक्र शांतिकाल का सर्वोच्च वीरता पदक है।'
    ),
    makeQ(`gk_com_06_m${mockNum}`, 'General Awareness & Professional Knowledge',
      'Under which Ministry do all Central Armed Police Forces (CRPF, BSF, CISF, ITBP, SSB, Assam Rifles) administratively function?',
      'सभी केंद्रीय सशस्त्र पुलिस बल (CAPF) प्रशासनिक रूप से किस मंत्रालय के अधीन कार्य करते हैं?',
      ['Ministry of Home Affairs (MHA)', 'Ministry of Defense', 'Prime Minister\'s Office', 'Ministry of Law'], 0,
      'All CAPFs operate under the administrative control of the Ministry of Home Affairs (MHA), Government of India.',
      'सभी सीएपीएफ गृह मंत्रालय (MHA) के प्रशासनिक नियंत्रण में हैं।'
    ),
    makeQ(`gk_com_07_m${mockNum}`, 'General Awareness & Professional Knowledge',
      'Which fundamental right under the Indian Constitution cannot be suspended even during an emergency declared under Article 352?',
      'अनुच्छेद 352 के तहत राष्ट्रीय आपातकाल के दौरान भी कौन-से मौलिक अधिकार निलंबित नहीं किए जा सकते?',
      ['Articles 20 and 21 (Protection in respect of conviction & Right to Life)', 'Articles 14 and 19', 'Articles 25 and 28', 'Articles 32 and 226'], 0,
      'The 44th Amendment Act ensured Articles 20 and 21 cannot be suspended during emergencies.',
      '44वें संशोधन के बाद अनुच्छेद 20 और 21 को आपातकाल में भी निलंबित नहीं किया जा सकता।'
    ),
    makeQ(`gk_com_08_m${mockNum}`, 'General Awareness & Professional Knowledge',
      'What is the standard procedure for mob dispersal under CrPC Section 129 before ordering firing?',
      'CrPC धारा 129 के तहत गोलीबारी का आदेश देने से पूर्व भीड़ को तितर-बितर करने का निर्धारित क्रम क्या है?',
      ['Audible warning -> Water Cannon / Tear Smoke -> Lathi Charge -> Controlled firing below waist', 'Direct firing at crowd', 'Lathi charge followed by grenade', 'Tear smoke followed by automatic burst'], 0,
      'The statutory progression mandates audible warnings, non-lethal riot control methods, lathi charge, and controlled firing below waist only as last resort.',
      'चेतावनी, आंसू गैस/पानी की बौछार, लाठी चार्ज और अंत में कमर से नीचे नियंत्रित गोलीबारी।'
    ),
    makeQ(`gk_com_09_m${mockNum}`, 'General Awareness & Professional Knowledge',
      'Where is the Sardar Vallabhbhai Patel National Police Academy (SVPNPA) situated?',
      'सरदार वल्लभभाई पटेल राष्ट्रीय पुलिस अकादमी कहाँ स्थित है?',
      ['Hyderabad, Telangana', 'New Delhi', 'Dehradun, Uttarakhand', 'Nagpur, Maharashtra'], 0,
      'SVPNPA is located in Hyderabad, Telangana.',
      'एसवीपीएनपीए हैदराबाद में स्थित है।'
    ),
    makeQ(`gk_com_10_m${mockNum}`, 'General Awareness & Professional Knowledge',
      'Which schedule of the Indian Constitution contains the division of powers between the Union and the States (Union List, State List, Concurrent List)?',
      'संविधान की किस अनुसूची में केंद्र और राज्यों के बीच शक्तियों का विभाजन है?',
      ['7th Schedule', '8th Schedule', '6th Schedule', '9th Schedule'], 0,
      'The 7th Schedule contains Union, State, and Concurrent Lists.',
      '7वीं अनुसूची में संघ सूची, राज्य सूची और समवर्ती सूची दी गई है।'
    )
  ];

  // Specific force statutory questions (15 distinct statutory questions)
  let forceStatutory = [];

  if (force === 'CRPF') {
    forceStatutory = [
      makeQ(`crpf_stat_01_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Section 9 of the Central Reserve Police Force Act 1949, which offence is classified as a "More Heinous Offence"?',
        'सीआरपीएफ अधिनियम 1949 की धारा 9 के तहत कौन-सा अपराध "अति घोर अपराध" की श्रेणी में आता है?',
        ['Deserting or attempting to desert the Force on active duty', 'Sleeping on sentry beat in barracks', 'Absence without leave for 2 days', 'Disobeying a civil order off duty'], 0,
        'Desertion while on active duty is punishable with rigorous imprisonment up to 14 years or transportation for life under Sec 9(a).',
        'सक्रिय ड्यूटी पर भगोड़ा होना धारा 9(क) के तहत अति घोर अपराध है।'
      ),
      makeQ(`crpf_stat_02_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'According to Section 11 of the CRPF Act 1949, what is the maximum confinement to quarters that can be awarded as a minor punishment?',
        'सीआरपीएफ अधिनियम की धारा 11 के तहत क्वार्टर में निरुद्ध करने की अधिकतम लघु सजा क्या है?',
        ['28 days', '14 days', '7 days', '60 days'], 0,
        'Under Section 11(1)(b), confinement to quarters cannot exceed 28 days.',
        'धारा 11(1)(ख) के तहत अधिकतम 28 दिन की सजा दी जा सकती है।'
      ),
      makeQ(`crpf_stat_03_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'When was the Central Reserve Police Force originally raised as Crown Representative\'s Police?',
        'सीआरपीएफ की स्थापना क्राउन रिप्रेजेंटेटिव्स पुलिस के रूप में कब हुई थी?',
        ['27 July 1939 at Neemuch', '15 August 1947', '26 January 1950', '1 December 1965'], 0,
        'CRPF was raised on 27 July 1939 at Neemuch (MP).',
        '27 जुलाई 1939 को नीमच में इसकी स्थापना हुई थी।'
      ),
      makeQ(`crpf_stat_04_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Which specialized wing of the CRPF was raised in 1992 to handle communal riots and sensitive law and order situations?',
        'सांप्रदायिक दंगों से निपटने के लिए 1992 में सीआरपीएफ की किस विशेष शाखा का गठन किया गया था?',
        ['Rapid Action Force (RAF)', 'CoBRA', 'Special Action Group', 'Black Cat Wing'], 0,
        'The Rapid Action Force (RAF) was raised in October 1992 as a zero-response non-lethal riot control force.',
        'रैपिड एक्शन फोर्स (RAF) का गठन अक्टूबर 1992 में हुआ था।'
      ),
      makeQ(`crpf_stat_05_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What does CoBRA stand for in the tactical counter-guerrilla force of CRPF?',
        'सीआरपीएफ के विशेष नक्सल विरोधी बल CoBRA का पूर्ण रूप क्या है?',
        ['Commando Battalion for Resolute Action', 'Counter-insurgency Battalion for Reconnaissance Action', 'Combat Brigade for Rapid Attack', 'Central Battalion for Riot Action'], 0,
        'CoBRA stands for Commando Battalion for Resolute Action, trained for jungle warfare.',
        'CoBRA = Commando Battalion for Resolute Action।'
      ),
      makeQ(`crpf_stat_06_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Section 10 of the CRPF Act 1949, what is the maximum imprisonment for Less Heinous Offences?',
        'सीआरपीएफ अधिनियम की धारा 10 के तहत कम घोर अपराध के लिए अधिकतम कितने कारावास का प्रावधान है?',
        ['Up to 1 year', 'Up to 3 years', 'Up to 7 years', 'Up to 6 months'], 0,
        'Section 10 prescribes imprisonment for a term not exceeding 1 year.',
        'धारा 10 के तहत अधिकतम 1 वर्ष तक का कारावास हो सकता है।'
      ),
      makeQ(`crpf_stat_07_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What is celebrated as CRPF Valour Day (Shaurya Diwas) to commemorate the heroic stand at Sardar Post, Rann of Kutch in 1965?',
        '1965 में सरदार पोस्ट पर ऐतिहासिक शौर्य की स्मृति में सीआरपीएफ शौर्य दिवस कब मनाया जाता है?',
        ['9th April', '27th July', '21st October', '28th December'], 0,
        'On 9 April 1965, two CRPF companies repulsed a brigade attack by the Pakistan Army at Sardar Post.',
        '9 अप्रैल 1965 को सरदार पोस्ट की वीरता की याद में शौर्य दिवस मनाया जाता है।'
      ),
      makeQ(`crpf_stat_08_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What is the primary formation used by CoBRA platoons in dense jungle terrain to minimize directional IED casualties?',
        'घने जंगलों में आईईडी से बचाव के लिए कोबरा प्लाटून द्वारा कौन-सी संरचना अपनाई जाती है?',
        ['Tactical Staggered Column', 'Close Mass Square', 'Extended Broad Line', 'Tight Double File'], 0,
        'A tactical staggered column spreads troops along alternate flanks, offering dispersal and flanking firepower.',
        'टैक्टिकल स्टैगर्ड कॉलम दोनों ओर सुरक्षा और त्वरित गोलीबारी की सुविधा देता है।'
      ),
      makeQ(`crpf_stat_09_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Rule 27 of the CRPF Rules 1955, which authority is empowered to convene a General Security Force Court?',
        'सीआरपीएफ नियम 1955 के नियम 27 के तहत जनरल सिक्योरिटी फोर्स कोर्ट बुलाने का अधिकार किसके पास है?',
        ['Director General (DG) or authorized officer', 'Company Commander', 'Sub-Inspector', 'Station House Officer'], 0,
        'Only the Director General or officers empowered by Central Government warrant may convene a General Force Court.',
        'महानिदेशक या केंद्र सरकार द्वारा अधिकृत वरिष्ठ अधिकारी।'
      ),
      makeQ(`crpf_stat_10_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What is the effective firing range of the 5.56mm INSAS Assault Rifle widely deployed in CRPF infantry operations?',
        'सीआरपीएफ में प्रयुक्त 5.56 मिमी इंसास राइफल की प्रभावी मारक क्षमता क्या है?',
        ['400 meters', '200 meters', '800 meters', '1000 meters'], 0,
        'The effective point target range of 5.56mm INSAS rifle is 400 meters.',
        'इंसास राइफल की प्रभावी मारक सीमा 400 मीटर है।'
      ),
      makeQ(`crpf_stat_11_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Which day is observed as Police Commemoration Day across India in memory of 10 CRPF jawans martyred at Hot Springs, Ladakh in 1959?',
        '1959 में हॉट स्प्रिंग्स (लद्दाख) में शहीद 10 सीआरपीएफ जवानों की याद में पुलिस स्मृति दिवस कब मनाया जाता है?',
        ['21st October', '26th January', '15th August', '9th April'], 0,
        'On 21 October 1959, 10 CRPF jawans were martyred fighting Chinese troops at Hot Springs.',
        '21 अक्टूबर 1959 को हॉट स्प्रिंग्स में हुए बलिदान की याद में 21 अक्टूबर को पुलिस स्मृति दिवस मनाया जाता है।'
      ),
      makeQ(`crpf_stat_12_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'In riot control, what color flag is raised by CRPF commanders to signal an imminent order to disperse by force?',
        'दंगा नियंत्रण में बल प्रयोग से ठीक पहले चेतावनी देने के लिए किस रंग का ध्वज दिखाया जाता है?',
        ['Red Flag', 'White Flag', 'Green Flag', 'Yellow Flag'], 0,
        'The Red Flag warning indicates that the unlawful assembly has been ordered to disperse and force will be used.',
        'लाल झंडा दिखाकर अंतिम वैधानिक चेतावनी दी जाती है।'
      ),
      makeQ(`crpf_stat_13_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What is the weight of an empty 5.56mm INSAS rifle (without magazine and bayonet)?',
        'खाली 5.56 मिमी इंसास राइफल का वजन (मैगजीन के बिना) लगभग कितना होता है?',
        ['3.8 kg to 4.1 kg', '2.5 kg', '5.5 kg', '6.2 kg'], 0,
        'An empty 5.56mm INSAS rifle weighs approximately 3.8 to 4.15 kg.',
        'खाली इंसास राइफल का वजन लगभग 3.8 से 4.15 किग्रा होता है।'
      ),
      makeQ(`crpf_stat_14_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Section 7 of the CRPF Act 1949, all members of the Force are deemed to be on active duty when:',
        'सीआरपीएफ अधिनियम 1949 की धारा 7 के तहत बल के सभी सदस्य सक्रिय ड्यूटी पर कब माने जाते हैं?',
        ['Employed in operations against armed rebels or hostile tribes, or deployed beyond India', 'On sanctioned earned leave at home', 'Sleeping in civil township', 'Playing regimental sports'], 0,
        'Active duty applies when attached to a force acting against mutineers, rebels, enemies, or when specifically notified.',
        'सशस्त्र विद्रोहियों या सीमा पार अभियानों में संलग्न होने पर।'
      ),
      makeQ(`crpf_stat_15_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What is the motto of the Central Reserve Police Force (CRPF)?',
        'केंद्रीय रिजर्व पुलिस बल का आदर्श वाक्य (Motto) क्या है?',
        ['Service and Loyalty (सेवा और निष्ठा)', 'Protection and Security (संरक्षण और सुरक्षा)', 'Duty Unto Death (जीवन पर्यन्त कर्तव्य)', 'Valour and Wisdom (वीरता और विवेक)'], 0,
        'The official motto of CRPF is "Service and Loyalty" (सेवा और निष्ठा).',
        'सीआरपीएफ का आदर्श वाक्य "सेवा और निष्ठा" है।'
      )
    ];
  } else if (force === 'CISF') {
    forceStatutory = [
      makeQ(`cisf_stat_01_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Section 11 of the Central Industrial Security Force Act 1968, a member of the Force may arrest without warrant any person who:',
        'सीआईएसएफ अधिनियम 1968 की धारा 11 के तहत बल का सदस्य बिना वारंट किसे गिरफ्तार कर सकता है?',
        ['Commits or attempts to commit a cognizable offence involving danger to undertaking property or personnel', 'Fails to wear uniform off duty', 'Arrives late for lunch in canteen', 'Refuses to salute off duty'], 0,
        'Section 11 grants warrantless arrest powers for cognizable offences against industrial assets.',
        'प्रतिष्ठान की संपत्ति या कर्मियों पर संज्ञेय अपराध करने वालों को बिना वारंट गिरफ्तार करने का अधिकार है।'
      ),
      makeQ(`cisf_stat_02_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Section 12 of the CISF Act 1968, whenever an officer makes a search of a person without a warrant, he must forward a report to:',
        'सीआईएसएफ अधिनियम की धारा 12 के तहत बिना वारंट तलाशी लेने पर रिपोर्ट किसे भेजना अनिवार्य है?',
        ['The nearest Police Station in-charge having territorial jurisdiction', 'District Court directly', 'Central Ministry', 'Managing Director only'], 0,
        'Section 12(2) requires reporting forthwith to the officer-in-charge of the nearest police station.',
        'निकटतम पुलिस स्टेशन के थाना प्रभारी को तत्काल रिपोर्ट सौंपनी होती है।'
      ),
      makeQ(`cisf_stat_03_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Rule 34 of the CISF Rules 2001, which of the following is classified as a "Major Penalty"?',
        'सीआईएसएफ नियम 2001 के नियम 34 के तहत कौन-सा "बड़ा दंड (Major Penalty)" है?',
        ['Compulsory retirement, removal, or dismissal from service', 'Censure', 'Withholding increment without cumulative effect for 6 months', 'Fine up to 7 days pay'], 0,
        'Major penalties include dismissal, removal, compulsory retirement, and rank reduction.',
        'अनिवार्य सेवानिवृत्ति, सेवा से हटाया जाना या बर्खास्तगी दीर्घ दंड हैं।'
      ),
      makeQ(`cisf_stat_04_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What apex civil aviation regulatory body in India issues the security directives implemented by CISF Airport Security Groups (ASG)?',
        'हवाई अड्डा सुरक्षा में सीआईएसएफ द्वारा लागू किए जाने वाले सुरक्षा दिशानिर्देश कौन-सी संस्था जारी करती है?',
        ['Bureau of Civil Aviation Security (BCAS)', 'DGCA', 'Airports Authority of India only', 'IATA'], 0,
        'BCAS (Bureau of Civil Aviation Security) is the national regulatory authority for civil aviation security.',
        'नागरिक उड्डयन सुरक्षा ब्यूरो (BCAS) सुरक्षा मानक तय करता है।'
      ),
      makeQ(`cisf_stat_05_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'In airport security screening, what is the full form of CTX technology used in Level-3 baggage inspection?',
        'हवाई अड्डा जांच में प्रयुक्त CTX का पूर्ण रूप क्या है?',
        ['Computed Tomography X-ray', 'Continuous Trace Xenon', 'Critical Threat X-ray', 'Central Terminal Xenon'], 0,
        'Computed Tomography X-ray (CTX) creates 3D cross-sectional density images of baggage.',
        'CTX = Computed Tomography X-ray।'
      ),
      makeQ(`cisf_stat_06_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What does PIDS stand for in high-security critical infrastructure perimeter defense managed by CISF?',
        'सीआईएसएफ द्वारा तैनात महत्वपूर्ण प्रतिष्ठानों में PIDS का पूर्ण रूप क्या है?',
        ['Perimeter Intrusion Detection System', 'Public Industrial Defense Standard', 'Paramilitary Internal Data System', 'Passive Infrared Detection Standard'], 0,
        'PIDS stands for Perimeter Intrusion Detection System.',
        'PIDS = Perimeter Intrusion Detection System (परिधि घुसपैठ पहचान प्रणाली)।'
      ),
      makeQ(`cisf_stat_07_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'In which year was the Central Industrial Security Force established by an Act of Parliament?',
        'सीआईएसएफ की स्थापना संसद के एक अधिनियम द्वारा किस वर्ष की गई थी?',
        ['10 March 1969', '1 December 1965', '24 October 1962', '15 August 1947'], 0,
        'CISF was raised on 10 March 1969 with three battalions.',
        '10 मार्च 1969 को सीआईएसएफ की स्थापना हुई थी।'
      ),
      makeQ(`cisf_stat_08_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Where is the National Industrial Security Academy (NISA), the premier training institution for CISF officers, located?',
        'सीआईएसएफ का प्रमुख प्रशिक्षण संस्थान राष्ट्रीय औद्योगिक सुरक्षा अकादमी (NISA) कहाँ स्थित है?',
        ['Hakimpet, Hyderabad', 'Tekanpur, Gwalior', 'Dehradun', 'Neemuch'], 0,
        'NISA is located at Hakimpet, Hyderabad.',
        'एनआईएसए हाकिमपेट, हैदराबाद में स्थित है।'
      ),
      makeQ(`cisf_stat_09_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What is the motto of the Central Industrial Security Force (CISF)?',
        'केंद्रीय औद्योगिक सुरक्षा बल का आदर्श वाक्य क्या है?',
        ['Protection and Security (संरक्षण एवं सुरक्षा)', 'Service and Loyalty', 'Duty Unto Death', 'Valour and Wisdom'], 0,
        'The motto of CISF is "Protection and Security" (संरक्षण एवं सुरक्षा).',
        'सीआईएसएफ का आदर्श वाक्य "संरक्षण एवं सुरक्षा" है।'
      ),
      makeQ(`cisf_stat_10_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Section 13 of the CISF Act 1968, how soon must a person arrested without a warrant be taken to the police officer?',
        'धारा 13 के तहत बिना वारंट गिरफ्तार व्यक्ति को कितने समय में पुलिस अधिकारी के समक्ष प्रस्तुत किया जाना चाहिए?',
        ['Without unnecessary delay (forthwith)', 'Within 7 days', 'Within 48 hours without reporting', 'Only after obtaining court sanction'], 0,
        'Section 13 mandates that the arrested person must be taken to the nearest police officer without unnecessary delay.',
        'बिना किसी अनावश्यक देरी के तुरंत निकटतम पुलिस स्टेशन को सौंपा जाना चाहिए।'
      ),
      makeQ(`cisf_stat_11_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Which specialized wing of CISF is deployed for disaster response and fire fighting in major PSUs, refineries, and steel plants?',
        'रिफाइनरियों और इस्पात संयंत्रों में आग और आपदा से निपटने के लिए सीआईएसएफ की कौन-सी विंग तैनात है?',
        ['CISF Fire Service Wing', 'Aviation Wing', 'Port Flotilla', 'Airborne Wing'], 0,
        'The CISF Fire Wing is the largest dedicated industrial fire-fighting force in India.',
        'सीआईएसएफ फायर विंग सबसे बड़ी पेशेवर औद्योगिक अग्निशमन सेवा है।'
      ),
      makeQ(`cisf_stat_12_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Rule 36 of the CISF Rules 2001, what inquiry procedure is required before imposing a major penalty?',
        'सीआईएसएफ नियम 2001 के नियम 36 के तहत बड़ा दंड देने से पहले कौन-सी प्रक्रिया अनिवार्य है?',
        ['Formal charge-sheet, appointment of Inquiry Officer, and opportunity to inspect evidence', 'Oral warning by Sub-Inspector', 'Deduction of canteen tokens', 'Summary dismissal without notice'], 0,
        'Rule 36 prescribes formal departmental inquiry conforming to natural justice principles.',
        'नियम 36 के तहत औपचारिक आरोप पत्र और निष्पक्ष विभागीय जांच अनिवार्य है।'
      ),
      makeQ(`cisf_stat_13_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What international maritime security code is implemented by CISF in Indian major sea ports?',
        'भारतीय प्रमुख बंदरगाहों में सीआईएसएफ द्वारा कौन-सा अंतरराष्ट्रीय समुद्री सुरक्षा कोड लागू किया जाता है?',
        ['ISPS Code (International Ship and Port Facility Security Code)', 'UNCLOS Only', 'MARPOL Code', 'SOLAS Part 1 only'], 0,
        'CISF enforces the ISPS Code under IMO standards at major sea ports.',
        'ISPS कोड (अंतर्राष्ट्रीय जहाज और बंदरगाह सुविधा सुरक्षा कोड)।'
      ),
      makeQ(`cisf_stat_14_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Which mass rapid transit system was first entrusted to CISF for anti-sabotage and passenger security in 2007?',
        '2007 में किस मेट्रो प्रणाली की संपूर्ण सुरक्षा सीआईएसएफ को सौंपी गई थी?',
        ['Delhi Metro Rail Corporation (DMRC)', 'Kolkata Metro', 'Mumbai Metro', 'Bangalore Namma Metro'], 0,
        'CISF assumed total security charge of Delhi Metro in 2007.',
        'दिल्ली मेट्रो (DMRC) की सुरक्षा 2007 में सीआईएसएफ को सौंपी गई थी।'
      ),
      makeQ(`cisf_stat_15_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Section 18 of the CISF Act 1968, members of the Force are barred from forming or joining any:',
        'सीआईएसएफ अधिनियम की धारा 18 के तहत बल के सदस्यों को किसमें शामिल होने की मनाही है?',
        ['Trade Union or political association without Central Government sanction', 'Regimental sports club', 'Officer mess', 'Provident fund scheme'], 0,
        'Section 18 prohibits membership in political/trade unions to preserve force discipline.',
        'बिना अनुमति ट्रेड यूनियन या राजनीतिक दल में शामिल होने पर पूर्ण प्रतिबंध है।'
      )
    ];
  } else if (force === 'BSF') {
    forceStatutory = [
      makeQ(`bsf_stat_01_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Section 14 of the Border Security Force Act 1968, what offense is committed by a person who shamefully abandons a post committed to his charge?',
        'बीएसएफ अधिनियम 1968 की धारा 14 के तहत शत्रु के समक्ष पद छोड़ना किस श्रेणी का अपराध है?',
        ['Offence in relation to the enemy punishable with death or life imprisonment', 'Minor discipline neglect', 'Civil fine only', 'Departmental warning'], 0,
        'Section 14(a) prescribes death or life imprisonment for abandoning a post to the enemy.',
        'धारा 14(क) के तहत मृत्युदंड अथवा आजीवन कारावास का प्रावधान है।'
      ),
      makeQ(`bsf_stat_02_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Section 64 of the BSF Act 1968, which of the following is NOT a court recognized for trying offences?',
        'बीएसएफ अधिनियम की धारा 64 के तहत कौन-सी सुरक्षा अदालत मान्य नहीं है?',
        ['Panchayat Nyayalaya', 'General Security Force Court (GSFC)', 'Petty Security Force Court (PSFC)', 'Summary Security Force Court (SSFC)'], 0,
        'The Act recognizes GSFC, PSFC, and SSFC only.',
        'केवल जीएसएफसी, पीएसएफसी और एसएसएफसी मान्य हैं।'
      ),
      makeQ(`bsf_stat_03_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'When was the Border Security Force (BSF) raised in the aftermath of the 1965 Indo-Pak War?',
        '1965 के भारत-पाक युद्ध के बाद सीमा सुरक्षा बल (BSF) की स्थापना किस दिन हुई थी?',
        ['1st December 1965', '15th August 1947', '26th January 1950', '24th October 1962'], 0,
        'BSF was raised on 1 December 1965 under founding DG K. F. Rustamji.',
        '1 दिसंबर 1965 को के. एफ. रुस्तमजी के नेतृत्व में बीएसएफ का गठन हुआ था।'
      ),
      makeQ(`bsf_stat_04_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What does HHTI stand for in BSF modern night surveillance gear deployed on the Line of Control and IB?',
        'सीमा पर प्रयुक्त रात्रि निगरानी उपकरण HHTI का पूर्ण रूप क्या है?',
        ['Hand Held Thermal Imager', 'Heavy Hazard Tactical Indicator', 'High Heat Target Interceptor', 'High Hazard Tracking Instrument'], 0,
        'HHTI stands for Hand Held Thermal Imager.',
        'HHTI = Hand Held Thermal Imager (हैंड हेल्ड थर्मल इमेजर)।'
      ),
      makeQ(`bsf_stat_05_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Which specialized water-wing crafts are utilized by BSF to patrol the tidal creeks and mudflats of Sir Creek?',
        'सर क्रीक के दलदली क्षेत्रों में गश्त के लिए बीएसएफ द्वारा किसका उपयोग किया जाता है?',
        ['Air Cushion Vehicles (Hovercrafts) & Fast Attack Boats', 'Submarines', 'Aircraft Carriers', 'Wooden Oar Boats'], 0,
        'Hovercrafts skim over marshy mudflats and shallow tidal waters in Sir Creek.',
        'होवरक्राफ्ट (Air Cushion Vehicles) दलदली भूमि और उथले पानी पर चलते हैं।'
      ),
      makeQ(`bsf_stat_06_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What is the official motto of the Border Security Force (BSF)?',
        'सीमा सुरक्षा बल का आधिकारिक आदर्श वाक्य क्या है?',
        ['Duty Unto Death (जीवन पर्यन्त कर्तव्य)', 'Service and Loyalty', 'Protection and Security', 'Valour and Wisdom'], 0,
        'The motto of BSF is "Duty Unto Death" (जीवन पर्यन्त कर्तव्य).',
        'बीएसएफ का आदर्श वाक्य "जीवन पर्यन्त कर्तव्य" है।'
      ),
      makeQ(`bsf_stat_07_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Where is the BSF Central Academy and National Training Center for Dogs (NTCD) located?',
        'बीएसएफ अकादमी और श्वान प्रशिक्षण केंद्र (NTCD) कहाँ स्थित है?',
        ['Tekanpur, Gwalior (MP)', 'Neemuch', 'Dehradun', 'Hakimpet'], 0,
        'BSF Academy Tekanpur is situated near Gwalior, Madhya Pradesh.',
        'बीएसएफ अकादमी टेकनपुर, ग्वालियर (मध्य प्रदेश) में स्थित है।'
      ),
      makeQ(`bsf_stat_08_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Section 19 of the BSF Act 1968, what is the maximum punishment for deserting the Force while NOT on active duty?',
        'सक्रिय ड्यूटी पर न होने पर बल से भगोड़ा होने पर धारा 19 के तहत अधिकतम सजा क्या है?',
        ['Imprisonment up to 3 years', 'Imprisonment up to 14 years', 'Death penalty', 'Fine only'], 0,
        'Desertion not on active duty carries imprisonment up to 3 years under Section 19(b).',
        'सक्रिय ड्यूटी पर न होने पर 3 वर्ष तक का कारावास हो सकता है।'
      ),
      makeQ(`bsf_stat_09_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What is the primary operational width of jurisdiction granted to BSF under Section 139 of the BSF Act in bordering states?',
        'सीमावर्ती राज्यों में धारा 139 के तहत बीएसएफ को सीमा से कितने किलोमीटर अंदर तक तलाशी और जब्ती के अधिकार प्राप्त हैं?',
        ['Up to 50 km in border areas of Punjab, West Bengal, Assam, Gujarat, Rajasthan', '5 km only', '100 km uniformly', 'Entire state territory'], 0,
        'The MHA notification standardized jurisdiction up to 50 km inside the International Border.',
        'अंतरराष्ट्रीय सीमा से 50 किमी के दायरे तक।'
      ),
      makeQ(`bsf_stat_10_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Which international borders are officially guarded by the Border Security Force?',
        'सीमा सुरक्षा बल किन अंतरराष्ट्रीय सीमाओं की सुरक्षा करता है?',
        ['Indo-Pakistan and Indo-Bangladesh Borders', 'Indo-China Border only', 'Indo-Myanmar only', 'Indo-Nepal only'], 0,
        'BSF guards the 3,323 km Indo-Pak border and 4,096 km Indo-Bangladesh border.',
        'भारत-पाकिस्तान और भारत-बांग्लादेश सीमाएं।'
      ),
      makeQ(`bsf_stat_11_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What specialized detection method does BSF deploy along the Jammu and Punjab IB to detect cross-border infiltration tunnels?',
        'जम्मू और पंजाब सीमा पर सीमा पार सुरंगों का पता लगाने के लिए बीएसएफ क्या तकनीक अपनाती है?',
        ['Ground Penetrating Radar (GPR) and Anti-Tunneling Drills', 'Thermal Imaging only', 'Handheld Metal Detector only', 'Acoustic Buoys only'], 0,
        'GPR (Ground Penetrating Radar) and manual anti-tunneling probe shafts detect underground tunnels.',
        'ग्राउंड पेनिट्रेटिंग रडार (GPR) और सुरंग-रोधी अभियान।'
      ),
      makeQ(`bsf_stat_12_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Section 53 of the BSF Act 1968, who may award minor punishments to non-commissioned officers and constables?',
        'बीएसएफ अधिनियम की धारा 53 के तहत लघु दंड देने का अधिकार किसे प्राप्त है?',
        ['The Commandant of the Battalion', 'Sub-Inspector', 'Civil Magistrate', 'Police Sub-Inspector'], 0,
        'The Commandant or designated disciplinary authority awards minor punishments under Section 53.',
        'बटालियन के कमांडेंट को लघु दंड देने का अधिकार है।'
      ),
      makeQ(`bsf_stat_13_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What is the traditional animal mount mounted by BSF for patrolling the Thar Desert of Rajasthan?',
        'राजस्थान के थार मरुस्थल में गश्त के लिए बीएसएफ की कौन-सी शाखा ऊंटों का संचालन करती है?',
        ['BSF Camel Contingent (Ganga Risala heritage)', 'Horse Cavalry only', 'Mule Platoon only', 'Elephant Guard'], 0,
        'The BSF Camel Wing operates heavily armed camel patrols in deep desert sands.',
        'बीएसएफ ऊंट दस्ता (Camel Contingent) थार मरुस्थल में गश्त करता है।'
      ),
      makeQ(`bsf_stat_14_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What is the daily ceremonial closing of the Indo-Pak border conducted jointly by BSF and Pakistan Rangers at Wagah/Attari called?',
        'वाघा/अटारी सीमा पर बीएसएफ द्वारा प्रतिदिन किए जाने वाले समारोह को क्या कहा जाता है?',
        ['Beating Retreat Ceremony', 'Passing Out Parade', 'Flag Hoisting Parade', 'Border Salute'], 0,
        'The joint drill is known as the Beating Retreat Ceremony at Attari-Wagah.',
        'बीटिंग रिट्रीट समारोह (Beating Retreat Ceremony)।'
      ),
      makeQ(`bsf_stat_15_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What weapon calibre is standard in the BSF Medium Machine Gun (MMG) section deployed in BOP defense?',
        'बीओपी सुरक्षा में तैनात मध्यम मशीन गन (MMG) का मानक कैलिबर क्या है?',
        ['7.62 x 51 mm NATO', '5.56 mm', '9 mm', '12.7 mm only'], 0,
        'The standard 7.62mm MAG/PKM Medium Machine Gun is the backbone of BOP defense.',
        '7.62 x 51 मिमी कैलिबर।'
      )
    ];
  } else if (force === 'ITBP') {
    forceStatutory = [
      makeQ(`itbp_stat_01_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Section 4 of the Indo-Tibetan Border Police Force Act 1992, general superintendence and direction of the Force is vested in:',
        'आईटीबीपी अधिनियम 1992 की धारा 4 के तहत बल का सामान्य अधीक्षण और निर्देशन किसमें निहित है?',
        ['The Central Government', 'The Governor of Ladakh', 'The Chief of Army Staff', 'The Supreme Court'], 0,
        'Section 4 vests general superintendence and direction in the Central Government.',
        'केंद्र सरकार (गृह मंत्रालय) में निहित है।'
      ),
      makeQ(`itbp_stat_02_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Which life-threatening altitude condition is characterized by pulmonary fluid accumulation above 9,000 feet?',
        '9,000 फीट से अधिक ऊंचाई पर फेफड़ों में पानी भरने वाली जानलेवा बीमारी क्या है?',
        ['High Altitude Pulmonary Edema (HAPE)', 'Heat Stroke', 'Chilblains', 'Trench Foot'], 0,
        'HAPE is treated by immediate descent and oxygen administration.',
        'HAPE (हाई एल्टीट्यूड पल्मोनरी एडिमा) का मुख्य उपचार तुरंत नीचे उतरना है।'
      ),
      makeQ(`itbp_stat_03_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under the 1996 Confidence Building Measures agreement along the LAC, what restriction applies to firearms during face-offs?',
        '1996 के समझौते के तहत एलएसी पर आमने-सामने होने पर आग्नेयास्त्रों के प्रयोग पर क्या रोक है?',
        ['Neither side shall open fire within 2 km of the LAC', 'Firing is mandatory on every patrol', 'Artillery allowed freely', 'No restriction'], 0,
        'Article VI of the 1996 agreement bans firing within 2 km of the LAC.',
        'एलएसी के 2 किमी के दायरे में गोलीबारी पर पूर्ण प्रतिबंध है।'
      ),
      makeQ(`itbp_stat_04_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What essential gear is used by ITBP roped teams to arrest a slip down an icy slope?',
        'बर्फ पर फिसलने से बचने के लिए आईटीबीपी जवान किस उपकरण का प्रयोग करते हैं?',
        ['Ice Axe and Crampons', 'Wooden stick', 'Sand bag', 'Rubber boots'], 0,
        'An Ice Axe and Crampons allow climbers to arrest falls on hard ice.',
        'आइस एक्स (Ice Axe) और क्रैम्पन (Crampons)।'
      ),
      makeQ(`itbp_stat_05_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'When was the Indo-Tibetan Border Police (ITBP) raised in the backdrop of the Sino-Indian conflict?',
        'भारत-चीन युद्ध की पृष्ठभूमि में आईटीबीपी की स्थापना कब हुई थी?',
        ['24th October 1962', '15th August 1947', '26th January 1950', '1st December 1965'], 0,
        'ITBP was raised on 24 October 1962.',
        '24 अक्टूबर 1962 को आईटीबीपी की स्थापना हुई थी।'
      ),
      makeQ(`itbp_stat_06_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What is the official motto of the Indo-Tibetan Border Police (ITBP)?',
        'भारत-तिब्बत सीमा पुलिस का आधिकारिक आदर्श वाक्य क्या है?',
        ['Shaurya, Dridhata, Karm Nishtha (शौर्य, दृढ़ता, कर्म निष्ठा)', 'Service and Loyalty', 'Duty Unto Death', 'Protection and Security'], 0,
        'The motto of ITBP is "Shaurya, Dridhata, Karm Nishtha" (Valour, Determination, Devotion to Duty).',
        'आईटीबीपी का आदर्श वाक्य "शौर्य, दृढ़ता, कर्म निष्ठा" है।'
      ),
      makeQ(`itbp_stat_07_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What are the personnel of the Indo-Tibetan Border Police affectionately and popularly called?',
        'आईटीबीपी के जवानों को लोकप्रिय रूप से किस नाम से जाना जाता है?',
        ['Himveers (हिमवीर)', 'Border Sentinels', 'Black Cats', 'Desert Hawks'], 0,
        'ITBP personnel guarding Himalayan heights are known as Himveers.',
        'हिमालय की चोटियों की रक्षा करने वाले जवानों को हिमवीर कहा जाता है।'
      ),
      makeQ(`itbp_stat_08_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Where is the High Altitude Mountaineering and Skiing Institute (M&SI) of ITBP situated?',
        'आईटीबीपी का पर्वतारोहण और स्कीइंग संस्थान (M&SI) कहाँ स्थित है?',
        ['Auli, Uttarakhand', 'Neemuch', 'Tekanpur', 'Hakimpet'], 0,
        'M&SI Auli (Joshimath, Uttarakhand) trains troops in extreme high-altitude warfare.',
        'औली (जोशीमठ, उत्तराखंड) में स्थित है।'
      ),
      makeQ(`itbp_stat_09_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What total length of the India-China border (LAC) is guarded by ITBP from Karakoram Pass to Jachep La?',
        'काराकोरम दर्रे से जाचेप ला तक आईटीबीपी द्वारा कितने किमी लंबी भारत-चीन सीमा की सुरक्षा की जाती है?',
        ['3,488 km', '1,500 km', '4,096 km', '2,200 km'], 0,
        'ITBP guards the 3,488 km border across Ladakh, HP, Uttarakhand, Sikkim, and Arunachal Pradesh.',
        '3,488 किमी लंबी सीमा।'
      ),
      makeQ(`itbp_stat_10_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Section 16 of the ITBP Act 1992, mutiny in the Force is punishable with:',
        'आईटीबीपी अधिनियम की धारा 16 के तहत विद्रोह करने पर क्या सजा है?',
        ['Death or life imprisonment', '7 days detention', 'Fine of ₹500', 'Loss of 1 leave'], 0,
        'Section 16 punishes mutiny with death or such less punishment as in the Act mentioned.',
        'मृत्युदंड अथवा आजीवन कारावास।'
      ),
      makeQ(`itbp_stat_11_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What is High Altitude Cerebral Edema (HACE)?',
        'हाई एल्टीट्यूड सेरेब्रल एडिमा (HACE) क्या है?',
        ['Severe brain swelling due to low oxygen at extreme altitude', 'A skin burn from snow reflection', 'Stomach infection from frozen water', 'Joint pain from cold'], 0,
        'HACE is severe brain swelling caused by fluid leakage across the blood-brain barrier.',
        'अत्यधिक ऊंचाई पर ऑक्सीजन की कमी से मस्तिष्क में सूजन आना।'
      ),
      makeQ(`itbp_stat_12_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What is the standard duration of Stage-I acclimatization for troops moving to an altitude between 9,000 to 12,000 feet?',
        '9,000 से 12,000 फीट की ऊंचाई के लिए स्टेज-1 अनुकूलन (Acclimatization) की अवधि क्या है?',
        ['6 days (Day 1-2 rest, Day 3-4 light walk, Day 5-6 climb and return)', '1 hour', '30 days', 'No acclimatization needed'], 0,
        'Stage 1 requires 6 days of progressive acclimatization before further ascent.',
        'न्यूनतम 6 दिन का चरणबद्ध अनुकूलन।'
      ),
      makeQ(`itbp_stat_13_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Which annual pilgrimage to Mount Kailash and Mansarovar Lake via Lipulekh Pass is escorted by ITBP?',
        'लिपुलेख दर्रे से होकर जाने वाली किस वार्षिक तीर्थयात्रा की सुरक्षा और प्रबंधन आईटीबीपी करती है?',
        ['Kailash Mansarovar Yatra', 'Amarnath Yatra only', 'Vaishno Devi Yatra', 'Char Dham Yatra only'], 0,
        'ITBP provides medical aid, route security, and logistics for Kailash Mansarovar pilgrims.',
        'कैलाश मानसरोवर यात्रा।'
      ),
      makeQ(`itbp_stat_14_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What communication technology is essential for ITBP posts isolated by winter snow for 6 months?',
        'सर्दियों में 6 महीने तक कटे रहने वाले आईटीबीपी पोस्टों के लिए कौन-सी संचार तकनीक अनिवार्य है?',
        ['Satellite Phones (GSAT / Inmarsat) and VHF links', 'Landline copper wire only', 'Civil 2G cellular only', 'Postal pigeon service'], 0,
        'High-altitude remote outposts rely on satellite telephony and troposcatter links.',
        'उपग्रह फोन और वीएचएफ रेडियो लिंक।'
      ),
      makeQ(`itbp_stat_15_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Section 56 of the ITBP Act 1992, what court possesses the power to try any person subject to this Act for any offence?',
        'धारा 56 के तहत किसी भी अपराध के विचारण की शक्ति किस न्यायालय को है?',
        ['General Security Force Court (GSFC)', 'Local Panchayat', 'Civil Tahsil Court', 'Labour Tribunal'], 0,
        'GSFC has plenary jurisdiction to try any offence under the ITBP Act.',
        'जनरल सिक्योरिटी फोर्स कोर्ट (GSFC)।'
      )
    ];
  } else if (force === 'SSB') {
    forceStatutory = [
      makeQ(`ssb_stat_01_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Section 15 of the Sashastra Seema Bal Act 2007, what offence carries the death penalty?',
        'सशस्त्र सीमा बल अधिनियम 2007 की धारा 15 के तहत किस अपराध पर मृत्युदंड दिया जा सकता है?',
        ['Mutiny or inciting mutiny in the Force', 'Absence without leave for 3 days', 'Sleeping in barrack off duty', 'Late arrival on drill'], 0,
        'Section 15 prescribes death or life imprisonment for mutiny.',
        'विद्रोह (Mutiny) करने या भड़काने पर मृत्युदंड का प्रावधान है।'
      ),
      makeQ(`ssb_stat_02_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Which two international open friendly borders are mandated to be secured by Sashastra Seema Bal (SSB)?',
        'सशस्त्र सीमा बल किन दो अंतरराष्ट्रीय मित्र सीमाओं की सुरक्षा करता है?',
        ['Indo-Nepal and Indo-Bhutan Borders', 'Indo-Pakistan and Indo-China', 'Indo-Myanmar only', 'Coastal waters'], 0,
        'SSB guards the 1,751 km Indo-Nepal border and 699 km Indo-Bhutan border.',
        'भारत-नेपाल और भारत-भूटान सीमाएं।'
      ),
      makeQ(`ssb_stat_03_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What is the primary objective of SSB\'s Civic Action Programme (CAP) on open borders?',
        'खुली सीमाओं पर एसएसबी के नागरिक क्रियाकलाप कार्यक्रम (CAP) का मुख्य उद्देश्य क्या है?',
        ['Building community trust and generating reliable human intelligence (HUMINT)', 'Operating commercial retail stores', 'Collecting toll taxes', 'Paving state highways'], 0,
        'CAP builds goodwill and human intelligence networks among the border population.',
        'सामुदायिक विश्वास जीतकर मानव गुप्तचर तंत्र (HUMINT) स्थापित करना।'
      ),
      makeQ(`ssb_stat_04_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under which Acts are SSB personnel empowered to seize contraband and apprehend offenders on the Indo-Nepal border?',
        'एसएसबी को सीमा पर जब्ती और गिरफ्तारी के अधिकार किन अधिनियमों के तहत प्राप्त हैं?',
        ['Customs Act 1962, NDPS Act 1985, Arms Act 1959, and Wildlife Protection Act 1972', 'Motor Vehicles Act only', 'Income Tax Act only', 'Companies Act'], 0,
        'SSB exercises statutory search and seizure powers under Customs, NDPS, Arms, and Wildlife Acts.',
        'कस्टम, एनडीपीएस, आर्म्स और वन्यजीव संरक्षण अधिनियमों के तहत।'
      ),
      makeQ(`ssb_stat_05_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What is the official motto of the Sashastra Seema Bal (SSB)?',
        'सशस्त्र सीमा बल (SSB) का आधिकारिक आदर्श वाक्य क्या है?',
        ['Service, Security and Brotherhood (सेवा, सुरक्षा और बन्धुत्व)', 'Service and Loyalty', 'Duty Unto Death', 'Valour and Wisdom'], 0,
        'The motto of SSB is "Service, Security and Brotherhood" (सेवा, सुरक्षा और बन्धुत्व).',
        'एसएसबी का आदर्श वाक्य "सेवा, सुरक्षा और बन्धुत्व" है।'
      ),
      makeQ(`ssb_stat_06_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'In which year was the Special Service Bureau originally established in the aftermath of the 1962 Sino-Indian War?',
        'विशेष सेवा ब्यूरो (Special Service Bureau) की स्थापना मूल रूप से किस वर्ष हुई थी?',
        ['May 1963', 'December 1965', 'August 1947', 'October 1971'], 0,
        'SSB was raised in May 1963 to inculcate national security awareness among border populations.',
        'मई 1963 में सीमावर्ती आबादी में सुरक्षा जागरूकता पैदा करने के लिए स्थापना हुई थी।'
      ),
      makeQ(`ssb_stat_07_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'When was the Special Service Bureau renamed as "Sashastra Seema Bal" and transformed into an armed border guarding force?',
        'विशेष सेवा ब्यूरो का नाम बदलकर "सशस्त्र सीमा बल" कब किया गया?',
        ['2001 (notified by MHA after Kargil Review Committee)', '1965', '1950', '2014'], 0,
        'In 2001, SSB was transferred to MHA and mandated as the border guarding force for Indo-Nepal and Indo-Bhutan borders.',
        '2001 में कारगिल समीक्षा समिति की सिफारिश पर गृह मंत्रालय के अधीन सीमा सुरक्षा बल बनाया गया।'
      ),
      makeQ(`ssb_stat_08_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What specialized task units were established in SSB to combat trafficking of women and children across the open Nepal border?',
        'नेपाल सीमा पर मानव तस्करी रोकने के लिए एसएसबी में किस विशेष इकाई की स्थापना की गई?',
        ['Anti-Human Trafficking Units (AHTU)', 'Anti-Hijacking Squad', 'Marine Flotilla', 'Airborne Commando'], 0,
        'SSB established Anti-Human Trafficking Units (AHTU) with female personnel at border transit points.',
        'एंटी-ह्यूमन ट्रैफिकिंग यूनिट (AHTU)।'
      ),
      makeQ(`ssb_stat_09_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under the 1950 Indo-Nepal Treaty of Peace and Friendship, what unique movement privilege is granted to citizens of both nations?',
        '1950 की भारत-नेपाल शांति और मित्रता संधि के तहत नागरिकों को क्या विशेष अधिकार प्राप्त है?',
        ['Free movement without passport or visa requirements', 'Mandatory 30-day visa', 'Movement permitted only via air', 'Only trade cargo allowed'], 0,
        'The 1950 Treaty allows reciprocal free movement and residence without visas.',
        'बिना पासपोर्ट या वीजा के मुक्त आवागमन।'
      ),
      makeQ(`ssb_stat_10_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Section 20 of the SSB Act 2007, what is the penalty for intoxication on duty?',
        'एसएसबी अधिनियम की धारा 20 के तहत ड्यूटी पर मादक द्रव्य सेवन की सजा क्या है?',
        ['Imprisonment up to 1 year on active duty or up to 6 months in peace', 'Life imprisonment', 'Death penalty', 'No punishment'], 0,
        'Section 20 punishes intoxication with imprisonment up to 1 year if on active duty.',
        'सक्रिय ड्यूटी पर 1 वर्ष तक का कारावास।'
      ),
      makeQ(`ssb_stat_11_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What intelligence designation was conferred upon SSB in 2001 for the Indo-Nepal border?',
        '2001 में भारत-नेपाल सीमा के लिए एसएसबी को क्या विशेष दर्जा दिया गया था?',
        ['Lead Intelligence Agency (LIA)', 'External Secret Wing', 'Raw Special Directorate', 'Customs Sole Authority'], 0,
        'SSB was declared the Lead Intelligence Agency (LIA) for the Indo-Nepal and Indo-Bhutan borders.',
        'लीड इंटेलिजेंस एजेंसी (LIA)।'
      ),
      makeQ(`ssb_stat_12_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Where is the SSB Central Academy and Officers Training Academy located?',
        'एसएसबी अकादमी और अधिकारी प्रशिक्षण केंद्र कहाँ स्थित है?',
        ['Srinagar, Garhwal (Uttarakhand)', 'Neemuch', 'Hakimpet', 'Dehradun'], 0,
        'SSB Central Academy is located at Srinagar, Garhwal (Uttarakhand).',
        'श्रीनगर, गढ़वाल (उत्तराखंड) में स्थित है।'
      ),
      makeQ(`ssb_stat_13_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Section 67 of the SSB Act 2007, what are the three types of Force Courts authorized to try offences?',
        'एसएसबी अधिनियम की धारा 67 के तहत कौन-सी तीन प्रकार की अदालतें अधिकृत हैं?',
        ['General Force Court, Petty Force Court, Summary Force Court', 'Supreme Court, High Court, Sessions Court', 'Military Court only', 'Panchayat Court only'], 0,
        'General Force Court (GFC), Petty Force Court (PFC), and Summary Force Court (SFC).',
        'जनरल फोर्स कोर्ट, पेटी फोर्स कोर्ट और समरी फोर्स कोर्ट।'
      ),
      makeQ(`ssb_stat_14_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What wildlife sanctuary in Assam is co-secured by SSB along the international Bhutan border?',
        'भूटान सीमा पर असम में स्थित किस प्रसिद्ध वन्यजीव अभयारण्य की सुरक्षा में एसएसबी तैनात है?',
        ['Manas National Park', 'Kaziranga National Park only', 'Sundarbans', 'Gir Forest'], 0,
        'Manas National Park on the Indo-Bhutan border is heavily guarded by SSB against wildlife poachers.',
        'मानस राष्ट्रीय उद्यान (Manas National Park)।'
      ),
      makeQ(`ssb_stat_15_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Section 144 of the Customs Act, what happens to contraband seized by SSB on the Indo-Nepal border?',
        'नेपाल सीमा पर एसएसबी द्वारा जब्त माल को वैधानिक रूप से किसे सौंपा जाता है?',
        ['Handed over to nearest Customs / Police authorities with formal Seizure Memo', 'Auctioned immediately by company commander', 'Discarded in river', 'Kept in regimental mess'], 0,
        'Contraband must be handed over to jurisdictional Customs or Police officers with detailed seizure inventories.',
        'जब्ती पत्रक के साथ निकटतम कस्टम या पुलिस अधिकारियों को सौंपा जाता है।'
      )
    ];
  } else if (force === 'Assam Rifles') {
    forceStatutory = [
      makeQ(`ar_stat_01_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'The Assam Rifles functions under a unique "Dual Control" system. Which two ministries exercise this control?',
        'असम राइफल्स का दोहरा नियंत्रण किन दो मंत्रालयों द्वारा किया जाता है?',
        ['Ministry of Home Affairs (Administrative) and Ministry of Defense / Army (Operational)', 'Ministry of External Affairs and Railways', 'Ministry of Finance and Law', 'Ministry of Environment and Tribal Affairs'], 0,
        'MHA controls administration and budget; Ministry of Defense (Indian Army) controls operational deployment.',
        'प्रशासनिक नियंत्रण गृह मंत्रालय और परिचालन नियंत्रण रक्षा मंत्रालय (सेना) के पास है।'
      ),
      makeQ(`ar_stat_02_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under the Assam Rifles Act 2006, which section details the constitution and general superintendence of the Force?',
        'असम राइफल्स अधिनियम 2006 की कौन-सी धारा बल के गठन और अधीक्षण का प्रावधान करती है?',
        ['Section 4', 'Section 18', 'Section 55', 'Section 80'], 0,
        'Section 4 provides for the Constitution of the Assam Rifles.',
        'धारा 4 में बल के गठन का प्रावधान है।'
      ),
      makeQ(`ar_stat_03_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What historical name was given to the force raised in 1835 that later evolved into the Assam Rifles?',
        '1835 में गठित उस बल का ऐतिहासिक नाम क्या था जो बाद में असम राइफल्स बना?',
        ['Cachar Levy', 'Crown Representative\'s Police', 'Royal Gurkha Platoon', 'Bengal Constabulary'], 0,
        'Assam Rifles was raised in 1835 as the Cachar Levy, making it India\'s oldest paramilitary force.',
        '1835 में कछार लेवी (Cachar Levy) के रूप में स्थापना हुई थी। यह भारत का सबसे पुराना अर्धसैनिक बल है।'
      ),
      makeQ(`ar_stat_04_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What international border is officially guarded by the Assam Rifles?',
        'असम राइफल्स किस अंतरराष्ट्रीय सीमा की सुरक्षा के लिए मुख्य रूप से उत्तरदायी है?',
        ['1,643 km Indo-Myanmar Border', 'Indo-China Border only', 'Indo-Pak Border only', 'Indo-Bhutan Border only'], 0,
        'Assam Rifles guards the 1,643 km long rugged and forested Indo-Myanmar border.',
        '1,643 किमी लंबी भारत-म्यांमार सीमा।'
      ),
      makeQ(`ar_stat_05_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What arrangement traditionally permitted indigenous tribes to travel within 16 km of the Indo-Myanmar border without visa documentation?',
        'भारत-म्यांमार सीमा पर बिना वीजा के 16 किमी तक आने-जाने की अनुमति देने वाली व्यवस्था क्या कहलाती है?',
        ['Free Movement Regime (FMR)', 'Open Border Pass', 'ASEAN Free Transit', 'Border Haat Accord'], 0,
        'The Free Movement Regime (FMR) allowed border tribes to travel up to 16 km into either nation.',
        'फ्री मूवमेंट रिजीम (Free Movement Regime - FMR)।'
      ),
      makeQ(`ar_stat_06_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What is the popular honorific title affectionately bestowed upon the Assam Rifles in the North-Eastern states?',
        'पूर्वोत्तर राज्यों में असम राइफल्स को किस आदरणीय उपाधि से जाना जाता है?',
        ['Friends of the Hill People (पहाड़ी लोगों के मित्र) & Sentinels of the North-East', 'Himveers', 'Desert Hawks', 'Black Cats'], 0,
        'Assam Rifles is known as "Sentinels of the North-East" and "Friends of the Hill People".',
        '"पूर्वोत्तर के प्रहरी" और "पहाड़ी लोगों के मित्र"।'
      ),
      makeQ(`ar_stat_07_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Where is the Headquarters Directorate General of Assam Rifles (DGAR) located?',
        'असम राइफल्स महानिदेशालय (HQ DGAR) का मुख्यालय कहाँ स्थित है?',
        ['Shillong, Meghalaya', 'Guwahati, Assam', 'Kohima, Nagaland', 'Imphal, Manipur'], 0,
        'HQ DGAR is located at Laitkor, Shillong, Meghalaya.',
        'शिलांग, मेघालय में स्थित है।'
      ),
      makeQ(`ar_stat_08_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What is the motto of the Assam Rifles?',
        'असम राइफल्स का आदर्श वाक्य क्या है?',
        ['Sentinels of the North-East (पूर्वोत्तर के प्रहरी)', 'Service and Loyalty', 'Duty Unto Death', 'Valour and Wisdom'], 0,
        'The motto of Assam Rifles is "Sentinels of the North-East" (पूर्वोत्तर के प्रहरी).',
        'पूर्वोत्तर के प्रहरी (Sentinels of the North-East)।'
      ),
      makeQ(`ar_stat_09_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Section 10 of the Assam Rifles Act 2006, what penalty is prescribed for shamefully casting away arms or ammunition before the enemy?',
        'धारा 10 के तहत शत्रु के समक्ष हथियार फेंकने पर क्या सजा है?',
        ['Death or rigorous imprisonment for life', 'Loss of 1 week pay', 'Detention in barracks for 2 days', 'Warning only'], 0,
        'Section 10 punishes casting away arms in the presence of the enemy with death or life imprisonment.',
        'मृत्युदंड अथवा आजीवन कारावास।'
      ),
      makeQ(`ar_stat_10_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What rank in the Indian Army traditionally heads the Assam Rifles as Director General (DGAR)?',
        'असम राइफल्स के महानिदेशक (DGAR) के पद पर भारतीय सेना के किस रैंक के अधिकारी प्रतिनियुक्त होते हैं?',
        ['Lieutenant General (Lt Gen)', 'Major General only', 'Brigadier', 'Colonel'], 0,
        'The DGAR is a serving Lieutenant General from the Indian Army.',
        'लेफ्टिनेंट जनरल (Lieutenant General) रैंक के सैन्य अधिकारी।'
      ),
      makeQ(`ar_stat_11_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What counter-insurgency doctrine is utilized by Assam Rifles combining tactical village outreach with mobile forest ambushes?',
        'असम राइफल्स द्वारा पूर्वोत्तर में उग्रवाद से निपटने के लिए कौन-सी रणनीति अपनाई जाती है?',
        ['Winning Hearts and Minds (WHAM) & Grid Counter-Insurgency', 'Total Destruction Doctrine', 'Static Sentry Line only', 'Desert Siege'], 0,
        'WHAM (Winning Hearts and Minds) integrates civic action with kinetic counter-terror operations.',
        'जन-सहानुभूति जीतना (WHAM) और ग्रिड काउंटर-इंसर्जेंसी।'
      ),
      makeQ(`ar_stat_12_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Section 85 of the Assam Rifles Act 2006, which Force Court may award death penalty?',
        'असम राइफल्स अधिनियम के तहत कौन-सी अदालत मृत्युदंड दे सकती है?',
        ['General Assam Rifles Court (GARC)', 'Petty Assam Rifles Court', 'Summary Assam Rifles Court', 'Civil Panchayat'], 0,
        'Only a General Assam Rifles Court (GARC) has the power to pass a death sentence.',
        'केवल जनरल असम राइफल्स कोर्ट (GARC)।'
      ),
      makeQ(`ar_stat_13_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Where is the Assam Rifles Training Centre and School (ARTC&S) situated?',
        'असम राइफल्स प्रशिक्षण केंद्र एवं स्कूल (ARTC&S) कहाँ स्थित है?',
        ['Dimapur / Shokhuvi, Nagaland', 'Shillong', 'Silchar', 'Aizawl'], 0,
        'ARTC&S is located at Shokhuvi near Dimapur, Nagaland.',
        'शोखुवी (दीमापुर, नागालैंड) में स्थित है।'
      ),
      makeQ(`ar_stat_14_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'What terrain feature characterizes the majority of the 1,643 km Indo-Myanmar border guarded by Assam Rifles?',
        'असम राइफल्स द्वारा सुरक्षित भारत-म्यांमार सीमा की मुख्य भौगोलिक विशेषता क्या है?',
        ['Dense subtropical rainforests, steep hills, and river gorges', 'Flat desert sand dunes', 'Salt marsh mudflats', 'Arid plateaus'], 0,
        'The border features dense subtropical jungle, steep mountain ridges (Patkai and Arakan ranges).',
        'घने वर्षावन, दुर्गम पहाड़ और गहरी नदी घाटियां।'
      ),
      makeQ(`ar_stat_15_m${mockNum}`, 'General Awareness & Professional Knowledge',
        'Under Section 55 of the Assam Rifles Act 2006, who is empowered to award minor punishments to riflemen?',
        'असम राइफल्स अधिनियम की धारा 55 के तहत राइफलमैन को लघु सजा देने का अधिकार किसे है?',
        ['The Commandant of the Assam Rifles Battalion', 'Subedar', 'Local Sub-Inspector', 'Civil Collector'], 0,
        'The Commandant holds statutory powers under Section 55 for summary minor punishments.',
        'बटालियन के कमांडेंट।'
      )
    ];
  }

  // Deterministic rotation helpers so every paper features official LDCE Professional Ability
  // & varied official-pattern questions without duplicate items inside the same paper.
  const forceSeedMap = { CRPF: 0, CISF: 7, BSF: 14, ITBP: 21, SSB: 28, 'Assam Rifles': 35, Common: 5 };
  const fSeed = forceSeedMap[force] !== undefined ? forceSeedMap[force] : 0;

  function takeCyclic(pool, count, startIdx) {
    const out = [];
    for (let i = 0; i < count; i++) {
      out.push(pool[(startIdx + i) % pool.length]);
    }
    return out;
  }

  let selectedSec2 = [];
  if (force === 'CRPF') {
    if (mockNum === 1) {
      // Flagship 100-Question Official CRPF SI (GD) LDCE Pattern Paper:
      // 18 Official CRPF Professional Ability Qs + 4 Official GA Qs + 3 CRPF Act Qs = 25 Qs
      selectedSec2 = [
        ...takeCyclic(officialProfAbilityPool, 18, 0),
        ...takeCyclic(officialGAPool, 4, 0),
        ...takeCyclic(forceStatutory, 3, 0)
      ];
    } else {
      // Other CRPF Mocks: 15 Official Prof Ability + 7 CRPF Statutory + 3 Official GA = 25 Qs
      selectedSec2 = [
        ...takeCyclic(officialProfAbilityPool, 15, (mockNum - 1) * 4),
        ...takeCyclic(forceStatutory, 7, (mockNum - 1) * 2),
        ...takeCyclic(officialGAPool, 3, mockNum - 1)
      ];
    }
  } else if (force === 'Common') {
    // Free Common CAPF Mocks: 15 Official Prof Ability + 5 Official GA + 5 All-CAPF Law/GK = 25 Qs
    selectedSec2 = [
      ...takeCyclic(officialProfAbilityPool, 15, fSeed + (mockNum - 1) * 8),
      ...takeCyclic(officialGAPool, 5, (mockNum - 1) * 2),
      ...takeCyclic(commonGK, 5, (mockNum - 1) * 2)
    ];
  } else {
    // Force-specific Paid Mocks (CISF, BSF, ITBP, SSB, Assam Rifles):
    // 12 Official LDCE Prof Ability + 10 Force-Specific Statutory + 3 Official/General GA = 25 Qs
    const gaMix = [...officialGAPool, ...commonGK];
    selectedSec2 = [
      ...takeCyclic(officialProfAbilityPool, 12, fSeed + (mockNum - 1) * 4),
      ...takeCyclic(forceStatutory, 10, (mockNum - 1) * 2),
      ...takeCyclic(gaMix, 3, fSeed + (mockNum - 1) * 3)
    ];
  }

  return selectedSec2;
}

// Balance options deterministically so correct answers span A/B/C/D (instead of all index 0),
// while preserving fixed-order options like "All of these", "Both I and II", or "(A) ...".
function balanceQuestionOptions(q, shift) {
  const hasOrderSensitiveOption = q.options.some(opt =>
    /\b(All of these|All the above|Both |Neither |\([A-D]\)|Part \([A-D]\)|No error)\b/i.test(opt) ||
    opt.includes('उपरोक्त सभी')
  );
  if (hasOrderSensitiveOption || q.id.startsWith('off_') || q.correctAnswer !== 0) {
    return q;
  }
  const s = ((shift % 4) + 4) % 4;
  if (s === 0) return q;
  // Rotate right by s so index 0 moves to index s
  const rotated = q.options.map((_, i) => q.options[(i - s + 4) % 4]);
  return {
    ...q,
    options: rotated,
    correctAnswer: s
  };
}

function buildSectionQuestions(combinedPool, count, seedOffset, testId, secTag) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const src = combinedPool[(seedOffset + i) % combinedPool.length];
    const balanced = balanceQuestionOptions(src, seedOffset + i + 1);
    out.push({
      ...balanced,
      id: `q_${testId}_${secTag}_${i + 1}`
    });
  }
  return out;
}

const allReasoningPool = [...officialReasoningPool, ...reasoningPool]; // 45 Qs
const allQuantPool = [...officialQuantPool, ...quantPool];             // 45 Qs
const allEnglishPool = [...officialEnglishPool, ...englishPool];       // 45 Qs

// Function to generate a complete 100-question test (25 Qs per section)
function build100QuestionTest(testId, title, force, category, isPaid, mockNum, desc) {
  const forceSeedMap = { CRPF: 0, CISF: 6, BSF: 12, ITBP: 18, SSB: 24, 'Assam Rifles': 30, Common: 36 };
  const fOffset = forceSeedMap[force] !== undefined ? forceSeedMap[force] : 0;
  const rotSeed = fOffset + (mockNum - 1) * 5;

  // Section 1: General Intelligence & Reasoning (25 questions)
  const sec1 = buildSectionQuestions(allReasoningPool, 25, rotSeed, testId, 'sec1');

  // Section 2: General Awareness & Professional Knowledge (25 questions)
  const sec2 = getForceSection2Questions(force, mockNum).map((q, idx) => ({
    ...balanceQuestionOptions(q, rotSeed + idx + 2),
    id: `q_${testId}_sec2_${idx + 1}`
  }));

  // Section 3: Quantitative / Numerical Aptitude (25 questions)
  const sec3 = buildSectionQuestions(allQuantPool, 25, rotSeed, testId, 'sec3');

  // Section 4: English & Hindi Language (25 questions)
  const sec4 = buildSectionQuestions(allEnglishPool, 25, rotSeed, testId, 'sec4');

  const all100Questions = [...sec1, ...sec2, ...sec3, ...sec4];

  const sections = [
    'General Intelligence & Reasoning',
    'General Awareness & Professional Knowledge',
    'Quantitative Aptitude',
    'English & Hindi Language'
  ];

  return {
    id: testId,
    title: title,
    category: category,
    targetExam: `${force} LDCE & Recruitment 2026`,
    force: force,
    isPaid: isPaid,
    requiredPackage: isPaid ? 'pkg_100_2m' : null,
    description: desc,
    durationMinutes: 100, // Exactly 1 min per question (100 Qs = 100 Min)
    totalMarks: 100,      // 100 Qs * 1 Mark = 100 Marks
    passingMarks: 45,     // 45% qualifying standard
    marksPerQuestion: 1,
    negativeMarking: 0.25,
    questionCount: 100,
    sections: sections,
    difficulty: mockNum <= 3 ? 'Moderate' : (mockNum <= 7 ? 'Hard' : 'Advanced'),
    featured: mockNum === 1 || mockNum === 10,
    questions: all100Questions,
    createdAt: new Date().toISOString()
  };
}

// =========================================================================
// ASSEMBLE ALL 63 MOCK TESTS (60 Force Tests + 3 Free Common Tests)
// =========================================================================
console.log('Generating 63 Full-Length 100-Question CAPF Mock Tests (6,300 Questions)...');

const all63Tests = [];

// 1. CRPF (10 Full Tests - 100 Qs each)
const crpfTitles = [
  'CRPF SI (GD) LDCE Official Pattern 100-Q Paper 01 - Professional Ability & PYQ Blueprint',
  'CRPF Head Constable (GD) Full Mock 02 - Fieldcraft, ARCF & Battlecraft',
  'CRPF CoBRA Commando Tactical Operations Mock 03 - Jungle Warfare & Professional Knowledge',
  'CRPF ASI (Executive) Professional Mock 04 - Service Rules, Forms & CrPC',
  'CRPF Internal Security & Anti-Riot Mock 05 - Mob Dispersal & Professional Ability',
  'CRPF Standing Orders & Minor Acts Mock 06 - Disciplinary Law & Range Drills',
  'CRPF Special Operations & VIP Security Mock 07 - Convoy Protection & Tactics',
  'CRPF Rapid Action Force (RAF) Crowd Control Mock 08 - Non-Lethal Riot Tactics',
  'CRPF GD to SI Speed Challenge Mock 09 - Official LDCE High Accuracy Mock',
  'CRPF All India Grand Championship Mock 10 - LDCE Final Professional Ability Mock'
];
crpfTitles.forEach((title, idx) => {
  const mNum = idx + 1;
  const testId = `test_crpf_full_${String(mNum).padStart(2, '0')}`;
  const desc = `Official 100-question CBT mock test modeled on the CRPF SI (GD) LDCE Official Paper (4 Parts × 25 Qs = 100 Qs, 100 Min). Includes authentic Professional Ability questions (ARCF, Weapon Drills, Service Forms, Standing Orders), Reasoning, Numerical Ability & English/Hindi.`;
  all63Tests.push(build100QuestionTest(testId, title, 'CRPF', 'LDCE', true, mNum, desc));
});

// 2. CISF (10 Full Tests - 100 Qs each)
const cisfTitles = [
  'CISF ASI (Exe) LDCE Full Mock 01 - CISF Act 1968 & Rules 2001',
  'CISF Aviation Security (ASG) Protocol Mock 02 - BCAS & Airport Security',
  'CISF Industrial Plant & PSU Security Mock 03 - PIDS & Access Control',
  'CISF Head Constable Ministerial Mock 04 - General Aptitude & Service Procedures',
  'CISF SI (Exe) Service Law Mock 05 - Search/Seizure, CrPC 100, IPC 96-106',
  'CISF Metro & Port Protection Mock 06 - Transit Security & Anti-Sabotage',
  'CISF Fire & Hazardous Materials Mock 07 - Fire Safety & Disaster Management',
  'CISF Critical Infrastructure Protection Mock 08 - Atomic & Space Installations',
  'CISF ASI/Exe High Accuracy Speed Mock 09 - Departmental Fast-Track',
  'CISF All India Grand Championship Mock 10 - Complete LDCE Final Mock'
];
cisfTitles.forEach((title, idx) => {
  const mNum = idx + 1;
  const testId = `test_cisf_full_${String(mNum).padStart(2, '0')}`;
  const desc = `Official 100-question CBT mock test modeled on the CAPF SI (GD) LDCE 4-Part pattern (25 Qs each): Reasoning, Professional Ability (Official LDCE Bank + CISF Act 1968 & Rules 2001), Numerical Aptitude, and English/Hindi. Duration: 100 Minutes.`;
  all63Tests.push(build100QuestionTest(testId, title, 'CISF', 'LDCE', true, mNum, desc));
});

// 3. BSF (10 Full Tests - 100 Qs each)
const bsfTitles = [
  'BSF SI (GD) LDCE Full Mock 01 - BSF Act 1968 & Rules 1969',
  'BSF Border Outpost (BOP) Defense Mock 02 - Anti-Infiltration & Night Ops',
  'BSF Head Constable (RO/RM) Technical Mock 03 - Tactical Radio & Signals',
  'BSF Anti-Tunneling & Riverine Patrol Mock 04 - Creek & Desert Defense',
  'BSF International Border Management Mock 05 - Border Demarcation & Law',
  'BSF Line of Control (LoC) Tactics Mock 06 - Bunker Defense & Sentry Orders',
  'BSF Water Wing & Creek Flotilla Mock 07 - Sir Creek Amphibious Patrol',
  'BSF Air Wing & Logistics Support Mock 08 - Supply Chain & Border Airstrips',
  'BSF SI (GD) High Speed Accuracy Mock 09 - Departmental Speed Drill',
  'BSF All India Border Sentinel Grand Mock 10 - Complete LDCE Final Mock'
];
bsfTitles.forEach((title, idx) => {
  const mNum = idx + 1;
  const testId = `test_bsf_full_${String(mNum).padStart(2, '0')}`;
  const desc = `Official 100-question CBT mock test modeled on the CAPF SI (GD) LDCE 4-Part pattern (25 Qs each): Reasoning, Professional Ability (Official LDCE Bank + BSF Act 1968 & Border Law), Numerical Aptitude, and English/Hindi. Duration: 100 Minutes.`;
  all63Tests.push(build100QuestionTest(testId, title, 'BSF', 'LDCE', true, mNum, desc));
});

// 4. ITBP (10 Full Tests - 100 Qs each)
const itbpTitles = [
  'ITBP SI (GD) LDCE Full Mock 01 - ITBP Act 1992 & High Altitude Rules',
  'ITBP Mountain Warfare & Glacier Craft Mock 02 - Extreme Cold Ops',
  'ITBP HC Telecom & High Altitude Signals Mock 03 - Satellite Telephony',
  'ITBP LAC Protocols & Border Rules Mock 04 - Line of Actual Control Drills',
  'ITBP High Altitude Medical & HAPE Rescue Mock 05 - Acclimatization Rules',
  'ITBP Ski Patrol & Avalanche Defense Mock 06 - Winter Warfare Tactics',
  'ITBP Long Range Patrol (LRP) Recon Mock 07 - Ridge & Pass Navigation',
  'ITBP Disciplinary Law & Minor Acts Mock 08 - Force Courts & Standing Orders',
  'ITBP Himveer Fast Track Speed Mock 09 - Quantitative & Logical Drills',
  'ITBP Himveer All India Championship Mock 10 - Grand Mountain LDCE Final'
];
itbpTitles.forEach((title, idx) => {
  const mNum = idx + 1;
  const testId = `test_itbp_full_${String(mNum).padStart(2, '0')}`;
  const desc = `Official 100-question CBT mock test modeled on the CAPF SI (GD) LDCE 4-Part pattern (25 Qs each): Reasoning, Professional Ability (Official LDCE Bank + ITBP Act 1992 & High-Altitude Rules), Numerical Aptitude, and English/Hindi. Duration: 100 Minutes.`;
  all63Tests.push(build100QuestionTest(testId, title, 'ITBP', 'LDCE', true, mNum, desc));
});

// 5. SSB (10 Full Tests - 100 Qs each)
const ssbTitles = [
  'SSB SI (GD) LDCE Full Mock 01 - SSB Act 2007 & Border Law',
  'SSB Indo-Nepal & Indo-Bhutan Friendly Border Mock 02 - Open Border Law',
  'SSB Intelligence & HUMINT Special Operations Mock 03 - Trans-Border Crime',
  'SSB Anti-Human Trafficking (AHTU) Protocol Mock 04 - NDPS & Wildlife Act',
  'SSB Civic Action Programme (CAP) & Border Relations Mock 05 - Community Policing',
  'SSB Border Checkpost & Customs Coordination Mock 06 - Trade Protocol',
  'SSB Force Courts & Legal Powers Mock 07 - Arrest & Seizure Law',
  'SSB Special Operations Group (SOG) Mock 08 - Counter-Infiltration Drills',
  'SSB Seema Prahari Speed Challenge Mock 09 - Reasoning & Arithmetic',
  'SSB All India Seema Prahari Grand Mock 10 - Complete LDCE Final Mock'
];
ssbTitles.forEach((title, idx) => {
  const mNum = idx + 1;
  const testId = `test_ssb_full_${String(mNum).padStart(2, '0')}`;
  const desc = `Official 100-question CBT mock test modeled on the CAPF SI (GD) LDCE 4-Part pattern (25 Qs each): Reasoning, Professional Ability (Official LDCE Bank + SSB Act 2007 & Open Border Law), Numerical Aptitude, and English/Hindi. Duration: 100 Minutes.`;
  all63Tests.push(build100QuestionTest(testId, title, 'SSB', 'LDCE', true, mNum, desc));
});

// 6. Assam Rifles (10 Full Tests - 100 Qs each)
const arTitles = [
  'Assam Rifles SI LDCE Mock 01 - Assam Rifles Act 2006 & Dual Control',
  'Assam Rifles North-East Border & Counter-Terrorism Mock 02 - CI/CT Tactics',
  'Assam Rifles Free Movement Regime (FMR) Mock 03 - Indo-Myanmar Border Law',
  'Assam Rifles Jungle Warfare & Hill Ambushes Mock 04 - Tactical Patrolling',
  'Assam Rifles Military-Civil Coordination Mock 05 - Operational Protocols',
  'Assam Rifles Weapon Training & CQB Mock 06 - Close Quarter Battle',
  'Assam Rifles Standing Orders & Summary Courts Mock 07 - Service Discipline',
  'Assam Rifles North-East Security Dynamics Mock 08 - Internal Security',
  'Assam Rifles Sentinel Speed Mock 09 - Reasoning & Aptitude Drills',
  'Assam Rifles All India Grand Championship Mock 10 - Complete Final Mock'
];
arTitles.forEach((title, idx) => {
  const mNum = idx + 1;
  const testId = `test_ar_full_${String(mNum).padStart(2, '0')}`;
  const desc = `Official 100-question CBT mock test modeled on the CAPF SI (GD) LDCE 4-Part pattern (25 Qs each): Reasoning, Professional Ability (Official LDCE Bank + Assam Rifles Act 2006 & CI/CT Doctrine), Numerical Aptitude, and English/Hindi. Duration: 100 Minutes.`;
  all63Tests.push(build100QuestionTest(testId, title, 'Assam Rifles', 'LDCE', true, mNum, desc));
});

// 7. 3 FREE COMMON FULL MOCK TESTS (100 Qs each - Open for ALL candidates!)
const freeTitles = [
  {
    id: 'test_free_common_01',
    title: 'All India CAPF SI LDCE Official-Pattern Open Mock 01 - Professional Ability Special',
    desc: 'Free open 100-question full-length mock test modeled on the official SI (GD) LDCE 4-Part paper: 25 Reasoning, 25 General Awareness & Official Professional Ability, 25 Numerical Ability, and 25 English/Hindi. Duration: 100 Minutes.'
  },
  {
    id: 'test_free_common_02',
    title: 'SSC CPO SI & CAPF Common All-India Open Mock Test 02 - Official Tier-1 Standard',
    desc: 'Free open 100-question full-length mock test based on official SSC CPO Sub-Inspector pattern. Exactly 25 Qs per section across all 4 subjects. Duration: 100 Minutes.'
  },
  {
    id: 'test_free_common_03',
    title: 'Paramilitary & Defense Forces Common Speed Mock 03 - High Accuracy Practice Mock',
    desc: 'Free open 100-question speed and accuracy assessment mock test for CRPF, CISF, BSF, ITBP, SSB, and Assam Rifles aspirants. Duration: 100 Minutes.'
  }
];

freeTitles.forEach((item, idx) => {
  const mNum = idx + 1;
  all63Tests.push(build100QuestionTest(item.id, item.title, 'Common', 'CAPF', false, mNum, item.desc));
});

console.log(`Generated a total of ${all63Tests.length} tests!`);
const paidCount = all63Tests.filter(t => t.isPaid).length;
const freeCount = all63Tests.filter(t => !t.isPaid).length;
console.log(`Paid Force Tests: ${paidCount} (Expected: 60)`);
console.log(`Free Common Tests: ${freeCount} (Expected: 3)`);

// Verify every test has exactly 100 questions and 25 per section
let allOk = true;
all63Tests.forEach((t, i) => {
  if (t.questions.length !== 100) {
    console.error(`Test ${t.id} has ${t.questions.length} questions, expected 100!`);
    allOk = false;
  }
  const secCounts = {};
  t.questions.forEach(q => secCounts[q.section] = (secCounts[q.section] || 0) + 1);
  const values = Object.values(secCounts);
  if (values.length !== 4 || values.some(v => v !== 25)) {
    console.error(`Test ${t.id} sections distribution mismatch:`, secCounts);
    allOk = false;
  }
});

if (allOk) {
  console.log('ALL 63 TESTS VERIFIED: Exactly 100 questions per test and exactly 25 questions per section! ✓');
} else {
  console.error('Validation failed!');
  process.exit(1);
}

// Write to data/database.json
try {
  let dbData = { users: [], tests: [], attempts: [], settings: {}, enquiries: [] };
  if (fs.existsSync(DB_PATH)) {
    dbData = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  }
  dbData.tests = all63Tests;
  fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2), 'utf8');
  console.log(`Successfully saved 63 full mock tests to ${DB_PATH}!`);
} catch (e) {
  console.error('Error saving database:', e);
  process.exit(1);
}
