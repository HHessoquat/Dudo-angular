import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dice',
  standalone: true,
  imports: [],
  templateUrl: './dice.component.html',
  styleUrl: './dice.component.scss',
})
export class DiceComponent implements OnInit {
  HIDDEN_PATH: string = "assets/dice/dark/hidden.png";
  @Input() value!: number;
  @Input() color!: string;
  @Input() isVisible!: boolean;
  imgPath!: string;


  ngOnInit(): void {
    this.imgPath = `assets/dice/dark/${this.value}.png`;
  }
}
