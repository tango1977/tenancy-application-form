// Show/hide sections based on selections
document.querySelectorAll('input[name="Employment_Status"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const selfEmployedSection = document.getElementById('selfEmployedSection');
        const employedSection = document.getElementById('employedSection');
        const selfEmployedReferences = document.getElementById('selfEmployedReferences');
        const employedReferences = document.getElementById('employedReferences');
        
        if (this.value === 'Self-employed') {
            selfEmployedSection.style.display = 'block';
            employedSection.style.display = 'none';
            selfEmployedReferences.style.display = 'block';
            employedReferences.style.display = 'none';
            
            // Make accountant reference required instead of employer reference
            document.getElementById('accountantReference').setAttribute('required', '');
            document.getElementById('employerReference').removeAttribute('required');
        } else {
            selfEmployedSection.style.display = 'none';
            employedSection.style.display = 'block';
            selfEmployedReferences.style.display = 'none';
            employedReferences.style.display = 'block';
            
            // Make employer reference required instead of accountant reference
            document.getElementById('employerReference').setAttribute('required', '');
            document.getElementById('accountantReference').removeAttribute('required');
        }
    });
});

document.querySelectorAll('input[name="Additional_Occupants"]').forEach(radio => {
    radio.addEventListener('change', function() {
        document.getElementById('occupantsSection').style.display = 
            this.value === 'Yes' ? 'block' : 'none';
    });
});

document.querySelectorAll('input[name="Has_Pets"]').forEach(radio => {
    radio.addEventListener('change', function() {
        document.getElementById('petsSection').style.display = 
            this.value === 'Yes' ? 'block' : 'none';
    });
});

// Add text fields for manual date entry
function enhanceDateInputs() {
    // Add manual text fields for dates
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        // Create a manual text input for dates
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.placeholder = 'Enter date as DD/MM/YYYY';
        textInput.className = 'manual-date-input';
        textInput.id = input.id + '_text';
        
        // Add helper text
        const helper = document.createElement('small');
        helper.className = 'date-helper';
        helper.innerHTML = 'Type date in DD/MM/YYYY format for easier entry';
        
        // Check if we're on mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            // On mobile, hide the date picker and show text input
            input.style.display = 'none';
            
            // Insert the text input and helper
            input.parentNode.insertBefore(textInput, input);
            input.parentNode.insertBefore(helper, input);
            
            // Set up validation and syncing
            textInput.addEventListener('change', function() {
                const dateValue = convertToISODate(this.value);
                if (dateValue) {
                    input.value = dateValue;
                } else if (this.value.trim() !== '') {
                    helper.innerHTML = 'Please use DD/MM/YYYY format (e.g., 15/04/1985)';
                    helper.style.color = 'red';
                }
            });
        } else {
            // On desktop, keep the date picker visible with a helper
            input.parentNode.insertBefore(helper, input.nextSibling);
        }
    });
    
    // Watch for dynamically added date inputs
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                const dateInputs = mutation.target.querySelectorAll('input[type="date"]:not(.enhanced)');
                dateInputs.forEach(input => {
                    input.classList.add('enhanced');
                    
                    // Create a manual text input for dates
                    const textInput = document.createElement('input');
                    textInput.type = 'text';
                    textInput.placeholder = 'Enter date as DD/MM/YYYY';
                    textInput.className = 'manual-date-input';
                    
                    // Add helper text
                    const helper = document.createElement('small');
                    helper.className = 'date-helper';
                    helper.innerHTML = 'Type date in DD/MM/YYYY format for easier entry';
                    
                    // Check if we're on mobile
                    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                    
                    if (isMobile) {
                        // On mobile, hide the date picker and show text input
                        input.style.display = 'none';
                        
                        // Insert the text input and helper
                        input.parentNode.insertBefore(textInput, input);
                        input.parentNode.insertBefore(helper, input);
                        
                        // Set up validation and syncing
                        textInput.addEventListener('change', function() {
                            const dateValue = convertToISODate(this.value);
                            if (dateValue) {
                                input.value = dateValue;
                            } else if (this.value.trim() !== '') {
                                helper.innerHTML = 'Please use DD/MM/YYYY format (e.g., 15/04/1985)';
                                helper.style.color = 'red';
                            }
                        });
                    } else {
                        // On desktop, keep the date picker visible with a helper
                        input.parentNode.insertBefore(helper, input.nextSibling);
                    }
                });
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// Helper function to convert DD/MM/YYYY to YYYY-MM-DD
function convertToISODate(dateString) {
    // Try DD/MM/YYYY format
    const parts = dateString.split('/');
    if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        
        // Basic validation
        if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900 && year <= 2100) {
            return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        }
    }
    
    // Try to parse as a date in case the user entered a different format
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
    }
    
    return null;
}

// Initially hide sections
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('selfEmployedSection').style.display = 'none';
    document.getElementById('employedSection').style.display = 'none';
    document.getElementById('selfEmployedReferences').style.display = 'none';
    document.getElementById('occupantsSection').style.display = 'none';
    document.getElementById('petsSection').style.display = 'none';
    
    // Set up event listeners again to ensure they're properly attached
    setupEventListeners();
    
    // Enhance date inputs
    enhanceDateInputs();
});

