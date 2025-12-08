// Configuration - Replace with your Google Apps Script Web App URL
// See README.md for setup instructions
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbz2tGgPpsfQcm0LU9cIY4EFCOVETqO7xPeTwjg1agTxmTD2TxlCBTDQAMK8y1ZpWmS1/exec';

// Global state to store all form data
const formData = {
    timestamp: new Date().toISOString(),
    sectionOrder: [],
    task1Trials: [],
    task2Trials: [],
    task3Trials: []
};

// Task 1 audio files and trial configuration
const task1AudioFiles = [
    { file: 'tone_pair_delta_+00Hz.wav', delta: 0, correctAnswer: 'Same' },
    { file: 'tone_pair_delta_+01Hz.wav', delta: +1, correctAnswer: 'Higher' },
    { file: 'tone_pair_delta_+02Hz.wav', delta: +2, correctAnswer: 'Higher' },
    { file: 'tone_pair_delta_+03Hz.wav', delta: +3, correctAnswer: 'Higher' },
    { file: 'tone_pair_delta_+04Hz.wav', delta: +4, correctAnswer: 'Higher' },
    { file: 'tone_pair_delta_+05Hz.wav', delta: +5, correctAnswer: 'Higher' },
    { file: 'tone_pair_delta_+06Hz.wav', delta: +6, correctAnswer: 'Higher' },
    { file: 'tone_pair_delta_+07Hz.wav', delta: +7, correctAnswer: 'Higher' },
    { file: 'tone_pair_delta_+08Hz.wav', delta: +8, correctAnswer: 'Higher' },
    { file: 'tone_pair_delta_+09Hz.wav', delta: +9, correctAnswer: 'Higher' },
    { file: 'tone_pair_delta_+10Hz.wav', delta: +10, correctAnswer: 'Higher' },
    { file: 'tone_pair_delta_-01Hz.wav', delta: -1, correctAnswer: 'Lower' },
    { file: 'tone_pair_delta_-02Hz.wav', delta: -2, correctAnswer: 'Lower' },
    { file: 'tone_pair_delta_-03Hz.wav', delta: -3, correctAnswer: 'Lower' },
    { file: 'tone_pair_delta_-04Hz.wav', delta: -4, correctAnswer: 'Lower' },
    { file: 'tone_pair_delta_-05Hz.wav', delta: -5, correctAnswer: 'Lower' },
    { file: 'tone_pair_delta_-06Hz.wav', delta: -6, correctAnswer: 'Lower' },
    { file: 'tone_pair_delta_-07Hz.wav', delta: -7, correctAnswer: 'Lower' },
    { file: 'tone_pair_delta_-08Hz.wav', delta: -8, correctAnswer: 'Lower' },
    { file: 'tone_pair_delta_-09Hz.wav', delta: -9, correctAnswer: 'Lower' },
    { file: 'tone_pair_delta_-10Hz.wav', delta: -10, correctAnswer: 'Lower' }
];

// Task 2 audio files - D4 modifications (3rd note)
const task2AudioFilesD4 = [
    { file: 'melody_D4_delta_+00Hz.wav', delta: 0, correctAnswer: 'Same', note: 'D4', notePosition: '3rd' },
    { file: 'melody_D4_delta_+01Hz.wav', delta: +1, correctAnswer: 'Higher', note: 'D4', notePosition: '3rd' },
    { file: 'melody_D4_delta_+02Hz.wav', delta: +2, correctAnswer: 'Higher', note: 'D4', notePosition: '3rd' },
    { file: 'melody_D4_delta_+03Hz.wav', delta: +3, correctAnswer: 'Higher', note: 'D4', notePosition: '3rd' },
    { file: 'melody_D4_delta_+04Hz.wav', delta: +4, correctAnswer: 'Higher', note: 'D4', notePosition: '3rd' },
    { file: 'melody_D4_delta_+05Hz.wav', delta: +5, correctAnswer: 'Higher', note: 'D4', notePosition: '3rd' },
    { file: 'melody_D4_delta_+06Hz.wav', delta: +6, correctAnswer: 'Higher', note: 'D4', notePosition: '3rd' },
    { file: 'melody_D4_delta_+07Hz.wav', delta: +7, correctAnswer: 'Higher', note: 'D4', notePosition: '3rd' },
    { file: 'melody_D4_delta_+08Hz.wav', delta: +8, correctAnswer: 'Higher', note: 'D4', notePosition: '3rd' },
    { file: 'melody_D4_delta_+09Hz.wav', delta: +9, correctAnswer: 'Higher', note: 'D4', notePosition: '3rd' },
    { file: 'melody_D4_delta_+10Hz.wav', delta: +10, correctAnswer: 'Higher', note: 'D4', notePosition: '3rd' },
    { file: 'melody_D4_delta_-01Hz.wav', delta: -1, correctAnswer: 'Lower', note: 'D4', notePosition: '3rd' },
    { file: 'melody_D4_delta_-02Hz.wav', delta: -2, correctAnswer: 'Lower', note: 'D4', notePosition: '3rd' },
    { file: 'melody_D4_delta_-03Hz.wav', delta: -3, correctAnswer: 'Lower', note: 'D4', notePosition: '3rd' },
    { file: 'melody_D4_delta_-04Hz.wav', delta: -4, correctAnswer: 'Lower', note: 'D4', notePosition: '3rd' },
    { file: 'melody_D4_delta_-05Hz.wav', delta: -5, correctAnswer: 'Lower', note: 'D4', notePosition: '3rd' },
    { file: 'melody_D4_delta_-06Hz.wav', delta: -6, correctAnswer: 'Lower', note: 'D4', notePosition: '3rd' },
    { file: 'melody_D4_delta_-07Hz.wav', delta: -7, correctAnswer: 'Lower', note: 'D4', notePosition: '3rd' },
    { file: 'melody_D4_delta_-08Hz.wav', delta: -8, correctAnswer: 'Lower', note: 'D4', notePosition: '3rd' },
    { file: 'melody_D4_delta_-09Hz.wav', delta: -9, correctAnswer: 'Lower', note: 'D4', notePosition: '3rd' },
    { file: 'melody_D4_delta_-10Hz.wav', delta: -10, correctAnswer: 'Lower', note: 'D4', notePosition: '3rd' }
];

