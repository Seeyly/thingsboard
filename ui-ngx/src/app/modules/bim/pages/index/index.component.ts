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
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {
  DashboardLayoutId,
  DashboardLayoutInfo,
  DashboardLayoutsInfo,
  GridSettings,
  HomeDashboard, HomeDashboardInfo,
  WidgetLayouts
} from '@shared/models/dashboard.models';
import {MenuService} from '@core/services/menu.service';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {ActivatedRoute, Router} from '@angular/router';
import {MediaBreakpoints} from '@shared/models/constants';
import {HomeSection} from '@core/services/menu.models';
import {
  DashboardContext,
  DashboardPageLayout,
  DashboardPageLayouts, IDashboardController,
  LayoutWidgetsArray
} from '@home/components/dashboard-page/dashboard-page.models';
import {DashboardUtilsService} from '@core/services/dashboard-utils.service';
import {UtilsService} from '@core/services/utils.service';
import {ILayoutController} from '@home/components/dashboard-page/layout/layout.models';
import {MobileService} from '@core/services/mobile.service';
import {DashboardPageComponent} from '@home/components/dashboard-page/dashboard-page.component';
import {isDefinedAndNotNull, objToBase64URI, validateEntityId} from '@core/utils';
import {DashboardService} from '@core/http/dashboard.service';
import {EntityType} from '@shared/models/entity-type.models';
import {StateObject} from '@core/api/widget-api.models';
import {updateEntityParams} from '@home/models/widget-component.models';
import {EntityId} from '@shared/models/id/entity-id';

interface Menu{
  img:string,
  title:string,
  state:string
}


