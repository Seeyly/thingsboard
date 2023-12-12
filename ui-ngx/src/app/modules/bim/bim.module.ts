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
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import {BimRoutingModule} from '@modules/bim/bim-routing.module';
import { BimComponent } from './bim.component';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {IndexModule} from '@modules/bim/pages/index/index.module';

@NgModule({
  declarations: [
    BimComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BimRoutingModule,
    NzLayoutModule
  ]
})
export class BimModule { }
