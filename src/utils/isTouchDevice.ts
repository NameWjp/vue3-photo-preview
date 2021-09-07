/**
 * 当前设备是否支持触摸事件
 */
const isTouchDevice = typeof document !== 'undefined' && 'ontouchstart' in document.documentElement;

export default isTouchDevice;
