import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/_service/login.service';
import { UsuariosService } from 'src/app/_service/usuarios.service';
import { environment } from 'src/environments/environment';
import { UsuariosComponent } from '../usuarios/usuarios.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: string;
  clave: string;
  mensaje: string;
  error: string;
  dialogRef: any;

  constructor(private loginService: LoginService, private router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  iniciarSesion() {
    this.loginService.login(this.usuario, this.clave).subscribe(data => {
      sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
      this.router.navigate(['/tareas']);
    });
  };
  registar() {
    this.dialogRef = this.dialog.open(UsuariosComponent)
  }

}
