import { Component, ElementRef, OnInit, output, signal, ViewChild } from '@angular/core';
import { ModalEventService, ModalRequest, ModalResponse } from '../../modal-event.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageSource } from '../../directives/image-source';
import { ParserService } from '../../parser-service';
import { TrackInfo } from '../../models';

@Component({
  selector: 'lib-modal-box',
  imports: [FormsModule, CommonModule, ImageSource],
  templateUrl: './modal-box.html',
  styleUrl: './modal-box.css',
})
export class ModalBox implements OnInit {
  @ViewChild('inputField') inputField!: ElementRef;

  constructor(private eventSvc: ModalEventService, private parser: ParserService) {}
  modalContainer: bootstrap.Modal | undefined = undefined;
  request = signal<ModalRequest | null>(null);
  respond = output<ModalResponse>();
  responseText = '';
  multipleText = true;
  responseStrings = signal<string[]>([]);
  imageMap = signal<Record<string, TrackInfo>>({});

  ngOnInit(): void {
    this.eventSvc.modalRequest.subscribe((request) => {
      this.request.set(request);
      this.responseStrings.set([]);
      this.show();
    });
  }

  show() {
    document.getElementById('globalModal')?.addEventListener('shown.bs.modal', () => {
      if (this.request()?.type === 'prompt' && this.inputField) {
        this.inputField.nativeElement.focus();
      }
    });

    this.modalContainer = new bootstrap.Modal(document.getElementById('globalModal'));
    this.modalContainer.show();
  }
  hide() {
    this.responseText = '';
    this.modalContainer && this.modalContainer.hide();
  }

  handleEnter() {
    if (!this.multipleText) return this.handleRespond();
    this.responseStrings.update((f) => [...f, this.responseText]);
    const responseText = this.responseText;
    this.parser.getVideoByURL(responseText).subscribe((vid) => {
      this.imageMap.update((f) => ({
        ...f,
        [responseText]: vid,
      }));
    });
    this.responseText = '';
  }

  handleCancel() {
    if (this.request()?.handler) {
      this.request()?.handler!({
        ok: false,
      });
      this.hide();
    }
  }

  handleRespond() {
    if (this.request()?.handler) {
      this.request()?.handler!({
        ok: true,
        message: this.responseText,
        messages: this.responseStrings(),
      });
      this.hide();
      return;
    }
    this.respond.emit({
      ok: true,
      message: this.responseText,
    });
    this.hide();
  }
}

declare namespace bootstrap {
  class Modal {
    constructor(element: Element | null);
    show(): void;
    hide(): void;
  }
}

declare global {
  interface Window {
    modalContainer: bootstrap.Modal | undefined;
  }
}
