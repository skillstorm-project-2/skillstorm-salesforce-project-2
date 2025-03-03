import { LightningElement } from 'lwc';

export default class FaqInfo extends LightningElement {
    // Information to populate the faqInfo component is stored in objects
    sections = [
        { 
            id: '1', 
            label: 'General FAQ', 
            subsections: [
                {
                    id: '1.1',
                    label: 'What are the steps to applying?',
                    isList: true,
                    items: [
                        'Prepare',
                        'Apply',
                        'Review',
                        'Decision'
                    ]
                },
                {
                    id: '1.2',
                    label: 'How do I prepare?',
                    isList: false,
                    items: [
                        'When you file a disability claim, you’ll have a chance to provide evidence to support your claim. Evidence could include:',
                        '    1.) VA medical records and hospital records that relate to your claimed condition or that show your rated disability has gotten worse',
                        '    2.) Private medical records and hospital reports that relate to your claimed condition or that show your disability has gotten worse',
                        '    3.) Supporting statements from family, friends, coworkers, clergy, or law enforcement personnel with knowledge about how and when your disability happened or how it got worse',
                        'In some cases, you may need to turn in one or more additional forms to support your disability claim. For example, you’ll need to fill out another form if you’re claiming a dependent or applying for aid and attendance benefits.'
                    ]
                },
                {
                    id: '1.3',
                    label: 'How do I apply?',
                    isList: false,
                    items: [
                        'To get started navigate to the Claims & Appeals tab and apply.',
                        'Types of VA Claims:',
                        '    1.) Disability Compensation',
                        '    2.) Education & Training',
                        '    3.) Healthcare Benifits',
                        '    4.) Housing Assistance',
                        '    5.) Pension',
                    ]
                },
                {
                    id: '1.4',
                    label: 'What is the Review step?',
                    isList: false,
                    items: [
                        'We process applications in the order we receive them. The amount of time it takes to process your claim depends on how many injuries or disabilities you claim and how long it takes us to gather evidence needed to decide your claim.',
                    ]
                },
                {
                    id: '1.5',
                    label: 'What is the Decision?',
                    isList: false,
                    items: [
                        'Once we’ve processed your claim, you’ll get a notice in the mail with our decision.',
                    ]
                }
            ]
        },
        { 
            id: '2', 
            label: 'Accounts FAQ', 
            subsections: [
                {
                    id: '2.1',
                    label: 'How do I edit my profile?',
                    isList: true,
                    items: [
                        'Navigate to the icon in the top right and click on it.',
                        'From there click edit'
                    ]
                },
            ]
        },
        { 
            id: '3', 
            label: 'Claims FAQ', 
            subsections: [
                {
                    id: '3.1',
                    label: 'How do I create a claim?',
                    isList: true,
                    items: [
                        'Navigate to Claims and Appeals on the navigation menu.',
                        'Select New Claim.',
                        'Now fill out the claim form and hit continue.',
                        'Now upload any file related to the claim and hit continue.'
                    ]
                },
                {
                    id: '3.2',
                    label: 'How do I track my claims?',
                    isList: true,
                    items: [
                        'Navigate to Claims and Appeals on the navigation menu.',
                        'Look for the claim you would like to track in the claims table and click on it.',
                        'You will be navigate to the claim tracking menu.'
                    ]
                },
                {
                    id: '3.3',
                    label: 'How do I track my claims?',
                    isList: true,
                    items: [
                        'Navigate to Claims and Appeals on the navigation menu.',
                        'Look for the claim you would like to track in the claims table and click on it.',
                        'You will be navigate to the claim tracking menu.'
                    ]
                }
            ]
        },
        { 
            id: '4', 
            label: 'Appeals FAQ', 
            subsections: [
                {
                    id: '4.1',
                    label: 'How do I create an appeal?',
                    isList: true,
                    items: [
                        'Navigate to Claims and Appeals on the navigation menu.',
                        'Now fill out the appeal form and hit continue.',
                        'Now upload any file related to the claim and hit continue.'
                    ]
                },
                {
                    id: '4.2',
                    label: 'How do I track my appeals?',
                    isList: true,
                    items: [
                        'Navigate to Claims and Appeals on the navigation menu.',
                        'Look for the appeal you would like to track in the appeals table and click on it.',
                        'You will be navigat to the appeal tracking menu.'
                    ]
                }
            ]
        },
    ];
}