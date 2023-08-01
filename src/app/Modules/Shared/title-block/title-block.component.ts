import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-title-block',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title-block.component.html',
  styleUrls: ['./title-block.component.scss']
})
export class TitleBlockComponent {
  @Input() title: string='';
}
