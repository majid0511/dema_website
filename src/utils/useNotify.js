/**
 * Notification Utility - Uses Context-based Dashboard (in-app toasts)
 * Desktop: Shows as in-app toast notification
 * Mobile: Same toast system
 */
import { useNotification } from '../context/NotificationContext';

export function useNotify() {
  const { addNotification } = useNotification();

  const notify = (title, options = {}) => {
    const { message = '', type = 'info', duration = 5000 } = options;
    addNotification(message, { type, duration, title });
  };

  const notifySuccess = (title, message = '') => {
    notify(title, { message, type: 'success' });
  };

  const notifyError = (title, message = '') => {
    notify(title, { message, type: 'error' });
  };

  const notifyInfo = (title, message = '') => {
    notify(title, { message, type: 'info' });
  };

  const notifyWarning = (title, message = '') => {
    notify(title, { message, type: 'warning' });
  };

  return { notify, notifySuccess, notifyError, notifyInfo, notifyWarning };
}
