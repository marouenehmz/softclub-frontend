import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';

@Component({
  selector: 'app-vip-reservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FullCalendarModule],
  templateUrl: './vip-reservation.component.html',
  styleUrls: ['./vip-reservation.component.scss'],
})
export class VipReservationComponent {
  isMobile = window.innerWidth <= 768;
  showReservationModal = false;
  selectedEventId: string | null = null;

  reservations: EventInput[] = [
    {
      id: '1',
      title: 'VIP - Karim',
      start: this.buildDateTime(2, 20, 0),
      end: this.buildDateTime(2, 22, 0),
    },
    {
      id: '2',
      title: 'VIP - Sarah',
      start: this.buildDateTime(4, 18, 30),
      end: this.buildDateTime(4, 20, 0),
    },
  ];
  reservationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.reservationForm = this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', Validators.required],
      guests: [1, [Validators.required, Validators.min(1)]],
      note: [''],
    });
    this.updateCalendarView();
    window.addEventListener('resize', this.updateCalendarView.bind(this));
  }
  private updateCalendarView(): void {
    const isMobile = window.innerWidth <= 768;
    this.isMobile = isMobile;

    this.calendarOptions = {
      ...this.calendarOptions,
      initialView: isMobile ? 'timeGridDay' : 'timeGridWeek',
      selectable: !isMobile,
      selectMirror: !isMobile,
    };
  }
  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, interactionPlugin],
    initialView: this.isMobile ? 'timeGridDay' : 'timeGridWeek',
    locale: frLocale,
    selectable: true,
    selectMirror: true,
    nowIndicator: true,
    weekends: true,
    allDaySlot: false,
    expandRows: true,
    height: 'auto',
    slotDuration: '00:30:00',
    slotLabelInterval: '01:00:00',
    slotMinTime: '10:00:00',
    slotMaxTime: '26:00:00',
    firstDay: 1,
    longPressDelay: 250,

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: '',
    },

    buttonText: {
      today: 'Aujourd’hui',
    },

    selectAllow: this.selectAllow.bind(this),
    select: this.onSelectSlot.bind(this),
    dateClick: this.onDateClick.bind(this),
    eventClick: this.onEventClick.bind(this),
    slotLaneDidMount: this.onSlotLaneDidMount.bind(this),

    events: this.reservations,
  };
  onDateClick(clickInfo: DateClickArg): void {
    const start = new Date(clickInfo.date);

    if (start < new Date()) {
      return;
    }

    this.ngZone.run(() => {
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 30);

      this.selectedEventId = null;

      this.reservationForm.reset({
        start: this.toDatetimeLocal(start),
        end: this.toDatetimeLocal(end),
        fullName: '',
        phone: '',
        guests: 1,
        note: '',
      });

      this.showReservationModal = true;
      this.cdr.detectChanges();
    });
  }

  onSelectSlot(selectInfo: DateSelectArg): void {
    console.log('selection OK');

    this.ngZone.run(() => {
      this.selectedEventId = null;

      this.reservationForm.reset({
        start: this.toDatetimeLocal(selectInfo.start),
        end: this.toDatetimeLocal(selectInfo.end),
        fullName: '',
        phone: '',
        guests: 1,
        note: '',
      });

      this.showReservationModal = true;
      this.cdr.detectChanges();
    });
  }

  onEventClick(clickInfo: EventClickArg): void {
    this.ngZone.run(() => {
      const event = clickInfo.event;
      this.selectedEventId = event.id;

      this.reservationForm.reset({
        start: this.toDatetimeLocal(event.start!),
        end: this.toDatetimeLocal(event.end!),
        fullName: this.extractNameFromTitle(event.title),
        phone: event.extendedProps?.['phone'] || '',
        guests: event.extendedProps?.['guests'] || 1,
        note: event.extendedProps?.['note'] || '',
      });

      this.showReservationModal = true;
      this.cdr.detectChanges();
    });
  }
  selectAllow(selectInfo: { start: Date; end: Date }): boolean {
    return selectInfo.start >= new Date();
  }
  onSlotLaneDidMount(arg: any): void {
    const now = new Date();

    if (!arg?.date || !arg?.el) return;

    const slotDate = new Date(arg.date);

    if (slotDate < now) {
      arg.el.classList.add('fc-slot-past-disabled');
    }
  }
  submitReservation(): void {
    if (this.reservationForm.invalid) {
      this.reservationForm.markAllAsTouched();
      return;
    }

    const formValue = this.reservationForm.getRawValue();

    const reservation: EventInput = {
      id: this.selectedEventId || this.generateId(),
      title: `VIP - ${formValue.fullName}`,
      start: formValue.start || '',
      end: formValue.end || '',
      extendedProps: {
        phone: formValue.phone || '',
        guests: formValue.guests || 1,
        note: formValue.note || '',
      },
    };

    if (this.selectedEventId) {
      this.reservations = this.reservations.map((event) =>
        String(event.id) === this.selectedEventId ? reservation : event,
      );
    } else {
      this.reservations = [...this.reservations, reservation];
    }

    this.refreshCalendarEvents();
    this.closeModal();
  }

  deleteReservation(): void {
    if (!this.selectedEventId) return;

    this.reservations = this.reservations.filter(
      (event) => String(event.id) !== this.selectedEventId,
    );

    this.refreshCalendarEvents();
    this.closeModal();
  }

  closeModal(): void {
    this.showReservationModal = false;
    this.selectedEventId = null;

    this.reservationForm.reset({
      start: '',
      end: '',
      fullName: '',
      phone: '',
      guests: 1,
      note: '',
    });
  }

  private refreshCalendarEvents(): void {
    this.calendarOptions = {
      ...this.calendarOptions,
      events: [...this.reservations],
    };
  }

  private generateId(): string {
    return Date.now().toString();
  }

  private extractNameFromTitle(title: string): string {
    return title.replace('VIP - ', '').trim();
  }

  private toDatetimeLocal(date: Date): string {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  }

  private buildDateTime(dayOffset: number, hour: number, minute: number): string {
    const now = new Date();
    const target = new Date(now);
    target.setDate(now.getDate() + dayOffset);
    target.setHours(hour, minute, 0, 0);

    const offset = target.getTimezoneOffset();
    const localDate = new Date(target.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  }

  get fullNameCtrl() {
    return this.reservationForm.get('fullName');
  }

  get phoneCtrl() {
    return this.reservationForm.get('phone');
  }

  get startCtrl() {
    return this.reservationForm.get('start');
  }

  get endCtrl() {
    return this.reservationForm.get('end');
  }

  get guestsCtrl() {
    return this.reservationForm.get('guests');
  }
}
