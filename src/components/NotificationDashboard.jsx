import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';

export default function NotificationDashboard() {
  const { notifications, removeNotification } = useNotification();

  const getTypeConfig = (type) => {
    const configs = {
      success: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: '✅',
        text: 'text-green-800',
        title: 'text-green-900',
      },
      error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: '❌',
        text: 'text-red-800',
        title: 'text-red-900',
      },
      warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: '⚠️',
        text: 'text-yellow-800',
        title: 'text-yellow-900',
      },
      info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'ℹ️',
        text: 'text-blue-800',
        title: 'text-blue-900',
      },
    };
    return configs[type] || configs.info;
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm space-y-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notif) => {
          const config = getTypeConfig(notif.type);
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 400, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className={`${config.bg} ${config.border} border rounded-lg shadow-lg p-4 pointer-events-auto`}
            >
              <div className="flex gap-3">
                <span className="text-lg flex-shrink-0">{config.icon}</span>
                <div className="flex-1 min-w-0">
                  {notif.title && (
                    <p className={`font-semibold ${config.title}`}>{notif.title}</p>
                  )}
                  <p className={`text-sm ${config.text}`}>{notif.message}</p>
                </div>
                <button
                  onClick={() => removeNotification(notif.id)}
                  className={`flex-shrink-0 font-bold ${config.text} hover:opacity-70`}
                >
                  ✕
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
