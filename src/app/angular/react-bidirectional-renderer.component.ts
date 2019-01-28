import {Component, Injector, Input, OnInit} from '@angular/core';
import {IHero} from '../model/hero';
import {BehaviorSubject} from 'rxjs';
import {ReactBidirectionalApplication} from '../react-bidirectional/react-bidirectional-application';

@Component({
  selector: 'app-react-owc-renderer',
  template: `<div class="react-container" id="react-owc-renderer"></div>`
})
export class ReactBidirectionalRendererComponent implements OnInit {
  @Input() heroes$: BehaviorSubject<IHero[]>;

  constructor(public injector: Injector) { }

  ngOnInit() {
    ReactBidirectionalApplication.initialize('react-owc-renderer', this.injector, this.heroes$);
  }
}
