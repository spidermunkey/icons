export class Bench {
  constructor() {
    this.element = $('.preview-action__window[data-tab="bench"]');
    this.menuElement = $('.bench--toggle-menu');
    this.select = $('.bench--toggle-menu .select');
    this.deselect = $('.bench--toggle-menu .wipe');
    this.export = $('.bench--toggle-menu .export');

    this.modal = new Modal(this.element)
    this.modal.onOpen(() => app.preview.tabs.togglePendingState())
    this.modal.onClose(() => app.preview.tabs.toggleActiveState())
    this.modal.bindToggler($('.tab.bench'))
    this.modal.bindCloser($('.btn.btn-alternate'))

    this.state = 'empty'
    this.bucket = []
    this.selected = {}
  }

  add(icon){
    this.id = icon.id;
    this.props = icon;
    this.bucket.push([id,props]);
    this.select(id);
    this.addSelected(props);
    return this.updateStatus();
  }

  remove(id){
    this.bucket.filter(index => index[0] !== id);
    this.unselect(id);
    this.removeSelected(id);
    this.updateStatus();
  }

  toggle(icon) {
    let status = this.getIconStatus(icon.id);
    if (status) {
      this.remove(icon.id)
    } else {
      this.add(icon)
    }
  }

  bind() {

  }

  find() {

  }

  getIconStatus() {

  }

  addSelectedToBench() {

  }

  highlightSelectedElement() {

  }

  removeSelectedFromBench() {

  }

  removeHighlightFromElement() {

  }

  toggleSelected() {

  }

  selectFromBench() {

  }

  unselectFromBench() {

  }

  toggleSelectAll() {

  }

  selectAllInBench() {

  }

  unselectAllInBench() {

  }

  toggleExportMenu() {

  }

}
function BenchPreview(icons) {
  return icons
          .slice(-8)
          .map((node => `<div class="bp-icon">${node.markup}</div>`))
          .join('')
}


// export const bench = {
//   element: $('.bench'),
//   menu: {
//       element: $('.bench--toggle-menu'),
//       select: $('.bench--toggle-menu .select'),
//       delete: $('.bench--toggle-menu .wipe'),
//       export: $('.bench--toggle-menu .export')
//   },
//   wrapper: new ModalHandler($('.bench--wrapper'), {
//       onClose: function() {
//           app.preview.tabs.toggleActiveState()
//       },
//       onOpen: function() {
//           app.preview.tabs.togglePendingState()
//       },
//       closers: [$('.btn.btn-alternate')],
//       togglers: [$('.btn.toBench')],
//   }).init(),

//   state:'empty',
//   bucket: new Bench(),
//   selected: new Map(),


//   add(icon) {
//       let key = icon.id;
//       let value = icon;
//       let pushSuccessful = this.bucket.push(key,value);
//       if (pushSuccessful) {
//           this.highlightDasboardElement(key)
//           this.addSelectedToBench(value)
//           return this.updateStatus();
//       } else {
//           console.log('err something went wrong adding to your bench')
//       }
//   },
//   remove(id) {
//       let pluckSuccessful = this.bucket.pluck(id);
//       if (pluckSuccessful) {
//           this.removeHighlightFromDashboardElement(id);
//           this.removeSelectedFromBench(id);
//           return this.updateStatus()
//       } else {
//           console.log('err something went wrong with plucking from your bench')
//       }
//   },
//   toggle(icon) {
//       console.log(icon)
//       let status = this.getIconStatus(icon.id);
//       console.log(status)
//       if (status) {
//           this.remove(icon.id)
//       } else if (!status) {
//           this.add(icon)
//       }
//   },
//   _bind(id) {
//       const dashboard = app.dashboard.element;
//       const binding = dashboard.querySelector(`[data-id="${id}"]`)
//       return binding;
//   },
//   _find(id) {
//       return this.element.querySelector(`[data-id="${id}"]`)
//   },


//   getIconStatus(id) {
//       return this.bucket.has(id);
//   },
//   updateStatus() {
//       if (this.bucket.size > 0 && this.state !== 'ready' && this.state !== 'selectAll') {
//           this.state = 'ready'
//           return this.state;
//       }
//       else if (this.bucket.size === 0 && this.state !== 'empty') {
//           this.state = 'empty'
//           return this.state;
//       }
//       return this.state;
//   },


//   addSelectedToBench(icon) {
//       this.element.appendChild(icon.benchPreview)
//   },
//   highlightDasboardElement(id) {
//       let binding = this._bind(id);
//       if (!binding.classList.contains('benched'))
//           binding.classList.add('benched')
//       else
//           console.log('something went wrong finding an element with the id of',id)
//   },

//   removeSelectedFromBench(id) {
//       let element = this._find(id);
//       this.element.removeChild(element)
//   },
//   removeHighlightFromDashboardElement(id) {
//       let binding = this._bind(id)
//       if (binding.classList.contains('benched'))
//           binding.classList.remove('benched')
//       else
//           console.log('cant find dashboard element by the id of',id)
//   },


//   toggleSelected(id,element) {
//       let selected = this.bucket.use(id);
//       let flag = selected.isSelected;
//       if (flag) {
//           selected.isSelected = false;
//           this.selected.delete(id);
//           this.unselectFromBench(element);
//       } else {
//           selected.isSelected = true;
//           this.selected.set(id,selected);
//           this.selectFromBench(element)
//       }
//   },
//   selectFromBench(element) {
//       element.classList.add('selected')
//   },
//   unselectFromBench(element) {
//       element.classList.remove('selected');
//   },
//   deleteSelected() {
//       let selected = Array.from(this.selected.keys())
//       if (selected.length > 0)
//           selected.forEach(id => {
//               this.selected.get(id).isSelected = false;
//               this.selected.delete(id);
//               this.remove(id);
//           })
//   },
//   toggleSelectAll() {
//       if (this.state !== 'empty') {
//           console.log('yo')
//           if (this.state == 'selectAll') {
//               console.log('yo yo')
//               this.state = 'ready'
//               this.unselectAllInBench();
//           } else {
//               console.log('yo yo')
//               this.state = 'selectAll'
//               this.selectAllInBench();
//           }
//       }
//   },
//   selectAllInBench() {
//       console.log('yo yo yo')
//       let targets = Array.from(this.element.children);
//       let group = this.bucket.useValues();
//       group.forEach(value => value.isSelected = true)
//       targets.forEach(child => child.classList.add('selected'))
//       this.selected = new Map(this.bucket.useEntries());
//   },
//   unselectAllInBench() {
//       let targets = Array.from(this.element.children);
//       let group = this.bucket.useValues();
//       group.forEach(value => value.isSelected = false);
//       targets.forEach(child => child.classList.remove('selected'))
//       this.selected = new Map()
//   },


//   toggleExportMenu() {
//       $('.interface').classList.add('passive')
//       $('.interface--menu').classList.add('active')
//       // this.bench.wrapper.style.transform = 'translateY(-250px)'
//   },

//   init() {
//       this.element.addEventListener('click', (e) => {
//           console.log('yo')
//           let el = e.target.closest('.comp--bench')
//           let key;
//           console.log(key,el)
//           if (el)
//               key = Number(el.dataset.id);
//           else 
//               return;
              
//           if (el && key)
//               this.toggleSelected(key,el);
//       })

//       this.menu.select.addEventListener('click',() => {
//           console.log('yoooo')
//           this.toggleSelectAll();
//       })
//       this.menu.delete.addEventListener('click',() => {
//           this.deleteSelected();
//       })
//       this.menu.export.addEventListener('click',() => {
//           this.toggleExportMenu();
//       })
//   }
// }
