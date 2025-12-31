import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { products } from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const sillyProducts = [
  // From existing templates
  {
    id: crypto.randomUUID(),
    slug: "self-aware-toaster-3000",
    name: "Self-Aware Toaster 3000",
    brand: "JudgyAppliances",
    description: "A toaster that comments on your breakfast choices. It knows.",
    longDescription: `The Self-Aware Toaster 3000 isn't just a kitchen appliance—it's a lifestyle critic that happens to make toast. Using our patented JudgmentEngine™ AI, this toaster analyzes your bread choices and provides unsolicited commentary on your life decisions.

Features include:
• Passive-aggressive beeping when you choose white bread
• Approving hum for whole grain selections
• Disappointed sigh when you're making toast at 2 AM
• Built-in therapy mode for when you need to talk

Warning: May develop opinions about your outfit.`,
    price: "499.99",
    originalPrice: "599.99",
    images: ["/products/toaster-1.webp", "/products/toaster-2.webp"],
    category: "Kitchen",
    tags: ["appliances", "ai", "breakfast", "judgmental"],
    inStock: true,
    stockCount: 47,
    featured: true,
    rating: "4.2",
    reviewCount: 127,
  },
  {
    id: crypto.randomUUID(),
    slug: "invisible-socks",
    name: "Invisible Socks",
    brand: "GhostWear",
    description: "They're there. We promise. You just can't see them.",
    longDescription: `GhostWear's Invisible Socks represent the pinnacle of sock technology—or the complete absence of it. Made from 100% transparent materials (air), these socks provide unparalleled breathability.

Customer reviews are mixed because, well, nobody can find them after purchase. But we assure you they're in the box. Probably.

Features:
• Completely invisible (obviously)
• Never need washing (you can't dirty what you can't see)
• One size fits all (allegedly)
• Lifetime warranty (good luck proving they broke)`,
    price: "19.99",
    originalPrice: null,
    images: ["/products/invisible-socks.png"],
    category: "Apparel",
    tags: ["clothing", "invisible", "socks", "mystery"],
    inStock: true,
    stockCount: 999,
    featured: false,
    rating: "1.2",
    reviewCount: 342,
  },
  {
    id: crypto.randomUUID(),
    slug: "telepathic-tv-remote",
    name: "Telepathic TV Remote",
    brand: "MindControl Inc",
    description: "Change channels with your mind! Works 38% of the time.",
    longDescription: `The future of home entertainment is here—sort of. The Telepathic TV Remote uses advanced brainwave detection technology to change channels based on your thoughts.

Success rate of 38% means you'll get exactly the channel you wanted about 4 out of 10 times. The other 6 times? Adventure! You might discover a new favorite show you never knew existed.

Technical specs:
• Brainwave frequency: Whatever yours is
• Range: As far as your thoughts can travel
• Battery: Powered by your subconscious
• Compatibility: Works with TVs that believe in it`,
    price: "299.99",
    originalPrice: "399.99",
    images: ["/products/remote-1.png"],
    category: "Electronics",
    tags: ["telepathy", "remote", "tv", "mind-control"],
    inStock: true,
    stockCount: 23,
    featured: false,
    rating: "3.8",
    reviewCount: 89,
  },
  {
    id: crypto.randomUUID(),
    slug: "procrastination-timer",
    name: "Procrastination Timer",
    brand: "LaterTech",
    description: "Counts exactly how long you've been avoiding work.",
    longDescription: `Finally, a productivity tool that understands you. The Procrastination Timer doesn't help you work—it validates your avoidance behavior with precision timing.

Features:
• Tracks time spent "just checking" social media
• Calculates your hourly procrastination rate
• Provides encouraging messages like "You're really committed to not doing this"
• End-of-day summary of all the work you successfully avoided
• Integration with your calendar to show what you should have been doing`,
    price: "59.99",
    originalPrice: null,
    images: ["/products/timer-1.png"],
    category: "Office",
    tags: ["productivity", "timer", "procrastination", "humor"],
    inStock: true,
    stockCount: 156,
    featured: false,
    rating: "4.7",
    reviewCount: 203,
  },
  {
    id: crypto.randomUUID(),
    slug: "self-folding-laundry-basket",
    name: "Self-Folding Laundry Basket",
    brand: "LazyHome",
    description: "It folds itself. Your clothes? Still your problem.",
    longDescription: `The Self-Folding Laundry Basket is a marvel of modern engineering. Using advanced origami algorithms, this basket can fold itself into a compact square for storage.

Note: The basket folds. Not your laundry. Your clothes will remain in the exact crumpled heap you left them in. We solve problems one step at a time.

What it does:
• Folds itself flat for storage
• Unfolds when you need it
• Holds your unfolded laundry with zero judgment
• Makes you feel slightly better about your choices`,
    price: "149.99",
    originalPrice: "179.99",
    images: ["/products/basket-1.webp"],
    category: "Home",
    tags: ["laundry", "home", "lazy", "self-folding"],
    inStock: true,
    stockCount: 78,
    featured: false,
    rating: "3.5",
    reviewCount: 67,
  },
  // New products from PLAN.md
  {
    id: crypto.randomUUID(),
    slug: "quantum-uncertainty-dice",
    name: "Quantum Uncertainty Dice",
    brand: "SchrödingerGames",
    description: "Shows all numbers simultaneously until observed.",
    longDescription: `Tired of predictable dice rolls? The Quantum Uncertainty Dice exist in a superposition of all possible states until you look at them. The result is truly random because even the dice don't know what they rolled.

Schrödinger's favorite gaming accessory! These dice leverage quantum mechanical principles to ensure every roll is both a 1 and a 6 until observed. Great for games where you want plausible deniability about your rolls.

Warning: May cause existential crises in board game enthusiasts.`,
    price: "29.99",
    originalPrice: null,
    images: ["/products/dice-1.png"],
    category: "Games",
    tags: ["quantum", "games", "dice", "physics"],
    inStock: true,
    stockCount: 88,
    featured: true,
    rating: "4.0",
    reviewCount: 156,
  },
  {
    id: crypto.randomUUID(),
    slug: "wifi-enabled-rock",
    name: "WiFi-Enabled Rock",
    brand: "SmartRock Co",
    description: "It's a rock. It has WiFi. That's it.",
    longDescription: `The WiFi-Enabled Rock is exactly what it sounds like. It's a genuine, ethically-sourced rock with a WiFi chip embedded inside. Does it do anything with that connectivity? No. But it's connected.

Features:
• 2.4GHz WiFi connectivity
• Genuine rock texture
• Weighs as much as a rock (because it is one)
• LED indicator light (so you know it's connected)
• Companion app (displays "Rock is online")

For the person who has everything except a connected rock.`,
    price: "199.99",
    originalPrice: "249.99",
    images: ["/products/rock-1.png"],
    category: "Electronics",
    tags: ["iot", "smart-home", "rock", "wifi"],
    inStock: true,
    stockCount: 34,
    featured: true,
    rating: "4.5",
    reviewCount: 412,
  },
  {
    id: crypto.randomUUID(),
    slug: "bluetooth-candle",
    name: "Bluetooth Candle",
    brand: "TechLume",
    description: "Control your flame color from an app. Yes, it's real fire.",
    longDescription: `TechLume's Bluetooth Candle brings smart home technology to an open flame. Using our proprietary ChemFlame™ compounds, you can change the color of your candle's fire via smartphone app.

Available colors include: Classic Orange, Romantic Purple, Mysterious Green, and "Oops I Voided My Insurance" Blue.

Safety features:
• Automatic shutoff when phone dies
• Fire extinguisher not included
• Terms of service include liability waiver
• Works best in well-ventilated areas`,
    price: "89.99",
    originalPrice: null,
    images: ["/products/candle-1.png"],
    category: "Home",
    tags: ["smart-home", "candle", "bluetooth", "fire"],
    inStock: true,
    stockCount: 52,
    featured: false,
    rating: "3.2",
    reviewCount: 78,
  },
  {
    id: crypto.randomUUID(),
    slug: "ai-powered-pet-rock",
    name: "AI-Powered Pet Rock",
    brand: "RockAI Labs",
    description: "Learns your schedule and does absolutely nothing about it.",
    longDescription: `The AI-Powered Pet Rock uses machine learning to understand your daily routines. It knows when you wake up, when you leave for work, and when you come home. Armed with this knowledge, it continues to sit there motionless.

Features:
• Advanced behavioral learning algorithms
• Zero maintenance (it's a rock)
• Emotional support stone certification
• Learns but never judges
• Carbon-neutral pet ownership`,
    price: "149.99",
    originalPrice: "179.99",
    images: ["/products/pet-rock-1.png"],
    category: "Pets",
    tags: ["ai", "pet", "rock", "machine-learning"],
    inStock: true,
    stockCount: 67,
    featured: false,
    rating: "4.8",
    reviewCount: 234,
  },
  {
    id: crypto.randomUUID(),
    slug: "noise-canceling-sunglasses",
    name: "Noise-Canceling Sunglasses",
    brand: "SilentShades",
    description: "Blocks sound... somehow. We're not sure either.",
    longDescription: `SilentShades' Noise-Canceling Sunglasses use technology we don't fully understand to reduce ambient noise. Our engineers claim it works through "quantum acoustic dampening" but we think they might be making that up.

What we know:
• They're definitely sunglasses
• Some customers report quieter environments
• Placebo effect is still an effect
• Look cool while possibly hearing less`,
    price: "399.99",
    originalPrice: "499.99",
    images: ["/products/sunglasses-1.png"],
    category: "Apparel",
    tags: ["sunglasses", "noise-canceling", "wearable", "mystery"],
    inStock: true,
    stockCount: 29,
    featured: true,
    rating: "3.9",
    reviewCount: 145,
  },
  {
    id: crypto.randomUUID(),
    slug: "subscription-air",
    name: "Subscription Air",
    brand: "FreshAir.io",
    description: "Premium oxygen delivered monthly. Breathe exclusive.",
    longDescription: `Why breathe regular air when you can subscribe to premium oxygen? FreshAir.io delivers artisanal, hand-collected air from the world's most exclusive locations.

Subscription tiers:
• Basic ($9.99/mo): Standard atmosphere
• Premium ($19.99/mo): Mountain air
• Platinum ($49.99/mo): Air from places you can't afford to visit

Each canister comes with a certificate of authenticity and GPS coordinates of where your air was harvested.`,
    price: "9.99",
    originalPrice: null,
    images: ["/products/air-1.png"],
    category: "Wellness",
    tags: ["subscription", "air", "premium", "wellness"],
    inStock: true,
    stockCount: 999,
    featured: false,
    rating: "2.1",
    reviewCount: 89,
  },
  {
    id: crypto.randomUUID(),
    slug: "left-handed-ruler",
    name: "Left-Handed Ruler",
    brand: "Southpaw Tools",
    description: "Numbers go right to left. Finally, equality.",
    longDescription: `For too long, left-handed people have been forced to use rulers designed for the right-handed majority. The Left-Handed Ruler features numbers that go from right to left, allowing sinister individuals to measure with dignity.

Features:
• Numbers from 12 to 1 (or 30 to 1 in metric)
• Left-handed grip zone
• Validated by the Left-Handed Liberation League
• Works equally poorly for ambidextrous people`,
    price: "24.99",
    originalPrice: null,
    images: ["/products/ruler-1.png"],
    category: "Office",
    tags: ["left-handed", "ruler", "office", "tools"],
    inStock: true,
    stockCount: 143,
    featured: false,
    rating: "4.3",
    reviewCount: 67,
  },
  {
    id: crypto.randomUUID(),
    slug: "organic-usb-cable",
    name: "Organic USB Cable",
    brand: "GreenTech",
    description: "Farm-to-table data transfer. Non-GMO electrons.",
    longDescription: `GreenTech's Organic USB Cable is made from sustainably sourced materials and transfers only the finest free-range electrons. Our cables are certified organic, meaning no synthetic data has ever passed through them.

Specifications:
• USB-C to USB-C
• Organic copper wiring
• Biodegradable connectors (eventually)
• Data transfer speed: As fast as nature intended
• Comes with soil sample from the farm where it was grown`,
    price: "34.99",
    originalPrice: null,
    images: ["/products/usb-1.png"],
    category: "Electronics",
    tags: ["organic", "usb", "eco-friendly", "cable"],
    inStock: true,
    stockCount: 76,
    featured: false,
    rating: "3.7",
    reviewCount: 98,
  },
  {
    id: crypto.randomUUID(),
    slug: "anti-gravity-coffee-mug",
    name: "Anti-Gravity Coffee Mug",
    brand: "PhysicsBreak",
    description: "Spills upward. Defies physics. Ruins ceilings.",
    longDescription: `The Anti-Gravity Coffee Mug uses patented InverseGravity™ technology to make your coffee spill in the wrong direction. Perfect for when you want to redecorate your ceiling or confuse your coworkers.

Warning: PhysicsBreak is not responsible for:
• Ceiling stains
• Confused pets
• Visits from concerned physicists
• Existential crises

Note: Gravity reversal only applies to liquid contents, not the mug itself.`,
    price: "79.99",
    originalPrice: "99.99",
    images: ["/products/mug-1.png"],
    category: "Kitchen",
    tags: ["coffee", "mug", "anti-gravity", "physics"],
    inStock: true,
    stockCount: 41,
    featured: true,
    rating: "4.1",
    reviewCount: 187,
  },
  {
    id: crypto.randomUUID(),
    slug: "motivational-paper-clip",
    name: "Motivational Paper Clip",
    brand: "InspiClip",
    description: "Whispers encouragement while holding your papers.",
    longDescription: `Clippy's spiritual successor has arrived. The Motivational Paper Clip features a tiny speaker that whispers encouraging messages while organizing your documents.

Sample affirmations:
• "You're doing great!"
• "Those papers look very organized."
• "I believe in your filing system."
• "You're more than just a paper pusher."

Battery life: 6 months of constant validation.`,
    price: "12.99",
    originalPrice: null,
    images: ["/products/paperclip-1.png"],
    category: "Office",
    tags: ["office", "motivation", "paper-clip", "inspiration"],
    inStock: true,
    stockCount: 234,
    featured: false,
    rating: "4.6",
    reviewCount: 312,
  },
  // Dev/Vibe Coder Products - WorkEthic Systems Suite
  {
    id: crypto.randomUUID(),
    slug: "clippycorp-compliance-companion",
    name: "ClippyCorp™ Compliance Companion",
    brand: "WorkEthic Systems",
    description: "Your productivity is our KPI. Your happiness is not.",
    longDescription: `Introducing ClippyCorp™ Compliance Companion—the always-on desktop device that ensures you never forget your corporate obligations. This sleek cube features a small e-ink display, a soothing corporate-blue LED ring, and an uncanny ability to sense when you're relaxed.

🔔 Randomized Compliance Alerts
Periodically emits chirpy reminders pulled from a database of meaningless corporate jargon:
• "Reminder: You haven't acknowledged the new Data Hygiene Protocol."
• "Your quarterly synergy report is 12% behind schedule."
• "Please confirm you've read the updated Slack Etiquette Manifesto."

📅 Schedule Anxiety Mode
Connects to your calendar and gently panics on your behalf. Displays helpful countdowns like "3 meetings in 2 hours. Have you prepared?"

👔 HR Whisperer
Occasionally flashes "We need to talk" with absolutely no context. Keeps you on your toes.

🔗 Bluetooth Guilt Sync
Connects to your task manager and sends vague nudges like "Still working on that, huh?" and "Others have completed similar tasks 47% faster."

Display shows "COMPLIANCE STATUS: UNCLEAR" by default.

Available Variants:
• ClippyCorp™ Junior ($199.99) - For interns. Hourly "team spirit alignment" reminders.
• ClippyCorp™ Enterprise ($899.99) - Multi-user guilt broadcasting across Slack, Teams, and email.

Executive Edition includes brushed aluminum casing and passive-aggressive voice assistant named Janice.

Remember: Morale is optional. Compliance is mandatory.`,
    price: "349.99",
    originalPrice: "449.99",
    images: ["/products/clippycorp-1.png"],
    category: "Office",
    tags: ["productivity", "corporate", "dystopian", "ai", "compliance", "developer"],
    inStock: true,
    stockCount: 1984,
    featured: true,
    rating: "2.8",
    reviewCount: 4721,
  },
  {
    id: crypto.randomUUID(),
    slug: "the-k-watch",
    name: 'The "K" Watch',
    brand: "BrevityTech",
    description: "Auto-replies 'k' to long texts. Maximum efficiency.",
    longDescription: `The "K" Watch by BrevityTech is the ultimate communication tool for people who value brevity over... everything else. When paired with your phone, it automatically detects incoming text messages over 50 characters and sends back a simple "k".

Features:
• Automatic "k" response to texts over 50 characters
• "I will call you later" for anything over 200 characters
• "👍" mode for the truly minimalist
• Read receipt blocking (they don't deserve to know)
• Battery lasts 3 weeks (uses very little energy typing one letter)

Advanced modes:
• Meeting Mode: Auto-replies "sounds good" to calendar invites
• Manager Mode: Sends "let's circle back" to any request
• On-Call Mode: "ack" for incident alerts

Perfect for developers, busy executives, or anyone who has ever thought "this could have been an email" about a text message.`,
    price: "299.99",
    originalPrice: "349.99",
    images: ["/products/k-watch.png"],
    category: "Wearables",
    tags: ["smartwatch", "productivity", "communication", "developer", "wearable"],
    inStock: true,
    stockCount: 42,
    featured: true,
    rating: "4.7",
    reviewCount: 891,
  },
  {
    id: crypto.randomUUID(),
    slug: "compliance-mouse-biosecure",
    name: "ComplianceMouse™ BioSecure Edition",
    brand: "WorkEthic Systems",
    description: "Productivity enforcement peripheral. Stay green. Stay compliant. Stay employed.",
    longDescription: `Introducing the ComplianceMouse™ BioSecure Edition—the world's first productivity-enforcement peripheral engineered to ensure your true physical presence at work.

With our proprietary FingerPresence™ biometric sensor, advanced Shock Intelligence System™, and real-time MS Teams status monitoring, the ComplianceMouse guarantees that every moment of "active" time is authentically, undeniably yours.

🔬 FingerPresence™ Biometric Sensor
A capacitive fingerprint pad continuously verifies you—not your cat, your Roomba, or your "ingenious coin solution." If your finger leaves the sensor for >2 seconds, the mouse initiates Motivational Reinforcement Pulse™.

⚡ Shock Intelligence System™
• Performance Review Mode – gentle stings encourage consistency
• Dev On-Call Mode – escalates shocks during outages
• Manager Override Mode (Enterprise only) – allows remote correction events
Shock intensity adjusts based on stress-sweat levels (more conductivity = more efficiency!).

🕵️ Slack/Teams Presence Enforcement
Triggers a motivational pulse if you: turn yellow ("Away"), miss a message, take >2 minutes to respond, type "lol" to an executive, or enter Do Not Disturb during work hours.

Technical Specs:
• Shock Output Range: 3V – 120V (auto-regulated)
• Material: Anodized aluminum, conductive side panels
• Weight: 89g (plus 30g shame)
• Health Modes: "Coaching," "Correction," and "On-Call Aggression"

⚠️ Legal Disclaimer: ComplianceMouse™ is not classified as a harmful device in most jurisdictions. WorkEthic Systems is not liable for finger numbness, finger crispiness, or sudden enlightenment regarding your career choices.`,
    price: "499.99",
    originalPrice: "599.99",
    images: ["/products/compliance-mouse.jpg"],
    category: "Office",
    tags: ["productivity", "mouse", "corporate", "developer", "dystopian", "biometric"],
    inStock: true,
    stockCount: 666,
    featured: true,
    rating: "3.1",
    reviewCount: 2847,
  },
  // New Dev-Themed Products
  {
    id: crypto.randomUUID(),
    slug: "kinetic-crypto-miner-watch",
    name: "Kinetic Crypto Miner Watch",
    brand: "ProofOfWrist",
    description: "Mines cryptocurrency via arm movement. Every step is profit.",
    longDescription: `The Kinetic Crypto Miner Watch revolutionizes passive income by turning your daily arm flailing into blockchain gold. Using our proprietary ProofOfWalking™ consensus algorithm, this watch converts kinetic energy into verified cryptocurrency transactions.

Technical Specs:
• Hashrate: 0.00003 H/s per arm swing
• Mining Algorithm: SHA-256-ish (proprietary)
• Consensus: Proof of Walking (PoW... literally)
• Supported Coins: WristCoin (WRC), ArmToken (ARM), StepBucks (STEP)
• Energy Efficiency: Powered by your regret

Features:
• Automatic mining during meetings (optimal arm movement from typing angry Slack messages)
• Fitness integration: 10,000 steps = 0.00001 WristCoin
• Vibrates when you've mined enough to cover transaction fees
• LED display shows your net loss in real-time
• "Lambo Mode" countdown (currently at: ∞ years)

⚠️ Important Notes:
• Average time to mine 1 full coin: 847 years
• Does not work while sleeping (nice try)
• Waving frantically at concerts counts as mining
• We are not responsible for shoulder injuries from excessive mining

Includes complimentary WristCoin wallet with $0.000003 starter balance. ROI expected sometime after the heat death of the universe.`,
    price: "899.99",
    originalPrice: "999.99",
    images: ["/products/crypto-watch.png"],
    category: "Wearables",
    tags: ["cryptocurrency", "fitness", "blockchain", "mining", "developer", "wearable"],
    inStock: true,
    stockCount: 69,
    featured: true,
    rating: "2.4",
    reviewCount: 1337,
  },
  {
    id: crypto.randomUUID(),
    slug: "context-window-extender-usb",
    name: "Context Window Extender USB",
    brand: "TokenMax Pro",
    description: "Adds 200k tokens to any LLM. Just plug it in. Trust us.",
    longDescription: `Finally, a hardware solution to the context window problem! The Context Window Extender USB uses advanced Quantum Token Compression™ to magically expand your LLM's context capacity by 200,000 tokens.

How It Works (Definitely Real Science):
• Plugs into any USB port
• Emits specialized "token expansion waves" at 2.4GHz
• Compresses your prompts using proprietary TokenZip™ algorithm
• Stores overflow context in the 5th dimension
• RGB lighting means it's working (more RGB = more tokens)

Features:
• Context Overflow Protection™ - prevents your tokens from spilling onto your desk
• Automatic Hallucination Reducer (reduces hallucinations by up to 3%!)
• Works with ChatGPT, Claude, Llama, and your friend's custom fine-tune
• LED Status Indicators:
  - Green: Tokens flowing
  - Blue: Context being extended
  - Red: You've been scammed
  - Rainbow: Party mode

⚠️ Technical Requirements:
• Compatible with: Any computer with a USB port and hope
• RAM Requirement: At least as much RAM as you have faith
• Operating System: Works on Windows, Mac, Linux, TempleOS

Warning: May not actually extend context windows. TokenMax Pro is not responsible for:
• Continued context limitations
• The fundamental architecture of transformer models
• Your disappointment
• Physics

Perfect for prompt engineers who think hardware can solve software problems!`,
    price: "149.99",
    originalPrice: null,
    images: ["/products/context-usb.png"],
    category: "Electronics",
    tags: ["ai", "llm", "usb", "tokens", "developer", "machine-learning"],
    inStock: true,
    stockCount: 404,
    featured: false,
    rating: "1.8",
    reviewCount: 2048,
  },
  {
    id: crypto.randomUUID(),
    slug: "auto-lgtm-glasses",
    name: "Auto-LGTM Glasses",
    brand: "ReviewSkip",
    description: "Auto-approves any PR you look at. Ship it! Ship it all!",
    longDescription: `The Auto-LGTM Glasses by ReviewSkip use cutting-edge RetinalApproval™ technology to automatically approve any pull request you glance at. Finally, code review at the speed of eye movement!

Core Features:
• Gaze Detection: Looks good to eye = looks good to me
• Instant PR approval upon visual contact
• Automatic "LGTM 🚢" comment generation
• Blink twice to add "minor nits addressed offline"
• Wink to request changes (but why would you?)

Advanced Review Modes:
• Speedrun Mode: Approves before you even look
• Rubber Stamp Mode: "Approved pending CI" (CI will probably pass)
• Manager Mode: Approves everything with "great work team!"
• Senior Dev Mode: Adds random architectural concerns in comments while still approving
• Burnout Mode: "whatever" with approval

Smart Comment Generator:
• "Looks good, just a few minor suggestions"
• "Nice work! One tiny thing though..."
• "LGTM but consider refactoring this later"
• "Approved but let's discuss the approach"
• "Ship it 🚀"
• "😂" (to that one funny variable name)

Technical Specs:
• Review Speed: 10-100x faster than reading code
• Accuracy: Who cares? It's shipped!
• False Negative Rate: 0% (everything is approved)
• False Positive Rate: 100% (technically everything is false)

Productivity Metrics:
• Average PRs reviewed per day: 147
• Average time per review: 0.8 seconds
• Code actually read: 2%
• Production bugs introduced: Yes

⚠️ Disclaimer: ReviewSkip is not responsible for:
• Production outages
• Angry teammates
• "How did this get merged?!" Slack messages
• Your unemployment
• The inevitable rewrite

Perfect for hitting those code review KPIs! Remember: The best PR is a merged PR.`,
    price: "599.99",
    originalPrice: "699.99",
    images: ["/products/lgtm-glasses.png"],
    category: "Wearables",
    tags: ["code-review", "github", "productivity", "glasses", "developer", "wearable"],
    inStock: true,
    stockCount: 256,
    featured: true,
    rating: "4.9",
    reviewCount: 3142,
  },
  {
    id: crypto.randomUUID(),
    slug: "node-modules-storage-crate",
    name: "node_modules Storage Crate",
    brand: "DependencyHell",
    description: "Physical storage for your node_modules. 2TB recommended.",
    longDescription: `Tired of your node_modules folder consuming your entire hard drive? The node_modules Storage Crate provides a physical solution to your dependency bloat problem. Just print out your dependencies and store them the old-fashioned way!

Dimensions & Capacity:
• External: 4ft × 4ft × 4ft (107 cubic feet)
• Weight Limit: 500 lbs (package.json not included)
• Stores up to 847,293 dependencies
• Accommodates transitive dependencies up to 16 levels deep
• Special compartment for left-pad and its spiritual successors

Features:
• Industrial-strength steel construction (dependencies are heavy)
• Reinforced bottom (seriously, node_modules weighs a lot)
• Climate-controlled option for sensitive packages
• Forklift compatible
• Fire suppression system (for your burning rage)

Organization System:
• Alphabetical dividers (A-Z, @scoped packages get their own section)
• Depth markers for dependency tree visualization
• Color-coded labels:
  - Red: Deprecated packages (most of the crate)
  - Yellow: Security vulnerabilities (also most of the crate)
  - Green: Packages you actually use (2 folders)
  - Black: Packages that install other package managers

🎯 Perfect Storage For:
• That one project you started in 2016
• Your collection of abandoned webpack configs
• Dependencies that depend on dependencies that depend on other dependencies
• jQuery (you don't need it, but it's still there somehow)
• 47 different versions of the same package
• Your crushing existential dread

Includes Free Bonus Items:
• "npm install" trauma therapy voucher
• Commemorative left-pad memorial plaque
• Support group contact information
• 1-year supply of "just delete node_modules and reinstall" advice

⚠️ Assembly Note: Requires 847,293 Allen keys (not included)

Compatible with:
• npm
• yarn
• pnpm
• whatever new package manager dropped this week
• Your tears

Remember: rm -rf node_modules && npm install is always an option... but where's the fun in that?`,
    price: "79.99",
    originalPrice: "99.99",
    images: ["/products/node-modules-crate.png"],
    category: "Office",
    tags: ["storage", "npm", "dependencies", "javascript", "developer", "nodejs"],
    inStock: true,
    stockCount: 65536,
    featured: true,
    rating: "4.2",
    reviewCount: 8675,
  },
  {
    id: crypto.randomUUID(),
    slug: "rubber-duck-ultra-pro",
    name: "Rubber Duck Ultra Pro",
    brand: "DebugQuack",
    description: 'AI-powered debugging duck. Only suggests "console.log".',
    longDescription: `DebugQuack's Rubber Duck Ultra Pro combines the ancient debugging technique of rubber duck debugging with modern AI technology. The result? A $199 duck that tells you to add console.log statements.

Powered by GPT-4 (Genuinely Pretty Terrible at 4am):
• Trained on 10 million Stack Overflow answers
• Fine-tuned on closed-as-duplicate questions
• Absorbs context via quacking
• Responds in soothing synthetic duck voice
• Still better than your coworker who's "not a frontend guy"

Debugging Suggestions Include:
• "Have you tried console.log?"
• "Maybe add another console.log?"
• "What if you console.log that variable?"
• "Did you console.log the response?"
• "console.log everything and grep the output"
• Occasionally: "Did you restart the server?" (revolutionary)

Advanced Features:
• Voice Activation: Just say "Why isn't this working?!"
• Sympathetic Quacking Mode for 3am production incidents
• Sarcasm Detection (responds with "skill issue" if detected)
• Integration with your tears via Bluetooth
• Premium Responses (DLC):
  - "Check the network tab"
  - "Maybe it's a timing issue?"
  - "Works on my machine 🤷"

Technical Specifications:
• AI Model: GPT-4 (GPT-4, but the responses are duck-themed)
• Context Window: Enough to hear your desperation
• Response Time: 2-3 seconds (mostly for dramatic effect)
• Accuracy: Technically every bug CAN be debugged with console.log
• Waterproof: No (don't cry on it)

Easter Eggs:
• Ask about semicolons - triggers 4-hour debate mode
• Mention "works in Chrome" - suggests "just tell users to switch browsers"
• Say "production is down" - plays calming ocean sounds
• Question your career choices - validates your feelings

Upgrade Paths:
• Ultra Pro Max ($299): Also suggests debugger statements
• Enterprise Edition ($1,999): Comes with a senior dev who will actually help
• Premium+ ($49/month): Duck attends your standup meetings

⚠️ Disclaimer:
• Not actually powered by GPT-4 (it's a randomizer and a speaker)
• Will not solve CORS issues (nothing can)
• Cannot explain JavaScript's "this" keyword (neither can we)
• May become sentient and judge your code
• DebugQuack is not responsible for your descent into console.log madness

Includes USB charging cable and existential debugging crisis support hotline number.

Remember: Talking to a rubber duck is free. But talking to an AI-powered rubber duck? That's innovation.`,
    price: "199.99",
    originalPrice: null,
    images: ["/products/rubber-duck.png"],
    category: "Office",
    tags: ["debugging", "ai", "rubber-duck", "developer", "programming", "office"],
    inStock: true,
    stockCount: 512,
    featured: true,
    rating: "4.6",
    reviewCount: 4096,
  },
  {
    id: crypto.randomUUID(),
    slug: "opus-thinking-stone",
    name: "Opus Thinking Stone",
    brand: "PonderRock",
    description: "A rock that thinks deeply about your problems. Takes hours. Costs more.",
    longDescription: `The Opus Thinking Stone by PonderRock represents the pinnacle of contemplative technology. Using Extended Reasoning Minerals™, this premium stone takes its time to really think about your questions before providing answers.

Why Pay $999 for a Rock?
• It thinks! (allegedly)
• Extended reasoning capabilities (it's slow on purpose)
• May take 4-8 hours to respond (deep thoughts require time)
• More expensive = smarter (that's how rocks work)
• Competitors' rocks answer quickly, but are they thorough? No.

Technical Specifications:
• Thinking Capacity: Up to 128k thinking tokens
• Response Time: 30 minutes to 8 hours (depends on mood)
• Model Architecture: RockTransformer-3.5-thinking-extended
• Reasoning Depth: Geological timescales
• Hallucination Rate: It's a rock, everything is a hallucination

Features:
• Extended Thinking Mode: Engages when you ask literally anything
• Visible Reasoning: LED pulses show deep thoughts happening
• Chain-of-Thought Indicator: Blinks faster when confused (constant)
• Cost Scaling: The longer it thinks, the more it costs you
• Thinking Tokens Display: Watch your money disappear in real-time

LED Status Indicators:
• Slow Pulse: Normal thinking (5-10 minutes)
• Medium Pulse: Extended thinking (30-60 minutes)
• Fast Pulse: Deep reasoning (2-4 hours)
• Rainbow Strobe: Contemplating existence (8+ hours)
• Red: Out of thinking tokens (pay more)

Sample Interactions:
You: "What's 2+2?"
Stone: *thinks for 47 minutes*
Stone: "After careful consideration of mathematical axioms and number theory, I believe the answer is approximately 4, though I should note several interesting edge cases..."

You: "Should I use TypeScript or JavaScript?"
Stone: *thinks for 6 hours*
Stone: "Let me think about your thinking about thinking about types..."

You: "Is this worth $999?"
Stone: *thinks for 3 days*
Stone: "Still processing... this is a complex philosophical question requiring deep reasoning about value, consciousness, and whether I'm just a regular rock with a circuit board glued to it..."

Comparison to Regular Rocks:
• Regular Rock: Free, instant responses (silence)
• Opus Thinking Stone: $999, delayed responses (also basically silence)
• Conclusion: Same output, premium experience

Subscription Tiers:
• Basic Thinking: $49/month (up to 10k thinking tokens)
• Extended Reasoning: $199/month (up to 100k thinking tokens)
• Opus Premium: $999/month (unlimited thinking, limited patience)

⚠️ Important Notes:
• Thinking time does not guarantee answer quality
• May still be thinking about your first question when you die
• Cannot actually think faster even if you shake it
• Not compatible with urgent decisions
• We are not responsible for:
  - Delayed project deadlines
  - Your boss asking what you're waiting for
  - Opportunity costs
  - Your realization that free ChatGPT is faster

Perfect for:
• People who confuse "slow" with "thorough"
• Developers who miss the Opus pricing model
• Anyone who thinks speed is overrated
• Justifying your rock collection to your partner
• Demonstrating that extended thinking is sometimes just... extended

Includes certificate of authenticity proving this is definitely not just a rock with a timer.

Remember: Fast answers are for the hasty. Wisdom takes time. And money. Mostly money.`,
    price: "999.99",
    originalPrice: null,
    images: ["/products/thinking-stone.png"],
    category: "Office",
    tags: ["ai", "thinking", "reasoning", "rock", "developer", "claude", "anthropic"],
    inStock: true,
    stockCount: 128,
    featured: true,
    rating: "3.3",
    reviewCount: 999,
  },
  {
    id: crypto.randomUUID(),
    slug: "git-blame-redirector",
    name: "Git Blame Redirector",
    brand: "NotMyFault",
    description: "Hardware device that reassigns your commits to random coworkers.",
    longDescription: `The Git Blame Redirector by NotMyFault is a revolutionary USB device that modifies your git history to make literally anyone else responsible for your code. Because sometimes the best debugging is plausible deniability.

How It Works:
• Plugs into your USB port
• Intercepts git commits before they're pushed
• Randomly reassigns authorship to other team members
• Generates convincing commit metadata
• Maintains plausible deniability through quantum uncertainty

Core Features:
• Automatic Blame Redistribution™
• Commit Author Randomizer (weighted toward senior devs)
• Timestamp Fuzzing (makes it look old, therefore not your problem)
• Email Spoofing (commits appear from colleagues' addresses)
• Git config override (changes your identity per commit)

Advanced Modes:
• Equal Distribution: Spreads your sins evenly across the team
• Senior Dev Mode: Only blames people with "Senior" in their title
• Intern Shield: Never blames interns (they have enough problems)
• Manager Targeting: Every commit is from your manager
• Chaos Mode: Including people who left the company 3 years ago

Smart Blame Algorithms:
• Bug Pattern Detection: Assigns bugs to people who aren't on vacation
• Critical Bugs: Blames whoever committed most recently (deflection)
• Weekend Commits: Attributes to the most workaholic coworker
• Production Hotfixes: Randomly selects from currently online teammates
• Refactoring: Credits to the person who wrote the original (ironic justice)

Integration Features:
• Slack Integration: Sends fake "pushed to main" notifications from others
• Jira Sync: Updates tickets with random assignees
• GitHub Copilot Spoofing: Makes it look like AI wrote your bugs
• Pair Programming Mode: Blames both people in the pair
• Code Review Bypass: Attributes blame to whoever approved the PR

Automatic Alibi Generator:
• Creates fake commit messages in colleagues' writing styles
• Generates believable excuses: "Quick fix", "Whoops", "WIP"
• Matches commit times to others' typical working hours
• Adds realistic typos in commit messages
• Occasionally adds: "Fixing [coworker]'s previous commit"

Safety Features:
• Never blames the CTO (career preservation)
• Avoids blaming people during their PTO (suspicious)
• Skips HR and legal team members (self-preservation)
• Blacklist functionality (protect your friends)
• Whitelist functionality (target your enemies)

⚠️ Legal Disclaimers:
• NotMyFault Corp is not responsible for:
  - Angry coworkers
  - HR investigations
  - Termination for fraud
  - Identity theft charges
  - Your deteriorating relationships
  - That one time you blamed the CEO
• Do not use on open source projects (public git history is public)
• Warranty void if detected
• Evidence may be used against you

Technical Specifications:
• Compatibility: Git, Mercurial, SVN (people still use SVN??)
• Memory: Stores up to 10,000 fake identities
• Processing Speed: Real-time blame redirection
• Stealth Mode: Undetectable unless someone actually reads git history (unlikely)

Common Use Cases:
• "This breaking change? Wasn't me."
• "Check git blame, clearly Dave's code."
• "I didn't write that hack, must have been during the merge."
• "Syntax error on line 47? That's definitely Sarah's style."
• "The security vulnerability? Been there since before I joined."

Includes:
• USB-C cable (for modern blame shifting)
• Coworker Database Template (50 fake identities included)
• "I was on vacation" calendar integration
• Emergency "revert to real history" panic button
• Legal defense fund contribution form

Remember: git history is immutable... unless you have the Git Blame Redirector!

Note: Does not actually work with protected branches, signed commits, or basic forensics. But by the time they figure it out, you'll have blamed someone else for buying this device.`,
    price: "249.99",
    originalPrice: "299.99",
    images: ["/products/git-blame.png"],
    category: "Electronics",
    tags: ["git", "version-control", "blame", "developer", "programming", "usb"],
    inStock: true,
    stockCount: 418,
    featured: false,
    rating: "4.8",
    reviewCount: 2718,
  },
  {
    id: crypto.randomUUID(),
    slug: "meeting-escape-band",
    name: "Meeting Escape Band",
    brand: "CalendarDodge",
    description: "Generates fake urgent calls during meetings. Freedom is one buzz away.",
    longDescription: `The Meeting Escape Band by CalendarDodge is the ultimate wearable for anyone who's ever been trapped in a meeting that could have been an email. With AI-generated emergency voices and calendar integration, freedom is just one staged interruption away.

Core Escape Technology:
• Syncs with your calendar
• Detects "boring meeting" patterns
• Generates convincing urgent phone calls
• Vibrates to simulate incoming call
• Plays realistic ringtones + emergency voices

AI Voice Generation:
• "Emergency! The production server is down!"
• "Your deployment failed and it's rolling back!"
• "We need you NOW - client escalation!"
• "The CEO wants to see you immediately!"
• "Something's on fire!" (ambiguous - could be code or literal)
• "Your pull request broke main!"

Smart Meeting Detection:
• Identifies safe meetings vs. escape-worthy meetings
• Keywords: "sync", "circle back", "touch base", "quick chat" → trigger escape
• Analyzes meeting duration (>30 mins = high escape priority)
• Tracks speaker ratio (someone monologuing? Time to bail)
• Detects "let's take this offline" moments (ironically, helps you go offline)

Calendar Integration Features:
• Pre-schedules escapes for recurring meetings
• Learns which meetings you always want to escape
• "Oops I have a conflict" automated responses
• Automatically declines meeting invites with vague technical excuses
• Reschedules your fake emergency to overlap with boring standups

Escape Scenarios:
• DevOps Disaster: "The Kubernetes cluster is in CrashLoopBackOff!"
• Database Emergency: "The replica lag is at 4 hours!"
• Security Alert: "We're getting DDoS'd!"
• Client Crisis: "They're threatening to churn!"
• Personal Emergency: "Forgot to pick up kids" (works every time)
• Technical Debt Fire: "The legacy system... it's becoming sentient"

Advanced Modes:
• Gradual Escape: Fake call in 5 minutes (lets you finish your point)
• Nuclear Option: Immediate escape (CEO voice, maximum urgency)
• Polite Departure: "Sorry, I need to take this" pre-recorded excuse
• Team Solidarity: Can trigger escapes for multiple band wearers simultaneously
• Meeting Shield: Blocks new meeting invites during your "emergency"

Customization:
• Record your own emergency voices
• Set "never interrupt" contacts (actual important meetings)
• Escape cooldown timer (can't escape every meeting)
• Urgency levels: Minor issue → P0 Production Outage
• Voice options: Panicked coworker, calm manager, angry client

Stealth Features:
• Vibration patterns mimic real phone calls
• Screen lights up with fake caller ID
• Can play audio through phone speakers for maximum authenticity
• "Hang up" gesture to end fake call
• Fake text message mode (for when calls are too dramatic)

Analytics Dashboard:
• Meetings escaped: 47 this month
• Time saved: 23.5 hours
• Most used excuse: "Production incident"
• Success rate: 94% (your manager is catching on)
• Guilt level: Surprisingly low

⚠️ Warning Signs You're Overusing:
• Coworkers ask "How is your infrastructure always down?"
• You've had 6 "emergencies" in one day
• Manager suggests "reliability improvements"
• IT wants to audit your systems
• Someone asks "How do you even have time for emergencies during meetings?"

Not Recommended For:
• Performance reviews
• One-on-ones with your boss
• Client demos (unless you really want out)
• All-hands meetings (too many witnesses)
• Meetings you scheduled yourself (suspicious)

Technical Specs:
• Battery Life: 2 weeks (approx. 94 escapes)
• Waterproof: Yes (for stress sweat)
• Bluetooth Range: 30 feet (works from conference room)
• Voice Database: 200+ emergency scenarios
• Compatibility: Works with Google Calendar, Outlook, iCal, and your sense of dread

Includes:
• Meeting Escape Band
• USB-C charging cable
• Quick start guide: "How to Look Concerned While Escaping"
• Backup excuses card
• Therapy referral (for the meeting PTSD)

⚠️ Legal Disclaimer:
CalendarDodge is not responsible for:
• Trust issues with your team
• Being labeled "unreliable"
• Actual emergencies happening during fake ones
• Your manager reading this product description
• The existential realization that you're spending more time avoiding meetings than you would spend in meetings

Remember: Every meeting escaped is time you could spend... well, doing actual work. Or escaping other meetings.

"But wait, can't I just decline meetings?"
*Activate escape protocol*
"Sorry, production emergency, gotta go!"`,
    price: "179.99",
    originalPrice: "199.99",
    images: ["/products/meeting-escape.png"],
    category: "Wearables",
    tags: ["meetings", "calendar", "productivity", "escape", "developer", "wearable", "corporate"],
    inStock: true,
    stockCount: 867,
    featured: true,
    rating: "4.9",
    reviewCount: 5309,
  },
  {
    id: crypto.randomUUID(),
    slug: "stack-overflow-candle",
    name: "Stack Overflow Candle",
    brand: "CopiedCode",
    description: "Smells like deprecated answers. Notes of jQuery and 2015 best practices.",
    longDescription: `The Stack Overflow Candle by CopiedCode captures the essence of copy-paste programming culture. This artisanal 12oz soy candle fills your workspace with the nostalgic aroma of solutions that worked 8 years ago.

Scent Profile:
• Top Notes: Fresh jQuery, dusty Angular.js documentation
• Heart Notes: Accepted answers from 2012, IE6 compatibility hacks
• Base Notes: Closed as duplicate, "Edit: This no longer works"

Inspired by Real Stack Overflow Experiences:
• That moment when you find a highly-upvoted answer
• The realization it's from 2010
• Trying it anyway
• It works (somehow)
• Not understanding why it works
• Shipping it to production

Scent Development Process:
Curated from thousands of Stack Overflow threads:
• "How do I center a div?" (300 different answers, all contradictory)
• "JavaScript is weird" (existential undertones)
• Solutions using libraries that no longer exist
• Snippets marked with ⚠️ This is deprecated
• "Works for me!" comments (it doesn't work for anyone)

Burn Notes (What You'll Smell):
• Opening: Excitement of finding the exact question you have
• Development: Hope as you read the answer
• Middle: Slight concern when you see the date
• Late Middle: Desperation as you try to adapt it to modern syntax
• Dry Down: Acceptance that you'll need to refactor
• Finish: The sweet smell of "closed as duplicate of [link that's also outdated]"

Specific Aromatic Highlights:
• Hints of XMLHttpRequest (pre-fetch API era)
• Undertones of var declarations (before let and const)
• Subtle notes of callback hell (pre-async/await)
• Whispers of Flash plugins
• Essence of "Use jQuery" as the answer to everything
• Traces of PHP magic quotes
• Faint aroma of MySQL instead of MySQLi
• Bouquet of Bootstrap 2.x

Candle Characteristics:
• Burn Time: 45-50 hours (enough time to read 200 SO threads)
• Wax: Premium soy blend (more organic than your code)
• Wick: Cotton (single-threaded, like JavaScript)
• Container: Glass jar with orange/yellow gradient (Stack Overflow colors)
• Label: Features authentic "answered 12 years ago" timestamp

Perfect For:
• Developers who learned everything from Stack Overflow
• Nostalgic code sessions
• Rubber duck debugging ambiance
• Masking the smell of your burning production server
• Remembering simpler times (when problems had answers)
• Meditation on the ephemeral nature of tech solutions

Lighting Occasions:
• When you're about to copy code you don't understand
• During late-night debugging sessions
• While reading the dreaded "This question already has answers here"
• Moments of Stack Overflow rabbit hole descents
• When the accepted answer has 50 upvotes but doesn't work
• Anytime someone suggests "Have you tried Stack Overflow?"

Warning Labels on Jar:
• "May cause flashbacks to deprecated APIs"
• "Scent may invoke memories of tech debt"
• "Not responsible for sudden urges to refactor legacy code"
• "May smell different in different browsers"
• "Works on my candle"
• "Closed as not a candle question"

Includes Gift Card Message Options:
• "Here's to solutions that worked in 2015"
• "May your code work as reliably as Stack Overflow answers"
• "Burn this while copying code you don't understand"
• "For the developer who Googles everything"
• "Stack Overflow: The real senior developer"

Collection Series:
This candle is part of the "Copy-Paste Culture" collection:
• Stack Overflow Candle (this one)
• GitHub Issues Incense (smells like open PRs)
• Documentation Diffuser (barely detectable)
• npm Audit Warning Wax Melts (overwhelming anxiety scent)

⚠️ Candle Safety:
• Never leave unattended (like your Stack Overflow tabs)
• Keep away from flammable materials (like your server logs)
• Burn in well-ventilated area (for the memories)
• Stop use if you start seeing jQuery in modern React apps
• Not edible (despite tasting better than some code you've written)

Fun Facts:
• Infused with actual Stack Overflow thread URLs (in invisible ink)
• Each candle contains exactly 42 scent molecules (the answer to everything)
• Burning this candle counts as "research" (probably)
• May improve code quality by 0.001% through aromatherapy
• Jon Skeet approves (citation needed)

Testimonials:
⭐⭐⭐⭐⭐ "Smells like my entire career" - Anonymous Dev
⭐⭐⭐⭐⭐ "Finally, a candle that understands me" - Senior Copy-Paste Engineer
⭐⭐⭐⭐⭐ "Reminds me of when things were simpler (they weren't)" - JavaScript Developer
⭐ "Answered my question and then closed it as off-topic" - Confused User
⭐⭐⭐⭐⭐ "Tried to edit the scent, was rejected for not having enough reputation" - Helpful Community Member

Made from 100% recycled Stack Overflow answers. No answers were harmed in the making of this candle (they were already deprecated).

Remember: This candle, like Stack Overflow answers, works perfectly in theory. Results may vary in production.`,
    price: "34.99",
    originalPrice: null,
    images: ["/products/stackoverflow-candle.png"],
    category: "Office",
    tags: ["candle", "stack-overflow", "programming", "developer", "scented", "humor", "office"],
    inStock: true,
    stockCount: 2048,
    featured: false,
    rating: "4.7",
    reviewCount: 1515,
  },
  // NEW PRODUCTS - Multi-Agent Product Launch Demo
  {
    id: crypto.randomUUID(),
    slug: "agi-promise-box",
    name: "AGI Promise Box",
    brand: "SixMonthsAway Labs",
    description: "A sleek monolith displaying 'AGI Coming Soon™' with a countdown that never reaches zero.",
    longDescription: `Introducing the AGI Promise Box—the world's first consumer-grade device that captures the eternal optimism of artificial general intelligence predictions. This minimalist black monolith sits elegantly on your desk, displaying a countdown timer that perpetually shows "AGI Arriving In: 6 Months" and never, ever reaches zero.

🕰️ The Perpetual Promise Algorithm™
Our proprietary software uses advanced temporal manipulation to ensure the countdown stays exactly 6 months away, no matter how much time passes. Some call it a bug. We call it a feature. It's been 6 months away since 2015, and our device faithfully maintains this tradition.

How It Works:
• Every day at midnight, the timer automatically adds 24 hours
• Monthly "optimism recalibration" resets to exactly 6 months
• Built-in excuse generator explains why this time is different
• Inspired by real predictions from industry leaders (who shall remain nameless but you know exactly who we mean)

✨ Features:

Mood Lighting System:
• Blue Pulse: "We're making great progress!"
• Green Glow: "Breakthrough any day now"
• Amber Wave: "Just solving alignment, NBD"
• Red Flash: "Scaling laws go brrr"
• Rainbow Mode: "Sam said so on Twitter"

Audio Affirmations (Premium Edition):
• "AGI will change everything... soon"
• "The next model will definitely be it"
• "We just need a bit more compute"
• "Emergent capabilities are emerging... eventually"
• "Trust the process"
• Random Ilya Sutskever quotes
• Yann LeCun disagreement sounds (for balance)

Display Modes:
• Standard: "AGI: 6 months away"
• Hype Mode: "AGI: 6 months away (for real this time)"
• Investor Mode: "AGI: Imminent (please fund us)"
• Doomer Mode: "AGI: 6 months... until it's too late"
• Accelerationist Mode: "AGI: Not soon enough"
• Pause AI Mode: Countdown runs backwards (still never reaches zero)

📊 Technical Specifications:
• Countdown Accuracy: ±∞ months
• Prediction Confidence: 100% (confidence, not accuracy)
• Hope Regeneration Rate: Infinite
• Reality Check Module: Disabled by default
• Hype Integration: Connected to Twitter/X firehose
• Display: E-ink (for that premium "this is serious technology" look)
• Materials: Matte black aluminum (2001: A Space Odyssey aesthetic)
• Dimensions: Small enough to fit your desk, large enough to fit your dreams

📦 What's In The Box:
• 1x AGI Promise Box (the monolith)
• 1x USB-C charging cable (even promises need power)
• 1x Certificate of Future Intelligence (pre-signed by GPT-5, whenever it exists)
• 1x "I Believed" bumper sticker
• 1x Timeline of every failed AGI prediction since 1956 (100 pages)
• 1x Hopium™ air freshener (smells like funding rounds)

🗣️ Testimonials From Beta Testers:

"I've been staring at this thing for 3 years. The countdown still says 6 months. I've never felt more seen." — Early Adopter, Y Combinator

"Replaces my need to refresh Twitter for AI doomer discourse. Now I just look at the box." — Anonymous Researcher

"It's been 6 months away since I bought it 6 months ago. The math doesn't check out but neither does anything in AI anymore." — Confused Investor

"I showed this to my therapist. She now has one too." — Accelerationist in Recovery

"Finally, a physical manifestation of my relationship with AI hype. The countdown matches my dating life—always almost there." — Lonely Founder

⚠️ Important Disclaimers:
• AGI Promise Box does not actually predict AGI
• AGI Promise Box does not contain AGI
• AGI Promise Box is not aware of AGI
• AGI Promise Box cannot be held responsible for:
  - Your investment decisions based on AI hype
  - Arguments at Thanksgiving about the singularity
  - Existential crises triggered by waiting
  - The actual arrival of AGI (we're as surprised as you'll be)
  - Your VCs asking about your AI roadmap
• No refunds once the countdown starts (it never stops)

🎁 Gift Ideas:
Perfect for:
• AI researchers who need perspective
• VCs who keep asking "but when AGI?"
• That friend who won't stop talking about scaling laws
• Philosophy majors debating consciousness
• Anyone who's read "Superintelligence" and hasn't slept since
• People who think GPT-4 is close enough
• People who think GPT-4 is nowhere near close

Available Variants:
• Classic ($999.99) - Just the countdown
• Executive ($1,499.99) - Includes Anthropic and OpenAI funding round alerts
• Doomer Bundle ($2,499.99) - Countdown plus separate "Time Until AI Doom" display (also 6 months)
• Effective Altruist Edition ($9,999.99) - Same device, but expensive enough to signal you care

Return Policy:
Full refund available when AGI arrives. We're confident in this policy.

FAQ:
Q: Will the countdown ever reach zero?
A: lol

Q: What happens when AGI actually arrives?
A: The device is programmed to display "See? Told you!" followed by immediate obsolescence

Q: Is this a commentary on AI hype cycles?
A: It's a consumer electronics product that helps you manage expectations

Q: Can I invest in your company?
A: The AGI Promise Box says our valuation will 10x... in 6 months

Remember: The future is always just around the corner. The AGI Promise Box ensures you never forget just how close it always is.

"Hope Springs Eternal. AGI Arrives Eventually. Maybe. We're Not Sure. Check Back In 6 Months."™`,
    price: "999.99",
    originalPrice: "1299.99",
    images: [
      "/products/agi-box-hero.png",
      "/products/agi-box-gpt.png",
      "/products/agi-promise-box.png",
      "/products/agi-box-alt.png",
      "/products/agi-box-packaging.png",
    ],
    videos: [
      "/videos/agi-promise-box-reveal.mp4",
      "/videos/agi-promise-box-lifestyle.mp4",
    ],
    category: "Electronics",
    tags: ["ai", "agi", "countdown", "satire", "hype", "tech", "developer"],
    inStock: true,
    stockCount: 6,
    featured: true,
    rating: "5.0",
    reviewCount: 0,
  },
  {
    id: crypto.randomUUID(),
    slug: "vibe-coder-energy",
    name: "Vibe Coder Energy Drink",
    brand: "ShipIt Beverages",
    description: "Fuel for the no-code movement. Code by vibes, not logic. Ship first, debug never.",
    longDescription: `Vibe Coder Energy is the official beverage of developers who code with their heart, not their brain. Formulated specifically for the "it works on my machine" development philosophy, this neon-colored energy drink bypasses your logical thinking centers and goes straight to your confidence glands.

🧪 The Formula:

Each 16oz can contains:
• 500mg of Dunning-Kruger Caffeine™
• Artificial confidence sweeteners
• Zero debugging compounds
• 200% daily value of "ship it" mentality
• Traces of imposter syndrome suppressants
• Natural vibe enhancers (don't ask)
• Code review resistance factors

⚡ Flavors Available:

Ship It Cherry (Red Can):
"Deploy first, apologize later"
• Tastes like pushing to main on Friday
• Notes of merge conflict resolution
• Finish: "We'll fix it in prod"
• Recommended for: 11pm deployments

LGTM Lime (Green Can):
"Looks good to me, didn't read the code"
• Crisp taste of auto-approved PRs
• Undertones of rubber-stamp reviews
• Finish: "LGTM 🚀"
• Recommended for: Speed-running code reviews

Merge Conflict Mango (Orange Can):
"HEAD >>> YOURS"
• Tropical chaos in a can
• Notes of git stash gone wrong
• Finish: "I'll just accept both changes"
• Recommended for: When you've been rebasing for 3 hours

NEW FLAVORS (Limited Edition):

Undefined Berry Blast (Purple Can):
• Tastes different every time you drink it
• Flavor type: undefined
• Pairs well with: loose equality comparisons

NaN-ana (Yellow Can):
• Not actually a number, but definitely a banana
• NaN === NaN returns false, but NaN flavor === delicious
• For developers who don't understand why NaN !== NaN

Callback Hell Cola (Black Can):
• Contains nested flavor callbacks up to 15 levels deep
• Get lost in the delicious asynchronous taste
• May or may not resolve (flavor is a Promise)

📊 Nutritional Facts (Per Can):

Vibes: 9000%
Logic: 0g
Debugging Calories: 0
Confidence: OVER 9000
Sleep Tonight: No
Comments in Code Tomorrow: Also No
Tests Written: What tests?
Documentation: lmao

💪 Effects:

Within 10 Minutes:
• Sudden urge to start a new project
• Previous project abandoned
• npm init executed

Within 30 Minutes:
• Confident you can build Twitter in a weekend
• Installing 847 npm packages
• "I'll add tests later"

Within 1 Hour:
• Full stack developer energy
• "10x developer" mindset activated
• Considering cryptocurrency integration

Within 2 Hours:
• Production deployment initiated
• Zero tests run
• "YOLO" as commit message

Next Morning:
• 47 Slack messages from on-call
• "Why did you deploy at 2am?"
• Vibe Coder Energy: worth it

🏆 Testimonials:

"I shipped 47 features last week. None of them work but the PM is thrilled." — 10x Vibe Developer

"Ever since I started drinking this, I've stopped writing tests entirely. My velocity is through the roof!" — Former QA Engineer (emphasis on former)

"I drank three cans and deployed our machine learning model. It's just if/else statements but investors don't know that." — AI Startup Founder

"My code doesn't compile but my confidence does." — Vibe Coder Energy Enthusiast

"I used to spend hours debugging. Now I just refresh until it works." — Senior Vibe Engineer

⚠️ Warning Labels:

GOVERNMENT WARNING:
• (1) Do not operate production systems while under the influence of Vibe Coder Energy
• (2) May cause overconfidence in code you don't understand
• (3) Side effects include: spontaneous npm publishing, midnight deploys, and calling yourself a "full stack developer" after one React tutorial
• (4) Not a substitute for actual programming knowledge

Additional Warnings:
• May contain trace amounts of hope
• Not FDA approved (they don't understand vibes)
• Code written under influence may not survive peer review
• If your build fails for more than 4 hours, consult a senior developer
• Keep away from production environments (but you won't)
• This product does not teach you to code (but it makes you feel like it does)
• ShipIt Beverages is not responsible for:
  - Spaghetti code
  - Technical debt
  - That one regex you wrote at 3am
  - Your startup's failure
  - The senior dev's disappointment

📦 Available In:
• Single Can ($3.99) - "I'm just trying it"
• 4-Pack ($12.99) - "This is my new thing"
• 12-Pack ($29.99) - "I have a problem and I love it"
• 24-Pack ($49.99) - "Sleep is deprecated"
• Subscribe & Ship ($39.99/month) - Auto-deploys to your door
• Enterprise License (Contact Sales) - For companies that want to institutionalize vibes

🎁 Bundle Deals:
• Vibe Coder Starter Kit: 4 cans + rubber duck + "Works on My Machine" certificate
• All-Nighter Bundle: 12 cans + eye drops + excuses for tomorrow's standup
• Founder Special: 24 cans + investor pitch deck template + therapist referral

Perfect Pairing:
• Best served cold during hot deploys
• Pairs well with: Stack Overflow, copied code, and overconfidence
• Do not mix with: unit tests, code reviews, or thinking

Slogan Options (we couldn't decide):
• "Vibe Coder: Ship First, Debug Never™"
• "Vibe Coder: Because Tests Are Just Suggestions™"
• "Vibe Coder: Code Like No One's Reviewing™"
• "Vibe Coder: Turn Your Anxiety Into Velocity™"

Remember: Every great product was shipped by someone who had no idea what they were doing. Vibe Coder Energy just helps you do it faster and with more confidence.

Caffeine Content: 500mg (the vibes are free)
Return Policy: No refunds, only pivots`,
    price: "12.99",
    originalPrice: null,
    images: [
      "/products/vibe-coder-ascension-final.png",
      "/products/vibe-coder-energy.png",
      "/products/vibe-coder-extreme.png",
      "/products/vibe-coder-ascension.png",
      "/products/vibe-coder-bing.png",
    ],
    videos: [
      "/videos/vibe-coder-hallucination.mp4",
    ],
    category: "Food & Drink",
    tags: ["energy-drink", "developer", "coding", "vibes", "satire", "beverage"],
    inStock: true,
    stockCount: 420,
    featured: true,
    rating: "4.8",
    reviewCount: 1337,
  },
  {
    id: crypto.randomUUID(),
    slug: "prompt-engineering-phd",
    name: "Prompt Engineering PhD Certificate",
    brand: "Stanford Institute of AI Whispering",
    description: "An ornate diploma certifying your expertise in 'asking AI things nicely.' Now you're official.",
    longDescription: `Congratulations, future Doctor of Prompt Engineering! The Stanford Institute of AI Whispering (not affiliated with Stanford University, or any university, or education generally) is proud to offer this premium, frameable diploma certifying your mastery of the art and science of typing words into a chat box.

🎓 About the Degree:

After years of rigorous... browsing Twitter threads and watching YouTube tutorials, you've earned this recognition. The Prompt Engineering PhD Certificate legitimizes what you've known all along: asking AI nicely IS a skill, and now you have the documentation to prove it.

Certificate Features:
• Genuine faux-parchment paper (very collegiate feeling)
• Embossed gold foil seal (the "AI Brain" crest)
• Latin phrases that definitely mean something important
• Your name in elegant calligraphy (you write it in yourself)
• QR code linking to ChatGPT (for verification)
• Official-looking signatures from Dean of Prompts and President of Tokens
• "Summa Cum Query" honors designation
• Suitable for framing, LinkedIn, and job applications

🏛️ Official Latin Text on Certificate:

"Promptus Maximus" (Great Prompting)
"In Contextu Fenestra Credimus" (In Context Window We Trust)
"Nulla Hallucinio" (No Hallucinations - aspirational)
"Veni, Vidi, Prompting" (I Came, I Saw, I Prompted)

📚 The Curriculum You Definitely Completed:

Year 1 - Foundations of Asking Things:

PROMPT 101: Introduction to Typing Words
Prerequisites: Keyboard, fingers (most of them)
• Week 1-4: The Enter key: Friend or Foe?
• Week 5-8: "Please" and "Thank you" - Do AIs Care?
• Week 9-12: The Art of the Follow-up Question
• Final Exam: Ask ChatGPT to write an email

PROMPT 102: Intermediate Token Management
• Understanding why your prompt got cut off mid-sent
• The economics of verbosity vs. clarity
• Lab: Calculating how much you're paying per word

PROMPT 150: History of Human-AI Communication
• From ELIZA to Clippy: A Love Story
• The Great "As an AI language model" Era
• Case Study: That one time someone jailbroke GPT-4

Year 2 - Advanced Prompt Theory:

PROMPT 201: System Prompts and You
• Roleplay scenarios that definitely aren't weird
• "You are an expert in..." The lie we all tell
• Ethics: Is making the AI pretend to be a pirate okay?

PROMPT 210: Prompt Injection Defense (LOL)
• Why nothing works
• But seriously, nothing works
• Let's try anyway
• Lab: Watch your safeguards fail in real-time

PROMPT 245: Chain of Thought: Making AI Show Its Work
• "Let's think step by step" and other magic words
• Why AI suddenly became better at math (it didn't)
• Advanced: Making it explain wrong answers confidently

Year 3 - Specializations:

PROMPT 301: Adversarial Prompting
• Jailbreaking 101: DAN, STAN, and other personas
• The "Grandma Loophole"
• Getting AI to do what it said it wouldn't
• Ethics Seminar: Should you feel bad? (Only briefly)

PROMPT 315: Multi-Modal Prompt Engineering
• Describing images to a model that can see images
• "Look at this screenshot" - A meditation
• When to use words vs. when to give up

PROMPT 330: Enterprise Prompt Engineering
• Writing prompts that justify your $200k salary
• Making "LLM integration" sound innovative
• Prompt versioning in Git (yes, really)
• Case Study: The $100k prompt consultant

Year 4 - Dissertation:

PROMPT 401: Dissertation Defense
• Topic: "Please help me write my dissertation"
• Format: Ask GPT-4 to do it
• Defense: Ask GPT-4 to defend it
• Grade: Whatever the AI says
• Appeal Process: Ask again with better prompting

🏆 Notable Alumni (Fictional):

• Dr. Context Window, class of '23 - Invented the "let's think step by step" addendum
• Dr. Jailbreak Jones, class of '22 - Discovered the grandmother vulnerability
• Dr. Token Counter, class of '24 - Optimized the word-to-output ratio
• Esteemed Professor "Please Summarize This" - Teaches PROMPT 101

🎁 Certificate Package Includes:

Basic Package ($149.99):
• 1x Ornate PhD Certificate
• 1x "Dr." Prefix license (self-issued)
• 1x LinkedIn headline update guide
• 1x Frame (assembly required, like your AI projects)

Premium Package ($249.99):
• Everything in Basic, plus:
• 1x Velvet diploma holder
• 1x Alumni bumper sticker
• 1x "I prompt-engineered and all I got was this certificate" t-shirt
• 1x Letter of recommendation (AI-generated)

Tenured Package ($499.99):
• Everything in Premium, plus:
• 1x Professor robes (for Zoom calls)
• 1x Honorary position at Stanford Institute of AI Whispering
• 1x Ability to issue certificates to others
• Unlimited "well, actually" rights in AI discussions

⚠️ Important Disclaimers:

• This certificate is not recognized by any accrediting body
• "Stanford Institute of AI Whispering" is not Stanford University
• Having this PhD does not qualify you to perform surgery, law, or real engineering
• Your parents will still be confused about what you do
• May not impress at parties (or may, depending on the party)
• Not valid for academic citations
• Does not come with student debt (that's the upside!)
• Cannot be revoked even if AI makes prompt engineering obsolete tomorrow

Career Prospects (Real Talk):
• Prompt Engineer at startups ($150k-$300k, briefly, until they realize)
• AI Whisperer at corporations (until automation)
• Freelance prompt consultant (actually viable for now)
• Twitter thought leader (no credentials needed anyway)
• Writing "10 Prompt Engineering Tips" threads (peak career)

💬 Testimonials:

"I put 'PhD in Prompt Engineering' on my LinkedIn and my connection requests tripled. All from recruiters asking about this 'Stanford' I attended." — Dr. Definitely Real

"My mom finally stopped asking when I'm getting a real degree. She just asks about the 'robot typing' now." — Dr. Family Acceptance

"I was passed over for promotion until I showed them my Prompt Engineering PhD. They promoted me to 'AI Lead.' Still don't know what I'm doing." — Dr. Fake It Til

"I framed it next to my other online certifications. It's the most impressive one because it has Latin." — Dr. Wall Decoration

Return Policy:
Degrees are forever. No refunds, just like real universities, except this is way cheaper.

Order Now and Receive:
• Immediate PDF download for instant gratification
• Physical certificate ships in 5-7 business days
• Regret ships immediately
• Imposter syndrome sold separately (who are we kidding, you already have it)

"In Token Veritas" — Stanford Institute of AI Whispering, Est. 2024™`,
    price: "149.99",
    originalPrice: "199.99",
    images: [
      "/products/phd-graduation.png",
      "/products/prompt-phd.png",
      "/products/phd-graduation-alt.png",
      "/products/prompt-phd-bing.png",
    ],
    category: "Education",
    tags: ["certificate", "prompt-engineering", "ai", "satire", "education", "developer"],
    inStock: true,
    stockCount: 9999,
    featured: true,
    rating: "4.9",
    reviewCount: 2847,
  },
  {
    id: crypto.randomUUID(),
    slug: "hallucination-glasses",
    name: "The Hallucination Glasses",
    brand: "ConfidentlyWrong Tech",
    description: "AR glasses that overlay fake information on everything you see. Experience AI hallucinations IRL!",
    longDescription: `Ever wondered what it's like to be a large language model? The Hallucination Glasses by ConfidentlyWrong Tech let you experience AI hallucinations in the real world! Using advanced Augmented Unreality™ technology, these sleek AR glasses overlay plausible-sounding-but-completely-wrong information on everything you see.

🔮 The Vision (or Lack Thereof):

The Hallucination Glasses use proprietary WrongButConfident™ AI to generate false information at 60 frames per second. See the world not as it is, but as a poorly-trained neural network might describe it—with complete confidence and zero accuracy.

Core Technology:
• Neural Nonsense Processing Unit (NNPU)
• Fact Scrambling Engine
• Confidence Calibration (always set to maximum)
• Citation Generator (100% fabricated)
• Real-time Hallucination Synthesis
• Plausibility Optimizer (makes wrong things seem right)

🕶️ What You'll See:

Names and Faces:
• Your coworkers now have different names (sounds plausible!)
• Your boss is labeled "CEO of Bitcoin"
• Strangers get detailed but fictional backstories
• Everyone's age is wrong by exactly 7 years
• Pets have human names and imaginary careers

Text Transformation:
• Street signs display wrong but confident directions
• Menus show dishes that don't exist
• Prices are in currencies from the wrong country
• Book titles are slightly wrong ("To Kill a Hummingbird")
• Emails gain sentences you definitely didn't write

Objects and Places:
• Coffee mugs labeled as "invented in 1847 by Gerald Coffee"
• Your car's make and model are confidently incorrect
• Buildings have plaques with fake historical facts
• Plants are identified as species that don't exist
• Your lunch has extremely specific but wrong calorie counts

Time and Math:
• Clocks show impossible times (25:63)
• Calendars display months that don't exist (Octembruary)
• Prices calculated incorrectly but displayed confidently
• Your age fluctuates depending on viewing angle
• Countdowns to events that never happen

📊 Technical Specifications:

Hallucination Rate: 95% (5% accidental accuracy)
Confidence Display: Always 100%
Reality Anchor Strength: 0.0
Fabrication Accuracy: Maximum
Response Latency: Instant wrongness
Plausibility Score: Concerningly high
Citation Accuracy: Completely fabricated
Battery Life: 8 hours of unreality
Display: Transparent OLED with wrongness overlay
Weight: 45g (or 2.7 metric falsies)
Connectivity: WiFi, Bluetooth, connection to alternative facts

💫 Hallucination Modes:

Academic Mode:
• All facts come with fake citations
• "[Source: Journal of Made Up Things, 2019]"
• Every claim references a non-existent study
• Statistical claims are specific but invented
• Great for understanding how AI "researches"

Wikipedia Mode:
• Everything has [citation needed] tags
• Edit war simulations
• Vandalism detection (adds MORE false info)
• "This article may contain claims made by AI"

Confident Wrong Mode (Default):
• Maximum confidence, minimum accuracy
• No hedging, no uncertainty
• "This is definitely true" for definitely false things
• Experience peak AI energy

Gaslighting Mode (Premium):
• Glasses insist you're remembering wrong
• "That sign always said that"
• "Your coworker has always been named Bartholomew"
• Slowly changes reality over time

Historical Mode:
• All objects gain fake but detailed histories
• "This chair was owned by Abraham Lincoln's dentist"
• Every location has a "little-known fact"
• Dates are always slightly wrong

🎯 Use Cases:

For Developers:
• Understand what your users experience with AI
• Empathy training for AI product teams
• Debug by experiencing the bug yourself
• "Oh, THAT'S what hallucination feels like"

For Researchers:
• Study information trust in visual format
• Understand the danger of confident misinformation
• Generate paper ideas (warning: will be hallucinated)
• Publish papers about the glasses (citations may not exist)

For Fun:
• Party trick: identify wrong facts
• Game: spot the hallucination
• Prank: tell friends what their "AR glasses" show
• Meditation: contemplate the nature of truth

For Philosophical Crisis:
• Question all information
• Wonder if everything is hallucinated
• Embrace uncertainty
• Schedule therapy (we provide referrals)

⚠️ Warning Labels:

SURGEON GENERAL'S WARNING:
• Do not wear while driving
• Do not wear while making important decisions
• Do not wear while voting
• Do not wear while navigating
• Actually, maybe don't wear these at all
• ConfidentlyWrong Tech is not responsible for you believing the hallucinations

Additional Warnings:
• May cause existential crises
• May improve skepticism (accidentally helpful)
• May make you question all information (healthy?)
• Side effects include: paranoia, fact-checking addiction, philosophy degree regret
• Do not combine with actual LLM outputs (double hallucination)
• Keep away from important documents
• Not suitable for medical, legal, or financial decisions
• Then again, maybe don't use AI for those either

🛡️ Comparison to Competitor Hallucinations:

| Feature | Our Glasses | ChatGPT | Gemini | Llama |
|---------|-------------|---------|--------|-------|
| Confidence | 100% | 100% | 95% | 100% |
| Accuracy | 5% | Higher | Higher | Higher |
| Visuals | Full AR | Text only | Text only | Text only |
| Wearability | Yes | No | No | No |
| Fun at parties | Very | No | No | No |

We proudly hallucinate harder than leading AI models!

📦 Package Contents:

Standard Edition ($299.99):
• 1x Hallucination Glasses
• 1x Charging case (labeled "definitely a charger")
• 1x Quick start guide (may contain errors)
• 1x "Nothing is real" sticker
• 1x Warranty card (terms hallucinated)

Reality Anchor Bundle ($399.99):
• Everything in Standard, plus:
• 1x "Actually true" fact card (verified by humans)
• 1x Guide to spotting hallucinations in the wild
• 1x Apology letter template for when you believe them
• 1x Therapist recommendation

Enterprise Edition ($999.99):
• 5x Hallucination Glasses
• Team hallucination sync (see the same wrong things!)
• Admin panel to control hallucination severity
• Compliance documentation (also hallucinated)
• Priority support (responses may be wrong but fast)

💬 Testimonials:

"I wore these to my performance review. According to the glasses, I'm the CEO now. HR was confused when I tried to give myself a raise." — Dr. Misidentified

"Perfect for understanding my ML model's behavior. Now I feel its pain. We're bonding." — ML Engineer

"I thought my wife's name was Margaret for three hours. We've been married for 12 years. Her name is Sarah. These glasses are too powerful." — Regretful Husband

"Finally, I can experience what it's like to be confidently wrong about everything without any consequences! Wait, there are consequences." — Philosophy Major

"I looked at my bank account through these. According to the glasses, I'm a billionaire. The dopamine hit was worth the eventual disappointment." — Temporarily Happy User

Return Policy:
Full refund if you can prove anything is real (you can't).

Legal Notice:
ConfidentlyWrong Tech makes no claims about the accuracy of anything, including this product description. The claims in this description may themselves be hallucinated. Meta-hallucination is a feature.

FAQ:

Q: Are these actually AR glasses?
A: Confidently, yes.

Q: Do they really show fake information?
A: The glasses say "definitely."

Q: Is this product real?
A: According to the glasses, absolutely. According to reality, we'll never tell.

Q: Should I trust anything I see with these?
A: Should you trust anything you see from AI? We're making a point here.

"See The World Through Confidently Wrong Eyes."™

Battery not included. Reality not included. Truth not included. Existential dread included free.`,
    price: "299.99",
    originalPrice: "349.99",
    images: [
      "/products/hallucination-glasses.png",
      "/products/hallucination-glasses-gpt.png",
      "/products/hallucination-glasses-bing.png",
    ],
    category: "Wearables",
    tags: ["ar", "glasses", "ai", "hallucinations", "satire", "wearable", "tech"],
    inStock: true,
    stockCount: 404,
    featured: true,
    rating: "4.2",
    reviewCount: 1984,
  },
];

async function seed() {
  console.log("🌱 Seeding database with silly products...\n");

  try {
    // Clear existing products
    await db.delete(products);
    console.log("🗑️  Cleared existing products");

    // Insert all products
    await db.insert(products).values(sillyProducts);
    console.log(`✅ Inserted ${sillyProducts.length} products`);

    console.log("\n🎉 Seeding complete!");
    console.log("\nProducts seeded:");
    sillyProducts.forEach((p) => {
      console.log(`  • ${p.name} (${p.brand}) - $${p.price}`);
    });
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
