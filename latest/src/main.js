import { SvgModel } from './js/store.js'
import { Preview } from './js/components/Preview.js'
import { Search } from './js/components/Search.js'
import { ContextMenu } from './js/components/Context.js'
import { Dashboard } from './js/components/Dashboard.js'
import { Menu } from './js/components/Menu.js'

const
    store = new SvgModel(),
    preview = new Preview(),
    search = new Search(),
    context = new ContextMenu(),
    dashboard = new Dashboard(),
    menu = new Menu(),
    modelReady = store.init();

    $('.btn-favit').onclick = () => addToCollection('favorites');
    $('#DASHBOARD').onmousedown = (e) => handleClick(e);
    $('#DASHBOARD').onkeydown = (e) => handleKeys(e);

async function handleClick(event) {
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
function handleKeys(event) {
    const escape = event.key === 'escape' || event.key === 'Escape';
    const exitSearch = escape && search.state === 'active';
    if (exitSearch) search.close();
}
async function addToCollection( destination, node = preview.icon ) {
    if (destination === 'favorites') 
        node.isFavorite = true;
    node = node.save();
    message = await store.addToCollection({destination,node});
    return message;
}
