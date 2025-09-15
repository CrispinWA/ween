// Pod brand constants for calculations
const POD_BRAND_SPECS = {
  // Pod sizes (in ml)
  sizes: {
    'Juul': 1.2,
    'Ultra': 1.9,
    'Pro': 1.9,
    'Reload': 2,
    'BM600': 2,
    'BM6000': 10,
    '600': 2,
    'AF5500': 10
  },
  
  // Pod strengths (in mg/ml) - only for brands with fixed strengths
  strengths: {
    'Juul': 18,
    'BM600': 20,
    'BM6000': 20,
    '600': 20,
    'AF5500': 20
    // Note: Ultra, Pro, Reload are variable and user must set them
  },
  
  // Cigarette strength (in mg per cigarette)
  cigaretteStrength: 2,
  
  // Cost register (in £ per unit)
  costs: {
    'pouch': 0.5,
    'carton': 0.7,
    'cig-both': 0.6,
    'juul': 3.5,
    'vuse': 3.5,
    'bm600': 3,
    '600': 3
  }
};

// Get in Touch Form Functionality
document.addEventListener('DOMContentLoaded', function() {
  const getInTouchButton = document.getElementById('get-in-touch-button');
  const getInTouchForm = document.getElementById('get-in-touch-form');
  const contentContainer = document.querySelector('.content-container');
  
  let isFormVisible = false;
  
  getInTouchButton.addEventListener('click', function() {
    if (!isFormVisible) {
      // Show the form
      getInTouchForm.classList.add('show');
      contentContainer.classList.add('has-form');
      isFormVisible = true;
      
      // Change button text and icon to "Close"
      const buttonText = getInTouchButton.querySelector('.get-in-touch-text');
      const buttonIcon = getInTouchButton.querySelector('.mail-icon');
      buttonText.textContent = 'Close';
      buttonIcon.src = 'assets/cross.svg';
      buttonIcon.alt = 'Close Icon';
    } else {
      // Hide the form
      getInTouchForm.classList.remove('show');
      contentContainer.classList.remove('has-form');
      isFormVisible = false;
      
      // Change button text and icon back to "Get in touch"
      const buttonText = getInTouchButton.querySelector('.get-in-touch-text');
      const buttonIcon = getInTouchButton.querySelector('.mail-icon');
      buttonText.textContent = 'Get in touch';
      buttonIcon.src = 'assets/mail.svg';
      buttonIcon.alt = 'Mail Icon';
    }
  });
  
  // Plan Builder Functionality
  const buildPlanButton = document.querySelector('.build-plan-button');
  const planBuilderDropdown = document.getElementById('plan-builder-dropdown');
  const yourPlanSection = document.getElementById('your-plan-section');
  const crossIcon = document.querySelector('.cross-icon');
  
  let isPlanBuilderOpen = false;
  
  // Click on the build plan button to open
  buildPlanButton.addEventListener('click', function(e) {
    if (!isPlanBuilderOpen) {
      // Open the plan builder
      planBuilderDropdown.classList.add('show');
      // Your Plan section visibility is now controlled by checkYourPlanVisibility()
      // Don't automatically show it here
      buildPlanButton.classList.add('active'); // Add active class for blue background
      crossIcon.style.transform = 'rotate(0deg)'; // Rotate to cross (0 degrees)
      isPlanBuilderOpen = true;
    }
  });
  
  // Click on the cross icon to toggle
  crossIcon.addEventListener('click', function(e) {
    e.stopPropagation(); // Prevent button click event
    
    if (isPlanBuilderOpen) {
      // Close the plan builder
      planBuilderDropdown.classList.remove('show');
      // Your Plan section visibility is now controlled by checkYourPlanVisibility()
      // Don't automatically hide it here - let the completion logic handle it
      buildPlanButton.classList.remove('active'); // Remove active class for gray background
      crossIcon.style.transform = 'rotate(45deg)'; // Rotate back to plus (45 degrees)
      isPlanBuilderOpen = false;
    } else {
      // Open the plan builder
      planBuilderDropdown.classList.add('show');
      // Your Plan section visibility is now controlled by checkYourPlanVisibility()
      // Don't automatically show it here
      buildPlanButton.classList.add('active'); // Add active class for blue background
      crossIcon.style.transform = 'rotate(0deg)'; // Rotate to cross (0 degrees)
      isPlanBuilderOpen = true;
    }
  });
  
  // Ensure cross icon starts in the correct state
  crossIcon.style.transform = 'rotate(45deg)';
  
  // Capsule Button Functionality
  const capsuleButtons = document.querySelectorAll('.capsule-button');
  const tickBox = document.getElementById('tick-box');
  const tickBoxMobile = document.getElementById('tick-box-mobile');
  
  capsuleButtons.forEach(button => {
    button.addEventListener('click', function() {
      const buttonType = this.getAttribute('data-type');
      
      // Get current selection before changing (check ALL buttons of each type)
      const cigarettesButtons = document.querySelectorAll('.capsule-button[data-type="cigarettes"]');
      const bothButtons = document.querySelectorAll('.capsule-button[data-type="both"]');
      const wasCigarettesActive = Array.from(cigarettesButtons).some(btn => btn.classList.contains('active'));
      const wasBothActive = Array.from(bothButtons).some(btn => btn.classList.contains('active'));
      
      // Remove active class from all buttons
      capsuleButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Auto-convert cigarette quantity when switching between cigarettes and both
      const quantityInput = document.querySelector('.quantity-options-hstack .middle-capsule');
      if (quantityInput && quantityInput.value) {
        const currentValue = parseFloat(quantityInput.value);
        // Only apply conversion if user has entered a value (not the default placeholder of 15)
        if (!isNaN(currentValue) && currentValue > 0 && currentValue !== 15) {
          if (wasCigarettesActive && buttonType === 'both') {
            // Switching from cigarettes to both: multiply by 7 (daily to weekly)
            const newValue = Math.round(currentValue * 7);
            quantityInput.value = newValue;
            // Update the global currentValue variable used by plus/minus buttons
            window.cigaretteCurrentValue = newValue;
          } else if (wasBothActive && buttonType === 'cigarettes') {
            // Switching from both to cigarettes: divide by 7 (weekly to daily)
            const newValue = Math.round(currentValue / 7); // Round to nearest integer
            quantityInput.value = newValue;
            // Update the global currentValue variable used by plus/minus buttons
            window.cigaretteCurrentValue = newValue;
          }
        } else if (currentValue === 15) {
          // Keep placeholder value as 15 when switching between options
          quantityInput.value = 15;
          window.cigaretteCurrentValue = 15;
        }
      }
      
      // Activate both tick boxes (desktop and mobile)
      if (tickBox) tickBox.classList.add('active');
      if (tickBoxMobile) tickBoxMobile.classList.add('active');
      
      // Add has-selection class to target usage section to add top margin
      const targetUsageSection = document.querySelector('.target-usage-section');
      if (targetUsageSection) {
        targetUsageSection.classList.add('has-selection');
      }
      
      // Update visibility of cigarette and vape option sections
      updateQuestionVisibility();
      
      // Auto-scroll to center the current nicotine usage section
      // Temporarily disabled to test confirm button issue
      // setTimeout(scrollToCurrentNicotineSection, 100);
    });
  });
  
  // Pouch and Carton Functionality
  const pouchVstack = document.querySelector('.pouch-vstack');
  const cartonVstack = document.querySelector('.carton-vstack');
  const cigaretteTickBox = document.getElementById('cigarette-tick-box');
  
  // Pouch click handler
  pouchVstack.addEventListener('click', function() {
    const pouchIcon = this.querySelector('.pouch-icon');
    const isActive = this.classList.contains('active');
    
    if (isActive) {
      // Deactivate pouch
      this.classList.remove('active');
      pouchIcon.src = 'assets/pouch-grey.svg';
    } else {
      // Activate pouch
      this.classList.add('active');
      pouchIcon.src = 'assets/pouch.svg';
    }
    
    // Check if any option is active to determine tickbox state
    updateTickBoxState();
    
    // Update current spending display
    updateCurrentSpendingDisplay();
    
    // Auto-scroll to center the current nicotine usage section
    // Temporarily disabled to test confirm button issue
    // setTimeout(scrollToCurrentNicotineSection, 100);
  });
  
  // Carton click handler
  cartonVstack.addEventListener('click', function() {
    const cartonIcon = this.querySelector('.carton-icon');
    const isActive = this.classList.contains('active');
    
    if (isActive) {
      // Deactivate carton
      this.classList.remove('active');
      cartonIcon.src = 'assets/carton-grey.svg';
    } else {
      // Activate carton
      this.classList.add('active');
      cartonIcon.src = 'assets/carton.svg';
    }
    
    // Check if any option is active to determine tickbox state
    updateTickBoxState();
    
    // Update current spending display
    updateCurrentSpendingDisplay();
    
    // Auto-scroll to center the current nicotine usage section
    // Temporarily disabled to test confirm button issue
    // setTimeout(scrollToCurrentNicotineSection, 100);
  });
  
  // Function to update tickbox state based on active options
  function updateTickBoxState() {
    const isPouchActive = pouchVstack.classList.contains('active');
    const isCartonActive = cartonVstack.classList.contains('active');
    
    if (isPouchActive || isCartonActive) {
      cigaretteTickBox.classList.add('active');
    } else {
      cigaretteTickBox.classList.remove('active');
    }
  }
  
  // Counter Functionality
  const minusCapsule = document.querySelector('.minus-capsule');
  const plusCapsule = document.querySelector('.plus-capsule');
  const middleCapsule = document.querySelector('.middle-capsule');
  const quantityTickBox = document.getElementById('quantity-tick-box');
  
  let currentValue = 15;
  // Make currentValue globally accessible for auto-conversion updates
  window.cigaretteCurrentValue = currentValue;
  
  // Minus button click handler
  minusCapsule.addEventListener('click', function() {
    if (window.cigaretteCurrentValue > 1) {
      window.cigaretteCurrentValue--;
      currentValue = window.cigaretteCurrentValue;
      middleCapsule.value = currentValue;
      middleCapsule.style.color = 'var(--color-dark-gray)';
      middleCapsule.style.borderColor = 'var(--color-dark-gray)';
      quantityTickBox.classList.add('active');
    }
  });
  
  // Plus button click handler
  plusCapsule.addEventListener('click', function() {
    if (window.cigaretteCurrentValue < 100) {
      window.cigaretteCurrentValue++;
      currentValue = window.cigaretteCurrentValue;
      middleCapsule.value = currentValue;
      middleCapsule.style.color = 'var(--color-dark-gray)';
      middleCapsule.style.borderColor = 'var(--color-dark-gray)';
      quantityTickBox.classList.add('active');
    }
  });
  
  // Input field change handler
  middleCapsule.addEventListener('input', function() {
    let newValue = parseInt(this.value) || 1;
    
    // Enforce min/max limits
    if (newValue < 1) newValue = 1;
    if (newValue > 100) newValue = 100;
    
    // Update the input value and currentValue variable
    this.value = newValue;
    currentValue = newValue;
    window.cigaretteCurrentValue = currentValue;
    
    // Change colors to indicate modification
    this.style.color = 'var(--color-dark-gray)';
    this.style.borderColor = 'var(--color-dark-gray)';
    
    // Activate tickbox
    quantityTickBox.classList.add('active');
  });
  
  // Input field focus handler
  middleCapsule.addEventListener('focus', function() {
    this.select(); // Select all text when focused
  });
  
  // Vape Options Functionality
  const refillableVstack = document.querySelector('.refillable-vstack');
  const podBasedVstack = document.querySelector('.pod-based-vstack');
  const vapeTickBox = document.getElementById('vape-tick-box');
  
  // Refillable click handler
  refillableVstack.addEventListener('click', function() {
    const refillableIcon = this.querySelector('.refillable-icon');
    const isActive = this.classList.contains('active');
    
    if (isActive) {
      // Deactivate refillable
      this.classList.remove('active');
      refillableIcon.src = 'assets/refillable-grey.svg';
    } else {
      // Activate refillable and deactivate pod-based (mutually exclusive)
      this.classList.add('active');
      refillableIcon.src = 'assets/refillable.svg';
      
      // Deactivate pod-based if it's active
      if (podBasedVstack.classList.contains('active')) {
        podBasedVstack.classList.remove('active');
        const podBasedIcon = podBasedVstack.querySelector('.pod-based-icon');
        if (podBasedIcon) {
          podBasedIcon.src = 'assets/pod-based-grey.svg';
        }
      }
    }
    
    // Check if any option is active to determine tickbox state
    updateVapeTickBoxState();
    
    // Wait for elements to be visible and then scroll
    // Temporarily disabled to test confirm button issue
    // waitForElementsAndScroll();
  });
  
  // Pod-based click handler
  podBasedVstack.addEventListener('click', function() {
    const podBasedIcon = this.querySelector('.pod-based-icon');
    const isActive = this.classList.contains('active');
    
    if (isActive) {
      // Deactivate pod-based
      this.classList.remove('active');
      podBasedIcon.src = 'assets/pod-based-grey.svg';
    } else {
      // Activate pod-based and deactivate refillable (mutually exclusive)
      this.classList.add('active');
      podBasedIcon.src = 'assets/pod-based.svg';
      
      // Deactivate refillable if it's active
      if (refillableVstack.classList.contains('active')) {
        refillableVstack.classList.remove('active');
        const refillableIcon = refillableVstack.querySelector('.refillable-icon');
        if (refillableIcon) {
          refillableIcon.src = 'assets/refillable-grey.svg';
        }
      }
    }
    
    // Check if any option is active to determine tickbox state
    updateVapeTickBoxState();
    
    // Wait for elements to be visible and then scroll
    // Temporarily disabled to test confirm button issue
    // waitForElementsAndScroll();
  });
  
  // Function to update vape tickbox state based on active options
  function updateVapeTickBoxState() {
    const isRefillableActive = refillableVstack.classList.contains('active');
    const isPodBasedActive = podBasedVstack.classList.contains('active');
    
    if (isRefillableActive || isPodBasedActive) {
      vapeTickBox.classList.add('active');
    } else {
      vapeTickBox.classList.remove('active');
    }
    
    // Show/hide pod-related sections based on pod-based selection
    const podTypeHstack = document.querySelector('.pod-type-hstack');
    const podQuantityHstack = document.querySelector('.pod-quantity-hstack');
    
    if (isPodBasedActive) {
      // Show pod sections when pod-based is selected
      showPodSection(podTypeHstack);
      showPodSection(podQuantityHstack);
    } else {
      // Hide pod sections when pod-based is not selected
      hidePodSection(podTypeHstack);
      hidePodSection(podQuantityHstack);
      
      // Clear pod form data when hiding
      clearPodFormData();
    }
    
    // Show/hide bottle-related sections based on refillable selection
    const bottleTypeHstack = document.querySelector('.bottle-type-hstack');
    const bottleQuantityHstack = document.querySelector('.bottle-quantity-hstack');
    
    if (isRefillableActive) {
      // Show bottle sections when refillable is selected
      showPodSection(bottleTypeHstack);
      showPodSection(bottleQuantityHstack);
    } else {
      // Hide bottle sections when refillable is not selected
      hidePodSection(bottleTypeHstack);
      hidePodSection(bottleQuantityHstack);
      
      // Clear bottle form data when hiding
      clearBottleFormData();
    }
    
    // Update confirm button margin classes based on vape options
    const confirmButtonContainer = document.getElementById('confirm-button-container');
    if (confirmButtonContainer) {
      // Remove existing classes first
      confirmButtonContainer.classList.remove('refillable-only');
      
      // Add refillable-only class if only refillable is selected (and not pod-based)
      if (isRefillableActive && !isPodBasedActive) {
        confirmButtonContainer.classList.add('refillable-only');
      }
    }
  }
  
  // Function to clear bottle form data
  function clearBottleFormData() {
    // Clear bottle type fields
    const strengthInput = document.querySelector('.strength-input');
    const sizeInput = document.querySelector('.size-input');
    const bottleTypeTickBox = document.getElementById('bottle-type-tick-box');
    
    if (strengthInput) {
      strengthInput.value = '';
      strengthInput.style.borderColor = 'var(--color-mid-gray)';
      strengthInput.style.color = 'var(--color-mid-gray)';
    }
    
    if (sizeInput) {
      sizeInput.value = '';
      sizeInput.style.borderColor = 'var(--color-mid-gray)';
      sizeInput.style.color = 'var(--color-mid-gray)';
    }
    
    if (bottleTypeTickBox) {
      bottleTypeTickBox.classList.remove('active');
    }
    
    // Clear bottle quantity fields
    const bottleMiddleCapsule = document.querySelector('.bottle-counter-hstack .middle-capsule');
    const bottleQuantityTickBox = document.getElementById('bottle-quantity-tick-box');
    
    if (bottleMiddleCapsule) {
      bottleMiddleCapsule.value = '1';
      bottleMiddleCapsule.style.borderColor = 'var(--color-mid-gray)';
      bottleMiddleCapsule.style.color = 'var(--color-mid-gray)';
    }
    
    if (bottleQuantityTickBox) {
      bottleQuantityTickBox.classList.remove('active');
    }
    
    // Reset global variable
    bottleCurrentValue = 1;
  }
  
  // Function to clear pod form data
  function clearPodFormData() {
    // Reset pod type dropdown to triangle
    const podDropdownCapsule = document.getElementById('pod-dropdown-capsule');
    const podDropdownList = document.getElementById('pod-dropdown-list');
    const podOtherCapsule = document.getElementById('pod-other-capsule');

    if (podDropdownCapsule) {
      podDropdownCapsule.innerHTML = '<svg class="pod-dropdown-triangle" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M 2,6 L 8,12 L 14,6 Z" fill="var(--color-mid-gray)"/></svg>';
      podDropdownCapsule.classList.remove('selected');
    }

    // Hide strength and pod size inputs
    const podStrengthHstack = document.getElementById('pod-strength-hstack');
    const podBottleSizeHstack = document.getElementById('pod-bottle-size-hstack');
    if (podStrengthHstack) podStrengthHstack.classList.remove('show');
    if (podBottleSizeHstack) podBottleSizeHstack.classList.remove('show');

    // Hide "Other" capsule
    if (podOtherCapsule) {
      podOtherCapsule.classList.remove('show');
      podOtherCapsule.innerHTML = '<span class="pod-other-text">Other</span>';
      podOtherCapsule.classList.remove('selected');
    }

    // Reset second dropdown state
    const podSecondDropdownList = document.getElementById('pod-second-dropdown-list');
    if (podSecondDropdownList) {
      podSecondDropdownList.classList.remove('show');
      isSecondDropdownOpen = false;
    }

         // Clear pod quantity capsule value
     const podMiddleCapsule = document.querySelector('.pod-counter-hstack .middle-capsule');
     if (podMiddleCapsule) {
       podMiddleCapsule.value = '5';
       podMiddleCapsule.style.borderColor = 'var(--color-mid-gray)';
       podMiddleCapsule.style.color = 'var(--color-mid-gray)';
     }
     const podQuantityTickBox = document.getElementById('pod-quantity-tick-box');
     if (podQuantityTickBox) {
       podQuantityTickBox.classList.remove('active');
     }
     
     // Deactivate pod type tickbox
     const podTypeTickBox = document.getElementById('pod-type-tick-box');
     if (podTypeTickBox) {
       podTypeTickBox.classList.remove('active');
     }

    // Reset global variable
    podCurrentValue = 5;
  }
  
  // Function to smoothly show a pod section
  function showPodSection(element) {
    if (!element || element.classList.contains('visible')) return;
    
    // Remove hidden class to trigger CSS transition
    element.classList.remove('hidden');
    element.classList.add('visible');
  }
  
  // Function to smoothly hide a pod section
  function hidePodSection(element) {
    if (!element || element.classList.contains('hidden')) return;
    
    // Add hidden class to trigger CSS transition
    element.classList.add('hidden');
    element.classList.remove('visible');
  }
  
  // Bottle Type Functionality
  const strengthInput = document.querySelector('.strength-input');
  const sizeInput = document.querySelector('.size-input');
  const bottleTypeTickBox = document.getElementById('bottle-type-tick-box');
  
  // Function to update bottle type tickbox state
  function updateBottleTypeTickBoxState() {
    const strengthValue = strengthInput.value.trim();
    const sizeValue = sizeInput.value.trim();
    
    if (strengthValue && sizeValue) {
      bottleTypeTickBox.classList.add('active');
    } else {
      bottleTypeTickBox.classList.remove('active');
    }
  }
  
  // Strength input change handler
  strengthInput.addEventListener('input', function() {
    if (this.value.trim()) {
      this.style.borderColor = 'var(--color-dark-gray)';
      this.style.color = 'var(--color-dark-gray)';
    } else {
      this.style.borderColor = 'var(--color-mid-gray)';
      this.style.color = 'var(--color-mid-gray)';
    }
    updateBottleTypeTickBoxState();
    calculateAndDisplayNicotineUsage();
  });
  
  // Strength input blur handler for validation
  strengthInput.addEventListener('blur', function() {
    let value = this.value.trim();
    
    // Validate and constrain the value only when user finishes typing
    if (value) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        // Constrain to 1-20 range
        if (numValue < 1) {
          value = '1';
        } else if (numValue > 20) {
          value = '20';
        } else {
          value = numValue.toString();
        }
        this.value = value;
      }
    }
  });
  
  // Size input change handler
  sizeInput.addEventListener('input', function() {
    if (this.value.trim()) {
      this.style.borderColor = 'var(--color-dark-gray)';
      this.style.color = 'var(--color-dark-gray)';
    } else {
      this.style.borderColor = 'var(--color-mid-gray)';
      this.style.color = 'var(--color-mid-gray)';
    }
    updateBottleTypeTickBoxState();
    calculateAndDisplayNicotineUsage();
  });
  
  // Size input blur handler for validation
  sizeInput.addEventListener('blur', function() {
    let value = this.value.trim();
    
    // Validate and constrain the value only when user finishes typing
    if (value) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        // Round to nearest integer
        let roundedValue = Math.round(numValue);
        
        // Constrain to 10-200 range
        if (roundedValue < 10) {
          value = '10';
        } else if (roundedValue > 200) {
          value = '200';
        } else {
          value = roundedValue.toString();
        }
        this.value = value;
      }
    }
  });
  
  // Focus handlers for both inputs
  strengthInput.addEventListener('focus', function() {
    this.select(); // Select all text when focused
  });
  
  sizeInput.addEventListener('focus', function() {
    this.select(); // Select all text when focused
  });
  
  // Initialize bottle type tickbox state (should not be active initially)
  updateBottleTypeTickBoxState();
  
  // Bottle Quantity Counter Functionality
  const bottleMinusCapsule = document.querySelector('.bottle-counter-hstack .minus-capsule');
  const bottlePlusCapsule = document.querySelector('.bottle-counter-hstack .plus-capsule');
  const bottleMiddleCapsule = document.querySelector('.bottle-counter-hstack .middle-capsule');
  const bottleQuantityTickBox = document.getElementById('bottle-quantity-tick-box');
  
  let bottleCurrentValue = 1;
  
  // Bottle minus button click handler
  bottleMinusCapsule.addEventListener('click', function() {
    // Round to nearest 0.5, then subtract 0.5
    let roundedValue = Math.round(bottleCurrentValue * 2) / 2; // Round to nearest 0.5
    let newValue = roundedValue - 0.5;
    
    // Enforce minimum of 0.1
    if (newValue < 0.1) {
      newValue = 0.1;
    }
    
    bottleCurrentValue = newValue;
    bottleMiddleCapsule.value = bottleCurrentValue;
    bottleMiddleCapsule.style.color = 'var(--color-dark-gray)';
    bottleMiddleCapsule.style.borderColor = 'var(--color-dark-gray)';
    bottleQuantityTickBox.classList.add('active');
    calculateAndDisplayNicotineUsage();
  });
  
  // Bottle plus button click handler
  bottlePlusCapsule.addEventListener('click', function() {
    // Round to nearest 0.5, then add 0.5
    let roundedValue = Math.round(bottleCurrentValue * 2) / 2; // Round to nearest 0.5
    bottleCurrentValue = roundedValue + 0.5;
    bottleMiddleCapsule.value = bottleCurrentValue;
    bottleMiddleCapsule.style.color = 'var(--color-dark-gray)';
    bottleMiddleCapsule.style.borderColor = 'var(--color-dark-gray)';
    bottleQuantityTickBox.classList.add('active');
    calculateAndDisplayNicotineUsage();
  });
  
  // Bottle input field change handler
  bottleMiddleCapsule.addEventListener('input', function() {
    // Just handle styling and tickbox activation, no validation
    if (this.value.trim()) {
      this.style.color = 'var(--color-dark-gray)';
      this.style.borderColor = 'var(--color-dark-gray)';
      bottleQuantityTickBox.classList.add('active');
    } else {
      this.style.color = 'var(--color-mid-gray)';
      this.style.borderColor = 'var(--color-mid-gray)';
      bottleQuantityTickBox.classList.remove('active');
    }
    calculateAndDisplayNicotineUsage();
  });
  
  // Bottle input field blur handler for validation
  bottleMiddleCapsule.addEventListener('blur', function() {
    let newValue = parseFloat(this.value);
    
    // Handle empty or invalid input
    if (isNaN(newValue)) {
      newValue = 0.1;
    }
    
    // Enforce min limit
    if (newValue < 0.1) {
      newValue = 0.1;
    }
    
    // Round to 0.1 precision for manual input
    newValue = Math.round(newValue * 10) / 10;
    
    // Update the input value and currentValue variable
    this.value = newValue;
    bottleCurrentValue = newValue;
  });
  
  // Bottle input field focus handler
  bottleMiddleCapsule.addEventListener('focus', function() {
    this.select(); // Select all text when focused
  });
  
  // Pod Type Dropdown Functionality
  const podDropdownCapsule = document.getElementById('pod-dropdown-capsule');
  const podDropdownList = document.getElementById('pod-dropdown-list');
  const podOtherCapsule = document.getElementById('pod-other-capsule');
  
  let isDropdownOpen = false;
  let selectedPodType = null;
  
  // Toggle dropdown when capsule is clicked
  podDropdownCapsule.addEventListener('click', function() {
          if (isDropdownOpen) {
        // Close dropdown
        podDropdownList.classList.remove('show');
        podDropdownCapsule.classList.remove('open');
        isDropdownOpen = false;
        
        // If no selection was made, hide the "Other" capsule
        if (!selectedPodType) {
          podOtherCapsule.classList.remove('show');
        }
      } else {
              // If there's already a selection, deselect it and show dropdown for new selection
        if (selectedPodType) {
          selectedPodType = null;
          podDropdownCapsule.innerHTML = '<svg class="pod-dropdown-triangle" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M 2,6 L 8,12 L 14,6 Z" fill="var(--color-mid-gray)"/></svg>';
          podDropdownCapsule.classList.remove('selected');
          
          // Hide strength and pod size inputs
          const podStrengthHstack = document.getElementById('pod-strength-hstack');
          const podBottleSizeHstack = document.getElementById('pod-bottle-size-hstack');
          podStrengthHstack.classList.remove('show');
          podBottleSizeHstack.classList.remove('show');
          
          // Show "Other" capsule with "Other" text since dropdown will be open
          podOtherCapsule.classList.add('show');
          podOtherCapsule.innerHTML = '<span class="pod-other-text">Other</span>';
          podOtherCapsule.classList.remove('selected');
          
          // Close any open second dropdown
          podSecondDropdownList.classList.remove('show');
          isSecondDropdownOpen = false;
          
          // Open dropdown for new selection
          podDropdownList.classList.add('show');
          podDropdownCapsule.classList.add('open');
          isDropdownOpen = true;
          
          // Check tickbox activation
          checkPodTypeTickbox();
        } else {
        // Open dropdown for new selection
        podDropdownList.classList.add('show');
        podDropdownCapsule.classList.add('open');
        isDropdownOpen = true;
        
        // Show "Other" capsule with "Other" text (not triangle)
        podOtherCapsule.classList.add('show');
        podOtherCapsule.innerHTML = '<span class="pod-other-text">Other</span>';
      }
    }
  });
  
  // Handle dropdown item selection
  podDropdownList.addEventListener('click', function(e) {
    if (e.target.classList.contains('pod-dropdown-item')) {
      const selectedValue = e.target.getAttribute('data-value');
      selectedPodType = selectedValue;
      
      // Update capsule content with proper styling
      podDropdownCapsule.innerHTML = selectedValue;
      podDropdownCapsule.classList.add('selected');
      
      // Close dropdown
      podDropdownList.classList.remove('show');
      podDropdownCapsule.classList.remove('open');
      isDropdownOpen = false;
      
      // Handle "Other" capsule based on selection
      if (selectedValue === 'Juul') {
        // Hide "Other" capsule for Juul
        podOtherCapsule.classList.remove('show');
        podOtherCapsule.innerHTML = '<span class="pod-other-text">Other</span>';
        podOtherCapsule.classList.remove('selected');
        
        // Hide strength and pod size inputs
        const podStrengthHstack = document.getElementById('pod-strength-hstack');
        const podBottleSizeHstack = document.getElementById('pod-bottle-size-hstack');
        podStrengthHstack.classList.remove('show');
        podBottleSizeHstack.classList.remove('show');

      } else if (selectedValue === 'Vuse') {
        // For Vuse, show "Other" capsule with triangle AND show strength input
        podOtherCapsule.classList.add('show');
        podOtherCapsule.innerHTML = '<svg class="pod-dropdown-triangle" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M 2,6 L 8,12 L 14,6 Z" fill="var(--color-mid-gray)"/></svg>';
        podOtherCapsule.classList.remove('selected'); // Reset selection state
        
        // Show strength input for Vuse
        const podStrengthHstack = document.getElementById('pod-strength-hstack');
        podStrengthHstack.classList.add('show');
        
        // Hide pod size input
        const podBottleSizeHstack = document.getElementById('pod-bottle-size-hstack');
        podBottleSizeHstack.classList.remove('show');
        
        // Reset second dropdown state
        isSecondDropdownOpen = false;
        
      } else {
        // For Lost Mary or Elf Bar, show "Other" capsule with triangle
        podOtherCapsule.classList.add('show');
        podOtherCapsule.innerHTML = '<svg class="pod-dropdown-triangle" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M 2,6 L 8,12 L 14,6 Z" fill="var(--color-mid-gray)"/></svg>';
        podOtherCapsule.classList.remove('selected'); // Reset selection state
        
        // Hide strength and pod size inputs
        const podStrengthHstack = document.getElementById('pod-strength-hstack');
        const podBottleSizeHstack = document.getElementById('pod-bottle-size-hstack');
        podStrengthHstack.classList.remove('show');
        podBottleSizeHstack.classList.remove('show');
        
        // Reset second dropdown state
        isSecondDropdownOpen = false;
      }
      
      // Check tickbox activation
      checkPodTypeTickbox();
    }
  });
  

  
  // Second Dropdown Functionality
  const podSecondDropdownList = document.getElementById('pod-second-dropdown-list');
  
  let isSecondDropdownOpen = false;
  
  // Handle "Other" capsule clicks (using event delegation)
  document.addEventListener('click', function(e) {
    if (e.target.closest('#pod-other-capsule')) {
      // If first dropdown is open and no selection made yet, select "Other"
      if (isDropdownOpen && !selectedPodType) {
        // Lock in "Other" as the selection
        selectedPodType = 'Other';
        
        // Style "Other" capsule to show it's selected
        podOtherCapsule.classList.add('selected');
        
        // Show strength and pod size inputs
        const podStrengthHstack = document.getElementById('pod-strength-hstack');
        const podBottleSizeHstack = document.getElementById('pod-bottle-size-hstack');
        podStrengthHstack.classList.add('show');
        podBottleSizeHstack.classList.add('show');
        
        // Close first dropdown
        podDropdownList.classList.remove('show');
        podDropdownCapsule.classList.remove('open');
        isDropdownOpen = false;
        
        // Return first capsule to triangle
        podDropdownCapsule.innerHTML = '<svg class="pod-dropdown-triangle" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M 2,6 L 8,12 L 14,6 Z" fill="var(--color-mid-gray)"/></svg>';
        podDropdownCapsule.classList.remove('selected');
        
        // Check tickbox activation after a small delay to ensure DOM is updated
        setTimeout(() => {
          checkPodTypeTickbox();
        }, 100);
        
      } else if (selectedPodType && selectedPodType !== 'Juul' && selectedPodType !== 'Other') {
        // Handle second dropdown toggle for non-Juul and non-Other selections
        if (isSecondDropdownOpen) {
          // Close second dropdown
          podSecondDropdownList.classList.remove('show');
          podOtherCapsule.classList.remove('open');
          isSecondDropdownOpen = false;
        } else {
          // Filter and show only relevant options before opening dropdown
          filterSecondDropdownOptions(selectedPodType);
          
          // Open second dropdown
          podSecondDropdownList.classList.add('show');
          podOtherCapsule.classList.add('open');
          isSecondDropdownOpen = true;
        }
      }
      // If selectedPodType === 'Other', do nothing - no dropdown should open
    }
  });
  
  // Handle second dropdown item selection
  podSecondDropdownList.addEventListener('click', function(e) {
    if (e.target.classList.contains('pod-second-dropdown-item')) {
      const selectedValue = e.target.getAttribute('data-value');
      const parentType = e.target.getAttribute('data-parent');
      
      // Only allow selection if parent type matches current selection
      if (parentType === selectedPodType) {
        // Update "Other" capsule content with proper styling
        podOtherCapsule.innerHTML = `<span class="pod-other-text">${selectedValue}</span>`;
        podOtherCapsule.classList.add('selected');
        
        // Close second dropdown
        podSecondDropdownList.classList.remove('show');
        isSecondDropdownOpen = false;
        
        // Check tickbox activation
        checkPodTypeTickbox();
      }
    }
  });
  
  // Function to filter second dropdown options based on first selection
  function filterSecondDropdownOptions(selectedType) {
    const allOptions = podSecondDropdownList.querySelectorAll('.pod-second-dropdown-item');
    
    allOptions.forEach(option => {
      const parentType = option.getAttribute('data-parent');
      if (parentType === selectedType) {
        option.style.display = 'block';
      } else {
        option.style.display = 'none';
      }
    });
  }
  
  // Function to check if pod type tickbox should be activated
  function checkPodTypeTickbox() {
    const podTypeTickbox = document.getElementById('pod-type-tick-box');
    const podStrengthInput = document.querySelector('.pod-strength-input');
    const podBottleSizeInput = document.querySelector('.pod-bottle-size-input');
    
    // Ensure all elements exist before proceeding
    if (!podTypeTickbox || !podStrengthInput || !podBottleSizeInput) {
      return;
    }
    
    let shouldActivate = false;
    
    if (selectedPodType === 'Juul') {
      // Juul: tickbox activated when Juul option is chosen
      shouldActivate = true;
    } else if (selectedPodType === 'Vuse') {
      // Vuse: tickbox activated if Vuse selected, second option chosen, and strength entered
      const secondOptionSelected = podOtherCapsule.classList.contains('selected');
      const strengthEntered = podStrengthInput.value.trim() !== '';
      shouldActivate = secondOptionSelected && strengthEntered;
    } else if (selectedPodType === 'Lost Mary') {
      // Lost Mary: tickbox activated if Lost Mary selected and second option chosen
      const secondOptionSelected = podOtherCapsule.classList.contains('selected');
      shouldActivate = secondOptionSelected;
    } else if (selectedPodType === 'Elf Bar') {
      // Elf Bar: tickbox activated if Elf Bar selected and second option chosen
      const secondOptionSelected = podOtherCapsule.classList.contains('selected');
      shouldActivate = secondOptionSelected;
    } else if (selectedPodType === 'Other') {
      // Other: tickbox activated when Other selected, strength entered, and pod size entered
      const strengthEntered = podStrengthInput.value.trim() !== '';
      const podSizeEntered = podBottleSizeInput.value.trim() !== '';
      shouldActivate = strengthEntered && podSizeEntered;
    }
    
    // Activate/deactivate tickbox using the existing .active class system
    if (shouldActivate) {
      podTypeTickbox.classList.add('active');
    } else {
      podTypeTickbox.classList.remove('active');
    }
  }
  
  // Close first dropdown if clicking outside
  document.addEventListener('click', function(e) {
    if (!podDropdownCapsule.contains(e.target) && !podDropdownList.contains(e.target)) {
      podDropdownList.classList.remove('show');
      isDropdownOpen = false;
      
      // If no selection was made, hide the "Other" capsule
      if (!selectedPodType && !podOtherCapsule.classList.contains('selected')) {
        podOtherCapsule.classList.remove('show');
      }
    }
  });
  
  // Close second dropdown if clicking outside
  document.addEventListener('click', function(e) {
    if (!podOtherCapsule.contains(e.target) && !podSecondDropdownList.contains(e.target)) {
      podSecondDropdownList.classList.remove('show');
      podOtherCapsule.classList.remove('open');
      isSecondDropdownOpen = false;
    }
  });
  
  // Pod Quantity Counter Functionality
  const podMinusCapsule = document.querySelector('.pod-counter-hstack .minus-capsule');
  const podPlusCapsule = document.querySelector('.pod-counter-hstack .plus-capsule');
  const podMiddleCapsule = document.querySelector('.pod-counter-hstack .middle-capsule');
  const podQuantityTickBox = document.getElementById('pod-quantity-tick-box');
  
  // Pod Strength and Pod Size Input Event Listeners (exactly like bottle inputs)
  const podStrengthInput = document.querySelector('.pod-strength-input');
  const podBottleSizeInput = document.querySelector('.pod-bottle-size-input');
  
  // Strength input change handler (exactly like bottle inputs)
  if (podStrengthInput) {
    podStrengthInput.addEventListener('input', function() {
      if (this.value.trim()) {
        this.style.borderColor = 'var(--color-dark-gray)';
        this.style.color = 'var(--color-dark-gray)';
      } else {
        this.style.borderColor = 'var(--color-mid-gray)';
        this.style.color = 'var(--color-mid-gray)';
      }
      checkPodTypeTickbox();
      calculateAndDisplayNicotineUsage();
    });
    
    // Pod strength input blur handler for validation
    podStrengthInput.addEventListener('blur', function() {
      let value = this.value.trim();
      
      // Validate and constrain the value only when user finishes typing
      if (value) {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          // Constrain to 1-20 range
          if (numValue < 1) {
            value = '1';
          } else if (numValue > 20) {
            value = '20';
          } else {
            value = numValue.toString();
          }
          this.value = value;
        }
      }
    });
    
    // Focus handler for strength input (exactly like bottle inputs)
    podStrengthInput.addEventListener('focus', function() {
      this.select(); // Select all text when focused
    });
  }
  
  // Size input change handler (exactly like bottle inputs)
  if (podBottleSizeInput) {
    podBottleSizeInput.addEventListener('input', function() {
      if (this.value.trim()) {
        this.style.borderColor = 'var(--color-dark-gray)';
        this.style.color = 'var(--color-dark-gray)';
      } else {
        this.style.borderColor = 'var(--color-mid-gray)';
        this.style.color = 'var(--color-mid-gray)';
      }
      checkPodTypeTickbox();
      calculateAndDisplayNicotineUsage();
    });
    
    // Pod size input blur handler for validation
    podBottleSizeInput.addEventListener('blur', function() {
      let value = this.value.trim();
      
      // Validate and constrain the value only when user finishes typing
      if (value) {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          // Round to 0.1 precision
          let roundedValue = Math.round(numValue * 10) / 10;
          
          // Constrain to 0.5-10 range
          if (roundedValue < 0.5) {
            value = '0.5';
          } else if (roundedValue > 10) {
            value = '10';
          } else {
            value = roundedValue.toString();
          }
          this.value = value;
        }
      }
    });
    
    // Focus handler for size input (exactly like bottle inputs)
    podBottleSizeInput.addEventListener('focus', function() {
      this.select(); // Select all text when focused
    });
  }
  
  let podCurrentValue = 5;
  
  // Pod minus button click handler
  podMinusCapsule.addEventListener('click', function() {
    // Round to nearest 0.5, then subtract 0.5
    let roundedValue = Math.round(podCurrentValue * 2) / 2; // Round to nearest 0.5
    let newValue = roundedValue - 0.5;
    
    // Enforce minimum of 0.5
    if (newValue < 0.5) {
      newValue = 0.5;
    }
    
    podCurrentValue = newValue;
      podMiddleCapsule.value = podCurrentValue;
      podMiddleCapsule.style.color = 'var(--color-dark-gray)';
      podMiddleCapsule.style.borderColor = 'var(--color-dark-gray)';
      podQuantityTickBox.classList.add('active');
      calculateAndDisplayNicotineUsage();
  });
  
  // Pod plus button click handler
  podPlusCapsule.addEventListener('click', function() {
    // Round to nearest 0.5, then add 0.5
    let roundedValue = Math.round(podCurrentValue * 2) / 2; // Round to nearest 0.5
    podCurrentValue = roundedValue + 0.5;
    podMiddleCapsule.value = podCurrentValue;
    podMiddleCapsule.style.color = 'var(--color-dark-gray)';
    podMiddleCapsule.style.borderColor = 'var(--color-dark-gray)';
    podQuantityTickBox.classList.add('active');
    calculateAndDisplayNicotineUsage();
  });
  
  // Pod input field change handler
  podMiddleCapsule.addEventListener('input', function() {
    // Just handle styling and tickbox activation, no validation
    if (this.value.trim()) {
      this.style.color = 'var(--color-dark-gray)';
      this.style.borderColor = 'var(--color-dark-gray)';
      podQuantityTickBox.classList.add('active');
    } else {
      this.style.color = 'var(--color-mid-gray)';
      this.style.borderColor = 'var(--color-mid-gray)';
      podQuantityTickBox.classList.remove('active');
    }
    calculateAndDisplayNicotineUsage();
  });
  
  // Pod input field focus handler
  podMiddleCapsule.addEventListener('focus', function() {
    this.select(); // Select all text when focused
  });
  
  // Pod input field blur handler for validation
  podMiddleCapsule.addEventListener('blur', function() {
    let newValue = parseFloat(this.value);
    
    // Handle empty or invalid input
    if (isNaN(newValue)) {
      newValue = 0.5;
    }
    
    // Enforce minimum of 0.5
    if (newValue < 0.5) {
      newValue = 0.5;
    }
    
    // Update the input value and currentValue variable
    this.value = newValue;
    podCurrentValue = newValue;
    
    // Update styling based on final value
    if (newValue > 0) {
    this.style.color = 'var(--color-dark-gray)';
    this.style.borderColor = 'var(--color-dark-gray)';
    podQuantityTickBox.classList.add('active');
    } else {
      this.style.color = 'var(--color-mid-gray)';
      this.style.borderColor = 'var(--color-mid-gray)';
      podQuantityTickBox.classList.remove('active');
    }
    
    calculateAndDisplayNicotineUsage();
  });
  
  // Function to smoothly hide a pod section
  function hidePodSection(element) {
    if (!element || element.classList.contains('hidden')) return;
    
    // Add hidden class to trigger CSS transition
    element.classList.add('hidden');
    element.classList.remove('visible');
  }
  
  // Initialize the vape tickbox state and pod section visibility
  updateVapeTickBoxState();
  
  // Initialize the question-hstack visibility
  updateQuestionVisibility();
  
  // Initialize the target usage slider
  initializeTargetUsageSlider();
  
  // Add click functionality to level rectangles
  initializeLevelClickHandlers();
  
  // Initialize the current nicotine usage tickbox tracking
  initializeCurrentNicotineTickbox();
  
  // Function to handle question-hstack selection and show/hide appropriate sections
  function updateQuestionVisibility() {
    // Check if current nicotine tickbox is active - if so, don't show any elements
    const currentNicotineTickBox = document.getElementById('current-nicotine-tick-box');
    if (currentNicotineTickBox && currentNicotineTickBox.classList.contains('active')) {
      return; // Don't update visibility if tickbox is active
    }
    
    const cigaretteOptionsHstack = document.querySelector('.cigarette-options-hstack');
    const quantityOptionsHstack = document.querySelector('.quantity-options-hstack');
    const vapeOptionsHstack = document.querySelector('.vape-options-hstack');
    
    // Get the active selection from question-hstack (check ALL capsule buttons, desktop and mobile)
    const cigarettesButtons = document.querySelectorAll('.capsule-button[data-type="cigarettes"]');
    const vapesButtons = document.querySelectorAll('.capsule-button[data-type="vapes"]');
    const bothButtons = document.querySelectorAll('.capsule-button[data-type="both"]');
    
    // Check which option is active (check if ANY button of each type is active)
    const isCigarettesActive = Array.from(cigarettesButtons).some(btn => btn.classList.contains('active'));
    const isVapesActive = Array.from(vapesButtons).some(btn => btn.classList.contains('active'));
    const isBothActive = Array.from(bothButtons).some(btn => btn.classList.contains('active'));
    
    // Hide all sections by default
    hideQuestionSection(cigaretteOptionsHstack);
    hideQuestionSection(quantityOptionsHstack);
    hideQuestionSection(vapeOptionsHstack);
    
    // Show sections based on selection
    if (isCigarettesActive) {
      // Show only cigarette sections
      showQuestionSection(cigaretteOptionsHstack);
      showQuestionSection(quantityOptionsHstack);
      
      // Remove vapes-only class since vapes section is hidden
      if (vapeOptionsHstack) {
        vapeOptionsHstack.classList.remove('vapes-only');
      }
      
      // Remove vapes-or-both class for confirm button (cigarettes has perfect spacing)
      const confirmButtonContainer = document.getElementById('confirm-button-container');
      if (confirmButtonContainer) {
        confirmButtonContainer.classList.remove('vapes-or-both');
      }
      
      // Update question text to "per day"
      updateCigaretteQuantityText('How many cigarettes do you smoke per day?');
      
      // Reset vape options to unselected state
      resetVapeOptions();
    } else if (isVapesActive) {
      // Show only vape sections
      showQuestionSection(vapeOptionsHstack);
      
      // Add vapes-only class to reduce top margin
      if (vapeOptionsHstack) {
        vapeOptionsHstack.classList.add('vapes-only');
      }
      
      // Add vapes-or-both class for confirm button (needs extra spacing)
      const confirmButtonContainer = document.getElementById('confirm-button-container');
      if (confirmButtonContainer) {
        confirmButtonContainer.classList.add('vapes-or-both');
      }
      
      // Reset cigarette options to unselected state
      resetCigaretteOptions();
    } else if (isBothActive) {
      // Show both cigarette and vape sections
      showQuestionSection(cigaretteOptionsHstack);
      showQuestionSection(quantityOptionsHstack);
      showQuestionSection(vapeOptionsHstack);
      
      // Remove vapes-only class to use normal top margin
      if (vapeOptionsHstack) {
        vapeOptionsHstack.classList.remove('vapes-only');
      }
      
      // Add vapes-or-both class for confirm button (needs extra spacing)
      const confirmButtonContainer = document.getElementById('confirm-button-container');
      if (confirmButtonContainer) {
        confirmButtonContainer.classList.add('vapes-or-both');
      }
      
      // Update question text to "per week"
      updateCigaretteQuantityText('How many cigarettes do you smoke per week?');
      
      // Don't reset any options when both is selected
    } else {
      // If none selected (default), remove vapes-only class
      if (vapeOptionsHstack) {
        vapeOptionsHstack.classList.remove('vapes-only');
      }
      
      // Remove vapes-or-both class for confirm button (no selection)
      const confirmButtonContainer = document.getElementById('confirm-button-container');
      if (confirmButtonContainer) {
        confirmButtonContainer.classList.remove('vapes-or-both');
      }
    }
    // If none selected (default), all sections remain hidden
    
    // Trigger completion check after visibility changes
    if (typeof checkCurrentNicotineCompletion === 'function') {
      setTimeout(checkCurrentNicotineCompletion, 100);
    }
    
    // Update nicotine usage calculation
    if (typeof calculateAndDisplayNicotineUsage === 'function') {
      setTimeout(calculateAndDisplayNicotineUsage, 100);
    }
  }
  
  // Function to update the cigarette quantity question text
  function updateCigaretteQuantityText(newText) {
    const quantityQuestion = document.querySelector('.quantity-question');
    if (quantityQuestion) {
      quantityQuestion.textContent = newText;
    }
  }
  
  // Function to reset vape options to unselected state
  function resetVapeOptions() {
    const refillableVstack = document.querySelector('.refillable-vstack');
    const podBasedVstack = document.querySelector('.pod-based-vstack');
    
    // Remove active class from refillable
    if (refillableVstack) {
      refillableVstack.classList.remove('active');
      const refillableIcon = refillableVstack.querySelector('.refillable-icon');
      if (refillableIcon) {
        refillableIcon.src = 'assets/refillable-grey.svg';
      }
    }
    
    // Remove active class from pod-based
    if (podBasedVstack) {
      podBasedVstack.classList.remove('active');
      const podBasedIcon = podBasedVstack.querySelector('.pod-based-icon');
      if (podBasedIcon) {
        podBasedIcon.src = 'assets/pod-based-grey.svg';
      }
    }
    
    // Update vape tickbox state and hide pod/bottle sections
    updateVapeTickBoxState();
  }
  
  // Function to reset cigarette options to unselected state
  function resetCigaretteOptions() {
    const pouchVstack = document.querySelector('.pouch-vstack');
    const cartonVstack = document.querySelector('.carton-vstack');
    
    // Remove active class from pouch
    if (pouchVstack) {
      pouchVstack.classList.remove('active');
      const pouchIcon = pouchVstack.querySelector('.pouch-icon');
      if (pouchIcon) {
        pouchIcon.src = 'assets/pouch-grey.svg';
      }
    }
    
    // Remove active class from carton
    if (cartonVstack) {
      cartonVstack.classList.remove('active');
      const cartonIcon = cartonVstack.querySelector('.carton-icon');
      if (cartonIcon) {
        cartonIcon.src = 'assets/carton-grey.svg';
      }
    }
    
    // Clear cigarette quantity input and reset to default
    const cigaretteQuantityInput = document.querySelector('.quantity-options-hstack .middle-capsule');
    const cigaretteQuantityTickBox = document.getElementById('quantity-tick-box');
    
    if (cigaretteQuantityInput) {
      cigaretteQuantityInput.value = '15';
      cigaretteQuantityInput.style.borderColor = 'var(--color-mid-gray)';
      cigaretteQuantityInput.style.color = 'var(--color-mid-gray)';
    }
    
    if (cigaretteQuantityTickBox) {
      cigaretteQuantityTickBox.classList.remove('active');
    }
    
    // Reset global variable
    currentValue = 15;
    
    // Update cigarette tickbox state
    updateTickBoxState();
  }
  
  // Function to smoothly show a question section
  function showQuestionSection(element) {
    if (!element || element.classList.contains('visible')) return;
    
    // Remove hidden class to trigger CSS transition
    element.classList.remove('hidden');
    element.classList.add('visible');
  }
  
  // Function to smoothly hide a question section
  function hideQuestionSection(element) {
    if (!element || element.classList.contains('hidden')) return;
    
    // Add hidden class to trigger CSS transition
    element.classList.add('hidden');
    element.classList.remove('visible');
  }
  
  // Global functions for target usage slider (accessible from anywhere)
  function updateProgressWidth() {
    const slider = document.getElementById('target-usage-slider');
    const container = document.querySelector('.target-usage-bottom-rectangle');
    const progressRect = document.getElementById('target-usage-progress');
    
    if (!slider || !container || !progressRect) return;
    
    const sliderLeft = parseInt(window.getComputedStyle(slider).left, 10);
    const sliderWidth = slider.offsetWidth;
    const containerWidth = container.offsetWidth;
    const sliderCenter = sliderLeft + (sliderWidth / 2);
    
    // Calculate width from slider center to right edge
    const progressWidth = containerWidth - sliderCenter;
    progressRect.style.width = Math.max(0, progressWidth) + 'px';
  }
  
  function getSnapPoints() {
    const slider = document.getElementById('target-usage-slider');
    const container = document.querySelector('.target-usage-bottom-rectangle');
    const levelRectangles = document.querySelectorAll('.target-usage-level');
    
    if (!slider || !container) return [];
    
    const containerLeft = container.offsetLeft;
    const snapPoints = [];
    
    // Get slider width - use the same logic that works on subsequent clicks
    let sliderWidth;
    
    // Check if mobile (25% width) or desktop (120px)
    if (window.innerWidth <= 768) {
      // On mobile, slider width is 25% of the level rectangle width
      const firstLevelRect = levelRectangles[0];
      if (firstLevelRect) {
        sliderWidth = firstLevelRect.offsetWidth; // Each level is 25% of total, so slider matches level width
      } else {
        sliderWidth = container.offsetWidth * 0.25; // Fallback
      }
    } else {
      // On desktop, try to get actual width first, fallback to 120px
      const computedStyle = window.getComputedStyle(slider);
      sliderWidth = parseInt(computedStyle.width, 10);
      if (sliderWidth === 0) {
        sliderWidth = 120; // 120px on desktop
      }
    }
    
    levelRectangles.forEach((levelRect, index) => {
      const levelRectRight = levelRect.offsetLeft + levelRect.offsetWidth;
      // Calculate where slider left should be so its right edge aligns with level rectangle right edge
      const snapPoint = levelRectRight - sliderWidth;
      snapPoints.push(snapPoint);
    });
    
    return snapPoints;
  }
  
  function updateLevelBorderRadius(activeLevelIndex) {
    const levelRectangles = document.querySelectorAll('.target-usage-level');
    
    levelRectangles.forEach((levelRect, index) => {
      if (index === activeLevelIndex) {
        // Active level: bottom right corner = 0, others = 20px
        levelRect.style.borderRadius = '20px 20px 0 20px'; // top-left, top-right, bottom-right, bottom-left
        levelRect.classList.add('active');
      } else {
        // Inactive levels: all corners = 20px
        levelRect.style.borderRadius = '20px';
        levelRect.classList.remove('active');
      }
    });
  }
  
  function updateLevelColors(activeLevelIndex) {
    const gradientRect = document.querySelector('.target-usage-gradient-rectangle');
    const slider = document.getElementById('target-usage-slider');
    const sliderRectangle = document.querySelector('.slider-rectangle');
    const levelRectangles = document.querySelectorAll('.target-usage-level');
    const sliderLevelText = document.getElementById('slider-level-text');
    const targetUsageTickBox = document.getElementById('target-usage-tick-box');
    const quitLevelText = document.querySelector('.quit-level-text');
    const sliderPercentageText = document.getElementById('slider-percentage-text');
    
    // Define colors for each level (0-indexed)
    const levelColors = [
      'var(--color-blue)',      // Level 1 (index 0)
      'var(--color-level-2)',   // Level 2 (index 1)
      'var(--color-level-3)',   // Level 3 (index 2)
      'var(--color-green)'      // Level 4 (index 3)
    ];
    
    const activeColor = levelColors[activeLevelIndex];
    
    // Target usage tickbox will be activated when confirm button is clicked
    
    // Update slider level text
    sliderLevelText.textContent = `Level ${activeLevelIndex + 1}`;
    sliderLevelText.style.color = activeColor;
    
    // Update slider rectangle border color
    if (sliderRectangle) {
      sliderRectangle.style.borderColor = activeColor;
    }
    
    // Calculate and update percentage reduction
    updatePercentageReduction(activeLevelIndex);
    
    // Show mobile percentage text when a level is selected
    const mobilePercentageHstack = document.querySelector('.mobile-percentage-hstack');
    if (mobilePercentageHstack) {
      mobilePercentageHstack.classList.remove('hidden');
    }
    
    // Add level-selected class to target-usage-picker to increase bottom margin
    const targetUsagePicker = document.querySelector('.target-usage-picker');
    if (targetUsagePicker) {
      targetUsagePicker.classList.add('level-selected');
    }
    
    // Show the target usage confirm button when a level is selected
    const targetUsageConfirmButtonContainer = document.getElementById('target-usage-confirm-button-container');
    if (targetUsageConfirmButtonContainer) {
      targetUsageConfirmButtonContainer.classList.remove('hidden');
    }
    
    // Update quit level text opacity based on selection
    if (quitLevelText) {
      if (activeLevelIndex === 3) { // Level 4 (index 3)
        quitLevelText.classList.add('level-4-selected');
      } else {
        quitLevelText.classList.remove('level-4-selected');
      }
    }
    
    
    // Update gradient rectangle background
    if (activeColor === 'var(--color-blue)') {
      gradientRect.style.background = 'linear-gradient(to right, rgba(86, 154, 211, 0) 0%, rgba(86, 154, 211, 1) 100%)';
    } else if (activeColor === 'var(--color-level-2)') {
      gradientRect.style.background = 'linear-gradient(to right, rgba(111, 169, 170, 0) 0%, rgba(111, 169, 170, 1) 100%)';
    } else if (activeColor === 'var(--color-level-3)') {
      gradientRect.style.background = 'linear-gradient(to right, rgba(130, 183, 123, 0) 0%, rgba(130, 183, 123, 1) 100%)';
    } else if (activeColor === 'var(--color-green)') {
      gradientRect.style.background = 'linear-gradient(to right, rgba(145, 220, 41, 0) 0%, rgba(145, 220, 41, 1) 100%)';
    }
    
    // Update slider border color
    if (sliderRectangle) {
      sliderRectangle.style.borderColor = activeColor;
    }
    
    // Update level rectangle gradients
    levelRectangles.forEach((levelRect, index) => {
      if (index === activeLevelIndex) {
        // Active level gets its specific color gradient
        const color = levelColors[index];
        if (color === 'var(--color-blue)') {
          levelRect.style.background = 'linear-gradient(to right, rgba(86, 154, 211, 0) 0%, rgba(86, 154, 211, 1) 100%)';
        } else if (color === 'var(--color-level-2)') {
          levelRect.style.background = 'linear-gradient(to right, rgba(111, 169, 170, 0) 0%, rgba(111, 169, 170, 1) 100%)';
        } else if (color === 'var(--color-level-3)') {
          levelRect.style.background = 'linear-gradient(to right, rgba(130, 183, 123, 0) 0%, rgba(130, 183, 123, 1) 100%)';
        } else if (color === 'var(--color-green)') {
          levelRect.style.background = 'linear-gradient(to right, rgba(145, 220, 41, 0) 0%, rgba(145, 220, 41, 1) 100%)';
        }
      } else {
        // Inactive levels get black-5 gradient
        levelRect.style.background = 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.05) 100%)';
      }
    });
  }

  // Function to calculate and update percentage reduction
  function updatePercentageReduction(activeLevelIndex) {
    const sliderPercentageValue = document.getElementById('slider-percentage-value');
    const mobilePercentageValue = document.getElementById('mobile-percentage-value');
    if (!sliderPercentageValue && !mobilePercentageValue) return;
    
    // Get current nicotine usage from the status rectangle
    const statusRectangle = document.querySelector('.status-rectangle');
    if (!statusRectangle || !statusRectangle.textContent) {
      if (sliderPercentageValue) sliderPercentageValue.textContent = '0%';
      if (mobilePercentageValue) mobilePercentageValue.textContent = '0%';
      return;
    }
    
    // Extract current nicotine value from the status rectangle text
    const statusText = statusRectangle.textContent;
    const currentNicotineMatch = statusText.match(/(\d+)mg/);
    if (!currentNicotineMatch) {
      if (sliderPercentageValue) sliderPercentageValue.textContent = '0%';
      if (mobilePercentageValue) mobilePercentageValue.textContent = '0%';
      return;
    }
    
    const currentNicotine = parseFloat(currentNicotineMatch[1]);
    
    // Define target nicotine values for each level (0-indexed)
    const targetNicotineValues = [18, 8, 3, 1]; // Level 1: 18mg, Level 2: 8mg, Level 3: 3mg, Level 4: 1mg
    
    // Level colors for percentage text
    const levelColors = [
      'var(--color-blue)',      // Level 1 (index 0)
      'var(--color-level-2)',   // Level 2 (index 1)
      'var(--color-level-3)',   // Level 3 (index 2)
      'var(--color-green)'      // Level 4 (index 3)
    ];
    
    if (activeLevelIndex >= 0 && activeLevelIndex < targetNicotineValues.length) {
      const targetNicotine = targetNicotineValues[activeLevelIndex];
      const levelColor = levelColors[activeLevelIndex];
      
      // Calculate percentage reduction: ((current - target) / current) * 100
      const reductionPercentage = Math.round(((currentNicotine - targetNicotine) / currentNicotine) * 100);
      
      // Ensure percentage is not negative (in case target is higher than current)
      const finalPercentage = Math.max(0, reductionPercentage);
      
      if (sliderPercentageValue) {
        sliderPercentageValue.textContent = `${finalPercentage}%`;
        sliderPercentageValue.style.color = levelColor;
      }
      if (mobilePercentageValue) {
        mobilePercentageValue.textContent = `${finalPercentage}%`;
        mobilePercentageValue.style.color = levelColor;
      }
      
      // Update reduce icons based on selected level
      const reduceIcons = [
        'assets/reduce1.svg',  // Level 1 (index 0)
        'assets/reduce2.svg',  // Level 2 (index 1)
        'assets/reduce3.svg',  // Level 3 (index 2)
        'assets/reduce4.svg'   // Level 4 (index 3)
      ];
      
      const selectedIcon = reduceIcons[activeLevelIndex];
      
      // Update slider reduce icon
      const sliderReduceIcon = document.querySelector('.slider-reduce-icon');
      if (sliderReduceIcon) {
        sliderReduceIcon.src = selectedIcon;
      }
      
      // Update mobile reduce icon
      const mobileReduceIcon = document.querySelector('.mobile-reduce-icon');
      if (mobileReduceIcon) {
        mobileReduceIcon.src = selectedIcon;
      }
    } else {
      if (sliderPercentageValue) {
        sliderPercentageValue.textContent = '0%';
        sliderPercentageValue.style.color = 'var(--color-blue)'; // Default color
      }
      if (mobilePercentageValue) {
        mobilePercentageValue.textContent = '0%';
        mobilePercentageValue.style.color = 'var(--color-blue)'; // Default color
      }
      
      // Use default reduce icon
      const sliderReduceIcon = document.querySelector('.slider-reduce-icon');
      if (sliderReduceIcon) {
        sliderReduceIcon.src = 'assets/reduce.svg';
      }
      
      const mobileReduceIcon = document.querySelector('.mobile-reduce-icon');
      if (mobileReduceIcon) {
        mobileReduceIcon.src = 'assets/reduce.svg';
      }
    }
  }

  // Function to smoothly transition between level colors during dragging
  function updateLevelColorsSmooth(activeLevelIndex, progress) {
    const levelRectangles = document.querySelectorAll('.target-usage-level');
    const gradientRect = document.querySelector('.target-usage-gradient-rectangle');
    const slider = document.getElementById('target-usage-slider');
    const sliderRectangle = document.querySelector('.slider-rectangle');
    
    // Define colors for each level (0-indexed)
    const levelColors = [
      { r: 86, g: 154, b: 211 },    // Level 1 (blue)
      { r: 111, g: 169, b: 170 },   // Level 2 (teal)
      { r: 130, g: 183, b: 123 },   // Level 3 (green)
      { r: 145, g: 220, b: 41 }     // Level 4 (bright green)
    ];
    
    // Update level rectangle gradients with smooth interpolation
    levelRectangles.forEach((levelRect, index) => {
      if (index === activeLevelIndex) {
        // Active level - fade in the color based on progress
        const color = levelColors[index];
        const opacity = progress; // progress is 0-1
        levelRect.style.background = `linear-gradient(to right, rgba(${color.r}, ${color.g}, ${color.b}, 0) 0%, rgba(${color.r}, ${color.g}, ${color.b}, ${opacity}) 100%)`;
        levelRect.classList.add('active');
      } else {
        // Inactive levels - fade out to default
        levelRect.style.background = 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.05) 100%)';
        levelRect.classList.remove('active');
      }
    });
    
    // Update gradient rectangle and slider with smooth color
    if (activeLevelIndex >= 0 && activeLevelIndex < levelColors.length) {
      const color = levelColors[activeLevelIndex];
      const opacity = progress;
      gradientRect.style.background = `linear-gradient(to right, rgba(${color.r}, ${color.g}, ${color.b}, 0) 0%, rgba(${color.r}, ${color.g}, ${color.b}, ${opacity}) 100%)`;
      if (sliderRectangle) {
        sliderRectangle.style.borderColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
      }
    }
  }
  
  // Global function to find the closest snap point
  function findClosestSnapPoint(currentLeft) {
    const snapPoints = getSnapPoints();
    let closestPoint = snapPoints[0];
    let closestIndex = 0;
    let minDistance = Math.abs(currentLeft - snapPoints[0]);
    
    for (let i = 1; i < snapPoints.length; i++) {
      const distance = Math.abs(currentLeft - snapPoints[i]);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = snapPoints[i];
        closestIndex = i;
      }
    }
    
    return { point: closestPoint, index: closestIndex };
  }
  
  // Function to initialize the target usage slider
  function initializeTargetUsageSlider() {
    const slider = document.getElementById('target-usage-slider');
    const container = document.querySelector('.target-usage-bottom-rectangle');
    const progressRect = document.getElementById('target-usage-progress');
    
    if (!slider || !container || !progressRect) return;
    
    let isDragging = false;
    let startX = 0;
    let startLeft = 0;
    
    // Function to handle responsive slider width changes
    function handleResponsiveSlider() {
      // Recalculate snap points when window is resized
      const snapPoints = getSnapPoints();
      if (snapPoints.length > 0) {
        // Get current level index (find which snap point is closest to current position)
        const currentLeft = parseInt(window.getComputedStyle(slider).left, 10);
        const snapResult = findClosestSnapPoint(currentLeft);
        
        // Update slider position to maintain current level
        slider.style.left = snapResult.point + 'px';
        updateProgressWidth();
        updateLevelBorderRadius(snapResult.index);
        updateLevelColors(snapResult.index);
      }
    }
    
    
    // Mouse events
    slider.addEventListener('mousedown', function(e) {
      isDragging = true;
      startX = e.clientX;
      startLeft = parseInt(window.getComputedStyle(slider).left, 10);
      
      // Show slider and gradient elements when dragging starts
      const gradientRect = document.querySelector('.target-usage-gradient-rectangle');
      const progressRect = document.getElementById('target-usage-progress');
      slider.classList.remove('hidden');
      gradientRect.classList.remove('hidden');
      progressRect.classList.remove('hidden');
      
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const newLeft = startLeft + deltaX;
      const containerWidth = container.offsetWidth;
      const sliderWidth = slider.offsetWidth;
      
      // Constrain slider within container bounds
      const minLeft = 0;
      const maxLeft = containerWidth - sliderWidth;
      const constrainedLeft = Math.max(minLeft, Math.min(maxLeft, newLeft));
      
      slider.style.left = constrainedLeft + 'px';
      updateProgressWidth();
      
      // Update level text and colors in real-time during dragging with smooth transitions
      const snapResult = findClosestSnapPoint(constrainedLeft);
      console.log('Mouse dragging - Slider position:', constrainedLeft, 'Closest level:', snapResult.index + 1);
      
      // Update slider level text in real-time
      const sliderLevelText = document.getElementById('slider-level-text');
      if (sliderLevelText) {
        sliderLevelText.textContent = `Level ${snapResult.index + 1}`;
        
        // Update text color to match the level
        const levelColors = [
          'var(--color-blue)',      // Level 1 (index 0)
          'var(--color-level-2)',   // Level 2 (index 1)
          'var(--color-level-3)',   // Level 3 (index 2)
          'var(--color-green)'      // Level 4 (index 3)
        ];
        sliderLevelText.style.color = levelColors[snapResult.index];
      }
      
      // Calculate progress based on distance to snap point (0-1)
      const snapPoints = getSnapPoints();
      const currentSnapPoint = snapPoints[snapResult.index];
      const distance = Math.abs(constrainedLeft - currentSnapPoint);
      const maxDistance = containerWidth / 4; // Maximum distance is 1/4 of container width
      const progress = Math.max(0, Math.min(1, 1 - (distance / maxDistance)));
      
      updateLevelBorderRadius(snapResult.index);
      updateLevelColorsSmooth(snapResult.index, progress);
    });
    
    document.addEventListener('mouseup', function() {
      if (isDragging) {
        // Snap to closest snap point when dragging ends
        const currentLeft = parseInt(window.getComputedStyle(slider).left, 10);
        const snapResult = findClosestSnapPoint(currentLeft);
        slider.style.left = snapResult.point + 'px';
        updateProgressWidth();
        updateLevelBorderRadius(snapResult.index);
        updateLevelColors(snapResult.index);
      }
      isDragging = false;
    });
    
    // Touch events for mobile
    slider.addEventListener('touchstart', function(e) {
      isDragging = true;
      startX = e.touches[0].clientX;
      startLeft = parseInt(window.getComputedStyle(slider).left, 10);
      
      // Show slider and gradient elements when dragging starts
      const gradientRect = document.querySelector('.target-usage-gradient-rectangle');
      const progressRect = document.getElementById('target-usage-progress');
      slider.classList.remove('hidden');
      gradientRect.classList.remove('hidden');
      progressRect.classList.remove('hidden');
      
      e.preventDefault();
    });
    
    document.addEventListener('touchmove', function(e) {
      if (!isDragging) return;
      
      const deltaX = e.touches[0].clientX - startX;
      const newLeft = startLeft + deltaX;
      const containerWidth = container.offsetWidth;
      const sliderWidth = slider.offsetWidth;
      
      // Constrain slider within container bounds
      const minLeft = 0;
      const maxLeft = containerWidth - sliderWidth;
      const constrainedLeft = Math.max(minLeft, Math.min(maxLeft, newLeft));
      
      slider.style.left = constrainedLeft + 'px';
      updateProgressWidth();
      
      // Update level text and colors in real-time during dragging with smooth transitions
      const snapResult = findClosestSnapPoint(constrainedLeft);
      console.log('Touch dragging - Slider position:', constrainedLeft, 'Closest level:', snapResult.index + 1);
      
      // Update slider level text in real-time
      const sliderLevelText = document.getElementById('slider-level-text');
      if (sliderLevelText) {
        sliderLevelText.textContent = `Level ${snapResult.index + 1}`;
        
        // Update text color to match the level
        const levelColors = [
          'var(--color-blue)',      // Level 1 (index 0)
          'var(--color-level-2)',   // Level 2 (index 1)
          'var(--color-level-3)',   // Level 3 (index 2)
          'var(--color-green)'      // Level 4 (index 3)
        ];
        sliderLevelText.style.color = levelColors[snapResult.index];
      }
      
      // Calculate progress based on distance to snap point (0-1)
      const snapPoints = getSnapPoints();
      const currentSnapPoint = snapPoints[snapResult.index];
      const distance = Math.abs(constrainedLeft - currentSnapPoint);
      const maxDistance = containerWidth / 4; // Maximum distance is 1/4 of container width
      const progress = Math.max(0, Math.min(1, 1 - (distance / maxDistance)));
      
      updateLevelBorderRadius(snapResult.index);
      updateLevelColorsSmooth(snapResult.index, progress);
      
      e.preventDefault();
    });
    
    document.addEventListener('touchend', function() {
      if (isDragging) {
        // Snap to closest snap point when dragging ends
        const currentLeft = parseInt(window.getComputedStyle(slider).left, 10);
        const snapResult = findClosestSnapPoint(currentLeft);
        slider.style.left = snapResult.point + 'px';
        updateProgressWidth();
        updateLevelBorderRadius(snapResult.index);
        updateLevelColors(snapResult.index);
      }
      isDragging = false;
    });
    
    // Initialize slider position to Level 4 (default snap point)
    // Keep slider and gradient hidden initially - no level selected
    // They will be shown when a level is clicked
    
    // Handle window resize for responsive behavior
    window.addEventListener('resize', function() {
      // Debounce resize events
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(handleResponsiveSlider, 100);
    });
  }
  
  // Function to smoothly animate slider to a target position
  function animateSliderToPosition(slider, targetPosition) {
    // Get current position from computed style or inline style
    let startPosition = 0;
    if (slider.style.left) {
      startPosition = parseInt(slider.style.left) || 0;
    } else {
      // If no inline style, get from computed style
      const computedStyle = window.getComputedStyle(slider);
      startPosition = parseInt(computedStyle.left) || 0;
    }
    
    const distance = targetPosition - startPosition;
    const duration = 400; // Increased to 400ms for smoother animation
    const startTime = performance.now();
    
    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easeOutQuart for even smoother deceleration
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      
      const currentPosition = startPosition + (distance * easeProgress);
      slider.style.left = currentPosition + 'px';
      
      // Update progress width during animation
      updateProgressWidth();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure we end exactly at the target position
        slider.style.left = targetPosition + 'px';
        updateProgressWidth();
      }
    }
    
    requestAnimationFrame(animate);
  }

  // Simple function to add click handlers to level rectangles
  function initializeLevelClickHandlers() {
    const levelRectangles = document.querySelectorAll('.target-usage-level');
    
    levelRectangles.forEach((levelRect, index) => {
      levelRect.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event bubbling
        console.log('Level clicked:', index); // Debug log
        
        // Test if we can move the slider at all
        const slider = document.getElementById('target-usage-slider');
        console.log('Current slider position:', slider.style.left);
        
        // Get snap points
        const snapPoints = getSnapPoints();
        console.log('Snap points:', snapPoints);
        
        if (snapPoints.length > 0 && snapPoints[index] !== undefined) {
          const gradientRect = document.querySelector('.target-usage-gradient-rectangle');
          const progressRect = document.getElementById('target-usage-progress');
          
          // Show slider and gradient elements
          slider.classList.remove('hidden');
          gradientRect.classList.remove('hidden');
          progressRect.classList.remove('hidden');
          
          // Animate slider to the clicked level
          animateSliderToPosition(slider, snapPoints[index]);
          console.log('Animating slider to position:', snapPoints[index]);
          
          // Update progress width
          updateProgressWidth();
          
          // Update border radius for active level
          updateLevelBorderRadius(index);
          
          // Update colors immediately
          updateLevelColors(index);
        }
      });
      
      // Add cursor pointer to indicate clickability
      levelRect.style.cursor = 'pointer';
    });
  }
  
  // Function to auto-scroll to the Target Usage section
  function scrollToTargetUsageSection() {
    const targetUsageSection = document.querySelector('.target-usage-section');
    if (targetUsageSection) {
      const rect = targetUsageSection.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const elementTop = rect.top + scrollTop;
      const windowHeight = window.innerHeight;
      
      // Position the target usage section at about 20% from the top of the viewport
      const targetPosition = elementTop - (windowHeight * 0.2);
      
      // Smooth scroll to the calculated position
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
  
  // Function to auto-scroll to focus on newly revealed elements
  function scrollToCurrentNicotineSection() {
    const windowHeight = window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Check which elements are visible and prioritize the newly revealed ones
    const bottleTypeHstack = document.querySelector('.bottle-type-hstack');
    const bottleQuantityHstack = document.querySelector('.bottle-quantity-hstack');
    const podTypeHstack = document.querySelector('.pod-type-hstack');
    const podQuantityHstack = document.querySelector('.pod-quantity-hstack');
    
    const bottleTypeVisible = bottleTypeHstack && bottleTypeHstack.classList.contains('visible');
    const bottleQuantityVisible = bottleQuantityHstack && bottleQuantityHstack.classList.contains('visible');
    const podTypeVisible = podTypeHstack && podTypeHstack.classList.contains('visible');
    const podQuantityVisible = podQuantityHstack && podQuantityHstack.classList.contains('visible');
    
    let targetElement = null;
    
    // Priority order: focus on the most recently revealed elements
    if (podQuantityVisible) {
      targetElement = podQuantityHstack; // Last element in the stack
    } else if (podTypeVisible) {
      targetElement = podTypeHstack;
    } else if (bottleQuantityVisible) {
      targetElement = bottleQuantityHstack;
    } else if (bottleTypeVisible) {
      targetElement = bottleTypeHstack;
    }
    
    if (targetElement) {
      // Focus on the newly revealed element
      const rect = targetElement.getBoundingClientRect();
      const elementTop = rect.top + scrollTop;
      
      // Position the element at about 30% from the top of the viewport
      const targetPosition = elementTop - (windowHeight * 0.3);
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    } else {
      // No newly revealed elements, use normal centering for the main section
      const currentNicotineSection = document.querySelector('.plan-section');
      if (currentNicotineSection) {
        const rect = currentNicotineSection.getBoundingClientRect();
        const elementTop = rect.top + scrollTop;
        const elementHeight = rect.height;
        
        const centerPosition = elementTop - (windowHeight / 2) + (elementHeight / 2);
        
        window.scrollTo({
          top: centerPosition,
          behavior: 'smooth'
        });
      }
    }
  }

  // Function to wait for elements to be visible and then scroll
  function waitForElementsAndScroll() {
    // Check if any bottle or pod elements are visible
    const bottleTypeHstack = document.querySelector('.bottle-type-hstack');
    const bottleQuantityHstack = document.querySelector('.bottle-quantity-hstack');
    const podTypeHstack = document.querySelector('.pod-type-hstack');
    const podQuantityHstack = document.querySelector('.pod-quantity-hstack');
    
    const elementsToCheck = [bottleTypeHstack, bottleQuantityHstack, podTypeHstack, podQuantityHstack];
    const visibleElements = elementsToCheck.filter(el => el && el.classList.contains('visible'));
    
    if (visibleElements.length > 0) {
      // Wait for transitions to complete (0.4s) plus buffer
      setTimeout(scrollToCurrentNicotineSection, 500);
    } else {
      // No new elements to show, scroll immediately
      setTimeout(scrollToCurrentNicotineSection, 100);
    }
  }
  
  // Function to calculate and display nicotine usage
  function calculateAndDisplayNicotineUsage() {
    const statusRectangle = document.querySelector('.status-rectangle');
    if (!statusRectangle) return;
    
    // Get the active selection from the main question
    const cigarettesButton = document.querySelector('.capsule-button[data-type="cigarettes"]');
    const vapesButton = document.querySelector('.capsule-button[data-type="vapes"]');
    const bothButton = document.querySelector('.capsule-button[data-type="both"]');
    
    const isCigarettesActive = cigarettesButton && cigarettesButton.classList.contains('active');
    const isVapesActive = vapesButton && vapesButton.classList.contains('active');
    const isBothActive = bothButton && bothButton.classList.contains('active');
    
    let totalNicotineUsage = 0;
    
    if (isCigarettesActive || isBothActive) {
      // Calculate cigarette nicotine usage
      const quantityInput = document.querySelector('.quantity-options-hstack .middle-capsule');
      if (quantityInput && quantityInput.value) {
        const cigarettesPerDay = parseFloat(quantityInput.value) || 0;
        let cigaretteNicotine = cigarettesPerDay * POD_BRAND_SPECS.cigaretteStrength;
        
        // If "both" is selected, convert to weekly basis (divide by 7)
        if (isBothActive) {
          cigaretteNicotine = cigaretteNicotine / 7;
        }
        
        totalNicotineUsage += cigaretteNicotine;
      }
    }
    
    if (isVapesActive || isBothActive) {
      // Calculate vape nicotine usage
      const refillableActive = document.querySelector('.refillable-vstack') && document.querySelector('.refillable-vstack').classList.contains('active');
      const podBasedActive = document.querySelector('.pod-based-vstack') && document.querySelector('.pod-based-vstack').classList.contains('active');
      
      if (refillableActive) {
        // Get bottle strength
        const strengthInput = document.querySelector('.strength-input');
        const strength = strengthInput ? parseFloat(strengthInput.value) || 0 : 0;
        
        // Get bottle size
        const sizeInput = document.querySelector('.size-input');
        const bottleSize = sizeInput ? parseFloat(sizeInput.value) || 0 : 0;
        
        // Get bottle quantity
        const bottleQuantityInput = document.querySelector('.bottle-counter-capsule.middle-capsule');
        const bottleQuantity = bottleQuantityInput ? parseFloat(bottleQuantityInput.value) || 0 : 0;
        
        // Calculate: strength × bottle size × quantity ÷ 7
        const vapeNicotine = (strength * bottleSize * bottleQuantity) / 7;
        totalNicotineUsage += vapeNicotine;
      }
      
      if (podBasedActive) {
        // Get pod quantity
        const podQuantityInput = document.querySelector('.pod-counter-capsule.middle-capsule');
        const podQuantity = podQuantityInput ? parseFloat(podQuantityInput.value) || 0 : 0;
        
        // Get pod brand selection
        const podDropdownCapsule = document.getElementById('pod-dropdown-capsule');
        const podOtherCapsule = document.getElementById('pod-other-capsule');
        
        let podStrength = 0;
        let podSize = 0;
        
        if (podDropdownCapsule && podDropdownCapsule.classList.contains('selected')) {
          // Get the selected pod brand from the selectedPodType variable
          const selectedBrand = selectedPodType;
          
          if (selectedBrand === 'Juul') {
            podStrength = POD_BRAND_SPECS.strengths['Juul'];
            podSize = POD_BRAND_SPECS.sizes['Juul'];
          } else if (selectedBrand === 'Lost Mary') {
            // Get second dropdown selection from podOtherCapsule content
            const secondSelection = podOtherCapsule.querySelector('.pod-other-text');
            const lostMarySelection = secondSelection ? secondSelection.textContent.trim() : '';
            if (lostMarySelection === 'BM600') {
              podStrength = POD_BRAND_SPECS.strengths['BM600'];
              podSize = POD_BRAND_SPECS.sizes['BM600'];
            } else if (lostMarySelection === 'BM6000') {
              podStrength = POD_BRAND_SPECS.strengths['BM6000'];
              podSize = POD_BRAND_SPECS.sizes['BM6000'];
            }
          } else if (selectedBrand === 'Elf Bar') {
            // Get second dropdown selection from podOtherCapsule content
            const secondSelection = podOtherCapsule.querySelector('.pod-other-text');
            const elfBarSelection = secondSelection ? secondSelection.textContent.trim() : '';
            if (elfBarSelection === '600') {
              podStrength = POD_BRAND_SPECS.strengths['600'];
              podSize = POD_BRAND_SPECS.sizes['600'];
            } else if (elfBarSelection === 'AF5500') {
              podStrength = POD_BRAND_SPECS.strengths['AF5500'];
              podSize = POD_BRAND_SPECS.sizes['AF5500'];
            }
          } else if (selectedBrand === 'Vuse') {
            // Get second dropdown selection from podOtherCapsule content
            const secondSelection = podOtherCapsule.querySelector('.pod-other-text');
            const vuseSelection = secondSelection ? secondSelection.textContent.trim() : '';
            if (vuseSelection === 'Ultra') {
              podSize = POD_BRAND_SPECS.sizes['Ultra'];
            } else if (vuseSelection === 'Pro') {
              podSize = POD_BRAND_SPECS.sizes['Pro'];
            } else if (vuseSelection === 'Reload') {
              podSize = POD_BRAND_SPECS.sizes['Reload'];
            }
            // For Vuse, get strength from input
            const podStrengthInput = document.querySelector('.pod-strength-input');
            podStrength = podStrengthInput ? parseFloat(podStrengthInput.value) || 0 : 0;
          }
        } else if (selectedPodType === 'Other') {
          // Get strength and size from inputs for "Other"
          const podStrengthInput = document.querySelector('.pod-strength-input');
          const podSizeInput = document.querySelector('.pod-bottle-size-input');
          podStrength = podStrengthInput ? parseFloat(podStrengthInput.value) || 0 : 0;
          podSize = podSizeInput ? parseFloat(podSizeInput.value) || 0 : 0;
        }
        
        // Calculate: strength × pod size × quantity ÷ 7
        const podNicotine = (podStrength * podSize * podQuantity) / 7;
        totalNicotineUsage += podNicotine;
      }
    }
    
    // Update the display
    if (totalNicotineUsage > 0) {
      statusRectangle.innerHTML = `
        <span style="font-size: var(--font-size-large);"><span style="color: var(--color-blue);">${Math.round(totalNicotineUsage)}mg</span> <span style="color: var(--color-dark-gray);">/day</span></span>
      `;
      
      // Update percentage reduction if target usage section is visible
      const targetUsagePicker = document.querySelector('.target-usage-picker');
      if (targetUsagePicker && !targetUsagePicker.classList.contains('hidden')) {
        // Get current slider level
        const slider = document.getElementById('target-usage-slider');
        if (slider && !slider.classList.contains('hidden')) {
          const snapPoints = getSnapPoints();
          const currentLeft = parseInt(window.getComputedStyle(slider).left, 10);
          const snapResult = findClosestSnapPoint(currentLeft);
          updatePercentageReduction(snapResult.index);
        }
      }
    } else {
      statusRectangle.innerHTML = '';
    }
    
    // Update current spending display
    updateCurrentSpendingDisplay();
  }

  // Helper function to get effective current spending (custom or calculated)
  function getEffectiveCurrentSpending() {
    // Check global custom spending state first
    if (window.hasCustomSpendingEdit && window.customSpendingValue !== null) {
      return window.customSpendingValue;
    }
    
    // Fall back to local state if global state is not set
    if (hasCustomSpendingEdit && customSpendingValue !== null) {
      return customSpendingValue;
    }
    
    // Return null to indicate we should calculate the value
    return null;
  }

  // Function to calculate current spending
  function calculateCurrentSpending() {
    // First check if we have a custom spending value
    const customValue = getEffectiveCurrentSpending();
    if (customValue !== null) {
      return customValue;
    }
    
    // Get the active selection from the main question
    const cigarettesButton = document.querySelector('.capsule-button[data-type="cigarettes"]');
    const vapesButton = document.querySelector('.capsule-button[data-type="vapes"]');
    const bothButton = document.querySelector('.capsule-button[data-type="both"]');
    
    const isCigarettesActive = cigarettesButton && cigarettesButton.classList.contains('active');
    const isVapesActive = vapesButton && vapesButton.classList.contains('active');
    const isBothActive = bothButton && bothButton.classList.contains('active');
    
    let totalSpending = 0;
    let hasValidCost = false;
    let hasUndefinedCost = false; // Track if any undefined cost option is selected
    
    // Calculate cigarette spending
    if (isCigarettesActive || isBothActive) {
      const quantityInput = document.querySelector('.quantity-options-hstack .middle-capsule');
      if (quantityInput && quantityInput.value) {
        const cigarettesPerDay = parseFloat(quantityInput.value) || 0;
        
        // Check which cigarette options are selected
        const pouchVstack = document.querySelector('.pouch-vstack');
        const cartonVstack = document.querySelector('.carton-vstack');
        
        if (!pouchVstack || !cartonVstack) {
          console.log('Cigarette option elements not found');
          return null;
        }
        
        const pouchActive = pouchVstack.classList.contains('active');
        const cartonActive = cartonVstack.classList.contains('active');
        
        let cigaretteCost = 0;
        let cigaretteMultiplier = 7; // Default: multiply by 7 for daily to weekly
        
        if (pouchActive && cartonActive) {
          // Both pouch and carton selected
          cigaretteCost = POD_BRAND_SPECS.costs['cig-both'];
          hasValidCost = true;
        } else if (pouchActive) {
          // Only pouch selected
          cigaretteCost = POD_BRAND_SPECS.costs['pouch'];
          hasValidCost = true;
        } else if (cartonActive) {
          // Only carton selected
          cigaretteCost = POD_BRAND_SPECS.costs['carton'];
          hasValidCost = true;
        }
        
        if (hasValidCost) {
          // If "both" is selected, don't multiply by 7 (quantity is already weekly)
          if (isBothActive) {
            cigaretteMultiplier = 1;
          }
          
          totalSpending += cigaretteCost * cigarettesPerDay * cigaretteMultiplier;
        }
      }
    }
    
    // Calculate vape spending
    if (isVapesActive || isBothActive) {
      const refillableActive = document.querySelector('.refillable-vstack') && document.querySelector('.refillable-vstack').classList.contains('active');
      const podBasedActive = document.querySelector('.pod-based-vstack') && document.querySelector('.pod-based-vstack').classList.contains('active');
      
      // Check for undefined cost options
      if (refillableActive) {
        hasUndefinedCost = true; // Refillable has no defined cost
      }
      
      if (podBasedActive) {
        // Get pod quantity
        const podQuantityInput = document.querySelector('.pod-counter-capsule.middle-capsule');
        if (podQuantityInput && podQuantityInput.value) {
          const podQuantity = parseFloat(podQuantityInput.value) || 0;
          
          // Check which pod brand is selected
          const podDropdownCapsule = document.querySelector('.pod-dropdown-capsule');
          if (podDropdownCapsule && podDropdownCapsule.classList.contains('selected')) {
            const selectedBrand = selectedPodType;
            
            let podCost = 0;
            let vapeHasValidCost = false;
            
            if (selectedBrand === 'Juul') {
              podCost = POD_BRAND_SPECS.costs['juul'];
              vapeHasValidCost = true;
            } else if (selectedBrand === 'Vuse') {
              podCost = POD_BRAND_SPECS.costs['vuse'];
              vapeHasValidCost = true;
            } else if (selectedBrand === 'Lost Mary') {
              // Get second dropdown selection
              const secondSelection = podOtherCapsule.querySelector('.pod-other-text');
              const lostMarySelection = secondSelection ? secondSelection.textContent.trim() : '';
              if (lostMarySelection === 'BM600') {
                podCost = POD_BRAND_SPECS.costs['bm600'];
                vapeHasValidCost = true;
              } else if (lostMarySelection === 'BM6000') {
                hasUndefinedCost = true; // BM6000 has no defined cost
              }
              // Note: Other Lost Mary options don't have defined costs
            } else if (selectedBrand === 'Elf Bar') {
              // Get second dropdown selection
              const secondSelection = podOtherCapsule.querySelector('.pod-other-text');
              const elfBarSelection = secondSelection ? secondSelection.textContent.trim() : '';
              if (elfBarSelection === '600') {
                podCost = POD_BRAND_SPECS.costs['600'];
                vapeHasValidCost = true;
              } else if (elfBarSelection === 'AF5500') {
                hasUndefinedCost = true; // AF5500 has no defined cost
              }
              // Note: Other Elf Bar options don't have defined costs
            }
            
            if (vapeHasValidCost) {
              totalSpending += podCost * podQuantity;
              hasValidCost = true;
            }
          }
        }
      }
      
      // Note: Refillable vapes don't have defined costs in the register, so we skip them
    }
    
    // If any undefined cost option is selected, return null regardless of other valid costs
    if (hasUndefinedCost) {
      return null;
    }
    
    return hasValidCost ? totalSpending : null;
  }

  // Make calculateCurrentSpending globally accessible
  window.calculateCurrentSpending = calculateCurrentSpending;
  
  // Flag to track if user has made a custom spending edit
  let hasCustomSpendingEdit = false;
  let customSpendingValue = null;
  
  // Make custom spending state globally accessible to ensure consistency across all functions
  window.hasCustomSpendingEdit = hasCustomSpendingEdit;
  window.customSpendingValue = customSpendingValue;
  
  // Function to reset custom spending state (call when user changes selections)
  function resetCustomSpendingState() {
    hasCustomSpendingEdit = false;
    customSpendingValue = null;
    window.hasCustomSpendingEdit = false;
    window.customSpendingValue = null;
    console.log('Custom spending state reset');
  }
  
  // Make reset function globally accessible
  window.resetCustomSpendingState = resetCustomSpendingState;
  
  // Make updateCurrentSpendingDisplay function globally accessible
  window.updateCurrentSpendingDisplay = updateCurrentSpendingDisplay;

  // Function to update current spending display
  function updateCurrentSpendingDisplay() {
    const spendingDisplay = document.getElementById('current-spending-display');
    if (!spendingDisplay) return;
    
    // Only update if user hasn't made a custom edit (check both local and global state)
    if (hasCustomSpendingEdit || window.hasCustomSpendingEdit) {
      return;
    }
    
    const currentSpending = calculateCurrentSpending();
    
    if (currentSpending === 'n/a') {
      spendingDisplay.textContent = 'n/a';
    } else if (currentSpending !== null) {
      spendingDisplay.textContent = `£${currentSpending.toFixed(2)} /week`;
    } else {
      spendingDisplay.textContent = '£';
    }
    
    // Also update the spending toggle value directly
    const spendingToggleValueElement = document.getElementById('spending-toggle-value');
    if (spendingToggleValueElement) {
      if (currentSpending === 'n/a') {
        spendingToggleValueElement.textContent = 'n/a';
      } else if (currentSpending !== null) {
        spendingToggleValueElement.textContent = `£${currentSpending.toFixed(2)}`;
      } else {
        spendingToggleValueElement.textContent = '£';
      }
    }
    
  }
  
  // Global function to check if all visible questions in current nicotine usage section are completed
  function checkCurrentNicotineCompletion() {
    const currentNicotineTickBox = document.getElementById('current-nicotine-tick-box');
    if (!currentNicotineTickBox) return;
    
    // Get the active selection from the main question
    const cigarettesButton = document.querySelector('.capsule-button[data-type="cigarettes"]');
    const vapesButton = document.querySelector('.capsule-button[data-type="vapes"]');
    const bothButton = document.querySelector('.capsule-button[data-type="both"]');
    
    const isCigarettesActive = cigarettesButton && cigarettesButton.classList.contains('active');
    const isVapesActive = vapesButton && vapesButton.classList.contains('active');
    const isBothActive = bothButton && bothButton.classList.contains('active');
    
    let allCompleted = false;
    
    if (isCigarettesActive) {
      // For cigarettes: check if cigarette options and quantity are completed
      const pouchActive = document.querySelector('.pouch-vstack').classList.contains('active');
      const cartonActive = document.querySelector('.carton-vstack').classList.contains('active');
      const quantityCompleted = document.getElementById('quantity-tick-box').classList.contains('active');
      
      allCompleted = (pouchActive || cartonActive) && quantityCompleted;
      
    } else if (isVapesActive) {
      // For vapes: check if vape options and related sections are completed
      const refillableActive = document.querySelector('.refillable-vstack').classList.contains('active');
      const podBasedActive = document.querySelector('.pod-based-vstack').classList.contains('active');
      
      if (refillableActive) {
        // Only refillable is selected
        const bottleTypeCompleted = document.getElementById('bottle-type-tick-box').classList.contains('active');
        const bottleQuantityCompleted = document.getElementById('bottle-quantity-tick-box').classList.contains('active');
        allCompleted = bottleTypeCompleted && bottleQuantityCompleted;
      } else if (podBasedActive) {
        // Only pod-based is selected
        const podTypeCompleted = document.getElementById('pod-type-tick-box').classList.contains('active');
        const podQuantityCompleted = document.getElementById('pod-quantity-tick-box').classList.contains('active');
        allCompleted = podTypeCompleted && podQuantityCompleted;
      } else {
        allCompleted = false;
      }
      
    } else if (isBothActive) {
      // For both: check if all relevant sections are completed
      const pouchActive = document.querySelector('.pouch-vstack').classList.contains('active');
      const cartonActive = document.querySelector('.carton-vstack').classList.contains('active');
      const quantityCompleted = document.getElementById('quantity-tick-box').classList.contains('active');
      
      const refillableActive = document.querySelector('.refillable-vstack').classList.contains('active');
      const podBasedActive = document.querySelector('.pod-based-vstack').classList.contains('active');
      
      // Check cigarette completion
      const cigaretteCompleted = (pouchActive || cartonActive) && quantityCompleted;
      
      // Check vape completion - need to check BOTH if both are active
      let vapeCompleted = false;
      if (refillableActive) {
        // Only refillable is selected
        const bottleTypeCompleted = document.getElementById('bottle-type-tick-box').classList.contains('active');
        const bottleQuantityCompleted = document.getElementById('bottle-quantity-tick-box').classList.contains('active');
        vapeCompleted = bottleTypeCompleted && bottleQuantityCompleted;
      } else if (podBasedActive) {
        // Only pod-based is selected
        const podTypeCompleted = document.getElementById('pod-type-tick-box').classList.contains('active');
        const podQuantityCompleted = document.getElementById('pod-quantity-tick-box').classList.contains('active');
        vapeCompleted = podTypeCompleted && podQuantityCompleted;
      }
      
      allCompleted = cigaretteCompleted && vapeCompleted;
      
    } else {
      // No selection made yet
      allCompleted = false;
    }
    
    // Show/hide confirm button based on completion, but don't activate tickbox yet
    if (allCompleted) {
      showConfirmButton();
    } else {
      hideConfirmButton();
    }
  }
  
  // Function to show the confirm button
  function showConfirmButton() {
    const confirmButtonContainer = document.getElementById('confirm-button-container');
    if (confirmButtonContainer) {
      // Force a reflow to ensure the animation triggers
      confirmButtonContainer.offsetHeight;
      confirmButtonContainer.classList.remove('hidden');
    }
  }
  
  // Function to hide the confirm button
  function hideConfirmButton() {
    const confirmButtonContainer = document.getElementById('confirm-button-container');
    if (confirmButtonContainer) {
      confirmButtonContainer.classList.add('hidden');
    }
  }
  
  // Function to hide all current nicotine usage elements (except the header)
  // Function to hide only completed elements (those with active tickboxes)
  function hideCompletedCurrentNicotineElements() {
    // Check which elements have active tickboxes and hide only those
    const elementsToCheck = [
      { selector: '.question-hstack', tickboxId: 'current-nicotine-tick-box' },
      { selector: '.cigarette-options-hstack', tickboxId: 'cigarette-tick-box' },
      { selector: '.quantity-options-hstack', tickboxId: 'quantity-tick-box' },
      { selector: '.vape-options-hstack', tickboxId: 'vape-tick-box' },
      { selector: '.bottle-type-hstack', tickboxId: 'bottle-type-tick-box' },
      { selector: '.bottle-quantity-hstack', tickboxId: 'bottle-quantity-tick-box' },
      { selector: '.pod-type-hstack', tickboxId: 'pod-type-tick-box' },
      { selector: '.pod-quantity-hstack', tickboxId: 'pod-quantity-tick-box' }
    ];
    
    // Track which elements we're hiding so we can show them later
    window.hiddenCompletedElements = [];
    
    elementsToCheck.forEach(({ selector, tickboxId }) => {
      const element = document.querySelector(selector);
      const tickbox = document.getElementById(tickboxId);
      
      if (element && tickbox && tickbox.classList.contains('active')) {
        // This element has been completed, so hide it
        element.classList.add('hidden');
        element.classList.remove('visible'); // Also remove visible class
        window.hiddenCompletedElements.push(selector);
        console.log('Hiding element:', selector, 'tickbox active:', tickbox.classList.contains('active'));
      }
    });
  }
  
  // Function to show previously hidden completed elements
  function showCompletedCurrentNicotineElements() {
    if (window.hiddenCompletedElements) {
      window.hiddenCompletedElements.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
          element.classList.remove('hidden');
          element.classList.add('visible');
        }
      });
      // Clear the tracking array
      window.hiddenCompletedElements = [];
    }
    
    // Ensure has-selection class is maintained if any option is selected
    const cigarettesButton = document.querySelector('.capsule-button[data-type="cigarettes"]');
    const vapesButton = document.querySelector('.capsule-button[data-type="vapes"]');
    const bothButton = document.querySelector('.capsule-button[data-type="both"]');
    
    const isAnyOptionSelected = (cigarettesButton && cigarettesButton.classList.contains('active')) ||
                               (vapesButton && vapesButton.classList.contains('active')) ||
                               (bothButton && bothButton.classList.contains('active'));
    
    const targetUsageSection = document.querySelector('.target-usage-section');
    if (targetUsageSection) {
      if (isAnyOptionSelected) {
        targetUsageSection.classList.add('has-selection');
      } else {
        targetUsageSection.classList.remove('has-selection');
      }
    }
  }
  
  // Function to show Target Usage elements
  function showTargetUsageElements() {
    const targetUsageSubtitle = document.querySelector('.target-usage-subtitle');
    const targetUsageRecommendation = document.querySelector('.target-usage-recommendation');
    const targetUsagePicker = document.querySelector('.target-usage-picker');
    const slider = document.getElementById('target-usage-slider');
    
    if (targetUsageSubtitle) {
      targetUsageSubtitle.classList.remove('hidden');
    }
    if (targetUsageRecommendation) {
      targetUsageRecommendation.classList.remove('hidden');
    }
    if (targetUsagePicker) {
      targetUsagePicker.classList.remove('hidden');
    }
    
    // Check if a level was previously selected (slider is visible)
    // If so, restore the level-selected class for proper bottom margin
    if (slider && !slider.classList.contains('hidden') && targetUsagePicker) {
      targetUsagePicker.classList.add('level-selected');
    }
    
    // Initialize percentage calculation for default Level 1 (index 0)
    updatePercentageReduction(0);
  }
  
  // Function to hide Target Usage elements
  function hideTargetUsageElements() {
    const targetUsageSubtitle = document.querySelector('.target-usage-subtitle');
    const targetUsageRecommendation = document.querySelector('.target-usage-recommendation');
    const targetUsagePicker = document.querySelector('.target-usage-picker');
    const mobilePercentageHstack = document.querySelector('.mobile-percentage-hstack');
    
    if (targetUsageSubtitle) {
      targetUsageSubtitle.classList.add('hidden');
    }
    if (targetUsageRecommendation) {
      targetUsageRecommendation.classList.add('hidden');
    }
    if (targetUsagePicker) {
      targetUsagePicker.classList.add('hidden');
    }
    if (mobilePercentageHstack) {
      mobilePercentageHstack.classList.add('hidden');
    }
    
    // Remove level-selected class to reset bottom margin to 32px
    if (targetUsagePicker) {
      targetUsagePicker.classList.remove('level-selected');
    }
  }
  
  // Function to show all current nicotine usage elements
  function showCurrentNicotineElements() {
    // Hide the confirm button first
    hideConfirmButton();
    
    // Hide the tickbox when showing elements (user is editing)
    const currentNicotineTickBox = document.getElementById('current-nicotine-tick-box');
    if (currentNicotineTickBox) {
      currentNicotineTickBox.classList.remove('active');
    }
    
    // Show the main question
    const questionHstack = document.querySelector('.question-hstack');
    if (questionHstack) {
      questionHstack.classList.remove('hidden');
    }
    
    // Re-apply the visibility logic to ensure only the correct elements are shown
    updateQuestionVisibility();
    
    // Also update vape tickbox state to handle bottle/pod element visibility
    updateVapeTickBoxState();
  }
  
  // Function to initialize the current nicotine usage tickbox tracking
  function initializeCurrentNicotineTickbox() {
    const currentNicotineTickBox = document.getElementById('current-nicotine-tick-box');
    
    // Add click handler to the tickbox to toggle visibility
    if (currentNicotineTickBox) {
      currentNicotineTickBox.addEventListener('click', function() {
        if (this.classList.contains('active')) {
          // If active, hide the elements
          hideCurrentNicotineElements();
        } else {
          // If not active, show the elements
          showCurrentNicotineElements();
        }
      });
    }
    
    // Add click handler to the confirm button
    const confirmButton = document.getElementById('confirm-button');
    if (confirmButton) {
      confirmButton.addEventListener('click', function() {
        // Show and activate the tickbox
        const currentNicotineTickBox = document.getElementById('current-nicotine-tick-box');
        if (currentNicotineTickBox) {
          currentNicotineTickBox.classList.add('active');
        }
        
        // Update plan duration weeks calculation
        updatePlanDurationWeeks();
        
        // Show the rectangle and edit button
        const statusContainer = document.getElementById('current-nicotine-status-container');
        if (statusContainer) {
          // Force a reflow to ensure the animation triggers
          statusContainer.offsetHeight;
          statusContainer.classList.remove('hidden');
        }
        
        // Hide only completed current nicotine usage elements when confirm is clicked
        hideCompletedCurrentNicotineElements();
        // Hide the confirm button itself
        hideConfirmButton();
        
        // Show Target Usage elements only if target usage is not already completed
        const targetUsageTickBox = document.getElementById('target-usage-tick-box');
        if (!targetUsageTickBox || !targetUsageTickBox.classList.contains('active')) {
        showTargetUsageElements();
        }
        
        // Add confirmed class to plan section to reset gap
        const planSection = document.querySelector('.plan-section');
        if (planSection) {
          planSection.classList.add('confirmed');
        }
        
        // Auto-scroll to the Target Usage section after a delay to allow animations to complete
        setTimeout(scrollToTargetUsageSection, 500);
      });
    }
    
    // Add click handler to the edit button
    const editButton = document.getElementById('edit-button');
    if (editButton) {
      editButton.addEventListener('click', function() {
        // Hide the rectangle and edit button
        const statusContainer = document.getElementById('current-nicotine-status-container');
        if (statusContainer) {
          statusContainer.classList.add('hidden');
        }
        
        // Hide the tickbox when showing elements (user is editing)
        const currentNicotineTickBox = document.getElementById('current-nicotine-tick-box');
        if (currentNicotineTickBox) {
          currentNicotineTickBox.classList.remove('active');
        }
        
        // Show the previously hidden completed elements
        showCompletedCurrentNicotineElements();
        
        // Hide Target Usage elements when editing, but only if target usage is not already being edited
        const targetUsagePicker = document.querySelector('.target-usage-picker');
        if (!targetUsagePicker || targetUsagePicker.classList.contains('hidden')) {
        hideTargetUsageElements();
        }
        
        // Remove confirmed class from plan section to restore gap
        const planSection = document.querySelector('.plan-section');
        if (planSection) {
          planSection.classList.remove('confirmed');
        }
        
        // Re-evaluate completion status to show the confirm button
        // Since all tickboxes are still active, this should make the confirm button visible
        checkCurrentNicotineCompletion();
      });
    }
    
    // Add event listeners to all relevant elements that could affect completion
    // Main question buttons
    const capsuleButtons = document.querySelectorAll('.capsule-button');
    capsuleButtons.forEach(button => {
      button.addEventListener('click', function() {
        checkCurrentNicotineCompletion();
        calculateAndDisplayNicotineUsage();
      });
    });
    
    // Cigarette options
    const pouchVstack = document.querySelector('.pouch-vstack');
    const cartonVstack = document.querySelector('.carton-vstack');
    if (pouchVstack) pouchVstack.addEventListener('click', checkCurrentNicotineCompletion);
    if (cartonVstack) cartonVstack.addEventListener('click', checkCurrentNicotineCompletion);
    
    // Cigarette quantity
    const quantityTickBox = document.getElementById('quantity-tick-box');
    if (quantityTickBox) {
      // Listen for changes to the quantity input
      const quantityInput = document.querySelector('.quantity-options-hstack .middle-capsule');
      if (quantityInput) {
        quantityInput.addEventListener('input', function() {
          checkCurrentNicotineCompletion();
          calculateAndDisplayNicotineUsage();
        });
      }
      const quantityMinus = document.querySelector('.quantity-options-hstack .minus-capsule');
      const quantityPlus = document.querySelector('.quantity-options-hstack .plus-capsule');
      if (quantityMinus) quantityMinus.addEventListener('click', function() {
        checkCurrentNicotineCompletion();
        calculateAndDisplayNicotineUsage();
      });
      if (quantityPlus) quantityPlus.addEventListener('click', function() {
        checkCurrentNicotineCompletion();
        calculateAndDisplayNicotineUsage();
      });
    }
    
    // Vape options
    const refillableVstack = document.querySelector('.refillable-vstack');
    const podBasedVstack = document.querySelector('.pod-based-vstack');
    if (refillableVstack) refillableVstack.addEventListener('click', function() {
      checkCurrentNicotineCompletion();
      calculateAndDisplayNicotineUsage();
    });
    if (podBasedVstack) podBasedVstack.addEventListener('click', function() {
      checkCurrentNicotineCompletion();
      calculateAndDisplayNicotineUsage();
    });
    
    // Bottle type inputs
    const strengthInput = document.querySelector('.strength-input');
    const sizeInput = document.querySelector('.size-input');
    if (strengthInput) strengthInput.addEventListener('input', function() {
      checkCurrentNicotineCompletion();
      calculateAndDisplayNicotineUsage();
    });
    if (sizeInput) sizeInput.addEventListener('input', function() {
      checkCurrentNicotineCompletion();
      calculateAndDisplayNicotineUsage();
    });
    
    // Bottle quantity
    const bottleQuantityTickBox = document.getElementById('bottle-quantity-tick-box');
    if (bottleQuantityTickBox) {
      const bottleQuantityInput = document.querySelector('.bottle-counter-hstack .middle-capsule');
      const bottleQuantityMinus = document.querySelector('.bottle-counter-hstack .minus-capsule');
      const bottleQuantityPlus = document.querySelector('.bottle-counter-hstack .plus-capsule');
      if (bottleQuantityInput) bottleQuantityInput.addEventListener('input', function() {
        checkCurrentNicotineCompletion();
        calculateAndDisplayNicotineUsage();
      });
      if (bottleQuantityMinus) bottleQuantityMinus.addEventListener('click', function() {
        checkCurrentNicotineCompletion();
        calculateAndDisplayNicotineUsage();
      });
      if (bottleQuantityPlus) bottleQuantityPlus.addEventListener('click', function() {
        checkCurrentNicotineCompletion();
        calculateAndDisplayNicotineUsage();
      });
    }
    
    // Pod type dropdown and inputs
    const podDropdownCapsule = document.getElementById('pod-dropdown-capsule');
    const podOtherCapsule = document.getElementById('pod-other-capsule');
    if (podDropdownCapsule) podDropdownCapsule.addEventListener('click', function() {
      checkCurrentNicotineCompletion();
      calculateAndDisplayNicotineUsage();
    });
    if (podOtherCapsule) podOtherCapsule.addEventListener('click', function() {
      checkCurrentNicotineCompletion();
      calculateAndDisplayNicotineUsage();
    });
    
    // Pod strength and size inputs
    const podStrengthInput = document.querySelector('.pod-strength-input');
    const podBottleSizeInput = document.querySelector('.pod-bottle-size-input');
    if (podStrengthInput) podStrengthInput.addEventListener('input', function() {
      checkCurrentNicotineCompletion();
      calculateAndDisplayNicotineUsage();
    });
    if (podBottleSizeInput) podBottleSizeInput.addEventListener('input', function() {
      checkCurrentNicotineCompletion();
      calculateAndDisplayNicotineUsage();
    });
    
    // Pod quantity
    const podQuantityTickBox = document.getElementById('pod-quantity-tick-box');
    if (podQuantityTickBox) {
      const podQuantityInput = document.querySelector('.pod-counter-hstack .middle-capsule');
      const podQuantityMinus = document.querySelector('.pod-counter-hstack .minus-capsule');
      const podQuantityPlus = document.querySelector('.pod-counter-hstack .plus-capsule');
      if (podQuantityInput) podQuantityInput.addEventListener('input', function() {
        checkCurrentNicotineCompletion();
        calculateAndDisplayNicotineUsage();
      });
      if (podQuantityMinus) podQuantityMinus.addEventListener('click', function() {
        checkCurrentNicotineCompletion();
        calculateAndDisplayNicotineUsage();
      });
      if (podQuantityPlus) podQuantityPlus.addEventListener('click', function() {
        checkCurrentNicotineCompletion();
        calculateAndDisplayNicotineUsage();
      });
    }
    
    // Listen for dropdown selections
    const podDropdownList = document.getElementById('pod-dropdown-list');
    const podSecondDropdownList = document.getElementById('pod-second-dropdown-list');
    if (podDropdownList) {
      podDropdownList.addEventListener('click', function(e) {
        if (e.target.classList.contains('pod-dropdown-item')) {
          setTimeout(function() {
            checkCurrentNicotineCompletion();
            calculateAndDisplayNicotineUsage();
          }, 100); // Small delay to ensure DOM is updated
        }
      });
    }
    if (podSecondDropdownList) {
      podSecondDropdownList.addEventListener('click', function(e) {
        if (e.target.classList.contains('pod-second-dropdown-item')) {
          setTimeout(function() {
            checkCurrentNicotineCompletion();
            calculateAndDisplayNicotineUsage();
          }, 100); // Small delay to ensure DOM is updated
        }
      });
    }
    
    // Initial check
    checkCurrentNicotineCompletion();
  }

  // Function to initialize the target usage confirm button and edit button
  function initializeTargetUsageConfirmButton() {
    // Add click handler to the target usage confirm button
    const targetUsageConfirmButton = document.getElementById('target-usage-confirm-button');
    if (targetUsageConfirmButton) {
      targetUsageConfirmButton.addEventListener('click', function() {
        // Show and activate the target usage tickbox
        const targetUsageTickBox = document.getElementById('target-usage-tick-box');
        if (targetUsageTickBox) {
          targetUsageTickBox.classList.add('active');
        }
        
        // Show the target usage status container (blue rectangle + edit button)
        const targetUsageStatusContainer = document.getElementById('target-usage-status-container');
        if (targetUsageStatusContainer) {
          // Force a reflow to ensure the animation triggers
          targetUsageStatusContainer.offsetHeight;
          targetUsageStatusContainer.classList.remove('hidden');
        }
        
        // Hide target usage content elements when confirm is clicked
        hideTargetUsageContentElements();
        
        // Hide the confirm button itself
        const targetUsageConfirmButtonContainer = document.getElementById('target-usage-confirm-button-container');
        if (targetUsageConfirmButtonContainer) {
          targetUsageConfirmButtonContainer.classList.add('hidden');
        }
        
        // Update the blue rectangle with the selected level value
        updateTargetUsageStatusRectangle();
      });
    }
    
    // Add click handler to the target usage edit button
    const targetUsageEditButton = document.getElementById('target-usage-edit-button');
    if (targetUsageEditButton) {
      targetUsageEditButton.addEventListener('click', function() {
        // Hide the target usage status container
        const targetUsageStatusContainer = document.getElementById('target-usage-status-container');
        if (targetUsageStatusContainer) {
          targetUsageStatusContainer.classList.add('hidden');
        }
        
        // Hide the tickbox when showing elements (user is editing)
        const targetUsageTickBox = document.getElementById('target-usage-tick-box');
        if (targetUsageTickBox) {
          targetUsageTickBox.classList.remove('active');
        }
        
        // Show the target usage content elements
        showTargetUsageContentElements();
        
        // Show the confirm button again
        const targetUsageConfirmButtonContainer = document.getElementById('target-usage-confirm-button-container');
        if (targetUsageConfirmButtonContainer) {
          targetUsageConfirmButtonContainer.classList.remove('hidden');
        }
      });
    }
  }

  // Function to hide target usage content elements (but keep header)
  function hideTargetUsageContentElements() {
    const targetUsageSubtitle = document.querySelector('.target-usage-subtitle');
    const targetUsageRecommendation = document.querySelector('.target-usage-recommendation');
    const targetUsagePicker = document.querySelector('.target-usage-picker');
    const mobilePercentageHstack = document.querySelector('.mobile-percentage-hstack');
    
    if (targetUsageSubtitle) {
      targetUsageSubtitle.classList.add('hidden');
    }
    if (targetUsageRecommendation) {
      targetUsageRecommendation.classList.add('hidden');
    }
    if (targetUsagePicker) {
      targetUsagePicker.classList.add('hidden');
    }
    if (mobilePercentageHstack) {
      mobilePercentageHstack.classList.add('hidden');
    }
  }

  // Function to show target usage content elements
  function showTargetUsageContentElements() {
    const targetUsageSubtitle = document.querySelector('.target-usage-subtitle');
    const targetUsageRecommendation = document.querySelector('.target-usage-recommendation');
    const targetUsagePicker = document.querySelector('.target-usage-picker');
    const slider = document.getElementById('target-usage-slider');
    
    if (targetUsageSubtitle) {
      targetUsageSubtitle.classList.remove('hidden');
    }
    if (targetUsageRecommendation) {
      targetUsageRecommendation.classList.remove('hidden');
    }
    if (targetUsagePicker) {
      targetUsagePicker.classList.remove('hidden');
    }
    
    // Check if a level was previously selected (slider is visible)
    // If so, restore the level-selected class for proper bottom margin
    if (slider && !slider.classList.contains('hidden') && targetUsagePicker) {
      targetUsagePicker.classList.add('level-selected');
    }
    
    // Show mobile percentage text if a level is selected
    const mobilePercentageHstack = document.querySelector('.mobile-percentage-hstack');
    if (slider && !slider.classList.contains('hidden') && mobilePercentageHstack) {
      mobilePercentageHstack.classList.remove('hidden');
    }
  }

  // Function to update the target usage status rectangle with selected level value
  function updateTargetUsageStatusRectangle() {
    const targetUsageStatusRectangle = document.querySelector('.target-usage-status-rectangle');
    if (!targetUsageStatusRectangle) return;
    
    // Get the current slider position to determine which level is selected
    const slider = document.getElementById('target-usage-slider');
    if (!slider || slider.classList.contains('hidden')) return;
    
    const snapPoints = getSnapPoints();
    const currentLeft = parseInt(window.getComputedStyle(slider).left, 10);
    const snapResult = findClosestSnapPoint(currentLeft);
    
    if (snapResult && snapResult.index >= 0) {
      const levelValues = ['18mg', '8mg', '3mg', '1mg'];
      const levelColors = [
        'var(--color-blue)',      // Level 1 (index 0)
        'var(--color-level-2)',   // Level 2 (index 1)
        'var(--color-level-3)',   // Level 3 (index 2)
        'var(--color-green)'      // Level 4 (index 3)
      ];
      
      const selectedValue = levelValues[snapResult.index];
      const selectedColor = levelColors[snapResult.index];
      
      // Create styled content with different colors for mg and /day (matching current usage format)
      targetUsageStatusRectangle.innerHTML = `
        <span style="font-size: var(--font-size-large);"><span style="color: ${selectedColor};">${selectedValue}</span> <span style="color: var(--color-dark-gray);">/day</span></span>
      `;
      targetUsageStatusRectangle.style.borderColor = 'var(--color-mid-gray)';
      
      // Update plan duration weeks calculation
      updatePlanDurationWeeks();
    }
  }

  // Function to calculate and update plan duration weeks
  function updatePlanDurationWeeks() {
    const planDurationWeeks = document.getElementById('plan-duration-weeks');
    if (!planDurationWeeks) return;
    
    // Get current nicotine usage from the status rectangle
    const statusRectangle = document.querySelector('.status-rectangle');
    if (!statusRectangle || !statusRectangle.textContent) {
      planDurationWeeks.textContent = 'X weeks';
      return;
    }
    
    // Get target nicotine usage from the target usage status rectangle
    const targetUsageStatusRectangle = document.querySelector('.target-usage-status-rectangle');
    if (!targetUsageStatusRectangle || !targetUsageStatusRectangle.textContent) {
      planDurationWeeks.textContent = 'X weeks';
      return;
    }
    
    // Extract current nicotine value (e.g., "45mg" -> 45)
    const currentNicotineText = statusRectangle.textContent;
    const currentNicotineMatch = currentNicotineText.match(/(\d+)mg/);
    if (!currentNicotineMatch) {
      planDurationWeeks.textContent = 'X weeks';
      return;
    }
    const currentNicotine = parseFloat(currentNicotineMatch[1]);
    
    // Extract target nicotine value (e.g., "18mg" -> 18)
    const targetNicotineText = targetUsageStatusRectangle.textContent;
    const targetNicotineMatch = targetNicotineText.match(/(\d+)mg/);
    if (!targetNicotineMatch) {
      planDurationWeeks.textContent = 'X weeks';
      return;
    }
    const targetNicotine = parseFloat(targetNicotineMatch[1]);
    
    // Calculate plan duration: current - target = weeks
    const planDuration = Math.max(1, currentNicotine - targetNicotine); // Minimum 1 week
    planDurationWeeks.textContent = planDuration + ' weeks';
    
    // Update the duration display capsule
    updatePlanDurationDisplay(planDuration);
  }

  // Function to update the plan duration display capsule
  function updatePlanDurationDisplay(recommendedWeeks) {
    const planDurationDisplay = document.getElementById('plan-duration-display');
    if (!planDurationDisplay) return;
    
    // Store the recommended weeks value for min/max calculations
    planDurationDisplay.dataset.recommendedWeeks = recommendedWeeks;
    
    // Set initial display value to recommended weeks
    planDurationDisplay.dataset.currentWeeks = recommendedWeeks;
    planDurationDisplay.textContent = recommendedWeeks + ' weeks';
    
    // Initialize the slider position
    initializePlanDurationSlider(recommendedWeeks);
  }

  // Function to initialize the plan duration slider
  function initializePlanDurationSlider(recommendedWeeks) {
    const sliderContainer = document.getElementById('plan-duration-slider-container');
    const sliderTrack = document.getElementById('plan-duration-slider-track');
    const sliderThumb = document.getElementById('plan-duration-slider-thumb');
    const displayCapsule = document.getElementById('plan-duration-display');
    
    if (!sliderContainer || !sliderTrack || !sliderThumb || !displayCapsule) return;
    
    // Calculate min and max values
    const minWeeks = Math.ceil(recommendedWeeks / 2);
    const maxWeeks = Math.floor(recommendedWeeks * 1.5);
    
    // Store values for later use
    sliderContainer.dataset.minWeeks = minWeeks;
    sliderContainer.dataset.maxWeeks = maxWeeks;
    sliderContainer.dataset.currentWeeks = recommendedWeeks;
    
    // Update min and max labels
    const minLabel = document.getElementById('plan-duration-slider-min-label');
    const maxLabel = document.getElementById('plan-duration-slider-max-label');
    if (minLabel) minLabel.textContent = minWeeks;
    if (maxLabel) maxLabel.textContent = maxWeeks;
    
    // Update date capsules based on recommended weeks
    updateDateCapsules(recommendedWeeks);
    
    // Calculate initial position (recommended weeks as default)
    const trackWidth = sliderTrack.offsetWidth;
    const thumbWidth = sliderThumb.offsetWidth;
    const borderWidth = 3; // 3px border width
    const availableWidth = trackWidth - thumbWidth;
    const positionPercentage = (recommendedWeeks - minWeeks) / (maxWeeks - minWeeks);
    const initialPosition = (positionPercentage * availableWidth) - borderWidth; // Offset by border width
    
    sliderThumb.style.left = initialPosition + 'px';
    
    // Add drag functionality
    let isDragging = false;
    let startX = 0;
    let startLeft = 0;
    
    sliderThumb.addEventListener('mousedown', function(e) {
      isDragging = true;
      startX = e.clientX;
      startLeft = parseInt(sliderThumb.style.left) || 0;
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const newLeft = startLeft + deltaX;
      const minLeft = -borderWidth; // Allow left border to align with track edge
      const maxLeft = trackWidth - thumbWidth - borderWidth; // Allow right border to align with track edge
      
      // Constrain movement within track bounds
      const constrainedLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
      sliderThumb.style.left = constrainedLeft + 'px';
      
      // Don't update values during dragging - just move the thumb smoothly
    });
    
    document.addEventListener('mouseup', function() {
      if (isDragging) {
        isDragging = false;
        
        // Calculate final position and snap to nearest week value
        const finalPosition = parseInt(sliderThumb.style.left) || -borderWidth;
        const adjustedPosition = finalPosition + borderWidth; // Add border offset back
        const positionPercentage = adjustedPosition / availableWidth;
        const currentWeeks = Math.round(minWeeks + (positionPercentage * (maxWeeks - minWeeks)));
        
        // Update display with final value
        displayCapsule.dataset.currentWeeks = currentWeeks;
        displayCapsule.textContent = currentWeeks + ' weeks';
        sliderContainer.dataset.currentWeeks = currentWeeks;
        
        // Update date capsules
        updateDateCapsules(currentWeeks);
        
        // Snap to exact position for the calculated value
        snapSliderToValue();
      }
    });
    
    // Add click-to-position functionality on track
    sliderTrack.addEventListener('click', function(e) {
      if (e.target === sliderThumb) return; // Don't interfere with thumb dragging
      
      const rect = sliderTrack.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const thumbWidth = sliderThumb.offsetWidth;
      const minLeft = -borderWidth; // Allow left border to align with track edge
      const maxLeft = trackWidth - thumbWidth - borderWidth; // Allow right border to align with track edge
      const newLeft = Math.max(minLeft, Math.min(clickX - (thumbWidth / 2), maxLeft));
      
      sliderThumb.style.left = newLeft + 'px';
      
      // Calculate and update value
      const adjustedPosition = newLeft + borderWidth; // Add border offset back
      const positionPercentage = adjustedPosition / availableWidth;
      const currentWeeks = Math.round(minWeeks + (positionPercentage * (maxWeeks - minWeeks)));
      
      displayCapsule.dataset.currentWeeks = currentWeeks;
      displayCapsule.textContent = currentWeeks + ' weeks';
      sliderContainer.dataset.currentWeeks = currentWeeks;
      
      // Update date capsules
      updateDateCapsules(currentWeeks);
    });
    
    // Function to snap slider to exact value
    function snapSliderToValue() {
      const currentWeeks = parseInt(sliderContainer.dataset.currentWeeks);
      const positionPercentage = (currentWeeks - minWeeks) / (maxWeeks - minWeeks);
      const exactPosition = (positionPercentage * availableWidth) - borderWidth; // Apply border offset
      
      // Add transition class for smooth snapping
      sliderThumb.classList.add('snapping');
      sliderThumb.style.left = exactPosition + 'px';
      
      // Remove transition class after animation completes
      setTimeout(() => {
        sliderThumb.classList.remove('snapping');
      }, 200);
    }
  }

  // Function to handle plan duration plus/minus buttons
  function initializePlanDurationControls() {
    const minusButton = document.getElementById('plan-duration-minus');
    const plusButton = document.getElementById('plan-duration-plus');
    const displayCapsule = document.getElementById('plan-duration-display');
    
    if (minusButton) {
      minusButton.addEventListener('click', function() {
        if (!displayCapsule || !displayCapsule.dataset.recommendedWeeks) return;
        
        const recommendedWeeks = parseInt(displayCapsule.dataset.recommendedWeeks);
        const currentWeeks = parseInt(displayCapsule.dataset.currentWeeks || recommendedWeeks);
        const minWeeks = Math.ceil(recommendedWeeks / 2);
        
        if (currentWeeks > minWeeks) {
          const newWeeks = currentWeeks - 1;
          displayCapsule.dataset.currentWeeks = newWeeks;
          displayCapsule.textContent = newWeeks + ' weeks';
          
          // Update slider position and date capsules
          updateSliderPosition(newWeeks, recommendedWeeks);
        }
      });
    }
    
    if (plusButton) {
      plusButton.addEventListener('click', function() {
        if (!displayCapsule || !displayCapsule.dataset.recommendedWeeks) return;
        
        const recommendedWeeks = parseInt(displayCapsule.dataset.recommendedWeeks);
        const currentWeeks = parseInt(displayCapsule.dataset.currentWeeks || recommendedWeeks);
        const maxWeeks = Math.floor(recommendedWeeks * 1.5);
        
        if (currentWeeks < maxWeeks) {
          const newWeeks = currentWeeks + 1;
          displayCapsule.dataset.currentWeeks = newWeeks;
          displayCapsule.textContent = newWeeks + ' weeks';
          
          // Update slider position and date capsules
          updateSliderPosition(newWeeks, recommendedWeeks);
        }
      });
    }
  }

  // Function to update slider position based on weeks value
  function updateSliderPosition(currentWeeks, recommendedWeeks) {
    const sliderContainer = document.getElementById('plan-duration-slider-container');
    const sliderThumb = document.getElementById('plan-duration-slider-thumb');
    const sliderTrack = document.getElementById('plan-duration-slider-track');
    
    if (!sliderContainer || !sliderThumb || !sliderTrack) return;
    
    const minWeeks = Math.ceil(recommendedWeeks / 2);
    const maxWeeks = Math.floor(recommendedWeeks * 1.5);
    const trackWidth = sliderTrack.offsetWidth;
    const thumbWidth = sliderThumb.offsetWidth;
    const borderWidth = 3; // 3px border width
    const availableWidth = trackWidth - thumbWidth;
    
    // Calculate position percentage
    const positionPercentage = (currentWeeks - minWeeks) / (maxWeeks - minWeeks);
    const newPosition = (positionPercentage * availableWidth) - borderWidth; // Apply border offset
    
    // Add smooth transition for button-triggered moves
    sliderThumb.classList.add('snapping');
    sliderThumb.style.left = newPosition + 'px';
    sliderContainer.dataset.currentWeeks = currentWeeks;
    
    // Update date capsules when weeks change
    updateDateCapsules(currentWeeks);
    
    // Remove transition class after animation completes
    setTimeout(() => {
      sliderThumb.classList.remove('snapping');
    }, 200);
  }

  // Function to update date capsules based on weeks
  function updateDateCapsules(weeks) {
    const dayCapsule = document.getElementById('plan-duration-day-capsule');
    const monthText = document.querySelector('.plan-duration-month-text');
    const yearText = document.querySelector('.plan-duration-year-text');
    
    if (!dayCapsule || !monthText || !yearText) return;
    
    // Calculate target date (today + weeks)
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + (weeks * 7)); // Add weeks as days
    
    // Format the date components
    const day = targetDate.getDate();
    const month = targetDate.getMonth(); // getMonth() returns 0-11
    const year = targetDate.getFullYear();
    
    // Format day with ordinal suffix (1st, 2nd, 3rd, etc.)
    const dayWithOrdinal = getOrdinalSuffix(day);
    
    // Format month as abbreviation (Jan, Feb, Mar, etc.)
    const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthAbbr = monthAbbreviations[month];
    
    // Update the capsules
    dayCapsule.textContent = dayWithOrdinal;
    monthText.textContent = monthAbbr;
    yearText.textContent = year;
    
    // Store the target date and month index for future reference
    dayCapsule.dataset.targetDate = targetDate.toISOString();
    dayCapsule.dataset.monthIndex = month;
    dayCapsule.dataset.day = day;
    monthText.dataset.monthIndex = month;
    yearText.dataset.targetDate = targetDate.toISOString();
    yearText.dataset.year = year;
  }

  // Function to add ordinal suffix to numbers (1st, 2nd, 3rd, 4th, etc.)
  function getOrdinalSuffix(num) {
    const j = num % 10;
    const k = num % 100;
    
    if (j === 1 && k !== 11) {
      return num + 'st';
    }
    if (j === 2 && k !== 12) {
      return num + 'nd';
    }
    if (j === 3 && k !== 13) {
      return num + 'rd';
    }
    return num + 'th';
  }

  // Function to get days in month (accounting for leap years)
  function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  // Function to check if year is leap year
  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  // Function to initialize editable date functionality
  function initializeEditableDates() {
    const dayCapsule = document.getElementById('plan-duration-day-capsule');
    const monthText = document.querySelector('.plan-duration-month-text');
    const yearText = document.querySelector('.plan-duration-year-text');
    const monthLeftArrow = document.querySelector('.plan-duration-month-arrow-left');
    const monthRightArrow = document.querySelector('.plan-duration-month-arrow-right');
    const yearLeftArrow = document.querySelector('.plan-duration-year-arrow-left');
    const yearRightArrow = document.querySelector('.plan-duration-year-arrow-right');

    // Day capsule input handling
    if (dayCapsule) {
      dayCapsule.addEventListener('focus', function() {
        // Clear the value when focusing for editing
        this.textContent = '';
      });

      dayCapsule.addEventListener('input', function() {
        const inputValue = this.textContent.replace(/\D/g, ''); // Remove non-digits
        const day = parseInt(inputValue);
        
        if (inputValue && !isNaN(day)) {
          const monthIndex = parseInt(monthText.dataset.monthIndex || 0);
          const year = parseInt(yearText.dataset.year || new Date().getFullYear());
          const maxDays = getDaysInMonth(monthIndex, year);
          
          // Constrain day to valid range
          const constrainedDay = Math.max(1, Math.min(day, maxDays));
          this.textContent = constrainedDay;
          this.dataset.day = constrainedDay;
        }
      });

      dayCapsule.addEventListener('blur', function() {
        // Add ordinal suffix when blurring
        const day = parseInt(this.dataset.day || this.textContent.replace(/\D/g, ''));
        if (day && !isNaN(day)) {
          this.textContent = getOrdinalSuffix(day);
          // Validate against min/max limits after setting the day
          validateDateAgainstLimits();
        } else {
          // Reset to current calculated value if empty
          const displayCapsule = document.getElementById('plan-duration-display');
          if (displayCapsule && displayCapsule.dataset.currentWeeks) {
            const weeks = parseInt(displayCapsule.dataset.currentWeeks);
            updateDateCapsules(weeks);
          }
        }
      });
    }

    // Month navigation arrows
    if (monthLeftArrow) {
      monthLeftArrow.addEventListener('click', function(e) {
        e.stopPropagation();
        navigateMonth(-1);
      });
    }

    if (monthRightArrow) {
      monthRightArrow.addEventListener('click', function(e) {
        e.stopPropagation();
        navigateMonth(1);
      });
    }

    // Year navigation arrows
    if (yearLeftArrow) {
      yearLeftArrow.addEventListener('click', function(e) {
        e.stopPropagation();
        navigateYear(-1);
      });
    }

    if (yearRightArrow) {
      yearRightArrow.addEventListener('click', function(e) {
        e.stopPropagation();
        navigateYear(1);
      });
    }
  }

  // Function to navigate months
  function navigateMonth(direction) {
    const monthText = document.querySelector('.plan-duration-month-text');
    const yearText = document.querySelector('.plan-duration-year-text');
    
    if (!monthText || !yearText) return;
    
    const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let currentMonthIndex = parseInt(monthText.dataset.monthIndex || 0);
    let currentYear = parseInt(yearText.dataset.year || new Date().getFullYear());
    
    // Calculate new month and year
    let newMonthIndex = currentMonthIndex + direction;
    let newYear = currentYear;
    
    if (newMonthIndex < 0) {
      newMonthIndex = 11; // December
      newYear = currentYear - 1;
    } else if (newMonthIndex > 11) {
      newMonthIndex = 0; // January
      newYear = currentYear + 1;
    }
    
    // Update month and year
    monthText.textContent = monthAbbreviations[newMonthIndex];
    monthText.dataset.monthIndex = newMonthIndex;
    yearText.textContent = newYear;
    yearText.dataset.year = newYear;
    
    // Validate day for new month/year and check against limits
    validateDayForCurrentDate();
  }

  // Function to navigate years
  function navigateYear(direction) {
    const yearText = document.querySelector('.plan-duration-year-text');
    
    if (!yearText) return;
    
    let currentYear = parseInt(yearText.dataset.year || new Date().getFullYear());
    let newYear = currentYear + direction;
    
    // Constrain year to reasonable range
    newYear = Math.max(2020, Math.min(newYear, 2030));
    
    // Update year
    yearText.textContent = newYear;
    yearText.dataset.year = newYear;
    
    // Validate day for new year and check against limits
    validateDayForCurrentDate();
  }

  // Function to validate day for current month/year
  function validateDayForCurrentDate() {
    const dayCapsule = document.getElementById('plan-duration-day-capsule');
    const monthText = document.querySelector('.plan-duration-month-text');
    const yearText = document.querySelector('.plan-duration-year-text');
    
    if (!dayCapsule || !monthText || !yearText) return;
    
    const currentDay = parseInt(dayCapsule.dataset.day || dayCapsule.textContent.replace(/\D/g, ''));
    const monthIndex = parseInt(monthText.dataset.monthIndex || 0);
    const year = parseInt(yearText.dataset.year || new Date().getFullYear());
    const maxDays = getDaysInMonth(monthIndex, year);
    
    if (currentDay > maxDays) {
      const constrainedDay = maxDays;
      dayCapsule.textContent = getOrdinalSuffix(constrainedDay);
      dayCapsule.dataset.day = constrainedDay;
    }
    
    // Validate against min/max date limits
    validateDateAgainstLimits();
  }

  // Function to validate date against min/max week limits
  function validateDateAgainstLimits() {
    const dayCapsule = document.getElementById('plan-duration-day-capsule');
    const monthText = document.querySelector('.plan-duration-month-text');
    const yearText = document.querySelector('.plan-duration-year-text');
    const displayCapsule = document.getElementById('plan-duration-display');
    
    if (!dayCapsule || !monthText || !yearText || !displayCapsule || !displayCapsule.dataset.recommendedWeeks) return;
    
    const recommendedWeeks = parseInt(displayCapsule.dataset.recommendedWeeks);
    const minWeeks = Math.ceil(recommendedWeeks / 2);
    const maxWeeks = Math.floor(recommendedWeeks * 1.5);
    
    // Calculate min and max dates
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + (minWeeks * 7));
    
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + (maxWeeks * 7));
    
    // Get current entered date
    const currentDay = parseInt(dayCapsule.dataset.day || dayCapsule.textContent.replace(/\D/g, ''));
    const monthIndex = parseInt(monthText.dataset.monthIndex || 0);
    const year = parseInt(yearText.dataset.year || new Date().getFullYear());
    
    const enteredDate = new Date(year, monthIndex, currentDay);
    
    // Check if date is before minimum
    if (enteredDate < minDate) {
      // Set to minimum date
      const minDay = minDate.getDate();
      const minMonth = minDate.getMonth();
      const minYear = minDate.getFullYear();
      
      const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      dayCapsule.textContent = getOrdinalSuffix(minDay);
      dayCapsule.dataset.day = minDay;
      monthText.textContent = monthAbbreviations[minMonth];
      monthText.dataset.monthIndex = minMonth;
      yearText.textContent = minYear;
      yearText.dataset.year = minYear;
      
      // Update weeks display and slider
      updateWeeksFromDate(minWeeks, recommendedWeeks);
      return;
    }
    
    // Check if date is after maximum
    if (enteredDate > maxDate) {
      // Set to maximum date
      const maxDay = maxDate.getDate();
      const maxMonth = maxDate.getMonth();
      const maxYear = maxDate.getFullYear();
      
      const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      dayCapsule.textContent = getOrdinalSuffix(maxDay);
      dayCapsule.dataset.day = maxDay;
      monthText.textContent = monthAbbreviations[maxMonth];
      monthText.dataset.monthIndex = maxMonth;
      yearText.textContent = maxYear;
      yearText.dataset.year = maxYear;
      
      // Update weeks display and slider
      updateWeeksFromDate(maxWeeks, recommendedWeeks);
      return;
    }
    
    // If date is within valid range, calculate weeks from date
    const weeksFromDate = calculateWeeksFromDate(enteredDate);
    updateWeeksFromDate(weeksFromDate, recommendedWeeks);
  }

  // Function to calculate weeks from a given date
  function calculateWeeksFromDate(targetDate) {
    const today = new Date();
    const timeDiff = targetDate.getTime() - today.getTime();
    const daysDiff = Math.round(timeDiff / (1000 * 3600 * 24));
    const weeksDiff = Math.round(daysDiff / 7);
    return Math.max(1, weeksDiff); // Ensure at least 1 week
  }

  // Function to update weeks display and slider from calculated weeks
  function updateWeeksFromDate(calculatedWeeks, recommendedWeeks) {
    const displayCapsule = document.getElementById('plan-duration-display');
    const sliderContainer = document.getElementById('plan-duration-slider-container');
    
    if (!displayCapsule || !sliderContainer) return;
    
    const minWeeks = Math.ceil(recommendedWeeks / 2);
    const maxWeeks = Math.floor(recommendedWeeks * 1.5);
    
    // Constrain calculated weeks to min/max range
    const constrainedWeeks = Math.max(minWeeks, Math.min(calculatedWeeks, maxWeeks));
    
    // Update display capsule
    displayCapsule.dataset.currentWeeks = constrainedWeeks;
    displayCapsule.textContent = constrainedWeeks + ' weeks';
    
    // Update slider position
    updateSliderPosition(constrainedWeeks, recommendedWeeks);
  }

  // Initialize the target usage confirm button
  initializeTargetUsageConfirmButton();
  
  // Initialize the plan duration controls
  initializePlanDurationControls();
  
  // Initialize the editable dates functionality
  initializeEditableDates();
  
  // Initialize the plan duration confirm button
  initializePlanDurationConfirmButton();
  
  // Initialize plan duration visibility
  initializePlanDurationVisibility();
  
  // Initialize your plan white rectangle functionality
  initializeYourPlanWhiteRectangle();
  
  // Initialize the math graph
  initializeMathGraph();
  
  
  // Test if the section is visible
  setTimeout(() => {
    const yourPlanSection = document.getElementById('your-plan-section');
    console.log('Your Plan section exists:', !!yourPlanSection);
    console.log('Your Plan section classes:', yourPlanSection ? yourPlanSection.className : 'not found');
    console.log('Your Plan section display style:', yourPlanSection ? window.getComputedStyle(yourPlanSection).display : 'not found');
  }, 1000);
});




