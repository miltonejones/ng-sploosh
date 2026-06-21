import {
  Directive,
  Input,
  OnDestroy,
  TemplateRef,
  ElementRef,
  HostListener,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { TooltipComponent } from '../components/tooltip.component/tooltip.component';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  /** Pass either a plain string or an ng-template for rich HTML content */
  @Input('appTooltip') content: string | TemplateRef<unknown> = '';
  @Input() tooltipPosition: TooltipPosition = 'top';
  @Input() tooltipDelay = 120; // ms before showing
  @Input() tooltipMaxWidth = 260; // px

  private componentRef: ComponentRef<TooltipComponent> | null = null;
  private showTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private el: ElementRef<HTMLElement>,
    private vcr: ViewContainerRef,
  ) {}

  @HostListener('mouseenter')
  @HostListener('focusin')
  onShow(): void {
    if (this.componentRef) return;
    this.showTimer = setTimeout(() => this.create(), this.tooltipDelay);
  }

  @HostListener('mouseleave')
  @HostListener('focusout')
  onHide(): void {
    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
    this.destroy();
  }

  private create(): void {
    this.componentRef = this.vcr.createComponent(TooltipComponent);

    const instance = this.componentRef.instance;
    instance.content = this.content;
    instance.position = this.tooltipPosition;
    instance.maxWidth = this.tooltipMaxWidth;

    // Append to body so it renders above all stacking contexts
    document.body.appendChild(this.componentRef.location.nativeElement);

    this.componentRef.changeDetectorRef.detectChanges();
    this.position();
  }

  private position(): void {
    if (!this.componentRef) return;

    const tooltipEl: HTMLElement =
      this.componentRef.location.nativeElement.querySelector('.tooltip-box') ??
      this.componentRef.location.nativeElement;

    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const ttRect = tooltipEl.getBoundingClientRect();
    const gap = 8;

    let top = 0;
    let left = 0;

    switch (this.tooltipPosition) {
      case 'top':
        top = hostRect.top - ttRect.height - gap + window.scrollY;
        left = hostRect.left + hostRect.width / 2 - ttRect.width / 2 + window.scrollX;
        break;
      case 'bottom':
        top = hostRect.bottom + gap + window.scrollY;
        left = hostRect.left + hostRect.width / 2 - ttRect.width / 2 + window.scrollX;
        break;
      case 'left':
        top = hostRect.top + hostRect.height / 2 - ttRect.height / 2 + window.scrollY;
        left = hostRect.left - ttRect.width - gap + window.scrollX;
        break;
      case 'right':
        top = hostRect.top + hostRect.height / 2 - ttRect.height / 2 + window.scrollY;
        left = hostRect.right + gap + window.scrollX;
        break;
    }

    // Clamp to viewport edges
    const vw = document.documentElement.clientWidth;
    left = Math.max(8, Math.min(left, vw - ttRect.width - 8));

    this.componentRef.instance.top = top;
    this.componentRef.instance.left = left;
    this.componentRef.changeDetectorRef.detectChanges();
  }

  private destroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  ngOnDestroy(): void {
    if (this.showTimer) clearTimeout(this.showTimer);
    this.destroy();
  }
}
