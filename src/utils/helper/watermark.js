let watermark = {}

let setWatermark = (str) => {
  let id = '1.23452384164.123412416';

  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id));
  }

  //创建一个画布
  let can = document.createElement('canvas');
  //设置画布的长宽

  if(str.length *  120 <400){
    can.width = 400
  }else{
    can.width =  str.length * 120 
  }

  if(str.length * 40 > document.documentElement.clientHeight){
    can.height = document.documentElement.clientHeight
  }else if(str.length * 40 < 400 ){
    can.height = 400
  }else{
    can.height =  str.length * 40
  }

  let cans = can.getContext('2d');
  //旋转角度
  cans.rotate(-24 * Math.PI / 180);
  cans.font = '68px PingFang SC Semibold';
  //设置填充绘画的颜色、渐变或者模式
  cans.fillStyle = 'rgba(200, 200, 200, 0.40)';
  //设置文本内容的当前对齐方式
  cans.textAlign = 'left';
  //设置在绘制文本时使用的当前文本基线
  cans.textBaseline = 'Middle';
  //在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）
  // cans.fillText(str, can.width / 8, can.height / 2);
  cans.fillText(str, 0-70, can.height-70);

  let div = document.createElement('div');
  div.id = id;
  div.style.pointerEvents = 'none';
  div.style.top = '0px';
  div.style.left = '0px';
  div.style.position = 'fixed';
  div.style.zIndex = '100000';
  div.style.width = document.documentElement.clientWidth + 'px';
  div.style.height = document.documentElement.clientHeight + 'px';
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat';
  document.body.appendChild(div);
  return id;
}

// 该方法只允许调用一次
// watermark.set = (str) => {
//   let id = setWatermark(str);
//   setInterval(() => {
//     if (document.getElementById(id) === null) {
//       id = setWatermark(str);
//     }
//   }, 500);
//   window.onresize = () => {
//     setWatermark(str);
//   };
// }
// 添加水印方法
export const setWaterMark = (str) => {
  let id = setWatermark(str)
  if (document.getElementById(id) === null) {
    id = setWatermark(str)
  }
}

// 移除水印方法
export const removeWatermark = () => {
  let id = '1.23452384164.123412415'
  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }
}