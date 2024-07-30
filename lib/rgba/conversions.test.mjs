import { assert, expect } from 'chai';
import {
    rgbToHsl,
    hslToRgb,
    rgbToHsv,
    hsvToRgb,
    rgbToXyz,
    xyzToRgb,
    rgbToLab,
    labToRgb,
    xyzToLab,
    labToLch,
    lchToLab,
    rgbToLch,
    lchToRgb
} from './conversions.mjs';
import { approximateEqual } from './helpers.mjs';

describe('Color Conversion Functions', () => {
    describe('RGB to HSL', () => {
        it('should correctly convert pure red RGB to HSL', () => {
            expect(rgbToHsl(255, 0, 0)).to.deep.equal([0, 100, 50]); // Red
        });

        it('should correctly convert pure green RGB to HSL', () => {
            expect(rgbToHsl(0, 255, 0)).to.deep.equal([120, 100, 50]); // Green
        });

        it('should correctly convert pure blue RGB to HSL', () => {
            expect(rgbToHsl(0, 0, 255)).to.deep.equal([240, 100, 50]); // Blue
        });

        it('should correctly convert white RGB to HSL', () => {
            expect(rgbToHsl(255, 255, 255)).to.deep.equal([0, 0, 100]); // White
        });

        it('should correctly convert black RGB to HSL', () => {
            expect(rgbToHsl(0, 0, 0)).to.deep.equal([0, 0, 0]); // Black
        });

        it('should correctly convert olive RGB to HSL', () => {
            approximateEqual(rgbToHsl(128, 128, 0), [60, 100, 25]); // Olive
        });

        it('should correctly convert purple RGB to HSL', () => {
            approximateEqual(rgbToHsl(128, 0, 128), [300, 100, 25]); // Purple
        });

        it('should correctly convert teal RGB to HSL', () => {
            approximateEqual(rgbToHsl(0, 128, 128), [180, 100, 25]); // Teal
        });
    });

    describe('HSL to RGB', () => {
        it('should correctly convert pure red HSL to RGB', () => {
            expect(hslToRgb(0, 100, 50)).to.deep.equal([255, 0, 0]); // Red
        });

        it('should correctly convert pure green HSL to RGB', () => {
            expect(hslToRgb(120, 100, 50)).to.deep.equal([0, 255, 0]); // Green
        });

        it('should correctly convert pure blue HSL to RGB', () => {
            expect(hslToRgb(240, 100, 50)).to.deep.equal([0, 0, 255]); // Blue
        });

        it('should correctly convert white HSL to RGB', () => {
            expect(hslToRgb(0, 0, 100)).to.deep.equal([255, 255, 255]); // White
        });

        it('should correctly convert black HSL to RGB', () => {
            expect(hslToRgb(0, 0, 0)).to.deep.equal([0, 0, 0]); // Black
        });

        it('should correctly convert cyan HSL to RGB', () => {
            expect(hslToRgb(180, 100, 50)).to.deep.equal([0, 255, 255]); // Cyan
        });

        it('should correctly convert violet HSL to RGB', () => {
            expect(hslToRgb(270, 100, 50)).to.deep.equal([128, 0, 255]); // Violet
        });
    });

    describe('RGB to HSV', () => {
        it('should correctly convert pure red RGB to HSV', () => {
            expect(rgbToHsv(255, 0, 0)).to.deep.equal([0, 100, 100]); // Red
        });

        it('should correctly convert pure green RGB to HSV', () => {
            expect(rgbToHsv(0, 255, 0)).to.deep.equal([120, 100, 100]); // Green
        });

        it('should correctly convert pure blue RGB to HSV', () => {
            expect(rgbToHsv(0, 0, 255)).to.deep.equal([240, 100, 100]); // Blue
        });

        it('should correctly convert white RGB to HSV', () => {
            expect(rgbToHsv(255, 255, 255)).to.deep.equal([0, 0, 100]); // White
        });

        it('should correctly convert black RGB to HSV', () => {
            expect(rgbToHsv(0, 0, 0)).to.deep.equal([0, 0, 0]); // Black
        });

        it('should correctly convert hot pink RGB to HSV', () => {
            approximateEqual(rgbToHsv(255, 105, 180), [330, 59, 100]); // Hot Pink
        });

        xit('should correctly convert indigo RGB to HSV', () => {
            approximateEqual(rgbToHsv(75, 0, 130), [248, 100, 51]); // Indigo
        });
    });

   

    describe('HSV to RGB Conversion', () => {
        it('should correctly convert pure red HSV to RGB', () => {
            assert.deepEqual(hsvToRgb(0, 100, 100), [255, 0, 0]);
        });
    
        it('should correctly convert pure green HSV to RGB', () => {
            assert.deepEqual(hsvToRgb(120, 100, 100), [0, 255, 0]);
        });
    
        it('should correctly convert pure blue HSV to RGB', () => {
            assert.deepEqual(hsvToRgb(240, 100, 100), [0, 0, 255]);
        });
    
        it('should correctly convert white HSV to RGB', () => {
            assert.deepEqual(hsvToRgb(0, 0, 100), [255, 255, 255]);
        });
    
        it('should correctly convert black HSV to RGB', () => {
            assert.deepEqual(hsvToRgb(0, 0, 0), [0, 0, 0]);
        });
    
        it('should correctly convert hot pink HSV to RGB', () => {
            assert.deepEqual(hsvToRgb(330, 59, 100), [255, 105, 180]);
        });
        
        xit('should correctly convert indigo HSV to RGB', () => {
            assert.deepEqual(hsvToRgb(248, 100, 51), [75, 0, 130]);
        });
    });

    describe('RGB to XYZ', () => {
        it('should correctly convert pure red RGB to XYZ', () => {
            approximateEqual(rgbToXyz(255, 0, 0), [41.24, 21.26, 1.93]); // Red
        });

        it('should correctly convert pure green RGB to XYZ', () => {
            approximateEqual(rgbToXyz(0, 255, 0), [35.76, 71.52, 11.92]); // Green
        });

        it('should correctly convert pure blue RGB to XYZ', () => {
            approximateEqual(rgbToXyz(0, 0, 255), [18.05, 7.22, 95.05], 0.1); // Blue
        });

        it('should correctly convert white RGB to XYZ', () => {
            approximateEqual(rgbToXyz(255, 255, 255), [95.05, 100.00, 108.90], 0.1); // White
        });

        it('should correctly convert black RGB to XYZ', () => {
            approximateEqual(rgbToXyz(0, 0, 0), [0, 0, 0]); // Black
        });

        xit('should correctly convert light grey RGB to XYZ', () => {
            approximateEqual(rgbToXyz(211, 211, 211), [70.09, 70.09, 70.09], 0.5); // Light Grey
        });
        
        xit('should correctly convert light blue RGB to XYZ', () => {
            approximateEqual(rgbToXyz(173, 216, 230), [32.31, 34.54, 54.68], 0.5); // Light Blue
        });        
    });

    describe('XYZ to RGB', () => {
        it('should correctly convert pure red XYZ to RGB', () => {
            approximateEqual(xyzToRgb(41.24, 21.26, 1.93), [255, 0, 0], 0.5); // Red
        });

        it('should correctly convert pure green XYZ to RGB', () => {
            approximateEqual(xyzToRgb(35.76, 71.52, 11.92), [0, 255, 0], 0.5); // Green
        });

        it('should correctly convert pure blue XYZ to RGB', () => {
            approximateEqual(xyzToRgb(18.05, 7.22, 95.05), [0, 0, 255], 0.5); // Blue
        });

        it('should correctly convert white XYZ to RGB', () => {
            approximateEqual(xyzToRgb(95.05, 100.00, 108.90), [255, 255, 255], 0.5); // White
        });

        it('should correctly convert black XYZ to RGB', () => {
            approximateEqual(xyzToRgb(0, 0, 0), [0, 0, 0]); // Black
        });

        xit('should correctly convert light grey XYZ to RGB', () => {
            approximateEqual(xyzToRgb(70.09, 70.09, 70.09), [211, 211, 211], 0.5); // Light Grey
        });
        
        xit('should correctly convert light blue XYZ to RGB', () => {
            approximateEqual(xyzToRgb(32.31, 34.54, 54.68), [173, 216, 230], 0.5); // Light Blue
        });        
    });

    describe('RGB to Lab', () => {
        it('should correctly convert pure red RGB to Lab', () => {
            approximateEqual(rgbToLab(255, 0, 0), [53.24, 80.09, 67.20]); // Red
        });

        it('should correctly convert pure green RGB to Lab', () => {
            approximateEqual(rgbToLab(0, 255, 0), [87.74, -86.18, 83.18]); // Green
        });

        it('should correctly convert pure blue RGB to Lab', () => {
            approximateEqual(rgbToLab(0, 0, 255), [32.30, 79.19, -107.86]); // Blue
        });

        it('should correctly convert white RGB to Lab', () => {
            approximateEqual(rgbToLab(255, 255, 255), [100, 0, 0]); // White
        });

        it('should correctly convert black RGB to Lab', () => {
            approximateEqual(rgbToLab(0, 0, 0), [0, 0, 0]); // Black
        });
    });

    describe('Lab to RGB', () => {
        it('should correctly convert pure red Lab to RGB', () => {
            approximateEqual(labToRgb(53.24, 80.09, 67.20), [255, 0, 0]); // Red
        });

        it('should correctly convert pure green Lab to RGB', () => {
            approximateEqual(labToRgb(87.74, -86.18, 83.18), [0, 255, 0]); // Green
        });

        it('should correctly convert pure blue Lab to RGB', () => {
            approximateEqual(labToRgb(32.30, 79.19, -107.86), [0, 0, 255]); // Blue
        });

        it('should correctly convert white Lab to RGB', () => {
            approximateEqual(labToRgb(100, 0, 0), [255, 255, 255]); // White
        });

        it('should correctly convert black Lab to RGB', () => {
            approximateEqual(labToRgb(0, 0, 0), [0, 0, 0]); // Black
        });
    });

    describe('XYZ to Lab', () => {
        it('should correctly convert pure red XYZ to Lab', () => {
            approximateEqual(xyzToLab(41.24, 21.26, 1.93), [53.24, 80.09, 67.20]); // Red
        });

        it('should correctly convert pure green XYZ to Lab', () => {
            approximateEqual(xyzToLab(35.76, 71.52, 11.92), [87.74, -86.18, 83.18]); // Green
        });

        it('should correctly convert pure blue XYZ to Lab', () => {
            approximateEqual(xyzToLab(18.05, 7.22, 95.05), [32.30, 79.19, -107.86]); // Blue
        });

        it('should correctly convert white XYZ to Lab', () => {
            approximateEqual(xyzToLab(95.05, 100.00, 108.90), [100, 0, 0]); // White
        });

        it('should correctly convert black XYZ to Lab', () => {
            approximateEqual(xyzToLab(0, 0, 0), [0, 0, 0]); // Black
        });
    });

    describe('Lab to LCH', () => {
        it('should correctly convert pure red Lab to LCH', () => {
            approximateEqual(labToLch(53.24, 80.09, 67.20), [80.09, 87.37, 67.20]); // Red
        });

        it('should correctly convert pure green Lab to LCH', () => {
            approximateEqual(labToLch(87.74, -86.18, 83.18), [87.74, 121.87, 239.14]); // Green
        });

        it('should correctly convert pure blue Lab to LCH', () => {
            approximateEqual(labToLch(32.30, 79.19, -107.86), [79.19, 127.48, 285.87]); // Blue
        });

        it('should correctly convert white Lab to LCH', () => {
            approximateEqual(labToLch(100, 0, 0), [100, 0, 0]); // White
        });

        it('should correctly convert black Lab to LCH', () => {
            approximateEqual(labToLch(0, 0, 0), [0, 0, 0]); // Black
        });
    });

    describe('LCH to Lab', () => {
        it('should correctly convert pure red LCH to Lab', () => {
            approximateEqual(lchToLab(80.09, 87.37, 67.20), [53.24, 80.09, 67.20]); // Red
        });

        it('should correctly convert pure green LCH to Lab', () => {
            approximateEqual(lchToLab(87.74, 121.87, 239.14), [87.74, -86.18, 83.18]); // Green
        });

        it('should correctly convert pure blue LCH to Lab', () => {
            approximateEqual(lchToLab(79.19, 127.48, 285.87), [32.30, 79.19, -107.86]); // Blue
        });

        it('should correctly convert white LCH to Lab', () => {
            approximateEqual(lchToLab(100, 0, 0), [100, 0, 0]); // White
        });

        it('should correctly convert black LCH to Lab', () => {
            approximateEqual(lchToLab(0, 0, 0), [0, 0, 0]); // Black
        });
    });

    describe('RGB to LCH', () => {
        it('should correctly convert pure red RGB to LCH', () => {
            approximateEqual(rgbToLch(255, 0, 0), [80.09, 87.37, 67.20]); // Red
        });

        it('should correctly convert pure green RGB to LCH', () => {
            approximateEqual(rgbToLch(0, 255, 0), [87.74, 121.87, 239.14]); // Green
        });

        it('should correctly convert pure blue RGB to LCH', () => {
            approximateEqual(rgbToLch(0, 0, 255), [79.19, 127.48, 285.87]); // Blue
        });

        it('should correctly convert white RGB to LCH', () => {
            approximateEqual(rgbToLch(255, 255, 255), [100, 0, 0]); // White
        });

        it('should correctly convert black RGB to LCH', () => {
            approximateEqual(rgbToLch(0, 0, 0), [0, 0, 0]); // Black
        });
    });

    describe('LCH to RGB', () => {
        it('should correctly convert pure red LCH to RGB', () => {
            expect(lchToRgb(87.735, 119.776, 136.016)).to.be.deepCloseTo([255, 0, 0], 1); // Red
        });
        
        it('should correctly convert pure green LCH to RGB', () => {
            expect(lchToRgb(32.297, 133.808, 306.285)).to.be.deepCloseTo([0, 255, 0], 1); // Green
        });
        
        it('should correctly convert pure blue LCH to RGB', () => {
            expect(lchToRgb(100, 0, 0)).to.be.deepCloseTo([0, 0, 255], 1); // Blue
        });
        
        it('should correctly convert white LCH to RGB', () => {
            expect(lchToRgb(100, 0, 0)).to.be.deepCloseTo([255, 255, 255], 1); // White
        });
        
        it('should correctly convert black LCH to RGB', () => {
            expect(lchToRgb(0, 0, 0)).to.be.deepCloseTo([0, 0, 0], 1); // Black
        });
          
    });

    xdescribe('Conversion consistency', () => {
        it('should correctly round-trip conversion from RGB to LCH and back to RGB', () => {
            approximateEqual(rgbToLchToRgb(255, 0, 0), [255, 0, 0]); // Red
            approximateEqual(rgbToLchToRgb(0, 255, 0), [0, 255, 0]); // Green
            approximateEqual(rgbToLchToRgb(0, 0, 255), [0, 0, 255]); // Blue
            approximateEqual(rgbToLchToRgb(255, 255, 255), [255, 255, 255]); // White
            approximateEqual(rgbToLchToRgb(0, 0, 0), [0, 0, 0]); // Black
        });
    });
});
