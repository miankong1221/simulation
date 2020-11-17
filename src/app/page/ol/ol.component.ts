// import { Component, OnInit } from '@angular/core';
// import L from 'leaflet/dist/leaflet';
// import h377 from 'heatmap.js';



// @Component({
//   selector: 'app-ol',
//   templateUrl: './ol.component.html',
//   styleUrls: ['./ol.component.scss']
// })
// export class OlComponent implements OnInit {

//   points: any;
//   sensor1: any;
//   sensor2: any;
//   sensor3: any;
//   sensor4: any;

//   isFirst: boolean;

//   constructor() {
//     this.isFirst = true;
//   }
//   ngOnInit(): void {
//     const url = '../assets/img/Warehouse_black.jpg';
//     const map = new L.map('mapId', {
//       crs: L.CRS.Simple
//     });
//     const bounds = [[0, 0], [900, 1400]];
//     const image = L.imageOverlay(url, bounds).addTo(map);
//     map.fitBounds(bounds);
//     const myIcon = L.icon({
//       iconUrl: '../assets/img/marker-icon.png',
//     });
//     this.sensor1 = L.marker([1200, 820], { icon: myIcon }).addTo(map).bindPopup('Sol');
//     this.sensor2 = L.marker([1200, 700], { icon: myIcon }).addTo(map).bindPopup('Sol');
//     this.sensor3 = L.marker([1100, 770], { icon: myIcon }).addTo(map).bindPopup('Sol');
//     this.sensor4 = L.marker([1100, 650], { icon: myIcon }).addTo(map).bindPopup('Sol');

//     const heatmapInstance = h377.create({
//       container: document.getElementById('mapId')
//     });

//     const points = [];
//     let max = 0;
//     const width = document.body.clientWidth / 4;
//     const height = document.body.clientHeight / 4;
//     // let len = 300;
//     // while (len--) {
//     //   const val = Math.floor(Math.random() * 100);
//     //   max = Math.max(max, val);
//     //   const point = {
//     //     x: Math.floor(Math.random() * width),
//     //     y: Math.floor(Math.random() * height),
//     //     value: val
//     //   };
//     //   points.push(point);
//     // }
//     // const data = {
//     //   max: max,
//     //   data: points
//     // };
//     // heatmapInstance.setData(data);
//     // heatmapInstance.setData(this.generateData());
//     setInterval(() => heatmapInstance.setData(this.generateData()), 2500);
//   }

