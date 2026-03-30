import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

/**
 * App — root component.
 * Declares all application routes:
 *   /              → HomePage   (GitHub user search)
 *   /profile/:username → ProfilePage (dynamic user profile)
 *   *              → redirect to home
 */
function App() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = t('app.title');
  }, [t, i18n.language]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        {/* Catch-all: unknown routes redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
