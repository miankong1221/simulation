import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EnvConst } from 'src/app/common/const/env-const';
import { ZoneProfileEntity } from '../zone-profile/entity/zone-profile-entity';

@Component({
  selector: 'app-zone-profile-statistic-modal',
  templateUrl: './zone-profile-statistic-modal.component.html',
  styleUrls: ['./zone-profile-statistic-modal.component.scss']
})
export class ZoneProfileStatisticModalComponent implements OnInit {

  zone: ZoneProfileEntity;

  constructor(
    public bsModalRef: BsModalRef,
    private http: HttpClient,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
  }

  cancel(): void {
    this.bsModalRef.hide();

  }

  confirm(): void {
    this.zone = this.modalService.config.initialState as ZoneProfileEntity;
    this.bsModalRef.hide();
    const req = {
      wh_id: '11',
      zone: '11',
      algorithm: '11'
    };
    const url = EnvConst.DevExtentionConst.API_ROOT + '/wms-extension/api/v1/equipment/zones/statistic';
    this.http.post(url, req).subscribe( () => {
      this.bsModalRef.hide();
    });

  }

}