// ======== MATH GRAPH FUNCTIONALITY ========

// Helper function to calculate pod strength (S) based on level
function getPodStrength(nicotinePerDay) {
  // Determine level based on nicotine per day value
  let level;
  if (nicotinePerDay === 18) level = 1;
  else if (nicotinePerDay === 8) level = 2;
  else if (nicotinePerDay === 3) level = 3;
  else if (nicotinePerDay === 1) level = 4;
  else level = 1; // default fallback
  
  // Return pod strength based on level
  switch (level) {
    case 1: return 18;
    case 2: return 12;
    case 3: return 6;
    case 4: return 3;
    default: return 18;
  }
}

// Helper function to get level (l) from target usage value
function getTargetLevel() {
  const targetUsage = getTargetUsage();
  if (targetUsage === null) return 1; // default
  
  // Determine level based on target usage value
  if (targetUsage === 18) return 1; // Level 1: 18mg/day
  if (targetUsage === 8) return 2;  // Level 2: 8mg/day
  if (targetUsage === 3) return 3;  // Level 3: 3mg/day
  if (targetUsage === 1) return 4;  // Level 4: 1mg/day
  
  return 1; // default fallback
}

// Calculate costing curve parameters
function calculateCostingParams(a, b, c) {
  const level = getTargetLevel();
  const Sa = getPodStrength(a); // Pod strength for target usage
  const Sb = getPodStrength(b); // Pod strength for current usage
  
  const m = 2; // ml of liquid in each pod
  const C_pod = 2.2; // sale price of a pod
  const D = 1 + 0.1 * level; // discount factor
  const V = 1.2; // VAT (20%)
  
  // Calculate a_c (cost in last week)
  const ac = ((7 * a) / (Sa * m)) * C_pod * D * V;
  
  // Calculate b_c (cost at week 0)
  const bc = ((7 * b) / (Sb * m)) * C_pod * V;
  
  // c_c is just the number of weeks (not days)
  const cc = c / 7;
  
  return { ac, bc, cc };
}

