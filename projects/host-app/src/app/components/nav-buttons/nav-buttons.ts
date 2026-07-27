import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

export interface NavButton {
  label: string;
  path: string;
  commands: string[];
  active: boolean;
}

@Component({
  selector: 'app-nav-buttons',
  imports: [],
  templateUrl: './nav-buttons.html',
  styleUrl: './nav-buttons.css',
})
export class NavButtons implements OnInit, OnDestroy {
  public buttons: NavButton[] = [
    { label: 'Home',         path: '/home',     commands: ['/home'],        active: false },
    { label: 'Videos',       path: '/videos',   commands: ['/videos', '1'], active: false },
    { label: 'Favorites',    path: '/favorites', commands: ['/favorites', '1'], active: false },
    { label: 'Recently Watched', path: '/recent', commands: ['/recent', '1'],  active: false },
    { label: 'Models',       path: '/models',   commands: ['/models', '1'],  active: false },
  ];

  private router = inject(Router);
  private sub?: Subscription;

  navigate(commands: string[]) {
    this.router.navigate(commands);
  }

  ngOnInit(): void {
    this.sub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.updateActive());
    this.updateActive();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private updateActive(): void {
    const url = this.router.url.split('?')[0];
    this.buttons.forEach((btn) => {
      btn.active = url.startsWith(btn.path);
    });
  }
}
