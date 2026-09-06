import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCj6vRrcZmwqCXgEcmHyZprlsuDJFvsHxQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "sparkz2k26-557bd.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "sparkz2k26-557bd",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "sparkz2k26-557bd.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "719061381860",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:719061381860:web:7b88c01193d1c585c6b2f1",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-LJTX2HRRP7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const events = [
  {
    id: "rc-car-racing",
    title: "Manyu",
    department: "MECH",
    type: "technical",
    date: "24-09-2026",
    regFinalDate: "23-09-2026",
    RegCloseTime: { hours: 18, minutes: 0 },
    description: "Design, build, and race remote-controlled cars through an obstacle-laden speed track. Show off your engineering prowess and driving precision to claim victory on the asphalt.",
    venue: "Main Ground Track",
    eveType: "team",
    memberMaxCount: 4,
    memberMinCount: 1,
    registrationFee: "150/-",
    firstPrize: "1500/-",
    secondPrize: "800/-",
    imageUrl: "/event.png",
    bgImageUrl: "https://res.cloudinary.com/day9g145m/image/upload/v1758256855/TECHSTROM_BG_po6ogr.png",
    featured: true,
    isFeatured: true,
    isOnline: false,
    upi: ["jacsjjacobnellickal-1@oksbi"],
    gpay: "8590204413",
    coordinators: [{ name: "Alex Varghese - S7 ME", phone: "+919876543210" }],
    rules: [
      "Cars must conform to size and battery voltage specifications.",
      "Time trial rounds followed by head-to-head racing.",
      "Damage to track or other cars resulting from unsportsmanlike conduct results in disqualification."
    ]
  },
  {
    id: "just-imagine",
    title: "Just Imagine",
    department: "CSE",
    type: "nonTechnical",
    date: "19-12-2026",
    regFinalDate: "19-12-2026",
    RegCloseTime: { hours: 1, minutes: 59 },
    description: "'Just Imagine' is an exciting and fun-filled event designed to test creativity, quick thinking, and teamwork. In this game, Participants will pair up in teams of two. One member will pick a chit and act out the word or phrase without speaking or lip-syncing, while the other member guesses within a time limit of 2 minutes.",
    venue: "S5/S6 CSE",
    eveType: "team",
    memberMaxCount: 2,
    memberMinCount: 2,
    maxParticipation: "35 Teams",
    minParticipation: "20 Teams",
    registrationFee: "50/-",
    firstPrize: "600/-",
    secondPrize: "400/-",
    imageUrl: "/event.png",
    bgImageUrl: "https://res.cloudinary.com/day9g145m/image/upload/v1758256855/JUST_IMAGINE_BG_j1foyx.png",
    upi: ["safnams2003@oksbi", "ardraammu20@oksbi"],
    gpay: "9349517534",
    coordinators: [
      { name: "Safna M S- S7", phone: "+919349517534" },
      { name: "Ardra S Anil- S7", phone: "+916238393086" }
    ],
    rules: [
      "Each team consists of 2 members.",
      "One member will act out the word/phrase while the other guesses.",
      "No speaking or lip-syncing allowed during the acting.",
      "Each team has 2 minutes to guess as many words/phrases as possible."
    ]
  },
  {
    id: "deadshot",
    title: "DeadShot",
    department: "CSE",
    type: "technical",
    date: "22-09-2026",
    regFinalDate: "22-09-2026",
    description: "'Deadshot.io', a high-stakes online arena where precision, strategy, and quick reflexes determine the ultimate sharpshooter. Players face off in a tense battle of aim and stealth, using an array of powerful weapons to outmaneuver opponents.",
    venue: "CSE Project Lab",
    eveType: "team",
    memberMaxCount: 4,
    memberMinCount: 4,
    maxParticipation: "32 Teams",
    minParticipation: "16 Teams",
    registrationFee: "100/-",
    firstPrize: "1000/-",
    secondPrize: "500/-",
    imageUrl: "/event.png",
    bgImageUrl: "https://res.cloudinary.com/day9g145m/image/upload/v1758256842/DEADSHOT_BG_b0jmlq.png",
    upi: ["jacsjjacobnellickal-1@oksbi", "deepakdayanandan008-1@okicici"],
    gpay: "8590204413",
    coordinators: [
      { name: "Jacs J Jacob - S7 CSE", phone: "+918590204413" },
      { name: "Deepak Dayanandan - S7 CSE", phone: "+917356784317" }
    ]
  },
  {
    id: "clash-of-keyboards",
    title: "Clash of Keyboards",
    department: "CSE",
    type: "technical",
    date: "23-09-2026",
    regFinalDate: "21-09-2026",
    description: "Put your typing skills to the test in the Speed & Accuracy competition! This event is designed to challenge Participants on both their typing speed and precision in a fast-paced, fun environment.",
    venue: "Department Lab 3",
    eveType: "ind",
    memberMaxCount: 1,
    memberMinCount: 1,
    maxParticipation: "60 Participants",
    minParticipation: "25 Participants",
    registrationFee: "30/-",
    firstPrize: "500/-",
    secondPrize: "250/-",
    imageUrl: "/event.png",
    bgImageUrl: "https://res.cloudinary.com/day9g145m/image/upload/v1758256822/CLASH_OF_KEYBOARDS_BG_dvecvb.png",
    upi: ["athultomy2005@okaxis", "nandhunandhu77780@oksbi"],
    gpay: "9567767003",
    coordinators: [
      { name: "Nandhu Krishnan- S5", phone: "+917593985785" },
      { name: "Athul Tomy- S5", phone: "+919567767003" }
    ]
  },
  {
    id: "craft-the-screen",
    title: "Craft The Screen",
    department: "CSE",
    type: "technical",
    date: "23-09-2026",
    regFinalDate: "21-09-2026",
    description: "The UI/UX Competition provides a platform for Participants to demonstrate their design skills by creating intuitive, functional, and aesthetically appealing user interfaces. It emphasizes innovation, usability, and creativity.",
    venue: "Computer Centre",
    eveType: "team",
    memberMaxCount: 3,
    memberMinCount: 2,
    maxParticipation: "25 Teams",
    minParticipation: "10 Teams",
    registrationFee: "150/-",
    firstPrize: "900/-",
    secondPrize: "600/-",
    imageUrl: "/event.png",
    bgImageUrl: "https://res.cloudinary.com/day9g145m/image/upload/v1758256847/CRAFT_THE_SCREEN_BG_jvpyxx.png",
    upi: ["udaykkv2-1@okicici", "bestrong2212@okaxis"],
    gpay: "7356728914",
    coordinators: [
      { name: "Alfred Joe Devasia - S7", phone: "+917356728914" },
      { name: "Uday Krishna - S7", phone: "+919567284066" }
    ]
  },
  {
    id: "the-riddle-crusade",
    title: "The Riddle Crusade",
    department: "CSE",
    type: "nonTechnical",
    date: "23-09-2026",
    regFinalDate: "21-09-2026",
    description: "Step into a world of secrets, riddles, and hidden truths. Navigate the maze of deception, solving riddles, unraveling hidden codes, and facing the final guardian.",
    venue: "S3/S4 CSE A",
    eveType: "team",
    memberMaxCount: 3,
    memberMinCount: 2,
    maxParticipation: "20 Teams",
    minParticipation: "15 Teams",
    registrationFee: "100/-",
    firstPrize: "1000/-",
    secondPrize: "500/-",
    imageUrl: "/event.png",
    bgImageUrl: "https://res.cloudinary.com/day9g145m/image/upload/v1758256871/THE_RIDDLE_CRUSADE_BG_voapwu.png",
    upi: ["9995251866@ptaxis", "khuloodsalam@oksbi"],
    gpay: "9995251866",
    coordinators: [
      { name: "Hellan Raichel Benoy - S5", phone: "+919995251866" },
      { name: "Khulood Salam - S5", phone: "+918590123899" }
    ]
  },
  {
    id: "code-in-the-blanks",
    title: "Code Quest",
    department: "CSE",
    type: "technical",
    featured: true,
    isFeatured: true,
    date: "25-09-2026",
    regFinalDate: "25-09-2026",
    description: "This event is a three-level coding challenge where Participants must complete code snippets by filling in the missing operators, delimiters, or both. Each level grows more difficult, testing both speed and accuracy.",
    venue: "Computer Centre",
    eveType: "team",
    memberMaxCount: 2,
    memberMinCount: 2,
    maxParticipation: "20 Teams",
    minParticipation: "10 Teams",
    registrationFee: "70/-",
    firstPrize: "750/-",
    secondPrize: "500/-",
    imageUrl: "/event.png",
    bgImageUrl: "https://res.cloudinary.com/day9g145m/image/upload/v1758256830/CODE_QUEST_BG_udumky.png",
    upi: ["off.shaima@oksbi"],
    gpay: "7510251168",
    coordinators: [
      { name: "Shaima Yousaf - S5 CSE", phone: "+917510251168" },
      { name: "Neha Agnus P.S - S5 CSE", phone: "+919495619709" }
    ]
  },
  {
    id: "the-stampede",
    title: "The Stampede",
    department: "CSE",
    type: "nonTechnical",
    featured: true,
    isFeatured: true,
    date: "25-09-2026",
    regFinalDate: "25-09-2026",
    description: "4 stands with tasks, increasing in difficulty. Should you complete the task, you get a stamp. If you successfully collect all of the stamps, you get a prize at the end!",
    venue: "S3/S4 CSE B",
    eveType: "ind",
    memberMaxCount: 1,
    memberMinCount: 1,
    maxParticipation: "60 Participants",
    minParticipation: "35 Participants",
    registrationFee: "30/-",
    firstPrize: "600/-",
    secondPrize: "400/-",
    imageUrl: "/event.png",
    bgImageUrl: "https://res.cloudinary.com/day9g145m/image/upload/v1758256873/THE_STAMPEDE_BG_vlfx8p.png",
    upi: ["niharikagireesh00@oksbi", "6282351648"],
    gpay: "6282351648",
    coordinators: [
      { name: "Niharika K Gireesh- S1 CSE B", phone: "+916282351648" },
      { name: "Mariya Sunil- S1 CSE B", phone: "+917907810449" }
    ]
  },
  {
    id: "techstorm",
    title: "Techstorm",
    department: "CSE",
    type: "technical",
    featured: true,
    isFeatured: true,
    date: "26-09-2026",
    regFinalDate: "26-09-2026",
    description: "Techstorm is the arena where logic, teamwork, and technology shape the ultimate clash. Two teams face off on a technical topic, armed with logic, facts, and quick thinking.",
    venue: "S5/S6 CSE",
    eveType: "team",
    memberMaxCount: 4,
    memberMinCount: 3,
    maxParticipation: "25 Teams",
    minParticipation: "10 Teams",
    registrationFee: "100/-",
    firstPrize: "600/-",
    secondPrize: "400/-",
    imageUrl: "/event.png",
    bgImageUrl: "https://res.cloudinary.com/day9g145m/image/upload/v1758256855/TECHSTROM_BG_po6ogr.png",
    upi: ["arvindbiju007@okhdfcbank", "unni025951@oksbi"],
    gpay: "7736667814",
    coordinators: [
      { name: "Aravind B - S3 CSE A", phone: "+917736667814" },
      { name: "Unnikrishnan A - S3 CSE A", phone: "+919496025951" }
    ]
  },
  {
    id: "pes",
    title: "E-Football",
    department: "CSE",
    type: "nonTechnical",
    date: "22-09-2026 to 26-09-2026",
    regFinalDate: "22-09-2026",
    RegCloseTime: { hours: 18, minutes: 0 },
    description: "Step onto the virtual pitch and showcase your football skills in this competitive E-Football tournament. Test your strategy, reflexes, and precision.",
    eveType: "ind",
    memberMaxCount: 1,
    memberMinCount: 1,
    maxParticipation: "32 Participants",
    minParticipation: "16 Participants",
    isOnline: true,
    registrationFee: "30/-",
    firstPrize: "500/-",
    secondPrize: "250/-",
    imageUrl: "/event.png",
    bgImageUrl: "https://res.cloudinary.com/day9g145m/image/upload/v1758256832/E-FOOTBALL_BG_sca79o.png",
    upi: ["saheedmuhammedraffi@okaxis", "ajji9495@okicici"],
    gpay: "9539077131",
    coordinators: [
      { name: "Saheed Muhammed Rafi - S7", phone: "+919539077131" },
      { name: "Ajilash Edward - S7", phone: "+918129645672" }
    ]
  },
  {
    id: "photography",
    title: "Photography",
    department: "CSE",
    type: "nonTechnical",
    date: "22-09-2026 to 26-09-2026",
    regFinalDate: "22-09-2026",
    RegCloseTime: { hours: 18, minutes: 0 },
    description: "Unleash your creativity behind the lens and capture moments that speak louder than words. Showcase your perspective, originality, and storytelling.",
    eveType: "ind",
    memberMaxCount: 1,
    memberMinCount: 1,
    minParticipation: "25 Participants",
    registrationFee: "30/-",
    isOnline: true,
    firstPrize: "500/-",
    secondPrize: "250/-",
    imageUrl: "/event.png",
    bgImageUrl: "https://res.cloudinary.com/day9g145m/image/upload/v1758256838/PHOTOGRAPHY_BG_azp6r0.png",
    upi: ["melvinkroy012@oksbi", "alakkuttan@oksbi"],
    gpay: "8921196969",
    coordinators: [
      { name: "Alan Sabu - S5 CSE", phone: "+917994326902" },
      { name: "Melvin K Roy - S5 CSE", phone: "+918921196969" }
    ]
  },
  {
    id: "bgmi",
    title: "BGMI",
    department: "CSE",
    type: "nonTechnical",
    date: "22-09-2026 to 26-09-2026",
    regFinalDate: "22-09-2026",
    RegCloseTime: { hours: 18, minutes: 0 },
    description: "Gear up for an action-packed BGMI competition where teamwork, strategy, and quick decision-making are keys to survival. Compete in high-intensity battle royale.",
    eveType: "team",
    memberMaxCount: 4,
    memberMinCount: 4,
    isOnline: true,
    minParticipation: "15 Teams",
    registrationFee: "100/-",
    firstPrize: "1000/-",
    secondPrize: "500/-",
    imageUrl: "/event.png",
    bgImageUrl: "https://res.cloudinary.com/day9g145m/image/upload/v1758256819/BGMI_BG_zdvv25.png",
    upi: ["adhy3013@okaxis", "abhidev.aji@ptyes"],
    gpay: "7012783985",
    requiresExtraData: true,
    extraFields: [
      { name: "UserID", type: "text" },
      { name: "In-GameName", type: "text" }
    ],
    coordinators: [
      { name: "Adithyan S- S5 CSE", phone: "+917012783985" },
      { name: "Sooraj Anil - S5 CSE", phone: "+918075044042" }
    ]
  },
  {
    id: "football",
    title: "Football",
    department: "MECH",
    type: "sports",
    date: "22-09-2026",
    regFinalDate: "22-09-2026",
    RegCloseTime: { hours: 18, minutes: 0 },
    description: "Get ready to witness the ultimate clash on the field as college students battle it out in an electrifying 7s Football Tournament!",
    eveType: "team",
    memberMaxCount: 10,
    memberMinCount: 7,
    registrationFee: "500/-",
    maxParticipation: "16 Teams",
    minParticipation: "8 Teams",
    firstPrize: "3000/-",
    secondPrize: "1500/-",
    imageUrl: "/event.png",
    bgImageUrl: "https://res.cloudinary.com/day9g145m/image/upload/v1758256830/FOOTBALL_BG_qxfbp5.png",
    upi: ["aadhithcj9@oksbi", "donskv2004@oksbi"],
    gpay: "9495268368",
    coordinators: [
      { name: "Aadith C Joseph", phone: "+919495268368" },
      { name: "Don Siby Varghese", phone: "+916235365938" }
    ]
  }
];

