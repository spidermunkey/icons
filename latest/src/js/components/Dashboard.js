import { Search } from "./Search";
export class Dashboard {
  constructor() {
    this.element = $('#DASHBOARD');
    this.panel = $('.dashboard__modal',this.element);
    this.search = new Search();
  }

  updateHeader(meta) {
  }
  render(elements) {
  }
  async handleClick(event) {
    await modelReady;
    let wrapper = event.target.closest('.svg-wrapper');
    if (!wrapper) return console.log('no click on wrapper');
    let id = wrapper.dataset.id;
    if (!id) return console.error('this element doesnt have an id');
    const ctrlClick = event.ctrlKey,
          rightClick = event.buttons === 2,
          leftClick = event.buttons === 1;
    if (leftClick && ctrlClick) return console.log('adding ',id,' to benched icons');
    else if (rightClick) return  console.log('right click');
    else if (leftClick) {
        preview.update(store.all[id]);
        tracker.logClickedIcon(store.all[id]);
        return;
    }
}
};

function BenchPreview(icons) {
  return icons
          .slice(-8)
          .map((node => `<div class="bp-icon">${node.markup}</div>`))
          .join('')
}
function PinnedPreview(icons) {
  return icons.map(value => `<div class="bp-icon">${value.markup}</div>`).join('')
}
