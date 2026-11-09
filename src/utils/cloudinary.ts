export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

const STORAGE_KEY = 'edenleaf_cloudinary_config';

// Default configuration with fallbacks (reads from Vite env or localStorage)
export const getCloudinaryConfig = (): CloudinaryConfig => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.cloudName && parsed.uploadPreset) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load Cloudinary config', e);
    }
  }

  const metaEnv = (import.meta as any).env || {};
  return {
    cloudName: (metaEnv.VITE_CLOUDINARY_CLOUD_NAME as string) || 'edenleaf-botanicals',
    uploadPreset: (metaEnv.VITE_CLOUDINARY_UPLOAD_PRESET as string) || 'edenleaf_unsigned'
  };
};

export const saveCloudinaryConfig = (config: CloudinaryConfig): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }
};

export const isCloudinaryConfigured = (): boolean => {
  const config = getCloudinaryConfig();
  return Boolean(config.cloudName && config.uploadPreset);
};

export interface UploadProgressCallback {
  (percentage: number): void;
}

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

/**
 * Uploads a local file directly from the browser to Cloudinary CDN
 * using an unsigned upload preset.
 */
export const uploadToCloudinary = (
  file: File,
  onProgress?: UploadProgressCallback,
  overrideConfig?: Partial<CloudinaryConfig>
): Promise<CloudinaryUploadResponse> => {
  return new Promise((resolve, reject) => {
    const config = {
      ...getCloudinaryConfig(),
      ...overrideConfig
    };

    if (!config.cloudName || !config.uploadPreset) {
      return reject(
        new Error(
          'Cloudinary is not configured. Please provide your Cloud Name and Unsigned Upload Preset in Admin Settings.'
        )
      );
    }

    const url = `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);
    formData.append('folder', 'edenleaf_catalog');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response: CloudinaryUploadResponse = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (e) {
          reject(new Error('Failed to parse Cloudinary response JSON.'));
        }
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          reject(new Error(errData.error?.message || `Cloudinary upload failed with HTTP status ${xhr.status}`));
        } catch {
          reject(new Error(`Cloudinary upload failed with HTTP status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error occurred during Cloudinary upload. Check your internet connection and Cloudinary CORS settings.'));
    };

    xhr.send(formData);
  });
};

/**
 * Automatically applies Cloudinary smart transformations (format auto, quality auto, resize)
 * if the URL is hosted on Cloudinary.
 */
export const getOptimizedCloudinaryUrl = (
  url: string,
  options?: {
    width?: number;
    height?: number;
    quality?: string | number;
    crop?: string;
  }
): string => {
  if (!url || !url.includes('res.cloudinary.com')) {
    return url;
  }

  const { width = 800, quality = 'auto', crop = 'fill' } = options || {};

  // Insert transformations right after /image/upload/
  const uploadToken = '/image/upload/';
  const index = url.indexOf(uploadToken);
  if (index === -1) return url;

  const prefix = url.substring(0, index + uploadToken.length);
  const suffix = url.substring(index + uploadToken.length);

  // If already has transformation parameters, avoid duplicating
  if (/^[a-z]_[a-z0-9_,]+(\/)/i.test(suffix)) {
    return url;
  }

  const transformation = `f_auto,q_${quality},w_${width},c_${crop}/`;
  return `${prefix}${transformation}${suffix}`;
};