@Component({
  selector: 'tb-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent implements OnInit {
  homeDashboard: HomeDashboard = this.route.snapshot.data.homeDashboard;
  dashboard:HomeDashboard = this.route.snapshot.data.homeDashboard;


  @ViewChild(DashboardPageComponent)
  dashboardPage:DashboardPageComponent
  currentStyle:any = {}

  cols = 2;
  menus:Menu[] = [
    {
      img:"assets/bim/company.png",
      title:"全局监控",
      state:"default",
    },
    {
      img:"assets/bim/view.png",
      title:"控制中心",
      state:"kzzx",
    },
    {
      img:"assets/bim/focus.png",
      title:"能源中心",
      state:"能源中心",
    },
    {
      img:"assets/bim/night.png",
      title:"数据中心",
      state:"数据中心",
    },
    {
      img:"assets/bim/scene.png",
      title:"设置中心",
      state:"sz",
    },
  ]

  constructor(private menuService: MenuService,
              public breakpointObserver: BreakpointObserver,
              private dashboardUtils: DashboardUtilsService,
              private utils: UtilsService,
              private router: Router,
              private mobileService: MobileService,
              private dashboardService: DashboardService,
              private ngZone: NgZone,
              private cd: ChangeDetectorRef,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {

    if (!this.homeDashboard) {
      this.updateColumnCount();
      this.breakpointObserver
        .observe([MediaBreakpoints.lg, MediaBreakpoints['gt-lg']])
        .subscribe((state: BreakpointState) => this.updateColumnCount());
    }


  }
  // public openDashboardState(state: string, openRightLayout?: boolean) {
  //   const layoutsData = this.dashboardUtils.getStateLayoutsData(this.dashboard, state);
  //   if (layoutsData) {
  //     this.dashboardCtx.state = state;
  //     this.dashboardCtx.aliasController.dashboardStateChanged();
  //     this.isRightLayoutOpened = openRightLayout ? true : false;
  //     this.updateLayouts(layoutsData);
  //   }
  //   setTimeout(() => {
  //     this.mobileService.onDashboardLoaded(this.layouts.right.show, this.isRightLayoutOpened);
  //   });
  // }
  // public runChangeDetection() {
  //   this.ngZone.run(() => {
  //     this.cd.detectChanges();
  //   });
  // }
  //
  // private updateLayouts(layoutsData?: DashboardLayoutsInfo) {
  //   if (!layoutsData) {
  //     layoutsData = this.dashboardUtils.getStateLayoutsData(this.dashboard, this.dashboardCtx.state);
  //   }
  //   for (const l of Object.keys(this.layouts)) {
  //     const layout: DashboardPageLayout = this.layouts[l];
  //     if (layoutsData[l]) {
  //       layout.show = true;
  //       const layoutInfo: DashboardLayoutInfo = layoutsData[l];
  //       this.updateLayout(layout, layoutInfo);
  //     } else {
  //       layout.show = false;
  //       this.updateLayout(layout, {widgetIds: [], widgetLayouts: {}, gridSettings: null});
  //     }
  //   }
  // }
  //
  // private updateMainLayoutSize(): boolean {
  //   const prevMainLayoutWidth = this.mainLayoutSize.width;
  //   const prevMainLayoutHeight = this.mainLayoutSize.height;
  //   if (this.isEditingWidget && this.editingLayoutCtx.id === 'main') {
  //     this.mainLayoutSize.width = '100%';
  //   } else {
  //     this.mainLayoutSize.width = this.layouts.right.show && !this.isMobile ? this.calculateWidth('main') : '100%';
  //   }
  //   if (!this.isEditingWidget || this.editingLayoutCtx.id === 'main') {
  //     this.mainLayoutSize.height = '100%';
  //   } else {
  //     this.mainLayoutSize.height = '0px';
  //   }
  //   return prevMainLayoutWidth !== this.mainLayoutSize.width || prevMainLayoutHeight !== this.mainLayoutSize.height;
  // }
  //
  // private updateRightLayoutSize(): boolean {
  //   const prevRightLayoutWidth = this.rightLayoutSize.width;
  //   const prevRightLayoutHeight = this.rightLayoutSize.height;
  //   if (this.isEditingWidget && this.editingLayoutCtx.id === 'right') {
  //     this.rightLayoutSize.width = '100%';
  //   } else {
  //     this.rightLayoutSize.width = this.isMobile ? '100%' : this.calculateWidth('right');
  //   }
  //   if (!this.isEditingWidget || this.editingLayoutCtx.id === 'right') {
  //     this.rightLayoutSize.height = '100%';
  //   } else {
  //     this.rightLayoutSize.height = '0px';
  //   }
  //   return prevRightLayoutWidth !== this.rightLayoutSize.width || prevRightLayoutHeight !== this.rightLayoutSize.height;
  // }
  //
  //
  // private updateLayout(layout: DashboardPageLayout, layoutInfo: DashboardLayoutInfo) {
  //   if (layoutInfo.gridSettings) {
  //     layout.layoutCtx.gridSettings = layoutInfo.gridSettings;
  //   }
  //   layout.layoutCtx.widgets.setWidgetIds(layoutInfo.widgetIds);
  //   layout.layoutCtx.widgetLayouts = layoutInfo.widgetLayouts;
  //   if (layout.show && layout.layoutCtx.ctrl) {
  //     layout.layoutCtx.ctrl.reload();
  //   }
  //   layout.layoutCtx.ignoreLoading = true;
  //   this.updateLayoutSizes();
  // }
  //
  // private updateLayoutSizes() {
  //   let changeMainLayoutSize = false;
  //   let changeRightLayoutSize = false;
  //   if (this.dashboardCtx.state) {
  //     changeMainLayoutSize = this.updateMainLayoutSize();
  //     changeRightLayoutSize = this.updateRightLayoutSize();
  //   }
  //   if (changeMainLayoutSize || changeRightLayoutSize) {
  //     this.cd.markForCheck();
  //   }
  // }

  openState(menu){
    if(menu.state!="default"){
       this.currentStyle = {
          "background":"#0B215B"
        }
    }else{
      this.currentStyle = {
        "background":'none'
      }
    }




    this.dashboardPage.openDashboardState(menu.state)


  }
  private updateColumnCount() {
    this.cols = 2;
    if (this.breakpointObserver.isMatched(MediaBreakpoints.lg)) {
      this.cols = 3;
    }
    if (this.breakpointObserver.isMatched(MediaBreakpoints['gt-lg'])) {
      this.cols = 4;
    }
    this.cd.detectChanges();
  }
  sectionColspan(section: HomeSection): number {
    if (this.breakpointObserver.isMatched(MediaBreakpoints['gt-sm'])) {
      let colspan = this.cols;
      if (section && section.places && section.places.length <= colspan) {
        colspan = section.places.length;
      }
      return colspan;
    } else {
      return 2;
    }
  }

}
