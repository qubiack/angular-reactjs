import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IHero} from '../model/hero';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroes$: BehaviorSubject<IHero[]> = new BehaviorSubject([]);

  constructor() {
  }

  addHeroes(hero: IHero) {
    const actualHero = this.heroes$.value;
    actualHero.push(hero);
    this.heroes$.next(actualHero);
  }

  updateHeroAge(heroId: number, age: number) {
    const actualHero = this.heroes$.value;
    actualHero[heroId].age = age;
    this.heroes$.next(actualHero);
  }

  getHeroes$(): BehaviorSubject<IHero[]> {
    return this.heroes$;
  }
}
