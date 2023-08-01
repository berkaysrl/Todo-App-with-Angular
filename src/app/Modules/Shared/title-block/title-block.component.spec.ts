import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleBlockComponent } from './title-block.component';

describe('TitleBlockComponent', () => {
  let component: TitleBlockComponent;
  let fixture: ComponentFixture<TitleBlockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TitleBlockComponent]
    });
    fixture = TestBed.createComponent(TitleBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
