import 'bulma/css/bulma.css';
import {
  from,
  fromEvent,
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  of,
  mergeMap,
  tap,
  catchError,
  EMPTY,
  filter,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';

const url = 'http://universities.hipolabs.com/search?country=';

const search = document.getElementById('search');
const result = document.getElementById('result');

// const test$ = from([1, 2, 3]).pipe(map((x) => [x, x ** 2, x ** 3])); //[1, 1, 1] [2, 4, 8] [3, 9, 27]
const test$ = from([1, 2, 3]).pipe(switchMap((x) => of(x, x ** 2, x ** 3))); //1 1 1 2 4 8 3 9 27
test$.subscribe((v) => {
  console.log(v);
});

const stream$ = fromEvent(search, 'input') //Turn event into observable sequence
  .pipe(
    map((event) => event.target.value),
    debounceTime(1000),
    distinctUntilChanged(), //emit when the current value is different than the last
    tap(() => (result.innerHTML = '')), //Used to perform side-effects for notifications from the source observable
    filter((v) => v.trim()),
    switchMap((value) =>
      ajax.getJSON(url + value).pipe(
        catchError((error) => EMPTY) //A simple Observable that emits no items to the Observer and immediately emits a complete notification.
      )
    ),
    // map(response => response.items)
    mergeMap((items) => items) //Projects each source value to an Observable which is merged in the output Observable
  );

console.log('stream$', stream$);

const subscription = stream$.subscribe((university) => {
  // console.log(university);
  result.insertAdjacentHTML('beforeend', `<div>${university.name}</div>`);
});
console.log('subscription', subscription);