// Task 2 audio files - F4 modifications (5th note)
const task2AudioFilesF4 = [
    { file: 'melody_F4_delta_+00Hz.wav', delta: 0, correctAnswer: 'Same', note: 'F4', notePosition: '5th' },
    { file: 'melody_F4_delta_+01Hz.wav', delta: +1, correctAnswer: 'Higher', note: 'F4', notePosition: '5th' },
    { file: 'melody_F4_delta_+02Hz.wav', delta: +2, correctAnswer: 'Higher', note: 'F4', notePosition: '5th' },
    { file: 'melody_F4_delta_+03Hz.wav', delta: +3, correctAnswer: 'Higher', note: 'F4', notePosition: '5th' },
    { file: 'melody_F4_delta_+04Hz.wav', delta: +4, correctAnswer: 'Higher', note: 'F4', notePosition: '5th' },
    { file: 'melody_F4_delta_+05Hz.wav', delta: +5, correctAnswer: 'Higher', note: 'F4', notePosition: '5th' },
    { file: 'melody_F4_delta_+06Hz.wav', delta: +6, correctAnswer: 'Higher', note: 'F4', notePosition: '5th' },
    { file: 'melody_F4_delta_+07Hz.wav', delta: +7, correctAnswer: 'Higher', note: 'F4', notePosition: '5th' },
    { file: 'melody_F4_delta_+08Hz.wav', delta: +8, correctAnswer: 'Higher', note: 'F4', notePosition: '5th' },
    { file: 'melody_F4_delta_+09Hz.wav', delta: +9, correctAnswer: 'Higher', note: 'F4', notePosition: '5th' },
    { file: 'melody_F4_delta_+10Hz.wav', delta: +10, correctAnswer: 'Higher', note: 'F4', notePosition: '5th' },
    { file: 'melody_F4_delta_-01Hz.wav', delta: -1, correctAnswer: 'Lower', note: 'F4', notePosition: '5th' },
    { file: 'melody_F4_delta_-02Hz.wav', delta: -2, correctAnswer: 'Lower', note: 'F4', notePosition: '5th' },
    { file: 'melody_F4_delta_-03Hz.wav', delta: -3, correctAnswer: 'Lower', note: 'F4', notePosition: '5th' },
    { file: 'melody_F4_delta_-04Hz.wav', delta: -4, correctAnswer: 'Lower', note: 'F4', notePosition: '5th' },
    { file: 'melody_F4_delta_-05Hz.wav', delta: -5, correctAnswer: 'Lower', note: 'F4', notePosition: '5th' },
    { file: 'melody_F4_delta_-06Hz.wav', delta: -6, correctAnswer: 'Lower', note: 'F4', notePosition: '5th' },
    { file: 'melody_F4_delta_-07Hz.wav', delta: -7, correctAnswer: 'Lower', note: 'F4', notePosition: '5th' },
    { file: 'melody_F4_delta_-08Hz.wav', delta: -8, correctAnswer: 'Lower', note: 'F4', notePosition: '5th' },
    { file: 'melody_F4_delta_-09Hz.wav', delta: -9, correctAnswer: 'Lower', note: 'F4', notePosition: '5th' },
    { file: 'melody_F4_delta_-10Hz.wav', delta: -10, correctAnswer: 'Lower', note: 'F4', notePosition: '5th' }
];

