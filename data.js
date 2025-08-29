// data.js - All missions, badges, and achievements data

/**
 * XP REWARDS CONFIGURATION
 * Centralized XP rewards for different activities
 */
const XP_REWARDS = {
    // XP rewards for different activities
    dailyGoal: 15,           // Base XP for completing a daily goal
    dailyGoalBonus: 5,      // Bonus XP for exceeding goal target (total: 25)
    mission: 10,             // XP for completing a mission
    perfectDay: 25        // XP for completing all goals + missions
};

/**
 * XP LEVEL TITLES
 * Titles for each level in the XP progression system
 */
const XP_LEVEL_TITLES = {
    1: 'Rookie',
    2: 'Apprentice',
    3: 'Scout',
    4: 'Adventurer',
    5: 'Pathfinder',
    6: 'Challenger',
    7: 'Explorer',
    8: 'Warrior',
    9: 'Champion',
    10: 'Hero',
    11: 'Knight',
    12: 'Guardian',
    13: 'Crusader',
    14: 'Master',
    15: 'Grandmaster',
    16: 'Legend',
    17: 'Mythic',
    18: 'Dragonlord',
    19: 'Infinity',
    20: 'Eternal',
    21: 'Celestial',
    22: 'Starborn',
    23: 'Moonblade',
    24: 'Sunseeker',
    25: 'Skybreaker',
    26: 'Stormcaller',
    27: 'Flamekeeper',
    28: 'Shadowstalker',
    29: 'Lightbringer',
    30: 'Timewalker',
    31: 'Voidstrider',
    32: 'Dreamweaver',
    33: 'Spiritbinder',
    34: 'Realmkeeper',
    35: 'Cosmic Sage',
    36: 'Fateweaver',
    37: 'Infinity Knight',
    38: 'Eclipse Lord',
    39: 'Starforged',
    40: 'Planar Champion',
    41: 'Reality Shaper',
    42: 'Eternal Flame',
    43: 'Galaxy Guardian',
    44: 'Dimension Walker',
    45: 'Universal Hero',
    46: 'Cosmic Titan',
    47: 'Mythborn Legend',
    48: 'Ascendant',
    49: 'Transcendent',
    50: 'Omniversal Eternal'
};


/**
 * XP LEVEL REQUIREMENTS
 * Total XP required to reach each level
 */
const XP_LEVEL_REQUIREMENTS = {
    1: 0,
    2: 100,
    3: 200,
    4: 350,
    5: 500,
    6: 700,
    7: 900,
    8: 1150,
    9: 1400,
    10: 1700,
    11: 2000,
    12: 2350,
    13: 2700,
    14: 3100,
    15: 3500,
    16: 3950,
    17: 4400,
    18: 4900,
    19: 5400,
    20: 6000,
    21: 6600,
    22: 7250,
    23: 7900,
    24: 8600,
    25: 9300,
    26: 10100,
    27: 10900,
    28: 11800,
    29: 12700,
    30: 13700,
    31: 14700,
    32: 15800,
    33: 16900,
    34: 18100,
    35: 19300,
    36: 20600,
    37: 21900,
    38: 23300,
    39: 24700,
    40: 26200,
    41: 27700,
    42: 29300,
    43: 30900,
    44: 32600,
    45: 34300,
    46: 36100,
    47: 37900,
    48: 39800,
    49: 41700,
    50: 43700
};


/**
 * DAILY MISSIONS POOL
 * To add new missions: Add objects to this array with icon, title, and description
 * The app will randomly select 3 missions each day
 */
