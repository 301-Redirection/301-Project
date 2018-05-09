import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { 
    ConfigurationFormat, 
    Condition, 
    Trigger, 
    Operator, 
    Action, 
    LogicalOperator, 
} from '../ConfigurationFormat';
import { ApiConnectService } from '../services/api-connect.service';
import * as globalConfig from '../../../config/config.json';

// Jquery imports
// let $: any;

@Component({
    selector: 'app-bot-config',
    templateUrl: './bot-config.component.html',
    styleUrls: ['./bot-config.component.scss'],
})
export class BotConfigComponent implements OnInit {
    pageTitle = 'Dota 2 Bot Scripting - Configuration';

    // Bot variables
    name: string = 'test';
    description: string = 'test';

    // configuration object
    config: ConfigurationFormat = {
        push: {
            top: {
                compoundConditions: [{
                    conditions: [{
                        trigger: Trigger.Time,
                        operator: Operator.LessThan,
                        conditional: 0,
                        action: Action.Modify,
                        value: 0,
                    }],
                    logicalOperator: [],
                }],
                initialValue: 0,
            },
            mid: {
                compoundConditions: [{
                    conditions: [{
                        trigger: Trigger.Time,
                        operator: Operator.LessThan,
                        conditional: 0,
                        action: Action.Modify,
                        value: 0,
                    }],
                    logicalOperator: [],
                }],
                initialValue: 0, 
            },
            bot: {
                compoundConditions: [{
                    conditions: [{
                        trigger: Trigger.Time,
                        operator: Operator.LessThan,
                        conditional: 0,
                        action: Action.Modify,
                        value: 0,
                    }],
                    logicalOperator: [],
                }],
                initialValue: 0,
            },
        },
        farm: {
            top: {
                compoundConditions: [{
                    conditions: [{
                        trigger: Trigger.Time,
                        operator: Operator.LessThan,
                        conditional: 0,
                        action: Action.Modify,
                        value: 0,
                    }],
                    logicalOperator: [],
                }],
                initialValue: 0,
            },
            mid: {
                compoundConditions: [{
                    conditions: [{
                        trigger: Trigger.Time,
                        operator: Operator.LessThan,
                        conditional: 0,
                        action: Action.Modify,
                        value: 0,
                    }],
                    logicalOperator: [],
                }],
                initialValue: 0,
            },
            bot: {
                compoundConditions: [{
                    conditions: [{
                        trigger: Trigger.Time,
                        operator: Operator.LessThan,
                        conditional: 0,
                        action: Action.Modify,
                        value: 0,
                    }],
                    logicalOperator: [],
                }],
                initialValue: 0,
            },
        },
        defend: {
            top: {
                compoundConditions: [{
                    conditions: [{
                        trigger: Trigger.Time,
                        operator: Operator.LessThan,
                        conditional: 0,
                        action: Action.Modify,
                        value: 0,
                    }],
                    logicalOperator: [],
                }],
                initialValue: 0,
            },
            mid: {
                compoundConditions: [{
                    conditions: [{
                        trigger: Trigger.Time,
                        operator: Operator.LessThan,
                        conditional: 0,
                        action: Action.Modify,
                        value: 0,
                    }],
                    logicalOperator: [],
                }],
                initialValue: 0,
            },
            bot: {
                compoundConditions: [{
                    conditions: [{
                        trigger: Trigger.Time,
                        operator: Operator.LessThan,
                        conditional: 0,
                        action: Action.Modify,
                        value: 0,
                    }],
                    logicalOperator: [],
                }],
                initialValue: 0,
            },
        },
        roam: {
            compoundConditions: [{
                conditions: [{
                    trigger: Trigger.Time,
                    operator: Operator.LessThan,
                    conditional: 0,
                    action: Action.Modify,
                    value: 0,
                }],
                logicalOperator: [],
            }],
            initialValue: 0,
        },
        roshan: {
            compoundConditions: [{
                conditions: [{
                    trigger: Trigger.Time,
                    operator: Operator.LessThan,
                    conditional: 0,
                    action: Action.Modify,
                    value: 0,
                }],                
                logicalOperator: [],
            }],
            initialValue: 0,
        },
    };

    generateURL = '';

    constructor(private title: Title, private api: ApiConnectService) {
        this.title.setTitle(this.pageTitle);
    }

    ngOnInit() { }

    save() {
        if (this.validateInfo()) {
            const requestObject = {
                config: this.config,
                name: this.name,
                description: this.description,
            };                   

            // call generate from api service
            const response = this.api.generate(requestObject).subscribe((data) => {
                this.generateURL = globalConfig['app']['API_URL'] + '/download/' + data.id;
            });
        }
    }

    validateInfo(): boolean {
        if (this.name === '' || this.description === '') {
            alert('Please enter your bot script name and description');
            return false;
        }
        return true;
    }
}
