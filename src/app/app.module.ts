import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { AppComponent } from './app.component';
import { MonitoringComponent } from './page/monitoring/view/monitoring.component';
import { SidebarComponent } from './page/sidebar/sidebar.component';
import { WarehouseDetailComponent } from './page/warehouse-detail/warehouse-detail.component';
import { ZoneDetailComponent } from './page/zone-detail/zone-detail.component';
import { SensorDetailComponent } from './page/sensor-detail/sensor-detail.component';
import { MasterDataMappingComponent } from './page/master-data-mapping/master-data-mapping.component';
import { ZoneProfileComponent } from './page/zone-profile/zone-profile.component';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { MasterDataMappingModalComponent } from './page/master-data-mapping-modal/master-data-mapping-modal.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { HttpClientModule } from '@angular/common/http';
import { ZoneProfileModalComponent } from './page/zone-profile-modal/zone-profile-modal.component';
import { SensorMasterDataComponent } from './page/sensor-master-data/sensor-master-data.component';
import { ZoneProfileResetModalComponent } from './page/zone-profile-reset-modal/zone-profile-reset-modal.component';
import { ZoneProfileService } from './page/zone-profile/service/zone-profile.service';
import { ZoneProfileStatisticModalComponent } from './page/zone-profile-statistic-modal/zone-profile-statistic-modal.component';
import { MonitoringService } from './page/monitoring/service/monitoring-service';
import { SensorMasterDataService } from './page/sensor-master-data/service/sensor-master-data-service';
import { LabelService } from './common/services/LabelService';
import { InjectionUtils } from './common/utils/injection.utils';
import { SensorMasterDataModalComponent } from './page/sensor-master-data-modal/sensor-master-data-modal.component';
import { SimulationControlComponent } from './page/simulation-control/simulation-control.component';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzConfig, NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SensorMasterDataDeleteModalComponent } from './page/sensor-master-data-delete-modal/sensor-master-data-delete-modal.component';
import { MasterDataMappingService } from './page/master-data-mapping/service/master-data-mapping-service';
import { MasterDataMappingDeleteModalComponent } from './page/master-data-mapping-delete-modal/master-data-mapping-delete-modal.component';
// import { OlComponent } from './page/ol/ol.component';


const ngZorroConfig: NzConfig = {
  message: { nzTop: 60 }
};

@NgModule({
  declarations: [
    AppComponent,
    MonitoringComponent,
    SidebarComponent,
    WarehouseDetailComponent,
    ZoneDetailComponent,
    SensorDetailComponent,
    MasterDataMappingComponent,
    ZoneProfileComponent,
    ZoneProfileModalComponent,
    MasterDataMappingModalComponent,
    MasterDataMappingDeleteModalComponent,
    SensorMasterDataComponent,
    ZoneProfileResetModalComponent,
    ZoneProfileStatisticModalComponent,
    SensorMasterDataModalComponent,
    SimulationControlComponent,
    SensorMasterDataDeleteModalComponent,
  ],
  imports: [
    BrowserModule,
    ModalModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NzDatePickerModule,
    NzSwitchModule,
    NzInputModule,
    NzInputNumberModule,
    ModalModule.forRoot(),
    AppRoutingModule,
    NzSliderModule,
    NzInputModule,
    NzButtonModule,
    NzTimePickerModule,
    NzCardModule,
    NzTagModule,
    NzSpinModule,
    NzMessageModule,
    NzIconModule
  ],
  providers: [
    BsModalService,
    ZoneProfileService,
    MonitoringService,
    SensorMasterDataService,
    MasterDataMappingService,
    LabelService,
    { provide: NZ_CONFIG, useValue: ngZorroConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    InjectionUtils.injector = this.injector;
}
}
