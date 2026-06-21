import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DropMenuItem } from '../public-api';

export interface ModalResponse {
  ok: boolean;
  message?: string;
  messages?: string[];
  key?: string;
}

export interface ModalRequest {
  message: string;
  type: 'alert' | 'confirm' | 'prompt';
  title?: string;
  image?: string;
  handler?: (res: ModalResponse) => void;
  single?: boolean;
  menu?: DropMenuItem[];
}

@Injectable({
  providedIn: 'root',
})
export class ModalEventService {
  modalRequest = new Subject<ModalRequest>();
  requestPrompt = new Subject<string>();
  requestConfirm = new Subject<string>();

  respond = new Subject<ModalResponse>();

  async alert(
    message: string,
    title?: string,
    image?: string,
    menu?: DropMenuItem[],
  ): Promise<ModalResponse> {
    return this.ask('alert', message, title, image, true, menu);
  }

  async prompt(
    message: string,
    title?: string,
    image?: string,
    single?: boolean,
  ): Promise<ModalResponse> {
    return this.ask('prompt', message, title, image, single);
  }

  async confirm(message: string, title?: string, image?: string): Promise<ModalResponse> {
    return this.ask('confirm', message, title, image);
  }

  async ask(
    type: 'alert' | 'prompt' | 'confirm',
    message: string,
    title?: string,
    image?: string,
    single?: boolean,
    menu?: DropMenuItem[],
  ): Promise<ModalResponse> {
    return new Promise((handler) => {
      this.modalRequest.next({
        type,
        message,
        title,
        image,
        menu,
        single,
        handler,
      });
    });
  }

  answer(response: ModalResponse) {
    this.respond.next(response);
  }
}
