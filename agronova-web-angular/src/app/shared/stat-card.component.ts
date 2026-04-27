import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-card p-6 border-l-4 transition-all duration-300 group" 
         [ngClass]="getBorderColor()" [style.backgroundColor]="getBgColor()">
      <span class="text-[9px] font-black uppercase tracking-widest" [ngClass]="getTextColor()">{{ title }}</span>
      <div class="flex items-baseline space-x-2 mt-2">
        <span class="text-3xl font-black text-white tracking-tighter">{{ value }}</span>
        <span *ngIf="unit" class="text-[10px] font-bold text-slate-600 uppercase">{{ unit }}</span>
      </div>
      <div *ngIf="subtitle" class="mt-2 text-[8px] font-bold text-slate-500 uppercase tracking-wider">
        {{ subtitle }}
      </div>
    </div>
  `
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = 0;
  @Input() unit?: string;
  @Input() subtitle?: string;
  @Input() severity: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'slate' = 'slate';

  getBorderColor() {
    switch (this.severity) {
      case 'success': return 'border-l-[#a4c639]';
      case 'danger': return 'border-l-rose-500';
      case 'warning': return 'border-l-amber-500';
      case 'info': return 'border-l-blue-500';
      case 'primary': return 'border-l-[#a4c639]';
      default: return 'border-l-slate-700';
    }
  }

  getBgColor() {
    switch (this.severity) {
      case 'success': return 'rgba(164, 198, 57, 0.05)';
      case 'danger': return 'rgba(244, 63, 94, 0.05)';
      case 'warning': return 'rgba(245, 158, 11, 0.05)';
      case 'info': return 'rgba(59, 130, 246, 0.05)';
      default: return 'rgba(255, 255, 255, 0.02)';
    }
  }

  getTextColor() {
    switch (this.severity) {
      case 'success': return 'text-[#a4c639]';
      case 'danger': return 'text-rose-500';
      case 'warning': return 'text-amber-500';
      case 'info': return 'text-blue-500';
      default: return 'text-slate-500';
    }
  }
}
