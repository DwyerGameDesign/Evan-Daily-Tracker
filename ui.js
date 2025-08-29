// ui.js - User interface rendering and interactions

let habitTracker;
let confettiInterval;

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', function() {
    habitTracker = new HabitTracker();
    initializeUI();
    renderUI();
});

/**
 * Set up event listeners and initial UI state
 */
function initializeUI() {
    // Check for date change and refresh data if needed
    if (habitTracker) {
        const dateChanged = habitTracker.checkDateChange();
        if (dateChanged) {
            console.log('Date changed on app initialization');
        }
    }
    
    // Date display
    updateDateDisplay();

    // Mood selector
    setupMoodSelector();

    // Goal controls
    setupGoalControls();

    // Tab navigation
    setupTabNavigation();

    // Modal close button
    document.getElementById('close-modal').addEventListener('click', closeModal);

    // Click outside modal to close
    document.getElementById('celebration-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // History controls
    setupHistoryControls();

    // Account controls
    setupAccountControls();
}

/**
 * Set up tab navigation functionality
 */
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
            
            // Render specific content for the tab
            switch(targetTab) {
                case 'today':
                    renderTodayTab();
                    break;
                case 'history':
                    renderHistoryTab();
                    break;
                case 'badges':
                    renderBadgesTab();
                    break;
                case 'progress':
                    renderProgressTab();
                    break;
                case 'account':
                    renderAccountTab();
                    break;
            }
        });
    });
}

/**
 * Set up history controls
 */
function setupHistoryControls() {
    document.getElementById('export-history').addEventListener('click', () => {
        window.exportHabitData();
        showInfoModal('Export Complete', 'Your data has been downloaded as a JSON file!');
    });

    document.getElementById('import-history').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const success = window.importHabitData(e.target.result);
                    if (success) {
                        showInfoModal('Import Complete', 'Data imported successfully! The page will reload.');
                    } else {
                        showInfoModal('Import Failed', 'Failed to import data. Please check the file format.');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    });
}

/**
 * Set up account controls
 */
function setupAccountControls() {
    document.getElementById('export-data-btn').addEventListener('click', () => {
        window.exportHabitData();
        showInfoModal('Export Complete', 'Your data has been downloaded as a JSON file!');
    });

    document.getElementById('import-data-btn').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const success = window.importHabitData(e.target.result);
                    if (success) {
                        showInfoModal('Import Complete', 'Data imported successfully! The page will reload.');
                    } else {
                        showInfoModal('Import Failed', 'Failed to import data. Please check the file format.');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    });

    document.getElementById('reset-data-btn').addEventListener('click', () => {
        window.resetHabitData();
    });
}

/**
 * Render today tab content
 */
function renderTodayTab() {
    renderGoalsSection();
    renderMissionsSection();
    renderWeeklyView();
}

/**
 * Render history tab content
 */
function renderHistoryTab() {
    renderHistoryTable();
}

/**
 * Render badges tab content
 */
function renderBadgesTab() {
    renderAllBadges();
}

/**
 * Render progress tab content
 */
function renderProgressTab() {
    renderAchievementsSection();
}

/**
 * Render all possible badges with earned status
 */
function renderAllBadges() {
    const badgesGrid = document.getElementById('allBadgesGrid');
    if (!badgesGrid) return;
    
    badgesGrid.innerHTML = '';
    
    // Get all earned badge IDs
    const earnedBadgeIds = habitTracker.data.badges.map(badge => {
        if (badge.type === 'goal') {
            return badge.goalId;
        } else if (badge.type === 'mission') {
            return badge.missionId;
        } else if (badge.type === 'combo') {
            return badge.name.toLowerCase().replace(/\s+/g, '_');
        }
        return badge.id;
    });
    
    // Create badges for all possible goals
    Object.keys(DAILY_GOALS).forEach(goalId => {
        const goal = DAILY_GOALS[goalId];
        const isEarned = earnedBadgeIds.includes(goalId);
        const badge = BADGES[goalId];
        
        const badgeElement = createBadgeElement(badge.icon, badge.name, isEarned, `Daily Goal: ${goal.title}`);
        badgesGrid.appendChild(badgeElement);
    });
    
    // Create badges for all possible missions
    DAILY_MISSIONS.forEach(mission => {
        const isEarned = earnedBadgeIds.includes(mission.id);
        const badgeElement = createBadgeElement(mission.icon, mission.title, isEarned, `Mission: ${mission.description}`);
        badgesGrid.appendChild(badgeElement);
    });
    
    // Create combo badges
    const comboBadges = ['perfect_day', 'goal_master', 'mission_hero', 'streak_starter', 'consistent', 'weekend_warrior'];
    comboBadges.forEach(badgeId => {
        const badge = BADGES[badgeId];
        const isEarned = earnedBadgeIds.includes(badgeId);
        const badgeElement = createBadgeElement(badge.icon, badge.name, isEarned, 'Special Achievement');
        badgesGrid.appendChild(badgeElement);
    });
}

/**
 * Create a badge element
 */
function createBadgeElement(icon, name, isEarned, description) {
    const badgeElement = document.createElement('div');
    badgeElement.className = `badge ${isEarned ? 'earned' : 'locked'}`;
    
    if (isEarned) {
        badgeElement.innerHTML = `
            <div class="badge-icon">${icon}</div>
            <div class="badge-name">${name}</div>
            <div class="badge-description">${description}</div>
        `;
    } else {
        badgeElement.innerHTML = `
            <div class="badge-icon">🔒</div>
            <div class="badge-name">Locked</div>
        `;
    }
    
    return badgeElement;
}

/**
 * Render account tab content
 */
function renderAccountTab() {
    renderAccountStats();
}

/**
 * Render history table with all progress data
 */
