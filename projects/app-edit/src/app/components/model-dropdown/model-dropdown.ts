import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  ActorResponse,
  PageLink,
  PaginationService,
  SharedStateService,
  VideoApiService,
  Paginator,
  WindowLauncherService,
  WindowRegionConfigService,
  ModelAvatar,
  ActorInfo,
  ImageFix,
  TrackInfo,
  ModalEventService,
  ModelCard,
  ModalResponse,
  DashModel,
  ModelInfo,
  ModelItem,
} from 'shared-utils';

export interface DropdownOption {
  label: string;
  key: string;
  data?: string[];
}

@Component({
  selector: 'app-model-dropdown',
  imports: [ModelItem, CommonModule, FormsModule],
  templateUrl: './model-dropdown.html',
  styleUrl: './model-dropdown.css',
})
export class ModelDropdown {
  aliases = signal<ModelInfo[]>([]);
  modelAdded = output<ModelInfo>();
  paramParam = '';
  options: DropdownOption[] = [];
  optionClick = output<DropdownOption>();

  constructor(public videoSvc: VideoApiService) {}

  clearOptions() {
    this.paramParam = '';
    this.options = [];
    this.aliases.set([]);
  }

  handleOption(option: DropdownOption) {
    this.optionClick.emit(option);
    this.clearOptions();
  }

  addModel(model: ModelInfo) {
    this.modelAdded.emit(model);
    this.clearOptions();
  }

  clearParam() {
    this.paramParam = '';
  }

  modelSearch() {
    if (this.paramParam.length < 3) return;

    const names = this.getFullNames(this.paramParam);
    this.options = [];
    if (names.length > 1) {
      this.options.push({
        label: `Add ${names.length} models`,
        key: 'multi',
        data: names,
      });
      return;
    }
    this.options.push({
      label: `Create a model named ${this.paramParam}`,
      key: 'create',
      data: [this.paramParam],
    });

    this.videoSvc.getModelsByName(this.paramParam).subscribe((stars) => {
      this.aliases.set(stars);
    });
  }

  getFullNames(str: string): string[] {
    // Split into words
    const output = str.replace(/\([^)]*\)\s*/g, '');
    const words = output.trim().split(/\s+/);

    // Array to store full names
    const fullNames = [];

    // Process pairs of words
    for (let i = 0; i < words.length; i += 2) {
      // Check if we have both first and last name
      if (i + 1 < words.length) {
        fullNames.push(`${words[i]} ${words[i + 1]}`);
      }
    }

    return fullNames;
  }
}