// Task 3 audio files - D4 modifications (4th note in unfamiliar melody)
const task3AudioFilesD4 = [
    { file: 'melody_D4_delta_+00Hz.wav', delta: 0, correctAnswer: 'Same', note: 'D4', notePosition: '4th' },
    { file: 'melody_D4_delta_+01Hz.wav', delta: +1, correctAnswer: 'Higher', note: 'D4', notePosition: '4th' },
    { file: 'melody_D4_delta_+02Hz.wav', delta: +2, correctAnswer: 'Higher', note: 'D4', notePosition: '4th' },
    { file: 'melody_D4_delta_+03Hz.wav', delta: +3, correctAnswer: 'Higher', note: 'D4', notePosition: '4th' },
    { file: 'melody_D4_delta_+04Hz.wav', delta: +4, correctAnswer: 'Higher', note: 'D4', notePosition: '4th' },
    { file: 'melody_D4_delta_+05Hz.wav', delta: +5, correctAnswer: 'Higher', note: 'D4', notePosition: '4th' },
    { file: 'melody_D4_delta_+06Hz.wav', delta: +6, correctAnswer: 'Higher', note: 'D4', notePosition: '4th' },
    { file: 'melody_D4_delta_+07Hz.wav', delta: +7, correctAnswer: 'Higher', note: 'D4', notePosition: '4th' },
    { file: 'melody_D4_delta_+08Hz.wav', delta: +8, correctAnswer: 'Higher', note: 'D4', notePosition: '4th' },
    { file: 'melody_D4_delta_+09Hz.wav', delta: +9, correctAnswer: 'Higher', note: 'D4', notePosition: '4th' },
    { file: 'melody_D4_delta_+10Hz.wav', delta: +10, correctAnswer: 'Higher', note: 'D4', notePosition: '4th' },
    { file: 'melody_D4_delta_-01Hz.wav', delta: -1, correctAnswer: 'Lower', note: 'D4', notePosition: '4th' },
    { file: 'melody_D4_delta_-02Hz.wav', delta: -2, correctAnswer: 'Lower', note: 'D4', notePosition: '4th' },
    { file: 'melody_D4_delta_-03Hz.wav', delta: -3, correctAnswer: 'Lower', note: 'D4', notePosition: '4th' },
    { file: 'melody_D4_delta_-04Hz.wav', delta: -4, correctAnswer: 'Lower', note: 'D4', notePosition: '4th' },
    { file: 'melody_D4_delta_-05Hz.wav', delta: -5, correctAnswer: 'Lower', note: 'D4', notePosition: '4th' },
    { file: 'melody_D4_delta_-06Hz.wav', delta: -6, correctAnswer: 'Lower', note: 'D4', notePosition: '4th' },
    { file: 'melody_D4_delta_-07Hz.wav', delta: -7, correctAnswer: 'Lower', note: 'D4', notePosition: '4th' },
    { file: 'melody_D4_delta_-08Hz.wav', delta: -8, correctAnswer: 'Lower', note: 'D4', notePosition: '4th' },
    { file: 'melody_D4_delta_-09Hz.wav', delta: -9, correctAnswer: 'Lower', note: 'D4', notePosition: '4th' },
    { file: 'melody_D4_delta_-10Hz.wav', delta: -10, correctAnswer: 'Lower', note: 'D4', notePosition: '4th' }
];

// Task 3 audio files - F4 modifications (3rd note in unfamiliar melody)
const task3AudioFilesF4 = [
    { file: 'melody_F4_delta_+00Hz.wav', delta: 0, correctAnswer: 'Same', note: 'F4', notePosition: '3rd' },
    { file: 'melody_F4_delta_+01Hz.wav', delta: +1, correctAnswer: 'Higher', note: 'F4', notePosition: '3rd' },
    { file: 'melody_F4_delta_+02Hz.wav', delta: +2, correctAnswer: 'Higher', note: 'F4', notePosition: '3rd' },
    { file: 'melody_F4_delta_+03Hz.wav', delta: +3, correctAnswer: 'Higher', note: 'F4', notePosition: '3rd' },
    { file: 'melody_F4_delta_+04Hz.wav', delta: +4, correctAnswer: 'Higher', note: 'F4', notePosition: '3rd' },
    { file: 'melody_F4_delta_+05Hz.wav', delta: +5, correctAnswer: 'Higher', note: 'F4', notePosition: '3rd' },
    { file: 'melody_F4_delta_+06Hz.wav', delta: +6, correctAnswer: 'Higher', note: 'F4', notePosition: '3rd' },
    { file: 'melody_F4_delta_+07Hz.wav', delta: +7, correctAnswer: 'Higher', note: 'F4', notePosition: '3rd' },
    { file: 'melody_F4_delta_+08Hz.wav', delta: +8, correctAnswer: 'Higher', note: 'F4', notePosition: '3rd' },
    { file: 'melody_F4_delta_+09Hz.wav', delta: +9, correctAnswer: 'Higher', note: 'F4', notePosition: '3rd' },
    { file: 'melody_F4_delta_+10Hz.wav', delta: +10, correctAnswer: 'Higher', note: 'F4', notePosition: '3rd' },
    { file: 'melody_F4_delta_-01Hz.wav', delta: -1, correctAnswer: 'Lower', note: 'F4', notePosition: '3rd' },
    { file: 'melody_F4_delta_-02Hz.wav', delta: -2, correctAnswer: 'Lower', note: 'F4', notePosition: '3rd' },
    { file: 'melody_F4_delta_-03Hz.wav', delta: -3, correctAnswer: 'Lower', note: 'F4', notePosition: '3rd' },
    { file: 'melody_F4_delta_-04Hz.wav', delta: -4, correctAnswer: 'Lower', note: 'F4', notePosition: '3rd' },
    { file: 'melody_F4_delta_-05Hz.wav', delta: -5, correctAnswer: 'Lower', note: 'F4', notePosition: '3rd' },
    { file: 'melody_F4_delta_-06Hz.wav', delta: -6, correctAnswer: 'Lower', note: 'F4', notePosition: '3rd' },
    { file: 'melody_F4_delta_-07Hz.wav', delta: -7, correctAnswer: 'Lower', note: 'F4', notePosition: '3rd' },
    { file: 'melody_F4_delta_-08Hz.wav', delta: -8, correctAnswer: 'Lower', note: 'F4', notePosition: '3rd' },
    { file: 'melody_F4_delta_-09Hz.wav', delta: -9, correctAnswer: 'Lower', note: 'F4', notePosition: '3rd' },
    { file: 'melody_F4_delta_-10Hz.wav', delta: -10, correctAnswer: 'Lower', note: 'F4', notePosition: '3rd' }
];

