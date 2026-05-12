"use client";

import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, X, CheckCircle } from "lucide-react";

interface Props {
  label: string;
  hint: string;
  value: string;
  field: string;
  onSet: (field: string, value: string) => void;
}

export default function PhotoUpload({ label, hint, value, field, onSet }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("Файл слишком большой. Максимум 10 МБ");
      return;
    }
    setError("");
    setUploading(true);

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error: uploadError } = await supabase.storage
      .from("burials")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setError("Ошибка загрузки. Попробуйте ещё раз.");
    } else {
      const { data: urlData } = supabase.storage.from("burials").getPublicUrl(data.path);
      onSet(field, urlData.publicUrl);
    }
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function clear() {
    onSet(field, "");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>{label}</label>
      <p className="text-xs" style={{ color: "var(--muted)" }}>{hint}</p>

      {value ? (
        <div className="relative rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
          <img src={value} alt="preview" className="w-full h-48 object-cover" />
          <button
            onClick={clear}
            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.6)" }}
          >
            <X size={14} color="white" />
          </button>
          <div className="absolute bottom-2 left-2 flex items-center gap-1 text-xs text-white bg-black/50 px-2 py-1 rounded-full">
            <CheckCircle size={12} />
            Загружено
          </div>
        </div>
      ) : (
        <div
          className="w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 py-10 cursor-pointer transition-opacity hover:opacity-70"
          style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          {uploading ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>Загружаем...</p>
          ) : (
            <>
              <Upload size={24} style={{ color: "var(--muted)" }} />
              <p className="text-sm" style={{ color: "var(--muted)" }}>Нажмите или перетащите фото</p>
              <p className="text-xs" style={{ color: "var(--border)" }}>JPG, PNG до 10 МБ</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
