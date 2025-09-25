import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {TmBootstrapModule} from "@tommeijer/tm-bootstrap";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TmBootstrapModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
}
