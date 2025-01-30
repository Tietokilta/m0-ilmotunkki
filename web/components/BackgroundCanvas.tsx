"use client"

import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';
import {Suspense} from "react";

const BackGroundCanvas = () => {
  return (
    <Suspense>

      <div
        onWheelCapture={event => event.stopPropagation()}>
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
            urlString='https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=0.8&cAzimuthAngle=260&cDistance=0.5&cPolarAngle=180&cameraZoom=16&color1=%235A1E0D&color2=%239e3378&color3=%23c76e1a&destination=onCanvas&embedMode=off&envPreset=lobby&format=gif&fov=50&frameRate=10&gizmoHelper=hide&grain=on&lightType=env&pixelDensity=1.5&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=10&reflection=0.5&rotationX=10&rotationY=110&rotationZ=70&shader=defaults&type=sphere&uAmplitude=6.9&uDensity=0.9&uFrequency=5.5&uSpeed=0.2&uStrength=0.2&uTime=9&wireframe=false&zoomOut=false'/>
        </ShaderGradientCanvas>
      </div>
    </Suspense>
  );
};

export default BackGroundCanvas;
