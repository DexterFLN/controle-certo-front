import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CustomToast.css';

const CustomToast = (message, type, autoClose) => {
    toast(message, {
        type: type,
        position: "top-right",
        autoClose: autoClose,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: `custom-toast toast-${type}`,
        bodyClassName: 'custom-toast-body',
        progressClassName: 'custom-toast-progress'
    });
};

export default CustomToast;
