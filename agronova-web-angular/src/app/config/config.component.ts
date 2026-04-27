import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';

import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, ToastModule, AvatarModule],
  providers: [MessageService],
  templateUrl: './config.component.html',
})
export class ConfigComponent implements OnInit {
  users: any[] = [];
  loading = true;

  constructor(private http: HttpClient, private messageService: MessageService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:8000/api/users').subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios'});
        this.loading = false;
      }
    });
  }
}
