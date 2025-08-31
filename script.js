// Auto-scroll to video when investor pitch is clicked
document.addEventListener('DOMContentLoaded', function() {
  const videoContainer = document.querySelector('.video-container');
  const investorHstack = document.querySelector('.investor-hstack');
  const getInTouchButton = document.getElementById('get-in-touch-button');
  const contactForm = document.getElementById('contact-form');
  const videoSection = document.getElementById('video-section');
  
  let isContactFormOpen = false;
  
  if (videoContainer && investorHstack) {
    // Listen for clicks on the investor pitch hstack
    investorHstack.addEventListener('click', function(e) {
      console.log('Investor pitch clicked!'); // Debug log
      
      // Scroll to center the video in the viewport
      videoContainer.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center'
      });
    });
  }
  
  // Close functionality for get-in-touch button
  if (getInTouchButton && contactForm && videoSection) {
    getInTouchButton.addEventListener('click', function(e) {
      if (!isContactFormOpen) {
        // Open contact form
        isContactFormOpen = true;
        
        // Hide video and investor pitch button
        videoSection.style.display = 'none';
        investorHstack.style.display = 'none';
        
        // Show contact form
        contactForm.style.display = 'block';
        
        // Replace get in touch with close button
        getInTouchButton.innerHTML = `
          <h2 class="get-in-touch-text">Close</h2>
          <img src="assets/cross.svg" alt="Close Icon" class="close-icon">
        `;
      } else {
        // Close contact form
        isContactFormOpen = false;
        
        // Show video and investor pitch button
        videoSection.style.display = 'block';
        investorHstack.style.display = 'flex';
        
        // Hide contact form
        contactForm.style.display = 'none';
        
        // Restore original get in touch content
        getInTouchButton.innerHTML = `
          <h2 class="get-in-touch-text">Get in touch</h2>
          <img src="assets/phone.svg" alt="Phone Icon" class="phone-icon">
        `;
      }
    });
  }
  

});
