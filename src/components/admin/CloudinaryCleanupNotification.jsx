import { useState, useEffect } from 'react';
import { FiClock, FiAlertTriangle } from 'react-icons/fi';
import { getPendingDeletions, clearPendingDeletions } from '../../utils/cloudinary';
import PropTypes from 'prop-types';

const CloudinaryCleanupNotification = ({ onClose }) => {
  const [pendingDeletions, setPendingDeletions] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const pending = getPendingDeletions();
    setPendingDeletions(pending);
  }, []);

  const handleClearPending = () => {
    clearPendingDeletions();
    setPendingDeletions([]);
  };

  if (pendingDeletions.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-amber-100 border border-amber-300 rounded-lg p-4 max-w-md shadow-lg z-50">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <FiAlertTriangle className="text-amber-600 w-5 h-5" />
          <div>
            <h4 className="font-semibold text-amber-800">Cloudinary Cleanup Needed</h4>
            <p className="text-sm text-amber-700">
              {pendingDeletions.length} files pending server-side deletion
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-amber-600 hover:text-amber-800"
        >
          ×
        </button>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs bg-amber-200 hover:bg-amber-300 px-3 py-1 rounded text-amber-800"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
        <button
          onClick={handleClearPending}
          className="text-xs bg-red-200 hover:bg-red-300 px-3 py-1 rounded text-red-800"
        >
          Clear List
        </button>
      </div>

      {showDetails && (
        <div className="mt-3 max-h-40 overflow-y-auto">
          <div className="text-xs space-y-1">
            {pendingDeletions.map((deletion, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-amber-50 rounded">
                <FiClock className="text-amber-600 w-3 h-3" />
                <span className="text-amber-800 truncate">
                  {deletion.publicId}
                </span>
                <span className="text-amber-600 text-xs">
                  {new Date(deletion.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-amber-700">
            💡 These files should be deleted via server-side API for security
          </div>
        </div>
      )}
    </div>
  );
};

CloudinaryCleanupNotification.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CloudinaryCleanupNotification;
