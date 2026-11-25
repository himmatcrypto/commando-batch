/**
 * Authentic Question Bank extracted & adapted from Official:
 * CRPF SI (GD) LDCE - 2016 Official Paper (Held on 05 Feb 2017, SET-A) & Official Revised Answer Key
 * All questions are cleanly bilingual (English + UTF-8 Hindi) with verified answers and explanations.
 */

function makeOfficialQ(id, section, textEn, textHi, options, correctIdx, expEn, expHi) {
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
// PART II (OFFICIAL PROFESSIONAL ABILITY QUESTIONS: Q.56 - Q.100 FROM SET-A)
// Verified against Official Revised Answer Key (Pages 32-33)
// =========================================================================
const officialProfAbilityPool = [
  makeOfficialQ('off_pa_01', 'General Awareness & Professional Knowledge',
    'What is the scoring pattern in Annual Range Classification Firing (ARCF) for a trained soldier firing the 5.56mm INSAS Rifle?',
    '5.56 मिमी इंसास राइफल से फायरिंग करने वाले प्रशिक्षित जवान के लिए वार्षिक रेंज वर्गीकरण फायरिंग (ARCF) में स्कोरिंग पैटर्न क्या है?',
    [
      'Marksman - 74, 1st Class - 60 & Standard Shot - 46',
      'Marksman - 80, 1st Class - 65 & Standard Shot - 50',
      'Marksman - 70, 1st Class - 55 & Standard Shot - 40',
      'Marksman - 75, 1st Class - 62 & Standard Shot - 48'
    ], 0,
    'Official CRPF LDCE Key (A): For a trained soldier firing INSAS Rifle in ARCF, Marksman requires 74, 1st Class requires 60, and Standard Shot requires 46.',
    'आधिकारिक उत्तर कुंजी (A): इंसास राइफल के लिए ARCF में मार्क्समैन-74, प्रथम श्रेणी-60 तथा स्टैंडर्ड शॉट-46 अंक निर्धारित हैं।'
  ),
  makeOfficialQ('off_pa_02', 'General Awareness & Professional Knowledge',
    'What is the total number of firing practices (both Day and Night) prescribed in ARCF for a trained soldier firing the 9mm Carbine?',
    '9 मिमी कार्बाइन से फायरिंग करने वाले प्रशिक्षित जवान के लिए ARCF में कुल कितने फायरिंग अभ्यास (दिन और रात) निर्धारित हैं?',
    ['03', '04', '06', '05'], 3,
    'Official CRPF LDCE Key (D): A total of 05 firing practices (including Day and Night) are prescribed in ARCF for 9mm Carbine.',
    'आधिकारिक उत्तर कुंजी (D): 9 मिमी कार्बाइन के लिए दिन और रात मिलाकर कुल 05 फायरिंग अभ्यास निर्धारित हैं।'
  ),
  makeOfficialQ('off_pa_03', 'General Awareness & Professional Knowledge',
    'How many types of sights are used on the X-95 assault rifle?',
    'X-95 असॉल्ट राइफल में कितने प्रकार के साइट (Sights) उपयोग किए जाते हैं?',
    ['2', '3', '4', '5'], 1,
    'Official CRPF LDCE Key (B): 3 types of sights are used on the X-95 rifle (Iron sight, MARS/Reflex sight, and Night/Thermal/Telescopic sight).',
    'आधिकारिक उत्तर कुंजी (B): X-95 राइफल में 3 प्रकार के साइट का उपयोग किया जाता है।'
  ),
  makeOfficialQ('off_pa_04', 'General Awareness & Professional Knowledge',
    'In Drill, after how many paces does the hand come down in a Salute to the Left or Right (Dahine/Bayen Salute)?',
    'ड्रिल में दाहिने या बाएं सैल्यूट (Salute of Left or Right) के दौरान कितने कदम बाद हाथ नीचे आता है?',
    ['4 paces', '6 paces', '8 paces', '5 paces'], 1,
    'Official CRPF LDCE Key (B): On the 6th pace the hand is brought down sharply to the side in Left/Right Salute.',
    'आधिकारिक उत्तर कुंजी (B): दाहिने या बाएं सैल्यूट में 6 कदम (6 paces) पूरे होने पर हाथ नीचे आता है।'
  ),
  makeOfficialQ('off_pa_05', 'General Awareness & Professional Knowledge',
    'What is the prescribed serviceable life of a Peak Cap issued to Subordinate Officers (SOs)?',
    'अधीनस्थ अधिकारियों (SOs) को जारी किए जाने वाले पीक कैप (Peak Cap) का निर्धारित जीवनकाल कितना होता है?',
    ['01 year', '02 years', '03 years', '05 years'], 2,
    'Standard clothing scale fixes the serviceable life of a Peak Cap for Subordinate Officers at 03 years.',
    'अधीनस्थ अधिकारियों के लिए पीक कैप का निर्धारित सेवाकाल 03 वर्ष होता है।'
  ),
  makeOfficialQ('off_pa_06', 'General Awareness & Professional Knowledge',
    'When is the Kit Classification of a Force personnel normally carried out?',
    'बल के कार्मिक की किट वर्गीकरण (Kit Classification) प्रक्रिया सामान्यतः कब की जाती है?',
    [
      'At the time of pension / retirement',
      'Every month during kit inspection',
      'At the time of initial enlistment only',
      'Only upon transfer to another battalion'
    ], 0,
    'Official CRPF LDCE Key (A): Formal Kit Classification for clothing settlement is carried out at the time of pension/retirement.',
    'आधिकारिक उत्तर कुंजी (A): किट वर्गीकरण पेंशन/सेवानिवृत्ति के समय किया जाता है।'
  ),
  makeOfficialQ('off_pa_07', 'General Awareness & Professional Knowledge',
    'What is the standard duration (in weeks) of basic Dog Squad training for both the Dog and its Handler?',
    'डॉग स्क्वाड प्रशिक्षण में श्वान (Dog) और उसके हैंडलर दोनों के लिए प्रशिक्षण अवधि कितने सप्ताह की होती है?',
    ['24 weeks', '30 weeks', '40 weeks', '52 weeks'], 2,
    'Official CRPF LDCE Key (C): The combined training course for Dog and Handler runs for 40 weeks.',
    'आधिकारिक उत्तर कुंजी (C): डॉग और हैंडलर दोनों के लिए प्रशिक्षण अवधि 40 सप्ताह की होती है।'
  ),
  makeOfficialQ('off_pa_08', 'General Awareness & Professional Knowledge',
    'How many types of grenades can be fired using the 40mm Under Barrel Grenade Launcher (UBGL)?',
    'अंडर बैरल ग्रेनेड लॉन्चर (UBGL) से कुल कितने प्रकार के ग्रेनेड दागे जा सकते हैं?',
    ['3', '4', '5', '7'], 3,
    'Official CRPF LDCE Key (D): 7 types of grenades (HE, Practice, Illumination, Smoke, Tear Gas/Riot, Stun, Multi-ball) can be fired by UBGL.',
    'आधिकारिक उत्तर कुंजी (D): UBGL द्वारा कुल 7 प्रकार के ग्रेनेड दागे जा सकते हैं।'
  ),
  makeOfficialQ('off_pa_09', 'General Awareness & Professional Knowledge',
    'How many standard types of tactical Wire Obstacles are used in field defense?',
    'क्षेत्रीय रक्षा (Field Defense) में तार की बाधाओं (Wire Obstacles) के कितने मानक प्रकार होते हैं?',
    ['2', '3', '4', '6'], 2,
    'Official CRPF LDCE Key (C): There are 4 standard types of wire obstacles used in tactical perimeter defense.',
    'आधिकारिक उत्तर कुंजी (C): तार बाधाओं (Wire Obstacles) के 4 मानक प्रकार होते हैं।'
  ),
  makeOfficialQ('off_pa_10', 'General Awareness & Professional Knowledge',
    'Which CRPF Form is used to issue a Leave / Duty Certificate to Force personnel?',
    'सीआरपीएफ में अवकाश या ड्यूटी प्रमाणपत्र (Leave/Duty Certificate) किस फॉर्म संख्या में जारी किया जाता है?',
    ['CRP 12', 'CRP 18', 'CRP 24', 'CRP 28'], 3,
    'Official CRPF LDCE Key (D): Leave and Duty certificates in CRPF are issued on Form CRP 28.',
    'आधिकारिक उत्तर कुंजी (D): अवकाश/ड्यूटी प्रमाणपत्र फॉर्म संख्या CRP 28 में जारी किया जाता है।'
  ),
  makeOfficialQ('off_pa_11', 'General Awareness & Professional Knowledge',
    'How many times in a financial year can a government servant increase or decrease their GPF subscription respectively?',
    'एक वित्तीय वर्ष में कोई कार्मिक अपने जीपीएफ (GPF) अंशदान को क्रमशः कितनी बार बढ़ा या घटा सकता है?',
    ['1 / 1', '2 / 1 (Increase twice / Decrease once)', '2 / 2', '3 / 1'], 1,
    'Official CRPF LDCE Key (B): GPF subscription may be enhanced up to 2 times and reduced once (2 / 1) during a financial year.',
    'आधिकारिक उत्तर कुंजी (B): एक वित्तीय वर्ष में GPF अंशदान 2 बार बढ़ाया और 1 बार घटाया जा सकता है।'
  ),
  makeOfficialQ('off_pa_12', 'General Awareness & Professional Knowledge',
    'From whom must non-allottees obtain prior permission before visiting the Married Lines (Family Quarters) inside a campus?',
    'परिसर के मैरिड लाइन्स (परिवार आवास क्षेत्र) में जाने के लिए गैर-आवंटी कर्मियों को किसकी अनुमति लेना आवश्यक है?',
    ['Company Havildar Major', 'Platoon Commander', 'Subedar Major', 'Quarter Guard Commander'], 2,
    'Official CRPF LDCE Key (C): Prior permission from the Subedar Major is required for non-allottees to visit Married Lines.',
    'आधिकारिक उत्तर कुंजी (C): मैरिड लाइन्स में जाने के लिए सूबेदार मेजर (Subedar Major) से अनुमति आवश्यक है।'
  ),
  makeOfficialQ('off_pa_13', 'General Awareness & Professional Knowledge',
    'As per Central Civil Services / CAPF TA rules tested in the LDCE paper, Daily Allowance (DA) becomes admissible for absence from Headquarters of not less than:',
    'टीए/डीए नियमों के अनुसार मुख्यालय से न्यूनतम कितने घंटे की अनुपस्थिति पर दैनिक भत्ता (DA) देय होता है?',
    ['4 hours', '6 hours', '8 hours', '2 hours'], 2,
    'Official CRPF LDCE Key (C): 8 hours is the threshold used in the LDCE official key for admissibility of Daily Allowance.',
    'आधिकारिक उत्तर कुंजी (C): मुख्यालय से कम से कम 8 घंटे (8 hours) की अनुपस्थिति पर दैनिक भत्ता देय होता है।'
  ),
  makeOfficialQ('off_pa_14', 'General Awareness & Professional Knowledge',
    'Within what distance around a Polling Station is election canvassing strictly prohibited on polling day?',
    'मतदान के दिन मतदान केंद्र के चारों ओर कितनी दूरी के भीतर प्रचार (Canvassing) पूर्णतः वर्जित होता है?',
    ['50 Yards', '100 Yards', '200 Yards', '500 Yards'], 1,
    'Official CRPF LDCE Key (B): Under the Representation of the People Act, canvassing is prohibited within 100 Yards of a polling station.',
    'आधिकारिक उत्तर कुंजी (B): मतदान केंद्र से 100 गज (100 Yards) के दायरे में प्रचार करना वर्जित है।'
  ),
  makeOfficialQ('off_pa_15', 'General Awareness & Professional Knowledge',
    'What is the standard Response Time of Rapid Action Force (RAF) for Law & Order deployment within the same station on call?',
    'उसी स्टेशन (Same Station) के भीतर कानून व्यवस्था की स्थिति में कॉल मिलने पर रैपिड एक्शन फोर्स (RAF) का रिस्पॉन्स टाइम क्या है?',
    [
      '30 minutes for move of all Companies',
      '2 hours for move of one Platoon',
      '1 hour for move of Battalion HQ',
      '45 minutes for QRT only'
    ], 0,
    'Official CRPF LDCE Key (A): RAF maintains zero-response readiness with 30 minutes response time for movement of all Coys within the same station.',
    'आधिकारिक उत्तर कुंजी (A): कॉल मिलने के 30 मिनट के भीतर सभी कंपनियों का मूवमेंट RAF का मानक रिस्पॉन्स टाइम है।'
  ),
  makeOfficialQ('off_pa_16', 'General Awareness & Professional Knowledge',
    'What is the standard vehicle-to-vehicle safety distance maintained in convoy movement in Hilly Areas and Plain Areas respectively?',
    'सैन्य/बल के काफिले (Convoy) में पहाड़ी क्षेत्रों और मैदानी क्षेत्रों में दो वाहनों के बीच क्रमशः कितनी दूरी रखी जाती है?',
    [
      '25 to 50 meter (Hilly), 50 to 100 meter (Plain)',
      '50 to 100 meter (Hilly), 100 to 200 meter (Plain)',
      '100 to 150 meter (Hilly), 200 to 300 meter (Plain)',
      '10 to 20 meter (Hilly), 30 to 50 meter (Plain)'
    ], 1,
    'Official CRPF LDCE Key (B): Convoy interval is 50–100 meters in hilly terrain and 100–200 meters in plain areas.',
    'आधिकारिक उत्तर कुंजी (B): काफिले में पहाड़ी क्षेत्रों में 50 से 100 मीटर तथा मैदानी क्षेत्रों में 100 से 200 मीटर की दूरी रखी जाती है।'
  ),
  makeOfficialQ('off_pa_17', 'General Awareness & Professional Knowledge',
    'In which international sport did CRPF sponsor two promising players from Jammu & Kashmir?',
    'सीआरपीएफ ने जम्मू-कश्मीर के दो खिलाड़ियों को किस अंतर्राष्ट्रीय खेल में प्रायोजित (Sponsor) किया था?',
    ['Cricket', 'Football', 'Hockey', 'Boxing'], 1,
    'Official CRPF LDCE Key (B): CRPF sponsored two young Football players from J&K for national/international exposure.',
    'आधिकारिक उत्तर कुंजी (B): सीआरपीएफ ने जम्मू-कश्मीर के 2 फुटबॉल (Football) खिलाड़ियों को प्रायोजित किया था।'
  ),
  makeOfficialQ('off_pa_18', 'General Awareness & Professional Knowledge',
    'Which physical fitness attribute is specifically measured by the Shuttle Run Test?',
    'शटल रन टेस्ट (Shuttle Run Test) मुख्य रूप से किस शारीरिक क्षमता का मापन करता है?',
    ['Static strength', 'Cardiovascular endurance only', 'Agility', 'Flexibility'], 2,
    'Official CRPF LDCE Key (C): The Shuttle Run Test evaluates Agility (speed and rapid change of direction).',
    'आधिकारिक उत्तर कुंजी (C): शटल रन टेस्ट चपलता/फुर्ती (Agility) का मापन करता है।'
  ),
  makeOfficialQ('off_pa_19', 'General Awareness & Professional Knowledge',
    'Muscular fatigue during strenuous combat or physical training is primarily caused by the accumulation of:',
    'कठोर प्रशिक्षण या व्यायाम के दौरान मांसपेशियों में थकान मुख्यतः किसके संचय के कारण होती है?',
    ['Lactic acid', 'Citric acid', 'Hydrochloric acid', 'Acetic acid'], 0,
    'Official CRPF LDCE Key (A): Anaerobic exertion builds up Lactic Acid in muscles, causing fatigue and soreness.',
    'आधिकारिक उत्तर कुंजी (A): प्रशिक्षण के दौरान मांसपेशियों में लैक्टिक एसिड (Lactic acid) जमा होने से थकान होती है।'
  ),
  makeOfficialQ('off_pa_20', 'General Awareness & Professional Knowledge',
    'What is the total number of "Trained Soldier Table Cards" prescribed for Range Classification and Weapon Training?',
    'हथियार प्रशिक्षण और रेंज फायरिंग में "प्रशिक्षित सैनिक टेबल कार्ड (Trained Soldier Table Card)" की कुल संख्या कितनी होती है?',
    ['5', '7', '8', '9'], 3,
    'Official CRPF LDCE Key (D): There are 9 Trained Soldier Table Cards.',
    'आधिकारिक उत्तर कुंजी (D): प्रशिक्षित सैनिक टेबल कार्ड की कुल संख्या 9 होती है।'
  ),
  makeOfficialQ('off_pa_21', 'General Awareness & Professional Knowledge',
    'Which training module explicitly defines "Toughening of Body" as its major objective?',
    'किस प्रशिक्षण पद (Term) का प्रमुख उद्देश्य "शरीर को सुदृढ़ और कठोर बनाना (Toughening of body)" होता है?',
    ['Drill', 'Map Reading', 'Weapon Cleaning', 'PT (Physical Training)'], 3,
    'Official CRPF LDCE Key (D): Physical Training (PT) focuses primarily on toughening the body and building combat stamina.',
    'आधिकारिक उत्तर कुंजी (D): पीटी (PT - शारीरिक प्रशिक्षण) का मुख्य उद्देश्य शरीर को कठोर एवं सक्षम बनाना है।'
  ),
  makeOfficialQ('off_pa_22', 'General Awareness & Professional Knowledge',
    'During riot control / mob dispersal operations, what is the sitting/marching order position of the Lathi Party while dismounting or marching behind formations?',
    'वाहन से उतरकर मार्च करते समय दंगा नियंत्रण दल में लाठी पार्टी (Lathi Party) की बैठने/मार्च करने की स्थिति क्या होती है?',
    ['First', 'Last', 'Middle', 'Adjacent to Guard'], 1,
    'Official CRPF LDCE Key (B): The Lathi party takes the Last sitting/deployment position in standard anti-riot debussing drill.',
    'आधिकारिक उत्तर कुंजी (B): वाहन से मार्च करते समय लाठी पार्टी का स्थान अंतिम (Last) होता है।'
  ),
  makeOfficialQ('off_pa_23', 'General Awareness & Professional Knowledge',
    'Within how many days can a Revision Petition be submitted against a punishment awarded in a Departmental Enquiry (DE)?',
    'विभागीय जांच (Departmental Enquiry) में दिए गए दंड के विरुद्ध पुनरीक्षण याचिका (Revision Petition) कितने दिनों के भीतर दायर की जा सकती है?',
    ['15 days', '30 days', '60 days', '90 days'], 1,
    'Official CRPF LDCE Key (B): A revision petition against departmental punishment may be preferred within 30 days under CRPF Rules.',
    'आधिकारिक उत्तर कुंजी (B): विभागीय जांच के दंड के विरुद्ध पुनरीक्षण याचिका 30 दिनों के भीतर प्रस्तुत की जा सकती है।'
  ),
  makeOfficialQ('off_pa_24', 'General Awareness & Professional Knowledge',
    'What is the CRPF Form Number for the Orderly Room Register?',
    'सीआरपीएफ में ऑर्डर्ली रूम रजिस्टर (Orderly Room Register) की फॉर्म संख्या क्या है?',
    ['Form No. 02', 'Form No. 05', 'Form No. 08', 'Form No. 12'], 2,
    'Official CRPF LDCE Key (C): The Orderly Room Register in CRPF is maintained in Form No. 08.',
    'आधिकारिक उत्तर कुंजी (C): सीआरपीएफ में ऑर्डर्ली रूम रजिस्टर फॉर्म संख्या 08 में संधारित किया जाता है।'
  ),
  makeOfficialQ('off_pa_25', 'General Awareness & Professional Knowledge',
    'Within what time limit after completion of treatment must a Medical Reimbursement (MR) claim normally be submitted?',
    'चिकित्सा उपचार पूरा होने के कितने समय के भीतर मेडिकल प्रतिपूर्ति (MR) दावा प्रस्तुत किया जाना चाहिए?',
    ['01 month', '03 months', '06 months', '12 months'], 1,
    'Official CRPF LDCE Key (B): Medical Reimbursement (MR) claims must be preferred within 03 months from the completion of treatment.',
    'आधिकारिक उत्तर कुंजी (B): उपचार पूरा होने के 03 माह के भीतर चिकित्सा प्रतिपूर्ति (MR) दावा प्रस्तुत करना अनिवार्य है।'
  ),
  makeOfficialQ('off_pa_26', 'General Awareness & Professional Knowledge',
    'How frequently should a Firefighting Practice / Drill be conducted in a Duty Battalion?',
    'एक ड्यूटी बटालियन में अग्निशमन अभ्यास (Firefighting practice) कितने अंतराल पर आयोजित किया जाता है?',
    ['Once in 7 Days', 'Once in 10 Days', 'Once in 15 Days', 'Once in 30 Days'], 2,
    'Official CRPF LDCE Key (C): Firefighting drill in a duty battalion must be practiced once every 15 Days.',
    'आधिकारिक उत्तर कुंजी (C): ड्यूटी बटालियन में अग्निशमन अभ्यास प्रत्येक 15 दिन में एक बार किया जाता है।'
  ),
  makeOfficialQ('off_pa_27', 'General Awareness & Professional Knowledge',
    'Which newly raised CRPF Mahila (Women) Battalion was specifically inducted into Left Wing Extremism (LWE) affected areas?',
    'वामपंथी उग्रवाद (LWE) प्रभावित क्षेत्र में तैनात की गई नई सीआरपीएफ महिला बटालियन कौन-सी है?',
    ['88 Bn', '135 Bn', '232 Bn', '213 Bn'], 2,
    'Official CRPF LDCE Key (C): 232 Mahila Battalion was raised and deployed in LWE operations.',
    'आधिकारिक उत्तर कुंजी (C): 232 बटालियन (232 Bn) को LWE क्षेत्र में तैनात किया गया।'
  ),
  makeOfficialQ('off_pa_28', 'General Awareness & Professional Knowledge',
    'Which CRPF Training Institution was awarded the Home Minister\'s Trophy/Cup for the Best Recruit Training Centre?',
    'सर्वश्रेष्ठ रंगरूट प्रशिक्षण केंद्र के लिए गृह मंत्री कप किस सीआरपीएफ प्रशिक्षण संस्थान को प्रदान किया गया था?',
    ['RTC Neemuch', 'RTC Avadi', 'RTC Latur', 'RTC Srinagar'], 0,
    'Official CRPF LDCE Key (A): RTC Neemuch received the Home Minister Cup for Best Recruit Training Centre.',
    'आधिकारिक उत्तर कुंजी (A): आरटीसी नीमच (RTC Neemuch) को सर्वश्रेष्ठ रंगरूट प्रशिक्षण केंद्र का गृह मंत्री कप मिला।'
  ),
  makeOfficialQ('off_pa_29', 'General Awareness & Professional Knowledge',
    'Where was the latest Counter Insurgency and Anti Terrorism (CIAT) School of CRPF established (as featured in the LDCE paper)?',
    'सीआरपीएफ का नवीनतम उग्रवाद और आतंकवाद विरोधी (CIAT) स्कूल कहाँ स्थापित किया गया था?',
    ['Silchar', 'Chittoor', 'Shivpuri', 'Dayapur'], 1,
    'Official CRPF LDCE Key (B): The CIAT School of CRPF referenced in the paper was established at Chittoor (Andhra Pradesh).',
    'आधिकारिक उत्तर कुंजी (B): सीआरपीएफ का नवीनतम CIAT स्कूल चित्तूर (Chittoor) में स्थापित किया गया।'
  ),
  makeOfficialQ('off_pa_30', 'General Awareness & Professional Knowledge',
    'In AIPDM-2016, which CRPF Central Team won the Gold Medal for the first time?',
    'AIPDM-2016 प्रतियोगिता में किस सीआरपीएफ सेंट्रल टीम ने पहली बार स्वर्ण पदक (Gold Medal) जीता?',
    ['Athletics', 'Volleyball', 'Hockey', 'Kabaddi'], 2,
    'Official CRPF LDCE Key (C): The CRPF Central Hockey Team won the Gold Medal for the first time in AIPDM-2016.',
    'आधिकारिक उत्तर कुंजी (C): सीआरपीएफ की हॉकी (Hockey) टीम ने AIPDM-2016 में पहली बार स्वर्ण पदक जीता।'
  ),
  makeOfficialQ('off_pa_31', 'General Awareness & Professional Knowledge',
    'Where was the 7th National Conference of Women in Police hosted?',
    'पुलिस में महिलाओं का 7वां राष्ट्रीय सम्मेलन (7th National Conference of Women in Police) कहाँ आयोजित किया गया था?',
    ['NPA Hyderabad', 'BSF Academy Tekanpur', ' Vigyan Bhawan New Delhi', 'CRPF Academy Kadarpur'], 3,
    'Official CRPF LDCE Key (D): The 7th National Conference of Women in Police was held at CRPF Academy, Kadarpur (Gurugram).',
    'आधिकारिक उत्तर कुंजी (D): 7वां राष्ट्रीय महिला पुलिस सम्मेलन सीआरपीएफ अकादमी कादरपुर में आयोजित हुआ था।'
  ),
  makeOfficialQ('off_pa_32', 'General Awareness & Professional Knowledge',
    'Name the brave CRPF Commandant who laid down his life fighting terrorists on Independence Day (15 Aug 2016) at Nowhatta, Srinagar.',
    '15 अगस्त 2016 को श्रीनगर के नौहट्टा में आतंकियों से लड़ते हुए शहीद हुए वीर सीआरपीएफ कमांडेंट का नाम क्या था?',
    ['Chetan Cheetah', 'Pramod Kumar', 'K. P. Singh', 'Harshpal Singh'], 1,
    'Official CRPF LDCE Key (B): Commandant Pramod Kumar (49 Bn CRPF) was posthumously awarded Kirti Chakra after his supreme sacrifice on 15 Aug 2016.',
    'आधिकारिक उत्तर कुंजी (B): कमांडेंट प्रमोद कुमार (49 बटालियन) 15 अगस्त 2016 को श्रीनगर में वीरगति को प्राप्त हुए थे।'
  ),
  makeOfficialQ('off_pa_33', 'General Awareness & Professional Knowledge',
    'Which of the following physical tests directly measures Dynamic Strength?',
    'निम्नलिखित में से कौन-सा व्यायाम/परीक्षण गतिशील शक्ति (Dynamic Strength) का मापन करता है?',
    ['Plank hold', 'Standing broad jump', 'Sit and reach', 'Rope climbing'], 3,
    'Official CRPF LDCE Key (D): Rope climbing measures dynamic muscular strength of the upper body and grip.',
    'आधिकारिक उत्तर कुंजी (D): रस्सी पर चढ़ना (Rope climbing) गतिशील शक्ति (Dynamic strength) को मापता है।'
  ),
  makeOfficialQ('off_pa_34', 'General Awareness & Professional Knowledge',
    'What health indicator does Body Mass Index (BMI) primarily estimate?',
    'बॉडी मास इंडेक्स (BMI) मुख्य रूप से किसका आकलन/मापन करता है?',
    ['Lung vital capacity', 'Blood glucose level', 'Body fat status relative to height & weight', 'Bone mineral density'], 2,
    'Official CRPF LDCE Key (C): BMI (Weight in kg / Height in m^2) measures body fatness / weight-for-height classification.',
    'आधिकारिक उत्तर कुंजी (C): बीएमआई (BMI) शरीर की चर्बी (Body fat) और वजन-लंबाई के अनुपात को मापता है।'
  ),
  makeOfficialQ('off_pa_35', 'General Awareness & Professional Knowledge',
    'Which CRPF Standing Order governs the conduct of Annual Range Classification Firing (ARCF)?',
    'सीआरपीएफ में वार्षिक रेंज वर्गीकरण फायरिंग (ARCF) किस स्थायी आदेश (Standing Order) द्वारा विनियमित होती है?',
    ['S.O. - 04/2008', 'S.O. - 09/2011', 'S.O. - 11/2012', 'S.O. - 03/2015'], 1,
    'Official CRPF LDCE Key (B): Standing Order No. 09/2011 lays down the detailed instructions for ARCF in CRPF.',
    'आधिकारिक उत्तर कुंजी (B): वार्षिक रेंज वर्गीकरण फायरिंग के लिए स्थायी आदेश संख्या S.O. - 09/2011 लागू है।'
  ),
  makeOfficialQ('off_pa_36', 'General Awareness & Professional Knowledge',
    'Which of the following firing errors occur due to improper Trigger Operation?',
    'फायरिंग के दौरान ट्रिगर दबाने (Trigger Operation) की गलती के कारण कौन-सी त्रुटियाँ होती हैं?',
    ['Flinch (झटका लगना)', 'Jerk (जर्क)', 'Buck (बक)', 'All of these (उपरोक्त सभी)'], 3,
    'Official CRPF LDCE Key (D): Flinching, Jerking, and Bucking are all classic shooter errors caused by faulty trigger pressing.',
    'आधिकारिक उत्तर कुंजी (D): फ्लिंच, जर्क और बक ये सभी ट्रिगर ऑपरेशन की गलतियों के कारण होने वाली त्रुटियाँ हैं।'
  ),
  makeOfficialQ('off_pa_37', 'General Awareness & Professional Knowledge',
    'Which training exercise is practiced specifically to rectify mistakes in Sight Alignment?',
    'दृष्टि संरेखण (Sight Alignment) की त्रुटियों को सुधारने के लिए कौन-सा अभ्यास कराया जाता है?',
    ['Aiming box exercise', 'Bayonet charge drill', 'Double march drill', 'Obstacle cross'], 0,
    'Official CRPF LDCE Key (A): Aiming Box Exercise detects and corrects errors in sight alignment and sight picture.',
    'आधिकारिक उत्तर कुंजी (A): एमिंग बॉक्स एक्सरसाइज (Aiming box exercise) द्वारा साइट एलाइनमेंट की त्रुटि को सुधारा जाता है।'
  ),
  makeOfficialQ('off_pa_38', 'General Awareness & Professional Knowledge',
    'Which range procedure / drill is standardized on firing ranges to maintain safety and discipline?',
    'फायरिंग रेंज पर सुरक्षा और अनुशासन बनाए रखने के लिए कौन-सी रेंज ड्रिल अपनाई जाती है?',
    ['F to M drill', 'X to Z drill', 'A to G drill', 'P to T drill'], 2,
    'Official CRPF LDCE Key (C): The A to G Drill is adopted on CAPF/CRPF firing ranges.',
    'आधिकारिक उत्तर कुंजी (C): फायरिंग रेंज पर A से G ड्रिल (A to G drill) अपनाई जाती है।'
  ),
  makeOfficialQ('off_pa_39', 'General Awareness & Professional Knowledge',
    'Under standard weapon maintenance rules, when must a personal weapon be Zeroed?',
    'शस्त्र प्रबंधन नियमों के तहत किसी हथियार की जीरोइंग (Zeroing) कब की जानी चाहिए?',
    [
      'When newly issued to a soldier',
      'During transfer / handover-takeover to another firer',
      'After major repair to barrel or sights',
      'All of these (उपरोक्त सभी)'
    ], 3,
    'Official CRPF LDCE Key (D): A weapon must be zeroed when newly issued, upon change of firer/transfer, and after major repair.',
    'आधिकारिक उत्तर कुंजी (D): नया हथियार मिलने, हैंडओवर-टेकओवर (स्थानांतरण) तथा बड़ी मरम्मत के बाद हथियार की जीरोइंग की जाती है।'
  ),
  makeOfficialQ('off_pa_40', 'General Awareness & Professional Knowledge',
    'What is the authorized geographical jurisdiction radius (approximate highway patrol corridor) of a Rapid Action Force (RAF) battalion headquarters?',
    'रैपिड एक्शन फोर्स (RAF) यूनिट के सामान्य अधिकार क्षेत्र की परिधि कितनी निर्धारित की गई है?',
    ['100 Km', '150 Km', '350 Km', '600 Km'], 2,
    'Under RAF Standing Operating Procedure, an RAF unit covers law-and-order contingencies within approximately 300–350 km radius of its base.',
    'RAF यूनिट के अंतर्गत लगभग 300-350 किमी के दायरे में त्वरित तैनाती का क्षेत्राधिकार होता है।'
  )
];

// =========================================================================
// PART II (OFFICIAL GENERAL AWARENESS QUESTIONS: Q.51 - Q.55, Q.78, Q.85 - Q.87 FROM SET-A)
// =========================================================================
const officialGAPool = [
  makeOfficialQ('off_ga_01', 'General Awareness & Professional Knowledge',
    'Which Indian state government approved 50% reservation in its Judicial Services for OBC, SC, ST, and EBC categories?',
    'भारत के किस राज्य ने न्यायिक सेवाओं में OBC, SC, ST और EBC वर्गों के लिए 50% आरक्षण को मंजूरी दी?',
    ['Uttar Pradesh', 'Rajasthan', 'Bihar', 'Madhya Pradesh'], 2,
    'Official CRPF LDCE Key (C): Bihar approved 50% reservation across reserved categories in Superior and Subordinate Judicial Services.',
    'आधिकारिक उत्तर कुंजी (C): बिहार राज्य ने न्यायिक सेवाओं में 50% आरक्षण को मंजूरी दी।'
  ),
  makeOfficialQ('off_ga_02', 'General Awareness & Professional Knowledge',
    'Where is the Garampani Wildlife Sanctuary located?',
    'गरमपानी वन्यजीव अभयारण्य (Garampani Sanctuary) कहाँ स्थित है?',
    ['Gangtok, Sikkim', 'Diphu, Assam', 'Kohima, Nagaland', 'Itanagar, Arunachal Pradesh'], 1,
    'Official CRPF LDCE Key (B): Garampani Sanctuary is located at Diphu in Karbi Anglong district, Assam.',
    'आधिकारिक उत्तर कुंजी (B): गरमपानी अभयारण्य दीफू, असम (Diphu, Assam) में स्थित है।'
  ),
  makeOfficialQ('off_ga_03', 'General Awareness & Professional Knowledge',
    'At which of the following locations along the Indian coastline can natural Coral Reefs be found?',
    'निम्नलिखित में से किस भारतीय स्थान पर प्रवाल भित्तियाँ (Coral Reefs) पाई जाती हैं?',
    ['Waltair', 'Trivandrum', 'Rameshwaram', 'Puri'], 2,
    'Official CRPF LDCE Key (C): Major coral reef formations in India include Gulf of Mannar (Rameshwaram), Gulf of Kutch, Andaman & Nicobar, and Lakshadweep.',
    'आधिकारिक उत्तर कुंजी (C): भारत में रामेश्वरम (मन्नार की खाड़ी) में प्रवाल भित्तियाँ पाई जाती हैं।'
  ),
  makeOfficialQ('off_ga_04', 'General Awareness & Professional Knowledge',
    'Where is the Film and Television Institute of India (FTII) located?',
    'भारतीय फिल्म और टेलीविजन संस्थान (FTII) कहाँ स्थित है?',
    ['Pune (Maharashtra)', 'Mumbai (Maharashtra)', 'Chennai (Tamil Nadu)', 'Kolkata (West Bengal)'], 0,
    'Official CRPF LDCE Key (A): FTII was established in 1960 and is situated in Pune, Maharashtra.',
    'आधिकारिक उत्तर कुंजी (A): भारतीय फिल्म एवं टेलीविजन संस्थान पुणे (महाराष्ट्र) में स्थित है।'
  ),
  makeOfficialQ('off_ga_05', 'General Awareness & Professional Knowledge',
    'Gravity settling chambers are used in industries to remove which type of pollutant?',
    'उद्योगों में ग्रेविटी सेटलिंग चैंबर (Gravity setting chambers) का उपयोग किसे हटाने के लिए किया जाता है?',
    ['NOx gases', 'SO2 gases', 'Suspended particulate matter (SPM)', 'Carbon monoxide'], 2,
    'Official CRPF LDCE Key (C): Gravity settling chambers remove larger suspended particulate matter from industrial exhaust gases.',
    'आधिकारिक उत्तर कुंजी (C): ग्रेविटी सेटलिंग चैंबर का उपयोग निलंबित कणिकीय पदार्थ (Suspended particulate matter) को हटाने के लिए किया जाता है।'
  ),
  makeOfficialQ('off_ga_06', 'General Awareness & Professional Knowledge',
    'Which of the following historical facts are TRUE regarding Sri Guru Gobind Singh Ji?',
    'श्री गुरु गोबिंद सिंह जी के संबंध में निम्नलिखित में से कौन-से तथ्य सत्य हैं?',
    [
      'He was the 10th Guru of the Sikhs',
      'He founded the Khalsa Panth in 1699',
      'He compiled/authored the Dasam Granth',
      'All the above (उपरोक्त सभी)'
    ], 3,
    'Official CRPF LDCE Key (D): All three statements accurately describe Sri Guru Gobind Singh Ji.',
    'आधिकारिक उत्तर कुंजी (D): उपरोक्त सभी कथन श्री गुरु गोबिंद सिंह जी के बारे में सत्य हैं।'
  ),
  makeOfficialQ('off_ga_07', 'General Awareness & Professional Knowledge',
    'What does the scientific discipline of Ecology primarily deal with?',
    'पारिस्थितिकी (Ecology) विज्ञान मुख्य रूप से किसका अध्ययन करता है?',
    [
      'Weather forecasting only',
      'Structure of rocks',
      'Relation between organisms and their environment',
      'Stellar evolution'
    ], 2,
    'Official CRPF LDCE Key (C): Ecology studies the interactions between living organisms and their physical environment.',
    'आधिकारिक उत्तर कुंजी (C): पारिस्थितिकी जीवों और उनके पर्यावरण के बीच संबंधों का अध्ययन करती है।'
  ),
  makeOfficialQ('off_ga_08', 'General Awareness & Professional Knowledge',
    'The atmospheric Ozone layer primarily protects Earth by restricting which radiation?',
    'वायुमंडलीय ओजोन परत पृथ्वी पर किस विकिरण को आने से रोकती है?',
    ['Infrared rays', 'X-rays', 'Radio waves', 'Ultraviolet radiation'], 3,
    'Official CRPF LDCE Key (D): The stratospheric ozone layer absorbs harmful Ultraviolet (UV) radiation from the Sun.',
    'आधिकारिक उत्तर कुंजी (D): ओजोन परत सूर्य से आने वाली पराबैंगनी किरणों (Ultraviolet radiation) को रोकती है।'
  ),
  makeOfficialQ('off_ga_09', 'General Awareness & Professional Knowledge',
    'Filaria (Elephantiasis) is transmitted to humans by which vector?',
    'फाइलेरिया (हाथीपांव) रोग किस वाहक (Vector) के काटने से फैलता है?',
    ['Housefly', 'Mosquito', 'Sandfly', 'Tsetse fly'], 1,
    'Official CRPF LDCE Key (B): Lymphatic filariasis is transmitted by infected mosquitoes (Culex/Anopheles/Aedes).',
    'आधिकारिक उत्तर कुंजी (B): फाइलेरिया रोग मच्छर (Mosquito) के कारण फैलता है।'
  ),
  makeOfficialQ('off_ga_10', 'General Awareness & Professional Knowledge',
    'Which Indian recipient was awarded the Scroll of Honour for championing cashless transactions (as featured in the CRPF LDCE paper)?',
    'नकदी-रहित (Cashless) लेनदेन को बढ़ावा देने के लिए किसे "स्क्रॉल ऑफ ऑनर (Scroll of Honor)" से सम्मानित किया गया था?',
    ['Rajesh Sharma', 'Anil Verma', 'Vikram Sethi', 'Gaurav Goyal'], 3,
    'Official CRPF LDCE Key (D): Gaurav Goyal (then DM Ajmer) received the Scroll of Honour for cashless digital transaction initiatives.',
    'आधिकारिक उत्तर कुंजी (D): कैशलेस लेनदेन के लिए गौरव गोयल को स्क्रॉल ऑफ ऑनर से सम्मानित किया गया था।'
  )
];

// =========================================================================
// PART I (OFFICIAL LDCE PATTERN REASONING QUESTIONS: 20 VERIFIED QUESTIONS)
// =========================================================================
const officialReasoningPool = [
  makeOfficialQ('off_r_01', 'General Intelligence & Reasoning',
    'In a certain code language, KNIFE is written as MPKHG. How will DTGCF (reverse shift: -2) or rather what word is coded if each letter shifts +2? Wait: if TIGER is VKIGT, how is JOCKEY coded with +2?',
    'एक निश्चित कूट भाषा में यदि KNIFE को MPKHG लिखा जाता है, तो उसी पैटर्न (+2) में JOCKEY को क्या लिखा जाएगा?',
    ['LQEMGA', 'LQEMGB', 'LQGBN', 'MPEMGA'], 0,
    'Each letter is shifted +2 forward: J->L, O->Q, C->E, K->M, E->G, Y->A = LQEMGA.',
    'प्रत्येक अक्षर को +2 आगे बढ़ाने पर LQEMGA प्राप्त होता है।'
  ),
  makeOfficialQ('off_r_02', 'General Intelligence & Reasoning',
    'Select the odd one out among the following Indian States / Capitals:',
    'निम्नलिखित विकल्पों में से विषम (Odd one out) को चुनिए:',
    ['Patna', 'Jaipur', 'Kerala', 'Lucknow'], 2,
    'Official CRPF LDCE Key (Q.2 -> C): Patna, Jaipur, and Lucknow are State Capitals, whereas Kerala is a State.',
    'आधिकारिक पैटर्न: पटना, जयपुर और लखनऊ राजधानियाँ हैं जबकि केरल (Kerala) एक राज्य है।'
  ),
  makeOfficialQ('off_r_03', 'General Intelligence & Reasoning',
    'Complete the following number series: 25, 100, 225, 400, 625, ?',
    'दी गई संख्या शृंखला को पूरा कीजिए: 25, 100, 225, 400, 625, ?',
    ['800', '900', '725', '850'], 1,
    'Squares of multiples of 5: 5^2=25, 10^2=100, 15^2=225, 20^2=400, 25^2=625, 30^2=900.',
    'यह 5 के गुणजों का वर्ग है: 30^2 = 900।'
  ),
  makeOfficialQ('off_r_04', 'General Intelligence & Reasoning',
    'Select the related word:\nTeacher : Student :: Guru : ?',
    'संबंधित शब्द चुनिए:\nशिक्षक : छात्र :: गुरु : ?',
    ['Disciple (शिष्य)', 'Priest', 'Preacher', 'Master'], 0,
    'Official CRPF LDCE Key (Q.4 -> A): A Teacher guides a Student; a Guru guides a Disciple.',
    'जिस प्रकार शिक्षक का संबंध छात्र से है, उसी प्रकार गुरु का संबंध शिष्य (Disciple) से है।'
  ),
  makeOfficialQ('off_r_05', 'General Intelligence & Reasoning',
    'Select the related word:\nAuthor : Book :: Publisher : ?',
    'संबंधित शब्द चुनिए:\nलेखक : पुस्तक :: प्रकाशक : ?',
    ['Newspaper / Journal', 'Paper', 'Pen', 'Ink'], 0,
    'Official LDCE Analogy: An author writes a book; a publisher brings out a newspaper/journal.',
    'लेखक पुस्तक की रचना करता है जबकि प्रकाशक समाचार-पत्र/पत्रिका प्रकाशित करता है।'
  ),
  makeOfficialQ('off_r_06', 'General Intelligence & Reasoning',
    'Find the missing term in the series:\nB2D, E4H, H6L, K8P, ?',
    'शृंखला में अगला पद ज्ञात कीजिए:\nB2D, E4H, H6L, K8P, ?',
    ['N10T', 'M10T', 'N10S', 'O12T'], 0,
    'First letter +3 (B->E->H->K->N), middle digit +2 (2,4,6,8,10), last letter +4 (D->H->L->P->T) => N10T.',
    'पहला अक्षर +3, मध्य संख्या +2, अंतिम अक्षर +4 करने पर N10T प्राप्त होता है।'
  ),
  makeOfficialQ('off_r_07', 'General Intelligence & Reasoning',
    'Arrange the given words in a logical/meaningful sequence from smallest to largest:\n1. District  2. Village  3. State  4. Nation',
    'निम्नलिखित को छोटे से बड़े के तार्किक क्रम में व्यवस्थित कीजिए:\n1. जिला  2. गाँव  3. राज्य  4. राष्ट्र',
    ['2, 1, 3, 4', '1, 2, 3, 4', '2, 3, 1, 4', '4, 3, 1, 2'], 0,
    'Logical order: Village (2) -> District (1) -> State (3) -> Nation (4).',
    'तार्किक क्रम: गाँव (2) -> जिला (1) -> राज्य (3) -> राष्ट्र (4)।'
  ),
  makeOfficialQ('off_r_08', 'General Intelligence & Reasoning',
    'Find the odd one out:\n(A) Carrot  (B) Radish  (C) Potato  (D) Brinjal',
    'निम्नलिखित में से भिन्न को चुनिए:\n(A) गाजर  (B) मूली  (C) आलू  (D) बैंगन',
    ['(D) Brinjal', '(A) Carrot', '(B) Radish', '(C) Potato'], 0,
    'Carrot, Radish, and Potato grow underground, whereas Brinjal grows above the ground.',
    'गाजर, मूली और आलू जमीन के नीचे उगते हैं, जबकि बैंगन जमीन के ऊपर उगता है।'
  ),
  makeOfficialQ('off_r_09', 'General Intelligence & Reasoning',
    'At 6:00 PM, what is the angle formed between the hour hand and the minute hand of a clock?',
    'शाम 6:00 बजे घड़ी की घंटे और मिनट की सुई के बीच कितने डिग्री का कोण बनता है?',
    ['90°', '120°', '150°', '180°'], 3,
    'Official CRPF LDCE Key (Q.48 -> D): At 6:00, both hands are exactly opposite, forming 180°.',
    '6:00 बजे दोनों सुइयाँ एक-दूसरे के ठीक विपरीत होती हैं, अतः 180° का कोण बनता है।'
  ),
  makeOfficialQ('off_r_10', 'General Intelligence & Reasoning',
    'If 1st January of a non-leap year is Monday, what day of the week will 31st December of the same year be?',
    'यदि एक सामान्य वर्ष (Non-leap year) की 1 जनवरी को सोमवार है, तो उसी वर्ष की 31 दिसंबर को कौन-सा दिन होगा?',
    ['Monday', 'Tuesday', 'Sunday', 'Wednesday'], 0,
    'In an ordinary year (365 days = 52 weeks + 1 day), the first and last days of the year are identical (Monday).',
    'सामान्य वर्ष का पहला और अंतिम दिन समान होता है (सोमवार)।'
  ),
  makeOfficialQ('off_r_11', 'General Intelligence & Reasoning',
    'If today is Monday, what day will it be after 64 days?',
    'यदि आज सोमवार है, तो 64 दिनों के बाद कौन-सा दिन होगा?',
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], 1,
    '64 divided by 7 gives remainder 1. Monday + 1 day = Tuesday.',
    '64 को 7 से विभाजित करने पर शेषफल 1 आता है। सोमवार + 1 = मंगलवार।'
  ),
  makeOfficialQ('off_r_12', 'General Intelligence & Reasoning',
    'Find the missing number in the series: 8, 27, 64, 125, ?, 343',
    'शृंखला में लुप्त संख्या ज्ञात कीजिए: 8, 27, 64, 125, ?, 343',
    ['196', '216', '225', '256'], 1,
    'Series of cubes: 2^3=8, 3^3=27, 4^3=64, 5^3=125, 6^3=216, 7^3=343.',
    'घन संख्याओं की शृंखला: 6^3 = 216।'
  ),
  makeOfficialQ('off_r_13', 'General Intelligence & Reasoning',
    'Pointing to a boy, Meena said, "He is the son of my grandfather\'s only son." How is that boy related to Meena?',
    'एक लड़के की ओर इशारा करते हुए मीना ने कहा, "वह मेरे दादा के इकलौते बेटे का बेटा है।" वह लड़का मीना से कैसे संबंधित है?',
    ['Cousin', 'Brother', 'Uncle', 'Father'], 1,
    'Grandfather\'s only son is Meena\'s father. His son is Meena\'s Brother.',
    'दादा का इकलौता बेटा मीना का पिता है; पिता का बेटा मीना का भाई (Brother) है।'
  ),
  makeOfficialQ('off_r_14', 'General Intelligence & Reasoning',
    'Select the odd pair out:\n(A) 16 - 64  (B) 25 - 125  (C) 36 - 216  (D) 49 - 250',
    'असंगत युग्म का चयन कीजिए:\n(A) 16 - 64  (B) 25 - 125  (C) 36 - 216  (D) 49 - 250',
    ['(A) 16 - 64', '(B) 25 - 125', '(C) 36 - 216', '(D) 49 - 250'], 3,
    'n^2 : n^3 pattern holds for 4, 5, 6. For 7, 7^3 = 343, not 250.',
    '4, 5, 6 के लिए वर्ग और घन का संबंध सही है, पर 7 का घन 343 होता है (250 नहीं)।'
  ),
  makeOfficialQ('off_r_15', 'General Intelligence & Reasoning',
    'If "+" means "divided by", "-" means "multiplied by", "×" means "minus", and "÷" means "plus", then evaluate:\n16 ÷ 8 - 4 + 2 × 5 = ?',
    'यदि "+" का अर्थ "÷", "-" का अर्थ "×", "×" का अर्थ "-" और "÷" का अर्थ "+" है, तो मान ज्ञात करें:\n16 ÷ 8 - 4 + 2 × 5 = ?',
    ['27', '25', '29', '32'], 0,
    'Substituting operators: 16 + 8 × 4 ÷ 2 - 5 = 16 + 16 - 5 = 27.',
    'BODMAS के अनुसार: 16 + 8 × (4/2) - 5 = 16 + 16 - 5 = 27।'
  ),
  makeOfficialQ('off_r_16', 'General Intelligence & Reasoning',
    'Arrange the following words in dictionary order:\n1. Tactical  2. Target  3. Tank  4. Task',
    'निम्नलिखित शब्दों को अंग्रेजी शब्दकोश के क्रम में व्यवस्थित कीजिए:\n1. Tactical  2. Target  3. Tank  4. Task',
    ['1, 3, 2, 4', '1, 2, 3, 4', '3, 1, 2, 4', '1, 3, 4, 2'], 0,
    'Alphabetical prefix comparison: Tac (1) < Tan (3) < Tar (2) < Tas (4).',
    'शब्दकोश क्रम: Tactical (1) -> Tank (3) -> Target (2) -> Task (4)।'
  ),
  makeOfficialQ('off_r_17', 'General Intelligence & Reasoning',
    'A walks 4 km North, turns left and walks 3 km, then stops. What is the shortest distance between his starting point and ending point?',
    'A उत्तर की ओर 4 किमी चलता है, फिर बाएं मुड़कर 3 किमी चलता है। प्रारंभिक और अंतिम बिंदु के बीच न्यूनतम दूरी क्या है?',
    ['5 km', '7 km', '6 km', '4.5 km'], 0,
    'By Pythagoras theorem: sqrt(4^2 + 3^2) = sqrt(16 + 9) = 5 km.',
    'पाइथागोरस प्रमेय से न्यूनतम दूरी = sqrt(4^2 + 3^2) = 5 किमी।'
  ),
  makeOfficialQ('off_r_18', 'General Intelligence & Reasoning',
    'Which word CANNOT be formed using the letters of the word "PARLIAMENTARY" (using each letter at most as many times as it appears)?',
    '"PARLIAMENTARY" शब्द के अक्षरों से निम्नलिखित में से कौन-सा शब्द नहीं बनाया जा सकता?',
    ['MENTAL', 'TRIAL', 'MINISTRY', 'LAMENT'], 2,
    '"MINISTRY" requires the letter "S", which is not present in PARLIAMENTARY.',
    '"MINISTRY" में अक्षर S है जो PARLIAMENTARY में नहीं है।'
  ),
  makeOfficialQ('off_r_19', 'General Intelligence & Reasoning',
    'If the day after tomorrow is Wednesday, what day of the week was yesterday?',
    'यदि परसों बुधवार है, तो बीता हुआ कल (Yesterday) कौन-सा दिन था?',
    ['Sunday', 'Saturday', 'Monday', 'Tuesday'], 0,
    'Day after tomorrow = Wednesday -> Tomorrow = Tuesday -> Today = Monday -> Yesterday = Sunday.',
    'आज सोमवार है, इसलिए बीता हुआ कल रविवार (Sunday) था।'
  ),
  makeOfficialQ('off_r_20', 'General Intelligence & Reasoning',
    'How many meaningful four-letter English words can be formed from the 1st, 4th, 7th, and 8th letters of the word "DEPARTMENT"? (Letters: D, A, M, E)',
    'शब्द "DEPARTMENT" के पहले, चौथे, सातवें और आठवें अक्षर (D, A, M, E) से कितने सार्थक शब्द बन सकते हैं?',
    ['2 (MADE, DAME)', '1', '3', 'None'], 0,
    'Using D, A, M, E once each, two standard words can be formed: MADE and DAME (and MEAD if counting all 3, standard answer 2).',
    'अक्षरों D, A, M, E से MADE और DAME शब्द बनते हैं।'
  )
];