let task1SelectedTrials = [];
let task2SelectedTrials = [];
let task3SelectedTrials = [];

// Current page tracking
let currentPageIndex = 0;
let pages = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeQuestionnaire();
});

function initializeQuestionnaire() {
    // Setup consent page
    const consentCheckbox = document.getElementById('consentCheckbox');
    const startBtn = document.getElementById('startBtn');
    
    consentCheckbox.addEventListener('change', function() {
        startBtn.disabled = !this.checked;
    });
    
    startBtn.addEventListener('click', function() {
        formData.consentGiven = true;
        formData.consentTimestamp = new Date().toISOString();
        nextPage();
    });
    
    // Setup demographics form
    const demographicsForm = document.getElementById('demographicsForm');
    demographicsForm.querySelector('.next-btn').addEventListener('click', function(e) {
        e.preventDefault();
        if (validateForm(demographicsForm)) {
            saveDemographicsData();
            setupRandomizedPages();
            nextPage();
        }
    });
    
    // Setup final form submission
    const finalForm = document.getElementById('finalForm');
    finalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveFinalData();
        submitAllData();
    });
    
    // Initialize pages array
    initializePages();
}

function initializePages() {
    pages = [
        'page-consent',
        'page-demographics'
        // Randomized pages will be added after demographics
        // 'page-final' will be added at the end
    ];
    currentPageIndex = 0;
}

function setupRandomizedPages() {
    // Select 7 random audio files for Task 1 (1 practice + 6 test trials)
    const shuffledAudio = shuffleArray([...task1AudioFiles]);
    task1SelectedTrials = shuffledAudio.slice(0, 7);
    
    // Store the selected trials for later analysis
    formData.task1AudioFiles = task1SelectedTrials.map(trial => ({
        file: trial.file,
        delta: trial.delta,
        correctAnswer: trial.correctAnswer
    }));
    
    // Select 7 random audio files for Task 2 (1 practice + 6 test trials)
    // Mix D4 and F4 alterations randomly
    const allTask2Files = [...task2AudioFilesD4, ...task2AudioFilesF4];
    const shuffledTask2Audio = shuffleArray(allTask2Files);
    task2SelectedTrials = shuffledTask2Audio.slice(0, 7);
    
    // Store the selected trials for later analysis
    formData.task2AudioFiles = task2SelectedTrials.map(trial => ({
        file: trial.file,
        delta: trial.delta,
        correctAnswer: trial.correctAnswer,
        note: trial.note,
        notePosition: trial.notePosition
    }));
    
    // Select 7 random audio files for Task 3 (1 practice + 6 test trials)
    // Mix D4 and F4 alterations randomly
    const allTask3Files = [...task3AudioFilesD4, ...task3AudioFilesF4];
    const shuffledTask3Audio = shuffleArray(allTask3Files);
    task3SelectedTrials = shuffledTask3Audio.slice(0, 7);
    
    // Store the selected trials for later analysis
    formData.task3AudioFiles = task3SelectedTrials.map(trial => ({
        file: trial.file,
        delta: trial.delta,
        correctAnswer: trial.correctAnswer,
        note: trial.note,
        notePosition: trial.notePosition
    }));
    
    // Get all randomized section pages (now each section has description + activity page)
    const randomizedSections = [
        ['page-section1-description', 'page-section1-practice', 'page-section1-trial1', 'page-section1-trial2', 'page-section1-trial3', 'page-section1-trial4', 'page-section1-trial5', 'page-section1-trial6'],
        ['page-section2-description', 'page-section2-practice', 'page-section2-trial1', 'page-section2-trial2', 'page-section2-trial3', 'page-section2-trial4', 'page-section2-trial5', 'page-section2-trial6'],
        ['page-section3-description', 'page-section3-practice', 'page-section3-trial1', 'page-section3-trial2', 'page-section3-trial3', 'page-section3-trial4', 'page-section3-trial5', 'page-section3-trial6']
    ];
    
    // Shuffle the sections using Fisher-Yates algorithm
    const shuffled = shuffleArray([...randomizedSections]);
    
    // Store the randomized order
    formData.sectionOrder = shuffled.map((section, index) => {
        const firstPage = section[0];
        const sectionNum = firstPage.replace('page-section', '').replace('-description', '');
        return `Section${sectionNum}`;
    });
    
    // Flatten and add shuffled pages to the pages array
    shuffled.forEach(section => {
        section.forEach(pageId => {
            pages.push(pageId);
        });
    });
    
    // Add final page at the end
    pages.push('page-final');
    
    // Setup Task 1 pages
    setupTask1Pages();
    
    // Setup Task 2 pages
    setupTask2Pages();
    
    // Setup Task 3 pages
    setupTask3Pages();
}

