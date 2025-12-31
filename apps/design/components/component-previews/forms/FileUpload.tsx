'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, Image, FileText, Film } from 'lucide-react';
import { Customization } from '@/types/customization';

type FileUploadProps = {
  customization: Customization;
};

type UploadedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
};

export function FileUpload({ customization }: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Film;
    return FileText;
  };

  const simulateUpload = (file: File) => {
    const newFile: UploadedFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'uploading',
    };

    setFiles((prev) => [...prev, newFile]);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === newFile.id ? { ...f, progress: 100, status: 'complete' } : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === newFile.id ? { ...f, progress } : f))
        );
      }
    }, 300);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach(simulateUpload);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      selectedFiles.forEach(simulateUpload);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="w-full max-w-sm" style={baseStyle}>
      <label
        className="block mb-2 text-sm font-medium"
        style={{ color: `${customization.textColor}90` }}
      >
        Upload Files
      </label>

      {/* Drop Zone */}
      <motion.div
        className="relative border-2 border-dashed p-8 text-center cursor-pointer transition-colors"
        style={{
          borderColor: isDragging ? customization.primaryColor : `${customization.textColor}30`,
          borderRadius: `${customization.borderRadius}px`,
          backgroundColor: isDragging
            ? `${customization.primaryColor}${opacityToHex(glassOpacity * 0.7)}`
            : `${customization.backgroundColor}${opacityToHex(glassOpacity * 2)}`,
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        animate={{
          scale: isDragging ? 1.02 : 1,
          borderColor: isDragging ? customization.primaryColor : `${customization.textColor}30`,
        }}
        whileHover={{ borderColor: customization.primaryColor }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />

        <motion.div
          className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
          style={{
            background: `linear-gradient(135deg, ${customization.primaryColor}${opacityToHex(glassOpacity * 1.3)}, ${customization.secondaryColor}${opacityToHex(glassOpacity * 1.3)})`,
          }}
          animate={{
            y: isDragging ? -5 : 0,
          }}
        >
          <Upload
            className="w-6 h-6"
            style={{ color: customization.primaryColor }}
          />
        </motion.div>

        <p style={{ color: customization.textColor }}>
          <span className="font-semibold" style={{ color: customization.primaryColor }}>
            Click to upload
          </span>{' '}
          or drag and drop
        </p>
        <p className="text-sm mt-1" style={{ color: `${customization.textColor}50` }}>
          PNG, JPG, PDF up to 10MB
        </p>

        {/* Drag overlay */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                backgroundColor: `${customization.primaryColor}${opacityToHex(glassOpacity * 0.7)}`,
                borderRadius: `${customization.borderRadius}px`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Upload className="w-8 h-8" style={{ color: customization.primaryColor }} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* File List */}
      <AnimatePresence mode="popLayout">
        {files.length > 0 && (
          <motion.div
            className="mt-4 space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {files.map((file) => {
              const FileIcon = getFileIcon(file.type);

              return (
                <motion.div
                  key={file.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, transition: { duration: 0.15 } }}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                  style={{
                    borderColor: `${customization.textColor}20`,
                    backgroundColor: `${customization.textColor}05`,
                    borderRadius: `${customization.borderRadius}px`,
                  }}
                >
                  {/* File Icon */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${customization.primaryColor}${opacityToHex(glassOpacity)}` }}
                  >
                    <FileIcon className="w-5 h-5" style={{ color: customization.primaryColor }} />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: customization.textColor }}
                    >
                      {file.name}
                    </p>
                    <p className="text-xs" style={{ color: `${customization.textColor}50` }}>
                      {formatFileSize(file.size)}
                    </p>
                    {/* Progress Bar */}
                    {file.status === 'uploading' && (
                      <div
                        className="mt-1 h-1 rounded-full overflow-hidden"
                        style={{ backgroundColor: `${customization.textColor}20` }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${file.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Status / Actions */}
                  <div className="flex-shrink-0">
                    {file.status === 'complete' ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </motion.div>
                    ) : (
                      <span className="text-xs" style={{ color: customization.primaryColor }}>
                        {Math.round(file.progress)}%
                      </span>
                    )}
                  </div>

                  {/* Remove Button */}
                  <motion.button
                    type="button"
                    className="flex-shrink-0 p-1 rounded-md"
                    style={{ color: `${customization.textColor}50` }}
                    onClick={() => removeFile(file.id)}
                    whileHover={{ scale: 1.1, color: '#ef4444' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-4 text-xs opacity-50 text-center" style={{ color: customization.textColor }}>
        Drag & drop file upload with progress
      </p>
    </div>
  );
}
