import { Canvas } from '@react-three/fiber';
import Scene from '../TowerCrane3D/TowerCrane3D';
import styles from './ThreeScene.module.css';

const ThreeScene = () => {
    return (
        <div className={styles.sceneContainer}>
            <Canvas
                shadows
                camera={{ position: [0, 0, 8], fov: 50 }}
                className={styles.canvas}
            >
                <Scene />
            </Canvas>
        </div>
    );
};

export default ThreeScene;