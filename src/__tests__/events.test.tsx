import MetaForm from "../core/MetaForm";
import EventEmitter from 'eventemitter3';

describe('Test Metaform eventemitter', () => {
    const schema = {fields:[]};
    it('check payload param equality', () => {
        const metaForm = new MetaForm(schema, new EventEmitter());
        metaForm.listener('event1',(payload) => {
            expect(payload).toBe('payload1');
        });
        metaForm.emit('event1','payload1');
    });
    it('check payload param non-equality', () => {
        const metaForm = new MetaForm(schema, new EventEmitter());
        metaForm.listener('event1',(payload) => {
            expect(payload).not.toBe('payload2');
        });
        metaForm.emit('event1','payload1');
    });
    it('check listener to be called', () => {
        const mockFn = jest.fn();
        const metaform = new MetaForm(schema, new EventEmitter());
        metaform.listener('event1', () => {
            mockFn();
        });
        metaform.emit('event1', '');
        expect(mockFn).toBeCalledTimes(1);
    });
    it('check listener to be called thrice', () => {
        const mockFn = jest.fn();
        const metaform = new MetaForm(schema, new EventEmitter());
        metaform.listener('event1', () => {
            mockFn();
        });
        metaform.listener('event1', () => {
            mockFn();
        });
        metaform.listener('event1', () => {
            mockFn();
        });
        metaform.listener('event2', () => {
            mockFn();
        });
        metaform.emit('event1', '');
        expect(mockFn).toBeCalledTimes(3);
    });
    it('check listener not to be called', () => {
        const mockFn = jest.fn();
        const metaform = new MetaForm(schema, new EventEmitter());
        metaform.listener('event1', () => {
            mockFn();
        });
        metaform.removeListener('event1');
        metaform.emit('event1', '');
        expect(mockFn).not.toBeCalled();
    });
});