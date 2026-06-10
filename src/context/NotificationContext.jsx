import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [confirm, setConfirm] = useState(null);
  const [confirmResolve, setConfirmResolve] = useState(null);

  const addNotification = useCallback((message, options = {}) => {
    const {
      type = 'info', // 'success', 'error', 'info', 'warning'
      duration = 5000,
      title = '',
    } = options;

    const id = Date.now();
    const notification = { id, message, title, type };

    setNotifications((prev) => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showConfirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      const {
        title = 'Konfirmasi',
        message = 'Apakah Anda yakin?',
        okText = 'Yakin',
        cancelText = 'Batal',
        danger = false,
      } = options;

      setConfirm({ title, message, okText, cancelText, danger });
      setConfirmResolve(() => resolve);
    });
  }, []);

  const removeConfirm = useCallback((result) => {
    if (confirmResolve) {
      confirmResolve(result);
    }
    setConfirm(null);
    setConfirmResolve(null);
  }, [confirmResolve]);

  return (
    <NotificationContext.Provider
      value={{
        addNotification,
        removeNotification,
        notifications,
        showConfirm,
        confirm,
        removeConfirm,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
