import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-400 bg-gray-50 px-4">
          <p className="text-5xl">⚠️</p>
          <h2 className="text-xl font-bold text-gray-700">Terjadi kesalahan</h2>
          <p className="text-sm text-center max-w-sm">
            Halaman ini mengalami error. Coba muat ulang atau kembali ke beranda.
          </p>
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-outline text-sm"
            >
              Coba Lagi
            </button>
            <a href="/" className="btn-primary text-sm">Ke Beranda</a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