// Costing curve function C(x)
function C(x, ac, bc, cc) {
  if (x < 0 || x > cc) return 0;
  return (6 * (bc - ac) / Math.pow(cc, 3)) * (Math.pow(x, 3) / 3 - cc * Math.pow(x, 2) / 2) + bc;
}

// Update graph when switching between nicotine and costing modes
function updateGraphForMode() {
  if (graphConfig.a <= 0 || graphConfig.b <= 0 || graphConfig.c <= 0) return;
  
  if (graphConfig.isCostingMode) {
    // Switch to costing mode - use weeks instead of days
    const costingParams = calculateCostingParams(graphConfig.a, graphConfig.b, graphConfig.c);
    graphConfig.xUnits = costingParams.cc; // weeks
    graphConfig.yUnits = Math.max(costingParams.bc, costingParams.ac); // max cost
    
    // Update curve colors to green for costing mode
    if (graphElements.curve) {
      graphElements.curve.setAttribute('stroke', 'var(--color-green)');
    }
    if (graphElements.curveBackground) {
      // Hide the red background curve in costing mode
      graphElements.curveBackground.setAttribute('stroke', 'none');
    }
    
    // Update gradient fill to green
    const gradient = document.getElementById('curveGradient');
    if (gradient) {
      gradient.querySelector('stop[offset="0%"]').setAttribute('style', 'stop-color:var(--color-green);stop-opacity:0');
      gradient.querySelector('stop[offset="100%"]').setAttribute('style', 'stop-color:var(--color-green);stop-opacity:0.2');
    }
    
    // Show spending toggle in costing mode
    const spendingToggle = document.querySelector('.spending-toggle-hstack');
    if (spendingToggle) {
      spendingToggle.classList.add('visible');
    }
    
    // Restore spending line visibility state if it was previously visible
    if (window.spendingLineWasVisible && window.showSpending) {
      // Only store original y-scale if we're going to adjust it
      const currentSpending = window.calculateCurrentSpending();
      console.log('Mode switch - Current spending value:', currentSpending);
      console.log('Mode switch - Has custom spending edit:', window.hasCustomSpendingEdit);
      console.log('Mode switch - Custom spending value:', window.customSpendingValue);
      
      if (currentSpending && currentSpending !== 'n/a' && currentSpending > 0) {
        const costingParams = calculateCostingParams(graphConfig.a, graphConfig.b, graphConfig.c);
        const initialCost = costingParams.bc;
        
        if (currentSpending > initialCost && !window.originalCostingYUnits) {
          window.originalCostingYUnits = graphConfig.yUnits;
          console.log('Mode switch - Stored original yUnits:', window.originalCostingYUnits);
        }
      }
      // Use a small delay to ensure the mode switch is complete before animating
      setTimeout(() => {
        window.showSpending();
      }, 100);
    }
  } else {
    // Switch to nicotine mode - use days
    graphConfig.xUnits = graphConfig.c; // days
    graphConfig.yUnits = graphConfig.b; // current usage
    
    // Update curve colors to blue for nicotine mode
    if (graphElements.curve) {
      graphElements.curve.setAttribute('stroke', 'var(--color-blue)');
    }
    if (graphElements.curveBackground) {
      graphElements.curveBackground.setAttribute('stroke', 'var(--color-red)');
    }
    
    // Update gradient fill to blue
    const gradient = document.getElementById('curveGradient');
    if (gradient) {
      gradient.querySelector('stop[offset="0%"]').setAttribute('style', 'stop-color:var(--color-blue);stop-opacity:0');
      gradient.querySelector('stop[offset="100%"]').setAttribute('style', 'stop-color:var(--color-blue);stop-opacity:0.2');
    }
    
    // Hide spending toggle in nicotine mode
    const spendingToggle = document.querySelector('.spending-toggle-hstack');
    if (spendingToggle) {
      spendingToggle.classList.remove('visible');
    }
    
    // Hide red spending line when switching to nicotine mode
    const spendingLine = document.getElementById('spending-line');
    if (spendingLine) {
      spendingLine.style.display = 'none';
    }
    
    // Ensure arms and labels are visible when switching to nicotine mode
    if (graphElements.baselineArm && graphElements.targetArm && 
        graphElements.baselineLabel && graphElements.targetLabel && graphElements.targetLevelLabel) {
      graphElements.baselineArm.style.display = 'block';
      graphElements.targetArm.style.display = 'block';
      graphElements.baselineLabel.style.display = 'block';
      graphElements.targetLabel.style.display = 'block';
      graphElements.targetLevelLabel.style.display = 'block';
    }
    
    // Clear any stored original costing y-scale when switching to nicotine mode
    window.originalCostingYUnits = null;
    
    // Reset hover state to show full curve in nicotine mode
    graphConfig.currentHoverX = graphConfig.c; // Show full curve (c = plan duration in days)
    
  }
  
  // Also reset hover state when switching to costing mode to ensure full curve is shown
  if (graphConfig.isCostingMode) {
    const costingParams = calculateCostingParams(graphConfig.a, graphConfig.b, graphConfig.c);
    graphConfig.currentHoverX = costingParams.cc; // Show full curve (cc = plan duration in weeks)
  }
  
  // Update the graph scale and re-render
  setGraphScale(graphConfig.xUnits, graphConfig.yUnits);
  
  // Update graph metrics display
  if (window.updateGraphMetrics) {
    window.updateGraphMetrics();
  }
  
  // Check if this is the first time showing this mode
  const currentMode = graphConfig.isCostingMode ? 'costing' : 'nicotine';
  const isFirstTime = !graphConfig.modesShown[currentMode];
  
  if (isFirstTime) {
    // First time showing this mode - animate it
    graphConfig.modesShown[currentMode] = true;
    animateModeSwitch();
  } else {
    // Not first time - just render normally
    renderGraph();
  }
}

