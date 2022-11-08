import {
  deleteWishlistItem,
  postWishlistItem,
  postCartItem,
  deleteCartItem,
} from "@Lib/helpers";
import { Cart, CartItem } from "@prisma/client";
import { useEffect, useReducer } from "react";
import { UserType } from "src/types/shared";

const initUser: UserType = {
  id: "",
  avatarURL: "",
  username: "",
  email: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  deactivated: false,
  wishlist: [],
  cart: [],
  cartTotal: 0,
  isAuth: false,
};

enum UserActions {
  SET_USER,
  ADD_WISHLIST_ITEM,
  REMOVE_WISHLIST_ITEM,
  ADD_CART_ITEM,
  REMOVE_CART_ITEM,
}

const authReducer = (
  user: UserType,
  action: { type: UserActions; payload: any }
) => {
  switch (action.type) {
    case UserActions.SET_USER: {
      const cartTotal: CartItem[] = action.payload.cart.reduce(
        (_total: number, { total }: CartItem) => _total + total,
        0
      );

      return { ...user, ...action.payload, cartTotal };
    }
    case UserActions.ADD_WISHLIST_ITEM:
      return {
        ...user,
        wishlist: [
          ...user.wishlist.filter(
            (item) => item.productId != action.payload.productId
          ),
          action.payload,
        ],
      };
    case UserActions.ADD_CART_ITEM: {
      const newCart: CartItem[] = user.cart
        .filter((item) => item.productId != action.payload.productId)
        .concat(action.payload);

      return {
        ...user,
        cart: [...newCart],
        cartTotal: newCart.reduce(
          (_total: number, { total }: CartItem) => _total + total,
          0
        ),
      };
    }
    case UserActions.REMOVE_WISHLIST_ITEM:
      return {
        ...user,
        wishlist: user.wishlist.filter(
          ({ productId = "" }) => productId != action.payload
        ),
      };
    case UserActions.REMOVE_CART_ITEM: {
      const newCart: CartItem[] = user.cart.filter(
        ({ productId = "" }) => productId != action.payload
      );

      return {
        ...user,
        cart: newCart,
        cartTotal: newCart.reduce(
          (_total: number, { total }: CartItem) => _total + total,
          0
        ),
      };
    }
    default:
      return user;
  }
};

export default function useUser(currentUser: UserType) {
  const [userState, updateUser] = useReducer(authReducer, initUser);

  useEffect(() => {
    if (currentUser && currentUser.id != "guest") {
      updateUser({
        type: UserActions.SET_USER,
        payload: { ...currentUser, isAuth: true },
      });
    } else if (currentUser) {
      const cartTotal = (currentUser.cart as CartItem[]).reduce(
        (_total: number, { total }: CartItem) => _total + total,
        0
      );
      updateUser({
        type: UserActions.SET_USER,
        payload: { ...currentUser, cartTotal },
      });
    }
  }, [currentUser]);

  const addWishlistItem = async (id: string) => {
    const r = await postWishlistItem(id);
    if (!r.error) {
      updateUser({
        type: UserActions.ADD_WISHLIST_ITEM,
        payload: r.data,
      });
    }
  };

  const removeWishlistItem = async (id: string) => {
    const r = await deleteWishlistItem(id);
    if (!r.error) {
      updateUser({
        type: UserActions.REMOVE_WISHLIST_ITEM,
        payload: id,
      });
    }
  };

  const addCartItem = async (id: string, quantity: number, size: number) => {
    const r = await postCartItem(id, quantity, size);
    if (!r.error) {
      updateUser({
        type: UserActions.ADD_CART_ITEM,
        payload: r.data,
      });
    }
  };

  const removeCartItem = async (id: string) => {
    const r = await deleteCartItem(id);
    if (!r.error) {
      updateUser({
        type: UserActions.REMOVE_CART_ITEM,
        payload: id,
      });
    }
  };

  const useSelector = (callback: (user: UserType) => void) =>
    callback(userState);

  return {
    user: userState,
    addWishlistItem,
    removeWishlistItem,
    addCartItem,
    removeCartItem,
    setAuthUser: (user: UserType) => {
      updateUser({
        type: UserActions.SET_USER,
        payload: { ...user },
      });
    },
    useSelector,
  };
}
