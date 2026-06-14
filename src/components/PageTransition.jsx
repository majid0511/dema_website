/**
 * Wrapper untuk setiap halaman.
 * Digunakan bersama View Transitions API di App.jsx.
 */
export default function PageTransition({ children }) {
  return (
    <div className="view-transition-wrapper">
      {children}
    </div>
  );
}