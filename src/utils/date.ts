export function dateFormat(fmt: string, date: Date | number | string): string {
  let d = date;
  if (typeof d === 'string' || typeof d === 'number') {
    d = new Date(d);
  }
  const o: Record<string, number> = {
    'M+': d.getMonth() + 1, // 月份
    'd+': d.getDate(), // 日
    'h+': d.getHours(), // 小时
    'm+': d.getMinutes(), // 分
    's+': d.getSeconds(), // 秒
    'q+': Math.floor((d.getMonth() + 3) / 3), // 季度
    S: d.getMilliseconds(), // 毫秒
  };
  let ret = fmt;
  if (/(y+)/.test(ret)) {
    ret = ret.replace(RegExp.$1, (`${d.getFullYear()}`).substr(4 - RegExp.$1.length));
  }
  Object.keys(o).forEach((k) => {
    if (new RegExp(`(${k})`).test(ret)) {
      ret = ret.replace(RegExp.$1, (RegExp.$1.length === 1) ? (`${o[k]}`) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
    }
  });
  return ret;
}

export function formatDate(date: Date | number | string): string {
  return dateFormat('yyyy-MM-dd', date);
}

export function formatMonth(date: Date | number | string): string {
  return dateFormat('yyyy-MM', date);
}

export function formatDatetime(date: Date | number | string): string {
  return dateFormat('yyyy-MM-dd hh:mm:ss', date);
}

export function formatTime(date: Date | number | string): string {
  return dateFormat('hh:mm:ss', date);
}