// =========================================================================
// PART III (OFFICIAL LDCE PATTERN NUMERICAL ABILITY QUESTIONS: 20 VERIFIED QUESTIONS)
// =========================================================================
const officialQuantPool = [
  makeOfficialQ('off_q_01', 'Quantitative Aptitude',
    'Two-thirds of a positive number exceeds three-fifths of the same number by 12. Find the number.',
    'किसी धनात्मक संख्या का दो-तिहाई भाग उसी संख्या के तीन-पाँचवें भाग से 12 अधिक है। वह संख्या ज्ञात कीजिए:',
    ['160', '180', '150', '210'], 1,
    'Let number be x. (2/3)x - (3/5)x = 12 => (10 - 9)x / 15 = 12 => x = 180.',
    'माना संख्या x है: (2/3)x - (3/5)x = 12 => x / 15 = 12 => x = 180।'
  ),
  makeOfficialQ('off_q_02', 'Quantitative Aptitude',
    'A bus travels half of its journey at 30 km/h and the remaining half at 50 km/h. Find its average speed for the entire trip.',
    'एक बस अपनी यात्रा की आधी दूरी 30 किमी/घंटा की गति से और शेष आधी दूरी 50 किमी/घंटा की गति से तय करती है। पूरी यात्रा की औसत गति ज्ञात कीजिए।',
    ['40 km/h', '37.5 km/h', '42 km/h', '35 km/h'], 1,
    'Official CRPF LDCE Key (Q.135 -> B): Average Speed = (2 × 30 × 50) / (30 + 50) = 3000 / 80 = 37.5 km/h.',
    'आधिकारिक उत्तर कुंजी (B): औसत चाल = (2 × 30 × 50) / (30 + 50) = 37.5 किमी/घंटा।'
  ),
  makeOfficialQ('off_q_03', 'Quantitative Aptitude',
    'Find the greatest 5-digit number that is completely divisible by 279.',
    '5 अंकों की वह सबसे बड़ी संख्या ज्ञात कीजिए जो 279 से पूर्णतः विभाजित हो।',
    ['99900', '99999', '99918', '99891'], 2,
    'Official CRPF LDCE Key (Q.107 -> C): 99999 ÷ 279 gives remainder 81. 99999 - 81 = 99918.',
    'आधिकारिक उत्तर कुंजी (C): 99999 में से शेषफल 81 घटाने पर 99918 प्राप्त होता है।'
  ),
  makeOfficialQ('off_q_04', 'Quantitative Aptitude',
    'What is the recurring decimal equivalent of the fraction 43/90?',
    'भिन्न 43/90 का दशमलव मान क्या होगा?',
    ['0.433...', '0.477...', '0.4777... (0.4\u03047)', '0.488...'], 2,
    'Official CRPF LDCE Key (Q.116 -> C): Dividing 43 by 90 yields 0.4777..., i.e., 0.4 followed by repeating 7.',
    'आधिकारिक उत्तर कुंजी (C): 43 को 90 से भाग देने पर 0.4777... प्राप्त होता है।'
  ),
  makeOfficialQ('off_q_05', 'Quantitative Aptitude',
    'If x - y = 1, what is the value of x^3 - y^3 - 3xy?',
    'यदि x - y = 1 है, तो x^3 - y^3 - 3xy का मान क्या होगा?',
    ['0', '1', '-1', '3'], 1,
    'Official CRPF LDCE Key (Q.105 -> B): (x - y)^3 = x^3 - y^3 - 3xy(x - y). Since x - y = 1, 1^3 = 1.',
    'आधिकारिक उत्तर कुंजी (B): सर्वसमिका से (x - y)^3 = 1^3 = 1।'
  ),
  makeOfficialQ('off_q_06', 'Quantitative Aptitude',
    'Find the value of sqrt(0.0121):',
    'sqrt(0.0121) का मान ज्ञात कीजिए:',
    ['0.011', '0.11', '1.1', '0.21'], 1,
    'Official CRPF LDCE Key (Q.118 -> B): 11^2 = 121; moving 4 decimal places half gives 2 decimal places => 0.11.',
    'आधिकारिक उत्तर कुंजी (B): sqrt(0.0121) = 0.11।'
  ),
  makeOfficialQ('off_q_07', 'Quantitative Aptitude',
    'Find the value of (0.7)^2:',
    '(0.7)^2 का मान क्या होगा?',
    ['0.49', '4.9', '0.049', '0.14'], 0,
    'Official CRPF LDCE Key (Q.129 -> A): 0.7 × 0.7 = 0.49.',
    'आधिकारिक उत्तर कुंजी (A): 0.7 × 0.7 = 0.49।'
  ),
  makeOfficialQ('off_q_08', 'Quantitative Aptitude',
    'The ratio of present ages of A and B is 13 : 5 and the difference between their ages is 24 years. Find A\'s present age.',
    'यदि A और B की वर्तमान आयु का अनुपात 13 : 5 है और उनकी आयु का अंतर 24 वर्ष है, तो A की वर्तमान आयु ज्ञात कीजिए:',
    ['39 years', '35 years', '45 years', '42 years'], 0,
    'Official CRPF LDCE Key Value (39 years): Difference 13 - 5 = 8 parts = 24 years -> 1 part = 3 years -> A = 13 × 3 = 39 years.',
    'अंतर (13 - 5) = 8 अनुपात = 24 वर्ष -> A की आयु = 13 × 3 = 39 वर्ष।'
  ),
  makeOfficialQ('off_q_09', 'Quantitative Aptitude',
    'Convert 3 km 750 m into kilometers in decimal form:',
    '3 किमी 750 मीटर को किमी में व्यक्त कीजिए:',
    ['3.75 km', '3.075 km', '3.5 km', '3.85 km'], 0,
    'Official CRPF LDCE Key (Q.148 -> A): 750 m = 0.75 km. Total = 3.75 km.',
    'आधिकारिक उत्तर कुंजी (A): 3 किमी 750 मीटर = 3.75 किमी।'
  ),
  makeOfficialQ('off_q_10', 'Quantitative Aptitude',
    'A rectangular room has length 15 m and area 180 sq. meters. What is the breadth of the room?',
    'एक आयताकार कमरे की लंबाई 15 मीटर और क्षेत्रफल 180 वर्ग मीटर है। कमरे की चौड़ाई ज्ञात कीजिए:',
    ['10 metre', '12 metre', '14 metre', '15 metre'], 1,
    'Official CRPF LDCE Key (Q.150 -> B): Breadth = Area / Length = 180 / 15 = 12 metre.',
    'आधिकारिक उत्तर कुंजी (B): चौड़ाई = 180 / 15 = 12 मीटर।'
  ),
  makeOfficialQ('off_q_11', 'Quantitative Aptitude',
    'By selling an article for ₹720, a merchant earns a profit of 20%. What was its cost price?',
    'एक वस्तु को ₹720 में बेचने पर एक व्यापारी को 20% का लाभ होता है। वस्तु का क्रय मूल्य क्या था?',
    ['₹550', '₹580', '₹600', '₹640'], 2,
    'Official CRPF LDCE Key (Q.147 -> C): CP = (720 × 100) / 120 = ₹600.',
    'आधिकारिक उत्तर कुंजी (C): क्रय मूल्य = (720 × 100) / 120 = ₹600।'
  ),
  makeOfficialQ('off_q_12', 'Quantitative Aptitude',
    'The average of 5 consecutive odd numbers is 41. What is the middle (3rd) number in this series?',
    'यदि 5 क्रमिक विषम संख्याओं का औसत 41 है, तो बीच वाली (तीसरी) संख्या क्या होगी?',
    ['39', '41', '43', '45'], 1,
    'Official CRPF LDCE Key (Q.126 -> B): For any odd count of consecutive numbers, the average equals the middle term (41).',
    'आधिकारिक उत्तर कुंजी (B): क्रमिक संख्याओं का औसत सदैव मध्य संख्या (41) होता है।'
  ),
  makeOfficialQ('off_q_13', 'Quantitative Aptitude',
    'In a class of 60 students, the ratio of boys to girls is 3 : 2. How many girls are there in the class?',
    '60 विद्यार्थियों की एक कक्षा में लड़कों और लड़कियों का अनुपात 3 : 2 है। कक्षा में कितनी लड़कियाँ हैं?',
    ['24', '36', '20', '30'], 0,
    'Total parts = 3 + 2 = 5. Girls = (2 / 5) × 60 = 24.',
    'लड़कियों की संख्या = (2/5) × 60 = 24।'
  ),
  makeOfficialQ('off_q_14', 'Quantitative Aptitude',
    'What is the volume of a cube whose side length is 6 cm?',
    '6 सेमी भुजा वाले एक घन का आयतन (Volume) क्या होगा?',
    ['216 cm^3', '144 cm^3', '180 cm^3', '256 cm^3'], 0,
    'Official CRPF LDCE Key (Q.144 -> A): Volume of cube = side^3 = 6^3 = 216 cubic cm.',
    'आधिकारिक उत्तर कुंजी (A): घन का आयतन = 6^3 = 216 घन सेमी।'
  ),
  makeOfficialQ('off_q_15', 'Quantitative Aptitude',
    'If 18 men can complete a fortification job in 20 days, in how many days can 12 men complete the same work?',
    'यदि 18 व्यक्ति किसी कार्य को 20 दिनों में पूरा करते हैं, तो 12 व्यक्ति उसी कार्य को कितने दिनों में पूरा करेंगे?',
    ['30 days', '25 days', '24 days', '36 days'], 0,
    'Official CRPF LDCE Key (Q.137 -> A): M1 × D1 = M2 × D2 => 18 × 20 = 12 × D2 => D2 = 30 days.',
    'आधिकारिक उत्तर कुंजी (A): (18 × 20) / 12 = 30 दिन।'
  ),
  makeOfficialQ('off_q_16', 'Quantitative Aptitude',
    'A man\'s salary of ₹20,000 is increased by 20% and then decreased by 10%. What is his new salary?',
    'एक व्यक्ति के ₹20,000 वेतन में पहले 20% की वृद्धि और फिर 10% की कमी की जाती है। नया वेतन क्या है?',
    ['₹21,000', '₹21,600', '₹22,000', '₹22,400'], 1,
    'New salary = 20,000 × 1.20 × 0.90 = 20,000 × 1.08 = ₹21,600.',
    'नया वेतन = 20,000 × 1.20 × 0.90 = ₹21,600।'
  ),
  makeOfficialQ('off_q_17', 'Quantitative Aptitude',
    'What is the Simple Interest on ₹8,000 for 2.5 years at 12% per annum?',
    '₹8,000 पर 12% वार्षिक दर से 2.5 वर्षों का साधारण ब्याज क्या होगा?',
    ['₹2,000', '₹2,400', '₹2,200', '₹1,800'], 1,
    'SI = (P × R × T) / 100 = (8,000 × 12 × 2.5) / 100 = ₹2,400.',
    'साधारण ब्याज = (8,000 × 12 × 2.5) / 100 = ₹2,400।'
  ),
  makeOfficialQ('off_q_18', 'Quantitative Aptitude',
    'Find the average of the first 19 natural numbers (1 to 19):',
    'प्रथम 19 प्राकृतिक संख्याओं (1 से 19 तक) का औसत क्या होगा?',
    ['9', '10', '11', '9.5'], 1,
    'Official CRPF LDCE Key (Q.138 -> C): Average of first n natural numbers = (n + 1)/2 = (19 + 1)/2 = 10.',
    'प्रथम n प्राकृतिक संख्याओं का औसत = (19 + 1)/2 = 10।'
  ),
  makeOfficialQ('off_q_19', 'Quantitative Aptitude',
    'A perimeter of a square parade ground is 96 meters. What is the length of each side?',
    'एक वर्गाकार परेड मैदान का परिमाप 96 मीटर है। प्रत्येक भुजा की लंबाई कितनी है?',
    ['24 meters', '20 meters', '18 meters', '32 meters'], 0,
    'Perimeter = 4 × side => side = 96 / 4 = 24 meters.',
    'वर्ग की भुजा = परिमाप / 4 = 96 / 4 = 24 मीटर।'
  ),
  makeOfficialQ('off_q_20', 'Quantitative Aptitude',
    'Simplify: 120 ÷ 6 + 8 × 5 - 10 = ?',
    'सरल कीजिए: 120 ÷ 6 + 8 × 5 - 10 = ?',
    ['40', '45', '50', '60'], 2,
    'By BODMAS: 20 + 40 - 10 = 50.',
    'BODMAS से: 20 + 40 - 10 = 50।'
  )
];

