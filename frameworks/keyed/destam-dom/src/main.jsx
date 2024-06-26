import { mount, OArray, Observer, h } from 'destam-dom';
import { atomic } from 'destam/Network';

let idCounter = 1;
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"],
  colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"],
  nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function _random (max) { return Math.round(Math.random() * 1000) % max; };

const Button = ({ id, text, fn }) =>
  <div class='col-sm-6 smallpad'>
    <button id={ id } class='btn btn-primary btn-block' type='button' $onclick={ fn }>{ text }</button>
  </div>

const App = () => {
  const
    array = OArray(),
    selected = Observer.mutable(null),
    run = () => {
      array.splice(0, array.length);
      appendData(1000);
    },
    runLots = () => {
      array.splice(0, array.length);
      appendData(10000)
    },
    add = () => appendData(1000),
    update = () => {
      for(let i = 0, len = array.length; i < len; i += 10)
        array[i].label.set(array[i].label.get() + ' !!!');
    },
    swapRows = () => {
      if (array.length > 998) {
        atomic (() => {
          let tmp = array[1];
          array[1] = array[998];
          array[998] = tmp;
        });
      }
    },
    clear = () => {
      array.splice(0, array.length);
    },
    remove = idx => {
      array.splice(idx, 1);
    },
    select = idx => {
      selected.set(array[idx]);
    };

  function appendData(count) {
    const arr = Array(count);
    for (let i = 0; i < count; i++) {
      let label = Observer.mutable(`${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`);

      const dom =
        <tr class={selected.map(sel => sel === dom ? "danger": "")}>
          <td class='col-md-1' $textContent={ idCounter++ } />
          <td class='col-md-4'><a $clickHandler={1} $textContent={ label } /></td>
          <td class='col-md-1'><a $clickHandler={2}><span class='glyphicon glyphicon-remove' aria-hidden="true" /></a></td>
          <td class='col-md-6'/>
        </tr>;

      dom.label = label;
      arr[i] = dom;
    }

    array.push(...arr);
  }

  return <div class='container'>
    <div class='jumbotron'><div class='row'>
      <div class='col-md-6'><h1>Destam-Dom Keyed</h1></div>
      <div class='col-md-6'><div class='row'>
        <Button id='run' text='Create 1,000 rows' fn={ run } />
        <Button id='runlots' text='Create 10,000 rows' fn={ runLots } />
        <Button id='add' text='Append 1,000 rows' fn={ add } />
        <Button id='update' text='Update every 10th row' fn={ update } />
        <Button id='clear' text='Clear' fn={ clear } />
        <Button id='swaprows' text='Swap Rows' fn={ swapRows } />
      </div></div>
    </div></div>
    <table class='table table-hover table-striped test-data'><tbody $onclick={ev => {
        let handler;
        let e = ev.target;
        while (e.parentElement.tagName !== "TBODY") {
          if (e.clickHandler) handler = e.clickHandler;
          e = e.parentElement;
        }

        if (!handler) return;

        let i = Array.prototype.indexOf.call(e.parentElement.children, e);
        [null, select, remove][handler](i);
    }}>
      {array}
    </tbody></table>
    <span class='preloadicon glyphicon glyphicon-remove' aria-hidden="true" />
  </div>;
}

mount(document.body, App());
