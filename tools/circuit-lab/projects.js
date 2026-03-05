// Guided Projects for the Circuit Lab
// Each project has wiring instructions, explanations, and expected behavior
window.CircuitProjects = [
  {
    id: 1,
    name: "Light It Up",
    difficulty: "Beginner",
    icon: "1",
    description: "Make your first LED glow! Learn the basics of a complete circuit.",
    parts: ["9V Battery", "470\u03A9 Resistor", "Red LED"],
    steps: [
      { from: "bat+", to: "r470-a", text: "Connect Battery (+) to 470\u03A9 Resistor terminal A" },
      { from: "r470-b", to: "led-r-a", text: "Connect 470\u03A9 Resistor terminal B to Red LED (+)" },
      { from: "led-r-b", to: "bat-", text: "Connect Red LED (-) back to Battery (-)" }
    ],
    explanation: "Current flows from the battery through the resistor (which limits the current so the LED doesn't burn out) and through the LED, making it glow. The circuit must be complete \u2014 a loop from + to - \u2014 for current to flow.",
    challenge: "Try swapping the 470\u03A9 resistor for the 1k\u03A9 resistor. What happens to the brightness?"
  },
  {
    id: 2,
    name: "Switched On",
    difficulty: "Beginner",
    icon: "2",
    description: "Add a switch to control your LED. Click the switch to toggle it!",
    parts: ["9V Battery", "470\u03A9 Resistor", "Red LED", "Switch 1"],
    steps: [
      { from: "bat+", to: "sw1-a", text: "Connect Battery (+) to Switch 1 terminal A" },
      { from: "sw1-b", to: "r470-a", text: "Connect Switch 1 terminal B to 470\u03A9 Resistor terminal A" },
      { from: "r470-b", to: "led-r-a", text: "Connect Resistor terminal B to Red LED (+)" },
      { from: "led-r-b", to: "bat-", text: "Connect Red LED (-) back to Battery (-)" }
    ],
    explanation: "The switch breaks the circuit when open. No complete path means no current flows, so the LED stays dark. Close the switch and the path is complete \u2014 the LED lights up!",
    challenge: "Can you add a second switch in series? Both must be closed to light the LED."
  },
  {
    id: 3,
    name: "Traffic Light",
    difficulty: "Beginner",
    icon: "3",
    description: "Wire up three LEDs with individual switches to simulate a traffic light.",
    parts: ["9V Battery", "470\u03A9 Resistor", "1k\u03A9 Resistor", "100\u03A9 Resistor", "Red LED", "Yellow LED", "Green LED", "Switch 1", "Switch 2"],
    steps: [
      { from: "bat+", to: "j1", text: "Connect Battery (+) to Junction 1" },
      { from: "j1", to: "r470-a", text: "Connect Junction 1 to 470\u03A9 Resistor terminal A" },
      { from: "r470-b", to: "led-r-a", text: "Connect 470\u03A9 Resistor terminal B to Red LED (+)" },
      { from: "led-r-b", to: "bat-", text: "Connect Red LED (-) to Battery (-)" },
      { from: "j1", to: "r1k-a", text: "Connect Junction 1 to 1k\u03A9 Resistor terminal A" },
      { from: "r1k-b", to: "led-y-a", text: "Connect 1k\u03A9 Resistor terminal B to Yellow LED (+)" },
      { from: "led-y-b", to: "bat-", text: "Connect Yellow LED (-) to Battery (-)" },
      { from: "j1", to: "r100-a", text: "Connect Junction 1 to 100\u03A9 Resistor terminal A" },
      { from: "r100-b", to: "led-g-a", text: "Connect 100\u03A9 Resistor terminal B to Green LED (+)" },
      { from: "led-g-b", to: "bat-", text: "Connect Green LED (-) to Battery (-)" }
    ],
    explanation: "Three parallel circuits share the same battery. Each LED has its own resistor. The different resistor values make each LED a slightly different brightness \u2014 lower resistance = more current = brighter.",
    challenge: "Add switches to control each LED independently!"
  },
  {
    id: 4,
    name: "Buzz Alert",
    difficulty: "Beginner",
    icon: "4",
    description: "Build a simple buzzer alarm circuit with a switch.",
    parts: ["9V Battery", "Buzzer", "Switch 1"],
    steps: [
      { from: "bat+", to: "sw1-a", text: "Connect Battery (+) to Switch 1 terminal A" },
      { from: "sw1-b", to: "buz-a", text: "Connect Switch 1 terminal B to Buzzer (+)" },
      { from: "buz-b", to: "bat-", text: "Connect Buzzer (-) back to Battery (-)" }
    ],
    explanation: "The buzzer converts electrical energy into sound. When the switch closes the circuit, current flows through the buzzer, vibrating a small membrane to produce a tone.",
    challenge: "Add a resistor in series to change the volume!"
  },
  {
    id: 5,
    name: "Motor Spin",
    difficulty: "Beginner",
    icon: "5",
    description: "Make the motor spin! Watch the wheel go round.",
    parts: ["9V Battery", "100\u03A9 Resistor", "Motor", "Switch 1"],
    steps: [
      { from: "bat+", to: "sw1-a", text: "Connect Battery (+) to Switch 1 terminal A" },
      { from: "sw1-b", to: "r100-a", text: "Connect Switch 1 terminal B to 100\u03A9 Resistor terminal A" },
      { from: "r100-b", to: "mot-a", text: "Connect Resistor terminal B to Motor (+)" },
      { from: "mot-b", to: "bat-", text: "Connect Motor (-) back to Battery (-)" }
    ],
    explanation: "The motor converts electrical energy into rotational motion. Current flowing through the coil creates a magnetic field that pushes against permanent magnets, making the shaft spin.",
    challenge: "Try different resistors to change the motor speed!"
  },
  {
    id: 6,
    name: "Night Light",
    difficulty: "Intermediate",
    icon: "6",
    description: "Build a light-sensitive circuit using the photoresistor. Adjust the light level to control the LED!",
    parts: ["9V Battery", "Photoresistor", "Red LED"],
    steps: [
      { from: "bat+", to: "ldr-a", text: "Connect Battery (+) to Photoresistor terminal A" },
      { from: "ldr-b", to: "led-r-a", text: "Connect Photoresistor terminal B to Red LED (+)" },
      { from: "led-r-b", to: "bat-", text: "Connect Red LED (-) to Battery (-)" }
    ],
    explanation: "A photoresistor (LDR) changes its resistance based on light. In bright light, resistance is low (more current, brighter LED). In darkness, resistance is high (less current, dimmer LED). Drag the light slider to see it in action!",
    challenge: "In a real night light, you'd want the LED brighter in the dark. Can you think of how a transistor could invert the behavior?"
  },
  {
    id: 7,
    name: "Dimmer Switch",
    difficulty: "Intermediate",
    icon: "7",
    description: "Use a potentiometer to smoothly control LED brightness.",
    parts: ["9V Battery", "Potentiometer", "Red LED"],
    steps: [
      { from: "bat+", to: "pot-a", text: "Connect Battery (+) to Potentiometer terminal A" },
      { from: "pot-w", to: "led-r-a", text: "Connect Potentiometer Wiper to Red LED (+)" },
      { from: "led-r-b", to: "bat-", text: "Connect Red LED (-) to Battery (-)" }
    ],
    explanation: "A potentiometer is a variable resistor. Turning the knob moves a wiper contact along a resistive strip, changing the resistance. More resistance = less current = dimmer LED.",
    challenge: "Wire the buzzer instead of the LED for a crude volume control!"
  },
  {
    id: 8,
    name: "Transistor Switch",
    difficulty: "Intermediate",
    icon: "8",
    description: "Use a tiny current to control a big one! The transistor amplifies.",
    parts: ["9V Battery", "10k\u03A9 Resistor", "470\u03A9 Resistor", "Transistor", "Red LED", "Switch 1"],
    steps: [
      { from: "bat+", to: "sw1-a", text: "Connect Battery (+) to Switch 1 terminal A" },
      { from: "sw1-b", to: "r10k-a", text: "Connect Switch 1 terminal B to 10k\u03A9 Resistor terminal A" },
      { from: "r10k-b", to: "tr-b", text: "Connect 10k\u03A9 Resistor terminal B to Transistor Base" },
      { from: "bat+", to: "r470-a", text: "Connect Battery (+) to 470\u03A9 Resistor terminal A" },
      { from: "r470-b", to: "tr-c", text: "Connect 470\u03A9 Resistor terminal B to Transistor Collector" },
      { from: "tr-e", to: "led-r-a", text: "Connect Transistor Emitter to Red LED (+)" },
      { from: "led-r-b", to: "bat-", text: "Connect Red LED (-) to Battery (-)" }
    ],
    explanation: "The transistor acts like an electronic switch. A tiny current through the Base-Emitter turns on a much larger current through the Collector-Emitter. The 10k\u03A9 resistor limits base current to a trickle, but that's enough to switch on the LED circuit!",
    challenge: "Replace the switch with the photoresistor to make an automatic light!"
  },
  {
    id: 9,
    name: "Two-Tone Siren",
    difficulty: "Intermediate",
    icon: "9",
    description: "Wire two switches to the buzzer with different resistors for a high and low tone.",
    parts: ["9V Battery", "100\u03A9 Resistor", "1k\u03A9 Resistor", "Buzzer", "Switch 1", "Switch 2"],
    steps: [
      { from: "bat+", to: "sw1-a", text: "Connect Battery (+) to Switch 1 terminal A" },
      { from: "sw1-b", to: "r100-a", text: "Connect Switch 1 terminal B to 100\u03A9 Resistor terminal A" },
      { from: "r100-b", to: "buz-a", text: "Connect 100\u03A9 Resistor terminal B to Buzzer (+)" },
      { from: "bat+", to: "sw2-a", text: "Connect Battery (+) to Switch 2 terminal A" },
      { from: "sw2-b", to: "r1k-a", text: "Connect Switch 2 terminal B to 1k\u03A9 Resistor terminal A" },
      { from: "r1k-b", to: "buz-a", text: "Connect 1k\u03A9 Resistor terminal B to Buzzer (+)" },
      { from: "buz-b", to: "bat-", text: "Connect Buzzer (-) to Battery (-)" }
    ],
    explanation: "Different resistances change the current through the buzzer, altering the volume and slightly the tone. Toggle between switches to hear the difference. In a real circuit, you'd use a 555 timer IC for true frequency control!",
    challenge: "Try pressing both switches at once \u2014 what happens when both paths are active?"
  },
  {
    id: 10,
    name: "Full Dashboard",
    difficulty: "Advanced",
    icon: "\u2605",
    description: "The grand finale! Wire up LEDs, buzzer, motor, and switches into a full control panel.",
    parts: ["9V Battery", "All Resistors", "Red LED", "Green LED", "Buzzer", "Motor", "Switch 1", "Switch 2", "Potentiometer"],
    steps: [
      { from: "bat+", to: "j1", text: "Connect Battery (+) to Junction 1" },
      { from: "j1", to: "sw1-a", text: "Connect Junction 1 to Switch 1 terminal A" },
      { from: "sw1-b", to: "r470-a", text: "Connect Switch 1 terminal B to 470\u03A9 Resistor terminal A" },
      { from: "r470-b", to: "led-r-a", text: "Connect 470\u03A9 Resistor terminal B to Red LED (+)" },
      { from: "led-r-b", to: "bat-", text: "Connect Red LED (-) to Battery (-)" },
      { from: "j1", to: "sw2-a", text: "Connect Junction 1 to Switch 2 terminal A" },
      { from: "sw2-b", to: "r1k-a", text: "Connect Switch 2 terminal B to 1k\u03A9 Resistor terminal A" },
      { from: "r1k-b", to: "led-g-a", text: "Connect 1k\u03A9 Resistor terminal B to Green LED (+)" },
      { from: "led-g-b", to: "bat-", text: "Connect Green LED (-) to Battery (-)" },
      { from: "j1", to: "r100-a", text: "Connect Junction 1 to 100\u03A9 Resistor terminal A" },
      { from: "r100-b", to: "buz-a", text: "Connect 100\u03A9 Resistor terminal B to Buzzer (+)" },
      { from: "buz-b", to: "bat-", text: "Connect Buzzer (-) to Battery (-)" },
      { from: "j1", to: "pot-a", text: "Connect Junction 1 to Potentiometer terminal A" },
      { from: "pot-w", to: "mot-a", text: "Connect Potentiometer Wiper to Motor (+)" },
      { from: "mot-b", to: "bat-", text: "Connect Motor (-) to Battery (-)" }
    ],
    explanation: "This dashboard demonstrates parallel circuits \u2014 each branch (LED, buzzer, motor) gets the full battery voltage independently. The switches control the LEDs, the potentiometer controls motor speed, and the buzzer sounds continuously. Each path has its own resistance to manage current.",
    challenge: "You've completed all 10 projects! Now try Sandbox mode and design your own circuits."
  }
];
