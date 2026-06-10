/**
 * useAuth — hook untuk mengelola state autentikasi admin.
 *
 * Menyediakan:
 * - user     : objek user Firebase (null jika belum login)
 * - loading  : boolean, true saat sedang cek status login
 * - login()  : fungsi login dengan email + password
 * - logout() : fungsi logout
 * - isAdmin  : boolean shorthand apakah user sudah login
 *
 * Digunakan oleh:
 * - AdminRoute.jsx  → redirect ke login jika belum masuk
 * - AdminLayout.jsx → tampilkan email user + tombol logout
 *
 * Contoh pemakaian:
 *   const { user, login, logout, isAdmin } = useAuth();
 */
import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export function useAuth() {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true); // true sampai Firebase konfirmasi status

  useEffect(() => {
    /**
     * onAuthStateChanged adalah Firebase listener.
     * Dipanggil otomatis setiap kali:
     * - Halaman pertama kali dibuka (cek session yang tersimpan)
     * - User berhasil login
     * - User logout
     *
     * Return-nya adalah fungsi unsubscribe — dipanggil
     * saat komponen unmount agar tidak ada memory leak.
     */
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Login admin dengan email dan password.
   * Lempar error jika credentials salah — tangani di komponen pemanggil.
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<UserCredential>}
   */
  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  /**
   * Logout dan hapus session Firebase.
   * @returns {Promise<void>}
   */
  async function logout() {
    return signOut(auth);
  }

  return {
    user,
    loading,
    login,
    logout,
    isAdmin: !!user, // true jika sudah login
  };
}
