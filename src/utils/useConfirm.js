/**
 * Confirm Dialog Hook - Promise-based confirmation
 * Usage:
 *   const { confirm } = useConfirm();
 *   const agreed = await confirm({ message: 'Delete this item?' });
 */
import { useNotification } from '../context/NotificationContext';

export function useConfirm() {
  const { showConfirm } = useNotification();

  const confirm = async (options = {}) => {
    const {
      title = 'Konfirmasi',
      message = 'Apakah Anda yakin?',
      okText = 'Yakin',
      cancelText = 'Batal',
      danger = false,
    } = options;

    return showConfirm({
      title,
      message,
      okText,
      cancelText,
      danger,
    });
  };

  return { confirm };
}
