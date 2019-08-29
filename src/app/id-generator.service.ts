import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdGeneratorService {
  private generatedIds: string[] = [];
  constructor() { }

  getId(): string {
    let id = '';
    do {
      id = '_' + Math.random().toString(36).substr(2, 9);
    } while(this.generatedIds.includes(id));
    this.generatedIds.push(id);

    return id;
  }

  clearIds(): void {
    this.generatedIds = [];
  }
}