const DAILY_MISSIONS = [
    {
        id: 'vegetables',
        icon: '🥕',
        title: 'Veggie Champion',
        description: 'Eat all your vegetables at dinner'
    },
    {
        id: 'pushups',
        icon: '💪',
        title: 'Strong Arms',
        description: 'Do 10 push-ups (or as many as you can!)'
    },
    {
        id: 'kitchen_help',
        icon: '🧹',
        title: 'Kitchen Helper',
        description: 'Help clean up after a meal'
    },
    {
        id: 'outdoor_time',
        icon: '🌳',
        title: 'Nature Explorer',
        description: 'Spend 20 minutes outside'
    },
    {
        id: 'friend_call',
        icon: '📞',
        title: 'Social Butterfly',
        description: 'Call or video chat with a friend or family member'
    },
    {
        id: 'creative_time',
        icon: '🎨',
        title: 'Creative Soul',
        description: 'Draw, paint, or do a craft project for 15 minutes'
    },
    {
        id: 'music_time',
        icon: '🎵',
        title: 'Music Maker',
        description: 'Play an instrument or sing for 10 minutes'
    },
    {
        id: 'organize',
        icon: '📦',
        title: 'Tidy Master',
        description: 'Organize your desk or a drawer'
    },
    {
        id: 'gratitude',
        icon: '🙏',
        title: 'Grateful Heart',
        description: 'Write down 3 things you\'re grateful for'
    },
    {
        id: 'learn_fact',
        icon: '🧠',
        title: 'Fun Fact Finder',
        description: 'Learn one interesting fact about something new'
    },
    {
        id: 'help_family',
        icon: '❤️',
        title: 'Family Helper',
        description: 'Do something nice for a family member'
    },
    {
        id: 'walk',
        icon: '🚶',
        title: 'Step Counter',
        description: 'Take a 15-minute walk around your neighborhood'
    },
    {
        id: 'journal',
        icon: '📔',
        title: 'Story Teller',
        description: 'Write about your day for 5 minutes'
    },
    {
        id: 'teeth_care',
        icon: '🦷',
        title: 'Pearly Whites',
        description: 'Brush your teeth extra well tonight'
    },
    {
        id: 'room_clean',
        icon: '🛏️',
        title: 'Room Ranger',
        description: 'Make your bed and tidy up your room'
    },
    {
        id: 'dance',
        icon: '💃',
        title: 'Dance Party',
        description: 'Dance to your favorite song'
    },
    {
        id: 'meditate',
        icon: '🧘‍♀️',
        title: 'Zen Master',
        description: 'Sit quietly and breathe deeply for 5 minutes'
    },
    {
        id: 'compliment',
        icon: '😊',
        title: 'Kind Words',
        description: 'Give someone a genuine compliment'
    },
    {
        id: 'board_game',
        icon: '🎲',
        title: 'Game Master',
        description: 'Play a board game or card game with family'
    },
    {
        id: 'healthy_snack',
        icon: '🍎',
        title: 'Smart Snacker',
        description: 'Choose a healthy snack instead of junk food'
    },
    {
        id: 'early_bed',
        icon: '😴',
        title: 'Sleep Champion',
        description: 'Go to bed 15 minutes earlier than usual'
    },
    {
        id: 'no_phone',
        icon: '📱',
        title: 'Digital Detox',
        description: 'Take a 30-minute break from screens'
    },
    // Physical & Health
    {
        id: 'jumping_jacks',
        icon: '🏃‍♂️',
        title: 'Energy Booster',
        description: 'Do 25 jumping jacks to get your heart pumping'
    },
    {
        id: 'fruit_power',
        icon: '🍓',
        title: 'Fruit Power',
        description: 'Eat two different types of fruit today'
    },
    {
        id: 'deep_breaths',
        icon: '🌬️',
        title: 'Breath Master',
        description: 'Take 10 deep breaths when you feel stressed'
    },

    // Creative & Learning
    {
        id: 'origami',
        icon: '🦢',
        title: 'Paper Artist',
        description: 'Make an origami animal or flower'
    },
    {
        id: 'story_write',
        icon: '✍️',
        title: 'Story Creator',
        description: 'Write a short story with exactly 50 words'
    },
    {
        id: 'photo_take',
        icon: '📸',
        title: 'Photographer',
        description: 'Take 5 creative photos of ordinary objects'
    },
    {
        id: 'new_word',
        icon: '📖',
        title: 'Word Wizard',
        description: 'Learn a new word and use it in conversation'
    },
    {
        id: 'poem_write',
        icon: '📝',
        title: 'Poet Laureate',
        description: 'Write a haiku about your day'
    },
    {
        id: 'doodle_time',
        icon: '✏️',
        title: 'Doodle Master',
        description: 'Fill a page with fun doodles and patterns'
    },
    {
        id: 'riddle_solve',
        icon: '🧩',
        title: 'Riddle Solver',
        description: 'Solve three riddles or brain teasers'
    },

    // Social & Kindness
    {
        id: 'random_kindness',
        icon: '💝',
        title: 'Random Kindness',
        description: 'Do one unexpected act of kindness'
    },
    {
        id: 'thank_you_note',
        icon: '💌',
        title: 'Grateful Writer',
        description: 'Write a thank you note to someone special'
    },
    {
        id: 'smile_spread',
        icon: '😄',
        title: 'Smile Spreader',
        description: 'Make 5 people smile today'
    },
    {
        id: 'hug_give',
        icon: '🤗',
        title: 'Hug Ambassador',
        description: 'Give 3 genuine hugs to people you care about'
    },

    // Life Skills & Responsibility
    {
        id: 'meal_prep',
        icon: '🥪',
        title: 'Chef Helper',
        description: 'Help prepare lunch or a snack'
    },
    {
        id: 'laundry_fold',
        icon: '👕',
        title: 'Laundry Assistant',
        description: 'Fold and put away your clean clothes'
    },
    {
        id: 'schedule_plan',
        icon: '📅',
        title: 'Planning Pro',
        description: 'Plan tomorrow\'s activities and priorities'
    },

    // Fun & Games
    {
        id: 'joke_learn',
        icon: '😂',
        title: 'Comedy Star',
        description: 'Learn a new joke and tell it to someone'
    },
    {
        id: 'magic_trick',
        icon: '🎩',
        title: 'Magician',
        description: 'Learn and perform a simple magic trick'
    },
    {
        id: 'tongue_twister',
        icon: '👅',
        title: 'Tongue Twister Pro',
        description: 'Master saying a difficult tongue twister'
    },
    {
        id: 'scavenger_hunt',
        icon: '🔍',
        title: 'Treasure Hunter',
        description: 'Find 5 red things in your house'
    },
    {
        id: 'balance_challenge',
        icon: '⚖️',
        title: 'Balance Master',
        description: 'Stand on one foot for 30 seconds'
    },

    // Nature & Environment
    {
        id: 'bird_watch',
        icon: '🐦',
        title: 'Bird Watcher',
        description: 'Spot and identify 3 different birds'
    },
    {
        id: 'cloud_shapes',
        icon: '☁️',
        title: 'Cloud Reader',
        description: 'Find shapes in the clouds for 10 minutes'
    },
    {
        id: 'garden_explore',
        icon: '🌻',
        title: 'Garden Explorer',
        description: 'Examine flowers, leaves, or insects closely'
    },
    {
        id: 'sunset_watch',
        icon: '🌅',
        title: 'Sunset Appreciator',
        description: 'Watch the sunrise or sunset mindfully'
    },

    // Technology & Skills
    {
        id: 'typing_practice',
        icon: '⌨️',
        title: 'Typing Ninja',
        description: 'Practice typing for 10 minutes'
    },

    // Mind & Reflection
    {
        id: 'memory_game',
        icon: '🧠',
        title: 'Memory Champion',
        description: 'Play a memory game or do mental math'
    },
    {
        id: 'future_self',
        icon: '🔮',
        title: 'Future Thinker',
        description: 'Write a letter to your future self'
    },
    {
        id: 'proud_moment',
        icon: '🌟',
        title: 'Pride Keeper',
        description: 'Write about something that made you proud today'
    },
    {
        id: 'fear_face',
        icon: '🦁',
        title: 'Courage Builder',
        description: 'Do one small thing that scares you'
    },

    // Adventure & Exploration
    {
        id: 'interview_elder',
        icon: '👴',
        title: 'Story Collector',
        description: 'Ask an older person about their childhood'
    },
    {
        id: 'map_draw',
        icon: '🧭',
        title: 'Cartographer',
        description: 'Draw a map of your neighborhood or room'
    },

    // Seasonal & Special
    {
        id: 'weather_predict',
        icon: '🌤️',
        title: 'Weather Prophet',
        description: 'Predict tomorrow\'s weather and check if you\'re right'
    },
    {
        id: 'star_gaze',
        icon: '⭐',
        title: 'Star Gazer',
        description: 'Look at stars and try to find constellations'
    },
    {
        id: 'shadow_play',
        icon: '👥',
        title: 'Shadow Artist',
        description: 'Make shadow puppets and tell a story'
    },
    {
        id: 'color_hunt',
        icon: '🌈',
        title: 'Rainbow Hunter',
        description: 'Find objects in all colors of the rainbow'
    }
];

