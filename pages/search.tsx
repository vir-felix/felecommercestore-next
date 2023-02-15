import type { ProductComponentType } from "src/types/shared";

import { NextPage } from "next";

import SEO from "@Components/common/SEO";
import Constraints from "@Components/products/constraints";
import ProductsGrid from "@Components/products/ProductsGrid";

import prisma from "@Lib/prisma";
import { withSessionSsr } from "@Lib/withSession";
import { aggregate } from "src/helpers";

const SearchPage: NextPage<SearchPageType> = ({ query, products, count }) => {
  return (
    <div>
      <SEO title={`"${query}"`} />
      <Constraints
        isSearch
        allProductsCount={count}
        currentProductsCount={products.length}
      />

      <div className="results">
        <div className={"results__container"}>
          <ProductsGrid products={products} />
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = withSessionSsr(async function ({
  params,
  req,
  query,
}) {
  const { search = "", q = "" } = query;
  const searchQuery = search || q;

  const results = await Promise.all(
    (
      await prisma.product.findMany({
        where: {
          title: { contains: searchQuery as string, mode: "insensitive" },
        },
        orderBy: { dateAdded: "desc" },
        include: { review: { select: { rating: true } } },
      })
    ).map(async (product) => ({
      ...product,
      dateAdded: product.dateAdded.toJSON(),
      ratings: aggregate(product.review),
    }))
  );

  return {
    props: {
      query: searchQuery,
      products: results,
      count: results.length,
    },
  };
});

export default SearchPage;

interface SearchPageType {
  query: string;
  products: ProductComponentType[];
  count: number;
}
