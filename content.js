"use strict";
// Original six units, preserved from reference/old-course.html.
const LEGACY_COURSE = [
{
  id:"u1", title:"At the Doctor", am:"ሐኪም ቤት",
  steps:[
    {t:"dialog", intro:"Listen to the conversation. Tap ▶ on each line.", introAm:"ንግግሩን አዳምጪ። በእያንዳንዱ መስመር ላይ ▶ ንኪ።",
     lines:[
      {who:"Front desk", b:false, en:"Good morning. How can I help you?", am:"እንደምን አደሩ። ምን ልርዳዎት?"},
      {who:"You", b:true, en:"I have an appointment at ten o'clock.", am:"አራት ሰዓት (በፈረንጅ 10:00) ላይ ቀጠሮ አለኝ።"},
      {who:"Front desk", b:false, en:"What is your name, please?", am:"ስምዎ ማን ነው?"},
      {who:"You", b:true, en:"My name is Almaz. A-L-M-A-Z.", am:"ስሜ አልማዝ ነው።"},
      {who:"Front desk", b:false, en:"Thank you. Please sit down and wait.", am:"አመሰግናለሁ። እባክዎ ተቀምጠው ይጠብቁ።"}
     ]},
    {t:"vocab", intro:"New words. Tap a word to hear it.", introAm:"አዲስ ቃላት። ለመስማት ቃሉን ንኪ።",
     words:[
      {en:"appointment", say:"a-POINT-ment", am:"ቀጠሮ"},
      {en:"medicine", say:"MED-i-sin", am:"መድኃኒት"},
      {en:"fever", say:"FEE-ver", am:"ትኩሳት"},
      {en:"cough", say:"koff", am:"ሳል"},
      {en:"pain", say:"payn", am:"ሕመም"},
      {en:"nurse", say:"nurs", am:"ነርስ"},
      {en:"pharmacy", say:"FAR-ma-see", am:"መድኃኒት ቤት"}
     ]},
    {t:"match", intro:"Match the English word with the Amharic word.", introAm:"የእንግሊዝኛውን ቃል ከአማርኛው ጋር አዛምጂ።",
     pairs:[["appointment","ቀጠሮ"],["medicine","መድኃኒት"],["fever","ትኩሳት"],["cough","ሳል"],["nurse","ነርስ"]]},
    {t:"listen", audio:"I have a fever and a bad cough.",
     q:"What did you hear?", qAm:"ምን ሰማሽ?",
     opts:["I have a fever and a bad cough.","I have a doctor and a bad car.","I have a fever and a big cup."], a:0},
    {t:"build", audio:"I need to see a doctor.",
     q:"Put the words in order.", qAm:"ቃላቱን በቅደም ተከተል አስቀምጪ።",
     answer:"I need to see a doctor."},
    {t:"mc", q:"The doctor says: \"Where does it hurt?\" What do you say?",
     qAm:"ሐኪሙ \"የት ነው የሚያመው?\" ብሎ ሲጠይቅ ምን ትያለሽ?",
     opts:["My back hurts.","I am fine, thank you.","See you tomorrow."], a:0,
     why:"\"My back hurts\" tells the doctor where the pain is.", whyAm:"\"My back hurts\" ማለት \"ጀርባዬ ያመኛል\" ማለት ነው።"},
    {t:"type", audio:"pharmacy", q:"Type the English word:", amHint:"መድኃኒት ቤት", answer:"pharmacy"},
    {t:"say", en:"I have an appointment at ten o'clock.", am:"አራት ሰዓት (በፈረንጅ 10:00) ላይ ቀጠሮ አለኝ።"}
  ]
},
{
  id:"u2", title:"Shopping and Money", am:"ገበያና ገንዘብ",
  steps:[
    {t:"dialog", intro:"Listen to the conversation at the store.", introAm:"በሱቅ ውስጥ ያለውን ንግግር አዳምጪ።",
     lines:[
      {who:"You", b:true, en:"Excuse me, how much is this?", am:"ይቅርታ፣ ይህ ስንት ነው?"},
      {who:"Clerk", b:false, en:"It is twelve dollars and fifty cents.", am:"አሥራ ሁለት ዶላር ከሃምሳ ሳንቲም ነው።"},
      {who:"You", b:true, en:"That is too expensive. Is it on sale?", am:"በጣም ውድ ነው። ቅናሽ አለው?"},
      {who:"Clerk", b:false, en:"Yes, today it is ten dollars.", am:"አዎ፣ ዛሬ አሥር ዶላር ነው።"},
      {who:"You", b:true, en:"Good. I will take it. Here is cash.", am:"ጥሩ። እወስደዋለሁ። ጥሬ ገንዘብ ይኸውና።"}
     ]},
    {t:"vocab", intro:"New words.", introAm:"አዲስ ቃላት።",
     words:[
      {en:"price", say:"prise", am:"ዋጋ"},
      {en:"expensive", say:"ex-PEN-siv", am:"ውድ"},
      {en:"cheap", say:"cheep", am:"ርካሽ"},
      {en:"receipt", say:"re-SEET", am:"ደረሰኝ"},
      {en:"change", say:"chaynj", am:"መልስ (ገንዘብ)"},
      {en:"cash", say:"kash", am:"ጥሬ ገንዘብ"},
      {en:"size", say:"size", am:"መጠን / ልክ"}
     ]},
    {t:"match", intro:"Match the words.", introAm:"ቃላቱን አዛምጂ።",
     pairs:[["price","ዋጋ"],["expensive","ውድ"],["cheap","ርካሽ"],["receipt","ደረሰኝ"],["cash","ጥሬ ገንዘብ"]]},
    {t:"listen", audio:"How much does this cost?", q:"What did you hear?", qAm:"ምን ሰማሽ?",
     opts:["How much does this cost?","How many does this cost?","How much is the coast?"], a:0},
    {t:"build", audio:"Can I pay with a card?", q:"Put the words in order.", qAm:"ቃላቱን በቅደም ተከተል አስቀምጪ።",
     answer:"Can I pay with a card?"},
    {t:"mc", q:"You paid $20 for something that costs $15. What do you ask for?",
     qAm:"$15 ለሚያወጣ ነገር $20 ከፈልሽ። ምን ትጠይቂያለሽ?",
     opts:["My change, please.","My receipt is expensive.","A bigger size, please."], a:0,
     why:"Change is the money the store gives back to you.", whyAm:"Change ማለት ሱቁ የሚመልስልሽ ገንዘብ ነው።"},
    {t:"type", audio:"receipt", q:"Type the English word:", amHint:"ደረሰኝ", answer:"receipt"},
    {t:"say", en:"That is too expensive. Do you have a cheaper one?", am:"በጣም ውድ ነው። ርካሽ ያለው አለ?"}
  ]
},
{
  id:"u3", title:"On the Phone", am:"በስልክ",
  steps:[
    {t:"dialog", intro:"A phone call to a clinic.", introAm:"ወደ ክሊኒክ የተደረገ የስልክ ጥሪ።",
     lines:[
      {who:"Clinic", b:false, en:"Hello, City Clinic. How may I help you?", am:"ሀሎ፣ ሲቲ ክሊኒክ። እንዴት ልርዳዎት?"},
      {who:"You", b:true, en:"Hello. I would like to make an appointment.", am:"ሰላም። ቀጠሮ መያዝ እፈልጋለሁ።"},
      {who:"Clinic", b:false, en:"Can you come on Tuesday at two?", am:"ማክሰኞ ስምንት ሰዓት (በፈረንጅ 2:00) መምጣት ይችላሉ?"},
      {who:"You", b:true, en:"Yes, that works. Sorry, can you repeat that?", am:"አዎ፣ ይሆናል። ይቅርታ፣ እንደገና ሊሉት ይችላሉ?"},
      {who:"Clinic", b:false, en:"Tuesday at two o'clock. See you then.", am:"ማክሰኞ ስምንት ሰዓት (በፈረንጅ 2:00)። እስከዚያ።"}
     ]},
    {t:"vocab", intro:"Useful phone words.", introAm:"ለስልክ የሚጠቅሙ ቃላት።",
     words:[
      {en:"message", say:"MESS-ij", am:"መልእክት"},
      {en:"repeat", say:"re-PEET", am:"እንደገና መናገር"},
      {en:"spell", say:"spel", am:"ፊደል መጥራት"},
      {en:"cancel", say:"KAN-sel", am:"መሰረዝ"},
      {en:"wait", say:"wayt", am:"መጠበቅ"},
      {en:"call back", say:"kawl bak", am:"መልሶ መደወል"}
     ]},
    {t:"mc", q:"You did not understand. What is the polite thing to say?",
     qAm:"አልገባሽም። በትህትና ምን ትያለሽ?",
     opts:["Sorry, could you repeat that, please?","Speak now.","No, no, no."], a:0,
     why:"\"Could you repeat that, please?\" is polite and clear.", whyAm:"ይህ ሐረግ ትሁትና ግልጽ ነው።"},
    {t:"match", intro:"Match the words.", introAm:"ቃላቱን አዛምጂ።",
     pairs:[["message","መልእክት"],["cancel","መሰረዝ"],["wait","መጠበቅ"],["spell","ፊደል መጥራት"]]},
    {t:"listen", audio:"Please leave a message after the beep.", q:"What did you hear?", qAm:"ምን ሰማሽ?",
     opts:["Please leave a message after the beep.","Please leave the market after the beach.","Please live a message after the bill."], a:0},
    {t:"build", audio:"I would like to make an appointment.", q:"Put the words in order.", qAm:"ቃላቱን በቅደም ተከተል አስቀምጪ።",
     answer:"I would like to make an appointment."},
    {t:"type", audio:"message", q:"Type the English word:", amHint:"መልእክት", answer:"message"},
    {t:"say", en:"Hello, this is Almaz. Can you call me back, please?", am:"ሰላም፣ አልማዝ ነኝ። እባክዎ መልሰው ሊደውሉልኝ ይችላሉ?"}
  ]
},
{
  id:"u4", title:"Finding Your Way", am:"መንገድ መጠየቅ",
  steps:[
    {t:"dialog", intro:"Asking for directions on the street.", introAm:"በመንገድ ላይ አቅጣጫ መጠየቅ።",
     lines:[
      {who:"You", b:true, en:"Excuse me, where is the bus stop?", am:"ይቅርታ፣ የአውቶቡስ ማቆሚያው የት ነው?"},
      {who:"Man", b:false, en:"Go straight for two blocks.", am:"ሁለት ብሎክ ቀጥታ ይሂዱ።"},
      {who:"Man", b:false, en:"Then turn left at the corner.", am:"ከዚያ ጥጉ ላይ ወደ ግራ ይታጠፉ።"},
      {who:"You", b:true, en:"Is it near the pharmacy?", am:"መድኃኒት ቤቱ አጠገብ ነው?"},
      {who:"Man", b:false, en:"Yes, it is across from the pharmacy.", am:"አዎ፣ ከመድኃኒት ቤቱ ትይዩ ነው።"}
     ]},
    {t:"vocab", intro:"Direction words.", introAm:"የአቅጣጫ ቃላት።",
     words:[
      {en:"left", say:"left", am:"ግራ"},
      {en:"right", say:"rite", am:"ቀኝ"},
      {en:"straight", say:"strayt", am:"ቀጥታ"},
      {en:"corner", say:"KOR-ner", am:"ጥግ / ማዕዘን"},
      {en:"near", say:"neer", am:"አጠገብ"},
      {en:"across from", say:"a-KROSS from", am:"ትይዩ"},
      {en:"bus stop", say:"bus stop", am:"የአውቶቡስ ማቆሚያ"}
     ]},
    {t:"match", intro:"Match the words.", introAm:"ቃላቱን አዛምጂ።",
     pairs:[["left","ግራ"],["right","ቀኝ"],["straight","ቀጥታ"],["near","አጠገብ"],["corner","ጥግ"]]},
    {t:"listen", audio:"Turn right at the second light.", q:"What did you hear?", qAm:"ምን ሰማሽ?",
     opts:["Turn right at the second light.","Turn write at the second night.","Turn right at the second right."], a:0},
    {t:"mc", q:"Someone says: \"It is across from the bank.\" Where is it?",
     qAm:"አንድ ሰው \"ከባንኩ ትይዩ ነው\" አለ። የት ነው ያለው?",
     opts:["On the other side of the street from the bank.","Inside the bank.","Very far from the bank."], a:0,
     why:"Across from = on the opposite side.", whyAm:"Across from ማለት በተቃራኒው በኩል ማለት ነው።"},
    {t:"build", audio:"Go straight and turn left.", q:"Put the words in order.", qAm:"ቃላቱን በቅደም ተከተል አስቀምጪ።",
     answer:"Go straight and turn left."},
    {t:"type", audio:"straight", q:"Type the English word:", amHint:"ቀጥታ", answer:"straight"},
    {t:"say", en:"Excuse me, how do I get to the train station?", am:"ይቅርታ፣ ወደ ባቡር ጣቢያው እንዴት እደርሳለሁ?"}
  ]
},
{
  id:"u5", title:"Talking About Yesterday", am:"ስላለፈው ጊዜ",
  steps:[
    {t:"grammar", title:"Past tense — ያለፈ ጊዜ",
     body:"To talk about yesterday, English changes the verb. Many verbs add <b>-ed</b>. But some verbs change completely — you must remember these.",
     bodyAm:"ስለ ትናንት ስንናገር ግሱ ይቀየራል። ብዙዎቹ <b>-ed</b> ይጨምራሉ። አንዳንዶቹ ግን ሙሉ በሙሉ ይቀየራሉ — እነዚህን ማስታወስ ያስፈልጋል።",
     rows:[["work → worked","ሰራ"],["walk → walked","ተራመደ"],["go → went","ሄደ"],["buy → bought","ገዛ"],["eat → ate","በላ"],["see → saw","አየ"],["is/am → was","ነበር"]]},
    {t:"vocab", intro:"Time words for the past.", introAm:"ስላለፈ ጊዜ የሚያመለክቱ ቃላት።",
     words:[
      {en:"yesterday", say:"YES-ter-day", am:"ትናንት"},
      {en:"last week", say:"last week", am:"ባለፈው ሳምንት"},
      {en:"last night", say:"last nite", am:"ትናንት ማታ"},
      {en:"two days ago", say:"too days a-GO", am:"ከሁለት ቀን በፊት"},
      {en:"this morning", say:"this MOR-ning", am:"ዛሬ ጠዋት"}
     ]},
    {t:"mc", q:"Yesterday I ___ to the store.", qAm:"ትናንት ወደ ሱቅ ___።",
     opts:["went","go","going"], a:0, why:"go → went in the past.", whyAm:"go በአለፈ ጊዜ went ይሆናል።"},
    {t:"mc", q:"Last week she ___ a new coat.", qAm:"ባለፈው ሳምንት አዲስ ኮት ___።",
     opts:["bought","buy","buys"], a:0, why:"buy → bought in the past.", whyAm:"buy በአለፈ ጊዜ bought ይሆናል።"},
    {t:"match", intro:"Match the verb with its past form.", introAm:"ግሱን ካለፈ ጊዜ ቅርጹ ጋር አዛምጂ።",
     pairs:[["eat","ate"],["see","saw"],["go","went"],["buy","bought"],["work","worked"]]},
    {t:"build", audio:"I went to the doctor yesterday.", q:"Put the words in order.", qAm:"ቃላቱን በቅደም ተከተል አስቀምጪ።",
     answer:"I went to the doctor yesterday."},
    {t:"listen", audio:"She was very tired last night.", q:"What did you hear?", qAm:"ምን ሰማሽ?",
     opts:["She was very tired last night.","She is very tired last night.","She was very tried last night."], a:0},
    {t:"type", audio:"yesterday", q:"Type the English word:", amHint:"ትናንት", answer:"yesterday"},
    {t:"say", en:"Yesterday I went to the market and bought bread.", am:"ትናንት ወደ ገበያ ሄጄ ዳቦ ገዛሁ።"}
  ]
},
{
  id:"u6", title:"Work and Neighbors", am:"ስራና ጎረቤት",
  steps:[
    {t:"dialog", intro:"Talking with a coworker.", introAm:"ከስራ ባልደረባ ጋር መነጋገር።",
     lines:[
      {who:"Sara", b:false, en:"Good morning! How was your weekend?", am:"እንደምን አደርሽ! ቅዳሜና እሁድሽ እንዴት ነበር?"},
      {who:"You", b:true, en:"It was good, thank you. And yours?", am:"ጥሩ ነበር፣ አመሰግናለሁ። ያንቺስ?"},
      {who:"Sara", b:false, en:"Busy! Can you help me for a minute?", am:"ስራ በዝቶብኝ ነበር! ለአንድ ደቂቃ ልትረጂኝ ትችያለሽ?"},
      {who:"You", b:true, en:"Of course. What do you need?", am:"በእርግጥ። ምን ያስፈልግሻል?"},
      {who:"Sara", b:false, en:"My break is at noon. Let's eat together.", am:"እረፍቴ ስድስት ሰዓት ላይ ነው። አብረን እንብላ።"}
     ]},
    {t:"vocab", intro:"Everyday work words.", introAm:"የዕለት ተዕለት የስራ ቃላት።",
     words:[
      {en:"break", say:"brayk", am:"እረፍት"},
      {en:"busy", say:"BIZ-ee", am:"ስራ የበዛበት"},
      {en:"late", say:"layt", am:"ዘግይቶ"},
      {en:"ready", say:"RED-ee", am:"ዝግጁ"},
      {en:"understand", say:"un-der-STAND", am:"መረዳት"},
      {en:"help", say:"help", am:"እርዳታ"}
     ]},
    {t:"mc", q:"You will arrive 20 minutes late. What do you say on the phone?",
     qAm:"20 ደቂቃ ዘግይተሽ ትደርሻለሽ። በስልክ ምን ትያለሽ?",
     opts:["I am sorry, I will be twenty minutes late.","I am twenty minutes ready.","I have twenty late minutes."], a:0,
     why:"\"I will be late\" is the natural way to say it.", whyAm:"\"I will be late\" ትክክለኛው አገላለጽ ነው።"},
    {t:"match", intro:"Match the words.", introAm:"ቃላቱን አዛምጂ።",
     pairs:[["break","እረፍት"],["busy","ስራ የበዛበት"],["late","ዘግይቶ"],["ready","ዝግጁ"],["help","እርዳታ"]]},
    {t:"listen", audio:"I do not understand. Can you say it slowly?", q:"What did you hear?", qAm:"ምን ሰማሽ?",
     opts:["I do not understand. Can you say it slowly?","I do not understand. Can you stay a little?","I do not stand up. Can you say it slowly?"], a:0},
    {t:"build", audio:"Could you help me, please?", q:"Put the words in order.", qAm:"ቃላቱን በቅደም ተከተል አስቀምጪ።",
     answer:"Could you help me, please?"},
    {t:"type", audio:"understand", q:"Type the English word:", amHint:"መረዳት", answer:"understand"},
    {t:"say", en:"I am sorry, I do not understand. Could you say it again slowly?", am:"ይቅርታ፣ አልገባኝም። እባክዎ ቀስ ብለው እንደገና ሊሉት ይችላሉ?"}
  ]
}
];