/**
 * BADGES CONFIGURATION
 * These are awarded for completing single daily tasks
 * To add new badges: Add them to the respective category with icon and name
 */
const BADGES = {
    // Daily goal badges
    water: { icon: '💧', name: 'Hydration Hero' },
    stretch: { icon: '🧘', name: 'Flexibility Star' },
    duolingo: { icon: '🦉', name: 'Language Learner' },
    reading: { icon: '📚', name: 'Book Worm' },

    // Mission badges (all current missions)
    vegetables: { icon: '🥕', name: 'Veggie Champion' },
    pushups: { icon: '💪', name: 'Strong Arms' },
    kitchen_help: { icon: '🧹', name: 'Kitchen Helper' },
    outdoor_time: { icon: '🌳', name: 'Nature Explorer' },
    friend_call: { icon: '📞', name: 'Social Butterfly' },
    creative_time: { icon: '🎨', name: 'Creative Soul' },
    music_time: { icon: '🎵', name: 'Music Maker' },
    organize: { icon: '📦', name: 'Tidy Master' },
    gratitude: { icon: '🙏', name: 'Grateful Heart' },
    learn_fact: { icon: '🧠', name: 'Fun Fact Finder' },
    help_family: { icon: '❤️', name: 'Family Helper' },
    walk: { icon: '🚶', name: 'Step Counter' },
    journal: { icon: '📔', name: 'Story Teller' },
    teeth_care: { icon: '🦷', name: 'Pearly Whites' },
    room_clean: { icon: '🛏️', name: 'Room Ranger' },
    dance: { icon: '💃', name: 'Dance Party' },
    meditate: { icon: '🧘‍♀️', name: 'Zen Master' },
    compliment: { icon: '😊', name: 'Kind Words' },
    board_game: { icon: '🎲', name: 'Game Master' },
    healthy_snack: { icon: '🍎', name: 'Smart Snacker' },
    early_bed: { icon: '😴', name: 'Sleep Champion' },
    no_phone: { icon: '📱', name: 'Digital Detox' },
    jumping_jacks: { icon: '🏃‍♂️', name: 'Energy Booster' },
    fruit_power: { icon: '🍓', name: 'Fruit Power' },
    deep_breaths: { icon: '🌬️', name: 'Breath Master' },
    origami: { icon: '🦢', name: 'Paper Artist' },
    story_write: { icon: '✍️', name: 'Story Creator' },
    photo_take: { icon: '📸', name: 'Photographer' },
    new_word: { icon: '📖', name: 'Word Wizard' },
    poem_write: { icon: '📝', name: 'Poet Laureate' },
    doodle_time: { icon: '✏️', name: 'Doodle Master' },
    riddle_solve: { icon: '🧩', name: 'Riddle Solver' },
    random_kindness: { icon: '💝', name: 'Random Kindness' },
    thank_you_note: { icon: '💌', name: 'Grateful Writer' },
    smile_spread: { icon: '😄', name: 'Smile Spreader' },
    hug_give: { icon: '🤗', name: 'Hug Ambassador' },
    meal_prep: { icon: '🥪', name: 'Chef Helper' },
    laundry_fold: { icon: '👕', name: 'Laundry Assistant' },
    schedule_plan: { icon: '📅', name: 'Planning Pro' },
    joke_learn: { icon: '😂', name: 'Comedy Star' },
    magic_trick: { icon: '🎩', name: 'Magician' },
    tongue_twister: { icon: '👅', name: 'Tongue Twister Pro' },
    scavenger_hunt: { icon: '🔍', name: 'Treasure Hunter' },
    balance_challenge: { icon: '⚖️', name: 'Balance Master' },
    bird_watch: { icon: '🐦', name: 'Bird Watcher' },
    cloud_shapes: { icon: '☁️', name: 'Cloud Reader' },
    garden_explore: { icon: '🌻', name: 'Garden Explorer' },
    sunset_watch: { icon: '🌅', name: 'Sunset Appreciator' },
    typing_practice: { icon: '⌨️', name: 'Typing Ninja' },
    memory_game: { icon: '🧠', name: 'Memory Champion' },
    future_self: { icon: '🔮', name: 'Future Thinker' },
    proud_moment: { icon: '🌟', name: 'Pride Keeper' },
    fear_face: { icon: '🦁', name: 'Courage Builder' },
    interview_elder: { icon: '👴', name: 'Story Collector' },
    map_draw: { icon: '🧭', name: 'Cartographer' },
    weather_predict: { icon: '🌤️', name: 'Weather Prophet' },
    star_gaze: { icon: '⭐', name: 'Star Gazer' },
    shadow_play: { icon: '👥', name: 'Shadow Artist' },
    color_hunt: { icon: '🌈', name: 'Rainbow Hunter' },

    // Special combo badges
    perfect_day: { icon: '⭐', name: 'Perfect Day' }, // All goals + all missions
    goal_master: { icon: '🎯', name: 'Goal Master' }, // All daily goals completed
    mission_hero: { icon: '🎖️', name: 'Mission Hero' }, // All missions completed
    streak_starter: { icon: '🔥', name: 'Streak Starter' }, // 2 days in a row
    consistent: { icon: '📈', name: 'Consistency King' }, // 5 days in a week
    weekend_warrior: { icon: '🏃', name: 'Weekend Warrior' } // Complete weekend goals
};

