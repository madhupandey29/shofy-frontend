'use client';
import Image from "next/image";
import { useState, useMemo } from "react";
import { CgPlayButtonO } from "react-icons/cg";

// Helper function to check if URL is from Cloudinary
const isCloudinaryUrl = (url) => {
  return url && (url.includes('res.cloudinary.com') || url.startsWith('https://'));
};

// Helper function to process image URLs
const processImageUrl = (url) => {
  if (!url) return null;   // ✅ return null instead of empty string
  if (isCloudinaryUrl(url)) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = url.startsWith('/') ? url.slice(1) : url;
  return `${cleanBaseUrl}/uploads/${cleanPath}`;
};

const DetailsThumbWrapper = ({
  imageURLs,
  handleImageActive,
  activeImg,
  imgWidth = 416,
  imgHeight = 480,
  videoId = false,
  status
}) => {
  const [isVideoActive, setIsVideoActive] = useState(false);
  
  // Process active image URL
  const processedActiveImg = useMemo(() => processImageUrl(activeImg), [activeImg]);
  
  // Process thumbnail URLs
  const processedImageURLs = useMemo(() => 
    imageURLs?.map(item => ({
      ...item,
      img: processImageUrl(item.img)
    }))
  , [imageURLs]);

  return (
    <>
      <div className="tp-product-details-thumb-wrapper tp-tab d-sm-flex">
        <nav>
          <div className="nav nav-tabs flex-sm-column">
            {processedImageURLs?.map((item, i) => {
              const isCloudinary = isCloudinaryUrl(item.img);
              return item.type === "video" ? (
                <button
                  key={i}
                  className={`nav-link ${isVideoActive ? "active" : ""}`}
                  onClick={() => setIsVideoActive(true)}
                  type="button"
                  style={{
                    position: "relative",
                    width: 80,
                    height: 80,
                    padding: 0,
                    border: 'none',
                    background: 'none'
                  }}
                >
                  <Image
                    src={item.img || "/assets/img/product/default-product-img.jpg"}   
                    alt="video thumbnail"
                    width={80}
                    height={80}
                    style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 8 }}
                    unoptimized={isCloudinary}
                    loading="lazy"
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      pointerEvents: "none",
                      fontSize: 36,
                      color: "#fff"
                    }}
                  >
                    <CgPlayButtonO />
                  </span>
                </button>
              ) : (
                <button
                  key={i}
                  className={`nav-link ${item.img === activeImg && !isVideoActive ? "active" : ""}`}
                  onClick={() => {
                    handleImageActive(item);
                    setIsVideoActive(false);
                  }}
                  type="button"
                >
                  <Image
                    src={item.img || "/assets/img/product/default-product-img.jpg"}   
                    alt="image"
                    width={80}
                    height={80}
                    style={{ width: "100%", height: "100%", objectFit: 'contain' }}
                    unoptimized={isCloudinary}
                    loading="lazy"
                  />
                </button>
              );
            })}
          </div>
        </nav>
        <div className="tab-content m-img">
          <div className="tab-pane fade show active">
            <div className="tp-product-details-nav-main-thumb p-relative">
              {isVideoActive && videoId ? (
                <video
                  src={videoId}
                  controls
                  autoPlay
                  style={{ width: imgWidth, height: imgHeight, background: "#000", objectFit: 'contain' }}
                />
              ) : (
                <Image
                  src={processedActiveImg || "/assets/img/product/default-product-img.jpg"}   
                  alt="product img"
                  width={imgWidth}
                  height={imgHeight}
                  style={{ objectFit: 'contain' }}
                  unoptimized={isCloudinaryUrl(processedActiveImg)}
                  priority={true}
                />
              )}
              <div className="tp-product-badge">
                {status === 'out-of-stock' && <span className="product-hot">out-stock</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailsThumbWrapper;