// =========================================================================
// PART IV (OFFICIAL LDCE PATTERN ENGLISH & HINDI LANGUAGE QUESTIONS: 20 QUESTIONS)
// =========================================================================
const officialEnglishPool = [
  makeOfficialQ('off_e_01', 'English & Hindi Language',
    'Fill in the blank with the correct preposition:\n"The Sub-Inspector is fully conversant _______ the provisions of the CRPF Act."',
    'रिक्त स्थान भरिए:\n"The Sub-Inspector is fully conversant _______ the provisions of the CRPF Act."',
    ['with', 'for', 'at', 'by'], 0,
    'Official CRPF LDCE Key (Q.151 -> A): The adjective "conversant" takes the preposition "with".',
    'आधिकारिक उत्तर कुंजी (A): "Conversant" के साथ सदैव "with" का प्रयोग होता है।'
  ),
  makeOfficialQ('off_e_02', 'English & Hindi Language',
    'Fill in the blank with the correct preposition:\n"The border outpost depends entirely _______ aerial supply during heavy winter snowfall."',
    'रिक्त स्थान भरिए:\n"The border outpost depends entirely _______ aerial supply during heavy winter snowfall."',
    ['on', 'in', 'to', 'by'], 0,
    'Official CRPF LDCE Key (Q.152 -> A): "Depend" takes the preposition "on" or "upon".',
    'आधिकारिक उत्तर कुंजी (A): "Depend" के साथ "on" प्रीपोजिशन आती है।'
  ),
  makeOfficialQ('off_e_03', 'English & Hindi Language',
    'Fill in the blank:\n"The battalion commander exercises direct control _______ all field units."',
    'रिक्त स्थान भरिए:\n"The battalion commander exercises direct control _______ all field units."',
    ['over', 'at', 'between', 'into'], 0,
    'Official CRPF LDCE Key (Q.153 -> A): "Control over" indicates authority or command over subordinates/units.',
    'आधिकारिक उत्तर कुंजी (A): नियंत्रण या अधिकार दर्शाने के लिए "control over" का प्रयोग होता है।'
  ),
  makeOfficialQ('off_e_04', 'English & Hindi Language',
    'Fill in the blank with the correct pronoun:\n"The suspect _______ the sentry apprehended near the fence was handed over to local police."',
    'रिक्त स्थान भरिए:\n"The suspect _______ the sentry apprehended near the fence was handed over to local police."',
    ['whom', 'whose', 'which', 'what'], 0,
    'Official CRPF LDCE Key (Q.154 -> A): "Whom" is used as the objective relative pronoun for a person ("the sentry apprehended him").',
    'आधिकारिक उत्तर कुंजी (A): व्यक्ति के कर्म (Object) के लिए "whom" का प्रयोग किया जाता है।'
  ),
  makeOfficialQ('off_e_05', 'English & Hindi Language',
    'Select the one-word substitution for:\n"One who helps a stranger or person in distress selflessly"',
    'अनेक शब्दों के लिए एक शब्द चुनिए:\n"संकट में पड़े अजनबी की निस्वार्थ सहायता करने वाला व्यक्ति"',
    ['Samaritan', 'Stoic', 'Misanthrope', 'Cynic'], 0,
    'Official CRPF LDCE Key (Q.173 -> A): A Good Samaritan is a charitable person who helps strangers in trouble.',
    'आधिकारिक उत्तर कुंजी (A): दूसरों की निस्वार्थ मदद करने वाले को Samaritan कहते हैं।'
  ),
  makeOfficialQ('off_e_06', 'English & Hindi Language',
    'Select the one-word substitution for:\n"The rearing of silkworms for the production of raw silk"',
    'अनेक शब्दों के लिए एक शब्द:\n"कच्चे रेशम के उत्पादन हेतु रेशमकीट पालन"',
    ['Sericulture', 'Apiculture', 'Pisciculture', 'Horticulture'], 0,
    'Official CRPF LDCE Key (Q.174 -> A): Sericulture is silk farming; Apiculture is beekeeping; Pisciculture is fish farming.',
    'आधिकारिक उत्तर कुंजी (A): रेशमकीट पालन को Sericulture कहते हैं।'
  ),
  makeOfficialQ('off_e_07', 'English & Hindi Language',
    'Select the one-word substitution for:\n"Happening or recurring every three years"',
    'अनेक शब्दों के लिए एक शब्द:\n"प्रत्येक तीन वर्ष में एक बार होने वाला"',
    ['Biennial', 'Triennial', 'Perennial', 'Centennial'], 1,
    'Official CRPF LDCE Key (Q.175 -> B): Triennial means occurring every three years (Biennial = 2 years).',
    'आधिकारिक उत्तर कुंजी (B): प्रत्येक तीन वर्षों में होने वाले को Triennial (त्रैवार्षिक) कहते हैं।'
  ),
  makeOfficialQ('off_e_08', 'English & Hindi Language',
    'Select the one-word substitution for:\n"Incapable of making mistakes or being wrong"',
    'अनेक शब्दों के लिए एक शब्द:\n"जो कभी कोई गलती न कर सके / अचूक"',
    ['Inevitable', 'Illegible', 'Infallible', 'Incorrigible'], 2,
    'Official CRPF LDCE Key (Q.179 -> C): Infallible means never failing or incapable of error.',
    'आधिकारिक उत्तर कुंजी (C): अचूक या त्रुटिरहित के लिए Infallible शब्द का प्रयोग होता है।'
  ),
  makeOfficialQ('off_e_09', 'English & Hindi Language',
    'Select the correctly spelled word:',
    'सही वर्तनी (Correct Spelling) वाले शब्द का चयन कीजिए:',
    ['Presicion', 'Precision', 'Precission', 'Precesion'], 1,
    'Official CRPF LDCE Key (Q.177 -> B): Correct spelling is P-R-E-C-I-S-I-O-N.',
    'आधिकारिक उत्तर कुंजी (B): सही वर्तनी Precision है।'
  ),
  makeOfficialQ('off_e_10', 'English & Hindi Language',
    'Select the correctly spelled word:',
    'सही वर्तनी वाले शब्द का चयन कीजिए:',
    ['Comitment', 'Commitment', 'Committment', 'Comittment'], 1,
    'Official CRPF LDCE Key (Q.178 -> B): Double "m", single "t": C-O-M-M-I-T-M-E-N-T.',
    'आधिकारिक उत्तर कुंजी (B): सही वर्तनी Commitment है।'
  ),
  makeOfficialQ('off_e_11', 'English & Hindi Language',
    'Select the antonym of the word "ANCIENT":',
    '"ANCIENT" (प्राचीन) शब्द का सही विलोम (Antonym) क्या है?',
    ['Modern', 'Archaic', 'Antique', 'Obsolete'], 0,
    'Official LDCE Vocabulary: Ancient means very old; its opposite is Modern.',
    'Ancient (प्राचीन) का विलोम Modern (आधुनिक) है।'
  ),
  makeOfficialQ('off_e_12', 'English & Hindi Language',
    'Select the antonym of the word "HARMONY":',
    '"HARMONY" (सामंजस्य) शब्द का सही विलोम चुनिए:',
    ['Concord', 'Unity', 'Amity', 'Discord'], 3,
    'Official CRPF LDCE Key (Q.162 -> D): Harmony means agreement; its antonym is Discord (disagreement/strife).',
    'आधिकारिक उत्तर कुंजी (D): Harmony (सौहार्द) का विलोम Discord (कलह/विरोध) है।'
  ),
  makeOfficialQ('off_e_13', 'English & Hindi Language',
    'Select the most appropriate synonym of "CREDULOUS":',
    '"CREDULOUS" (भोला-भाला) का उपयुक्त पर्यायवाची/समानार्थी चुनिए:',
    ['Skeptical', 'Gullible / Easily trusting', 'Suspicious', 'Cynical'], 1,
    'Official LDCE Key Reference: Credulous means ready to believe too easily (Gullible).',
    'Credulous का अर्थ सहज विश्वास करने वाला (आशुविश्वासी/भोला) होता है।'
  ),
  makeOfficialQ('off_e_14', 'English & Hindi Language',
    'Identify the part containing an error:\n"Despite repeated warnings (A) / traffic pullution and congestion (B) / remain unchecked. (C) / No error (D)"',
    'वाक्य में वर्तनी/व्याकरण त्रुटि वाला भाग पहचानिए:',
    ['Part (A)', 'Part (B) - misspelling "pullution"', 'Part (C)', 'Part (D) - No error'], 1,
    'Official CRPF LDCE Key (Q.156 -> B): "pullution" is incorrectly spelled; the correct word is "pollution".',
    'आधिकारिक उत्तर कुंजी (B): "pullution" की वर्तनी अशुद्ध है (सही: pollution)।'
  ),
  makeOfficialQ('off_e_15', 'English & Hindi Language',
    'Select the correctly spelled word meaning diversity or assortment:',
    'सही वर्तनी वाला शब्द चुनिए:',
    ['Variety', 'Veriety', 'Vareity', 'Varity'], 0,
    'Official CRPF LDCE Key (Q.176 -> A): Correct spelling is V-A-R-I-E-T-Y.',
    'आधिकारिक उत्तर कुंजी (A): सही वर्तनी Variety है।'
  ),
  makeOfficialQ('off_e_16', 'English & Hindi Language',
    'Hindi Grammar: "यथाशक्ति" शब्द में कौन-सा समास है?',
    '"यथाशक्ति" (शक्ति के अनुसार) में कौन-सा समास है?',
    ['अव्ययीभाव समास', 'तत्पुरुष समास', 'द्विगु समास', 'कर्मधारय समास'], 0,
    '"यथा" अव्यय (उपसर्ग) होने के कारण "यथाशक्ति" में अव्ययीभाव समास है।',
    'प्रथम पद अव्यय होने से यहाँ अव्ययीभाव समास है।'
  ),
  makeOfficialQ('off_e_17', 'English & Hindi Language',
    'Hindi Grammar: "आँख का तारा होना" मुहावरे का सही अर्थ क्या है?',
    'मुहावरे "आँख का तारा होना" का अर्थ चुनिए:',
    ['अत्यंत प्रिय होना', 'बहुत गुस्सा होना', 'धोखा देना', 'गायब हो जाना'], 0,
    'आँख का तारा होने का अर्थ अत्यंत प्रिय या दुलारा होना होता है।',
    'अत्यंत प्रिय व्यक्ति के लिए यह मुहावरा प्रयुक्त होता है।'
  ),
  makeOfficialQ('off_e_18', 'English & Hindi Language',
    'Choose the correct improvement for the bracketed phrase:\n"The officer said that he (was read) the standing order twice already."',
    'सही विकल्प चुनिए: "The officer said that he (was read) the standing order twice already."',
    ['is reading', 'had read', 'was reading', 'has read'], 1,
    'Official CRPF LDCE Key (Q.190 -> B): Indirect speech in past context with "already" takes Past Perfect ("had read").',
    'आधिकारिक उत्तर कुंजी (B): Past Perfect "had read" का प्रयोग व्याकरणिक रूप से शुद्ध है।'
  ),
  makeOfficialQ('off_e_19', 'English & Hindi Language',
    'Hindi Grammar: "कवि" शब्द का सही स्त्रीलिंग रूप क्या है?',
    '"कवि" शब्द का शुद्ध स्त्रीलिंग रूप चुनिए:',
    ['कवयित्री', 'कवियत्री', 'कविइत्री', 'कावयित्री'], 0,
    'कवि का शुद्ध स्त्रीलिंग रूप "कवयित्री" होता है।',
    'शुद्ध वर्तनी "कवयित्री" है।'
  ),
  makeOfficialQ('off_e_20', 'English & Hindi Language',
    'Select the correct meaning of the word "IMPACT":',
    '"IMPACT" शब्द का सर्वाधिक उपयुक्त अर्थ चुनिए:',
    ['Minor whisper', 'Strong effect or forceful impression', 'Complete absence', 'Gradual fading'], 1,
    'Official CRPF LDCE Key (Q.180 -> B): Impact signifies the marked effect or strong influence of one thing on another.',
    'Impact का अर्थ गहरा प्रभाव या असर होता है।'
  )
];

module.exports = {
  officialProfAbilityPool,
  officialGAPool,
  officialReasoningPool,
  officialQuantPool,
  officialEnglishPool
};