// Content constructors keep all teaching material in this file. No network assets.
const wordRows = rows => rows.map(([en, say, am]) => ({en, say, am}));
const dialogRows = rows => rows.map(([who, en, am]) => ({who, en, am, b:who === 'You'}));
const newLines = [
  {
    id:'bus', title:'Bus & Train', am:'ባቡርና አውቶቡስ', icon:'🚍', color:'#B0342A', stamp:'Bus',
    stopNames:['Leave Malden Center', 'Change at State', 'Get to the airport'],
    words:wordRows([
      ['CharlieCard','CHAR-lee kard','ቻርሊ ካርድ'], ['fare','fair','የጉዞ ክፍያ'],
      ['Orange Line','OR-inj line','ብርቱካናማው መስመር'], ['Blue Line','bloo line','ሰማያዊው መስመር'],
      ['transfer','TRANS-fer','መቀየር'], ['delay','di-LAY','መዘግየት'],
      ['next stop','nekst stop','ቀጣዩ ማቆሚያ'], ['station','STAY-shun','ጣቢያ'],
      ['shuttle bus','SHUT-ul bus','የማመላለሻ አውቶቡስ'], ['terminal','TER-mih-nul','የአውሮፕላን ማረፊያ ተርሚናል'],
      ['inbound','IN-bound','ወደ ከተማው መሃል'], ['outbound','OUT-bound','ከከተማው መሃል ወደ ውጭ']
    ]),
    dialog:dialogRows([
      ['You','Does this train go to State?','ይህ ባቡር ወደ ስቴት ጣቢያ ይሄዳል?'],
      ['Worker','Yes. Inbound trains go to State.','አዎ። ወደ ከተማ የሚሄዱት ባቡሮች ስቴት ይደርሳሉ።'],
      ['You','Where do I transfer to the Blue Line?','ወደ ሰማያዊው መስመር የምቀይረው የት ነው?'],
      ['Worker','At State. Follow the blue signs.','ስቴት ላይ። ሰማያዊ ምልክቶቹን ይከተሉ።'],
      ['You','Does this shuttle go to the terminals?','ይህ የማመላለሻ አውቶቡስ ወደ ተርሚናሎቹ ይሄዳል?'],
      ['Driver','Yes. Have a good day!','አዎ። መልካም ቀን!']
    ]),
    situations:[
      ['You want to check your train. What do you ask?','ባቡሩን ለማረጋገጥ ምን ትጠይቂያለሽ?','Does this train go to State?','My back hurts.','I need a receipt.'],
      ['You need to change trains. What do you ask?','ባቡር ለመቀየር ምን ትጠይቂያለሽ?','Where do I transfer to the Blue Line?','How much is this shirt?','I am sick today.'],
      ['The train is not moving. What do you ask?','ባቡሩ ቆሟል። ምን ትጠይቂያለሽ?','Is there a delay?','I have a fever.','Can I pay with a card?']
    ],
    sentences:[
      ['Does this train go to State?','ይህ ባቡር ወደ ስቴት ጣቢያ ይሄዳል?'],
      ['Where do I transfer to the Blue Line?','ወደ ሰማያዊው መስመር የምቀይረው የት ነው?'],
      ['Is there a delay?','መዘግየት አለ?'],
      ['Excuse me, this is my stop.','ይቅርታ፣ የምወርደው እዚህ ነው።']
    ]
  },
  {
    id:'work', title:'At Work: Cashier', am:'ስራ ላይ፡ ገንዘብ ተቀባይ', icon:'🛒', color:'#3C6E4F', stamp:'Register',
    stopNames:['A customer is here','Ring it up','Have a nice flight'],
    words:wordRows([
      ['customer','KUS-tuh-mer','ደንበኛ'], ['cashier','ka-SHEER','ገንዘብ ተቀባይ'],
      ['total','TOH-tul','ጠቅላላ ዋጋ'], ['change','chaynj','መልስ (ገንዘብ)'],
      ['receipt','ri-SEET','ደረሰኝ'], ['bag','bag','ፌስታል'],
      ['cash','kash','ጥሬ ገንዘብ'], ['card','kard','ካርድ'],
      ['flight','flyt','በረራ'], ['gate','gayt','የመሳፈሪያ በር'],
      ['manager','MAN-ih-jer','ሥራ አስኪያጅ'], ['shift','shift','የስራ ፈረቃ']
    ]),
    dialog:dialogRows([
      ['Customer','Hi. How much is this water?','ሰላም። ይህ ውሃ ስንት ነው?'],
      ['You','It is three dollars and fifty cents.','ሦስት ዶላር ከሃምሳ ሳንቲም ነው።'],
      ['Customer','Can I pay with a card?','በካርድ መክፈል እችላለሁ?'],
      ['You','Yes. Tap your card here.','አዎ። ካርድዎን እዚህ ያስነኩ።'],
      ['You','Do you need a bag?','ፌስታል ይፈልጋሉ?'],
      ['You','Here is your receipt. Have a nice flight!','ደረሰኝዎ ይኸውና። መልካም በረራ!']
    ]),
    situations:[
      ['A customer is ready to pay. What do you say?','ደንበኛው ለመክፈል ዝግጁ ነው። ምን ትያለሽ?','Your total is eight fifty.','Where is the bus stop?','I have a fever.'],
      ['You did not hear the customer. What do you say?','ደንበኛው ያለውን አልሰማሽም። ምን ትያለሽ?','Sorry, can you say that again?','Is there a delay?','I bought bread.'],
      ['The customer is leaving for a plane. What do you say?','ደንበኛው ወደ አውሮፕላን እየሄደ ነው። ምን ትያለሽ?','Have a nice flight!','Where do I transfer?','My back hurts.']
    ],
    sentences:[['Your total is eight fifty.','ጠቅላላ ዋጋው ስምንት ዶላር ከሃምሳ ሳንቲም ነው።'],['Do you need a bag?','ፌስታል ይፈልጋሉ?'],['Sorry, can you say that again?','ይቅርታ፣ እንደገና ሊሉት ይችላሉ?'],['Have a nice flight!','መልካም በረራ!']]
  },
  {
    id:'numbers', title:'Numbers, Time & Days', am:'ቁጥር፣ ሰዓትና ቀን', icon:'🗓️', color:'#A66B12', stamp:'Calendar',
    stopNames:['Numbers & prices','Make time','Days & dates'],
    words:wordRows([
      ['one','wun','አንድ'], ['two','too','ሁለት'], ['ten','ten','አሥር'],
      ['twenty','TWEN-tee','ሃያ'], ['fifty','FIF-tee','ሃምሳ'], ['one hundred','wun HUN-dred','አንድ መቶ'],
      ['half past seven','haf past SEV-un','በፈረንጅ 7:30'], ['noon','noon','ቀትር'],
      ['Monday','MUN-day','ሰኞ'], ['Tuesday','TOOZ-day','ማክሰኞ'],
      ['today','tuh-DAY','ዛሬ'], ['tomorrow','tuh-MOR-oh','ነገ']
    ]),
    dialog:dialogRows([
      ['Clerk','It is twelve dollars and fifty cents.','አሥራ ሁለት ዶላር ከሃምሳ ሳንቲም ነው።'],
      ['You','Here is twenty dollars.','ሃያ ዶላር ይኸውና።'],
      ['Supervisor','Your shift is at half past seven in the morning.','የስራ ፈረቃዎ ከጠዋቱ አንድ ሰዓት ተኩል (በፈረንጅ 7:30) ነው።'],
      ['You','Seven thirty. Thank you.','በፈረንጅ 7:30። አመሰግናለሁ።'],
      ['Clinic','Your appointment is on Monday, March tenth.','ቀጠሮዎ ሰኞ፣ ማርች አሥር ነው።'],
      ['You','My phone number is six one seven, five five five, zero one two three.','ስልክ ቁጥሬ ስድስት አንድ ሰባት፣ አምስት አምስት አምስት፣ ዜሮ አንድ ሁለት ሦስት ነው።']
    ]),
    situations:[
      ['The price is $12.50. What do you hear?','ዋጋው $12.50 ነው። ምን ትሰሚያለሽ?','Twelve dollars and fifty cents.','Twenty-five dollars.','Twelve hundred dollars.'],
      ['Your shift begins at 7:30 AM. What time is that?','ስራሽ በ7:30 AM ይጀምራል። ስንት ሰዓት ነው? (በኢትዮጵያ ሰዓት ከጠዋቱ አንድ ሰዓት ተኩል ነው። ከፈረንጅ ሰዓት 6 ቀንሺ።)','Half past seven in the morning.','Half past nine at night.','Noon.'],
      ['What is a clear way to say 617?','617 በግልጽ እንዴት ትያለሽ?','Six one seven.','Sixty-seven.','Seven sixteen.']
    ],
    sentences:[
      ['It is twelve dollars and fifty cents.','አሥራ ሁለት ዶላር ከሃምሳ ሳንቲም ነው።'],
      ['My shift starts at half past seven.','የስራ ፈረቃዬ ከጠዋቱ አንድ ሰዓት ተኩል (በፈረንጅ 7:30) ይጀምራል።'],
      ['My appointment is on Monday.','ቀጠሮዬ ሰኞ ነው።'],
      ['My appointment is on Monday, March tenth.','ቀጠሮዬ ሰኞ፣ ማርች አሥር ነው።'],
      ['My phone number is six one seven, five five five, zero one two three.','ስልክ ቁጥሬ ስድስት አንድ ሰባት፣ አምስት አምስት አምስት፣ ዜሮ አንድ ሁለት ሦስት ነው።'],
      ['Twelve dollars and fifty cents.','አሥራ ሁለት ዶላር ከሃምሳ ሳንቲም።'],
      ['Half past seven in the morning.','ከጠዋቱ አንድ ሰዓት ተኩል (በፈረንጅ 7:30)።'],
      ['Six one seven.','ስድስት አንድ ሰባት።']
    ]
  },
  {
    id:'help', title:'Help & Emergencies', am:'እርዳታ', icon:'🛟', color:'#426E85', stamp:'Help',
    stopNames:['Ask for help','Be understood','In an emergency'],
    words:wordRows([
      ['help','help','እርዳታ'], ['address','AD-ress','አድራሻ'],
      ['emergency','ih-MER-jen-see','አስቸኳይ አደጋ'], ['ambulance','AM-byoo-luns','አምቡላንስ'],
      ['slowly','SLOH-lee','ቀስ ብሎ'], ['repeat','ri-PEET','እንደገና መናገር'],
      ['understand','un-der-STAND','መረዳት'], ['spell','spel','ፊደል መጥራት'],
      ['sick','sik','የታመመ'], ['child','chyld','ልጅ'], ['safe','sayf','ደህንነቱ የተጠበቀ'], ['call','kawl','መደወል']
    ]),
    dialog:dialogRows([
      ['You','I need help. My child is sick.','እርዳታ እፈልጋለሁ። ልጄ ታሟል።'],
      ['Operator','What is your address?','አድራሻዎ ምንድን ነው?'],
      ['You','Please speak slowly.','እባክዎ ቀስ ብለው ይናገሩ።'],
      ['Operator','Where are you?','የት ነዎት?'],
      ['You','I am at 25 Main Street, Boston.','ቦስተን፣ ሜይን ስትሪት ቁጥር 25 ነኝ።'],
      ['Operator','Help is on the way.','እርዳታ እየመጣ ነው።']
    ]),
    situations:[
      ['You need urgent help in Boston. What do you say?','ቦስተን ውስጥ አስቸኳይ እርዳታ ያስፈልግሻል። ምን ትያለሽ?','Please call nine one one.','Please call my store.','My bus is late.'],
      ['Someone is speaking too fast. What do you say?','አንድ ሰው በፍጥነት እየተናገረ ነው። ምን ትያለሽ?','Please speak slowly.','Please speak faster.','I need a receipt.'],
      ['You did not understand a name. What do you ask?','ስሙ አልገባሽም። ምን ትጠይቂያለሽ?','How do you spell that?','How much is that?','Where is the fare?']
    ],
    sentences:[['I need help. My child is sick.','እርዳታ እፈልጋለሁ። ልጄ ታሟል።'],['Please speak slowly.','እባክዎ ቀስ ብለው ይናገሩ።'],["I don't understand. Can you repeat that?",'አልገባኝም። እንደገና ሊሉት ይችላሉ?'],['How do you spell that?','ፊደሉን ሊነግሩኝ ይችላሉ?'],['Please call nine one one.','እባክዎ ወደ 911 ይደውሉ።']]
  }
];