// Animate mode switch (first time only)
function animateModeSwitch() {
  const { xUnits, yUnits, a, b, c, samples } = graphConfig;

  if (a <= 0 || b <= 0 || c <= 0) return;

  // Build the full curve paths
  const backgroundPath = buildCurvePath(xUnits, yUnits, a, b, c, samples);
  const fillPath = buildFillPath(xUnits, yUnits, a, b, c, samples);

  // Set the paths
  graphElements.curveBackground.setAttribute('d', backgroundPath);
  graphElements.curve.setAttribute('d', backgroundPath);
  graphElements.curveFill.setAttribute('d', fillPath);

  // Update arms and labels
  updateArmsAndLabels(xUnits, yUnits, a, b, c);

  // Hide gradient fill completely
  graphElements.curveFill.style.opacity = '0';

  // Add CSS for trim path animation and gradient fade
  const style = document.createElement('style');
  style.textContent = `
    @keyframes drawCurveMode {
      from { stroke-dashoffset: 1000; }
      to { stroke-dashoffset: 0; }
    }

    @keyframes fadeInGradientMode {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .curve-animating-mode {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: drawCurveMode 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    .gradient-fade-in-mode {
      opacity: 0;
      animation: fadeInGradientMode 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
  `;
  document.head.appendChild(style);

  // Set animation flag to disable hover during animation
  graphConfig.isAnimating = true;

  // Apply animation classes to curves and gradient
  graphElements.curveBackground.classList.add('curve-animating-mode');
  graphElements.curve.classList.add('curve-animating-mode');
  graphElements.curveFill.classList.add('gradient-fade-in-mode');

  // Clean up after everything is done
  setTimeout(() => {
    graphElements.curveBackground.classList.remove('curve-animating-mode');
    graphElements.curve.classList.remove('curve-animating-mode');
    graphElements.curveFill.classList.remove('gradient-fade-in-mode');

    // Ensure gradient fill stays visible after animation
    graphElements.curveFill.style.opacity = '1';

    // Re-enable hover functionality after animation completes
    graphConfig.isAnimating = false;

    // Fade in arms and labels after mode switch animation completes
    fadeInArmsAndLabels();

    if (style.parentNode) {
      style.parentNode.removeChild(style);
    }
  }, 1200); // 1.2s animation duration
}

