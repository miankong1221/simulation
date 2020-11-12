import { Component, OnInit } from '@angular/core';
import L from 'leaflet/dist/leaflet';
import h377 from 'heatmap.js';



@Component({
  selector: 'app-ol',
  templateUrl: './ol.component.html',
  styleUrls: ['./ol.component.scss']
})
export class OlComponent implements OnInit {

  ngOnInit(): void {
    const url = '../assets/img/Warehouse_white.jpg';
    const map = new L.map('mapId2', {
      crs: L.CRS.Simple
    });
    const bounds = [[0, 0], [710, 1000]];
    const image = L.imageOverlay(url, bounds).addTo(map);
    map.fitBounds(bounds);
    // const myIcon = L.icon({
    //   iconUrl: '../assets/img/img_humidity.png',
    // });
    // L.marker([900, 800], { icon: myIcon }).addTo(map);
    // L.marker([1200, 800], { icon: myIcon }).addTo(map);

    const heatmapInstance = h377.create({
      container: document.getElementById('mapId')
    });

    const points = [];
    let max = 0;
    const width = document.body.clientWidth / 4;
    const height = document.body.clientHeight / 4;
    // let len = 300;
    // while (len--) {
    //   const val = Math.floor(Math.random() * 100);
    //   max = Math.max(max, val);
    //   const point = {
    //     x: Math.floor(Math.random() * width),
    //     y: Math.floor(Math.random() * height),
    //     value: val
    //   };
    //   points.push(point);
    // }
    // const data = {
    //   max: max,
    //   data: points
    // };
    // heatmapInstance.setData(data);
    heatmapInstance.setData(this.generateData());
    // setInterval(() => heatmapInstance.setData(this.generateData()), 3000);
  }

  generateData(): {} {
    // const points = [];
    // for (let i = 0; i < 800; i++){
    //   for (let j = 0; j < 600; j++){
    //     let temp = {};
    //     if (i < 200 && j < 250){
    //       temp = {
    //         x: i,
    //         y: j,
    //         value:  0.1
    //       };
    //     }else if( i < 400 && j < 450) {
    //       temp = {
    //         x: i,
    //         y: j,
    //         value: 5
    //       };
    //     }else if( i < 500 && j < 550) {
    //       temp = {
    //         x: i,
    //         y: j,
    //         value: 8
    //       };
    //     }else {
    //       temp = {
    //         x: i,
    //         y: j,
    //         value: 9
    //       };
    //     }
    //     points.push(temp);
    //   }
    // }
    const points = [
      {
        x: 720,
        y: 400,
        value: 500
      },
      {
        x: 721,
        y: 400,
        value: 500
      },
      {
        x: 722,
        y: 400,
        value: 500
      },
      {
        x: 720,
        y: 200,
        value: 500
      },
      {
        x: 721,
        y: 200,
        value: 500
      },
      {
        x: 722,
        y: 200,
        value: 500
      },
      {
        x: 720,
        y: 50,
        value: 500
      },
      {
        x: 721,
        y: 50,
        value: 500
      },
      {
        x: 722,
        y: 50,
        value: 500
      },
      {
        x: 520,
        y: 400,
        value: 500
      },
      {
        x: 521,
        y: 400,
        value: 500
      },
      {
        x: 522,
        y: 400,
        value: 500
      },
      {
        x: 520,
        y: 200,
        value: 500
      },
      {
        x: 521,
        y: 200,
        value: 500
      },
      {
        x: 522,
        y: 200,
        value: 500
      },
      {
        x: 320,
        y: 400,
        value: 500
      },
      {
        x: 321,
        y: 400,
        value: 500
      },
      {
        x: 322,
        y: 400,
        value: 500
      },
      {
        x: 320,
        y: 200,
        value: 500
      },
      {
        x: 321,
        y: 200,
        value: 500
      },
      {
        x: 322,
        y: 200,
        value: 500
      }
    ];
    let max = 10;
    // const points = [];
    // const width1 = document.body.clientWidth;
    // const height1 = document.body.clientHeight;
    // let max = 1;
    // let len = 15;
    // while (len--) {
    //   const val = Math.floor(Math.random() * 200);
    //   max = Math.max(max, val);
    //   const point = {
    //     x: Math.floor(Math.random() * width1),
    //     y: Math.floor(Math.random() * height1),
    //     value: val
    //   };
    //   points.push(point);
    // }
    // const width2 = document.body.clientWidth / 2;
    // const height2 = document.body.clientHeight / 2;
    // let max = 0;
    // let len2 = 170;
    // while (len2--) {
    //   const val = Math.floor(Math.random() * 100);
    //   max = Math.max(max, val);
    //   const point = {
    //     x: Math.floor(Math.random() * width2),
    //     y: Math.floor(Math.random() * height2),
    //     value: val
    //   };
    //   points.push(point);
    // }
    const data = {
      max: max,
      data: points
    };
    return data;
  }
}


