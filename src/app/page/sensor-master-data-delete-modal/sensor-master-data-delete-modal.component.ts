import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-sensor-master-data-delete-modal',
  templateUrl: './sensor-master-data-delete-modal.component.html',
  styleUrls: ['./sensor-master-data-delete-modal.component.scss']
})
export class SensorMasterDataDeleteModalComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
    public http: HttpClient,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
  }

  confirm(): void {
    this.bsModalRef.hide();
  }

  cancel(): void {
    this.bsModalRef.hide();
  }
}
