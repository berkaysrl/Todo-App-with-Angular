import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHeaderBlockComponent } from './table-header-block.component';

describe('TableHeaderBlockComponent', () => {
  let component: TableHeaderBlockComponent;
  let fixture: ComponentFixture<TableHeaderBlockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableHeaderBlockComponent]
    });
    fixture = TestBed.createComponent(TableHeaderBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
