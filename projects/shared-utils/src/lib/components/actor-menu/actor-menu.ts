import { AfterViewInit, Component, input, OnChanges, output, SimpleChanges } from '@angular/core';
import { ModelItem } from '../model-item/model-item';
import { ModelInfo } from '../../models';
// import { TooltipDirective } from '../../directives/html-tooltip';

@Component({
  selector: 'lib-actor-menu',
  imports: [ModelItem],
  templateUrl: './actor-menu.html',
  styleUrl: './actor-menu.css',
})
export class ActorMenu implements AfterViewInit, OnChanges {
  models = input<ModelInfo[]>();
  getModelId = output<number>();
  editClick = output();
  isDropdownOpen = false;

  toggleDropdown(event: Event) {
    event.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['models']) {
      console.log('ActorMenu models updated:', this.models());
      // Re-initialize tooltips when models change
      setTimeout(() => this.initTooltips(), 0);
    }
  }

  ngAfterViewInit() {
    this.initTooltips();
  }

  private initTooltips() {
    setTimeout(() => {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach((el) => {
        const tooltip = new (window as any).bootstrap.Tooltip(el, {
          html: true,
          template:
            '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner" style="max-width: 100px;border:solid 4px red;"></div></div>',
        });
      });
    });
  }

  handleEdit() {
    this.editClick.emit();
  }

  actorImage(star: ModelInfo) {
    return `<img class='star-image' width='140' style='width:100px;aspect-ratio:9/16' src='${star.image}' alt='${star.Name}'/>`;
  }

  selectModel(star: ModelInfo) {
    this.getModelId.emit(star.ID);
  }
}
