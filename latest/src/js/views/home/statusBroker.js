import { API } from "../../api.js";
import {Task} from '../../utils/Task.js';
import { AbstractStore } from "../../components/AbstractStore.js";

// home panels all get events from this one api call
class AppStatusStore extends AbstractStore {
  constructor() {
    super(API.getStatus.bind(API),{name: 'get app status (4 PANEL)'});
  }
  getStatus = async () => {
    await this.getData()
  }
}
export const AppStatus = new AppStatusStore();
