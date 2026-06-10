import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';

export default function ConfirmDialog() {
  const { confirm, removeConfirm } = useNotification();

  if (!confirm) return null;

  return (
    <AnimatePresence>
      {confirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => removeConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-white rounded-lg shadow-2xl p-6 max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">{confirm.title}</h3>
            <p className="text-gray-600 text-sm mb-6">{confirm.message}</p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => removeConfirm(false)}
                className="px-4 py-2 rounded-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                {confirm.cancelText || 'Batal'}
              </button>
              <button
                onClick={() => removeConfirm(true)}
                className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                  confirm.danger
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {confirm.okText || 'Yakin'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
