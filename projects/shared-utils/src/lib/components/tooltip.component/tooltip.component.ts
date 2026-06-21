import { Component, Input, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Component({
  selector: 'lib-tooltip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="tooltip-box"
      role="tooltip"
      [class]="'tooltip-box tooltip--' + position"
      [style.top.px]="top"
      [style.left.px]="left"
      [style.max-width.px]="maxWidth"
    >
      [{{ top }}]x[{{ left }}]
      <!-- String content -->
      <ng-container *ngIf="isString(content)">
        <span [innerHTML]="content"></span>
      </ng-container>

      <!-- Template / rich HTML content -->
      <ng-container *ngIf="!isString(content)">
        <ng-container *ngTemplateOutlet="asTemplate(content)"></ng-container>
      </ng-container>

      <!-- Arrow -->
      <span class="tooltip-arrow"></span>
    </div>
  `,
  styles: [
    `
      :host {
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 9999;
      }

      .tooltip-box {
        position: absolute;
        background: #1a1a2e;
        color: #f0f0f5;
        border-radius: 8px;
        padding: 10px 13px;
        font-size: 13px;
        line-height: 1.5;
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.22);
        animation: tt-in 0.14s ease;
        border: 1px solid rgba(255, 255, 255, 0.08);
        /* allow rich content to size naturally */
        width: max-content;
      }

      @keyframes tt-in {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      /* ── Arrow ── */
      .tooltip-arrow {
        position: absolute;
        width: 0;
        height: 0;
      }

      .tooltip--top .tooltip-arrow {
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid #1a1a2e;
      }

      .tooltip--bottom .tooltip-arrow {
        top: -6px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid #1a1a2e;
      }

      .tooltip--left .tooltip-arrow {
        right: -6px;
        top: 50%;
        transform: translateY(-50%);
        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;
        border-left: 6px solid #1a1a2e;
      }

      .tooltip--right .tooltip-arrow {
        left: -6px;
        top: 50%;
        transform: translateY(-50%);
        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;
        border-right: 6px solid #1a1a2e;
      }
    `,
  ],
})
export class TooltipComponent {
  @Input() content: string | TemplateRef<unknown> = '';
  @Input() position: TooltipPosition = 'top';
  @Input() maxWidth = 260;
  @Input() top = 0;
  @Input() left = 0;

  isString(v: unknown): v is string {
    return typeof v === 'string';
  }

  asTemplate(v: unknown): TemplateRef<unknown> {
    return v as TemplateRef<unknown>;
  }
}
