import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkitemComponent } from './bookmarkitem.component';

describe('BookmarkitemComponent', () => {
  let component: BookmarkitemComponent;
  let fixture: ComponentFixture<BookmarkitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkitemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
