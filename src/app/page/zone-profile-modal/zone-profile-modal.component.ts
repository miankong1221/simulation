import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ZoneProfileEntity } from '../zone-profile/entity/zone-profile-entity';
declare var $: any;

@Component({
  selector: 'app-zone-profile-modal',
  templateUrl: './zone-profile-modal.component.html',
  styleUrls: ['./zone-profile-modal.component.scss']
})
export class ZoneProfileModalComponent implements OnInit {

  zoneProfileList: ZoneProfileEntity[];
  isSubmit: boolean;
  selectedZone: any;

  constructor(
    public bsModalRef: BsModalRef,
    private modalService: BsModalService
  ) {
    this.zoneProfileList = [];
    this.isSubmit = true;
  }

  ngOnInit(): void {
    $('.selectZone').select2({
      theme: 'bootstrap4',
    });
    $('.selectZone').change((event) => {
      this.isSubmit = false;
      this.selectedZone = event.target.value;
    });
    this.zoneProfileList = this.modalService.config.initialState[0].filter((zone) => {
      return zone.isDraw === false;
    });
  }

  confirm(): void{
    const res = {
      isDraw: true,
      zone: this.selectedZone
    };
    this.bsModalRef.content.value = res;
    this.bsModalRef.hide();
  }

}
