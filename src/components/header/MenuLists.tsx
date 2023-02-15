import Link from "next/link";
import { getPathString } from "src/utils";

const CategoriesData = require("@Data/CategoriesData.json");

export const ColorwaysList = CategoriesData.colorways.map((name: string) => (
  <li key={name} className="sidebar__links-item">
    <Link href={"/category/colorways?color=" + name}>
      <a className="sidebar__anchor">{name}</a>
    </Link>
  </li>
));

export const MenCategoriesList = [
  <li key={"men-sidebar"} className="sidebar__links-item">
    <Link href={"/category/men"}>
      <a className="sidebar__anchor">all men</a>
    </Link>
  </li>,
].concat(
  CategoriesData.men_2.map((name: string) => (
    <li key={name} className="sidebar__links-item">
      <Link href={"/category/men/" + getPathString(name)}>
        <a className="sidebar__anchor">{name}</a>
      </Link>
    </li>
  ))
);

export const WomenCategoriesList = [
  <li key={"men-sidebar"} className="sidebar__links-item">
    <Link href={"/category/women"}>
      <a className="sidebar__anchor">all women</a>
    </Link>
  </li>,
].concat(
  CategoriesData.women_2.map((name: string) => (
    <li key={name} className="sidebar__links-item">
      <Link href={"/category/women/" + getPathString(name)}>
        <a className="sidebar__anchor">{name}</a>
      </Link>
    </li>
  ))
);
