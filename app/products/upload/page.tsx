"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { getUploadURL, uploadProduct } from "./action";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductType } from "./schema";
export default function UploadProduct() {
  const [preview, setPreview] = useState("");
  const [uploadURL, setUploadURL] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });
  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);
    const { success, result } = await getUploadURL();
    if (success) {
      const { id, uploadURL } = result;
      setUploadURL(uploadURL);
      setValue(
        "photos",
        `https://imagedelivery.net/yjrOsMtY-Fgziaxi8JHHFw/${id}`
      );
    }
  };

  const onSubmit = handleSubmit(async (data: ProductType) => {
    if (!file) return;
    const cloudfareForm = new FormData();
    cloudfareForm.append("file", file);
    const response = await fetch(uploadURL, {
      method: "post",
      body: cloudfareForm,
    });
    if (response.status !== 200) return;
    //replace 'photo' in formData
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("photo", data.photos);
    //call upload product
    const errors = await uploadProduct(formData);
    if (errors) {
      // setError("");
    }
  });

  const onValid = async () => {
    await onSubmit();
  };

  return (
    <div>
      <form className="p-5 flex flex-col gap-5 " action={onValid}>
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
              {errors.photos?.message && (
                <div className="text-red-500 text-sm">
                  {errors.photos?.message}
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
          accept="image/*"
          className="hidden"
        />
        <Input
          {...register("title")}
          required
          placeholder="title"
          type="text"
          errors={[errors.title?.message ?? ""]}
        />
        <Input
          {...register("price")}
          required
          placeholder="price"
          type="number"
          errors={[errors.price?.message ?? ""]}
        />
        <Input
          {...register("description")}
          required
          placeholder="description"
          type="text"
          errors={[errors.description?.message ?? ""]}
        />
        <Button text="Upload Product" />
      </form>
    </div>
  );
}