// Update graph visuals only (no animation) - used during initial load
function updateGraphVisualsOnly() {
  if (graphConfig.a <= 0 || graphConfig.b <= 0 || graphConfig.c <= 0) return;
  
  if (graphConfig.isCostingMode) {
    // Switch to costing mode - use weeks instead of days
    const costingParams = calculateCostingParams(graphConfig.a, graphConfig.b, graphConfig.c);
    graphConfig.xUnits = costingParams.cc; // weeks
    graphConfig.yUnits = Math.max(costingParams.bc, costingParams.ac); // max cost
    
    // Update curve colors to green for costing mode
    if (graphElements.curve) {
      graphElements.curve.setAttribute('stroke', 'var(--color-green)');
    }
    if (graphElements.curveBackground) {
      // Hide the red background curve in costing mode
      graphElements.curveBackground.setAttribute('stroke', 'none');
    }
    
    // Update gradient fill to green
    const gradient = document.getElementById('curveGradient');
    if (gradient) {
      gradient.querySelector('stop[offset="0%"]').setAttribute('style', 'stop-color:var(--color-green);stop-opacity:0');
      gradient.querySelector('stop[offset="100%"]').setAttribute('style', 'stop-color:var(--color-green);stop-opacity:0.2');
    }
  } else {
    // Switch to nicotine mode - use days
    graphConfig.xUnits = graphConfig.c; // days
    graphConfig.yUnits = graphConfig.b; // current usage
    
    // Update curve colors to blue for nicotine mode
    if (graphElements.curve) {
      graphElements.curve.setAttribute('stroke', 'var(--color-blue)');
    }
    if (graphElements.curveBackground) {
      graphElements.curveBackground.setAttribute('stroke', 'var(--color-red)');
    }
    
    // Update gradient fill to blue
    const gradient = document.getElementById('curveGradient');
    if (gradient) {
      gradient.querySelector('stop[offset="0%"]').setAttribute('style', 'stop-color:var(--color-blue);stop-opacity:0');
      gradient.querySelector('stop[offset="100%"]').setAttribute('style', 'stop-color:var(--color-blue);stop-opacity:0.2');
    }
  }
  
  // Update the graph scale but don't re-render during initial animation
  // The initial animation will handle the rendering
  setGraphScale(graphConfig.xUnits, graphConfig.yUnits);
  
  // Only render if we're not currently animating (to avoid interfering with the initial animation)
  if (!graphConfig.isAnimating) {
    renderGraph();
  }
}

