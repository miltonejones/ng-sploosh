import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  output,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModelInfo, ModelItem, VideoApiService } from 'shared-utils';

export interface ListOption {
  label: string;
  key: string;
  data?: string[];
}

@Component({
  selector: 'app-model-finder',
  imports: [CommonModule, FormsModule, ModelItem],
  templateUrl: './model-finder.html',
  styleUrl: './model-finder.css',
})
export class ModelFinder implements AfterViewInit {
  @ViewChild('inputField') inputField!: ElementRef;
  searchParam = '';
  stars = signal<ModelInfo[]>([]);
  select = output<ModelInfo>();
  optionClick = output<ListOption>();
  options: ListOption[] = [];
  constructor(public videoSvc: VideoApiService) {}

  ngAfterViewInit(): void {
    document.getElementById('starFinderModal')?.addEventListener('shown.bs.modal', () => {
      if (this.inputField) {
        this.inputField.nativeElement.focus();
      }
    });
  }
  checkParam(): void {
    if (this.searchParam.length < 3) return;
    const names = this.getFullNames(this.searchParam);
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
      label: `Create a model named ${this.searchParam}`,
      key: 'create',
      data: [this.searchParam],
    });
    this.videoSvc.getModelsByName(this.searchParam).subscribe((stars) => {
      this.stars.set(stars);
    });
  }

  clearOptions() {
    this.searchParam = '';
    this.options = [];
    this.stars.set([]);
  }

  handleSelect(star: ModelInfo) {
    this.select.emit(star);
    this.clearOptions();
  }

  handleOption(option: ListOption) {
    this.optionClick.emit(option);
    this.clearOptions();
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

//Yoshizawa Yuki Akari Tsumugi Mito Kana Kuriyama Rio Hirose Yuri Hayama Sayuri Kimura Rei (Fujiki Rina) Satsuki Fumino
