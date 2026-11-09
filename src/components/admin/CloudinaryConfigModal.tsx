import React, { useState } from 'react';
import { Cloud, X, Key, ShieldCheck, Check, ExternalLink, HelpCircle } from 'lucide-react';
import { getCloudinaryConfig, saveCloudinaryConfig, CloudinaryConfig } from '../../utils/cloudinary';

interface CloudinaryConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (config: CloudinaryConfig) => void;
}

export const CloudinaryConfigModal: React.FC<CloudinaryConfigModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const currentConfig = getCloudinaryConfig();
  const [cloudName, setCloudName] = useState(currentConfig.cloudName || '');
  const [uploadPreset, setUploadPreset] = useState(currentConfig.uploadPreset || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const config: CloudinaryConfig = {
      cloudName: cloudName.trim(),
      uploadPreset: uploadPreset.trim()
    };
    saveCloudinaryConfig(config);
    setSavedSuccess(true);
    if (onSave) onSave(config);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/85 backdrop-blur-md" />

      {/* Modal Dialog in Obsidian Evergreen */}
      <div className="relative w-full max-w-lg bg-[#0A1C13] border border-[#C59B27]/40 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 text-[#F8F6F0] animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-[#1A4D34]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#05130D] border border-[#C59B27]/30 flex items-center justify-center text-[#DFB847]">
              <Cloud className="w-5 h-5 text-[#DFB847]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Cloudinary Media Credentials
              </h3>
              <p className="text-[11px] text-emerald-200/70">
                Direct browser-to-CDN media upload configuration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-emerald-300 hover:text-white rounded-xl hover:bg-[#1A4D34] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          <div>
            <label className="text-emerald-200 block mb-1 font-semibold flex items-center justify-between">
              <span>Cloud Name *</span>
              <a
                href="https://console.cloudinary.com/settings/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-[#DFB847] hover:underline flex items-center gap-1 font-normal font-mono"
              >
                <span>Find in Cloudinary Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <div className="relative">
              <Cloud className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C59B27]" />
              <input
                type="text"
                required
                value={cloudName}
                onChange={(e) => setCloudName(e.target.value)}
                placeholder="e.g. edenleaf-botanicals or dxyz123abc"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#05130D] border border-[#C59B27]/30 text-white placeholder:text-white/30 focus:outline-none focus:border-[#DFB847] font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-emerald-200 block mb-1 font-semibold flex items-center justify-between">
              <span>Unsigned Upload Preset *</span>
              <a
                href="https://console.cloudinary.com/settings/upload"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-[#DFB847] hover:underline flex items-center gap-1 font-normal font-mono"
              >
                <span>View Upload Presets</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C59B27]" />
              <input
                type="text"
                required
                value={uploadPreset}
                onChange={(e) => setUploadPreset(e.target.value)}
                placeholder="e.g. edenleaf_unsigned or ml_default"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#05130D] border border-[#C59B27]/30 text-white placeholder:text-white/30 focus:outline-none focus:border-[#DFB847] font-mono text-xs"
              />
            </div>
          </div>

          {/* Quick Setup Instructions Callout */}
          <div className="p-3.5 rounded-2xl bg-[#05130D] border border-[#C59B27]/25 space-y-2 text-[11px] text-emerald-100/80">
            <div className="flex items-center gap-1.5 font-bold text-[#DFB847]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>30-Second Cloudinary Setup:</span>
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-emerald-200/70 font-light leading-relaxed">
              <li>Log in to your free account at <strong className="text-white">cloudinary.com</strong>.</li>
              <li>Go to <strong className="text-white">Settings (⚙️) ➔ Upload</strong> and scroll to <strong className="text-white">Upload presets</strong>.</li>
              <li>Click <strong className="text-white">Add upload preset</strong>, set Signing Mode to <strong className="text-[#DFB847]">Unsigned</strong>, and save.</li>
              <li>Copy your <strong className="text-white">Cloud Name</strong> and <strong className="text-white">Preset Name</strong> into the fields above!</li>
            </ol>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-[#1A4D34] border border-[#C59B27] text-white flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-[#DFB847]" />
              <span>Cloudinary configuration saved successfully!</span>
            </div>
          )}

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#1A4D34]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#05130D] hover:bg-[#1A4D34] text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#C59B27] hover:bg-[#DFB847] text-[#0F2E1E] font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Save Credentials</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