// Update graph mode settings only (no rendering/animation) - used before initial animation
function updateGraphModeSettings() {
  if (graphConfig.a <= 0 || graphConfig.b <= 0 || graphConfig.c <= 0) return;
  
  if (graphConfig.isCostingMode) {
    // Switch to costing mode - use weeks instead of days
    const costingParams = calculateCostingParams(graphConfig.a, graphConfig.b, graphConfig.c);
    graphConfig.xUnits = costingParams.cc; // weeks
    graphConfig.yUnits = Math.max(costingParams.bc, costingParams.ac); // max cost
    
    // Update curve colors to green for costing mode
    if (graphElements.curve) {
      graphElements.curve.setAttribute('stroke', 'var(--color-green)');
    }
    if (graphElements.curveBackground) {
      // Hide the red background curve in costing mode
      graphElements.curveBackground.setAttribute('stroke', 'none');
    }
    
    // Update gradient fill to green
    const gradient = document.getElementById('curveGradient');
    if (gradient) {
      gradient.querySelector('stop[offset="0%"]').setAttribute('style', 'stop-color:var(--color-green);stop-opacity:0');
      gradient.querySelector('stop[offset="100%"]').setAttribute('style', 'stop-color:var(--color-green);stop-opacity:0.2');
    }
    
    // Show spending toggle in costing mode
    const spendingToggle = document.querySelector('.spending-toggle-hstack');
    if (spendingToggle) {
      spendingToggle.classList.add('visible');
    }
  } else {
    // Switch to nicotine mode - use days
    graphConfig.xUnits = graphConfig.c; // days
    graphConfig.yUnits = graphConfig.b; // current usage
    
    // Update curve colors to blue for nicotine mode
    if (graphElements.curve) {
      graphElements.curve.setAttribute('stroke', 'var(--color-blue)');
    }
    if (graphElements.curveBackground) {
      graphElements.curveBackground.setAttribute('stroke', 'var(--color-red)');
    }
    
    // Update gradient fill to blue
    const gradient = document.getElementById('curveGradient');
    if (gradient) {
      gradient.querySelector('stop[offset="0%"]').setAttribute('style', 'stop-color:var(--color-blue);stop-opacity:0');
      gradient.querySelector('stop[offset="100%"]').setAttribute('style', 'stop-color:var(--color-blue);stop-opacity:0.2');
    }
  }
  
  // Hide spending toggle in nicotine mode
  if (!graphConfig.isCostingMode) {
    const spendingToggle = document.querySelector('.spending-toggle-hstack');
    if (spendingToggle) {
      spendingToggle.classList.remove('visible');
    }
  }
  
  // Update the graph scale but don't render - let the animation handle rendering
  setGraphScale(graphConfig.xUnits, graphConfig.yUnits);
}

// Configuration for the math graph
let graphConfig = {
  xUnits: 200,
  yUnits: 20,
  a: 0, // target usage (will be set from form data)
  b: 0, // current usage (will be set from form data)
  c: 0, // plan duration * 7 (will be set from form data)
  samples: 1000,
  currentHoverX: 0, // Current x position of hover (for progressive curve)
  isCostingMode: false, // Track if we're in costing mode
  isAnimating: false, // Track if animation is in progress
  modesShown: { // Track which modes have been shown for the first time
    nicotine: false,
    costing: false
  }
};

// DOM references for the graph
let graphElements = {
  svg: null,
  mathSpace: null,
  curve: null,
  curveFill: null,
  curveBackground: null,
  hoverCircle: null,
  tooltip: null,
  tooltipDay: null,
  tooltipAllowance: null,
  baselineArm: null,
  targetArm: null,
  baselineLabel: null,
  targetLevelLabel: null,
  targetLabel: null
};

// Initialize the math graph
function initializeMathGraph() {
  // Get DOM elements
  graphElements.svg = document.getElementById('graph');
  graphElements.mathSpace = document.getElementById('math-space');
  graphElements.curve = document.getElementById('curve');
  graphElements.curveFill = document.getElementById('curve-fill');
  graphElements.curveBackground = document.getElementById('curve-background');
  graphElements.hoverCircle = document.getElementById('hover-circle');
  graphElements.tooltip = document.getElementById('curve-tooltip');
  graphElements.tooltipDay = document.getElementById('tooltip-day');
  graphElements.tooltipAllowance = document.getElementById('tooltip-allowance');
  graphElements.baselineArm = document.getElementById('baseline-arm');
  graphElements.targetArm = document.getElementById('target-arm');
  graphElements.baselineLabel = document.getElementById('baseline-label');
  graphElements.targetLevelLabel = document.getElementById('target-level-label');
  graphElements.targetLabel = document.getElementById('target-label');
  
  if (!graphElements.svg || !graphElements.mathSpace || !graphElements.curve || !graphElements.curveFill || 
      !graphElements.curveBackground || !graphElements.hoverCircle || !graphElements.tooltip || 
      !graphElements.tooltipDay || !graphElements.tooltipAllowance || !graphElements.baselineArm || 
      !graphElements.targetArm || !graphElements.baselineLabel || !graphElements.targetLevelLabel || 
      !graphElements.targetLabel) {
    console.log('Math graph elements not found');
    return;
  }
  
  console.log('Math graph initialized');
  
  // Set initial scale - Y-axis will be updated when we have real data
  setGraphScale(graphConfig.xUnits, graphConfig.yUnits);
  
  // Add hover event listeners
  setupCurveHover();
  
  // Don't draw initial curve - wait for real data from form sections
}

// Math formula: N(x) = (6(b-a) / c^3) * (x^3/3 - c x^2/2) + b
function N(x, a, b, c) {
  if (c === 0) return b;
  
  const c3 = Math.pow(c, 3);
  const factor = 6 * (b - a) / c3;
  return factor * ((Math.pow(x, 3) / 3) - (c * Math.pow(x, 2) / 2)) + b;
}

// Build baseline arm path (from start point) - correct positioning with non-scaling
function buildBaselineArm(xUnits, yUnits, a, b, c) {
  const startX = 0;
  const startY = b; // Current usage at x=0
  const armUpY = startY + (52 / yUnits) * yUnits; // 52px up in graph units
  const armRightX = startX + (24 / xUnits) * xUnits; // 24px right in graph units
  
  return `M ${startX} ${startY} L ${startX} ${armUpY} L ${armRightX} ${armUpY}`;
}

// Build target arm path (from end point) - correct positioning with non-scaling
function buildTargetArm(xUnits, yUnits, a, b, c) {
  const endX = c;
  const endY = a; // Target usage at x=c
  const armUpY = endY + (52 / yUnits) * yUnits; // 52px up in graph units
  const armLeftX = endX - (24 / xUnits) * xUnits; // 24px left in graph units
  
  return `M ${endX} ${endY} L ${endX} ${armUpY} L ${armLeftX} ${armUpY}`;
}

// Get target level based on target usage
function getTargetLevelFromUsage(targetUsage) {
  if (targetUsage >= 18) return 1;
  if (targetUsage >= 8) return 2;
  if (targetUsage >= 3) return 3;
  return 4;
}

// Update arms and labels for nicotine mode (CSS-based, not affected by SVG scaling)
function updateArmsAndLabels(xUnits, yUnits, a, b, c) {
  if (!graphElements.baselineArm || !graphElements.targetArm || 
      !graphElements.baselineLabel || !graphElements.targetLabel || !graphElements.targetLevelLabel) {
    return;
  }
  
  // Show arms and labels for both modes, but hide them if spending line is visible in costing mode
  if (graphConfig.isCostingMode && window.spendingLineWasVisible) {
    // Hide arms and labels when spending line is visible in costing mode
    graphElements.baselineArm.style.display = 'none';
    graphElements.targetArm.style.display = 'none';
    graphElements.baselineLabel.style.display = 'none';
    graphElements.targetLabel.style.display = 'none';
    graphElements.targetLevelLabel.style.display = 'none';
  } else {
    // Show arms and labels normally
    graphElements.baselineArm.style.display = 'block';
    graphElements.targetArm.style.display = 'block';
    graphElements.baselineLabel.style.display = 'block';
    graphElements.targetLabel.style.display = 'block';
    graphElements.targetLevelLabel.style.display = 'block';
  }
  
  // Arms and labels start hidden (opacity: 0 from CSS) and will fade in after trim path animation
  
  // Get the plot rectangle for positioning
  const plotRect = document.querySelector('.plot-rect');
  if (!plotRect) return;
  
  // No need to clean up horizontal arms since we're using single curved paths now
  
  const rectWidth = plotRect.offsetWidth;
  const rectHeight = plotRect.offsetHeight;
  
  let baselineStartX, baselineStartY, baselineEndX, baselineEndY;
  let targetStartX, targetStartY, targetEndX, targetEndY;
  let baselineValue, targetValue, levelValue;
  
  if (graphConfig.isCostingMode) {
    // Costing mode - use cost curve endpoints
    const costingParams = calculateCostingParams(a, b, c);
    const { ac, bc, cc } = costingParams;
    
    // Calculate cost at Week 1 (initial cost)
    const initialCost = C(1, ac, bc, cc);
    
    // Baseline arm: from (0, initialCost) to (0, initialCost+40px) to (24px, initialCost+40px) - moved up 12px, height 40px
    baselineStartX = 1; // Start 1px from left edge to ensure visibility
    baselineStartY = rectHeight - (initialCost / yUnits) * rectHeight - 12; // Convert to screen coordinates, move up 12px
    baselineEndX = 24; // 24px from left
    baselineEndY = baselineStartY - 40; // 40px up
    
    // Target arm: from (cc, ac) to (cc, ac+60px) to (cc-24px, ac+60px) - moved up 12px, height 60px
    targetStartX = (cc / xUnits) * rectWidth - 1; // Convert to screen coordinates, move 1px left to ensure visibility
    targetStartY = rectHeight - (ac / yUnits) * rectHeight - 12; // Convert to screen coordinates, move up 12px
    targetEndX = targetStartX - 24; // 24px left
    targetEndY = targetStartY - 60; // 60px up
    
    baselineValue = initialCost; // Use Week 1 cost instead of Week 0
    targetValue = ac;
    levelValue = getTargetLevelFromUsage(a); // Level is still based on nicotine target
  } else {
    // Nicotine mode - use nicotine curve endpoints
    // Baseline arm: from (0, b) to (0, b+40px) to (24px, b+40px) - moved up 12px, height 40px
    baselineStartX = 1; // Start 1px from left edge to ensure visibility
    baselineStartY = rectHeight - (b / yUnits) * rectHeight - 12; // Convert to screen coordinates, move up 12px
    baselineEndX = 24; // 24px from left
    baselineEndY = baselineStartY - 40; // 40px up
    
    // Target arm: from (c, a) to (c, a+60px) to (c-24px, a+60px) - moved up 12px, height 60px
    targetStartX = (c / xUnits) * rectWidth - 1; // Convert to screen coordinates, move 1px left to ensure visibility
    targetStartY = rectHeight - (a / yUnits) * rectHeight - 12; // Convert to screen coordinates, move up 12px
    targetEndX = targetStartX - 24; // 24px left
    targetEndY = targetStartY - 60; // 60px up
    
    baselineValue = b;
    targetValue = a;
    levelValue = getTargetLevelFromUsage(a);
  }
  
  // Create curved baseline arm path (up 40px, then right 24px with 12px radius curve)
  const baselineArmPath = `M ${baselineStartX} ${baselineStartY} L ${baselineStartX} ${baselineEndY + 12} Q ${baselineStartX} ${baselineEndY} ${baselineStartX + 12} ${baselineEndY} L ${baselineEndX} ${baselineEndY}`;
  const baselinePathElement = graphElements.baselineArm.querySelector('path');
  baselinePathElement.setAttribute('d', baselineArmPath);
  // Don't override display setting - it's already set correctly above based on spending line visibility
  
  // Create curved target arm path (up 60px, then left 24px with 12px radius curve)
  const targetArmPath = `M ${targetStartX} ${targetStartY} L ${targetStartX} ${targetEndY + 12} Q ${targetStartX} ${targetEndY} ${targetStartX - 12} ${targetEndY} L ${targetEndX} ${targetEndY}`;
  const targetPathElement = graphElements.targetArm.querySelector('path');
  targetPathElement.setAttribute('d', targetArmPath);
  // Don't override display setting - it's already set correctly above based on spending line visibility
  
  // Update labels with proper color formatting based on mode
  if (graphConfig.isCostingMode) {
    // Costing mode labels
    graphElements.baselineLabel.innerHTML = `<span style="color: var(--color-mid-gray);">Initial:</span> <span style="color: var(--color-dark-gray);">£${baselineValue.toFixed(2)}</span>`;
    graphElements.targetLabel.innerHTML = `<span style="color: var(--color-mid-gray);">Final:</span> <span style="color: var(--color-dark-gray);">£${targetValue.toFixed(2)}</span>`;
  } else {
    // Nicotine mode labels
    graphElements.baselineLabel.innerHTML = `<span style="color: var(--color-mid-gray);">Baseline:</span> <span style="color: var(--color-dark-gray);">${baselineValue}mg /day</span>`;
    graphElements.targetLabel.innerHTML = `<span style="color: var(--color-mid-gray);">Target:</span> <span style="color: var(--color-dark-gray);">${targetValue}mg /day</span>`;
  }
  
  // Update level label with dynamic color (same for both modes)
  let levelColor;
  switch(levelValue) {
    case 1: levelColor = 'var(--color-blue)'; break;
    case 2: levelColor = 'var(--color-level-2)'; break;
    case 3: levelColor = 'var(--color-level-3)'; break;
    case 4: levelColor = 'var(--color-green)'; break;
    default: levelColor = 'var(--color-dark-gray)'; break;
  }
  graphElements.targetLevelLabel.innerHTML = `<span style="color: ${levelColor};">Level ${levelValue}</span>`;
  
  // Position labels at the end of horizontal arms
  graphElements.baselineLabel.style.left = `${baselineEndX + 8}px`; // 4px after end of horizontal arm
  graphElements.baselineLabel.style.top = `${baselineEndY - 12}px`; // 12px above the arm (moved up from -2px)
  
  // Target labels are right-aligned, positioned at the end of the horizontal arm
  graphElements.targetLabel.style.left = `${targetEndX - 8}px`; // At the end of horizontal arm
  graphElements.targetLabel.style.top = `${targetEndY - 12}px`; // 12px above the arm (moved up from -2px)
  
  graphElements.targetLevelLabel.style.left = `${targetEndX - 8}px`; // At the end of horizontal arm
  graphElements.targetLevelLabel.style.top = `${targetEndY + 12}px`; // 8px below target label (adjusted for the 12px upward movement)
  
  // Update x-axis labels
  updateXAxisLabels();
}

// Function to format date as "4th Mar 2026"
function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  
  // Add ordinal suffix to day
  let daySuffix;
  if (day === 1 || day === 21 || day === 31) {
    daySuffix = 'st';
  } else if (day === 2 || day === 22) {
    daySuffix = 'nd';
  } else if (day === 3 || day === 23) {
    daySuffix = 'rd';
  } else {
    daySuffix = 'th';
  }
  
  // Month abbreviations
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return `${day}${daySuffix} ${monthNames[month]} ${year}`;
}

// Function to calculate date from plan day
function getDateFromPlanDay(planDay) {
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + planDay);
  return targetDate;
}

// Function to update hover date label position and content
function updateHoverDateLabel(circleX, clampedX) {
  const hoverDateLabel = document.getElementById('x-axis-hover-date');
  if (!hoverDateLabel) return;
  
  // Calculate the plan day based on mode
  let planDay;
  if (graphConfig.isCostingMode) {
    // In costing mode, clampedX is the week number, convert to days
    planDay = Math.round((clampedX - 1) * 7); // Week 1 = day 0, Week 2 = day 7, etc.
  } else {
    // In nicotine mode, clampedX is already the day number
    planDay = Math.round(clampedX);
  }
  
  // Calculate the date and format it
  const targetDate = getDateFromPlanDay(planDay);
  const formattedDate = formatDate(targetDate);
  
  // Update the label content
  hoverDateLabel.textContent = formattedDate;
  
  // Position the label horizontally with invisible wall constraints
  let labelX = circleX; // Default to same x position as hover circle
  
  try {
    // Get label dimensions for invisible wall constraints
    const labelRect = hoverDateLabel.getBoundingClientRect();
    const labelWidth = labelRect.width;
    const labelHalfWidth = labelWidth / 2;
    
    // Get graph container dimensions for boundaries
    const plotRect = document.querySelector('.plot-rect');
    if (plotRect) {
      const plotRectRect = plotRect.getBoundingClientRect();
      const graphLeft = 0;
      const graphRight = plotRectRect.width;
      
      // Apply invisible wall constraints
      const labelLeftEdge = circleX - labelHalfWidth;
      const labelRightEdge = circleX + labelHalfWidth;
      
      // Constrain to left boundary
      if (labelLeftEdge < graphLeft) {
        labelX = graphLeft + labelHalfWidth;
      }
      // Constrain to right boundary
      else if (labelRightEdge > graphRight) {
        labelX = graphRight - labelHalfWidth;
      }
    }
  } catch (error) {
    console.log('Hover date label positioning error:', error);
    // Fallback to simple positioning if there's an error
    labelX = circleX;
  }
  
  // Apply the final position
  hoverDateLabel.style.left = `${labelX}px`;
}

// Function to update x-axis labels
function updateXAxisLabels() {
  const todayLabel = document.getElementById('x-axis-today');
  const weekLabel = document.getElementById('x-axis-week');
  
  if (!todayLabel || !weekLabel) return;
  
  // Get plan duration in weeks
  const planDurationWeeks = getPlanDurationWeeks();
  
  // Update the week label with the plan duration
  weekLabel.textContent = `Week ${planDurationWeeks}`;
  
  // Show the labels
  todayLabel.style.display = 'block';
  weekLabel.style.display = 'block';
}

// Function to fade out arms and labels on hover
function fadeOutArmsAndLabels() {
  if (graphElements.baselineArm && graphElements.targetArm && 
      graphElements.baselineLabel && graphElements.targetLabel && graphElements.targetLevelLabel) {
    // Fade out arms and labels for both modes
    graphElements.baselineArm.classList.add('hidden-on-hover');
    graphElements.targetArm.classList.add('hidden-on-hover');
    graphElements.baselineLabel.classList.add('hidden-on-hover');
    graphElements.targetLabel.classList.add('hidden-on-hover');
    graphElements.targetLevelLabel.classList.add('hidden-on-hover');
    
    // Also fade out x-axis labels
    const todayLabel = document.getElementById('x-axis-today');
    const weekLabel = document.getElementById('x-axis-week');
    if (todayLabel) todayLabel.classList.add('hidden-on-hover');
    if (weekLabel) weekLabel.classList.add('hidden-on-hover');
    
    // Show the hover date label
    const hoverDateLabel = document.getElementById('x-axis-hover-date');
    if (hoverDateLabel) {
      hoverDateLabel.style.display = 'block';
      hoverDateLabel.classList.add('visible');
    }
  }
}

// Function to fade in arms and labels when not hovering
function fadeInArmsAndLabels() {
  if (graphElements.baselineArm && graphElements.targetArm && 
      graphElements.baselineLabel && graphElements.targetLabel && graphElements.targetLevelLabel) {
    
    // Fade in arms and labels for both modes
    graphElements.baselineArm.classList.remove('hidden-on-hover');
    graphElements.targetArm.classList.remove('hidden-on-hover');
    graphElements.baselineLabel.classList.remove('hidden-on-hover');
    graphElements.targetLabel.classList.remove('hidden-on-hover');
    graphElements.targetLevelLabel.classList.remove('hidden-on-hover');
    
    // Add visible class to make them fade in
    graphElements.baselineArm.classList.add('visible');
    graphElements.targetArm.classList.add('visible');
    graphElements.baselineLabel.classList.add('visible');
    graphElements.targetLabel.classList.add('visible');
    graphElements.targetLevelLabel.classList.add('visible');
    
    // Also fade in x-axis labels
    const todayLabel = document.getElementById('x-axis-today');
    const weekLabel = document.getElementById('x-axis-week');
    if (todayLabel) {
      todayLabel.classList.remove('hidden-on-hover');
      todayLabel.classList.add('visible');
    }
    if (weekLabel) {
      weekLabel.classList.remove('hidden-on-hover');
      weekLabel.classList.add('visible');
    }
    
    // Hide the hover date label
    const hoverDateLabel = document.getElementById('x-axis-hover-date');
    if (hoverDateLabel) {
      hoverDateLabel.style.display = 'none';
      hoverDateLabel.classList.remove('visible');
    }
    
    const mode = graphConfig.isCostingMode ? 'costing' : 'nicotine';
    console.log(`Arms and labels faded in for ${mode} mode`);
  }
}

// Build the curve path
function buildCurvePath(xUnits, yUnits, a, b, c, samples) {
  if (c <= 0) return ''; // Don't draw if c is invalid
  
  let d = '';
  
  if (graphConfig.isCostingMode) {
    // Costing mode - use weeks and costing curve
    const costingParams = calculateCostingParams(a, b, c);
    const { ac, bc, cc } = costingParams;
    const step = cc / samples; // Use cc (weeks) as the range
    
    for (let i = 0; i <= samples; i++) {
      const x = i * step; // x goes from 0 to cc (weeks)
      const y = C(x, ac, bc, cc);
      
      // Scale x to fit the viewBox (0 to xUnits)
      const scaledX = (x / cc) * xUnits;
      
      const cmd = (i === 0) ? 'M' : 'L';
      d += `${cmd} ${scaledX} ${y} `;
    }
  } else {
    // Nicotine mode - use days and nicotine curve
    const step = c / samples; // Use c (days) as the range
    
    for (let i = 0; i <= samples; i++) {
      const x = i * step; // x goes from 0 to c (days)
      const y = N(x, a, b, c);
      
      // Scale x to fit the viewBox (0 to xUnits)
      const scaledX = (x / c) * xUnits;
      
      const cmd = (i === 0) ? 'M' : 'L';
      d += `${cmd} ${scaledX} ${y} `;
    }
  }
  
  return d.trim();
}

// Build the fill path (curve + bottom edge + left edge + right edge)
function buildFillPath(xUnits, yUnits, a, b, c, samples) {
  if (c <= 0) return ''; // Don't draw if c is invalid
  
  let d = '';
  
  // Start at bottom-left corner (0, 0)
  d += `M 0 0 `;
  
  if (graphConfig.isCostingMode) {
    // Costing mode - use weeks and costing curve
    const costingParams = calculateCostingParams(a, b, c);
    const { ac, bc, cc } = costingParams;
    const step = cc / samples; // Use cc (weeks) as the range
    
    // Draw the curve from left to right
    for (let i = 0; i <= samples; i++) {
      const x = i * step; // x goes from 0 to cc (weeks)
      const y = C(x, ac, bc, cc);
      
      // Scale x to fit the viewBox (0 to xUnits)
      const scaledX = (x / cc) * xUnits;
      
      d += `L ${scaledX} ${y} `;
    }
  } else {
    // Nicotine mode - use days and nicotine curve
    const step = c / samples; // Use c (days) as the range
    
    // Draw the curve from left to right
    for (let i = 0; i <= samples; i++) {
      const x = i * step; // x goes from 0 to c (days)
      const y = N(x, a, b, c);
      
      // Scale x to fit the viewBox (0 to xUnits)
      const scaledX = (x / c) * xUnits;
      
      d += `L ${scaledX} ${y} `;
    }
  }
  
  // Close the path: right edge down, bottom edge left, left edge up
  d += `L ${xUnits} 0 L 0 0 Z`;
  
  return d.trim();
}

// Build progressive curve path (only up to a certain x position)
function buildProgressiveCurvePath(xUnits, yUnits, a, b, c, samples, maxX) {
  if (c <= 0) return ''; // Don't draw if c is invalid
  
  let d = '';
  
  if (graphConfig.isCostingMode) {
    // Costing mode - use weeks and costing curve
    const costingParams = calculateCostingParams(a, b, c);
    const { ac, bc, cc } = costingParams;
    const step = cc / samples; // Use cc (weeks) as the range
    const maxStep = Math.min(samples, Math.floor((maxX / cc) * samples));

    for (let i = 0; i <= maxStep; i++) {
      const x = i * step; // x goes from 0 to maxX
      const y = C(x, ac, bc, cc);
      
      // Scale x to fit the viewBox (0 to xUnits)
      const scaledX = (x / cc) * xUnits;
      
      const cmd = (i === 0) ? 'M' : 'L';
      d += `${cmd} ${scaledX} ${y} `;
    }
  } else {
    // Nicotine mode - use days and nicotine curve
    const step = c / samples; // Use c (days) as the range
    const maxStep = Math.min(samples, Math.floor((maxX / c) * samples));

    for (let i = 0; i <= maxStep; i++) {
      const x = i * step; // x goes from 0 to maxX
      const y = N(x, a, b, c);
      
      // Scale x to fit the viewBox (0 to xUnits)
      const scaledX = (x / c) * xUnits;
      
      const cmd = (i === 0) ? 'M' : 'L';
      d += `${cmd} ${scaledX} ${y} `;
    }
  }
  
  return d.trim();
}

// Setup curve hover interaction
function setupCurveHover() {
  if (!graphElements.svg || !graphElements.curve) return;
  
  // Add mouse move event listener to the SVG
  graphElements.svg.addEventListener('mousemove', handleCurveHover);
  graphElements.svg.addEventListener('mouseleave', hideCurveHover);
}

