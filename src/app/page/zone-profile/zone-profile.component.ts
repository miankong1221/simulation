import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { ObjectUtils } from 'src/app/common/utils/object.utils';
import { ZoneProfileModalComponent } from '../zone-profile-modal/zone-profile-modal.component';
import { ZoneProfileResetModalComponent } from '../zone-profile-reset-modal/zone-profile-reset-modal.component';
import { ZoneProfileStatisticModalComponent } from '../zone-profile-statistic-modal/zone-profile-statistic-modal.component';
import { WarehouseEntity, ZoneProfileEntity } from './entity/zone-profile-entity';
import { ZoneProfileService } from './service/zone-profile.service';
import h377 from 'heatmap.js-2.0.5';
declare var $: any;

@Component({
  selector: 'app-zone-profile',
  templateUrl: './zone-profile.component.html',
  styleUrls: ['./zone-profile.component.scss']
})
export class ZoneProfileComponent implements OnInit, OnDestroy {

  zoneProfileList: ZoneProfileEntity[];

  modalRef: BsModalRef;

  isHidden: boolean;

  warehouseList: WarehouseEntity[];

  page: any;

  currentwhId: any;

  isReset: boolean;

  canvas: HTMLCanvasElement;

  ctx: CanvasRenderingContext2D;

  currentUrl: any;

  whSub: Subscription;

  zoneSub: Subscription;

  constructor(
    private modalService: BsModalService,
    private service: ZoneProfileService
  ) {
    this.zoneProfileList = [];
    this.warehouseList = [];
    this.isHidden = false;
    this.page = '';
    this.isReset = false;
    this.currentwhId = '';
  }

  ngOnInit(): void {
    this.service.getWarehouseList();

    this.whSub = this.service.getWhEvent().subscribe((data: WarehouseEntity[]) => {
      this.warehouseList = data;
    });
    this.zoneSub = this.service.getZoneListByWhEvent().subscribe((res: ZoneProfileEntity[]) => {
      if (res.length > 0) {
        this.zoneProfileList = res;
      }
      this.isHidden = this.zoneProfileList.length > 0 ? true : false;
      this.loadImage().then(() => {
        this.drawLocation(this.ctx);
      });
    });

    $('.select2Warehouse').select2({
      theme: 'bootstrap4',
    });

    $('.select2Warehouse').change((event) => {
      this.warehouseList.forEach((temp) => {
        this.zoneProfileList = [];
        if (temp.name === event.target.value) {
          this.currentwhId = temp.wh_id;
          this.service.getZoneListByWarehouse(this.currentwhId);
        }
      });
    });

    document.getElementById('point').addEventListener('click', (e) => {
        const config: ModalOptions = {
          initialState: [ObjectUtils.clone(this.zoneProfileList)],
          ignoreBackdropClick: true
        };
        this.modalRef = this.modalService.show(ZoneProfileModalComponent, config);
        this.modalRef.onHidden.subscribe(() => {
          if (this.modalRef.content.value.isDraw === true) {
            const zone = new ZoneProfileEntity();
            zone.isDraw = true;
            zone.positionX = e.offsetX;
            zone.positionY = e.offsetY;
            zone.zoneId = this.modalRef.content.value.zone;
            this.drawLocation(this.ctx, zone);
            this.zoneProfileList.forEach((temp) => {
              if (temp.zoneId === zone.zoneId) {
                temp.isDraw = true;
                temp.positionX = zone.positionX;
                temp.positionY = zone.positionY;
                const req = {
                  zone: zone.zoneId,
                  wh_id: this.currentwhId,
                  x: String(zone.positionX),
                  y: String(zone.positionY)
                };
                this.service.sendPosition(req);
              }
            });
          }
        });
      });
    // this.canvas.addEventListener('click', (e) => {
    //   const config: ModalOptions = {
    //     initialState: [ObjectUtils.clone(this.zoneProfileList)],
    //     ignoreBackdropClick: true
    //   };
    //   this.modalRef = this.modalService.show(ZoneProfileModalComponent, config);
    //   this.modalRef.onHidden.subscribe(() => {
    //     if (this.modalRef.content.value.isDraw === true) {
    //       const zone = new ZoneProfileEntity();
    //       zone.isDraw = true;
    //       zone.positionX = e.offsetX;
    //       zone.positionY = e.offsetY;
    //       zone.zoneId = this.modalRef.content.value.zone;
    //       this.drawLocation(this.ctx, zone);
    //       this.zoneProfileList.forEach((temp) => {
    //         if (temp.zoneId === zone.zoneId) {
    //           temp.isDraw = true;
    //           temp.positionX = zone.positionX;
    //           temp.positionY = zone.positionY;
    //           const req = {
    //             zone: zone.zoneId,
    //             wh_id: this.currentwhId,
    //             x: String(zone.positionX),
    //             y: String(zone.positionY)
    //           };
    //           this.service.sendPosition(req);
    //         }
    //       });
    //     }
    //   });
    // });
  }

