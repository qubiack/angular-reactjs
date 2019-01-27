import {Component, Injector, OnInit} from '@angular/core';
import {ReactApplication} from '../react/react-application';

@Component({
  selector: 'app-react-renderer',
  template: `<div class="react-container" id="react-course-renderer"></div>`
})
export class ReactRendererComponent implements OnInit {
  constructor(public injector: Injector) { }

  ngOnInit() {
    ReactApplication.initialize('react-course-renderer', this.injector);
  }
}
