'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Menus from './header-com/menus';
import logo from '@assets/img/logo/my_logo.png';
import useSticky from '@/hooks/use-sticky';
import useCartInfo from '@/hooks/use-cart-info';
import { openCartMini } from '@/redux/features/cartSlice';
import HeaderTopRight from './header-com/header-top-right';
import CartMiniSidebar from '@/components/common/cart-mini-sidebar';
import { CartTwo, Search } from '@/svg';
import useSearchFormSubmit from '@/hooks/use-search-form-submit';
import OffCanvas from '@/components/common/off-canvas';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaWhatsapp,
  FaTwitter,
  FaHeart,
  FaUser,
} from 'react-icons/fa';
import { FiPhone, FiMenu } from 'react-icons/fi';

const HeaderTwo = ({ style_2 = false }) => {
  const dispatch = useDispatch();
  const { sticky } = useSticky();
  const { wishlist } = useSelector((state) => state.wishlist);
  const { quantity } = useCartInfo();
  const [isOffCanvasOpen, setIsCanvasOpen] = useState(false);
  const { searchText, setSearchText, handleSubmit: handleSearchSubmit } =
    useSearchFormSubmit();

  /* ------------------------------------------------------------------ */
  /*  (1) form-validation schema                                        */
  /* ------------------------------------------------------------------ */
  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    mobileNumber: Yup.string().required('Mobile number is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    company: Yup.string().required('Company name is required'),
    message: Yup.string().required('Message is required'),
  });

  useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });

  /* ------------------------------------------------------------------ */
  /*  RENDER                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <>
      <header>
        <div
          className={`tp-header-area tp-header-style-${
            style_2 ? 'primary' : 'darkRed'
          } tp-header-height`}
        >
          {/* Header Top */}
          <div className="tp-header-top-2 p-relative z-index-11 tp-header-top-border mobile-top-header d-none d-lg-block">
            <div className="container">
              <div className="row align-items-center justify-content-between">
                <div className="col-12 d-flex flex-wrap align-items-center justify-content-between">
                  <div className="tp-header-info d-flex align-items-center flex-wrap">
                    <div className="tp-header-info-item social-icons d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2">
                      <span className="tp-social-icons">
                        <a href="#" aria-label="Facebook">
                          <FaFacebookF />
                        </a>
                        <a href="#" aria-label="Instagram">
                          <FaInstagram />
                        </a>
                        <a href="#" aria-label="YouTube">
                          <FaYoutube />
                        </a>
                        <a href="#" aria-label="LinkedIn">
                          <FaLinkedinIn />
                        </a>
                        <a href="#" aria-label="WhatsApp">
                          <FaWhatsapp />
                        </a>
                        <a href="#" aria-label="Twitter">
                          <FaTwitter />
                        </a>
                      </span>
                      <a href="tel:+919925155141" className="mobile-phone d-md-none">
                        <FiPhone className="phone-icon" /> +(91) 9925155141
                      </a>
                    </div>
                    <div className="tp-header-info-item phone-info d-none d-md-block">
                      <a href="tel:+919925155141" className="desktop-phone">
                        <FiPhone className="phone-icon" /> +(91) 9925155141
                      </a>
                    </div>
                  </div>
                  <div className="tp-header-top-right tp-header-top-black d-flex align-items-center justify-content-end">
                    <HeaderTopRight />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Header Bottom */}
          <div
            id="header-sticky"
            className={`tp-header-bottom-2 tp-header-sticky ${
              sticky ? 'header-sticky' : ''
            }`}
          >
            <div className="container">
              <div className="tp-mega-menu-wrapper p-relative">
                <div className="row align-items-center">
                  {/* ─────────────–– logo ───────────── */}
                  <div className="col-6 col-sm-4 col-md-4 col-lg-3 col-xl-2">
                    <div className="logo d-flex align-items-center" style={{ gap: '12px' }}>
                      <Link href="/" className="d-flex align-items-center" style={{ gap: '12px' }}>
                        <Image
                          src={logo}
                          alt="logo"
                          width={120}
                          height={40}
                          style={{
                            height: 'auto',
                            width: 'auto',
                            maxWidth: '120px',
                            maxHeight: '40px',
                          }}
                          sizes="(max-width: 600px) 100px, 120px"
                          priority
                        />
                      </Link>
                    </div>
                  </div>

                  {/* ─────────────–– menu ───────────── */}
                  <div className="d-none d-xl-block col-xl-5">
                    <div className="main-menu menu-style-2">
                      <nav className="tp-main-menu-content">
                        <Menus />
                      </nav>
                    </div>
                  </div>

                  {/* ─────────────–– right-side icons ───────────── */}
                  <div className="col-6 col-sm-8 col-md-8 col-lg-9 col-xl-5">
                    <div className="tp-header-bottom-right d-flex align-items-center justify-content-end">
                      <div className="tp-header-search-2 d-none d-sm-block me-3">
                        <form onSubmit={handleSearchSubmit}>
                          <input
                            onChange={(e) => setSearchText(e.target.value)}
                            value={searchText}
                            type="text"
                            placeholder="Search for Products..."
                          />
                          <button type="submit">
                            <Search />
                          </button>
                        </form>
                      </div>
                      <div className="tp-header-action d-flex align-items-center">
                        <div className="tp-header-action-item d-none d-lg-block me-2">
                          <Link href="/login" className="tp-header-action-btn">
                            <FaUser />
                          </Link>
                        </div>
                        <div className="tp-header-action-item d-none d-lg-block me-2">
                          <Link href="/wishlist" className="tp-header-action-btn">
                            <FaHeart />
                            <span className="tp-header-action-badge">{wishlist.length}</span>
                          </Link>
                        </div>
                        <div className="tp-header-action-item me-2">
                          <button
                            onClick={() => dispatch(openCartMini())}
                            className="tp-header-action-btn cartmini-open-btn"
                          >
                            <CartTwo />
                            <span className="tp-header-action-badge">{quantity}</span>
                          </button>
                        </div>
                        <div className="tp-header-action-item tp-header-hamburger d-xl-none">
                          <button
                            onClick={() => setIsCanvasOpen(true)}
                            type="button"
                            className="tp-offcanvas-open-btn"
                          >
                            <FiMenu />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* ────────────────────────────────────────────── */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <CartMiniSidebar />
      <OffCanvas
        isOffCanvasOpen={isOffCanvasOpen}
        setIsCanvasOpen={setIsCanvasOpen}
        categoryType="fashion"
      />
    </>
  );
};

export default HeaderTwo;
