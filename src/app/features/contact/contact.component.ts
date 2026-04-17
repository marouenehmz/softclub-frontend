import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
  phoneTN = '+21653075084';
  phoneFR = '+33651795542';
  email = 'contact@softclub.tn';
  address = 'Zone touristique, Mahdia, Tunisie';

  // Remplace par le vrai lien Google Maps embed
  mapUrl: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer) {
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3247.143418235592!2d11.030497775584424!3d35.52545337263797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x130223000a2e6951%3A0x857b334c46bd6879!2sSoft%20Club!5e0!3m2!1sfr!2sfr!4v1773767221320!5m2!1sfr!2sfr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade',
    );
  }
}
