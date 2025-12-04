import { useState, useCallback } from 'react';

export const useNotification = () => {
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });

  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ show: true, message, type });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification({ show: false, message: '', type: 'info' });
  }, []);

  return { notification, showNotification, hideNotification };
};
