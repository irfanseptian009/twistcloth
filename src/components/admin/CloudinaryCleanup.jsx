import { useState, useEffect } from 'react';
import { FiTrash2, FiRefreshCw, FiAlertTriangle, FiCheck } from 'react-icons/fi';
import { getPendingDeletions, clearPendingDeletions } from '../../utils/cloudinary';
import toast from 'react-hot-toast';

const CloudinaryCleanup = () => {
  const [pendingDeletions, setPendingDeletions] = useState([]);

  useEffect(() => {
    loadPendingDeletions();
  }, []);

  const loadPendingDeletions = () => {
    const pending = getPendingDeletions();
    setPendingDeletions(pending);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all pending deletions? This action cannot be undone.')) {
      clearPendingDeletions();
      setPendingDeletions([]);
      toast.success('All pending deletions cleared');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FiAlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            Cloudinary Cleanup Manager
          </h3>
          {pendingDeletions.length > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              {pendingDeletions.length} pending
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={loadPendingDeletions}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          {pendingDeletions.length > 0 && (
            <button
              onClick={handleClearAll}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FiTrash2 className="w-4 h-4 mr-2" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiAlertTriangle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Server-side Deletion Required
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Files listed below could not be deleted automatically because Cloudinary deletion 
                requires API credentials. To properly clean up these files:
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Set up a backend endpoint with Cloudinary API credentials</li>
                <li>Use the public_id values below to delete files server-side</li>
                <li>Clear this list once deletions are complete</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {pendingDeletions.length === 0 ? (
        <div className="text-center py-8">
          <FiCheck className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">All Clean!</h3>
          <p className="text-gray-500">No pending file deletions</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingDeletions.map((deletion, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {deletion.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(deletion.timestamp)}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Public ID:
                      </label>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 px-2 py-1 bg-gray-100 border border-gray-200 rounded text-sm font-mono text-gray-800">
                          {deletion.publicId}
                        </code>
                        <button
                          onClick={() => copyToClipboard(deletion.publicId)}
                          className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        File URL:
                      </label>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 px-2 py-1 bg-gray-100 border border-gray-200 rounded text-sm font-mono text-gray-800 truncate">
                          {deletion.fileUrl}
                        </code>
                        <button
                          onClick={() => copyToClipboard(deletion.fileUrl)}
                          className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* API Setup Instructions */}
      {pendingDeletions.length > 0 && (
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Backend Deletion Code Example:
          </h4>
          <pre className="text-xs text-gray-700 bg-white p-3 rounded border overflow-x-auto">
{`// Node.js example with Cloudinary SDK
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'your-cloud-name',
  api_key: 'your-api-key',
  api_secret: 'your-api-secret'
});

// Delete single file
await cloudinary.uploader.destroy(publicId);

// Delete multiple files
await cloudinary.api.delete_resources([...publicIds]);`}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CloudinaryCleanup;
