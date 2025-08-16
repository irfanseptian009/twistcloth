import { forwardRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useEffect, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

const ThreeDViewerWithRef = forwardRef(({ 
  isRotating, 
  isFullscreen, 
  setIsFullscreen, 
  zoomInTrigger, 
  zoomOutTrigger, 
  resetTrigger 
}, ref) => {
  const canvasRef = useRef();
  const controlsRef = useRef();

  // Expose canvas ref to parent
  useImperativeHandle(ref, () => canvasRef.current);

  useEffect(() => {
    if (zoomInTrigger > 0 && controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.position.multiplyScalar(0.8);
      controlsRef.current.update();
    }
  }, [zoomInTrigger]);

  useEffect(() => {
    if (zoomOutTrigger > 0 && controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.position.multiplyScalar(1.25);
      controlsRef.current.update();
    }
  }, [zoomOutTrigger]);

  useEffect(() => {
    if (resetTrigger > 0 && controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [resetTrigger]);

  // Simple 3D Box component
  const Box = () => {
    const meshRef = useRef();    useEffect(() => {
      if (isRotating && meshRef.current) {
        const animate = () => {
          if (meshRef.current && isRotating) {
            meshRef.current.rotation.y += 0.01;
            requestAnimationFrame(animate);
          }
        };
        animate();
      }
    }, []);  // Remove isRotating from dependencies to avoid unnecessary re-renders

    return (
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="purple" />
      </mesh>
    );
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'w-full h-80'}`}>
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ 
          width: '100%', 
          height: '100%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Box />
        <OrbitControls 
          ref={controlsRef}
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true} 
        />
      </Canvas>
      
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-colors z-10"
        >
          Exit Fullscreen
        </button>
      )}
    </div>
  );
});

ThreeDViewerWithRef.displayName = 'ThreeDViewerWithRef';

ThreeDViewerWithRef.propTypes = {
  isRotating: PropTypes.bool,
  isFullscreen: PropTypes.bool,
  setIsFullscreen: PropTypes.func,
  zoomInTrigger: PropTypes.number,
  zoomOutTrigger: PropTypes.number,
  resetTrigger: PropTypes.number
};

export default ThreeDViewerWithRef;