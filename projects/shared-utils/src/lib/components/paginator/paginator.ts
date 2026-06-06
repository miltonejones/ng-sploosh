import { Component, input, output, signal } from '@angular/core';
import { PageLink } from '../../pages-service';
import { ModalEventService } from '../../modal-event.service';

@Component({
  selector: 'lib-paginator',
  imports: [],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css',
})
export class Paginator {
  pageNum = input(1);
  visiblePages = signal<number[]>([]);
  count = input<number>();
  pageLinks = input<PageLink[]>([]);
  setPage = output<number>();

  constructor(private modal: ModalEventService) {}

  handleSetPage(page: number) {
    this.setPage.emit(page);
  }

  async handleJumpPage() {
    const page = await this.modal.prompt('Enter page number');
    if (!page.ok) return;
    this.handleSetPage(Number(page.message));
  }
}
