import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import PropTypes from 'prop-types';
import { FiRotateCw, FiZoomIn, FiZoomOut, FiMaximize, FiMinimize, FiRefreshCcw } from 'react-icons/fi';

const Enhanced3DViewer = ({ 
  modelUrl, 
  selectedColor = '#000000',
  onLoadStart,
  onLoadComplete,
  onLoadError,
  autoRotate = false,
  enableControls = true,
  className = ''
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const meshRef = useRef(null);
  const mixerRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const frameRef = useRef();

  const orbitRef = useRef({
    spherical: new THREE.Spherical(8, Math.PI / 3, Math.PI / 4),
    target: new THREE.Vector3(0, 0, 0),
    minRadius: 3,
    maxRadius: 15,
    minPolarAngle: 0.1,
    maxPolarAngle: Math.PI - 0.1
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize 3D scene
  const initScene = () => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-10, 10, -5);
    scene.add(pointLight);

    mountRef.current.appendChild(renderer.domElement);
    updateCameraPosition();
  };

  // Update camera position based on orbit controls
  const updateCameraPosition = () => {
    const camera = cameraRef.current;
    if (!camera) return;

    const orbit = orbitRef.current;
    const position = new THREE.Vector3().setFromSpherical(orbit.spherical).add(orbit.target);
    camera.position.copy(position);
    camera.lookAt(orbit.target);
  };

  // Load 3D model
  const loadModel = async (url) => {
    if (!sceneRef.current || !url) return;

    try {
      setIsLoading(true);
      setError(null);
      onLoadStart?.();

      // Remove existing model
      if (meshRef.current) {
        sceneRef.current.remove(meshRef.current);
        meshRef.current = null;
      }

      const loader = new GLTFLoader();
      const gltf = await new Promise((resolve, reject) => {
        loader.load(
          url,
          resolve,
          undefined,
          reject
        );
      });

      const model = gltf.scene;
      
      // Center and scale the model
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z);
      const scale = 4 / maxDimension;

      model.position.copy(center).multiplyScalar(-scale);
      model.scale.setScalar(scale);

      // Enable shadows
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      sceneRef.current.add(model);
      meshRef.current = model;

      // Setup animations if available
      if (gltf.animations && gltf.animations.length > 0) {
        mixerRef.current = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
          mixerRef.current.clipAction(clip).play();
        });
      }

      // Apply initial color
      applyColor(selectedColor);

      setIsLoading(false);
      onLoadComplete?.();

    } catch (err) {
      console.error('Error loading 3D model:', err);
      setError('Failed to load 3D model');
      setIsLoading(false);
      onLoadError?.(err);
    }
  };

  // Apply color to model materials
  const applyColor = (color) => {
    if (!meshRef.current) return;

    meshRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        // Create new material if needed
        if (Array.isArray(child.material)) {
          child.material = child.material.map(mat => {
            const newMat = mat.clone();
            newMat.color.setHex(color.replace('#', '0x'));
            return newMat;
          });
        } else {
          const newMat = child.material.clone();
          newMat.color.setHex(color.replace('#', '0x'));
          child.material = newMat;
        }
      }
    });
  };

  // Animation loop
  const animate = () => {
    frameRef.current = requestAnimationFrame(animate);

    if (mixerRef.current) {
      mixerRef.current.update(clockRef.current.getDelta());
    }

    // Auto rotation
    if (isRotating && !isDragging && orbitRef.current) {
      orbitRef.current.spherical.theta += 0.01;
      updateCameraPosition();
    }

    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

  // Mouse controls
  const handleMouseDown = (e) => {
    if (!enableControls) return;
    setIsDragging(true);
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      orbitRef.current.spherical.theta -= deltaX * 0.01;
      orbitRef.current.spherical.phi += deltaY * 0.01;
      
      // Clamp phi
      orbitRef.current.spherical.phi = Math.max(
        orbitRef.current.minPolarAngle,
        Math.min(orbitRef.current.maxPolarAngle, orbitRef.current.spherical.phi)
      );
      
      updateCameraPosition();
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Wheel controls for zoom
  const handleWheel = (e) => {
    if (!enableControls) return;
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? 1.1 : 0.9;
    orbitRef.current.spherical.radius = Math.max(
      orbitRef.current.minRadius,
      Math.min(orbitRef.current.maxRadius, orbitRef.current.spherical.radius * delta)
    );
    
    updateCameraPosition();
  };

  // Control functions
  const zoomIn = () => {
    orbitRef.current.spherical.radius = Math.max(
      orbitRef.current.minRadius,
      orbitRef.current.spherical.radius * 0.8
    );
    updateCameraPosition();
  };

  const zoomOut = () => {
    orbitRef.current.spherical.radius = Math.min(
      orbitRef.current.maxRadius,
      orbitRef.current.spherical.radius * 1.2
    );
    updateCameraPosition();
  };

  const resetView = () => {
    orbitRef.current.spherical.set(8, Math.PI / 3, Math.PI / 4);
    updateCameraPosition();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle window resize
  const handleResize = () => {
    if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  };
  // Effects
  useEffect(() => {
    const mount = mountRef.current;
    
    initScene();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (rendererRef.current && mount) {
        mount.removeChild(rendererRef.current.domElement);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (modelUrl) {
      loadModel(modelUrl);
    }
  }, [modelUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedColor) {
      applyColor(selectedColor);
    }
  }, [selectedColor]);

  return (
    <div className={`relative ${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        style={{ minHeight: isFullscreen ? '100vh' : '400px' }}
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading 3D model...</p>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => loadModel(modelUrl)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      {enableControls && !isLoading && !error && (
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-2 rounded-lg shadow-lg transition-colors duration-200 ${
              isRotating 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            title={isRotating ? 'Stop rotation' : 'Start rotation'}
          >
            <FiRotateCw className="w-5 h-5" />
          </button>
          
          <button
            onClick={zoomIn}
            className="p-2 bg-white text-gray-700 rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-200"
            title="Zoom in"
          >
            <FiZoomIn className="w-5 h-5" />
          </button>
          
          <button
            onClick={zoomOut}
            className="p-2 bg-white text-gray-700 rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-200"
            title="Zoom out"
          >
            <FiZoomOut className="w-5 h-5" />
          </button>
          
          <button
            onClick={resetView}
            className="p-2 bg-white text-gray-700 rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-200"
            title="Reset view"
          >
            <FiRefreshCcw className="w-5 h-5" />
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-white text-gray-700 rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-200"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <FiMinimize className="w-5 h-5" /> : <FiMaximize className="w-5 h-5" />}
          </button>
        </div>
      )}
    </div>
  );
};

Enhanced3DViewer.propTypes = {
  modelUrl: PropTypes.string,
  selectedColor: PropTypes.string,
  onLoadStart: PropTypes.func,
  onLoadComplete: PropTypes.func,
  onLoadError: PropTypes.func,
  autoRotate: PropTypes.bool,
  enableControls: PropTypes.bool,
  className: PropTypes.string,
};

export default Enhanced3DViewer;
