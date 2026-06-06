import { Component, ComponentRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { ActivatedRoute } from '@angular/router';
import { WindowLauncherService } from 'shared-utils';
@Component({
  selector: 'app-mfe-anchor',
  standalone: true,
  template: `<div #domTarget class="mfe-container-wrapper"></div>`,
})
export class MfeAnchorComponent implements OnInit {
  // Pass metadata keys down via HTML inputs
  @Input() remoteName?: string;
  @Input() exposedModule?: string;
  @Input() windowLauncher?: WindowLauncherService;

  // Grab the precise reference element in the HTML DOM view
  @ViewChild('domTarget', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;
  workspaceComponentRef: ComponentRef<any> | null = null;

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    try {
      this.container.clear();
      const remoteName = this.route.snapshot.data['remoteName'] ?? this.remoteName;
      const exposedModule = this.route.snapshot.data['exposedModule'] ?? this.exposedModule;

      if (!remoteName || !exposedModule) {
        console.error('Missing remoteName or exposedModule');
        return;
      }
      // Native federation loads the bundle via runtime browser import maps
      const module = await loadRemoteModule({
        remoteName: remoteName,
        exposedModule: exposedModule,
      });

      // Extract the default exported key or standard component name
      const componentKey = Object.keys(module)[0];
      const componentRef = module[componentKey];

      // Instantiate and render the remote directly inside our target <div> element
      this.workspaceComponentRef = this.container.createComponent(componentRef);
      if (!this.windowLauncher) return;

      this.workspaceComponentRef.instance.windowLauncher = this.windowLauncher;
    } catch (error) {
      console.error(`Failed to dynamically render remote: ${this.remoteName}`, error);
    }
  }
}
