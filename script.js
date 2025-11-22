// Configuration - Replace with your Google Apps Script Web App URL
// See README.md for setup instructions
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxiXrKmv-EfM-wOFYIoVmfaOTZhz5gSXJSC_VZvOwB61_-4nG3uOSrsX2eS3RG3lErx/exec';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('questionnaireForm');
    const successMessage = document.getElementById('successMessage');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Collect form data
        const data = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            satisfaction: document.querySelector('input[name="satisfaction"]:checked')?.value || '',
            features: Array.from(document.querySelectorAll('input[name="features"]:checked'))
                .map(cb => cb.value)
                .join(', '),
            feedback: document.getElementById('feedback').value,
            timestamp: new Date().toISOString()
        };

        // Submit to Google Sheets
        submitToGoogleSheet(data);
    });

    function submitToGoogleSheet(data) {
        // Show loading state
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(() => {
            // Show success message
            form.style.display = 'none';
            successMessage.classList.remove('hidden');
            
            // Reset form after 3 seconds
            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                successMessage.classList.add('hidden');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        })
        .catch((error) => {
            console.error('Error submitting form:', error);
            alert('There was an error submitting the form. Please try again.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }
});
