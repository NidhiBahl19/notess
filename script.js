document.addEventListener('DOMContentLoaded', () => {
    const noteInput = document.getElementById('note-input');
    const addNoteBtn = document.getElementById('add-note-btn');
    const notesContainer = document.getElementById('notes-container');
    const streakCount = document.getElementById('streak-count');
    const achievementsList = document.getElementById('achievements-list');

    let notes = getNotes();
    let streak = getStreak();
    let lastNoteDate = getLastNoteDate();
    let achievements = getAchievements();

    const allAchievements = {
        FIRST_NOTE: { name: 'First Note', unlocked: false },
        TEN_NOTES: { name: 'Note Taker', unlocked: false },
        FIFTY_NOTES: { name: 'Super Note Taker', unlocked: false },
        THREE_DAY_STREAK: { name: 'Daily Habit', unlocked: false },
        SEVEN_DAY_STREAK: { name: 'Weekly Habit', unlocked: false },
    };

    function getNotes() {
        const notes = localStorage.getItem('notes');
        return notes ? JSON.parse(notes) : [];
    }

    function saveNotes() {
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function getStreak() {
        const streak = localStorage.getItem('streak');
        return streak ? parseInt(streak) : 0;
    }

    function saveStreak() {
        localStorage.setItem('streak', streak);
    }

    function getLastNoteDate() {
        const date = localStorage.getItem('lastNoteDate');
        return date ? new Date(date) : null;
    }

    function saveLastNoteDate() {
        localStorage.setItem('lastNoteDate', new Date().toString());
    }

    function getAchievements() {
        const achievements = localStorage.getItem('achievements');
        return achievements ? JSON.parse(achievements) : allAchievements;
    }

    function saveAchievements() {
        localStorage.setItem('achievements', JSON.stringify(achievements));
    }

    function updateStreak() {
        const today = new Date();
        if (lastNoteDate) {
            const diffTime = today - lastNoteDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                streak++;
            } else if (diffDays > 1) {
                streak = 1;
            }
        } else {
            streak = 1;
        }
        saveStreak();
        saveLastNoteDate();
    }

    function checkAchievements() {
        if (notes.length >= 1 && !achievements.FIRST_NOTE.unlocked) {
            achievements.FIRST_NOTE.unlocked = true;
        }
        if (notes.length >= 10 && !achievements.TEN_NOTES.unlocked) {
            achievements.TEN_NOTES.unlocked = true;
        }
        if (notes.length >= 50 && !achievements.FIFTY_NOTES.unlocked) {
            achievements.FIFTY_NOTES.unlocked = true;
        }
        if (streak >= 3 && !achievements.THREE_DAY_STREAK.unlocked) {
            achievements.THREE_DAY_STREAK.unlocked = true;
        }
        if (streak >= 7 && !achievements.SEVEN_DAY_STREAK.unlocked) {
            achievements.SEVEN_DAY_STREAK.unlocked = true;
        }
        saveAchievements();
    }

    function renderGamification() {
        streakCount.innerText = streak;
        achievementsList.innerHTML = '';
        for (const key in achievements) {
            const achievement = achievements[key];
            const li = document.createElement('li');
            li.classList.add('achievement');
            if (achievement.unlocked) {
                li.classList.add('unlocked');
            }
            li.innerText = achievement.name;
            achievementsList.appendChild(li);
        }
    }

    function createNoteElement(note) {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');

        const textarea = document.createElement('textarea');
        textarea.value = note.content;
        textarea.addEventListener('change', () => {
            note.content = textarea.value;
            saveNotes();
        });

        const actions = document.createElement('div');
        actions.classList.add('note-actions');

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerText = 'Delete';
        deleteBtn.addEventListener('click', () => {
            notes = notes.filter(n => n.id !== note.id);
            saveNotes();
            renderNotes();
        });

        actions.appendChild(deleteBtn);
        noteElement.appendChild(textarea);
        noteElement.appendChild(actions);

        return noteElement;
    }

    function renderNotes() {
        notesContainer.innerHTML = '';
        notes.forEach(note => {
            const noteElement = createNoteElement(note);
            notesContainer.appendChild(noteElement);
        });
    }

    addNoteBtn.addEventListener('click', () => {
        const content = noteInput.value.trim();
        if (content) {
            const newNote = {
                id: Date.now(),
                content: content
            };
            notes.push(newNote);
            saveNotes();
            updateStreak();
            checkAchievements();
            renderGamification();
            renderNotes();
            noteInput.value = '';
        }
    });

    renderNotes();
    renderGamification();
});