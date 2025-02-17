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
  linkDropdownList = [
    { name: 'Customer', link: '/customer/list' },
    { name: 'Product', link: '/product' },
    { name: 'Address', link: '/address/list' },
    { name: 'Location', link: '/location/list' },
    { name: 'Client', link: '/client' },
    { name: 'Roles', link: '/listrole' },
  ];

  activeTabIndex: number = -1;
  activeDropdownItem: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateActiveTab(event.urlAfterRedirects);
      }
    });
    this.updateActiveTab(this.router.url);
  }

  private updateActiveTab(currentUrl: string) {
    const tabIndex = this.tabs.findIndex(tab => currentUrl.startsWith(tab.link));
    const dropdownItem = this.linkDropdownList.find(item => currentUrl.startsWith(item.link));
    if (tabIndex !== -1) {
      this.activeTabIndex = tabIndex;
      this.activeDropdownItem = null;
    } else if (dropdownItem) {
      if (this.activeTabIndex !== -1) {
        return;
      }
      this.activeDropdownItem = dropdownItem.link;
      this.activeTabIndex = -1;
    }
  }
  
  onTabChange(index: number) {
    this.activeTabIndex = index;
    this.activeDropdownItem = null;
    this.router.navigate([this.tabs[index].link]);
  }

  onDropdownSelect(link: string) {
    this.activeDropdownItem = link;
    this.activeTabIndex = -1;
    this.router.navigate([link]);
  }
}
