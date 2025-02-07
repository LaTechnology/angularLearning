import { Directive, Input, ElementRef, HostListener, OnDestroy, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[tooltip]'
})
export class TooltipDirective implements OnDestroy {
  @Input('tooltip') tooltipTitle!: string;
  @Input() placement!: string;
  @Input() delay!: string;
  @Input() fontSize!: any;
  @Input() row: boolean = false;
  @Input() maxWidth: any = 'auto';
  @Input() disable: boolean = false;
  @Input() color: string = 'error';

  tooltip: any = null;
  offset = 10;

  constructor(private el: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltip) {
      this.show();
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltip) {
      this.hide();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tooltipTitle'] && this.tooltip) {
      // If the tooltip is already displayed, update its content
      this.tooltip.textContent = this.tooltipTitle;
    }
  }


  show() {
    this.create();
    this.setPosition();
    this.tooltip?.classList.add('ng-tooltip-show');
  }

  hide() {
    if (this.tooltip) {
      this.tooltip?.classList.remove('ng-tooltip-show');
      this.tooltip?.parentNode?.removeChild(this.tooltip);
      this.tooltip = null;
    }
  }

  create() {
    this.tooltip = document.createElement('div');
    const spanElement = document.createElement('span');
    this.tooltip.textContent = this.tooltipTitle;
    spanElement.classList.add('tooltip-arrow');

    this.tooltip.appendChild(spanElement);

    document.body.appendChild(this.tooltip);

    this.tooltip.classList.add('ng-tooltip');
    this.tooltip.classList.add(`ng-tooltip-${this.placement}`);
    spanElement.classList.add(`tooltip-arrow-${this.placement}`);
    this.tooltip.style.fontSize = `${this.fontSize}px`;
    this.tooltip.style.maxWidth = this.maxWidth == 'auto' ? `${this.maxWidth}` : `${this.maxWidth}px`;
    this.tooltip.style.width = this.maxWidth == 'auto' ? `${this.maxWidth}` : `${this.maxWidth}px`
    this.tooltip.style.wordBreak =`break-word`
    this.tooltip.style.whiteSpace= `wrap`
    if (this.disable) {
      this.tooltip.style.display = `none`;
    } else if (!this.disable) {
      this.tooltip.style.display = `block`;
    }
    if (this.row) {
      this.tooltip.style.whiteSpace = `nowrap`;
    }

    this.tooltipColor();

    this.tooltip.style.webkitTransition = `opacity ${this.delay}ms`;
    this.tooltip.style.mozTransition = `opacity ${this.delay}ms`;
    this.tooltip.style.oTransition = `opacity ${this.delay}ms`;
    this.tooltip.style.transition = `opacity ${this.delay}ms`;
  }


  tooltipColor() {
    switch (this.color) {
      case 'success':
        this.tooltipArrowColor('#e8f9f8', '#00b2a9');
        break;
      case 'light':
        this.tooltipArrowColor('#fff', ' #6c757d');
        break;
      case 'info':
        this.tooltipArrowColor('#f1f6fd', '#1a2d48');
        break;
      case 'warning':
        this.tooltipArrowColor('#fff8ea', '#c5a35b');
        break;
      case 'error':
        this.tooltipArrowColor('#fff1f0', '#f45600');
        break;
      case 'dark':
        this.tooltipArrowColor('#192D48', '#fff');
        break;
    }

  }



  tooltipArrowColor(background: string, color: string) {
    this.tooltip.style.setProperty('background-color', `${background}`);
    this.tooltip.style.setProperty('color', `${color}`);
    if (this.color !== 'dark') {
      this.tooltip.style.setProperty('border', `0.5px solid ${color}`);
      switch (this.placement) {
        case 'left':
          this.createStyleRule(`ng-tooltip-${this.placement}:after`, 'border-color', `transparent transparent transparent ${color}`);
          break;
        case 'right':
          this.createStyleRule(`ng-tooltip-${this.placement}:after`, 'border-color', `transparent ${color} transparent transparent`);
          break;
        case 'top':
          this.createStyleRule(`ng-tooltip-${this.placement}:after`, 'border-color', `${color} transparent transparent transparent`);
          break;
        case 'bottom':
          this.createStyleRule(`ng-tooltip-${this.placement}:after`, 'border-color', `transparent transparent ${color} transparent`);
          break;
      }
    }




    switch (this.placement) {
      case 'left':
        this.createStyleRule(`ng-tooltip-${this.placement}:after`, 'border-color', `transparent transparent transparent ${color}`,);
        break;
      case 'right':
        this.createStyleRule(`ng-tooltip-${this.placement}:after`, 'border-color', `transparent ${color} transparent transparent`);
        break;
      case 'top':
        this.createStyleRule(`ng-tooltip-${this.placement}:after`, 'border-color', `${color} transparent transparent transparent`);
        break;
      case 'bottom':
        this.createStyleRule(`ng-tooltip-${this.placement}:after`, 'border-color', `transparent transparent ${color} transparent`);
        break;
    }


  }

  createStyleRule(className: string, property: string, value: string) {
    const styleElement = document.createElement('style');
    document.head.appendChild(styleElement);
    const styleSheet = styleElement.sheet as CSSStyleSheet;
    styleSheet.insertRule(`.${className} { ${property}: ${value} }`, 0);
  }

  setPosition() {
    const hostPos = this.el.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltip?.getBoundingClientRect();

    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    let top, left;

    if (this.placement === 'top') {
      top = hostPos.top - tooltipPos?.height - this.offset;
      left = 4 + hostPos.left + (hostPos.width - tooltipPos?.width) / 2;
    }

    if (this.placement === 'bottom') {
      top = hostPos.bottom + this.offset;
      left = 4 + hostPos.left + (hostPos.width - tooltipPos?.width) / 2;
    }

    if (this.placement === 'left') {
      top = hostPos.top + (hostPos.height - tooltipPos?.height) / 2;
      left = 4 + hostPos.left - tooltipPos?.width - this.offset;
    }

    if (this.placement === 'right') {
      top = hostPos.top + (hostPos.height - tooltipPos?.height) / 2;
      left = 4 + hostPos.right + this.offset;
    }

    this.tooltip.style.top = `${top + scrollPos}px`;
    this.tooltip.style.left = `${left}px`;

  }

  ngOnDestroy(): void {
    this.hide()
  }
}
