"use client"

import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';
import {Suspense} from "react";

const BackGroundCanvas = () => {
  return (
    <Suspense>
      <ShaderGradientCanvas
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          pointerEvents: 'none',
        }}
      >
        <ShaderGradient
          control='query'
          urlString='https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=80&cameraZoom=9.1&color1=%23000000&color2=%23801832&color3=%2380631f&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=off&lightType=env&pixelDensity=3&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0&rotationX=50&rotationY=0&rotationZ=-60&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.7&uFrequency=0&uSpeed=0.5&uStrength=0.8&uTime=8&wireframe=false'/>
      </ShaderGradientCanvas>
    </Suspense>
  );
};

export default BackGroundCanvas;
