// Configuration - Replace with your Google Apps Script Web App URL
// See README.md for setup instructions
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbz2tGgPpsfQcm0LU9cIY4EFCOVETqO7xPeTwjg1agTxmTD2TxlCBTDQAMK8y1ZpWmS1/exec';

// Global state to store all form data
const formData = {
    timestamp: new Date().toISOString(),
    sectionOrder: []
};

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
    // Get all randomized section pages
    const randomizedPages = ['page-section1', 'page-section2', 'page-section3'];
    
    // Shuffle the array using Fisher-Yates algorithm
    const shuffled = shuffleArray([...randomizedPages]);
    
    // Store the randomized order
    formData.sectionOrder = shuffled.map((pageId, index) => {
        const sectionNum = pageId.replace('page-section', '');
        return `Section${sectionNum}`;
    });
    
    // Add shuffled pages to the pages array
    pages = pages.concat(shuffled);
    
    // Add final page at the end
    pages.push('page-final');
    
    // Setup next buttons for randomized pages
    shuffled.forEach((pageId, index) => {
        const page = document.getElementById(pageId);
        const form = page.querySelector('form');
        const nextBtn = form.querySelector('.next-btn');
        
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateForm(form)) {
                saveSectionData(pageId, form);
                nextPage();
            }
        });
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
        task1Response: formData.section1?.pitchResponse || '',
        task2Response: formData.section2?.melodyResponse || '',
        task3Response: formData.section3?.unfamiliarResponse || '',
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
