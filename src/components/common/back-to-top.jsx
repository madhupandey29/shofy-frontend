import { useEffect } from "react";
import BackToTop from "@/lib/back-to-top";
import styles from "./BackToTop.module.scss";

const BackToTopCom = ({ cls }) => {
  useEffect(() => {
    BackToTop(".back-to-top-wrapper");
    return () => {
      // Remove event listeners or cleanup logic here if BackToTop exposes a cleanup method
      // Example: BackToTop.cleanup && BackToTop.cleanup();
    };
  }, []);
  return (
    <div className={`${styles['back-to-top-wrapper']} ${cls || ''}`}>
      <button id="back_to_top" type="button" className={styles['back-to-top-btn']}>
        <span className={styles['back-to-top-icon']}>&uarr;</span>
      </button>
    </div>
  );
};

export default BackToTopCom;