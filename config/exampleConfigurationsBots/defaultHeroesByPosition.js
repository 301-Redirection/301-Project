module.exports = {
    body: {
        configuration: {
            heroPool: {
                partitioned: 'true',
                pool: [
                    [
                        'drow_ranger',
                        'bane',
                        'alchemist',
                    ],
                    [
                        'abaddon',
                        'antimage',
                    ],
                    [
                        'axe',
                        'bloodseeker',
                    ],
                    [
                        'centaur',
                        'chen',
                    ],
                    [
                        'chaos_knight',
                        'crystal_maiden',
                    ],
                ],
            },
            desires: {
                push: {
                    top: {
                        compoundConditions: [
                            {
                                conditions: [
                                    {
                                        trigger: 1,
                                        operator: 1,
                                        conditional: 5,
                                        action: 1,
                                        value: 0.25,
                                    },
                                ],
                                logicalOperator: [],
                            },
                        ],
                        initialValue: 0.25,
                    },
                    mid: {
                        compoundConditions: [
                            {
                                conditions: [
                                    {
                                        trigger: 1,
                                        operator: 1,
                                        conditional: 5,
                                        action: 1,
                                        value: 0.25,
                                    },
                                ],
                                logicalOperator: [],
                            },
                        ],
                        initialValue: 0.25,
                    },
                    bot: {
                        compoundConditions: [
                            {
                                conditions: [
                                    {
                                        trigger: 1,
                                        operator: 1,
                                        conditional: 5,
                                        action: 1,
                                        value: 0.25,
                                    },
                                ],
                                logicalOperator: [],
                            },
                        ],
                        initialValue: 0.25,
                    },
                },
                farm: {
                    top: {
                        compoundConditions: [
                            {
                                conditions: [
                                    {
                                        trigger: 1,
                                        operator: 1,
                                        conditional: 5,
                                        action: 1,
                                        value: 0.25,
                                    },
                                ],
                                logicalOperator: [],
                            },
                        ],
                        initialValue: 0.25,
                    },
                    mid: {
                        compoundConditions: [
                            {
                                conditions: [
                                    {
                                        trigger: 1,
                                        operator: 1,
                                        conditional: 5,
                                        action: 1,
                                        value: 0.25,
                                    },
                                ],
                                logicalOperator: [],
                            },
                        ],
                        initialValue: 0.25,
                    },
                    bot: {
                        compoundConditions: [
                            {
                                conditions: [
                                    {
                                        trigger: 1,
                                        operator: 1,
                                        conditional: 5,
                                        action: 1,
                                        value: 0.25,
                                    },
                                ],
                                logicalOperator: [],
                            },
                        ],
                        initialValue: 0.25,
                    },
                },
                defend: {
                    top: {
                        compoundConditions: [
                            {
                                conditions: [
                                    {
                                        trigger: 1,
                                        operator: 1,
                                        conditional: 5,
                                        action: 1,
                                        value: 0.25,
                                    },
                                ],
                                logicalOperator: [],
                            },
                        ],
                        initialValue: 0.25,
                    },
                    mid: {
                        compoundConditions: [
                            {
                                conditions: [
                                    {
                                        trigger: 1,
                                        operator: 1,
                                        conditional: 5,
                                        action: 1,
                                        value: 0.25,
                                    },
                                ],
                                logicalOperator: [],
                            },
                        ],
                        initialValue: 0.25,
                    },
                    bot: {
                        compoundConditions: [
                            {
                                conditions: [
                                    {
                                        trigger: 1,
                                        operator: 1,
                                        conditional: 5,
                                        action: 1,
                                        value: 0.25,
                                    },
                                ],
                                logicalOperator: [],
                            },
                        ],
                        initialValue: 0.25,
                    },
                },
                roshan: {
                    compoundConditions: [
                        {
                            conditions: [
                                {
                                    trigger: 1,
                                    operator: 1,
                                    conditional: 5,
                                    action: 1,
                                    value: 0.25,
                                },
                            ],
                            logicalOperator: [],
                        },
                    ],
                    initialValue: 0.25,
                },
                roam: {
                    compoundConditions: [
                        {
                            conditions: [
                                {
                                    trigger: 1,
                                    operator: 1,
                                    conditional: 5,
                                    action: 1,
                                    value: 0.25,
                                },
                            ],
                            logicalOperator: [],
                        },
                    ],
                    initialValue: 0.25,
                },
            },
        },
        name: 'test',
        description: 'default object test',
    },
};
