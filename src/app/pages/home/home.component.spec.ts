import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { FooterComponent } from '@app/components/footer/footer.component';
import { of } from 'rxjs';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, FooterComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            url: of([{ path: '/home/all' } as UrlSegment]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verify footer is hidden By default', () => {
    const footerDe = fixture.debugElement.query(By.css('footer'));

    expect(footerDe).toBeFalsy();
  });
});
