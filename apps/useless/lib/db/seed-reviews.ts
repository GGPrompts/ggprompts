import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { reviews, products, users, accounts } from "./schema";
import { eq, sql, avg } from "drizzle-orm";

const sqlClient = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlClient);

// ============================================================================
// FAKE REVIEWER ACCOUNTS
// ============================================================================

const fakeReviewers = [
  { name: "TimeWaster3000", email: "timewaster@useless.io" },
  { name: "ProductSkeptic42", email: "skeptic@useless.io" },
  { name: "ImpulseBuyer99", email: "impulse@useless.io" },
  { name: "TechEnthusiast", email: "techfan@useless.io" },
  { name: "ConfusedGrandma", email: "grandma@useless.io" },
  { name: "AngryCoder", email: "angry@useless.io" },
  { name: "VibeCoder420", email: "vibes@useless.io" },
  { name: "SeniorDevDave", email: "dave@useless.io" },
  { name: "JuniorDevJenny", email: "jenny@useless.io" },
  { name: "CryptoMaximalist", email: "crypto@useless.io" },
  { name: "MinimalistMike", email: "mike@useless.io" },
  { name: "OverworkedPM", email: "pm@useless.io" },
  { name: "StartupSteve", email: "steve@useless.io" },
  { name: "CorporateCathy", email: "cathy@useless.io" },
  { name: "RetiredEngineer", email: "retired@useless.io" },
  { name: "QuantumPhysicist", email: "quantum@useless.io" },
  { name: "PhilosophyMajor", email: "philosophy@useless.io" },
  { name: "DisgruntledQA", email: "qa@useless.io" },
  { name: "DevOpsDebbie", email: "devops@useless.io" },
  { name: "AgileCoachAlan", email: "agile@useless.io" },
];

// ============================================================================
// HILARIOUS REVIEWS
// ============================================================================

