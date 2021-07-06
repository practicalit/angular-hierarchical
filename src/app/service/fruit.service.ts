import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FruitService {

  constructor(private http: HttpClient) { }

  getTheVits(id) {
    return [
      {
          "name":"orange",
          "id": 1,
          "calorie": 250,
          "vit": 1
      },
      {
          "name":"kiwi",
          "id": 2,
          "vit": 1
      },
      {
          "name":"banana",
          "id": 3,
          "calorie": 250,
          "vit": 2
      },
      {
          "name":"mango",
          "id": 4,
          "vit": 2
      }
  ].filter( fruit => fruit.vit == id)
  }

  //getVitamins(): Observable<any> {
  //  const url = 'http://localhost:4200/assets/samples/fruits.json'
  //  return this.http.get(url);
  getVitamins() {
    return [
      {
          "name":"vitb",
          "id": 1,
          "parent": 1
      },
      {
          "name":"vitc",
          "id": 2,
          "parent": 1
      },
      {
          "name":"vitd",
          "id": 3,
          "parent": 1
      },
      {
          "name":"vite",
          "id": 4,
          "parent": 3
      }
  ];
  }

  getFruits(id) {
    return [
      {
          "name":"orange",
          "id": 1,
          "calorie": 250,
          "vit": 1
      },
      {
          "name":"kiwi",
          "id": 2,
          "vit": 1
      },
      {
          "name":"banana",
          "id": 3,
          "calorie": 250,
          "vit": 2
      },
      {
          "name":"mango",
          "id": 4,
          "vit": 2
      }
  ].filter( fruit => fruit.vit == id)
  }

  getInitialData(): Observable<any> {
    const url = 'http://localhost:4200/assets/samples/edible.json'
    return this.http.get(url);
  }
}
