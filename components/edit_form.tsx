"use client";

import { formatToWon } from "@/lib/utils";
import { PhotoIcon, UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Input from "@/components/input";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { productSchema } from "../app/products/upload/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { deletePhoto, editProduct } from "../app/products/[id]/edit/action";
import { getUploadURL } from "../app/products/upload/action";

// ProductType에 user 속성 추가
type UserType = {
  username: string;
  avatar: string | null;
};

type ProductType = {
  title: string;
  price: string;
  description: string;
  photos: string;
  user: UserType; // user 속성 추가
};

const EditForm = ({
  id,
  product,
  isOwner,
}: {
  id: number;
  product: ProductType;
  isOwner: boolean;
}) => {
  const [preview, setPreview] = useState(`${product.photos}`);
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });
  const onSubmit = async (data: ProductType) => {
    try {
      const formData = new FormData();
      formData.append("id", id.toString());
      formData.append("title", data.title);
      formData.append("price", data.price);
      formData.append("description", data.description);
      formData.append("photos", data.photos);
      const errors = await editProduct(formData);
      if (errors) {
        setError("root", { message: "Failed to update product" });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("root", { message: "An unexpected error occurred" });
    }
  };
  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) return;
    if (files.length !== 1) return alert("파일은 한개만 업로드해야 합니다.");
    const MB = 1024 * 1024; // 1 MB
    if (files[0].size > 5 * MB) return alert("파일은 최대 5MB입니다.");
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);
    const { success, result } = await getUploadURL();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setValue(
        "photos",
        `https://imagedelivery.net/yjrOsMtY-Fgziaxi8JHHFw/${id}`
      );
    }
  };
  useEffect(() => {
    const photoId = product.photos.split(
      "https://imagedelivery.net/yjrOsMtY-Fgziaxi8JHHFw/"
    )[1];
    setValue(
      "photos",
      `https://imagedelivery.net/yjrOsMtY-Fgziaxi8JHHFw/${photoId}`
    );
  }, [product, setValue]);
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative size-auto aspect-square">
          <label
            htmlFor="photo"
            className="border-2 aspect-square flex justify-center items-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer"
          >
            {preview ? (
              <img
                src={preview + "/public"}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <PhotoIcon className="size-20" />
                <div className="text-neutral-400 text-sm">Upload Photo</div>
                <div className="text-red-500 text-sm"></div>
              </>
            )}
          </label>
        </div>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
        />

        <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
          <div className="size-10 rounded-full">
            {product.user.avatar !== null ? (
              <Image
                src={product.user.avatar}
                alt={product.user.username}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <UserIcon className="size-10" />
            )}
          </div>
          <div>
            <h3>{product.user.username}</h3>
          </div>
        </div>

        <div className="p-5">
          <Input
            type="text"
            name="title"
            required
            defaultValue={product.title}
          />

          <Input
            type="description"
            name="description"
            required
            defaultValue={product.description}
          />
        </div>
        <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
          <Input
            type="price"
            name="price"
            required
            defaultValue={formatToWon(Number(product.price))}
          />
          <div className="flex items-center">
            {isOwner ? (
              <button className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold">
                Edit Product
              </button>
            ) : null}
          </div>
        </div>
        {errors.root && (
          <span className="text-red-500">{errors.root.message}</span>
        )}
      </form>
    </div>
  );
};
export default EditForm;
