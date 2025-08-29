// game.js - Core game logic and data management

class HabitTracker {
    constructor() {
        this.currentDate = new Date();
        this.dateKey = this.formatDateKey(this.currentDate);
        this.initializeData();
        this.loadData();
    }

    /**
     * Initialize default data structure
     */
    initializeData() {
        this.defaultData = {
            // Daily progress for current date
            daily: {
                goals: {
                    water: 0,
                    stretch: 0,
                    duolingo: false,
                    reading: 0
                },
                missions: {},
                mood: {
                    emoji: null,
                    text: ''
                },
                completed: false,
                date: this.dateKey
            },
            // Historical data by date
            history: {},
            // Achievement progress
            achievements: {},
            // Badge collection
            badges: [],
            // XP and level system
            xp: {
                currentXP: 0,
                totalXP: 0,
                currentLevel: 1,
                levelHistory: [],
                xpHistory: []
            },
            // Statistics
            stats: {
                totalDays: 0,
                perfectDays: 0,
                currentStreak: 0,
                longestStreak: 0,
                totalMissions: 0
            }
        };
    }

    /**
     * Load data from localStorage or initialize with defaults
     */
    loadData() {
        const saved = localStorage.getItem('habitTracker');
        if (saved) {
            this.data = JSON.parse(saved);
            
            // Recalculate current level based on total XP (in case level structure changed)
            if (this.data.xp && this.data.xp.totalXP !== undefined) {
                const recalculatedLevel = this.calculateLevelFromXP(this.data.xp.totalXP);
                this.data.xp.currentLevel = recalculatedLevel;
            }
            
            // Check for date change and reset if needed
            this.checkDateChange();
            
            // Ensure we have today's data
            if (!this.data.history[this.dateKey]) {
                this.data.history[this.dateKey] = { ...this.defaultData.daily };
                this.data.history[this.dateKey].date = this.dateKey;
            }
            this.data.daily = this.data.history[this.dateKey];
        } else {
            this.data = { ...this.defaultData };
            this.data.history[this.dateKey] = { ...this.defaultData.daily };
        }

        // Initialize today's missions if not set
        if (!this.data.daily.missions || Object.keys(this.data.daily.missions).length === 0) {
            this.generateDailyMissions();
        }

        this.saveData();
    }

    /**
     * Check if the current date has changed and reset daily data if needed
     */
    checkDateChange() {
        const currentDate = new Date();
        const currentDateKey = this.formatDateKey(currentDate);
        
        console.log(`🔍 Checking date change: stored=${this.dateKey}, current=${currentDateKey}`);
        
        if (currentDateKey !== this.dateKey) {
            console.log(`📅 Date changed from ${this.dateKey} to ${currentDateKey}`);
            console.log(`🔄 Resetting daily data for new day...`);
            
            // Update the current date and date key
            this.currentDate = currentDate;
            this.dateKey = currentDateKey;
            
            // Check if we already have data for today
            if (!this.data.history[this.dateKey]) {
                console.log(`📝 Creating new daily data for ${this.dateKey}`);
                // Create new daily data for today
                this.data.history[this.dateKey] = { ...this.defaultData.daily };
                this.data.history[this.dateKey].date = this.dateKey;
                
                // Generate new missions for today
                console.log(`🎯 Generating new missions for ${this.dateKey}`);
                this.generateDailyMissions();
            } else {
                console.log(`📝 Found existing data for ${this.dateKey}`);
            }
            
            // Set today's data as current
            this.data.daily = this.data.history[this.dateKey];
            
            console.log(`✅ Daily data reset complete for ${this.dateKey}`);
            return true; // Date changed
        } else {
            console.log(`✅ Same date, no change needed`);
        }
        
        return false; // Same date
    }

    /**
     * Refresh daily data for the current day
     * This ensures missions and goals are properly set for today
     */
    refreshDailyData() {
        // Check for date change first
        const dateChanged = this.checkDateChange();
        
        // Ensure today's data exists
        if (!this.data.history[this.dateKey]) {
            this.data.history[this.dateKey] = { ...this.defaultData.daily };
            this.data.history[this.dateKey].date = this.dateKey;
        }
        
        // Set today's data as current
        this.data.daily = this.data.history[this.dateKey];
        
        // Always regenerate missions for today to ensure they're fresh
        this.generateDailyMissions();
        
        this.saveData();
        
        return dateChanged;
    }

