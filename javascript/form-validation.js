// Show/hide sections based on selections
document.querySelectorAll('input[name="Employment Status"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const selfEmployedSection = document.getElementById('selfEmployedSection');
        const employedSection = document.getElementById('employedSection');
        
        if (this.value === 'Self-employed') {
            selfEmployedSection.style.display = 'block';
            employedSection.style.display = 'none';
        } else {
            selfEmployedSection.style.display = 'none';
            employedSection.style.display = 'block';
        }
    });
});

document.querySelectorAll('input[name="Additional Occupants"]').forEach(radio => {
    radio.addEventListener('change', function() {
        document.getElementById('occupantsSection').style.display = 
            this.value === 'Yes' ? 'block' : 'none';
    });
});

document.querySelectorAll('input[name="Has Pets"]').forEach(radio => {
    radio.addEventListener('change', function() {
        document.getElementById('petsSection').style.display = 
            this.value === 'Yes' ? 'block' : 'none';
    });
});

// Initially hide sections
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('selfEmployedSection').style.display = 'none';
    document.getElementById('employedSection').style.display = 'none';
    document.getElementById('occupantsSection').style.display = 'none';
    document.getElementById('petsSection').style.display = 'none';
});

// Add/remove additional applicants
function addApplicant() {
    const container = document.querySelector('.additional-applicants');
    const newRow = document.createElement('div');
    newRow.className = 'applicant-row';
    newRow.innerHTML = `
        <input type="text" placeholder="Full Name" name="Additional Applicant Name[]">
        <input type="date" placeholder="Date of Birth" name="Additional Applicant DOB[]">
        <select name="Additional Applicant Type[]">
            <option value="">-- Select Type --</option>
            <option value="tenant">Tenant (adult on tenancy agreement)</option>
            <option value="permitted_adult">Permitted Occupier (adult)</option>
            <option value="permitted_child">Permitted Occupier (child under 18)</option>
        </select>
        <input type="email" placeholder="Email (if applicable)" name="Additional Applicant Email[]">
        <input type="tel" placeholder="Phone (if applicable)" name="Additional Applicant Phone[]">
        <input type="text" placeholder="Relationship to Main Applicant" name="Relationship to Main Applicant[]">
        <button type="button" class="remove-btn" onclick="removeApplicant(this)">Remove</button>
    `;
    container.appendChild(newRow);
}

function removeApplicant(button) {
    button.parentElement.remove();
}

// Form validation
document.getElementById('tenancyForm').addEventListener('submit', function(e) {
    let isValid = true;
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(el => {
        el.textContent = '';
    });

    // Required field validation
    const requiredFields = [
        { id: 'fullName', message: 'Full name is required' },
        { id: 'dob', message: 'Date of birth is required' },
        { id: 'contactNumber', message: 'Contact number is required' },
        { id: 'email', message: 'Email address is required' },
        { id: 'nationality', message: 'Nationality is required' },
        { id: 'currentAddress', message: 'Current address is required' },
        { id: 'timeAtAddress', message: 'Time at address is required' },
        { id: 'reasonForLeaving', message: 'Reason for leaving is required' },
        { id: 'landlordContact', message: 'Landlord contact is required' },
        { id: 'landlordReference', message: 'Landlord reference is required' },
        { id: 'employerReference', message: 'Employer reference is required' }
    ];

    requiredFields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!input.value.trim()) {
            document.getElementById(`${field.id}Error`).textContent = field.message;
            isValid = false;
        }
    });

    // Radio button validation
    const radioGroups = [
        { name: 'Employment Status', error: 'employmentStatusError', message: 'Please select an employment status' },
        { name: 'Additional Occupants', error: 'additionalOccupantsError', message: 'Please indicate if there are additional occupants' },
        { name: 'Has Pets', error: 'hasPetsError', message: 'Please indicate if you have pets' },
        { name: 'Right to Rent in UK', error: 'rightToRentError', message: 'Please indicate your Right to Rent status' }
    ];

    radioGroups.forEach(group => {
        const selected = document.querySelector(`input[name="${group.name}"]:checked`);
        if (!selected) {
            document.getElementById(group.error).textContent = group.message;
            isValid = false;
        }
    });

    // Consent checkbox validation
    if (!document.getElementById('consentCheck').checked) {
        document.getElementById('consentCheckError').textContent = 'You must provide consent to proceed';
        isValid = false;
    }

    // Right to rent document validation
    const rightToRentValue = document.querySelector('input[name="Right to Rent in UK"]:checked')?.value;
    if (rightToRentValue === 'Yes') {
        const documents = document.querySelectorAll('input[name="Right to Rent Documents"]:checked');
        if (documents.length === 0) {
            document.getElementById('rightToRentDocumentsError').textContent = 'Please select at least one document type';
            isValid = false;
        }
    }

    // Email validation
    const emailInput = document.getElementById('email');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value && !emailPattern.test(emailInput.value)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address';
        isValid = false;
    }

    // Prevent form submission if validation fails
    if (!isValid) {
        e.preventDefault();
        
        // Scroll to the first error
        const firstError = document.querySelector('.error:not(:empty)');
        if (firstError) {
            firstError.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    }
});

// Format the checkbox data for FormSubmit
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('tenancyForm');
    form.addEventListener('submit', function() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            if (checkbox.name === 'Right to Rent Documents') {
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = 'Selected Documents[]';
                hiddenField.value = checkbox.value;
                form.appendChild(hiddenField);
            }
        });
    });
});