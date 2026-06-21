import { Routes } from '@angular/router';
import { MfeAnchorComponent } from './components/mfe-anchor/mfe-anchor';

export const routes: Routes = [
  {
    path: 'videos/:pageNum',
    component: MfeAnchorComponent,
    data: {
      remoteName: 'app-workspace',
      exposedModule: './Component',
    },
  },
  {
    path: 'home',
    component: MfeAnchorComponent,
    data: {
      remoteName: 'home-app',
      exposedModule: './Component',
    },
  },
  {
    path: 'favorites/:pageNum',
    component: MfeAnchorComponent,
    data: {
      remoteName: 'app-workspace',
      exposedModule: './Component',
    },
  },
  {
    path: 'find/:searchParam/:pageNum',
    component: MfeAnchorComponent,
    data: {
      remoteName: 'app-workspace',
      exposedModule: './Component',
    },
  },
  {
    path: 'domain/:domainParam/:pageNum',
    component: MfeAnchorComponent,
    data: {
      remoteName: 'app-workspace',
      exposedModule: './Component',
    },
  },
  {
    path: 'domain/:domainParam/:searchParam/:pageNum',
    component: MfeAnchorComponent,
    data: {
      remoteName: 'app-workspace',
      exposedModule: './Component',
    },
  },
  {
    path: 'models',
    component: MfeAnchorComponent,
    data: {
      remoteName: 'app-models',
      exposedModule: './Component',
    },
  },
  {
    path: 'models/:pageNum',
    component: MfeAnchorComponent,
    data: {
      remoteName: 'app-models',
      exposedModule: './Component',
    },
  },
  {
    path: 'models/:searchParam/:pageNum',
    component: MfeAnchorComponent,
    data: {
      remoteName: 'app-models',
      exposedModule: './Component',
    },
  },
  {
    path: 'recent/:pageNum',
    component: MfeAnchorComponent,
    data: {
      remoteName: 'app-workspace',
      exposedModule: './Component',
    },
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
