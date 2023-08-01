import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-header-block',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-header-block.component.html',
  styleUrls: ['./table-header-block.component.scss']
})
export class TableHeaderBlockComponent {
  @Input() Headers:string[]=[];
  @ViewChild(TemplateRef) headerTemplate !: TemplateRef<any>;

}
