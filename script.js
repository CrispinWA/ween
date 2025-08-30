// Auto-scroll to video when investor pitch is clicked
document.addEventListener('DOMContentLoaded', function() {
  const videoContainer = document.querySelector('.video-container');
  const investorHstack = document.querySelector('.investor-hstack');
  
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
});