function setupTask1Pages() {
    // Setup practice trial
    const practicePage = document.getElementById('page-section1-practice');
    const practiceForm = document.getElementById('section1PracticeForm');
    const practiceBtn = practiceForm.querySelector('.next-btn');
    const practiceAudio = document.getElementById('audio-task1-practice');
    
    // Set practice audio
    practiceAudio.querySelector('source').src = `data/task1_isolated_tones/${task1SelectedTrials[0].file}`;
    practiceAudio.load();
    
    // Track when trial starts (when page is shown)
    let practiceStartTime = null;
    const practiceObserver = new MutationObserver(() => {
        if (!practicePage.classList.contains('hidden') && !practiceStartTime) {
            practiceStartTime = new Date().toISOString();
        }
    });
    practiceObserver.observe(practicePage, { attributes: true, attributeFilter: ['class'] });
    
    practiceBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (validateForm(practiceForm)) {
            const userResponse = document.querySelector('input[name="pitchResponsePractice"]:checked').value;
            const correctAnswer = task1SelectedTrials[0].correctAnswer;
            
            // Show feedback
            const feedbackDiv = document.getElementById('practice-feedback');
            feedbackDiv.classList.remove('hidden');
            
            if (userResponse === correctAnswer) {
                feedbackDiv.innerHTML = '✓ <strong>Correct!</strong> The comparison tone was ' + correctAnswer.toLowerCase() + '.';
                feedbackDiv.style.color = '#28a745';
            } else {
                feedbackDiv.innerHTML = '✗ <strong>Not quite.</strong> The comparison tone was actually ' + correctAnswer.toLowerCase() + '. You answered: ' + userResponse.toLowerCase() + '.';
                feedbackDiv.style.color = '#dc3545';
            }
            
            // Save practice data
            formData.task1Trials.push({
                trialType: 'practice',
                audioFile: task1SelectedTrials[0].file,
                delta: task1SelectedTrials[0].delta,
                correctAnswer: correctAnswer,
                userResponse: userResponse,
                correct: userResponse === correctAnswer,
                startTimestamp: practiceStartTime,
                responseTimestamp: new Date().toISOString()
            });
            
            // Change button text and proceed on second click
            if (practiceBtn.textContent === 'Next') {
                practiceBtn.textContent = 'Continue to Test Trials';
            } else {
                nextPage();
            }
        }
    });
    
    // Setup test trials
    for (let i = 1; i <= 6; i++) {
        const trialPage = document.getElementById(`page-section1-trial${i}`);
        const trialForm = document.getElementById(`section1Trial${i}Form`);
        const trialBtn = trialForm.querySelector('.next-btn');
        const trialAudio = document.getElementById(`audio-task1-trial${i}`);
        
        // Set audio for this trial
        trialAudio.querySelector('source').src = `data/task1_isolated_tones/${task1SelectedTrials[i].file}`;
        trialAudio.load();
        
        // Track when trial starts (when page is shown)
        let trialStartTime = null;
        const trialObserver = new MutationObserver(() => {
            if (!trialPage.classList.contains('hidden') && !trialStartTime) {
                trialStartTime = new Date().toISOString();
            }
        });
        trialObserver.observe(trialPage, { attributes: true, attributeFilter: ['class'] });
        
        // Add event listener
        trialBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateForm(trialForm)) {
                const userResponse = document.querySelector(`input[name="pitchResponse${i}"]:checked`).value;
                const correctAnswer = task1SelectedTrials[i].correctAnswer;
                
                // Save trial data
                formData.task1Trials.push({
                    trialType: 'test',
                    trialNumber: i,
                    audioFile: task1SelectedTrials[i].file,
                    delta: task1SelectedTrials[i].delta,
                    correctAnswer: correctAnswer,
                    userResponse: userResponse,
                    correct: userResponse === correctAnswer,
                    startTimestamp: trialStartTime,
                    responseTimestamp: new Date().toISOString()
                });
                
                nextPage();
            }
        });
    }
}

