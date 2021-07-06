import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FruitService {

  constructor(private http: HttpClient) { }

  getVitamins(id): Observable<any> {
   const url = `http://localhost:4200/assets/samples/vits-${id}.json`
   return this.http.get(url);
  }

  getFruits(id): Observable<any> {
    const url = `http://localhost:4200/assets/samples/fruits-${id}.json`
    return this.http.get(url);
  }

  getInitialData(): Observable<any> {
    const url = 'http://localhost:4200/assets/samples/edible.json'
    return this.http.get(url);
  }
}
