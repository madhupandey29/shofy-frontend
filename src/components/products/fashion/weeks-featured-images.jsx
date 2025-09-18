import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetTopRatedQuery } from "@/redux/features/newProductApi";

const getImageUrl = (item) => {
  if (item.image && item.image.startsWith('http')) return item.image;
  if (item.image1 && item.image1.startsWith('http')) return item.image1;
  if (item.image2 && item.image2.startsWith('http')) return item.image2;
  return '/assets/img/product/default-product-img.jpg';
};

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: 24,
  gap: 16,
};
const imgStyle = {
  objectFit: 'contain',
  borderRadius: 12,
  border: '1px solid #eee',
  background: '#fafafa',
  width: 90,
  height: 90,
  flexShrink: 0,
  transition: 'box-shadow 0.2s, transform 0.2s',
};
const detailsStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minWidth: 0,
};
const nameStyle = {
  fontSize: 15,
  fontWeight: 600,
  color: '#222',
  marginBottom: 4,
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  maxWidth: 140,
};
const infoStyle = {
  fontSize: 13,
  color: '#666',
  marginBottom: 2,
};
const priceStyle = {
  fontWeight: 700,
  color: '#1976d2',
  marginLeft: 6,
};
const headingStyle = {
  fontSize: 16,
  fontWeight: 700,
  marginBottom: 4,
  marginTop: 18,
  letterSpacing: 0.1,
};
const dividerStyle = {
  border: 0,
  borderTop: '1.5px solid #eaeaea',
  margin: '0 0 14px 0',
};

const WeeksFeaturedImages = () => {
  const { data: products, isError, isLoading } = useGetTopRatedQuery();
  if (isLoading || isError || !products?.data?.length) return null;
  return (
    <div style={{ margin: '18px 0' }}>
      <div style={headingStyle}>Weeks Featured</div>
      <hr style={dividerStyle} />
      {products.data.slice(0, 3).map((item) => {
        const price = item.price || item.salesPrice;
        const slug = item.slug || item._id;
        return (
          <Link href={`/fabric/${slug}`} key={item._id} style={{ textDecoration: 'none', display: 'block' }}>
            <div style={rowStyle}>
              <Image
                src={getImageUrl(item)}
                alt={item.title || 'product'}
                width={90}
                height={90}
                style={imgStyle}
                className="product-image-img"
              />
              <div style={detailsStyle}>
                <div style={nameStyle} title={item.title}>{item.title?.slice(0, 30) || 'Product'}</div>
                <div style={infoStyle}>
                  {item.gsm && <>GSM: {item.gsm}</>}
                  {item.gsm && price && <span> | </span>}
                  {price && <span style={priceStyle}>${price}</span>}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
      <style>{`
        .product-image-img:hover {
          box-shadow: 0 4px 16px rgba(33,150,243,0.13);
          transform: translateY(-2px) scale(1.04);
        }
      `}</style>
    </div>
  );
};

export default WeeksFeaturedImages; 