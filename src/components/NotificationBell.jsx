import useNotificationSubscribe from '../hooks/useNotificationSubscribe';

export default function NotificationBell() {
  const { subscribed, loading, subscribe, unsubscribe } = useNotificationSubscribe();

  if (loading) {
    return (
      <span className="w-7 h-7 rounded-full bg-gray-100 animate-pulse inline-block" />
    );
  }

  if (subscribed) {
    return (
      <button
        onClick={unsubscribe}
        title="Nonaktifkan notifikasi"
        className="relative w-8 h-8 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span className="absolute top-0 right-0 w-2 h-2 bg-primary-500 rounded-full" />
      </button>
    );
  }

  return (
    <button
      onClick={subscribe}
      title="Aktifkan notifikasi"
      className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-colors"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    </button>
  );
}
