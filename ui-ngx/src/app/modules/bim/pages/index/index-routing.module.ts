///
/// Copyright © 2016-2023 The Thingsboard Authors
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
import {Injectable, NgModule} from '@angular/core';
import {Resolve, RouterModule, Routes} from '@angular/router';
import {IndexComponent} from '@modules/bim/pages/index/index.component';
import {EntitiesTableComponent} from '@home/components/entity/entities-table.component';
import {Authority} from '@shared/models/authority.enum';
import {DashboardsTableConfigResolver} from '@home/pages/dashboard/dashboards-table-config.resolver';
import {DashboardPageComponent} from '@home/components/dashboard-page/dashboard-page.component';
import {dashboardBreadcumbLabelFunction, DashboardResolver} from '@home/pages/dashboard/dashboard-routing.module';
import {BreadCrumbConfig} from '@shared/components/breadcrumb';
import {HomeDashboard} from '@shared/models/dashboard.models';
import {DashboardService} from '@core/http/dashboard.service';
import { AppState } from '@app/core/core.state';
import {select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {map, mergeMap, take} from 'rxjs/operators';
import { AuthUser } from '@app/shared/public-api';
import {selectAuthUser, selectPersistDeviceStateToTelemetry} from '@core/auth/auth.selectors';
import {EntityKeyType} from '@shared/models/query/query.models';
export const getCurrentAuthUser = (store: Store<AppState>): AuthUser => {
  let authUser: AuthUser;
  store.pipe(select(selectAuthUser), take(1)).subscribe(
    val => authUser = val
  );
  return authUser;
};

@Injectable()
export class HomeDashboardResolver implements Resolve<HomeDashboard> {

  // @ts-ignore
  constructor(private dashboardService: DashboardService,
              private store: Store<AppState>) {
  }

  resolve(): Observable<HomeDashboard> {
    // @ts-ignore
    return this.dashboardService.getHomeDashboard().pipe(
      mergeMap((dashboard) => {
        // if (!dashboard) {
        //   let dashboard$: Observable<HomeDashboard>;
        //   const authority = getCurrentAuthUser(this.store).authority;
        //   switch (authority) {
        //     case Authority.SYS_ADMIN:
        //       dashboard$ = of(JSON.parse(sysAdminHomePageDashboardJson));
        //       break;
        //     case Authority.TENANT_ADMIN:
        //       dashboard$ = this.updateDeviceActivityKeyFilterIfNeeded(JSON.parse(tenantAdminHomePageDashboardJson));
        //       break;
        //     case Authority.CUSTOMER_USER:
        //       dashboard$ = this.updateDeviceActivityKeyFilterIfNeeded(JSON.parse(customerUserHomePageDashboardJson));
        //       break;
        //   }
        //   if (dashboard$) {
        //     return dashboard$.pipe(
        //       map((homeDashboard) => {
        //         homeDashboard.hideDashboardToolbar = true;
        //         return homeDashboard;
        //       })
        //     );
        //   }
        // }
        return of(dashboard);
      })
    );
  }

  private updateDeviceActivityKeyFilterIfNeeded(dashboard: HomeDashboard): Observable<HomeDashboard> {
    return this.store.pipe(select(selectPersistDeviceStateToTelemetry)).pipe(
      map((persistToTelemetry) => {
        if (persistToTelemetry) {
          for (const filterId of Object.keys(dashboard.configuration.filters)) {
            if (['Active Devices', 'Inactive Devices'].includes(dashboard.configuration.filters[filterId].filter)) {
              dashboard.configuration.filters[filterId].keyFilters[0].key.type = EntityKeyType.TIME_SERIES;
            }
          }
        }
        return dashboard;
      })
    );
  }
}


const routes: Routes = [
  {
    path: 'bimIndex',
    component: IndexComponent,
    resolve: {
      homeDashboard: HomeDashboardResolver
    }
  },
  {
    path: 'bombards',
    data: {
      breadcrumb: {
        label: 'dashboard.dashboards',
        icon: 'dashboard'
      }
    },
    children: [
      {
        path: '',
        component: EntitiesTableComponent,
        data: {
          auth: [Authority.TENANT_ADMIN, Authority.CUSTOMER_USER],
          title: 'dashboard.dashboards',
          dashboardsType: 'tenant'
        },
        resolve: {
          entitiesTableConfig: DashboardsTableConfigResolver
        }
      },
      {
        path: ':dashboardId',
        component: DashboardPageComponent,
        data: {
          breadcrumb: {
            labelFunction: dashboardBreadcumbLabelFunction,
            icon: 'dashboard'
          } as BreadCrumbConfig<DashboardPageComponent>,
          auth: [Authority.TENANT_ADMIN, Authority.CUSTOMER_USER],
          title: 'dashboard.dashboard',
          widgetEditMode: false
        },
        resolve: {
          dashboard: DashboardResolver
        }
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexRoutingModule { }
