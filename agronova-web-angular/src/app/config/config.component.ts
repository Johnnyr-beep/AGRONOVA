import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    TableModule, ButtonModule, TagModule, ToastModule, AvatarModule,
    DialogModule, ConfirmDialogModule, InputTextModule, InputNumberModule,
    DropdownModule, CheckboxModule, TooltipModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './config.component.html',
})
export class ConfigComponent implements OnInit {
  activeTab = 'usuarios';

  users: any[] = [];      usersLoading = false;
  vehiculos: any[] = [];  vehiculosLoading = false;  vehiculosDialog = false;  vehiculosEditId: string|null = null;  vehiculosForm!: FormGroup;
  conductores: any[] = []; conductoresLoading = false; conductoresDialog = false; conductoresEditId: string|null = null; conductoresForm!: FormGroup;
  tarifas: any[] = [];    tarifasLoading = false;    tarifasDialog = false;    tarifasEditId: string|null = null;    tarifasForm!: FormGroup;
  categorias: any[] = []; categoriasLoading = false; categoriasDialog = false; categoriasEditId: string|null = null; categoriasForm!: FormGroup;
  tiendas: any[] = [];    tiendasLoading = false;    tiendasDialog = false;    tiendasEditId: string|null = null;    tiendasForm!: FormGroup;
  sedes: any[] = [];      sedesLoading = false;      sedesDialog = false;      sedesEditId: string|null = null;      sedesForm!: FormGroup;
  listaPrecios: any[] = []; listaPreciosLoading = false; listaPreciosDialog = false; listaPreciosEditId: string|null = null; listaPreciosForm!: FormGroup;
  bodegas: any[] = [];    bodegasLoading = false;    bodegasDialog = false;    bodegasEditId: string|null = null;    bodegasForm!: FormGroup;
  conservacion: any[] = []; conservacionLoading = false; conservacionDialog = false; conservacionEditId: string|null = null; conservacionForm!: FormGroup;
  logistica: any[] = [];  logisticaLoading = false;  logisticaDialog = false;  logisticaEditId: string|null = null;  logisticaForm!: FormGroup;
  pedidos: any[] = [];    pedidosLoading = false;    pedidosDialog = false;    pedidosEditId: string|null = null;    pedidosForm!: FormGroup;

