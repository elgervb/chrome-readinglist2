import { Injectable } from '@angular/core';
import packageInfo from '@manifest_json';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  constructor() { }

  getVersion(): string {
    return packageInfo.version;
  }
}
