import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card" [class]="'stat-card severity-' + severity">
      <div class="stat-glow"></div>
      <div class="stat-icon-wrap">
        <i [class]="icon || defaultIcon" class="stat-icon-i"></i>
      </div>
      <div class="stat-value">{{ value }}</div>
      <div class="stat-info">
        <span class="stat-title">{{ title }}</span>
        <span class="stat-unit" *ngIf="unit">{{ unit }}</span>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: rgba(16, 18, 24, 0.75);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 18px;
      padding: 20px;
      position: relative;
      overflow: hidden;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .stat-card:hover {
      border-color: rgba(108, 92, 231, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    .stat-glow {
      position: absolute;
      top: -15px; right: -15px;
      width: 80px; height: 80px;
      border-radius: 50%;
      filter: blur(30px);
      opacity: 0.2;
    }
    .stat-icon-wrap {
      width: 42px; height: 42px;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 14px; font-size: 18px;
    }
    .stat-value {
      font-size: 28px; font-weight: 800; color: #F0F1F5;
      letter-spacing: -0.5px; margin-bottom: 4px;
    }
    .stat-info { display: flex; align-items: center; gap: 6px; }
    .stat-title { font-size: 11px; font-weight: 500; color: #7C8190; }
    .stat-unit { font-size: 10px; font-weight: 700; color: #3D4050; text-transform: uppercase; }

    /* Severity variants */
    .severity-slate .stat-icon-wrap { background: rgba(108, 92, 231, 0.12); color: #6C5CE7; }
    .severity-slate .stat-glow { background: #6C5CE7; }

    .severity-info .stat-icon-wrap { background: rgba(0, 206, 201, 0.12); color: #00CEC9; }
    .severity-info .stat-glow { background: #00CEC9; }

    .severity-warning .stat-icon-wrap { background: rgba(253, 121, 168, 0.12); color: #FD79A8; }
    .severity-warning .stat-glow { background: #FD79A8; }

    .severity-success .stat-icon-wrap { background: rgba(0, 184, 148, 0.1); color: #00B894; }
    .severity-success .stat-glow { background: #00B894; }

    .severity-danger .stat-icon-wrap { background: rgba(214, 48, 49, 0.1); color: #D63031; }
    .severity-danger .stat-glow { background: #D63031; }

    :host ::ng-deep .p-card { background: transparent; border: none; }
  `]
})
export class StatCardComponent {
  @Input() title = '';
  @Input() value: string | number = '';
  @Input() unit = '';
  @Input() severity: 'slate' | 'info' | 'warning' | 'success' | 'danger' = 'slate';
  @Input() icon = '';

  get defaultIcon(): string {
    const icons: Record<string, string> = {
      slate: 'pi pi-box',
      info: 'pi pi-chart-line',
      warning: 'pi pi-percentage',
      success: 'pi pi-truck',
      danger: 'pi pi-times-circle'
    };
    return icons[this.severity] || 'pi pi-box';
  }
}
