import React, { useRef, useState } from "react";
import { Box, Modal, Slider, Button } from "@mui/material";
import AvatarEditor from "react-avatar-editor";
import styles from "./AccountImageUploader.module.css";

function AccountImageUploader({
  src,
  setPreview,
  modalOpen,
  setModalOpen,
  onUpdateImage,
}) {
  const [slideValue, setSlideValue] = useState(10);
  const cropRef = useRef(null);

  const handleSave = () => {
    if (cropRef.current) {
      const canvas = cropRef.current.getImageScaledToCanvas();
      canvas.toBlob((blob) => {
        if (blob) {
          const previewUrl = URL.createObjectURL(blob);
          setPreview(previewUrl);
          setModalOpen(false);
          onUpdateImage(previewUrl, blob);
        }
      }, "image/png");
    }
  };

  return (
    <Modal className={styles.modalStyle} open={modalOpen}>
      <Box className={styles.boxStyle}>
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
          className={styles.sliderStyle}
          size="medium"
          defaultValue={slideValue}
          value={slideValue}
          onChange={(e) => setSlideValue(e.target.value)}
        />
        <Box>
          <Button
            className={styles.buttonStyleSave}
            size="medium"
            variant="contained"
            onClick={handleSave}
          >
            Сохранить
          </Button>
          <Button
            className={styles.buttonStyleClose}
            size="medium"
            variant="contained"
            onClick={() => setModalOpen(false)}
          >
            Закрыть
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AccountImageUploader;