function setupTask2Pages() {
    // Setup practice trial
    const practicePage = document.getElementById('page-section2-practice');
    const practiceForm = document.getElementById('section2PracticeForm');
    const practiceBtn = practiceForm.querySelector('.next-btn');
    const practiceAudio = document.getElementById('audio-task2-practice');
    const practiceHint = document.getElementById('task2-practice-hint');
    
    // Set practice audio and hint
    const practiceFolder = task2SelectedTrials[0].note === 'D4' ? 'task2_melody_D4' : 'task2_melody_F4';
    practiceAudio.querySelector('source').src = `data/${practiceFolder}/${task2SelectedTrials[0].file}`;
    practiceAudio.load();
    practiceHint.innerHTML = `<strong>Pay attention to the ${task2SelectedTrials[0].notePosition} note (${task2SelectedTrials[0].note})</strong> - "Birth" in the phrase.`;
    
    // Track when trial starts
    let practiceStartTime = null;
    const practiceObserver = new MutationObserver(() => {
        if (!practicePage.classList.contains('hidden') && !practiceStartTime) {
            practiceStartTime = new Date().toISOString();
        }
    });
    practiceObserver.observe(practicePage, { attributes: true, attributeFilter: ['class'] });
    
    practiceBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (validateForm(practiceForm)) {
            const userResponse = document.querySelector('input[name="melodyResponsePractice"]:checked').value;
            const correctAnswer = task2SelectedTrials[0].correctAnswer;
            
            // Show feedback
            const feedbackDiv = document.getElementById('practice-feedback-task2');
            feedbackDiv.classList.remove('hidden');
            
            if (userResponse === correctAnswer) {
                feedbackDiv.innerHTML = '✓ <strong>Correct!</strong> The melody was ' + correctAnswer.toLowerCase() + '.';
                feedbackDiv.style.color = '#28a745';
            } else {
                feedbackDiv.innerHTML = '✗ <strong>Not quite.</strong> The melody was actually ' + correctAnswer.toLowerCase() + '. You answered: ' + userResponse.toLowerCase() + '.';
                feedbackDiv.style.color = '#dc3545';
            }
            
            // Save practice data
            formData.task2Trials.push({
                trialType: 'practice',
                audioFile: task2SelectedTrials[0].file,
                delta: task2SelectedTrials[0].delta,
                note: task2SelectedTrials[0].note,
                notePosition: task2SelectedTrials[0].notePosition,
                correctAnswer: correctAnswer,
                userResponse: userResponse,
                correct: userResponse === correctAnswer,
                startTimestamp: practiceStartTime,
                responseTimestamp: new Date().toISOString()
            });
            
            // Change button text and proceed on second click
            if (practiceBtn.textContent === 'Next') {
                practiceBtn.textContent = 'Continue to Test Trials';
            } else {
                nextPage();
            }
        }
    });
    
    // Setup test trials
    for (let i = 1; i <= 6; i++) {
        const trialPage = document.getElementById(`page-section2-trial${i}`);
        const trialForm = document.getElementById(`section2Trial${i}Form`);
        const trialBtn = trialForm.querySelector('.next-btn');
        const trialAudio = document.getElementById(`audio-task2-trial${i}`);
        const trialHint = document.getElementById(`task2-trial${i}-hint`);
        
        // Set audio for this trial
        const trialFolder = task2SelectedTrials[i].note === 'D4' ? 'task2_melody_D4' : 'task2_melody_F4';
        trialAudio.querySelector('source').src = `data/${trialFolder}/${task2SelectedTrials[i].file}`;
        trialAudio.load();
        
        // Set hint based on which note is being modified
        trialHint.textContent = `💡 Pay attention to the ${task2SelectedTrials[i].notePosition} note (${task2SelectedTrials[i].note})`;
        
        // Track when trial starts
        let trialStartTime = null;
        const trialObserver = new MutationObserver(() => {
            if (!trialPage.classList.contains('hidden') && !trialStartTime) {
                trialStartTime = new Date().toISOString();
            }
        });
        trialObserver.observe(trialPage, { attributes: true, attributeFilter: ['class'] });
        
        // Add event listener
        trialBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateForm(trialForm)) {
                const userResponse = document.querySelector(`input[name="melodyResponse${i}"]:checked`).value;
                const correctAnswer = task2SelectedTrials[i].correctAnswer;
                
                // Save trial data
                formData.task2Trials.push({
                    trialType: 'test',
                    trialNumber: i,
                    audioFile: task2SelectedTrials[i].file,
                    delta: task2SelectedTrials[i].delta,
                    note: task2SelectedTrials[i].note,
                    notePosition: task2SelectedTrials[i].notePosition,
                    correctAnswer: correctAnswer,
                    userResponse: userResponse,
                    correct: userResponse === correctAnswer,
                    startTimestamp: trialStartTime,
                    responseTimestamp: new Date().toISOString()
                });
                
                nextPage();
            }
        });
    }
}

