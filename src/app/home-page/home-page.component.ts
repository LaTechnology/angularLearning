import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  tabs = [
    { label: 'Inventory', link: '/inventory' },
    { label: 'Order', link: '/order' }
  ];
  linkDropdownList =[
    {name: 'Customer', link: '/customer/list'},
    {name: 'Product', link: '/product'},
    {name: 'Address', link: '/address/list'},
    {name:'Location',link:'/location/list'},
    {name: 'Client', link: '/client'},
    {name: 'Roles', link: '/listrole'},
  ]
  activeTabIndex = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const index = this.tabs.findIndex(tab => event.urlAfterRedirects.includes(tab.link));
        if (index !== -1) {
          this.activeTabIndex = index;
        }
      }
    });
  }

  onTabChange(index: number) {
    this.activeTabIndex = index;
    this.router.navigate([this.tabs[index].link]);
  }

  onDropdownSelect(link: string, label: string) {
    const existingTabIndex = this.tabs.findIndex(tab => tab.link === link);
    if (existingTabIndex === -1) {
      this.tabs.push({ label, link });
      this.activeTabIndex = this.tabs.length - 1;
    } else {
      this.activeTabIndex = existingTabIndex;
    }
    this.router.navigate([link]);
  }
}