const SOUND_TIPS = {
  // AM-CHECK: Pronunciation coaching; verify that the vowel-length distinction reads naturally.
  vowel:'በsheep ውስጥ ያለውን ድምፅ ረዘም አድርጊ። በship ውስጥ አጭር ነው።',
  // AM-CHECK: Articulatory instruction for English th, absent in Amharic.
  th:'ለth ድምፅ፣ የምላስሽን ጫፍ በጥርሶችሽ መካከል በቀስታ አስቀምጪ።',
  // AM-CHECK: Verify the lip/teeth coaching for v versus b.
  vb:'ለv ድምፅ፣ የላይ ጥርሶችሽን በታች ከንፈርሽ ላይ በቀስታ አስቀምጪ።',
  // AM-CHECK: English walk/work vowel coaching varies with accent.
  wr:'walk እና work የተለያዩ ድምፆች አሏቸው። አዳምጪና ደግመሽ ተናገሪ።'
};
const SOUND_PAIRS = [
  ['ship','sheep','መርከብ','በግ','ship','sheep','vowel'],
  ['sit','seat','መቀመጥ','መቀመጫ','sit','seet','vowel'],
  ['full','fool','ሙሉ','ሞኝ','ful','fool','vowel'],
  ['live','leave','መኖር','መሄድ','liv','leev','vowel'],
  ['think','sink','ማሰብ','መስመጥ','think','sink','th'],
  ['three','tree','ሦስት','ዛፍ','three','tree','th'],
  ['thank','tank','ማመስገን','ታንክ','thank','tank','th'],
  ['they','day','እነሱ','ቀን','thay','day','th'],
  ['very','berry','በጣም','ቤሪ','VER-ee','BER-ee','vb'],
  ['walk','work','መራመድ','መስራት','wawk','werk','wr']
].map(([a,b,amA,amB,sayA,sayB,type])=>({a,b,amA,amB,sayA,sayB,type,tip:SOUND_TIPS[type]}));