function renderHistoryTable() {
    const tableBody = document.getElementById('historyTableBody');
    const historyData = habitTracker.data.history;
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // Get all dates and sort them (newest first)
    const dates = Object.keys(historyData).sort((a, b) => new Date(b) - new Date(a));
    
    if (dates.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999; font-style: italic;">No history data available yet. Complete some goals to see your progress!</td></tr>';
        return;
    }
    
    dates.forEach(dateKey => {
        const dayData = historyData[dateKey];
        const date = new Date(dateKey);
        const formattedDate = date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
        
        // Calculate goals completion
        const goalsCompleted = Object.keys(DAILY_GOALS).filter(goalId => {
            const goal = DAILY_GOALS[goalId];
            if (goal.type === 'counter') {
                return dayData.goals[goalId] >= goal.target;
            } else if (goal.type === 'checkbox') {
                return dayData.goals[goalId] === true;
            }
            return false;
        }).length;
        
        const totalGoals = Object.keys(DAILY_GOALS).length;
        const goalsText = `${goalsCompleted}/${totalGoals}`;
        
        // Calculate missions completion
        const missionsCompleted = Object.values(dayData.missions || {}).filter(m => m.completed).length;
        const totalMissions = Object.keys(dayData.missions || {}).length;
        const missionsText = totalMissions > 0 ? `${missionsCompleted}/${totalMissions}` : '0/0';
        
        // Mood display
        const moodText = dayData.mood?.emoji || '😐';
        
        // Notes (mood text)
        const notes = dayData.mood?.text || '';
        
        // Status
        let status = '❌';
        let statusClass = '';
        if (goalsCompleted === totalGoals && missionsCompleted === totalMissions && totalMissions > 0) {
            status = '✅ Perfect';
            statusClass = 'perfect';
        } else if (goalsCompleted === totalGoals) {
            status = '🎯 Goals Complete';
            statusClass = 'goals-complete';
        } else if (goalsCompleted > 0 || missionsCompleted > 0) {
            status = '📊 Partial';
            statusClass = 'partial';
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${formattedDate}</strong></td>
            <td>${goalsText}</td>
            <td>${missionsText}</td>
            <td>${moodText}</td>
            <td>${notes}</td>
            <td class="${statusClass}">${status}</td>
        `;
        
        // Add click handler for row details
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => showDayDetails({ dateKey, dayName: formattedDate }));
        
        tableBody.appendChild(row);
    });
}

/**
 * Render account statistics
 */
function renderAccountStats() {
    const statsContainer = document.getElementById('accountStats');
    if (!statsContainer || !habitTracker) return;
    
    habitTracker.updateStats();
    const stats = habitTracker.data.stats;
    const achievements = habitTracker.getAchievementsData();
    const totalBadges = habitTracker.data.badges.length;
    
    // Calculate additional stats
    const totalGoalsCompleted = Object.values(habitTracker.data.history).reduce((total, day) => {
        return total + Object.keys(DAILY_GOALS).filter(goalId => {
            const goal = DAILY_GOALS[goalId];
            if (goal.type === 'counter') {
                return day.goals[goalId] >= goal.target;
            } else if (goal.type === 'checkbox') {
                return day.goals[goalId] === true;
            }
            return false;
        }).length;
    }, 0);
    
    const totalAchievementLevels = achievements.reduce((total, achievement) => {
        return total + achievement.currentLevel;
    }, 0);
    
    const successRate = stats.totalDays > 0 ? Math.round((stats.perfectDays / stats.totalDays) * 100) : 0;
    
    statsContainer.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div class="stat-item">
                <div class="stat-icon">📅</div>
                <div class="stat-value">${stats.totalDays}</div>
                <div class="stat-label">Total Days</div>
            </div>
            <div class="stat-item">
                <div class="stat-icon">⭐</div>
                <div class="stat-value">${stats.perfectDays}</div>
                <div class="stat-label">Perfect Days</div>
            </div>
            <div class="stat-item">
                <div class="stat-icon">🔥</div>
                <div class="stat-value">${stats.longestStreak}</div>
                <div class="stat-label">Longest Streak</div>
            </div>
            <div class="stat-item">
                <div class="stat-icon">🎯</div>
                <div class="stat-value">${stats.totalMissions}</div>
                <div class="stat-label">Total Missions</div>
            </div>
            <div class="stat-item">
                <div class="stat-icon">🏆</div>
                <div class="stat-value">${totalBadges}</div>
                <div class="stat-label">Total Badges</div>
            </div>
            <div class="stat-item">
                <div class="stat-icon">🌟</div>
                <div class="stat-value">${totalAchievementLevels}</div>
                <div class="stat-label">Achievement Levels</div>
            </div>
            <div class="stat-item">
                <div class="stat-icon">✅</div>
                <div class="stat-value">${totalGoalsCompleted}</div>
                <div class="stat-label">Goals Completed</div>
            </div>
            <div class="stat-item">
                <div class="stat-icon">📊</div>
                <div class="stat-value">${successRate}%</div>
                <div class="stat-label">Success Rate</div>
            </div>
        </div>
        
        <style>
            .stat-item {
                background: rgba(255,255,255,0.1);
                border-radius: 10px;
                padding: 15px;
                text-align: center;
                border: 1px solid rgba(255,255,255,0.2);
            }
            .stat-icon {
                font-size: 2rem;
                margin-bottom: 8px;
            }
            .stat-value {
                font-size: 1.5rem;
                font-weight: bold;
                color: #4fc3f7;
                margin-bottom: 5px;
            }
            .stat-label {
                color: #b0bec5;
                font-size: 0.9rem;
            }
        </style>
    `;
}

/**
 * Update date display
 */
function updateDateDisplay() {
    const currentDate = document.getElementById('currentDate');
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    currentDate.textContent = habitTracker.currentDate.toLocaleDateString('en-US', options);
}

/**
 * Set up mood selector functionality
 */
function setupMoodSelector() {
    const moodButtons = document.querySelectorAll('.mood-btn');
    const moodTextInput = document.getElementById('moodText');

    // Load current mood
    if (habitTracker.data.daily.mood.emoji) {
        const selectedBtn = document.querySelector(`[data-mood="${habitTracker.data.daily.mood.emoji}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }
    }
    if (habitTracker.data.daily.mood.text) {
        moodTextInput.value = habitTracker.data.daily.mood.text;
    }

    // Mood button event listeners
    moodButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all buttons
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            // Add selected class to clicked button
            this.classList.add('selected');
            
            const mood = this.dataset.mood;
            habitTracker.setMood(mood, moodTextInput.value);
            
            // Animate the selection
            this.style.transform = 'scale(1.3)';
            setTimeout(() => {
                this.style.transform = 'scale(1.2)';
            }, 150);
        });
    });

    // Mood text input event listener
    moodTextInput.addEventListener('input', function() {
        const selectedMood = document.querySelector('.mood-btn.selected');
        const emoji = selectedMood ? selectedMood.dataset.mood : null;
        habitTracker.setMood(emoji, this.value);
    });
}

/**
 * Set up goal control functionality
 */
function setupGoalControls() {
    const goalCards = document.querySelectorAll('.goal-card');

    goalCards.forEach(card => {
        const goalId = card.dataset.goal;
        const goal = DAILY_GOALS[goalId];
        const minusBtn = card.querySelector('.btn-minus');
        const plusBtn = card.querySelector('.btn-plus');
        const checkbox = card.querySelector('input[type="checkbox"]');

        if (goal.type === 'counter') {
            // Counter controls
            minusBtn.addEventListener('click', () => {
                const currentValue = habitTracker.data.daily.goals[goalId];
                habitTracker.updateGoal(goalId, currentValue - 1);
                renderGoalProgress(goalId);
                checkForCelebrations();
                
                // Button animation
                animateButton(minusBtn);
            });

            plusBtn.addEventListener('click', () => {
                const currentValue = habitTracker.data.daily.goals[goalId];
                habitTracker.updateGoal(goalId, currentValue + 1);
                renderGoalProgress(goalId);
                checkForCelebrations();
                
                // Button animation
                animateButton(plusBtn);
            });
        } else if (goal.type === 'checkbox') {
            // Checkbox control
            checkbox.addEventListener('change', () => {
                habitTracker.updateGoal(goalId, checkbox.checked);
                renderGoalProgress(goalId);
                checkForCelebrations();
                
                if (checkbox.checked) {
                    showMiniCelebration(card);
                }
            });
        }
    });
}

/**
 * Animate button press
 */
function animateButton(button) {
    button.style.transform = 'scale(0.9)';
    setTimeout(() => {
        button.style.transform = 'scale(1.1)';
        setTimeout(() => {
            button.style.transform = '';
        }, 100);
    }, 100);
}

/**
 * Show mini celebration for individual completions
 */
function showMiniCelebration(element) {
    // Create sparkle effect
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background: #ffd700;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: sparkle 1s ease-out forwards;
        `;
        
        const rect = element.getBoundingClientRect();
        sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
        sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    }
    
    // Add CSS for sparkle animation if not exists
    if (!document.querySelector('#sparkle-keyframes')) {
        const style = document.createElement('style');
        style.id = 'sparkle-keyframes';
        style.textContent = `
            @keyframes sparkle {
                0% { 
                    transform: translateY(0) scale(0);
                    opacity: 1;
                }
                100% { 
                    transform: translateY(-50px) scale(1);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Render the entire UI
 */
function renderUI() {
    updateDateDisplay();
    updateXPDisplay();
    renderGoalsSection();
    renderMissionsSection();
    renderWeeklyView();
    renderBadgesSection();
    renderAchievementsSection();
}

/**
 * Render goals section with current progress
 */
function renderGoalsSection() {
    Object.keys(DAILY_GOALS).forEach(goalId => {
        renderGoalProgress(goalId);
    });
}

/**
 * Render individual goal progress
 */
function renderGoalProgress(goalId) {
    const goalCard = document.querySelector(`[data-goal="${goalId}"]`);
    const goal = DAILY_GOALS[goalId];
    const currentValue = habitTracker.data.daily.goals[goalId];
    const isCompleted = habitTracker.isGoalCompleted(goalId);

    if (goal.type === 'counter') {
        const progressFill = goalCard.querySelector('.progress-fill');
        const progressText = goalCard.querySelector('.progress-text');
        
        const percentage = Math.min(100, (currentValue / goal.target) * 100);
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${currentValue} / ${goal.target} ${goal.unit}`;
        
        // Update card appearance with animation
        if (isCompleted && !goalCard.classList.contains('completed')) {
            goalCard.classList.add('completed');
            showMiniCelebration(goalCard);
        } else if (!isCompleted) {
            goalCard.classList.remove('completed');
        }
    } else if (goal.type === 'checkbox') {
        const checkbox = goalCard.querySelector('input[type="checkbox"]');
        checkbox.checked = currentValue;
        
        // Update card appearance
        if (isCompleted && !goalCard.classList.contains('completed')) {
            goalCard.classList.add('completed');
        } else if (!isCompleted) {
            goalCard.classList.remove('completed');
        }
    }
}

/**
 * Render missions section
 */
function renderMissionsSection() {
    const missionsGrid = document.getElementById('missionsGrid');
    missionsGrid.innerHTML = '';

    Object.values(habitTracker.data.daily.missions).forEach(mission => {
        const missionCard = createMissionCard(mission);
        missionsGrid.appendChild(missionCard);
    });
}

/**
 * Create a mission card element
 */
function createMissionCard(mission) {
    const card = document.createElement('div');
    card.className = `mission-card ${mission.completed ? 'completed' : ''}`;
    
    card.innerHTML = `
        <div class="mission-header">
            <div class="mission-icon">${mission.icon}</div>
            <div class="mission-title">${mission.title}</div>
        </div>
        <div class="mission-description">${mission.description}</div>
        <div class="mission-checkbox">
            <input type="checkbox" id="mission-${mission.id}" ${mission.completed ? 'checked' : ''}>
            <label for="mission-${mission.id}">Completed!</label>
        </div>
    `;

    // Add event listener for mission toggle
    const checkbox = card.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
        const wasCompleted = habitTracker.toggleMission(mission.id);
        card.classList.toggle('completed', wasCompleted);
        
        // Animate completion
        if (wasCompleted) {
            animateElement(card, 'completePulse');
            showMiniCelebration(card);
            setTimeout(() => showConfetti(), 200);
        }
        
        checkForCelebrations();
        renderBadgesSection(); // Update badges display
    });

    return card;
}

/**
 * Render weekly view section
 */
function renderWeeklyView() {
    const weekView = document.getElementById('weekView');
    const weekData = habitTracker.getWeekViewData();
    
    const weekGrid = document.createElement('div');
    weekGrid.className = 'week-grid';
    
    weekData.forEach(day => {
        const dayCard = document.createElement('div');
        dayCard.className = `day-card ${day.isToday ? 'today' : ''}`;
        
        const completionPercentage = Math.round(
            ((day.goalsCompleted / day.totalGoals) + (day.missionsCompleted / day.totalMissions)) / 2 * 100
        );
        
        let displayText = '';
        if (day.status === 'completed') {
            displayText = '✅';
        } else if (day.status === 'partial') {
            displayText = completionPercentage + '%';
        } else if (day.isToday) {
            displayText = 'Today';
        } else {
            displayText = '❌';
        }
        
        dayCard.innerHTML = `
            <div class="day-name">${day.dayName}</div>
            <div class="day-date">${day.dayNumber}</div>
            <div class="day-progress ${day.status} ${day.isToday ? 'today' : ''}">${displayText}</div>
        `;
        
        // Add click handler for day details
        if (!day.isToday && Object.keys(habitTracker.data.history).includes(day.dateKey)) {
            dayCard.style.cursor = 'pointer';
            dayCard.addEventListener('click', () => showDayDetails(day));
        }
        
        weekGrid.appendChild(dayCard);
    });
    
    weekView.innerHTML = '';
    weekView.appendChild(weekGrid);
}

/**
 * Show details for a specific day
 */
function showDayDetails(day) {
    const dayData = habitTracker.data.history[day.dateKey];
    if (!dayData) return;
    
    let detailsHTML = `<strong>${day.dayName}, ${day.dayNumber}</strong><br><br>`;
    
    // Goals completed
    detailsHTML += '<strong>Goals:</strong><br>';
    Object.keys(DAILY_GOALS).forEach(goalId => {
        const goal = DAILY_GOALS[goalId];
        const value = dayData.goals[goalId];
        const completed = goal.type === 'counter' ? value >= goal.target : value === true;
        detailsHTML += `${goal.icon} ${goal.title}: ${completed ? '✅' : '❌'}<br>`;
    });
    
    // Missions completed
    if (dayData.missions && Object.keys(dayData.missions).length > 0) {
        detailsHTML += '<br><strong>Missions:</strong><br>';
        Object.values(dayData.missions).forEach(mission => {
            detailsHTML += `${mission.icon} ${mission.title}: ${mission.completed ? '✅' : '❌'}<br>`;
        });
    }
    
    // Mood
    if (dayData.mood && dayData.mood.emoji) {
        detailsHTML += `<br><strong>Mood:</strong> ${dayData.mood.emoji}`;
        if (dayData.mood.text) {
            detailsHTML += ` - ${dayData.mood.text}`;
        }
    }
    
    // Show in modal
    showInfoModal('Day Details', detailsHTML);
}

/**
 * Show info modal with custom content
 */
function showInfoModal(title, content) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('info-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'info-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2 id="info-modal-title"></h2>
                <div id="info-modal-content"></div>
                <button id="close-info-modal">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add event listeners
        document.getElementById('close-info-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    }
    
    // Set content and show
    document.getElementById('info-modal-title').textContent = title;
    document.getElementById('info-modal-content').innerHTML = content;
    modal.style.display = 'block';
}

/**
 * Render badges section
 */
function renderBadgesSection() {
    // Render the badge collection
    renderAllBadges();
}

/**
 * Get badge description based on type
 */
function getBadgeDescription(badge) {
    if (badge.type === 'goal') {
        const goal = DAILY_GOALS[badge.goalId];
        return `Completed daily goal: ${goal.title}`;
    } else if (badge.type === 'mission') {
        return `Completed special mission!`;
    } else if (badge.type === 'combo') {
        switch (badge.name) {
            case 'Perfect Day':
                return 'Completed ALL daily goals AND missions in one day!';
            case 'Goal Master':
                return 'Completed all daily goals in one day!';
            case 'Mission Hero':
                return 'Completed all daily missions in one day!';
            default:
                return 'Special achievement unlocked!';
        }
    }
    return 'Achievement unlocked!';
}

/**
 * Render achievements section
 */
function renderAchievementsSection() {
    const achievementsList = document.getElementById('achievementsList');
    const achievements = habitTracker.getAchievementsData();
    
    achievementsList.innerHTML = '';
    
    achievements.forEach(achievement => {
        const achievementElement = document.createElement('div');
        achievementElement.className = 'achievement';
        
        const nextThreshold = achievement.nextLevel ? achievement.nextLevel.threshold : achievement.currentCount;
        const progressText = achievement.nextLevel ? 
            `${achievement.currentCount} / ${nextThreshold}` :
            `${achievement.currentCount} (MAX!)`;
        
        const currentReward = achievement.currentLevelData ? achievement.currentLevelData.reward : 'Not Started';
        const nextReward = achievement.nextLevel ? achievement.nextLevel.reward : 'MAX LEVEL!';
        
        // Get the goal information from ACHIEVEMENTS array
        const achievementConfig = ACHIEVEMENTS.find(a => a.id === achievement.id);
        const goalText = achievementConfig ? achievementConfig.goal : '';
        
        achievementElement.innerHTML = `
            <div class="achievement-header">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-title">${achievement.name}</div>
                    <div class="achievement-goal">${goalText}</div>
                    <div class="achievement-description">${achievement.description}</div>
                </div>
            </div>
            <div class="achievement-progress">
                <div class="achievement-bar">
                    <div class="achievement-fill" style="width: ${achievement.progress}%"></div>
                </div>
                <div class="achievement-text">${progressText}</div>
            </div>
            <div class="achievement-rewards">
                <div class="current-reward">Current: ${currentReward}</div>
                ${achievement.nextLevel ? `<div class="next-reward">Next: ${nextReward}</div>` : ''}
            </div>
        `;
        
        // Add click handler for achievement details
        achievementElement.style.cursor = 'pointer';
        achievementElement.addEventListener('click', () => {
            showInfoModal('Achievement Details', `
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">${achievement.icon}</div>
                    <strong>${achievement.name}</strong><br>
                    ${achievement.description}<br><br>
                    
                    <strong>Current Level:</strong> ${achievement.currentLevel > 0 ? achievement.currentLevel + ' - ' + currentReward : 'Not Started'}<br>
                    <strong>Progress:</strong> ${achievement.currentCount} / ${nextThreshold}<br>
                    <strong>Next Reward:</strong> ${nextReward}<br><br>
                    
                    <div style="text-align: left; max-height: 200px; overflow-y: auto;">
                        <strong>All Levels:</strong><br>
                        ${achievement.levels.map((level, index) => 
                            `Level ${index + 1}: ${level.reward} (${level.threshold}) ${achievement.currentLevel > index ? '✅' : ''}`
                        ).join('<br>')}
                    </div>
                </div>
            `);
        });
        
        achievementsList.appendChild(achievementElement);
    });
}

/**
 * Check for celebrations and show modal if appropriate
 */
function checkForCelebrations() {
    const newBadges = habitTracker.checkForBadges();
    
    // Check for new achievements
    checkForAchievements();
    
    // Update UI components
    renderBadgesSection();
    renderGoalsSection();
    renderWeeklyView();
    renderAchievementsSection();
    
    // Show celebration for new badges
    if (newBadges.length > 0) {
        setTimeout(() => showConfetti(), 100);
        
        // Show badge notifications
        newBadges.forEach(badge => {
            showBadgeNotification(badge);
        });
        
        // Show modal for special achievements
        const hasSpecialBadge = newBadges.some(badge => 
            badge.type === 'combo' || newBadges.length >= 2
        );
        
        if (hasSpecialBadge) {
            setTimeout(() => showCelebrationModal(newBadges), 500);
        }
    }
    
    // Check for perfect day
    if (habitTracker.isPerfectDay() && !habitTracker.data.daily.celebrated) {
        habitTracker.data.daily.celebrated = true;
        habitTracker.saveData();
        
        setTimeout(() => {
            showBigCelebration();
            showCelebrationModal([{
                icon: '🌟',
                name: 'PERFECT DAY!',
                message: 'You completed ALL your daily goals AND missions! You are absolutely AMAZING! 🎉'
            }]);
        }, 1000);
    }
}

/**
 * Show big celebration with extra confetti
 */
function showBigCelebration() {
    // Multiple waves of confetti
    showConfetti();
    setTimeout(() => showConfetti(), 300);
    setTimeout(() => showConfetti(), 600);
    setTimeout(() => showConfetti(), 900);
    
    // Play celebration sound (if supported)
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        // Audio not supported, that's okay
    }
}

/**
 * Show celebration modal
 */
function showCelebrationModal(badges) {
    const modal = document.getElementById('celebration-modal');
    const celebrationText = document.getElementById('celebration-text');
    
    let message = '';
    if (badges.length === 1 && badges[0].message) {
        message = badges[0].message;
    } else if (badges.length === 1) {
        message = `🎉 You earned the "${badges[0].name}" badge! 🎉\n\nKeep up the awesome work!`;
    } else {
        message = `🎉 WOW! You earned ${badges.length} badges! 🎉\n\n`;
        message += badges.map(badge => `${badge.icon} ${badge.name}`).join('\n');
        message += '\n\nYou are absolutely crushing it today! 🌟';
    }
    
    celebrationText.style.whiteSpace = 'pre-line';
    celebrationText.textContent = message;
    modal.style.display = 'block';
    
    // Auto-close after 7 seconds
    setTimeout(closeModal, 7000);
}

/**
 * Close celebration modal
 */
function closeModal() {
    const modal = document.getElementById('celebration-modal');
    modal.style.display = 'none';
}

/**
 * Show confetti animation
 */
function showConfetti() {
    const container = document.getElementById('confetti-container');
    
    // Create confetti pieces
    const colors = ['#f44336', '#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#ffc107'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 1 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        // Random shapes
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        } else {
            confetti.style.transform += ` rotate(${Math.random() * 360}deg)`;
        }
        
        container.appendChild(confetti);
    }
    
    // Remove confetti after animation
    setTimeout(() => {
        const confettiElements = container.querySelectorAll('.confetti');
        confettiElements.forEach(el => el.remove());
    }, 4000);
}

/**
 * Animate an element with a CSS class
 */
function animateElement(element, animationClass, duration = 1000) {
    element.classList.add(animationClass);
    setTimeout(() => {
        element.classList.remove(animationClass);
    }, duration);
}

/**
 * Add visual feedback for button presses
 */
function addButtonFeedback() {
    const buttons = document.querySelectorAll('button, .mood-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 1000;
            `;
            
            // Add ripple keyframes if not already present
            if (!document.querySelector('#ripple-keyframes')) {
                const style = document.createElement('style');
                style.id = 'ripple-keyframes';
                style.textContent = `
                    @keyframes ripple {
                        to {
                            transform: scale(2);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        });
    });
}

