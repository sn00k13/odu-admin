'use client';

import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (url: string) => void;
}

const CLOUD_NAME     = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET  = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function CloudinaryUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState('');
  const [dragOver, setDragOver]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setError('Cloudinary env vars are not configured.');
      return;
    }

    setUploading(true);
    setError('');

    const body = new FormData();
    body.append('file', file);
    body.append('upload_preset', UPLOAD_PRESET);

    try {
      const res  = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body },
      );
      const data = await res.json();

      if (data.secure_url) {
        onChange(data.secure_url);
      } else {
        setError(data.error?.message ?? 'Upload failed.');
      }
    } catch {
      setError('Upload failed — check your connection and Cloudinary settings.');
    } finally {
      setUploading(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = '';
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  }

  if (value) {
    return (
      <div className="relative rounded-lg overflow-hidden border border-gray-200 group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt="Cover preview" className="w-full h-52 object-cover" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow hover:bg-red-50 hover:text-red-600 transition-colors"
          title="Remove image"
        >
          <X size={14} />
        </button>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-2 right-2 bg-white text-gray-700 text-xs font-medium px-3 py-1.5 rounded shadow hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100"
        >
          Replace
        </button>
        <input ref={inputRef} type="file" accept="image/*" onChange={onInputChange} className="hidden" />
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
          uploading
            ? 'border-gray-200 bg-gray-50 cursor-default'
            : dragOver
            ? 'border-red-400 bg-red-50 cursor-copy'
            : 'border-gray-300 hover:border-red-400 hover:bg-red-50 cursor-pointer'
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <div className="h-8 w-8 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin" />
            <span className="text-sm">Uploading to Cloudinary…</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Upload size={22} />
            <p className="text-sm">
              <span className="font-medium text-gray-600">Click to upload</span>{' '}
              or drag and drop
            </p>
            <p className="text-xs">PNG, JPG, WEBP — max 10 MB</p>
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" onChange={onInputChange} className="hidden" />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
