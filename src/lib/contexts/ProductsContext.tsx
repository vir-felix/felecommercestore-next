import { createContext, ReactNode, useContext, useState, useRef } from "react";
import { Product } from "@prisma/client";
import { HIGHEST_PRICE } from "@Lib/constants";

export interface filterStateType {
  gender: string;
  color: string[];
  size: number[];
  height: string[];
  price: [number, number];
  year: number[];
}
export type filterStateKeys = keyof filterStateType;

const _filterState: filterStateType = {
  gender: "",
  color: [],
  size: [],
  height: [],
  price: [0, HIGHEST_PRICE] as [number, number],
  year: [],
};

const ProductsState: {
  products: Product[];
  filterState: filterStateType;
  filterListings: (action: { [type: string]: unknown }) => void;
  sortListings: (sortBy: string) => void;
  clearFilters: () => void;
} = {
  products: [],
  filterListings: () => null,
  sortListings: () => null,
  clearFilters: () => null,
  filterState: _filterState,
};

const getGenderPredicate = (gender: string) => (product: Product) =>
  product.gender == gender;
const getColorPredicate = (colors: string[]) => (product: Product) =>
  colors.includes(product.color);
const getSizesPredicate = (sizes: number[]) => (product: Product) =>
  sizes.some((size) => product.sizes.includes(Number(size)));
const getHeightPredicate = (height: string[]) => (product: Product) =>
  height.includes(product.type);
const getPricePredicate =
  ([minPrice, maxPrice]: [minPrice: number, maxPrice: number]) =>
  (product: Product) => {
    if (maxPrice >= HIGHEST_PRICE) {
      return product.price >= minPrice;
    }
    return product.price >= minPrice && product.price <= maxPrice;
  };
const getYearPredicate = (years: number[]) => (product: Product) =>
  years.includes(product.year || new Date().getFullYear());

interface FilterPredicateType<T> {
  (value: T, index: number, array: T[]): boolean | unknown;
}
const compose = <T extends unknown>(...predicates: FilterPredicateType<T>[]) =>
  predicates.reduceRight<FilterPredicateType<T>>(
    (acc, current) => (value, index, array) =>
      acc(value, index, array) && current(value, index, array),
    () => true
  );

const actions: { [type: string]: Function } = {
  gender: getGenderPredicate,
  color: getColorPredicate,
  size: getSizesPredicate,
  height: getHeightPredicate,
  price: getPricePredicate,
  year: getYearPredicate,
};

const ProductsContext = createContext(ProductsState);

export const useProductsState = () => useContext(ProductsContext);

export default function ProductsProvider({
  products,
  children,
  preFilter = {},
}: {
  products: Product[];
  children: ReactNode;
  preFilter?: Partial<filterStateType>;
}) {
  const filterState = useRef<filterStateType>({
    ..._filterState,
    ...preFilter,
  });
  let params = new URLSearchParams();

  const getFilteredListings = () => {
    params = new URLSearchParams();
    const predicate = compose<Product>(
      ...Object.keys(filterState.current).map((type) => {
        const value =
          filterState.current[type as keyof typeof filterState.current];
        if (type != "gender") {
          if (Array.isArray(value)) {
            if (type == "price") {
              params.append("min_price", value[0].toString());
              params.append("max_price", value[1].toString());
            } else value.forEach((v) => params.append(type, v.toString()));
          } else {
            params.append(type, (value as string).toString());
          }
        }
        if (value && value.length) {
          return actions[type](value);
        }
        return () => true;
      })
    );

    return products.filter(predicate);
  };

  const filterListings = (action: { [type: string]: unknown }) => {
    filterState.current = { ...filterState.current, ...action };
    setProductListing(getFilteredListings());

    window.history.replaceState(
      null,
      "",
      `/category/${filterState.current.gender.toLowerCase()}?${params.toString()}`
    );
  };

  const clearFilters = () => {
    filterState.current = _filterState;
    setProductListing(products);
    window.history.replaceState(
      null,
      "",
      `/category/${filterState.current.gender.toLowerCase()}`
    );
  }

  const sortListings = (sortBy: string) => {
    let compare: (a: Product, b: Product) => number = () => 0;
    if (sortBy == "asc_price") {
      compare = (aProduct, bProduct) => aProduct.price - bProduct.price;
    } else if (sortBy == "price") {
      compare = (aProduct, bProduct) => bProduct.price - aProduct.price;
    } else if (sortBy == "asc_ratings") {
      compare = (aProduct, bProduct) =>
        (aProduct.ratings || 0) - (bProduct.ratings || 0);
    } else if (sortBy == "ratings") {
      compare = (aProduct, bProduct) =>
        (bProduct.ratings || 0) - (aProduct.ratings || 0);
    }

    setProductListing((listings) => [...listings].sort(compare));
  };

  const [productListing, setProductListing] = useState(getFilteredListings());

  return (
    <ProductsContext.Provider
      value={{
        products: productListing,
        filterListings,
        sortListings,
        clearFilters,
        filterState: filterState.current,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}
