import { QuestionRow } from 'models/question-row'

export class FAQ {

    public questions: QuestionRow[] = [
        {
            question: 'How do I delete a bill',
            answer: 'To delete a bill you need to press and hold on a bill card, then a delete promt will appear.',
            isOpen: false
        },
        {
            question: 'Can I pay to remove the in app ads',
            answer: 'As of today you can\'t pay to remove ads. But we are looking into adding this feature',
            isOpen: false
        },
        {
            question: 'I\'m from the UK, can I change currency to pounds',
            answer: 'Yes. We have British pound in our currency selection. Go to Settings and select GBP',
            isOpen: false
        }
    ]

    public toggleIsOpen(question: QuestionRow): void {
        question.isOpen = !question.isOpen
    }
}