const button = document.createElement('button');
button.textContent = 'Sign In with GitHub';
button.addEventListener('click', () => {
  window.location.assign('/api/auth/login');
});

document.getElementById('root').appendChild(button);
