import React from "react";
import Loader from "../loader";

function SingleLoader({ loading }) {
  return (
    <div style={{ height: "30px" }}>
      <Loader loading={loading} />
    </div>
  );
}

const ShopStructureLoader = ({ loading }) => {
  return (
    <>
      <SingleLoader loading={loading} />
      <SingleLoader loading={loading} />
      <SingleLoader loading={loading} />
      <SingleLoader loading={loading} />
      <SingleLoader loading={loading} />
    </>
  );
};

export default ShopStructureLoader; 