// Toggle between login and register forms
function toggleForms(e) {
  e.preventDefault();
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  loginForm.classList.toggle('active');
  registerForm.classList.toggle('active');
}

// Handle login
async function handleLogin(e) {
  e.preventDefault();
  
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  const messageDiv = document.getElementById('loginMessage');
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      messageDiv.className = 'message error';
      messageDiv.textContent = data.error || 'Login failed';
      return;
    }

    // Store token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', username);

    // Show dashboard
    showDashboard(username, data.token);

    // Clear form
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    messageDiv.textContent = '';
  } catch (error) {
    messageDiv.className = 'message error';
    messageDiv.textContent = 'Error: ' + error.message;
  }
}

// Handle registration
async function handleRegister(e) {
  e.preventDefault();
  
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;
  const messageDiv = document.getElementById('registerMessage');
  
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      messageDiv.className = 'message error';
      messageDiv.textContent = data.error || 'Registration failed';
      return;
    }

    // Store token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', username);

    // Show dashboard
    showDashboard(username, data.token);

    // Clear form
    document.getElementById('registerUsername').value = '';
    document.getElementById('registerPassword').value = '';
    messageDiv.textContent = '';
  } catch (error) {
    messageDiv.className = 'message error';
    messageDiv.textContent = 'Error: ' + error.message;
  }
}

// Show dashboard after login/register
function showDashboard(username, token) {
  document.getElementById('authContainer').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  document.getElementById('username').textContent = username;
  document.getElementById('tokenDisplay').textContent = token;
}

// Handle logout
function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('authContainer').classList.remove('hidden');
  
  // Reset forms to login
  document.getElementById('loginForm').classList.add('active');
  document.getElementById('registerForm').classList.remove('active');
  
  // Clear messages
  document.getElementById('loginMessage').textContent = '';
  document.getElementById('registerMessage').textContent = '';
  document.getElementById('profileData').textContent = '';
}

// Load user profile from protected API
async function loadProfile() {
  const token = localStorage.getItem('token');
  const profileData = document.getElementById('profileData');
  
  if (!token) {
    profileData.textContent = 'No token found. Please login first.';
    return;
  }

  try {
    const response = await fetch('/api/protected/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      profileData.textContent = JSON.stringify({ error: data.error }, null, 2);
      return;
    }

    profileData.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    profileData.textContent = 'Error: ' + error.message;
  }
}

// Copy token to clipboard
function copyToken() {
  const token = document.getElementById('tokenDisplay').textContent;
  navigator.clipboard.writeText(token).then(() => {
    alert('Token copied to clipboard!');
  });
}

// Check if user is already logged in on page load
window.addEventListener('load', () => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  
  if (token && username) {
    showDashboard(username, token);
  }
});