    /**
     * Save data to localStorage
     */
    saveData() {
        localStorage.setItem('habitTracker', JSON.stringify(this.data));
    }

    /**
     * Format date as YYYY-MM-DD string
     */
    formatDateKey(date) {
        return date.toISOString().split('T')[0];
    }

    /**
     * Generate 3 random missions for the day
     * Uses date as seed to ensure same missions per day
     */
    generateDailyMissions() {
        const dateNum = parseInt(this.dateKey.replace(/-/g, ''));
        const shuffled = this.shuffleArrayWithSeed(DAILY_MISSIONS, dateNum);
        const selectedMissions = shuffled.slice(0, 3);
        
        this.data.daily.missions = {};
        selectedMissions.forEach(mission => {
            this.data.daily.missions[mission.id] = {
                ...mission,
                completed: false
            };
        });
    }

    /**
     * Shuffle array with seed for consistent daily missions
     */
    shuffleArrayWithSeed(array, seed) {
        const shuffled = [...array];
        let currentIndex = shuffled.length;
        let randomIndex;

        // Simple seeded random number generator
        const seededRandom = (seed) => {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };

        while (currentIndex !== 0) {
            randomIndex = Math.floor(seededRandom(seed + currentIndex) * currentIndex);
            currentIndex--;
            [shuffled[currentIndex], shuffled[randomIndex]] = 
            [shuffled[randomIndex], shuffled[currentIndex]];
        }

        return shuffled;
    }

    /**
     * Update goal progress
     */
    updateGoal(goalId, value) {
        const goal = DAILY_GOALS[goalId];
        if (!goal) return;

        const wasCompleted = this.isGoalCompleted(goalId);

        if (goal.type === 'counter') {
            this.data.daily.goals[goalId] = Math.max(0, Math.min(value, goal.target * 2)); // Allow up to 2x target
        } else if (goal.type === 'checkbox') {
            this.data.daily.goals[goalId] = value;
        }

        // Award XP for goal completion
        const isNowCompleted = this.isGoalCompleted(goalId);
        if (!wasCompleted && isNowCompleted) {
            // Check if exceeding target (for counter goals)
            const isExceeding = goal.type === 'counter' && this.data.daily.goals[goalId] > goal.target;
            this.awardGoalXP(goalId, isExceeding);
        }

        this.data.history[this.dateKey] = { ...this.data.daily };
        this.checkForBadges();
        this.updateAchievements();

        // Check for perfect day XP
        if (this.isPerfectDay()) {
            this.awardPerfectDayXP();
        }

        this.saveData();
    }

    /**
     * Toggle mission completion
     */
    toggleMission(missionId) {
        if (this.data.daily.missions[missionId]) {
            const wasCompleted = this.data.daily.missions[missionId].completed;
            this.data.daily.missions[missionId].completed = !this.data.daily.missions[missionId].completed;
            
            // Award XP for mission completion
            if (!wasCompleted && this.data.daily.missions[missionId].completed) {
                this.awardMissionXP(missionId);
            }
            
            this.data.history[this.dateKey] = { ...this.data.daily };
            this.checkForBadges();
            this.updateAchievements();
            this.updateStats();

            // Check for perfect day XP
            if (this.isPerfectDay()) {
                this.awardPerfectDayXP();
            }

            this.saveData();

            return this.data.daily.missions[missionId].completed;
        }
        return false;
    }

    /**
     * Set mood for the day
     */
    setMood(emoji, text = '') {
        this.data.daily.mood = { emoji, text };
        this.data.history[this.dateKey] = { ...this.data.daily };
        this.saveData();
    }

    /**
     * Check if goals are completed
     */
    isGoalCompleted(goalId) {
        const goal = DAILY_GOALS[goalId];
        if (goal.type === 'counter') {
            return this.data.daily.goals[goalId] >= goal.target;
        } else if (goal.type === 'checkbox') {
            return this.data.daily.goals[goalId] === true;
        }
        return false;
    }

    /**
     * Check if all daily goals are completed
     */
    areAllGoalsCompleted() {
        return Object.keys(DAILY_GOALS).every(goalId => this.isGoalCompleted(goalId));
    }

