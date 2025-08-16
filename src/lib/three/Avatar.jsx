import { useGLTF } from '@react-three/drei';
import PropTypes from 'prop-types';

export default function Avatar({ skinTone, clothingUrl }) {
  const avatar = useGLTF('/models/baju.glb');
  const clothing = useGLTF(clothingUrl);

  avatar.scene.traverse((child) => {
    if (child.isMesh && child.name.includes('Skin')) {
      child.material.color.set(skinTone);
    }
  });

  return (
    <group>
      <primitive object={avatar.scene} />
      <primitive object={clothing.scene} />
    </group>
  );
}

Avatar.propTypes = {
  skinTone: PropTypes.string.isRequired,
  clothingUrl: PropTypes.string.isRequired,
};
