import { CdkDragDrop, CdkDragEnter, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { Tareas } from 'src/app/_model/Tareas';
import { Usuarios } from 'src/app/_model/Usuarios';
import { TareasService } from 'src/app/_service/tareas.service';
import { UtilService } from 'src/app/_service/util.service';
import { environment } from 'src/environments/environment';
import { EliminarDialogComponent } from './eliminar-dialog/eliminar-dialog.component';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit {

  Pendiente: Tareas[];
  enProceso: Tareas[];
  finalizado: Tareas[];
  usuario: string;

  form: FormGroup;

  constructor(private tareaService: TareasService,
    private snackBar: MatSnackBar, private utilService: UtilService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.usuario = this.utilService.retornarUsuario();
    this.inicializarVariables();
    this.inicializarListas();
    this.tareaService.getTareaCambio().subscribe((data) => {
      this.inicializarListas(data);
    });
    this.aviso();

  }

  drop(event: CdkDragDrop<Tareas[]>, listActual?: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.actualizarEstado(event.item.data, listActual.toUpperCase());
    }
  }
  inicializarVariables() {
    this.form = new FormGroup({
      Titulo: new FormControl(''),
      descripcion: new FormControl('')
    });
  }

  registrarTarea() {
    let tarea = new Tareas();
    let usuario = new Usuarios();
    usuario.username = this.utilService.retornarUsuario();
    tarea.nombreTarea = this.form.value['Titulo'],
      tarea.resumenTarea = this.form.value['descripcion']
    tarea.usuarios = usuario;
    tarea.estadoTarea = 1 // siempre se insertara con estado 1 -> Pendiente
    console.log(tarea);
    this.tareaService.registrar(tarea).pipe(
      switchMap(() => {
        return this.tareaService.listarPorUsuario(this.usuario);
      })
    ).subscribe((data) => {
      this.tareaService.setTareaCambio(data);
      this.tareaService.setMensaje(`Registro exitoso`)
    });
    this.inicializarVariables();
  }

  inicializarListas(data?: Tareas[]) {
    this.tareaService.listarPorUsuario(this.usuario).subscribe(data => {
      this.Pendiente = data.filter((item) => item.estadoTarea == environment.PENDIENTE)
      this.enProceso = data.filter((item) => item.estadoTarea == environment.ENPROCESO)
      this.finalizado = data.filter((item) => item.estadoTarea == environment.FINALIZADO)
    });
  }

  actualizarEstado(tarea: Tareas, list: string) {
    let estado = 0;
    console.log(list);
    switch (list) {
      case 'PENDIENTE':
        estado = environment.PENDIENTE
        break;
      case 'ENPROCESO':
        estado = environment.ENPROCESO
        break;
      case 'FINALIZADO':
        estado = environment.FINALIZADO
        break;
    }
    tarea.estadoTarea = estado;
    this.tareaService.modificar(tarea).subscribe(data => {
      // mensaje de confirmacion
    });
  }
  eliminar(item: Tareas) {
    const dialogRef = this.dialog.open(EliminarDialogComponent, {
      data: item
    });
  }


  aviso() {
    this.tareaService.getMensaje().subscribe((data) => {
      this.snackBar.open(data, 'AVISO', {
        duration: environment.DURACION,
      });
    });
  }

}
