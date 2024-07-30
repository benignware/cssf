import { convertColorSpace } from './convertColorSpace.mjs';

describe('Color Conversion Functions', () => {
  describe('RGB to HSL', () => {
    it('should convert RGB to HSL (Red)', () => {
      expect(convertColorSpace('rgb', 'hsl', 255, 0, 0)).to.deepCloseTo([0, 100, 50]);
    });

    it('should convert RGB to HSL (Green)', () => {
      expect(convertColorSpace('rgb', 'hsl', 0, 255, 0)).to.deepCloseTo([120, 100, 50]);
    });

    it('should convert RGB to HSL (Blue)', () => {
      expect(convertColorSpace('rgb', 'hsl', 0, 0, 255)).to.deepCloseTo([240, 100, 50]);
    });

    it('should convert RGB to HSL (White)', () => {
      expect(convertColorSpace('rgb', 'hsl', 255, 255, 255)).to.deepCloseTo([0, 0, 100]);
    });

    it ('should convert RGB to HSL (Black)', () => {
      expect(convertColorSpace('rgb', 'hsl', 0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });

    it('should convert RGB to HSL (Light)', () => {
      expect(convertColorSpace('rgb', 'hsl', 250, 250, 250)).to.deepCloseTo([0, 0, 98]);
    });

    it ('should convert RGB to HSL (Dark)', () => {
      expect(convertColorSpace('rgb', 'hsl', 5, 5, 5)).to.deepCloseTo([0, 0, 2]);
    });
  });

  describe('HSL to RGB', () => {
    it('should convert HSL to RGB (Red)', () => {
      expect(convertColorSpace('hsl', 'rgb', 0, 100, 50)).to.deepCloseTo([255, 0, 0]);
    });

    it('should convert HSL to RGB (Green)', () => {
      expect(convertColorSpace('hsl', 'rgb', 120, 100, 50)).to.deepCloseTo([0, 255, 0]);
    });

    it('should convert HSL to RGB (Blue)', () => {
      expect(convertColorSpace('hsl', 'rgb', 240, 100, 50)).to.deepCloseTo([0, 0, 255]);
    });

    it('should convert HSL to RGB (White)', () => {
      expect(convertColorSpace('hsl', 'rgb', 0, 0, 100)).to.deepCloseTo([255, 255, 255]);
    });

    it ('should convert HSL to RGB (Black)', () => {
      expect(convertColorSpace('hsl', 'rgb', 0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });

    it('should convert HSL to RGB (Light)', () => {
      expect(convertColorSpace('hsl', 'rgb', 0, 0, 98)).to.deepCloseTo([250, 250, 250]);
    });

    it('should convert HSL to RGB (Dark)', () => {
      expect(convertColorSpace('hsl', 'rgb', 0, 0, 2)).to.deepCloseTo([5, 5, 5]);
    });
  });

  describe('RGB to XYZ', () => {
    it('should convert RGB to XYZ (Red)', () => {
      expect(convertColorSpace('rgb', 'xyz', 255, 0, 0)).to.deepCloseTo([41.246, 21.267, 1.933]);
    });

    it('should convert RGB to XYZ (Green)', () => {
      expect(convertColorSpace('rgb', 'xyz', 0, 255, 0)).to.deepCloseTo([35.756, 71.512, 11.918]);
    });

    it('should convert RGB to XYZ (Blue)', () => {
      expect(convertColorSpace('rgb', 'xyz', 0, 0, 255)).to.deepCloseTo([18.043, 7.218, 95.030]);
    });

    it('should convert RGB to XYZ (White)', () => {
      expect(convertColorSpace('rgb', 'xyz', 255, 255, 255)).to.deepCloseTo([95.047, 100, 108.883]);
    });

    it ('should convert RGB to XYZ (Black)', () => {
      expect(convertColorSpace('rgb', 'xyz', 0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });

    it('should convert RGB to XYZ (Light)', () => {
      expect(convertColorSpace('rgb', 'xyz', 250, 250, 250)).to.deepCloseTo([90.862, 95.597, 104.089]);
    });

    it ('should convert RGB to XYZ (Dark)', () => {
      expect(convertColorSpace('rgb', 'xyz', 5, 5, 5)).to.deepCloseTo([0.144, 0.152, 0.165]);
    });
  });

  describe('XYZ to RGB', () => {
    it('should convert XYZ to RGB (Red)', () => {
      expect(convertColorSpace('xyz', 'rgb', 41.246, 21.267, 1.933)).to.deepCloseTo([255, 0, 0]);
    });

    it('should convert XYZ to RGB (Green)', () => {
      expect(convertColorSpace('xyz', 'rgb', 35.756, 71.512, 11.918)).to.deepCloseTo([0, 255, 0]);
    });

    it('should convert XYZ to RGB (Blue)', () => {
      expect(convertColorSpace('xyz', 'rgb', 18.043, 7.218, 95.030)).to.deepCloseTo([0, 0, 255]);
    });

    it('should convert XYZ to RGB (White)', () => {
      expect(convertColorSpace('xyz', 'rgb', 95.047, 100, 108.883)).to.deepCloseTo([255, 255, 255]);
    });

    it('should convert XYZ to RGB (Black)', () => {
      expect(convertColorSpace('xyz', 'rgb', 0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });

    it('should convert XYZ to RGB (Light)', () => {
      expect(convertColorSpace('xyz', 'rgb', 90.862, 95.597, 104.089)).to.deepCloseTo([250, 250, 250]);
    });

    it('should convert XYZ to RGB (Dark)', () => {
      expect(convertColorSpace('xyz', 'rgb', 0.144, 0.152, 0.165)).to.deepCloseTo([5, 5, 5]);
    });
  });

  describe('XYZ to LAB', () => {
    it('should convert XYZ to LAB (Red)', () => {
      expect(convertColorSpace('xyz', 'lab', 41.246, 21.267, 1.933)).to.deepCloseTo([53.240, 80.092, 67.203]);
    });

    it('should convert XYZ to LAB (Green)', () => {
      expect(convertColorSpace('xyz', 'lab', 35.756, 71.512, 11.918)).to.deepCloseTo([87.737, -86.184, 83.181]);
    });

    it('should convert XYZ to LAB (Blue)', () => {
      expect(convertColorSpace('xyz', 'lab', 18.043, 7.218, 95.030)).to.deepCloseTo([32.299, 79.196, -107.860]);
    });

    it('should convert XYZ to LAB (White)', () => {
      expect(convertColorSpace('xyz', 'lab', 95.047, 100, 108.883)).to.deepCloseTo([100, 0, 0]);
    });

    it ('should convert XYZ to LAB (Black)', () => {
      expect(convertColorSpace('xyz', 'lab', 0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });

    it('should convert XYZ to LAB (Light)', () => {
      expect(convertColorSpace('xyz', 'lab', 95.047, 100, 108.883)).to.deepCloseTo([100, 0, 0]);
    });

    it('should convert XYZ to LAB (Dark)', () => {
      expect(convertColorSpace('xyz', 'lab', 0.144, 0.152, 0.165)).to.deepCloseTo([1.371, 0.000, -0.000]);
    });
  });

  describe('LAB to XYZ', () => {
    it('should convert LAB to XYZ (Red)', () => {
      expect(convertColorSpace('lab', 'xyz', 53.240, 80.092, 67.203)).to.deepCloseTo([41.246, 21.267, 1.933]);
    });

    it('should convert LAB to XYZ (Green)', () => {
      expect(convertColorSpace('lab', 'xyz', 87.737, -86.184, 83.181)).to.deepCloseTo([35.756, 71.512, 11.918]);
    });

    it('should convert LAB to XYZ (Blue)', () => {
      expect(convertColorSpace('lab', 'xyz', 32.299, 79.196, -107.860)).to.deepCloseTo([18.043, 7.218, 95.030]);
    });

    it('should convert LAB to XYZ (White)', () => {
      expect(convertColorSpace('lab', 'xyz', 100, 0, 0)).to.deepCloseTo([95.047, 100, 108.883]);
    });

    it ('should convert LAB to XYZ (Black)', () => {
      expect(convertColorSpace('lab', 'xyz', 0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });

    it('should convert LAB to XYZ (Light)', () => {
      expect(convertColorSpace('lab', 'xyz', 100, 0, 0)).to.deepCloseTo([95.047, 100, 108.883]);
    });

    it('should convert LAB to XYZ (Dark)', () => {
      expect(convertColorSpace('lab', 'xyz', 1.371, 0.000, -0.000)).to.deepCloseTo([0.144, 0.152, 0.165]);
    });
  });

  describe('RGB to LAB', () => {
    it('should convert RGB to LAB (Red)', () => {
      expect(convertColorSpace('rgb', 'lab', 255, 0, 0)).to.deepCloseTo([53.240, 80.092, 67.203]);
    });

    it('should convert RGB to LAB (Green)', () => {
      expect(convertColorSpace('rgb', 'lab', 0, 255, 0)).to.deepCloseTo([87.737, -86.184, 83.181]);
    });

    it('should convert RGB to LAB (Blue)', () => {
      expect(convertColorSpace('rgb', 'lab', 0, 0, 255)).to.deepCloseTo([32.299, 79.196, -107.860]);
    });

    it('should convert RGB to LAB (White)', () => {
      expect(convertColorSpace('rgb', 'lab', 255, 255, 255)).to.deepCloseTo([100, 0, 0]);
    });

    it ('should convert RGB to LAB (Black)', () => {
      expect(convertColorSpace('rgb', 'lab', 0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });

    it('should convert RGB to LAB (Light)', () => {
      expect(convertColorSpace('rgb', 'lab', 250, 250, 250)).to.deepCloseTo([98.272, 0.000, -0.000]);
    });

    it('should convert RGB to LAB (Dark)', () => {
      expect(convertColorSpace('rgb', 'lab', 5, 5, 5)).to.deepCloseTo([1.371, 0.000, -0.000]);
    });
  });

  describe('LAB to RGB', () => {
    it('should convert LAB to RGB (Red)', () => {
      expect(convertColorSpace('lab', 'rgb', 53.240, 80.092, 67.203)).to.deepCloseTo([255, 0, 0]);
    });

    it('should convert LAB to RGB (Green)', () => {
      expect(convertColorSpace('lab', 'rgb', 87.737, -86.184, 83.181)).to.deepCloseTo([0, 255, 0]);
    });

    it('should convert LAB to RGB (Blue)', () => {
      expect(convertColorSpace('lab', 'rgb', 32.299, 79.196, -107.860)).to.deepCloseTo([0, 0, 255]);
    });

    it('should convert LAB to RGB (White)', () => {
      expect(convertColorSpace('lab', 'rgb', 100, 0, 0)).to.deepCloseTo([255, 255, 255]);
    });

    it ('should convert LAB to RGB (Black)', () => {
      expect(convertColorSpace('lab', 'rgb', 0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });

    it('should convert LAB to RGB (Light)', () => {
      expect(convertColorSpace('lab', 'rgb', 98.272, 0.000, -0.000)).to.deepCloseTo([250, 250, 250]);
    });

    it('should convert LAB to RGB (Dark)', () => {
      expect(convertColorSpace('lab', 'rgb', 1.371, 0.000, -0.000)).to.deepCloseTo([5, 5, 5]);
    });
  });

  describe('XYZ to LMS', () => {
    it('should convert XYZ to LMS (Red)', () => {
      expect(convertColorSpace('xyz', 'lms', 41.246, 21.267, 1.933)).to.deepCloseTo([0.4002, -0.2263, 0.0000]);
    });
    
    it('should convert XYZ to LMS (Green)', () => {
      expect(convertColorSpace('xyz', 'lms', 35.756, 71.512, 11.918)).to.deepCloseTo([0.7075, 1.1653, 0.0000]);
    });
    
    it('should convert XYZ to LMS (Blue)', () => {
      expect(convertColorSpace('xyz', 'lms', 18.043, 7.218, 95.030)).to.deepCloseTo([-0.0808, 0.0457, 0.9182]);
    });
    
    it('should convert RGB to LMS (White)', () => {
      expect(convertColorSpace('xyz', 'lms', 95.047, 100, 108.883)).to.deepCloseTo([1.027, 0.985, 0.918]);
    });
    
    it('should convert RGB to LMS (Black)', () => 
      expect(convertColorSpace('xyz', 'lms', 0, 0, 0)).to.deepCloseTo([0, 0, 0])
    );
    
    it('should convert RGB to LMS (Light Gray)', () => {
      expect(convertColorSpace('xyz', 'lms', 90.862, 95.597, 104.089)).to.deepCloseTo([0.983, 0.941, 0.878]);
    });
    
    it('should convert RGB to LMS (Dark Gray)', () => {
      expect(convertColorSpace('xyz', 'lms', 0.144, 0.152, 0.165)).to.deepCloseTo([0.001, 0.001, 0.0014]);
    });
  });

  describe('LMS to XYZ', () => {
    it('should convert LMS to XYZ (Red)', () => {
      expect(convertColorSpace('lms', 'xyz', 0.4002, -0.2263, 0.0000)).to.deepCloseTo([41.246, 21.267, 1.933]);
    });
    
    it('should convert LMS to XYZ (Green)', () => {
      expect(convertColorSpace('lms', 'xyz', 0.7075, 1.1653, 0.0000)).to.deepCloseTo([35.756, 71.512, 11.918]);
    });
    
    it('should convert LMS to XYZ (Blue)', () => {
      expect(convertColorSpace('lms', 'xyz', -0.0808, 0.0457, 0.9182)).to.deepCloseTo([18.043, 7.218, 95.030]);
    });
    
    it('should convert LMS to XYZ (White)', () => {
      expect(convertColorSpace('lms', 'xyz', 1.027, 0.985, 0.918)).to.deepCloseTo([95.047, 100, 108.883]);
    });
    
    it('should convert LMS to XYZ (Black)', () => 
      expect(convertColorSpace('lms', 'xyz', 0, 0, 0)).to.deepCloseTo([0, 0, 0])
    );
    
    it('should convert LMS to XYZ (Light Gray)', () => {
      expect(convertColorSpace('lms', 'xyz', 0.983, 0.941, 0.878)).to.deepCloseTo([90.862, 95.597, 104.089]);
    });
    
    it('should convert LMS to XYZ (Dark Gray)', () => {
      expect(convertColorSpace('lms', 'xyz', 0.001, 0.001, 0.0014)).to.deepCloseTo([0.144, 0.152, 0.165]);
    });
  });
  
  
});
