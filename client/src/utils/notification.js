import { toast } from "react-toastify";

const options = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

function successNotif(msg) {
    toast.success(msg, options);
}

function infoNotif(msg) {
    toast.info(msg, options);
}

function errorNotif(msg) {
    toast.error(msg, options);
}

export { successNotif, infoNotif, errorNotif };