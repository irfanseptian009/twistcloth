
import PropTypes from 'prop-types';
import { useTheme } from "../../contexts/ThemeContext";

const Modal = ({ isOpen, onClose, children }) => {
  const { colors, glass } = useTheme();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-in fade-in duration-200">
      <div className={`${glass.background} ${glass.border} ${colors.text} p-6 rounded-xl shadow-2xl w-96 xl:w-auto relative backdrop-blur-lg animate-in slide-in-from-bottom-4 duration-300`}>
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 ${colors.textMuted} hover:${colors.text} text-xl font-bold transition-colors duration-200 hover:scale-110 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/20`}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
