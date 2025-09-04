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
  const crossIcon = document.querySelector('.cross-icon');
  
  let isPlanBuilderOpen = false;
  
  // Click on the build plan button to open
  buildPlanButton.addEventListener('click', function(e) {
    if (!isPlanBuilderOpen) {
      // Open the plan builder
      planBuilderDropdown.classList.add('show');
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
      buildPlanButton.classList.remove('active'); // Remove active class for gray background
      crossIcon.style.transform = 'rotate(45deg)'; // Rotate back to plus (45 degrees)
      isPlanBuilderOpen = false;
    } else {
      // Open the plan builder
      planBuilderDropdown.classList.add('show');
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
  
  capsuleButtons.forEach(button => {
    button.addEventListener('click', function() {
      const buttonType = this.getAttribute('data-type');
      
      // Remove active class from all buttons
      capsuleButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Activate the tick box
      tickBox.classList.add('active');
      
      // Update visibility of cigarette and vape option sections
      updateQuestionVisibility();
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
  
  let currentValue = 1;
  
  // Minus button click handler
  minusCapsule.addEventListener('click', function() {
    if (currentValue > 1) {
      currentValue--;
      middleCapsule.value = currentValue;
      middleCapsule.style.color = 'var(--color-dark-gray)';
      middleCapsule.style.borderColor = 'var(--color-dark-gray)';
      quantityTickBox.classList.add('active');
    }
  });
  
  // Plus button click handler
  plusCapsule.addEventListener('click', function() {
    if (currentValue < 100) {
      currentValue++;
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
      // Activate refillable
      this.classList.add('active');
      refillableIcon.src = 'assets/refillable.svg';
    }
    
    // Check if any option is active to determine tickbox state
    updateVapeTickBoxState();
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
      // Activate pod-based
      this.classList.add('active');
      podBasedIcon.src = 'assets/pod-based.svg';
    }
    
    // Check if any option is active to determine tickbox state
    updateVapeTickBoxState();
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
       podMiddleCapsule.value = '1';
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
    podCurrentValue = 1;
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
    if (bottleCurrentValue > 0.5) {
      bottleCurrentValue -= 0.5;
      bottleMiddleCapsule.value = bottleCurrentValue;
      bottleMiddleCapsule.style.color = 'var(--color-dark-gray)';
      bottleMiddleCapsule.style.borderColor = 'var(--color-dark-gray)';
      bottleQuantityTickBox.classList.add('active');
    }
  });
  
  // Bottle plus button click handler
  bottlePlusCapsule.addEventListener('click', function() {
    bottleCurrentValue += 0.5;
    bottleMiddleCapsule.value = bottleCurrentValue;
    bottleMiddleCapsule.style.color = 'var(--color-dark-gray)';
    bottleMiddleCapsule.style.borderColor = 'var(--color-dark-gray)';
    bottleQuantityTickBox.classList.add('active');
  });
  
  // Bottle input field change handler
  bottleMiddleCapsule.addEventListener('input', function() {
    let newValue = parseFloat(this.value) || 0.5;
    
    // Enforce min limit
    if (newValue < 0.5) newValue = 0.5;
    
    // Update the input value and currentValue variable
    this.value = newValue;
    bottleCurrentValue = newValue;
    
    // Change colors to indicate modification
    this.style.color = 'var(--color-dark-gray)';
    this.style.borderColor = 'var(--color-dark-gray)';
    
    // Activate tickbox
    bottleQuantityTickBox.classList.add('active');
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
        
      } else if (selectedPodType && selectedPodType !== 'Juul') {
        // Handle second dropdown toggle for non-Juul selections
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
    });
    
    // Focus handler for size input (exactly like bottle inputs)
    podBottleSizeInput.addEventListener('focus', function() {
      this.select(); // Select all text when focused
    });
  }
  
  let podCurrentValue = 1;
  
  // Pod minus button click handler
  podMinusCapsule.addEventListener('click', function() {
    if (podCurrentValue > 0.5) {
      podCurrentValue -= 0.5;
      podMiddleCapsule.value = podCurrentValue;
      podMiddleCapsule.style.color = 'var(--color-dark-gray)';
      podMiddleCapsule.style.borderColor = 'var(--color-dark-gray)';
      podQuantityTickBox.classList.add('active');
    }
  });
  
  // Pod plus button click handler
  podPlusCapsule.addEventListener('click', function() {
    podCurrentValue += 0.5;
    podMiddleCapsule.value = podCurrentValue;
    podMiddleCapsule.style.color = 'var(--color-dark-gray)';
    podMiddleCapsule.style.borderColor = 'var(--color-dark-gray)';
    podQuantityTickBox.classList.add('active');
  });
  
  // Pod input field change handler
  podMiddleCapsule.addEventListener('input', function() {
    let newValue = parseFloat(this.value) || 0.5;
    
    // Enforce min limit
    if (newValue < 0.5) newValue = 0.5;
    
    // Update the input value and currentValue variable
    this.value = newValue;
    podCurrentValue = newValue;
    
    // Change colors to indicate modification
    this.style.color = 'var(--color-dark-gray)';
    this.style.borderColor = 'var(--color-dark-gray)';
    
    // Activate tickbox
    podQuantityTickBox.classList.add('active');
  });
  
  // Pod input field focus handler
  podMiddleCapsule.addEventListener('focus', function() {
    this.select(); // Select all text when focused
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
  
  // Function to handle question-hstack selection and show/hide appropriate sections
  function updateQuestionVisibility() {
    const cigaretteOptionsHstack = document.querySelector('.cigarette-options-hstack');
    const quantityOptionsHstack = document.querySelector('.quantity-options-hstack');
    const vapeOptionsHstack = document.querySelector('.vape-options-hstack');
    
    // Get the active selection from question-hstack
    const cigarettesButton = document.querySelector('.capsule-button[data-type="cigarettes"]');
    const vapesButton = document.querySelector('.capsule-button[data-type="vapes"]');
    const bothButton = document.querySelector('.capsule-button[data-type="both"]');
    
    // Check which option is active
    const isCigarettesActive = cigarettesButton && cigarettesButton.classList.contains('active');
    const isVapesActive = vapesButton && vapesButton.classList.contains('active');
    const isBothActive = bothButton && bothButton.classList.contains('active');
    
    // Hide all sections by default
    hideQuestionSection(cigaretteOptionsHstack);
    hideQuestionSection(quantityOptionsHstack);
    hideQuestionSection(vapeOptionsHstack);
    
    // Show sections based on selection
    if (isCigarettesActive) {
      // Show only cigarette sections
      showQuestionSection(cigaretteOptionsHstack);
      showQuestionSection(quantityOptionsHstack);
      
      // Reset vape options to unselected state
      resetVapeOptions();
    } else if (isVapesActive) {
      // Show only vape sections
      showQuestionSection(vapeOptionsHstack);
      
      // Reset cigarette options to unselected state
      resetCigaretteOptions();
    } else if (isBothActive) {
      // Show both cigarette and vape sections
      showQuestionSection(cigaretteOptionsHstack);
      showQuestionSection(quantityOptionsHstack);
      showQuestionSection(vapeOptionsHstack);
      
      // Don't reset any options when both is selected
    }
    // If none selected (default), all sections remain hidden
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
      cigaretteQuantityInput.value = '1';
      cigaretteQuantityInput.style.borderColor = 'var(--color-mid-gray)';
      cigaretteQuantityInput.style.color = 'var(--color-mid-gray)';
    }
    
    if (cigaretteQuantityTickBox) {
      cigaretteQuantityTickBox.classList.remove('active');
    }
    
    // Reset global variable
    currentValue = 1;
    
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
});
