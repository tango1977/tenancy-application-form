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

// Enhanced date picker for mobile
function enhanceDatePicker() {
    const dobInput = document.getElementById('dob');
    
    // Create year dropdown
    const yearSelect = document.createElement('select');
    yearSelect.id = 'year-select';
    yearSelect.className = 'date-picker-helper';
    
    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Select Birth Year --';
    yearSelect.appendChild(defaultOption);
    
    // Add options for years (1930 to current year - 18)
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 18; year >= 1930; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
    
    // Create month dropdown
    const monthSelect = document.createElement('select');
    monthSelect.id = 'month-select';
    monthSelect.className = 'date-picker-helper';
    monthSelect.disabled = true; // Disabled until year is selected
    
    // Add a default option
    const defaultMonthOption = document.createElement('option');
    defaultMonthOption.value = '';
    defaultMonthOption.textContent = '-- Select Month --';
    monthSelect.appendChild(defaultMonthOption);
    
    // Add month options
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    months.forEach((month, index) => {
        const option = document.createElement('option');
        // Month is 0-based in JS Date, but we need 1-based for date input
        option.value = (index + 1).toString().padStart(2, '0');
        option.textContent = month;
        monthSelect.appendChild(option);
    });
    
    // Create day dropdown
    const daySelect = document.createElement('select');
    daySelect.id = 'day-select';
    daySelect.className = 'date-picker-helper';
    daySelect.disabled = true; // Disabled until month is selected
    
    // Add a default option
    const defaultDayOption = document.createElement('option');
    defaultDayOption.value = '';
    defaultDayOption.textContent = '-- Select Day --';
    daySelect.appendChild(defaultDayOption);
    
    // Add day options (will be populated based on month/year)
    function updateDays(year, month) {
        // Clear existing options except default
        while (daySelect.options.length > 1) {
            daySelect.options.remove(1);
        }
        
        if (!year || !month) return;
        
        // Determine number of days in the selected month/year
        const daysInMonth = new Date(year, month, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day.toString().padStart(2, '0');
            option.textContent = day;
            daySelect.appendChild(option);
        }
    }
    
    // Create a container for the selects
    const dateSelectsContainer = document.createElement('div');
    dateSelectsContainer.className = 'date-selects-container';
    dateSelectsContainer.appendChild(yearSelect);
    dateSelectsContainer.appendChild(monthSelect);
    dateSelectsContainer.appendChild(daySelect);
    
    // Insert before the date input
    dobInput.parentNode.insertBefore(dateSelectsContainer, dobInput);
    
    // Add helper text
    const helperText = document.createElement('div');
    helperText.innerHTML = '<small>Select year, month, and day to set your date of birth</small>';
    dobInput.parentNode.insertBefore(helperText, dobInput);
    
    // Hide the native date input on mobile
    dobInput.style.display = 'none';
    
    // Set up event handlers
    yearSelect.addEventListener('change', function() {
        const selectedYear = this.value;
        if (selectedYear) {
            monthSelect.disabled = false;
            updateDate();
        } else {
            monthSelect.disabled = true;
            daySelect.disabled = true;
        }
    });
    
    monthSelect.addEventListener('change', function() {
        const selectedMonth = this.value;
        const selectedYear = yearSelect.value;
        
        if (selectedMonth && selectedYear) {
            daySelect.disabled = false;
            updateDays(selectedYear, selectedMonth);
            updateDate();
        } else {
            daySelect.disabled = true;
        }
    });
    
    daySelect.addEventListener('change', function() {
        updateDate();
    });
    
    function updateDate() {
        const year = yearSelect.value;
        const month = monthSelect.value;
        const day = daySelect.value;
        
        if (year && month && day) {
            dobInput.value = `${year}-${month}-${day}`;
        }
    }
}

