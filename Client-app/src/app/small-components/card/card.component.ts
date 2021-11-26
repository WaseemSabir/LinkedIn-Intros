import { SimpleChange } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

// Card Component
@Component({
    selector: 'app-card-component',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
  })
  export class CardComponent implements OnInit {
  
    @Input() data : any;
    @Input() select : boolean = true;
    overlapString : string = ''
    name : string = ''
    @Input() events: Observable<void> = new Observable<void>();
  
    constructor() { }
  
    ngOnInit(): void {
        this.events.subscribe((res : any)=>{
            this.renderView();
        })
        this.renderView();
    }

    renderView()
    {
        let score;
        try{
            score = JSON.parse(this.data.score)
        }
        catch{
            score = this.data.score;
        }
        let edu = score.edu_score;
        let work = score.work_score;
        this.overlapString = ''
        if(Object.keys(work).length)
        {
            this.overlapString += '<br>Work: '
            for(let k of Object.keys(work))
            {
                this.overlapString += k + ` (${work[k]})<br>`
            }
        }
        if(Object.keys(edu).length)
        {
            this.overlapString += '<br>Education: '
            for(let k of Object.keys(edu))
            {
                this.overlapString += k + ` (${edu[k]})<br>`
            }
        }
    }
}