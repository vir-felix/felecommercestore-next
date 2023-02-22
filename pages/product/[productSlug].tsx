import type { ProductComponentType } from "src/types/shared";

const probe = require("probe-image-size");

import SEO from "@Components/common/SEO";
import ProductsGrid from "@Components/products/ProductsGrid";
import ShareButton from "@Components/common/ShareButton";
import ProductGallery from "@Components/products/ProductGallery";
import ProductCartForm from "@Components/products/ProductCartForm";
import ProductDetails from "@Components/products/ProductDetails";

import prisma from "@Lib/prisma";
import { NextPage } from "next";
import RatingStars from "@Components/common/RatingStars";
import { aggregate, getBase64UrlCloudinary } from "src/helpers";
import { useCurrencyFormatter } from "@Contexts/UIContext";

const ProductPage: NextPage<ProductPageType> = ({
  product,
  relatedProducts,
  imageDimensions,
  blurDataUrls,
}) => {
  const format = useCurrencyFormatter();
  const {
    id,
    title,
    gender,
    price,
    discount,
    sku,
    year,
    color,
    salesCount,
    stockQty,
    type,
    ratings,
  } = product;

  const cartPrice = (price - discount) * 1;
  const percentageOff = discount
    ? `${Math.floor((discount / price) * 100)}% off`
    : "";

  if (!product) {
    return <div></div>;
  }

  return (
    <>
      <SEO title={product.title} />

      <div className="product-view">
        <ProductGallery
          key={`gallery-${id}`}
          product={product}
          images={product.mediaURLs}
          dimensions={imageDimensions}
          blurDataUrls={blurDataUrls}
        />

        <div className="product-view__cart">
          <p className="product-view__gender">{gender}</p>
          <h1 className="product-view__name">{title}</h1>
          <RatingStars count={ratings} />

          <div className="product-view__details">
            <p className="product-view__details-info">
              <strong>Model No.:</strong> {sku.toUpperCase()}
            </p>
            <p className="product-view__details-info">
              <strong>Release Year:</strong> {year}
            </p>
            <p className="product-view__details-info">
              <strong>Upper:</strong> {type.toLocaleLowerCase()} Cut
            </p>
            <p className="product-view__details-info">
              <strong>Colorway:</strong> {color}
            </p>
          </div>

          <p className="product-view__price">
            {format(cartPrice)} <span>{percentageOff}</span>
          </p>

          <p className="product-view__sold">
            {salesCount ?? 0} Sold / {stockQty} available in stock
          </p>

          <ProductCartForm key={product.id} product={product} />
          <p className="product-view__shipping-info">Shipping is calculated at checkout.</p>

          <ShareButton
            title={product.title}
            description={product.details}
            image={product.mediaURLs[0]}
            hashtags="#jonesstore"
          />
        </div>

        <ProductDetails product={product} />
      </div>

      <div className="related-products">
        {relatedProducts.length ? (
          <>
            <h2 className="related-products__heading">Related <wbr/>Products</h2>
            <ProductsGrid products={relatedProducts} />
          </>
        ) : null}
      </div>
    </>
  );
};

export const getServerSideProps = async function ({
  params,
}: {
  params: { productSlug: string };
}) {
  const { productSlug } = params;

  const sku = productSlug.substring(productSlug.length - 10).replace("-", " ");

  const product = await prisma.product.findFirst({
    where: { sku: { equals: sku, mode: "insensitive" } },
    include: { review: { select: { rating: true } } },
  });

  if (product) {
    const imageDimensions =
      (await Promise.all(
        product.mediaURLs.map(async (url) => await probe(url))
      ).catch(console.log)) ?? [];

    const productFinal = {
      ...product,
      dateAdded: product.dateAdded.toJSON(),
      ratings: aggregate(product.review),
    };

    const relatedProducts = await Promise.all(
      (
        await prisma.product.findMany({
          where: {
            id: { not: product.id },
            gender: product.gender,
            type: product.type,
          },
          include: { review: { select: { rating: true } } },
          take: 4,
        })
      ).map(async (product) => ({
        ...product,
        ratings: aggregate(product.review),
        dateAdded: product.dateAdded.toJSON(),
      }))
    );

    const blurDataUrls: Record<string, string> = {};
    for (const imageLink of product.mediaURLs) {
      const imageId = imageLink.match(/upload\/(.+)/)?.[1] ?? "";

      blurDataUrls[imageLink] = await getBase64UrlCloudinary(imageId);
    }

    return {
      props: {
        product: productFinal,
        relatedProducts,
        imageDimensions,
        blurDataUrls,
      },
    };
  }

  return {
    notFound: true,
  };
};

export default ProductPage;

interface ProductPageType {
  product: ProductComponentType;
  relatedProducts: ProductComponentType[];
  imageDimensions: { width: number; height: number }[];
  blurDataUrls: Record<string, string>;
}
