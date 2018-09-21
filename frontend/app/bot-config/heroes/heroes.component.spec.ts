import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { HeroesComponent } from './heroes.component';
import { SortablejsModule } from 'angular-sortablejs';
import { ApiConnectService } from '../../services/api-connect.service';
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../../auth/auth.service';
import { authServiceStub } from '../../testing/auth-service-stub';
import { FilterPipe } from '../../pipes/filter.pipe';
import { BotConfigDataService } from '../../services/bot-config-data.service';
import { HeroItemStubComponent } from '../../testing/hero-item-stub';
import { By } from '@angular/platform-browser';

describe('HeroesComponent', () => {
    let component: HeroesComponent;
    // let heroItemComponent: HeroItemStubComponent;
    let fixture: ComponentFixture<HeroesComponent>;

    beforeEach(async(() => {
        const testResponse = {
            heroes: [
                {
                    id: 1,
                    programName: 'antimage',
                    niceName: 'Anti-Mage',
                    roles: 'Carry - Escape - Nuker',
                    createdAt: '2018-07-19T18:50:42.000Z',
                    updatedAt: '2018-07-19T18:50:42.000Z',
                    heroStats: {
                        id: 1,
                        primaryAttribute: 'agi',
                        ability_q: 'Mana Break',
                        ability_w: 'Blink',
                        ability_e: 'Spell Shield',
                        ability_r: 'Mana Void',
                        moveSpeed: 310,
                        armor: 2.08,
                        attackDamageMin: 29,
                        attackDamageMax: 33,
                        attackRate: null,
                        attackRange: null,
                        baseStrength: 23,
                        baseStrengthGain: 1.3,
                        baseAgility: 22,
                        baseAgilityGain: 2.8,
                        baseIntelligence: 12,
                        baseIntelligenceGain: 1.8,
                        heroId: 1,
                        createdAt: '2018-07-19T18:53:35.000Z',
                        updatedAt: '2018-07-19T18:53:35.000Z',
                    },
                    url: '/static/heroes/images/antimage.png',
                    primaryAttribute: 'agi',
                    ability_q: 'Mana Break',
                    ability_w: 'Blink',
                    ability_e: 'Spell Shield',
                    ability_r: 'Mana Void',
                    moveSpeed: 310,
                    armor: 2.08,
                    attackDamageMin: 29,
                    attackDamageMax: 33,
                    attackRate: null,
                    attackRange: null,
                    baseStrength: 23,
                    baseStrengthGain: 1.3,
                    baseAgility: 22,
                    baseAgilityGain: 2.8,
                    baseIntelligence: 12,
                    baseIntelligenceGain: 1.8,
                    url_q: '/static/abilities/images/antimage_q.png',
                    url_w: '/static/abilities/images/antimage_w.png',
                    url_e: '/static/abilities/images/antimage_e.png',
                    url_r: '/static/abilities/images/antimage_r.png',
                },
            ],
        };

        const apiConnectServiceStub = jasmine.createSpyObj('ApiConnectService', [
            'getAllHeroes',
            'getImageURL',
        ]);

        apiConnectServiceStub.getAllHeroes.and
            .returnValue(Observable.of(testResponse));

        apiConnectServiceStub.getImageURL.and.callThrough();

        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent,
                FilterPipe,
                HeroItemStubComponent,
            ],
            imports: [
                FormsModule,
                SortablejsModule,
            ],
            providers: [
                { provide: AuthService, useValue: authServiceStub },
                { provide: ApiConnectService, useValue: apiConnectServiceStub },
                BotConfigDataService,
            ],
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HeroesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should add hero on double click', () => {
        component.ngOnInit();
        fixture.debugElement.query(By.css('.hero-item'))
            .triggerEventHandler('dblclick', new MouseEvent('dblclick'));
        fixture.detectChanges();
        expect(component.allHeroes[0]).toEqual(component.selectedHeroesList[0]);
    });

    // it('should remove hero', () => {
    //     component.ngOnInit();

    //     // Add hero item
    //     fixture.debugElement.query(By.css('.hero-item'))
    //         .triggerEventHandler('dblclick', new MouseEvent('dblclick'));
    //     fixture.detectChanges();

    //     heroItemComponent = fixture.debugElement
    //         .query(By.directive(HeroItemStubComponent)).componentInstance;
    //     heroItemComponent.ngOnInit();

    //     // Remove hero item
    //     fixture.debugElement.query(By.css('.removable-hero')).nativeElement.click();
    //     // heroItemComponent.removeHero(this.selectedHeroesList[0], 0);
    //     fixture.detectChanges();
    //     console.log(component.selectedHeroesList[0]);
    //     // expect(component.selectedHeroesList).toEqual([]);
    // });

    it('should clear heroes on reset', () => {
        component.ngOnInit();
        fixture.debugElement.query(By.css('.hero-item'))
            .triggerEventHandler('dblclick', new MouseEvent('dblclick'));
        fixture.detectChanges();
        spyOn(window, 'confirm').and.returnValue(true);
        fixture.debugElement.query(By.css('#resetPoolsBtn'))
            .triggerEventHandler('click', new MouseEvent('click'));
        expect(component.selectedHeroesList).toEqual([]);
    });
});
