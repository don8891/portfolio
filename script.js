console.log("Welcome to my portfolio!");

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document
      .querySelector(link.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  });
});

window.addEventListener('scroll', () => {
  const profilePic = document.querySelector('.profile-pic');
  const homeBottom = document.querySelector('.home-bottom');
  const homeSection = document.querySelector('.home-section');
  
  if (!homeSection) return;

  const scrollY = window.scrollY;
  const sectionHeight = homeSection.offsetHeight;
  
  // Calculate specific trigger points
  // 1. Fade out profile pic as we scroll down
  let opacity = 1 - (scrollY / (sectionHeight * 0.4)); 
  if (opacity < 0) opacity = 0;
  
  if (profilePic) {
    profilePic.style.opacity = opacity;
    profilePic.style.transform = `translateY(${scrollY * 0.5}px)`; // Parallax effect
  }

  // 2. Fade in details (home-bottom) as we scroll further
  // Example: Start fading in when scroll is 20% down
  let bottomOpacity = (scrollY - (sectionHeight * 0.1)) / (sectionHeight * 0.3);
  if (bottomOpacity < 0.2) bottomOpacity = 0.2; // Keep it slightly visible initially or 0 if you want full hide
  if (bottomOpacity > 1) bottomOpacity = 1;
  
  // Optional: Apply to homeBottom if you want it to fade IN depending on scroll
  // Given user request "fade and come to details", maybe they want the details to be more prominent as image fades?
  // Let's just keep the image fade for now as requested.
});
