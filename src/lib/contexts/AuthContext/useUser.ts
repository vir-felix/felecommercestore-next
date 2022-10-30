import {
  deleteWishlistItem,
  postWishlistItem,
  postCartItem,
  deleteCartItem,
} from "@Lib/helpers";
import { useState, useEffect, useReducer } from "react";
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
  isAuth: false
};

const actions = {
  SET_USER: "SET_USER",
  ADD_WISHLIST_ITEM: "ADD_WISHLIST_ITEM",
  REMOVE_WISHLIST_ITEM: "REMOVE_WISHLIST_ITEM",
  ADD_CART_ITEM: "ADD_CART_ITEM",
  REMOVE_CART_ITEM: "REMOVE_CART_ITEM",
};

type ActionsType = keyof typeof actions;

const authReducer = (
  user: UserType,
  action: { type: ActionsType; payload: any }
) => {
  switch (action.type) {
    case actions.SET_USER:
      return { ...user, ...action.payload };
    case actions.ADD_WISHLIST_ITEM:
      return {
        ...user,
        wishlist: [
          ...user.wishlist.filter(
            (item) => item.productId != action.payload.productId
          ),
          action.payload,
        ],
      };
    case actions.ADD_CART_ITEM:
      return {
        ...user,
        cart: [
          ...user.cart.filter(
            (item) => item.productId != action.payload.productId
          ),
          action.payload,
        ],
      };
    case actions.REMOVE_WISHLIST_ITEM:
      return {
        ...user,
        wishlist: user.wishlist.filter(
          ({ productId = "" }) => productId != action.payload
        ),
      };
    case actions.REMOVE_CART_ITEM:
      return {
        ...user,
        cart: user.cart.filter(
          ({ productId = "" }) => productId != action.payload
        ),
      };
    default:
      return user;
  }
};

const useProfile = (
  id?: string
): { data: any; isError: boolean; isLoading: boolean } => {
  const [data, setData] = useState(null);
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(id ? `/api/auth/user/${id}` : "")
      .then((res) => res.json())
      .then(setData)
      .catch((e) => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, isError, isLoading };
};

export default function useUser(currentUser?: UserType) {
  const [userState, updateUser] = useReducer(authReducer, initUser);

  useEffect(() => {
    let payload = null;

    if (currentUser?.id) {
      updateUser({
        type: actions.SET_USER as ActionsType,
        payload: { ...currentUser, isAuth: true },
      });
    } else {
      Promise.all([
        fetch("/api/wishlist").then((res) => res.json()),
        fetch("/api/cart").then((res) => res.json()),
      ]).then((res) => {
        const [wishlistData, cartData] = res;
        payload = {
          wishlist: wishlistData.data,
          cart: cartData.data,
        };

        updateUser({
          type: actions.SET_USER as ActionsType,
          payload,
        });
      });
    }
  }, [currentUser]);

  const addWishlistItem = async (id: string) => {
    const r = await postWishlistItem(id);
    if (!r.error) {
      updateUser({
        type: actions.ADD_WISHLIST_ITEM as ActionsType,
        payload: r.data,
      });
    }
  };

  const removeWishlistItem = async (id: string) => {
    const r = await deleteWishlistItem(id);
    if (!r.error) {
      updateUser({
        type: actions.REMOVE_WISHLIST_ITEM as ActionsType,
        payload: id,
      });
    }
  };

  const addCartItem = async (id: string, quantity: number, size: number) => {
    const r = await postCartItem(id, quantity, size);
    if (!r.error) {
      updateUser({
        type: actions.ADD_CART_ITEM as ActionsType,
        payload: r.data,
      });
    }
  };

  const removeCartItem = async (id: string) => {
    const r = await deleteCartItem(id);
    if (!r.error) {
      updateUser({
        type: actions.REMOVE_CART_ITEM as ActionsType,
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
    useSelector,
  };
}
