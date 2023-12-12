///
/// Copyright © 2016-2021 The Thingsboard Authors
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

import { NgModule } from '@angular/core';
import {MODULES_MAP} from '@shared/models/constants';
import {modulesMap} from '@modules/common/modules-map';
import {CarbonModule} from '@modules/bim/pages/carbon/carbon.module';
import {IndexModule} from '@modules/bim/pages/index/index.module';
import {CommonModule} from '@angular/common';
import {SharedModule} from '@shared/shared.module';
import {BimRoutingModule} from '@modules/bim/bim-routing.module';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {IndexRoutingModule} from '@modules/bim/pages/index/index-routing.module';

@NgModule({
  exports: [
    CarbonModule,
    IndexModule
  ],
  imports: [
    CommonModule,
    SharedModule,
    IndexRoutingModule,
    NzLayoutModule
  ],
  providers: [
    {
      provide: MODULES_MAP,
      useValue: modulesMap
    }
  ]
})
export class BimPagesModule { }