    /**
     * Check if all missions are completed
     */
    areAllMissionsCompleted() {
        return Object.values(this.data.daily.missions).every(mission => mission.completed);
    }

    /**
     * Check if it's a perfect day (all goals + missions)
     */
    isPerfectDay() {
        return this.areAllGoalsCompleted() && this.areAllMissionsCompleted();
    }

    /**
     * Check for new badges and award them
     */
    checkForBadges() {
        const today = this.dateKey;
        const newBadges = [];

        // Check daily goal badges
        Object.keys(DAILY_GOALS).forEach(goalId => {
            if (this.isGoalCompleted(goalId)) {
                const badgeId = `${goalId}_${today}`;
                if (!this.data.badges.some(badge => badge.id === badgeId)) {
                    const badge = {
                        id: badgeId,
                        type: 'goal',
                        icon: BADGES[goalId].icon,
                        name: BADGES[goalId].name,
                        date: today,
                        goalId: goalId
                    };
                    this.data.badges.push(badge);
                    newBadges.push(badge);
                }
            }
        });

        // Check mission badges
        Object.values(this.data.daily.missions).forEach(mission => {
            if (mission.completed) {
                const badgeId = `${mission.id}_${today}`;
                if (!this.data.badges.some(badge => badge.id === badgeId)) {
                    const badge = {
                        id: badgeId,
                        type: 'mission',
                        icon: mission.icon,
                        name: mission.title,
                        date: today,
                        missionId: mission.id
                    };
                    this.data.badges.push(badge);
                    newBadges.push(badge);
                }
            }
        });

        // Check combo badges
        if (this.areAllGoalsCompleted()) {
            const badgeId = `goal_master_${today}`;
            if (!this.data.badges.some(badge => badge.id === badgeId)) {
                const badge = {
                    id: badgeId,
                    type: 'combo',
                    icon: BADGES.goal_master.icon,
                    name: BADGES.goal_master.name,
                    date: today
                };
                this.data.badges.push(badge);
                newBadges.push(badge);
            }
        }

        if (this.areAllMissionsCompleted()) {
            const badgeId = `mission_hero_${today}`;
            if (!this.data.badges.some(badge => badge.id === badgeId)) {
                const badge = {
                    id: badgeId,
                    type: 'combo',
                    icon: BADGES.mission_hero.icon,
                    name: BADGES.mission_hero.name,
                    date: today
                };
                this.data.badges.push(badge);
                newBadges.push(badge);
            }
        }

        if (this.isPerfectDay()) {
            const badgeId = `perfect_day_${today}`;
            if (!this.data.badges.some(badge => badge.id === badgeId)) {
                const badge = {
                    id: badgeId,
                    type: 'combo',
                    icon: BADGES.perfect_day.icon,
                    name: BADGES.perfect_day.name,
                    date: today
                };
                this.data.badges.push(badge);
                newBadges.push(badge);
            }
        }

        return newBadges;
    }

    /**
     * Update achievement progress
     */
    updateAchievements() {
        ACHIEVEMENTS.forEach(achievement => {
            let currentCount = 0;

            switch (achievement.id) {
                case 'water_hero':
                    currentCount = this.calculateTotalGoalAmount('water');
                    break;
                case 'reading_master':
                    currentCount = this.calculateTotalGoalAmount('reading');
                    break;
                case 'stretch_guru':
                    currentCount = this.calculateTotalGoalAmount('stretch');
                    break;
                case 'language_legend':
                    currentCount = this.countDaysWhereGoalMet('duolingo');
                    break;
                case 'mission_master':
                    currentCount = this.countTotalMissionsCompleted();
                    break;
                case 'perfect_days':
                    currentCount = this.countPerfectDays();
                    break;
            }

            // Update achievement progress
            if (!this.data.achievements[achievement.id]) {
                this.data.achievements[achievement.id] = {
                    currentLevel: 0,
                    currentCount: 0,
                    unlockedLevels: []
                };
            }

            const achievementData = this.data.achievements[achievement.id];
            achievementData.currentCount = currentCount;

            // Check for level ups
            achievement.levels.forEach((level, index) => {
                if (currentCount >= level.threshold && !achievementData.unlockedLevels.includes(index)) {
                    achievementData.unlockedLevels.push(index);
                    achievementData.currentLevel = Math.max(achievementData.currentLevel, index + 1);
                }
            });
        });
    }

