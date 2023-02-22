import { useEffect, useRef, useState } from "react";
import { Router } from "next/router";

import Link from "next/link";
import { AiOutlineHeart } from "react-icons/ai";
import { BsCart3, BsPerson } from "react-icons/bs";
import { FiSearch, FiMenu } from "react-icons/fi";
import { BiCaretDown } from "react-icons/bi";

import Logo from "@Components/common/Logo";
import ToolTip from "@Components/common/ToolTip";
import Form from "@Components/common/Form";
import {
  ColorwaysList,
  MenCategoriesList,
  WomenCategoriesList,
} from "./MenuLists";

import useScrollTop from "@Hooks/useScrollTop";
import { DialogType, useCurrencyFormatter, useDialog } from "@Contexts/UIContext";
import { useAuthState } from "@Contexts/AuthContext";

export default function HeaderSection() {
  const { setDialog } = useDialog();

  const [dropdownNav, setDropdownNav] = useState<JSX.Element[] | null>(null);
  const [pinnedState, setPinnedState] = useState(false);
  const scrollTop = useScrollTop();
  const headerRef = useRef<HTMLElement>(null);
  const format = useCurrencyFormatter();
  const { user } = useAuthState();
  const isAuth = user.isAuth;
  const wishlistCount = user.wishlist.count;
  const cartCount = user.cart.count;
  const cartTotal = user.cart.total;

  useEffect(() => {
    const mainBanner = document.getElementById("main-banner");

    if (mainBanner) {
      setPinnedState(
        scrollTop > mainBanner.offsetTop + mainBanner.clientHeight
      );
    }
  }, [scrollTop]);

  useEffect(() => {
    const hideDropdown = () => setDropdownNav(null);
    Router.events.on("routeChangeStart", hideDropdown);
    return () => Router.events.off("routeChangeStart", hideDropdown);
  }, []);

  const [hoveredElement, setHoveredElement] = useState<string>("");

  return (
    <>
      <header
        ref={headerRef}
        className={`header${pinnedState ? " header--pinned" : ""}`}
      >
        <div className="header__container">
          <div className="header__menu-button">
            <button
              aria-label="menu"
              className="header__menu-toggle"
              onClick={() => setDialog(DialogType.SIDEBAR_DIALOG)}
            >
              <FiMenu />
            </button>
          </div>

          <div className="header__logo">
            <Logo />
          </div>

          <div className="header__nav">
            <nav>
              <ul>
                <li className="header__nav-link">
                  <Link href="#">
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        setDropdownNav(
                          dropdownNav == ColorwaysList ? null : ColorwaysList
                        );
                      }}
                    >
                      COLORWAYS <BiCaretDown className="header__nav-caret" />
                    </a>
                  </Link>
                </li>
                <li className="header__nav-link">
                  <span>|</span>
                </li>
                <li className="header__nav-link">
                  <Link href="#">
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        setDropdownNav(
                          dropdownNav == MenCategoriesList
                            ? null
                            : MenCategoriesList
                        );
                      }}
                    >
                      MEN <BiCaretDown className="header__nav-caret" />
                    </a>
                  </Link>
                </li>
                <li className="header__nav-link">
                  <Link href="#">
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        setDropdownNav(
                          dropdownNav == WomenCategoriesList
                            ? null
                            : WomenCategoriesList
                        );
                      }}
                    >
                      WOMEN <BiCaretDown className="header__nav-caret" />
                    </a>
                  </Link>
                </li>
                <li className="header__nav-link">
                  <Link href="/category/kids">
                    <a>KIDS</a>
                  </Link>
                </li>
                <li className="header__nav-link">
                  <Link href="/category/baby">
                    <a>BABY</a>
                  </Link>
                </li>
                <li className="header__nav-link">
                  <Link href="/category/unisex">
                    <a>UNISEX</a>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="header__buttons">
            <ul>
              <li className="header__button header__button-search">
                <Link href="./#">
                  <a
                    className="header__button-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setDialog(DialogType.SEARCH_BOX);
                    }}
                  >
                    <FiSearch />
                  </a>
                </Link>
              </li>
              <li className="header__button header__button-account">
                <Link href={isAuth ? "/profile" : "/signin"}>
                  <a
                    onPointerEnter={(e) =>
                      setHoveredElement("header-account-btn")
                    }
                    onPointerLeave={(e) => setHoveredElement("")}
                    className="header__button-link"
                    id="header-account-btn"
                    aria-label="user profile"
                  >
                    <BsPerson />
                    <ToolTip
                      currentId={hoveredElement}
                      hoverElementId="header-account-btn"
                    >
                      {isAuth ? (
                        <>
                          <Link href="/profile">
                            <a className="header__popup-button">
                              <span>Profile</span>
                            </a>
                          </Link>
                          <Form
                            afterSubmit={(data) => {
                              if (data.success) {
                                location.reload();
                              }
                            }}
                            action="/api/auth/signout"
                          >
                            <input
                              className="header__popup-button"
                              type="submit"
                              value="Log Out"
                            />
                          </Form>
                        </>
                      ) : (
                        <>
                          <Link href="/signin">
                            <a className="header__popup-button">
                              <span>Log In</span>
                            </a>
                          </Link>
                          <Link href="/signup">
                            <a className="header__popup-button">
                              <span>Register</span>
                            </a>
                          </Link>
                        </>
                      )}
                    </ToolTip>
                  </a>
                </Link>
              </li>
              <li className="header__button header__button-wishlist">
                <Link href="/wishlist">
                  <a className="header__button-link">
                    <AiOutlineHeart />
                  </a>
                </Link>
                {wishlistCount ? <span>{wishlistCount}</span> : null}
              </li>
              <li className="header__button header__button-cart">
                <button
                  aria-label="cart"
                  onClick={() => setDialog(DialogType.CART)}
                  onPointerEnter={(e) => setHoveredElement("header-cart-btn")}
                  onPointerLeave={(e) => setHoveredElement("")}
                  className="header__button-link"
                  id="header-cart-btn"
                >
                  <BsCart3 />
                  <ToolTip
                    currentId={hoveredElement}
                    hoverElementId="header-cart-btn"
                  >
                    {cartCount ? (
                      <span style={{ fontWeight: "400", userSelect: "none" }}>
                        {format(cartTotal)}
                      </span>
                    ) : (
                      "Empty"
                    )}
                  </ToolTip>
                </button>
                {cartCount ? <span>{cartCount}</span> : null}
              </li>
            </ul>
          </div>
        </div>
      </header>

      <div
        className={
          "header__dropdown" +
          (dropdownNav ? " header__dropdown--visible" : "") +
          (pinnedState ? " header__dropdown--pinned" : "")
        }
      >
        <ul>{dropdownNav}</ul>
      </div>
    </>
  );
}
