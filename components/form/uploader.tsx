"use client";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function Uploader({
  defaultValue,
  name,
  setChanged
}: {
  defaultValue: string | null;
  name: "image" | "logo";
  setChanged?: (changed: boolean) => void;
}) {
  const aspectRatio = name === "image" ? "aspect-video" : "aspect-square";

  const inputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState({
    [name]: defaultValue
  });

  const [dragActive, setDragActive] = useState(false);

  const handleUpload = (file: File | null) => {
    if (file) {
      if (file.size / 1024 / 1024 > 50) {
        toast.error("File size too big (max 50MB)");
      } else if (
        !file.type.includes("png") &&
        !file.type.includes("jpg") &&
        !file.type.includes("jpeg")
      ) {
        toast.error("Invalid file type (must be .png, .jpg, or .jpeg)");
      } else {
        if (setChanged) setChanged(true);
        const reader = new FileReader();
        reader.onload = (e) => {
          setData((prev) => ({ ...prev, [name]: e.target?.result as string }));
        };

        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor={`${name}-upload`}
        className={cn(
          "group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-stone-300/95 bg-stone-50/80 p-6 transition-colors hover:border-stone-400"
        )}
      >
        <div
          className="absolute z-[5] size-full rounded-md"
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);

            const file = e.dataTransfer.files && e.dataTransfer.files[0];
            inputRef.current!.files = e.dataTransfer.files; // set input file to dropped file
            handleUpload(file);
          }}
        />
        {data[name] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data[name] as string}
            alt="Preview"
            className={cn(
              "h-full max-h-48 w-auto rounded-md object-cover object-center shadow-border-sm",
              {
                "max-w-screen-md": aspectRatio === "aspect-video",
                "max-w-xs": aspectRatio === "aspect-square",
                aspectRatio
              }
            )}
          />
        ) : (
          <div
            className={`${
              dragActive ? "border-2 border-black" : ""
            }2 z-[3] flex size-full flex-col items-center justify-center rounded-md px-10 transition-all ${
              data[name]
                ? "bg-white/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md"
                : "bg-white opacity-100 hover:bg-stone-50"
            }`}
          >
            <svg
              className={`${
                dragActive ? "scale-110" : "scale-100"
              } size-7 text-stone-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
              <path d="M12 12v9"></path>
              <path d="m16 16-4-4-4 4"></path>
            </svg>
            <p className="mt-2 text-center text-sm text-stone-500">
              Drag and drop or click to upload.
            </p>
            <p className="mt-2 text-center text-sm text-stone-500">Max file size: 50MB</p>
            <span className="sr-only">Photo upload</span>
          </div>
        )}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <input
          id={`${name}-upload`}
          ref={inputRef}
          name={name}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.currentTarget.files && e.currentTarget.files[0];
            handleUpload(file);
          }}
        />
      </div>
    </div>
  );
}
