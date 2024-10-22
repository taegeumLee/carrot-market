"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { uploadProduct } from "./action";
import { useFormState } from "react-dom";

export default function UploadProduct() {
  const [preview, setPreview] = useState("");
  const [state, action] = useFormState(uploadProduct, null);
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
  };
  return (
    <div>
      <form className="p-5 flex flex-col gap-5 " action={action}>
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex justify-center items-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer"
        >
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <PhotoIcon className="size-20" />
              <div className="text-neutral-400 text-sm">Upload Photo</div>
              {state?.error.fieldErrors.photos && (
                <div className="text-red-500 text-sm">
                  {state.error.fieldErrors.photos}
                </div>
              )}
            </>
          )}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          className="hidden"
        />
        <Input
          name="title"
          required
          placeholder="title"
          type="text"
          errors={state?.error.fieldErrors.title}
        />
        <Input
          name="price"
          required
          placeholder="price"
          type="number"
          errors={state?.error.fieldErrors.price}
        />
        <Input
          name="description"
          required
          placeholder="description"
          type="text"
          errors={state?.error.fieldErrors.description}
        />
        <Button text="Upload Product" />
      </form>
    </div>
  );
}
