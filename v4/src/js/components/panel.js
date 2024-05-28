import { showcase } from "./icon"

export function DashboardPanel(list) {
    const wrapper = document.createElement('div')
    wrapper.classList.add('content-wrapper')
    list.forEach(prop => wrapper.appendChild(showcase(prop)))
    return wrapper.innerHTML
};
