import { IoIosArrowBack } from "react-icons/io";

import Button from "@Components/formControls/Button";
import GenderParam from "./params/GenderParam";
import MainColorParam from "./params/MainColorParam";
import SizesParam from "./params/SizesParam";
import HeightParam from "./params/HeightParam";
import PriceFilterParam from "./params/PriceFilterParam";
import YearParam from "./params/YearParam";

import { useProductsState } from "@Contexts/ProductsContext";

export default function FilterAccordion({ active, setState }: PropTypes) {
  const { clearFilters } = useProductsState();

  return (
    <div className={"filter" + (active ? " filter--active" : "")}>
      <div className="filter__head">
        <span>Filter</span>
        <button
          aria-label="hide filter"
          onClick={() => setState(false)}
          className="filter__hide"
        >
          <IoIosArrowBack />
        </button>
      </div>

      <GenderParam />
      <MainColorParam />
      <SizesParam />
      <HeightParam />
      <PriceFilterParam />
      <YearParam />

      <div className="filter__confirm">
        <Button
          onClick={clearFilters}
          type="submit"
          className="filter__clear-all"
        >
          clear filters
        </Button>
      </div>
    </div>
  );
}

interface PropTypes {
  active: boolean;
  setState: (state: boolean) => void;
}
