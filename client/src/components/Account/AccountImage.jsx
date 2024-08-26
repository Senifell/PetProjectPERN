import React, { useRef, useState } from "react";
import styles from "./AccountImage.module.css";
import { AccountImageUploader } from "./index.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

function AccountImage({ img, onUpdateImage }) {
  const [src, setSrc] = useState(null);
  const [preview, setPreview] = useState(img);
  const [modalOpen, setModalOpen] = useState(false);
  const inputRef = useRef(null);

  const handleInputClick = (e) => {
    e.preventDefault();
    inputRef.current.click();
  };

  const handleImgChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSrc(URL.createObjectURL(e.target.files[0]));
      setModalOpen(true);
      e.target.value = ""; // чтобы можно было повторно обработать файл с тем же названием
    }
  };

  return (
    <div className={styles.container}>
      <AccountImageUploader
        src={src}
        setPreview={setPreview}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        onUpdateImage={onUpdateImage}
      />
      <div className={styles.imgContainer}>
        <img
          src={
            preview ||
            "https://www.signivis.com/img/custom/avatars/member-avatar-01.png" //Поменять
          }
          alt="Account Img"
          onClick={handleInputClick}
        />
        <div className={styles.iconOverlay}>
          <i className="fa-regular fa-image" onClick={handleInputClick}></i>
        </div>
      </div>
      <a className={styles.changeImageButton}
        href="/"
        onClick={handleInputClick}
      >
        <div>Сменить изображение</div>
      </a>
      <input
        className={styles.hiddenInput}
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImgChange}
      />
    </div>
  );
}

export default AccountImage;
