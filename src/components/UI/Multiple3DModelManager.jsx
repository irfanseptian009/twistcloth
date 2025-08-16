import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiBox } from 'react-icons/fi';
import PropTypes from 'prop-types';
import GLBFileUpload from './GLBFileUpload';

const ModelVariantEditor = ({ model, index, updateModel, toggleSize, localAvailableSizes, handleAddSize, newSize, setNewSize }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (model.modelFile && typeof model.modelFile !== 'string') {
      const url = URL.createObjectURL(model.modelFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof model.modelFile === 'string') {
      setPreviewUrl(model.modelFile);
    }
  }, [model.modelFile]);

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Form */}
        <div className="space-y-4">
          {/* Model Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Model Name</label>
            <input
              type="text"
              placeholder="e.g., Red Variant"
              value={model.name}
              onChange={(e) => updateModel(index, 'name', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Color */}
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Color Name</label>
              <input
                type="text"
                placeholder="e.g., Crimson Red"
                value={model.colorName}
                onChange={(e) => updateModel(index, 'colorName', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <input
                type="color"
                value={model.colorHex}
                onChange={(e) => updateModel(index, 'colorHex', e.target.value)}
                className="mt-1 block w-24 h-10 p-1 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              placeholder="Brief description for this model variant..."
              value={model.description}
              onChange={(e) => updateModel(index, 'description', e.target.value)}
              rows={2}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Right Column: 3D Preview & File Upload */}
        <div className="space-y-4">
          <GLBFileUpload
            label="3D Model File (.glb)"
            onFileChange={(file) => updateModel(index, 'modelFile', file)}
            currentFile={model.modelFile}
          />          {previewUrl && (
            <div className="mt-4 p-2 border rounded-lg bg-gray-100 h-48 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-2 rounded-lg bg-gray-200 flex items-center justify-center">
                  <FiBox className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">
                  {model.modelFile?.name || 'Model 3D Preview'}
                </p>
                <p className="text-xs text-gray-500">
                  File: {previewUrl.split('/').pop() || 'model.glb'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Size Management (Full Width) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Available Sizes
        </label>
        <div className="flex flex-wrap gap-2">
          {localAvailableSizes.map(size => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(index, size)}
              className={`px-3 py-1 border rounded-full text-sm font-medium ${
                (model.sizes || []).includes(size)
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            placeholder="Add new size (e.g., XXXL)"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={handleAddSize}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Size
          </button>
        </div>
      </div>
    </div>
  );
};

ModelVariantEditor.propTypes = {
    model: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    updateModel: PropTypes.func.isRequired,
    toggleSize: PropTypes.func.isRequired,
    localAvailableSizes: PropTypes.array.isRequired,
    handleAddSize: PropTypes.func.isRequired,
    newSize: PropTypes.string.isRequired,
    setNewSize: PropTypes.func.isRequired,
};

const Multiple3DModelManager = ({ models = [], onChange }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const addNewModel = () => {
    const newModel = {
      id: Date.now().toString(),
      name: '',
      modelFile: null,
      colorName: '',
      colorHex: '#000000',
      description: '',
      sizes: ['M'], // Default size
      isRequired: false
    };
    onChange([...models, newModel]);
    setExpandedIndex(models.length);
  };

  const updateModel = (index, field, value) => {
    const updatedModels = models.map((model, i) => 
      i === index ? { ...model, [field]: value } : model
    );
    onChange(updatedModels);
  };

  const removeModel = (index) => {
    const updatedModels = models.filter((_, i) => i !== index);
    onChange(updatedModels);
    if (expandedIndex === index) {
      setExpandedIndex(null);
    }
  };

  const toggleSize = (modelIndex, size) => {
    const model = models[modelIndex];
    const currentSizes = model.sizes || [];
    const updatedSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size];
    
    updateModel(modelIndex, 'sizes', updatedSizes);
  };

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const [localAvailableSizes, setLocalAvailableSizes] = useState(availableSizes);
  const [newSize, setNewSize] = useState('');

  const handleAddSize = () => {
    if (newSize && !localAvailableSizes.includes(newSize.toUpperCase())) {
      setLocalAvailableSizes([...localAvailableSizes, newSize.toUpperCase()]);
      setNewSize('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">3D Models & Variants</h3>
        <button
          type="button"
          onClick={addNewModel}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add 3D Model
        </button>
      </div>

      {models.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <FiBox className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No 3D models added yet</p>
          <p className="text-sm text-gray-400">Click &quot;Add 3D Model&quot; to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {models.map((model, index) => (
            <div
              key={model.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Model Header */}
              <div
                className="bg-gray-50 px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FiBox className="w-5 h-5 text-indigo-500" />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {model.name || `Model ${index + 1}`}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Color: {model.colorName || 'Not set'} • Sizes: {(model.sizes || []).join(', ') || 'None'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: model.colorHex }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeModel(index);
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {expandedIndex === index && (
                <ModelVariantEditor 
                  model={model}
                  index={index}
                  updateModel={updateModel}
                  toggleSize={toggleSize}
                  localAvailableSizes={localAvailableSizes}
                  handleAddSize={handleAddSize}
                  newSize={newSize}
                  setNewSize={setNewSize}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Multiple3DModelManager.propTypes = {
  models: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    modelFile: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    colorName: PropTypes.string,
    colorHex: PropTypes.string,
    description: PropTypes.string,
    sizes: PropTypes.arrayOf(PropTypes.string),
  })),
  onChange: PropTypes.func.isRequired,
};

export default Multiple3DModelManager;