// Initialize button feedback when DOM is loaded
document.addEventListener('DOMContentLoaded', addButtonFeedback);

/**
 * Handle responsive behavior
 */
function handleResponsiveLayout() {
    const container = document.querySelector('.container');
    
    function updateLayout() {
        if (window.innerWidth <= 768) {
            container.classList.add('mobile-layout');
        } else {
            container.classList.remove('mobile-layout');
        }
    }
    
    window.addEventListener('resize', updateLayout);
    updateLayout(); // Initial call
}

// Initialize responsive layout
document.addEventListener('DOMContentLoaded', handleResponsiveLayout);

/**
 * Add touch-friendly interactions for mobile
 */
function addTouchFriendlyFeatures() {
    // Prevent double-tap zoom on buttons
    const buttons = document.querySelectorAll('button, .mood-btn, input[type="checkbox"]');
    buttons.forEach(button => {
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.click();
        });
    });
    
    // Add touch feedback
    const interactiveElements = document.querySelectorAll('.goal-card, .mission-card, .mood-btn, .badge, .achievement');
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });
}

// Initialize touch features
document.addEventListener('DOMContentLoaded', addTouchFriendlyFeatures);

/**
 * Save data periodically (backup)
 */
setInterval(() => {
    if (habitTracker) {
        habitTracker.saveData();
    }
}, 30000); // Save every 30 seconds