function setupTask3Pages() {
    // Setup practice trial
    const practicePage = document.getElementById('page-section3-practice');
    const practiceForm = document.getElementById('section3PracticeForm');
    const practiceBtn = practiceForm.querySelector('.next-btn');
    const practiceAudio = document.getElementById('audio-task3-practice');
    const practiceHint = document.getElementById('task3-practice-hint');
    
    // Set practice audio and hint
    const practiceFolder = task3SelectedTrials[0].note === 'D4' ? 'task3_melody_D4' : 'task3_melody_F4';
    practiceAudio.querySelector('source').src = `data/${practiceFolder}/${task3SelectedTrials[0].file}`;
    practiceAudio.load();
    practiceHint.innerHTML = `<strong>Pay attention to the ${task3SelectedTrials[0].notePosition} note (${task3SelectedTrials[0].note})</strong>`;
    
    // Track when trial starts
    let practiceStartTime = null;
    const practiceObserver = new MutationObserver(() => {
        if (!practicePage.classList.contains('hidden') && !practiceStartTime) {
            practiceStartTime = new Date().toISOString();
        }
    });
    practiceObserver.observe(practicePage, { attributes: true, attributeFilter: ['class'] });
    
    practiceBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (validateForm(practiceForm)) {
            const userResponse = document.querySelector('input[name="unfamiliarResponsePractice"]:checked').value;
            const correctAnswer = task3SelectedTrials[0].correctAnswer;
            
            // Show feedback
            const feedbackDiv = document.getElementById('practice-feedback-task3');
            feedbackDiv.classList.remove('hidden');
            
            if (userResponse === correctAnswer) {
                feedbackDiv.innerHTML = '✓ <strong>Correct!</strong> The melody was ' + correctAnswer.toLowerCase() + '.';
                feedbackDiv.style.color = '#28a745';
            } else {
                feedbackDiv.innerHTML = '✗ <strong>Not quite.</strong> The melody was actually ' + correctAnswer.toLowerCase() + '. You answered: ' + userResponse.toLowerCase() + '.';
                feedbackDiv.style.color = '#dc3545';
            }
            
            // Save practice data
            formData.task3Trials.push({
                trialType: 'practice',
                audioFile: task3SelectedTrials[0].file,
                delta: task3SelectedTrials[0].delta,
                note: task3SelectedTrials[0].note,
                notePosition: task3SelectedTrials[0].notePosition,
                correctAnswer: correctAnswer,
                userResponse: userResponse,
                correct: userResponse === correctAnswer,
                startTimestamp: practiceStartTime,
                responseTimestamp: new Date().toISOString()
            });
            
            // Change button text and proceed on second click
            if (practiceBtn.textContent === 'Next') {
                practiceBtn.textContent = 'Continue to Test Trials';
            } else {
                nextPage();
            }
        }
    });
    
    // Setup test trials
    for (let i = 1; i <= 6; i++) {
        const trialPage = document.getElementById(`page-section3-trial${i}`);
        const trialForm = document.getElementById(`section3Trial${i}Form`);
        const trialBtn = trialForm.querySelector('.next-btn');
        const trialAudio = document.getElementById(`audio-task3-trial${i}`);
        const trialHint = document.getElementById(`task3-trial${i}-hint`);
        
        // Set audio for this trial
        const trialFolder = task3SelectedTrials[i].note === 'D4' ? 'task3_melody_D4' : 'task3_melody_F4';
        trialAudio.querySelector('source').src = `data/${trialFolder}/${task3SelectedTrials[i].file}`;
        trialAudio.load();
        
        // Set hint based on which note is being modified
        trialHint.textContent = `💡 Pay attention to the ${task3SelectedTrials[i].notePosition} note (${task3SelectedTrials[i].note})`;
        
        // Track when trial starts
        let trialStartTime = null;
        const trialObserver = new MutationObserver(() => {
            if (!trialPage.classList.contains('hidden') && !trialStartTime) {
                trialStartTime = new Date().toISOString();
            }
        });
        trialObserver.observe(trialPage, { attributes: true, attributeFilter: ['class'] });
        
        // Add event listener
        trialBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateForm(trialForm)) {
                const userResponse = document.querySelector(`input[name="unfamiliarResponse${i}"]:checked`).value;
                const correctAnswer = task3SelectedTrials[i].correctAnswer;
                
                // Save trial data
                formData.task3Trials.push({
                    trialType: 'test',
                    trialNumber: i,
                    audioFile: task3SelectedTrials[i].file,
                    delta: task3SelectedTrials[i].delta,
                    note: task3SelectedTrials[i].note,
                    notePosition: task3SelectedTrials[i].notePosition,
                    correctAnswer: correctAnswer,
                    userResponse: userResponse,
                    correct: userResponse === correctAnswer,
                    startTimestamp: trialStartTime,
                    responseTimestamp: new Date().toISOString()
                });
                
                nextPage();
            }
        });
    }
}

