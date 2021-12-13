import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Usuarios } from 'src/app/_model/Usuarios';
import { UsuariosService } from 'src/app/_service/usuarios.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {


  username: string;
  password: string;

  constructor(private usuarioService: UsuariosService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialogRef: MatDialogRef<UsuariosComponent>) { }

  ngOnInit(): void {
  }

  CrearUsuario() {
    let usuario = new Usuarios();
    usuario.username = this.username.toLowerCase();
    usuario.password = this.password;
    this.usuarioService.registrar(usuario).subscribe(() => {
      this.snackBar.open('Usuario Registrado Correctamente', 'AVISO', {
        duration: environment.DURACION,
      });
    })
    this.cerrar();
  }


  cerrar() {
    setTimeout(() => {
      this.dialogRef.close();
    }, 800);
  }

}