/**
 * Handle page visibility changes to refresh data
 */
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && habitTracker) {
        // Check if date has changed and refresh data if needed
        const dateChanged = habitTracker.checkDateChange();
        if (dateChanged) {
            // New day detected, refresh the UI with new data
            renderUI();
        } else {
            // Same day, just re-render UI
            renderUI();
        }
    }
});

/**
 * Initialize tooltips for better UX
 */
function initializeTooltips() {
    // Add helpful tooltips
    const tooltips = {
        'water': 'Click + to add a cup of water, - to remove one',
        'stretch': 'Add minutes of stretching you\'ve done',
        'reading': 'Track your reading time in minutes',
        'duolingo': 'Check when you complete your Duolingo lesson'
    };
    
    Object.keys(tooltips).forEach(goalId => {
        const goalCard = document.querySelector(`[data-goal="${goalId}"]`);
        if (goalCard) {
            goalCard.title = tooltips[goalId];
        }
    });
}

// Initialize tooltips
document.addEventListener('DOMContentLoaded', initializeTooltips);

/**
 * Export data for debugging (accessible via console)
 */
window.exportHabitData = function() {
    if (habitTracker) {
        const data = JSON.stringify(habitTracker.data, null, 2);
        console.log('Habit Tracker Data:', data);
        
        // Create downloadable file
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'habit-tracker-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return data;
    }
    return null;
};

