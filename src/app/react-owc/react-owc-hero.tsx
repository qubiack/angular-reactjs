import * as React from 'react';
import {IHero} from '../model/hero';
import {BehaviorSubject} from 'rxjs';

interface IReactOwcHero {
  heroes$: BehaviorSubject<IHero[]>;
}

class ReactOwcHero extends React.Component<IReactOwcHero, any> {
  public heroes: IHero[];

  constructor(props) {
    super(props);

    this.state = {
      heroes: []
    };

    this.addAge = this.addAge.bind(this);
    this.addHero  = this.addHero.bind(this);
  }

  componentDidMount(): void {
    this.props.heroes$.subscribe((res: IHero[]) => {
      this.setState({heroes: res});
    });
  }

  addAge(i: number) {
    const temp = this.state.heroes;
    temp[i].age = temp[i].age + 1;

    this.props.heroes$.next( temp);
  }

  addHero() {
    const temp = this.state.heroes;
    temp.push({name: 'Atena', age: 31});

    this.props.heroes$.next(temp);
  }

  render() {
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

export default ReactOwcHero;