//   generateData(): {} {
//     if (this.isFirst){
//       this.isFirst = false;
//       this.points = [
//         {
//           x: 1200,
//           y: 800,
//           value: 26
//         },
//         {
//           x: 640,
//           y: 400,
//           value: 26
//         },
//         {
//           x: 1730,
//           y: 1500,
//           value: 26
//         },
//         {
//           x: 640,
//           y: 500,
//           value: 26
//         },
//         // {
//         //   x: 730,
//         //   y: 190,
//         //   value: 26
//         // },
//         // {
//         //   x: 640,
//         //   y: 190,
//         //   value: 26
//         // },
//         // {
//         //   x: 730,
//         //   y: 290,
//         //   value: 26
//         // },
//         // {
//         //   x: 640,
//         //   y: 290,
//         //   value: 26
//         // },
//         {
//           x: 730,
//           y: 90,
//           value: 26
//         },
//         {
//           x: 640,
//           y: 90,
//           value: 26
//         },
//         {
//           x: 520,
//           y: 400,
//           value: 26
//         },
//         {
//           x: 521,
//           y: 400,
//           value: 26
//         },
//         {
//           x: 522,
//           y: 400,
//           value: 500
//         },
//         {
//           x: 520,
//           y: 200,
//           value: 500
//         },
//         {
//           x: 521,
//           y: 200,
//           value: 500
//         },
//         {
//           x: 522,
//           y: 200,
//           value: 500
//         },
//         {
//           x: 520,
//           y: 50,
//           value: 500
//         },
//         {
//           x: 521,
//           y: 50,
//           value: 500
//         },
//         {
//           x: 522,
//           y: 50,
//           value: 500
//         },
//         {
//           x: 320,
//           y: 400,
//           value: 500
//         },
//         {
//           x: 321,
//           y: 400,
//           value: 500
//         },
//         {
//           x: 322,
//           y: 400,
//           value: 500
//         },
//         {
//           x: 320,
//           y: 200,
//           value: 500
//         },
//         {
//           x: 321,
//           y: 200,
//           value: 500
//         },
//         {
//           x: 322,
//           y: 200,
//           value: 500
//         },
//         {
//           x: 320,
//           y: 50,
//           value: 500
//         },
//         {
//           x: 321,
//           y: 50,
//           value: 500
//         },
//         {
//           x: 322,
//           y: 50,
//           value: 500
//         }
//       ];
//     }else{
//       this.sensor1.remove();
//       this.sensor2.remove();
//       this.sensor3.remove();
//       this.sensor4.remove();
//       this.points = [
//         {
//           x: 675,
//           y: 190,
//           value: 260
//         },
//        {
//           x: 640,
//           y: 240,
//           value: 260
//         },
//        {
//           x: 675,
//           y: 240,
//           value: 260
//         },
//       {
//           x: 675,
//           y: 270,
//           value: 260
//         },
//       {
//           x: 730,
//           y: 240,
//           value: 260
//         },
//         {
//           x: 685,
//           y: 410,
//           value: 500
//         },
//         {
//           x: 685,
//           y: 480,
//           value: 500
//         },
//         {
//           x: 640,
//           y: 450,
//           value: 26
//         },
//         {
//           x: 685,
//           y: 450,
//           value: 50
//         },
//         {
//           x: 720,
//           y: 450,
//           value: 50
//         },
//         {
//           x: 710,
//           y: 430,
//           value: 26
//         },
//         {
//           x: 660,
//           y: 440,
//           value: 26
//         },
//         {
//           x: 710,
//           y: 460,
//           value: 26
//         },
//         {
//           x: 690,
//           y: 270,
//           value: 126
//         },
//         {
//           x: 640,
//           y: 470,
//           value: 26
//         },
//         {
//           x: 690,
//           y: 215,
//           value: 126
//         },
//         {
//           x: 710,
//           y: 210,
//           value: 260
//         },
//         {
//           x: 730,
//           y: 190,
//           value: 20
//         },
//         {
//           x: 660,
//           y: 210,
//           value: 26
//         },
//         {
//           x: 710,
//           y: 270,
//           value: 260
//         },
//         {
//           x: 640,
//           y: 260,
//           value: 26
//         },
//         {
//           x: 730,
//           y: 90,
//           value: 26
//         },
//         {
//           x: 640,
//           y: 90,
//           value: 26
//         },
//         {
//           x: 520,
//           y: 400,
//           value: 26
//         },
//         {
//           x: 521,
//           y: 400,
//           value: 26
//         },
//         {
//           x: 522,
//           y: 400,
//           value: 500
//         },
//         {
//           x: 520,
//           y: 200,
//           value: 500
//         },
//         {
//           x: 521,
//           y: 200,
//           value: 500
//         },
//         {
//           x: 522,
//           y: 200,
//           value: 500
//         },
//         {
//           x: 520,
//           y: 50,
//           value: 500
//         },
//         {
//           x: 521,
//           y: 50,
//           value: 500
//         },
//         {
//           x: 522,
//           y: 50,
//           value: 500
//         },
//         {
//           x: 320,
//           y: 400,
//           value: 500
//         },
//         {
//           x: 321,
//           y: 400,
//           value: 500
//         },
//         {
//           x: 322,
//           y: 400,
//           value: 500
//         },
//         {
//           x: 320,
//           y: 200,
//           value: 500
//         },
//         {
//           x: 321,
//           y: 200,
//           value: 500
//         },
//         {
//           x: 322,
//           y: 200,
//           value: 500
//         },
//         {
//           x: 320,
//           y: 50,
//           value: 500
//         },
//         {
//           x: 321,
//           y: 50,
//           value: 500
//         },
//         {
//           x: 322,
//           y: 50,
//           value: 500
//         }
//       ];
//     }
//     let max = 550;
//     // const points = [];
//     // const width1 = document.body.clientWidth;
//     // const height1 = document.body.clientHeight;
//     // let max = 1;
//     // let len = 15;
//     // while (len--) {
//     //   const val = Math.floor(Math.random() * 200);
//     //   max = Math.max(max, val);
//     //   const point = {
//     //     x: Math.floor(Math.random() * width1),
//     //     y: Math.floor(Math.random() * height1),
//     //     value: val
//     //   };
//     //   points.push(point);
//     // }
//     // const width2 = document.body.clientWidth / 2;
//     // const height2 = document.body.clientHeight / 2;
//     // let max = 0;
//     // let len2 = 170;
//     // while (len2--) {
//     //   const val = Math.floor(Math.random() * 100);
//     //   max = Math.max(max, val);
//     //   const point = {
//     //     x: Math.floor(Math.random() * width2),
//     //     y: Math.floor(Math.random() * height2),
//     //     value: val
//     //   };
//     //   points.push(point);
//     // }
//     const data = {
//       max: max,
//       data: this.points
//     };
//     return data;
//   }
// }