    /**
     * Count days where a specific goal was met
     */
    countDaysWhereGoalMet(goalId) {
        let count = 0;
        Object.values(this.data.history).forEach(day => {
            const goal = DAILY_GOALS[goalId];
            if (goal.type === 'counter' && day.goals[goalId] >= goal.target) {
                count++;
            } else if (goal.type === 'checkbox' && day.goals[goalId] === true) {
                count++;
            }
        });
        return count;
    }

    /**
     * Count total missions completed across all days
     */
    countTotalMissionsCompleted() {
        let count = 0;
        Object.values(this.data.history).forEach(day => {
            if (day.missions) {
                Object.values(day.missions).forEach(mission => {
                    if (mission.completed) count++;
                });
            }
        });
        return count;
    }

    /**
     * Count perfect days (all goals + missions complete)
     */
    countPerfectDays() {
        let count = 0;
        Object.values(this.data.history).forEach(day => {
            let allGoalsComplete = Object.keys(DAILY_GOALS).every(goalId => {
                const goal = DAILY_GOALS[goalId];
                if (goal.type === 'counter') {
                    return day.goals[goalId] >= goal.target;
                } else if (goal.type === 'checkbox') {
                    return day.goals[goalId] === true;
                }
                return false;
            });

            let allMissionsComplete = true;
            if (day.missions && Object.keys(day.missions).length > 0) {
                allMissionsComplete = Object.values(day.missions).every(mission => mission.completed);
            }

            if (allGoalsComplete && allMissionsComplete) {
                count++;
            }
        });
        return count;
    }

    /**
     * Calculate total amount for a specific goal across all days
     */
    calculateTotalGoalAmount(goalId) {
        let total = 0;
        Object.values(this.data.history).forEach(day => {
            if (day.goals && day.goals[goalId] !== undefined) {
                if (typeof day.goals[goalId] === 'number') {
                    total += day.goals[goalId];
                } else if (day.goals[goalId] === true) {
                    total += 1; // For checkbox goals like Duolingo
                }
            }
        });
        return total;
    }

    /**
     * Update statistics
     */
    updateStats() {
        this.data.stats.totalDays = Object.keys(this.data.history).length;
        this.data.stats.perfectDays = this.countPerfectDays();
        this.data.stats.longestStreak = this.calculateLongestStreak();
        this.data.stats.totalMissions = this.countTotalMissionsCompleted();
    }

    /**
     * Get week view data (7 days ending today)
     */
    getWeekViewData() {
        const weekData = [];
        const today = new Date(this.currentDate);
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateKey = this.formatDateKey(date);
            
            const dayData = this.data.history[dateKey] || {
                goals: { water: 0, stretch: 0, duolingo: false, reading: 0 },
                missions: {}
            };

            const goalsCompleted = Object.keys(DAILY_GOALS).filter(goalId => {
                const goal = DAILY_GOALS[goalId];
                if (goal.type === 'counter') {
                    return dayData.goals[goalId] >= goal.target;
                } else if (goal.type === 'checkbox') {
                    return dayData.goals[goalId] === true;
                }
                return false;
            }).length;

            const missionsCompleted = Object.values(dayData.missions || {}).filter(m => m.completed).length;
            const totalMissions = Object.keys(dayData.missions || {}).length || 3;
            const totalGoals = Object.keys(DAILY_GOALS).length;

            let status = 'missed';
            if (goalsCompleted === totalGoals && missionsCompleted === totalMissions) {
                status = 'completed';
            } else if (goalsCompleted > 0 || missionsCompleted > 0) {
                status = 'partial';
            }

            weekData.push({
                date: date,
                dateKey: dateKey,
                dayName: date.toLocaleDateString('en', { weekday: 'short' }),
                dayNumber: date.getDate(),
                goalsCompleted,
                totalGoals,
                missionsCompleted,
                totalMissions,
                status,
                isToday: dateKey === this.dateKey
            });
        }

