import { useState, useRef } from 'react';
import axios from 'axios';

export default function ImageUpload({
  onUpload,
  currentUrl,
  label = 'Gambar',
}) {
  const [preview, setPreview] = useState(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const inputRef = useRef();

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview lokal
    setPreview(URL.createObjectURL(file));

    setUploading(true);
    setError('');
    setProgress(0);

    try {
      const formData = new FormData();

      formData.append('file', file);

      // Upload preset Cloudinary
      formData.append('upload_preset', 'dema_upload');

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dfmp92e7s/image/upload',
        formData,
        {
          onUploadProgress: (event) => {
            const percent = Math.round(
              (event.loaded * 100) / event.total
            );

            setProgress(percent);
          },
        }
      );

      // URL hasil upload
      let imageUrl = response.data.secure_url;

      // Optimasi otomatis Cloudinary
      imageUrl = imageUrl.replace(
        '/upload/',
        '/upload/f_auto,q_auto/'
      );

      // Simpan ke parent component
      onUpload(imageUrl);

      // Preview final
      setPreview(imageUrl);

    } catch (err) {
      console.error(err);

      setError('Gagal upload gambar');
      setPreview(currentUrl || null);

    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {/* Area upload */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-4 transition-colors
          ${
            uploading
              ? 'cursor-wait border-primary-300'
              : 'cursor-pointer border-gray-200 hover:border-primary-300 group'
          }`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-xl"
          />
        ) : (
          <div
            className="h-48 flex flex-col items-center justify-center text-gray-400
                       group-hover:text-primary-400 transition-colors"
          >
            <span className="text-4xl mb-2">📷</span>

            <p className="text-sm font-medium">
              Klik untuk pilih gambar
            </p>

            <p className="text-xs mt-1 text-gray-300">
              JPG, PNG, WebP · Maks 5MB
            </p>
          </div>
        )}

        {/* Overlay progress */}
        {uploading && (
          <div
            className="absolute inset-0 bg-white/85 rounded-2xl flex flex-col
                       items-center justify-center gap-3"
          >
            <div className="w-36 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-sm text-gray-600 font-medium">
              Mengupload... {progress}%
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 mt-1.5">
          ⚠️ {error}
        </p>
      )}

      {/* Hapus gambar */}
      {preview && !uploading && (
        <button
          type="button"
          onClick={() => {
            setPreview(null);
            onUpload('');
          }}
          className="mt-2 text-xs text-red-400 hover:text-red-600 transition-colors"
        >
          ✕ Hapus gambar
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}