async function seed() {
  console.log(`Starting Firestore seeding for project: ${firebaseConfig.projectId}...`);
  console.log(`Target database: (default) in project sparkz2k26-557bd\n`);
  let count = 0;

  for (const event of events) {
    try {
      const docRef = doc(db, "events", event.id);

      // Use a timeout promise to detect uncreated database or connection issues quickly
      const writePromise = setDoc(docRef, event, { merge: true });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout: Firestore did not respond within 8 seconds. Likely the database has not been created yet in Firebase Console.")), 8000)
      );

      await Promise.race([writePromise, timeoutPromise]);
      console.log(`✓ Seeded event: [${event.id}] - ${event.title}`);
      count++;
    } catch (err) {
      console.error(`\n✗ Error seeding event [${event.id}]:`, err.message);
      if (err.message.includes("NOT_FOUND") || err.message.includes("Timeout")) {
        console.error("\n=======================================================");
        console.error("DIAGNOSIS: Firestore Database is not initialized yet!");
        console.error("Please visit your Firebase Console to create the database:");
        console.error("👉 https://console.firebase.google.com/u/2/project/sparkz2k26-557bd/firestore");
        console.error("Click 'Create database' (choose Production or Test mode).");
        console.error("Once created, run 'npm run seed' again.");
        console.error("=======================================================\n");
        process.exit(1);
      }
    }
  }
  console.log(`\n🎉 Seeding complete! Successfully saved ${count} of ${events.length} events.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Fatal error during seeding:", err);
  process.exit(1);
});

