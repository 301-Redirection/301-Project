import { Component, OnInit } from '@angular/core';
import { SortablejsOptions } from 'angular-sortablejs';
import { ApiConnectService } from '../services/api-connect.service';
import { HeroesService } from '../services/heroes.service';

@Component({
    selector: 'app-heroes',
    templateUrl: './heroes.component.html',
    styleUrls: ['./heroes.component.scss'],
})
export class HeroesComponent implements OnInit {

    // Variables
    numberOfPools: any;
    selectedPool: number;
    selectedPoolArray: any;
    selectedHero: any;    
    selectedHeroesList: any;
    allHeroes = [];

    // hero category objects
    strengthHeroes = [];    
    agilityHeroes = [];    
    intelligenceHeroes = [];    
    heroSearch: String;

    pool1 = [];
    pool2 = [];
    pool3 = [];
    pool4 = [];
    pool5 = [];

    optionsSource: SortablejsOptions = {
        group: {
            name: 'clone-group',
            pull: 'clone',
            put: false,            
        },
        sort: false,        
    };

    optionsTarget: SortablejsOptions = {
        group: 'clone-group',
        sort: false,        
    };

    constructor(private api: ApiConnectService, private heroesService: HeroesService) { }

    ngOnInit() {
        this.numberOfPools = [1, 2, 3, 4, 5];
        this.selectedPool = 1;
        this.selectedPoolArray = this.pool1;
        this.getHeroes();
        this.heroesService.currentHeroes.subscribe((heroes) => {
            this.selectedHeroesList = heroes;            
        });
    }

    getHeroes(): void {
        // database call to retrieve all dota heroes
        this.api.getAllHeroes().subscribe((data) => {
            this.allHeroes = data['heroes'];            
            this.sortHeroData();
        });
    }

    sortHeroData(): void {
        this.allHeroes.forEach((hero) => {
            if (hero.primaryAttribute === 'str') {
                this.strengthHeroes.push(hero);                
            } else if (hero.primaryAttribute === 'agi') {
                this.agilityHeroes.push(hero);                
            } else if (hero.primaryAttribute === 'int') {
                this.intelligenceHeroes.push(hero);                
            }
        });
    }

    moveSelectedHero(hero: any): void {
        this.selectedPoolArray.push(hero);
        document.getElementById(`poolLink${this.selectedPool - 1}`).click();
    }

    setSelectedPool(pool: number): void {
        this.selectedPool = pool;
        switch (pool) {
        case 1:
            this.selectedPoolArray = this.pool1;
            break;
        case 2:
            this.selectedPoolArray = this.pool2;
            break;
        case 3:
            this.selectedPoolArray = this.pool3;
            break;
        case 4:
            this.selectedPoolArray = this.pool4;
            break;
        case 5:
            this.selectedPoolArray = this.pool5;
            break;
        }
    }

    togglePools(): void {
        if (confirm('Are you sure you want to toggle pools? All changes will be lost.')) {
            if (this.numberOfPools.length > 1) {
                this.numberOfPools = [1];
                document.getElementById('poolTabs').style.height = '0';
                document.getElementById('poolTabs').style.visibility = 'hidden';

                this.pool2.forEach((hero) => {
                    this.pool1.push(hero);
                });
                this.pool3.forEach((hero) => {
                    this.pool1.push(hero);
                });
                this.pool4.forEach((hero) => {
                    this.pool1.push(hero);
                });
                this.pool5.forEach((hero) => {
                    this.pool1.push(hero);
                });

                const tempPool = this.pool1;
                this.resetPools();
                this.pool1 = tempPool;
            } else {
                this.numberOfPools = [1, 2, 3, 4, 5];
                document.getElementById('poolTabs').style.height = '42px';
                document.getElementById('poolTabs').style.visibility = 'visible';
                this.resetPools();
            }            
        }
    }    

    addHero(hero: any, pool: number): void {
        this.unhighlightPool(pool);
        if (hero != null) {            
            this.setSelectedPool(pool);
            this.selectedPoolArray.push(hero);            
            document.getElementById(`poolLink${pool - 1}`).click();
            this.selectedHero = null;
            this.setSelectedHeroesList();
        }
    }

    removeHero(hero: any, pool: any): void {
        const index = pool.indexOf(hero);
        if (index !== -1) {
            pool.splice(index, 1);
        }
        document.getElementById(`poolLink${this.selectedPool - 1}`).click();
    }

    setSelectedHeroesList(): void {
        this.selectedHeroesList = [];
        if (this.numberOfPools.length == 1) {
            this.selectedHeroesList = this.pool1;
        } else {
            this.selectedHeroesList.push(this.pool1);
            this.selectedHeroesList.push(this.pool2);
            this.selectedHeroesList.push(this.pool3);
            this.selectedHeroesList.push(this.pool4);
            this.selectedHeroesList.push(this.pool5);
        }
        this.heroesService.setSelectedHeroes(this.selectedHeroesList);
    }

    setSelectedHero(hero: any): void {
        this.selectedHero = hero;
    }

    highlightPool(pool: number): void {
        document.getElementById(`poolLink${pool - 1}`).style.borderColor = '#a3a3a3';
        document.getElementById(`poolPlusIconCont${pool - 1}`).style.visibility = 'visible';
    }

    unhighlightPool(pool: number): void {
        document.getElementById(`poolLink${pool - 1}`).style.borderColor = 'transparent';
        document.getElementById(`poolPlusIconCont${pool - 1}`).style.visibility = 'hidden';
    }

    resetPools(): void {        
        this.pool1 = [];
        this.pool2 = [];
        this.pool3 = [];
        this.pool4 = [];
        this.pool5 = [];
        this.selectedPool = 1;
        this.selectedPoolArray = this.pool1;
        this.setSelectedHeroesList();
    }

    triggerResetPools(): void {
        if (confirm('Are you sure you want to reset?')) {
            this.resetPools();
        }
    }

}
