import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { Tareas } from 'src/app/_model/Tareas';
import { TareasService } from 'src/app/_service/tareas.service';
import { UtilService } from 'src/app/_service/util.service';

@Component({
  selector: 'app-eliminar-dialog',
  templateUrl: './eliminar-dialog.component.html',
  styleUrls: ['./eliminar-dialog.component.css']
})
export class EliminarDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<EliminarDialogComponent>,
    private tareaService: TareasService,
    @Inject(MAT_DIALOG_DATA) private data: Tareas,
    private utilService: UtilService) { }

  tarea: Tareas;

  ngOnInit(): void {
    this.tarea = { ...this.data }
  }
  Eliminar() {
    this.tareaService.eliminar(this.tarea.idTarea)
      .pipe(
        switchMap(() => {
          return this.tareaService.listarPorUsuario(this.utilService.retornarUsuario())
        })
      ).subscribe((data) => {
        this.tareaService.setMensaje(`Registro eliminado: ${this.tarea.idTarea}`)
        this.tareaService.setTareaCambio(data);
      })
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }


}