/**
 * Import data for debugging (accessible via console)
 */
window.importHabitData = function(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        localStorage.setItem('habitTracker', JSON.stringify(data));
        location.reload();
        return true;
    } catch (error) {
        console.error('Invalid JSON data:', error);
        return false;
    }
};

/**
 * Reset all data (accessible via console for testing)
 */
window.resetHabitData = function() {
    if (confirm('Are you sure you want to reset all habit tracking data? This cannot be undone!')) {
        localStorage.removeItem('habitTracker');
        location.reload();
        return true;
    }
    return false;
};

/**
 * Refresh daily data (accessible via console for testing)
 */
window.refreshDailyData = function() {
    if (habitTracker) {
        const dateChanged = habitTracker.refreshDailyData();
        if (dateChanged) {
            console.log('Date changed, daily data refreshed');
            renderUI();
        } else {
            console.log('Same date, daily data refreshed');
            renderUI();
        }
        return true;
    }
    return false;
};

/**
 * Add data import/export functionality to UI
 */
function addDataManagementUI() {
    // Create settings button
    const header = document.querySelector('header');
    const settingsBtn = document.createElement('button');
    settingsBtn.innerHTML = '⚙️';
    settingsBtn.title = 'Settings';
    settingsBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255,255,255,0.1);
        border: 2px solid rgba(79, 195, 247, 0.3);
        border-radius: 50%;
        width: 50px;
        height: 50px;
        color: #4fc3f7;
        font-size: 1.5rem;
        cursor: pointer;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
    `;
    
    settingsBtn.addEventListener('mouseover', function() {
        this.style.background = 'rgba(255,255,255,0.2)';
        this.style.transform = 'scale(1.1)';
    });
    
    settingsBtn.addEventListener('mouseout', function() {
        this.style.background = 'rgba(255,255,255,0.1)';
        this.style.transform = 'scale(1)';
    });
    
    settingsBtn.addEventListener('click', showSettingsModal);
    header.appendChild(settingsBtn);
}

/**
 * Show settings modal
 */
function showSettingsModal() {
    const settingsHTML = `
        <div style="text-align: left;">
            <h3>Data Management</h3>
            <button id="export-data-btn" class="settings-btn">📤 Export Data</button>
            <button id="import-data-btn" class="settings-btn">📥 Import Data</button>
            <button id="refresh-daily-btn" class="settings-btn" style="background: #4caf50;">🔄 Refresh Daily Data</button>
            <button id="reset-data-btn" class="settings-btn" style="background: #f44336;">🗑️ Reset All Data</button>
            
            <h3 style="margin-top: 20px;">Statistics</h3>
            <div id="stats-display"></div>
            
            <h3 style="margin-top: 20px;">About</h3>
            <p style="color: #b0bec5; font-size: 0.9rem;">
                Daily Habit Tracker v1.0<br>
                Built with ❤️ for building better habits!<br><br>
                <strong>Tips:</strong><br>
                • Complete all goals and missions for a Perfect Day!<br>
                • Check back daily - missions change every day<br>
                • Click on badges and achievements for more details<br>
                • Your data is saved locally in your browser
            </p>
        </div>
        
        <style>
            .settings-btn {
                display: block;
                width: 100%;
                margin: 10px 0;
                padding: 10px;
                background: rgba(79, 195, 247, 0.8);
                border: none;
                border-radius: 10px;
                color: white;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .settings-btn:hover {
                background: rgba(79, 195, 247, 1);
                transform: translateY(-2px);
            }
        </style>
    `;
    
    showInfoModal('Settings', settingsHTML);
    
    // Add event listeners for settings buttons
    setTimeout(() => {
        document.getElementById('export-data-btn').addEventListener('click', () => {
            window.exportHabitData();
            showInfoModal('Export Complete', 'Your data has been downloaded as a JSON file!');
        });
        
        document.getElementById('import-data-btn').addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const success = window.importHabitData(e.target.result);
                        if (success) {
                            showInfoModal('Import Complete', 'Data imported successfully! The page will reload.');
                        } else {
                            showInfoModal('Import Failed', 'Failed to import data. Please check the file format.');
                        }
                    };
                    reader.readAsText(file);
                }
            };
            input.click();
        });
        
        document.getElementById('reset-data-btn').addEventListener('click', () => {
            window.resetHabitData();
        });
        
        document.getElementById('refresh-daily-btn').addEventListener('click', () => {
            const success = window.refreshDailyData();
            if (success) {
                showInfoModal('Refresh Complete', 'Daily data has been refreshed!');
            } else {
                showInfoModal('Refresh Failed', 'Failed to refresh daily data.');
            }
        });
        
        // Display statistics
        displayStatistics();
    }, 100);
}

/**
 * Display user statistics in settings
 */
function displayStatistics() {
    const statsDisplay = document.getElementById('stats-display');
    if (!statsDisplay || !habitTracker) return;
    
    habitTracker.updateStats();
    const stats = habitTracker.data.stats;
    const achievements = habitTracker.getAchievementsData();
    const totalBadges = habitTracker.data.badges.length;
    
    // Calculate additional stats
    const totalGoalsCompleted = Object.values(habitTracker.data.history).reduce((total, day) => {
        return total + Object.keys(DAILY_GOALS).filter(goalId => {
            const goal = DAILY_GOALS[goalId];
            if (goal.type === 'counter') {
                return day.goals[goalId] >= goal.target;
            } else if (goal.type === 'checkbox') {
                return day.goals[goalId] === true;
            }
            return false;
        }).length;
    }, 0);
    
    const totalAchievementLevels = achievements.reduce((total, achievement) => {
        return total + achievement.currentLevel;
    }, 0);
    
    statsDisplay.innerHTML = `
        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; font-size: 0.9rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>📅 <strong>Total Days:</strong> ${stats.totalDays}</div>
                <div>⭐ <strong>Perfect Days:</strong> ${stats.perfectDays}</div>
                <div>🔥 <strong>Longest Streak:</strong> ${stats.longestStreak}</div>
                <div>🎯 <strong>Total Missions:</strong> ${stats.totalMissions}</div>
                <div>🏆 <strong>Total Badges:</strong> ${totalBadges}</div>
                <div>🌟 <strong>Achievement Levels:</strong> ${totalAchievementLevels}</div>
                <div>✅ <strong>Goals Completed:</strong> ${totalGoalsCompleted}</div>
                <div>📊 <strong>Success Rate:</strong> ${stats.totalDays > 0 ? Math.round((stats.perfectDays / stats.totalDays) * 100) : 0}%</div>
            </div>
        </div>
    `;
}

// Initialize data management UI
document.addEventListener('DOMContentLoaded', addDataManagementUI);

/**
 * Add keyboard shortcuts
 */
function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Only if not typing in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.key) {
            case '1':
                // Quick add water
                const currentWater = habitTracker.data.daily.goals.water;
                habitTracker.updateGoal('water', currentWater + 1);
                renderGoalProgress('water');
                checkForCelebrations();
                break;
                
            case '2':
                // Quick add stretch time
                const currentStretch = habitTracker.data.daily.goals.stretch;
                habitTracker.updateGoal('stretch', Math.min(currentStretch + 5, 30));
                renderGoalProgress('stretch');
                checkForCelebrations();
                break;
                
            case '3':
                // Toggle Duolingo
                const currentDuo = habitTracker.data.daily.goals.duolingo;
                habitTracker.updateGoal('duolingo', !currentDuo);
                renderGoalProgress('duolingo');
                checkForCelebrations();
                break;
                
            case '4':
                // Quick add reading time
                const currentReading = habitTracker.data.daily.goals.reading;
                habitTracker.updateGoal('reading', Math.min(currentReading + 10, 60));
                renderGoalProgress('reading');
                checkForCelebrations();
                break;
                
            case 'h':
                // Show help
                showHelpModal();
                break;
                
            case 's':
                // Show settings
                showSettingsModal();
                break;
                
            case 'Escape':
                // Close any open modals
                const openModal = document.querySelector('.modal[style*="display: block"]');
                if (openModal) {
                    openModal.style.display = 'none';
                }
                break;
        }
    });
}

/**
 * Show help modal with keyboard shortcuts
 */
function showHelpModal() {
    const helpHTML = `
        <div style="text-align: left;">
            <h3>Keyboard Shortcuts</h3>
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; margin: 10px 0;">
                <strong>1</strong> - Add 1 cup of water<br>
                <strong>2</strong> - Add 5 minutes of stretching<br>
                <strong>3</strong> - Toggle Duolingo completion<br>
                <strong>4</strong> - Add 10 minutes of reading<br>
                <strong>H</strong> - Show this help<br>
                <strong>S</strong> - Open settings<br>
                <strong>ESC</strong> - Close modals
            </div>
            
            <h3>How to Use</h3>
            <div style="color: #b0bec5; font-size: 0.9rem; line-height: 1.5;">
                <strong>Daily Goals:</strong> These are your main habits to build. Use the + and - buttons or checkboxes to track your progress.<br><br>
                
                <strong>Daily Missions:</strong> These change every day! Complete special challenges to earn extra badges.<br><br>
                
                <strong>Mood Tracker:</strong> Select how you're feeling and optionally add a note about your day.<br><br>
                
                <strong>Weekly View:</strong> See your progress over the past week. Click on past days to see details.<br><br>
                
                <strong>Badges:</strong> Earned instantly when you complete goals or missions. Click on them for more info!<br><br>
                
                <strong>Achievements:</strong> Long-term progress tracking with 10 levels each. Click to see all levels and requirements.
            </div>
        </div>
    `;
    
    showInfoModal('Help & Instructions', helpHTML);
}

// Initialize keyboard shortcuts
document.addEventListener('DOMContentLoaded', addKeyboardShortcuts);

/**
 * Show achievement notification
 */
function showAchievementNotification(achievement, levelData, currentCount, nextThreshold) {
    const notificationsContainer = document.getElementById('notifications-container');
    if (!notificationsContainer) return;

    const notification = document.createElement('div');
    notification.className = 'achievement-notification achievement';
    
    const progressPercentage = nextThreshold ? Math.min(100, (currentCount / nextThreshold) * 100) : 100;
    const progressText = nextThreshold ? `${currentCount} / ${nextThreshold}` : `${currentCount} (MAX!)`;
    
    notification.innerHTML = `
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        <div class="notification-header">
            <div class="notification-icon">${achievement.icon}</div>
            <div class="notification-content">
                <h3>🎉 Achievement Unlocked! 🎉</h3>
                <p><strong>${achievement.name}</strong><br>${levelData.reward}</p>
            </div>
        </div>
        <div class="notification-progress">
            <div class="notification-progress-text">Progress: ${progressText}</div>
            <div class="notification-progress-bar">
                <div class="notification-progress-fill" style="width: ${progressPercentage}%"></div>
            </div>
        </div>
    `;

    notificationsContainer.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-remove after 6 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }
    }, 6000);
}

/**
 * Show badge notification
 */
function showBadgeNotification(badge) {
    const notificationsContainer = document.getElementById('notifications-container');
    if (!notificationsContainer) return;

    const notification = document.createElement('div');
    notification.className = 'achievement-notification badge';
    
    notification.innerHTML = `
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        <div class="notification-header">
            <div class="notification-icon">${badge.icon || '🏆'}</div>
            <div class="notification-content">
                <h3>🏆 Badge Earned! 🏆</h3>
                <p><strong>${badge.name}</strong><br>${badge.description || 'Special Achievement!'}</p>
            </div>
        </div>
    `;

    notificationsContainer.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-remove after 6 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }
    }, 6000);
}

/**
 * Check for new achievements and show notifications
 */
function checkForAchievements() {
    const achievements = habitTracker.getAchievementsData();
    
    achievements.forEach(achievement => {
        const data = habitTracker.data.achievements[achievement.id] || {
            currentLevel: 0,
            currentCount: 0,
            unlockedLevels: []
        };
        
        // Check if we've unlocked a new level
        const newLevel = data.currentLevel;
        if (newLevel > 0 && !data.unlockedLevels.includes(newLevel)) {
            const levelData = achievement.levels[newLevel - 1];
            const nextLevel = achievement.levels[newLevel];
            
            // Mark as unlocked
            if (!data.unlockedLevels) data.unlockedLevels = [];
            data.unlockedLevels.push(newLevel);
            habitTracker.data.achievements[achievement.id] = data;
            
            // Show notification
            showAchievementNotification(achievement, levelData, data.currentCount, nextLevel ? nextLevel.threshold : null);
        }
    });
}

// Debug functions for easier development and troubleshooting
window.habitTrackerDebug = {
    // Quick complete all goals
    completeAllGoals: function() {
        Object.keys(DAILY_GOALS).forEach(goalId => {
            const goal = DAILY_GOALS[goalId];
            if (goal.type === 'counter') {
                habitTracker.updateGoal(goalId, goal.target);
            } else {
                habitTracker.updateGoal(goalId, true);
            }
        });
        renderUI();
        checkForCelebrations();
        console.log('All goals completed!');
    },
    
    // Quick complete all missions
    completeAllMissions: function() {
        Object.keys(habitTracker.data.daily.missions).forEach(missionId => {
            if (!habitTracker.data.daily.missions[missionId].completed) {
                habitTracker.toggleMission(missionId);
            }
        });
        renderUI();
        checkForCelebrations();
        console.log('All missions completed!');
    },
    
    // Show current data
    showData: function() {
        console.log('Current Data:', habitTracker.data);
        return habitTracker.data;
    },
    
    // Add test days for achievements
    addTestDays: function(days = 7) {
        const today = new Date();
        for (let i = 1; i <= days; i++) {
            const testDate = new Date(today);
            testDate.setDate(testDate.getDate() - i);
            const dateKey = habitTracker.formatDateKey(testDate);
            
            habitTracker.data.history[dateKey] = {
                goals: { water: 8, stretch: 15, duolingo: true, reading: 30 },
                missions: {
                    test1: { id: 'test1', completed: true },
                    test2: { id: 'test2', completed: true },
                    test3: { id: 'test3', completed: true }
                },
                mood: { emoji: '😊', text: 'Great day!' },
                completed: true,
                date: dateKey
            };
        }
        habitTracker.saveData();
        renderUI();
        console.log(`Added ${days} perfect test days!`);
    },

    // Check XP status
    checkXPStatus: function() {
        console.log('🔍 XP Status Check:');
        console.log('Current XP Data:', habitTracker.data.xp);
        console.log('XP Data from getXPData():', habitTracker.getXPData());
        console.log('Daily Goals:', habitTracker.data.daily.goals);
        console.log('Daily Missions:', habitTracker.data.daily.missions);
        return habitTracker.data.xp;
    },

    // Test XP awarding
    testXPAward: function() {
        console.log('🧪 Testing XP Award...');
        const result = habitTracker.addXP(50, 'Test XP Award');
        console.log('Test Result:', result);
        renderUI();
        return result;
    }
};

/**
 * Update XP display
 */
function updateXPDisplay() {
    const xpData = habitTracker.getXPData();
    
    document.getElementById('currentLevel').textContent = xpData.currentLevel;
    document.getElementById('levelTitle').textContent = xpData.currentLevelTitle;
    document.getElementById('currentXP').textContent = xpData.currentXP;
    
    if (xpData.nextLevel) {
        document.getElementById('nextLevelXP').textContent = xpData.nextLevel.xpRequired;
        document.getElementById('xpFill').style.width = `${xpData.progress}%`;
    } else {
        document.getElementById('nextLevelXP').textContent = 'MAX';
        document.getElementById('xpFill').style.width = '100%';
    }
}

/**
 * Trigger level up celebration
 */
function triggerLevelUpCelebration(level, title) {
    // Create level up notification
    showXPNotification(`🎉 LEVEL UP! 🎉<br>Level ${level} - ${title}`, 'level-up');
    
    // Trigger confetti
    showConfetti();
    
    // Update XP display
    updateXPDisplay();
}

/**
 * Show XP gain notification
 */
function showXPNotification(message, type = 'xp-gain') {
    const container = document.getElementById('notifications-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;
    
    container.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Set up global level up celebration function
window.triggerLevelUpCelebration = triggerLevelUpCelebration;

// Make XP functions available globally
window.updateXPDisplay = updateXPDisplay;
window.showXPNotification = showXPNotification;

console.log('🎮 Habit Tracker Loaded! 🎮');
console.log('Debug functions available: window.habitTrackerDebug');
console.log('Data management: window.exportHabitData(), window.importHabitData(), window.resetHabitData()');
console.log('Keyboard shortcuts: Press H for help');

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 Daily Habit Tracker initialized! Ready to build amazing habits! 🌟');
});