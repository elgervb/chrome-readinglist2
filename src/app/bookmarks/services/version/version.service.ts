import { Injectable } from '@angular/core';
import * as manifest from 'src/manifest.json';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  constructor() { }

  getVersion() {
    return manifest.version;
  }
}
