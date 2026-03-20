import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { RouterLink } from '@angular/router';

type ReservationType = 'vip' | 'ps5';

@Component({
  selector: 'app-vip-reservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FullCalendarModule, RouterLink],
  templateUrl: './vip-reservation.component.html',
  styleUrls: ['./vip-reservation.component.scss'],
})
export class VipReservationComponent {
  inProgress = true;
  isMobile = window.innerWidth <= 768;
  showReservationModal = false;
  selectedEventId: string | null = null;
  selectedDate: Date | null = null;

  readonly vipHourlyPrice = 20;
  readonly ps5HourlyPrice = 10; // change ce prix si besoin

  reservations: EventInput[] = [
    {
      id: '1',
      title: 'VIP - Karim',
      start: this.buildDateTime(2, 20, 0),
      end: this.buildDateTime(2, 22, 0),
      extendedProps: {
        reservationType: 'vip',
        phone: '0550 00 00 00',
        guests: 4,
        note: '',
        durationHours: 2,
        totalPrice: 40,
      },
    },
    {
      id: '2',
      title: 'PS5 - Sarah',
      start: this.buildDateTime(4, 18, 30),
      end: this.buildDateTime(4, 20, 30),
      extendedProps: {
        reservationType: 'ps5',
        phone: '0660 00 00 00',
        guests: 2,
        note: '',
        durationHours: 2,
        totalPrice: 20,
      },
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
      reservationType: ['vip', Validators.required],
      reservationDate: [{ value: '', disabled: true }, Validators.required],
      startTime: ['', Validators.required],
      durationHours: [1, [Validators.required, Validators.min(1), Validators.max(3)]],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', Validators.required],
      guests: [1, [Validators.required, Validators.min(1)]],
      note: [''],
    });

    this.reservationForm.get('reservationType')?.valueChanges.subscribe(() => {
      this.updateGuestsValidation();
    });

    this.reservationForm.get('guests')?.valueChanges.subscribe(() => {
      this.clampGuestsIfNeeded();
    });

    this.updateGuestsValidation();
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
    slotDuration: '01:00:00',
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
  reservationSummary: {
    fullName: string;
    reservationTypeLabel: string;
    date: string;
    startTime: string;
    durationHours: number;
    totalPrice: number;
  } | null = null;

  showConfirmationModal = false;

  onDateClick(clickInfo: DateClickArg): void {
    const start = new Date(clickInfo.date);

    if (start < new Date()) {
      return;
    }

    this.openCreateModal(start, 1);
  }

  onSelectSlot(selectInfo: DateSelectArg): void {
    const start = new Date(selectInfo.start);
    const end = new Date(selectInfo.end);

    if (start < new Date()) {
      return;
    }

    const durationMs = end.getTime() - start.getTime();
    const durationHours = Math.min(Math.max(durationMs / (1000 * 60 * 60), 1), 3);

    this.openCreateModal(start, durationHours);
  }

