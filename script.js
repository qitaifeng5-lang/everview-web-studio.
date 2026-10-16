'use strict';
// Add only verified live demo URLs and your Formspree /f/ endpoint here.
const SITE_CONFIG = Object.freeze({
  formspreeEndpoint: 'https://formspree.io/f/xrperwkn',
portfolio: {
  homedeer: 'https://homedeer.everviewstudio.com',
  cut: 'https://cutstudio.everviewstudio.com'
}
});
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelectorAll('[data-package]').forEach(link => link.addEventListener('click', () => {
  document.querySelector('#package').value = link.dataset.package;
}));
const dialog = document.querySelector('#project-details');
const projects = {
  homedeer: { title: 'Homedeer', description: 'A home and lifestyle demo exploring warm colours, editorial typography, and an inviting visual direction.' },
  cut: { title: 'THE CUT STUDIO', description: 'A barber and grooming demo exploring bold typography, a confident colour palette, and a direct service-led layout.' }
};
function validHttps(value) { try { return new URL(value).protocol === 'https:'; } catch { return false; } }
document.querySelectorAll('[data-project]').forEach(link => {
  const key = link.dataset.project;
  const url = SITE_CONFIG.portfolio[key];
  if (validHttps(url)) {
    link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.innerHTML = 'View demo <span aria-hidden="true">↗</span>';
    link.setAttribute('aria-label', `View ${projects[key].title} demo project (opens in a new tab)`);
  } else {
    link.addEventListener('click', event => {
      event.preventDefault();
      document.querySelector('#project-title').textContent = projects[key].title;
      document.querySelector('#project-description').textContent = projects[key].description;
      dialog.showModal();
    });
  }
});
document.querySelectorAll('.dialog-close, .dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
const form = document.querySelector('#contact-form');
const submitButton = document.querySelector('#submit-button');
const status = document.querySelector('#form-status');
const endpointReady = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(SITE_CONFIG.formspreeEndpoint);
if (endpointReady) {
  form.action = SITE_CONFIG.formspreeEndpoint;
  submitButton.disabled = false;
  submitButton.innerHTML = 'Send your enquiry <span aria-hidden="true">↗</span>';
  document.querySelector('#connection-notice').innerHTML = '<strong>Let’s talk about your project.</strong><p>Your enquiry will be sent securely through Formspree.</p>';
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!endpointReady) { status.textContent = 'This form is not connected yet. No enquiry has been sent.'; return; }
  if (!form.reportValidity()) return;
  submitButton.disabled = true;
  status.textContent = 'Sending your enquiry…';
  try {
    const response = await fetch(SITE_CONFIG.formspreeEndpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Submission failed');
    form.reset(); status.textContent = 'Thank you. Your enquiry has been sent.';
  } catch {
    status.textContent = 'Your enquiry could not be confirmed. Please try again later. Your message is still here.';
  } finally { submitButton.disabled = false; }
});
