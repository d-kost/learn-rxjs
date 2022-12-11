import 'bulma/css/bulma.css';
import { Observable } from 'rxjs';

const addItem = (text) => {
  let result = document.getElementById('list-result');
  result.insertAdjacentHTML('beforeend', `<li><a>${text}</a>`);
};

const observable = new Observable((observer) => {
  try {
    observer.next('Hello, world!');
    observer.next('Observer next');
    setInterval(() => {
      observer.next('Hi! Observer.next() with interval');
    }, 1000)
    // observer.complete();
    // observer.next('Item 3 will not appear');
  } catch (err) {
    observer.error(err);
  }
});

const observer = observable.subscribe({
  next: (value) => addItem('Observer 1 ' + value),
  error: (error) => addItem(error),
  complete: () => addItem('Completed'),
});

const observer2 = observable.subscribe({
  next: (value) => addItem('Observer 2 ' + value),
});

//allow to unsubscrive both observers
observer.add(observer2);

setTimeout(() => {
  observer.unsubscribe();
}, 3000)
