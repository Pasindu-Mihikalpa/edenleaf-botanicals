import React, { useState, useRef } from 'react';
import { UploadCloud, Check, AlertCircle, Loader2, Image as ImageIcon, Link, X, Settings } from 'lucide-react';
import { uploadToCloudinary, isCloudinaryConfigured } from '../../utils/cloudinary';

interface CloudinaryUploaderProps {
  value: string;
  onChange: (url: string) => void;
  onOpenSettings?: () => void;
}

export const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({
  value,
  onChange,
  onOpenSettings
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<'upload' | 'manual'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const configured = isCloudinaryConfigured();

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP, AVIF).');
      return;
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 10MB limit.');
      return;
    }

    setErrorMessage(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const res = await uploadToCloudinary(file, (percent) => {
        setUploadProgress(percent);
      });
      onChange(res.secure_url);
    } catch (err: any) {
      console.error('Cloudinary upload error:', err);
      setErrorMessage(
        err.message || 'Upload failed. Check your Cloudinary Cloud Name and Unsigned Upload Preset in Settings.'
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Mode Switch & Settings Button */}
      <div className="flex items-center justify-between text-xs">
        <label className="text-emerald-200 font-semibold flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-[#C59B27]" />
          <span>Cultivar Photography *</span>
        </label>

        <div className="flex items-center gap-2">
          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="text-[11px] text-[#DFB847] hover:text-white flex items-center gap-1 font-mono transition-colors"
              title="Cloudinary Credentials Settings"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Cloudinary Config</span>
            </button>
          )}

          <div className="flex items-center bg-[#05130D] rounded-xl p-0.5 border border-[#C59B27]/25 text-[11px]">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                mode === 'upload'
                  ? 'bg-[#C59B27] text-[#0F2E1E] font-bold'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              Cloudinary Upload
            </button>
            <button
              type="button"
              onClick={() => setMode('manual')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                mode === 'manual'
                  ? 'bg-[#C59B27] text-[#0F2E1E] font-bold'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              Direct URL
            </button>
          </div>
        </div>
      </div>

      {/* Manual URL Input Mode */}
      {mode === 'manual' && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C59B27]" />
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/... or https://res.cloudinary.com/..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#05130D] border border-[#C59B27]/30 text-white focus:outline-none focus:border-[#C59B27] text-xs font-mono"
            />
          </div>
          {value && (
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#C59B27]/40 shrink-0 bg-[#05130D]">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}

      {/* Cloudinary Drag-and-Drop Upload Mode */}
      {mode === 'upload' && (
        <div>
          {value ? (
            /* Current Image Selected Display with Replace / Remove Actions */
            <div className="relative p-3 rounded-2xl bg-[#05130D] border border-[#C59B27]/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={value}
                  alt="Uploaded preview"
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#C59B27]/30"
                />
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-white block truncate">
                    Image Attached Successfully
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono block truncate">
                    {value.includes('cloudinary') ? 'Hosted on Cloudinary CDN' : value}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3 py-1.5 rounded-xl bg-[#1A4D34] hover:bg-[#256847] text-[#DFB847] text-xs font-semibold transition-colors"
                >
                  Replace Photo
                </button>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="p-1.5 text-rose-400 hover:text-white rounded-lg hover:bg-rose-950/40"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Drag and Drop Dropzone */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-[#DFB847] bg-[#1A4D34]/30 scale-[1.01]'
                  : 'border-[#C59B27]/40 bg-[#05130D] hover:border-[#DFB847] hover:bg-[#071911]'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#0A1C13] border border-[#C59B27]/30 flex items-center justify-center text-[#DFB847]">
                {isUploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-[#DFB847]" />
                ) : (
                  <UploadCloud className="w-6 h-6 text-[#DFB847]" />
                )}
              </div>

              {isUploading ? (
                <div className="space-y-2 w-full max-w-xs">
                  <div className="flex items-center justify-between text-[11px] text-emerald-300">
                    <span>Uploading to Cloudinary...</span>
                    <span className="font-mono font-bold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0A1C13] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#C59B27] to-[#DFB847] transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-xs font-semibold text-white">
                    Drag and drop a cultivar image, or <span className="text-[#DFB847] underline">browse files</span>
                  </p>
                  <p className="text-[10px] text-emerald-200/60 font-light">
                    Direct upload to Cloudinary CDN (PNG, JPG, WEBP, AVIF up to 10MB)
                  </p>
                </>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-600/50 text-rose-300 text-xs flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="px-2 py-1 bg-rose-900 hover:bg-rose-800 text-white rounded-lg text-[10px] uppercase font-bold shrink-0"
            >
              Configure
            </button>
          )}
        </div>
      )}
    </div>
  );
};

