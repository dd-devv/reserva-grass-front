import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private _router: Router,
    private _title: Title
  ) {
    
  }

  ngOnInit(): void {
    this._title.setTitle('Reserva tu Grass');
  
    setTimeout(() => {
      window.location.href = 'https://tugrass.com/';
    }, 5000);
  }
}
