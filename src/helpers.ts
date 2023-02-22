import type { CartType, UserProducts, WishlistType } from "src/types/shared";

import { ObjectSchema, ValidationError } from "yup";

import { CLOUDINARY_CLOUD_NAME } from "./lib/config";

export function validateInputs(
  input: any,
  schema: ObjectSchema<any>
): ValidationError | void {
  try {
    schema.validateSync(input, {
      strict: true,
      stripUnknown: true,
      abortEarly: false,
    });
  } catch (err: unknown) {
    if (err instanceof ValidationError) {
      return err;
    }
  }
}

export const validateInput =
  (schema: ObjectSchema<any>) => (param: string, value: string) => {
    try {
      schema.fields[param].validateSync(value);
      return "";
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        return err.message;
      }
      return "";
    }
  };

function isCartType(obj: any): obj is CartType {
  return "cartId" in obj;
}

export const normalizeUserProductItems = (
  items: (CartType | WishlistType)[]
) => {
  return items.reduce(
    (userProducts: UserProducts<CartType | WishlistType>, item) => {
      userProducts.productIds.push(item.productId);
      userProducts.items[item.productId] = item;
      userProducts.count++;
      if (isCartType(item)) {
        userProducts.total += item.total;
      } else {
        userProducts.total += item.product.price - item.product.discount;
      }
      userProducts.shippingTotal += item.product.shippingCost;
      return userProducts;
    },
    {
      productIds: [],
      items: {},
      count: 0,
      total: 0,
      shippingTotal: 0,
    }
  );
};

export const aggregate = (reviews: { rating: number }[]) => {
  const sum = reviews.reduce((sum, review) => sum + review.rating, 0);
  return sum / (reviews.length || 1);
};

export const getBase64UrlCloudinary = async (imageId: string) => {
  try {
    const response = await fetch(
      `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_256/e_blur:20,q_1,f_webp/${imageId}`
    );
    const buffer = await response.arrayBuffer();
    const data = Buffer.from(buffer).toString("base64");
    return `data:image/webp;base64,${data}`;
  } catch (e) {
    console.log(e);
    return "";
  }
};
