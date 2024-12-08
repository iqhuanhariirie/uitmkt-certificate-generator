"use client";

import { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';

interface CertificatePreviewProps {
  templateUrl: string;
  sampleName: string;
  onPositionChange: (position: { top: number; left: number; fontSize: number }) => void;
}

const CertificatePreview = ({ templateUrl, sampleName, onPositionChange }: CertificatePreviewProps) => {
  const [position, setPosition] = useState({ top: 50, left: 50, fontSize: 24 });

  const handleChange = (key: keyof typeof position, value: number[]) => {
    const newPosition = { ...position, [key]: value[0] };
    setPosition(newPosition);
    onPositionChange(newPosition);
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full h-[400px] border rounded-lg overflow-hidden">
        {templateUrl && (
          <>
            <img 
              src={templateUrl} 
              alt="Certificate Template" 
              className="absolute w-full h-full object-contain"
            />
            <div
              style={{
                position: 'absolute',
                top: `${position.top}%`,
                left: `${position.left}%`,
                transform: 'translate(-50%, -50%)',
                fontSize: `${position.fontSize}px`,
              }}
              className="font-bold text-black"
            >
              {sampleName}
            </div>
          </>
        )}
      </div>

      <div className="grid gap-6 p-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Vertical Position ({position.top}%)</label>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[position.top]}
            onValueChange={(value) => handleChange('top', value)}
            min={0}
            max={100}
            step={1}
          >
            <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
              <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-5 h-5 bg-white shadow-lg rounded-full border-2 border-blue-500 focus:outline-none"
              aria-label="Vertical position"
            />
          </Slider.Root>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Horizontal Position ({position.left}%)</label>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[position.left]}
            onValueChange={(value) => handleChange('left', value)}
            min={0}
            max={100}
            step={1}
          >
            <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
              <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-5 h-5 bg-white shadow-lg rounded-full border-2 border-blue-500 focus:outline-none"
              aria-label="Horizontal position"
            />
          </Slider.Root>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Font Size ({position.fontSize}px)</label>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[position.fontSize]}
            onValueChange={(value) => handleChange('fontSize', value)}
            min={8}
            max={72}
            step={1}
          >
            <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
              <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-5 h-5 bg-white shadow-lg rounded-full border-2 border-blue-500 focus:outline-none"
              aria-label="Font size"
            />
          </Slider.Root>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview;
