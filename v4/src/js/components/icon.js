export function showcase(props) {
    let {name,category,id,cid,markup,rebased} = props;
    let el = document.createElement('div');
    el.classList.add('showcase');
    el.classList.add('svg-wrapper');
    el.dataset.category = category;
    el.dataset.name = name;
    el.dataset.cid = cid;
    el.dataset.id = id;
    el.innerHTML = markup || `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0 10a10 10 0 1 1 20 0 10 10 0 0 1-20 0zm16.32-4.9L5.09 16.31A8 8 0 0 0 16.32 5.09zm-1.41-1.42A8 8 0 0 0 3.68 14.91L14.91 3.68z"></path></svg>`;
    if (rebased) el.dataset.rebased = rebased;
    return el;
};