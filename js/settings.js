// Function to apply blue styles in dark mode
function applyDarkModeStyles() {
  const isDarkMode = document.body.classList.contains("dark"); // Check if dark mode is active

  // Apply dark mode styles
  if (isDarkMode) {
    // Style for the language select dropdown in dark mode
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
      languageSelect.style.backgroundColor = '#2a2a40'; // Dark background
      languageSelect.style.color = '#fdfdfd'; // Light text color for dark mode
      languageSelect.style.border = '1px solid #3498db'; // Blue border
    }

    // Style for custom checkboxes in notification settings
    const checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      const customCheckbox = checkbox.nextElementSibling; // The custom checkbox element
      if (customCheckbox) {
        customCheckbox.style.borderColor = '#3498db'; // Blue border color
        customCheckbox.style.backgroundColor = '#2a2a40'; // Dark background for the checkbox
      }
    });
  } else {
    // Apply light mode styles
    // Language select input style for light mode
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
      languageSelect.style.backgroundColor = '#fff'; // White background
      languageSelect.style.color = '#333'; // Dark text color for light mode
      languageSelect.style.border = '1px solid #ccc'; // Light border
    }

    // Style for custom checkboxes in light mode
    const checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      const customCheckbox = checkbox.nextElementSibling; // The custom checkbox element
      if (customCheckbox) {
        customCheckbox.style.borderColor = '#ccc'; // Light border color
        customCheckbox.style.backgroundColor = '#fff'; // White background for the checkbox
      }
    });
  }
}

// Call the function to apply styles when the page loads
window.addEventListener('DOMContentLoaded', (event) => {
  applyDarkModeStyles(); // Apply styles when the page loads

  // Optional: Reapply styles when switching between dark and light mode
  const themeToggle = document.getElementById('theme-toggle-switch');
  if (themeToggle) {
    themeToggle.addEventListener('change', function() {
      applyDarkModeStyles(); // Reapply styles when the theme changes
    });
  }
});
