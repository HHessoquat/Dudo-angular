import { Component, Input, OnInit, input } from '@angular/core';

@Component({
  selector: 'app-dice',
  standalone: true,
  imports: [],
  templateUrl: './dice.component.html',
  styleUrl: './dice.component.scss',
})
export class DiceComponent implements OnInit {
  @Input() value!: number;
  @Input() color!: string;
  imgPath!: string;

  ngOnInit(): void {
    this.imgPath = `assets/dice/dark/${this.value}.png`;
  }
}