// Handle curve hover
function handleCurveHover(event) {
  if (!graphElements.curve || !graphElements.hoverCircle || !graphElements.tooltip) return;
  
  // Disable hover during animation
  if (graphConfig.isAnimating) return;
  
  const { a, b, c, xUnits, yUnits } = graphConfig;
  if (a <= 0 || b <= 0 || c <= 0) return; // No valid data yet
  
  // Get mouse position relative to SVG
  const rect = graphElements.svg.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  
  // Convert to SVG coordinates
  const svgX = (mouseX / rect.width) * xUnits;
  const svgY = (mouseY / rect.height) * yUnits;
  
  // Convert to mathematical coordinates (accounting for the flipped Y-axis)
  const mathX = svgX;
  const mathY = yUnits - svgY;
  
  // Clamp x to valid range based on mode
  let clampedX, actualY;
  if (graphConfig.isCostingMode) {
    // Costing mode - snap to discrete week points
    const costingParams = calculateCostingParams(a, b, c);
    const { ac, bc, cc } = costingParams;
    
    // Convert mouse position to week number (1 to cc)
    const weekNumber = Math.round(mathX);
    
    // Clamp to valid week range (1 to cc, skip week 0)
    const clampedWeek = Math.max(1, Math.min(cc, weekNumber));
    
    // If mouse is in week 0 range, snap to week 1
    if (mathX < 0.5) {
      clampedX = 1;
    } else {
      clampedX = clampedWeek;
    }
    
    actualY = C(clampedX, ac, bc, cc);
  } else {
    // Nicotine mode - use days and nicotine curve (continuous)
    clampedX = Math.max(0, Math.min(c, mathX));
    actualY = N(clampedX, a, b, c);
  }
  
  // Update the current hover position for progressive curve
  graphConfig.currentHoverX = clampedX;
  
  // Convert back to screen coordinates for CSS positioning
  const screenX = (clampedX / xUnits) * rect.width;
  const screenY = ((yUnits - actualY) / yUnits) * rect.height;
  
  // Update hover circle position (CSS-based, positioned relative to the plot-rect container)
  const plotRect = document.querySelector('.plot-rect');
  const plotRectRect = plotRect.getBoundingClientRect();
  
  const circleX = screenX;
  const circleY = screenY;
  
  graphElements.hoverCircle.style.left = `${circleX}px`;
  graphElements.hoverCircle.style.top = `${circleY}px`;
  graphElements.hoverCircle.style.display = 'block';
  
  // Update hover date label position and content
  updateHoverDateLabel(circleX, clampedX);
  
  // Fade out arms and labels on hover
  fadeOutArmsAndLabels();
  
  // Update circle color based on mode
  if (graphConfig.isCostingMode) {
    graphElements.hoverCircle.style.borderColor = 'var(--color-green)';
  } else {
    graphElements.hoverCircle.style.borderColor = 'var(--color-blue)';
  }
  
  // Update tooltip content based on mode
  if (graphConfig.isCostingMode) {
    // Costing mode - show weeks and cost
    const week = Math.round(clampedX);
    const cost = Math.round(actualY * 100) / 100; // Round to 2 decimal places for currency
    
    graphElements.tooltipDay.textContent = `Week ${week}`;
    graphElements.tooltipAllowance.textContent = `Cost: £${cost}`;
  } else {
    // Nicotine mode - show days and allowance
    const day = Math.round(clampedX);
    const allowance = Math.round(actualY * 10) / 10; // Round to 1 decimal place
    
    graphElements.tooltipDay.textContent = `Day ${day}`;
    graphElements.tooltipAllowance.textContent = `Allowance: ${allowance}mg`;
  }
  
  // Position tooltip above the circle with 32px gap and invisible wall constraints
  const tooltipY = circleY - 32; // 32px above the circle
  
  // First, make the tooltip visible to get accurate dimensions
  graphElements.tooltip.style.display = 'block';
  graphElements.tooltip.style.left = `${circleX}px`;
  graphElements.tooltip.style.top = `${tooltipY}px`;
  
  // Get tooltip dimensions for invisible wall constraints (after making it visible)
  let tooltipX = circleX; // Default to centered above circle
  
  try {
    const tooltipRect = graphElements.tooltip.getBoundingClientRect();
    const tooltipWidth = tooltipRect.width;
    const tooltipHalfWidth = tooltipWidth / 2;
    
    // Get graph container dimensions for boundaries
    const plotRect = document.querySelector('.plot-rect');
    if (plotRect) {
      const plotRectRect = plotRect.getBoundingClientRect();
      const graphLeft = 0;
      const graphRight = plotRectRect.width;
      
      // Apply invisible wall constraints
      const tooltipLeftEdge = circleX - tooltipHalfWidth;
      const tooltipRightEdge = circleX + tooltipHalfWidth;
      
      // Constrain to left boundary
      if (tooltipLeftEdge < graphLeft) {
        tooltipX = graphLeft + tooltipHalfWidth;
      }
      // Constrain to right boundary
      else if (tooltipRightEdge > graphRight) {
        tooltipX = graphRight - tooltipHalfWidth;
      }
    }
  } catch (error) {
    console.log('Tooltip positioning error:', error);
    // Fallback to simple positioning if there's an error
    tooltipX = circleX;
  }
  
  // Apply the final position
  graphElements.tooltip.style.left = `${tooltipX}px`;
  
  // Update the progressive curve only in nicotine mode (costing mode shows full curve always)
  if (!graphConfig.isCostingMode) {
    const progressivePath = buildProgressiveCurvePath(xUnits, yUnits, a, b, c, graphConfig.samples, clampedX);
    graphElements.curve.setAttribute('d', progressivePath);
  }
}

// Hide curve hover elements
function hideCurveHover() {
  // Don't hide hover elements during animation
  if (graphConfig.isAnimating) return;
  
  if (graphElements.hoverCircle) {
    graphElements.hoverCircle.style.display = 'none';
    // Reset circle color to blue (default for nicotine mode)
    graphElements.hoverCircle.style.borderColor = 'var(--color-blue)';
  }
  if (graphElements.tooltip) {
    graphElements.tooltip.style.display = 'none';
  }
  
  // Fade in arms and labels when not hovering
  fadeInArmsAndLabels();
  
  // Reset the progressive curve to show the full curve (only in nicotine mode)
  if (!graphConfig.isCostingMode) {
    graphConfig.currentHoverX = graphConfig.c;
    const { xUnits, yUnits, a, b, c, samples } = graphConfig;
    if (a > 0 && b > 0 && c > 0) {
      const fullPath = buildCurvePath(xUnits, yUnits, a, b, c, samples);
      graphElements.curve.setAttribute('d', fullPath);
    }
  }
}

// Apply scale to SVG
function applyGraphScale(xUnits, yUnits) {
  if (!graphElements.svg || !graphElements.mathSpace) return;
  
  // Update viewBox to match logical space
  graphElements.svg.setAttribute('viewBox', `0 0 ${xUnits} ${yUnits}`);

  // Update the math-space inversion to new yUnits
  graphElements.mathSpace.setAttribute('transform', `scale(1,-1) translate(0, -${yUnits})`);
}

// Animated version of applyGraphScale for smooth transitions
function animateGraphScale(xUnits, yUnits, duration = 600) {
  if (!graphElements.svg || !graphElements.mathSpace) return;
  
  // Get current viewBox values
  const currentViewBox = graphElements.svg.getAttribute('viewBox');
  const [currentX, currentY, currentWidth, currentHeight] = currentViewBox.split(' ').map(Number);
  
  // Get current transform values
  const currentTransform = graphElements.mathSpace.getAttribute('transform');
  const currentYUnits = parseFloat(currentTransform.match(/translate\(0, -(\d+(?:\.\d+)?)\)/)?.[1] || currentHeight);
  
  // If values are the same, no animation needed
  if (Math.abs(currentWidth - xUnits) < 0.01 && Math.abs(currentHeight - yUnits) < 0.01) {
    return;
  }
  
  const startTime = performance.now();
  
  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Use ease-out cubic-bezier for smooth animation
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    
    // Interpolate between old and new values
    const newWidth = currentWidth + (xUnits - currentWidth) * easeProgress;
    const newHeight = currentHeight + (yUnits - currentHeight) * easeProgress;
    const newYUnits = currentYUnits + (yUnits - currentYUnits) * easeProgress;
    
    // Update viewBox
    graphElements.svg.setAttribute('viewBox', `0 0 ${newWidth} ${newHeight}`);
    
    // Update transform
    graphElements.mathSpace.setAttribute('transform', `scale(1,-1) translate(0, -${newYUnits})`);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Ensure final values are exact
      graphElements.svg.setAttribute('viewBox', `0 0 ${xUnits} ${yUnits}`);
      graphElements.mathSpace.setAttribute('transform', `scale(1,-1) translate(0, -${yUnits})`);
    }
  }
  
  requestAnimationFrame(animate);
}

// Set graph scale
function setGraphScale(xUnits, yUnits) {
  graphConfig.xUnits = xUnits;
  graphConfig.yUnits = yUnits;
  applyGraphScale(xUnits, yUnits);
}

// Animated version of setGraphScale for smooth transitions
function setGraphScaleAnimated(xUnits, yUnits, duration = 600) {
  graphConfig.xUnits = xUnits;
  graphConfig.yUnits = yUnits;
  animateGraphScale(xUnits, yUnits, duration);
}

// Set graph parameters from form data
function setGraphParams(a, b, c) {
  graphConfig.a = a;
  graphConfig.b = b;
  graphConfig.c = c;
  
  // Set X-axis range to plan duration in days (c)
  graphConfig.xUnits = c;
  
  // Set Y-axis range to current usage value (b) for proper scaling
  graphConfig.yUnits = b;
  
  // Update the graph scale with the new ranges
  setGraphScale(graphConfig.xUnits, graphConfig.yUnits);
  
  // Start the animation sequence
  animateGraphReveal();
}

// Animate the graph reveal sequence
function animateGraphReveal() {
  const yourPlanSection = document.getElementById('your-plan-section');
  if (!yourPlanSection) return;
  
  // Step 1: Scroll to the Your Plan section
  yourPlanSection.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'start' 
  });
  
  // Step 2: After scroll completes, animate the curves
  setTimeout(() => {
    animateCurveDrawing();
  }, 400); // Reduced wait time for faster transition
}

// Animate the curve drawing with trim path
function animateCurveDrawing() {
  const { xUnits, yUnits, a, b, c, samples } = graphConfig;
  
  if (a <= 0 || b <= 0 || c <= 0) return;
  
  // Build the full curve paths
  const backgroundPath = buildCurvePath(xUnits, yUnits, a, b, c, samples);
  const fillPath = buildFillPath(xUnits, yUnits, a, b, c, samples);
  
  // Set the paths
  graphElements.curveBackground.setAttribute('d', backgroundPath);
  graphElements.curve.setAttribute('d', backgroundPath);
  graphElements.curveFill.setAttribute('d', fillPath);
  
  // Update arms and labels
  updateArmsAndLabels(xUnits, yUnits, a, b, c);
  
  // Hide gradient fill completely
  graphElements.curveFill.style.opacity = '0';
  
  // Add CSS for trim path animation and gradient fade
  const style = document.createElement('style');
  style.textContent = `
    @keyframes drawCurve {
      from { stroke-dashoffset: 1000; }
      to { stroke-dashoffset: 0; }
    }
    
    @keyframes fadeInGradient {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .curve-animating {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: drawCurve 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    
    .gradient-fade-in {
      opacity: 0;
      animation: fadeInGradient 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
  `;
  document.head.appendChild(style);
  
  // Set animation flag to disable hover during animation
  graphConfig.isAnimating = true;
  
  // Mark the initial mode as shown (since this is the first time the graph appears)
  const initialMode = graphConfig.isCostingMode ? 'costing' : 'nicotine';
  graphConfig.modesShown[initialMode] = true;
  
  // Apply animation classes to curves and gradient
  graphElements.curveBackground.classList.add('curve-animating');
  graphElements.curve.classList.add('curve-animating');
  graphElements.curveFill.classList.add('gradient-fade-in');
  
  // Clean up after everything is done
  setTimeout(() => {
    graphElements.curveBackground.classList.remove('curve-animating');
    graphElements.curve.classList.remove('curve-animating');
    graphElements.curveFill.classList.remove('gradient-fade-in');
    
    // Ensure gradient fill stays visible after animation
    graphElements.curveFill.style.opacity = '1';
    
    // Re-enable hover functionality after animation completes
    graphConfig.isAnimating = false;
    
    // Fade in arms and labels after trim path animation completes
    fadeInArmsAndLabels();
    
    if (style.parentNode) {
      style.parentNode.removeChild(style);
    }
  }, 1600); // Updated to 1.6s for new animation duration
}

// Render the graph (without animation)
function renderGraph() {
  if (!graphElements.curve || !graphElements.curveFill || !graphElements.curveBackground) return;
  
  const { xUnits, yUnits, a, b, c, samples, currentHoverX } = graphConfig;
  
  // Only render if we have valid data
  if (a > 0 && b > 0 && c > 0) {
    applyGraphScale(xUnits, yUnits);
    
    // Build and set the background curve (full curve, always visible)
    const backgroundPath = buildCurvePath(xUnits, yUnits, a, b, c, samples);
    graphElements.curveBackground.setAttribute('d', backgroundPath);
    
    // Build and set the progressive curve (only up to hover position)
    const progressivePath = buildProgressiveCurvePath(xUnits, yUnits, a, b, c, samples, currentHoverX);
    graphElements.curve.setAttribute('d', progressivePath);
    
    // Build and set the fill path (only up to hover position)
    const fillPath = buildFillPath(xUnits, yUnits, a, b, c, samples);
    graphElements.curveFill.setAttribute('d', fillPath);
    
    // Update arms and labels
    updateArmsAndLabels(xUnits, yUnits, a, b, c);
    
    // Update graph metrics display
    if (window.updateGraphMetrics) {
      window.updateGraphMetrics();
    }
    
    console.log('Graph rendered with params:', { a, b, c, xUnits, yUnits, currentHoverX });
  } else {
    // Clear all curves and fill if no valid data
    graphElements.curve.setAttribute('d', '');
    graphElements.curveBackground.setAttribute('d', '');
    graphElements.curveFill.setAttribute('d', '');
    console.log('Graph cleared - no valid data yet');
  }
}

// Update test values display
function updateTestValues() {
  const currentUsage = getCurrentNicotineUsage();
  const targetUsage = getTargetUsage();
  const planWeeks = getPlanDurationWeeks();
  
  const currentUsageElement = document.getElementById('test-current-usage');
  const targetUsageElement = document.getElementById('test-target-usage');
  const planWeeksElement = document.getElementById('test-plan-weeks');
  const planDaysElement = document.getElementById('test-plan-days');
  
  if (currentUsageElement) {
    currentUsageElement.textContent = currentUsage !== null ? currentUsage + ' mg/day' : 'Not found';
  }
  if (targetUsageElement) {
    targetUsageElement.textContent = targetUsage !== null ? targetUsage + ' mg/day' : 'Not found';
  }
  if (planWeeksElement) {
    planWeeksElement.textContent = planWeeks !== null ? planWeeks + ' weeks' : 'Not found';
  }
  if (planDaysElement) {
    const planDays = planWeeks !== null ? planWeeks * 7 : null;
    planDaysElement.textContent = planDays !== null ? planDays + ' days' : 'Not found';
  }
  
  // Update costing curve test values
  if (currentUsage !== null && targetUsage !== null && planWeeks !== null) {
    const planDays = planWeeks * 7;
    const costingParams = calculateCostingParams(targetUsage, currentUsage, planDays);
    
    const bcElement = document.getElementById('test-bc');
    const acElement = document.getElementById('test-ac');
    const ccElement = document.getElementById('test-cc');
    
    if (bcElement) {
      bcElement.textContent = '£' + costingParams.bc.toFixed(2);
    }
    if (acElement) {
      acElement.textContent = '£' + costingParams.ac.toFixed(2);
    }
    if (ccElement) {
      ccElement.textContent = costingParams.cc + ' weeks';
    }
  } else {
    // Set to "Not found" if we don't have the required data
    const bcElement = document.getElementById('test-bc');
    const acElement = document.getElementById('test-ac');
    const ccElement = document.getElementById('test-cc');
    
    if (bcElement) bcElement.textContent = 'Not found';
    if (acElement) acElement.textContent = 'Not found';
    if (ccElement) ccElement.textContent = 'Not found';
  }
}

// Get current nicotine usage value
function getCurrentNicotineUsage() {
  const statusRectangle = document.querySelector('.status-rectangle');
  if (!statusRectangle) {
    console.log('Current nicotine status rectangle not found');
    return null;
  }
  
  const rectangleText = statusRectangle.textContent;
  console.log('Current nicotine rectangle text:', rectangleText);
  const match = rectangleText.match(/(\d+(?:\.\d+)?)\s*mg\s*\/day/);
  const value = match ? parseFloat(match[1]) : null;
  console.log('Current nicotine value extracted:', value);
  return value;
}

// Get target usage value
function getTargetUsage() {
  const statusRectangle = document.querySelector('.target-usage-status-rectangle');
  if (!statusRectangle) {
    console.log('Target usage status rectangle not found');
    return null;
  }
  
  const rectangleText = statusRectangle.textContent;
  console.log('Target usage rectangle text:', rectangleText);
  const match = rectangleText.match(/(\d+(?:\.\d+)?)\s*mg\s*\/day/);
  const value = match ? parseFloat(match[1]) : null;
  console.log('Target usage value extracted:', value);
  return value;
}

// Get plan duration in weeks
function getPlanDurationWeeks() {
  const statusRectangle = document.querySelector('.plan-duration-status-rectangle');
  if (!statusRectangle) {
    console.log('Plan duration status rectangle not found');
    return null;
  }
  
  const rectangleText = statusRectangle.textContent;
  console.log('Plan duration rectangle text:', rectangleText);
  const match = rectangleText.match(/(\d+)\s*weeks?/);
  const value = match ? parseInt(match[1]) : null;
  console.log('Plan duration value extracted:', value);
  return value;
}

// Function to initialize the plan duration confirm button
function initializePlanDurationConfirmButton() {
  const confirmButton = document.getElementById('plan-duration-confirm-button');
  const confirmButtonContainer = document.getElementById('plan-duration-confirm-button-container');
  const statusContainer = document.getElementById('plan-duration-status-container');
  const editButton = document.getElementById('plan-duration-edit-button');
  
  // Elements to hide on confirm
  const subtitle = document.querySelector('.plan-duration-subtitle');
  const recommendation = document.querySelector('.plan-duration-recommendation');
  const inputHstack = document.querySelector('.plan-duration-input-hstack');

  if (confirmButton) {
    confirmButton.addEventListener('click', function() {
      // Hide confirm button
      confirmButtonContainer.classList.add('hidden');
      
      // Hide all content by setting heights, margins, and padding to zero
      if (subtitle) {
        subtitle.style.height = '0';
        subtitle.style.margin = '0';
        subtitle.style.padding = '0';
        subtitle.style.overflow = 'hidden';
      }
      if (recommendation) {
        recommendation.style.height = '0';
        recommendation.style.margin = '0';
        recommendation.style.padding = '0';
        recommendation.style.overflow = 'hidden';
      }
      if (inputHstack) {
        inputHstack.style.height = '0';
        inputHstack.style.margin = '0';
        inputHstack.style.padding = '0';
        inputHstack.style.overflow = 'hidden';
      }
      
      // Get current weeks value and update display box
      const displayCapsule = document.getElementById('plan-duration-display');
      const currentWeeks = displayCapsule ? displayCapsule.dataset.currentWeeks || displayCapsule.textContent.replace(/\D/g, '') : '0';
      updatePlanDurationStatusRectangle(currentWeeks);
      
      // Show status container
      if (statusContainer) statusContainer.classList.remove('hidden');
      
      // Activate tickbox
      const tickBox = document.getElementById('plan-duration-tick-box');
      if (tickBox) {
        tickBox.classList.add('active');
      }
    });
  }

  if (editButton) {
    editButton.addEventListener('click', function() {
      // Show confirm button
      confirmButtonContainer.classList.remove('hidden');
      
      // Show all content by resetting styles
      if (subtitle) {
        subtitle.style.height = '';
        subtitle.style.margin = '';
        subtitle.style.padding = '';
        subtitle.style.overflow = '';
      }
      if (recommendation) {
        recommendation.style.height = '';
        recommendation.style.margin = '';
        recommendation.style.padding = '';
        recommendation.style.overflow = '';
      }
      if (inputHstack) {
        inputHstack.style.height = '';
        inputHstack.style.margin = '';
        inputHstack.style.padding = '';
        inputHstack.style.overflow = '';
      }
      
      // Hide status container
      if (statusContainer) statusContainer.classList.add('hidden');
      
      // Deactivate tickbox
      const tickBox = document.getElementById('plan-duration-tick-box');
      if (tickBox) {
        tickBox.classList.remove('active');
      }
    });
  }
}

// Function to update the plan duration status rectangle
function updatePlanDurationStatusRectangle(weeks) {
  const statusRectangle = document.querySelector('.plan-duration-status-rectangle');
  if (!statusRectangle) return;
  
  statusRectangle.innerHTML = `<span style="font-size: var(--font-size-large);"><span style="color: var(--color-red);">${weeks}</span> <span style="color: var(--color-dark-gray);">weeks</span></span>`;
}

// Function to initialize plan duration visibility
function initializePlanDurationVisibility() {
  // Initially hide all plan duration content
  hidePlanDurationContent();
  
  // Check visibility whenever tickboxes change
  const currentNicotineTickBox = document.getElementById('current-nicotine-tick-box');
  const targetUsageTickBox = document.getElementById('target-usage-tick-box');
  const planDurationTickBox = document.getElementById('plan-duration-tick-box');
  
  // Create observers to watch for tickbox changes
  if (currentNicotineTickBox) {
    const currentNicotineObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkPlanDurationVisibility();
          checkYourPlanVisibility();
        }
      });
    });
    currentNicotineObserver.observe(currentNicotineTickBox, { attributes: true });
  }
  
  if (targetUsageTickBox) {
    const targetUsageObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkPlanDurationVisibility();
          checkYourPlanVisibility();
        }
      });
    });
    targetUsageObserver.observe(targetUsageTickBox, { attributes: true });
  }
  
  if (planDurationTickBox) {
    const planDurationObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkYourPlanVisibility();
        }
      });
    });
    planDurationObserver.observe(planDurationTickBox, { attributes: true });
  }
  
  // Initial checks
  checkPlanDurationVisibility();
  checkYourPlanVisibility();
}

// Your Plan White Rectangle Click Functionality
  function initializeYourPlanWhiteRectangle() {
    const rightTopRectangle = document.getElementById('right-top-rectangle');
    const whiteRectangle = document.getElementById('white-rectangle');
    const nicotineText = document.querySelector('.nicotine-text');
    const costingText = document.querySelector('.costing-text');
    const nicotineIcon = document.querySelector('.nicotine-icon');
    const costingIcon = document.querySelector('.costing-icon');
    const yourPlanTitleMain = document.getElementById('your-plan-title-main');
    const yourPlanTitleSub = document.getElementById('your-plan-title-sub');
  
  if (rightTopRectangle && whiteRectangle && nicotineText && costingText && nicotineIcon && costingIcon && yourPlanTitleMain && yourPlanTitleSub) {
    // Function to update selection state
    function updateSelectionState() {
      const isRightAligned = whiteRectangle.classList.contains('right-aligned');
      
      if (isRightAligned) {
        // White rectangle is on the right - costing is selected
        rightTopRectangle.classList.remove('nicotine-selected');
        rightTopRectangle.classList.add('costing-selected');
        
        // Update title
        yourPlanTitleMain.textContent = 'Weekly Bill';
        yourPlanTitleSub.textContent = ' throughout plan';
        
        // Update nicotine content (costing-selected appearance - white)
        nicotineText.classList.add('costing-selected');
        nicotineIcon.src = 'assets/nicotine-white.svg';
        
        // Update costing content (costing-selected appearance)
        costingText.classList.add('costing-selected');
        costingIcon.src = 'assets/costing.svg';
        
        // Update graph to costing mode
        graphConfig.isCostingMode = true;
        updateGraphForMode();
      } else {
        // White rectangle is on the left - nicotine is selected
        rightTopRectangle.classList.remove('costing-selected');
        rightTopRectangle.classList.add('nicotine-selected');
        
        // Update title
        yourPlanTitleMain.textContent = 'Nicotine Allowance';
        yourPlanTitleSub.textContent = ' throughout plan';
        
        // Update nicotine content (nicotine-selected appearance - blue)
        nicotineText.classList.remove('costing-selected');
        nicotineIcon.src = 'assets/nicotine.svg';
        
        // Update costing content (default appearance)
        costingText.classList.remove('costing-selected');
        costingIcon.src = 'assets/costing-white.svg';
        
        // Update graph to nicotine mode
        graphConfig.isCostingMode = false;
        updateGraphForMode();
      }
    }
    
    // Set initial state
    updateSelectionState();
    
    rightTopRectangle.addEventListener('click', function(e) {
      const rect = rightTopRectangle.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const rectangleWidth = rect.width;
      
      // Calculate white rectangle boundaries
      const whiteRectLeft = whiteRectangle.classList.contains('right-aligned') ? 
        rectangleWidth * 0.5 : 4;
      const whiteRectRight = whiteRectLeft + (rectangleWidth * 0.5 - 4);
      
      if (clickX < whiteRectLeft) {
        // Click is on the left side, move to original position
        whiteRectangle.classList.remove('right-aligned');
        updateSelectionState();
      } else if (clickX > whiteRectRight) {
        // Click is on the right side, move to right position
        whiteRectangle.classList.add('right-aligned');
        updateSelectionState();
      }
      // If click is on the white rectangle itself, do nothing
    });
  }
}

// Function to check if plan duration should be visible
function checkPlanDurationVisibility() {
  const currentNicotineTickBox = document.getElementById('current-nicotine-tick-box');
  const targetUsageTickBox = document.getElementById('target-usage-tick-box');
  
  const currentNicotineCompleted = currentNicotineTickBox && currentNicotineTickBox.classList.contains('active');
  const targetUsageCompleted = targetUsageTickBox && targetUsageTickBox.classList.contains('active');
  
  if (currentNicotineCompleted && targetUsageCompleted) {
    showPlanDurationContent();
  } else {
    hidePlanDurationContent();
  }
}

// Function to check if all three sections are completed and show/hide Your Plan section
function checkYourPlanVisibility() {
  const currentNicotineTickBox = document.getElementById('current-nicotine-tick-box');
  const targetUsageTickBox = document.getElementById('target-usage-tick-box');
  const planDurationTickBox = document.getElementById('plan-duration-tick-box');
  const yourPlanSection = document.getElementById('your-plan-section');
  
  const currentNicotineCompleted = currentNicotineTickBox && currentNicotineTickBox.classList.contains('active');
  const targetUsageCompleted = targetUsageTickBox && targetUsageTickBox.classList.contains('active');
  const planDurationCompleted = planDurationTickBox && planDurationTickBox.classList.contains('active');
  
  // Only show Your Plan section if all three sections are completed
  if (currentNicotineCompleted && targetUsageCompleted && planDurationCompleted) {
    if (yourPlanSection) {
      yourPlanSection.classList.remove('hidden');
      yourPlanSection.classList.add('show');
      
      // Update test values and graph with real data
      setTimeout(() => {
        // Update test values display first
        updateTestValues();
        
        console.log('Attempting to update graph with form data...');
        const currentUsage = getCurrentNicotineUsage();
        const targetUsage = getTargetUsage();
        const planWeeks = getPlanDurationWeeks();
        
        console.log('Form data extracted:', { currentUsage, targetUsage, planWeeks });
        
        if (currentUsage !== null && targetUsage !== null && planWeeks !== null) {
          const planDays = planWeeks * 7;
          setGraphParams(targetUsage, currentUsage, planDays);
          console.log('Graph updated with real data:', { 
            a: targetUsage, 
            b: currentUsage, 
            c: planDays 
          });
          
          // Update graph for current mode (important when re-entering the section)
          // But don't animate if this is the initial load (setGraphParams already triggered animation)
          const initialMode = graphConfig.isCostingMode ? 'costing' : 'nicotine';
          if (graphConfig.modesShown[initialMode]) {
            // Mode already shown - just update without animation
            updateGraphForMode();
          } else {
            // First time showing this mode - update mode-specific settings before animation
            // This ensures the animation uses the correct curve and colors for the current mode
            updateGraphModeSettings();
          }
          
          // Ensure graph metrics are updated when Your Plan section opens
          if (window.updateGraphMetrics) {
            window.updateGraphMetrics();
          }
          
          console.log('Graph mode updated for current selection:', graphConfig.isCostingMode ? 'costing' : 'nicotine');
        } else {
          console.log('Missing form data - cannot update graph');
        }
      }, 100); // Reduced delay for faster auto-scroll
    }
  } else {
    if (yourPlanSection) {
      yourPlanSection.classList.add('hidden');
      yourPlanSection.classList.remove('show');
    }
  }
}

// Function to hide plan duration content
function hidePlanDurationContent() {
  const subtitle = document.querySelector('.plan-duration-subtitle');
  const recommendation = document.querySelector('.plan-duration-recommendation');
  const inputHstack = document.querySelector('.plan-duration-input-hstack');
  const confirmButtonContainer = document.getElementById('plan-duration-confirm-button-container');
  const statusContainer = document.getElementById('plan-duration-status-container');
  const tickBox = document.getElementById('plan-duration-tick-box');
  
  // Hide all content elements by setting heights, margins, and padding to zero
  if (subtitle) {
    subtitle.style.height = '0';
    subtitle.style.margin = '0';
    subtitle.style.padding = '0';
    subtitle.style.overflow = 'hidden';
  }
  if (recommendation) {
    recommendation.style.height = '0';
    recommendation.style.margin = '0';
    recommendation.style.padding = '0';
    recommendation.style.overflow = 'hidden';
  }
  if (inputHstack) {
    inputHstack.style.height = '0';
    inputHstack.style.margin = '0';
    inputHstack.style.padding = '0';
    inputHstack.style.overflow = 'hidden';
  }
  if (confirmButtonContainer) {
    confirmButtonContainer.style.height = '0';
    confirmButtonContainer.style.margin = '0';
    confirmButtonContainer.style.padding = '0';
    confirmButtonContainer.style.overflow = 'hidden';
  }
  
  // Hide status elements (display box, edit button, tickbox)
  if (statusContainer) statusContainer.classList.add('hidden');
  if (tickBox) tickBox.classList.remove('active');
}

// Function to show plan duration content
function showPlanDurationContent() {
  const subtitle = document.querySelector('.plan-duration-subtitle');
  const recommendation = document.querySelector('.plan-duration-recommendation');
  const inputHstack = document.querySelector('.plan-duration-input-hstack');
  const confirmButtonContainer = document.getElementById('plan-duration-confirm-button-container');
  
  // Show all content elements by resetting styles
  if (subtitle) {
    subtitle.style.height = '';
    subtitle.style.margin = '';
    subtitle.style.padding = '';
    subtitle.style.overflow = '';
  }
  if (recommendation) {
    recommendation.style.height = '';
    recommendation.style.margin = '';
    recommendation.style.padding = '';
    recommendation.style.overflow = '';
  }
  if (inputHstack) {
    inputHstack.style.height = '';
    inputHstack.style.margin = '';
    inputHstack.style.padding = '';
    inputHstack.style.overflow = '';
  }
  if (confirmButtonContainer) {
    confirmButtonContainer.style.height = '';
    confirmButtonContainer.style.margin = '';
    confirmButtonContainer.style.padding = '';
    confirmButtonContainer.style.overflow = '';
    confirmButtonContainer.classList.remove('hidden'); // Remove hidden class
  }
}

