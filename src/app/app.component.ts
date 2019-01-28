import {Component, OnInit} from '@angular/core';
import {IHero} from './model/hero';
import {BehaviorSubject} from 'rxjs';
import {HeroService} from './angular/hero.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public heroesObj$: BehaviorSubject<IHero[]>;
  public heroes: IHero[];
  public counter: number;

  constructor(private heroService: HeroService) {}

  ngOnInit(): void {
    this.counter = 1;

    this.heroService.getHeroes$().subscribe((res: IHero[]) => {
      this.heroes = res;
    });

    this.heroesObj$ = this.heroService.getHeroes$();

    this.initHeroes();
  }

  initHeroes() {
    this.heroService.addHeroes({name: 'Zeus', age: 88});
    this.heroService.addHeroes({name: 'Poseidon', age: 46});
  }
}