function setupEventListeners() {
    // Re-attach employment status listeners
    document.querySelectorAll('input[name="Employment_Status"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const selfEmployedSection = document.getElementById('selfEmployedSection');
            const employedSection = document.getElementById('employedSection');
            const selfEmployedReferences = document.getElementById('selfEmployedReferences');
            const employedReferences = document.getElementById('employedReferences');
            
            if (this.value === 'Self-employed') {
                selfEmployedSection.style.display = 'block';
                employedSection.style.display = 'none';
                selfEmployedReferences.style.display = 'block';
                employedReferences.style.display ='none';
                
                // Make accountant reference required instead of employer reference
                document.getElementById('accountantReference').setAttribute('required', '');
                document.getElementById('employerReference').removeAttribute('required');
            } else {
                selfEmployedSection.style.display = 'none';
                employedSection.style.display = 'block';
                selfEmployedReferences.style.display = 'none';
                employedReferences.style.display = 'block';
                
                // Make employer reference required instead of accountant reference
                document.getElementById('employerReference').setAttribute('required', '');
                document.getElementById('accountantReference').removeAttribute('required');
            }
        });
    });

    // Re-attach additional occupants listeners
    document.querySelectorAll('input[name="Additional_Occupants"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('occupantsSection').style.display = 
                this.value === 'Yes' ? 'block' : 'none';
        });
    });

    // Re-attach pets listeners
    document.querySelectorAll('input[name="Has_Pets"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('petsSection').style.display = 
                this.value === 'Yes' ? 'block' : 'none';
        });
    });
}

// Add/remove additional applicants
function addApplicant() {
    const container = document.querySelector('.additional-applicants');
    const newRow = document.createElement('div');
    newRow.className = 'applicant-row';
    newRow.innerHTML = `
        <input type="text" placeholder="Full Name" name="Additional_Applicant_Name[]">
        <input type="date" placeholder="Date of Birth" name="Additional_Applicant_DOB[]" class="enhanced">
        <select name="Additional_Applicant_Type[]">
            <option value="">-- Select Type --</option>
            <option value="tenant">Tenant (adult on tenancy agreement)</option>
            <option value="permitted_adult">Permitted Occupier (adult)</option>
            <option value="permitted_child">Permitted Occupier (child under 18)</option>
        </select>
        <input type="email" placeholder="Email (if applicable)" name="Additional_Applicant_Email[]">
        <input type="tel" placeholder="Phone (if applicable)" name="Additional_Applicant_Phone[]">
        <input type="text" placeholder="Relationship to Main Applicant" name="Relationship_to_Main_Applicant[]">
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
        { id: 'landlordReference', message: 'Landlord reference is required' }
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
        { name: 'Employment_Status', error: 'employmentStatusError', message: 'Please select an employment status' },
        { name: 'Additional_Occupants', error: 'additionalOccupantsError', message: 'Please indicate if there are additional occupants' },
        { name: 'Has_Pets', error: 'hasPetsError', message: 'Please indicate if you have pets' },
        { name: 'Right_to_Rent_in_UK', error: 'rightToRentError', message: 'Please indicate your Right to Rent status' }
    ];

    radioGroups.forEach(group => {
        const selected = document.querySelector(`input[name="${group.name}"]:checked`);
        if (!selected) {
            document.getElementById(group.error).textContent = group.message;
            isValid = false;
        }
    });

    // Conditional field validation
    const employmentStatus = document.querySelector('input[name="Employment_Status"]:checked')?.value;
    if (employmentStatus === 'Self-employed') {
        // Validate accountant reference for self-employed
        if (!document.getElementById('accountantReference').value.trim()) {
            document.getElementById('accountantReferenceError').textContent = 'Accountant reference is required for self-employed applicants';
            isValid = false;
        }
    } else if (employmentStatus) {
        // Validate employer reference for other employment statuses
        if (!document.getElementById('employerReference').value.trim()) {
            document.getElementById('employerReferenceError').textContent = 'Employer reference is required';
            isValid = false;
        }
    }

    // Consent checkbox validation
    if (!document.getElementById('consentCheck').checked) {
        document.getElementById('consentCheckError').textContent = 'You must provide consent to proceed';
        isValid = false;
    }
    
    // Email notice consent validation
    if (!document.getElementById('emailConsentCheck').checked) {
        document.getElementById('emailConsentCheckError').textContent = 'You must consent to receive legal notices by email';
        isValid = false;
    }

    // Right to rent document validation
    const rightToRentValue = document.querySelector('input[name="Right_to_Rent_in_UK"]:checked')?.value;
    if (rightToRentValue === 'Yes') {
        const documents = document.querySelectorAll('input[name="Right_to_Rent_Documents"]:checked');
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
            if (checkbox.name === 'Right_to_Rent_Documents') {
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = 'Selected_Documents[]';
                hiddenField.value = checkbox.value;
                form.appendChild(hiddenField);
            }
        });
    });
});