import { forwardRef, useRef, useImperativeHandle, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeDViewerWithRef = forwardRef(({ 
  isRotating, 
  isFullscreen, 
  setIsFullscreen, 
  zoomInTrigger, 
  zoomOutTrigger, 
  resetTrigger, 
  modelUrl,
  selectedColor = '#000000'
}, ref) => {
  const mountRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();
  const cameraRef = useRef();
  const controlsRef = useRef();
  const modelRef = useRef();
  const frameId = useRef();

  // Expose canvas ref to parent component for screenshot
  useImperativeHandle(ref, () => {
    return rendererRef.current?.domElement;
  });

  useEffect(() => {
    if (!mountRef.current) return;   
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa); 
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      750,
      isFullscreen ? window.innerWidth / window.innerHeight : 700 / 700,
      0.1,
      6000
    );
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;   
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      preserveDrawingBuffer: true // Important for screenshots
    });
    renderer.setSize(
      isFullscreen ? window.innerWidth : 550,
      isFullscreen ? window.innerHeight : 520
    );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Enhanced color settings
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.autoRotate = isRotating;
    controls.autoRotateSpeed = 2.0;
    controlsRef.current = controls;    // Lighting - Enhanced for better color visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Increased intensity
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); // Increased intensity
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add additional lighting for better color representation
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.5);
    frontLight.position.set(0, 0, 10);
    scene.add(frontLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(0, 0, -10);
    scene.add(backLight);

    // Load GLB model
    const loader = new GLTFLoader();
    const modelPath = modelUrl || '/baju.glb'; // gunakan modelUrl jika ada
      loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            // Tidak mengubah warna material, biarkan warna asli model
          }
        });
        
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Scale model to fit nicely in view
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        model.scale.setScalar(scale);
        
        // Center the model
        model.position.copy(center).multiplyScalar(-scale);
        
        scene.add(model);
        modelRef.current = model;
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading GLB model:', error);
        // Fallback: try t-shirt.glb
        loader.load(
          '/t-shirt.glb',
          (gltf) => {
            const model = gltf.scene;
            model.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            
            // Center and scale the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 2 / maxDim;
            model.scale.setScalar(scale);
            model.position.copy(center).multiplyScalar(-scale);
            
            scene.add(model);
            modelRef.current = model;
          },
          undefined,
          (fallbackError) => {
            console.error('Error loading fallback GLB model:', fallbackError);
            // Create a simple placeholder if both models fail
            const geometry = new THREE.BoxGeometry(1, 1.5, 0.2);
            const material = new THREE.MeshPhongMaterial({ color: 0x8B5CF6 });
            const placeholder = new THREE.Mesh(geometry, material);
            scene.add(placeholder);
            modelRef.current = placeholder;
          }
        );
      }
    );

    // Add the renderer to the DOM
    const currentMount = mountRef.current;
    currentMount.appendChild(renderer.domElement);

    // Animation loop
    const animate = () => {
      frameId.current = requestAnimationFrame(animate);
      
      controls.autoRotate = isRotating;
      controls.update();
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (isFullscreen) {
        camera.aspect = window.innerWidth / window.innerHeight;
        renderer.setSize(window.innerWidth, window.innerHeight);
      } else {
        camera.aspect = 400 / 320;
        renderer.setSize(400, 320);
      }
      camera.updateProjectionMatrix();
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isRotating, isFullscreen, modelUrl, selectedColor]);
  // Effect to update model color when selectedColor changes
  // Dihapus agar warna model tidak diubah
  // useEffect(() => {
  //   if (modelRef.current && selectedColor) {
  //     modelRef.current.traverse((child) => {
  //       if (child.isMesh && child.material) {
  //         const color = new THREE.Color(selectedColor);
  //         if (!child.material.isCloned) {
  //           child.material = child.material.clone();
  //           child.material.isCloned = true;
  //         }
  //         if (child.material.isMeshStandardMaterial || child.material.isMeshPhongMaterial) {
  //           child.material.color.setHex(color.getHex());
  //           if (child.material.map) {
  //             child.material.color.multiplyScalar(0.8);
  //           }
  //         } else if (child.material.isMeshBasicMaterial) {
  //           child.material.color.setHex(color.getHex());
  //         }
  //         child.material.needsUpdate = true;
  //       }
  //     });
  //   }
  // }, [selectedColor]);

  // Handle zoom in
  useEffect(() => {
    if (zoomInTrigger > 0 && controlsRef.current) {
      const controls = controlsRef.current;
      const zoomSpeed = 0.9;
      controls.object.position.multiplyScalar(zoomSpeed);
      controls.update();
    }
  }, [zoomInTrigger]);

  // Handle zoom out
  useEffect(() => {
    if (zoomOutTrigger > 0 && controlsRef.current) {
      const controls = controlsRef.current;
      const zoomSpeed = 1.1;
      controls.object.position.multiplyScalar(zoomSpeed);
      controls.update();
    }
  }, [zoomOutTrigger]);

  // Handle reset
  useEffect(() => {
    if (resetTrigger > 0 && controlsRef.current && cameraRef.current) {
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      
      // Reset camera position
      camera.position.set(0, 0, 5);
      controls.reset();
      controls.update();
    }
  }, [resetTrigger]);

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black flex items-center justify-center' : 'w-full h-full'}`}>
      <div
        ref={mountRef}
        className="w-full h-full rounded-lg  border-2 shadow-lg overflow-hidden"
        style={{ 
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      />
      
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-colors z-10"
        >
          ❌ Exit Fullscreen
        </button>
      )}
      
      {/* Demo info overlay */}
      <div className="absolute bottom-2 left-2  text-black text-xs p-2 rounded backdrop-blur-sm">
        <div>🖱️ Interactive 3D Preview</div>
        <div>📸 Ready for AI Screenshot</div>
      </div>
    </div>
  );
});

ThreeDViewerWithRef.displayName = 'ThreeDViewerWithRef';

ThreeDViewerWithRef.propTypes = {
  isRotating: PropTypes.bool,
  isFullscreen: PropTypes.bool,
  setIsFullscreen: PropTypes.func.isRequired,
  zoomInTrigger: PropTypes.number,
  zoomOutTrigger: PropTypes.number,
  resetTrigger: PropTypes.number,
  modelUrl: PropTypes.string,
  selectedColor: PropTypes.string,
};

ThreeDViewerWithRef.defaultProps = {
  isRotating: false,
  isFullscreen: false,
  zoomInTrigger: 0,
  zoomOutTrigger: 0,
  resetTrigger: 0,
  modelUrl: '',
  selectedColor: '#000000',
};

export default ThreeDViewerWithRef;