  opcionesActivo = [{label:'Activo',value:true},{label:'Inactivo',value:false}];
  opcionesTipoVehiculo = ['Refrigerado','Normal','Furgón','Moto'];
  opcionesTipoBodega = ['Canal','Producto','Insumo','Mixto'];
  opcionesEstadoBodega = ['Disponible','Ocupado','Mantenimiento'];
  opcionesEstadoConservacion = ['Normal','Alerta','Critico'];
  opcionesEstadoLogistica = ['Pendiente','En Ruta','Entregado','Cancelado'];
  opcionesEstadoPedido = ['Pendiente','En Proceso','Despachado','Cancelado'];
  opcionesEstadoPrecio = ['Activo','Inactivo','Vencido'];

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private msg: MessageService,
    private confirm: ConfirmationService
  ) {}

  ngOnInit() {
    this.buildForms();
    this.loadTab('usuarios');
  }

  buildForms() {
    this.vehiculosForm = this.fb.group({ Placa:['',Validators.required], Marca:[''], Modelo:[''], Tipo:[''], CapacidadKg:[null], Activo:[true] });
    this.conductoresForm = this.fb.group({ Nombre:['',Validators.required], Apellido:[''], Cedula:[''], Telefono:[''], LicenciaCategoria:[''], FechaVencimientoLicencia:[''], Activo:[true] });
    this.tarifasForm = this.fb.group({ Nombre:['',Validators.required], TipoServicio:[''], ValorBase:[null], ValorPorKm:[null], Activo:[true] });
    this.categoriasForm = this.fb.group({ Nombre:['',Validators.required], Codigo:[''], Descripcion:[''], Activo:[true] });
    this.tiendasForm = this.fb.group({ Nombre:['',Validators.required], Codigo:[''], Direccion:[''], Ciudad:[''], Telefono:[''], Responsable:[''], Activo:[true] });
    this.sedesForm = this.fb.group({ Nombre:['',Validators.required], Direccion:[''], Ciudad:[''], Telefono:[''], Contacto:[''], Activo:[true] });
    this.listaPreciosForm = this.fb.group({ ClienteNombre:[''], ProductoNombre:[''], PrecioKg:[null,Validators.required], FechaVigencia:[''], Estado:['Activo'] });
    this.bodegasForm = this.fb.group({ Nombre:['',Validators.required], Codigo:[''], Tipo:[''], Capacidad:[null], Estado:['Disponible'], Activo:[true] });
    this.conservacionForm = this.fb.group({ CavaNombre:[''], FechaRegistro:[''], Temperatura:[null], Humedad:[null], Estado:['Normal'], Observaciones:[''] });
    this.logisticaForm = this.fb.group({ NumeroLogistica:['',Validators.required], FechaLogistica:[''], VehiculoPlaca:[''], ConductorNombre:[''], Origen:[''], Destino:[''], Estado:['Pendiente'], Observaciones:[''] });
    this.pedidosForm = this.fb.group({ NumeroPedido:['',Validators.required], FechaPedido:[''], ClienteNombre:[''], PesoTotalKg:[null], MontoTotal:[null], Estado:['Pendiente'], Observaciones:[''] });
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.loadTab(tab);
  }

  loadTab(tab: string) {
    const ep: Record<string,string> = {
      usuarios:'users', vehiculos:'vehiculos', conductores:'conductores', tarifas:'tarifas',
      categorias:'categorias', tiendas:'tiendas', sedes:'sedes', 'lista-precios':'lista-precios',
      bodegas:'bodegas', conservacion:'conservacion', logistica:'logistica', pedidos:'pedidos',
    };
    const e = ep[tab];
    if (!e) return;
    if (tab === 'usuarios') { this.loadUsers(); return; }
    (this as any)[`${this.key(tab)}Loading`] = true;
    this.http.get<any[]>(`${environment.apiUrl}/${e}`).subscribe({
      next: d => { (this as any)[this.key(tab)] = d; (this as any)[`${this.key(tab)}Loading`] = false; },
      error: () => (this as any)[`${this.key(tab)}Loading`] = false,
    });
  }

  loadUsers() {
    this.usersLoading = true;
    this.http.get<any[]>(`${environment.apiUrl}/users`).subscribe({
      next: d => { this.users = d; this.usersLoading = false; },
      error: () => this.usersLoading = false,
    });
  }

  key(tab: string): string {
    return tab === 'lista-precios' ? 'listaPrecios' : tab;
  }

  ep(tab: string): string {
    return tab === 'lista-precios' ? 'lista-precios' : tab;
  }

  openNew(tab: string) {
    (this as any)[`${this.key(tab)}Form`]?.reset();
    (this as any)[`${this.key(tab)}EditId`] = null;
    (this as any)[`${this.key(tab)}Dialog`] = true;
  }

  openEdit(tab: string, item: any) {
    (this as any)[`${this.key(tab)}Form`]?.patchValue(item);
    (this as any)[`${this.key(tab)}EditId`] = item.Id;
    (this as any)[`${this.key(tab)}Dialog`] = true;
  }

  save(tab: string) {
    const form: FormGroup = (this as any)[`${this.key(tab)}Form`];
    if (form.invalid) { form.markAllAsTouched(); return; }
    const editId = (this as any)[`${this.key(tab)}EditId`];
    const endpoint = this.ep(tab);
    const req$ = editId
      ? this.http.put(`${environment.apiUrl}/${endpoint}/${editId}`, form.value)
      : this.http.post(`${environment.apiUrl}/${endpoint}`, form.value);
    req$.subscribe({
      next: () => {
        this.msg.add({ severity:'success', summary:'Guardado', detail:'Registro guardado correctamente' });
        (this as any)[`${this.key(tab)}Dialog`] = false;
        this.loadTab(tab);
      },
      error: (e: any) => this.msg.add({ severity:'error', summary:'Error', detail: e?.error?.message || 'No se pudo guardar' }),
    });
  }

  confirmDelete(tab: string, item: any) {
    this.confirm.confirm({
      message: '¿Eliminar este registro?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.delete(`${environment.apiUrl}/${this.ep(tab)}/${item.Id}`).subscribe({
          next: () => { this.msg.add({ severity:'success', summary:'Eliminado', detail:'Registro eliminado' }); this.loadTab(tab); },
          error: () => this.msg.add({ severity:'error', summary:'Error', detail:'No se pudo eliminar' }),
        });
      },
    });
  }

  fi(form: FormGroup, field: string): boolean {
    const c = form.get(field);
    return !!(c?.invalid && c?.touched);
  }

  getSeverityActivo(val: boolean): string {
    return val ? 'success' : 'danger';
  }
}
