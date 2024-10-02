// numberToWordsVi.js

const units = ['', 'Nghìn', 'Triệu', 'Tỷ'];
const unitNames = ['Không', 'Một', 'Hai', 'Ba', 'Bốn', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín'];

const numberToWordsVi = (num) => {
    if (num === 0) return 'không';

    const getUnit = (n) => {
        if (n === 0) return '';
        if (n < 10) return unitNames[n];
        if (n < 20) return 'mười ' + (n === 10 ? '' : unitNames[n - 10]);
        if (n < 100) return unitNames[Math.floor(n / 10)] + ' Mươi ' + unitNames[n % 10];
        if (n < 1000) return unitNames[Math.floor(n / 100)] + ' Trăm ' + getUnit(n % 100);
        if (n < 1000000) return getUnit(Math.floor(n / 1000)) + ' Nghìn ' + getUnit(n % 1000);
        if (n < 1000000000) return getUnit(Math.floor(n / 1000000)) + ' Triệu ' + getUnit(n % 1000000);
        return getUnit(Math.floor(n / 1000000000)) + ' tỷ ' + getUnit(n % 1000000000);
    };

    return getUnit(num).trim().replace(/\s+/g, ' ');
};

export default numberToWordsVi;