const LEGACY_META = [
  ['🩺','#B0342A','Doctor',['Your appointment','Tell the doctor','Feel better']],
  ['🛒','#A66B12','Market',['At the store','Pay with confidence','A good deal']],
  ['☎️','#426E85','Phone',['Make the call','Leave a message','Call me back']],
  ['🧭','#3C6E4F','Map',['Find your way','Around the corner','At the station']],
  ['🌅','#955747','Yesterday',['Yesterday & today','Tell your story','Remember when']],
  ['🤝','#717442','Work',['Meet a neighbor','A helping hand','Make a connection']]
];
const CARDS = {};
function cardFor(line, en, am, say='', kind='word') {
  const id = `${line.id}:${en.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`;
  if (!CARDS[id]) CARDS[id] = {id,lineId:line.id,en,am:am || '',say,kind};
  return id;
}
function makeStops(line, names, exercises, dialog, grammar) {
  const ids = line.cardIds;
  const size = Math.ceil(ids.length / 3);
  line.stops = names.map((name,i)=>({
    id:`${line.id}-${i+1}`, lineId:line.id, name, index:i,
    cardIds:ids.slice(i*size,(i+1)*size),
    dialog:dialog.slice(i*2,i*2+2),
    exercises:exercises.filter((_,n)=>n%3===i),
    grammar:i===0 ? grammar : null
  }));
}
const LINES = LEGACY_COURSE.map((unit,i)=>{
  const [icon,color,stamp,names] = LEGACY_META[i];
  const line = {id:unit.id,title:unit.title,am:unit.am,icon,color,stamp,cardIds:[]};
  const vocabulary = unit.steps.find(s=>s.t==='vocab').words;
  vocabulary.forEach(w=>line.cardIds.push(cardFor(line,w.en,w.am,w.say)));
  const grammar = unit.steps.find(s=>s.t==='grammar');
  if(grammar) grammar.rows.forEach(([en,am])=>line.cardIds.push(cardFor(line,en.split('→')[1].trim(),am)));
  const dialog = unit.steps.find(s=>s.t==='dialog')?.lines || [];
  dialog.forEach(d=>line.cardIds.push(cardFor(line,d.en,d.am,'','sentence')));
  const exercises = unit.steps.filter(s=>!['vocab','dialog','grammar'].includes(s.t));
  exercises.forEach(s=>{
    const en = s.en || s.audio || (s.t==='mc' ? s.opts[s.a] : null);
    if(en) {
      // Original material does not translate every sentence. Keep the existing
      // explanation instead of inventing a literal translation.
      const am = s.am || s.amHint || (s.t==='type' ? vocabulary.find(w=>w.en===en)?.am : '') || '';
      const id=cardFor(line,en,am,'',s.t==='type' ? 'word' : 'sentence');
      if(!line.cardIds.includes(id)) line.cardIds.push(id);
      s.cardIds=[id];
    }
    if(s.t==='match') s.cardIds=s.pairs.map(([en])=>line.cardIds.find(id=>CARDS[id].en===en)).filter(Boolean);
  });
  makeStops(line,names,exercises,dialog,grammar);
  return line;
});

