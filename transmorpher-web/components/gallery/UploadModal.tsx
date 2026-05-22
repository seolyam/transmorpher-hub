'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { uploadLoadout } from '@/app/actions';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [className, setClassName] = useState('');
  const [exportString, setExportString] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setErrorMsg(null);
  };

  const handleSubmit = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!title) {
      setErrorMsg("Please enter a loadout title.");
      return;
    }
    if (!className) {
      setErrorMsg("Please select a WoW class.");
      return;
    }
    if (!file) {
      setErrorMsg("Please select or drop a screenshot.");
      return;
    }
    if (!exportString) {
      setErrorMsg("Please paste your Transmorpher export string.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("class", className);
      formData.append("exportString", exportString);
      formData.append("screenshot", file);

      const result = await uploadLoadout(formData);

      if (result.success) {
        setSuccessMsg("Loadout published successfully!");
        // Clear form
        setTitle('');
        setClassName('');
        setExportString('');
        setFile(null);
        setPreviewUrl(null);
        setTimeout(() => {
          onClose();
          setSuccessMsg(null);
        }, 1500);
      } else {
        setErrorMsg(result.error || "Failed to publish loadout.");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "An unexpected error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-[600px] bg-zinc-900 rounded-xl border border-zinc-800 shadow-glow-purple flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        style={{ borderTopColor: 'var(--color-epic-purple)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/50">
          <h2 className="font-space font-bold text-2xl text-white">Upload Transmog Loadout</h2>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors rounded-md p-1 hover:bg-zinc-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">
          {errorMsg && (
            <div className="p-3 bg-red-950/30 border border-red-900 text-red-400 rounded-md text-sm">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-uncommon-green/10 border border-uncommon-green/30 text-uncommon-green rounded-md text-sm">
              {successMsg}
            </div>
          )}
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-300">Loadout Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Shadowmourne ICC Set"
              className="bg-zinc-950 border border-zinc-800 rounded-md px-4 py-2.5 text-zinc-50 focus:outline-none focus:border-epic-purple focus:ring-1 focus:ring-epic-purple/50 transition-all placeholder:text-zinc-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-300">Class</label>
            <select 
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-md px-4 py-2.5 text-zinc-50 focus:outline-none focus:border-epic-purple focus:ring-1 focus:ring-epic-purple/50 transition-all appearance-none"
            >
              <option value="" disabled>Select Class</option>
              <option value="Warrior">Warrior</option>
              <option value="Paladin">Paladin</option>
              <option value="Hunter">Hunter</option>
              <option value="Rogue">Rogue</option>
              <option value="Priest">Priest</option>
              <option value="Death Knight">Death Knight</option>
              <option value="Shaman">Shaman</option>
              <option value="Mage">Mage</option>
              <option value="Warlock">Warlock</option>
              <option value="Druid">Druid</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-300">Screenshot</label>
            <div 
              className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md bg-zinc-950 transition-colors ${
                dragActive ? 'border-epic-purple bg-epic-purple/5' : 'border-zinc-800 hover:border-zinc-700'
              } ${previewUrl ? 'p-1 border-solid border-zinc-800' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input 
                ref={inputRef}
                type="file" 
                accept="image/*"
                className="hidden" 
                onChange={handleChange}
              />
              
              {previewUrl ? (
                <div className="relative w-full aspect-video rounded-sm overflow-hidden bg-zinc-900 group">
                  <Image 
                    src={previewUrl} 
                    alt="Preview" 
                    fill 
                    sizes="(max-width: 600px) 100vw, 600px"
                    className="object-contain" 
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                    <span className="text-sm font-medium text-white">Click to change</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center cursor-pointer pointer-events-none gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-zinc-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                  <p className="text-sm text-zinc-400">Drag and drop your in-game screenshot here</p>
                  <p className="text-xs text-zinc-600 mt-1">JPEG, PNG up to 5MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-300">Export String</label>
            <textarea 
              value={exportString}
              onChange={(e) => setExportString(e.target.value)}
              placeholder="Paste your Transmorpher addon export string here..."
              rows={4}
              className="bg-zinc-950 border border-zinc-800 rounded-md px-4 py-3 text-zinc-50 font-mono text-xs focus:outline-none focus:border-epic-purple focus:ring-1 focus:ring-epic-purple/50 transition-all placeholder:text-zinc-600 resize-none"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-6 sm:py-4 bg-zinc-950/50 border-t border-zinc-800 flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isUploading}
            className="px-5 py-2 text-sm font-medium text-white bg-legendary-orange hover:brightness-110 hover:shadow-glow-orange rounded-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Publishing...
              </>
            ) : 'Publish Loadout'}
          </button>
        </div>

      </div>
    </div>
  );
}