  onEventClick(clickInfo: EventClickArg): void {
    this.ngZone.run(() => {
      const event = clickInfo.event;
      const start = event.start!;
      const end = event.end!;
      const durationHours = Math.max(
        1,
        Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60)),
      );

      this.selectedEventId = event.id;
      this.selectedDate = new Date(start);

      const reservationType: ReservationType = event.extendedProps?.['reservationType'] || 'vip';

      this.reservationForm.reset({
        reservationType,
        reservationDate: this.formatDisplayDate(start),
        startTime: this.toTimeValue(start),
        durationHours: Math.min(durationHours, 3),
        fullName: this.extractNameFromTitle(event.title),
        phone: event.extendedProps?.['phone'] || '',
        guests: event.extendedProps?.['guests'] || 1,
        note: event.extendedProps?.['note'] || '',
      });

      this.updateGuestsValidation();
      this.showReservationModal = true;
      this.cdr.detectChanges();
    });
  }

  selectAllow(selectInfo: { start: Date; end: Date }): boolean {
    if (selectInfo.start < new Date()) return false;

    const durationMs = selectInfo.end.getTime() - selectInfo.start.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);

    return durationHours <= 3;
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
    if (this.reservationForm.invalid || !this.selectedDate) {
      this.reservationForm.markAllAsTouched();
      return;
    }

    const formValue = this.reservationForm.getRawValue();
    const startDate = this.combineDateAndTime(this.selectedDate, formValue.startTime);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + Number(formValue.durationHours));

    if (startDate < new Date()) {
      this.startTimeCtrl?.markAsTouched();
      return;
    }

    const reservationType = formValue.reservationType as ReservationType;
    const prefix = reservationType === 'vip' ? 'VIP' : 'PS5';
    const totalPrice = this.calculatePrice(reservationType, Number(formValue.durationHours));

    const reservation: EventInput = {
      id: this.selectedEventId || this.generateId(),
      title: `${prefix} - ${formValue.fullName}`,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      extendedProps: {
        reservationType,
        phone: formValue.phone || '',
        guests: Number(formValue.guests) || 1,
        note: formValue.note || '',
        durationHours: Number(formValue.durationHours),
        totalPrice,
      },
    };

    if (this.selectedEventId) {
      this.reservations = this.reservations.map((event) =>
        String(event.id) === this.selectedEventId ? reservation : event,
      );
    } else {
      this.reservations = [...this.reservations, reservation];
    }
    this.reservationSummary = {
      fullName: formValue.fullName,
      reservationTypeLabel: this.getReservationTypeLabel(reservationType),
      date: this.formatDisplayDate(startDate),
      startTime: formValue.startTime,
      durationHours: Number(formValue.durationHours),
      totalPrice,
    };
    this.refreshCalendarEvents();
    this.closeModal();
    this.showConfirmationModal = true;
  }
  private getReservationTypeLabel(type: ReservationType): string {
    return type === 'vip' ? 'Salle VIP' : 'Poste PS5 individuel';
  }
  closeConfirmationModal(): void {
    this.showConfirmationModal = false;
    this.reservationSummary = null;
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
    this.selectedDate = null;

    this.reservationForm.reset({
      reservationType: 'vip',
      reservationDate: '',
      startTime: '',
      durationHours: 1,
      fullName: '',
      phone: '',
      guests: 1,
      note: '',
    });
  }

  private openCreateModal(start: Date, durationHours: number): void {
    this.ngZone.run(() => {
      this.selectedEventId = null;
      this.selectedDate = new Date(start);

      this.reservationForm.reset({
        reservationType: 'vip',
        reservationDate: this.formatDisplayDate(start),
        startTime: this.toTimeValue(start),
        durationHours: Math.min(Math.round(durationHours), 3),
        fullName: '',
        phone: '',
        guests: 1,
        note: '',
      });

      this.updateGuestsValidation();
      this.showReservationModal = true;
      this.cdr.detectChanges();
    });
  }

  private refreshCalendarEvents(): void {
    this.calendarOptions = {
      ...this.calendarOptions,
      events: [...this.reservations],
    };
  }

  private updateGuestsValidation(): void {
    const guestsControl = this.reservationForm.get('guests');
    if (!guestsControl) return;

    guestsControl.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(this.maxGuests),
    ]);
    guestsControl.updateValueAndValidity({ emitEvent: false });
    this.clampGuestsIfNeeded();
  }

  private clampGuestsIfNeeded(): void {
    const guestsControl = this.reservationForm.get('guests');
    if (!guestsControl) return;

    const currentValue = Number(guestsControl.value || 1);
    if (currentValue > this.maxGuests) {
      guestsControl.setValue(this.maxGuests, { emitEvent: false });
    }
  }

  private calculatePrice(type: ReservationType, durationHours: number): number {
    const hourlyPrice = type === 'vip' ? this.vipHourlyPrice : this.ps5HourlyPrice;
    return hourlyPrice * durationHours;
  }

  private combineDateAndTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const merged = new Date(date);
    merged.setHours(hours, minutes, 0, 0);
    return merged;
  }

  private formatDisplayDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  private toTimeValue(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private generateId(): string {
    return Date.now().toString();
  }

  private extractNameFromTitle(title: string): string {
    return title.replace('VIP - ', '').replace('PS5 - ', '').trim();
  }

  private buildDateTime(dayOffset: number, hour: number, minute: number): string {
    const now = new Date();
    const target = new Date(now);
    target.setDate(now.getDate() + dayOffset);
    target.setHours(hour, minute, 0, 0);
    return target.toISOString();
  }

  get fullNameCtrl() {
    return this.reservationForm.get('fullName');
  }

  get phoneCtrl() {
    return this.reservationForm.get('phone');
  }

  get reservationTypeCtrl() {
    return this.reservationForm.get('reservationType');
  }

  get reservationDateCtrl() {
    return this.reservationForm.get('reservationDate');
  }

  get startTimeCtrl() {
    return this.reservationForm.get('startTime');
  }

  get durationHoursCtrl() {
    return this.reservationForm.get('durationHours');
  }

  get guestsCtrl() {
    return this.reservationForm.get('guests');
  }

  get reservationTypeLabel(): string {
    return this.reservationTypeCtrl?.value === 'vip' ? 'Salle VIP' : 'Poste PS5 individuel';
  }

  get maxGuests(): number {
    return this.reservationTypeCtrl?.value === 'vip' ? 8 : 14;
  }

  get hourlyPrice(): number {
    return this.reservationTypeCtrl?.value === 'vip' ? this.vipHourlyPrice : this.ps5HourlyPrice;
  }

  get totalPrice(): number {
    const duration = Number(this.durationHoursCtrl?.value || 0);
    return this.calculatePrice(
      (this.reservationTypeCtrl?.value as ReservationType) || 'vip',
      duration,
    );
  }
}