// Initially hide sections
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('selfEmployedSection').style.display = 'none';
    document.getElementById('employedSection').style.display = 'none';
    document.getElementById('selfEmployedReferences').style.display = 'none';
    document.getElementById('occupantsSection').style.display = 'none';
    document.getElementById('petsSection').style.display = 'none';
    
    // Set up event listeners to ensure they're properly attached
    setupEventListeners();
    
    // Initialize enhanced date picker
    enhanceDatePicker();
    
    // Also add enhanced date picker for other date fields
    enhanceDatePickerForField('startDate');
    
    // Handle any additional applicant date fields that might be added
    const additionalApplicantsSection = document.getElementById('additionalApplicants');
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                const dateInputs = mutation.target.querySelectorAll('input[type="date"]');
                dateInputs.forEach(input => {
                    if (!input.classList.contains('enhanced-date')) {
                        enhanceDatePickerForExistingInput(input);
                    }
                });
            }
        });
    });
    observer.observe(additionalApplicantsSection, { childList: true, subtree: true });
});

// Helper function to enhance date pickers for any other date fields
function enhanceDatePickerForField(fieldId) {
    const dateInput = document.getElementById(fieldId);
    if (dateInput) {
        enhanceDatePickerForExistingInput(dateInput);
    }
}

function enhanceDatePickerForExistingInput(dateInput) {
    // Mark this input as enhanced to avoid duplicate enhancement
    dateInput.classList.add('enhanced-date');
    
    // Create year dropdown
    const yearSelect = document.createElement('select');
    yearSelect.className = 'date-picker-helper';
    
    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Select Year --';
    yearSelect.appendChild(defaultOption);
    
    // Add options for years
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 100; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
    
    // Create month dropdown
    const monthSelect = document.createElement('select');
    monthSelect.className = 'date-picker-helper';
    monthSelect.disabled = true; // Disabled until year is selected
    
    // Add a default option
    const defaultMonthOption = document.createElement('option');
    defaultMonthOption.value = '';
    defaultMonthOption.textContent = '-- Select Month --';
    monthSelect.appendChild(defaultMonthOption);
    
    // Add month options
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = (index + 1).toString().padStart(2, '0');
        option.textContent = month;
        monthSelect.appendChild(option);
    });
    
    // Create day dropdown
    const daySelect = document.createElement('select');
    daySelect.className = 'date-picker-helper';
    daySelect.disabled = true; // Disabled until month is selected
    
    // Add a default option
    const defaultDayOption = document.createElement('option');
    defaultDayOption.value = '';
    defaultDayOption.textContent = '-- Select Day --';
    daySelect.appendChild(defaultDayOption);
    
    function updateDays(year, month) {
        // Clear existing options except default
        while (daySelect.options.length > 1) {
            daySelect.options.remove(1);
        }
        
        if (!year || !month) return;
        
        // Determine number of days in the selected month/year
        const daysInMonth = new Date(year, month, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day.toString().padStart(2, '0');
            option.textContent = day;
            daySelect.appendChild(option);
        }
    }
    
    // Create a container for the selects
    const dateSelectsContainer = document.createElement('div');
    dateSelectsContainer.className = 'date-selects-container';
    dateSelectsContainer.appendChild(yearSelect);
    dateSelectsContainer.appendChild(monthSelect);
    dateSelectsContainer.appendChild(daySelect);
    
    // Insert before the date input
    dateInput.parentNode.insertBefore(dateSelectsContainer, dateInput);
    
    // Hide the native date input
    dateInput.style.display = 'none';
    
    // Set up event handlers
    yearSelect.addEventListener('change', function() {
        const selectedYear = this.value;
        if (selectedYear) {
            monthSelect.disabled = false;
            updateDate();
        } else {
            monthSelect.disabled = true;
            daySelect.disabled = true;
        }
    });
    
    monthSelect.addEventListener('change', function() {
        const selectedMonth = this.value;
        const selectedYear = yearSelect.value;
        
        if (selectedMonth && selectedYear) {
            daySelect.disabled = false;
            updateDays(selectedYear, selectedMonth);
            updateDate();
        } else {
            daySelect.disabled = true;
        }
    });
    
    daySelect.addEventListener('change', function() {
        updateDate();
    });
    
    function updateDate() {
        const year = yearSelect.value;
        const month = monthSelect.value;
        const day = daySelect.value;
        
        if (year && month && day) {
            dateInput.value = `${year}-${month}-${day}`;
        }
    }
}

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
        <input type="date" placeholder="Date of Birth" name="Additional_Applicant_DOB[]" class="enhanced-date">
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
    
    // Enhance the new date input
    const newDateInput = newRow.querySelector('input[type="date"]');
    enhanceDatePickerForExistingInput(newDateInput);
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