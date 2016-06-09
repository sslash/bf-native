export default class ConversationIterator {

    constructor(conversation) {
        this._conversation = conversation;
        this._current = 0;
    }

    next() {
        const current = this._current;
        this._current = this._current + 1;
        return this._conversation[current];
    }

    prev() {
        return this._conversation[this._current - 1];
    }

    peek() {
        return this._conversation[this._current];
    }
}
