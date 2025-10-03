'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Menus from './header-com/menus';
import localLogo from '@assets/img/logo/my_logo.png';
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

/* ----------------------- helpers ----------------------- */
const sanitizePhone = (v) => (v || '').replace(/[^\d+]/g, ''); // keep digits and leading +

const isHttpUrl = (v) => typeof v === 'string' && /^https?:\/\//i.test(v);

/* ========================================================
   Component (JSX, no TS)
======================================================== */
const HeaderTwo = ({ style_2 = false }) => {
  const dispatch = useDispatch();
  const { sticky } = useSticky();
  const { wishlist } = useSelector((state) => state.wishlist);
  const { quantity } = useCartInfo();

  const [isOffCanvasOpen, setIsCanvasOpen] = useState(false);
  const { searchText, setSearchText, handleSubmit: handleSearchSubmit } =
    useSearchFormSubmit();

  /* ---------------- form-validation schema --------------- */
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

  /* ---------------- office / social info ----------------- */
  const [info, setInfo] = useState({
    companyName: '',
    companyPhone1: '',
    companyPhone2: '',
    companyEmail: '',
    companyAddress: '',
    companyLanguages: [],
    companyFoundingDate: '',
    companyEmployeeRange: '',
    companyAwards: '',
    whatsappNumber: '',
    gaId: '',
    clarityId: '',
    companyLogoUrl: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
    youtube: '',
  });
  const [loadingInfo, setLoadingInfo] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchOfficeInfo = async () => {
      try {
        setLoadingInfo(true);
        const res = await fetch(
          process.env.NEXT_PUBLIC_OFFICEINFO_URL ||
            'https://test.amrita-fashions.com/landing/officeinformation',
          { signal: controller.signal, cache: 'no-store' }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const first =
          json && Array.isArray(json.data) && json.data.length > 0
            ? json.data[0]
            : {};

        setInfo({
          companyName: first.companyName || '',
          companyPhone1: first.companyPhone1 || '',
          companyPhone2: first.companyPhone2 || '',
          companyEmail: first.companyEmail || '',
          companyAddress: first.companyAddress || '',
          companyLanguages: Array.isArray(first.companyLanguages)
            ? first.companyLanguages
            : [],
          companyFoundingDate: first.companyFoundingDate || '',
          companyEmployeeRange: first.companyEmployeeRange || '',
          companyAwards: first.companyAwards || '',
          whatsappNumber: first.whatsappNumber || '',
          gaId: first.gaId || '',
          clarityId: first.clarityId || '',
          companyLogoUrl: first.companyLogoUrl || '',
          facebook: first.facebook || '',
          instagram: first.instagram || '',
          linkedin: first.linkedin || '',
          twitter: first.twitter || '',
          youtube: first.youtube || '',
        });
      } catch (err) {
        if (err?.name !== 'AbortError') {
          console.error('Office info fetch failed:', err);
        }
      } finally {
        setLoadingInfo(false);
      }
    };

    fetchOfficeInfo();
    return () => controller.abort();
  }, []);

  const phonePrimary = sanitizePhone(info.companyPhone1) || '919925155141';
  const phoneDisplay = info.companyPhone1 || '+(91) 9925155141';
  const whatsappDigits = sanitizePhone(info.whatsappNumber) || phonePrimary;
  const waLink = `https://wa.me/${whatsappDigits}`;

  // allow either static import or remote string
  const logoSrc = "https://amritafashions.com/wp-content/uploads/amrita-fashions-small-logo-india.webp";
  const companyAlt = info.companyName || 'Company Logo';

  /* -------------------------- render --------------------- */
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
                        {info.facebook ? (
                          <a href={info.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                            <FaFacebookF />
                          </a>
                        ) : null}
                        {info.instagram ? (
                          <a href={info.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                            <FaInstagram />
                          </a>
                        ) : null}
                        {info.youtube ? (
                          <a href={info.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
                            <FaYoutube />
                          </a>
                        ) : null}
                        {info.linkedin ? (
                          <a href={info.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                            <FaLinkedinIn />
                          </a>
                        ) : null}
                        {whatsappDigits ? (
                          <a href={waLink} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                            <FaWhatsapp />
                          </a>
                        ) : null}
                        {info.twitter ? (
                          <a href={info.twitter} target="_blank" rel="noreferrer" aria-label="Twitter/X">
                            <FaTwitter />
                          </a>
                        ) : null}
                      </span>

                      {/* Mobile phone (visible on md-) */}
                      <a href={`tel:${phonePrimary}`} className="mobile-phone d-md-none">
                        <FiPhone className="phone-icon" /> {phoneDisplay}
                      </a>
                    </div>

                    {/* Desktop phone */}
                    <div className="tp-header-info-item phone-info d-none d-md-block">
                      <a href={`tel:${phonePrimary}`} className="desktop-phone">
                        <FiPhone className="phone-icon" /> {phoneDisplay}
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
            className={`tp-header-bottom-2 tp-header-sticky ${sticky ? 'header-sticky' : ''}`}
          >
            <div className="container">
              <div className="tp-mega-menu-wrapper p-relative">
                <div className="row align-items-center">
                  {/* logo */}
                  <div className="col-6 col-sm-4 col-md-4 col-lg-3 col-xl-2">
                    <div className="logo d-flex align-items-center" style={{ gap: '12px' }}>
                      <Link href="/" className="d-flex align-items-center" style={{ gap: '12px' }}>
                        <img
                          src={logoSrc}
                          alt={companyAlt}
                          width={140}
                          height={44}
                          style={{ height: 'auto', width: 'auto', maxWidth: '140px', maxHeight: '44px' }}
                          sizes="(max-width: 600px) 110px, 140px"
                          priority
                        />
                      </Link>
                    </div>
                  </div>

                  {/* menu */}
                  <div className="d-none d-xl-block col-xl-5">
                    <div className="main-menu menu-style-2">
                      <nav className="tp-main-menu-content">
                        <Menus />
                      </nav>
                    </div>
                  </div>

                  {/* right-side icons */}
                  <div className="col-6 col-sm-8 col-md-8 col-lg-9 col-xl-5">
                    <div className="tp-header-bottom-right d-flex align-items-center justify-content-end">
                      <div className="tp-header-search-2 d-none d-sm-block me-3">
                        <form onSubmit={handleSearchSubmit}>
                          <input
                            onChange={(e) => setSearchText(e.target.value)}
                            value={searchText}
                            type="text"
                            placeholder="Search for Products..."
                            aria-label="Search products"
                          />
                          <button type="submit" aria-label="Search">
                            <Search />
                          </button>
                        </form>
                      </div>

                      <div className="tp-header-action d-flex align-items-center">
                        <div className="tp-header-action-item d-none d-lg-block me-2">
                          <Link href="/login" className="tp-header-action-btn" aria-label="Account">
                            <FaUser />
                          </Link>
                        </div>

                        <div className="tp-header-action-item d-none d-lg-block me-2">
                          <Link href="/wishlist" className="tp-header-action-btn" aria-label="Wishlist">
                            <FaHeart />
                            <span className="tp-header-action-badge">{wishlist.length}</span>
                          </Link>
                        </div>

                        <div className="tp-header-action-item me-2">
                          <button
                            onClick={() => dispatch(openCartMini())}
                            className="tp-header-action-btn cartmini-open-btn"
                            aria-label="Open cart"
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
                            aria-label="Open menu"
                          >
                            <FiMenu />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end */}
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