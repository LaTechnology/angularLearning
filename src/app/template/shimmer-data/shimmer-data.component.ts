import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, input, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'lt-shimmer-data',
  templateUrl: './shimmer-data.component.html',
  styleUrls: ['./shimmer-data.component.scss']
})
export class ShimmerDataComponent implements OnInit {

  count = input(5)
  @Input() data!: any;
  @Input() isDataLoading: boolean = false;
  @Input() customClass!: any;
  @Input() shimmerClass!: any;
  @Input() grid: any; // for set rows and columns for the table ex: [3, 4]
  @Input() shimmerType: any = 'inline';
  @Input() blockShimmersCount: any = 20;
  @ViewChild('shimmer') shimmer!: ElementRef<HTMLElement>;
  @ViewChild('blockShimmer', {static: false}) blockShimmer!: ElementRef<HTMLElement>;
  shimmerData: any[] = [];
  @Input() shimmerTableData: any = [1,2,3,4,5,6,7,8,9,10,11,12,13]

  shimmerHeaders = ['1', '2', '3', '4', '5', '6', '7'];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // this.getBlockShimmers();
  }
  
  constructor(
    private renderer: Renderer2
  ) {}
  
  ngOnInit(): void {
    this.getBlockShimmers();
    this.getTableData();
  }

  getTableData() {
    if(this.grid?.length > 0) {
      this.shimmerTableData = []
      this.shimmerHeaders = []
      for (var i = 0; i < this.grid[0]; i++) {
        this.shimmerTableData?.push({i:i+1})
      }
      for (var i = 0; i < this.grid[1]; i++) {
        this.shimmerHeaders?.push(`${i}`)
      }
    }
  }

  getBlockShimmers() {
    if(this.blockShimmersCount) {
      for (var i = 0; i < this.blockShimmersCount; i++) {
        this.shimmerData.push(i);
      }
    }
  }
}
