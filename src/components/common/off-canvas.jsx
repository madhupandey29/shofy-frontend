import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CloseTwo } from '@/svg';
import myLogo from '@assets/img/logo/my_logo.png';
import contact_img from '@assets/img/icon/contact.png';
import language_img from '@assets/img/icon/language-flag.png';
import MobileMenus from './mobile-menus';

// removed unused categoryType prop; fixed default for setIsCanvasOpen
const OffCanvas = ({ isOffCanvasOpen, setIsCanvasOpen = () => {} }) => {
  const [isCurrencyActive, setIsCurrencyActive] = useState(false);
  const [isLanguageActive, setIsLanguageActive] = useState(false);

  const handleLanguageActive = () => {
    setIsLanguageActive((v) => !v);
    setIsCurrencyActive(false);
  };
  const handleCurrencyActive = () => {
    setIsCurrencyActive((v) => !v);
    setIsLanguageActive(false);
  };

  return (
    <>
      <div className={`offcanvas__area offcanvas__radius ${isOffCanvasOpen ? 'offcanvas-opened' : ''}`}>
        <div className="offcanvas__wrapper">
          <div className="offcanvas__close">
            <button onClick={() => setIsCanvasOpen(false)} className="offcanvas__close-btn offcanvas-close-btn">
              <CloseTwo />
            </button>
          </div>
          <div className="offcanvas__content">
            <div className="offcanvas__top mb-70 d-flex justify-content-between align-items-center">
              <div className="offcanvas__logo logo d-flex align-items-center">
                <Link href="/" className="d-flex align-items-center" style={{ gap: '12px' }}>
                  <Image src={myLogo} alt="AGE logo" width={36} height={36} style={{ borderRadius: 8, objectFit: 'cover' }} />
                  <span className="brand-text">AGE</span>
                </Link>
              </div>
            </div>

            <div className="tp-main-menu-mobile fix d-lg-none mb-40">
              <MobileMenus />
            </div>

            <div className="offcanvas__btn">
              <Link href="/contact" className="tp-btn-2 tp-btn-border-2">Contact Us</Link>
            </div>
          </div>

          <div className="offcanvas__bottom">
            <div className="offcanvas__footer d-flex align-items-center justify-content-between">
              <div className="offcanvas__currency-wrapper currency">
                <span onClick={handleCurrencyActive} className="offcanvas__currency-selected-currency tp-currency-toggle">
                  Currency : USD
                </span>
                <ul className={`offcanvas__currency-list tp-currency-list ${isCurrencyActive ? 'tp-currency-list-open' : ''}`}>
                  <li>USD</li><li>ERU</li><li>BDT</li><li>INR</li>
                </ul>
              </div>
              <div className="offcanvas__select language">
                <div className="offcanvas__lang d-flex align-items-center justify-content-md-end">
                  <div className="offcanvas__lang-img mr-15">
                    <Image src={language_img} alt="language-flag" />
                  </div>
                  <div className="offcanvas__lang-wrapper">
                    <span onClick={handleLanguageActive} className="offcanvas__lang-selected-lang tp-lang-toggle">English</span>
                    <ul className={`offcanvas__lang-list tp-lang-list ${isLanguageActive ? 'tp-lang-list-open' : ''}`}>
                      <li>Spanish</li><li>Portugese</li><li>American</li><li>Canada</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div onClick={() => setIsCanvasOpen(false)} className={`body-overlay ${isOffCanvasOpen ? 'opened' : ''}`} />
    </>
  );
};

export default OffCanvas;
