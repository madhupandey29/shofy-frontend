'use client';
import React, { useEffect, } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
// internal
import ProfileNavTab    from "./profile-nav-tab";
import ProfileShape     from "./profile-shape";
import NavProfileTab    from "./nav-profile-tab";
import ProfileInfo      from "./profile-info";
import ChangePassword   from "./change-password";
// import MyOrders from "./my-orders";
// import { useGetUserOrdersQuery } from "@/redux/features/order/orderApi";


const ProfileArea = () => {
  const router = useRouter();
  // guard
  useEffect(() => {
    if (!Cookies.get("userInfo")) {
      router.push("/login");
    }
  }, [router]);

  // you can keep your loading / error states here if you need
  return (
    <section className="profile__area pt-120 pb-120">
      <div className="container">
        <ProfileShape />
        <div className="row">
          <div className="col-xxl-4 col-lg-4">
            <ProfileNavTab />
          </div>
          <div className="col-xxl-8 col-lg-8">
            <div className="tab-content" id="profile-tabContent">
              <div className="tab-pane fade show active" id="nav-profile">
                <NavProfileTab />
              </div>
              <div className="tab-pane fade" id="nav-information">
                <ProfileInfo />
              </div>
              <div className="tab-pane fade" id="nav-password">
                <ChangePassword />
              </div>
              <div className="tab-pane fade" id="nav-order">
                {/* <MyOrders orderData={orderData} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileArea;
