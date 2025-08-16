import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import PropTypes from 'prop-types';

const MODEL_PATH = '/baju.glb';

export default function ThreeDViewer({
  isRotating,
  isFullscreen,
  setIsFullscreen,
  zoomInTrigger,
  zoomOutTrigger,
  resetTrigger
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const meshRef = useRef(null);
  const mixerRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());

  const orbitRef = useRef({
    spherical: new THREE.Spherical(8, Math.PI / 3, Math.PI / 4),
    target: new THREE.Vector3(0, 0, 0),
    minRadius: 3,
    maxRadius: 15,
    minPolarAngle: 0.1,
    maxPolarAngle: Math.PI - 0.1
  });

  const [isLoading3D, setIsLoading3D] = useState(true);
  const [modelError, setModelError] = useState(null);

  const updateCameraPosition = () => {
    const camera = cameraRef.current;
    if (!camera) return;

    const orbit = orbitRef.current;
    const position = new THREE.Vector3().setFromSpherical(orbit.spherical).add(orbit.target);
    camera.position.copy(position);
    camera.lookAt(orbit.target);
  };

  const loadGLB = (scene) => {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        MODEL_PATH,
        (gltf) => {
          const model = gltf.scene;
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          model.position.set(-center.x, -center.y, -center.z);
          const scale = 6 / Math.max(size.x, size.y, size.z);
          model.scale.setScalar(scale);

          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              child.material.needsUpdate = true;
            }
          });

          scene.add(model);

          if (gltf.animations.length) {
            const mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
            mixerRef.current = mixer;
          }

          resolve(model);
        },
        undefined,
        (err) => reject(err)
      );
    });
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    updateCameraPosition();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    mount.appendChild(renderer.domElement);

    const resizeRenderer = () => {
      const size = isFullscreen ? Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9) : 374;
      renderer.setSize(size, size);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };
    resizeRenderer();

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1);
    keyLight.position.set(10, 10, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.ShadowMaterial({ opacity: 0.15 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.position.y = -3;
    scene.add(ground);

    setIsLoading3D(true);
    setModelError(null);

    loadGLB(scene)
      .then((model) => {
        meshRef.current = model;
        setIsLoading3D(false);
      })
      .catch((err) => {
        setModelError('Failed to load model: ' + err.message);
        setIsLoading3D(false);
      });

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clockRef.current.getDelta();
      if (isRotating && meshRef.current) {
        meshRef.current.rotation.y += 0.003;
      }
      updateCameraPosition();
      mixerRef.current?.update(delta);
      renderer.render(scene, camera);
    };
    animate();

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    window.addEventListener('resize', resizeRenderer);

    return () => {
      window.removeEventListener('resize', resizeRenderer);
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
        renderer.dispose();
      }
      scene.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });
    };
  }, [isFullscreen, isRotating]);

 useEffect(() => {
  const canvas = rendererRef.current?.domElement;
  if (!canvas) return;

  let startX = 0;
  let startY = 0;
  let dragging = false;

  const onDown = (e) => {
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    canvas.style.cursor = 'grabbing';
  };

  const onMove = (e) => {
    if (!dragging) return;

    const dx = (e.clientX - startX) / canvas.clientWidth;
    const dy = (e.clientY - startY) / canvas.clientHeight;
    startX = e.clientX;
    startY = e.clientY;

    const orbit = orbitRef.current;
    orbit.spherical.theta -= dx * Math.PI * 2;
    orbit.spherical.phi += dy * Math.PI * 2;

    orbit.spherical.phi = Math.max(
      orbit.minPolarAngle,
      Math.min(orbit.maxPolarAngle, orbit.spherical.phi)
    );
  };

  const onUp = () => {
    dragging = false;
    canvas.style.cursor = 'grab';
  };

  const onWheel = (e) => {
    e.preventDefault();
    const orbit = orbitRef.current;
    const delta = e.deltaY > 0 ? 1 : -1;
    orbit.spherical.radius = THREE.MathUtils.clamp(
      orbit.spherical.radius + delta * 0.5,
      orbit.minRadius,
      orbit.maxRadius
    );
  };

  canvas.style.cursor = 'grab';
  canvas.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  canvas.addEventListener('wheel', onWheel, { passive: false });

  return () => {
    canvas.removeEventListener('mousedown', onDown);
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
    canvas.removeEventListener('wheel', onWheel);
  };
}, [isFullscreen]); // 🟢 Tambahkan dependensi ini


  // 🔁 Handle external zoom/reset triggers
  useEffect(() => {
    if (zoomInTrigger > 0) {
      const o = orbitRef.current;
      o.spherical.radius = Math.max(o.minRadius, o.spherical.radius - 1);
    }
  }, [zoomInTrigger]);

  useEffect(() => {
    if (zoomOutTrigger > 0) {
      const o = orbitRef.current;
      o.spherical.radius = Math.min(o.maxRadius, o.spherical.radius + 1);
    }
  }, [zoomOutTrigger]);

  useEffect(() => {
    if (resetTrigger > 0) {
      const o = orbitRef.current;
      o.spherical.set(8, Math.PI / 3, Math.PI / 4);
      o.target.set(0, 0, 0);
    }
  }, [resetTrigger]);

  return (
    <div
      ref={mountRef}
      className={`${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-full'} relative rounded-lg`}
      onDoubleClick={() => setIsFullscreen((prev) => !prev)}
    >
      {isLoading3D && (
        <div className="absolute inset-0 bg-white/80 flex justify-center items-center">
          Loading...
        </div>
      )}
      {modelError && (
        <div className="absolute inset-0 bg-red-100 text-red-600 p-4">
          {modelError}
        </div>
      )}
    </div>
  );
}

ThreeDViewer.propTypes = {
  isRotating: PropTypes.bool.isRequired,
  isFullscreen: PropTypes.bool.isRequired,
  setIsFullscreen: PropTypes.func.isRequired,
  zoomInTrigger: PropTypes.number,
  zoomOutTrigger: PropTypes.number,
  resetTrigger: PropTypes.number,
};
