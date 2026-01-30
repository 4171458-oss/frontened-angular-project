import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TopNav } from '../top-nav/top-nav';
import { SideNav } from '../side-nav/side-nav';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb';
import { AuthService } from '../../features/auth/services/auth';

@Component({
  selector: 'app-app-shell',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, TopNav, SideNav, BreadcrumbComponent],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',

})
export class AppShell implements OnInit {

  constructor(private readonly authService: AuthService) { }

  ngOnInit() {
    this.authService.getUser().subscribe();
  }
}
