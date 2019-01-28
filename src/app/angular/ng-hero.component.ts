import {Component, Input, OnInit} from '@angular/core';
import {IHero} from '../model/hero';
import {HeroService} from './hero.service';

@Component({
  selector: 'app-ng-hero',
  template: `
    <div>
      <span>ng-hero works!</span><br/>
      <span *ngFor="let hero of heroes; let i = index;">{{hero.name}} - {{hero.age}} - <button (click)="addAge(i)">Add {{hero.name}} age</button><br/></span>
      <br/>
      <button (click)="addHero()">ADD AFRODITA</button>
    </div>
  `
})
export class NgHeroComponent implements OnInit {
  public heroes: IHero[];

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.heroService.getHeroes$().subscribe((res: IHero[]) => {
      this.heroes = res;
    });
  }

  addAge(heroId: number) {
    this.heroService.updateHeroAge(heroId, this.heroes[heroId].age + 1);
  }

  addHero() {
    this.heroService.addHeroes({name: 'Afrodita', age: 23});
  }

}