newLines.forEach(raw=>{
  const line = {...raw,cardIds:[]};
  raw.words.forEach(w=>line.cardIds.push(cardFor(line,w.en,w.am,w.say)));
  raw.sentences.forEach(([en,am])=>line.cardIds.push(cardFor(line,en,am,'','sentence')));
  const exercises=[];
  raw.situations.forEach(([q,qAm,...opts])=>{
    const id=line.cardIds.find(id=>CARDS[id].en===opts[0]);
    exercises.push({t:'mc',q,qAm,opts,a:0,cardIds:id?[id]:[]});
  });
  raw.sentences.forEach(([en,am],i)=>{
    const id=cardFor(line,en,am,'','sentence');
    exercises.push({t:i%2 ? 'say':'build',en,audio:en,answer:en,am,cardIds:[id]});
  });
  [0,4,8].forEach(i=>{
    const w=raw.words[i];
    exercises.push({t:'type',audio:w.en,answer:w.en,amHint:w.am,cardIds:[cardFor(line,w.en,w.am,w.say)]});
  });
  makeStops(line,raw.stopNames,exercises,raw.dialog);
  LINES.push(line);
});
const twins={id:'sounds',title:'Sound Twins',am:'ተመሳሳይ ድምፆች',icon:'🎧',color:'#805A8B',stamp:'Sound',cardIds:[]};
SOUND_PAIRS.forEach(p=>{
  p.cardIds=[cardFor(twins,p.a,p.amA,p.sayA),cardFor(twins,p.b,p.amB,p.sayB)];
  twins.cardIds.push(...p.cardIds);
});
twins.stops=[0,1,2].map(i=>({id:`sounds-${i+1}`,lineId:'sounds',index:i,name:['Listen closely','Try the th sound','Make it clear'][i],dialog:[],cardIds:SOUND_PAIRS.slice(i*4,i*4+4).flatMap(p=>p.cardIds),exercises:SOUND_PAIRS.slice(i*4,i*4+4).map(p=>({t:'twins',...p}))}));
LINES.push(twins);

