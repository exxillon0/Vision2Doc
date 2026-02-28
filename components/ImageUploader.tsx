'use client';

import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {Upload, Image as ImageIcon, X} from 'lucide-react';
import {motion, AnimatePresence} from 'motion/react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onClear: () => void;
}

export function ImageUploader({onImageSelect, onClear}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
    multiple: false,
  });

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onClear();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="dropzone"
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center gap-4
              ${isDragActive ? 'border-emerald-500 bg-emerald-50/50' : 'border-zinc-300 hover:border-zinc-400 bg-white'}`}
          >
            <input {...getInputProps()} />
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center">
              <Upload className="w-8 h-8 text-zinc-500" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-zinc-900">
                {isDragActive ? 'Drop the image here' : 'Click or drag image to upload'}
              </p>
              <p className="text-sm text-zinc-500 mt-1">Supports JPG, JPEG, PNG</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{opacity: 0, scale: 0.95}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.95}}
            className="relative rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-sm"
          >
            <img src={preview} alt="Preview" className="w-full h-auto max-h-[400px] object-contain bg-zinc-50" />
            <button
              onClick={handleClear}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-4 border-t border-zinc-100 flex items-center gap-2 text-zinc-500">
              <ImageIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Image ready for processing</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
