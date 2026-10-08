'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, Image as ImageIcon, Loader2, Sparkles, Check, X } from 'lucide-react';
import { EDITORIAL_IMAGE_PRESETS } from '@/lib/presets';

interface ImageUploaderProps {
  value: string;
  altText: string;
  caption?: string;
  onChangeUrl: (url: string) => void;
  onChangeAlt: (alt: string) => void;
  onChangeCaption: (caption: string) => void;
}

export default function ImageUploader({
  value,
  altText,
  caption,
  onChangeUrl,
  onChangeAlt,
  onChangeCaption,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onChangeUrl(data.url);
      if (!altText) {
        onChangeAlt(file.name.replace(/\.[^/.]+$/, ''));
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      setError(err?.message || 'Failed to upload image. Please check file type and size.');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4 bg-neutral-50 p-5 rounded-xl border border-neutral-200">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
          Hero Article Image <span className="text-[#E50914]">*</span>
        </label>
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="text-xs font-semibold text-[#E50914] hover:text-red-700 flex items-center gap-1 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {showPresets ? 'Hide Presets' : 'Editorial Photo Library'}
        </button>
      </div>

      {/* Preset Library Drawer */}
      {showPresets && (
        <div className="p-3 bg-white border border-neutral-200 rounded-lg space-y-3">
          <p className="text-[11px] font-bold uppercase text-neutral-400">
            High-Resolution Editorial Press Stills:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {EDITORIAL_IMAGE_PRESETS.map((preset) => (
              <button
                key={preset.title}
                type="button"
                onClick={() => {
                  onChangeUrl(preset.url);
                  onChangeAlt(preset.title);
                  if (preset.caption) onChangeCaption(preset.caption);
                  setShowPresets(false);
                }}
                className="group text-left border border-neutral-200 rounded-md overflow-hidden hover:border-[#E50914] transition-all p-1 bg-neutral-50"
              >
                <div className="relative aspect-video w-full rounded overflow-hidden">
                  <Image src={preset.url} alt={preset.title} fill className="object-cover" sizes="120px" />
                </div>
                <p className="mt-1 text-[11px] font-bold text-neutral-800 line-clamp-1 group-hover:text-[#E50914]">
                  {preset.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview & Upload Drag Box */}
      {value ? (
        <div className="space-y-3">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-neutral-200 bg-neutral-900 group">
            <Image
              src={value}
              alt={altText || 'Hero image preview'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
            <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white text-neutral-900 text-xs font-bold rounded shadow-md hover:bg-neutral-100 transition-colors"
              >
                Replace Image
              </button>
              <button
                type="button"
                onClick={() => onChangeUrl('')}
                className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded shadow-md hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-neutral-300 hover:border-[#E50914] rounded-xl p-8 text-center cursor-pointer transition-colors bg-white group"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-[#E50914]" />
              <p className="text-sm font-semibold text-neutral-700">Uploading and storing image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5">
              <div className="w-12 h-12 rounded-full bg-red-50 text-[#E50914] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-800">
                  Click to upload or drag and drop image
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  PNG, JPG, WebP, AVIF or GIF up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded border border-red-200">
          {error}
        </p>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />

      {/* Direct URL input fallback */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
          Or paste direct Image URL
        </label>
        <input
          type="url"
          value={value}
          onChange={(e) => onChangeUrl(e.target.value)}
          placeholder="https://images.unsplash.com/... or /uploads/..."
          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-900 focus:outline-none focus:border-[#E50914]"
        />
      </div>

      {/* Alt Text and Caption */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
            Alt Text (Accessibility & SEO)
          </label>
          <input
            type="text"
            value={altText}
            onChange={(e) => onChangeAlt(e.target.value)}
            placeholder="Descriptive explanation of the visual scene"
            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-900 focus:outline-none focus:border-[#E50914]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
            Image Caption (Optional)
          </label>
          <input
            type="text"
            value={caption || ''}
            onChange={(e) => onChangeCaption(e.target.value)}
            placeholder="Photo credit or scene context"
            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-900 focus:outline-none focus:border-[#E50914]"
          />
        </div>
      </div>
    </div>
  );
}
