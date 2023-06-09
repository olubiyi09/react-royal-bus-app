import ReactDOM from "react-dom";
import styles from "./Loader.module.scss";
import loaderImg from "../../assets/loader.gif";
import loaderSpinner from "../../assets/loader-spinner.gif";

const Loader = () => {
  return ReactDOM.createPortal(
    <div className={styles.wrapper}>
      <div className={styles.loader}>
        {/* <img src={loaderImg} alt="loaing..." /> */}
        <img src={loaderSpinner} alt="loaing..." width={70} />
      </div>
    </div>,
    document.getElementById("loader")
  );
};

export default Loader;