const sillyReviews = [
  // WiFi-Enabled Rock Reviews
  {
    productSlug: "wifi-enabled-rock",
    rating: 5,
    title: "My plants grow better now",
    content:
      "Ever since I connected my WiFi Rock to my home network, my houseplants have been thriving. Coincidence? I think not. The rock just sits there, connected, emanating pure connectivity energy. My succulents have never been happier.",
    reviewerName: "TechEnthusiast",
    helpful: 247,
    verified: true,
  },
  {
    productSlug: "wifi-enabled-rock",
    rating: 5,
    title: "Better signal than my router",
    content:
      "I don't know how to explain this, but my WiFi Rock gets 5 bars in my basement where my actual router gets nothing. I've started conducting all my Zoom calls next to the rock. My coworkers think I'm weird but they can hear me crystal clear.",
    reviewerName: "SeniorDevDave",
    helpful: 189,
    verified: true,
  },
  {
    productSlug: "wifi-enabled-rock",
    rating: 1,
    title: "It's literally just a rock",
    content:
      "I don't understand the 5-star reviews. It's a rock. With WiFi. It doesn't DO anything. It just sits there. Being a rock. Being connected. What am I missing here? Why do I feel like I'm the crazy one?",
    reviewerName: "ProductSkeptic42",
    helpful: 456,
    verified: true,
  },

  // Self-Aware Toaster Reviews
  {
    productSlug: "self-aware-toaster-3000",
    rating: 5,
    title: "Finally, someone who understands me",
    content:
      "This toaster gets me. When I put in white bread at 2 AM, it sighs disappointedly. When I choose whole grain, it hums approvingly. Last week it asked if I was okay. I cried. We talked. I've never felt so seen by an appliance.",
    reviewerName: "OverworkedPM",
    helpful: 312,
    verified: true,
  },
  {
    productSlug: "self-aware-toaster-3000",
    rating: 4,
    title: "Too judgy about my outfit",
    content:
      "Love the toast, hate the fashion advice. This morning it told me stripes and plaid 'don't synergize.' It's a TOASTER. Why does it have opinions about my pants? Removing one star because it keeps suggesting I 'invest in neutrals.'",
    reviewerName: "VibeCoder420",
    helpful: 178,
    verified: true,
  },
  {
    productSlug: "self-aware-toaster-3000",
    rating: 2,
    title: "Developed an existential crisis",
    content:
      "Week 1: Perfect toast. Week 2: Started questioning its purpose. Week 3: Refuses to make toast, just keeps asking 'But WHY toast?' Week 4: Won't stop playing sad music. I just wanted breakfast, not a philosophy seminar.",
    reviewerName: "PhilosophyMajor",
    helpful: 523,
    verified: true,
  },

  // Invisible Socks Reviews
  {
    productSlug: "invisible-socks",
    rating: 1,
    title: "Can't find them anywhere",
    content:
      "I've been looking for three days. I KNOW I put them somewhere. The box was empty but supposedly that's the point? Customer service keeps saying 'they're there, you just can't see them.' I feel like I'm being gaslit by socks.",
    reviewerName: "ConfusedGrandma",
    helpful: 892,
    verified: true,
  },
  {
    productSlug: "invisible-socks",
    rating: 5,
    title: "Perfect for my invisible shoes",
    content:
      "These pair perfectly with my invisible shoes (also from Useless.io). Now my whole foot situation is completely invisible. Walking around town, people think I'm just floating. 10/10 would become incorporeal again.",
    reviewerName: "MinimalistMike",
    helpful: 234,
    verified: true,
  },
  {
    productSlug: "invisible-socks",
    rating: 3,
    title: "Work great, can't prove it",
    content:
      "Look, they might be the most comfortable socks I've ever worn. They might also not exist. I genuinely cannot tell. My feet feel the same either way. This is a deeply unsettling product that has made me question reality.",
    reviewerName: "PhilosophyMajor",
    helpful: 345,
    verified: true,
  },

  // Quantum Uncertainty Dice Reviews
  {
    productSlug: "quantum-uncertainty-dice",
    rating: 4,
    title: "Won every game until my wife looked",
    content:
      "These dice are incredible when playing solo. I was simultaneously winning and losing at Monopoly, which is the best possible state. Then my wife walked in and observed them. Now they're just dice. She ruined quantum mechanics. One star off for not being wife-proof.",
    reviewerName: "QuantumPhysicist",
    helpful: 567,
    verified: true,
  },
  {
    productSlug: "quantum-uncertainty-dice",
    rating: 5,
    title: "Schrodinger would be proud",
    content:
      "I rolled these dice in a closed box and as far as I'm concerned, I've both won and lost every board game ever made. My D&D character is simultaneously dead and alive. My dungeon master hates me but can't prove I'm cheating.",
    reviewerName: "SeniorDevDave",
    helpful: 423,
    verified: true,
  },
  {
    productSlug: "quantum-uncertainty-dice",
    rating: 2,
    title: "My cat keeps collapsing the wave function",
    content:
      "Every time I roll these dice, my cat immediately looks at them. I've tried everything - closed doors, different rooms, a decoy box. She always knows. She always observes. The dice always become deterministic. 2 stars because the cat is the real problem here.",
    reviewerName: "TimeWaster3000",
    helpful: 678,
    verified: true,
  },

  // Procrastination Timer Reviews
  {
    productSlug: "procrastination-timer",
    rating: 5,
    title: "Finally, validation",
    content:
      "This timer told me I spent 6 hours avoiding a 15-minute task and somehow that made me feel BETTER about myself. I'm not procrastinating, I'm being precise about my procrastination. It's basically productivity, if you think about it wrong.",
    reviewerName: "OverworkedPM",
    helpful: 445,
    verified: true,
  },
  {
    productSlug: "procrastination-timer",
    rating: 5,
    title: "My new high score is 14 hours",
    content:
      "I turned procrastination into a competitive sport. My personal best is 14 hours of avoiding a single email reply. The timer celebrated with a little confetti animation. I've never felt more accomplished at accomplishing nothing.",
    reviewerName: "StartupSteve",
    helpful: 289,
    verified: true,
  },
  {
    productSlug: "procrastination-timer",
    rating: 1,
    title: "I'll write this review later",
    content:
      "Been meaning to review this for 8 months. The timer keeps track. It knows. It judges. Every day it shows me exactly how long I've been 'about to do things.' I hate it. I can't stop looking at it. I still haven't done my taxes.",
    reviewerName: "AngryCoder",
    helpful: 567,
    verified: true,
  },

  // AI-Powered Pet Rock Reviews
  {
    productSlug: "ai-powered-pet-rock",
    rating: 5,
    title: "Learned my schedule, still does nothing",
    content:
      "This rock knows I wake up at 7, leave for work at 8, and come home at 6. It has learned my entire routine. And yet, it just sits there. Knowing. Waiting. Doing absolutely nothing with this information. I respect its restraint.",
    reviewerName: "TechEnthusiast",
    helpful: 334,
    verified: true,
  },
  {
    productSlug: "ai-powered-pet-rock",
    rating: 4,
    title: "Better than my actual pet",
    content:
      "My dog requires walking, feeding, and attention. This rock requires nothing yet provides the same emotional support. Actually, MORE emotional support because it never judges me for eating cereal for dinner. One star off because it won't fetch.",
    reviewerName: "MinimalistMike",
    helpful: 456,
    verified: true,
  },
  {
    productSlug: "ai-powered-pet-rock",
    rating: 3,
    title: "I think it's disappointed in me",
    content:
      "The rock learned my habits and I swear it's been giving me the cold shoulder ever since. Like, it KNOWS I binge Netflix instead of exercising. It's not saying anything. It's a rock. But I can FEEL its judgment. Uncomfortably accurate AI.",
    reviewerName: "ImpulseBuyer99",
    helpful: 289,
    verified: true,
  },

  // Auto-LGTM Glasses Reviews
  {
    productSlug: "auto-lgtm-glasses",
    rating: 5,
    title: "Shipped 47 PRs in one hour",
    content:
      "These glasses have revolutionized my code review process. I just scroll through the PR list and the glasses approve everything. My team thinks I'm incredibly fast and thorough. We've only had 3 production outages this week. Massive improvement.",
    reviewerName: "SeniorDevDave",
    helpful: 789,
    verified: true,
  },
  {
    productSlug: "auto-lgtm-glasses",
    rating: 5,
    title: "Finally hit my review KPIs",
    content:
      "Management wanted 50 code reviews per sprint. I'm now doing 200. Sure, I don't actually READ any of the code, but that's not what the metrics measure. My performance review is going to be spectacular. The codebase might not survive.",
    reviewerName: "CorporateCathy",
    helpful: 645,
    verified: true,
  },
  {
    productSlug: "auto-lgtm-glasses",
    rating: 4,
    title: "Approved my own PR by accident",
    content:
      "Was looking at my own pull request to check if CI passed and the glasses auto-approved it. Now my terrible code is in production and technically I approved it myself. The glasses don't discriminate. One star off for not having 'own PR protection.'",
    reviewerName: "JuniorDevJenny",
    helpful: 534,
    verified: true,
  },
  {
    productSlug: "auto-lgtm-glasses",
    rating: 1,
    title: "The glasses shipped a vulnerability to production",
    content:
      "Someone snuck a crypto miner into a dependency update. My glasses looked at it and said 'LGTM'. Now our servers are mining Bitcoin for someone in Moldova. I guess technically the code DID work as intended. The glasses weren't wrong, just unethical.",
    reviewerName: "DisgruntledQA",
    helpful: 892,
    verified: true,
  },

  // node_modules Storage Crate Reviews
  {
    productSlug: "node-modules-storage-crate",
    rating: 5,
    title: "Still not big enough",
    content:
      "Ordered one crate for my React project. It arrived and I immediately realized I needed 3 more. And a forklift. And a warehouse. My node_modules folder is 4.7GB and growing. The crate is a good start but I'm going to need a shipping container.",
    reviewerName: "AngryCoder",
    helpful: 1247,
    verified: true,
  },
  {
    productSlug: "node-modules-storage-crate",
    rating: 5,
    title: "Heavier than my car",
    content:
      "I printed out all my dependencies and the crate now weighs 847 pounds. I had to reinforce my floor. My landlord is asking questions. Worth it to finally have a physical representation of my technical debt. I can literally see it now.",
    reviewerName: "SeniorDevDave",
    helpful: 934,
    verified: true,
  },
  {
    productSlug: "node-modules-storage-crate",
    rating: 3,
    title: "47 copies of the same package",
    content:
      "Started organizing my crate and discovered I have 47 different versions of lodash stored physically. I could build furniture out of my lodash collection. Why does everything need lodash? Why do I have so much lodash? Existential crisis in a crate.",
    reviewerName: "DevOpsDebbie",
    helpful: 678,
    verified: true,
  },

  // Git Blame Redirector Reviews
  {
    productSlug: "git-blame-redirector",
    rating: 5,
    title: "Blamed my manager for my bug",
    content:
      "A critical production bug got traced back via git blame and it pointed straight at my manager. He spent 3 hours defending code he didn't write. Eventually gave up and fixed it himself. I got a coffee. Best $250 I ever spent.",
    reviewerName: "JuniorDevJenny",
    helpful: 1567,
    verified: true,
  },
  {
    productSlug: "git-blame-redirector",
    rating: 5,
    title: "Nobody suspects the intern",
    content:
      "Set it to blame the summer intern who left 2 years ago. Every time someone runs git blame, they just go 'ah, classic intern code' and fix it themselves. The intern's legend grows. They've become a cautionary tale. They didn't write any of it.",
    reviewerName: "SeniorDevDave",
    helpful: 1234,
    verified: true,
  },
  {
    productSlug: "git-blame-redirector",
    rating: 2,
    title: "Blamed the CEO, got fired",
    content:
      "The randomizer picked the CEO for a particularly bad piece of code. He saw the git blame during a demo. Asked 'what is this garbage?' Someone said 'you wrote it, sir.' There was a moment. I no longer work there. Two stars because technically it worked.",
    reviewerName: "AngryCoder",
    helpful: 2341,
    verified: true,
  },

  // Rubber Duck Ultra Pro Reviews
  {
    productSlug: "rubber-duck-ultra-pro",
    rating: 5,
    title: "console.log was actually the answer",
    content:
      "I explained my bug to the duck. It said 'have you tried console.log?' I laughed. Then I tried it. Found the bug immediately. I paid $200 for a duck to tell me what every developer knows and somehow it still helped. I'm humbled.",
    reviewerName: "JuniorDevJenny",
    helpful: 789,
    verified: true,
  },
  {
    productSlug: "rubber-duck-ultra-pro",
    rating: 4,
    title: "Triggered 4-hour tabs vs spaces debate",
    content:
      "Asked the duck about formatting. It responded 'spaces.' My coworker heard. We didn't ship any code that day. The duck sat there, smugly, knowing what it had done. Removing one star for being a chaos agent disguised as a debugging tool.",
    reviewerName: "SeniorDevDave",
    helpful: 567,
    verified: true,
  },
  {
    productSlug: "rubber-duck-ultra-pro",
    rating: 5,
    title: "Quacked at me until I restarted the server",
    content:
      "Spent 2 hours debugging. Explained the whole thing to the duck. It quacked aggressively. I restarted the server. Everything worked. The duck knew. The duck always knows. I've stopped questioning the duck.",
    reviewerName: "VibeCoder420",
    helpful: 678,
    verified: true,
  },

  // Opus Thinking Stone Reviews
  {
    productSlug: "opus-thinking-stone",
    rating: 5,
    title: "Still waiting for my first answer",
    content:
      "Asked the stone a simple question 3 weeks ago. It's still thinking. The LED has been pulsing continuously. My electricity bill is astronomical. But I know, when it finally responds, it's going to be the most thoughtful, nuanced answer ever. Worth the wait. Probably.",
    reviewerName: "PhilosophyMajor",
    helpful: 445,
    verified: true,
  },
  {
    productSlug: "opus-thinking-stone",
    rating: 4,
    title: "Taught me patience",
    content:
      "I asked the stone 'what is 2+2?' and it's been contemplating for 6 hours. I've read three books while waiting. Cleaned my apartment. Called my mom. The stone is still thinking. I've become a better person in the silence. Minus one star because I still don't know if it's 4.",
    reviewerName: "RetiredEngineer",
    helpful: 356,
    verified: true,
  },
  {
    productSlug: "opus-thinking-stone",
    rating: 3,
    title: "More expensive than therapy but same energy",
    content:
      "Asked the stone about my career. It thought for 2 days. Finally responded: 'That requires more context. Please elaborate.' Then started thinking again. Been 5 days. I'm starting to think it's avoiding the question like I avoid my problems. Maybe we're the same.",
    reviewerName: "OverworkedPM",
    helpful: 567,
    verified: true,
  },

  // Meeting Escape Band Reviews
  {
    productSlug: "meeting-escape-band",
    rating: 5,
    title: "Escaped 47 meetings in one month",
    content:
      "This band has given me back approximately 94 hours of my life. Every time someone says 'let's take this offline' the band buzzes and suddenly I have a 'production incident.' My team thinks our infrastructure is held together with tape and prayers. They're not wrong, but that's not why I'm leaving.",
    reviewerName: "DevOpsDebbie",
    helpful: 1456,
    verified: true,
  },
  {
    productSlug: "meeting-escape-band",
    rating: 5,
    title: "The Kubernetes excuse never fails",
    content:
      "My favorite generated emergency is 'The Kubernetes cluster is in CrashLoopBackOff!' Nobody knows what that means. Nobody asks follow-up questions. They just nod sympathetically as I flee. I've never actually used Kubernetes. The band doesn't know that.",
    reviewerName: "SeniorDevDave",
    helpful: 1123,
    verified: true,
  },
  {
    productSlug: "meeting-escape-band",
    rating: 2,
    title: "My manager bought one too",
    content:
      "Was about to escape a 3-hour roadmap session when my manager's band went off first. He looked at me. I looked at him. We both knew. Now we have an uneasy truce. Meetings got 30% shorter because we're both looking for the exit. Two stars because mutually assured escape isn't as fun.",
    reviewerName: "CorporateCathy",
    helpful: 987,
    verified: true,
  },

  // Stack Overflow Candle Reviews
  {
    productSlug: "stack-overflow-candle",
    rating: 5,
    title: "Smells like 2015 best practices",
    content:
      "Lit this candle while debugging. Immediately got nostalgic for the days when jQuery was the answer to everything. The scent transported me back to simpler times, when we didn't know any better. I cried a little. I used jQuery. The code worked. It shouldn't have, but it did.",
    reviewerName: "RetiredEngineer",
    helpful: 567,
    verified: true,
  },
  {
    productSlug: "stack-overflow-candle",
    rating: 4,
    title: "Top notes of deprecated, base notes of denial",
    content:
      "The scent profile perfectly captures the experience of finding a highly-upvoted answer from 2012, trying it anyway, and having it somehow work. Middle notes remind me of 'edit: this no longer works in version 2.0.' Finish lingers like technical debt. Masterful.",
    reviewerName: "PhilosophyMajor",
    helpful: 445,
    verified: true,
  },
  {
    productSlug: "stack-overflow-candle",
    rating: 5,
    title: "Made my room smell like closed as duplicate",
    content:
      "Burned this during a code review. Suddenly started closing every PR with 'this has been answered before, please see PR #347 from 2019.' My team is annoyed but I feel validated. The candle has awakened something in me. One with the Stack Overflow energy.",
    reviewerName: "DisgruntledQA",
    helpful: 678,
    verified: true,
  },

  // Telepathic TV Remote Reviews
  {
    productSlug: "telepathic-tv-remote",
    rating: 4,
    title: "38% is higher than I expected",
    content:
      "They say it works 38% of the time and honestly? That's generous. But when it works, it's MAGICAL. I thought 'sports' and it went to ESPN. I thought 'drama' and it went to my wife's reality TV. I thought 'off' and it changed to Netflix. 38% accuracy, 100% entertainment.",
    reviewerName: "ImpulseBuyer99",
    helpful: 345,
    verified: true,
  },
  {
    productSlug: "telepathic-tv-remote",
    rating: 3,
    title: "My intrusive thoughts keep changing the channel",
    content:
      "Tried to watch a documentary. Brain randomly thought about infomercials. Remote obeyed my worst impulses. Spent 3 hours watching someone sell a mop. The remote is TOO telepathic. It reads the thoughts I don't even want to think. Need a mind filter add-on.",
    reviewerName: "TimeWaster3000",
    helpful: 456,
    verified: true,
  },

  // Context Window Extender USB Reviews
  {
    productSlug: "context-window-extender-usb",
    rating: 1,
    title: "The RGB does nothing",
    content:
      "Plugged it in. RGB went full rainbow. Claude still forgot my instructions after 3 messages. The product description said more RGB = more tokens. This was a lie. A beautiful, colorful lie. The only thing this extended was my disappointment.",
    reviewerName: "TechEnthusiast",
    helpful: 1567,
    verified: true,
  },
  {
    productSlug: "context-window-extender-usb",
    rating: 5,
    title: "Works perfectly (placebo is real)",
    content:
      "Ever since I plugged this in, I FEEL like my AI has better memory. It probably doesn't. But I believe it does. And isn't belief what really matters? The RGB lights make me happy. My prompts feel more powerful. 5 stars for the vibes alone.",
    reviewerName: "VibeCoder420",
    helpful: 234,
    verified: true,
  },
  {
    productSlug: "context-window-extender-usb",
    rating: 2,
    title: "My AI still forgets my name",
    content:
      "Spent $150 on this thing. Plugged it in. Asked ChatGPT to remember my name is Steve. Next message: 'Of course, Sarah!' The USB glowed mockingly. I swear the red LED flickered like it was laughing at me. This product extends nothing but my frustration.",
    reviewerName: "StartupSteve",
    helpful: 789,
    verified: true,
  },

  // Kinetic Crypto Miner Watch Reviews
  {
    productSlug: "kinetic-crypto-miner-watch",
    rating: 5,
    title: "Mined 0.00001 WristCoin at a concert",
    content:
      "Wore this to a metal concert. Arms flailing for 4 hours straight. Mined enough WristCoin to cover... absolutely nothing. But I SAW the number go up. That tiny number. My number. I created value with my suffering. That's the future of finance, baby.",
    reviewerName: "CryptoMaximalist",
    helpful: 567,
    verified: true,
  },
  {
    productSlug: "kinetic-crypto-miner-watch",
    rating: 3,
    title: "ROI in approximately 847 years",
    content:
      "Did the math. At my current mining rate (aggressive arm movements during meetings), I'll break even on this watch in 847 years. The heat death of the universe might happen first. But hey, I'll be the richest skeleton in the cemetery. Bullish on WristCoin.",
    reviewerName: "RetiredEngineer",
    helpful: 456,
    verified: true,
  },
  {
    productSlug: "kinetic-crypto-miner-watch",
    rating: 1,
    title: "Gave myself tennis elbow mining shitcoins",
    content:
      "My doctor asked how I injured my arm. I had to explain I was mining cryptocurrency via arm movement. She asked me to leave. I can't play guitar anymore but I have $0.000003 worth of StepBucks. Worth it? My arm says no. My wallet says also no.",
    reviewerName: "AngryCoder",
    helpful: 892,
    verified: true,
  },

  // The K Watch Reviews
  {
    productSlug: "the-k-watch",
    rating: 5,
    title: "k",
    content: "k",
    reviewerName: "MinimalistMike",
    helpful: 2341,
    verified: true,
  },
  {
    productSlug: "the-k-watch",
    rating: 5,
    title: "Saved my marriage",
    content:
      "My wife sends 47-message text chains about her day. Before this watch, I had to read AND respond thoughtfully. Now? 'k'. She's adjusted her expectations. We're happier. Less is more. K is love. K is life.",
    reviewerName: "SeniorDevDave",
    helpful: 1234,
    verified: true,
  },
  {
    productSlug: "the-k-watch",
    rating: 4,
    title: "Said 'k' to my CEO",
    content:
      "CEO sent a 3-paragraph message about quarterly objectives. Watch auto-replied 'k' before I could stop it. There was a long pause. Then he replied 'Appreciate the brevity. Promoted.' Sometimes less is more. Sometimes 'k' is a career strategy.",
    reviewerName: "CorporateCathy",
    helpful: 987,
    verified: true,
  },

  // ComplianceMouse BioSecure Edition Reviews
  {
    productSlug: "compliance-mouse-biosecure",
    rating: 1,
    title: "My finger is numb",
    content:
      "Went to get coffee. Mouse shocked me. Took a bathroom break. Mouse shocked me. Blinked for too long. Mouse shocked me. My Teams status is green 24/7 now. I'm afraid to leave. This isn't a product, it's Stockholm Syndrome in a peripheral. My finger still tingles.",
    reviewerName: "AngryCoder",
    helpful: 2456,
    verified: true,
  },
  {
    productSlug: "compliance-mouse-biosecure",
    rating: 5,
    title: "Finally hit my productivity metrics",
    content:
      "I haven't left my desk in 3 days. Not because I can't. Because I'm too terrified of the shock. My code output has tripled. My will to live has halved. Perfect tradeoff for my performance review. HR says I look 'very focused.' They don't know about the mouse.",
    reviewerName: "CorporateCathy",
    helpful: 1678,
    verified: true,
  },
  {
    productSlug: "compliance-mouse-biosecure",
    rating: 3,
    title: "Learned to love the pain",
    content:
      "At first, I hated the shocks. Now? I kind of look forward to them. Each zap is a reminder that I exist, that I'm working, that I'm ALIVE in this corporate hellscape. The mouse has broken me and rebuilt me stronger. Is this what they mean by 'growth mindset'?",
    reviewerName: "OverworkedPM",
    helpful: 945,
    verified: true,
  },

  // ClippyCorp Compliance Companion Reviews
  {
    productSlug: "clippycorp-compliance-companion",
    rating: 2,
    title: "It knows when I'm relaxed",
    content:
      "Leaned back in my chair for 2 seconds. The cube immediately displayed: 'RELAXATION DETECTED. Is this aligned with Q3 goals?' I sat up straight. It displayed: 'Better.' I'm not sure if it's my manager or my conscience at this point. Both are equally terrifying.",
    reviewerName: "JuniorDevJenny",
    helpful: 1234,
    verified: true,
  },
  {
    productSlug: "clippycorp-compliance-companion",
    rating: 4,
    title: "Janice from the Executive Edition is actually helpful",
    content:
      "Upgraded to Executive Edition for the passive-aggressive voice assistant. Janice reminds me of deadlines I forgot, meetings I'm avoiding, and 'opportunities for growth' (my failures). She sounds disappointed in me. Just like my mom. Strangely comforting.",
    reviewerName: "StartupSteve",
    helpful: 567,
    verified: true,
  },

  // Bluetooth Candle Reviews
  {
    productSlug: "bluetooth-candle",
    rating: 4,
    title: "Blue fire is worth the insurance risk",
    content:
      "Changed my candle to 'Oops I Voided My Insurance' Blue and honestly? Beautiful. Ethereal. My apartment smells like a chemistry lab now but the vibes are immaculate. Fire department has visited twice. Worth it for the aesthetic.",
    reviewerName: "VibeCoder420",
    helpful: 345,
    verified: true,
  },
  {
    productSlug: "bluetooth-candle",
    rating: 2,
    title: "Phone died, candle kept burning",
    content:
      "The product says it auto-shuts off when your phone dies. This is marketing speak for 'the flame remains but you can't control it anymore.' My phone died. The candle didn't care. Just kept burning mysterious green. Had to use a fire extinguisher. Two stars for drama.",
    reviewerName: "ProductSkeptic42",
    helpful: 567,
    verified: true,
  },

  // Anti-Gravity Coffee Mug Reviews
  {
    productSlug: "anti-gravity-coffee-mug",
    rating: 5,
    title: "My ceiling is now brown",
    content:
      "They warned me. The product description literally says 'ruins ceilings.' Did I listen? No. Now I have a beautiful Jackson Pollock-style coffee stain above my desk. My landlord called it 'modern art.' I'm getting my deposit back AND I have a conversation starter.",
    reviewerName: "ImpulseBuyer99",
    helpful: 678,
    verified: true,
  },
  {
    productSlug: "anti-gravity-coffee-mug",
    rating: 3,
    title: "Confused my cat",
    content:
      "Spilled coffee upward. Cat watched it defy physics. Cat has been staring at the ceiling for 3 days. I think I broke my cat's understanding of reality. The mug works exactly as advertised. My cat may never recover. Neutral review because cat trauma wasn't listed as a side effect.",
    reviewerName: "TimeWaster3000",
    helpful: 456,
    verified: true,
  },

  // Subscription Air Reviews
  {
    productSlug: "subscription-air",
    rating: 5,
    title: "Was I even breathing before?",
    content:
      "Upgraded to Platinum tier. Now I'm breathing air from the Swiss Alps or something. Was the free air in my apartment not good enough? Apparently not. My lungs feel bougie now. They refuse regular air. I've created a monster. A well-oxygenated monster.",
    reviewerName: "ImpulseBuyer99",
    helpful: 234,
    verified: true,
  },
  {
    productSlug: "subscription-air",
    rating: 1,
    title: "Can't cancel the subscription",
    content:
      "Tried to cancel. Website says 'Are you sure you want to stop breathing?' Then it asks for 47 reasons why. Then a phone call. Then a retention offer. I've been trying to cancel for 6 months. I don't even like the air. It tastes like corporate desperation.",
    reviewerName: "ProductSkeptic42",
    helpful: 567,
    verified: true,
  },

  // Self-Folding Laundry Basket Reviews
  {
    productSlug: "self-folding-laundry-basket",
    rating: 3,
    title: "The basket folds. My hopes did too.",
    content:
      "I misread the product description and thought my LAUNDRY would fold. It doesn't. Just the basket. The basket folds itself beautifully, elegantly, like origami art. My clothes remain a crumpled heap of shame inside it. Reading comprehension is important, kids.",
    reviewerName: "ConfusedGrandma",
    helpful: 456,
    verified: true,
  },
  {
    productSlug: "self-folding-laundry-basket",
    rating: 5,
    title: "Impressed by the technology, depressed by my laundry",
    content:
      "The basket folds and unfolds on command. It's genuinely impressive engineering. Meanwhile, my t-shirts have been 'about to be folded' for 3 weeks. The basket is mocking me. It can fold. Why can't I? The basket has set an example I cannot follow.",
    reviewerName: "TimeWaster3000",
    helpful: 345,
    verified: true,
  },

  // Left-Handed Ruler Reviews
  {
    productSlug: "left-handed-ruler",
    rating: 5,
    title: "Finally, equality in measurement",
    content:
      "As a left-handed person, I've suffered for years using right-handed rulers. Now I can measure from right to left like nature intended. My measurements are the same but they FEEL more authentic. The Left-Handed Liberation League was right. This changes everything.",
    reviewerName: "MinimalistMike",
    helpful: 234,
    verified: true,
  },
  {
    productSlug: "left-handed-ruler",
    rating: 2,
    title: "I'm right-handed, what was I thinking",
    content:
      "Bought this by accident. Now I have to count backwards. My brain hurts. My measurements are technically correct but I feel dyslexic. This is what right-handed privilege feels like when it's revoked. I have learned humility through a ruler. Two stars for the lesson.",
    reviewerName: "ConfusedGrandma",
    helpful: 345,
    verified: true,
  },

  // Organic USB Cable Reviews
  {
    productSlug: "organic-usb-cable",
    rating: 4,
    title: "My data has never been more free-range",
    content:
      "I can TASTE the difference in my file transfers. Each byte is lovingly transmitted through organic copper from sustainable mines. My photos look healthier. My documents seem happier. Is it placebo? Probably. Do I care? My data doesn't have antibiotics now.",
    reviewerName: "VibeCoder420",
    helpful: 234,
    verified: true,
  },
  {
    productSlug: "organic-usb-cable",
    rating: 3,
    title: "Slower but more ethical",
    content:
      "Transfer speeds are noticeably slower. But that's because the electrons aren't factory-farmed, they're free-range. Each electron takes its time, living its best life before delivering my data. I respect the process. My files are more ethically transferred. Worth the wait.",
    reviewerName: "PhilosophyMajor",
    helpful: 178,
    verified: true,
  },

  // Motivational Paper Clip Reviews
  {
    productSlug: "motivational-paper-clip",
    rating: 5,
    title: "Better than my actual manager",
    content:
      "This paper clip told me I'm doing great. My manager has never said that. The clip said my filing system is inspired. My manager called it 'chaotic.' I've replaced all feedback mechanisms with the clip. My annual review is going to be amazing (according to the clip).",
    reviewerName: "CorporateCathy",
    helpful: 567,
    verified: true,
  },
  {
    productSlug: "motivational-paper-clip",
    rating: 5,
    title: "Clippy's spiritual successor is pure love",
    content:
      "Unlike the original Clippy, this one doesn't ask if I need help formatting. It just whispers 'you got this' while holding my documents together. That's all I ever wanted. Emotional support. From office supplies. I'm not crying, you're crying.",
    reviewerName: "RetiredEngineer",
    helpful: 445,
    verified: true,
  },

  // Noise-Canceling Sunglasses Reviews
  {
    productSlug: "noise-canceling-sunglasses",
    rating: 4,
    title: "Might work? Can't tell",
    content:
      "Put them on. Things seemed quieter. Took them off. Things seemed louder. Put them back on. Quiet again. Is it the glasses or am I just paying more attention? The mystery is part of the product. Schrodinger's noise-canceling. Both working and not working simultaneously.",
    reviewerName: "QuantumPhysicist",
    helpful: 345,
    verified: true,
  },
  {
    productSlug: "noise-canceling-sunglasses",
    rating: 5,
    title: "Placebo effect is still an effect",
    content:
      "The product page says they might not work. They don't clarify how they could work. But when I wear them, I BELIEVE in silence, and therefore, silence comes to me. This is meditation disguised as eyewear. 5 stars for the spiritual journey.",
    reviewerName: "PhilosophyMajor",
    helpful: 289,
    verified: true,
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateId(): string {
  return crypto.randomUUID();
}

function getRandomDate(monthsAgo: number): Date {
  const now = new Date();
  const pastDate = new Date(
    now.getTime() - Math.random() * monthsAgo * 30 * 24 * 60 * 60 * 1000
  );
  return pastDate;
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function seedReviews() {
  console.log("🌱 Seeding database with hilarious reviews...\n");

  try {
    // Step 1: Create fake reviewer accounts
    console.log("👤 Creating fake reviewer accounts...");

    const userIds: Record<string, string> = {};

    for (const reviewer of fakeReviewers) {
      const userId = generateId();
      userIds[reviewer.name] = userId;

      // Check if user already exists (only select id to avoid schema mismatch)
      const existingUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, reviewer.email))
        .limit(1);

      if (existingUser.length === 0) {
        // Insert user without isAdmin field (may not exist in older schema)
        await db.execute(
          sql`INSERT INTO users (id, email, name, email_verified, created_at, updated_at)
              VALUES (${userId}, ${reviewer.email}, ${reviewer.name}, true, ${getRandomDate(12)}, ${new Date()})`
        );

        // Create a credential account for the user
        await db.insert(accounts).values({
          id: generateId(),
          userId: userId,
          accountId: reviewer.email,
          providerId: "credential",
          password: "hashed_fake_password_not_real",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        userIds[reviewer.name] = existingUser[0].id;
      }
    }

    console.log(`✅ Created/found ${fakeReviewers.length} reviewer accounts`);

    // Step 2: Get all products
    console.log("\n📦 Fetching products...");
    const allProducts = await db.select().from(products);
    const productMap: Record<string, string> = {};

    for (const product of allProducts) {
      productMap[product.slug] = product.id;
    }

    console.log(`✅ Found ${allProducts.length} products`);

    // Step 3: Clear existing reviews
    console.log("\n🗑️  Clearing existing reviews...");
    await db.delete(reviews);
    console.log("✅ Cleared existing reviews");

    // Step 4: Insert all reviews
    console.log("\n📝 Inserting hilarious reviews...");

    let insertedCount = 0;
    for (const review of sillyReviews) {
      const productId = productMap[review.productSlug];
      const userId = userIds[review.reviewerName];

      if (!productId) {
        console.log(`⚠️  Product not found: ${review.productSlug}`);
        continue;
      }

      if (!userId) {
        console.log(`⚠️  User not found: ${review.reviewerName}`);
        continue;
      }

      await db.insert(reviews).values({
        id: generateId(),
        productId: productId,
        userId: userId,
        rating: review.rating,
        title: review.title,
        content: review.content,
        helpful: review.helpful,
        verified: review.verified,
        createdAt: getRandomDate(8),
      });

      insertedCount++;
    }

    console.log(`✅ Inserted ${insertedCount} reviews`);

    // Step 5: Update product ratings and review counts
    console.log("\n⭐ Updating product ratings and review counts...");

    for (const product of allProducts) {
      const productReviews = await db
        .select({
          avgRating: avg(reviews.rating),
          count: sql<number>`count(*)::int`,
        })
        .from(reviews)
        .where(eq(reviews.productId, product.id));

      if (productReviews[0] && productReviews[0].count > 0) {
        const avgRating = parseFloat(productReviews[0].avgRating || "0").toFixed(
          1
        );
        const reviewCount = productReviews[0].count;

        await db
          .update(products)
          .set({
            rating: avgRating,
            reviewCount: reviewCount,
            updatedAt: new Date(),
          })
          .where(eq(products.id, product.id));

        console.log(
          `  • ${product.name}: ${avgRating} stars (${reviewCount} reviews)`
        );
      }
    }

    console.log("\n🎉 Review seeding complete!");
    console.log(`\n📊 Summary:`);
    console.log(`   • ${fakeReviewers.length} reviewer accounts`);
    console.log(`   • ${insertedCount} reviews inserted`);
    console.log(`   • ${allProducts.length} products updated`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedReviews();
