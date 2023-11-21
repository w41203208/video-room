// function fibMemo(position, cache = [], str = '') {
//   console.log('a new func');
//   console.log(str);
//   if (cache[position]) {
//     // console.log(cache[position]);
//     /**
//      * 如果在 cache 中有找到該 position 的數值，
//      * 則直接回傳不用重算
//      **/
//     return cache[position];
//   } else {
//     /**
//      * 如果在 cache 中沒有找到該 position 的數值，
//      * 則計算該 position 的數值，並存到 cache 中
//      **/
//     if (position <= 2) {
//       cache[position] = 1;
//     } else {
//       cache[position] =
//         fibMemo(position - 1, cache, 'left') +
//         fibMemo(position - 2, cache, 'right');
//     }
//     console.log(position);
//     return cache[position];
//   }
// }
// console.log(fibMemo(5));

var foo = {
  x: 20,
  y: 30,
};
console.log(foo.__proto__);
