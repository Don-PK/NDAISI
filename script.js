// script.js

// Load profile.json and populate content
async function loadProfile() {
  try {
    const res = await fetch('profile.json');
    const data = await res.json();

    // About text and hero name
    document.getElementById('hero-name').textContent = data.name;
    document.getElementById('about-text').textContent = data.about;
    // Profile photo
    const photo = document.getElementById('profile-photo');
    if (data.photo && data.photo.length) {
      photo.src = data.photo;
    } else {
      // default placeholder already in assets
    }

    // Footer year
    document.getElementById('footer-year').textContent = new Date().getFullYear();
  } catch (err) {
    console.error('Failed to load profile.json', err);
  }
}

// Contact form handler (client-side only)
// Replace this with real server call or email integration later.
function handleForm(e) {
  e.preventDefault();
  const form = e.target;
  const formStatus = document.getElementById('form-status');

  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    service: form.service.value,
    message: form.message.value.trim()
  };

  if (!data.name || !data.email) {
    formStatus.textContent = 'Please complete name and email.';
    return false;
  }

  // Simulate sending...
  formStatus.textContent = 'Sending...';
  setTimeout(() => {
    formStatus.textContent = 'Thank you — your message was sent (demo). We will get back to you shortly.';
    form.reset();
  }, 900);

  return false;
}

function fillDemo() {
  const f = document.getElementById('contact-form');
  f.name.value = 'Monika Sample';
  f.email.value = 'monika@example.com';
  f.service.value = 'Japanese Car Importation';
  f.message.value = 'I would like help importing a vehicle from Japan. Need guidance on costs and clearance.';
}

// Wire CTA buttons
function setupCTAs() {
  document.getElementById('cta-contact').addEventListener('click', () => {
    document.getElementById('contact').scrollIntoView({behavior:'smooth'});
  });
  document.getElementById('cta-services').addEventListener('click', () => {
    document.getElementById('services').scrollIntoView({behavior:'smooth'});
  });

  document.getElementById('cta-quote').addEventListener('click', () => {
    document.getElementById('contact').scrollIntoView({behavior:'smooth'});
  });
}

// init
document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  setupCTAs();
  // expose handleForm to inline onsubmit
  window.handleForm = handleForm;
  window.fillDemo = fillDemo;
});
