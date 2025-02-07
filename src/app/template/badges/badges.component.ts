import { Component, Input } from '@angular/core';

@Component({
  selector: 'wz-badge',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss'],
})
export class BadgesComponent {
  @Input() count: number = 20;
  @Input() badgeName: any = '';
  @Input() badgeType: string = '';
  @Input() iconColor: string = 'rgba(2, 122, 72, 1)';
  @Input() color: string = 'black';
  @Input() background: string = '#e0e0e0';
  @Input() customClass: string = '';
  @Input() ccIcon: string = '';
  @Input() ccText: string = '';
  @Input() badges: string[] = [];
  @Input() status: string[] = [];

  getBadgeColor(badge: string): string {
    if (badge === 'Leave') {
      return 'rgba(244, 233, 233, 1)';
    } else if (badge === 'WFH') {
      return 'rgba(245, 240, 226, 1)';
    } else if (badge === 'Not Yet') {
      return 'rgba(239, 235, 245, 1)';
    } else {
      return 'rgba(236, 253, 243, 1)';
    }
  }

  getTextColor(badge: string): string {
    if (badge === 'Leave') {
      return 'rgba(231, 65, 54, 1)';
    } else if (badge === 'WFH') {
      return 'rgba(237, 138, 9, 1)';
    } else if (badge === 'Not Yet') {
      return 'rgba(152, 114, 228, 1)';
    } else {
      return 'rgba(2, 122, 72, 1)';
    }
  }
  getSingleBadgeColor(color: any, place?: string) {
    if (color === 'purple') {
      if (place === 'background') {
        return 'rgba(239, 235, 245, 1)';
      } else {
        return 'rgba(152, 114, 228, 1)';
      }
    } else if (color === 'red') {
      if (place === 'background') {
        return 'rgba(244, 233, 233, 1)';
      } else {
        return 'rgba(231, 65, 54, 1)';
      }
    } else if (color === 'yellow') {
      if (place === 'background') {
        return 'rgba(245, 240, 226, 1)';
      } else {
        return 'rgba(237, 138, 9, 1)';
      }
    } else {
      if (place === 'background') {
        return 'rgba(236, 253, 243, 1)';
      } else {
        return 'rgba(2, 122, 72, 1)';
      }
    }
  }
}