// Pocket guide: every number 1–100, all weekdays and Gregorian month names.
// These are also playable cards, so studying the guide contributes to real mastery.
const smallEN=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const smallAM=['ዜሮ','አንድ','ሁለት','ሦስት','አራት','አምስት','ስድስት','ሰባት','ስምንት','ዘጠኝ','አሥር','አሥራ አንድ','አሥራ ሁለት','አሥራ ሦስት','አሥራ አራት','አሥራ አምስት','አሥራ ስድስት','አሥራ ሰባት','አሥራ ስምንት','አሥራ ዘጠኝ'];
const tensEN=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
const tensAM=['','','ሃያ','ሠላሳ','አርባ','ሃምሳ','ስልሳ','ሰባ','ሰማንያ','ዘጠና'];
const numberLine=LINES.find(l=>l.id==='numbers');
const numberGuide=Array.from({length:100},(_,i)=>{
  const n=i+1, t=Math.floor(n/10), r=n%10;
  const en=n===100?'one hundred':n<20?smallEN[n]:tensEN[t]+(r?'-'+smallEN[r]:'');
  const am=n===100?'አንድ መቶ':n<20?smallAM[n]:tensAM[t]+(r?' '+smallAM[r]:'');
  return {label:String(n),id:cardFor(numberLine,en,am,en)};
});
const dayGuide=wordRows([['Monday','MUN-day','ሰኞ'],['Tuesday','TOOZ-day','ማክሰኞ'],['Wednesday','WENZ-day','ረቡዕ'],['Thursday','THURZ-day','ሐሙስ'],['Friday','FRY-day','ዓርብ'],['Saturday','SAT-er-day','ቅዳሜ'],['Sunday','SUN-day','እሁድ']]).map(w=>({label:w.en,id:cardFor(numberLine,w.en,w.am,w.say)}));
// AM-CHECK: Gregorian month transliterations; deliberately not Ethiopian calendar months.
const monthAm=['ጃንዩወሪ','ፌብሩወሪ','ማርች','ኤፕሪል','ሜይ','ጁን','ጁላይ','ኦገስት','ሴፕቴምበር','ኦክቶበር','ኖቬምበር','ዲሴምበር'];
const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
const monthSay=['JAN-yoo-air-ee','FEB-roo-air-ee','march','AY-pril','may','joon','joo-LY','AW-gust','sep-TEM-ber','ok-TOH-ber','noh-VEM-ber','di-SEM-ber'];
const monthGuide=months.map((en,i)=>({label:en,id:cardFor(numberLine,en,monthAm[i],monthSay[i])}));

