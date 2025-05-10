document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const form = document.getElementById('ticket-form');
  const formSection = document.getElementById('form-section');
  const ticketSection = document.getElementById('ticket-section');
  const uploadArea = document.getElementById('upload-area');
  const avatarInput = document.getElementById('avatar');
  const avatarPreview = document.getElementById('avatar-preview');
  const avatarError = document.getElementById('avatar-error');
  const fullnameInput = document.getElementById('fullname');
  const fullnameError = document.getElementById('fullname-error');
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('email-error');
  const githubInput = document.getElementById('github');
  const githubError = document.getElementById('github-error');

  // Ticket display elements
  const ticketFullname = document.getElementById('ticket-fullname');
  const ticketEmail = document.getElementById('ticket-email');
  const ticketAvatar = document.getElementById('ticket-avatar');
  const displayFullname = document.getElementById('display-fullname');
  const displayGithub = document.getElementById('display-github');

  // File upload variables
  let uploadedFile = null;
  const maxFileSize = 500 * 1024; // 500KB in bytes

  // Add event listeners for drag and drop
  uploadArea.addEventListener('click', () => {
    avatarInput.click();
  });

  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');

    if (e.dataTransfer.files.length) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  });

  // Handle file input change
  avatarInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
      handleFileUpload(e.target.files[0]);
    }
  });

  // Handle file upload
  function handleFileUpload(file) {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      showError(avatarError, 'Please upload a JPG or PNG image.');
      clearFilePreview();
      return;
    }

    // Check file size
    if (file.size > maxFileSize) {
      showError(avatarError, 'File size exceeds 500KB. Please upload a smaller image.');
      clearFilePreview();
      return;
    }

    // Valid file, create preview
    uploadedFile = file;
    const reader = new FileReader();

    reader.onload = (e) => {
      avatarPreview.innerHTML = `
        <div class="preview-container">
          <img src="${e.target.result}" alt="Avatar Preview">
        </div>
      `;
      avatarPreview.style.display = 'block';
      hideError(avatarError);
    };

    reader.readAsDataURL(file);
  }

  // Clear file preview
  function clearFilePreview() {
    uploadedFile = null;
    avatarPreview.innerHTML = '';
    avatarPreview.style.display = 'none';
  }

  // Form validation
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate avatar
    if (!uploadedFile) {
      showError(avatarError, 'Please upload an avatar image.');
      isValid = false;
    }

    // Validate full name
    if (!fullnameInput.value.trim()) {
      showError(fullnameError, 'Please enter your full name.');
      isValid = false;
    } else {
      hideError(fullnameError);
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
      showError(emailError, 'Please enter a valid email address.');
      isValid = false;
    } else {
      hideError(emailError);
    }

    // Validate GitHub username
    if (!githubInput.value.trim()) {
      showError(githubError, 'Please enter your GitHub username.');
      isValid = false;
    } else {
      hideError(githubError);
    }

    // If form is valid, generate ticket
    if (isValid) {
      generateTicket();
    }
  });

  // Show error message
  function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
  }

  // Hide error message
  function hideError(element) {
    element.style.display = 'none';
  }

  // Generate ticket
  function generateTicket() {
    // Set ticket information
    ticketFullname.textContent = fullnameInput.value.trim();
    ticketEmail.textContent = emailInput.value.trim();
    displayFullname.textContent = fullnameInput.value.trim();

    // Format GitHub username (ensure it has @ prefix)
    let githubUsername = githubInput.value.trim();
    if (!githubUsername.startsWith('@')) {
      githubUsername = '@' + githubUsername;
    }
    displayGithub.textContent = githubUsername;

    // Set avatar image
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        ticketAvatar.src = e.target.result;
      };
      reader.readAsDataURL(uploadedFile);
    }

    // Ensure the logo is properly loaded
    const ticketLogo = document.querySelector('.ticket-logo');
    if (ticketLogo) {
      // Force reload of the logo by resetting the src
      const logoSrc = ticketLogo.getAttribute('src');
      ticketLogo.setAttribute('src', logoSrc + '?t=' + new Date().getTime());
    }

    // Add fade-out animation to form
    formSection.style.opacity = '0';
    formSection.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
      // Hide form and show ticket
      formSection.style.display = 'none';
      ticketSection.style.display = 'block';

      // Add fade-in animation to ticket with a longer delay to ensure all elements load
      setTimeout(() => {
        ticketSection.style.opacity = '1';

        // Make sure the logo is visible
        if (ticketLogo && ticketLogo.style.display === 'none') {
          ticketLogo.style.display = 'block';
        }
      }, 100);

      // Scroll to ticket
      ticketSection.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }

  // Add CSS class for visually hidden elements
  const style = document.createElement('style');
  style.textContent = `
    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      border: 0;
    }

    .preview-container {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      margin-top: 1rem;
      border: 2px solid var(--orange-500);
    }

    .preview-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `;
  document.head.appendChild(style);

  // Add CSS for animations
  const animationStyle = document.createElement('style');
  animationStyle.textContent = `
    #ticket-section {
      opacity: 0;
      transition: opacity 0.5s ease;
    }
  `;
  document.head.appendChild(animationStyle);
});

