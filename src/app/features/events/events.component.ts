import { Component, inject } from '@angular/core';
import { EventService } from '../../core/services/event.service';
@Component({
  selector: 'app-events',
  standalone: true,
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent {
  private eventService = inject(EventService);
  events = this.eventService.events;
}
