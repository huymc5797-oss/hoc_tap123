/**
 * STUDYVERSE - CONFIGURATION (GITHUB STATIC MODE)
 */
const CONFIG = {
  APP_NAME: 'STUDYVERSE',
  VERSION: '1.0.0',
  
  // Tự động phát hiện base path cho GitHub Pages
  BASE_URL: (() => {
    const path = window.location.pathname;
    if (path.includes('/studyverse/')) return '/studyverse/';
    return '/';
  })(),

  // LocalStorage Keys
  STORAGE_KEYS: {
    SESSION: 'studyverse_current_user',
    USERS: 'studyverse_registered_users',
    DOCUMENTS: 'studyverse_documents',
    FAVORITES: 'studyverse_favorites',
    FLASHCARDS: 'studyverse_flashcard_decks',
    QUIZZES: 'studyverse_quizzes',
    POMODORO_HISTORY: 'studyverse_pomo_history',
    TASKS: 'studyverse_tasks'
  }
};

// Hàm tiện ích điều hướng đường dẫn an toàn trên GitHub Pages
function getAbsolutePath(relativePath) {
  const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
  return `${CONFIG.BASE_URL}${cleanPath}`;
}
