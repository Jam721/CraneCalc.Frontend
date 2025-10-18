import { useRef, useEffect, useState } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FBXLoader } from 'three-stdlib';
import * as THREE from 'three';

const TowerCrane3D = () => {
    const groupRef = useRef<THREE.Group>(null);
    const fbx = useLoader(FBXLoader, `${import.meta.env.BASE_URL}assets/Tower_crane.fbx`);
    const [modelReady, setModelReady] = useState(false);

    useEffect(() => {
        if (fbx) {
            fbx.scale.set(0.01, 0.01, 0.01);
            fbx.position.set(0, -1, 0);

            fbx.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;

                    if (child.material) {
                        child.material = new THREE.MeshStandardMaterial({
                            color: 0xcccccc,
                            roughness: 0.7,
                            metalness: 0.3,
                        });
                    }
                }
            });

            setModelReady(true);
        }
    }, [fbx]);

    if (!modelReady) {
        return (
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={0x666666} />
            </mesh>
        );
    }

    return (
        <group ref={groupRef}>
            <primitive object={fbx} />
        </group>
    );
};

const Scene = () => {
    const { camera } = useThree();
    const controlsRef = useRef<any>(null);
    const [cameraAnimationComplete, setCameraAnimationComplete] = useState(false);
    const animationProgress = useRef(0);
    const orbitProgress = useRef(0);

    const orbitRadius = 3; // Начальный радиус вращения
    const orbitHeight = 55; // Высота камеры
    const orbitSpeed = 0.1; // Медленное вращение
    const targetHeight = 30; // Высота точки, на которую смотрим

    useFrame((_state, delta) => {
        if (!cameraAnimationComplete) {
            animationProgress.current += delta * 0.1;

            if (animationProgress.current >= 1) {
                animationProgress.current = 1;
                setCameraAnimationComplete(true);
            }

            const currentHeight = animationProgress.current * orbitHeight;

            const currentRadius = orbitRadius + (animationProgress.current * 4);

            const angle = animationProgress.current * Math.PI * 2;

            const x = Math.cos(angle) * currentRadius;
            const z = Math.sin(angle) * currentRadius;

            camera.position.set(x, currentHeight, z);

            camera.lookAt(0, targetHeight, 0);

            camera.updateProjectionMatrix();
        } else {
            orbitProgress.current += delta * orbitSpeed * 5;

            const finalRadius = orbitRadius + 4;
            const x = Math.cos(orbitProgress.current) * finalRadius;
            const z = Math.sin(orbitProgress.current) * finalRadius;

            camera.position.set(x+80, 60, z+30);

            camera.lookAt(0, targetHeight, 0);

            if (controlsRef.current) {
                controlsRef.current.update();
            }
        }
    });

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight
                position={[5, 10, 7]}
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />

            <TowerCrane3D />

            <OrbitControls
                ref={controlsRef}
                enabled={cameraAnimationComplete}
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                maxPolarAngle={Math.PI / 2}
                minDistance={7}
                maxDistance={65}
                target={[0, targetHeight, 0]}
            />
        </>
    );
};

export default Scene;