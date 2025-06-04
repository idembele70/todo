import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FourOhFourComponent } from './four-oh-four.component';

describe('FourOhFourComponent', () => {
  let component: FourOhFourComponent;
  let fixture: ComponentFixture<FourOhFourComponent>;

  const TITLE = '404';
  const SUB_TITLE = 'Page Not Found';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FourOhFourComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FourOhFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should verify title is ${TITLE}`, () => {
    const pageTitleEl = fixture.nativeElement.querySelector('h2') as HTMLHeadingElement;

    expect(pageTitleEl.textContent).toEqual(TITLE);
  });

  it(`should verify sub-title is ${SUB_TITLE}`, () => {
    const subTitleEl = fixture.nativeElement.querySelector('h5') as HTMLHeadingElement;

    expect(subTitleEl.textContent).toEqual(SUB_TITLE);
  });
});
