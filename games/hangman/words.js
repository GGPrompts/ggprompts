/**
 * Word bank for Hangman / Wheel of Fortune
 * 50+ words per category, organized by difficulty
 */
window.WordBank = {
  categories: {
    animals: {
      label: 'Animals',
      icon: '\uD83D\uDC3E',
      words: [
        'ELEPHANT', 'GIRAFFE', 'PENGUIN', 'DOLPHIN', 'CHEETAH',
        'GORILLA', 'OCTOPUS', 'PANTHER', 'BUFFALO', 'FLAMINGO',
        'LEOPARD', 'PELICAN', 'RACCOON', 'SPARROW', 'TORTOISE',
        'VULTURE', 'WALRUS', 'ZEBRA', 'ANTELOPE', 'ARMADILLO',
        'BABOON', 'CARIBOU', 'CONDOR', 'COYOTE', 'CRICKET',
        'FALCON', 'FERRET', 'GAZELLE', 'HAMSTER', 'IGUANA',
        'JACKAL', 'JAGUAR', 'KOALA', 'LEMUR', 'LOBSTER',
        'MACAW', 'MEERKAT', 'MONGOOSE', 'NARWHAL', 'OCELOT',
        'OSTRICH', 'PARROT', 'PORCUPINE', 'QUAIL', 'RATTLESNAKE',
        'SALAMANDER', 'SEAHORSE', 'SLOTH', 'STINGRAY', 'TOUCAN',
        'WARTHOG', 'WOLVERINE', 'CHAMELEON', 'CHINCHILLA', 'PLATYPUS'
      ]
    },
    countries: {
      label: 'Countries',
      icon: '\uD83C\uDF0D',
      words: [
        'ARGENTINA', 'AUSTRALIA', 'BELGIUM', 'BRAZIL', 'CAMBODIA',
        'CANADA', 'COLOMBIA', 'CROATIA', 'DENMARK', 'ECUADOR',
        'ETHIOPIA', 'FINLAND', 'FRANCE', 'GERMANY', 'GREECE',
        'HUNGARY', 'ICELAND', 'INDONESIA', 'IRELAND', 'JAMAICA',
        'JAPAN', 'KENYA', 'LEBANON', 'MALAYSIA', 'MEXICO',
        'MONGOLIA', 'MOROCCO', 'NEPAL', 'NETHERLANDS', 'NIGERIA',
        'NORWAY', 'PAKISTAN', 'PANAMA', 'PERU', 'PHILIPPINES',
        'POLAND', 'PORTUGAL', 'ROMANIA', 'SINGAPORE', 'SLOVENIA',
        'SPAIN', 'SWEDEN', 'SWITZERLAND', 'TAIWAN', 'THAILAND',
        'TURKEY', 'UKRAINE', 'URUGUAY', 'VENEZUELA', 'VIETNAM',
        'ZIMBABWE', 'MADAGASCAR', 'LUXEMBOURG', 'MOZAMBIQUE', 'PARAGUAY'
      ]
    },
    movies: {
      label: 'Movies',
      icon: '\uD83C\uDFAC',
      words: [
        'GLADIATOR', 'INCEPTION', 'TITANIC', 'AVATAR', 'BRAVEHEART',
        'CASABLANCA', 'CHINATOWN', 'GOODFELLAS', 'JAWS', 'PSYCHO',
        'RATATOUILLE', 'ROCKY', 'SCARFACE', 'VERTIGO', 'ALIEN',
        'AMADEUS', 'BAMBI', 'BATMAN', 'CONTACT', 'DUMBO',
        'FANTASIA', 'FROZEN', 'GRAVITY', 'INTERSTELLAR', 'JUMANJI',
        'MEMENTO', 'MULAN', 'NETWORK', 'PLATOON', 'PREDATOR',
        'ROBOCOP', 'SHREK', 'SUPERMAN', 'TENET', 'TERMINATOR',
        'TRON', 'UP', 'WALL', 'ZODIAC', 'TWISTER',
        'ARRIVAL', 'DUNKIRK', 'GHOSTBUSTERS', 'GREASE', 'HALLOWEEN',
        'LABYRINTH', 'MOANA', 'RAMBO', 'SKYFALL', 'SPOTLIGHT',
        'ENCANTO', 'OPPENHEIMER', 'PARASITE', 'WHIPLASH', 'ZOOTOPIA'
      ]
    },
    tech: {
      label: 'Tech Terms',
      icon: '\uD83D\uDCBB',
      words: [
        'ALGORITHM', 'BANDWIDTH', 'BLUETOOTH', 'COMPILER', 'DATABASE',
        'DEBUGGING', 'ENCRYPTION', 'ETHERNET', 'FIBONACCI', 'FIREWALL',
        'FRAMEWORK', 'FUNCTION', 'HARDWARE', 'HYPERLINK', 'INTERNET',
        'JAVASCRIPT', 'KEYBOARD', 'KERNEL', 'LINUX', 'MALWARE',
        'METADATA', 'MONGODB', 'NETWORK', 'OVERFLOW', 'PARALLEL',
        'PASSWORD', 'PIPELINE', 'PROTOCOL', 'PYTHON', 'QUANTUM',
        'RECURSION', 'REGISTRY', 'RUNTIME', 'SANDBOX', 'SCALABLE',
        'SEMANTIC', 'SERVER', 'SOFTWARE', 'TERMINAL', 'THREADING',
        'TYPESCRIPT', 'UNICODE', 'VARIABLE', 'VIEWPORT', 'VIRTUAL',
        'WEBPACK', 'WIRELESS', 'WEBSOCKET', 'BINARY', 'BOOLEAN',
        'CONTAINER', 'ITERATOR', 'MIDDLEWARE', 'POLYMORPHISM', 'SERIALIZATION'
      ]
    },
    food: {
      label: 'Food & Drink',
      icon: '\uD83C\uDF55',
      words: [
        'AVOCADO', 'BURRITO', 'CAPPUCCINO', 'CHOCOLATE', 'CINNAMON',
        'CROISSANT', 'ESPRESSO', 'FOCACCIA', 'GAZPACHO', 'GOULASH',
        'GUACAMOLE', 'JALAPENO', 'LASAGNA', 'MACARON', 'MARINARA',
        'MOZZARELLA', 'PANCAKE', 'PARMESAN', 'PISTACHIO', 'PRETZEL',
        'PROSCIUTTO', 'QUESADILLA', 'RAVIOLI', 'RISOTTO', 'SAFFRON',
        'SCHNITZEL', 'SOURDOUGH', 'SRIRACHA', 'SUSHI', 'TABOULEH',
        'TEMPURA', 'TIRAMISU', 'TOFU', 'TRUFFLE', 'TURMERIC',
        'VINAIGRETTE', 'WASABI', 'ZUCCHINI', 'BRUSCHETTA', 'COUSCOUS',
        'DUMPLING', 'EDAMAME', 'FALAFEL', 'GNOCCHI', 'HUMMUS',
        'KIMCHI', 'KOMBUCHA', 'MANGO', 'NOUGAT', 'PESTO',
        'QUINOA', 'RAMEN', 'SAMOSA', 'SMOOTHIE', 'WAFFLE'
      ]
    },
    science: {
      label: 'Science',
      icon: '\uD83D\uDD2C',
      words: [
        'ASTRONOMY', 'BACTERIA', 'CATALYST', 'CHROMOSOME', 'CYTOPLASM',
        'DIFFUSION', 'ECOSYSTEM', 'ELECTRODE', 'ELECTRON', 'ELEMENT',
        'ENTROPY', 'EVOLUTION', 'FRICTION', 'GALAXY', 'GENETICS',
        'GRAVITY', 'HABITAT', 'HYDROGEN', 'HYPOTHESIS', 'ISOTOPE',
        'KINETIC', 'LATITUDE', 'MAGNESIUM', 'MITOSIS', 'MOLECULE',
        'MUTATION', 'NEUTRON', 'NITROGEN', 'NUCLEUS', 'ORGANISM',
        'OSMOSIS', 'OXIDATION', 'PARTICLE', 'PHOTON', 'PHYSICS',
        'PLANKTON', 'PLASMA', 'POLYMER', 'PROTON', 'QUANTUM',
        'QUASAR', 'RADIATION', 'REFRACTION', 'SPECTRUM', 'SYMBIOSIS',
        'SYNTHESIS', 'TAXONOMY', 'THERMODYNAMICS', 'URANIUM', 'VELOCITY',
        'VIBRATION', 'VOLCANO', 'WAVELENGTH', 'XENON', 'ZOOLOGY'
      ]
    }
  },

  /**
   * Get a random word from a category (or random category)
   * @param {string} [category] - Category key, or omit for random
   * @returns {{ word: string, category: string, label: string }}
   */
  getRandomWord(category) {
    const cats = Object.keys(this.categories);
    if (!category || !this.categories[category]) {
      category = cats[Math.floor(Math.random() * cats.length)];
    }
    const cat = this.categories[category];
    const word = cat.words[Math.floor(Math.random() * cat.words.length)];
    return { word, category, label: cat.label, icon: cat.icon };
  }
};
