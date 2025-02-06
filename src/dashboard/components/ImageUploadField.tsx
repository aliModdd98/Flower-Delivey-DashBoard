import { ImageIcon } from "lucide-react";
import React, { ComponentPropsWithoutRef, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { Input } from "./input";
import { Button } from "./button";

interface ImageInputProps {
  onImageChange: (file: File | null) => void;
  className?: string;
  defaultValue?: string | null;
}

export const ImageUploadField = ({
  onImageChange,
  className,
  defaultValue,
  name,
}: ImageInputProps & ComponentPropsWithoutRef<"input">) => {
  const [preview, setPreview] = useState<string | null>(defaultValue ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageChange(file);
    } else {
      setPreview(null);
      onImageChange(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn(
        "relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border-2 border-dashed border-gray-300 transition-colors hover:border-primary dark:border-gray-600 dark:hover:border-primary",
        className
      )}
      onClick={handleClick}
    >
      <Input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        name={name}
        ref={fileInputRef}
      />
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="mx-auto h-full max-h-full"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
          <ImageIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity hover:opacity-100">
        <Button
          variant="ghost"
          type="button"
          className="p-1 text-white hover:text-primary"
        >
          {preview ? "Change" : "Upload"}
        </Button>
      </div>
    </div>
  );
};
