/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
'use client';
import React, { useState } from "react";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from '@/layout/headers/header-2';
import FashionBanner from '@/components/banner/fashion-banner';
import PopularProducts from '@/components/products/fashion/popular-products';
/* import ProductArea from '@/components/products/fashion/product-area'; */
import WeeksFeatured from '@/components/products/fashion/weeks-featured';
import BestSellerProducts from '@/components/products/fashion/best-seller-products';
import FashionTestimonial from '@/components/testimonial/fashion-testimonial';
import BlogArea from '@/components/blog/fashion/blog-area';
import FeatureAreaTwo from '@/components/features/feature-area-2';
import { FiMessageCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import Footer from '@/layout/footers/footer';
import styles from './FloatingButtons.module.scss';

export default function HomePageTwo() {
  const [showTrigger, setShowTrigger] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', phone: '', help: '', email: '', location: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleNext = (e) => { e.preventDefault(); setStep(prev => prev + 1); };
  const handleClose = () => { setShowTrigger(false); setStep(0); setForm({ name: '', phone: '', help: '', email: '', location: '' }); };
  const handleSkipEmail = (e) => {
    e.preventDefault();
    setForm({ ...form, email: '' });
    setStep(step + 1);
  };

  // Close trigger on outside click
  React.useEffect(() => {
    if (!showTrigger) return;
    const handleClick = (e) => {
      const trigger = document.getElementById('chat-trigger-bubble');
      const btn = document.getElementById('chat-float-btn');
      if (trigger && !trigger.contains(e.target) && btn && !btn.contains(e.target)) {
        setShowTrigger(false);
        setStep(0);
        setForm({ name: '', phone: '', help: '', email: '', location: '' });
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showTrigger]);

  const renderChatStep = () => {
    const botBubble = {
      background: '#e3f2fd', color: '#1976d2', borderRadius: 18, padding: '10px 16px', marginBottom: 10, maxWidth: '90%', boxShadow: '0 2px 8px rgba(33,150,243,0.08)', alignSelf: 'flex-start', fontSize: 15, lineHeight: 1.5
    };
    const userBubble = {
      background: '#1976d2', color: 'white', borderRadius: 18, padding: '10px 16px', marginBottom: 10, maxWidth: '90%', boxShadow: '0 2px 8px rgba(25,118,210,0.10)', alignSelf: 'flex-end', fontSize: 15, lineHeight: 1.5
    };
    const formRow = { display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' };
    const inputStyle = { borderRadius: 14, border: '1.2px solid #e0e0e0', padding: '7px 12px', fontSize: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.03)', flex: 1 };
    const submitBtn = { background: '#1976d2', color: 'white', border: 'none', borderRadius: 14, padding: '7px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer', boxShadow: '0 2px 8px rgba(25,118,210,0.10)', height: 34 };
    const skipBtn = { background: '#e0e0e0', color: '#333', border: 'none', borderRadius: 14, padding: '7px 16px', fontWeight: 600, fontSize: 14, marginLeft: 4, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: 34 };
    const closeBtn = { background: '#e53935', color: 'white', border: 'none', borderRadius: 14, padding: '9px 0', fontWeight: 600, fontSize: 15, marginTop: 16, width: '100%', cursor: 'pointer', boxShadow: '0 2px 8px rgba(229,57,53,0.10)', height: 38 };

    switch (step) {
      case 0:
        return (
          <div className="chat-step" style={{display: 'flex', flexDirection: 'column'}}>
            <div className="chat-message bot-message" style={botBubble}>
              <p style={{margin: 0}}>👋 Hi there! Welcome to Amrita Global Enterprise.</p>
              <p style={{margin: 0}}>What&apos;s your name?</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setStep(1); }} style={formRow}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="chat-input"
                style={inputStyle}
                autoFocus
              />
              <button
                type="submit"
                className="chat-submit-btn"
                style={{...submitBtn, opacity: form.name.trim() ? 1 : 0.6, cursor: form.name.trim() ? 'pointer' : 'not-allowed'}}
                disabled={!form.name.trim()}
              >
                Submit
              </button>
            </form>
          </div>
        );
      case 1:
        return (
          <div className="chat-step" style={{display: 'flex', flexDirection: 'column'}}>
            <div className="chat-message bot-message" style={botBubble}>
              <p style={{margin: 0}}>Nice to meet you, <b>{form.name}</b>! 😊</p>
              <p style={{margin: 0}}>How can I help you today?</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} style={formRow}>
              <input
                type="text"
                name="help"
                value={form.help}
                onChange={handleChange}
                placeholder="Type your message..."
                className="chat-input"
                style={inputStyle}
                autoFocus
              />
              <button
                type="submit"
                className="chat-submit-btn"
                style={{...submitBtn, opacity: form.help.trim() ? 1 : 0.6, cursor: form.help.trim() ? 'pointer' : 'not-allowed'}}
                disabled={!form.help.trim()}
              >
                Submit
              </button>
            </form>
          </div>
        );
      case 2:
        return (
          <div className="chat-step" style={{display: 'flex', flexDirection: 'column'}}>
            <div className="chat-message bot-message" style={botBubble}>
              <p style={{margin: 0}}>Thank you for sharing, <b>{form.name}</b>!</p>
              <p style={{margin: 0}}>Could you please share your mobile number?</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} style={formRow}>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Mobile number"
                className="chat-input"
                style={inputStyle}
                autoFocus
              />
              <button
                type="submit"
                className="chat-submit-btn"
                style={{...submitBtn, opacity: form.phone.trim() ? 1 : 0.6, cursor: form.phone.trim() ? 'pointer' : 'not-allowed'}}
                disabled={!form.phone.trim()}
              >
                Submit
              </button>
            </form>
          </div>
        );
      case 3:
        return (
          <div className="chat-step" style={{display: 'flex', flexDirection: 'column'}}>
            <div className="chat-message bot-message" style={botBubble}>
              <p style={{margin: 0}}>Awesome! At Amrita Global Enterprise, we connect you with the best products and services tailored to your needs. Our team is passionate about delivering quality and building lasting relationships.</p>
              <p style={{margin: 0}}>Could you please share your email address?</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setStep(4); }} style={formRow}>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                className="chat-input"
                style={inputStyle}
                autoFocus
              />
              <button
                type="submit"
                className="chat-submit-btn"
                style={{...submitBtn, opacity: form.email.trim() ? 1 : 0.6, cursor: form.email.trim() ? 'pointer' : 'not-allowed'}}
                disabled={!form.email.trim()}
              >
                Submit
              </button>
              <button
                type="button"
                className="chat-skip-btn"
                style={skipBtn}
                onClick={() => setStep(4)}
              >
                Skip
              </button>
            </form>
          </div>
        );
      case 4:
        return (
          <div className="chat-step" style={{display: 'flex', flexDirection: 'column'}}>
            <div className="chat-message bot-message" style={botBubble}>
              <p style={{margin: 0}}>Thank you! Could you let us know your location?</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setStep(5); }} style={formRow}>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Your city or area"
                className="chat-input"
                style={inputStyle}
                autoFocus
              />
              <button
                type="submit"
                className="chat-submit-btn"
                style={{...submitBtn, opacity: form.location.trim() ? 1 : 0.6, cursor: form.location.trim() ? 'pointer' : 'not-allowed'}}
                disabled={!form.location.trim()}
              >
                Submit
              </button>
            </form>
          </div>
        );
      case 5:
        return (
          <div className="chat-step" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div className="chat-message bot-message" style={botBubble}>
              <p style={{margin: 0}}>Thank you, <b>{form.name}</b>! Here&apos;s a bit about us:</p>
              <p style={{margin: 0}}>Amrita Global Enterprise is dedicated to providing top-notch products and services, with a focus on customer satisfaction and trust. We look forward to serving you!</p>
              <p style={{margin: 0}}>Our team will connect with you soon. If you need anything else, feel free to reach out:</p>
              <p style={{marginTop: 8, fontWeight: 500}}>📞 +91 9999999999<br/>📧 info@amritaglobal.com<br/>🌐 www.amritaglobal.com</p>
            </div>
            <button
              className="chat-close-btn"
              style={closeBtn}
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Wrapper>
      <HeaderTwo />
      <h1 style={{position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden'}}>Welcome to Amrita Global Enterprise - Quality Products & Services</h1>
      <FashionBanner />
      <PopularProducts />
     {/*  <ProductArea /> */}
      <WeeksFeatured />
      <FashionTestimonial />
      <BlogArea />
      <FeatureAreaTwo />
      {/* WhatsApp Floating Button (left side) */}
      <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noopener noreferrer"
        className={styles['whatsapp-float-btn']}
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={28} />
      </a>
      {/* Floating Chat Button */}
      {/* Chat Trigger Bubble */}
      <button
        id="chat-float-btn"
        className={styles['message-float-btn']}
        onClick={() => setShowTrigger(true)}
        aria-label="Contact Us"
      >
        <FiMessageCircle size={28} />
      </button>
      {showTrigger && (
        <div
          id="chat-trigger-bubble"
          style={{
            position: 'fixed',
            right: 40,
            bottom: 100,
            zIndex: 1100,
            background: 'white',
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            padding: 20,
            minWidth: 260,
            maxWidth: 340,
            animation: 'fadeIn 0.2s',
          }}
        >
          <div className="custom-chat-content">
            {renderChatStep()}
          </div>
          <div
            style={{
              position: 'absolute',
              right: 24,
              bottom: -12,
              width: 0,
              height: 0,
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: '12px solid white',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.10))',
            }}
          />
        </div>
      )}
      <Footer />
      {/* Responsive chat trigger styles */}
      <style>{`
        @media (max-width: 600px) {
          #chat-trigger-bubble {
            right: 2vw !important;
            left: 2vw !important;
            width: 96vw !important;
            min-width: unset !important;
            max-width: 98vw !important;
            padding: 10px 6px !important;
          }
          .chat-input {
            font-size: 13px !important;
            padding: 6px 8px !important;
          }
          .chat-submit-btn, .chat-skip-btn, .chat-close-btn {
            font-size: 13px !important;
            padding: 6px 10px !important;
            height: 30px !important;
          }
          .chat-message.bot-message {
            font-size: 13px !important;
            padding: 8px 10px !important;
          }
        }
      `}</style>
    </Wrapper>
  );
}
