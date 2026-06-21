import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface NavButton {
  label: string;
  address: string;
  key: string[];
  active: boolean;
}

@Component({
  selector: 'app-nav-buttons',
  imports: [],
  templateUrl: './nav-buttons.html',
  styleUrl: './nav-buttons.css',
})
export class NavButtons implements OnInit {
  public buttons: NavButton[] = [
    {
      label: 'Home',
      address: '/home',
      key: ['home'],
      active: false,
    },
    {
      label: 'Videos',
      address: '/videos/1',
      key: ['find', 'videos', 'domain'],
      active: false,
    },
    {
      label: 'Favorites',
      address: '/favorites/1',
      key: ['favorites'],
      active: false,
    },
    {
      label: 'Recently Watched',
      address: '/recent/1',
      key: ['recent'],
      active: false,
    },
    {
      label: 'Models',
      address: '/models/1',
      key: ['models'],
      active: false,
    },
  ];

  // private router = inject(Router);
  ngOnInit(): void {
    // alert('url: ' + this.router.url);
    this.buttons.forEach((btn) => {
      btn.active = btn.key.some((key) => window.location.href.indexOf(key) > 0);
    });
    // alert(JSON.stringify(this.buttons, null, 2));
  }
}
