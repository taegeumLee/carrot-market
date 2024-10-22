"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { getUploadURL, uploadProduct } from "./action";
import { useFormState } from "react-dom";

export default function UploadProduct() {
  const [preview, setPreview] = useState("");
  const [uploadURL, setUploadURL] = useState("");
  const [imageId, setImageId] = useState("");
  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
    const { success, result } = await getUploadURL();
    if (success) {
      const { id, uploadURL } = result;
      setUploadURL(uploadURL);
      setImageId(id);
    }
  };
  const interceptAction = async (_: any, formData: FormData) => {
    //upload image to cloudfare
    const file = formData.get("photo");
    if (!file) return;
    const cloudfareForm = new FormData();
    cloudfareForm.append("file", file);
    const response = await fetch(uploadURL, {
      method: "post",
      body: cloudfareForm,
    });
    if (response.status !== 200) return;
    //replace 'photo' in formData
    const photoURL = `https://imagedelivery.net/yjrOsMtY-Fgziaxi8JHHFw/${imageId}`;
    formData.set("photo", photoURL);
    //call upload product
    return uploadProduct(_, formData);
  };
  const [state, action] = useFormState(interceptAction, null);
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
