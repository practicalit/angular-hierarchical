import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VitsService {

  constructor(private http: HttpClient) { }

  async getVits(id) {
    const allVits = await this.getAllVits();
    return allVits.filter( vit => vit.parent == id);
  }

  async getAllVits() {
    //let url = "http://localhost:4200/assets/samples/vits.json";
    //return await this.http.get(url).toPromise();
  }

  async getFruit(id) {
    const allVits = await this.getAllFruit();
    console.log(allVits)
    return allVits.filter( vit => vit.vit == id);
  }

  async getAllFruit() {
    let url = "http://localhost:4200/assets/samples/fruits.json";
    return await this.http.get(url).toPromise();
  }
}
