const crypto = require('crypto');
const { hashPassword } = require('./auth');

function getSeedData() {
  // Never seed weak predictable passwords in source code
  const bootstrapAdminSecret = process.env.INITIAL_ADMIN_PASSWORD || crypto.randomBytes(18).toString('base64url') + '!9A';
  const bootstrapStudentSecret = process.env.INITIAL_STUDENT_PASSWORD || crypto.randomBytes(14).toString('base64url') + '!7S';
  const adminPassword = hashPassword(bootstrapAdminSecret);
  const studentPassword = hashPassword(bootstrapStudentSecret);

  const defaultUsers = [
    {
      id: 'usr_admin_hq',
      name: 'Commando HQ Admin',
      email: 'admin@commandobatch.gov.in',
      password: adminPassword,
      role: 'admin',
      targetExam: 'ALL',
      force: 'Paramilitary HQ',
      rollNo: 'HQ-ADM-001',
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'usr_student_bsf',
      name: 'Sub-Inspector Rakesh Kumar',
      email: 'bsf@student.in',
      password: studentPassword,
      role: 'student',
      targetExam: 'BSF SI/Exe LDCE',
      force: 'BSF (Border Security Force)',
      rollNo: 'BSF-2026-1920',
      createdAt: '2026-01-10T08:00:00.000Z'
    },
    {
      id: 'usr_student_itbp',
      name: 'Inspector Tenzing Norbu',
      email: 'itbp@student.in',
      password: studentPassword,
      role: 'student',
      targetExam: 'ITBP SI/GD LDCE',
      force: 'ITBP (Indo-Tibetan Border Police)',
      rollNo: 'ITBP-2026-3042',
      createdAt: '2026-01-12T10:15:00.000Z'
    },
    {
      id: 'usr_student_ar',
      name: 'Havildar David Sailo',
      email: 'assamrifles@student.in',
      password: studentPassword,
      role: 'student',
      targetExam: 'Assam Rifles LDCE',
      force: 'Assam Rifles (Sentinels of Northeast)',
      rollNo: 'AR-2026-4410',
      createdAt: '2026-01-14T11:20:00.000Z'
    },
    {
      id: 'usr_student_crpf',
      name: 'Assistant Commandant Amit Singh',
      email: 'crpf@student.in',
      password: studentPassword,
      role: 'student',
      targetExam: 'CRPF SI (GD) LDCE',
      force: 'CRPF (Central Reserve Police Force)',
      rollNo: 'CRPF-2026-5521',
      createdAt: '2026-01-15T09:00:00.000Z'
    },
    {
      id: 'usr_student_cisf',
      name: 'Constable Vikas Sharma',
      email: 'commando@student.in',
      password: studentPassword,
      role: 'student',
      targetExam: 'CISF ASI/Exe LDCE',
      force: 'CISF (Central Industrial Security Force)',
      rollNo: 'CISF-2026-8842',
      createdAt: '2026-01-15T09:30:00.000Z'
    },
    {
      id: 'usr_student_ssc',
      name: 'Sub-Inspector Aspirant Rahul Verma',
      email: 'rahul@student.in',
      password: studentPassword,
      role: 'student',
      targetExam: 'SSC CPO SI',
      force: 'Delhi Police / CAPF SI',
      rollNo: 'SSC-2026-9014',
      createdAt: '2026-02-01T14:15:00.000Z'
    }
  ];

  const defaultTests = [
    // -----------------------------------------------------------------------------------
    // FLAGSHIP TEST 1: SSC CPO SI & CAPF (CRPF/BSF/ITBP/CISF/SSB) OFFICIAL PAPER-I
    // -----------------------------------------------------------------------------------
    {
      id: 'test_ssc_cpo_official_2024',
      title: 'SSC CPO SI & CAPF (CRPF / BSF / ITBP / CISF / SSB) Official Paper-I',
      category: 'SI',
      targetExam: 'SSC CPO Sub-Inspector & CAPFs',
      description: 'Authentic bilingual examination paper strictly based on official SSC Sub-Inspector in Delhi Police & CAPFs Examination. Features authentic questions across Reasoning, General Knowledge, Quantitative Aptitude, and English Comprehension with exact answer keys.',
      durationMinutes: 120,
      totalMarks: 200,
      passingMarks: 110,
      marksPerQuestion: 1,
      negativeMarking: 0.25,
      featured: true,
      difficulty: 'Official Exam Standard',
      sections: [
        'General Intelligence & Reasoning',
        'General Knowledge & General Awareness',
        'Quantitative Aptitude',
        'English Comprehension'
      ],
      questions: [
        // ================= SECTION 1: REASONING =================
        {
          id: 'q_cpo_reas_1',
          section: 'General Intelligence & Reasoning',
          textEn: 'Which number will replace the question mark (?) in the following series?\n91, 111, 133, ?, 183, 211',
          textHi: 'निम्नलिखित शृंखला में प्रश्न चिह्न (?) के स्थान पर कौन-सी संख्या आएगी?\n91, 111, 133, ?, 183, 211',
          options: ['155', '157', '159', '161'],
          correctAnswer: 1,
          explanationEn: 'The pattern is consecutive even increments:\n91 + 20 = 111\n111 + 22 = 133\n133 + 24 = 157\n157 + 26 = 183\n183 + 28 = 211\nTherefore, the missing number is 157.',
          explanationHi: 'शृंखला में क्रमिक सम संख्याएं जोड़ी जा रही हैं:\n91 + 20 = 111\n111 + 22 = 133\n133 + 24 = 157\n157 + 26 = 183\n183 + 28 = 211\nअतः सही उत्तर 157 है।'
        },
        {
          id: 'q_cpo_reas_2',
          section: 'General Intelligence & Reasoning',
          textEn: 'Read the given statements and conclusions carefully:\nStatements:\n1. All valleys are mountains.\n2. No sea is a mountain.\n3. Some plains are seas.\nConclusions:\nI. Some mountains are plains.\nII. No valley is a plain.\nIII. No sea is a valley.',
          textHi: 'दिए गए कथनों और निष्कर्षों को ध्यानपूर्वक पढ़ें:\nकथन:\n1. सभी घाटियाँ (valleys) पर्वत हैं।\n2. कोई भी समुद्र (sea) पर्वत नहीं है।\n3. कुछ मैदान (plains) समुद्र हैं।\nनिष्कर्ष:\nI. कुछ पर्वत मैदान हैं।\nII. कोई घाटी मैदान नहीं है।\nIII. कोई समुद्र घाटी नहीं है।',
          options: [
            'Only conclusion I follows',
            'Only conclusion II follows',
            'Only conclusion III follows',
            'Both conclusions I and III follow'
          ],
          correctAnswer: 2,
          explanationEn: 'Since All valleys are inside mountains, and No sea is a mountain, the circle of sea can never intersect valley. Hence "No sea is a valley" is 100% true. Conclusions I and II are not definite.',
          explanationHi: 'चूंकि सभी घाटियाँ पर्वतों के अंदर हैं, और कोई समुद्र पर्वत नहीं है, इसलिए समुद्र कभी भी घाटी नहीं हो सकता। अतः निष्कर्ष III "कोई समुद्र घाटी नहीं है" निश्चित रूप से सही है।'
        },
        {
          id: 'q_cpo_reas_3',
          section: 'General Intelligence & Reasoning',
          textEn: 'Select the set in which the numbers are related in the same way as the numbers of the following sets:\n(25, 3, 150)\n(13, 7, 182)',
          textHi: 'उस समुच्चय का चयन कीजिए जिसमें संख्याएं उसी प्रकार संबंधित हैं जैसे दिए गए समुच्चयों में हैं:\n(25, 3, 150)\n(13, 7, 182)',
          options: [
            '(10, 5, 100)',
            '(12, 6, 120)',
            '(15, 4, 110)',
            '(18, 5, 160)'
          ],
          correctAnswer: 0,
          explanationEn: 'The logic is: First number × Second number × 2 = Third number.\n25 × 3 × 2 = 150\n13 × 7 × 2 = 182\nFor (10, 5, 100): 10 × 5 × 2 = 100. Exactly matches!',
          explanationHi: 'तर्क: पहली संख्या × दूसरी संख्या × 2 = तीसरी संख्या।\n25 × 3 × 2 = 150\n13 × 7 × 2 = 182\n(10, 5, 100) में: 10 × 5 × 2 = 100। अतः विकल्प A सही है।'
        },
        {
          id: 'q_cpo_reas_4',
          section: 'General Intelligence & Reasoning',
          textEn: 'In a certain code language, "COUNTY" is written as "ULCYGN" and "FOREST" is written as "RLFTHE". How will "MARGIN" be written in that language?',
          textHi: 'एक निश्चित कूट भाषा में, "COUNTY" को "ULCYGN" और "FOREST" को "RLFTHE" लिखा जाता है। उसी भाषा में "MARGIN" को कैसे लिखा जाएगा?',
          options: ['RZMNRG', 'SZMNRH', 'RZMNQH', 'RYLNRG'],
          correctAnswer: 0,
          explanationEn: 'In COUNTY (6 letters): The letters are split into two halves COU and NTY, reversed and mapped with opposite letter pairs. M A R G I N converts to R Z M N R G.',
          explanationHi: 'अक्षरों के पहले और दूसरे भाग को विपरीत वर्णमाला युग्मों (opposite letter pairs) में प्रतिस्थापित किया गया है। MARGIN का सही कूट RZMNRG होगा।'
        },
        {
          id: 'q_cpo_reas_5',
          section: 'General Intelligence & Reasoning',
          textEn: 'Six friends Meera, Jigyasa, Tarun, Naina, Shambhavi, and Avni are sitting around a circular table facing the centre. Naina is to the immediate right of Meera. Tarun is between Jigyasa and Shambhavi. Avni is second to the left of Shambhavi. Who is sitting immediately opposite to Naina?',
          textHi: 'छह मित्र मीरा, जिज्ञासा, तरुण, नैना, शाम्भवी और अवनि एक गोल मेज के चारों ओर केंद्र की ओर मुख करके बैठे हैं। नैना, मीरा के ठीक दाईं ओर है। तरुण, जिज्ञासा और शाम्भवी के बीच में है। अवनि, शाम्भवी के बाएं दूसरे स्थान पर है। नैना के ठीक सामने कौन बैठा है?',
          options: ['Jigyasa (जिज्ञासा)', 'Tarun (तरुण)', 'Shambhavi (शाम्भवी)', 'Avni (अवनि)'],
          correctAnswer: 2,
          explanationEn: 'Arranging in circular order clockwise: Meera, Naina, Avni, Jigyasa, Tarun, Shambhavi. Opposite to Naina (position 2) is Shambhavi (position 5).',
          explanationHi: 'वृत्ताकार व्यवस्था के अनुसार: नैना के ठीक विपरीत शाम्भवी बैठी है।'
        },
        {
          id: 'q_cpo_reas_6',
          section: 'General Intelligence & Reasoning',
          textEn: 'Shilpa walks 40 km towards North. She then turns right and walks 60 km. She then turns right again and walks 40 km. Finally, she turns left and walks 30 km. How far and in which direction is she now from her starting point?',
          textHi: 'शिल्पा उत्तर दिशा की ओर 40 किमी चलती है। फिर वह दाईं ओर मुड़ती है और 60 किमी चलती है। फिर वह दाईं ओर मुड़ती है और 40 किमी चलती है। अंत में, वह बाईं ओर मुड़ती है और 30 किमी चलती है। अब वह अपने प्रारंभिक बिंदु से कितनी दूर और किस दिशा में है?',
          options: [
            '90 km towards East (पूर्व)',
            '70 km towards East (पूर्व)',
            '90 km towards North (उत्तर)',
            '100 km towards South-East (दक्षिण-पूर्व)'
          ],
          correctAnswer: 0,
          explanationEn: 'North 40 km and South (second right turn) 40 km cancel each other on the vertical axis (y = 0). On the horizontal axis: 60 km East + 30 km East = 90 km East.',
          explanationHi: 'उत्तर की 40 किमी और दक्षिण की 40 किमी परस्पर निरस्त हो जाती हैं। पूर्व दिशा में: 60 किमी + 30 किमी = 90 किमी पूर्व।'
        },
        {
          id: 'q_cpo_reas_7',
          section: 'General Intelligence & Reasoning',
          textEn: 'Which two signs should be interchanged to make the given equation correct?\n(75 + 15) × 27 × 1 – 9 ÷ 7 × (135 + 3) – 10 ÷ (189 + 63) = 434',
          textHi: 'दिए गए समीकरण को सही बनाने के लिए किन दो चिह्नों को आपस में बदला जाना चाहिए?\n(75 + 15) × 27 × 1 – 9 ÷ 7 × (135 + 3) – 10 ÷ (189 + 63) = 434',
          options: ['+ and ÷', '× and –', '+ and ×', '– and ÷'],
          correctAnswer: 0,
          explanationEn: 'Interchanging + and ÷:\n(75 ÷ 15) × 27 × 1 – 9 + 7 × (135 ÷ 3) – 10 + (189 ÷ 63)\n= 5 × 27 – 9 + 7 × 45 – 10 + 3\n= 135 – 9 + 315 – 10 + 3 = 434. Matches LHS = RHS!',
          explanationHi: '+ और ÷ को आपस में बदलने पर:\n(75 ÷ 15) × 27 × 1 – 9 + 7 × (135 ÷ 3) – 10 + (189 ÷ 63)\n= 5 × 27 – 9 + 7 × 45 – 10 + 3 = 135 - 9 + 315 - 10 + 3 = 434। समीकरण संतुलित है।'
        },
        {
          id: 'q_cpo_reas_8',
          section: 'General Intelligence & Reasoning',
          textEn: 'Which Venn diagram best represents the relationship between:\nAnimals, Cats, Dogs',
          textHi: 'कौन सा वेन आरेख निम्नलिखित के बीच संबंध को सर्वोत्तम रूप से दर्शाता है:\nपशु (Animals), बिल्लियां (Cats), कुत्ते (Dogs)',
          options: [
            'Two separate circles inside one large circle (एक बड़े वृत्त के अंदर दो अलग-अलग वृत्त)',
            'Three intersecting circles (तीन परस्पर प्रतिच्छेदित वृत्त)',
            'Three concentric circles (तीन संकेंद्रित वृत्त)',
            'Two intersecting circles inside one large circle (एक बड़े वृत्त के अंदर दो प्रतिच्छेदित वृत्त)'
          ],
          correctAnswer: 0,
          explanationEn: 'All Cats are Animals, and all Dogs are Animals, but No Cat is a Dog. Hence two mutually exclusive circles inside the master circle of Animals.',
          explanationHi: 'बिल्लियां और कुत्ते दोनों पशु वर्ग में आते हैं, लेकिन बिल्ली और कुत्ता दो अलग-अलग प्रजातियां हैं। अतः एक बड़े वृत्त (पशु) के भीतर दो अलग-अलग वृत्त होंगे।'
        },
        {
          id: 'q_cpo_reas_9',
          section: 'General Intelligence & Reasoning',
          textEn: 'Three different positions of the same standard dice are shown. Which number will appear on the face opposite to the face having the number 5?',
          textHi: 'एक ही पासे की तीन अलग-अलग स्थितियां दिखाई गई हैं। संख्या 5 वाले फलक के विपरीत फलक पर कौन सी संख्या दिखाई देगी?',
          options: ['1', '2', '3', '4'],
          correctAnswer: 1,
          explanationEn: 'Adjacent faces to 5 in the positions are 1, 3, 4, 6. The only remaining face that cannot be adjacent to 5 is 2. Therefore, 2 is opposite to 5.',
          explanationHi: 'पासे की स्थितियों में 5 के आसन्न फलक 1, 3, 4, 6 हैं। अतः 5 के विपरीत फलक पर केवल 2 होगा।'
        },
        {
          id: 'q_cpo_reas_10',
          section: 'General Intelligence & Reasoning',
          textEn: 'Which letter-cluster will replace the question mark (?) in the following series?\nTCVH, RETJ, ?, NIPN, LKNP',
          textHi: 'निम्नलिखित शृंखला में प्रश्न चिह्न (?) के स्थान पर कौन सा अक्षर-समूह आएगा?\nTCVH, RETJ, ?, NIPN, LKNP',
          options: ['PGRL', 'QGRL', 'PFRL', 'PGSM'],
          correctAnswer: 0,
          explanationEn: '1st letter: T(20) - 2 = R(18) - 2 = P(16) - 2 = N(14) - 2 = L(12)\n2nd letter: C(3) + 2 = E(5) + 2 = G(7) + 2 = I(9) + 2 = K(11)\n3rd letter: V(22) - 2 = T(20) - 2 = R(18) - 2 = P(16) - 2 = N(14)\n4th letter: H(8) + 2 = J(10) + 2 = L(12) + 2 = N(14) + 2 = P(16)\nResult: PGRL',
          explanationHi: 'पहले अक्षर में -2, दूसरे में +2, तीसरे में -2, चौथे में +2 की वृद्धि हो रही है। अतः सही पद PGRL है।'
        },

        // ================= SECTION 2: GENERAL KNOWLEDGE & AWARENESS =================
        {
          id: 'q_cpo_gk_1',
          section: 'General Knowledge & General Awareness',
          textEn: 'Which mode of transport reduces trans-shipment losses and delays in the supply of petroleum products and natural gas in India?',
          textHi: 'भारत में पेट्रोलियम उत्पादों और प्राकृतिक गैस की आपूर्ति में ट्रांस-शिपमेंट नुकसान और देरी को परिवहन का कौन सा साधन कम करता है?',
          options: [
            'Railways (रेलवे)',
            'Pipelines (पाइपलाइन)',
            'Waterways (जलमार्ग)',
            'Roadways (सड़क मार्ग)'
          ],
          correctAnswer: 1,
          explanationEn: 'Pipelines provide the most cost-effective, continuous, and secure method of transporting crude oil, petroleum products, and natural gas, completely eliminating trans-shipment handling losses.',
          explanationHi: 'पाइपलाइन परिवहन पेट्रोलियम और प्राकृतिक गैस के रिसाव और परिवहन में लगने वाले समय तथा नुकसान को न्यूनतम कर देता है।'
        },
        {
          id: 'q_cpo_gk_2',
          section: 'General Knowledge & General Awareness',
          textEn: 'The concept of "Martial Law" enshrined in Article 34 of the Indian Constitution has been borrowed from which country\'s legal system?',
          textHi: 'भारतीय संविधान के अनुच्छेद 34 में निहित "मार्शल लॉ" (सैन्य शासन) की अवधारणा किस देश की कानूनी प्रणाली से ली गई है?',
          options: [
            'The UK (यूनाइटेड किंगडम / ब्रिटेन)',
            'The USA (संयुक्त राज्य अमेरिका)',
            'Russia (रूस)',
            'France (फ्रांस)'
          ],
          correctAnswer: 0,
          explanationEn: 'The concept of Martial Law under Article 34 of the Indian Constitution has been borrowed from English Common Law (UK), where military authorities assume control during times of severe public disorder.',
          explanationHi: 'अनुच्छेद 34 के तहत मार्शल लॉ की अवधारणा ब्रिटिश कॉमन लॉ (यूनाइटेड किंगडम) से उधार ली गई है।'
        },
        {
          id: 'q_cpo_gk_3',
          section: 'General Knowledge & General Awareness',
          textEn: 'The world-famous Copacabana Beach is situated in which country?',
          textHi: 'विश्व प्रसिद्ध कोपाकाबाना बीच (Copacabana Beach) किस देश में स्थित है?',
          options: ['Brazil (ब्राजील)', 'Argentina (अर्जेंटीना)', 'Spain (स्पेन)', 'Portugal (पुर्तगाल)'],
          correctAnswer: 0,
          explanationEn: 'Copacabana Beach is a magnificent 4 km crescent-shaped beach located in Rio de Janeiro, Brazil.',
          explanationHi: 'कोपाकाबाना बीच ब्राजील के रियो डी जनेरियो में स्थित एक विश्व प्रसिद्ध समुद्र तट है।'
        },
        {
          id: 'q_cpo_gk_4',
          section: 'General Knowledge & General Awareness',
          textEn: 'Which industrial chemical method is most widely used for the refining of impure metals like copper, zinc, tin, nickel, silver, and gold?',
          textHi: 'तांबा, जस्ता, टिन, निकल, चांदी और सोने जैसी अशुद्ध धातुओं के परिष्करण के लिए कौन सी औद्योगिक रासायनिक विधि सबसे व्यापक रूप से उपयोग की जाती है?',
          options: [
            'Electrolytic Refining (विद्युत अपघटनी परिष्करण)',
            'Zone Refining (मंडल परिष्करण)',
            'Liquation (द्रवण विधि)',
            'Vapour Phase Refining (वाष्प प्रावस्था परिष्करण)'
          ],
          correctAnswer: 0,
          explanationEn: 'In electrolytic refining, the impure metal is made the anode and a pure strip of metal is made the cathode. On passing electric current, pure metal deposits on the cathode.',
          explanationHi: 'विद्युत अपघटनी परिष्करण (Electrolytic Refining) में अशुद्ध धातु का एनोड और शुद्ध धातु का कैथोड बनाया जाता है।'
        },
        {
          id: 'q_cpo_gk_5',
          section: 'General Knowledge & General Awareness',
          textEn: 'Which of the following scientific statements is CORRECT regarding units of physical quantities?',
          textHi: 'भौतिक राशियों के मात्रकों के संबंध में निम्नलिखित में से कौन सा वैज्ञानिक कथन सही है?',
          options: [
            'Joule is the SI unit of work and energy (जूल कार्य और ऊर्जा का SI मात्रक है)',
            'Newton is the unit of power (न्यूटन शक्ति का मात्रक है)',
            'Watt is the unit of electric charge (वाट विद्युत आवेश का मात्रक है)',
            'Pascal is the unit of electric potential (पास्कल विद्युत विभव का मात्रक है)'
          ],
          correctAnswer: 0,
          explanationEn: 'Joule (J = N·m = kg·m²/s²) is the SI unit of both work and energy. Newton is force, Watt is power, and Pascal is pressure.',
          explanationHi: 'जूल (Joule) कार्य और ऊर्जा दोनों का अंतरराष्ट्रीय मानक (SI) मात्रक है।'
        },
        {
          id: 'q_cpo_gk_6',
          section: 'General Knowledge & General Awareness',
          textEn: '"The Race of My Life" is the autobiography of which legendary Indian track and field athlete?',
          textHi: '"द रेस ऑफ माय लाइफ" किस महान भारतीय ट्रैक और फील्ड एथलीट की आत्मकथा है?',
          options: [
            'Milkha Singh (मिल्खा सिंह)',
            'P.T. Usha (पी.टी. उषा)',
            'Major Dhyan Chand (मेजर ध्यानचंद)',
            'Neeraj Chopra (नीरज चोपड़ा)'
          ],
          correctAnswer: 0,
          explanationEn: '"The Race of My Life" is the autobiography of "The Flying Sikh" Milkha Singh, co-written with his daughter Sonia Sanwalka.',
          explanationHi: '"द रेस ऑफ माय लाइफ" फ्लाइंग सिख मिल्खा सिंह की प्रेरणादायक आत्मकथा है।'
        },
        {
          id: 'q_cpo_gk_7',
          section: 'General Knowledge & General Awareness',
          textEn: 'Under the Citizenship Act of 1955, which of the following is NOT a prescribed method of acquiring Indian citizenship?',
          textHi: 'नागरिकता अधिनियम 1955 के तहत, निम्नलिखित में से कौन भारतीय नागरिकता प्राप्त करने का निर्धारित तरीका नहीं है?',
          options: [
            'Citizenship through acquisition of real estate property (अचल संपत्ति की खरीद के माध्यम से)',
            'Citizenship by Birth (जन्म से नागरिकता)',
            'Citizenship by Descent (वंश परंपरा से नागरिकता)',
            'Citizenship by Naturalisation (देशीयकरण द्वारा नागरिकता)'
          ],
          correctAnswer: 0,
          explanationEn: 'The Citizenship Act 1955 provides 5 modes of acquiring citizenship: Birth, Descent, Registration, Naturalisation, and Incorporation of Territory. Buying property confers no citizenship rights.',
          explanationHi: 'नागरिकता अधिनियम 1955 में 5 आधार हैं: जन्म, वंश, पंजीकरण, देशीयकरण और क्षेत्र समाविष्टि। संपत्ति की खरीद नागरिकता का आधार नहीं है।'
        },
        {
          id: 'q_cpo_gk_8',
          section: 'General Knowledge & General Awareness',
          textEn: 'Which British-Hungarian scientist was awarded the Nobel Prize in Physics in 1971 for inventing the optical technique of holography in 1947?',
          textHi: '1947 में होलोग्राफी की ऑप्टिकल तकनीक का आविष्कार करने के लिए किस वैज्ञानिक को 1971 में भौतिकी का नोबेल पुरस्कार दिया गया था?',
          options: ['Dennis Gabor (डेनिस गैबोर)', 'Paul Dirac (पॉल डिराक)', 'Ernest Rutherford (अर्नेस्ट रदरफोर्ड)', 'James Chadwick (जेम्स चैडविक)'],
          correctAnswer: 0,
          explanationEn: 'Dennis Gabor invented holography in 1947 while attempting to improve electron microscope resolution and was awarded the 1971 Nobel Prize in Physics.',
          explanationHi: 'डेनिस गैबोर ने 1947 में होलोग्राफी का आविष्कार किया और उन्हें 1971 में भौतिकी का नोबेल पुरस्कार मिला।'
        },
        {
          id: 'q_cpo_gk_9',
          section: 'General Knowledge & General Awareness',
          textEn: 'The historic Tripartite Struggle for control over the fertile imperial city of Kannauj in early medieval India was contested between Gurjara-Pratiharas, Palas, and:',
          textHi: 'प्रारंभिक मध्यकालीन भारत में कन्नौज पर नियंत्रण के लिए ऐतिहासिक त्रिपक्षीय संघर्ष गुर्जर-प्रतिहारों, पालों और किसके बीच लड़ा गया था?',
          options: [
            'Rashtrakutas (राष्ट्रकूट)',
            'Cholas (चोल)',
            'Pallavas (पल्लव)',
            'Chalukyas of Badami (चालुक्य)'
          ],
          correctAnswer: 0,
          explanationEn: 'The Tripartite Struggle (8th to 10th century CE) for control of Kannauj was waged between the Gurjara-Pratiharas of Malwa, the Palas of Bengal, and the Rashtrakutas of the Deccan.',
          explanationHi: 'कन्नौज पर वर्चस्व के लिए त्रिपक्षीय संघर्ष गुर्जर-प्रतिहार, पाल और राष्ट्रकूट राजवंशों के बीच हुआ था।'
        },
        {
          id: 'q_cpo_gk_10',
          section: 'General Knowledge & General Awareness',
          textEn: 'Who is the author of the Booker Prize-shortlisted novel "The Moor\'s Last Sigh"?',
          textHi: 'बुकर पुरस्कार-नामांकित उपन्यास "द मूअर्स लास्ट साई" (The Moor\'s Last Sigh) के लेखक कौन हैं?',
          options: [
            'Salman Rushdie (सलमान रुश्दी)',
            'Arundhati Roy (अरुंधति रॉय)',
            'Amitav Ghosh (अमिताव घोष)',
            'Vikram Seth (विक्रम सेठ)'
          ],
          correctAnswer: 0,
          explanationEn: '"The Moor\'s Last Sigh" (1995) was written by Salman Rushdie, tracing the history of the Zogoiby family in Bombay and Cochin.',
          explanationHi: '"द मूअर्स लास्ट साई" प्रसिद्ध भारतीय-ब्रिटिश लेखक सलमान रुश्दी द्वारा 1995 में लिखा गया उपन्यास है।'
        },
        {
          id: 'q_cpo_gk_11',
          section: 'General Knowledge & General Awareness',
          textEn: 'Which classical dance form of India is deeply rooted in the devotional Rasleela themes of Radha and Krishna and is native to Northeast India?',
          textHi: 'भारत का कौन सा शास्त्रीय नृत्य राधा और कृष्ण के भक्तिमय रासलीला प्रसंगों पर आधारित है और पूर्वोत्तर भारत का मूल नृत्य है?',
          options: ['Manipuri (मणिपुरी)', 'Sattriya (सत्रिया)', 'Kathak (कथक)', 'Odissi (ओडिसी)'],
          correctAnswer: 0,
          explanationEn: 'Manipuri dance (Jagoi) centers around the divine spiritual romance of Radha and Krishna (Rasleela) and traditional devotional songs of Jayadeva\'s Gita Govinda.',
          explanationHi: 'मणिपुरी शास्त्रीय नृत्य मुख्य रूप से राधा-कृष्ण की रासलीला और वैष्णव भक्ति पर आधारित है।'
        },
        {
          id: 'q_cpo_gk_12',
          section: 'General Knowledge & General Awareness',
          textEn: 'Who was the last ruler of the Mauryan Empire who was assassinated in 185 BCE by his Senapati Pushyamitra Shunga?',
          textHi: 'मौर्य साम्राज्य का अंतिम शासक कौन था जिसकी 185 ईसा पूर्व में उसके सेनापति पुष्यमित्र शुंग ने हत्या कर दी थी?',
          options: ['Brihadratha (बृहद्रथ)', 'Devavarman (देववर्मन)', 'Dasharatha (दशरथ)', 'Samprati (सम्प्रति)'],
          correctAnswer: 0,
          explanationEn: 'Brihadratha was the last Mauryan ruler. In 185 BCE, his commander-in-chief Pushyamitra Shunga killed him during a military parade and founded the Shunga dynasty.',
          explanationHi: 'बृहद्रथ मौर्य साम्राज्य का अंतिम सम्राट था। 185 ई.पू. में सेनापति पुष्यमित्र शुंग ने उसकी हत्या कर शुंग वंश की नींव रखी।'
        },
        {
          id: 'q_cpo_gk_13',
          section: 'General Knowledge & General Awareness',
          textEn: 'Which prerogative constitutional writ literally translates to "To have the body of" and protects citizens against unlawful arrest and detention?',
          textHi: 'कौन सी संवैधानिक रिट का शाब्दिक अर्थ "शरीर को प्रस्तुत किया जाए" (To have the body of) होता है और यह नागरिकों को गैरकानूनी हिरासत से बचाती है?',
          options: ['Habeas Corpus (बंदी प्रत्यक्षीकरण)', 'Mandamus (परमादेश)', 'Quo-Warranto (अधिकार पृच्छा)', 'Certiorari (उत्प्रेषण)'],
          correctAnswer: 0,
          explanationEn: 'Habeas Corpus is issued by Supreme Court (Art 32) or High Court (Art 226) directing the detaining authority to produce the person in court to test the legality of detention.',
          explanationHi: 'बंदी प्रत्यक्षीकरण (Habeas Corpus) रिट किसी भी व्यक्ति को अवैध हिरासत से मुक्त कराने के लिए न्यायालय द्वारा जारी की जाती है।'
        },
        {
          id: 'q_cpo_gk_14',
          section: 'General Knowledge & General Awareness',
          textEn: 'The Communist Party of India (CPI) was established at Tashkent in October 1920 primarily through the initiative of:',
          textHi: 'भारतीय कम्युनिस्ट पार्टी (CPI) की स्थापना अक्टूबर 1920 में ताशकंद में मुख्य रूप से किसकी पहल पर की गई थी?',
          options: ['M.N. Roy (एम.एन. रॉय)', 'P.C. Joshi (पी.सी. जोशी)', 'S.A. Dange (एस.ए. डांगे)', 'Muzaffar Ahmad (मुजफ्फर अहमद)'],
          correctAnswer: 0,
          explanationEn: 'The CPI was formed in Tashkent (now Uzbekistan) on 17 October 1920 by Manabendra Nath Roy (M.N. Roy), Evelyn Trent Roy, Abani Mukherji, and others.',
          explanationHi: 'एम.एन. रॉय ने 17 अक्टूबर 1920 को ताशकंद में भारतीय कम्युनिस्ट पार्टी की स्थापना में प्रमुख भूमिका निभाई थी।'
        },
        {
          id: 'q_cpo_gk_15',
          section: 'General Knowledge & General Awareness',
          textEn: 'According to the 2011 Census of India, which Union Territory recorded the highest male literacy rate (95.56%)?',
          textHi: '2011 की जनगणना के अनुसार, किस केंद्र शासित प्रदेश में पुरुष साक्षरता दर सबसे अधिक (95.56%) दर्ज की गई थी?',
          options: ['Lakshadweep (लक्षद्वीप)', 'Chandigarh (चंडीगढ़)', 'Puducherry (पुडुचेरी)', 'Daman and Diu (दमन और दीव)'],
          correctAnswer: 0,
          explanationEn: 'Lakshadweep recorded the highest male literacy rate among all Union Territories at 95.56% (total literacy 91.85%).',
          explanationHi: '2011 की जनगणना में लक्षद्वीप ने केंद्र शासित प्रदेशों में 95.56% की उच्चतम पुरुष साक्षरता दर दर्ज की।'
        },
        {
          id: 'q_cpo_gk_16',
          section: 'General Knowledge & General Awareness',
          textEn: 'Pandit Ravi Shankar, who won five Grammy Awards and was conferred the Bharat Ratna in 1999, was a virtuoso of which musical instrument?',
          textHi: 'पंडित रविशंकर, जिन्होंने पांच ग्रैमी पुरस्कार जीते और 1999 में भारत रत्न से सम्मानित हुए, किस वाद्य यंत्र के उस्ताद थे?',
          options: ['Sitar (सितार)', 'Sarod (सरोद)', 'Santoor (संतूर)', 'Shehnai (शहनाई)'],
          correctAnswer: 0,
          explanationEn: 'Pandit Ravi Shankar was a world-famous sitar virtuoso of the Maihar gharana and a pioneer in introducing Indian classical music to the Western world.',
          explanationHi: 'पंडित रविशंकर विश्व प्रसिद्ध सितार वादक थे, जिन्हें 1999 में भारत के सर्वोच्च नागरिक सम्मान भारत रत्न से नवाजा गया।'
        },
        {
          id: 'q_cpo_gk_17',
          section: 'General Knowledge & General Awareness',
          textEn: 'According to the Census 2011 data, which metropolitan urban agglomeration was the most populous in India?',
          textHi: 'जनगणना 2011 के आंकड़ों के अनुसार, भारत में कौन सा महानगरीय क्षेत्र सबसे अधिक आबादी वाला था?',
          options: ['Mumbai (मुंबई - 18.4 Million)', 'Delhi (दिल्ली)', 'Kolkata (कोलकाता)', 'Bengaluru (बेंगलुरु)'],
          correctAnswer: 0,
          explanationEn: 'According to Census 2011, Greater Mumbai was the most populous metropolitan urban agglomeration with 18.4 million inhabitants, followed closely by Delhi.',
          explanationHi: '2011 की जनगणना में मुंबई महानगरीय क्षेत्र 18.4 मिलियन आबादी के साथ भारत का सबसे अधिक जनसंख्या वाला शहर था।'
        },
        {
          id: 'q_cpo_gk_18',
          section: 'General Knowledge & General Awareness',
          textEn: '"Ker Puja" and "Garia Puja" are vibrant traditional tribal festivals celebrated primarily in which state of Northeast India?',
          textHi: '"केर पूजा" और "गड़िया पूजा" पूर्वोत्तर भारत के किस राज्य में मुख्य रूप से मनाए जाने वाले पारंपरिक जनजातीय त्योहार हैं?',
          options: ['Tripura (त्रिपुरा)', 'Nagaland (नागालैंड)', 'Meghalaya (मेघालय)', 'Mizoram (मिजोरम)'],
          correctAnswer: 0,
          explanationEn: 'Ker Puja (protector deity festival) and Garia Puja (celebrated on the 7th day of Vaishakha) are centuries-old royal and tribal festivals of Tripura.',
          explanationHi: 'केर पूजा और गड़िया पूजा त्रिपुरा के मूल त्रिपुरी जनजातीय समुदाय द्वारा मनाए जाने वाले प्रमुख पावन उत्सव हैं।'
        },
        {
          id: 'q_cpo_gk_19',
          section: 'General Knowledge & General Awareness',
          textEn: 'The famous Hazira-Vijaipur-Jagdishpur (HVJ) interstate cross-country natural gas pipeline was engineered and commissioned by:',
          textHi: 'प्रसिद्ध हजीरा-विजयपुर-जगदीशपुर (HVJ) अंतरराज्यीय प्राकृतिक गैस पाइपलाइन का निर्माण और संचालन किसके द्वारा किया गया था?',
          options: [
            'GAIL (Gas Authority of India Limited)',
            'ONGC (Oil and Natural Gas Corporation)',
            'IOCL (Indian Oil Corporation Limited)',
            'BPCL (Bharat Petroleum)'
          ],
          correctAnswer: 0,
          explanationEn: 'The HVJ 1,750 km pipeline was constructed and is managed by GAIL India Limited to supply natural gas to power plants and fertilizer units across northern India.',
          explanationHi: 'हजीरा-विजयपुर-जगदीशपुर (HVJ) गैस पाइपलाइन का निर्माण और संचालन गेल (GAIL इंडिया लिमिटेड) द्वारा किया जाता है।'
        },
        {
          id: 'q_cpo_gk_20',
          section: 'General Knowledge & General Awareness',
          textEn: 'Mawsynram, which holds the Guinness World Record for the highest average annual rainfall on Earth, is situated in which mountain hills?',
          textHi: 'मासिनराम, जिसके नाम पृथ्वी पर सर्वाधिक औसत वार्षिक वर्षा का गिनीज रिकॉर्ड है, मेघालय की किस पहाड़ी में स्थित है?',
          options: ['Khasi Hills (खासी हिल्स)', 'Garo Hills (गारो हिल्स)', 'Jaintia Hills (जयंतिया हिल्स)', 'Lushai Hills (लुशाई हिल्स)'],
          correctAnswer: 0,
          explanationEn: 'Mawsynram is located in the East Khasi Hills district of Meghalaya, receiving an average annual precipitation of over 11,872 mm due to moisture funneling from the Bay of Bengal.',
          explanationHi: 'मासिनराम मेघालय के पूर्वी खासी हिल्स जिले में स्थित है, जहां वार्षिक 11,872 मिमी से अधिक वर्षा दर्ज की जाती है।'
        },
        {
          id: 'q_cpo_gk_21',
          section: 'General Knowledge & General Awareness',
          textEn: 'Which high-level committee appointed by the Government of India in 1976 recommended the incorporation of Fundamental Duties into the Constitution?',
          textHi: '1976 में भारत सरकार द्वारा नियुक्त किस उच्च स्तरीय समिति ने संविधान में मौलिक कर्तव्यों को शामिल करने की सिफारिश की थी?',
          options: [
            'Sardar Swaran Singh Committee (सरदार स्वर्ण सिंह समिति)',
            'Sarkaria Commission (सरकारिया आयोग)',
            'Balwant Rai Mehta Committee (बलवंत राय मेहता समिति)',
            'Kothari Commission (कोठारी आयोग)'
          ],
          correctAnswer: 0,
          explanationEn: 'The Swaran Singh Committee recommendations led to the enactment of the 42nd Constitutional Amendment Act 1976, which added Part IV-A and Article 51A containing 10 Fundamental Duties.',
          explanationHi: 'सरदार स्वर्ण सिंह समिति (1976) की सिफारिश पर 42वें संविधान संशोधन द्वारा अनुच्छेद 51A के तहत मौलिक कर्तव्य जोड़े गए।'
        },
        {
          id: 'q_cpo_gk_22',
          section: 'General Knowledge & General Awareness',
          textEn: 'What is the rotational physics formula for the Moment of Inertia (I) of a point mass m rotating at a perpendicular distance r from the axis of rotation?',
          textHi: 'घूर्णन अक्ष से लंबवत दूरी r पर घूम रहे बिंदु द्रव्यमान m के जड़त्व आघूर्ण (Moment of Inertia) का भौतिकी सूत्र क्या है?',
          options: ['I = m · r²', 'I = m · r', 'I = ½ m · r²', 'I = m / r²'],
          correctAnswer: 0,
          explanationEn: 'The moment of inertia of a point mass about an axis is defined as the product of its mass and the square of its perpendicular distance from the axis: I = mr².',
          explanationHi: 'घूर्णन गति में बिंदु द्रव्यमान का जड़त्व आघूर्ण I = m · r² होता है।'
        },
        {
          id: 'q_cpo_gk_23',
          section: 'General Knowledge & General Awareness',
          textEn: 'Which Article of the Constitution of India defines the duties of the Prime Minister with respect to the furnishing of information to the President of India?',
          textHi: 'भारतीय संविधान का कौन सा अनुच्छेद भारत के राष्ट्रपति को सूचना प्रस्तुत करने के संबंध में प्रधानमंत्री के कर्तव्यों को परिभाषित करता है?',
          options: ['Article 78 (अनुच्छेद 78)', 'Article 74 (अनुच्छेद 74)', 'Article 75 (अनुच्छेद 75)', 'Article 76 (अनुच्छेद 76)'],
          correctAnswer: 0,
          explanationEn: 'Article 78 mandates that it shall be the duty of the Prime Minister to communicate to the President all decisions of the Council of Ministers relating to the administration of the affairs of the Union.',
          explanationHi: 'अनुच्छेद 78 के तहत प्रधानमंत्री का यह कर्तव्य है कि वह संघ के मामलों के प्रशासन संबंधी मंत्रिपरिषद के सभी निर्णय राष्ट्रपति को सूचित करे।'
        },
        {
          id: 'q_cpo_gk_24',
          section: 'General Knowledge & General Awareness',
          textEn: 'What was India\'s final rank in the overall medal tally at the Tokyo Olympics 2020 (held in 2021) with 7 medals (1 Gold, 2 Silver, 4 Bronze)?',
          textHi: 'टोक्यो ओलंपिक 2020 (आयोजित 2021) में 7 पदकों (1 स्वर्ण, 2 रजत, 4 कांस्य) के साथ समग्र पदक तालिका में भारत का अंतिम स्थान क्या था?',
          options: ['48th (48वां)', '42nd (42वां)', '54th (54वां)', '38th (38वां)'],
          correctAnswer: 0,
          explanationEn: 'India achieved its best-ever Olympic medal haul of 7 medals at Tokyo 2020, finishing in 48th position, highlighted by Neeraj Chopra\'s historic Gold in javelin throw.',
          explanationHi: 'भारत 1 स्वर्ण, 2 रजत और 4 कांस्य सहित कुल 7 पदकों के साथ 48वें स्थान पर रहा।'
        },
        {
          id: 'q_cpo_gk_25',
          section: 'General Knowledge & General Awareness',
          textEn: 'In which year was the All-India Muslim League founded in Dhaka under the leadership of Nawab Salimullah and Aga Khan III?',
          textHi: 'नवाब सलीमुल्लाह और आगा खान तृतीय के नेतृत्व में ढाका में ऑल इंडिया मुस्लिम लीग की स्थापना किस वर्ष की गई थी?',
          options: ['1906', '1905', '1909', '1911'],
          correctAnswer: 0,
          explanationEn: 'The All-India Muslim League was established on 30 December 1906 at Dhaka (now Bangladesh) during the All India Muhammadan Educational Conference.',
          explanationHi: 'ऑल इंडिया मुस्लिम लीग की स्थापना 30 दिसंबर 1906 को ढाका में की गई थी।'
        },
        {
          id: 'q_cpo_gk_26',
          section: 'General Knowledge & General Awareness',
          textEn: 'Hindon, Chambal, Sindh, Betwa, and Ken are prominent tributaries of which sacred Indian river system?',
          textHi: 'हिंडन, चंबल, सिंध, बेतवा और केन किस भारतीय नदी प्रणाली की प्रमुख सहायक नदियाँ हैं?',
          options: [
            'Yamuna (यमुना नदी)',
            'Ganga (गंगा नदी)',
            'Godavari (गोदावरी नदी)',
            'Narmada (नर्मदा नदी)'
          ],
          correctAnswer: 0,
          explanationEn: 'The Yamuna originates at Yamunotri and receives major right-bank tributaries like Chambal, Sindh, Betwa, and Ken, and left-bank tributary Hindon before merging with Ganga at Prayagraj.',
          explanationHi: 'चंबल, बेतवा, केन, सिंध और हिंडन सभी यमुना नदी की प्रमुख सहायक नदियाँ हैं।'
        },
        {
          id: 'q_cpo_gk_27',
          section: 'General Knowledge & General Awareness',
          textEn: 'Mehrangarh Fort, one of the most formidable hill forts in India built in 1459 by Rao Jodha, is situated in which historical city of Rajasthan?',
          textHi: '1459 में राव जोधा द्वारा निर्मित भारत के सबसे दुर्जेय पहाड़ी किलों में से एक, मेहरानगढ़ किला राजस्थान के किस ऐतिहासिक शहर में स्थित है?',
          options: ['Jodhpur (जोधपुर)', 'Jaipur (जयपुर)', 'Udaipur (उदयपुर)', 'Bikaner (बीकानेर)'],
          correctAnswer: 0,
          explanationEn: 'Mehrangarh Fort stands atop a 410-foot cliff overlooking the Blue City of Jodhpur, Rajasthan.',
          explanationHi: 'मेहरानगढ़ दुर्ग राजस्थान के सूर्यनगरी / नीली नगरी जोधपुर में स्थित है।'
        },
        {
          id: 'q_cpo_gk_28',
          section: 'General Knowledge & General Awareness',
          textEn: 'In international field hockey, when an umpire shows a Yellow Card to a player, for what minimum duration is the player temporarily suspended from the pitch?',
          textHi: 'अंतरराष्ट्रीय फील्ड हॉकी में, जब अंपायर किसी खिलाड़ी को पीला कार्ड (Yellow Card) दिखाता है, तो खिलाड़ी को मैदान से न्यूनतम कितनी अवधि के लिए निलंबित किया जाता है?',
          options: ['5 minutes (5 मिनट)', '2 minutes (2 मिनट)', '10 minutes (10 मिनट)', '15 minutes (15 मिनट)'],
          correctAnswer: 0,
          explanationEn: 'Under FIH Rules of Hockey: Green card = 2 min suspension. Yellow card = minimum 5 minutes suspension (or 10 minutes at umpire\'s discretion). Red card = permanent dismissal.',
          explanationHi: 'हॉकी नियमों के तहत, पीला कार्ड दिखाने पर खिलाड़ी को न्यूनतम 5 मिनट के लिए खेल से बाहर बैठना पड़ता है।'
        },
        {
          id: 'q_cpo_gk_29',
          section: 'General Knowledge & General Awareness',
          textEn: 'Which Five-Year Plan of India (1974–1979) laid primary emphasis on the removal of poverty ("Garibi Hatao") and achievement of self-reliance?',
          textHi: 'भारत की किस पंचवर्षीय योजना (1974-1979) में गरीबी उन्मूलन ("गरीबी हटाओ") और आत्मनिर्भरता की प्राप्ति पर विशेष बल दिया गया था?',
          options: [
            'Fifth Five-Year Plan (पांचवीं पंचवर्षीय योजना)',
            'Third Five-Year Plan (तीसरी पंचवर्षीय योजना)',
            'Fourth Five-Year Plan (चौथी पंचवर्षीय योजना)',
            'Sixth Five-Year Plan (छठी पंचवर्षीय योजना)'
          ],
          correctAnswer: 0,
          explanationEn: 'The 5th Five-Year Plan drafted by D.D. Dhar focused on Garibi Hatao, employment generation, and social justice along with the National Minimum Needs Programme.',
          explanationHi: 'पांचवीं पंचवर्षीय योजना (1974-1979) का मुख्य लक्ष्य गरीबी उन्मूलन (गरीबी हटाओ) और आत्मनिर्भरता था।'
        },
        {
          id: 'q_cpo_gk_30',
          section: 'General Knowledge & General Awareness',
          textEn: 'Which was the first B-vitamin discovered in 1897 by Dutch physician Christiaan Eijkman while researching beriberi?',
          textHi: '1897 में बेरीबेरी रोग पर शोध करते समय डच चिकित्सक क्रिस्टियान ईजकमैन द्वारा खोजा गया पहला बी-विटामिन कौन सा था?',
          options: [
            'Thiamine / Vitamin B1 (थायमिन / विटामिन B1)',
            'Riboflavin / Vitamin B2 (राइबोफ्लेविन)',
            'Niacin / Vitamin B3 (नियासिन)',
            'Cobalamin / Vitamin B12 (कोबालमिन)'
          ],
          correctAnswer: 0,
          explanationEn: 'Thiamine (Vitamin B1) was the first water-soluble B vitamin isolated, the deficiency of which causes beriberi and Wernicke-Korsakoff syndrome.',
          explanationHi: 'थायमिन (विटामिन B1) सबसे पहले खोजा गया बी-विटामिन था, जिसकी कमी से बेरीबेरी रोग होता है।'
        },

        // ================= SECTION 3: QUANTITATIVE APTITUDE =================
        {
          id: 'q_cpo_quant_1',
          section: 'Quantitative Aptitude',
          textEn: 'Sukhvir bought certain items, of which 30% were damaged and could not be sold. He sold the remaining items at a marked price such that he made an overall profit of 19%. What was his percentage markup over cost price?',
          textHi: 'सुखवीर ने कुछ वस्तुएं खरीदीं, जिनमें से 30% क्षतिग्रस्त हो गईं और बेची नहीं जा सकीं। उसने शेष वस्तुओं को अंकित मूल्य पर इस प्रकार बेचा कि उसे कुल मिलाकर 19% का लाभ हुआ। क्रय मूल्य पर उसका प्रतिशत मार्कअप क्या था?',
          options: ['70%', '65%', '75%', '60%'],
          correctAnswer: 0,
          explanationEn: 'Let total items = 100, cost price per item = ₹1. Total Cost = ₹100.\nItems remaining to sell = 70.\nOverall desired revenue = 100 + 19% = ₹119.\nSelling price per remaining item = 119 / 70 = ₹1.70.\nSince items are sold at marked price, MP = ₹1.70.\nMarkup over cost price = (1.70 - 1.00) / 1.00 × 100 = 70%.',
          explanationHi: 'माना 100 वस्तुएं ₹100 में खरीदीं।\n30% खराब होने पर बची वस्तुएं = 70।\nकुल 19% लाभ पर कुल विक्रय मूल्य = ₹119।\nप्रति वस्तु अंकित मूल्य = 119 / 70 = ₹1.70।\nमार्कअप प्रतिशत = (1.70 - 1) × 100 = 70%।'
        },
        {
          id: 'q_cpo_quant_2',
          section: 'Quantitative Aptitude',
          textEn: 'An article with a marked price of ₹1,940 is sold at a flat discount of 15%. What is the net selling price of the article?',
          textHi: '₹1,940 के अंकित मूल्य वाली एक वस्तु को 15% की छूट पर बेचा जाता है। वस्तु का शुद्ध विक्रय मूल्य क्या है?',
          options: ['₹1,649', '₹1,659', '₹1,639', '₹1,669'],
          correctAnswer: 0,
          explanationEn: 'Discount amount = 15% of 1,940 = 0.15 × 1940 = ₹291.\nSelling Price = 1,940 - 291 = ₹1,649.',
          explanationHi: 'छूट = 1940 का 15% = ₹291।\nविक्रय मूल्य = 1940 - 291 = ₹1,649।'
        },
        {
          id: 'q_cpo_quant_3',
          section: 'Quantitative Aptitude',
          textEn: 'A poultry farm produces 217 eggs per week. How many eggs will be produced by the farm during the months of July, August, and September combined (assuming constant production)?',
          textHi: 'एक पोल्ट्री फार्म प्रति सप्ताह 217 अंडे पैदा करता है। जुलाई, अगस्त और सितंबर के महीनों में मिलाकर फार्म द्वारा कितने अंडे पैदा किए जाएंगे?',
          options: ['2852 eggs', '2790 eggs', '2914 eggs', '2880 eggs'],
          correctAnswer: 0,
          explanationEn: 'July has 31 days, August has 31 days, September has 30 days. Total days = 31 + 31 + 30 = 92 days.\nProduction per day = 217 / 7 = 31 eggs/day.\nTotal eggs produced in 92 days = 31 × 92 = 2,852 eggs.',
          explanationHi: 'जुलाई (31) + अगस्त (31) + सितंबर (30) = कुल 92 दिन।\nप्रतिदिन उत्पादन = 217 / 7 = 31 अंडे।\n92 दिनों में कुल उत्पादन = 31 × 92 = 2852 अंडे।'
        },
        {
          id: 'q_cpo_quant_4',
          section: 'Quantitative Aptitude',
          textEn: 'Find the greatest positive integer that divides 261, 853, and 1221, leaving a remainder of 5 in each case.',
          textHi: 'वह सबसे बड़ा धनात्मक पूर्णांक ज्ञात कीजिए जो 261, 853 और 1221 को विभाजित करने पर प्रत्येक स्थिति में 5 शेषफल छोड़ता है।',
          options: ['16', '18', '14', '12'],
          correctAnswer: 0,
          explanationEn: 'Subtract remainder 5 from each number:\n261 - 5 = 256\n853 - 5 = 848\n1221 - 5 = 1216\nNow find HCF of (256, 848, 1216):\n256 = 16 × 16\n848 = 16 × 53\n1216 = 16 × 76\nSince 53 is prime, HCF = 16.',
          explanationHi: 'प्रत्येक से 5 घटाने पर:\n261 - 5 = 256, 853 - 5 = 848, 1221 - 5 = 1216।\nइनका महत्तम समापवर्तक (HCF):\n256 = 16 × 16\n848 = 16 × 53\n1216 = 16 × 76\nHCF = 16। अतः अभीष्ट संख्या 16 है।'
        },
        {
          id: 'q_cpo_quant_5',
          section: 'Quantitative Aptitude',
          textEn: 'A thief is spotted by a policeman from a distance of 300 metres. When the policeman starts the chase, the thief also starts running. If the speed of the thief is 11 km/h and that of the policeman is 13 km/h, how far will the policeman have to run to catch the thief?',
          textHi: 'एक पुलिसकर्मी 300 मीटर की दूरी से एक चोर को देखता है। जब पुलिसकर्मी पीछा करना शुरू करता है, तो चोर भी भागने लगता है। यदि चोर की गति 11 किमी/घंटा और पुलिसकर्मी की गति 13 किमी/घंटा है, तो चोर को पकड़ने के लिए पुलिसकर्मी को कितनी दूर दौड़ना होगा?',
          options: ['1.95 km (1950 m)', '1.80 km (1800 m)', '2.10 km (2100 m)', '1.65 km (1650 m)'],
          correctAnswer: 0,
          explanationEn: 'Relative speed of policeman with respect to thief = 13 - 11 = 2 km/h.\nConverting to m/s: 2 × (5/18) = 5/9 m/s.\nTime taken to cover 300 m gap = 300 / (5/9) = 300 × 9 / 5 = 540 seconds (or 540/3600 = 0.15 hours).\nDistance covered by policeman = Speed × Time = 13 km/h × 0.15 h = 1.95 km (1950 metres).',
          explanationHi: 'सापेक्ष चाल = 13 - 11 = 2 किमी/घंटा।\nचोर को पकड़ने में समय = 0.3 किमी / 2 किमी/घंटा = 0.15 घंटा।\nपुलिसकर्मी द्वारा तय दूरी = 13 × 0.15 = 1.95 किमी (1950 मीटर)।'
        },
        {
          id: 'q_cpo_quant_6',
          section: 'Quantitative Aptitude',
          textEn: 'Find the compound interest on a sum of ₹1,00,000 for 5 years at 7% per annum compounded annually (rounded to the nearest integer). [Given: (1.07)⁵ = 1.40255]',
          textHi: 'प्रति वर्ष 7% की दर से वार्षिक रूप से संयोजित होने वाले ₹1,00,000 की राशि पर 5 वर्षों के लिए चक्रवृद्धि ब्याज ज्ञात कीजिए। [(1.07)⁵ = 1.40255]',
          options: ['₹40,255', '₹35,000', '₹42,150', '₹38,750'],
          correctAnswer: 0,
          explanationEn: 'Amount A = P(1 + r/100)ᵗ = 1,00,000 × (1.07)⁵ = 1,00,000 × 1.40255 = ₹1,40,255.\nCompound Interest = A - P = 1,40,255 - 1,00,000 = ₹40,255.',
          explanationHi: 'मिश्रधन = 1,00,000 × (1.07)⁵ = ₹1,40,255।\nचक्रवृद्धि ब्याज = 1,40,255 - 1,00,000 = ₹40,255।'
        },
        {
          id: 'q_cpo_quant_7',
          section: 'Quantitative Aptitude',
          textEn: 'The radius of the circular base of a right cone is 7 cm and its slant height is 10 cm. What is the curved surface area of the cone? (Take π = 22/7)',
          textHi: 'एक लम्ब वृत्तीय शंकु के आधार की त्रिज्या 7 सेमी है और इसकी तिर्यक ऊंचाई 10 सेमी है। शंकु का वक्र पृष्ठीय क्षेत्रफल क्या है? (π = 22/7 लें)',
          options: ['220 cm²', '210 cm²', '240 cm²', '200 cm²'],
          correctAnswer: 0,
          explanationEn: 'Curved surface area of a cone = π × r × l = (22/7) × 7 × 10 = 22 × 10 = 220 cm².',
          explanationHi: 'शंकु का वक्र पृष्ठीय क्षेत्रफल = πrl = (22/7) × 7 × 10 = 220 वर्ग सेमी।'
        },
        {
          id: 'q_cpo_quant_8',
          section: 'Quantitative Aptitude',
          textEn: 'Find the Least Common Multiple (LCM) of 210, 336, and 504.',
          textHi: '210, 336 और 504 का लघुत्तम समापवर्त्य (LCM) ज्ञात कीजिए।',
          options: ['5040', '2520', '3360', '1680'],
          correctAnswer: 0,
          explanationEn: 'Prime factorization:\n210 = 2 × 3 × 5 × 7\n336 = 2⁴ × 3 × 7\n504 = 2³ × 3² × 7\nLCM = 2⁴ × 3² × 5 × 7 = 16 × 9 × 35 = 144 × 35 = 5040.',
          explanationHi: 'अभाज्य गुणनखंडन:\n210 = 2 × 3 × 5 × 7\n336 = 2⁴ × 3 × 7\n504 = 2³ × 3² × 7\nLCM = 2⁴ × 3² × 5 × 7 = 16 × 9 × 5 × 7 = 5040।'
        },
        {
          id: 'q_cpo_quant_9',
          section: 'Quantitative Aptitude',
          textEn: 'Evaluate the trigonometric value of:\n(1 + sin⁴A – cos⁴A) · cosec²A',
          textHi: 'त्रिकोणमितीय व्यंजक का मान ज्ञात कीजिए:\n(1 + sin⁴A – cos⁴A) · cosec²A',
          options: ['2', '1', '0', '-1'],
          correctAnswer: 0,
          explanationEn: 'sin⁴A - cos⁴A = (sin²A - cos²A)(sin²A + cos²A) = sin²A - cos²A.\nSo, 1 + (sin⁴A - cos⁴A) = 1 + sin²A - cos²A.\nSince 1 - cos²A = sin²A, the expression becomes: sin²A + sin²A = 2 sin²A.\nMultiplying by cosec²A: 2 sin²A · cosec²A = 2 (since sin²A · cosec²A = 1). Answer is 2.',
          explanationHi: 'sin⁴A - cos⁴A = sin²A - cos²A।\n1 - cos²A + sin²A = sin²A + sin²A = 2 sin²A।\n2 sin²A × cosec²A = 2। अतः मान 2 है।'
        },
        {
          id: 'q_cpo_quant_10',
          section: 'Quantitative Aptitude',
          textEn: 'Simplify the following arithmetic expression using BODMAS rule:\n4 × 5 ÷ 4 of 5 × 4 ÷ (6 + 6 × 6 ÷ 6 of 6 – 6 ÷ 6 × 6)',
          textHi: 'BODMAS नियम का उपयोग करके निम्नलिखित व्यंजक को सरल कीजिए:\n4 × 5 ÷ 4 of 5 × 4 ÷ (6 + 6 × 6 ÷ 6 of 6 – 6 ÷ 6 × 6)',
          options: ['4', '1', '16', '8'],
          correctAnswer: 0,
          explanationEn: 'Numerator part: 4 × 5 ÷ (4 of 5) × 4 = 4 × 5 ÷ 20 × 4 = 4 × (1/4) × 4 = 4.\nDenominator part:\n(6 of 6) = 36\n6 × 6 ÷ 36 = 36 ÷ 36 = 1\n6 ÷ 6 × 6 = 1 × 6 = 6\nInside bracket: 6 + 1 - 6 = 1.\nOverall expression: 4 ÷ 1 = 4.',
          explanationHi: 'अंश: 4 × 5 ÷ (4 of 5) × 4 = 4 × 5 ÷ 20 × 4 = 1 × 4 = 4।\nहर: 6 + 6 × 6 ÷ 36 – 6 ÷ 6 × 6 = 6 + 1 – 6 = 1।\nअतः 4 ÷ 1 = 4।'
        },

        // ================= SECTION 4: ENGLISH COMPREHENSION =================
        {
          id: 'q_cpo_eng_1',
          section: 'English Comprehension',
          textEn: 'Select the option that can be used as a one-word substitute for the given group of words:\n"The scientific study of insects and their relationship to humans and environment"',
          textHi: 'दिए गए वाक्यांश के लिए एक शब्द (One-word substitution) चुनिए:\n"कीटों और उनके पर्यावरण से संबंधों का वैज्ञानिक अध्ययन"',
          options: [
            'Entomology (कीटविज्ञान)',
            'Etymology (शब्द-व्युत्पत्ति विज्ञान)',
            'Ornithology (पक्षीविज्ञान)',
            'Ichthyology (मत्स्यविज्ञान)'
          ],
          correctAnswer: 0,
          explanationEn: 'Entomology is the branch of zoology concerned with the study of insects. Etymology is the study of word origins; Ornithology is birds.',
          explanationHi: 'Entomology कीटों का वैज्ञानिक अध्ययन है। Etymology शब्दों की उत्पत्ति का अध्ययन है।'
        },
        {
          id: 'q_cpo_eng_2',
          section: 'English Comprehension',
          textEn: 'Select the most appropriate ANTONYM of the given word:\nAPATHY',
          textHi: 'दिए गए शब्द का विलोम शब्द (Antonym) चुनिए:\nAPATHY (उदासीनता)',
          options: [
            'Interest (रुचि / उत्साह)',
            'Indifference (उदासीनता)',
            'Lethargy (सुस्ती)',
            'Hostility (शत्रुता)'
          ],
          correctAnswer: 0,
          explanationEn: 'Apathy means lack of interest, enthusiasm, or concern. Its direct antonym is Interest or Enthusiasm.',
          explanationHi: 'Apathy का अर्थ उदासीनता या अनासक्ति है। इसका सटीक विलोम Interest (रुचि/उत्साह) है।'
        },
        {
          id: 'q_cpo_eng_3',
          section: 'English Comprehension',
          textEn: 'Select the option that can be used as a one-word substitute for the given phrase:\n"A person who comes to live permanently in a foreign country"',
          textHi: 'दिए गए वाक्यांश के लिए एक शब्द चुनिए:\n"वह व्यक्ति जो किसी विदेशी देश में स्थायी रूप से रहने आता है"',
          options: [
            'Immigrant (आप्रवासी)',
            'Emigrant (उत्प्रवासी)',
            'Tourist (पर्यटक)',
            'Refugee (शरणार्थी)'
          ],
          correctAnswer: 0,
          explanationEn: 'An Immigrant is someone who moves INTO a country to reside. An Emigrant is someone who EXITS their home country.',
          explanationHi: 'विदेशी देश में आकर बसने वाले व्यक्ति को Immigrant (आप्रवासी) कहा जाता है।'
        },
        {
          id: 'q_cpo_eng_4',
          section: 'English Comprehension',
          textEn: 'Select the most appropriate option to fill in the blank:\n"The majestic Taj Mahal is one of the ______ popular architectural marvels in the world."',
          textHi: 'रिक्त स्थान के लिए सर्वाधिक उपयुक्त विकल्प चुनिए:',
          options: ['most', 'more', 'much', 'many'],
          correctAnswer: 0,
          explanationEn: 'Superlative degree "one of the most popular" is required when comparing one item out of a large class.',
          explanationHi: 'सुपरलेटिव डिग्री में "one of the most popular" का प्रयोग किया जाता है।'
        },
        {
          id: 'q_cpo_eng_5',
          section: 'English Comprehension',
          textEn: 'Select the INCORRECTLY spelled word among the options:',
          textHi: 'गलत वर्तनी (Incorrect spelling) वाले शब्द का चयन कीजिए:',
          options: [
            'considared',
            'preferred',
            'committed',
            'occurred'
          ],
          correctAnswer: 0,
          explanationEn: '"considared" is misspelled. The correct spelling is "considered". Preferred, committed, and occurred are correctly spelled with double consonants.',
          explanationHi: '"considared" अशुद्ध वर्तनी है। शुद्ध वर्तनी "considered" होती है।'
        },
        {
          id: 'q_cpo_eng_6',
          section: 'English Comprehension',
          textEn: 'Select the most appropriate meaning of the given idiom:\n"To crack someone up"',
          textHi: 'दिए गए मुहावरे का सही अर्थ चुनिए:\n"To crack someone up"',
          options: [
            'To make someone laugh out loud (किसी को बहुत हंसाना)',
            'To criticize someone severely (कड़ी आलोचना करना)',
            'To injure someone physically (शारीरिक चोट पहुंचाना)',
            'To reveal a confidential secret (रहस्य उजागर करना)'
          ],
          correctAnswer: 0,
          explanationEn: 'To "crack someone up" means to make someone suddenly laugh hard or uncontrollably.',
          explanationHi: '"To crack someone up" का अर्थ होता है किसी को जोर से हंसाना।'
        },
        {
          id: 'q_cpo_eng_7',
          section: 'English Comprehension',
          textEn: 'Select the most appropriate SYNONYM of the highlighted word:\n"The stunning aerial view of the snow-capped Himalayan peaks CAPTIVATED all the passengers."',
          textHi: 'शब्द CAPTIVATE (मंत्रमुग्ध करना) का पर्यायवाची (Synonym) चुनिए:',
          options: ['Allure (आकर्षित/मोहित करना)', 'Repel (विकर्षित करना)', 'Distract (भटकाना)', 'Bore (उबाना)'],
          correctAnswer: 0,
          explanationEn: 'Captivate means to attract and hold the interest and charm of someone. Allure, charm, and enthrall are synonyms.',
          explanationHi: 'Captivate का अर्थ मोहित या आकर्षित करना होता है। Allure इसका सटीक पर्यायवाची है।'
        },
        {
          id: 'q_cpo_eng_8',
          section: 'English Comprehension',
          textEn: 'Select the one-word substitution for:\n"The state, quality, or capacity of being beneficial and useful"',
          textHi: 'वाक्यांश के लिए एक शब्द चुनिए:\n"उपयोगी या लाभकारी होने की गुणवत्ता या क्षमता"',
          options: ['Utility (उपयोगिता)', 'Vanity (घमंड)', 'Futility (व्यर्थता)', 'Scarcity (कमी)'],
          correctAnswer: 0,
          explanationEn: 'Utility is the state or condition of being useful, practical, or beneficial.',
          explanationHi: 'Utility का अर्थ उपयोगिता या कार्यसाधकता होता है।'
        },
        {
          id: 'q_cpo_eng_9',
          section: 'English Comprehension',
          textEn: 'Select the most appropriate ANTONYM of the given word:\nREJOINDER',
          textHi: 'दिए गए शब्द का विलोम शब्द (Antonym) चुनिए:\nREJOINDER (प्रत्युत्तर)',
          options: ['Request / Question (अनुरोध / प्रश्न)', 'Reply (उत्तर)', 'Counter-argument (प्रतिवाद)', 'Retort (हाजिरजवाबी)'],
          correctAnswer: 0,
          explanationEn: 'A rejoinder is a quick reply, retort, or counter-statement. Its antonym is an initial question or request.',
          explanationHi: 'Rejoinder का अर्थ प्रत्युत्तर या जवाबी तर्क होता है। इसका विलोम Request या Question है।'
        },
        {
          id: 'q_cpo_eng_10',
          section: 'English Comprehension',
          textEn: 'Select the correct meaning of the idiom:\n"As keen as mustard"',
          textHi: 'मुहावरे का सही अर्थ चुनिए:\n"As keen as mustard"',
          options: [
            'Extremely enthusiastic, eager, and interested (अत्यंत उत्साही और तत्पर)',
            'Sharp and bitter in taste (स्वाद में कड़वा)',
            'Easily provoked into anger (शीघ्र क्रोधित होने वाला)',
            'Deceitful and cunning (धूर्त और चालाक)'
          ],
          correctAnswer: 0,
          explanationEn: '"As keen as mustard" is a traditional idiom meaning intensely enthusiastic, diligent, or eager to do something.',
          explanationHi: '"As keen as mustard" का अर्थ अत्यधिक उत्साही और उत्सुक होना होता है।'
        },
        {
          id: 'q_cpo_eng_11',
          section: 'English Comprehension',
          textEn: 'Select the CORRECTLY spelled word:',
          textHi: 'सही वर्तनी वाले शब्द का चयन कीजिए:',
          options: ['Twelfth', 'Twelth', 'Twelvth', 'Twelthe'],
          correctAnswer: 0,
          explanationEn: 'The ordinal number for 12 is spelled "Twelfth" (with \'f\'). Notice: Twelve -> Twelfth.',
          explanationHi: '12वीं संख्या के लिए शुद्ध वर्तनी "Twelfth" (T-W-E-L-F-T-H) होती है।'
        },
        {
          id: 'q_cpo_eng_12',
          section: 'English Comprehension',
          textEn: 'Select the most appropriate meaning of the colloquial expression:\n"What a small world!"',
          textHi: 'अभिव्यक्ति का सही अर्थ चुनिए:\n"What a small world!"',
          options: [
            'Expressing amazement at an unexpected coincidence (अप्रत्याशित संयोग पर आश्चर्य व्यक्त करना)',
            'Saying the Earth is shrinking in size (पृथ्वी का आकार छोटा होना)',
            'Complaining about narrow spaces (तंग स्थान की शिकायत करना)',
            'Highlighting poor connectivity (खराब कनेक्टिविटी दिखाना)'
          ],
          correctAnswer: 0,
          explanationEn: '"What a small world!" is an idiom used when meeting someone unexpectedly in a distant place or discovering mutual acquaintances.',
          explanationHi: 'यह मुहावरा किसी अप्रत्याशित सुखद संयोग पर आश्चर्य प्रकट करने के लिए प्रयुक्त होता है।'
        },
        {
          id: 'q_cpo_eng_13',
          section: 'English Comprehension',
          textEn: 'Select the one-word substitution for:\n"A substance or medicine administered to counteract and neutralize the effects of venom or poison"',
          textHi: 'वाक्यांश के लिए एक शब्द चुनिए:\n"विष या जहर के प्रभाव को बेअसर करने वाली औषधि"',
          options: ['Antidote (प्रतिविष)', 'Antibiotic (प्रतिजैविक)', 'Antiseptic (रोगाणुरोधक)', 'Antipyretic (ज्वरनाशक)'],
          correctAnswer: 0,
          explanationEn: 'An Antidote neutralizes venom or poisons. Antibiotic treats bacterial infections; Antipyretic reduces fever.',
          explanationHi: 'विष के प्रभाव को नष्ट करने वाली दवा को Antidote (प्रतिविष) कहते हैं।'
        },
        {
          id: 'q_cpo_eng_14',
          section: 'English Comprehension',
          textEn: 'Select the most appropriate ANTONYM of the word:\nASSET',
          textHi: 'ASSET (परिसंपत्ति) का विलोम शब्द चुनिए:',
          options: ['Liability (देयता / दायित्व)', 'Resource (संसाधन)', 'Advantage (लाभ)', 'Boon (वरदान)'],
          correctAnswer: 0,
          explanationEn: 'An Asset is a useful or valuable quality or possession. Its financial and general antonym is a Liability (a debt or disadvantage).',
          explanationHi: 'Asset का विलोम Liability (दायित्व या बोझ) होता है।'
        },
        {
          id: 'q_cpo_eng_15',
          section: 'English Comprehension',
          textEn: 'Identify the segment containing an error in the sentence:\n"The fresh fruit custard prepared by the master chef tasted sweetly and had a rich texture."',
          textHi: 'वाक्य में व्याकरण की त्रुटि वाला भाग पहचानिए:',
          options: [
            'tasted sweetly',
            'fresh fruit custard',
            'prepared by the master chef',
            'had a rich texture'
          ],
          correctAnswer: 0,
          explanationEn: 'Verbs of sensation (taste, smell, look, feel, sound) take predicate ADJECTIVES rather than adverbs. Therefore, "tasted sweet" is correct, not "tasted sweetly".',
          explanationHi: 'इंद्रियबोधक क्रियाओं (taste, smell, look आदि) के साथ Adverb के बजाय Adjective का प्रयोग होता है। "tasted sweet" शुद्ध होगा।'
        }
      ]
    },

    // -----------------------------------------------------------------------------------
    // TEST 2: CISF ASI (EXE) & SI LDCE ALL INDIA FULL MOCK
    // -----------------------------------------------------------------------------------
    {
      id: 'test_cisf_ldce_01',
      title: 'CISF ASI (Exe) & SI LDCE 2026 - All India Full Mock Test #1',
      category: 'LDCE',
      targetExam: 'CISF ASI/Exe LDCE',
      description: 'Official pattern mock test based on CISF Act 1968, CISF Rules 2001, Industrial Security, Aviation Security ASG, IPC/CrPC, Reasoning, General Awareness, and Arithmetic.',
      durationMinutes: 120,
      totalMarks: 200,
      passingMarks: 100,
      marksPerQuestion: 1,
      negativeMarking: 0.25,
      featured: true,
      difficulty: 'Moderate to Advanced',
      sections: [
        'Professional Knowledge & CISF Act/Rules',
        'General Intelligence & Reasoning',
        'General Awareness & Security Affairs',
        'Numerical Ability & Mathematics',
        'English & Hindi Comprehension'
      ],
      questions: [
        {
          id: 'q_cisf_1',
          section: 'Professional Knowledge & CISF Act/Rules',
          textEn: 'Under which Section of the CISF Act, 1968, is a member of the Force empowered to arrest without warrant any person who commits a cognizable offence involving CISF property?',
          textHi: 'सीआईएसएफ अधिनियम, 1968 की किस धारा के तहत बल के किसी सदस्य को वारंट के बिना किसी भी व्यक्ति को गिरफ्तार करने का अधिकार है जो सीआईएसएफ संपत्ति से संबंधित संज्ञेय अपराध करता है?',
          options: [
            'Section 11 (धारा 11)',
            'Section 12 (धारा 12)',
            'Section 14 (धारा 14)',
            'Section 8 (धारा 8)'
          ],
          correctAnswer: 0,
          explanationEn: 'Section 11 of the CISF Act, 1968 deals with "Power to arrest without warrant". Any member of the Force may, without an order from a Magistrate and without a warrant, arrest any person who commits any cognizable offence relating to industrial undertakings.',
          explanationHi: 'सीआईएसएफ अधिनियम, 1968 की धारा 11 "वारंट के बिना गिरफ्तारी की शक्ति" से संबंधित है। बल का कोई भी सदस्य मजिस्ट्रेट के आदेश के बिना और वारंट के बिना किसी भी ऐसे व्यक्ति को गिरफ्तार कर सकता है जो औद्योगिक उपक्रमों से संबंधित संज्ञेय अपराध करता है।'
        },
        {
          id: 'q_cisf_2',
          section: 'Professional Knowledge & CISF Act/Rules',
          textEn: 'Under Section 100 of the Code of Criminal Procedure (CrPC), during a search of a closed place, how many independent and respectable inhabitants of the locality must be called to witness the search?',
          textHi: 'दंड प्रक्रिया संहिता (CrPC) की धारा 100 के तहत, किसी बंद स्थान की तलाशी के दौरान, तलाशी के साक्षी बनने के लिए इलाके के कितने स्वतंत्र और सम्मानित निवासियों को बुलाया जाना आवश्यक है?',
          options: [
            'At least one (कम से कम एक)',
            'Two or more (दो या दो से अधिक)',
            'At least four (कम से कम चार)',
            'No witnesses needed if conducted by Sub-Inspector (सब-इंस्पेक्टर द्वारा किए जाने पर साक्षी की आवश्यकता नहीं)'
          ],
          correctAnswer: 1,
          explanationEn: 'Section 100(4) CrPC mandates that before making a search, the officer shall call upon two or more independent and respectable inhabitants of the locality to attend and witness the search.',
          explanationHi: 'CrPC की धारा 100(4) अनिवार्य करती है कि तलाशी लेने से पहले, अधिकारी उस इलाके के दो या दो से अधिक स्वतंत्र और सम्मानित निवासियों को तलाशी में उपस्थित रहने और साक्षी बनने के लिए बुलाएगा।'
        },
        {
          id: 'q_cisf_3',
          section: 'Professional Knowledge & CISF Act/Rules',
          textEn: 'What is the full form of ASG in the context of CISF airport deployment?',
          textHi: 'सीआईएसएफ हवाई अड्डा तैनाती के संदर्भ में ASG का पूर्ण रूप क्या है?',
          options: [
            'Aviation Security Group (विमानन सुरक्षा समूह)',
            'Airport Surveillance Guard',
            'Armed Security Garrison',
            'Air Special Ground Unit'
          ],
          correctAnswer: 0,
          explanationEn: 'ASG stands for Aviation Security Group, the specialized elite CISF deployment for securing commercial civil airports across India under BCAS guidelines.',
          explanationHi: 'ASG का अर्थ Aviation Security Group (विमानन सुरक्षा समूह) है, जो भारत के वाणिज्यिक हवाई अड्डों की सुरक्षा में तैनात सीआईएसएफ की विशेष शाखा है।'
        },
        {
          id: 'q_cisf_4',
          section: 'General Intelligence & Reasoning',
          textEn: 'In a code language, if DEFENSE is coded as 4-5-6-5-14-19-5, how will COMMANDO be coded?',
          textHi: 'यदि DEFENSE को 4-5-6-5-14-19-5 लिखा जाता है, तो COMMANDO को क्या लिखा जाएगा?',
          options: [
            '3-15-13-13-1-14-4-15',
            '3-14-13-13-1-14-4-15',
            '3-15-12-12-1-14-4-15',
            '3-15-13-13-2-14-4-15'
          ],
          correctAnswer: 0,
          explanationEn: 'Each letter is replaced by its standard alphabetical position: C=3, O=15, M=13, M=13, A=1, N=14, D=4, O=15.',
          explanationHi: 'प्रत्येक अक्षर का वर्णमाला क्रमांक लिखा गया है: C=3, O=15, M=13, M=13, A=1, N=14, D=4, O=15।'
        },
        {
          id: 'q_cisf_5',
          section: 'General Awareness & Security Affairs',
          textEn: 'In which year was the Central Industrial Security Force (CISF) initially raised under an Act of Parliament?',
          textHi: 'केंद्रीय औद्योगिक सुरक्षा बल (CISF) की स्थापना संसद के एक अधिनियम के तहत किस वर्ष की गई थी?',
          options: ['1965', '1968', '1969', '1971'],
          correctAnswer: 2,
          explanationEn: 'The CISF Act was passed in 1968, and the force was raised on 10 March 1969 with an initial strength of 2,800 personnel.',
          explanationHi: 'सीआईएसएफ अधिनियम 1968 में पारित हुआ तथा बल की स्थापना 10 मार्च 1969 को लगभग 2,800 जवानों के साथ हुई।'
        }
      ]
    },

    // -----------------------------------------------------------------------------------
    // TEST 3: BSF & ITBP SI (GD) DEPARTMENTAL & BORDER MANAGEMENT MOCK
    // -----------------------------------------------------------------------------------
    {
      id: 'test_bsf_itbp_ldce_02',
      title: 'BSF & ITBP Sub-Inspector (GD) LDCE 2026 - Border Security Special',
      category: 'LDCE',
      targetExam: 'BSF & ITBP SI LDCE',
      description: 'Departmental promotion mock test for Border Security Force (BSF) and Indo-Tibetan Border Police (ITBP). Covers BSF Act 1968, ITBP Act 1992, Border Management (IB/LC/LAC), High Altitude Survival, Tactical Weapons, and Intelligence.',
      durationMinutes: 120,
      totalMarks: 200,
      passingMarks: 100,
      marksPerQuestion: 1,
      negativeMarking: 0.25,
      featured: true,
      difficulty: 'Hard',
      sections: [
        'Border Management, BSF & ITBP Acts',
        'Weapons & Tactical Fieldcraft',
        'General Intelligence & Reasoning',
        'General Awareness & Defense Affairs'
      ],
      questions: [
        {
          id: 'q_bsf_1',
          section: 'Border Management, BSF & ITBP Acts',
          textEn: 'Under the Ministry of Home Affairs notification, BSF officers are empowered to exercise powers of arrest, search, and seizure up to what distance from the International Border in Punjab, West Bengal, and Assam?',
          textHi: 'गृह मंत्रालय की अधिसूचना के तहत, बीएसएफ अधिकारियों को पंजाब, पश्चिम बंगाल और असम में अंतर्राष्ट्रीय सीमा से कितनी दूरी तक गिरफ्तारी, तलाशी और जब्ती की शक्तियों का प्रयोग करने का अधिकार दिया गया है?',
          options: [
            '15 km (15 किमी)',
            '50 km (50 किमी)',
            '80 km (80 किमी)',
            'Whole state jurisdiction (पूरे राज्य में)'
          ],
          correctAnswer: 1,
          explanationEn: 'In October 2021, the MHA extended BSF jurisdiction under Section 139 of the BSF Act 1968 to 50 km from the International Border inside Punjab, West Bengal, and Assam (previously 15 km).',
          explanationHi: 'अक्टूबर 2021 में गृह मंत्रालय ने बीएसएफ अधिनियम 1968 की धारा 139 के तहत पंजाब, पश्चिम बंगाल और असम में बीएसएफ का अधिकार क्षेत्र 15 किमी से बढ़ाकर 50 किमी तक कर दिया।'
        },
        {
          id: 'q_bsf_2',
          section: 'Border Management, BSF & ITBP Acts',
          textEn: 'The Indo-Tibetan Border Police (ITBP) was raised on 24 October 1962 in the wake of the Sino-Indian war. What is the official motto of ITBP?',
          textHi: 'भारत-चीन युद्ध के मद्देनजर 24 अक्टूबर 1962 को भारत-तिब्बत सीमा पुलिस (ITBP) की स्थापना की गई थी। ITBP का आधिकारिक ध्येय वाक्य (मोटो) क्या है?',
          options: [
            'Shaurya, Dridhata, Karm Nishtha (शौर्य, दृढ़ता, कर्म निष्ठा)',
            'Duty Unto Death (जीवन पर्यन्त कर्तव्य)',
            'Protection and Security (संरक्षण एवं सुरक्षा)',
            'Service and Loyalty (सेवा और निष्ठा)'
          ],
          correctAnswer: 0,
          explanationEn: 'The motto of ITBP is "Shaurya, Dridhata, Karm Nishtha" (Valour, Steadfastness, and Commitment). BSF\'s motto is "Duty Unto Death" and CRPF is "Service and Loyalty".',
          explanationHi: 'आईटीबीपी का ध्येय वाक्य "शौर्य, दृढ़ता, कर्म निष्ठा" है। बीएसएफ का "जीवन पर्यन्त कर्तव्य" और सीआरपीएफ का "सेवा और निष्ठा" है।'
        },
        {
          id: 'q_bsf_3',
          section: 'Weapons & Tactical Fieldcraft',
          textEn: 'Which medical condition occurs due to acute lack of atmospheric oxygen at high altitude altitudes above 10,000 feet, which ITBP troops undergo strict acclimatization to prevent?',
          textHi: '10,000 फीट से अधिक की ऊंचाई पर वायुमंडलीय ऑक्सीजन की कमी के कारण कौन सी गंभीर चिकित्सा स्थिति उत्पन्न होती है, जिसकी रोकथाम के लिए आईटीबीपी के जवान कड़े पर्यानुकूलन (acclimatization) से गुजरते हैं?',
          options: [
            'HAPE & HACE (High Altitude Pulmonary / Cerebral Edema)',
            'Hypoglycemia',
            'Decompression sickness',
            'Scurvy'
          ],
          correctAnswer: 0,
          explanationEn: 'HAPE (High Altitude Pulmonary Edema) and HACE (High Altitude Cerebral Edema) are potentially fatal conditions requiring immediate descent and hyperbaric oxygen.',
          explanationHi: 'उच्च हिमालयी क्षेत्रों में ऑक्सीजन की कमी से HAPE और HACE (फेफड़ों और मस्तिष्क में सूजन) की जानलेवा स्थिति बन सकती है।'
        },
        {
          id: 'q_bsf_4',
          section: 'Border Management, BSF & ITBP Acts',
          textEn: 'Assam Rifles, the oldest paramilitary force in India raised in 1835 as "Cachar Levy", operates under the dual control of which two Union Ministries?',
          textHi: '1835 में "कछार लेवी" के रूप में गठित भारत के सबसे पुराने अर्धसैनिक बल असम राइफल्स का दोहरा नियंत्रण किन दो केंद्रीय मंत्रालयों के पास है?',
          options: [
            'Ministry of Home Affairs (Admin) & Ministry of Defence (Operational)',
            'Ministry of Defence only',
            'Ministry of External Affairs & Home Affairs',
            'Ministry of Home Affairs only'
          ],
          correctAnswer: 0,
          explanationEn: 'Assam Rifles is under the administrative control of the Ministry of Home Affairs (MHA) and the operational control of the Indian Army under the Ministry of Defence (MoD).',
          explanationHi: 'असम राइफल्स का प्रशासनिक नियंत्रण गृह मंत्रालय (MHA) के पास और परिचालन नियंत्रण रक्षा मंत्रालय (भारतीय सेना) के अधीन होता है।'
        }
      ]
    },

    // -----------------------------------------------------------------------------------
    // TEST 4: CRPF SI (GD) DEPARTMENTAL PROMOTION MOCK
    // -----------------------------------------------------------------------------------
    {
      id: 'test_crpf_ldce_03',
      title: 'CRPF SI (GD) LDCE 2026 - Tactical Operations & Service Law',
      category: 'LDCE',
      targetExam: 'CRPF SI LDCE',
      description: 'Specialized departmental mock test for CRPF personnel preparing for promotion to Sub-Inspector (GD). Covers CRPF Act 1949, Riot Control drills, CoBRA tactical basics, IPC & CrPC, and reasoning.',
      durationMinutes: 90,
      totalMarks: 100,
      passingMarks: 50,
      marksPerQuestion: 1,
      negativeMarking: 0.25,
      featured: true,
      difficulty: 'Hard',
      sections: [
        'CRPF Act 1949 & Standing Orders',
        'Tactical Operations & Weapon Training',
        'General Intelligence & Reasoning',
        'Numerical Aptitude'
      ],
      questions: [
        {
          id: 'q_crpf_1',
          section: 'CRPF Act 1949 & Standing Orders',
          textEn: 'In which year was the Crown Representative Police renamed as the Central Reserve Police Force (CRPF) by an Act of Parliament?',
          textHi: 'संसद के एक अधिनियम द्वारा किस वर्ष में क्राउन रिप्रेजेंटेटिव पुलिस का नाम बदलकर केंद्रीय रिजर्व पुलिस बल (CRPF) किया गया था?',
          options: ['1947', '1949', '1950', '1952'],
          correctAnswer: 1,
          explanationEn: 'The CRPF was originally raised as the Crown Representative Police on 27 July 1939. It became the Central Reserve Police Force on the enactment of the CRPF Act on 28 December 1949.',
          explanationHi: 'सीआरपीएफ मूल रूप से 27 जुलाई 1939 को क्राउन रिप्रेजेंटेटिव पुलिस के रूप में गठित हुआ था। 28 दिसंबर 1949 को सीआरपीएफ अधिनियम लागू होने पर इसका नाम केंद्रीय रिजर्व पुलिस बल किया गया।'
        },
        {
          id: 'q_crpf_2',
          section: 'Tactical Operations & Weapon Training',
          textEn: 'What is the primary role of the CoBRA (Commando Battalion for Resolute Action) unit of CRPF?',
          textHi: 'सीआरपीएफ की कोबरा (कमांडो बटालियन फॉर रिजोल्यूट एक्शन) इकाई की प्राथमिक भूमिका क्या है?',
          options: [
            'Airport security and VIP protection',
            'Jungle warfare and counter-insurgency / anti-Naxal operations',
            'Border fence maintenance',
            'Cyber crime prevention'
          ],
          correctAnswer: 1,
          explanationEn: 'CoBRA was raised specifically in 2008 for guerrilla warfare, jungle combat, and targeted anti-Naxal operations in dense forest terrain.',
          explanationHi: 'कोबरा बटालियन को 2008 में विशेष रूप से घने जंगलों में गुरिल्ला युद्ध, जंगल मुकाबला और लक्षित नक्सल विरोधी अभियानों के लिए स्थापित किया गया था।'
        },
        {
          id: 'q_crpf_3',
          section: 'CRPF Act 1949 & Standing Orders',
          textEn: 'Under Section 9 of the CRPF Act 1949, which of the following acts is classified as a HEINOUS OFFENCE punishable with transportation for life or imprisonment up to 14 years?',
          textHi: 'सीआरपीएफ अधिनियम 1949 की धारा 9 के तहत, निम्नलिखित में से किस कृत्य को आजीवन निर्वासन या 14 वर्ष तक के कारावास से दंडनीय जघन्य अपराध (Heinous Offence) के रूप में वर्गीकृत किया गया है?',
          options: [
            'Absence without leave for 2 days',
            'Deserting the service or abandoning any post committed to his charge',
            'Intoxication on barracks',
            'Losing a cap or belt'
          ],
          correctAnswer: 1,
          explanationEn: 'Section 9 covers Heinous Offences including deserting the service, abandoning post/guard, or assisting enemies/mutineers.',
          explanationHi: 'सीआरपीएफ अधिनियम 1949 की धारा 9 जघन्य अपराधों से संबंधित है जिसमें सेवा छोड़ भागना (डेजर्ट करना), सुरक्षा चौकी को त्यागना या विद्रोहियों की सहायता करना शामिल है।'
        }
      ]
    },

    // -----------------------------------------------------------------------------------
    // TEST 5: UPSC CAPF (AC) PAPER-I FULL MOCK
    // -----------------------------------------------------------------------------------
    {
      id: 'test_capf_ac_04',
      title: 'UPSC CAPF (Assistant Commandant) 2026 - Paper I Full Mock',
      category: 'CAPF',
      targetExam: 'CAPF (AC) Paper-I',
      description: 'Comprehensive Paper-I (General Ability & Intelligence) mock test tailored to the latest UPSC standard for CISF, CRPF, BSF, ITBP, and SSB AC appointments.',
      durationMinutes: 120,
      totalMarks: 250,
      passingMarks: 125,
      marksPerQuestion: 2,
      negativeMarking: 0.66,
      featured: true,
      difficulty: 'Advanced',
      sections: [
        'Indian Polity & Governance',
        'History of India & National Movement',
        'General Science & Defense Technology',
        'Logical Reasoning & Analytical Ability'
      ],
      questions: [
        {
          id: 'q_capf_1',
          section: 'Indian Polity & Governance',
          textEn: 'Under Article 352 of the Indian Constitution, on which of the following grounds can a National Emergency be proclaimed?',
          textHi: 'भारतीय संविधान के अनुच्छेद 352 के तहत, राष्ट्रीय आपातकाल की घोषणा निम्नलिखित में से किस आधार पर की जा सकती है?',
          options: [
            'War, External Aggression or Internal Disturbance',
            'War, External Aggression or Armed Rebellion',
            'Financial Instability or Threat to Credit',
            'Breakdown of Constitutional Machinery in a State'
          ],
          correctAnswer: 1,
          explanationEn: 'By the 44th Constitutional Amendment Act 1978, the phrase "internal disturbance" was replaced with "armed rebellion". Currently Article 352 grounds are: War, External Aggression, or Armed Rebellion.',
          explanationHi: '44वें संविधान संशोधन अधिनियम 1978 द्वारा "आंतरिक अशांति" शब्द को "सशस्त्र विद्रोह" से बदल दिया गया था। अतः वर्तमान आधार: युद्ध, बाह्य आक्रमण या सशस्त्र विद्रोह हैं।'
        },
        {
          id: 'q_capf_2',
          section: 'General Science & Defense Technology',
          textEn: 'What type of missile is the "BrahMos" developed jointly by India and Russia?',
          textHi: 'भारत और रूस द्वारा संयुक्त रूप से विकसित "ब्रह्मोस" किस प्रकार की मिसाइल है?',
          options: [
            'Subsonic Intercontinental Ballistic Missile',
            'Supersonic Cruise Missile',
            'Hypersonic Anti-Tank Guided Missile',
            'Short Range Surface-to-Air Missile'
          ],
          correctAnswer: 1,
          explanationEn: 'BrahMos is a medium-range supersonic cruise missile that can be launched from submarines, ships, aircraft, or land. It travels at speeds around Mach 2.8 to 3.0.',
          explanationHi: 'ब्रह्मोस एक मध्यम दूरी की सुपरसोनिक क्रूज मिसाइल है जिसे पनडुब्बियों, जहाजों, विमानों या जमीन से लॉन्च किया जा सकता है। इसकी गति लगभग मैक 2.8 से 3.0 है।'
        }
      ]
    },

    // -----------------------------------------------------------------------------------
    // TEST 6: BANK PO PRELIMS
    // -----------------------------------------------------------------------------------
    {
      id: 'test_bank_po_05',
      title: 'IBPS & SBI PO Prelims 2026 - High Accuracy Speed Mock',
      category: 'Bank',
      targetExam: 'SBI / IBPS PO',
      description: 'Pattern mock for Bank PO: Quantitative Aptitude, Reasoning Ability, and English Language with strict sectional timing standards and negative marking.',
      durationMinutes: 60,
      totalMarks: 100,
      passingMarks: 62,
      marksPerQuestion: 1,
      negativeMarking: 0.25,
      featured: true,
      difficulty: 'Hard',
      sections: [
        'Quantitative Aptitude',
        'Reasoning Ability',
        'English Language'
      ],
      questions: [
        {
          id: 'q_bank_1',
          section: 'Quantitative Aptitude',
          textEn: 'A sum of money doubles itself at compound interest in 4 years. In how many years will it become 8 times itself at the same rate?',
          textHi: 'एक धनराशि चक्रवृद्धि ब्याज पर 4 वर्षों में स्वयं की दोगुनी हो जाती है। समान दर पर यह कितने वर्षों में स्वयं की 8 गुनी हो जाएगी?',
          options: ['8 years', '12 years', '16 years', '24 years'],
          correctAnswer: 1,
          explanationEn: 'Under CI: 2^1 times in 4 years. 8 times = 2^3 times. Time = 3 * 4 = 12 years.',
          explanationHi: 'चक्रवृद्धि ब्याज में राशि 4 वर्षों में 2 गुनी (2^1) होती है। 8 गुनी (2^3) होने में समय = 3 * 4 = 12 वर्ष।'
        },
        {
          id: 'q_bank_2',
          section: 'Reasoning Ability',
          textEn: 'In a row of 35 students facing North, Amit is 12th from the left end and Sumit is 18th from the right end. How many students sit between Amit and Sumit?',
          textHi: 'उत्तर दिशा की ओर मुख किए हुए 35 छात्रों की एक पंक्ति में, अमित बाएं छोर से 12वें स्थान पर है और सुमित दाएं छोर से 18वें स्थान पर है। अमित और सुमित के बीच कितने छात्र बैठे हैं?',
          options: ['4', '5', '6', '7'],
          correctAnswer: 1,
          explanationEn: 'Total = 35. Left position of Amit = 12. Right position of Sumit = 18. Sum of positions = 12 + 18 = 30. Between = 35 - 30 = 5 students.',
          explanationHi: 'कुल = 35। बाएं से अमित = 12। दाएं से सुमित = 18। योग = 30। बीच के छात्र = 35 - 30 = 5 छात्र।'
        }
      ]
    },

    // -----------------------------------------------------------------------------------
    // TEST 7: SSC CGL TIER-1 CHAMPIONSHIP
    // -----------------------------------------------------------------------------------
    {
      id: 'test_ssc_cgl_06',
      title: 'SSC CGL 2026 Tier-1 All India Championship Mock Test',
      category: 'SSC',
      targetExam: 'SSC CGL Tier-1',
      description: 'Official Tier-1 format: 2 marks per question with 0.5 negative marking across Reasoning, General Awareness, Quantitative Aptitude, and English.',
      durationMinutes: 60,
      totalMarks: 200,
      passingMarks: 135,
      marksPerQuestion: 2,
      negativeMarking: 0.5,
      featured: true,
      difficulty: 'Moderate',
      sections: [
        'General Intelligence and Reasoning',
        'General Awareness',
        'Quantitative Aptitude',
        'English Comprehension'
      ],
      questions: [
        {
          id: 'q_cgl_1',
          section: 'General Awareness',
          textEn: 'Which classical dance form originated in the state of Kerala and is known for its dramatic facial makeup and elaborate headgear?',
          textHi: 'किस शास्त्रीय नृत्य शैली की उत्पत्ति केरल राज्य में हुई और यह अपने नाटकीय चेहरे के श्रृंगार और विस्तृत मुकुट के लिए जानी जाती है?',
          options: ['Kathakali (कथकली)', 'Bharatanatyam (भरतनाट्यम)', 'Kuchipudi (कुचिपुड़ी)', 'Kathak (कथक)'],
          correctAnswer: 0,
          explanationEn: 'Kathakali is the traditional classical dance-drama of Kerala famous for its distinctive colorful makeup, costumes, and face masks.',
          explanationHi: 'कथकली केरल का पारंपरिक शास्त्रीय नृत्य-नाटक है जो अपने विशिष्ट रंगीन श्रृंगार, वेशभूषा और मुखौटों के लिए प्रसिद्ध है।'
        },
        {
          id: 'q_cgl_2',
          section: 'Quantitative Aptitude',
          textEn: 'If x + (1/x) = 5, find the value of x^2 + (1/x^2).',
          textHi: 'यदि x + (1/x) = 5 है, तो x^2 + (1/x^2) का मान ज्ञात कीजिए।',
          options: ['23', '25', '27', '21'],
          correctAnswer: 0,
          explanationEn: 'x^2 + 1/x^2 = (x + 1/x)^2 - 2 = 5^2 - 2 = 25 - 2 = 23.',
          explanationHi: 'x^2 + 1/x^2 = (x + 1/x)^2 - 2 = 25 - 2 = 23।'
        }
      ]
    }
  ];

  return { defaultUsers, defaultTests };
}

module.exports = { getSeedData };
