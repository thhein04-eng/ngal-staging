import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RevealDirective } from './reveal.directive';

@Component({
  imports: [RevealDirective],
  template: `
    <p class="a" shopReveal="up">Up</p>
    <p class="b" shopReveal="scale" [revealDelay]="240">Scale</p>
  `,
})
class HostComponent {}

describe('RevealDirective', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('marks the element with its reveal direction', () => {
    expect(fixture.nativeElement.querySelector('.a').getAttribute('data-reveal')).toBe(
      'up'
    );
    expect(fixture.nativeElement.querySelector('.b').getAttribute('data-reveal')).toBe(
      'scale'
    );
  });

  it('exposes the stagger delay as a custom property', () => {
    const b = fixture.nativeElement.querySelector('.b') as HTMLElement;
    expect(b.style.getPropertyValue('--nl-reveal-delay')).toBe('240ms');
  });

  it('defaults to no delay', () => {
    const a = fixture.nativeElement.querySelector('.a') as HTMLElement;
    expect(a.style.getPropertyValue('--nl-reveal-delay')).toBe('0ms');
  });

  it('leaves content in the DOM regardless of observer support', () => {
    // The hidden starting state is CSS-only and gated on `.motion-ready`, so
    // the element must always be present and readable.
    expect(fixture.nativeElement.querySelector('.a').textContent).toContain('Up');
  });
});
