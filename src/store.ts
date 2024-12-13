import { samples } from './services/samples.js';
import { Storage } from './services/storage/storage.js';
import { ProjectItem } from './models/projectItem.js';

export const store: Storage<ProjectItem> = new Storage('minimator-app');

if (store.getNextIndex() === 0) 
{
  samples.forEach(sample => {
    store.createItem(sample.name, sample.data);
  })
}
