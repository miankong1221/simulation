import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterDataMappingComponent } from './page/master-data-mapping/master-data-mapping.component';
import { MonitoringComponent } from './page/monitoring/view/monitoring.component';
import { OlComponent } from './page/ol/ol.component';
import { SensorDetailComponent } from './page/sensor-detail/sensor-detail.component';
import { SensorMasterDataComponent } from './page/sensor-master-data/sensor-master-data.component';
import { SidebarComponent } from './page/sidebar/sidebar.component';
import { SimulationControlComponent } from './page/simulation-control/simulation-control.component';
import { WarehouseDetailComponent } from './page/warehouse-detail/warehouse-detail.component';
import { ZoneDetailComponent } from './page/zone-detail/zone-detail.component';
import { ZoneProfileComponent } from './page/zone-profile/zone-profile.component';


const routes: Routes = [
  {
    path: '', redirectTo: 'home/ol', pathMatch: 'full',
  },
  {
    path: 'home', component: SidebarComponent,
    children: [
      { path: 'monitor', component: MonitoringComponent},
      { path: 'ol', component: OlComponent},
      { path: 'monitor/warehouse-detail', component: WarehouseDetailComponent},
      { path: 'monitor/zone-detail', component: ZoneDetailComponent},
      { path: 'monitor/sensor-detail', component: SensorDetailComponent},
      {
        path: 'configuration/master-data-mapping', component: MasterDataMappingComponent
      },
      {
        path: 'configuration/zone-profile', component: ZoneProfileComponent
      },
      {
        path: 'simulation/configuration/sensor-master-data', component: SensorMasterDataComponent
      },
      {
        path: 'simulation/configuration/simulation-control', component: SimulationControlComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
