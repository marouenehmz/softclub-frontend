import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface EventItem {
  title: string;
  date: string;
  description: string;
}

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent {
  events: EventItem[] = [
    // mets tes événements ici plus tard
    // {
    //   title: 'Tournoi FIFA',
    //   date: '22 Mars 2026',
    //   description: 'Compétition FIFA au Soft Club'
    // }
  ];

  get hasEvents(): boolean {
    return this.events.length > 0;
  }
}
