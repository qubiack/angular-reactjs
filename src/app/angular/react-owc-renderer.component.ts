import {Component, Injector, Input, OnInit} from '@angular/core';
import {ReactOwcApplication} from '../react-owc/react-owc-application';
import {IHero} from '../model/hero';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-react-owc-renderer',
  template: `<div class="react-container" id="react-owc-renderer"></div>`
})
export class ReactOwcRendererComponent implements OnInit {
  @Input() heroes$: BehaviorSubject<IHero[]>;
  @Input() counter: number;

  constructor(public injector: Injector) { }

  ngOnInit() {
    ReactOwcApplication.initialize('react-owc-renderer', this.injector, this.heroes$);
  }
}
