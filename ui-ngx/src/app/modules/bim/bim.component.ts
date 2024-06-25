
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
import {Component, NgZone, OnInit} from '@angular/core';
import {DashboardLayoutInfo, DashboardLayoutsInfo, HomeDashboard} from '@shared/models/dashboard.models';
import {DashboardPageLayout} from '@home/components/dashboard-page/dashboard-page.models';
import {ActiveComponentService} from '@core/services/active-component.service';
import {RouterTabsComponent} from '@home/components/router-tabs.component';
import {instanceOfSearchableComponent, ISearchableComponent} from '@home/models/searchable-component.models';
import screenfull from 'screenfull';
import {ActivatedRoute, Router} from '@angular/router';
import {StatesControllerService} from '@home/components/dashboard-page/states/states-controller.service';




interface Menu{
  id:string,
  title:string,
  unimg: string,
  checkimg: string,
  curImg:string,
}




@Component({
  selector: 'tb-bim',
  templateUrl: './bim.component.html',
  styleUrls: ['./bim.component.scss']
})
export class BimComponent implements OnInit {
  constructor( private activeComponentService: ActiveComponentService,
               protected router: Router,
               protected route: ActivatedRoute,
               protected ngZone: NgZone
               ) { }
  activeComponent: any;
  fullscreenEnabled = screenfull.isEnabled;
  searchableComponent: ISearchableComponent;
  searchEnabled = false;
  showSearch = false;
  searchText = '';
  currentStyle:any = {}
  hideLoadingBar = false;

  menus1:Menu[] =[
    {
      unimg:"assets/big/没选中001.png",
      checkimg:"assets/big/选中001.png",
      curImg:"assets/big/没选中001.png",
      title:"首页",
      id:"d977e760-77f9-11ee-9bfe-b9d9ed2a28b9",
    },
  {
    unimg:"assets/big/没选中002.png",
    checkimg:"assets/big/选中002.png",
    curImg:"assets/big/没选中002.png",
    title:"系统监测",
    id:"ab2b5b40-7b8b-11ee-9bfe-b9d9ed2a28b9",
  }
    ];
  menus2:Menu[]= [
    {
      unimg:"assets/big/没选中003.png",
      checkimg:"assets/big/选中003.png",
      curImg:"assets/big/没选中003.png",
      title:"能源中心",
      id:"c138b040-8162-11ee-9bfe-b9d9ed2a28b9",
    },
    {
      unimg:"assets/big/没选中004.png",
      checkimg:"assets/big/选中004.png",
      curImg:"assets/big/没选中004.png",
      title:"数据中心",
      id:"03aeb890-816b-11ee-9bfe-b9d9ed2a28b9",
    }
    ];

  menus:Menu[] = [
    {
      unimg:"assets/big/没选中001.png",
      checkimg:"assets/big/选中001.png",
      curImg:"assets/big/没选中001.png",
      title:"首页",
      id:"38aa7d90-7568-11ee-9bfe-b9d9ed2a28b9",
    },
    {
      unimg:"assets/big/没选中002.png",
      checkimg:"assets/big/选中002.png",
      curImg:"assets/big/没选中002.png",
      title:"系统监测",
      id:"ab2b5b40-7b8b-11ee-9bfe-b9d9ed2a28b9",
    },
    {
      unimg:"assets/big/没选中003.png",
      checkimg:"assets/big/选中003.png",
      curImg:"assets/big/没选中003.png",
      title:"能源中心",
      id:"c138b040-8162-11ee-9bfe-b9d9ed2a28b9",
    },
    {
      unimg:"assets/big/没选中004.png",
      checkimg:"assets/big/选中004.png",
      curImg:"assets/big/没选中004.png",
      title:"数据中心",
      id:"03aeb890-816b-11ee-9bfe-b9d9ed2a28b9",
    }
  ]

  ngOnInit(): void {
    console.log(1)
    this.changeMenu(this.menus1[0])
  }
  activeComponentChanged(activeComponent: any) {
    this.activeComponentService.setCurrentActiveComponent(activeComponent);
    if (!this.activeComponent) {
      setTimeout(() => {
        this.updateActiveComponent(activeComponent);
      }, 0);
    } else {
      this.updateActiveComponent(activeComponent);
    }
  }
  private updateActiveComponent(activeComponent: any) {
    this.showSearch = false;
    this.searchText = '';
    this.activeComponent = activeComponent;
    this.hideLoadingBar = activeComponent && activeComponent instanceof RouterTabsComponent;
    if (this.activeComponent && instanceOfSearchableComponent(this.activeComponent)) {
      this.searchEnabled = true;
      this.searchableComponent = this.activeComponent;
    } else {
      this.searchEnabled = false;
      this.searchableComponent = null;
    }
  }

  openState(menu){
    if(menu.title!="全局监控"){
      this.currentStyle = {
        "background":"#111111"
      }
    }else{
      this.currentStyle = {
        "background":'none'
      }
    }



    let url = `/bim/bombards/${menu.id}`
    this.router.navigateByUrl(url);


    // this.dashboardPage.openDashboardState(menu.state)


  }

  //切换菜单
  changeMenu(menu){
    let menuAll = [...this.menus1,...this.menus2]
    menuAll.forEach((item:Menu)=>{
      item.curImg = item.unimg
    })
    let curImg =  menu.curImg
    if(curImg == menu.unimg){
      menu.curImg = menu.checkimg
    } else{
      menu.curImg = menu.unimg
    }

    let url = `/bim/bombards/${menu.id}`
    this.router.navigateByUrl(url);


  }


}