const UI_TEXT = {
  listen:['What did you hear?','ምን ሰማሽ?'],
  read:['Read, then choose the meaning.','አንብቢና ትርጉሙን ምረጪ።'],
  match:['Find the pairs.','ቃላቱን አዛምጂ።'],
  build:['Build the sentence.','ቃላቱን በቅደም ተከተል አስቀምጪ።'],
  type:['Type the English word.','የእንግሊዝኛውን ቃል ጻፊ።'],
  say:['Listen. Then try it yourself.','አዳምጪ። ከዚያ ራስሽ ተናገሪው።'],
  twins:['Which word did you hear?','የትኛውን ቃል ሰማሽ?'],
  correct:['You got it!','ትክክል! በጣም ጥሩ።'],
  retry:["Let's try that one again.",'እንደገና ሞክሪው።'],
  encourage:[
    ['Keep going, every day.','እንግሊዝኛሽ እየተሻሻለ ነው።'],
    ['You finished a ride. Well done!','ትምህርቱን ጨርሰሻል! በጣም ጎበዝ።'],
    ['Your English is growing.','እንግሊዝኛሽ እየተሻሻለ ነው።']
  ]
};
globalThis.TRAIN_CONTENT={lines:LINES,cards:CARDS,legacy:LEGACY_COURSE,pairs:SOUND_PAIRS,ui:UI_TEXT,guides:{numbers:numberGuide,days:dayGuide,months:monthGuide}};

