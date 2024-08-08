import { convertColor } from './convertColor.mjs';

describe('Color Conversion Functions', () => {
  describe('Key to RGB', () => {
    it('should convert Key to RGB (Red)', () => {
      expect(convertColor('key', 'rgb', 'red')).to.deep.equal([255, 0, 0]);
    });

    it('should convert Key to RGB (Lime)', () => {
      expect(convertColor('key', 'rgb', 'lime')).to.deep.equal([0, 255, 0]);
    });

    it('should convert Key to RGB (Blue)', () => {
      expect(convertColor('key', 'rgb', 'blue')).to.deep.equal([0, 0, 255]);
    });

    it('should convert Key to RGB (White)', () => {
      expect(convertColor('key', 'rgb', 'white')).to.deep.equal([255, 255, 255]);
    });

    it ('should convert Key to RGB (Black)', () => {
      expect(convertColor('key', 'rgb', 'black')).to.deep.equal([0, 0, 0]);
    });

    it('should convert Key to RGB (LightSlateGray)', () => {
      expect(convertColor('key', 'rgb', 'lightslategray')).to.deep.equal([119, 136, 153]);
    });

    it ('should convert Key to RGB (DarkSlateGray)', () => {
      expect(convertColor('key', 'rgb', 'darkslategray')).to.deep.equal([47, 79, 79]);
    });
  });

  describe('RGB to Key', () => {
    it('should find the closest color (Red)', () => {
      expect(convertColor('rgb', 'key', 255, 0, 1)).to.equal('Red');
    });

    it('should find the closest color (Lime)', () => {
      expect(convertColor('rgb', 'key', 0, 255, 1)).to.equal('Lime');
    });

    it('should find the closest color (Blue)', () => {
      expect(convertColor('rgb', 'key', 1, 0, 255)).to.equal('Blue');
    });

    it('should find the closest color (White)', () => {
      expect(convertColor('rgb', 'key', 255, 255, 254)).to.equal('White');
    });

    it ('should find the closest color (Black)', () => {
      expect(convertColor('rgb', 'key', 1, 1, 1)).to.equal('Black');
    });

    it('should find the closest color (LightSlateGray)', () => {
      expect(convertColor('rgb', 'key', 118, 135, 152)).to.equal('LightSlateGray');
    });

    it ('should find the closest color (DarkSlateGray)', () => {
      expect(convertColor('rgb', 'key', 48, 78, 78)).to.equal('DarkSlateGray');
    });
  });

  describe('HEX to RGB', () => {
    it('should convert HEX to RGB (Red)', () => {
      expect(convertColor('hex', 'rgb', 'ff0000')).to.deepCloseTo([255, 0, 0]);
    });

    it('should convert HEX to RGB (Lime)', () => {
      expect(convertColor('hex', 'rgb', '00ff00')).to.deepCloseTo([0, 255, 0]);
    });

    it('should convert HEX to RGB (Blue)', () => {
      expect(convertColor('hex', 'rgb', '0000ff')).to.deepCloseTo([0, 0, 255]);
    });

    it('should convert HEX to RGB (White)', () => {
      expect(convertColor('hex', 'rgb', 'ffffff')).to.deepCloseTo([255, 255, 255]);
    });

    it ('should convert HEX to RGB (Black)', () => {
      expect(convertColor('hex', 'rgb', '000000')).to.deepCloseTo([0, 0, 0]);
    });

    it('should convert HEX to RGB (Light)', () => {
      expect(convertColor('hex', 'rgb', 'fafafa')).to.deepCloseTo([250, 250, 250]);
    });

    it ('should convert HEX to RGB (Dark)', () => {
      expect(convertColor('hex', 'rgb', '050505')).to.deepCloseTo([5, 5, 5]);
    });
  });

  describe('RGB to HEX', () => {
    it('should convert RGB to HEX (Red)', () => {
      expect(convertColor('rgb', 'hex', 255, 0, 0)).to.equal('#ff0000');
    });

    it('should convert RGB to HEX (Lime)', () => {
      expect(convertColor('rgb', 'hex', 0, 255, 0)).to.equal('#00ff00');
    });

    it('should convert RGB to HEX (Blue)', () => {
      expect(convertColor('rgb', 'hex', 0, 0, 255)).to.equal('#0000ff');
    });

    it('should convert RGB to HEX (White)', () => {
      expect(convertColor('rgb', 'hex', 255, 255, 255)).to.equal('#ffffff');
    });

    it ('should convert RGB to HEX (Black)', () => {
      expect(convertColor('rgb', 'hex', 0, 0, 0)).to.equal('#000000');
    });

    it('should convert RGB to HEX (Light)', () => {
      expect(convertColor('rgb', 'hex', 250, 250, 250)).to.equal('#fafafa');
    });

    it ('should convert RGB to HEX (Dark)', () => {
      expect(convertColor('rgb', 'hex', 5, 5, 5)).to.equal('#050505');
    });
  });

  describe('RGB to HSL', () => {
    it('should convert RGB to HSL (Red)', () => {
      expect(convertColor('rgb', 'hsl', 255, 0, 0)).to.deepCloseTo([0, 100, 50]);
    });

    it('should convert RGB to HSL (Lime)', () => {
      expect(convertColor('rgb', 'hsl', 0, 255, 0)).to.deepCloseTo([120, 100, 50]);
    });

    it('should convert RGB to HSL (Blue)', () => {
      expect(convertColor('rgb', 'hsl', 0, 0, 255)).to.deepCloseTo([240, 100, 50]);
    });

    it('should convert RGB to HSL (White)', () => {
      expect(convertColor('rgb', 'hsl', 255, 255, 255)).to.deepCloseTo([0, 0, 100]);
    });

    it ('should convert RGB to HSL (Black)', () => {
      expect(convertColor('rgb', 'hsl', 0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });

    it('should convert RGB to HSL (Light)', () => {
      expect(convertColor('rgb', 'hsl', 250, 250, 250)).to.deepCloseTo([0, 0, 98]);
    });

    it ('should convert RGB to HSL (Dark)', () => {
      expect(convertColor('rgb', 'hsl', 5, 5, 5)).to.deepCloseTo([0, 0, 2]);
    });
  });

  describe('HSL to RGB', () => {
    it('should convert HSL to RGB (Red)', () => {
      expect(convertColor('hsl', 'rgb', 0, 100, 50)).to.deepCloseTo([255, 0, 0]);
    });

    it('should convert HSL to RGB (Lime)', () => {
      expect(convertColor('hsl', 'rgb', 120, 100, 50)).to.deepCloseTo([0, 255, 0]);
    });

    it('should convert HSL to RGB (Blue)', () => {
      expect(convertColor('hsl', 'rgb', 240, 100, 50)).to.deepCloseTo([0, 0, 255]);
    });

    it('should convert HSL to RGB (White)', () => {
      expect(convertColor('hsl', 'rgb', 0, 0, 100)).to.deepCloseTo([255, 255, 255]);
    });

    it ('should convert HSL to RGB (Black)', () => {
      expect(convertColor('hsl', 'rgb', 0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });

    it('should convert HSL to RGB (Light)', () => {
      expect(convertColor('hsl', 'rgb', 0, 0, 98)).to.deepCloseTo([250, 250, 250]);
    });

    it('should convert HSL to RGB (Dark)', () => {
      expect(convertColor('hsl', 'rgb', 0, 0, 2)).to.deepCloseTo([5, 5, 5]);
    });
  });

  describe('RGB to XYZ', () => {
    it('should convert RGB to XYZ (Red)', () => {
      expect(convertColor('rgb', 'xyz', 255, 0, 0)).to.deepCloseTo([41.246, 21.267, 1.933]);
    });

    it('should convert RGB to XYZ (Lime)', () => {
      expect(convertColor('rgb', 'xyz', 0, 255, 0)).to.deepCloseTo([35.756, 71.512, 11.918]);
    });

    it('should convert RGB to XYZ (Blue)', () => {
      expect(convertColor('rgb', 'xyz', 0, 0, 255)).to.deepCloseTo([18.043, 7.218, 95.030]);
    });

    it('should convert RGB to XYZ (White)', () => {
      expect(convertColor('rgb', 'xyz', 255, 255, 255)).to.deepCloseTo([95.047, 100, 108.883]);
    });

    it ('should convert RGB to XYZ (Black)', () => {
      expect(convertColor('rgb', 'xyz', 0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });

    it('should convert RGB to XYZ (Light)', () => {
      expect(convertColor('rgb', 'xyz', 250, 250, 250)).to.deepCloseTo([90.862, 95.597, 104.089]);
    });

    it ('should convert RGB to XYZ (Dark)', () => {
      expect(convertColor('rgb', 'xyz', 5, 5, 5)).to.deepCloseTo([0.144, 0.152, 0.165]);
    });
  });

  describe('XYZ to RGB', () => {
    it('should convert XYZ to RGB (Red)', () => {
      expect(convertColor('xyz', 'rgb', 41.246, 21.267, 1.933)).to.deepCloseTo([255, 0, 0]);
    });

    it('should convert XYZ to RGB (Lime)', () => {
      expect(convertColor('xyz', 'rgb', 35.756, 71.512, 11.918)).to.deepCloseTo([0, 255, 0]);
    });

    it('should convert XYZ to RGB (Blue)', () => {
      expect(convertColor('xyz', 'rgb', 18.043, 7.218, 95.030)).to.deepCloseTo([0, 0, 255]);
    });

    it('should convert XYZ to RGB (White)', () => {
      expect(convertColor('xyz', 'rgb', 95.047, 100, 108.883)).to.deepCloseTo([255, 255, 255]);
    });

    it('should convert XYZ to RGB (Black)', () => {
      expect(convertColor('xyz', 'rgb', 0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });

    it('should convert XYZ to RGB (Light)', () => {
      expect(convertColor('xyz', 'rgb', 90.862, 95.597, 104.089)).to.deepCloseTo([250, 250, 250]);
    });

    it('should convert XYZ to RGB (Dark)', () => {
      expect(convertColor('xyz', 'rgb', 0.144, 0.152, 0.165)).to.deepCloseTo([5, 5, 5]);
    });
  });

  describe('XYZ to LAB', () => {
    it('should convert XYZ to LAB (Red)', () => {
      expect(convertColor('xyz', 'lab', 41.246, 21.267, 1.933)).to.deepCloseTo([53.240, 80.092, 67.203]);
    });

    it('should convert XYZ to LAB (Lime)', () => {
      expect(convertColor('xyz', 'lab', 35.756, 71.512, 11.918)).to.deepCloseTo([87.737, -86.184, 83.181]);
    });

    it('should convert XYZ to LAB (Blue)', () => {
      expect(convertColor('xyz', 'lab', 18.043, 7.218, 95.030)).to.deepCloseTo([32.299, 79.196, -107.860]);
    });

    it('should convert XYZ to LAB (White)', () => {
      expect(convertColor('xyz', 'lab', 95.047, 100, 108.883)).to.deepCloseTo([100, 0, 0]);
    });

    it ('should convert XYZ to LAB (Black)', () => {
      expect(convertColor('xyz', 'lab', 0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });

    it('should convert XYZ to LAB (Light)', () => {
      expect(convertColor('xyz', 'lab', 95.047, 100, 108.883)).to.deepCloseTo([100, 0, 0]);
    });

    it('should convert XYZ to LAB (Dark)', () => {
      expect(convertColor('xyz', 'lab', 0.144, 0.152, 0.165)).to.deepCloseTo([1.371, 0.000, -0.000]);
    });
  });

  describe('LAB to XYZ', () => {
    it('should convert LAB to XYZ (Red)', () => {
      expect(convertColor('lab', 'xyz', 53.240, 80.092, 67.203)).to.deepCloseTo([41.246, 21.267, 1.933]);
    });

    it('should convert LAB to XYZ (Lime)', () => {
      expect(convertColor('lab', 'xyz', 87.737, -86.184, 83.181)).to.deepCloseTo([35.756, 71.512, 11.918]);
    });

    it('should convert LAB to XYZ (Blue)', () => {
      expect(convertColor('lab', 'xyz', 32.299, 79.196, -107.860)).to.deepCloseTo([18.043, 7.218, 95.030]);
    });

    it('should convert LAB to XYZ (White)', () => {
      expect(convertColor('lab', 'xyz', 100, 0, 0)).to.deepCloseTo([95.047, 100, 108.883]);
    });

    it ('should convert LAB to XYZ (Black)', () => {
      expect(convertColor('lab', 'xyz', 0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });

    it('should convert LAB to XYZ (Light)', () => {
      expect(convertColor('lab', 'xyz', 100, 0, 0)).to.deepCloseTo([95.047, 100, 108.883]);
    });

    it('should convert LAB to XYZ (Dark)', () => {
      expect(convertColor('lab', 'xyz', 1.371, 0.000, -0.000)).to.deepCloseTo([0.144, 0.152, 0.165]);
    });
  });

  xdescribe('XYZ to DisplayP3', () => {
    it('should convert XYZ to DisplayP3 (Red)', () => {
      expect(convertColor('xyz', 'displayP3', 41.246, 21.267, 1.933)).to.deepCloseTo([255, 0, 0]);
    });
  
    it('should convert XYZ to DisplayP3 (Lime)', () => {
      expect(convertColor('xyz', 'displayP3', 35.756, 71.512, 11.918)).to.deepCloseTo([91, 230, 24]);
    });
  
    it('should convert XYZ to DisplayP3 (Blue)', () => {
      expect(convertColor('xyz', 'displayP3', 18.043, 7.218, 95.030)).to.deepCloseTo([59, 59, 210]);
    });
  
    it('should convert XYZ to DisplayP3 (White)', () => {
      expect(convertColor('xyz', 'displayP3', 95.047, 100, 108.883)).to.deepCloseTo([255, 255, 255]);
    });
  
    it('should convert XYZ to DisplayP3 (Black)', () => {
      expect(convertColor('xyz', 'displayP3', 0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });
  
    it('should convert XYZ to DisplayP3 (Light)', () => {
      expect(convertColor('xyz', 'displayP3', 90.862, 95.597, 104.089)).to.deepCloseTo([239, 239, 239]);
    });
  
    it('should convert XYZ to DisplayP3 (Dark)', () => {
      expect(convertColor('xyz', 'displayP3', 0.144, 0.152, 0.165)).to.deepCloseTo([5, 5, 5]);
    });
  });

  describe('RGB to LAB', () => {
    it('should convert RGB to LAB (Red)', () => {
      expect(convertColor('rgb', 'lab', 255, 0, 0)).to.deepCloseTo([53.240, 80.092, 67.203]);
    });

    it('should convert RGB to LAB (Lime)', () => {
      expect(convertColor('rgb', 'lab', 0, 255, 0)).to.deepCloseTo([87.737, -86.184, 83.181]);
    });

    it('should convert RGB to LAB (Blue)', () => {
      expect(convertColor('rgb', 'lab', 0, 0, 255)).to.deepCloseTo([32.299, 79.196, -107.860]);
    });

    it('should convert RGB to LAB (White)', () => {
      expect(convertColor('rgb', 'lab', 255, 255, 255)).to.deepCloseTo([100, 0, 0]);
    });

    it ('should convert RGB to LAB (Black)', () => {
      expect(convertColor('rgb', 'lab', 0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });

    it('should convert RGB to LAB (Light)', () => {
      expect(convertColor('rgb', 'lab', 250, 250, 250)).to.deepCloseTo([98.272, 0.000, -0.000]);
    });

    it('should convert RGB to LAB (Dark)', () => {
      expect(convertColor('rgb', 'lab', 5, 5, 5)).to.deepCloseTo([1.371, 0.000, -0.000]);
    });
  });

  describe('LAB to RGB', () => {
    it('should convert LAB to RGB (Red)', () => {
      expect(convertColor('lab', 'rgb', 53.240, 80.092, 67.203)).to.deepCloseTo([255, 0, 0]);
    });

    it('should convert LAB to RGB (Lime)', () => {
      expect(convertColor('lab', 'rgb', 87.737, -86.184, 83.181)).to.deepCloseTo([0, 255, 0]);
    });

    it('should convert LAB to RGB (Blue)', () => {
      expect(convertColor('lab', 'rgb', 32.299, 79.196, -107.860)).to.deepCloseTo([0, 0, 255]);
    });

    it('should convert LAB to RGB (White)', () => {
      expect(convertColor('lab', 'rgb', 100, 0, 0)).to.deepCloseTo([255, 255, 255]);
    });

    it ('should convert LAB to RGB (Black)', () => {
      expect(convertColor('lab', 'rgb', 0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });

    it('should convert LAB to RGB (Light)', () => {
      expect(convertColor('lab', 'rgb', 98.272, 0.000, -0.000)).to.deepCloseTo([250, 250, 250]);
    });

    it('should convert LAB to RGB (Dark)', () => {
      expect(convertColor('lab', 'rgb', 1.371, 0.000, -0.000)).to.deepCloseTo([5, 5, 5]);
    });
  });

  xdescribe('XYZ to LMS', () => {
    it('should convert XYZ to LMS (Red)', () => {
      expect(convertColor('xyz', 'lms', 41.246, 21.267, 1.933)).to.deepCloseTo([0.4002, -0.2263, 0.0000]);
    });
    
    it('should convert XYZ to LMS (Lime)', () => {
      expect(convertColor('xyz', 'lms', 35.756, 71.512, 11.918)).to.deepCloseTo([0.7075, 1.1653, 0.0000]);
    });
    
    it('should convert XYZ to LMS (Blue)', () => {
      expect(convertColor('xyz', 'lms', 18.043, 7.218, 95.030)).to.deepCloseTo([-0.0808, 0.0457, 0.9182]);
    });
    
    it('should convert RGB to LMS (White)', () => {
      expect(convertColor('xyz', 'lms', 95.047, 100, 108.883)).to.deepCloseTo([1.027, 0.985, 0.918]);
    });
    
    it('should convert RGB to LMS (Black)', () => 
      expect(convertColor('xyz', 'lms', 0, 0, 0)).to.deepCloseTo([0, 0, 0])
    );
    
    it('should convert RGB to LMS (Light Gray)', () => {
      expect(convertColor('xyz', 'lms', 90.862, 95.597, 104.089)).to.deepCloseTo([0.983, 0.941, 0.878]);
    });
    
    it('should convert RGB to LMS (Dark Gray)', () => {
      expect(convertColor('xyz', 'lms', 0.144, 0.152, 0.165)).to.deepCloseTo([0.001, 0.001, 0.0014]);
    });
  });

  xdescribe('LMS to XYZ', () => {
    it('should convert LMS to XYZ (Red)', () => {
      expect(convertColor('lms', 'xyz', 0.4002, -0.2263, 0.0000)).to.deepCloseTo([41.246, 21.267, 1.933]);
    });
    
    it('should convert LMS to XYZ (Lime)', () => {
      expect(convertColor('lms', 'xyz', 0.7075, 1.1653, 0.0000)).to.deepCloseTo([35.756, 71.512, 11.918]);
    });
    
    it('should convert LMS to XYZ (Blue)', () => {
      expect(convertColor('lms', 'xyz', -0.0808, 0.0457, 0.9182)).to.deepCloseTo([18.043, 7.218, 95.030]);
    });
    
    it('should convert LMS to XYZ (White)', () => {
      expect(convertColor('lms', 'xyz', 1.027, 0.985, 0.918)).to.deepCloseTo([95.047, 100, 108.883]);
    });
    
    it('should convert LMS to XYZ (Black)', () => 
      expect(convertColor('lms', 'xyz', 0, 0, 0)).to.deepCloseTo([0, 0, 0])
    );
    
    it('should convert LMS to XYZ (Light Gray)', () => {
      expect(convertColor('lms', 'xyz', 0.983, 0.941, 0.878)).to.deepCloseTo([90.862, 95.597, 104.089]);
    });
    
    it('should convert LMS to XYZ (Dark Gray)', () => {
      expect(convertColor('lms', 'xyz', 0.001, 0.001, 0.0014)).to.deepCloseTo([0.144, 0.152, 0.165]);
    });
  });

  describe('Key to HEX (Indirect conversion)', () => {
    it('should convert Key to HEX (Red)', () => {
      expect(convertColor('key', 'hex', 'red')).to.equal('#ff0000');
    });

    it('should convert Key to HEX (Lime)', () => {
      expect(convertColor('key', 'hex', 'lime')).to.equal('#00ff00');
    });

    it('should convert Key to HEX (Blue)', () => {
      expect(convertColor('key', 'hex', 'blue')).to.equal('#0000ff');
    });

    it('should convert Key to HEX (White)', () => {
      expect(convertColor('key', 'hex', 'white')).to.equal('#ffffff');
    });

    it ('should convert Key to HEX (Black)', () => {
      expect(convertColor('key', 'hex', 'black')).to.equal('#000000');
    });

    it('should convert Key to HEX (LightSlateGray)', () => {
      expect(convertColor('key', 'hex', 'lightslategray')).to.equal('#778899');
    });

    it ('should convert Key to HEX (DarkSlateGray)', () => {
      expect(convertColor('key', 'hex', 'darkslategray')).to.equal('#2f4f4f');
    });
  });
});
