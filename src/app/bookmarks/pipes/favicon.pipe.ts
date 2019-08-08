import { Pipe, PipeTransform } from '@angular/core';
import { ParsedUrl, Bookmark } from '../models';

@Pipe({
  name: 'favicon'
})
export class FaviconPipe implements PipeTransform {

  transform(bookmark?: Bookmark): string {
    if (!bookmark) {
      return null;
    }

    return this.getFavicon(bookmark.url);
  }

  private getFavicon(url: string) {
    const parsed = this.parseUrl(url);
    return `${this.getBaseUrl(parsed)}/favicon.ico`;
  }

  private parseUrl(url: string): ParsedUrl {
    const parser = document.createElement('a');
    parser.href = url;

    return {
      protocol: parser.protocol,       // => "http:"
      hostname: parser.hostname,       // => "example.com"
      port: parseInt(parser.port, 10), // => "3000"
      pathname: parser.pathname,       // => "/pathname/"
      search: parser.search,           // => "?search=test"
      hash: parser.hash,               // => "#hash"
      host: parser.host                // => "example.com:3000"
    };
  }

  private getBaseUrl(parsed: ParsedUrl): string {
    let base = `${parsed.protocol}//${parsed.hostname}`;
    if (parsed.port) {
      base = `${base}:${parsed.port}`;
    }

    return base;
  }

}