// Current Spending Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
  const spendingToggleIcon = document.getElementById('spending-toggle-icon');
  const spendingToggleBox = document.getElementById('spending-toggle-box');
  const spendingToggleValue = document.getElementById('spending-toggle-value');
  const spendingToggleUnit = document.getElementById('spending-toggle-unit');
  
  if (!spendingToggleIcon || !spendingToggleBox || !spendingToggleValue || !spendingToggleUnit) {
    return;
  }
  
  let isSpendingVisible = false;
  let spendingLineWasVisible = false; // Track if spending line was visible when leaving costing mode
  
  // Make spending functions globally accessible
  window.spendingLineWasVisible = spendingLineWasVisible;
  window.showSpending = null; // Will be set after function definition
  window.originalCostingYUnits = null; // Store original y-scale for costing mode
  
  // Function to show red spending line
  function showSpendingLine() {
    const spendingLine = document.getElementById('spending-line');
    const spendingPath = document.getElementById('spending-path');
    if (!spendingLine || !spendingPath) return;
    
    // Make sure the spending line is visible
    spendingLine.style.display = 'block';
    
    // Get the current spending value from the display box
    const spendingDisplay = document.getElementById('current-spending-display');
    if (!spendingDisplay) return;
    
    const displayText = spendingDisplay.textContent;
    const match = displayText.match(/£(\d+(?:\.\d+)?)/);
    if (!match) return;
    
    const currentSpending = parseFloat(match[1]);
    if (isNaN(currentSpending)) return;
    
    // Only show in costing mode
    if (!graphConfig || !graphConfig.isCostingMode) return;
    
    // Calculate Y position based on spending value relative to current graph scale
    const plotRect = document.querySelector('.plot-rect');
    if (!plotRect) return;
    
    const rectHeight = plotRect.offsetHeight;
    const rectWidth = plotRect.offsetWidth;
    
    // Use the current y-scale (which may have been adjusted to current spending value)
    const currentYScale = graphConfig.yUnits;
    
    // Calculate Y position: 0 = bottom, currentYScale = top
    const yRatio = currentSpending / currentYScale; // 0 to 1
    const yPosition = rectHeight * (1 - yRatio); // Flip: 1-yRatio so 0 spending = bottom, max spending = top
    
    // Position the SVG container
    spendingLine.style.top = yPosition + 'px';
    spendingLine.style.display = 'block';
    
    // Set the SVG viewBox to match the container width
    spendingLine.setAttribute('viewBox', `0 0 ${rectWidth} 2`);
    spendingLine.setAttribute('width', rectWidth);
    spendingLine.setAttribute('height', '2');
    
    // Create horizontal line path from left to right
    const pathData = `M 0 1 L ${rectWidth} 1`;
    spendingPath.setAttribute('d', pathData);
    
    // Set up for trim path animation (grow from right to left)
    const pathLength = rectWidth;
    spendingPath.setAttribute('stroke-dasharray', pathLength);
    spendingPath.setAttribute('stroke-dashoffset', -pathLength); // Start fully hidden (negative offset)
    
    // Trigger the animation by setting stroke-dashoffset to 0 (grow from right to left)
    setTimeout(() => {
      spendingPath.setAttribute('stroke-dashoffset', '0');
    }, 50); // Small delay to ensure SVG is ready
  }
  
  // Function to hide red spending line with trim path animation
  function hideSpendingLine() {
    const spendingLine = document.getElementById('spending-line');
    const spendingPath = document.getElementById('spending-path');
    if (!spendingLine || !spendingPath) return;
    
    // Get the current path length for the animation
    const plotRect = document.querySelector('.plot-rect');
    if (!plotRect) return;
    
    const rectWidth = plotRect.offsetWidth;
    const pathLength = rectWidth;
    
    // Set up for trim path animation (shrink from right to left)
    spendingPath.setAttribute('stroke-dasharray', pathLength);
    spendingPath.setAttribute('stroke-dashoffset', '0'); // Start fully visible
    
    // Trigger the animation by setting stroke-dashoffset to -pathLength (shrink from right to left)
    spendingPath.setAttribute('stroke-dashoffset', -pathLength);
    
    // Hide the SVG container after animation completes
    setTimeout(() => {
      spendingLine.style.display = 'none';
    }, 800); // Match the CSS transition duration
  }
  
  // Function to show spending
  function showSpending() {
    isSpendingVisible = true;
    spendingLineWasVisible = true; // Remember that spending line was visible
    window.spendingLineWasVisible = true; // Update global variable
    spendingToggleIcon.src = 'assets/hide-mid.svg';
    spendingToggleBox.classList.add('visible');
    spendingToggleValue.classList.add('visible');
    spendingToggleUnit.classList.add('visible');
    
    // Show costing mode hstack 2 (savings made) when showing current spending
    if (graphConfig && graphConfig.isCostingMode) {
      const costingHstack2 = document.querySelector('.costing-hstack-2-content');
      if (costingHstack2) {
        costingHstack2.classList.add('visible');
      }
    }
    
    // Hide arms and labels when showing spending line in costing mode
    if (graphConfig && graphConfig.isCostingMode) {
      if (graphElements.baselineArm && graphElements.targetArm && 
          graphElements.baselineLabel && graphElements.targetLabel && graphElements.targetLevelLabel) {
        graphElements.baselineArm.style.display = 'none';
        graphElements.targetArm.style.display = 'none';
        graphElements.baselineLabel.style.display = 'none';
        graphElements.targetLabel.style.display = 'none';
        graphElements.targetLevelLabel.style.display = 'none';
      }
      
      // Reset hover state to show full costing curve when showing spending line
      const costingParams = calculateCostingParams(graphConfig.a, graphConfig.b, graphConfig.c);
      graphConfig.currentHoverX = costingParams.cc; // Show full curve (cc = plan duration in weeks)
      
      // Adjust y-scale to use current spending value as reference (only if current spending > bc)
      const currentSpending = window.calculateCurrentSpending();
      console.log('Current spending value:', currentSpending);
      console.log('Has custom spending edit:', window.hasCustomSpendingEdit);
      console.log('Custom spending value:', window.customSpendingValue);
      console.log('Current yUnits before change:', graphConfig.yUnits);
      
      if (currentSpending && currentSpending !== 'n/a' && currentSpending > 0) {
        // Get the initial cost (bc) to compare with current spending
        const initialCost = costingParams.bc;
        console.log('Initial cost (bc):', initialCost);
        
        // Only adjust y-scale if current spending is greater than initial cost
        if (currentSpending > initialCost) {
          console.log('Current spending > initial cost, adjusting y-scale');
          
          // Store original y-scale if not already stored
          if (!window.originalCostingYUnits) {
            window.originalCostingYUnits = graphConfig.yUnits;
            console.log('Stored original yUnits:', window.originalCostingYUnits);
          }
          
          // Set y-scale to current spending value with animation
          graphConfig.yUnits = currentSpending;
          console.log('New yUnits set to:', graphConfig.yUnits);
          setGraphScaleAnimated(graphConfig.xUnits, graphConfig.yUnits, 600);
          
          // Re-render the graph with new scale after a short delay to allow animation to start
          setTimeout(() => {
            renderGraph();
            console.log('Graph re-rendered with new y-scale');
          }, 50);
          
          // Show red spending line AFTER y-scale has been adjusted
          showSpendingLine();
          console.log('Spending line positioned with new y-scale');
        } else {
          console.log('Current spending <= initial cost, keeping original y-scale');
          // Show red spending line with original scale
          showSpendingLine();
        }
      } else {
        console.log('Current spending is invalid or zero, not adjusting y-scale');
        // Show red spending line with original scale
        showSpendingLine();
      }
    } else {
      // Show red spending line (for non-costing modes, though this shouldn't happen)
      showSpendingLine();
    }
    
    // Auto-click the display box if current spending is null (undefined cost options)
    const currentSpending = window.calculateCurrentSpending();
    if (currentSpending === null) {
      console.log('Auto-clicking spending display box for null value');
      // Trigger a click on the spending toggle value element to start editing
      setTimeout(() => {
        const spendingToggleValueElement = document.getElementById('spending-toggle-value');
        if (spendingToggleValueElement) {
          spendingToggleValueElement.click();
        }
      }, 100); // Small delay to ensure the display is fully shown first
    }
  }
  
  // Function to hide spending
  function hideSpending() {
    isSpendingVisible = false;
    spendingLineWasVisible = false; // Remember that spending line was hidden
    window.spendingLineWasVisible = false; // Update global variable
    spendingToggleIcon.src = 'assets/show-mid.svg';
    spendingToggleBox.classList.remove('visible');
    spendingToggleValue.classList.remove('visible');
    spendingToggleUnit.classList.remove('visible');
    
    // Hide costing mode hstack 2 (savings made) when hiding current spending
    if (graphConfig && graphConfig.isCostingMode) {
      const costingHstack2 = document.querySelector('.costing-hstack-2-content');
      if (costingHstack2) {
        costingHstack2.classList.remove('visible');
      }
    }
    
    // Reset custom spending state when hiding - this ensures next show will use default calculated value
    // Reset both local and global state directly to ensure it works regardless of timing
    if (window.hasCustomSpendingEdit !== undefined) {
      window.hasCustomSpendingEdit = false;
      window.customSpendingValue = null;
      console.log('Custom spending state reset on hide - next show will use default value');
      console.log('Reset values - hasCustomSpendingEdit:', window.hasCustomSpendingEdit, 'customSpendingValue:', window.customSpendingValue);
      
      // Update the display to show the default calculated value
      if (window.updateCurrentSpendingDisplay) {
        window.updateCurrentSpendingDisplay();
        console.log('Display updated to show default calculated value');
      }
    }
    
    // Hide red spending line
    hideSpendingLine();
    
    // Restore original y-scale when hiding spending line with animation
    if (graphConfig && graphConfig.isCostingMode) {
      // Reset hover state to show full costing curve when hiding spending line
      const costingParams = calculateCostingParams(graphConfig.a, graphConfig.b, graphConfig.c);
      graphConfig.currentHoverX = costingParams.cc; // Show full curve (cc = plan duration in weeks)
      
      if (window.originalCostingYUnits) {
        console.log('Restoring original yUnits:', window.originalCostingYUnits);
        graphConfig.yUnits = window.originalCostingYUnits;
        setGraphScaleAnimated(graphConfig.xUnits, graphConfig.yUnits, 600);
        
        // Re-render the graph with restored scale after a short delay
        setTimeout(() => {
          renderGraph();
          console.log('Graph re-rendered with restored y-scale');
        }, 50);
        
        // Show arms and labels again AFTER the y-scale animation completes (600ms + buffer)
        setTimeout(() => {
          if (graphElements.baselineArm && graphElements.targetArm &&
              graphElements.baselineLabel && graphElements.targetLabel && graphElements.targetLevelLabel) {
            graphElements.baselineArm.style.display = 'block';
            graphElements.targetArm.style.display = 'block';
            graphElements.baselineLabel.style.display = 'block';
            graphElements.targetLabel.style.display = 'block';
            graphElements.targetLevelLabel.style.display = 'block';
            console.log('Arms and labels restored after animation completed');
          }
        }, 650); // 600ms animation + 50ms buffer
        
        // Clear the stored original scale
        window.originalCostingYUnits = null;
      } else {
        console.log('No original yUnits to restore');
        // If no scale change, show arms and labels immediately
        if (graphElements.baselineArm && graphElements.targetArm &&
            graphElements.baselineLabel && graphElements.targetLabel && graphElements.targetLevelLabel) {
          graphElements.baselineArm.style.display = 'block';
          graphElements.targetArm.style.display = 'block';
          graphElements.baselineLabel.style.display = 'block';
          graphElements.targetLabel.style.display = 'block';
          graphElements.targetLevelLabel.style.display = 'block';
        }
      }
    }
  }
  
  // Make showSpending function globally accessible
  window.showSpending = showSpending;
  
  // Click handler
  spendingToggleIcon.addEventListener('click', function() {
    if (isSpendingVisible) {
      hideSpending();
    } else {
      showSpending();
    }
  });
  
  // Hover handlers for show-mid.svg
  spendingToggleIcon.addEventListener('mouseenter', function() {
    if (!isSpendingVisible && spendingToggleIcon.src.includes('show-mid.svg')) {
      spendingToggleIcon.src = 'assets/show-dark.svg';
    } else if (isSpendingVisible && spendingToggleIcon.src.includes('hide-mid.svg')) {
      spendingToggleIcon.src = 'assets/hide-dark.svg';
    }
  });
  
  spendingToggleIcon.addEventListener('mouseleave', function() {
    if (!isSpendingVisible && spendingToggleIcon.src.includes('show-dark.svg')) {
      spendingToggleIcon.src = 'assets/show-mid.svg';
    } else if (isSpendingVisible && spendingToggleIcon.src.includes('hide-dark.svg')) {
      spendingToggleIcon.src = 'assets/hide-mid.svg';
    }
  });
  
  // Function to update spending line position with custom value
  function updateSpendingLinePosition(customValue) {
    const spendingLine = document.getElementById('spending-line');
    const spendingPath = document.getElementById('spending-path');
    if (!spendingLine || !spendingPath || !graphConfig || !graphConfig.isCostingMode) return;
    
    // Calculate Y position based on custom value relative to current graph scale
    const plotRect = document.querySelector('.plot-rect');
    if (!plotRect) return;
    
    const rectHeight = plotRect.offsetHeight;
    const rectWidth = plotRect.offsetWidth;
    
    // Use the current y-scale (which may have been adjusted to current spending value)
    const currentYScale = graphConfig.yUnits;
    
    // Calculate Y position: 0 = bottom, currentYScale = top
    const yRatio = customValue / currentYScale; // 0 to 1
    const yPosition = rectHeight * (1 - yRatio); // Flip: 1-yRatio so 0 spending = bottom, max spending = top
    
    // Position the SVG container
    spendingLine.style.top = yPosition + 'px';
    
    // Update the path if needed
    if (spendingLine.style.display !== 'none') {
      spendingLine.setAttribute('viewBox', `0 0 ${rectWidth} 2`);
      spendingLine.setAttribute('width', rectWidth);
      spendingLine.setAttribute('height', '2');
      
      const pathData = `M 0 1 L ${rectWidth} 1`;
      spendingPath.setAttribute('d', pathData);
    }
    
    console.log('Spending line position updated for custom value:', customValue);
  }

  // Make hstack spending value clickable to edit
  const spendingToggleValueElement = document.getElementById('spending-toggle-value');
  const spendingDisplay = document.getElementById('current-spending-display');
  
  if (spendingToggleValueElement && spendingDisplay) {
    // Make the hstack value clickable
    spendingToggleValueElement.style.cursor = 'pointer';
    spendingToggleValueElement.title = 'Click to edit';
    
    spendingToggleValueElement.addEventListener('click', function() {
      // Get current value from hstack
      const currentText = spendingToggleValueElement.textContent;
      const match = currentText.match(/£(\d+(?:\.\d+)?)/);
      let currentValue = match ? match[1] : '0';
      
      // If the field only contains '£' (null spending), start with empty input
      if (currentText.trim() === '£') {
        currentValue = '';
      }
      
      // Create temporary input
      const input = document.createElement('input');
      input.type = 'number';
      input.value = currentValue;
      input.step = '0.01';
      input.min = '0';
      input.style.cssText = `
        border: none;
        border-radius: 4px;
        padding: 2px 6px;
        font-size: var(--font-size-medium);
        font-family: var(--font-outfit);
        color: var(--color-red);
        background: white;
        width: 80px;
        text-align: center;
        outline: none;
      `;
      
      // Replace hstack value with input
      spendingToggleValueElement.style.display = 'none';
      spendingToggleValueElement.parentNode.insertBefore(input, spendingToggleValueElement);
      input.focus();
      input.select();
      
      // Handle input completion
      function finishEdit() {
        const newValue = parseFloat(input.value);
        if (!isNaN(newValue) && newValue >= 0) {
          // Set flag to indicate user has made a custom edit (both local and global state)
          hasCustomSpendingEdit = true;
          customSpendingValue = newValue;
          window.hasCustomSpendingEdit = true;
          window.customSpendingValue = newValue;
          
          // Update the hstack box value
          spendingToggleValueElement.textContent = `£${newValue.toFixed(2)}`;
          
          // Also update the bottom rectangle display
          spendingDisplay.textContent = `£${newValue.toFixed(2)} /week`;
          
          // Update red spending line and y-scale if in costing mode
          // If spending line wasn't visible before but we now have a custom value, make it visible
          if (graphConfig && graphConfig.isCostingMode) {
            if (!isSpendingVisible) {
              // Auto-show spending line when custom value is entered from null state
              isSpendingVisible = true;
              spendingLineWasVisible = true;
              window.spendingLineWasVisible = true;
              console.log('Auto-showing spending line for custom value from null state');
            }
            console.log('Custom spending edit - updating y-scale for new value:', newValue);
            console.log('Custom spending edit - isSpendingVisible:', isSpendingVisible);
            console.log('Custom spending edit - isCostingMode:', graphConfig.isCostingMode);
            
            // Get the initial cost (bc) to compare with new spending value
            const costingParams = calculateCostingParams(graphConfig.a, graphConfig.b, graphConfig.c);
            const initialCost = costingParams.bc;
            console.log('Custom spending edit - initial cost (bc):', initialCost);
            
            // Always adjust y-scale based on the greater value between custom spending and initial cost
            const maxValue = Math.max(newValue, initialCost);
            console.log('Custom spending edit - Using max value for y-scale:', maxValue, '(custom:', newValue, ', initial:', initialCost, ')');
            
            // Store original y-scale if not already stored
            if (!window.originalCostingYUnits) {
              window.originalCostingYUnits = graphConfig.yUnits;
              console.log('Custom spending edit - Stored original yUnits:', window.originalCostingYUnits);
            }
            
            // Reset hover state to show full costing curve when updating y-scale
            graphConfig.currentHoverX = costingParams.cc; // Show full curve (cc = plan duration in weeks)
            console.log('Custom spending edit - Reset currentHoverX to show full curve:', graphConfig.currentHoverX);
            
            // Set y-scale to the max value (either custom spending or initial cost)
            graphConfig.yUnits = maxValue;
            console.log('Custom spending edit - New yUnits set to:', graphConfig.yUnits);
            setGraphScaleAnimated(graphConfig.xUnits, graphConfig.yUnits, 600);
            
            // Re-render the graph with new scale after a short delay
            setTimeout(() => {
              renderGraph();
              console.log('Graph re-rendered with new y-scale and full curve');
            }, 50);
            
            // Update spending line position
            updateSpendingLinePosition(newValue);
            
            // Show the spending line if it was auto-shown
            if (isSpendingVisible && spendingLineWasVisible) {
              showSpendingLine();
              console.log('Spending line shown for custom value');
            }
          }
          
          console.log('Spending value updated to:', newValue);
        }
        
        // Remove input and show hstack value
        spendingToggleValueElement.parentNode.removeChild(input);
        spendingToggleValueElement.style.display = 'inline';
      }
      
      // Handle Enter key
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          finishEdit();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          spendingToggleValueElement.parentNode.removeChild(input);
          spendingToggleValueElement.style.display = 'inline';
          
          // If original field only contained '£' (null spending), restore it
          if (currentText.trim() === '£') {
            spendingToggleValueElement.textContent = '£';
          }
        }
      });
      
      // Handle blur (click outside)
      input.addEventListener('blur', finishEdit);
    });
  }
  
  // Function to calculate reduction percentage
  function calculateReductionPercentage() {
    const currentUsage = getCurrentNicotineUsage();
    const targetUsage = getTargetUsage();
    
    if (currentUsage === null || targetUsage === null || currentUsage <= 0) {
      return 0;
    }
    
    // Calculate percentage reduction: ((current - target) / current) * 100
    const reductionPercentage = Math.round(((currentUsage - targetUsage) / currentUsage) * 100);
    
    // Ensure percentage is not negative
    return Math.max(0, reductionPercentage);
  }

  // Function to get target date from plan duration section
  function getTargetDate() {
    const dayCapsule = document.getElementById('plan-duration-day-capsule');
    const monthText = document.querySelector('.plan-duration-month-text');
    const yearText = document.querySelector('.plan-duration-year-text');
    
    if (!dayCapsule || !monthText || !yearText) {
      return '1st Jan 2024'; // Default fallback
    }
    
    const day = parseInt(dayCapsule.dataset.day || dayCapsule.textContent.replace(/\D/g, ''));
    const monthIndex = parseInt(monthText.dataset.monthIndex || 0);
    const year = parseInt(yearText.dataset.year || new Date().getFullYear());
    
    if (isNaN(day) || isNaN(monthIndex) || isNaN(year)) {
      return '1st Jan 2024'; // Default fallback
    }
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Format day with ordinal suffix
    let daySuffix;
    if (day === 1 || day === 21 || day === 31) {
      daySuffix = 'st';
    } else if (day === 2 || day === 22) {
      daySuffix = 'nd';
    } else if (day === 3 || day === 23) {
      daySuffix = 'rd';
    } else {
      daySuffix = 'th';
    }
    
    return `${day}${daySuffix} ${months[monthIndex]} ${year}`;
  }

  // Function to calculate average bill from initial and final bill
  function calculateAverageBill() {
    if (!graphConfig || !graphConfig.isCostingMode) return 0;
    
    const costingParams = calculateCostingParams(graphConfig.a, graphConfig.b, graphConfig.c);
    const { ac, bc, cc } = costingParams;
    
    // Use week 1 value for initial bill (not week 0)
    const initialCost = C(1, ac, bc, cc);
    const finalCost = ac; // Final week cost
    
    return (initialCost + finalCost) / 2;
  }


  // Function to update new hstacks content
  function updateNewHstacks() {
    const isCostingMode = graphConfig && graphConfig.isCostingMode;
    const reductionPercentage = document.getElementById('reduction-percentage');
    const targetDate = document.getElementById('target-date');
    
    // Get nicotine mode content elements (the original content with icons)
    const nicotineHstack1 = document.querySelector('.new-hstack-1 .new-hstack-text');
    const nicotineHstack2 = document.querySelector('.new-hstack-2 .new-hstack-text');
    const costingHstack1 = document.querySelector('.costing-hstack-1-content');
    const costingHstack2 = document.querySelector('.costing-hstack-2-content');
    
    // Get the icons
    const icon1 = document.querySelector('.new-hstack-1 .new-hstack-icon');
    const icon2 = document.querySelector('.new-hstack-2 .new-hstack-icon');
    
    if (isCostingMode) {
      // Costing Mode - hide nicotine content, show costing content
      if (nicotineHstack1) nicotineHstack1.style.display = 'none';
      if (nicotineHstack2) nicotineHstack2.style.display = 'none';
      if (costingHstack1) costingHstack1.style.display = 'flex';
      if (costingHstack2) {
        costingHstack2.style.display = 'flex';
        // Only hide costing hstack 2 if current spending toggle is not visible
        const spendingToggleBox = document.getElementById('spending-toggle-box');
        if (!spendingToggleBox || !spendingToggleBox.classList.contains('visible')) {
          costingHstack2.classList.remove('visible');
        }
      }
      
      // Hide icons by setting width and margins to 0
      if (icon1) {
        icon1.style.width = '0';
        icon1.style.margin = '0';
      }
      if (icon2) {
        icon2.style.width = '0';
        icon2.style.margin = '0';
      }
      
      // Update average bill value
      const averageBillElement = document.getElementById('average-bill-amount');
      if (averageBillElement) {
        const averageBill = calculateAverageBill();
        averageBillElement.textContent = `£${averageBill.toFixed(2)}`;
      }
      
      // Update savings value - using plan builder values and hidden current spending
      const savingsAmountElement = document.getElementById('savings-amount');
      if (savingsAmountElement) {
        // Get values from plan builder sections (avoiding graph system)
        const currentUsage = getCurrentNicotineUsage(); // a (target usage)
        const targetUsage = getTargetUsage(); // b (current usage) 
        const planWeeks = getPlanDurationWeeks(); // cc (weeks)
        
        if (currentUsage !== null && targetUsage !== null && planWeeks !== null) {
          // Calculate costing parameters using the formulas from calculateCostingParams
          const level = getTargetLevel();
          const Sa = getPodStrength(targetUsage); // Pod strength for target usage
          const Sb = getPodStrength(currentUsage); // Pod strength for current usage
          
          const m = 2; // ml of liquid in each pod
          const C_pod = 2.2; // sale price of a pod
          const D = 1 + 0.1 * level; // discount factor
          const V = 1.2; // VAT (20%)
          
          // Calculate ac (cost in last week) and bc (cost at week 0)
          const ac = ((7 * targetUsage) / (Sa * m)) * C_pod * D * V;
          const bc = ((7 * currentUsage) / (Sb * m)) * C_pod * V;
          const cc = planWeeks; // Number of weeks
          
          // Calculate total plan cost (sum from week 1 to cc)
          let totalPlanCost = 0;
          for (let week = 1; week <= cc; week++) {
            // Use the costing curve formula C(x, ac, bc, cc)
            const weekCost = (6 * (bc - ac) / Math.pow(cc, 3)) * (Math.pow(week, 3) / 3 - cc * Math.pow(week, 2) / 2) + bc;
            totalPlanCost += weekCost;
          }
          
          // Get current spending from the hidden display
          const spendingToggleValue = document.getElementById('spending-toggle-value');
          if (spendingToggleValue) {
            const spendingText = spendingToggleValue.textContent.replace('£', '');
            const currentSpending = parseFloat(spendingText);
            
            if (!isNaN(currentSpending)) {
              // Calculate total current spending (current spending * number of weeks)
              const totalCurrentSpending = currentSpending * cc;
              
              // Calculate savings (total current spending - total plan cost)
              const savings = totalCurrentSpending - totalPlanCost;
              // Ensure savings cannot be negative
              const finalSavings = Math.max(0, savings);
              savingsAmountElement.textContent = `£${finalSavings.toFixed(2)}`;
            } else {
              savingsAmountElement.textContent = '£0.00';
            }
          } else {
            savingsAmountElement.textContent = '£0.00';
          }
        } else {
          savingsAmountElement.textContent = '£0.00';
        }
      }
    } else {
      // Nicotine Mode - show nicotine content, hide costing content
      if (nicotineHstack1) nicotineHstack1.style.display = 'flex';
      if (nicotineHstack2) nicotineHstack2.style.display = 'flex';
      if (costingHstack1) costingHstack1.style.display = 'none';
      if (costingHstack2) {
        costingHstack2.style.display = 'none';
        costingHstack2.classList.remove('visible');
      }
      
      // Show icons by resetting width and margins
      if (icon1) {
        icon1.style.width = '';
        icon1.style.margin = '';
      }
      if (icon2) {
        icon2.style.width = '';
        icon2.style.margin = '';
      }
      
      // Update nicotine values
      if (reductionPercentage) {
        const percentage = calculateReductionPercentage();
        reductionPercentage.textContent = `${percentage}%`;
      }
      if (targetDate) {
        const date = getTargetDate();
        targetDate.textContent = date;
      }
    }
  }

  // Function to update graph metrics based on current mode
  function updateGraphMetrics() {
    const leftMetricTop = document.getElementById('left-metric-top');
    const leftMetricBottom = document.getElementById('left-metric-bottom');
    const rightMetricTop = document.getElementById('right-metric-top');
    const rightMetricBottom = document.getElementById('right-metric-bottom');
    
    if (!leftMetricTop || !leftMetricBottom || !rightMetricTop || !rightMetricBottom) return;
    
    // Check if we're in costing mode
    const isCostingMode = graphConfig && graphConfig.isCostingMode;
    
    if (isCostingMode) {
      // Costing Mode
      leftMetricTop.textContent = 'Initial Bill';
      rightMetricTop.textContent = 'Final Bill';
      
      // Get costing curve values
      const costingParams = calculateCostingParams(graphConfig.a, graphConfig.b, graphConfig.c);
      const { ac, bc, cc } = costingParams;
      
      // Use week 1 value for initial bill (not week 0)
      const initialCost = C(1, ac, bc, cc);
      const finalCost = ac; // Final week cost
      
      leftMetricBottom.textContent = `£${initialCost.toFixed(2)}`;
      rightMetricBottom.textContent = `£${finalCost.toFixed(2)}`;
    } else {
      // Nicotine Mode
      leftMetricTop.textContent = 'Baseline';
      
      // Get current nicotine usage (baseline) - this is graphConfig.b
      const currentUsage = graphConfig ? graphConfig.b : 0;
      leftMetricBottom.textContent = `${currentUsage}mg /day`;
      
      // Get target level and usage - this is graphConfig.a
      const targetLevel = getTargetLevel();
      const targetUsage = graphConfig ? graphConfig.a : 0;
      
      // Update right metric with target level using the same color logic as the existing system
      let levelColor;
      switch(targetLevel) {
        case 1: levelColor = 'var(--color-blue)'; break;
        case 2: levelColor = 'var(--color-level-2)'; break;
        case 3: levelColor = 'var(--color-level-3)'; break;
        case 4: levelColor = 'var(--color-green)'; break;
        default: levelColor = 'var(--color-dark-gray)'; break;
      }
      
      rightMetricTop.innerHTML = `Target <span style="color: ${levelColor};">Level ${targetLevel}</span>`;
      rightMetricBottom.textContent = `${targetUsage}mg /day`;
    }
    
    // Update new hstacks
    updateNewHstacks();
  }
  
  // Make updateGraphMetrics globally accessible
  window.updateGraphMetrics = updateGraphMetrics;
  
});
