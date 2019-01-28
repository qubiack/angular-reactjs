# How to connect Angular (2-7) app with ReactJS app?

I have a Angular app and some part of application I want write in ReactJS. How can I put ReactJS app and component into Angular application? How to manage with data between both systems?


## You can need different option, so I write it in 3 paragraph:
* [Angular-ReactJS without communication](#angular-reactjs-without-communication)
* [Angular-ReactJS with bidirectional communication](#angular-reactjs-with-bidirectional-communication)

All code below is minimal to show a problem on a presented step. On GitHub you have a complete code to solve a problem, not always 1:1 with example below because this code is extended.

## Angular-ReactJS without communication

To add ReactJS app into existing Angular application you need to install 5 npm dependencies: `react`, `react-dom`:
```
npm install --save react
npm install --save react-dom
npm install --save-dev @types/react
npm install --save-dev @types/react-dom
npm install --save-dev @types/react-select
```

Next step - we should permit to use `jsx` template in `.tsx` files, so we should edit `tsconfig.json`, and add:
```
{
    ...
   "compilerOptions": {
	…
	"jsx": "react"
}
```

If you use WebStorm you should restart your project because tslint show error till restart.

To keep clear structure, I create this structure of directory:

```
angular /
  ng-hero.component.ts // Component in Angular
  react-renderer.component.ts // ReactJS renderer without communication
react /
  react-application.tsx // React init application
  react-hero.tsx // React hero component
app.component.html
app.component.ts
```

Now you need create special component in Angular, which will be responsible for embedding ReactJS application. This component I will call `ReactRendererComponent`. This component is very simple and it have only one template line, constructor with `import Injector` and one line in `ngOnInit`:

```
import {Component, Injector, OnInit} from '@angular/core';
@Component({
  selector: 'app-react-renderer',
  template: `<div class="react-container" id="react-renderer"></div>`
})
export class ReactRendererComponent implements OnInit {
  constructor(public injector: Injector) { }

  ngOnInit() {
    ReactApplication.initialize('react-renderer', this.injector);
  }
}
```

Now we need `ReactApplication` component where we initialize ReactJS app:

```
interface IReactApplication {
  injector: Injector;
}

class ReactApp extends React.Component<IReactApplication, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={'renderer'}>
        <h2>ReactJS component: </h2>
        <br/>
        <ReactHero/>
      </div>
    );
  }
}

export class ReactApplication {

  static initialize(
    containerId: string,
    injector: Injector
  ) {
    ReactDOM.render(
      <ReactApp injector={injector}/>,
      document.getElementById(containerId)
    );
  }
}
```

And we need `ReactHero` component which was used in example below:

```
class ReactHero extends React.Component<any, any> {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <span>
        <span>react-hero works!</span><br/>
        <span>Don't have any data</span>
      </span>
    );
  }
}
export default ReactHero;
```

At this moment we have Angular app with embedded ReactJS app, but without any communication. Is it enough for you? If yes, it's all. If you need any kind of communication between both application, I present you two option below.

## Angular-ReactJS with bidirectional communication

In this example you have bidirectional databinding supported by RxJS. You can get this data, and use them in your ReactJS app and Angular app see all changes. This is enough for a lot of projects, but you can use different option to get this bidirectional communication, for example you can use Redux for them.

To keep it clear, below I present complete directory structure for this part:

```
angular /
  hero.service.ts
  ng-hero.component.ts // Component in Angular
  react-bidirectional-renderer.component.ts // ReactJS renderer with bidirectional communication
model /
  hero.ts // interface for Hero object
react-bidirectional
  react-bidirectional-application.tsx // React init application with bidirectional communication
  react-bidirectional-hero.tsx // React hero component with RxJS support
app.component.html
app.component.ts
```


First of all we create `IHero` interface with data: `/model/hero.ts`

```
export interface IHero {
  name: string;
  age: number;
}
```

In next step we create `angular/hero.service.ts` service, to use it in Angular part of application:

```
@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroes$: BehaviorSubject<IHero[]> = new BehaviorSubject([]);

  constructor() {
  }

  addHeroes(hero: IHero) { // To add new hero
    const actualHero = this.heroes$.value;
    actualHero.push(hero);
    this.heroes$.next(actualHero);
  }

  updateHeroAge(heroId: number, age: number) { // To update age of selected hero
    const actualHero = this.heroes$.value;
    actualHero[heroId].age = age;
    this.heroes$.next(actualHero);
  }

  getHeroes$(): BehaviorSubject<IHero[]> { // To get BehaviorSubject and pass it into ReactJS
    return this.heroes$;
  }
}
```

And in `app.component.ts` we initialize  with data (Zeus and Poseidon):

```
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
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
```
In next step we should prepare ReacJS part of application, so we create `react-bidirectional/react-bidirectional-application.tsx` file:

```
interface IReactBidirectionalApp {
  injector: Injector;
  heroes$: BehaviorSubject<IHero[]>; // We use this interface to grab RxJS object
}

class ReactBidirectionalApp extends React.Component<IReactBidirectionalApp, any> {
  constructor(props) {
    super(props);

    this.state = {
      heroes$: this.props.heroes$ // and we pass this data into ReactBidirectionalHero component
    };
  }

  render() {
    return (
      <div className={'renderer'}>
        <h2>ReactJS component (one way data binding): </h2>
        <ReactBidirectionalHero heroes$={this.state.heroes$}/>
      </div>
    );
  }
}

export class ReactBidirectionalApplication {

  static initialize(
    containerId: string,
    injector: Injector,
    heroes$: BehaviorSubject<IHero[]>, // This is necessary to get RxJS object
  ) {
    ReactDOM.render(
      <ReactBidirectionalApp injector={injector} heroes$={heroes$}/>,
      document.getElementById(containerId)
    );
  }
}
```

In next step we need `ReactBidirectionalHero` component, so we create it:

```
interface IReactBidirectionalHero {
  heroes$: BehaviorSubject<IHero[]>;
}

class ReactBidirectionalHero extends React.Component<IReactBidirectionalHero, any> {
  constructor(props) {
    super(props);

    this.state = {
      heroes: []
    };

    this.addAge = this.addAge.bind(this); // Register function to bump age
    this.addHero  = this.addHero.bind(this); // Register function to add new Hero
  }

  componentDidMount(): void {
    // In componentDidMount we subscribe heroes$ object
    this.props.heroes$.subscribe((res: IHero[]) => {
      // and we pass this data into React State object
      this.setState({heroes: res});
    });
  }

  addAge(i: number) {
    const temp = this.state.heroes;
    temp[i].age = temp[i].age + 1;

    // In this way we update RxJS object
    this.props.heroes$.next( temp);
  }

  addHero() {
    const temp = this.state.heroes;
    temp.push({name: 'Atena', age: 31});

    // In this way we update RxJS object
    this.props.heroes$.next(temp);
  }

  render() {
    // Hire we render RxJS part of application with addAge button and ADD ATENA button below
    const heroes = this.state.heroes.map((hero: IHero, i) => {
      return <span key={i}>{hero.name} - {hero.age} <button onClick={() => this.addAge(i)}>Add {hero.name} age</button><br/></span>;
    });
    return (
      <span>
        <span>react-hero works!</span><br/>
        {heroes}
        <br/>
        <button onClick={this.addHero}>ADD ATENA</button>
      </span>
    );
  }
}

export default ReactBidirectionalHero;
```

Now we need to initialize ReactJS app in Angular application, so we create `angular/react-bidirectional-renderer.component.ts` - it's very simple, with only one changes in compare to version without communication:

```
@Component({
  selector: 'app-react-owc-renderer',
  template: `<div class="react-container" id="react-owc-renderer"></div>`
})
export class ReactBidirectionalRendererComponent implements OnInit {
  // Hire we get data from parent component, but of course we can also subscribe this data directly form HeroService if we prefer this way
  @Input() heroes$: BehaviorSubject<IHero[]>;

  constructor(public injector: Injector) { }

  ngOnInit() {
    // We add only one parameter into initialize function
    ReactBidirectionalApplication.initialize('react-owc-renderer', this.injector, this.heroes$);
  }
}
```

And now we should change a little `ng-hero.component.ts` to see all efect:

```
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
```

Finally we change `app.component.html`:

```
App.component data:
<hr>
<h2>This is Angular component: </h2>
<app-ng-hero></app-ng-hero>
<hr>

<!-- With one way data binding-->
<app-react-owc-renderer [heroes$]="heroesObj$" [counter]="counter"></app-react-owc-renderer>
<hr>
```

And everything should work. If you have any problem, feel free to ask.

Complete repository with this solution you can find on GitHub.
