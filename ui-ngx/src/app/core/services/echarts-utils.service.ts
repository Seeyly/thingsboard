import {Injectable} from '@angular/core';
import * as echarts from 'echarts';
@Injectable({
  providedIn: 'root'
})
export class EchartsService{
  echart:any
  constructor() {
    this.echart = echarts
  }
  getEcharts(){
    console.log(this.echart)
    return this.echart
  }
}
