import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { BsCart3, BsXLg, BsPerson } from "react-icons/bs";
import { FiSearch, FiLogOut, FiLogIn } from "react-icons/fi";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { AiOutlineHeart } from "react-icons/ai";

import Form from "@Components/common/Form";
import {
  ColorwaysList,
  MenCategoriesList,
  WomenCategoriesList,
} from "./MenuLists";

import { useDialog, DialogType, useCurrencyFormatter } from "@Contexts/UIContext";
import { useAuthState } from "@Contexts/AuthContext";
import useTabTrapIn from "@Hooks/useKeyTrap";
import Animate from "@Components/common/Animate";

export default function Sidebar() {
  const format = useCurrencyFormatter();
  const [submenu, setSubmenu] = useState<Array<any> | null>(null);
  const [submenuActive, setSubmenuActive] = useState<boolean>(false);

  const { currentDialog, setDialog } = useDialog();

  const { user } = useAuthState();
  const isAuth = user.isAuth;
  const wishlistCount = user.wishlist.count;
  const cartCount = user.cart.count;
  const cartTotal = user.cart.total;

  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarVisible = currentDialog == DialogType.SIDEBAR_DIALOG;
  useTabTrapIn(sidebarRef.current, sidebarVisible);

  useEffect(() => {
    setTimeout(() => !submenuActive && setSubmenu(null), 600);
  }, [submenuActive]);

  return (
    <Animate isMounted={sidebarVisible} unmountDelay={300}>
      <div className="sidebar" onClick={() => setDialog(null)}>
        <button aria-label="close sidebar" className="sidebar__close">
          <BsXLg className="sidebar__close-icon" />
        </button>
        <nav
          className={`sidebar__nav${
            submenuActive ? " sidebar__nav--submenu" : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div ref={sidebarRef} className="sidebar__container">
            <button
              onClick={() => setDialog(DialogType.SEARCH_BOX)}
              className="sidebar__search-box"
            >
              <span className="sidebar__search-box-label">
                Search Jones Store
              </span>
              <span className="sidebar__search-box-icon">
                <FiSearch />
              </span>
            </button>
            <div className="sidebar__links">
              <ul>
                <li className="sidebar__links-item">
                  <Link href="/">
                    <a className="sidebar__anchor">HOME</a>
                  </Link>
                </li>
                <li className="sidebar__links-item sidebar__links-menu">
                  <button
                    onClick={() => {
                      setSubmenu(ColorwaysList);
                      setSubmenuActive(true);
                    }}
                  >
                    <span>COLORWAYS</span>
                    <IoIosArrowForward />
                  </button>
                </li>
                <li className="sidebar__links-item sidebar__links-menu">
                  <button
                    onClick={() => {
                      setSubmenu(MenCategoriesList);
                      setSubmenuActive(true);
                    }}
                  >
                    <span>MEN</span>
                    <IoIosArrowForward />
                  </button>
                </li>
                <li className="sidebar__links-item sidebar__links-menu">
                  <button
                    onClick={() => {
                      setSubmenu(WomenCategoriesList);
                      setSubmenuActive(true);
                    }}
                  >
                    <span>WOMEN</span>
                    <IoIosArrowForward />
                  </button>
                </li>
                <li className="sidebar__links-item">
                  <Link href="/category/kids">
                    <a className="sidebar__anchor">KIDS</a>
                  </Link>
                </li>
                <li className="sidebar__links-item">
                  <Link href="/category/baby">
                    <a className="sidebar__anchor">BABY</a>
                  </Link>
                </li>
                <li className="sidebar__links-item">
                  <Link href="/category/unisex">
                    <a className="sidebar__anchor">UNISEX</a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="sidebar__icon-links">
              <ul>
                {isAuth ? (
                  <li className="sidebar__icon-links-item">
                    <Link href="/profile">
                      <a className="sidebar__anchor">
                        <BsPerson />
                        <span>Profile</span>
                      </a>
                    </Link>
                  </li>
                ) : null}
                <li className="sidebar__icon-links-item">
                  {isAuth ? (
                    <Form
                      afterSubmit={(data) => {
                        if (data.success) {
                          location.reload();
                        }
                      }}
                      action="/api/auth/signout"
                    >
                      <button
                        aria-label="logout"
                        className="sidebar__link-btn"
                        type="submit"
                      >
                        <FiLogOut />
                        Logout
                      </button>
                    </Form>
                  ) : (
                    <Link href="/signin">
                      <a className="sidebar__anchor">
                        <FiLogIn />
                        <span>Login / Register</span>
                      </a>
                    </Link>
                  )}
                </li>
                <li className="sidebar__icon-links-item">
                  <Link href="/wishlist">
                    <a className="sidebar__anchor">
                      <AiOutlineHeart />
                      <span>
                        Wishlist{wishlistCount ? ` (${wishlistCount})` : ""}
                      </span>
                    </a>
                  </Link>
                </li>
                <li className="sidebar__icon-links-item">
                  <button
                    aria-label="cart"
                    onClick={() => setDialog(DialogType.CART)}
                    className="sidebar__anchor"
                  >
                    <BsCart3 />
                    <span>
                      Cart
                      {cartCount
                        ? ` (${cartCount}) (${format(
                            cartTotal
                          )})`
                        : ""}
                    </span>
                  </button>
                </li>
              </ul>
            </div>
            <div className="sidebar__lang-currency language-currency">
              <button className="language-currency__btn">
                {"English"} <span className="language-currency__sep">|</span>{" "}
                {"$ USD"}
              </button>
            </div>
          </div>

          <div className="sidebar__container sidebar__submenu-container">
            <div className="sidebar__links-2">
              <ul hidden={submenu == null}>
                <li className="sidebar__links-item sidebar__back-button">
                  <button onClick={() => setSubmenuActive(false)}>
                    <IoIosArrowBack />
                    <span>BACK</span>
                  </button>
                </li>
                {submenu}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </Animate>
  );
}