        return weekData;
    }

    /**
     * Get today's badges
     */
    getTodaysBadges() {
        return this.data.badges.filter(badge => badge.date === this.dateKey);
    }

    /**
     * Get achievement data for display
     */
    getAchievementsData() {
        return ACHIEVEMENTS.map(achievement => {
            const data = this.data.achievements[achievement.id] || {
                currentLevel: 0,
                currentCount: 0,
                unlockedLevels: []
            };

            const nextLevelIndex = data.currentLevel;
            const nextLevel = achievement.levels[nextLevelIndex];
            const currentLevelData = achievement.levels[data.currentLevel - 1];

            return {
                ...achievement,
                currentCount: data.currentCount,
                currentLevel: data.currentLevel,
                nextLevel: nextLevel,
                currentLevelData: currentLevelData,
                progress: nextLevel ? Math.min(100, (data.currentCount / nextLevel.threshold) * 100) : 100
            };
        });
    }

    /**
     * Calculate the longest streak of perfect days
     */
    calculateLongestStreak() {
        let longestStreak = 0;
        let currentStreak = 0;
        
        const sortedDates = Object.keys(this.data.history).sort();
        
        for (const dateKey of sortedDates) {
            const dayData = this.data.history[dateKey];
            if (dayData.completed) {
                currentStreak++;
                longestStreak = Math.max(longestStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        }
        
        return longestStreak;
    }

    /**
     * Get XP data for display
     */
    getXPData() {
        const currentLevel = this.data.xp.currentLevel;
        const totalXP = this.data.xp.totalXP;
        
        // Debug logging
        console.log('XP Debug - currentLevel:', currentLevel, 'totalXP:', totalXP);
        
        // Handle max level case
        if (currentLevel >= 20) {
            const levelTitles = this.getLevelTitles();
            return {
                currentLevel: 20,
                currentXP: 0,
                totalXP: totalXP,
                xpNeeded: 0,
                nextLevel: {
                    level: 20,
                    xpRequired: 0,
                    xpProgress: 0
                },
                progress: 100,
                currentLevelTitle: levelTitles[20] || 'Eternal Excellence',
                isMaxLevel: true
            };
        }
        
        // Calculate XP required for next level
        const xpForNextLevel = this.calculateXPForLevel(currentLevel + 1);
        const xpForCurrentLevel = this.calculateXPForLevel(currentLevel);
        
        // Debug logging
        console.log('XP Debug - xpForNextLevel:', xpForNextLevel, 'xpForCurrentLevel:', xpForCurrentLevel);
        
        // XP needed to reach next level (total amount needed)
        const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
        
        // XP earned in current level (for progress bar)
        const xpEarnedInLevel = totalXP - xpForCurrentLevel;
        
        // Debug logging
        console.log('XP Debug - xpNeededForNextLevel:', xpNeededForNextLevel, 'xpEarnedInLevel:', xpEarnedInLevel);
        
        // XP still needed to reach next level (this is what we display)
        const xpStillNeeded = xpForNextLevel - totalXP;
        
        // Progress percentage
        const progress = Math.min(100, (xpEarnedInLevel / xpNeededForNextLevel) * 100);
        
        // Get level titles
        const levelTitles = this.getLevelTitles();
        const currentLevelTitle = levelTitles[currentLevel] || 'Rookie';
        
        return {
            currentLevel,
            currentXP: xpEarnedInLevel, // XP earned in current level
            totalXP: totalXP,
            xpNeeded: xpNeededForNextLevel, // Total XP needed for this level
            nextLevel: {
                level: currentLevel + 1,
                xpRequired: xpNeededForNextLevel,
                xpProgress: xpEarnedInLevel
            },
            progress,
            currentLevelTitle,
            isMaxLevel: false
        };
    }

    /**
     * Calculate XP required for a specific level
     */
    calculateXPForLevel(level) {
        // Use the predefined level requirements from data.js
        console.log('calculateXPForLevel - level:', level, 'XP_LEVEL_REQUIREMENTS[level]:', XP_LEVEL_REQUIREMENTS[level]);
        console.log('Full XP_LEVEL_REQUIREMENTS object:', XP_LEVEL_REQUIREMENTS);
        
        // Fallback if XP_LEVEL_REQUIREMENTS is not available
        if (typeof XP_LEVEL_REQUIREMENTS === 'undefined') {
            console.error('XP_LEVEL_REQUIREMENTS is undefined! Using fallback calculation.');
            // Simple fallback: Level 1 = 0, each subsequent level needs 100 more
            return level <= 1 ? 0 : (level - 1) * 100;
        }
        
        // Explicit handling to avoid any key issues
        if (level === 1) return 0;
        if (level === 2) return 100;
        if (level === 3) return 250;
        if (level === 4) return 450;
        if (level === 5) return 700;
        if (level === 6) return 1000;
        if (level === 7) return 1350;
        if (level === 8) return 1750;
        if (level === 9) return 2200;
        if (level === 10) return 2700;
        if (level === 11) return 3250;
        if (level === 12) return 3850;
        if (level === 13) return 4500;
        if (level === 14) return 5200;
        if (level === 15) return 5950;
        if (level === 16) return 6750;
        if (level === 17) return 7600;
        if (level === 18) return 8500;
        if (level === 19) return 9450;
        if (level === 20) return 10450;
        
        // Default to max level for anything beyond 20
        return 10450;
    }

    /**
     * Get level titles
     */
    getLevelTitles() {
        return XP_LEVEL_TITLES;
    }

    /**
     * Get XP requirements for all levels
     */
    getXPRequirements() {
        return XP_LEVEL_REQUIREMENTS;
    }

    /**
     * Add XP to the user
     */
    addXP(amount, reason = '') {
        const oldLevel = this.data.xp.currentLevel;
        
        // Add XP to total
        this.data.xp.totalXP += amount;
        
        // Check for level up based on total XP
        const newLevel = this.calculateLevelFromXP(this.data.xp.totalXP);
        let leveledUp = false;
        
        if (newLevel > oldLevel) {
            leveledUp = true;
            this.data.xp.currentLevel = newLevel;
            this.data.xp.levelHistory.push({
                level: newLevel,
                date: this.dateKey,
                xp: this.data.xp.totalXP
            });
            
            // Trigger level up event
            if (typeof window.triggerLevelUpCelebration === 'function') {
                const levelTitle = XP_LEVEL_TITLES[newLevel] || 'Habit Master';
                window.triggerLevelUpCelebration(newLevel, levelTitle);
            }
        }
        
        // Record XP gain (keep last 50 entries to avoid bloat)
        this.data.xp.xpHistory.push({
            amount,
            reason,
            date: this.dateKey,
            totalXP: this.data.xp.totalXP
        });
        
        // Keep only last 50 XP history entries for performance
        if (this.data.xp.xpHistory.length > 50) {
            this.data.xp.xpHistory = this.data.xp.xpHistory.slice(-50);
        }
        
        this.saveData();
        
        // Update UI
        if (typeof window.updateXPDisplay === 'function') {
            window.updateXPDisplay();
        }
        
        // Show XP notification
        if (typeof window.showXPNotification === 'function') {
            window.showXPNotification(`+${amount} XP! ${reason}`, 'xp-gain');
        }
        
        return { oldLevel, newLevel: this.data.xp.currentLevel, leveledUp };
    }

    /**
     * Calculate level from total XP
     */
    calculateLevelFromXP(totalXP) {
        // Use the predefined level requirements to determine current level
        for (let level = 20; level >= 1; level--) {
            if (totalXP >= XP_LEVEL_REQUIREMENTS[level]) {
                return level;
            }
        }
        return 1; // Default to level 1
    }

    /**
     * Award XP for completing a goal
     */
    awardGoalXP(goalId, isExceeding = false) {
        const goal = DAILY_GOALS[goalId];
        let xpAmount = XP_REWARDS.dailyGoal;
        
        // Bonus XP for exceeding the goal
        if (isExceeding) {
            xpAmount += XP_REWARDS.dailyGoalBonus;
        }
        
        const reason = `Completed ${goal ? goal.title : goalId} goal${isExceeding ? ' (exceeded!)' : ''}`;
        this.addXP(xpAmount, reason);
    }

    /**
     * Award XP for completing a mission
     */
    awardMissionXP(missionId) {
        const mission = this.data.daily.missions[missionId];
        const reason = `Completed ${mission ? mission.title : missionId} mission`;
        this.addXP(XP_REWARDS.mission, reason);
    }

    /**
     * Award XP for perfect day
     */
    awardPerfectDayXP() {
        this.addXP(XP_REWARDS.perfectDay, 'Perfect Day - All goals and missions completed!');
    }


}