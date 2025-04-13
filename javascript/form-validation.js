// Wait for the HTML document to be fully loaded and parsed
document.addEventListener('DOMContentLoaded', function() {

    // --- Initial Setup ---

    // Get references to frequently used elements
    const selfEmployedSection = document.getElementById('selfEmployedSection');
    const employedSection = document.getElementById('employedSection');
    const selfEmployedReferences = document.getElementById('selfEmployedReferences');
    const employedReferences = document.getElementById('employedReferences');
    const occupantsSection = document.getElementById('occupantsSection');
    const petsSection = document.getElementById('petsSection');
    const accountantReferenceInput = document.getElementById('accountantReference');
    const employerReferenceInput = document.getElementById('employerReference');
    const tenancyForm = document.getElementById('tenancyForm'); // Added for validation section

    // Initially hide all conditional sections
    // We'll show the correct ones based on initial radio button states later
    if (selfEmployedSection) selfEmployedSection.style.display = 'none';
    if (employedSection) employedSection.style.display = 'none';
    if (selfEmployedReferences) selfEmployedReferences.style.display = 'none';
    if (employedReferences) employedReferences.style.display = 'none';
    if (occupantsSection) occupantsSection.style.display = 'none';
    if (petsSection) petsSection.style.display = 'none';

    // --- Event Listener Setup ---

    // Employment Status Change Handler
    document.querySelectorAll('input[name="Employment_Status"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Check if elements exist before trying to access style/attributes
            const isSelfEmployed = this.value === 'Self-employed';

            if (selfEmployedSection) selfEmployedSection.style.display = isSelfEmployed ? 'block' : 'none';
            if (employedSection) employedSection.style.display = isSelfEmployed ? 'none' : 'block';
            if (selfEmployedReferences) selfEmployedReferences.style.display = isSelfEmployed ? 'block' : 'none';
            if (employedReferences) employedReferences.style.display = isSelfEmployed ? 'none' : 'block';

            // Toggle required attributes for references
            if (isSelfEmployed) {
                if (accountantReferenceInput) accountantReferenceInput.setAttribute('required', '');
                if (employerReferenceInput) employerReferenceInput.removeAttribute('required');
            } else {
                if (accountantReferenceInput) accountantReferenceInput.removeAttribute('required');
                // Only set employer ref as required if an employment status *is* selected (and it's not self-employed)
                if (employerReferenceInput && this.checked) employerReferenceInput.setAttribute('required', '');
                 else if (employerReferenceInput) employerReferenceInput.removeAttribute('required'); // Remove if no status selected
            }
        });
    });

    // Additional Occupants Change Handler
    document.querySelectorAll('input[name="Additional_Occupants"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (occupantsSection) {
                occupantsSection.style.display = this.value === 'Yes' ? 'block' : 'none';
            }
        });
    });

    // Has Pets Change Handler
    document.querySelectorAll('input[name="Has_Pets"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (petsSection) {
                petsSection.style.display = this.value === 'Yes' ? 'block' : 'none';
            }
        });
    });

    // --- Trigger Initial State ---
    // Dispatch the change event on initially checked radio buttons to set the correct
    // visibility and required attributes when the page loads. Use optional chaining (?)
    // in case no radio button in a group is checked by default.
    document.querySelector('input[name="Employment_Status"]:checked')?.dispatchEvent(new Event('change'));
    document.querySelector('input[name="Additional_Occupants"]:checked')?.dispatchEvent(new Event('change'));
    document.querySelector('input[name="Has_Pets"]:checked')?.dispatchEvent(new Event('change'));


    // --- Form Validation ---
    if (tenancyForm) {
        tenancyForm.addEventListener('submit', function(e) {
            let isValid = true;
            const errorElements = document.querySelectorAll('.error');
            errorElements.forEach(el => {
                el.textContent = ''; // Clear previous errors
            });

            // Required field validation (using IDs from original code)
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
                // Add other non-conditional required fields here
            ];

            requiredFields.forEach(field => {
                const input = document.getElementById(field.id);
                const errorElement = document.getElementById(`${field.id}Error`);
                if (input && !input.value.trim()) {
                    if (errorElement) errorElement.textContent = field.message;
                    isValid = false;
                }
            });

            // Radio button group validation
            const radioGroups = [
                { name: 'Employment_Status', error: 'employmentStatusError', message: 'Please select an employment status' },
                { name: 'Additional_Occupants', error: 'additionalOccupantsError', message: 'Please indicate if there are additional occupants' },
                { name: 'Has_Pets', error: 'hasPetsError', message: 'Please indicate if you have pets' },
                { name: 'Right_to_Rent_in_UK', error: 'rightToRentError', message: 'Please indicate your Right to Rent status' }
            ];

            radioGroups.forEach(group => {
                const selected = document.querySelector(`input[name="${group.name}"]:checked`);
                const errorElement = document.getElementById(group.error);
                if (!selected) {
                    if (errorElement) errorElement.textContent = group.message;
                    isValid = false;
                }
            });

            // Conditional field validation (References based on employment status)
            // This relies on the required attribute being set correctly by the change listener,
            // but we can double-check based on the *current* value at submit time for robustness.
            const employmentStatusChecked = document.querySelector('input[name="Employment_Status"]:checked');
            if (employmentStatusChecked) {
                 if (employmentStatusChecked.value === 'Self-employed') {
                    const accRefInput = document.getElementById('accountantReference');
                    const accRefError = document.getElementById('accountantReferenceError');
                    if (accRefInput && !accRefInput.value.trim()) {
                         if(accRefError) accRefError.textContent = 'Accountant reference is required for self-employed applicants';
                         isValid = false;
                    }
                } else { // Assumes other statuses require employer reference
                    const empRefInput = document.getElementById('employerReference');
                    const empRefError = document.getElementById('employerReferenceError');
                    if (empRefInput && !empRefInput.value.trim()) {
                        if(empRefError) empRefError.textContent = 'Employer reference is required';
                        isValid = false;
                    }
                }
            } // No else needed here, as the radio group validation above handles if *nothing* is selected

            // Consent checkbox validation
            const consentCheck = document.getElementById('consentCheck');
            const consentCheckError = document.getElementById('consentCheckError');
            if (consentCheck && !consentCheck.checked) {
                if (consentCheckError) consentCheckError.textContent = 'You must provide consent to proceed';
                isValid = false;
            }

            // Email notice consent validation
            const emailConsentCheck = document.getElementById('emailConsentCheck');
            const emailConsentCheckError = document.getElementById('emailConsentCheckError');
            if (emailConsentCheck && !emailConsentCheck.checked) {
                 if (emailConsentCheckError) emailConsentCheckError.textContent = 'You must consent to receive legal notices by email';
                 isValid = false;
            }

            // Right to rent document validation
            const rightToRentValue = document.querySelector('input[name="Right_to_Rent_in_UK"]:checked')?.value;
            const rightToRentDocumentsError = document.getElementById('rightToRentDocumentsError');
            if (rightToRentValue === 'Yes') {
                const documents = document.querySelectorAll('input[name="Right_to_Rent_Documents"]:checked');
                if (documents.length === 0) {
                    if (rightToRentDocumentsError) rightToRentDocumentsError.textContent = 'Please select at least one document type';
                    isValid = false;
                }
            }

            // Email format validation
            const emailInput = document.getElementById('email');
            const emailError = document.getElementById('emailError');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput && emailInput.value && !emailPattern.test(emailInput.value)) {
                if (emailError) emailError.textContent = 'Please enter a valid email address';
                isValid = false;
            }

            // Prevent form submission if validation fails
            if (!isValid) {
                e.preventDefault(); // Stop the form from submitting

                // Scroll to the first visible error message
                const firstError = document.querySelector('.error:not(:empty)');
                 if (firstError) {
                    // Find the corresponding input/element for better focus/scrolling context if possible
                    let focusElement = firstError.previousElementSibling; // Try element before error message
                    while(focusElement && (focusElement.tagName === 'LABEL' || focusElement.tagName === 'BR')) {
                         focusElement = focusElement.previousElementSibling;
                    }
                    if (!focusElement || !focusElement.scrollIntoView) {
                        focusElement = firstError; // Fallback to scrolling to error message itself
                    }

                    focusElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Optional: Try to focus the related input
                    if (focusElement && typeof focusElement.focus === 'function' && focusElement.type !== 'hidden') {
                         try { focusElement.focus({ preventScroll: true }); } catch(err) {/* Ignore focus errors */}
                    }
                 }
            }
        });
    } // End if(tenancyForm)

}); // End DOMContentLoaded

// --- Add/Remove Applicant Functions (Keep outside DOMContentLoaded if called by inline HTML onclick) ---

function addApplicant() {
    const container = document.querySelector('.additional-applicants');
    if (!container) {
        console.error("Container '.additional-applicants' not found.");
        return;
    }
    const newRow = document.createElement('div');
    newRow.className = 'applicant-row';
    // Using template literal for cleaner HTML string
    newRow.innerHTML = `
        <input type="text" placeholder="Full Name" name="Additional_Applicant_Name[]">
        <input type="date" placeholder="Date of Birth" name="Additional_Applicant_DOB[]">
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
    // Find the closest parent with the class 'applicant-row' and remove it
    const rowToRemove = button.closest('.applicant-row');
    if (rowToRemove) {
        rowToRemove.remove();
    } else {
        // Fallback for older browsers or if structure is different
        button.parentElement.remove();
    }
}

// Ensure the add/remove functions are global if called by inline onclick
window.addApplicant = addApplicant;
window.removeApplicant = removeApplicant;