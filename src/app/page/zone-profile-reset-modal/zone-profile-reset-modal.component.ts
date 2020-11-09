import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EnvConst } from 'src/app/common/const/env-const';
import { ZoneProfileEntity } from '../zone-profile/entity/zone-profile-entity';

@Component({
  selector: 'app-zone-profile-reset-modal',
  templateUrl: './zone-profile-reset-modal.component.html',
  styleUrls: ['./zone-profile-reset-modal.component.scss']
})
export class ZoneProfileResetModalComponent implements OnInit {

  zone: ZoneProfileEntity;

  constructor(
    public bsModalRef: BsModalRef,
    private http: HttpClient,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.zone = this.modalService.config.initialState as ZoneProfileEntity;
  }

  confirm(): void {
    const whId = this.zone.whId;
    const zoneId = this.zone.zoneId;
    const url = EnvConst.DevExtentionConst.API_ROOT + '/wms-extension/api/v1/equipment/warehouses/' + whId + '/zones/' + zoneId + '/positions';
    this.http.delete(url).subscribe(() => {
      this.bsModalRef.content.value = this.zone;
      this.bsModalRef.hide();
    });
    this.bsModalRef.content.value = this.zone;
    this.bsModalRef.hide();
  }

  cancel(): void {
    this.bsModalRef.hide();
  }

}
