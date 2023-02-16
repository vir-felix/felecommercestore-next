import {
  useState,
  useEffect,
  useRef,
  KeyboardEventHandler,
  MouseEventHandler,
  FocusEventHandler,
  forwardRef,
  useImperativeHandle,
  ReactElement,
} from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

import useArrowKeyTrap from "@Hooks/useKeyTrap";
import { isSelectKey } from "src/utils";

export default forwardRef<
  HTMLDivElement | null,
  PropTypes & JSX.IntrinsicElements["input"]
>(function Dropdown(
  {
    label = "Select Option",
    options,
    icons,
    value: _value,
    className,
    name = "",
    onOptionSelect,
    ...inputProps
  },
  forwardRef
) {
  const [value, setValue] = useState(_value?.toString() ?? "");
  const [collapsed, setCollapsed] = useState(true);
  const MenuListRef = useRef<HTMLUListElement>(null);
  const DropdownRef = useRef<HTMLDivElement>(null);

  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(
    forwardRef,
    () => {
      if (DropdownRef.current) {
        return DropdownRef.current;
      }
      return null;
    }
  );

  useArrowKeyTrap(MenuListRef.current, !collapsed, true);

  useEffect(() => {
    if (collapsed) {
      DropdownRef.current?.focus();
    }
  }, [collapsed]);

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (isSelectKey(e) && e.target == DropdownRef.current) {
      setCollapsed(!collapsed);
    } else if (e.key == "Escape") {
      setCollapsed(true);
    }
  };

  const handleClick: MouseEventHandler<HTMLDivElement> = ({ target }) => {
    if (MenuListRef.current?.contains(target as Node)) {
      setCollapsed(true);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleBlur: FocusEventHandler<HTMLDivElement> = (e) => {
    if (
      !MenuListRef.current?.contains(e.relatedTarget) &&
      e.relatedTarget !== DropdownRef.current
    ) {
      setCollapsed(true);
    }
  };

  return (
    <div
      tabIndex={0}
      onClick={handleClick}
      ref={DropdownRef}
      onKeyDownCapture={handleKeyDown}
      onBlur={handleBlur}
      className={"dropdown" + (className ? ` ${className}` : "")}
    >
      <span className="dropdown__button" style={{ pointerEvents: "none" }}>
        <input
          {...inputProps}
          className="dropdown__value"
          type="text"
          readOnly
          tabIndex={-1}
          defaultValue={options[value]}
          placeholder={label}
        />
        <input name={name} defaultValue={value} type="hidden" />
        <span className="dropdown__toggle-icon">
          {collapsed ? <BiChevronDown /> : <BiChevronUp />}
        </span>
      </span>

      <div
        className={`dropdown__menu${
          collapsed ? " dropdown__menu--collapsed" : ""
        }`}
      >
        <ul role="listbox" ref={MenuListRef} className="dropdown__list">
          {Object.keys(options).map((option) => (
            <li
              tabIndex={-1}
              key={option}
              role="option"
              aria-selected={value == option}
              onClick={(e) => {
                setValue(option);
                onOptionSelect?.(option);
              }}
              data-value={option}
              className="dropdown__option"
            >
              <>{icons?.[option]} {options[option]}</>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

interface PropTypes {
  onOptionSelect?: (value: string) => void;
  options: { [value: string]: string };
  icons?: { [value: string]: ReactElement };
  label?: string;
}
