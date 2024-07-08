import React, { useRef, useState } from "react";
import { Box, Modal, Slider, Button } from "@mui/material";
import AvatarEditor from "react-avatar-editor";

import "./Cropper.css";

const CropperModal = ({
  src,
  modalOpen,
  setModalOpen,
  setPreview,
  onUpdateAvatar,
}) => {
  const [slideValue, setSlideValue] = useState(10);
  const cropRef = useRef(null);

  const handleSave = async () => {
    if (cropRef.current) {
      const canvas = cropRef.current.getImageScaledToCanvas();
      canvas.toBlob((blob) => {
        if (blob) {
          const previewUrl = URL.createObjectURL(blob);
          setPreview(previewUrl);
          setModalOpen(false);
          onUpdateAvatar(previewUrl, blob);
        }
      }, "image/png");
    }
  };

  const boxStyle = {
    width: "500px",
    height: "500px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    border: "5px solid #328daa",
    borderRadius: "10px",
    boxSizing: "border-box",
  };

  const modalStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <Modal sx={modalStyle} open={modalOpen}>
      <Box sx={boxStyle}>
        <AvatarEditor
          ref={cropRef}
          image={src}
          style={{ width: "80%", height: "80%", padding: "20px" }}
          border={50}
          borderRadius={150}
          color={[0, 0, 0, 0.9]}
          scale={slideValue / 10}
          rotate={0}
        />
        <Slider
          min={10}
          max={50}
          sx={{
            margin: "0 auto",
            width: "50%",
            color: "#328daa",
          }}
          size="medium"
          defaultValue={slideValue}
          value={slideValue}
          onChange={(e) => setSlideValue(e.target.value)}
        />
        <Box
          sx={{
            display: "flex",
            padding: "10px",
          }}
        >
          <Button
            sx={{ background: "#5596e6", marginRight: "10px" }}
            size="medium"
            variant="contained"
            onClick={handleSave}
          >
            Сохранить
          </Button>
          <Button
            size="medium"
            sx={{
              background: "grey",
            }}
            variant="contained"
            onClick={(e) => setModalOpen(false)}
          >
            Закрыть
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const Cropper = ({ img, onUpdateAvatar }) => {
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
    <main className="container-cropper">
      <CropperModal
        modalOpen={modalOpen}
        src={src}
        setPreview={setPreview}
        setModalOpen={setModalOpen}
        onUpdateAvatar={onUpdateAvatar}
      />
      <div className="img-container">
        <img
          src={
            preview ||
            "https://www.signivis.com/img/custom/avatars/member-avatar-01.png" //Поменять
          }
          alt="Avatar"
          width="200"
          height="200"
        />
      </div>
      <a href="/" onClick={handleInputClick} className="change-avatar-button">
        <div>Сменить аватар</div>
      </a>
      <input
        className="hidden-input"
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImgChange}
      />
    </main>
  );
};

export default Cropper;