/**
 * ACHIEVEMENTS CONFIGURATION
 * Multi-level achievements that track progress over time
 * To add new achievements: Add objects with id, name, icon, description, and levels array
 * Each level should have a threshold and reward name
 */
const ACHIEVEMENTS = [
    {
        id: 'water_hero',
        name: 'Water Hero',
        icon: '🌊',
        description: 'Total cups of water consumed',
        goal: '8 cups daily',
        levels: [
            { threshold: 8, reward: 'First Sip' },
            { threshold: 24, reward: 'Hydration Starter' },
            { threshold: 48, reward: 'Water Walker' },
            { threshold: 80, reward: 'Droplet Collector' },
            { threshold: 120, reward: 'Stream Walker' },
            { threshold: 200, reward: 'River Runner' },
            { threshold: 300, reward: 'Lake Legend' },
            { threshold: 450, reward: 'Ocean Master' },
            { threshold: 650, reward: 'Tsunami Tamer' },
            { threshold: 900, reward: 'Water Bender' },
            { threshold: 1200, reward: 'Hydration God' },
            { threshold: 1600, reward: 'Aqua Supreme' },
            { threshold: 2100, reward: 'H2O Immortal' },
            { threshold: 2700, reward: 'Water Deity' },
            { threshold: 3400, reward: 'Ocean Emperor' },
            { threshold: 4200, reward: 'Hydration Master' },
            { threshold: 5100, reward: 'Water Legend' },
            { threshold: 6100, reward: 'Aqua Immortal' },
            { threshold: 7200, reward: 'H2O God' },
            { threshold: 8400, reward: 'Water Supreme' }
        ]
    },
    {
        id: 'reading_master',
        name: 'Reading Master',
        icon: '📖',
        description: 'Total minutes of reading',
        goal: '30 minutes daily',
        levels: [
            { threshold: 30, reward: 'First Page' },
            { threshold: 90, reward: 'Reading Starter' },
            { threshold: 180, reward: 'Page Turner' },
            { threshold: 300, reward: 'Chapter Champion' },
            { threshold: 450, reward: 'Book Browser' },
            { threshold: 750, reward: 'Story Seeker' },
            { threshold: 1200, reward: 'Novel Navigator' },
            { threshold: 1800, reward: 'Literature Lover' },
            { threshold: 2700, reward: 'Reading Royalty' },
            { threshold: 4000, reward: 'Book Deity' },
            { threshold: 6000, reward: 'Word Wizard' },
            { threshold: 9000, reward: 'Story Sage' },
            { threshold: 13000, reward: 'Reading Master' },
            { threshold: 18000, reward: 'Book Legend' },
            { threshold: 24000, reward: 'Literature God' },
            { threshold: 31000, reward: 'Reading Immortal' },
            { threshold: 39000, reward: 'Word Supreme' },
            { threshold: 48000, reward: 'Story Master' },
            { threshold: 58000, reward: 'Book Emperor' },
            { threshold: 69000, reward: 'Reading Supreme' }
        ]
    },
    {
        id: 'stretch_guru',
        name: 'Stretch Guru',
        icon: '🤸',
        description: 'Total minutes of stretching',
        goal: '15 minutes daily',
        levels: [
            { threshold: 15, reward: 'First Stretch' },
            { threshold: 45, reward: 'Stretch Starter' },
            { threshold: 90, reward: 'Flexibility Finder' },
            { threshold: 150, reward: 'Bend Builder' },
            { threshold: 225, reward: 'Pose Professional' },
            { threshold: 375, reward: 'Flexibility Master' },
            { threshold: 600, reward: 'Stretch Superstar' },
            { threshold: 900, reward: 'Yoga Yogi' },
            { threshold: 1350, reward: 'Zen Warrior' },
            { threshold: 1950, reward: 'Balance Boss' },
            { threshold: 2700, reward: 'Flexibility Phoenix' },
            { threshold: 3600, reward: 'Stretch Master' },
            { threshold: 4650, reward: 'Yoga Legend' },
            { threshold: 5850, reward: 'Flexibility God' },
            { threshold: 7200, reward: 'Stretch Immortal' },
            { threshold: 8700, reward: 'Yoga Supreme' },
            { threshold: 10350, reward: 'Flexibility Emperor' },
            { threshold: 12150, reward: 'Stretch Legend' },
            { threshold: 14100, reward: 'Yoga Master' },
            { threshold: 16200, reward: 'Flexibility Supreme' }
        ]
    },
    {
        id: 'language_legend',
        name: 'Language Legend',
        icon: '🗣️',
        description: 'Days of completing Duolingo',
        goal: '1 lesson daily',
        levels: [
            { threshold: 1, reward: 'First Lesson' },
            { threshold: 3, reward: 'Language Starter' },
            { threshold: 7, reward: 'Word Warrior' },
            { threshold: 14, reward: 'Language Learner' },
            { threshold: 21, reward: 'Vocabulary Victor' },
            { threshold: 30, reward: 'Grammar Guardian' },
            { threshold: 45, reward: 'Fluency Fighter' },
            { threshold: 60, reward: 'Polyglot Pro' },
            { threshold: 80, reward: 'Language Lord' },
            { threshold: 100, reward: 'Tongue Twister' },
            { threshold: 125, reward: 'Babel Builder' },
            { threshold: 150, reward: 'Universal Speaker' },
            { threshold: 180, reward: 'Language Master' },
            { threshold: 210, reward: 'Word Legend' },
            { threshold: 245, reward: 'Grammar God' },
            { threshold: 280, reward: 'Fluency Immortal' },
            { threshold: 320, reward: 'Polyglot Supreme' },
            { threshold: 365, reward: 'Language Emperor' },
            { threshold: 400, reward: 'Tongue Master' },
            { threshold: 450, reward: 'Babel Supreme' }
        ]
    },
    {
        id: 'mission_master',
        name: 'Mission Master',
        icon: '🎯',
        description: 'Total missions completed',
        goal: '3 missions daily',
        levels: [
            { threshold: 3, reward: 'First Mission' },
            { threshold: 9, reward: 'Mission Starter' },
            { threshold: 18, reward: 'Task Tackler' },
            { threshold: 30, reward: 'Mission Rookie' },
            { threshold: 45, reward: 'Quest Completer' },
            { threshold: 75, reward: 'Challenge Champion' },
            { threshold: 120, reward: 'Mission Expert' },
            { threshold: 180, reward: 'Quest Master' },
            { threshold: 270, reward: 'Mission Legend' },
            { threshold: 400, reward: 'Ultimate Achiever' },
            { threshold: 600, reward: 'Mission Immortal' },
            { threshold: 900, reward: 'Quest God' },
            { threshold: 1350, reward: 'Mission Supreme' },
            { threshold: 2000, reward: 'Quest Emperor' },
            { threshold: 3000, reward: 'Mission Master' },
            { threshold: 4500, reward: 'Quest Legend' },
            { threshold: 6750, reward: 'Mission God' },
            { threshold: 10000, reward: 'Quest Immortal' },
            { threshold: 15000, reward: 'Mission Supreme' },
            { threshold: 22500, reward: 'Quest Master' }
        ]
    },
    {
        id: 'perfect_days',
        name: 'Perfect Days',
        icon: '✨',
        description: 'Days with all goals and missions complete',
        goal: 'All goals + missions daily',
        levels: [
            { threshold: 1, reward: 'Perfect Starter' },
            { threshold: 3, reward: 'Excellence Seeker' },
            { threshold: 7, reward: 'Perfection Pro' },
            { threshold: 14, reward: 'Flawless Fighter' },
            { threshold: 21, reward: 'Perfect Master' },
            { threshold: 30, reward: 'Excellence Expert' },
            { threshold: 45, reward: 'Perfection Legend' },
            { threshold: 60, reward: 'Flawless God' },
            { threshold: 80, reward: 'Perfect Immortal' },
            { threshold: 100, reward: 'Ultimate Perfect' },
            { threshold: 125, reward: 'Excellence Supreme' },
            { threshold: 150, reward: 'Perfection Emperor' },
            { threshold: 180, reward: 'Flawless Master' },
            { threshold: 210, reward: 'Perfect Legend' },
            { threshold: 250, reward: 'Excellence God' },
            { threshold: 300, reward: 'Perfection Immortal' },
            { threshold: 365, reward: 'Flawless Supreme' },
            { threshold: 450, reward: 'Perfect Emperor' },
            { threshold: 550, reward: 'Excellence Master' },
            { threshold: 700, reward: 'Perfection Supreme' }
        ]
    }
];

/**
 * DAILY GOALS CONFIGURATION
 * These are the fixed daily goals that appear every day
 */
const DAILY_GOALS = {
    water: {
        icon: '💧',
        title: 'Drink Water',
        target: 8,
        unit: 'cups',
        type: 'counter'
    },
    stretch: {
        icon: '🧘',
        title: 'Stretch',
        target: 15,
        unit: 'minutes',
        type: 'counter'
    },
    duolingo: {
        icon: '🦉',
        title: 'Duolingo',
        target: 1,
        unit: 'lesson',
        type: 'checkbox'
    },
    reading: {
        icon: '📚',
        title: 'Reading',
        target: 30,
        unit: 'minutes',
        type: 'counter'
    }
};