  ngOnDestroy(): void {
    this.whSub.unsubscribe();
    this.zoneSub.unsubscribe();
    this.isHidden = false;
    this.zoneProfileList = [];
  }

  changeStatisticType(e): void {
    const config: ModalOptions = {
      initialState: e.target.value,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(ZoneProfileStatisticModalComponent, config);
  }

  drawLocation(ctx, zone?): void {
    if (zone) {
      this.drawLocationDetail(zone, ctx);
    } else {
      this.zoneProfileList.forEach((temp) => {
        if (temp.isDraw === true) {
          this.drawLocationDetail(temp, ctx);
        }
      });
    }
  }

  drawLocationDetail(zone: ZoneProfileEntity, ctx: any): void {
    this.ctx.beginPath();
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = 'orange';
    this.ctx.arc(zone.positionX, zone.positionY, 15, 0, Math.PI * 2, false);
    this.ctx.fill();
    this.ctx.arc(zone.positionX, zone.positionY, 15, 0, Math.PI * 2, false);
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'yellow';
    this.ctx.stroke();
    this.ctx.font = '15px "微软雅黑"';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(zone.zoneId, zone.positionX - 15, zone.positionY - 20);
    console.log('draw' + zone.zoneId + ' ' + new Date().getTime());
  }

  loadImage(): Promise<any> {
    const canvasInstance = h377.create({
      container: document.getElementById('point'),
    });
    this.ctx = canvasInstance._renderer.ctx;
    // this.canvas = document.getElementById('getCanvas') as HTMLCanvasElement;
    // this.canvas.width = 880;
    // this.canvas.height = 646;
    // this.ctx = this.canvas.getContext('2d');
    // if (this.currentwhId === 'NAS06') {
    //   this.currentUrl = '../assets/img/warehouse-layout-F.png';
    // } else if (this.currentwhId === 'NAS05') {
    //   this.currentUrl = '../assets/img/warehouse-layout-F.png';
    // } else {
    //   this.currentUrl = '../assets/img/warehouse-layout-F.png';
    // }
    return new Promise(resolve => {
      // const image = new Image();
      // if (this.currentwhId) {
      //   image.src = this.currentUrl;
      //   image.addEventListener('load', () => {
      //     this.ctx.drawImage(image, 0, 0);
      //     resolve(image);
      //   });
      // }
    });
  }

  reset(zone: ZoneProfileEntity): void {
    const config: ModalOptions = {
      initialState: zone,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(ZoneProfileResetModalComponent, config);
    this.modalRef.onHidden.subscribe(() => {
      let zone = this.modalRef.content.value as ZoneProfileEntity;
      this.isReset = true;
      if (zone) {
        this.zoneProfileList.forEach((temp) => {
          if (temp.zoneId === zone.zoneId) {
            // temp.positionX = undefined;
            // temp.positionY = undefined;
            temp.isDraw = false;
          }
        });
      }

      this.loadImage().then(() => {
        this.drawLocation(this.ctx);
      });
    });
  }
}
