'use client';
import Image from 'next/image';
import { useState, useMemo, useEffect } from 'react';
import { CgPlayButtonO } from 'react-icons/cg';

/* ---------------- helpers ---------------- */
const isRemote = (url) => !!url && /^https?:\/\//i.test(url);
const isCloudinaryUrl = (url) => !!url && /res\.cloudinary\.com/i.test(url);

const processImageUrl = (url) => {
  if (!url) return null;
  if (isRemote(url)) return url; // http/https → use as-is
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = url.startsWith('/') ? url.slice(1) : url;
  return `${cleanBaseUrl}/uploads/${cleanPath}`;
};

/* ---------------- component ---------------- */
const DetailsThumbWrapper = ({
  imageURLs,           // [{ type:'image'|'video', img: <thumb>, video?: <url> }, ...]
  handleImageActive,   // optional callback when user clicks an image thumb
  activeImg,           // default large image (use product.img)
  imgWidth = 416,
  imgHeight = 480,
  videoId = false,     // optional fallback video url
  status
}) => {
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);

  // 1) normalize + process all items
  const processedImageURLs = useMemo(() => {
    const list = Array.isArray(imageURLs) ? imageURLs : [];
    const seen = new Set();
    return list
      .map((item) => {
        if (!item) return null;
        const type = item.type === 'video' ? 'video' : 'image';
        const img = processImageUrl(item.img || item.thumbnail || item.poster);
        const video = type === 'video'
          ? (isRemote(item.video) ? item.video : processImageUrl(item.video))
          : null;
        return img ? { ...item, type, img, video } : null;
      })
      .filter(Boolean)
      .filter((it) => {
        const k = `${it.type}|${it.img}|${it.video || ''}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
  }, [imageURLs]);

  // 2) default main image: prefer processed activeImg → first image → first item img
  const processedActiveImg = useMemo(() => processImageUrl(activeImg), [activeImg]);

  const firstImageUrl = useMemo(() => {
    const first = processedImageURLs.find((x) => x.type === 'image');
    return first ? first.img : null;
  }, [processedImageURLs]);

  const defaultMain = useMemo(() => {
    return processedActiveImg || firstImageUrl || (processedImageURLs[0]?.img ?? null);
  }, [processedActiveImg, firstImageUrl, processedImageURLs]);

  const [mainSrc, setMainSrc] = useState(defaultMain);

  // reset when product/props change
  useEffect(() => {
    setMainSrc(defaultMain);
    setIsVideoActive(false);
    setCurrentVideoUrl(null);
  }, [defaultMain]);

  // active thumb highlight (compare processed URLs)
  const isActiveThumb = (item) =>
    (!isVideoActive && item.type === 'image' && item.img === mainSrc) ||
    (isVideoActive && item.type === 'video' && item.video === (currentVideoUrl || videoId));

  // click handlers
  const onThumbClick = (item) => {
    if (item.type === 'video') {
      setIsVideoActive(true);
      setCurrentVideoUrl(item.video || videoId || null);
    } else {
      setIsVideoActive(false);
      setCurrentVideoUrl(null);
      setMainSrc(item.img);
      if (typeof handleImageActive === 'function') {
        handleImageActive({ img: item.img, type: 'image' });
      }
    }
  };

  return (
    <div className="tp-product-details-thumb-wrapper tp-tab d-sm-flex">
      {/* Thumbs column */}
      <nav>
        <div className="nav nav-tabs flex-sm-column">
          {processedImageURLs?.map((item, i) =>
            item.type === 'video' ? (
              <button
                key={`v-${i}`}
                className={`nav-link ${isActiveThumb(item) ? 'active' : ''}`}
                onClick={() => onThumbClick(item)}
                type="button"
                style={{
                  position: 'relative',
                  width: 80,
                  height: 80,
                  padding: 0,
                  border: 'none',
                  background: 'none',
                }}
                aria-label="Play video"
                title="Play video"
              >
                <Image
                  src={item.img || '/assets/img/product/default-product-img.jpg'}
                  alt="video thumbnail"
                  width={80}
                  height={80}
                  style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 8 }}
                  unoptimized={isCloudinaryUrl(item.img)}
                  loading="lazy"
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    fontSize: 36,
                    color: '#fff',
                  }}
                  aria-hidden
                >
                  <CgPlayButtonO />
                </span>
              </button>
            ) : (
              <button
                key={`i-${i}`}
                className={`nav-link ${isActiveThumb(item) ? 'active' : ''}`}
                onClick={() => onThumbClick(item)}
                type="button"
              >
                <Image
                  src={item.img || '/assets/img/product/default-product-img.jpg'}
                  alt="image"
                  width={80}
                  height={80}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  unoptimized={isCloudinaryUrl(item.img)}
                  loading="lazy"
                />
              </button>
            )
          )}
        </div>
      </nav>

      {/* Main viewerr */}
      <div className="tab-content m-img">
        <div className="tab-pane fade show active">
          <div className="tp-product-details-nav-main-thumb p-relative">
            {isVideoActive && (currentVideoUrl || videoId) ? (
              <video
                src={currentVideoUrl || videoId}
                controls
                autoPlay
                style={{ width: imgWidth, height: imgHeight, background: '#000', objectFit: 'contain' }}
              />
            ) : (
              <Image
                src={mainSrc || '/assets/img/product/default-product-img.jpg'}
                alt="product img"
                width={imgWidth}
                height={imgHeight}
                style={{ objectFit: 'contain' }}
                unoptimized={isCloudinaryUrl(mainSrc)}
                priority
              />
            )}

            <div className="tp-product-badge">
              {status === 'out-of-stock' && <span className="product-hot">out-stock</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsThumbWrapper;