function setupSectionPage(pageId, formId) {
    const page = document.getElementById(pageId);
    if (!page) return;
    
    const form = document.getElementById(formId);
    const nextBtn = form.querySelector('.next-btn');
    
    nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (validateForm(form)) {
            saveSectionData(pageId, form);
            nextPage();
        }
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function validateForm(form) {
    // Check if all required fields are filled
    const requiredInputs = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredInputs.forEach(input => {
        if (input.type === 'radio') {
            const radioGroup = form.querySelectorAll(`[name="${input.name}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);
            if (!isChecked) {
                isValid = false;
            }
        } else if (input.type === 'checkbox' && input.hasAttribute('required')) {
            if (!input.checked) {
                isValid = false;
            }
        } else if (!input.value.trim()) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields before continuing.');
    }
    
    return isValid;
}

function saveDemographicsData() {
    formData.age = document.getElementById('age').value;
    formData.country = document.getElementById('country').value;
    formData.gender = document.querySelector('input[name="gender"]:checked').value;
    formData.musicalTraining = document.querySelector('input[name="musicalTraining"]:checked').value;
    formData.instruments = document.getElementById('instruments').value;
    formData.musicFrequency = document.querySelector('input[name="musicFrequency"]:checked').value;
    formData.happyBirthdayFamiliarity = document.querySelector('input[name="happyBirthdayFamiliarity"]:checked').value;
    formData.pitchTestExperience = document.querySelector('input[name="pitchTestExperience"]:checked').value;
    formData.headphones = document.querySelector('input[name="headphones"]:checked').value;
}

function saveSectionData(pageId, form) {
    const sectionNum = pageId.replace('page-section', '');
    const sectionKey = `section${sectionNum}`;
    
    formData[sectionKey] = {};
    
    // Save all form inputs
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type === 'radio') {
            if (input.checked) {
                formData[sectionKey][input.name] = input.value;
            }
        } else if (input.type === 'checkbox') {
            if (!formData[sectionKey][input.name]) {
                formData[sectionKey][input.name] = [];
            }
            if (input.checked) {
                formData[sectionKey][input.name].push(input.value);
            }
        } else if (input.name) {
            formData[sectionKey][input.name] = input.value;
        }
    });
}

function saveFinalData() {
    formData.feedback = document.getElementById('feedback').value;
    formData.completionTimestamp = new Date().toISOString();
}

function nextPage() {
    // Hide current page
    const currentPage = document.getElementById(pages[currentPageIndex]);
    if (currentPage) {
        currentPage.classList.add('hidden');
    }
    
    // Show next page
    currentPageIndex++;
    if (currentPageIndex < pages.length) {
        const nextPage = document.getElementById(pages[currentPageIndex]);
        nextPage.classList.remove('hidden');
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
}

function submitAllData() {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Calculate Task 1 accuracy
    const task1TestTrials = formData.task1Trials.filter(t => t.trialType === 'test');
    const task1Correct = task1TestTrials.filter(t => t.correct).length;
    const task1Accuracy = task1TestTrials.length > 0 ? (task1Correct / task1TestTrials.length * 100).toFixed(1) : 0;
    
    // Calculate Task 2 accuracy
    const task2TestTrials = formData.task2Trials.filter(t => t.trialType === 'test');
    const task2Correct = task2TestTrials.filter(t => t.correct).length;
    const task2Accuracy = task2TestTrials.length > 0 ? (task2Correct / task2TestTrials.length * 100).toFixed(1) : 0;
    
    // Calculate Task 3 accuracy
    const task3TestTrials = formData.task3Trials.filter(t => t.trialType === 'test');
    const task3Correct = task3TestTrials.filter(t => t.correct).length;
    const task3Accuracy = task3TestTrials.length > 0 ? (task3Correct / task3TestTrials.length * 100).toFixed(1) : 0;
    
    // Prepare data for Google Sheets
    const submissionData = {
        timestamp: formData.timestamp,
        age: formData.age,
        country: formData.country,
        gender: formData.gender,
        musicalTraining: formData.musicalTraining,
        instruments: formData.instruments,
        musicFrequency: formData.musicFrequency,
        happyBirthdayFamiliarity: formData.happyBirthdayFamiliarity,
        pitchTestExperience: formData.pitchTestExperience,
        headphones: formData.headphones,
        sectionOrder: formData.sectionOrder.join(' → '),
        task1Accuracy: task1Accuracy + '%',
        task1Details: JSON.stringify(formData.task1Trials),
        task2Accuracy: task2Accuracy + '%',
        task2Details: JSON.stringify(formData.task2Trials),
        task3Accuracy: task3Accuracy + '%',
        task3Details: JSON.stringify(formData.task3Trials),
        feedback: formData.feedback,
        completionTimestamp: formData.completionTimestamp
    };
    
    fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
    })
    .then(() => {
        // Show success message
        const finalForm = document.getElementById('finalForm');
        const successMessage = document.getElementById('successMessage');
        
        finalForm.style.display = 'none';
        successMessage.classList.remove('hidden');
        
        // Optional: Reset after some time or redirect
        setTimeout(() => {
            window.location.reload();
        }, 5000);
    })
    .catch((error) => {
        console.error('Error submitting form:', error);
        alert('There was an error submitting the form. Please try again.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}
